import { loadRegionMap, enrichCharacterTaxonomy } from './taxonomy.js';
import { guideExplorationMarkers, mapOculusForRegion } from '../data/map-registry.js';

function profileGrid(){return document.querySelector('#hotaru-deep-guide .hotaru-profile-grid')}
function fieldByLabel(grid,label){return [...(grid?.children||[])].find(node=>node.querySelector('strong')?.textContent?.trim()===label)}
function syncExploration(region){
  const grid=document.querySelector('#hotaru-deep-guide .hotaru-exploration-grid');if(!grid||!region||region==='Other')return;
  grid.innerHTML='';
  for(const item of guideExplorationMarkers(region)){const button=document.createElement('button');button.className='secondary';button.dataset.hotaruMaterial=item.name;button.textContent=item.label;grid.appendChild(button)}
  const card=grid.closest('.hotaru-reference-card'),old=card?.querySelector('.hotaru-new-region-note');old?.remove();
  if(card&&!mapOculusForRegion(region)&&(region==='Nod-Krai'||region==='Snezhnaya')){const note=document.createElement('p');note.className='muted small hotaru-new-region-note';note.textContent=`Hotaru has no verified nation-to-Oculus mapping for ${region}, so it leaves that shortcut out instead of guessing. Use Map → Region / area for provider-maintained area filters.`;grid.after(note)}
}
export async function enhanceGuideTaxonomy(character){
  const grid=profileGrid();if(!grid||!character)return;
  const immediate=enrichCharacterTaxonomy(character,{}),affiliations=immediate.affiliations||[];
  if(affiliations.length&&!fieldByLabel(grid,'Affiliation')){const field=document.createElement('div');field.innerHTML=`<strong>Affiliation</strong><span></span>`;field.querySelector('span').textContent=affiliations.join(' · ');grid.appendChild(field)}
  const regionField=fieldByLabel(grid,'Region');if(!regionField)return;
  const current=regionField.querySelector('span')?.textContent?.trim();if(current&&current!=='—'&&current!=='Other'){syncExploration(current);return}
  try{const map=await loadRegionMap();const enriched=enrichCharacterTaxonomy(character,map||{});if(enriched.region&&enriched.region!=='Other'&&regionField.isConnected){regionField.querySelector('span').textContent=enriched.region;syncExploration(enriched.region)}}catch{}
}
