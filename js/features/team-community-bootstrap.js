import { loadCatalog } from '../data/game-data.js';
import { loadCommunityTeamCatalog, COMMUNITY_TEAM_SOURCE } from '../data/community-team-catalog.js';
import { registerCommunityTeams, recommendationCoverage } from '../data/team-recommendations.js';

let status={state:'loading',teams:0,total:0,sixPlus:0,covered:0,pending:[],source:COMMUNITY_TEAM_SOURCE};
function publish(){window.__hotaruTeamCatalogStatus=status;document.dispatchEvent(new CustomEvent('hotaru:team-catalog-updated',{detail:status}));patchUI()}
function sourceNotice(){
  if(status.state==='loading')return`<strong>Expanding team QA…</strong><br>Loading reviewed and simulation-backed team variations.`;
  if(status.state==='unavailable')return`<strong>Reviewed teams are available; community variations are offline.</strong><br>Hotaru will not invent missing teams. The cached/reviewed core remains usable.`;
  const gap=status.total-status.sixPlus;
  return`<strong>Expanded team coverage · ${status.sixPlus}/${status.total} characters have 6+ recommendations</strong><br>${status.covered}/${status.total} have at least one sourced recommendation. ${gap?`${gap} still need additional verified variants.`:'Every released catalog character meets the 6-team target.'} Simulation-backed variations are clearly labeled and are not personalized DPS claims.`;
}
function replaceText(node,pattern,replacement){if(node&&pattern.test(node.textContent||''))node.textContent=replacement}
function patchTeamCreator(){
  const card=document.querySelector('.smart-team-card');if(!card)return;
  const mode=card.querySelector('#team-mode')?.value||'roster',abyssMode=mode==='abyss';
  const eyebrow=card.querySelector('.section-head .eyebrow');if(eyebrow&&!abyssMode)eyebrow.textContent='Sourced roster matching';
  const headPill=card.querySelector('.section-head .pill');if(headPill&&!abyssMode)headPill.textContent='Reviewed + simulated';
  const generate=card.querySelector('.team-generate');if(generate&&!abyssMode)generate.textContent='Create team recommendations';
  let note=card.querySelector('#hotaru-team-source-status');
  if(!abyssMode){if(!note){note=document.createElement('div');note.id='hotaru-team-source-status';note.className='notice info';const controls=card.querySelector('.team-controls');controls?.before(note)}if(note)note.innerHTML=sourceNotice()}else note?.remove();
  const emptyTitle=[...card.querySelectorAll('.empty h3')].find(node=>/Create from reviewed teams/i.test(node.textContent||''));if(emptyTitle)emptyTitle.textContent='Create from sourced team data';
  const emptyCopy=[...card.querySelectorAll('.empty p')].find(node=>/reviewed team templates/i.test(node.textContent||''));if(emptyCopy)emptyCopy.textContent='Hotaru matches your roster to sourced reviewed or simulation-backed compositions. It does not invent missing teams.';
  const noMatch=[...card.querySelectorAll('.notice.info strong')].find(node=>/No complete reviewed match/i.test(node.textContent||''));if(noMatch)noMatch.textContent='No complete sourced match from this roster.';
  const pendingStrong=[...card.querySelectorAll('.notice.info strong')].find(node=>/Team review pending/i.test(node.textContent||''));if(pendingStrong)pendingStrong.textContent='Team coverage pending';
  for(const paragraph of card.querySelectorAll('.notice.info')){
    if(/does not have a reviewed Hotaru team profile yet/i.test(paragraph.textContent||''))paragraph.innerHTML=paragraph.innerHTML.replace(/does not have a reviewed Hotaru team profile yet/gi,'does not have sourced Hotaru team coverage yet').replace(/No reviewed template matches/gi,'No sourced recommendation matches').replace(/preview reviewed teams/gi,'preview sourced teams');
  }
}
function patchGuideTeams(){
  for(const block of document.querySelectorAll('.hotaru-team-block')){
    const why=block.querySelector('.hotaru-team-why')?.textContent||'';if(!/Simulation-backed community composition/i.test(why))continue;
    const pill=block.querySelector('.hotaru-team-title .pill');if(pill)pill.textContent='Simulation-backed';
  }
  const card=[...document.querySelectorAll('.hotaru-reference-card')].find(node=>node.querySelector('h2')?.textContent?.trim()==='Team comps');if(!card)return;
  const hasSim=[...card.querySelectorAll('.hotaru-team-why')].some(node=>/Simulation-backed community composition/i.test(node.textContent||''));if(!hasSim)return;
  const headerPill=card.querySelector('.section-head .pill');if(headerPill)headerPill.textContent='Reviewed + simulated';
  const footer=[...card.querySelectorAll(':scope > p.muted.small')].at(-1);if(footer)footer.textContent='Reviewed teams come from sourced theorycraft; simulation-backed variations come from GI-Rec/GCSim and use standardized assumptions rather than your personal account. Adjust for ownership, sustain, energy, enemies, and rotation needs.';
}
function patchUI(){patchTeamCreator();patchGuideTeams()}
function safeRefreshVisibleTeamCard(){
  const card=document.querySelector('.smart-team-card'),results=card?.querySelector('.team-results,.abyss-results');if(!card||results)return;
  const checkbox=card.querySelector('#team-allow-unowned');if(checkbox&&document.activeElement!==checkbox)checkbox.dispatchEvent(new Event('change',{bubbles:true}));
}
function refreshOpenCharacterGuide(){
  const deep=document.getElementById('hotaru-deep-guide');if(deep?.dataset.section==='build')deep.remove();
}
async function load(){
  try{
    const catalog=await loadCatalog();
    const result=await loadCommunityTeamCatalog({catalogCharacters:catalog?.characters||[]});
    const count=registerCommunityTeams(result.teams||[]),coverage=recommendationCoverage((catalog?.characters||[]).map(character=>character.name));
    status={state:result.status,teams:count,total:coverage.total,sixPlus:coverage.sixPlus,covered:coverage.covered,pending:coverage.pending,warning:result.warning||'',source:COMMUNITY_TEAM_SOURCE};
  }catch(error){status={...status,state:'unavailable',warning:error?.message||String(error)}}
  publish();refreshOpenCharacterGuide();safeRefreshVisibleTeamCard();setTimeout(patchUI,0);
}

const observer=new MutationObserver(()=>patchUI());observer.observe(document.documentElement,{subtree:true,childList:true});
publish();
if(document.readyState==='complete')setTimeout(load,150);else window.addEventListener('load',()=>setTimeout(load,150),{once:true});