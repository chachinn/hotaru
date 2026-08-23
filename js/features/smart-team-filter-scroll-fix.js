const RESULT_CONTROL_IDS=new Set(['hotaru-team-result-filter','hotaru-team-result-sort']);
const TOOLS_SELECTOR='.smart-team-card .hotaru-team-results-tools';
let pendingAnchor=null;

function captureAnchor(target){
  if(!RESULT_CONTROL_IDS.has(target?.id))return null;
  const tools=target.closest?.('.hotaru-team-results-tools');
  const top=tools?.getBoundingClientRect?.().top;
  if(!Number.isFinite(top))return null;
  return{top,scrollY:window.scrollY||window.pageYOffset||0};
}
function restoreAnchor(anchor){
  if(!anchor)return;
  const tools=document.querySelector(TOOLS_SELECTOR);
  if(tools){
    const currentTop=tools.getBoundingClientRect().top,delta=currentTop-anchor.top;
    if(Math.abs(delta)>.5){window.scrollBy({top:delta,left:0,behavior:'auto'});return}
  }
  const current=window.scrollY||window.pageYOffset||0;
  if(Math.abs(current-anchor.scrollY)>.5)window.scrollTo({top:anchor.scrollY,left:0,behavior:'auto'});
}
function scheduleRestore(anchor){
  if(!anchor)return;
  const restore=()=>restoreAnchor(anchor);
  requestAnimationFrame(()=>{restore();requestAnimationFrame(restore)});
  setTimeout(restore,80);
  setTimeout(restore,180);
}

document.addEventListener('pointerdown',event=>{
  const anchor=captureAnchor(event.target);
  if(anchor)pendingAnchor=anchor;
},{capture:true});

document.addEventListener('change',event=>{
  if(!RESULT_CONTROL_IDS.has(event.target?.id))return;
  const anchor=pendingAnchor||captureAnchor(event.target);
  pendingAnchor=null;
  scheduleRestore(anchor);
},{capture:true});
