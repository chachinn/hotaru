import { loadState } from '../core/state.js';
import { loadCatalog } from '../data/game-data.js';
import { normalizeRoster, sortRoster } from './roster-intelligence.js';
import { canonicalTeamCharacter } from '../data/team-profiles/index.js';
import { mountSmartTeamRecommendations, clearSmartTeamRecommendations } from './smart-team-build-recommendations.js';

const app=document.getElementById('app');
let catalogPromise=null,queued=false,pendingRecommendations=false;
function key(value=''){return String(value||'').trim().toLowerCase()}
function getCatalog(){if(!catalogPromise)catalogPromise=loadCatalog().catch(error=>{catalogPromise=null;throw error});return catalogPromise}
function card(){return document.querySelector('.smart-team-card')}
function host(root=card()){return root?.querySelector(':scope > .section')||null}
function locks(root=card()){const mode=root?.querySelector('#team-mode')?.value||'roster',values=[];if(mode==='lock1'||mode==='lock2')values.push(root.querySelector('#team-lock-1')?.value||'');if(mode==='lock2')values.push(root.querySelector('#team-lock-2')?.value||'');return values.filter(Boolean)}
function rosterMap(roster=[]){const map=new Map();for(const entry of roster){for(const value of [entry?.teamName,entry?.name]){const name=canonicalTeamCharacter(value),k=key(name);if(k&&!map.has(k))map.set(k,entry)}}return map}
async function mountRecommendations(){const root=card(),resultHost=host(root);if(!root||!resultHost)return;const mode=root.querySelector('#team-mode')?.value||'roster',selected=locks(root);if(!['lock1','lock2'].includes(mode)||!selected.length){clearSmartTeamRecommendations(root);return}try{const catalog=await getCatalog(),state=loadState(),roster=sortRoster(normalizeRoster(state?.roster||[],catalog?.characters||[]));mountSmartTeamRecommendations({card:root,host:resultHost,lockedNames:selected,roster,weapons:state?.weapons||[],catalogCharacters:catalog?.characters||[]})}catch{}}
function abyssEnhance(){const root=card();if(!root?.querySelector('.abyss-results'))return;const state=loadState(),map=rosterMap(state?.roster||[]);for(const side of root.querySelectorAll('.abyss-side')){if(side.querySelector('.abyss-build-next'))continue;const members=[...side.querySelectorAll('.team-member')].map(node=>{const name=node.querySelector('strong')?.textContent?.trim()||'',entry=map.get(key(canonicalTeamCharacter(name)));if(entry&&node.querySelector('span'))node.querySelector('span').textContent=`Lv ${Number(entry.level||1)}`;return entry?{entry,node,name}:null}).filter(Boolean),gaps=members.filter(item=>Number(item.entry.level||1)<90).sort((a,b)=>Number(a.entry.level||1)-Number(b.entry.level||1)||String(a.name).localeCompare(String(b.name))),next=gaps[0];if(!next)continue;const button=document.createElement('button');button.type='button';button.className='abyss-build-next';button.dataset.hotaruProgression=String(next.entry.id||'');button.innerHTML=`<span><small>Build next for this side</small><strong>${next.name} · Lv ${Number(next.entry.level||1)} → 90</strong></span><b>Materials ›</b>`;side.querySelector('.team-members')?.after(button)}}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;abyssEnhance();if(pendingRecommendations){pendingRecommendations=false;mountRecommendations()}})}
if(app)new MutationObserver(queue).observe(app,{childList:true,subtree:true});
document.addEventListener('click',event=>{if(event.target.closest?.('[data-action="generate-smart-team"]')){pendingRecommendations=true;queue()}},false);
document.addEventListener('change',event=>{if(['team-mode','team-lock-1','team-lock-2'].includes(event.target?.id)){clearSmartTeamRecommendations(card());pendingRecommendations=false}},false);
queue();
