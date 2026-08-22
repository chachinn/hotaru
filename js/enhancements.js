import { loadCatalog } from './data/game-data.js';
import { loadRegionMap, enrichCharacterTaxonomy, getAffiliationOptions, getRegionOptions } from './features/taxonomy.js';
import { MAP_BROWSE_URL, MAP_QUICK_MARKERS, buildMapUrl, loadMapState, saveMapState, normalizeMarkerNames, normalizeTarget, remainingTarget, getMapFilterGroups, getMapFilterOptions } from './features/interactive-map.js';

const EXTRA_KEY='hotaru.enhancements.v1';
const app=document.getElementById('app');
let catalog=null,enriched=[],regionMap={},regionMapReady=false,mapState=loadMapState(),mapOpen=false,renderQueued=false,ensureCatalogPromise=null,regionHydrationPromise=null,taxonomyRevision=0;
let extra=loadExtra();

function loadExtra(){try{return{region:'All',affiliation:'All',page:1,mapCategory:'Local Specialties',plannerCategory:'Local Specialties',filtersOpen:false,...JSON.parse(localStorage.getItem(EXTRA_KEY)||'{}')}}catch{return{region:'All',affiliation:'All',page:1,mapCategory:'Local Specialties',plannerCategory:'Local Specialties',filtersOpen:false}}}
function saveExtra(){try{localStorage.setItem(EXTRA_KEY,JSON.stringify(extra))}catch{}}
function esc(value=''){return String(value).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function currentScreenTitle(){return app.querySelector('main h1')?.textContent?.trim()||''}
function queueEnhance(){if(renderQueued)return;renderQueued=true;requestAnimationFrame(()=>{renderQueued=false;enhance().catch(error=>console.warn('Hotaru enhancement skipped safely:',error))})}
function runWhenIdle(callback){if('requestIdleCallback'in window)return window.requestIdleCallback(callback,{timeout:700});return window.setTimeout(callback,90)}

function rebuildEnriched(){enriched=(catalog?.characters||[]).map(c=>enrichCharacterTaxonomy(c,regionMap));taxonomyRevision++}
function scheduleRegionHydration(){
  if(regionMapReady||regionHydrationPromise)return;
  regionHydrationPromise=new Promise(resolve=>runWhenIdle(resolve)).then(()=>loadRegionMap()).then(map=>{
    regionMap=map||{};regionMapReady=true;rebuildEnriched();
    if(currentScreenTitle()==='Characters'){
      injectCharacterFilters();
      if(extra.region!=='All'||extra.affiliation!=='All')renderTaxonomyResults(true);
    }
  }).catch(()=>{regionMapReady=true}).finally(()=>{regionHydrationPromise=null});
}
async function ensureCatalog(){
  if(catalog){scheduleRegionHydration();return catalog}
  if(ensureCatalogPromise)return ensureCatalogPromise;
  ensureCatalogPromise=loadCatalog().then(nextCatalog=>{
    catalog=nextCatalog;rebuildEnriched();scheduleRegionHydration();return catalog;
  }).finally(()=>{ensureCatalogPromise=null});
  return ensureCatalogPromise;
}

function menuMarkup(){
  const sections=[['home','⌂','Home','Overview and shortcuts'],['characters','✦','Characters','Browse and build'],['build','◇','Build Check','Review your stats'],['roster','♙','Roster','Characters and weapons'],['map','⌖','Interactive Map','Materials and farming'],['more','•••','More','Import, backup and settings']];
  return `<div class="hotaru-menu-backdrop" id="hotaru-section-menu"><section class="hotaru-menu-sheet" role="dialog" aria-modal="true" aria-label="Hotaru sections"><div class="hotaru-menu-handle"></div><div class="hotaru-menu-head"><div><div class="eyebrow">Navigate</div><h2>Hotaru sections</h2></div><button class="ghost hotaru-menu-close" data-hotaru-close-menu aria-label="Close menu">×</button></div><div class="hotaru-menu-grid">${sections.map(([id,icon,label,sub])=>`<button class="hotaru-menu-item" ${id==='map'?'data-hotaru-menu-map':'data-tab="'+id+'"'}><span class="hotaru-menu-icon">${icon}</span><span><strong>${label}</strong><small>${sub}</small></span></button>`).join('')}</div></section></div>`;
}
function closeMenu(){document.getElementById('hotaru-section-menu')?.remove();document.body.classList.remove('hotaru-menu-open')}
function openMenu(){if(document.getElementById('hotaru-section-menu'))return;document.body.insertAdjacentHTML('beforeend',menuMarkup());document.body.classList.add('hotaru-menu-open')}
function addSectionMenuNav(){
  const nav=app.querySelector('.bottom-nav');if(!nav)return;
  nav.classList.add('hotaru-nav-compact');
  nav.querySelector('[data-hotaru-map]')?.remove();
  nav.querySelectorAll('[data-tab="roster"],[data-tab="more"]').forEach(x=>x.classList.add('hotaru-overflow-nav'));
  if(!nav.querySelector('[data-hotaru-menu]')){const btn=document.createElement('button');btn.className='nav-btn hotaru-menu-nav';btn.dataset.hotaruMenu='1';btn.setAttribute('aria-label','All sections');btn.innerHTML='<span class="nav-icon" aria-hidden="true">☰</span><span class="nav-label">Menu</span>';nav.appendChild(btn)}
  syncMenuNavActive();
}
function syncMenuNavActive(){const nav=app.querySelector('.bottom-nav');if(!nav)return;const menu=nav.querySelector('[data-hotaru-menu]'),hiddenActive=Boolean(nav.querySelector('[data-tab="roster"].active,[data-tab="more"].active'));menu?.classList.toggle('active',mapOpen||hiddenActive);if(mapOpen)nav.querySelectorAll('.nav-btn:not([data-hotaru-menu])').forEach(x=>x.classList.remove('active'))}

function sanitizeTaxonomyFilters(regionOptions=[],affOptions=[]){
  let changed=false;
  if(regionMapReady&&extra.region!=='All'&&!regionOptions.includes(extra.region)){extra.region='All';changed=true}
  if(extra.affiliation!=='All'&&!affOptions.includes(extra.affiliation)){extra.affiliation='All';changed=true}
  if(!enriched.length&&(extra.region!=='All'||extra.affiliation!=='All')){extra.region='All';extra.affiliation='All';changed=true}
  if(changed){extra.page=1;saveExtra()}
}
function baseFilterValues(){return{q:(document.getElementById('character-search')?.value||'').toLowerCase().trim(),element:document.getElementById('filter-element')?.value||'All',weapon:document.getElementById('filter-weapon')?.value||'All',rarity:(document.getElementById('filter-rarity')?.value||'All').replace('★','')}}
function activeFilterCount(){const f=baseFilterValues();return [f.element,f.weapon,f.rarity,extra.region,extra.affiliation].filter(v=>v&&v!=='All').length}
function ensureFilterToolbar(filters){
  let toolbar=filters.previousElementSibling;
  if(!toolbar?.classList?.contains('hotaru-filter-toolbar')){toolbar=document.createElement('div');toolbar.className='hotaru-filter-toolbar';filters.before(toolbar)}
  const count=activeFilterCount(),signature=`${count}|${extra.filtersOpen?'1':'0'}`;
  if(toolbar.dataset.signature!==signature){toolbar.dataset.signature=signature;toolbar.innerHTML=`<button class="hotaru-filter-toggle ${count?'has-active':''}" data-hotaru-toggle-filters aria-expanded="${extra.filtersOpen?'true':'false'}"><span>☷</span><strong>Filters</strong>${count?`<b>${count}</b>`:''}<i>${extra.filtersOpen?'Hide':'Show'}</i></button><button class="hotaru-filter-reset" data-hotaru-reset-filters ${count?'':'disabled'}>Reset</button>`}
  filters.classList.add('hotaru-filter-grid');filters.classList.toggle('is-open',Boolean(extra.filtersOpen));
}
function syncSelectOptions(select,values,current){
  if(!select)return;
  const signature=values.join('|');
  if(select.dataset.optionsSignature!==signature){select.dataset.optionsSignature=signature;select.innerHTML=`<option>All</option>${values.map(x=>`<option>${esc(x)}</option>`).join('')}`}
  if([...select.options].some(option=>option.value===current))select.value=current;else select.value='All';
}
function injectCharacterFilters(){
  const filters=app.querySelector('main .filters');if(!filters)return;
  const regionOptions=getRegionOptions(enriched),affOptions=getAffiliationOptions(enriched);sanitizeTaxonomyFilters(regionOptions,affOptions);
  if(!filters.querySelector('#filter-region')){
    const region=document.createElement('div');region.className='field hotaru-extra-filter hotaru-region-filter';region.innerHTML='<label>Region</label><select id="filter-region"><option>All</option></select>';
    const affiliation=document.createElement('div');affiliation.className='field hotaru-extra-filter hotaru-affiliation-filter';affiliation.innerHTML='<label>Affiliation</label><select id="filter-affiliation"><option>All</option></select>';
    filters.append(region,affiliation);
  }
  syncSelectOptions(filters.querySelector('#filter-region'),regionOptions,extra.region);
  syncSelectOptions(filters.querySelector('#filter-affiliation'),affOptions,extra.affiliation);
  ensureFilterToolbar(filters);
  if(enriched.length&&(extra.region!=='All'||extra.affiliation!=='All'))renderTaxonomyResults();
}

function filteredTaxonomyCharacters(){const f=baseFilterValues();return enriched.filter(c=>{const hay=`${c.name} ${c.element} ${c.weapon} ${c.region} ${(c.affiliations||[]).join(' ')}`.toLowerCase();if(f.q&&!hay.includes(f.q))return false;if(f.element!=='All'&&c.element!==f.element)return false;if(f.weapon!=='All'&&c.weapon!==f.weapon)return false;if(f.rarity!=='All'&&String(c.rarity)!==String(f.rarity))return false;if(extra.region!=='All'&&c.region!==extra.region)return false;if(extra.affiliation!=='All'&&!(c.affiliations||[]).includes(extra.affiliation))return false;return true}).sort((a,b)=>Number(b.rarity)-Number(a.rarity)||a.name.localeCompare(b.name))}
function cardHtml(c){const tags=[c.region,...(c.affiliations||[]).slice(0,1)].filter(Boolean),image=c.icon?`<img src="${esc(c.icon)}" alt="${esc(c.name)}" loading="lazy" decoding="async" onerror="this.style.display='none';this.parentElement?.classList.add('image-error')" />`:'<div class="fallback">✦</div>';return `<button class="card character-card" data-character="${esc(c.id)}"><div class="character-art">${image}</div><div class="character-info"><div class="character-name">${esc(c.name)}</div><div class="character-meta"><span>${esc(c.element)}</span><span>·</span><span>${esc(c.weapon)}</span><span>·</span><span>${Number(c.rarity)||4}★</span></div>${tags.length?`<div class="hotaru-taxonomy-tags">${tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}</div></button>`}
function renderTaxonomyResults(force=false){
  if(!enriched.length)return false;
  const filters=app.querySelector('main .filters');if(!filters)return false;
  const grid=filters.parentElement?.querySelector('.grid.auto'),pagination=filters.parentElement?.querySelector('.pagination'),head=filters.parentElement?.querySelector('.section-head');if(!grid||!pagination)return false;
  const rows=filteredTaxonomyCharacters(),perPage=24,pages=Math.max(1,Math.ceil(rows.length/perPage)),previousPage=Number(extra.page)||1;extra.page=Math.min(pages,Math.max(1,previousPage));if(extra.page!==previousPage)saveExtra();
  const f=baseFilterValues(),renderKey=[taxonomyRevision,f.q,f.element,f.weapon,f.rarity,extra.region,extra.affiliation,extra.page,rows.length].join('|');
  if(!force&&grid.dataset.hotaruRenderKey===renderKey){ensureFilterToolbar(filters);return true}
  grid.dataset.hotaruRenderKey=renderKey;
  const shown=rows.slice((extra.page-1)*perPage,extra.page*perPage);
  grid.innerHTML=shown.map(cardHtml).join('')||'<div class="card empty hotaru-no-match"><div class="empty-symbol">⌕</div><h3>No matches</h3><p>Clear a filter or try another region or affiliation.</p><button class="secondary" data-hotaru-reset-filters>Clear filters</button></div>';
  pagination.innerHTML=`<button class="secondary" data-hotaru-page="${extra.page-1}" ${extra.page<=1?'disabled':''}>Previous</button><span>${extra.page} / ${pages}</span><button class="secondary" data-hotaru-page="${extra.page+1}" ${extra.page>=pages?'disabled':''}>Next</button>`;
  const count=head?.querySelector('.muted.small');if(count)count.textContent=`${rows.length} matching characters`;ensureFilterToolbar(filters);return true;
}
async function resetAllFilters(){
  extra.region='All';extra.affiliation='All';extra.page=1;saveExtra();
  const steps=[['character-search','', 'input'],['filter-element','All','change'],['filter-weapon','All','change'],['filter-rarity','All','change']];
  for(const [id,value,type] of steps){const el=document.getElementById(id);if(!el||el.value===value)continue;el.value=value;el.dispatchEvent(new Event(type,{bubbles:true}));await new Promise(resolve=>requestAnimationFrame(resolve))}
  queueEnhance();
}

function augmentMaterialRows(){const sections=[...app.querySelectorAll('main .section.card')];for(const section of sections){const title=section.querySelector('h2')?.textContent||'';if(!/materials|farm list/i.test(title))continue;const head=section.querySelector('.section-head');if(head&&!head.querySelector('[data-hotaru-map-all]')){const names=[...section.querySelectorAll('.list-row .row-title')].map(x=>x.textContent.trim()).filter(Boolean).slice(0,20);if(names.length){const b=document.createElement('button');b.className='secondary hotaru-map-materials-btn';b.dataset.hotaruMapAll=names.join('|');b.textContent='Show on Map';head.appendChild(b)}}section.querySelectorAll('.list-row').forEach(row=>{if(row.querySelector('[data-hotaru-material]'))return;const name=row.querySelector('.row-title')?.textContent?.trim();if(!name)return;const b=document.createElement('button');b.className='ghost hotaru-material-pin';b.dataset.hotaruMaterial=name;b.textContent='Map';b.setAttribute('aria-label',`Show ${name} on map`);row.appendChild(b)})}}

function openMap(names=[]){closeMenu();mapOpen=true;mapState.browseAll=false;mapState.browseUrl='';mapState.names=normalizeMarkerNames(names);mapState.lastOpenedAt=new Date().toISOString();saveMapState(mapState);renderMapView()}
function closeMap(){mapOpen=false;document.getElementById('hotaru-map-view')?.remove();app.querySelector('main:not(#hotaru-map-view)')?.classList.remove('hotaru-under-map');syncMenuNavActive()}
function renderTargets(){if(!mapState.targets.length)return '<div class="hotaru-map-empty">No material targets yet. Add one below or send a character material here.</div>';return mapState.targets.map(t=>`<div class="hotaru-target-row ${t.complete?'complete':''}"><div><strong>${esc(t.name)}</strong><span>${t.category?`${esc(t.category)} · `:''}${remainingTarget(t)} remaining · ${Number(t.owned)||0}/${Number(t.needed)||0}</span></div><div class="hotaru-target-actions"><button class="ghost" data-hotaru-show-target="${esc(t.id)}">Map</button><button class="ghost" data-hotaru-complete-target="${esc(t.id)}">${t.complete?'Undo':'Done'}</button><button class="danger" data-hotaru-remove-target="${esc(t.id)}">×</button></div></div>`).join('')}
function mapOptionHtml(options=[],selected=''){return options.map(value=>`<option value="${esc(value)}" ${selected===value?'selected':''}>${esc(value)}</option>`).join('')}
function mapFilterHtml(){const groups=getMapFilterGroups(),category=groups.includes(extra.mapCategory)?extra.mapCategory:'Local Specialties';extra.mapCategory=category;const options=getMapFilterOptions(category),selected=mapState.names.length===1&&options.includes(mapState.names[0])?mapState.names[0]:'';return `<div class="hotaru-map-filter-grid"><label class="field"><span>Category</span><select id="hotaru-map-filter-category">${groups.map(g=>`<option ${g===category?'selected':''}>${esc(g)}</option>`).join('')}</select></label><label class="field"><span>Material / marker</span><select id="hotaru-map-filter-value"><option value="">Choose one</option>${mapOptionHtml(options,selected)}</select></label><button class="primary" data-hotaru-apply-filter>Show</button><button class="secondary" data-hotaru-browse-map>Browse all filters</button></div>`}
function plannerCategory(){const groups=getMapFilterGroups();if(!groups.includes(extra.plannerCategory))extra.plannerCategory=groups.includes(extra.mapCategory)?extra.mapCategory:'Local Specialties';return extra.plannerCategory}
function plannerValues(category=plannerCategory()){if(category==='Artifacts'&&catalog?.artifacts?.length)return [...new Set(catalog.artifacts.map(x=>x?.name).filter(Boolean))].sort((a,b)=>a.localeCompare(b));return getMapFilterOptions(category)}
function plannerMaterialOptions(){const category=plannerCategory(),current=mapState.targets.filter(x=>!x.category||x.category===category).map(x=>x.name).filter(Boolean),known=new Set(plannerValues(category)),sameCategory=current.filter(name=>known.has(name)),all=[...new Set([...plannerValues(category),...sameCategory])].filter(name=>!(category==='Artifacts'&&name==='Artifact')).sort((a,b)=>a.localeCompare(b));return mapOptionHtml(all)}
function targetMapNames(target){if(!target)return[];return target.category==='Artifacts'?['Artifact']:[target.name]}
function plannerCategoryOptions(){const selected=plannerCategory();return getMapFilterGroups().map(group=>`<option ${group===selected?'selected':''}>${esc(group)}</option>`).join('')}
function renderMapView(){
  document.getElementById('hotaru-map-view')?.remove();const original=app.querySelector('main');if(original)original.classList.add('hotaru-under-map');const nav=app.querySelector('.bottom-nav');if(!nav)return;
  const main=document.createElement('main');main.id='hotaru-map-view';main.className='hotaru-map-view';const url=buildMapUrl(mapState.names,{browseAll:mapState.browseAll,browseUrl:mapState.browseUrl}),label=mapState.browseAll?(mapState.browseUrl?'Provider area filters':'All built-in map filters'):mapState.names.length?mapState.names.join(', '):'All map markers';
  main.innerHTML=`<div class="hotaru-map-head"><div><div class="eyebrow">Interactive Map</div><h1>Teyvat Map</h1><p class="muted">Choose a category and material instead of typing names. You can also open the provider's complete filter panel.</p></div><button class="secondary" data-hotaru-close-map>Back</button></div><section class="hotaru-map-toolbar"><div class="hotaru-map-current"><strong>Showing</strong><span>${esc(label)}</span></div><div class="hotaru-map-chips">${MAP_QUICK_MARKERS.map(([title,names])=>`<button class="${!mapState.browseAll&&normalizeMarkerNames(names).join(',')===mapState.names.join(',')?'active':''}" data-hotaru-quick-map="${esc(names)}">${esc(title)}</button>`).join('')}</div>${mapFilterHtml()}</section><section class="hotaru-map-frame-wrap"><div class="hotaru-map-loading">Loading interactive map…</div><iframe class="hotaru-map-frame" title="Genshin Impact interactive map" src="${esc(url)}" loading="lazy" referrerpolicy="no-referrer" allow="fullscreen" sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe></section><section class="section card hotaru-map-completion"><div><div class="eyebrow">Location progress</div><strong>Mark individual pins as found</strong><p>AppSample owns the pins inside the embedded map, so Hotaru cannot safely rewrite a specific pin from outside the iframe. Tap a pin and use AppSample's “Mark as found” when available, or open the full map to sign in and sync completed pins.</p></div><button class="secondary" data-hotaru-open-provider-map>Open full map to mark pins</button></section><section class="section card hotaru-planner"><div class="section-head"><div><div class="eyebrow">Material planner</div><h2>What are you farming?</h2></div><span class="pill gray">Saved locally</span></div><div id="hotaru-target-list">${renderTargets()}</div><div class="hotaru-target-form"><select id="hotaru-target-category" aria-label="Material type">${plannerCategoryOptions()}</select><select id="hotaru-target-name" aria-label="Material or marker"><option value="">Choose item</option>${plannerMaterialOptions()}</select><input id="hotaru-target-needed" type="number" min="0" inputmode="numeric" placeholder="Need" /><input id="hotaru-target-owned" type="number" min="0" inputmode="numeric" placeholder="Own" /><button class="primary" data-hotaru-add-target>Add target</button></div></section><section class="section notice info">The interactive map is embedded with permission from AppSample. Hotaru does not sync HoYoLAB or in-game pins. AppSample supports “Mark as found” and cloud sync when signed in; Hotaru keeps your material-target checklist separately on this device.</section>`;
  nav.before(main);syncMenuNavActive();main.querySelector('.hotaru-map-frame')?.addEventListener('load',()=>main.querySelector('.hotaru-map-loading')?.classList.add('hidden'),{once:true});if(extra.plannerCategory==='Artifacts'&&!catalog)ensureCatalog().then(()=>{if(mapOpen)refreshPlannerOptions()}).catch(()=>{});
}
function rerenderTargetList(){const box=document.getElementById('hotaru-target-list');if(box)box.innerHTML=renderTargets()}
function refreshMapFilterOptions(){const select=document.getElementById('hotaru-map-filter-value');if(!select)return;const options=getMapFilterOptions(extra.mapCategory);select.innerHTML=`<option value="">Choose one</option>${mapOptionHtml(options)}`}
function refreshPlannerOptions(){const select=document.getElementById('hotaru-target-name');if(!select)return;select.innerHTML=`<option value="">Choose item</option>${plannerMaterialOptions()}`}

async function enhance(){
  addSectionMenuNav();
  if(mapOpen){if(!document.getElementById('hotaru-map-view'))renderMapView();syncMenuNavActive();return}
  if(currentScreenTitle()==='Characters'){await ensureCatalog();injectCharacterFilters()}
  augmentMaterialRows();syncMenuNavActive();
}

// Observe only top-level app rerenders. Enhancement-owned descendant mutations must never retrigger enhancement work.
const observer=new MutationObserver(queueEnhance);observer.observe(app,{childList:true});queueEnhance();

document.addEventListener('hotaru:character-search-updated',()=>{
  if(currentScreenTitle()!=='Characters')return;
  extra.page=1;saveExtra();
  if(enriched.length&&(extra.region!=='All'||extra.affiliation!=='All'))renderTaxonomyResults(true);
});
document.addEventListener('change',event=>{
  if(event.target?.id==='filter-region'){extra.region=event.target.value;extra.page=1;saveExtra();renderTaxonomyResults(true)}
  if(event.target?.id==='filter-affiliation'){extra.affiliation=event.target.value;extra.page=1;saveExtra();renderTaxonomyResults(true)}
  if(event.target?.id==='hotaru-map-filter-category'){extra.mapCategory=event.target.value;saveExtra();refreshMapFilterOptions()}
  if(event.target?.id==='hotaru-target-category'){extra.plannerCategory=event.target.value;saveExtra();if(extra.plannerCategory==='Artifacts')ensureCatalog().then(refreshPlannerOptions).catch(refreshPlannerOptions);else refreshPlannerOptions()}
});
document.addEventListener('click',event=>{
  const menuButton=event.target.closest('[data-hotaru-menu]');if(menuButton){event.preventDefault();event.stopPropagation();return document.getElementById('hotaru-section-menu')?closeMenu():openMenu()}
  if(event.target.closest('[data-hotaru-close-menu]')){event.preventDefault();return closeMenu()}
  if(event.target.id==='hotaru-section-menu'){event.preventDefault();return closeMenu()}
  if(event.target.closest('[data-hotaru-menu-map]')){event.preventDefault();event.stopPropagation();return openMap(mapState.names)}
  if(event.target.closest('#hotaru-section-menu [data-tab]')){closeMenu();if(mapOpen)closeMap();return}
  const page=event.target.closest('[data-hotaru-page]');if(page){extra.page=Number(page.dataset.hotaruPage)||1;saveExtra();renderTaxonomyResults(true);scrollTo({top:0,behavior:'instant'});return}
  if(event.target.closest('[data-hotaru-toggle-filters]')){extra.filtersOpen=!extra.filtersOpen;saveExtra();const filters=app.querySelector('main .filters');if(filters)ensureFilterToolbar(filters);return}
  if(event.target.closest('[data-hotaru-reset-filters]')){resetAllFilters();return}
  const one=event.target.closest('[data-hotaru-material]');if(one)return openMap([one.dataset.hotaruMaterial]);
  const all=event.target.closest('[data-hotaru-map-all]');if(all)return openMap(String(all.dataset.hotaruMapAll||'').split('|'));
  if(event.target.closest('[data-hotaru-close-map]'))return closeMap();
  const quick=event.target.closest('[data-hotaru-quick-map]');if(quick){mapState.browseAll=false;mapState.browseUrl='';mapState.names=normalizeMarkerNames(quick.dataset.hotaruQuickMap);saveMapState(mapState);return renderMapView()}
  if(event.target.closest('[data-hotaru-apply-filter]')){const value=document.getElementById('hotaru-map-filter-value')?.value||'';if(!value)return;mapState.browseAll=false;mapState.browseUrl='';mapState.names=normalizeMarkerNames([value]);saveMapState(mapState);return renderMapView()}
  if(event.target.closest('[data-hotaru-browse-map]')){mapState.browseAll=true;mapState.browseUrl='';mapState.names=[];saveMapState(mapState);return renderMapView()}
  if(event.target.closest('[data-hotaru-open-provider-map]')){window.open(MAP_BROWSE_URL,'_blank','noopener,noreferrer');return}
  if(event.target.closest('[data-hotaru-add-target]')){const name=document.getElementById('hotaru-target-name')?.value||'',category=plannerCategory(),needed=document.getElementById('hotaru-target-needed')?.value||0,owned=document.getElementById('hotaru-target-owned')?.value||0;if(!name.trim())return;mapState.targets.push(normalizeTarget({name,category,needed,owned}));mapState.targets=mapState.targets.slice(-100);saveMapState(mapState);rerenderTargetList();return}
  const show=event.target.closest('[data-hotaru-show-target]');if(show){const t=mapState.targets.find(x=>x.id===show.dataset.hotaruShowTarget);if(t){mapState.browseAll=false;mapState.browseUrl='';mapState.names=normalizeMarkerNames(targetMapNames(t));saveMapState(mapState);renderMapView()}return}
  const complete=event.target.closest('[data-hotaru-complete-target]');if(complete){const t=mapState.targets.find(x=>x.id===complete.dataset.hotaruCompleteTarget);if(t){t.complete=!t.complete;saveMapState(mapState);rerenderTargetList()}return}
  const remove=event.target.closest('[data-hotaru-remove-target]');if(remove){mapState.targets=mapState.targets.filter(x=>x.id!==remove.dataset.hotaruRemoveTarget);saveMapState(mapState);rerenderTargetList();return}
  const normalNav=event.target.closest('.nav-btn:not([data-hotaru-menu])');if(normalNav&&mapOpen)closeMap();
},true);
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();if(mapOpen)closeMap()}});
