import { loadCatalog } from './js/data/game-data.js';
import { loadRegionMap, enrichCharacterTaxonomy, getAffiliationOptions, getRegionOptions } from './js/features/taxonomy.js';
import { MAP_QUICK_MARKERS, buildMapUrl, loadMapState, saveMapState, normalizeMarkerNames, normalizeTarget, remainingTarget } from './js/features/interactive-map.js';

const EXTRA_KEY='hotaru.enhancements.v1';
const app=document.getElementById('app');
let catalog=null,enriched=[],regionMap=null,mapState=loadMapState(),mapOpen=false,renderQueued=false;
let extra=loadExtra();

function loadExtra(){try{return{region:'All',affiliation:'All',page:1,...JSON.parse(localStorage.getItem(EXTRA_KEY)||'{}')}}catch{return{region:'All',affiliation:'All',page:1}}}
function saveExtra(){try{localStorage.setItem(EXTRA_KEY,JSON.stringify(extra))}catch{}}
function esc(value=''){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function currentScreenTitle(){return app.querySelector('main h1')?.textContent?.trim()||''}
function queueEnhance(){if(renderQueued)return;renderQueued=true;requestAnimationFrame(()=>{renderQueued=false;enhance().catch(()=>{})})}

async function ensureCatalog(){
  if(catalog&&regionMap)return;
  [catalog,regionMap]=await Promise.all([loadCatalog(),loadRegionMap()]);
  enriched=(catalog?.characters||[]).map(c=>enrichCharacterTaxonomy(c,regionMap));
}

function addMapNav(){
  const nav=app.querySelector('.bottom-nav');if(!nav||nav.querySelector('[data-hotaru-map]'))return;
  const btn=document.createElement('button');btn.className='nav-btn hotaru-map-nav';btn.dataset.hotaruMap='1';btn.setAttribute('aria-label','Map');btn.innerHTML='<span class="nav-icon" aria-hidden="true">⌖</span><span class="nav-label">Map</span>';nav.appendChild(btn);
}
function setMapNavActive(active){
  const nav=app.querySelector('.bottom-nav');if(!nav)return;
  nav.querySelectorAll('.nav-btn').forEach(x=>x.classList.toggle('active',active?x.hasAttribute('data-hotaru-map'):false));
}

function injectCharacterFilters(){
  const filters=app.querySelector('main .filters');if(!filters||filters.querySelector('#filter-region'))return;
  const regionOptions=getRegionOptions(enriched),affOptions=getAffiliationOptions(enriched);
  const region=document.createElement('div');region.className='field hotaru-extra-filter';region.innerHTML=`<label>Region</label><select id="filter-region"><option>All</option>${regionOptions.map(x=>`<option ${extra.region===x?'selected':''}>${esc(x)}</option>`).join('')}</select>`;
  const affiliation=document.createElement('div');affiliation.className='field hotaru-extra-filter';affiliation.innerHTML=`<label>Affiliation</label><select id="filter-affiliation"><option>All</option>${affOptions.map(x=>`<option ${extra.affiliation===x?'selected':''}>${esc(x)}</option>`).join('')}</select>`;
  filters.append(region,affiliation);
  if(extra.region!=='All'||extra.affiliation!=='All')renderTaxonomyResults();
}

function baseFilterValues(){
  return {
    q:(document.getElementById('character-search')?.value||'').toLowerCase().trim(),
    element:document.getElementById('filter-element')?.value||'All',
    weapon:document.getElementById('filter-weapon')?.value||'All',
    rarity:(document.getElementById('filter-rarity')?.value||'All').replace('★','')
  };
}
function filteredTaxonomyCharacters(){
  const f=baseFilterValues();
  return enriched.filter(c=>{
    const hay=`${c.name} ${c.element} ${c.weapon} ${c.region} ${(c.affiliations||[]).join(' ')}`.toLowerCase();
    if(f.q&&!hay.includes(f.q))return false;
    if(f.element!=='All'&&c.element!==f.element)return false;
    if(f.weapon!=='All'&&c.weapon!==f.weapon)return false;
    if(f.rarity!=='All'&&String(c.rarity)!==String(f.rarity))return false;
    if(extra.region!=='All'&&c.region!==extra.region)return false;
    if(extra.affiliation!=='All'&&!(c.affiliations||[]).includes(extra.affiliation))return false;
    return true;
  }).sort((a,b)=>Number(b.rarity)-Number(a.rarity)||a.name.localeCompare(b.name));
}
function cardHtml(c){
  const tags=[c.region,...(c.affiliations||[]).slice(0,1)].filter(Boolean);
  const image=c.icon?`<img src="${esc(c.icon)}" alt="${esc(c.name)}" loading="lazy" decoding="async" onerror="this.style.display='none'" />`:'<div class="fallback">✦</div>';
  return `<button class="card character-card" data-character="${esc(c.id)}"><div class="character-art">${image}</div><div class="character-info"><div class="character-name">${esc(c.name)}</div><div class="character-meta"><span>${esc(c.element)}</span><span>·</span><span>${esc(c.weapon)}</span><span>·</span><span>${Number(c.rarity)||4}★</span></div>${tags.length?`<div class="hotaru-taxonomy-tags">${tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}</div></button>`;
}
function renderTaxonomyResults(){
  const filters=app.querySelector('main .filters');if(!filters)return;
  const grid=filters.parentElement?.querySelector('.grid.auto'),pagination=filters.parentElement?.querySelector('.pagination'),head=filters.parentElement?.querySelector('.section-head');if(!grid||!pagination)return;
  const rows=filteredTaxonomyCharacters(),perPage=24,pages=Math.max(1,Math.ceil(rows.length/perPage));extra.page=Math.min(pages,Math.max(1,Number(extra.page)||1));saveExtra();
  const shown=rows.slice((extra.page-1)*perPage,extra.page*perPage);
  grid.innerHTML=shown.map(cardHtml).join('')||'<div class="card empty"><div class="empty-symbol">⌕</div><h3>No matches</h3><p>Try another region, affiliation, or filter.</p></div>';
  pagination.innerHTML=`<button class="secondary" data-hotaru-page="${extra.page-1}" ${extra.page<=1?'disabled':''}>Previous</button><span>${extra.page} / ${pages}</span><button class="secondary" data-hotaru-page="${extra.page+1}" ${extra.page>=pages?'disabled':''}>Next</button>`;
  const count=head?.querySelector('.muted.small');if(count)count.textContent=`${rows.length} matching characters`;
}

function augmentMaterialRows(){
  if(currentScreenTitle()==='Characters'){
    const sections=[...app.querySelectorAll('main .section.card')];
    for(const section of sections){
      const title=section.querySelector('h2')?.textContent||'';if(!/materials|farm list/i.test(title))continue;
      const head=section.querySelector('.section-head');
      if(head&&!head.querySelector('[data-hotaru-map-all]')){
        const names=[...section.querySelectorAll('.list-row .row-title')].map(x=>x.textContent.trim()).filter(Boolean).slice(0,20);
        if(names.length){const b=document.createElement('button');b.className='secondary hotaru-map-materials-btn';b.dataset.hotaruMapAll=names.join('|');b.textContent='Show on Map';head.appendChild(b)}
      }
      section.querySelectorAll('.list-row').forEach(row=>{
        if(row.querySelector('[data-hotaru-material]'))return;const name=row.querySelector('.row-title')?.textContent?.trim();if(!name)return;
        const b=document.createElement('button');b.className='ghost hotaru-material-pin';b.dataset.hotaruMaterial=name;b.textContent='Map';b.setAttribute('aria-label',`Show ${name} on map`);row.appendChild(b);
      });
    }
  }
}

function openMap(names=[]){mapOpen=true;mapState.names=normalizeMarkerNames(names);mapState.lastOpenedAt=new Date().toISOString();saveMapState(mapState);renderMapView()}
function closeMap(){mapOpen=false;document.getElementById('hotaru-map-view')?.remove();app.querySelector('main:not(#hotaru-map-view)')?.classList.remove('hotaru-under-map');setMapNavActive(false)}
function renderTargets(){
  if(!mapState.targets.length)return '<div class="hotaru-map-empty">No material targets yet. Add one below or send a character material here.</div>';
  return mapState.targets.map(t=>`<div class="hotaru-target-row ${t.complete?'complete':''}"><div><strong>${esc(t.name)}</strong><span>${remainingTarget(t)} remaining · ${Number(t.owned)||0}/${Number(t.needed)||0}</span></div><div class="hotaru-target-actions"><button class="ghost" data-hotaru-show-target="${esc(t.id)}">Map</button><button class="ghost" data-hotaru-complete-target="${esc(t.id)}">${t.complete?'Undo':'Done'}</button><button class="danger" data-hotaru-remove-target="${esc(t.id)}">×</button></div></div>`).join('');
}
function renderMapView(){
  const old=document.getElementById('hotaru-map-view');if(old)old.remove();
  const original=app.querySelector('main');if(original)original.classList.add('hotaru-under-map');
  const topbar=app.querySelector('.topbar'),nav=app.querySelector('.bottom-nav');if(!topbar||!nav)return;
  const main=document.createElement('main');main.id='hotaru-map-view';main.className='hotaru-map-view';
  const url=buildMapUrl(mapState.names),label=mapState.names.length?mapState.names.join(', '):'All map markers';
  main.innerHTML=`<div class="hotaru-map-head"><div><div class="eyebrow">Interactive Map</div><h1>Teyvat Map</h1><p class="muted">Pan, zoom and find materials. Hotaru keeps your farming targets locally on this device.</p></div><button class="secondary" data-hotaru-close-map>Back</button></div>
    <section class="hotaru-map-toolbar"><div class="hotaru-map-current"><strong>Showing</strong><span>${esc(label)}</span></div><div class="hotaru-map-chips">${MAP_QUICK_MARKERS.map(([title,names])=>`<button class="${normalizeMarkerNames(names).join(',')===mapState.names.join(',')?'active':''}" data-hotaru-quick-map="${esc(names)}">${esc(title)}</button>`).join('')}</div><div class="hotaru-map-search"><input id="hotaru-map-marker-input" type="search" placeholder="Material or marker name, e.g. Sakura Bloom" /><button class="primary" data-hotaru-search-map>Show</button></div></section>
    <section class="hotaru-map-frame-wrap"><div class="hotaru-map-loading">Loading interactive map…</div><iframe class="hotaru-map-frame" title="Genshin Impact interactive map" src="${esc(url)}" loading="lazy" referrerpolicy="no-referrer" allow="fullscreen" sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe></section>
    <section class="section card hotaru-planner"><div class="section-head"><div><div class="eyebrow">Material planner</div><h2>What are you farming?</h2></div><span class="pill gray">Saved locally</span></div><div id="hotaru-target-list">${renderTargets()}</div><div class="hotaru-target-form"><input id="hotaru-target-name" placeholder="Material name" /><input id="hotaru-target-needed" type="number" min="0" inputmode="numeric" placeholder="Need" /><input id="hotaru-target-owned" type="number" min="0" inputmode="numeric" placeholder="Own" /><button class="primary" data-hotaru-add-target>Add target</button></div></section>
    <section class="section notice info">The interactive map is embedded with permission from AppSample. Hotaru does not sync HoYoLAB or in-game pins. Material target completion here is Hotaru-local and does not alter individual pins inside the embedded map.</section>`;
  nav.before(main);setMapNavActive(true);
  main.querySelector('.hotaru-map-frame')?.addEventListener('load',()=>main.querySelector('.hotaru-map-loading')?.classList.add('hidden'),{once:true});
}
function rerenderTargetList(){const box=document.getElementById('hotaru-target-list');if(box)box.innerHTML=renderTargets()}

async function enhance(){
  addMapNav();
  if(mapOpen){renderMapView();return}
  if(currentScreenTitle()==='Characters'){
    await ensureCatalog();injectCharacterFilters();augmentMaterialRows();
    if(extra.region!=='All'||extra.affiliation!=='All')renderTaxonomyResults();
  }
}

const observer=new MutationObserver(queueEnhance);observer.observe(app,{childList:true,subtree:true});queueEnhance();

document.addEventListener('change',event=>{
  if(event.target?.id==='filter-region'){extra.region=event.target.value;extra.page=1;saveExtra();renderTaxonomyResults()}
  if(event.target?.id==='filter-affiliation'){extra.affiliation=event.target.value;extra.page=1;saveExtra();renderTaxonomyResults()}
});
document.addEventListener('click',event=>{
  const mapNav=event.target.closest('[data-hotaru-map]');if(mapNav){event.preventDefault();event.stopPropagation();return openMap(mapState.names)}
  const page=event.target.closest('[data-hotaru-page]');if(page){extra.page=Number(page.dataset.hotaruPage)||1;saveExtra();renderTaxonomyResults();scrollTo({top:0,behavior:'instant'});return}
  const one=event.target.closest('[data-hotaru-material]');if(one)return openMap([one.dataset.hotaruMaterial]);
  const all=event.target.closest('[data-hotaru-map-all]');if(all)return openMap(String(all.dataset.hotaruMapAll||'').split('|'));
  if(event.target.closest('[data-hotaru-close-map]'))return closeMap();
  const quick=event.target.closest('[data-hotaru-quick-map]');if(quick){mapState.names=normalizeMarkerNames(quick.dataset.hotaruQuickMap);saveMapState(mapState);return renderMapView()}
  if(event.target.closest('[data-hotaru-search-map]')){const value=document.getElementById('hotaru-map-marker-input')?.value||'';if(value.trim()){mapState.names=normalizeMarkerNames([value]);saveMapState(mapState);renderMapView()}return}
  if(event.target.closest('[data-hotaru-add-target]')){const name=document.getElementById('hotaru-target-name')?.value||'',needed=document.getElementById('hotaru-target-needed')?.value||0,owned=document.getElementById('hotaru-target-owned')?.value||0;if(!name.trim())return;mapState.targets.push(normalizeTarget({name,needed,owned}));mapState.targets=mapState.targets.slice(-100);saveMapState(mapState);rerenderTargetList();return}
  const show=event.target.closest('[data-hotaru-show-target]');if(show){const t=mapState.targets.find(x=>x.id===show.dataset.hotaruShowTarget);if(t){mapState.names=[t.name];saveMapState(mapState);renderMapView()}return}
  const complete=event.target.closest('[data-hotaru-complete-target]');if(complete){const t=mapState.targets.find(x=>x.id===complete.dataset.hotaruCompleteTarget);if(t){t.complete=!t.complete;saveMapState(mapState);rerenderTargetList()}return}
  const remove=event.target.closest('[data-hotaru-remove-target]');if(remove){mapState.targets=mapState.targets.filter(x=>x.id!==remove.dataset.hotaruRemoveTarget);saveMapState(mapState);rerenderTargetList();return}
  const normalNav=event.target.closest('.nav-btn:not([data-hotaru-map])');if(normalNav&&mapOpen)closeMap();
},true);
