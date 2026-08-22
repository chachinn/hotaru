import { loadState } from '../core/state.js';
import { loadCatalog } from '../data/game-data.js';
import { normalizeRoster, sortRoster } from './roster-intelligence.js';
import { matchReviewedTeams } from './roster-team-matcher.js';
import { teamMatchesUtility } from '../data/team-utility-tags.js';

const app=document.getElementById('app');
const PAGE_SIZE=12;
const WAIT_MS=6000;
let catalogPromise=null;
let session=null;
let pendingUntil=0;
let scanQueued=false;

function esc(value=''){return String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
function getCatalog(){if(!catalogPromise)catalogPromise=loadCatalog().catch(error=>{catalogPromise=null;throw error});return catalogPromise}
function smartCard(){return document.querySelector('.smart-team-card')}
function resultsHost(card=smartCard()){return card?.querySelector(':scope > .section')||null}
function selectedNeed(card=smartCard()){const select=card?.querySelector('#hotaru-team-utility');return select&&!select.disabled?String(select.value||'any'):'any'}
function sourceLinks(source={}){const links=Array.isArray(source.links)&&source.links.length?source.links:[source];return links.filter(item=>item?.url).map(item=>`<a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.label||source.label||'Source')}</a>`).join(' · ')}
function cardMarkup(team,index){const links=sourceLinks(team.source||{}),sourceType=team.source?.type||team.confidence||'Sourced team';return`<article class="team-card"><div class="team-card-head"><div><div class="eyebrow">${index===0?'Best match':`Alternative ${index+1}`}</div><h3>${esc(team.name)}</h3></div><div class="team-badges"><span class="pill ${team.ownedComplete?'good':'warn'}">Owned ${team.ownedCount}/4</span><span class="pill gray">${esc(team.confidence||'Sourced')}</span></div></div><div class="team-members">${(team.members||[]).map(name=>`<div class="team-member ${(team.missing||[]).includes(name)?'missing':''}"><strong>${esc(name)}</strong><span>${(team.missing||[]).includes(name)?'Not owned':'Owned'}</span></div>`).join('')}</div><p class="team-why">${esc(team.why||'')}</p>${team.notes?`<p class="muted small">${esc(team.notes)}</p>`:''}<div class="team-source"><span>${esc(sourceType)}</span><div>${links}</div></div></article>`}
function filteredResults(){if(!session)return[];const need=selectedNeed();return need==='any'?session.results:session.results.filter(team=>teamMatchesUtility(team.members||[],need))}
function pagerMarkup(shown,total){const remaining=Math.max(0,total-shown),next=Math.min(PAGE_SIZE,remaining);return`<div class="hotaru-team-results-pager" aria-live="polite"><span>Showing <strong>${shown}</strong> of <strong>${total}</strong> matching sourced teams</span>${remaining?`<button type="button" class="secondary" data-hotaru-team-load-more>Load ${next} more</button>`:'<span class="muted small">All matches loaded</span>'}</div>`}
function renderSession(reset=false){
  if(!session?.host?.isConnected)return;
  const results=filteredResults();if(reset)session.shown=Math.min(PAGE_SIZE,results.length);else session.shown=Math.min(session.shown||PAGE_SIZE,results.length);
  if(!results.length){session.host.innerHTML='<div class="notice info"><strong>No sourced teams match this Team Need.</strong><br>Choose a different Team Need or turn on Allow unowned. Hotaru will not invent a team just to fill the filter.</div>';return}
  session.host.innerHTML=`<div class="team-results">${results.slice(0,session.shown).map(cardMarkup).join('')}</div>${pagerMarkup(session.shown,results.length)}`;
}
function appendNext(button){
  if(!session?.host?.isConnected)return;
  const results=filteredResults(),container=session.host.querySelector('.team-results');if(!container){renderSession(true);return}
  const start=Math.min(session.shown,results.length),end=Math.min(results.length,start+PAGE_SIZE);if(end<=start)return;
  button.disabled=true;container.insertAdjacentHTML('beforeend',results.slice(start,end).map((team,index)=>cardMarkup(team,start+index)).join(''));session.shown=end;
  const pager=session.host.querySelector('.hotaru-team-results-pager');if(pager)pager.outerHTML=pagerMarkup(end,results.length);
}
async function buildSession(){
  const card=smartCard(),host=resultsHost(card);if(!card||!host)return false;
  const mode=card.querySelector('#team-mode')?.value||'roster';if(mode==='abyss')return false;
  const rendered=host.querySelector('.team-results');if(!rendered||rendered.querySelector('.team-adapted'))return false;
  const lock1=card.querySelector('#team-lock-1')?.value||'',lock2=card.querySelector('#team-lock-2')?.value||'',locks=[];if(mode==='lock1'||mode==='lock2')locks.push(lock1);if(mode==='lock2')locks.push(lock2);
  const cleanLocks=locks.filter(Boolean);if(mode!=='roster'&&!cleanLocks.length)return false;
  try{
    const catalog=await getCatalog(),state=loadState(),roster=sortRoster(normalizeRoster(state?.roster||[],catalog?.characters||[])),allowUnowned=Boolean(card.querySelector('#team-allow-unowned')?.checked),full=matchReviewedTeams({roster,lockedNames:cleanLocks,allowUnowned,limit:'all'});
    if(!full.results?.length)return false;
    session={host,results:full.results,shown:Math.min(PAGE_SIZE,full.results.length)};renderSession(true);return true;
  }catch{return false}
}
function queueScan(){
  if(scanQueued||!pendingUntil)return;scanQueued=true;
  requestAnimationFrame(async()=>{scanQueued=false;if(!pendingUntil)return;if(Date.now()>pendingUntil){pendingUntil=0;return}const ready=await buildSession();if(ready)pendingUntil=0});
}
function markPending(){session=null;pendingUntil=Date.now()+WAIT_MS;queueScan()}

if(app)new MutationObserver(()=>{if(pendingUntil)queueScan()}).observe(app,{childList:true,subtree:true});
document.addEventListener('click',event=>{
  const loadMore=event.target.closest?.('[data-hotaru-team-load-more]');if(loadMore){event.preventDefault();event.stopPropagation();appendNext(loadMore);return}
  if(event.target.closest?.('[data-action="generate-smart-team"]'))markPending();
},{capture:true});
document.addEventListener('change',event=>{
  if(event.target?.id==='hotaru-team-utility'&&session?.host?.isConnected){renderSession(true);return}
  if(['team-mode','team-lock-1','team-lock-2','team-allow-unowned','hotaru-team-picker-ownership'].includes(event.target?.id)){session=null;pendingUntil=0}
});
