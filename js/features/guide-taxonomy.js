import { loadRegionMap, enrichCharacterTaxonomy } from './taxonomy.js';

const OCULI={Mondstadt:'Anemoculus',Liyue:'Geoculus',Inazuma:'Electroculus',Sumeru:'Dendroculus',Fontaine:'Hydroculus',Natlan:'Pyroculus'};
const PROVIDER_BROWSE_REGIONS=new Set(['Nod-Krai','Snezhnaya']);
function profileGrid(){return document.querySelector('#hotaru-deep-guide .hotaru-profile-grid')}
function fieldByLabel(grid,label){return [...(grid?.children||[])].find(node=>node.querySelector('strong')?.textContent?.trim()===label)}
function shrine(region){return region==='Inazuma'?'Inazuma Shrine of Depths':`${region} Shrine of Depths`}
function syncExploration(region){
  const grid=document.querySelector('#hotaru-deep-guide .hotaru-exploration-grid');if(!grid||!region||region==='Other')return;
  const buttons=[...grid.querySelectorAll('button')];if(buttons.length<2)return;
  const unsafe=PROVIDER_BROWSE_REGIONS.has(region);
  if(unsafe){buttons.slice(0,2).forEach(button=>button.remove());const card=grid.closest('.hotaru-reference-card');if(card&&!card.querySelector('.hotaru-new-region-note')){const note=document.createElement('p');note.className='muted small hotaru-new-region-note';note.textContent=`Latest ${region} Shrine/Oculus marker names are available through Map → Browse all filters. Hotaru does not guess unsupported provider marker names.`;grid.after(note)}return}
  buttons[0].dataset.hotaruMaterial=shrine(region);buttons[0].textContent=shrine(region);
  const oculus=OCULI[region];if(oculus){buttons[1].dataset.hotaruMaterial=oculus;buttons[1].textContent=oculus}else buttons[1].remove();
}
export async function enhanceGuideTaxonomy(character){
  const grid=profileGrid();if(!grid||!character)return;
  const immediate=enrichCharacterTaxonomy(character,{}),affiliations=immediate.affiliations||[];
  if(affiliations.length&&!fieldByLabel(grid,'Affiliation')){const field=document.createElement('div');field.innerHTML=`<strong>Affiliation</strong><span></span>`;field.querySelector('span').textContent=affiliations.join(' · ');grid.appendChild(field)}
  const regionField=fieldByLabel(grid,'Region');if(!regionField)return;
  const current=regionField.querySelector('span')?.textContent?.trim();if(current&&current!=='—'&&current!=='Other'){syncExploration(current);return}
  try{const map=await loadRegionMap();const enriched=enrichCharacterTaxonomy(character,map||{});if(enriched.region&&enriched.region!=='Other'&&regionField.isConnected){regionField.querySelector('span').textContent=enriched.region;syncExploration(enriched.region)}}catch{}
}
