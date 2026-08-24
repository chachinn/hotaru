import { loadCatalog, getCharacterDetail } from '../data/game-data.js';
import { inferBuildProfile, statTargetRows } from './build-engine.js';
import { resolveBuildProfile } from './build-profiles.js';
import { enhanceReferenceGuide } from './guide-ui.js';
import { enhanceExplorationGuide } from './exploration-ui.js';
import { enhanceGuideTaxonomy } from './guide-taxonomy.js';
import { enhanceGame8Guide } from './game8-guide-ui.js';
import './guide-item-details.js';

const app=document.getElementById('app');
let queued=false,catalogPromise=null,detailPromise=null,lastName='';
function patchPrimaryStatTargets(profile={}){const heading=[...app.querySelectorAll('h2')].find(node=>node.textContent?.trim()==='General stat targets'),card=heading?.closest('.card'),list=card?.querySelector('.list');if(!list)return;const rows=statTargetRows(profile,{}),signature=JSON.stringify(rows.map(row=>[row.key,row.label,row.value||'',row.target?.min??'',row.target?.good??'',row.target?.great??'',row.target?.unit??'',row.primary]));if(card.dataset.statTargetSignature===signature)return;const fragment=document.createDocumentFragment();for(const row of rows){const item=document.createElement('div'),title=document.createElement('div'),sub=document.createElement('div');item.className='list-row';title.className='row-title';sub.className='row-sub';title.textContent=`${row.label}${row.primary?' · Primary':''}`;sub.textContent=row.value||`Min ${row.target.min}${row.target.unit} · Good ${row.target.good}${row.target.unit} · Great ${row.target.great}${row.target.unit}`;item.append(title,sub);fragment.append(item)}list.replaceChildren(fragment);card.dataset.statTargetSignature=signature;card.dataset.primaryScalingTargets='true'}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;run().catch(error=>console.warn('Hotaru deep guide skipped safely:',error))})}
async function getCatalog(){catalogPromise=catalogPromise||loadCatalog().catch(()=>null);return catalogPromise}
async function run(){enhanceExplorationGuide();const name=app?.querySelector('.detail-name')?.textContent?.trim();if(!name)return;const activeSection=app.querySelector('.segmented button.active')?.textContent?.trim().toLowerCase();if(activeSection==='build'&&app.querySelector('main .skeleton'))return;const catalog=await getCatalog();if(!catalog)return;const character=catalog.characters.find(c=>c.name===name);if(!character)return;if(lastName!==name){detailPromise=null;lastName=name}detailPromise=detailPromise||getCharacterDetail(character).catch(()=>null);const detail=await detailPromise;if(!detail)return;const profile=resolveBuildProfile(detail,inferBuildProfile(detail));patchPrimaryStatTargets(profile);await enhanceReferenceGuide({app,catalog,detail,character,profile});enhanceGame8Guide({app,catalog,detail,character,profile});enhanceGuideTaxonomy(character).catch(()=>{})}
const observer=new MutationObserver(queue);observer.observe(app,{childList:true});queue();
