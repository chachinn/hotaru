import { loadCatalog, getCharacterDetail } from '../data/game-data.js';
import { inferBuildProfile } from './build-engine.js';
import { enhanceReferenceGuide } from './guide-ui.js';

const app=document.getElementById('app');
let queued=false,catalogPromise=null,detailPromise=null,lastName='';
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;run().catch(error=>console.warn('Hotaru deep guide skipped safely:',error))})}
async function getCatalog(){catalogPromise=catalogPromise||loadCatalog().catch(()=>null);return catalogPromise}
async function run(){const name=app?.querySelector('.detail-name')?.textContent?.trim();if(!name)return;const catalog=await getCatalog();if(!catalog)return;const character=catalog.characters.find(c=>c.name===name);if(!character)return;if(lastName!==name){detailPromise=null;lastName=name}detailPromise=detailPromise||getCharacterDetail(character).catch(()=>null);const detail=await detailPromise;if(!detail)return;await enhanceReferenceGuide({app,catalog,detail,character,profile:inferBuildProfile(detail)})}
const observer=new MutationObserver(queue);observer.observe(app,{childList:true});queue();
