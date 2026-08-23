import { arlecchinoCompatibilityForCharacter } from '../data/character-compatibility/arlecchino.js';
import { columbinaCompatibilityForCharacter } from '../data/character-compatibility/columbina.js';

function key(value=''){return String(value||'').trim().toLowerCase()}
function smartCard(){return document.querySelector('.smart-team-card')}
function resultsHost(card){return card?.querySelector(':scope > .section')||null}
function escapeHtml(value=''){return String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
const policyFor=name=>key(name)==='arlecchino'?arlecchinoCompatibilityForCharacter:key(name)==='columbina'?columbinaCompatibilityForCharacter:null;

document.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-action="generate-smart-team"]');
  if(!button)return;
  const card=button.closest('.smart-team-card')||smartCard();
  if(!card||card.querySelector('#team-mode')?.value!=='lock2')return;
  const lock1=String(card.querySelector('#team-lock-1')?.value||'').trim();
  const lock2=String(card.querySelector('#team-lock-2')?.value||'').trim();
  const locks=[lock1,lock2].filter(Boolean);
  if(locks.length!==2)return;
  const reviewed=locks.find(name=>policyFor(name));
  if(!reviewed)return;
  const other=locks.find(name=>key(name)!==key(reviewed));
  if(!other)return;
  const compatibility=policyFor(reviewed)(other);
  if(compatibility.adaptationAllowed)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const host=resultsHost(card);
  if(host)host.innerHTML=`<div class="notice info"><strong>No source-backed ${escapeHtml(reviewed)} pairing for ${escapeHtml(other)}.</strong><br>Hotaru checked the reviewed ${escapeHtml(reviewed)} compatibility audit and will not manufacture an adapted team for this pair. Choose another lock or use a sourced reviewed team.</div>`;
},{capture:true});
