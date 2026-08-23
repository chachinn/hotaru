import './character-section-shortcuts.js';
import './abyss-locked-core-ui.js';
import './visible-source-cleanup.js';
import './build-artifact-autofill.js';

if(!document.querySelector('link[data-character-section-shortcuts]')){
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='css/character-section-shortcuts.css?v=1.0.0';
  link.dataset.characterSectionShortcuts='1';
  document.head.appendChild(link);
}

function syncCharacterSearchClear(){
  const input=document.getElementById('character-search');
  if(!input)return;
  const shell=input.closest('.search');
  if(!shell)return;
  shell.classList.add('hotaru-character-search');
  let button=shell.querySelector('.hotaru-character-search-clear');
  if(!button){
    button=document.createElement('button');
    button.type='button';
    button.className='hotaru-character-search-clear';
    button.setAttribute('aria-label','Clear character search');
    button.title='Clear search';
    button.textContent='×';
    shell.appendChild(button);
  }
  button.hidden=!input.value;
}

document.addEventListener('input',event=>{if(event.target?.id==='character-search')syncCharacterSearchClear()});
document.addEventListener('click',event=>{
  const button=event.target.closest?.('.hotaru-character-search-clear');
  if(!button)return;
  const input=button.closest('.search')?.querySelector('#character-search');
  if(!input)return;
  input.value='';
  input.dispatchEvent(new Event('input',{bubbles:true}));
  try{input.focus({preventScroll:true})}catch{input.focus()}
});

const observer=new MutationObserver(()=>syncCharacterSearchClear());
const app=document.getElementById('app');
if(app)observer.observe(app,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncCharacterSearchClear,{once:true});else syncCharacterSearchClear();
