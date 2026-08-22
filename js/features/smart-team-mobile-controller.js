import { loadState } from '../core/state.js';
import { loadCatalog } from '../data/game-data.js';
import { normalizeRoster, sortRoster } from './roster-intelligence.js';
import { matchReviewedTeams } from './roster-team-matcher.js';
import { buildFlexiblePairTeams } from './flexible-pair-builder.js';
import { planReviewedAbyssTeams } from './abyss-team-planner.js';
import { applyAbyssCycleIntelligence } from './abyss-intelligence.js';

const app=document.getElementById('app');
const PICKER_FILTER_KEY='hotaru.smart-team-picker-ownership.v1';
const PICKER_FILTERS=new Set(['all','owned','unowned']);
let catalogPromise=null;
let patchQueued=false;
let generating=false;

function esc(value=''){return String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
function key(value=''){return String(value||'').trim().toLowerCase()}
function safeGet(keyName,fallback=''){try{return localStorage.getItem(keyName)||fallback}catch{return fallback}}
function safeSet(keyName,value){try{localStorage.setItem(keyName,value)}catch{}}
function pickerFilter(){const value=safeGet(PICKER_FILTER_KEY,'all');return PICKER_FILTERS.has(value)?value:'all'}
function getCatalog(){if(!catalogPromise)catalogPromise=loadCatalog().catch(error=>{catalogPromise=null;throw error});return catalogPromise}
function setHtml(node,html){if(node&&node.innerHTML!==html)node.innerHTML=html}
function smartCard(){return document.querySelector('.smart-team-card')}
function resultsHost(card=smartCard()){return card?.querySelector(':scope > .section')||null}
function selectedReaction(card=smartCard()){const select=card?.querySelector('#hotaru-team-reaction');return select&&!select.disabled?String(select.value||'all'):'all'}
function ownedNameSet(state,catalog){const normalized=sortRoster(normalizeRoster(state?.roster||[],catalog?.characters||[])),names=new Set();for(const entry of normalized){for(const value of [entry?.name,entry?.teamName])if(value)names.add(key(value))}return{normalized,names}}
function travelerIdentity(character={}){const name=String(character?.name||'').trim(),element=String(character?.element||'').trim(),isTraveler=/^(?:traveler|aether|lumine)$/i.test(name)||/traveler/i.test(name);if(!isTraveler)return{name,value:name,label:name};const validElement=['Anemo','Geo','Electro','Dendro','Hydro','Pyro','Cryo'].includes(element),value=validElement?`${element} Traveler`:'Traveler',id=`${character?.id||''} ${character?.sourceId||''}`,sex=/aether/i.test(name)||/10000005/.test(id)?'Aether':/lumine/i.test(name)||/10000007/.test(id)?'Lumine':'';return{name,value,label:sex?`${value} · ${sex}`:value}}
function pickerCharacters(characters=[]){const out=[],seen=new Set();for(const character of characters){const identity=travelerIdentity(character),value=String(identity.value||'').trim();if(!value)continue;const signature=key(value);if(seen.has(signature))continue;seen.add(signature);out.push({...character,teamPickerValue:value,teamPickerLabel:identity.label||value})}return out}
function matchesPickerFilter(name,owned,filter){const isOwned=owned.has(key(name));return filter==='owned'?isOwned:filter==='unowned'?!isOwned:true}

function ensureOwnershipFilter(card){
  const controls=card?.querySelector('.team-controls');if(!controls)return'all';
  const mode=card.querySelector('#team-mode')?.value||'roster';
  let field=controls.querySelector('.hotaru-team-picker-ownership-field');
  if(mode==='roster'||mode==='abyss'){field?.remove();return'all'}
  if(!field){
    field=document.createElement('div');field.className='field hotaru-team-picker-ownership-field';
    field.innerHTML='<label for="hotaru-team-picker-ownership">Character ownership</label><select id="hotaru-team-picker-ownership"><option value="all">All characters</option><option value="owned">Owned only</option><option value="unowned">Not owned only</option></select><small>Filters the locked-character picker only. It does not change your roster.</small>';
    const firstLock=controls.querySelector('#team-lock-1')?.closest('.field');
    if(firstLock)controls.insertBefore(field,firstLock);else controls.appendChild(field);
  }
  const select=field.querySelector('#hotaru-team-picker-ownership'),filter=pickerFilter();
  if(select&&select.value!==filter)select.value=filter;
  return filter;
}
function optionMarkup(characters,owned,selected,filter='all'){
  return`<option value="">Choose character</option>${characters.map(character=>{const value=String(character?.teamPickerValue||character?.name||'').trim(),baseLabel=String(character?.teamPickerLabel||value).trim();if(!value)return'';const isOwned=owned.has(key(value))||owned.has(key(character?.name)),label=filter==='all'?`${baseLabel} · ${isOwned?'Owned':'Not owned'}`:baseLabel;return`<option value="${esc(value)}" data-owned="${isOwned?'1':'0'}" ${value===selected?'selected':''}>${esc(label)}</option>`}).join('')}`;
}
async function syncFullCatalogPickers(){
  const card=smartCard();if(!card)return;
  const mode=card.querySelector('#team-mode')?.value||'roster',filter=ensureOwnershipFilter(card);if(mode==='roster'||mode==='abyss')return;
  try{
    const catalog=await getCatalog(),state=loadState(),{names:owned}=ownedNameSet(state,catalog),allCharacters=pickerCharacters([...(catalog?.characters||[])].filter(character=>character?.name)).sort((a,b)=>String(a.teamPickerLabel||a.name).localeCompare(String(b.teamPickerLabel||b.name))),characters=allCharacters.filter(character=>matchesPickerFilter(character.teamPickerValue||character.name,owned,filter));
    for(const [id,stateKey] of [['team-lock-1','teamLock1'],['team-lock-2','teamLock2']]){
      const select=card.querySelector(`#${id}`);if(!select)continue;
      const desired=String(state.ui?.[stateKey]||select.value||'');
      const signature=`${filter}|${characters.length}|${[...owned].sort().join('|')}|${desired}`;
      if(select.dataset.hotaruCatalogSignature===signature)continue;
      select.dataset.hotaruCatalogSignature=signature;
      setHtml(select,optionMarkup(characters,owned,desired,filter));
      if([...select.options].some(option=>option.value===desired))select.value=desired;
    }
  }catch{}
}
function clearLocksExcludedByFilter(card,filter){
  for(const id of ['team-lock-1','team-lock-2']){
    const select=card?.querySelector(`#${id}`);if(!select?.value)continue;
    const option=select.selectedOptions?.[0],isOwned=option?.dataset?.owned==='1';
    const keep=filter==='all'||(filter==='owned'&&isOwned)||(filter==='unowned'&&!isOwned);if(keep)continue;
    select.value='';select.dispatchEvent(new Event('change',{bubbles:true}));
  }
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
function abyssTeamSideView(team,side){
  const fit=team?.cycleFit,half=side===1?'First half':'Second half',links=sourceLinks(team?.source||{}),sourceType=team?.source?.type||team?.confidence||'Reviewed team';
  return`<article class="abyss-side"><div class="abyss-side-head"><div><div class="eyebrow">${fit?`Floor 12 · ${half}`:`Team ${side}`}</div><h3>${esc(team?.name||`Team ${side}`)}</h3></div><div class="team-badges"><span class="pill ${team?.readyCount===4?'good':team?.ownedComplete?'warn':'gray'}">Ready ${Number(team?.readyCount||0)}/4</span>${fit?`<span class="pill ${fit.label==='Strong'?'good':fit.label==='Good'?'warn':'gray'}">${esc(fit.label)} fit</span>`:''}</div></div><div class="team-members">${(team?.memberStates||[]).map(member=>`<div class="team-member ${!member.owned?'missing':member.status==='Building'?'building':''}"><strong>${esc(member.name)}</strong><span>${member.owned?esc(member.status):'Not owned'}</span></div>`).join('')}</div>${fit?`<div class="abyss-fit"><div class="chip-row">${(fit.elements||[]).map(element=>`<span class="pill gray">${esc(element)}</span>`).join('')}</div>${(fit.matches||[]).slice(0,3).map(item=>`<p class="abyss-fit-line good">✓ ${esc(item)}</p>`).join('')}${(fit.gaps||[]).slice(0,2).map(item=>`<p class="abyss-fit-line gap">△ ${esc(item)}</p>`).join('')}</div>`:''}<p class="team-why">${esc(team?.why||'')}</p><div class="team-source"><span>${esc(sourceType)}</span><div>${links}</div></div></article>`;
}
function abyssCyclePanel(result){
  const cycle=result?.cycle,status=result?.status;if(!cycle)return'';
  if(!result.cycleApplied)return`<div class="notice info team-abyss-note"><strong>Cycle review needed.</strong><br>Hotaru's last reviewed Abyss cycle (${esc(cycle.label)}) is no longer current. Two-team planning still works, but cycle scoring is disabled until the enemy data is reviewed again.</div>`;
  return`<section class="abyss-cycle-card"><div class="abyss-cycle-head"><div><div class="eyebrow">${esc(status?.label||'Current reviewed cycle')} · reviewed ${esc(cycle.reviewedAt)}</div><h3>${esc(cycle.label)}</h3></div><span class="pill good">Cycle-aware</span></div><div class="abyss-cycle-halves"><div><strong>First half</strong><span>${esc(cycle.floor12?.firstHalf?.buff||'')}</span><small>${esc(cycle.floor12?.firstHalf?.summary||'')}</small></div><div><strong>Second half</strong><span>${esc(cycle.floor12?.secondHalf?.buff||'')}</span><small>${esc(cycle.floor12?.secondHalf?.summary||'')}</small></div></div></section>`;
}
function abyssResultsView(result,allowUnowned){
  const cycle=abyssCyclePanel(result);
  if(!result?.results?.length)return`${cycle}<div class="notice info"><strong>No valid two-team plan could be built.</strong><br>${allowUnowned?'No two non-overlapping sourced teams are currently available.':'Hotaru could not form a two-team pair even for a missing-slot preview.'}</div>`;
  const fallback=result.previewFallback?'<div class="notice warn"><strong>Closest sourced 8-slot preview</strong><br>Your roster does not currently complete two non-overlapping reviewed teams, so Hotaru is showing the closest plan and marking every missing character. This does not change your roster.</div>':'';
  const pairs=result.results.map((pair,index)=>`<section class="abyss-pair"><div class="abyss-pair-head"><div><div class="eyebrow">${index===0?(result.cycleApplied?'Best current-cycle plan':'Best two-team plan'):`Alternative ${index+1}`}</div><h3>Abyss pair</h3><p class="muted small">Eight unique slots · no character appears on both sides.</p></div><div class="team-badges"><span class="pill ${pair.ownedComplete?'good':'warn'}">Owned ${pair.ownedCount}/8</span><span class="pill ${pair.readyComplete?'good':'gray'}">Ready ${pair.readyCount}/8</span>${result.cycleApplied?`<span class="pill gray">Cycle fit ${pair.cycleScore}</span>`:''}</div></div><div class="abyss-team-grid">${abyssTeamSideView(pair.teams?.[0],1)}${abyssTeamSideView(pair.teams?.[1],2)}</div>${pair.cycleGaps?.length?`<div class="abyss-cycle-gaps"><strong>Current-cycle gaps</strong>${pair.cycleGaps.map(gap=>`<span>△ ${esc(gap)}</span>`).join('')}</div>`:''}<div class="abyss-next ${pair.nextStep?.type==='ready'?'ready':''}"><div class="eyebrow">${pair.nextStep?.type==='ready'?'Two-team readiness':pair.nextStep?.type==='missing'?'Roster gap':'Who to build next'}</div><strong>${pair.nextStep?.type==='ready'?'Both reviewed teams are roster-ready':esc(pair.nextStep?.name||'Next roster step')}</strong><p>${esc(pair.nextStep?.reason||'')}</p></div>${pair.missing?.length?`<div class="chip-row abyss-missing">${pair.missing.map(name=>`<span class="pill warn">Missing · ${esc(name)}</span>`).join('')}</div>`:''}</section>`).join('');
  return`<div class="abyss-results">${cycle}${fallback}${pairs}<p class="muted small team-cycle-note">Cycle fit is a deterministic matchup layer over reviewed team archetypes and dated Floor 12 facts. It is not a damage simulation and it never invents an unreviewed team.</p></div>`;
}
function renderError(host,message){setHtml(host,`<div class="notice">${esc(message)}</div>`)}
function renderPending(host,names=[]){setHtml(host,`<div class="notice info"><strong>Team coverage pending</strong><br>${esc(names.join(' · '))} ${names.length===1?'does':'do'} not have sourced Hotaru team coverage yet. Hotaru will not invent a team for ${names.length===1?'this character':'these locks'}.</div>`)}

async function generateVisibleTeam(){
  if(generating)return;
  const card=smartCard(),host=resultsHost(card);if(!card||!host)return;
  const mode=card.querySelector('#team-mode')?.value||'roster',allowUnowned=Boolean(card.querySelector('#team-allow-unowned')?.checked);
  generating=true;
  try{
    if(mode==='abyss'){
      setHtml(host,'<div class="notice info"><strong>Creating current Abyss plan…</strong><br>Building two non-overlapping sourced teams from your saved roster and the reviewed cycle data.</div>');
      const catalog=await getCatalog(),state=loadState(),{normalized}=ownedNameSet(state,catalog),base=planReviewedAbyssTeams({roster:normalized,allowUnowned,limit:5}),result=applyAbyssCycleIntelligence(base,{characters:catalog?.characters||[],now:new Date()});
      setHtml(host,abyssResultsView(result,allowUnowned));return;
    }
    const lock1=card.querySelector('#team-lock-1')?.value||'',lock2=card.querySelector('#team-lock-2')?.value||'',locks=[];
    if(mode==='lock1'||mode==='lock2')locks.push(lock1);if(mode==='lock2')locks.push(lock2);
    const cleanLocks=locks.filter(Boolean);
    if(mode!=='roster'&&!cleanLocks.length){renderError(host,'Choose a character to build around.');return}
    if(mode==='lock2'&&(cleanLocks.length<2||key(cleanLocks[0])===key(cleanLocks[1]))){renderError(host,'Choose two different characters for the 2-character lock.');return}
    setHtml(host,'<div class="notice info"><strong>Creating recommendations…</strong><br>Matching your saved roster against sourced team data.</div>');
    const catalog=await getCatalog(),state=loadState(),{normalized}=ownedNameSet(state,catalog),reaction=selectedReaction(card);
    const exact=matchReviewedTeams({roster:normalized,lockedNames:cleanLocks,allowUnowned,limit:12,reaction});
    if(exact.results?.length){setHtml(host,`<div class="team-results">${exact.results.map(sourcedCard).join('')}</div>`);return}
    if(exact.sourceResults?.length&&!allowUnowned){const preview=exact.sourceResults.slice(0,12);setHtml(host,`<div class="notice warn"><strong>Closest sourced preview</strong><br>No fully owned match exists for these locks, so Hotaru is showing the sourced teams anyway and marking missing characters. Turn on Allow unowned if you want missing-team results treated as normal results.</div><div class="team-results">${preview.map(sourcedCard).join('')}</div>`);return}
    if(mode==='lock2'){
      const flexible=buildFlexiblePairTeams({roster:normalized,lockedNames:cleanLocks,allowUnowned,limit:12,reaction});
      if(flexible.supported){
        const shown=flexible.results.length?flexible.results:(!allowUnowned?flexible.previewResults||[]:[]);
        if(shown.length){const previewCopy=!flexible.results.length&&!allowUnowned?' No fully owned bridge exists, so this is a missing-character preview.':'';setHtml(host,`<div class="notice warn"><strong>Flexible Pair Builder · Adapted, not reviewed</strong><br>${esc(flexible.rationale)}${esc(previewCopy)}</div><div class="team-results">${shown.map(flexibleCard).join('')}</div>`);return}
      }
    }
    if(exact.pendingLocks?.length){renderPending(host,exact.pendingLocks);return}
    setHtml(host,`<div class="notice info"><strong>No sourced pair could be built for this reaction filter.</strong><br>Try All reactions or another Team Reaction. Hotaru will keep the pair visible whenever source-backed coverage exists instead of silently returning a dead end.</div>`);
  }catch(error){renderError(host,error?.message||'Team recommendations could not be created.');}
  finally{generating=false;syncFullCatalogPickers()}
}

function schedulePickerPatch(){if(patchQueued)return;patchQueued=true;requestAnimationFrame(()=>{patchQueued=false;syncFullCatalogPickers()})}
if(app)new MutationObserver(schedulePickerPatch).observe(app,{childList:true,subtree:true});

document.addEventListener('click',event=>{
  const unownedRow=event.target.closest?.('.team-unowned');
  if(unownedRow?.closest('.smart-team-card')){const checkbox=unownedRow.querySelector('#team-allow-unowned');if(checkbox){event.preventDefault();event.stopPropagation();checkbox.checked=!checkbox.checked;checkbox.dispatchEvent(new Event('change',{bubbles:true}));return}}
  const button=event.target.closest?.('[data-action="generate-smart-team"]');if(!button)return;
  event.preventDefault();event.stopPropagation();generateVisibleTeam();
},{capture:true});

document.addEventListener('change',event=>{
  if(event.target?.id==='hotaru-team-picker-ownership'){
    const filter=PICKER_FILTERS.has(event.target.value)?event.target.value:'all';safeSet(PICKER_FILTER_KEY,filter);clearLocksExcludedByFilter(smartCard(),filter);schedulePickerPatch();return;
  }
  if(event.target?.id==='team-mode'||event.target?.id==='team-lock-1'||event.target?.id==='team-lock-2')schedulePickerPatch();
});
schedulePickerPatch();
