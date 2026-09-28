import { loadState } from '../core/state.js';
import { loadCatalog } from '../data/game-data.js';
import { matchReviewedTeams } from './roster-team-matcher.js';
import { buildFlexiblePairTeams, combineTwoLockResults } from './flexible-pair-builder.js';

const app=document.getElementById('app');
let pendingGenerate=false;
let patchQueued=false;
let patchRunning=false;

function esc(value=''){return String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
function rosterFromState(state=loadState()){return(state?.roster||[]).map((entry,index)=>({...entry,id:String(entry?.id||`ui:${index}`),name:String(entry?.name||entry?.teamName||'').trim(),teamName:String(entry?.teamName||'').trim()})).filter(entry=>entry.name)}
function sourceLinks(source={}){const links=Array.isArray(source.links)&&source.links.length?source.links:[source];return links.filter(item=>item?.url).map(item=>`<a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.label||source.label||'Source')}</a>`).join(' · ')}
function card(team,index){return`<article class="team-card team-adapted"><div class="team-card-head"><div><div class="eyebrow">${index===0?'Best flexible fit':`Flexible option ${index+1}`}</div><h3>${esc(team.name)}</h3></div><div class="team-badges"><span class="pill ${team.ownedComplete?'good':'warn'}">Owned ${team.ownedCount}/4</span><span class="pill warn">${esc(team.adaptationTier||'Adapted')}</span></div></div><div class="team-members">${team.members.map(name=>`<div class="team-member ${team.missing.includes(name)?'missing':''}"><strong>${esc(name)}</strong><span>${team.missing.includes(name)?'Not owned':'Owned'}</span></div>`).join('')}</div><p class="muted small"><strong>Source structure:</strong> ${esc(team.adaptedFrom)}</p><p class="team-why">${esc(team.why)}</p><p class="muted small">${esc(team.notes)}</p><div class="team-source"><span>Cross-checked adaptation</span><div>${sourceLinks(team.source)}</div></div></article>`}
function exactCard(team,index){return`<article class="team-card"><div class="team-card-head"><div><div class="eyebrow">${index===0?'Best match':`Alternative ${index+1}`}</div><h3>${esc(team.name)}</h3></div><div class="team-badges"><span class="pill ${team.ownedComplete?'good':'warn'}">Owned ${team.ownedCount}/4</span><span class="pill gray">${esc(team.confidence||'Sourced')}</span></div></div><div class="team-members">${team.members.map(name=>`<div class="team-member ${team.missing.includes(name)?'missing':''}"><strong>${esc(name)}</strong><span>${team.missing.includes(name)?'Not owned':'Owned'}</span></div>`).join('')}</div><p class="team-why">${esc(team.why||'')}</p>${team.notes?`<p class="muted small">${esc(team.notes)}</p>`:''}<div class="team-source"><span>${esc(team.source?.type||team.confidence||'Sourced team')}</span><div>${sourceLinks(team.source)}</div></div></article>`}
function setHtml(node,html){if(node&&node.innerHTML!==html)node.innerHTML=html}

async function patchFlexiblePair(){
  if(!pendingGenerate||patchRunning)return;
  patchRunning=true;
  try{
  const smart=document.querySelector('.smart-team-card');if(!smart)return;
  const mode=smart.querySelector('#team-mode')?.value;if(mode!=='lock2'){pendingGenerate=false;return}
  const lock1=smart.querySelector('#team-lock-1')?.value||'',lock2=smart.querySelector('#team-lock-2')?.value||'';if(!lock1||!lock2||lock1===lock2){pendingGenerate=false;return}
  const host=smart.querySelector(':scope > .section');if(!host)return;
  if(host.querySelector('.team-results')){pendingGenerate=false;return}
  const state=loadState(),roster=rosterFromState(state),allowUnowned=Boolean(smart.querySelector('#team-allow-unowned')?.checked);
  const reaction=smart.querySelector('#hotaru-team-reaction')?.value||'all';
  let catalog=null;try{catalog=await loadCatalog()}catch{}
  const exact=matchReviewedTeams({roster,weapons:state?.weapons||[],lockedNames:[lock1,lock2],allowUnowned,limit:12,reaction});
  const flexible=buildFlexiblePairTeams({roster,catalogCharacters:catalog?.characters||[],lockedNames:[lock1,lock2],allowUnowned,limit:12,reaction,exactSourceTeams:exact.sourceResults||[]});
  const adapted=allowUnowned?[]:(flexible.supported?flexible.results||[]:[]);
  const shown=combineTwoLockResults(exact.results||[],adapted,12);
  if(!shown.length){pendingGenerate=false;return}
  const hasAdapted=shown.some(team=>team?.adaptationTier);
  const notice=hasAdapted?`<div class="notice warn"><strong>Additional owned alternatives · Source-informed</strong><br>${esc(flexible.rationale)}</div>`:'';
  setHtml(host,`${notice}<div class="team-results">${shown.map((team,index)=>team?.adaptationTier?card(team,index):exactCard(team,index)).join('')}</div>`);
  pendingGenerate=false;
  }finally{patchRunning=false}
}
function schedulePatch(){
  if(patchQueued)return;
  patchQueued=true;
  queueMicrotask(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{patchQueued=false;patchFlexiblePair()})));
}

function markPending(event){if(!event.target.closest('[data-action="generate-smart-team"]'))return;pendingGenerate=true;schedulePatch()}
document.addEventListener('pointerup',markPending,{capture:true});
document.addEventListener('click',markPending,{capture:true});

if(app)new MutationObserver(()=>{if(pendingGenerate)schedulePatch()}).observe(app,{childList:true,subtree:true});
