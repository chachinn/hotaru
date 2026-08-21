import { loadCatalog, getCharacterDetail } from './data/game-data.js';
import { cacheSet } from './core/cache.js';
import { inferBuildProfile } from './features/build-engine.js';
import { buildMapUrl, getMapFilterOptions, loadMapState, saveMapState, normalizeMarkerNames } from './features/interactive-map.js';
import { safeCharacterRarity, fallbackItemIcon, fallbackCharacterIcon, fallbackWeaponIcon, fallbackArtifactIcon, extractMaterialMedia, materialSourceNames, resolveMaterialSources, rolePresentation, keyName } from './features/content-media.js';

const app=document.getElementById('app');
const CONTEXT_KEY='hotaru.current-farm-context.v1';
let catalog=null,detail=null,detailName='',mediaMap=new Map(),queued=false,workPromise=null;

function esc(value=''){return String(value).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance().catch(error=>console.warn('Hotaru content enhancement skipped safely:',error))})}
function readContext(){try{return JSON.parse(sessionStorage.getItem(CONTEXT_KEY)||'null')}catch{return null}}
function saveContext(value){try{sessionStorage.setItem(CONTEXT_KEY,JSON.stringify(value))}catch{}}
function currentCharacterName(){return app.querySelector('.detail-name')?.textContent?.trim()||''}
function currentCharacter(){const name=currentCharacterName();if(!name||!catalog)return null;const chips=[...app.querySelectorAll('.detail-head .pill')].map(x=>x.textContent.trim());return catalog.characters.find(c=>c.name===name&&(!chips.length||chips.includes(c.element)))||catalog.characters.find(c=>c.name===name)||null}
function numberFromRow(row){const text=row.querySelector('strong')?.textContent||'';const value=Number(String(text).replace(/[^0-9.]/g,''));return Number.isFinite(value)?value:0}
function materialRows(section){return[...section.querySelectorAll('.list-row')].map(row=>({row,name:row.querySelector('.row-title')?.textContent?.trim()||'',count:numberFromRow(row)})).filter(x=>x.name)}
function knownMapNames(){return getMapFilterOptions('All')}

function installImage(container,{src='',fallback='',alt=''}){
  if(!container||container.querySelector(':scope > .hotaru-content-thumb'))return null;
  const image=document.createElement('img');image.className='hotaru-content-thumb';image.alt=alt;image.loading='lazy';image.decoding='async';image.src=src||fallback;if(fallback&&fallback!==image.src)image.dataset.fallback=fallback;
  image.addEventListener('error',()=>{const next=image.dataset.fallback;if(next&&image.src!==next){delete image.dataset.fallback;image.src=next;return}image.hidden=true},{passive:true});
  container.prepend(image);return image;
}
function ensureCharacterPortrait(character){
  const art=app.querySelector('.detail-head .character-art');if(!art||art.querySelector('img:not([hidden])'))return;
  const old=art.querySelector('.fallback');if(old)old.hidden=true;
  installImage(art,{src:character?.icon||'',fallback:fallbackCharacterIcon(character?.slug||character?.name),alt:character?.name||'Character'});
}

async function ensureDetail(){
  const name=currentCharacterName();if(!name)return null;
  if(detail&&detailName===name)return detail;
  if(workPromise)return workPromise;
  workPromise=(async()=>{catalog=catalog||await loadCatalog();const character=currentCharacter();if(!character)return null;const next=await getCharacterDetail(character);detail=next;detailName=name;mediaMap=extractMaterialMedia(next);repairRarity(character,next);return next})().finally(()=>{workPromise=null});
  return workPromise;
}
async function repairRarity(character,nextDetail){
  const previous=Number(nextDetail?.rarity),raw=nextDetail?.raw?.rarity??nextDetail?.raw?.rank??nextDetail?.rarity,rarity=safeCharacterRarity(raw,character?.rarity);
  const invalid=!Number.isFinite(previous)||![4,5].includes(previous)||!Number.isFinite(Number(character?.rarity))||![4,5].includes(Number(character?.rarity));
  nextDetail.rarity=rarity;if(character)character.rarity=rarity;
  app.querySelectorAll('.detail-head .pill').forEach(pill=>{if(/★/.test(pill.textContent||'')&&(!/^[45]★$/.test((pill.textContent||'').trim())||/nan/i.test(pill.textContent||'')))pill.textContent=`${rarity}★`});
  if(invalid&&catalog)await cacheSet('catalog-v3',{savedAt:Date.now(),catalog});
}

function roleCard(nextDetail){
  const head=app.querySelector('.detail-head');if(!head||document.getElementById('hotaru-role-card'))return;
  const role=rolePresentation(inferBuildProfile(nextDetail));const section=document.createElement('section');section.id='hotaru-role-card';section.className='section card hotaru-role-card';
  section.innerHTML=`<div class="hotaru-role-top"><div><div class="eyebrow">Combat role · Hotaru classification</div><h2>${esc(role.role)}</h2></div><span class="pill">${esc(role.group)}</span></div><div class="hotaru-role-facts"><span><b>Focus</b>${esc(role.focus)}</span><span><b>Scaling</b>${esc(role.scaling)}</span><span><b>Confidence</b>${Math.round(role.confidence)}%</span></div><p>${esc(role.reason)}</p><small>Role labels are Hotaru's kit-based guidance, not an official HoYoverse class.</small>`;
  head.after(section);
}

function augmentMaterialArtwork(){
  const sections=[...app.querySelectorAll('main .section.card')];
  for(const section of sections){const title=section.querySelector('h2')?.textContent||'';if(!/materials|farm list|talent estimate/i.test(title))continue;
    for(const {row,name,count} of materialRows(section)){
      const media=mediaMap.get(keyName(name));installImage(row,{src:media?.icon||'',fallback:fallbackItemIcon(media?.id||name),alt:name});
      const mapButton=row.querySelector('[data-hotaru-material]');if(mapButton){const sources=materialSourceNames(name,{count,knownMapNames:knownMapNames()});if(!sources.length){mapButton.hidden=true;mapButton.setAttribute('aria-hidden','true')}else{mapButton.hidden=false;mapButton.dataset.hotaruMaterial=sources[0];mapButton.title=`Show ${sources.join(', ')} on map`}}
    }
    const all=section.querySelector('[data-hotaru-map-all]');if(all){const rows=materialRows(section),sources=resolveMaterialSources(rows,{knownMapNames:knownMapNames()});if(sources.length)all.dataset.hotaruMapAll=sources.join('|')}
  }
}
function findNamedEntry(text,items=[]){const clean=String(text||'').toLowerCase();return [...items].sort((a,b)=>String(b.name||'').length-String(a.name||'').length).find(item=>item?.name&&clean.includes(String(item.name).toLowerCase()))||null}
function augmentBuildArtwork(){
  if(!catalog)return;
  for(const section of app.querySelectorAll('main .section.card')){
    const title=section.querySelector('h2')?.textContent?.trim()||'';
    if(title==='Weapons')for(const row of section.querySelectorAll('.list-row')){const item=findNamedEntry(row.querySelector('.row-title')?.textContent,catalog.weapons);if(item)installImage(row,{src:item.icon||'',fallback:fallbackWeaponIcon(item.slug||item.name),alt:item.name})}
    if(title==='Artifact sets')for(const row of section.querySelectorAll('.list-row')){const item=findNamedEntry(row.querySelector('.row-title')?.textContent,catalog.artifacts);if(item)installImage(row,{src:item.icon||'',fallback:fallbackArtifactIcon(item.name),alt:item.name})}
  }
}
function augmentCharacterCardImages(){if(!catalog)return;for(const card of app.querySelectorAll('.character-card[data-character]')){const art=card.querySelector('.character-art');if(!art||art.querySelector('img:not([hidden])'))continue;const character=catalog.characters.find(c=>String(c.id)===String(card.dataset.character));if(character)installImage(art,{src:character.icon||'',fallback:fallbackCharacterIcon(character.slug||character.name),alt:character.name})}}

function buildFarmContext(button){
  const section=button.closest('.section.card');if(!section)return null;const materials=materialRows(section).map(({name,count})=>{const media=mediaMap.get(keyName(name));return{name,count,icon:media?.icon||fallbackItemIcon(media?.id||name),sources:materialSourceNames(name,{count,knownMapNames:knownMapNames()})}}),sources=resolveMaterialSources(materials,{knownMapNames:knownMapNames()});
  return{character:currentCharacterName(),materials,sources,createdAt:new Date().toISOString()};
}
function primeMapClick(target){
  const all=target.closest('[data-hotaru-map-all]');if(all){const context=buildFarmContext(all);if(context){saveContext(context);if(context.sources.length)all.dataset.hotaruMapAll=context.sources.join('|')}return}
  const one=target.closest('[data-hotaru-material]');if(!one)return;const row=one.closest('.list-row'),name=row?.querySelector('.row-title')?.textContent?.trim()||one.dataset.hotaruMaterial,count=numberFromRow(row),sources=materialSourceNames(name,{count,knownMapNames:knownMapNames()});if(sources.length){saveContext({character:currentCharacterName(),materials:[{name,count,icon:mediaMap.get(keyName(name))?.icon||fallbackItemIcon(name),sources}],sources,createdAt:new Date().toISOString()});one.dataset.hotaruMaterial=sources[0]}}
window.addEventListener('click',event=>{primeMapClick(event.target);setTimeout(queue,0)},true);

function mapContextChips(context){const sources=normalizeMarkerNames(context?.sources||[]);if(!sources.length)return'';return`<div class="hotaru-character-map-sources"><div><strong>${esc(context.character||'Character')} farming sources</strong><small>These map filters come from the character's actual farm list.</small></div><div class="hotaru-source-chip-row"><button class="active" data-hotaru-content-map-sources="${esc(sources.join('|'))}">All sources</button>${sources.map(source=>`<button data-hotaru-content-map-sources="${esc(source)}">${esc(source)}</button>`).join('')}</div></div>`}
function injectMapContext(){
  const view=document.getElementById('hotaru-map-view'),context=readContext();if(!view||!context)return;
  const toolbar=view.querySelector('.hotaru-map-toolbar');if(toolbar&&!toolbar.querySelector('.hotaru-character-map-sources'))toolbar.insertAdjacentHTML('beforeend',mapContextChips(context));
  const mapSelect=view.querySelector('#hotaru-map-filter-value');if(mapSelect&&!mapSelect.querySelector('optgroup[data-hotaru-character-sources]')){const group=document.createElement('optgroup');group.label=`${context.character||'Character'} farm sources`;group.dataset.hotaruCharacterSources='1';for(const source of normalizeMarkerNames(context.sources||[])){const o=document.createElement('option');o.value=source;o.textContent=source;group.appendChild(o)}mapSelect.prepend(group)}
  const planner=view.querySelector('#hotaru-target-name');if(planner&&!planner.querySelector('optgroup[data-hotaru-character-materials]')){const group=document.createElement('optgroup');group.label=`${context.character||'Character'} materials`;group.dataset.hotaruCharacterMaterials='1';for(const material of context.materials||[]){const o=document.createElement('option');o.value=material.name;o.textContent=material.name;group.appendChild(o)}planner.prepend(group)}
}
function applyMapSources(raw){const names=normalizeMarkerNames(String(raw||'').split('|'));if(!names.length)return;const view=document.getElementById('hotaru-map-view'),frame=view?.querySelector('.hotaru-map-frame');if(!frame)return;const state=loadMapState();state.names=names;state.browseAll=false;state.lastOpenedAt=new Date().toISOString();saveMapState(state);const loading=view.querySelector('.hotaru-map-loading');loading?.classList.remove('hidden');frame.src=buildMapUrl(names);frame.addEventListener('load',()=>loading?.classList.add('hidden'),{once:true});const label=view.querySelector('.hotaru-map-current span');if(label)label.textContent=names.join(', ');view.querySelectorAll('[data-hotaru-content-map-sources]').forEach(button=>button.classList.toggle('active',button.dataset.hotaruContentMapSources===raw))}
document.addEventListener('click',event=>{const button=event.target.closest('[data-hotaru-content-map-sources]');if(button){event.preventDefault();applyMapSources(button.dataset.hotaruContentMapSources)}},false);
document.addEventListener('change',event=>{if(event.target?.id==='hotaru-map-filter-category')requestAnimationFrame(injectMapContext)},false);

async function enhanceDetail(){const next=await ensureDetail();if(!next)return;const character=currentCharacter();ensureCharacterPortrait(character);roleCard(next);augmentMaterialArtwork();augmentBuildArtwork()}
async function enhance(){catalog=catalog||await loadCatalog().catch(()=>null);augmentCharacterCardImages();injectMapContext();if(currentCharacterName())await enhanceDetail()}

// Keep the stability fix: only watch top-level app rerenders, never enhancement-owned descendants.
const observer=new MutationObserver(queue);observer.observe(app,{childList:true});queue();
