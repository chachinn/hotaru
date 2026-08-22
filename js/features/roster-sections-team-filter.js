import { TEAM_UTILITY_OPTIONS, teamMatchesUtility, teamUtilitySummary } from '../data/team-utility-tags.js';

const app=document.getElementById('app');
const SECTION_KEY='hotaru.roster-section.v1';
const UTILITY_KEY='hotaru.team-utility.v1';
const SECTIONS=[
  {id:'characters',heading:'Characters',label:'Roster Characters'},
  {id:'teams',heading:'Smart Team Creator',label:'Teams & Abyss'},
  {id:'farming',heading:'Smart Farming',label:'Farming'},
  {id:'weapons',heading:'Owned weapons',label:'Weapons'}
];
let patchQueued=false;

function safeGet(key,fallback=''){try{return localStorage.getItem(key)||fallback}catch{return fallback}}
function safeSet(key,value){try{localStorage.setItem(key,value)}catch{}}
function validSection(value){return SECTIONS.some(item=>item.id===value)?value:'characters'}
function validUtility(value){return TEAM_UTILITY_OPTIONS.some(item=>item.id===value)?value:'any'}
function rosterMain(){const main=app?.querySelector('main');return main?.querySelector('h1')?.textContent?.trim()==='My Roster'?main:null}
function sectionByHeading(main,heading){return[...main.querySelectorAll(':scope > section')].find(section=>section.querySelector('h2')?.textContent?.trim()===heading)||null}
function sectionMap(main){return new Map(SECTIONS.map(item=>[item.id,sectionByHeading(main,item.heading)]).filter(([,section])=>section))}
function activeSection(){return validSection(safeGet(SECTION_KEY,'characters'))}

function applyRosterSection(){
  const main=rosterMain();if(!main)return;
  const sections=sectionMap(main);if(!sections.size)return;
  const wanted=activeSection(),resolved=sections.has(wanted)?wanted:[...sections.keys()][0];
  for(const [id,section] of sections){
    section.id=`roster-${id}`;
    section.hidden=id!==resolved;
    section.dataset.hotaruRosterSection=id;
  }
  const oldJump=main.querySelector(':scope > .hotaru-section-jump');if(oldJump)oldJump.hidden=true;
  main.dataset.hotaruRosterActive=resolved;
}

function chooseRosterSection(id){
  const value=validSection(id);safeSet(SECTION_KEY,value);applyRosterSection();
  document.getElementById('hotaru-section-menu')?.querySelector('[data-hotaru-close-menu]')?.click();
  document.dispatchEvent(new CustomEvent('hotaru:roster-section-changed',{detail:{section:value}}));
  requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'smooth'}));
}

function utilityLabel(value){return TEAM_UTILITY_OPTIONS.find(item=>item.id===value)?.label||'No preference'}
function ensureUtilityControl(){
  const smart=document.querySelector('.smart-team-card');if(!smart)return null;
  const controls=smart.querySelector('.team-controls');if(!controls)return null;
  let field=controls.querySelector('.hotaru-team-utility-field');
  if(!field){
    field=document.createElement('div');
    field.className='field hotaru-team-utility-field';
    field.innerHTML=`<label for="hotaru-team-utility">Team needs</label><select id="hotaru-team-utility">${TEAM_UTILITY_OPTIONS.map(item=>`<option value="${item.id}">${item.label}</option>`).join('')}</select><small>Verified baseline utility only; Hotaru will not guess constellation-only roles.</small>`;
    const generate=controls.querySelector('.team-generate');
    if(generate)controls.insertBefore(field,generate);else controls.appendChild(field);
  }
  const select=field.querySelector('#hotaru-team-utility'),abyss=smart.querySelector('#team-mode')?.value==='abyss';
  const stored=validUtility(safeGet(UTILITY_KEY,'any'));
  if(select.value!==stored)select.value=stored;
  select.disabled=abyss;
  field.classList.toggle('disabled',abyss);
  const small=field.querySelector('small');if(small)small.textContent=abyss?'Utility filtering is disabled for the two-team Abyss planner.':'Verified baseline utility only; Hotaru will not guess constellation-only roles.';
  return select;
}

function cardMembers(card){return[...card.querySelectorAll('.team-members .team-member strong')].map(node=>node.textContent?.trim()).filter(Boolean)}
function syncUtilityHint(card,summary,requirement){
  let hint=card.querySelector('.hotaru-team-utility-hint');
  if(requirement==='any'){hint?.remove();return}
  const parts=[];
  if(summary.healerNames.length)parts.push(`Healing: ${summary.healerNames.join(', ')}`);
  if(summary.shielderNames.length)parts.push(`Shield: ${summary.shielderNames.join(', ')}`);
  if(!hint){hint=document.createElement('p');hint.className='muted small hotaru-team-utility-hint';card.querySelector('.team-members')?.after(hint)}
  if(hint)hint.textContent=parts.join(' · ');
}

function applyUtilityFilter(){
  const smart=document.querySelector('.smart-team-card');if(!smart)return;
  const select=ensureUtilityControl();if(!select)return;
  const abyss=smart.querySelector('#team-mode')?.value==='abyss',requirement=abyss?'any':validUtility(select.value);
  const results=smart.querySelector('.team-results');
  let empty=smart.querySelector('.hotaru-team-utility-empty');
  if(!results){empty?.remove();return}
  const cards=[...results.querySelectorAll(':scope > .team-card')];let visible=0;
  for(const card of cards){
    const members=cardMembers(card),summary=teamUtilitySummary(members),match=teamMatchesUtility(members,requirement);
    card.hidden=!match;
    if(match)visible+=1;
    syncUtilityHint(card,summary,requirement);
  }
  if(requirement!=='any'&&cards.length&&visible===0){
    if(!empty){empty=document.createElement('div');empty.className='notice info hotaru-team-utility-empty';results.after(empty)}
    empty.innerHTML=`<strong>No shown teams match “${utilityLabel(requirement)}”.</strong><br>Try Allow unowned or a different utility requirement. Hotaru will not relabel uncertain characters just to satisfy the filter.`;
  }else empty?.remove();
}

function patch(){patchQueued=false;applyRosterSection();applyUtilityFilter()}
function schedulePatch(){if(patchQueued)return;patchQueued=true;requestAnimationFrame(patch)}

if(app)new MutationObserver(schedulePatch).observe(app,{childList:true,subtree:true});

document.addEventListener('click',event=>{
  const rosterSection=event.target.closest('[data-hotaru-roster-section]');
  if(rosterSection){event.preventDefault();event.stopPropagation();chooseRosterSection(rosterSection.dataset.hotaruRosterSection);return}
  if(event.target.closest('[data-action="open-team-creator"]'))safeSet(SECTION_KEY,'teams');
  if(event.target.closest('[data-action="open-farm-planner"]'))safeSet(SECTION_KEY,'farming');
  const menuJump=event.target.closest('[data-hotaru-nav-jump]');if(menuJump)safeSet(SECTION_KEY,menuJump.dataset.hotaruNavJump==='teams'?'teams':'farming');
},{capture:true});

document.addEventListener('change',event=>{
  if(event.target?.id!=='hotaru-team-utility')return;
  safeSet(UTILITY_KEY,validUtility(event.target.value));applyUtilityFilter();
});

schedulePatch();
