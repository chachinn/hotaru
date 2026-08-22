const RELEASE='v43';
const RELOAD_KEY=`hotaru.pwa-reload.${RELEASE}`;
let registration=null;
let updating=false;

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
async function registerFreshShell(){
  if(!('serviceWorker'in navigator))return;
  navigator.serviceWorker.addEventListener('controllerchange',reloadIntoFreshShell);
  try{
    registration=await navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'});
    await requestUpdate();
  }catch{}
}

registerFreshShell();
window.addEventListener('pageshow',()=>requestUpdate());
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')requestUpdate()});
