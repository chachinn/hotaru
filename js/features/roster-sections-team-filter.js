import { TEAM_UTILITY_OPTIONS, teamMatchesUtility, teamUtilitySummary } from '../data/team-utility-tags.js';
import { TEAM_REACTIONS } from '../data/team-reaction-tags.js';

const app=document.getElementById('app');
const SECTION_KEY='hotaru.roster-section.v1';
const UTILITY_KEY='hotaru.team-utility.v1';
const UTILITY_CATEGORY_KEY='hotaru.team-utility-category.v1';
const REACTION_KEY='hotaru.team-reaction.v1';
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
function validReaction(value){return value==='all'||TEAM_REACTIONS.some(item=>item.id===value)?value:'all'}
function utilityOption(value){return TEAM_UTILITY_OPTIONS.find(item=>item.id===validUtility(value))||TEAM_UTILITY_OPTIONS[0]}
function rosterMain(){const main=app?.querySelector('main');return main?.querySelector('h1')?.textContent?.trim()==='My Roster'?main:null}
function sectionByHeading(main,heading){return[...main.querySelectorAll(':scope > section')].find(section=>section.querySelector('h2')?.textContent?.trim()===heading)||null}
function sectionMap(main){return new Map(SECTIONS.map(item=>[item.id,sectionByHeading(main,item.heading)]).filter(([,section])=>section))}
function activeSection(){return validSection(safeGet(SECTION_KEY,'characters'))}
function setText(node,text){if(node&&node.textContent!==text)node.textContent=text}
function setHtml(node,html){if(node&&node.innerHTML!==html)node.innerHTML=html}

function applyRosterSection(){
  const main=rosterMain();if(!main)return;
  const sections=sectionMap(main);if(!sections.size)return;
  const wanted=activeSection(),resolved=sections.has(wanted)?wanted:[...sections.keys()][0];
  for(const [id,section] of sections){section.id=`roster-${id}`;section.hidden=id!==resolved;section.dataset.hotaruRosterSection=id}
  const oldJump=main.querySelector(':scope > .hotaru-section-jump');if(oldJump)oldJump.hidden=true;
  main.dataset.hotaruRosterActive=resolved;
}

function openRosterTab(){
  if(rosterMain())return;
  const tab=app?.querySelector('.bottom-nav [data-tab="roster"]');
  if(tab){tab.click();return}
  const fallback=document.createElement('button');fallback.type='button';fallback.dataset.tab='roster';fallback.hidden=true;document.body.appendChild(fallback);fallback.click();fallback.remove();
}
function chooseRosterSection(id){
  const value=validSection(id);safeSet(SECTION_KEY,value);
  document.getElementById('hotaru-section-menu')?.querySelector('[data-hotaru-close-menu]')?.click();
  openRosterTab();
  requestAnimationFrame(()=>{applyRosterSection();document.dispatchEvent(new CustomEvent('hotaru:roster-section-changed',{detail:{section:value}}));window.scrollTo({top:0,behavior:'smooth'})});
}

function utilityLabel(value){return utilityOption(value).label}
function utilityOptionsHtml(){
  const any=TEAM_UTILITY_OPTIONS.find(item=>item.id==='any');
  const sustain=TEAM_UTILITY_OPTIONS.filter(item=>item.category==='sustain');
  const utility=TEAM_UTILITY_OPTIONS.filter(item=>item.category==='utility');
  const options=items=>items.map(item=>`<option value="${item.id}">${item.label}</option>`).join('');
  return`<option value="${any?.id||'any'}">${any?.label||'No preference'}</option><optgroup label="Sustain">${options(sustain)}</optgroup><optgroup label="Utility">${options(utility)}</optgroup>`;
}
function storedUtility(){return validUtility(safeGet(UTILITY_KEY,'any'))}
function storedReaction(){return validReaction(safeGet(REACTION_KEY,'all'))}
function reactionOptionsHtml(){
  const normal=TEAM_REACTIONS.filter(item=>!item.id.startsWith('lunar-')&&!item.id.startsWith('stellar-'));
  const lunar=TEAM_REACTIONS.filter(item=>item.id.startsWith('lunar-'));
  const stellar=TEAM_REACTIONS.filter(item=>item.id.startsWith('stellar-'));
  const options=items=>items.map(item=>`<option value="${item.id}">${item.label}</option>`).join('');
  return`<option value="all">All reactions</option><optgroup label="Reactions">${options(normal)}</optgroup><optgroup label="Lunar">${options(lunar)}</optgroup><optgroup label="Stellar">${options(stellar)}</optgroup>`;
}
function ensureReactionControl(smart,controls){
  let field=controls.querySelector('.hotaru-team-reaction-field');
  if(!field){field=document.createElement('div');field.className='field hotaru-team-reaction-field';field.innerHTML=`<label for="hotaru-team-reaction">Team Reaction</label><select id="hotaru-team-reaction">${reactionOptionsHtml()}</select><small>Filter by explicit sourced tags: classic reactions, Lunar-Charged/Bloom/Crystallize, and Stellar-Conduct/Swirl. Vaporize remains a classic reaction.</small>`;const generate=controls.querySelector('.team-generate');if(generate)controls.insertBefore(field,generate);else controls.appendChild(field)}
  const select=field.querySelector('#hotaru-team-reaction'),abyss=smart.querySelector('#team-mode')?.value==='abyss',stored=storedReaction();if(select&&select.value!==stored)select.value=stored;select.disabled=abyss;field.classList.toggle('disabled',abyss);setText(field.querySelector('small'),abyss?'Team Reaction filtering is disabled for Current Abyss because it builds two teams together.':'Filter by explicit sourced tags: classic reactions, Lunar-Charged/Bloom/Crystallize, and Stellar-Conduct/Swirl. Vaporize remains a classic reaction.');return{select};
}
function ensureUtilityControl(){
  const smart=document.querySelector('.smart-team-card');if(!smart)return null;
  const controls=smart.querySelector('.team-controls');if(!controls)return null;
  ensureReactionControl(smart,controls);
  let field=controls.querySelector('.hotaru-team-utility-field');
  if(!field){
    field=document.createElement('div');field.className='field hotaru-team-utility-field';
    field.innerHTML=`<label for="hotaru-team-utility">Team Need</label><select id="hotaru-team-utility">${utilityOptionsHtml()}</select><small>Optional: filter the shown recommendations by one verified baseline role.</small>`;
    const generate=controls.querySelector('.team-generate');if(generate)controls.insertBefore(field,generate);else controls.appendChild(field);
  }
  const select=field.querySelector('#hotaru-team-utility'),abyss=smart.querySelector('#team-mode')?.value==='abyss',stored=storedUtility();
  if(select&&select.value!==stored)select.value=stored;
  select.disabled=abyss;field.classList.toggle('disabled',abyss);
  setText(field.querySelector('small'),abyss?'Team Need filtering is only for single-team recommendations; Current Abyss builds two teams together.':'Optional: filter the shown recommendations by one verified baseline role.');
  return{select};
}

function cardMembers(card){return[...card.querySelectorAll('.team-members .team-member strong')].map(node=>node.textContent?.trim()).filter(Boolean)}
const HINT_FIELDS=[
  ['healerNames','Healing'],['shielderNames','Shield'],['bufferNames','Buffer'],['debufferNames','Debuff / RES shred'],['crowdControlNames','Grouping'],['interruptionResistanceNames','Interruption resistance'],['batteryNames','Energy / Battery'],['offFieldDpsNames','Off-field DPS']
];
function syncUtilityHint(card,summary,requirement){
  let hint=card.querySelector('.hotaru-team-utility-hint');if(requirement==='any'){hint?.remove();return}
  const parts=[];for(const [field,label] of HINT_FIELDS){if(summary[field]?.length)parts.push(`${label}: ${summary[field].join(', ')}`)}
  if(!hint){hint=document.createElement('p');hint.className='muted small hotaru-team-utility-hint';card.querySelector('.team-members')?.after(hint)}
  setText(hint,parts.join(' · '));
}

function applyUtilityFilter(){
  const smart=document.querySelector('.smart-team-card');if(!smart)return;
  const control=ensureUtilityControl();if(!control)return;
  const abyss=smart.querySelector('#team-mode')?.value==='abyss',requirement=abyss?'any':validUtility(control.select.value);
  const results=smart.querySelector('.team-results');let empty=smart.querySelector('.hotaru-team-utility-empty');if(!results){empty?.remove();return}
  const cards=[...results.querySelectorAll(':scope > .team-card')];let visible=0;
  for(const card of cards){const members=cardMembers(card),summary=teamUtilitySummary(members),match=teamMatchesUtility(members,requirement);card.hidden=!match;if(match)visible+=1;syncUtilityHint(card,summary,requirement)}
  if(requirement!=='any'&&cards.length&&visible===0){
    if(!empty){empty=document.createElement('div');empty.className='notice info hotaru-team-utility-empty';results.after(empty)}
    setHtml(empty,`<strong>No shown teams match “${utilityLabel(requirement)}”.</strong><br>Try Allow unowned or a different Team Need. Hotaru will not relabel uncertain characters or invent a team just to satisfy the filter.`);
  }else empty?.remove();
}

function patch(){patchQueued=false;applyRosterSection();applyUtilityFilter()}
function schedulePatch(){if(patchQueued)return;patchQueued=true;requestAnimationFrame(patch)}
if(app)new MutationObserver(schedulePatch).observe(app,{childList:true,subtree:true});

document.addEventListener('click',event=>{
  const rosterSection=event.target.closest('[data-hotaru-roster-section]');if(rosterSection){event.preventDefault();event.stopPropagation();chooseRosterSection(rosterSection.dataset.hotaruRosterSection);return}
  if(event.target.closest('[data-action="open-team-creator"]'))safeSet(SECTION_KEY,'teams');
  if(event.target.closest('[data-action="open-farm-planner"]'))safeSet(SECTION_KEY,'farming');
  const menuJump=event.target.closest('[data-hotaru-nav-jump]');if(menuJump)safeSet(SECTION_KEY,menuJump.dataset.hotaruNavJump==='teams'?'teams':'farming');
},{capture:true});

document.addEventListener('change',event=>{
  if(event.target?.id==='hotaru-team-reaction'){safeSet(REACTION_KEY,validReaction(event.target.value));return}
  if(event.target?.id!=='hotaru-team-utility')return;
  const requirement=validUtility(event.target.value);safeSet(UTILITY_KEY,requirement);safeSet(UTILITY_CATEGORY_KEY,utilityOption(requirement).category||'any');applyUtilityFilter();
});
schedulePatch();
