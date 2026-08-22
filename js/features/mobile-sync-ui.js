const modalRoot=document.getElementById('modal-root');
let queued=false;

function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhanceImportModal()})}
function isAppleMobile(){return /iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}
function exporterLink(label='Download exporter file'){return`<a class="secondary hotaru-sync-download" href="./tools/hotaru-hoyolab-export.user.js" download="hotaru-hoyolab-export.user.js">${label}</a>`}
function enhanceExistingExporterLink(modal){
  const link=[...modal.querySelectorAll('a')].find(a=>String(a.getAttribute('href')||'').includes('hotaru-hoyolab-export.user.js'));if(!link)return;
  link.textContent='Download exporter file';link.setAttribute('download','hotaru-hoyolab-export.user.js');link.removeAttribute('target');
}
function mobileSyncMarkup(){
  const apple=isAppleMobile();
  return`<section class="section hotaru-mobile-sync" data-hotaru-mobile-sync><div class="hotaru-sync-head"><div><div class="eyebrow">Phone sync</div><h3>HoYoLAB on iPhone / iPad</h3><p class="muted small">Export from Safari, save the JSON to Files, then import it here. Hotaru never asks for your HoYoLAB password, cookie, ltoken or session token.</p></div><span class="pill ${apple?'good':'gray'}">${apple?'Apple device detected':'Safari-compatible flow'}</span></div><div class="hotaru-sync-actions"><a class="secondary" href="https://apps.apple.com/ph/app/stay-for-safari/id1591620171" target="_blank" rel="noopener">Get Stay for Safari</a>${exporterLink()}</div><ol class="hotaru-sync-steps"><li><strong>Enable a Safari userscript manager.</strong><span>Stay is one option. Allow it to run on HoYoLAB.</span></li><li><strong>Import Hotaru's exporter.</strong><span>Download the userscript above, then add that local file to your userscript manager and enable it.</span></li><li><strong>Open Genshin Battle Chronicle in Safari.</strong><span>Stay logged in to your own HoYoLAB account and open your Genshin character page.</span></li><li><strong>Tap “Export to Hotaru”.</strong><span>On supported iPhone/iPad browsers, the exporter uses the share sheet so you can choose <b>Save to Files</b>. It falls back to a normal JSON download when sharing files is unavailable.</span></li><li><strong>Come back to Hotaru.</strong><span>Tap <b>Choose account JSON</b> above and select the newest <code>hotaru-hoyolab-…json</code> file.</span></li></ol><div class="notice info"><strong>Mobile compatibility note</strong><br>This flow is built for Safari userscript managers that support userscript grants such as <code>unsafeWindow</code> and <code>GM.xmlHttpRequest</code>. If your manager blocks HoYoLAB API requests, the laptop/Tampermonkey route remains the fallback.</div></section>`;
}
function enhanceImportModal(){
  const modal=modalRoot?.querySelector('.modal');if(!modal)return;
  const title=modal.querySelector('.modal-head h2')?.textContent?.trim();if(title!=='Import account')return;
  enhanceExistingExporterLink(modal);
  if(modal.querySelector('[data-hotaru-mobile-sync]'))return;
  const details=modal.querySelector('details.section');if(details)details.insertAdjacentHTML('beforebegin',mobileSyncMarkup());else modal.insertAdjacentHTML('beforeend',mobileSyncMarkup());
}

if(modalRoot){const observer=new MutationObserver(queue);observer.observe(modalRoot,{childList:true,subtree:true})}
queue();