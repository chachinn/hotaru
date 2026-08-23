import { loadCatalog, getCharacterDetail } from '../data/game-data.js';
import { inferBuildProfile } from './build-engine.js';
import { resolveBuildProfile } from './build-profiles.js';
import { enhanceReferenceGuide } from './guide-ui.js';
import { enhanceExplorationGuide } from './exploration-ui.js';
import { enhanceGuideTaxonomy } from './guide-taxonomy.js';
import { enhanceGame8Guide } from './game8-guide-ui.js';
import './guide-item-details.js';

const app=document.getElementById('app');
let queued=false,catalogPromise=null,detailPromise=null,lastName='';
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;run().catch(error=>console.warn('Hotaru deep guide skipped safely:',error))})}
async function getCatalog(){catalogPromise=catalogPromise||loadCatalog().catch(()=>null);return catalogPromise}
async function run(){enhanceExplorationGuide();const name=app?.querySelector('.detail-name')?.textContent?.trim();if(!name)return;const activeSection=app.querySelector('.segmented button.active')?.textContent?.trim().toLowerCase();if(activeSection==='build'&&app.querySelector('main .skeleton'))return;const catalog=await getCatalog();if(!catalog)return;const character=catalog.characters.find(c=>c.name===name);if(!character)return;if(lastName!==name){detailPromise=null;lastName=name}detailPromise=detailPromise||getCharacterDetail(character).catch(()=>null);const detail=await detailPromise;if(!detail)return;const profile=resolveBuildProfile(detail,inferBuildProfile(detail));await enhanceReferenceGuide({app,catalog,detail,character,profile});enhanceGame8Guide({app,catalog,detail,character,profile});enhanceGuideTaxonomy(character).catch(()=>{})}
const observer=new MutationObserver(queue);observer.observe(app,{childList:true});queue();
