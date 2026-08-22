import { loadCatalog } from '../data/game-data.js';
import { loadCommunityTeamCatalog, COMMUNITY_TEAM_SOURCE } from '../data/community-team-catalog.js';
import { registerCommunityTeams, recommendationCoverage } from '../data/team-recommendations.js';

let status={state:'loading',teams:0,total:0,sixPlus:0,covered:0,pending:[],source:COMMUNITY_TEAM_SOURCE};
function esc(value=''){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function publish(){window.__hotaruTeamCatalogStatus=status;document.dispatchEvent(new CustomEvent('hotaru:team-catalog-updated',{detail:status}));patchTeamUI()}
function sourceNotice(){
  if(status.state==='loading')return`<strong>Expanding team QA…</strong><br>Loading reviewed and simulation-backed team variations.`;
  if(status.state==='unavailable')return`<strong>Reviewed teams are available; community variations are offline.</strong><br>Hotaru will not invent missing teams. The cached/reviewed core remains usable.`;
  const gap=status.total-status.sixPlus;
  return`<strong>Expanded team coverage · ${status.sixPlus}/${status.total} characters have 6+ recommendations</strong><br>${status.covered}/${status.total} have at least one sourced recommendation. ${gap?`${gap} still need additional verified variants.`:'Every released catalog character meets the 6-team target.'} Simulation-backed variations are clearly labeled and are not personalized DPS claims.`;
}
function patchTeamUI(){
  const card=document.querySelector('.smart-team-card');if(!card)return;
  const headPill=[...card.querySelectorAll('.section-head .pill')].find(node=>/Reviewed only/i.test(node.textContent||''));if(headPill)headPill.textContent='Reviewed + simulated';
  const generate=card.querySelector('.team-generate');if(generate&&/Create reviewed teams/i.test(generate.textContent||''))generate.textContent='Create team recommendations';
  let note=card.querySelector('#hotaru-team-source-status');if(!note){note=document.createElement('div');note.id='hotaru-team-source-status';note.className='notice info';const controls=card.querySelector('.team-controls');controls?.before(note)}
  if(note)note.innerHTML=sourceNotice();
  const emptyTitle=[...card.querySelectorAll('.empty h3')].find(node=>/Create from reviewed teams/i.test(node.textContent||''));if(emptyTitle)emptyTitle.textContent='Create from sourced team data';
}
function safeRefreshVisibleTeamCard(){
  const card=document.querySelector('.smart-team-card'),results=card?.querySelector('.team-results,.abyss-results');if(!card||results)return;
  const checkbox=card.querySelector('#team-allow-unowned');if(checkbox&&document.activeElement!==checkbox)checkbox.dispatchEvent(new Event('change',{bubbles:true}));
}
async function load(){
  try{
    const catalog=await loadCatalog();
    const result=await loadCommunityTeamCatalog({catalogCharacters:catalog?.characters||[]});
    const count=registerCommunityTeams(result.teams||[]),coverage=recommendationCoverage((catalog?.characters||[]).map(character=>character.name));
    status={state:result.status,teams:count,total:coverage.total,sixPlus:coverage.sixPlus,covered:coverage.covered,pending:coverage.pending,warning:result.warning||'',source:COMMUNITY_TEAM_SOURCE};
  }catch(error){status={...status,state:'unavailable',warning:error?.message||String(error)}}
  publish();safeRefreshVisibleTeamCard();setTimeout(patchTeamUI,0);
}

const observer=new MutationObserver(()=>patchTeamUI());observer.observe(document.documentElement,{subtree:true,childList:true});
publish();
if(document.readyState==='complete')setTimeout(load,150);else window.addEventListener('load',()=>setTimeout(load,150),{once:true});
