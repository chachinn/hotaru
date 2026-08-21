import { MAP_BROWSE_URL, buildMapUrl, loadMapState, saveMapState, normalizeMarkerNames } from './interactive-map.js';

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
function esc(value=''){return String(value||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
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
function optionMarkup(){return `<option>All</option><optgroup label="Nations">${NATIONS.map(x=>`<option>${esc(x)}</option>`).join('')}</optgroup><optgroup label="Special areas">${SPECIAL_AREAS.map(x=>`<option>${esc(x)}</option>`).join('')}</optgroup>`}
function render(region){return `<div class="hotaru-explore-grid">${markers(region).map(item=>`<button class="hotaru-explore-card" ${item.browse?'data-hotaru-explore-browse="1"':`data-hotaru-explore-marker="${esc(item.names.join('|'))}"`}><strong>${esc(item.label)}</strong><span>${esc(item.kind)}</span></button>`).join('')}</div>`}
export function enhanceExplorationGuide(){const view=document.getElementById('hotaru-map-view');if(!view||document.getElementById('hotaru-exploration-guide'))return;const toolbar=view.querySelector('.hotaru-map-toolbar')||view.querySelector('.section');if(!toolbar)return;const section=document.createElement('section');section.id='hotaru-exploration-guide';section.className='section card hotaru-reference-card';section.innerHTML=`<div class="section-head"><div><div class="eyebrow">Exploration guide</div><h2>Region locations</h2></div><label class="field hotaru-explore-region"><span>Region / area</span><select id="hotaru-explore-region">${optionMarkup()}</select></label></div><div id="hotaru-explore-cards">${render('All')}</div><p class="muted small">Choose All, a nation, or a special area such as Dragonspine, The Chasm or Enkanomiya. Hotaru uses marker names supported by the embedded provider; generic layers such as Shrines and waypoints are provider-wide, while verified area collectibles use dedicated marker filters. Use Browse area filters when a newer area's exact labels are not safely documented.</p>`;toolbar.after(section)}

document.addEventListener('change',event=>{if(event.target?.id!=='hotaru-explore-region')return;const root=document.getElementById('hotaru-explore-cards');if(root)root.innerHTML=render(event.target.value)},false);
document.addEventListener('click',event=>{const browseButton=event.target.closest('[data-hotaru-explore-browse]');if(browseButton){event.preventDefault();browse();return}const button=event.target.closest('[data-hotaru-explore-marker]');if(!button)return;event.preventDefault();apply(String(button.dataset.hotaruExploreMarker||'').split('|'));document.getElementById('hotaru-exploration-guide')?.scrollIntoView({block:'start',behavior:'smooth'})},false);
