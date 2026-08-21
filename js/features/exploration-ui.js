import { MAP_BROWSE_URL, buildMapUrl, loadMapState, saveMapState, normalizeMarkerNames } from './interactive-map.js';
import { MAP_NATIONS, MAP_SPECIAL_AREAS, MAP_COMMON_MARKERS, MAP_OCULUS_MARKERS, mapOculusForRegion, mapAreaMarkers, mapAreaBrowseUrl } from '../data/map-registry.js';

function esc(value=''){return String(value||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function marker(label,names,kind='Navigation'){return{label,names:Array.isArray(names)?names:[names],kind}}
function markers(region){
  const rows=[];
  if(region==='All')rows.push(marker('Oculi',MAP_OCULUS_MARKERS,'Collectibles'));
  else if(mapOculusForRegion(region))rows.push(marker(mapOculusForRegion(region),mapOculusForRegion(region),'Collectible'));
  else rows.push(...mapAreaMarkers(region));
  rows.push(
    marker('Shrines of Depths',MAP_COMMON_MARKERS.shrine,'Permanent exploration'),
    marker('Teleport Waypoints',MAP_COMMON_MARKERS.waypoint),
    marker('Statues',MAP_COMMON_MARKERS.statue),
    marker('Domains',MAP_COMMON_MARKERS.domain,'Farming'),
    marker('World Quests',MAP_COMMON_MARKERS.quests,'Quest')
  );
  const areaUrl=mapAreaBrowseUrl(region);if(areaUrl)rows.push({label:'Browse this area',names:[],browse:true,browseUrl:areaUrl,kind:'Provider area map'});
  else if(region==='Nod-Krai'||region==='Snezhnaya')rows.push({label:'Browse provider filters',names:[],browse:true,browseUrl:MAP_BROWSE_URL,kind:'Provider-maintained'});
  return rows;
}
function apply(names){const view=document.getElementById('hotaru-map-view'),frame=view?.querySelector('.hotaru-map-frame');if(!frame)return;const values=normalizeMarkerNames(names),state=loadMapState();state.names=values;state.browseAll=false;state.browseUrl='';state.lastOpenedAt=new Date().toISOString();saveMapState(state);frame.src=buildMapUrl(values);const label=view.querySelector('.hotaru-map-current span');if(label)label.textContent=values.join(', ')}
function browse(url=MAP_BROWSE_URL,labelText='Browse all provider filters'){const view=document.getElementById('hotaru-map-view'),frame=view?.querySelector('.hotaru-map-frame');if(!frame)return;const state=loadMapState();state.names=[];state.browseAll=true;state.browseUrl=url;state.lastOpenedAt=new Date().toISOString();saveMapState(state);frame.src=buildMapUrl([],{browseAll:true,browseUrl:url});const label=view.querySelector('.hotaru-map-current span');if(label)label.textContent=labelText}
function optionMarkup(){return `<option>All</option><optgroup label="Nations">${MAP_NATIONS.map(x=>`<option>${esc(x)}</option>`).join('')}</optgroup><optgroup label="Special areas">${MAP_SPECIAL_AREAS.map(x=>`<option>${esc(x)}</option>`).join('')}</optgroup>`}
function render(region){return `<div class="hotaru-explore-grid">${markers(region).map(item=>`<button class="hotaru-explore-card" ${item.browse?`data-hotaru-explore-browse="${esc(item.browseUrl||MAP_BROWSE_URL)}"`:`data-hotaru-explore-marker="${esc(item.names.join('|'))}"`}><strong>${esc(item.label)}</strong><span>${esc(item.kind)}</span></button>`).join('')}</div>`}
export function enhanceExplorationGuide(){const view=document.getElementById('hotaru-map-view');if(!view||document.getElementById('hotaru-exploration-guide'))return;const toolbar=view.querySelector('.hotaru-map-toolbar')||view.querySelector('.section');if(!toolbar)return;const section=document.createElement('section');section.id='hotaru-exploration-guide';section.className='section card hotaru-reference-card';section.innerHTML=`<div class="section-head"><div><div class="eyebrow">Exploration guide</div><h2>Region locations</h2></div><label class="field hotaru-explore-region"><span>Region / area</span><select id="hotaru-explore-region">${optionMarkup()}</select></label></div><div id="hotaru-explore-cards">${render('All')}</div><p class="muted small">Choose All, a nation, or a special area. Hotaru keeps one canonical marker registry shared by the map and character guide, so one enhancement cannot silently replace another marker name. New provider-only area maps open their own filter view instead of using guessed marker labels.</p>`;toolbar.after(section)}

document.addEventListener('change',event=>{if(event.target?.id!=='hotaru-explore-region')return;const root=document.getElementById('hotaru-explore-cards');if(root)root.innerHTML=render(event.target.value)},false);
document.addEventListener('click',event=>{const browseButton=event.target.closest('[data-hotaru-explore-browse]');if(browseButton){event.preventDefault();browse(browseButton.dataset.hotaruExploreBrowse||MAP_BROWSE_URL,browseButton.querySelector('strong')?.textContent||'Browse provider filters');return}const button=event.target.closest('[data-hotaru-explore-marker]');if(!button)return;event.preventDefault();const names=String(button.dataset.hotaruExploreMarker||'').split('|').filter(Boolean);if(names.length)apply(names);else browse();document.getElementById('hotaru-exploration-guide')?.scrollIntoView({block:'start',behavior:'smooth'})},false);
