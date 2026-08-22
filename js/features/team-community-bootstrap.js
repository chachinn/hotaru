import { loadCatalog } from '../data/game-data.js';
import { loadCommunityTeamCatalog, COMMUNITY_TEAM_SOURCE } from '../data/community-team-catalog.js';
import { registerCommunityTeams } from '../data/team-recommendations.js';
import { auditTeamCatalog } from '../data/team-character-audit.js';

let status={state:'loading',teams:0,total:0,target:COMMUNITY_TEAM_SOURCE.coverageFloor||30,thirtyPlus:0,floorMet:0,sixPlus:0,covered:0,pending:[],sourceGaps:[],source:COMMUNITY_TEAM_SOURCE};
let patchQueued=false;

function setText(node,value=''){
  if(!node)return false;
  const next=String(value);
  if(node.textContent===next)return false;
  node.textContent=next;
  return true;
}
function setHTML(node,value=''){
  if(!node)return false;
  const next=String(value);
  if(node.innerHTML===next)return false;
  node.innerHTML=next;
  return true;
}
function publish(){window.__hotaruTeamCatalogStatus=status;document.dispatchEvent(new CustomEvent('hotaru:team-catalog-updated',{detail:status}));schedulePatch()}
function patchTeamCreator(){
  const card=document.querySelector('.smart-team-card');if(!card)return;
  const mode=card.querySelector('#team-mode')?.value||'roster',abyssMode=mode==='abyss';
  const eyebrow=card.querySelector('.section-head .eyebrow');if(!abyssMode)setText(eyebrow,'Sourced roster matching');
  const headPill=card.querySelector('.section-head .pill');if(!abyssMode)setText(headPill,'Reviewed + simulated');
  const generate=card.querySelector('.team-generate');if(!abyssMode)setText(generate,'Create team recommendations');
  // Coverage counters are QA diagnostics, not a user decision. Keep them out of the phone UI.
  card.querySelector('#hotaru-team-source-status')?.remove();
  // The legacy reviewed-only banner can mislabel characters that are covered by the sourced community feed
  // (and context-dependent characters such as Traveler/Manekin). Show coverage only when a chosen lock needs it.
  card.querySelector('.team-pending')?.remove();
  const emptyTitle=[...card.querySelectorAll('.empty h3')].find(node=>/Create from reviewed teams/i.test(node.textContent||''));setText(emptyTitle,'Create from sourced team data');
  const emptyCopy=[...card.querySelectorAll('.empty p')].find(node=>/reviewed team templates/i.test(node.textContent||''));setText(emptyCopy,'Hotaru matches your roster to sourced reviewed or simulation-backed compositions. It does not invent missing teams.');
  const noMatch=[...card.querySelectorAll('.notice.info strong')].find(node=>/No complete reviewed match/i.test(node.textContent||''));setText(noMatch,'No complete sourced match from this roster.');
  const pendingStrong=[...card.querySelectorAll('.notice.info strong')].find(node=>/Team review pending/i.test(node.textContent||''));setText(pendingStrong,'Team coverage pending');
  for(const paragraph of card.querySelectorAll('.notice.info')){
    const html=paragraph.innerHTML||'';
    if(!/does not have a reviewed Hotaru team profile yet/i.test(html))continue;
    setHTML(paragraph,html.replace(/does not have a reviewed Hotaru team profile yet/gi,'does not have sourced Hotaru team coverage yet').replace(/No reviewed template matches/gi,'No sourced recommendation matches').replace(/preview reviewed teams/gi,'preview sourced teams'));
  }
}
function patchGuideTeams(){
  for(const block of document.querySelectorAll('.hotaru-team-block')){
    const why=block.querySelector('.hotaru-team-why')?.textContent||'';if(!/Simulation-backed community composition/i.test(why))continue;
    setText(block.querySelector('.hotaru-team-title .pill'),'Simulation-backed');
  }
  const card=[...document.querySelectorAll('.hotaru-reference-card')].find(node=>node.querySelector('h2')?.textContent?.trim()==='Team comps');if(!card)return;
  const hasSim=[...card.querySelectorAll('.hotaru-team-why')].some(node=>/Simulation-backed community composition/i.test(node.textContent||''));if(!hasSim)return;
  setText(card.querySelector('.section-head .pill'),'Reviewed + simulated');
  const footer=[...card.querySelectorAll(':scope > p.muted.small')].at(-1);setText(footer,'Reviewed teams come from sourced theorycraft; simulation-backed variations come from GI-Rec/GCSim and use standardized assumptions rather than your personal account. Adjust for ownership, sustain, energy, enemies, and rotation needs.');
}
function patchUI(){patchTeamCreator();patchGuideTeams()}
function schedulePatch(){
  if(patchQueued)return;
  patchQueued=true;
  const run=()=>{patchQueued=false;patchUI()};
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(run);else setTimeout(run,0);
}
function safeRefreshVisibleTeamCard(){
  const card=document.querySelector('.smart-team-card'),results=card?.querySelector('.team-results,.abyss-results');if(!card||results)return;
  document.dispatchEvent(new CustomEvent('hotaru:team-catalog-ready',{detail:status}));
}
function refreshOpenCharacterGuide(){
  const deep=document.getElementById('hotaru-deep-guide');if(deep?.dataset.section==='build')deep.remove();
}
async function load(){
  try{
    const catalog=await loadCatalog();
    const result=await loadCommunityTeamCatalog({catalogCharacters:catalog?.characters||[]});
    const count=registerCommunityTeams(result.teams||[]),coverage=auditTeamCatalog(catalog?.characters||[],{target:COMMUNITY_TEAM_SOURCE.coverageFloor||30}),eligible=coverage.rows.filter(row=>row.teamEligible),covered=eligible.filter(row=>row.count>0);
    status={state:result.status,teams:count,total:coverage.total,eligible:coverage.teamEligible,notApplicable:coverage.notApplicable,target:COMMUNITY_TEAM_SOURCE.coverageFloor||30,thirtyPlus:coverage.thirtyPlus,floorMet:coverage.thirtyPlus,sixPlus:eligible.filter(row=>row.count>=6).length,covered:covered.length,pending:eligible.filter(row=>row.count===0),sourceGaps:coverage.sourceGaps,blockers:coverage.blockers,warning:result.warning||'',source:COMMUNITY_TEAM_SOURCE};
  }catch(error){status={...status,state:'unavailable',warning:error?.message||String(error)}}
  publish();refreshOpenCharacterGuide();safeRefreshVisibleTeamCard();schedulePatch();
}

const observer=new MutationObserver(schedulePatch);observer.observe(document.documentElement,{subtree:true,childList:true});
publish();
if(document.readyState==='complete')setTimeout(load,150);else window.addEventListener('load',()=>setTimeout(load,150),{once:true});
