const app=document.getElementById('app');
const CONTROL_META={
  'hotaru-team-result-filter':{title:'Show',key:'filter'},
  'hotaru-team-result-sort':{title:'Sort results',key:'sort'}
};
const PICKER_PANEL_ID='hotaru-mobile-result-picker-listbox';
let scanQueued=false;
let picker=null;
let active=null;

function mobileResultMenusEnabled(){
  try{return window.matchMedia?.('(pointer: coarse)')?.matches||window.matchMedia?.('(max-width: 700px)')?.matches||window.innerWidth<=700}catch{return true}
}
function ensurePicker(){
  if(picker?.root?.isConnected)return picker;
  const root=document.createElement('div');root.className='hotaru-mobile-result-picker';root.setAttribute('aria-hidden','false');
  const backdrop=document.createElement('div');backdrop.className='hotaru-mobile-result-picker-backdrop';backdrop.setAttribute('aria-hidden','true');
  const panel=document.createElement('div');panel.className='hotaru-mobile-result-picker-panel';panel.setAttribute('role','listbox');panel.id=PICKER_PANEL_ID;
  const head=document.createElement('div');head.className='hotaru-mobile-result-picker-head';
  const title=document.createElement('strong');title.className='hotaru-mobile-result-picker-title';
  const close=document.createElement('button');close.type='button';close.className='hotaru-mobile-result-picker-close';close.textContent='Done';close.setAttribute('aria-label','Close result menu');
  const list=document.createElement('div');list.className='hotaru-mobile-result-picker-options';
  head.append(title,close);panel.append(head,list);root.append(backdrop,panel);document.body.append(root);
  backdrop.addEventListener('click',event=>{event.preventDefault();closePicker()});
  close.addEventListener('click',event=>{event.preventDefault();closePicker()});
  list.addEventListener('click',event=>{
    const choice=event.target.closest?.('[data-hotaru-mobile-result-choice]');if(!choice||choice.disabled||!active)return;
    event.preventDefault();event.stopPropagation();
    const {select,control}=active;if(!select?.isConnected||!control?.isConnected){closePicker();return}
    select.value=choice.dataset.value;syncControl(control,select);closePicker();select.dispatchEvent(new Event('change',{bubbles:true}));
  });
  picker={root,backdrop,panel,title,close,list};return picker;
}
function optionButton(option){
  const button=document.createElement('button');button.type='button';button.className='hotaru-mobile-result-option';button.dataset.hotaruMobileResultChoice='true';button.dataset.value=option.value;button.setAttribute('role','option');button.setAttribute('aria-selected',option.selected?'true':'false');
  if(option.disabled){button.disabled=true;button.setAttribute('aria-disabled','true')}
  const label=document.createElement('span');label.textContent=option.textContent||option.value;button.append(label);
  if(option.selected){button.classList.add('is-selected');const check=document.createElement('span');check.className='hotaru-mobile-result-check';check.setAttribute('aria-hidden','true');check.textContent='✓';button.append(check)}
  return button;
}
function syncControl(control,select){
  const valueNode=control?.querySelector('[data-hotaru-mobile-result-value]'),selected=select?.options?.[select.selectedIndex];if(valueNode)valueNode.textContent=selected?.textContent||'';
}
function closePicker(){
  if(active?.toggle?.isConnected)active.toggle.setAttribute('aria-expanded','false');
  const focused=document.activeElement;if(picker?.root?.contains(focused)&&typeof focused?.blur==='function')focused.blur();
  if(picker?.root?.isConnected)picker.root.remove();
  picker=null;active=null;
}
function openPicker(control,select,toggle,meta){
  if(active?.select===select&&picker?.root?.isConnected){closePicker();return}
  closePicker();
  const ui=ensurePicker();active={control,select,toggle,meta};ui.title.textContent=meta.title;ui.panel.setAttribute('aria-label',meta.title);ui.list.replaceChildren(...[...select.options].map(optionButton));toggle.setAttribute('aria-expanded','true');
}
function transformSelect(select){
  if(!mobileResultMenusEnabled()||select.dataset.hotaruMobileResultMenu==='true')return;
  const meta=CONTROL_META[select.id],label=select.closest('label');if(!meta||!label)return;
  const control=document.createElement('div');control.className='hotaru-mobile-result-control';control.dataset.hotaruMobileResultControl=meta.key;
  const caption=document.createElement('span');caption.className='hotaru-mobile-result-label';caption.textContent=meta.title;
  const toggle=document.createElement('button');toggle.type='button';toggle.className='hotaru-mobile-result-toggle';toggle.dataset.hotaruMobileResultToggle=meta.key;toggle.setAttribute('aria-haspopup','listbox');toggle.setAttribute('aria-controls',PICKER_PANEL_ID);toggle.setAttribute('aria-expanded','false');
  const value=document.createElement('span');value.dataset.hotaruMobileResultValue='';
  const chevron=document.createElement('span');chevron.className='hotaru-mobile-result-chevron';chevron.setAttribute('aria-hidden','true');chevron.textContent='⌄';toggle.append(value,chevron);
  select.dataset.hotaruMobileResultMenu='true';select.classList.add('hotaru-mobile-native-select-hidden');select.tabIndex=-1;select.setAttribute('aria-hidden','true');
  label.before(control);control.append(caption,select,toggle);label.remove();syncControl(control,select);
  toggle.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openPicker(control,select,toggle,meta)});
}
function scan(){
  scanQueued=false;if(!mobileResultMenusEnabled()){closePicker();return}
  if(active&&(!active.control?.isConnected||!active.select?.isConnected))closePicker();
  Object.keys(CONTROL_META).forEach(id=>{const select=document.getElementById(id);if(select)transformSelect(select)});
}
function queueScan(){if(scanQueued)return;scanQueued=true;requestAnimationFrame(scan)}
function resetTransientPicker(){closePicker()}
if(app)new MutationObserver(queueScan).observe(app,{childList:true,subtree:true});
queueScan();
window.addEventListener('resize',queueScan,{passive:true});
window.addEventListener('orientationchange',resetTransientPicker,{passive:true});
window.addEventListener('pageshow',resetTransientPicker,{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')resetTransientPicker()});
document.addEventListener('change',event=>{const select=event.target;if(!CONTROL_META[select?.id])return;const control=select.closest('.hotaru-mobile-result-control');if(control)syncControl(control,select)});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&active){event.preventDefault();closePicker()}});
