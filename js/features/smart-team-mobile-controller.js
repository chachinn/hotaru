import { loadState } from '../core/state.js';
import { loadCatalog } from '../data/game-data.js';
import { normalizeRoster, sortRoster } from './roster-intelligence.js';
import { matchReviewedTeams } from './roster-team-matcher.js';
import { buildFlexiblePairTeams } from './flexible-pair-builder.js';

const app=document.getElementById('app');
let catalogPromise=null;
let patchQueued=false;
let generating=false;

function esc(value=''){return String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
function key(value=''){return String(value||'').trim().toLowerCase()}
function getCatalog(){if(!catalogPromise)catalogPromise=loadCatalog().catch(error=>{catalogPromise=null;throw error});return catalogPromise}
function setHtml(node,html){if(node&&node.innerHTML!==html)node.innerHTML=html}
function smartCard(){return document.querySelector('.smart-team-card')}
function resultsHost(card=smartCard()){return card?.querySelector(':scope > .section')||null}
function ownedNameSet(state,catalog){const normalized=sortRoster(normalizeRoster(state?.roster||[],catalog?.characters||[]));return{normalized,names:new Set(normalized.map(entry=>key(entry.name)))}}

function optionMarkup(characters,owned,selected){
  return`<option value="">Choose character</option>${characters.map(character=>{const name=String(character?.name||'').trim();if(!name)return'';const isOwned=owned.has(key(name));return`<option value="${esc(name)}" data-owned="${isOwned?'1':'0'}" ${name===selected?'selected':''}>${esc(name)} · ${isOwned?'Owned':'Not owned'}</option>`}).join('')}`;
}
async function syncFullCatalogPickers(){
  const card=smartCard();if(!card)return;
  const mode=card.querySelector('#team-mode')?.value||'roster';if(mode==='roster'||mode==='abyss')return;
  try{
    const catalog=await getCatalog(),state=loadState(),{names:owned}=ownedNameSet(state,catalog),characters=[...(catalog?.characters||[])].filter(character=>character?.name).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
    for(const [id,stateKey] of [['team-lock-1','teamLock1'],['team-lock-2','teamLock2']]){
      const select=card.querySelector(`#${id}`);if(!select)continue;
      const desired=String(state.ui?.[stateKey]||select.value||'');
      const signature=`${characters.length}|${[...owned].sort().join('|')}|${desired}`;
      if(select.dataset.hotaruCatalogSignature===signature)continue;
      select.dataset.hotaruCatalogSignature=signature;
      setHtml(select,optionMarkup(characters,owned,desired));
      if([...select.options].some(option=>option.value===desired))select.value=desired;
    }
  }catch{}
}

function sourceLinks(source={}){
  const links=Array.isArray(source.links)&&source.links.length?source.links:[source];
  return links.filter(item=>item?.url).map(item=>`<a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.label||source.label||'Source')}</a>`).join(' · ');
}
function sourcedCard(team,index){
  const links=sourceLinks(team.source||{}),sourceType=team.source?.type||team.confidence||'Sourced team';
  return`<article class="team-card"><div class="team-card-head"><div><div class="eyebrow">${index===0?'Best match':`Alternative ${index+1}`}</div><h3>${esc(team.name)}</h3></div><div class="team-badges"><span class="pill ${team.ownedComplete?'good':'warn'}">Owned ${team.ownedCount}/4</span><span class="pill gray">${esc(team.confidence||'Sourced')}</span></div></div><div class="team-members">${(team.members||[]).map(name=>`<div class="team-member ${(team.missing||[]).includes(name)?'missing':''}"><strong>${esc(name)}</strong><span>${(team.missing||[]).includes(name)?'Not owned':'Owned'}</span></div>`).join('')}</div><p class="team-why">${esc(team.why||'')}</p>${team.notes?`<p class="muted small">${esc(team.notes)}</p>`:''}<div class="team-source"><span>${esc(sourceType)}</span><div>${links}</div></div></article>`;
}
function flexibleCard(team,index){
  return`<article class="team-card team-adapted"><div class="team-card-head"><div><div class="eyebrow">${index===0?'Best flexible fit':`Flexible option ${index+1}`}</div><h3>${esc(team.name)}</h3></div><div class="team-badges"><span class="pill ${team.ownedComplete?'good':'warn'}">Owned ${team.ownedCount}/4</span><span class="pill warn">Adapted · Off-meta</span></div></div><div class="team-members">${(team.members||[]).map(name=>`<div class="team-member ${(team.missing||[]).includes(name)?'missing':''}"><strong>${esc(name)}</strong><span>${(team.missing||[]).includes(name)?'Not owned':'Owned'}</span></div>`).join('')}</div><p class="muted small"><strong>Source structure:</strong> ${esc(team.adaptedFrom||'')}</p><p class="team-why">${esc(team.why||'')}</p>${team.notes?`<p class="muted small">${esc(team.notes)}</p>`:''}<div class="team-source"><span>Cross-checked adaptation</span><div>${sourceLinks(team.source||{})}</div></div></article>`;
}
function renderError(host,message){setHtml(host,`<div class="notice">${esc(message)}</div>`)}
function renderPending(host,names=[]){setHtml(host,`<div class="notice info"><strong>Team coverage pending</strong><br>${esc(names.join(' · '))} ${names.length===1?'does':'do'} not have sourced Hotaru team coverage yet. Hotaru will not invent a team for ${names.length===1?'this character':'these locks'}.</div>`)}

async function generateVisibleTeam(){
  if(generating)return;
  const card=smartCard(),host=resultsHost(card);if(!card||!host)return;
  const mode=card.querySelector('#team-mode')?.value||'roster';if(mode==='abyss')return;
  const lock1=card.querySelector('#team-lock-1')?.value||'',lock2=card.querySelector('#team-lock-2')?.value||'',allowUnowned=Boolean(card.querySelector('#team-allow-unowned')?.checked),locks=[];
  if(mode==='lock1'||mode==='lock2')locks.push(lock1);if(mode==='lock2')locks.push(lock2);
  const cleanLocks=locks.filter(Boolean);
  if(mode!=='roster'&&!cleanLocks.length){renderError(host,'Choose a character to build around.');return}
  if(mode==='lock2'&&(cleanLocks.length<2||key(cleanLocks[0])===key(cleanLocks[1]))){renderError(host,'Choose two different characters for the 2-character lock.');return}
  generating=true;
  try{
    setHtml(host,'<div class="notice info"><strong>Creating recommendations…</strong><br>Matching your saved roster against sourced team data.</div>');
    const catalog=await getCatalog(),state=loadState(),{normalized}=ownedNameSet(state,catalog);
    const exact=matchReviewedTeams({roster:normalized,lockedNames:cleanLocks,allowUnowned,limit:12});
    if(exact.results?.length){setHtml(host,`<div class="team-results">${exact.results.map(sourcedCard).join('')}</div>`);return}
    if(mode==='lock2'){
      const flexible=buildFlexiblePairTeams({roster:normalized,lockedNames:cleanLocks,allowUnowned,limit:12});
      if(flexible.supported){
        if(flexible.results.length){setHtml(host,`<div class="notice warn"><strong>Flexible Pair Builder · Adapted, not reviewed</strong><br>${esc(flexible.rationale)} Hotaru is preserving sourced mechanics instead of treating same-element characters as interchangeable.</div><div class="team-results">${flexible.results.map(flexibleCard).join('')}</div>`);return}
        if(flexible.previewAvailable&&!allowUnowned){setHtml(host,'<div class="notice info"><strong>A flexible pair route exists, but it needs missing teammates.</strong><br>Turn on Allow unowned to preview the audited Odette + Flins adaptations and see which support slots are missing.</div>');return}
      }
    }
    if(exact.pendingLocks?.length){renderPending(host,exact.pendingLocks);return}
    setHtml(host,`<div class="notice info"><strong>No complete sourced match from this roster.</strong><br>${allowUnowned?'No sourced recommendation matches the selected lock(s), even with missing teammates allowed.':'Turn on Allow unowned to preview sourced teams that still need characters you do not own.'}</div>`);
  }catch(error){renderError(host,error?.message||'Team recommendations could not be created.');}
  finally{generating=false;syncFullCatalogPickers()}
}

function schedulePickerPatch(){if(patchQueued)return;patchQueued=true;requestAnimationFrame(()=>{patchQueued=false;syncFullCatalogPickers()})}
if(app)new MutationObserver(schedulePickerPatch).observe(app,{childList:true,subtree:true});

document.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-action="generate-smart-team"]');if(!button)return;
  const card=button.closest('.smart-team-card'),mode=card?.querySelector('#team-mode')?.value||'roster';if(mode==='abyss')return;
  event.preventDefault();event.stopPropagation();generateVisibleTeam();
},{capture:true});

document.addEventListener('change',event=>{if(event.target?.id==='team-mode'||event.target?.id==='team-lock-1'||event.target?.id==='team-lock-2')schedulePickerPatch()});
schedulePickerPatch();
