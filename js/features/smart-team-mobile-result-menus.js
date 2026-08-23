const app=document.getElementById('app');
const CONTROL_META={
  'hotaru-team-result-filter':{title:'Show',key:'filter'},
  'hotaru-team-result-sort':{title:'Sort results',key:'sort'}
};
let scanQueued=false;

function mobileResultMenusEnabled(){
  try{return window.matchMedia?.('(pointer: coarse)')?.matches||window.matchMedia?.('(max-width: 700px)')?.matches||window.innerWidth<=700}catch{return true}
}
function closeMenus(except=null){
  document.querySelectorAll('.hotaru-mobile-result-control.is-open').forEach(control=>{
    if(except&&control===except)return;
    control.classList.remove('is-open');
    const toggle=control.querySelector('[data-hotaru-mobile-result-toggle]');
    const menu=control.querySelector('[data-hotaru-mobile-result-menu]');
    toggle?.setAttribute('aria-expanded','false');
    if(menu)menu.hidden=true;
  });
}
function syncControl(control,select){
  const toggle=control.querySelector('[data-hotaru-mobile-result-toggle]');
  const valueNode=control.querySelector('[data-hotaru-mobile-result-value]');
  const selected=select.options[select.selectedIndex];
  if(valueNode)valueNode.textContent=selected?.textContent||'';
  control.querySelectorAll('[data-hotaru-mobile-result-choice]').forEach(option=>{
    const isSelected=option.dataset.value===select.value;
    option.setAttribute('aria-selected',isSelected?'true':'false');
    option.classList.toggle('is-selected',isSelected);
    let check=option.querySelector('.hotaru-mobile-result-check');
    if(isSelected&&!check){check=document.createElement('span');check.className='hotaru-mobile-result-check';check.setAttribute('aria-hidden','true');check.textContent='✓';option.append(check)}
    else if(!isSelected&&check)check.remove();
  });
  toggle?.setAttribute('aria-expanded','false');
}
function optionButton(option,key){
  const button=document.createElement('button');
  button.type='button';
  button.className='hotaru-mobile-result-option';
  button.dataset.hotaruMobileResultChoice=key;
  button.dataset.value=option.value;
  button.setAttribute('role','option');
  button.setAttribute('aria-selected',option.selected?'true':'false');
  if(option.disabled){button.disabled=true;button.setAttribute('aria-disabled','true')}
  const label=document.createElement('span');label.textContent=option.textContent||option.value;button.append(label);
  if(option.selected){button.classList.add('is-selected');const check=document.createElement('span');check.className='hotaru-mobile-result-check';check.setAttribute('aria-hidden','true');check.textContent='✓';button.append(check)}
  return button;
}
function transformSelect(select){
  if(!mobileResultMenusEnabled()||select.dataset.hotaruMobileResultMenu==='true')return;
  const meta=CONTROL_META[select.id],label=select.closest('label');if(!meta||!label)return;
  const control=document.createElement('div');control.className='hotaru-mobile-result-control';control.dataset.hotaruMobileResultControl=meta.key;
  const caption=document.createElement('span');caption.className='hotaru-mobile-result-label';caption.textContent=meta.title;
  const toggle=document.createElement('button');toggle.type='button';toggle.className='hotaru-mobile-result-toggle';toggle.dataset.hotaruMobileResultToggle=meta.key;toggle.setAttribute('aria-haspopup','listbox');toggle.setAttribute('aria-expanded','false');
  const value=document.createElement('span');value.dataset.hotaruMobileResultValue='';
  const chevron=document.createElement('span');chevron.className='hotaru-mobile-result-chevron';chevron.setAttribute('aria-hidden','true');chevron.textContent='⌄';toggle.append(value,chevron);
  const menu=document.createElement('div');menu.className='hotaru-mobile-result-menu';menu.dataset.hotaruMobileResultMenu=meta.key;menu.setAttribute('role','listbox');menu.setAttribute('aria-label',meta.title);menu.hidden=true;
  [...select.options].forEach(option=>menu.append(optionButton(option,meta.key)));
  select.dataset.hotaruMobileResultMenu='true';select.classList.add('hotaru-mobile-native-select-hidden');select.tabIndex=-1;select.setAttribute('aria-hidden','true');
  label.before(control);control.append(caption,select,toggle,menu);label.remove();syncControl(control,select);
}
function scan(){scanQueued=false;if(!mobileResultMenusEnabled())return;Object.keys(CONTROL_META).forEach(id=>document.getElementById(id)&&transformSelect(document.getElementById(id)))}
function queueScan(){if(scanQueued)return;scanQueued=true;requestAnimationFrame(scan)}
if(app)new MutationObserver(queueScan).observe(app,{childList:true,subtree:true});
queueScan();
window.addEventListener('resize',queueScan,{passive:true});
document.addEventListener('click',event=>{
  const choice=event.target.closest?.('[data-hotaru-mobile-result-choice]');
  if(choice){event.preventDefault();event.stopPropagation();if(choice.disabled)return;const control=choice.closest('.hotaru-mobile-result-control'),select=control?.querySelector('select');if(!select)return;select.value=choice.dataset.value;syncControl(control,select);closeMenus();select.dispatchEvent(new Event('change',{bubbles:true}));const toggle=control.querySelector('[data-hotaru-mobile-result-toggle]');requestAnimationFrame(()=>toggle?.focus({preventScroll:true}));return}
  const toggle=event.target.closest?.('[data-hotaru-mobile-result-toggle]');
  if(toggle){event.preventDefault();event.stopPropagation();const control=toggle.closest('.hotaru-mobile-result-control'),menu=control?.querySelector('[data-hotaru-mobile-result-menu]');if(!control||!menu)return;const opening=menu.hidden;closeMenus(opening?control:null);menu.hidden=!opening;control.classList.toggle('is-open',opening);toggle.setAttribute('aria-expanded',opening?'true':'false');if(opening)requestAnimationFrame(()=>menu.querySelector('[aria-selected="true"]:not([disabled])')?.focus({preventScroll:true}));return}
  if(!event.target.closest?.('.hotaru-mobile-result-control'))closeMenus();
});
document.addEventListener('change',event=>{const select=event.target;if(!CONTROL_META[select?.id])return;const control=select.closest('.hotaru-mobile-result-control');if(control)syncControl(control,select)});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const control=document.querySelector('.hotaru-mobile-result-control.is-open');if(!control)return;event.preventDefault();const toggle=control.querySelector('[data-hotaru-mobile-result-toggle]');closeMenus();toggle?.focus({preventScroll:true})});
