import { loadState } from '../core/state.js';
import { loadCatalog } from '../data/game-data.js';
import { normalizeRoster, sortRoster } from './roster-intelligence.js';
import { matchReviewedTeams } from './roster-team-matcher.js';
import { teamMatchesUtility } from '../data/team-utility-tags.js';

const app=document.getElementById('app');
const PAGE_SIZE=12;
const WAIT_MS=6000;
const RESULT_FILTER_KEY='hotaru.smart-team-result-filter.v1';
const RESULT_SORT_KEY='hotaru.smart-team-result-sort.v1';
const RESULT_FILTERS=new Set(['all','owned','missing','reviewed','simulated']);
const RESULT_SORTS=new Set(['best','owned','reviewed','name']);
let catalogPromise=null;
let session=null;
let pendingUntil=0;
let scanQueued=false;

function esc(value=''){return String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
function safeGet(key,fallback=''){try{return localStorage.getItem(key)||fallback}catch{return fallback}}
function safeSet(key,value){try{localStorage.setItem(key,value)}catch{}}
function resultFilter(){const value=safeGet(RESULT_FILTER_KEY,'all');return RESULT_FILTERS.has(value)?value:'all'}
function resultSort(){const value=safeGet(RESULT_SORT_KEY,'best');return RESULT_SORTS.has(value)?value:'best'}
function getCatalog(){if(!catalogPromise)catalogPromise=loadCatalog().catch(error=>{catalogPromise=null;throw error});return catalogPromise}
function smartCard(){return document.querySelector('.smart-team-card')}
function resultsHost(card=smartCard()){return card?.querySelector(':scope > .section')||null}
function selectedNeed(card=smartCard()){const select=card?.querySelector('#hotaru-team-utility');return select&&!select.disabled?String(select.value||'any'):'any'}
function sourceLinks(source={}){const links=Array.isArray(source.links)&&source.links.length?source.links:[source];return links.filter(item=>item?.url).map(item=>`<a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.label||source.label||'Source')}</a>`).join(' · ')}
function cardMarkup(team,index,sort='best'){const links=sourceLinks(team.source||{}),sourceType=team.source?.type||team.confidence||'Sourced team',eyebrow=sort==='best'?(index===0?'Best match':`Alternative ${index+1}`):`Result ${index+1}`;return`<article class="team-card"><div class="team-card-head"><div><div class="eyebrow">${eyebrow}</div><h3>${esc(team.name)}</h3></div><div class="team-badges"><span class="pill ${team.ownedComplete?'good':'warn'}">Owned ${team.ownedCount}/4</span><span class="pill gray">${esc(team.confidence||'Sourced')}</span></div></div><div class="team-members">${(team.members||[]).map(name=>`<div class="team-member ${(team.missing||[]).includes(name)?'missing':''}"><strong>${esc(name)}</strong><span>${(team.missing||[]).includes(name)?'Not owned':'Owned'}</span></div>`).join('')}</div><p class="team-why">${esc(team.why||'')}</p>${team.notes?`<p class="muted small">${esc(team.notes)}</p>`:''}<div class="team-source"><span>${esc(sourceType)}</span><div>${links}</div></div></article>`}
function matchesResultFilter(team,filter){if(filter==='owned')return Boolean(team.ownedComplete);if(filter==='missing')return !team.ownedComplete;if(filter==='reviewed')return team.confidence==='Reviewed';if(filter==='simulated')return team.confidence==='Simulation-backed';return true}
function sortResults(results,sort){const ranked=[...results];if(sort==='owned')return ranked.sort((a,b)=>(b.ownedCount||0)-(a.ownedCount||0)||(b.score||0)-(a.score||0)||String(a.name).localeCompare(String(b.name)));if(sort==='reviewed')return ranked.sort((a,b)=>(b.confidence==='Reviewed')-(a.confidence==='Reviewed')||(b.score||0)-(a.score||0)||String(a.name).localeCompare(String(b.name)));if(sort==='name')return ranked.sort((a,b)=>String(a.name).localeCompare(String(b.name))||(b.score||0)-(a.score||0));return ranked}
function filteredResults(){if(!session)return[];const need=selectedNeed(),filter=resultFilter(),sort=resultSort();let results=need==='any'?session.results:session.results.filter(team=>teamMatchesUtility(team.members||[],need));results=results.filter(team=>matchesResultFilter(team,filter));return sortResults(results,sort)}
function option(value,label,current){return`<option value="${value}"${current===value?' selected':''}>${label}</option>`}
function toolbarMarkup(){const filter=resultFilter(),sort=resultSort();return`<div class="hotaru-team-results-tools" aria-label="Team result controls"><label>Show<select id="hotaru-team-result-filter">${option('all','All results',filter)}${option('owned','Fully owned',filter)}${option('missing','Needs unowned characters',filter)}${option('reviewed','Reviewed only',filter)}${option('simulated','Simulation-backed only',filter)}</select></label><label>Sort results<select id="hotaru-team-result-sort">${option('best','Best match',sort)}${option('owned','Most owned',sort)}${option('reviewed','Reviewed first',sort)}${option('name','Team name A–Z',sort)}</select></label></div>`}
function pagerMarkup(shown,total){const remaining=Math.max(0,total-shown),next=Math.min(PAGE_SIZE,remaining);return`<div class="hotaru-team-results-pager" aria-live="polite"><span>Showing <strong>${shown}</strong> of <strong>${total}</strong> matching sourced teams</span>${remaining?`<button type="button" class="secondary" data-hotaru-team-load-more>Load ${next} more</button>`:'<span class="muted small">All matches loaded</span>'}</div>`}
function renderSession(reset=false){
  if(!session?.host?.isConnected)return;
  const results=filteredResults(),sort=resultSort();if(reset)session.shown=Math.min(PAGE_SIZE,results.length);else session.shown=Math.min(session.shown||PAGE_SIZE,results.length);
  const tools=toolbarMarkup();
  if(!results.length){session.host.innerHTML=`${tools}<div class="notice info hotaru-team-results-empty"><strong>No sourced teams match these result filters.</strong><br>Try All results, a different Team Need, or turn on Allow unowned. Hotaru will not invent a team just to fill a filter.</div>`;return}
  session.host.innerHTML=`${tools}<div class="team-results">${results.slice(0,session.shown).map((team,index)=>cardMarkup(team,index,sort)).join('')}</div>${pagerMarkup(session.shown,results.length)}`;
}
function appendNext(button){
  if(!session?.host?.isConnected)return;
  const results=filteredResults(),container=session.host.querySelector('.team-results'),sort=resultSort();if(!container){renderSession(true);return}
  const start=Math.min(session.shown,results.length),end=Math.min(results.length,start+PAGE_SIZE);if(end<=start)return;
  button.disabled=true;container.insertAdjacentHTML('beforeend',results.slice(start,end).map((team,index)=>cardMarkup(team,start+index,sort)).join(''));session.shown=end;
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
  if(event.target?.id==='hotaru-team-result-filter'&&session?.host?.isConnected){const value=RESULT_FILTERS.has(event.target.value)?event.target.value:'all';safeSet(RESULT_FILTER_KEY,value);renderSession(true);return}
  if(event.target?.id==='hotaru-team-result-sort'&&session?.host?.isConnected){const value=RESULT_SORTS.has(event.target.value)?event.target.value:'best';safeSet(RESULT_SORT_KEY,value);renderSession(true);return}
  if(event.target?.id==='hotaru-team-utility'&&session?.host?.isConnected){renderSession(true);return}
  if(['team-mode','team-lock-1','team-lock-2','team-allow-unowned','hotaru-team-picker-ownership'].includes(event.target?.id)){session=null;pendingUntil=0}
});
