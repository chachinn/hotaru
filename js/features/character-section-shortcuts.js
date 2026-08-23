const SHORTCUTS=[
  {id:'overview',label:'Overview',section:'overview',headings:['Hotaru profile']},
  {id:'build',label:'Build',section:'build',headings:[]},
  {id:'stats',label:'Stats',section:'build',headings:['Build Summary','Artifact main stats','General stat targets','Stat targets','Main stats']},
  {id:'artifacts',label:'Artifacts',section:'build',headings:['Artifact sets','Artifacts','Recommended Artifacts']},
  {id:'weapons',label:'Weapons',section:'build',headings:['Weapons','Recommended Weapons','Weapon recommendations']},
  {id:'talents',label:'Talents',section:'overview',headings:['Talents','Talent priority','Talent Priority']},
  {id:'teams',label:'Teams',section:'build',headings:['Teams','Team Recommendations','Recommended Teams','Best Teams']},
  {id:'materials',label:'Materials',section:'materials',headings:['Level & ascension materials','Ascension Materials']},
  {id:'farming',label:'Farming',section:'materials',headings:['Combined farm list','Talent estimate','Farming']}
];

const normalize=value=>String(value||'').replace(/\s+/g,' ').trim().toLowerCase();

function characterPage(){
  const segmented=document.querySelector('main .segmented');
  return segmented&&segmented.querySelector('[data-char-section]')?segmented:null;
}

function headingTarget(labels=[]){
  if(!labels.length)return null;
  const wanted=labels.map(normalize);
  const candidates=[...document.querySelectorAll('main h1, main h2, main h3, main .eyebrow, main .row-title, main strong')];
  const heading=candidates.find(node=>{
    const text=normalize(node.textContent);
    return wanted.some(label=>text===label||text.startsWith(label)||text.includes(label));
  });
  return heading?.closest('.card,.section,details')||heading||null;
}

function scrollTarget(target,behavior='smooth'){
  if(!target)return;
  const top=Math.max(0,target.getBoundingClientRect().top+window.scrollY-118);
  window.scrollTo({top,behavior});
  target.classList.add('character-shortcut-flash');
  window.setTimeout(()=>target.classList.remove('character-shortcut-flash'),700);
}

function waitForHeading(item,attempt=0){
  const target=headingTarget(item.headings);
  if(target){
    scrollTarget(target);
    return;
  }
  if(attempt<12){
    requestAnimationFrame(()=>waitForHeading(item,attempt+1));
    return;
  }
  // Never misroute a deep shortcut to the top of another section.
  // If the requested subsection is unavailable, keep the correct tab active
  // and leave the user's scroll position alone.
}

function activateShortcut(item){
  const segmented=characterPage();
  if(!segmented)return;
  const current=segmented.querySelector('[data-char-section].active')?.dataset.charSection;
  const tab=segmented.querySelector(`[data-char-section="${item.section}"]`);
  if(tab&&current!==item.section)tab.click();
  const settle=()=>{
    ensureShortcuts();
    document.querySelectorAll('[data-character-shortcut]').forEach(node=>node.classList.toggle('active',node.dataset.characterShortcut===item.id));
    if(item.headings.length){
      waitForHeading(item);
      return;
    }
    const activeTab=characterPage();
    if(item.id==='build')scrollTarget(activeTab?.nextElementSibling||activeTab);
    else if(item.id==='overview')scrollTarget(document.querySelector('main .detail-head'));
    else scrollTarget(activeTab?.nextElementSibling||activeTab);
  };
  requestAnimationFrame(()=>requestAnimationFrame(settle));
}

function ensureShortcuts(){
  const segmented=characterPage();
  if(!segmented)return;
  let bar=document.querySelector('.character-section-shortcuts');
  if(bar&&bar.previousElementSibling===segmented)return;
  bar?.remove();
  bar=document.createElement('nav');
  bar.className='character-section-shortcuts section';
  bar.setAttribute('aria-label','Character page shortcuts');
  bar.innerHTML=`<div class="character-shortcut-scroll">${SHORTCUTS.map(item=>`<button type="button" class="character-shortcut-chip" data-character-shortcut="${item.id}">${item.label}</button>`).join('')}</div>`;
  segmented.insertAdjacentElement('afterend',bar);
  bar.addEventListener('click',event=>{
    const button=event.target.closest('[data-character-shortcut]');
    if(!button)return;
    const item=SHORTCUTS.find(entry=>entry.id===button.dataset.characterShortcut);
    if(item)activateShortcut(item);
  });
}

let queued=false;
const observer=new MutationObserver(()=>{
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;ensureShortcuts()});
});
observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
window.addEventListener('pageshow',ensureShortcuts);
ensureShortcuts();
