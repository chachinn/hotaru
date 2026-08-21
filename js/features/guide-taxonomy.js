import { loadRegionMap, enrichCharacterTaxonomy } from './taxonomy.js';

function profileGrid(){return document.querySelector('#hotaru-deep-guide .hotaru-profile-grid')}
function fieldByLabel(grid,label){return [...(grid?.children||[])].find(node=>node.querySelector('strong')?.textContent?.trim()===label)}
export async function enhanceGuideTaxonomy(character){
  const grid=profileGrid();if(!grid||!character)return;
  const immediate=enrichCharacterTaxonomy(character,{}),affiliations=immediate.affiliations||[];
  if(affiliations.length&&!fieldByLabel(grid,'Affiliation')){const field=document.createElement('div');field.innerHTML=`<strong>Affiliation</strong><span></span>`;field.querySelector('span').textContent=affiliations.join(' · ');grid.appendChild(field)}
  const regionField=fieldByLabel(grid,'Region');if(!regionField)return;
  const current=regionField.querySelector('span')?.textContent?.trim();if(current&&current!=='—'&&current!=='Other')return;
  try{const map=await loadRegionMap();const enriched=enrichCharacterTaxonomy(character,map||{});if(enriched.region&&enriched.region!=='Other'&&regionField.isConnected)regionField.querySelector('span').textContent=enriched.region}catch{}
}
