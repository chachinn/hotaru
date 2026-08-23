const RELEASE='v47';
const RELOAD_KEY=`hotaru.pwa-reload.${RELEASE}`;
let registration=null;
let updating=false;
let refreshing=false;

function safeSessionGet(key){try{return sessionStorage.getItem(key)}catch{return null}}
function safeSessionSet(key,value){try{sessionStorage.setItem(key,value)}catch{}}
function shouldReload(){return !safeSessionGet(RELOAD_KEY)}
function reloadIntoFreshShell(){
  if(!shouldReload())return;
  safeSessionSet(RELOAD_KEY,'1');
  location.reload();
}
async function requestUpdate(){
  if(!registration||updating)return;
  updating=true;
  try{await registration.update()}catch{}finally{updating=false}
}
function refreshButton(){return document.getElementById('hotaru-app-refresh')}
function ensureRefreshButton(){
  const brand=document.querySelector('.topbar .brand');if(!brand||refreshButton())return;
  const button=document.createElement('button');button.id='hotaru-app-refresh';button.className='hotaru-app-refresh';button.type='button';button.setAttribute('aria-label','Refresh Hotaru and check for the latest update');button.title='Refresh Hotaru';button.textContent='↻';
  const status=brand.querySelector('.source-dot');if(status)brand.insertBefore(button,status);else brand.appendChild(button);
}
async function forceFreshRefresh(){
  if(refreshing)return;refreshing=true;const button=refreshButton();if(button)button.disabled=true;document.body?.classList.add('hotaru-refreshing');
  try{
    await requestUpdate();
    if(registration?.waiting)registration.waiting.postMessage({type:'SKIP_WAITING'});
    if('caches'in window&&navigator.onLine){
      const probe=await fetch(new URL('./index.html',location.href),{cache:'reload'});if(!probe.ok)throw new Error('Latest Hotaru shell is not reachable.');
      const keys=await caches.keys();await Promise.all(keys.filter(name=>name.startsWith('hotaru-shell-')).map(name=>caches.delete(name)));
    }
    location.reload();
  }catch{
    refreshing=false;if(button)button.disabled=false;document.body?.classList.remove('hotaru-refreshing');
  }
}
async function registerFreshShell(){
  if(!('serviceWorker'in navigator))return;
  navigator.serviceWorker.addEventListener('controllerchange',reloadIntoFreshShell);
  try{registration=await navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'});await requestUpdate()}catch{}
}

document.addEventListener('click',event=>{if(event.target.closest('#hotaru-app-refresh')){event.preventDefault();forceFreshRefresh()}},false);
const observer=new MutationObserver(ensureRefreshButton);observer.observe(document.documentElement,{childList:true,subtree:true});
ensureRefreshButton();
registerFreshShell();
window.addEventListener('pageshow',()=>{ensureRefreshButton();requestUpdate()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){ensureRefreshButton();requestUpdate()}});
