import { loadState } from '../core/state.js';
import { loadCatalog } from '../data/game-data.js';
import { normalizeRoster, sortRoster } from './roster-intelligence.js';
import { matchReviewedTeams } from './roster-team-matcher.js';
import { teamMatchesUtility } from '../data/team-utility-tags.js';
import { reactionLabel, teamMatchesReaction, teamReaction } from '../data/team-reaction-tags.js';

const app=document.getElementById('app');
const PAGE_SIZE=10;
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
function selectedReaction(card=smartCard()){const select=card?.querySelector('#hotaru-team-reaction');return select&&!select.disabled?String(select.value||'all'):'all'}
function sourceLinks(source={}){const links=Array.isArray(source.links)&&source.links.length?source.links:[source];return links.filter(item=>item?.url).map(item=>`<a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.label||source.label||'Source')}</a>`).join(' · ')}
function cardMarkup(team,index,sort='best'){const links=sourceLinks(team.source||{}),sourceType=team.source?.type||team.confidence||'Sourced team',eyebrow=sort==='best'?(index===0?'Best match':`Alternative ${index+1}`):`Result ${index+1}`,reaction=reactionLabel(teamReaction(team));return`<article class="team-card"><div class="team-card-head"><div><div class="eyebrow">${eyebrow}</div><h3>${esc(team.name)}</h3></div><div class="team-badges"><span class="pill ${team.ownedComplete?'good':'warn'}">Owned ${team.ownedCount}/4</span><span class="pill gray">${esc(team.confidence||'Sourced')}</span>${reaction?`<span class="pill gray hotaru-team-reaction-badge">${esc(reaction)}</span>`:''}</div></div><div class="team-members">${(team.members||[]).map(name=>`<div class="team-member ${(team.missing||[]).includes(name)?'missing':''}"><strong>${esc(name)}</strong><span>${(team.missing||[]).includes(name)?'Not owned':'Owned'}</span></div>`).join('')}</div><p class="team-why">${esc(team.why||'')}</p>${team.notes?`<p class="muted small">${esc(team.notes)}</p>`:''}<div class="team-source"><span>${esc(sourceType)}</span><div>${links}</div></div></article>`}
function matchesResultFilter(team,filter){if(filter==='owned')return Boolean(team.ownedComplete);if(filter==='missing')return !team.ownedComplete;if(filter==='reviewed')return team.confidence==='Reviewed';if(filter==='simulated')return team.confidence==='Simulation-backed';return true}
function sortResults(results,sort){const ranked=[...results];if(sort==='owned')return ranked.sort((a,b)=>(b.ownedCount||0)-(a.ownedCount||0)||(b.score||0)-(a.score||0)||String(a.name).localeCompare(String(b.name)));if(sort==='reviewed')return ranked.sort((a,b)=>(b.confidence==='Reviewed')-(a.confidence==='Reviewed')||(b.score||0)-(a.score||0)||String(a.name).localeCompare(String(b.name)));if(sort==='name')return ranked.sort((a,b)=>String(a.name).localeCompare(String(b.name))||(b.score||0)-(a.score||0));return ranked}
function contextFilter(results=[]){const need=selectedNeed(),reaction=selectedReaction();let out=need==='any'?results:results.filter(team=>teamMatchesUtility(team.members||[],need));if(reaction!=='all')out=out.filter(team=>teamMatchesReaction(team,reaction));return out}
function filteredResults(){if(!session)return[];let results=contextFilter(session.results),filter=resultFilter(),sort=resultSort();if(filter==='missing'&&!session.allowUnowned)filter='all';results=results.filter(team=>matchesResultFilter(team,filter));return sortResults(results,sort)}
function option(value,label,current,{disabled=false}={}){return`<option value="${value}"${current===value?' selected':''}${disabled?' disabled':''}>${label}</option>`}
function toolbarMarkup(){let filter=resultFilter();const sort=resultSort(),missingDisabled=!session?.allowUnowned;if(missingDisabled&&filter==='missing')filter='all';return`<div class="hotaru-team-results-tools" aria-label="Team result controls"><label>Show<select id="hotaru-team-result-filter">${option('all','All results',filter)}${option('owned','Fully owned',filter)}${option('missing',missingDisabled?'Needs unowned characters — turn on Allow unowned':'Needs unowned characters',filter,{disabled:missingDisabled})}${option('reviewed','Reviewed only',filter)}${option('simulated','Simulation-backed only',filter)}</select></label><label>Sort results<select id="hotaru-team-result-sort">${option('best','Best match',sort)}${option('owned','Most owned',sort)}${option('reviewed','Reviewed first',sort)}${option('name','Team name A–Z',sort)}</select></label></div>`}
function coverageMarkup(){if(!session)return'';const contextual=contextFilter(session.sourceResults),owned=contextual.filter(team=>team.ownedComplete).length,missing=contextual.length-owned;if(!contextual.length)return`<div class="hotaru-team-coverage-summary"><strong>0 sourced teams</strong> match the current Team Need / Team Reaction context.</div>`;return`<div class="hotaru-team-coverage-summary"><strong>${owned} fully owned</strong>${missing?` · <strong>${missing} more sourced ${missing===1?'team requires':'teams require'} characters you do not own</strong>`:''}. ${missing&&!session.allowUnowned?'Turn on Allow unowned to preview those teams.':''}</div>`}
function pagerMarkup(page,total,position='bottom'){const totalPages=Math.max(1,Math.ceil(total/PAGE_SIZE)),current=Math.max(1,Math.min(totalPages,page||1)),from=(current-1)*PAGE_SIZE+1,to=Math.min(total,current*PAGE_SIZE);return`<div class="hotaru-team-results-pager ${position==='top'?'is-top':''}" aria-live="polite"><span>Page <strong>${current}</strong> of <strong>${totalPages}</strong> · results <strong>${from}–${to}</strong> of <strong>${total}</strong></span><div class="hotaru-team-page-actions"><button type="button" class="secondary" data-hotaru-team-page="${current-1}" ${current<=1?'disabled':''}>Previous</button><button type="button" class="secondary" data-hotaru-team-page="${current+1}" ${current>=totalPages?'disabled':''}>Next</button></div></div>`}
function resultsBodyMarkup(results,sort){
  if(!results.length)return`<div class="notice info hotaru-team-results-empty"><strong>No sourced teams match these filters.</strong><br>Try All results, a different Team Need or Team Reaction, or turn on Allow unowned. Hotaru will not invent a team just to fill a filter.</div>`;
  const start=(session.page-1)*PAGE_SIZE,end=Math.min(results.length,start+PAGE_SIZE),pageResults=results.slice(start,end);
  return`${pagerMarkup(session.page,results.length,'top')}<div class="team-results">${pageResults.map((team,index)=>cardMarkup(team,start+index,sort)).join('')}</div>${pagerMarkup(session.page,results.length,'bottom')}`;
}
function renderSession(reset=false,preserveControls=false){
  if(!session?.host?.isConnected)return;
  const results=filteredResults(),sort=resultSort(),totalPages=Math.max(1,Math.ceil(results.length/PAGE_SIZE));if(reset)session.page=1;else session.page=Math.max(1,Math.min(session.page||1,totalPages));
  const existingTools=session.host.querySelector('.hotaru-team-results-tools'),existingBody=session.host.querySelector('.hotaru-team-results-body');
  if(preserveControls&&existingTools&&existingBody){
    // Never remove the native Show/Sort selects while Mobile Safari is closing its picker.
    // Replacing an active <select> makes iOS restore focus/scroll to the Smart Team card top.
    existingBody.innerHTML=resultsBodyMarkup(results,sort);
    return;
  }
  session.host.innerHTML=`${coverageMarkup()}${toolbarMarkup()}<div class="hotaru-team-results-body">${resultsBodyMarkup(results,sort)}</div>`;
}
function goToPage(page){if(!session?.host?.isConnected)return;const results=filteredResults(),totalPages=Math.max(1,Math.ceil(results.length/PAGE_SIZE)),target=Math.max(1,Math.min(totalPages,Number(page)||1));if(target===session.page)return;session.page=target;renderSession(false);requestAnimationFrame(()=>session.host.querySelector('.hotaru-team-results-pager.is-top')?.scrollIntoView({behavior:'smooth',block:'start'}));}
async function buildSession(){
  const card=smartCard(),host=resultsHost(card);if(!card||!host)return false;
  const mode=card.querySelector('#team-mode')?.value||'roster';if(mode==='abyss')return false;
  // The iPhone controller owns the tap first. Wait until its synchronous loading state has
  // settled before rebuilding the visible result set with the full account-aware scorer.
  // Otherwise pagination can win the race, then get overwritten by the older 12-card render.
  const notice=host.querySelector('.notice.info');
  if(notice?.textContent?.includes('Creating recommendations'))return false;
  if(host.querySelector('.team-adapted'))return false;
  const lock1=card.querySelector('#team-lock-1')?.value||'',lock2=card.querySelector('#team-lock-2')?.value||'',locks=[];if(mode==='lock1'||mode==='lock2')locks.push(lock1);if(mode==='lock2')locks.push(lock2);
  const cleanLocks=locks.filter(Boolean);if(mode!=='roster'&&!cleanLocks.length)return false;
  try{
    const catalog=await getCatalog(),state=loadState(),roster=sortRoster(normalizeRoster(state?.roster||[],catalog?.characters||[])),allowUnowned=Boolean(card.querySelector('#team-allow-unowned')?.checked),full=matchReviewedTeams({roster,weapons:state?.weapons||[],artifacts:state?.ownedArtifacts||[],lockedNames:cleanLocks,allowUnowned,limit:'all'});
    if(!full.sourceResults?.length)return false;
    if(!allowUnowned&&!full.results?.length)return false;
    session={host,results:full.results,sourceResults:full.sourceResults,allowUnowned,page:1};renderSession(true);return true;
  }catch{return false}
}
function queueScan(){if(scanQueued||!pendingUntil)return;scanQueued=true;requestAnimationFrame(async()=>{scanQueued=false;if(!pendingUntil)return;if(Date.now()>pendingUntil){pendingUntil=0;return}const ready=await buildSession();if(ready)pendingUntil=0})}
function markPending(){session=null;pendingUntil=Date.now()+WAIT_MS;queueScan()}
if(app)new MutationObserver(()=>{if(pendingUntil)queueScan()}).observe(app,{childList:true,subtree:true});
document.addEventListener('click',event=>{const pageButton=event.target.closest?.('[data-hotaru-team-page]');if(pageButton){event.preventDefault();event.stopPropagation();if(!pageButton.disabled)goToPage(pageButton.dataset.hotaruTeamPage);return}if(event.target.closest?.('[data-action="generate-smart-team"]'))markPending()},{capture:true});
document.addEventListener('change',event=>{
  if(event.target?.id==='hotaru-team-result-filter'&&session?.host?.isConnected){const value=RESULT_FILTERS.has(event.target.value)?event.target.value:'all';safeSet(RESULT_FILTER_KEY,value);renderSession(true,true);return}
  if(event.target?.id==='hotaru-team-result-sort'&&session?.host?.isConnected){const value=RESULT_SORTS.has(event.target.value)?event.target.value:'best';safeSet(RESULT_SORT_KEY,value);renderSession(true,true);return}
  if(['hotaru-team-utility','hotaru-team-reaction'].includes(event.target?.id)&&session?.host?.isConnected){renderSession(true);return}
  if(['team-mode','team-lock-1','team-lock-2','team-allow-unowned','hotaru-team-picker-ownership'].includes(event.target?.id)){session=null;pendingUntil=0}
});
