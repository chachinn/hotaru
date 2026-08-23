import { queryRecommendedTeams } from '../data/team-recommendations.js';
import { canonicalTeamCharacter } from '../data/team-profiles/index.js';

function key(value=''){return String(value||'').trim().toLowerCase()}
function unique(values=[]){return [...new Set((values||[]).filter(Boolean))]}
function weaponFor(entry,weapons=[]){return(weapons||[]).find(item=>String(item?.id||'')===String(entry?.weaponId||''))||entry?.equippedWeapon||null}
function needsProgression(entry={},weapon=null){
  const talents=entry?.talents||{},talentTotal=['attack','skill','burst'].reduce((sum,name)=>sum+Number(talents?.[name]||1),0),weaponLevel=weapon?Number(weapon.level||1):90;
  return Number(entry?.level||1)<90||talentTotal<24||weaponLevel<80;
}
function progressionReason(entry={},weapon=null){
  const parts=[],level=Number(entry?.level||1),talents=entry?.talents||{},talentTotal=['attack','skill','burst'].reduce((sum,name)=>sum+Number(talents?.[name]||1),0);
  if(level<90)parts.push(`Lv ${level} → 90`);if(talentTotal<24)parts.push(`Talents ${Number(talents.attack||1)}/${Number(talents.skill||1)}/${Number(talents.burst||1)}`);if(weapon&&Number(weapon.level||1)<80)parts.push(`Weapon Lv ${Number(weapon.level||1)}`);
  return parts.join(' · ')||'Build review';
}
function catalogIndex(characters=[]){return new Map((characters||[]).map(character=>[key(canonicalTeamCharacter(character.name)),character]))}
function rosterIndex(roster=[]){const map=new Map();for(const entry of roster||[]){for(const value of [entry?.teamName,entry?.name]){const normalized=key(canonicalTeamCharacter(value));if(normalized&&!map.has(normalized))map.set(normalized,entry)}}return map}
function sourceTeams(locks=[]){
  const exact=queryRecommendedTeams({lockedNames:locks});if(exact.length)return{teams:exact,exact:true};
  const fallback=unique(locks.flatMap(lock=>queryRecommendedTeams({lockedNames:[lock]})));return{teams:fallback,exact:false};
}
export function buildSmartTeamBuildRecommendations({lockedNames=[],roster=[],weapons=[],catalogCharacters=[],limit=10}={}){
  const locks=unique((lockedNames||[]).map(canonicalTeamCharacter).filter(Boolean)),locked=new Set(locks.map(key));if(!locks.length)return{locks,rows:[],exact:false};
  const rosterByName=rosterIndex(roster),catalogByName=catalogIndex(catalogCharacters),source=sourceTeams(locks),byName=new Map();
  for(const team of source.teams){
    for(const rawName of team.members||[]){const name=canonicalTeamCharacter(rawName),normalized=key(name);if(locked.has(normalized))continue;const entry=rosterByName.get(normalized);if(!entry)continue;const weapon=weaponFor(entry,weapons);if(!needsProgression(entry,weapon))continue;
      const prior=byName.get(normalized)||{name,entry,weapon,teamCount:0,reviewedCount:0,simulationCount:0,sourceNames:new Set(),teamNames:new Set()};prior.teamCount+=1;if(team.confidence==='Reviewed')prior.reviewedCount+=1;if(team.confidence==='Simulation-backed')prior.simulationCount+=1;if(team.source?.label)prior.sourceNames.add(team.source.label);if(team.name)prior.teamNames.add(team.name);byName.set(normalized,prior);
    }
  }
  const rows=[...byName.values()].map(row=>{const character=catalogByName.get(key(row.name))||{};return{name:row.name,id:String(row.entry?.id||''),icon:character.icon||character.image||'',level:Number(row.entry?.level||1),reason:progressionReason(row.entry,row.weapon),teamCount:row.teamCount,reviewedCount:row.reviewedCount,simulationCount:row.simulationCount,sourceNames:[...row.sourceNames],teamNames:[...row.teamNames],exact:source.exact}}).sort((a,b)=>b.reviewedCount-a.reviewedCount||b.teamCount-a.teamCount||a.level-b.level||a.name.localeCompare(b.name)).slice(0,Math.max(1,limit));
  return{locks,rows,exact:source.exact};
}
function esc(value=''){return String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
function recommendationMarkup(model){
  const locks=model.locks.join(' + ');if(!model.rows.length)return`<div class="notice info"><strong>No owned build recommendation right now.</strong><br>Hotaru did not find an underbuilt character in your roster with sourced team evidence for ${esc(locks)}. It will not invent one.</div>`;
  return`<div class="hotaru-build-rec-intro"><strong>Who to build for ${esc(locks)}</strong><span>${model.exact?'Based on sourced teams containing all selected characters.':'No exact shared source team was found, so these are sourced teammates for the selected characters individually.'}</span></div><div class="hotaru-build-rec-grid">${model.rows.map(row=>`<button type="button" class="hotaru-build-rec-card" data-hotaru-progression="${esc(row.id)}"><span class="hotaru-build-rec-media">${row.icon?`<img src="${esc(row.icon)}" alt="" loading="lazy" />`:'✦'}</span><span class="hotaru-build-rec-copy"><strong>${esc(row.name)}</strong><small>${esc(row.reason)}</small><em>${row.teamCount} sourced ${row.teamCount===1?'team':'teams'}${row.reviewedCount?` · ${row.reviewedCount} reviewed`:''}</em></span><span class="hotaru-build-rec-action">Materials ›</span></button>`).join('')}</div>`;
}
export function clearSmartTeamRecommendations(card=document.querySelector('.smart-team-card')){card?.querySelector('.hotaru-smart-team-view-tabs')?.remove();card?.querySelector('.hotaru-smart-team-recommendations')?.remove();const host=card?.querySelector(':scope > .section');if(host)host.hidden=false}
export function mountSmartTeamRecommendations({card=document.querySelector('.smart-team-card'),host=card?.querySelector(':scope > .section'),lockedNames=[],roster=[],weapons=[],catalogCharacters=[]}={}){
  if(!card||!host||!(lockedNames||[]).filter(Boolean).length){clearSmartTeamRecommendations(card);return null}const model=buildSmartTeamBuildRecommendations({lockedNames,roster,weapons,catalogCharacters});
  let tabs=card.querySelector('.hotaru-smart-team-view-tabs');if(!tabs){tabs=document.createElement('div');tabs.className='hotaru-smart-team-view-tabs segmented';host.before(tabs)}tabs.innerHTML=`<button type="button" class="active" data-hotaru-smart-team-view="teams">Teams</button><button type="button" data-hotaru-smart-team-view="recommendations">Recommendations${model.rows.length?` · ${model.rows.length}`:''}</button>`;
  let panel=card.querySelector('.hotaru-smart-team-recommendations');if(!panel){panel=document.createElement('section');panel.className='section hotaru-smart-team-recommendations';tabs.after(panel)}panel.hidden=true;panel.innerHTML=recommendationMarkup(model);host.hidden=false;return model;
}
if(typeof document!=='undefined')document.addEventListener('click',event=>{const button=event.target.closest?.('[data-hotaru-smart-team-view]');if(!button)return;const card=button.closest('.smart-team-card'),host=card?.querySelector(':scope > .section'),panel=card?.querySelector('.hotaru-smart-team-recommendations'),tabs=card?.querySelector('.hotaru-smart-team-view-tabs');if(!host||!panel||!tabs)return;event.preventDefault();const recommendations=button.dataset.hotaruSmartTeamView==='recommendations';for(const item of tabs.querySelectorAll('[data-hotaru-smart-team-view]'))item.classList.toggle('active',item===button);host.hidden=recommendations;panel.hidden=!recommendations;});
