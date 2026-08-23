import { arlecchinoCompatibilityForCharacter } from '../data/character-compatibility/arlecchino.js';

function key(value=''){return String(value||'').trim().toLowerCase()}
function smartCard(){return document.querySelector('.smart-team-card')}
function resultsHost(card){return card?.querySelector(':scope > .section')||null}
function escapeHtml(value=''){return String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}

document.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-action="generate-smart-team"]');
  if(!button)return;
  const card=button.closest('.smart-team-card')||smartCard();
  if(!card||card.querySelector('#team-mode')?.value!=='lock2')return;
  const lock1=String(card.querySelector('#team-lock-1')?.value||'').trim();
  const lock2=String(card.querySelector('#team-lock-2')?.value||'').trim();
  const locks=[lock1,lock2].filter(Boolean);
  if(locks.length!==2||!locks.some(name=>key(name)==='arlecchino'))return;
  const other=locks.find(name=>key(name)!=='arlecchino');
  if(!other)return;
  const compatibility=arlecchinoCompatibilityForCharacter(other);
  if(compatibility.adaptationAllowed)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const host=resultsHost(card);
  if(host)host.innerHTML=`<div class="notice info"><strong>No source-backed Arlecchino pairing for ${escapeHtml(other)}.</strong><br>Hotaru checked the reviewed Arlecchino compatibility audit and will not manufacture an adapted team for this pair. Choose another lock, or use a sourced exact team when one becomes available.</div>`;
},{capture:true});
