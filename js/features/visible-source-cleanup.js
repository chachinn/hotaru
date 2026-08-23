const BRAND_RE=/\b(?:Game8|KQM|KeqingMains|Icy\s*Veins|HoYoLAB|Reddit|YouTube|TikTok|GitHub|Fandom)\b/gi;
const app=document.getElementById('app');
let cleanupQueued=false;
function clean(value=''){return String(value||'').replace(/\bKQM\s+warns\b/gi,'Reviewed guidance notes').replace(/\b(?:Game8|KQM|KeqingMains|Icy\s*Veins|HoYoLAB|Reddit|YouTube|TikTok|GitHub|Fandom)\s*(?:guide|reference|source|team|build)?\s*[:·–—-]?\s*/gi,'').replace(/\s{2,}/g,' ').replace(/^\s*[·:–—-]+\s*/,'').trim()}
function sanitize(root=document){root.querySelectorAll?.('.team-source,.hotaru-source-card,.abyss-cycle-sources').forEach(node=>node.remove());if(typeof NodeFilter==='undefined')return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const node of nodes){BRAND_RE.lastIndex=0;if(!BRAND_RE.test(node.nodeValue||''))continue;BRAND_RE.lastIndex=0;const next=clean(node.nodeValue||'');if(node.nodeValue!==next)node.nodeValue=next}}
function scheduleSanitize(){if(cleanupQueued)return;cleanupQueued=true;requestAnimationFrame(()=>{cleanupQueued=false;sanitize(app)})}
if(app)new MutationObserver(scheduleSanitize).observe(app,{childList:true,subtree:true,characterData:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>sanitize(document),{once:true});else sanitize(document);
export { sanitize as sanitizeVisibleSourceBranding };
