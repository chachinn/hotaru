import { loadState } from '../core/state.js';
import { loadCatalog, getCharacterDetail } from '../data/game-data.js';
import { reviewedBuildProfile } from '../data/build-profiles/index.js';
import { getMapFilterOptions, buildMapUrl } from './interactive-map.js';
import { fallbackItemIcon } from './content-media.js';
import { buildCharacterProgression } from './progression-calculator.js';

const app=document.getElementById('app');
const modalRoot=document.getElementById('modal-root');
let queued=false;

function esc(value=''){return String(value).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function number(value){return new Intl.NumberFormat().format(Math.max(0,Number(value)||0))}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;injectButtons()})}
function closeCalculator(){modalRoot?.querySelector('.hotaru-progression-backdrop')?.remove();document.body.classList.remove('hotaru-progression-open')}
function injectStyle(){
  if(document.getElementById('hotaru-progression-style'))return;
  const style=document.createElement('style');style.id='hotaru-progression-style';style.textContent=`
  .hotaru-progression-open{overflow:hidden}.hotaru-progression-modal{max-height:92dvh}.hotaru-progression-head{align-items:flex-start}.hotaru-progression-character{display:flex;gap:12px;align-items:center}.hotaru-progression-portrait{width:58px;height:58px;border-radius:16px;object-fit:cover;background:var(--pink-100)}.hotaru-progression-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:12px 0}.hotaru-progression-summary>div{padding:11px;border:1px solid var(--line);border-radius:14px;background:#fff9fb}.hotaru-progression-summary strong,.hotaru-progression-summary span{display:block}.hotaru-progression-summary strong{font-size:17px;color:var(--pink-700)}.hotaru-progression-summary span{font-size:10px;color:var(--muted);margin-top:3px}.hotaru-progression-materials{display:grid;gap:8px}.hotaru-progression-material{display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px;border:1px solid var(--line);border-radius:15px;background:#fff}.hotaru-progression-material img{width:42px;height:42px;object-fit:contain;border-radius:10px;background:var(--pink-50)}.hotaru-progression-count{text-align:right}.hotaru-progression-count strong,.hotaru-progression-count small{display:block}.hotaru-progression-count strong{font-size:14px}.hotaru-progression-count small{margin-top:2px;color:var(--muted);font-size:9px}.hotaru-progression-tasks{display:grid;gap:7px}.hotaru-progression-task{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--line)}.hotaru-progression-task:last-child{border-bottom:0}.hotaru-progression-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.hotaru-progression-actions>*{flex:1 1 170px;text-align:center;text-decoration:none;display:grid;place-items:center}.hotaru-progression-trigger{white-space:nowrap}@media(max-width:600px){.hotaru-progression-summary{grid-template-columns:1fr 1fr}.hotaru-progression-summary>div:last-child{grid-column:1/-1}.hotaru-progression-material{grid-template-columns:38px minmax(0,1fr);}.hotaru-progression-material img{width:38px;height:38px}.hotaru-progression-count{grid-column:2;text-align:left;display:flex;gap:8px;align-items:baseline}.hotaru-progression-modal{padding-left:14px;padding-right:14px}}
  `;document.head.appendChild(style);
}
function injectButtons(){
  injectStyle();
  for(const row of app?.querySelectorAll('.roster-row')||[]){
    if(row.querySelector('[data-hotaru-progression]'))continue;
    const actions=row.querySelector('.section-actions'),id=actions?.querySelector('[data-id]')?.dataset.id;if(!actions||!id)continue;
    const button=document.createElement('button');button.className='ghost hotaru-progression-trigger';button.dataset.hotaruProgression=id;button.textContent='Materials';button.setAttribute('aria-label','Open progression materials calculator');
    const guide=actions.querySelector('[data-character]');if(guide)actions.insertBefore(button,guide);else actions.appendChild(button);
  }
}
function loadingModal(name='Character'){
  modalRoot.innerHTML=`<div class="modal-backdrop hotaru-progression-backdrop"><section class="modal hotaru-progression-modal" role="dialog" aria-modal="true" aria-label="Progression calculator"><div class="modal-head"><div><div class="eyebrow">Roster progression</div><h2>${esc(name)} Materials</h2></div><button class="ghost" data-hotaru-progression-close aria-label="Close">×</button></div><div class="skeleton" style="height:180px"></div><p class="muted small">Calculating from your saved targets and the material data Hotaru can verify…</p></section></div>`;
  document.body.classList.add('hotaru-progression-open');
}
function materialRow(item){
  const icon=fallbackItemIcon(item.name),map=item.mapVerified&&item.mapMarker?`<a class="ghost" href="${esc(buildMapUrl([item.mapMarker]))}" target="_blank" rel="noopener">Map</a>`:'';
  return`<div class="hotaru-progression-material"><img src="${esc(icon)}" alt="" loading="lazy" onerror="this.style.visibility='hidden'" /><div><div class="row-title">${esc(item.name)}</div><div class="row-sub">${esc((item.categories||[]).join(' · ')||'Material')}${item.characters?.length?` · ${esc(item.characters.join(' · '))}`:''}</div>${map}</div><div class="hotaru-progression-count"><strong>${number(item.remaining)} left</strong><small>Need ${number(item.required)} · Own ${number(item.owned)}</small></div></div>`;
}
function taskRow(task){return`<div class="hotaru-progression-task"><div><div class="row-title">${esc(task.kind)}</div><div class="row-sub">${esc(task.progression||'Guaranteed')} progression</div></div><strong>${number(task.current)} → ${number(task.target)}</strong></div>`}
function resultModal({entry,character,result}){
  const inventory=result.inventoryStatus,materials=result.materials||[],tasks=result.tasks||[],mapMarkers=result.mapMarkers||[],exactCount=materials.filter(item=>item.remaining!==null).length;
  const inventoryClass=inventory.kind==='synced'?'good':inventory.kind==='requirements'?'warn':'gray';
  modalRoot.innerHTML=`<div class="modal-backdrop hotaru-progression-backdrop"><section class="modal hotaru-progression-modal" role="dialog" aria-modal="true" aria-label="${esc(character.name)} progression calculator"><div class="modal-head hotaru-progression-head"><div class="hotaru-progression-character">${character.icon?`<img class="hotaru-progression-portrait" src="${esc(character.icon)}" alt="${esc(character.name)}" />`:''}<div><div class="eyebrow">Progression Calculator</div><h2>${esc(character.name)}</h2><p class="muted small" style="margin:4px 0 0">Lv ${number(entry.level)} → ${number(entry.targetLevel)} · Talents ${number(entry.talents?.attack)}/${number(entry.talents?.skill)}/${number(entry.talents?.burst)} → ${number(entry.targetTalents?.attack)}/${number(entry.targetTalents?.skill)}/${number(entry.targetTalents?.burst)}</p></div></div><button class="ghost" data-hotaru-progression-close aria-label="Close">×</button></div><div class="notice ${inventory.kind==='requirements'?'':'good'}"><strong>${esc(inventory.label)}</strong><br>${esc(inventory.detail)}</div><div class="hotaru-progression-summary"><div><strong>${materials.length}</strong><span>Remaining material types</span></div><div><strong>${tasks.length}</strong><span>Open progression goals</span></div><div><strong>${mapMarkers.length}</strong><span>Verified map targets</span></div></div>${result.complete?`<div class="notice good"><strong>Targets fulfilled.</strong><br>Hotaru does not see any remaining exact material requirements for the saved targets on this character.</div>`:`<section class="section"><div class="section-head"><div><div class="eyebrow">After owned inventory</div><h3>Remaining Required Materials</h3></div><span class="pill ${inventoryClass}">${exactCount} exact</span></div>${materials.length?`<div class="hotaru-progression-materials">${materials.map(materialRow).join('')}</div>`:`<div class="notice info">No exact remaining material rows are available for these targets. Some progression goals may still exist where the active data source does not expose exact quantities.</div>`}</section>${tasks.length?`<section class="section"><div class="section-head"><div><div class="eyebrow">Saved targets</div><h3>Progression Details</h3></div></div><div class="hotaru-progression-tasks">${tasks.map(taskRow).join('')}</div></section>`:''}`}<div class="hotaru-progression-actions">${mapMarkers.length?`<a class="secondary" href="${esc(buildMapUrl(mapMarkers))}" target="_blank" rel="noopener">Open verified map locations</a>`:''}<button class="primary" data-hotaru-progression-farm>Open Smart Farming</button></div><p class="muted tiny">Hotaru only shows exact quantities exposed by its active material source. It does not guess missing upgrade amounts or map markers.</p></section></div>`;
}
function errorModal(name,error){
  modalRoot.innerHTML=`<div class="modal-backdrop hotaru-progression-backdrop"><section class="modal hotaru-progression-modal" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="eyebrow">Progression Calculator</div><h2>${esc(name)}</h2></div><button class="ghost" data-hotaru-progression-close>×</button></div><div class="notice"><strong>Calculator could not load.</strong><br>${esc(error?.message||'Character material details are unavailable right now.')}</div></section></div>`;
}
async function openCalculator(id){
  const state=loadState(),entry=state.roster.find(item=>String(item.id)===String(id));if(!entry)return;
  loadingModal(entry.name||'Character');
  try{
    const catalog=await loadCatalog(),character=catalog.characters.find(item=>String(item.id)===String(id));if(!character)throw new Error('This roster character is not available in the current catalog.');
    const detail=await getCharacterDetail(character),reviewed=reviewedBuildProfile(character.name),variant=reviewed?.variants?.find(item=>item.id===entry.buildVariant),profile=variant?.overrides?{...reviewed,...variant.overrides,talentPriority:variant.overrides.talentPriority||reviewed?.talentPriority}:reviewed||{},weapon=state.weapons.find(item=>String(item.id)===String(entry.weaponId))||null;
    const result=buildCharacterProgression({entry:{...entry,name:character.name},detail,profile,weapon,inventory:state.inventory,knownMapNames:getMapFilterOptions('All'),fullAccountImport:state.fullAccountImport});
    resultModal({entry,character,result});
  }catch(error){errorModal(entry.name||'Character',error)}
}
document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-hotaru-progression]');if(trigger){event.preventDefault();openCalculator(trigger.dataset.hotaruProgression);return}
  if(event.target.closest('[data-hotaru-progression-close]')){event.preventDefault();closeCalculator();return}
  if(event.target.closest('[data-hotaru-progression-farm]')){event.preventDefault();closeCalculator();document.querySelector('.smart-farm-card')?.scrollIntoView({behavior:'smooth',block:'start'});return}
  const backdrop=event.target.closest('.hotaru-progression-backdrop');if(backdrop&&event.target===backdrop)closeCalculator();
});

injectStyle();const observer=new MutationObserver(queue);if(app)observer.observe(app,{childList:true});queue();
