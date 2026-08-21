import fs from 'node:fs';

function read(path){return fs.readFileSync(path,'utf8')}
function write(path,text){fs.writeFileSync(path,text)}
function replaceOnce(path,from,to){
  const source=read(path);
  if(!source.includes(from))throw new Error(`Expected snippet not found in ${path}: ${from.slice(0,100)}`);
  const next=source.replace(from,to);
  if(next===source)throw new Error(`No change made in ${path}`);
  write(path,next);
}

// Build Check: expose compatible catalog weapons and make catalog choices evaluable.
replaceOnce('app.js',
  "function n(value,fallback=0){const x=Number(value);return Number.isFinite(x)?x:fallback}\n",
  "function n(value,fallback=0){const x=Number(value);return Number.isFinite(x)?x:fallback}\nfunction cleanGameText(value=''){return String(value||'').replace(/\\\\n/g,'\\n').replace(/<br\\s*\\/?\\s*>/gi,'\\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'\\\"').replace(/&#39;/g,\"'\").replace(/\\n{3,}/g,'\\n\\n').trim()}\nfunction excerptGameText(value='',limit=180){const text=cleanGameText(value);return `${text.slice(0,limit)}${text.length>limit?'…':''}`}\n"
);
replaceOnce('app.js',
  "${esc((s.description||'').slice(0,180))}${(s.description||'').length>180?'…':''}",
  "${esc(excerptGameText(s.description||''))}"
);
replaceOnce('app.js','queueMicrotask(()=>loadDetail(character,false))','queueMicrotask(()=>loadDetail(character,true))');
replaceOnce('app.js',
  "const stats=saved.stats||rosterEntry(character.id)?.stats||{},mains=saved.mainStats||{},context=saved.context||{},ownedWeapons=state.weapons.filter(w=>!w.type||w.type===character.weapon||w.weapon===character.weapon);",
  "const stats=saved.stats||rosterEntry(character.id)?.stats||{},mains=saved.mainStats||{},context=saved.context||{},ownedWeapons=state.weapons.filter(w=>!w.type||w.type===character.weapon||w.weapon===character.weapon),ownedNames=new Set(ownedWeapons.map(w=>w.name)),compatibleWeapons=(catalog?.weapons||[]).filter(w=>!w.weapon||w.weapon===character.weapon),weaponOptions=[...ownedWeapons,...compatibleWeapons].filter((w,index,list)=>w?.name&&list.findIndex(x=>x?.name===w.name)===index).sort((a,b)=>Number(ownedNames.has(b.name))-Number(ownedNames.has(a.name))||Number(b.rarity||0)-Number(a.rarity||0)||a.name.localeCompare(b.name));"
);
replaceOnce('app.js',
  "${ownedWeapons.map(w=>`<option ${saved.weaponName===w.name?'selected':''}>${esc(w.name)}</option>`).join('')}",
  "${weaponOptions.map(w=>`<option value=\"${esc(w.name)}\" ${saved.weaponName===w.name?'selected':''}>${esc(w.name)}${ownedNames.has(w.name)?' · Owned':''}</option>`).join('')}"
);
replaceOnce('app.js',
  "weapon=[...state.weapons,...(buildRuntime.weaponRanks||[])].find(w=>w.name===form.weaponName)||null,artifactSet=catalog.artifacts.find(a=>a.name===form.artifactSet)||null;",
  "weapon=[...state.weapons,...(buildRuntime.weaponRanks||[])].find(w=>w.name===form.weaponName)||catalog?.weapons?.find(w=>w.name===form.weaponName)||null,artifactSet=catalog.artifacts.find(a=>a.name===form.artifactSet)||null;"
);

// Talent text: strip upstream color tags and literal escaped linebreaks everywhere guide text is normalized.
replaceOnce('js/features/guide-engine.js',
  "export function stripMarkup(value=''){return String(value||'').replace(/<br\\s*\\/?\\s*>/gi,'\\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'\\\"').replace(/&#39;/g,\"'\").replace(/\\n{3,}/g,'\\n\\n').trim()}",
  "export function stripMarkup(value=''){return String(value||'').replace(/\\\\n/g,'\\n').replace(/<br\\s*\\/?\\s*>/gi,'\\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'\\\"').replace(/&#39;/g,\"'\").replace(/\\n{3,}/g,'\\n\\n').trim()}"
);

// Rarity repair: correct valid-looking but wrong cached 4★ values when live detail resolves to 5★.
replaceOnce('js/content-enhancements.js',
  "const invalid=!Number.isFinite(previous)||![4,5].includes(previous)||!Number.isFinite(Number(character?.rarity))||![4,5].includes(Number(character?.rarity));\n  nextDetail.rarity=rarity;if(character)character.rarity=rarity;\n  app.querySelectorAll('.detail-head .pill').forEach(pill=>{if(/★/.test(pill.textContent||'')&&(!/^[45]★$/.test((pill.textContent||'').trim())||/nan/i.test(pill.textContent||'')))pill.textContent=`${rarity}★`});",
  "const characterRarity=Number(character?.rarity),invalid=!Number.isFinite(previous)||![4,5].includes(previous)||!Number.isFinite(characterRarity)||![4,5].includes(characterRarity)||previous!==rarity||characterRarity!==rarity;\n  nextDetail.rarity=rarity;if(character)character.rarity=rarity;\n  app.querySelectorAll('.detail-head .pill').forEach(pill=>{if(/★/.test(pill.textContent||'')&&(pill.textContent||'').trim()!==`${rarity}★`)pill.textContent=`${rarity}★`});"
);

// Deep profile: use normalized live rarity and never render the legacy combined Region string.
replaceOnce('js/features/guide-ui.js',
  "import { fallbackItemIcon, fallbackWeaponIcon, fallbackArtifactIcon, fallbackCharacterIcon, materialSourceNames } from './content-media.js';",
  "import { fallbackItemIcon, fallbackWeaponIcon, fallbackArtifactIcon, fallbackCharacterIcon, materialSourceNames, safeCharacterRarity } from './content-media.js';"
);
replaceOnce('js/features/guide-ui.js',
  "const esc=value=>String(value??'').replace(/[&<>'\\\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',\"'\":'&#39;','\\\"':'&quot;'}[c]));\n",
  "const esc=value=>String(value??'').replace(/[&<>'\\\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',\"'\":'&#39;','\\\"':'&quot;'}[c]));\nfunction profileRegion(value=''){const region=String(value||'').trim();if(region==='Snezhnaya / Fatui')return'Snezhnaya';if(region==='Fatui')return'—';return region||'—'}\n"
);
replaceOnce('js/features/guide-ui.js',
  "function profileMarkup(character,detail,profile,ref){const voices=extractVoiceActors(detail),ratings=roleRatings(profile,detail,ref),region=character.region||detail.region||'—';return`<section class=\"section card hotaru-reference-card\"><div class=\"section-head\"><div><div class=\"eyebrow\">Character profile</div><h2>${esc(character.name)}</h2></div><span class=\"pill\">${Number(character.rarity)||4}★</span></div>",
  "function profileMarkup(character,detail,profile,ref){const voices=extractVoiceActors(detail),ratings=roleRatings(profile,detail,ref),region=profileRegion(character.region||detail.region),rarity=safeCharacterRarity(detail?.raw?.rarity??detail?.raw?.rank??detail?.rarity,character?.rarity);return`<section class=\"section card hotaru-reference-card\"><div class=\"section-head\"><div><div class=\"eyebrow\">Character profile</div><h2>${esc(character.name)}</h2></div><span class=\"pill\">${rarity}★</span></div>"
);
replaceOnce('js/features/guide-ui.js',
  "const shrine=region==='Inazuma'?'Inazuma Shrine of Depths':`${region} Shrine of Depths`;",
  "const shrine='Shrine of Depth';"
);

// Map taxonomy: make shrine marker provider-correct and separate Artifact from ore/mining.
replaceOnce('js/features/interactive-map.js',
  "'Exploration':['Teleport Waypoint'",
  "'Exploration':['Shrine of Depth','Teleport Waypoint'"
);
replaceOnce('js/features/interactive-map.js',
  "'Ore & Artifacts':['Ores','White Iron Chunk','Crystal Chunk','Magical Crystal Chunk','Starsilver','Amethyst Lump','Artifact'],",
  "'Artifacts':['Artifact'],\n  'Ore & Mining':['Ores','White Iron Chunk','Crystal Chunk','Magical Crystal Chunk','Starsilver','Amethyst Lump'],"
);

// Map planner: two-level category -> item selector instead of one giant mixed dropdown.
replaceOnce('js/enhancements.js',
  "function loadExtra(){try{return{region:'All',affiliation:'All',page:1,mapCategory:'Local Specialties',filtersOpen:false,...JSON.parse(localStorage.getItem(EXTRA_KEY)||'{}')}}catch{return{region:'All',affiliation:'All',page:1,mapCategory:'Local Specialties',filtersOpen:false}}}",
  "function loadExtra(){try{return{region:'All',affiliation:'All',page:1,mapCategory:'Local Specialties',plannerCategory:'Local Specialties',filtersOpen:false,...JSON.parse(localStorage.getItem(EXTRA_KEY)||'{}')}}catch{return{region:'All',affiliation:'All',page:1,mapCategory:'Local Specialties',plannerCategory:'Local Specialties',filtersOpen:false}}}"
);
replaceOnce('js/enhancements.js',
  "function plannerMaterialOptions(){const current=mapState.targets.map(x=>x.name).filter(Boolean),all=[...new Set([...getMapFilterOptions('All'),...current])].sort((a,b)=>a.localeCompare(b));return mapOptionHtml(all)}",
  "function plannerCategory(){const groups=getMapFilterGroups();if(!groups.includes(extra.plannerCategory))extra.plannerCategory=groups.includes(extra.mapCategory)?extra.mapCategory:'Local Specialties';return extra.plannerCategory}\nfunction plannerMaterialOptions(){const category=plannerCategory(),current=mapState.targets.map(x=>x.name).filter(Boolean),known=new Set(getMapFilterOptions(category)),sameCategory=current.filter(name=>known.has(name)),all=[...new Set([...getMapFilterOptions(category),...sameCategory])].sort((a,b)=>a.localeCompare(b));return mapOptionHtml(all)}\nfunction plannerCategoryOptions(){const selected=plannerCategory();return getMapFilterGroups().map(group=>`<option ${group===selected?'selected':''}>${esc(group)}</option>`).join('')}"
);
replaceOnce('js/enhancements.js',
  "<div class=\"hotaru-target-form\"><select id=\"hotaru-target-name\"><option value=\"\">Choose material</option>${plannerMaterialOptions()}</select>",
  "<div class=\"hotaru-target-form\"><select id=\"hotaru-target-category\" aria-label=\"Material type\">${plannerCategoryOptions()}</select><select id=\"hotaru-target-name\" aria-label=\"Material or marker\"><option value=\"\">Choose item</option>${plannerMaterialOptions()}</select>"
);
replaceOnce('js/enhancements.js',
  "function refreshMapFilterOptions(){const select=document.getElementById('hotaru-map-filter-value');if(!select)return;const options=getMapFilterOptions(extra.mapCategory);select.innerHTML=`<option value=\"\">Choose one</option>${mapOptionHtml(options)}`}",
  "function refreshMapFilterOptions(){const select=document.getElementById('hotaru-map-filter-value');if(!select)return;const options=getMapFilterOptions(extra.mapCategory);select.innerHTML=`<option value=\"\">Choose one</option>${mapOptionHtml(options)}`}\nfunction refreshPlannerOptions(){const select=document.getElementById('hotaru-target-name');if(!select)return;select.innerHTML=`<option value=\"\">Choose item</option>${plannerMaterialOptions()}`}"
);
replaceOnce('js/enhancements.js',
  "if(event.target?.id==='hotaru-map-filter-category'){extra.mapCategory=event.target.value;saveExtra();refreshMapFilterOptions()}",
  "if(event.target?.id==='hotaru-map-filter-category'){extra.mapCategory=event.target.value;saveExtra();refreshMapFilterOptions()}\n  if(event.target?.id==='hotaru-target-category'){extra.plannerCategory=event.target.value;saveExtra();refreshPlannerOptions()}"
);

// Exploration guide: add All and special areas, and use provider-supported generic shrine marker.
write('js/features/exploration-ui.js',`import { MAP_BROWSE_URL, buildMapUrl, loadMapState, saveMapState, normalizeMarkerNames } from './interactive-map.js';

const NATIONS=['Mondstadt','Liyue','Inazuma','Sumeru','Fontaine','Natlan','Nod-Krai','Snezhnaya'];
const SPECIAL_AREAS=['Dragonspine','The Chasm','Enkanomiya','Chenyu Vale','Sea of Bygone Eras'];
const OCULI={Mondstadt:'Anemoculus',Liyue:'Geoculus',Inazuma:'Electroculus',Sumeru:'Dendroculus',Fontaine:'Hydroculus',Natlan:'Pyroculus'};
const SPECIAL_MARKERS={
  Dragonspine:[{label:'Crimson Agate',names:['Crimson Agate'],kind:'Area collectible'}],
  'The Chasm':[{label:'Lumenspar',names:['Lumenspar'],kind:'Area collectible'}],
  Enkanomiya:[{label:'Key Sigils',names:['Key Sigil I','Key Sigil II','Key Sigil III','Key Sigil IV','Key Sigil V'],kind:'Area collectible'}],
  'Chenyu Vale':[],
  'Sea of Bygone Eras':[]
};
const PROVIDER_BROWSE_REGIONS=new Set(['Nod-Krai','Snezhnaya','Chenyu Vale','Sea of Bygone Eras']);
function esc(value=''){return String(value||'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function marker(label,names,kind='Navigation'){return{label,names:Array.isArray(names)?names:[names],kind}}
function markers(region){
  const rows=[];
  if(region==='All')rows.push(marker('Oculi',['Anemoculus','Geoculus','Electroculus','Dendroculus','Hydroculus','Pyroculus'],'Collectibles'));
  else if(OCULI[region])rows.push(marker('Oculi',OCULI[region],'Collectible'));
  else rows.push(...(SPECIAL_MARKERS[region]||[]));
  rows.push(marker('Shrines of Depths','Shrine of Depth','Permanent exploration'),marker('Teleport Waypoints','Teleport Waypoint'),marker('Statues','Statue of The Seven'),marker('Domains','Domain','Farming'),marker('World Quests','World Quests','Quest'));
  if(PROVIDER_BROWSE_REGIONS.has(region))rows.push({label:'Browse area filters',names:[],browse:true,kind:'Provider-maintained'});
  return rows;
}
function apply(names){const view=document.getElementById('hotaru-map-view'),frame=view?.querySelector('.hotaru-map-frame');if(!frame)return;const values=normalizeMarkerNames(names),state=loadMapState();state.names=values;state.browseAll=false;state.lastOpenedAt=new Date().toISOString();saveMapState(state);frame.src=buildMapUrl(values);const label=view.querySelector('.hotaru-map-current span');if(label)label.textContent=values.join(', ')}
function browse(){const view=document.getElementById('hotaru-map-view'),frame=view?.querySelector('.hotaru-map-frame');if(!frame)return;const state=loadMapState();state.names=[];state.browseAll=true;state.lastOpenedAt=new Date().toISOString();saveMapState(state);frame.src=MAP_BROWSE_URL;const label=view.querySelector('.hotaru-map-current span');if(label)label.textContent='Browse all provider filters'}
function optionMarkup(){return`<option>All</option><optgroup label="Nations">${NATIONS.map(x=>`<option>${esc(x)}</option>`).join('')}</optgroup><optgroup label="Special areas">${SPECIAL_AREAS.map(x=>`<option>${esc(x)}</option>`).join('')}</optgroup>`}
function render(region){return`<div class="hotaru-explore-grid">${markers(region).map(item=>`<button class="hotaru-explore-card" ${item.browse?'data-hotaru-explore-browse="1"':`data-hotaru-explore-marker="${esc(item.names.join('|'))}"`}><strong>${esc(item.label)}</strong><span>${esc(item.kind)}</span></button>`).join('')}</div>`}
export function enhanceExplorationGuide(){const view=document.getElementById('hotaru-map-view');if(!view||document.getElementById('hotaru-exploration-guide'))return;const toolbar=view.querySelector('.hotaru-map-toolbar')||view.querySelector('.section');if(!toolbar)return;const section=document.createElement('section');section.id='hotaru-exploration-guide';section.className='section card hotaru-reference-card';section.innerHTML=`<div class="section-head"><div><div class="eyebrow">Exploration guide</div><h2>Region locations</h2></div><label class="field hotaru-explore-region"><span>Region / area</span><select id="hotaru-explore-region">${optionMarkup()}</select></label></div><div id="hotaru-explore-cards">${render('All')}</div><p class="muted small">Choose All, a nation, or a special area such as Dragonspine, The Chasm or Enkanomiya. Hotaru uses marker names supported by the embedded provider; generic layers such as Shrines and waypoints are provider-wide, while verified area collectibles use their dedicated marker filters. Use Browse area filters when a newer area's exact labels are not safely documented.</p>`;toolbar.after(section)}

document.addEventListener('change',event=>{if(event.target?.id!=='hotaru-explore-region')return;const root=document.getElementById('hotaru-explore-cards');if(root)root.innerHTML=render(event.target.value)},false);
document.addEventListener('click',event=>{const browseButton=event.target.closest('[data-hotaru-explore-browse]');if(browseButton){event.preventDefault();browse();return}const button=event.target.closest('[data-hotaru-explore-marker]');if(!button)return;event.preventDefault();apply(String(button.dataset.hotaruExploreMarker||'').split('|'));document.getElementById('hotaru-exploration-guide')?.scrollIntoView({block:'start',behavior:'smooth'})},false);
`);

// PWA refresh: intentional cache bump because installed iPhones may retain the broken UI bundle.
replaceOnce('service-worker.js',"const CACHE = 'hotaru-shell-v10';","const CACHE = 'hotaru-shell-v11';");
replaceOnce('service-worker.js',"'./app.js?v=1.0.0','./js/enhancements.js?v=1.4.0','./js/content-enhancements.js?v=1.1.0'","'./app.js?v=1.1.0','./js/enhancements.js?v=1.5.0','./js/content-enhancements.js?v=1.2.0'");
replaceOnce('index.html','src="app.js?v=1.0.0"','src="app.js?v=1.1.0"');
replaceOnce('index.html','src="js/enhancements.js?v=1.4.0"','src="js/enhancements.js?v=1.5.0"');
replaceOnce('index.html','src="js/content-enhancements.js?v=1.1.0"','src="js/content-enhancements.js?v=1.2.0"');

console.log('Applied Hotaru build/map/rarity/talent fix batch successfully.');
