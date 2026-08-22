import { buildFlexiblePairTeams } from './flexible-pair-builder.js';

const app=document.getElementById('app');
let pendingGenerate=false;
let patchQueued=false;

function esc(value=''){return String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
function rosterFromSelect(select){return [...(select?.options||[])].map(option=>String(option.value||'').trim()).filter(Boolean).map((name,index)=>({id:`ui:${index}`,name}))}
function sourceLinks(source={}){const links=Array.isArray(source.links)&&source.links.length?source.links:[source];return links.filter(item=>item?.url).map(item=>`<a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.label||source.label||'Source')}</a>`).join(' · ')}
function card(team,index){return`<article class="team-card team-adapted"><div class="team-card-head"><div><div class="eyebrow">${index===0?'Best flexible fit':`Flexible option ${index+1}`}</div><h3>${esc(team.name)}</h3></div><div class="team-badges"><span class="pill ${team.ownedComplete?'good':'warn'}">Owned ${team.ownedCount}/4</span><span class="pill warn">Adapted · Off-meta</span></div></div><div class="team-members">${team.members.map(name=>`<div class="team-member ${team.missing.includes(name)?'missing':''}"><strong>${esc(name)}</strong><span>${team.missing.includes(name)?'Not owned':'Owned'}</span></div>`).join('')}</div><p class="muted small"><strong>Source structure:</strong> ${esc(team.adaptedFrom)}</p><p class="team-why">${esc(team.why)}</p><p class="muted small">${esc(team.notes)}</p><div class="team-source"><span>Cross-checked adaptation</span><div>${sourceLinks(team.source)}</div></div></article>`}
function setHtml(node,html){if(node&&node.innerHTML!==html)node.innerHTML=html}

function patchFlexiblePair(){
  if(!pendingGenerate)return;
  const smart=document.querySelector('.smart-team-card');if(!smart)return;
  const mode=smart.querySelector('#team-mode')?.value;if(mode!=='lock2'){pendingGenerate=false;return}
  const lock1=smart.querySelector('#team-lock-1')?.value||'',lock2=smart.querySelector('#team-lock-2')?.value||'';if(!lock1||!lock2||lock1===lock2){pendingGenerate=false;return}
  const host=smart.querySelector(':scope > .section');if(!host)return;
  if(host.querySelector('.team-results')){pendingGenerate=false;return}
  if(/Team review pending/i.test(host.textContent||'')){pendingGenerate=false;return}
  const roster=rosterFromSelect(smart.querySelector('#team-lock-1')),allowUnowned=Boolean(smart.querySelector('#team-allow-unowned')?.checked);
  const flexible=buildFlexiblePairTeams({roster,lockedNames:[lock1,lock2],allowUnowned,limit:12});
  if(!flexible.supported){pendingGenerate=false;return}
  if(!flexible.results.length){
    if(flexible.previewAvailable&&!allowUnowned)setHtml(host,'<div class="notice info"><strong>A flexible pair route exists, but it needs missing teammates.</strong><br>Turn on Allow unowned to preview mechanics-preserving Odette + Flins adaptations and see which support slots you are missing.</div>');
    pendingGenerate=false;
    return;
  }
  setHtml(host,`<div class="notice warn"><strong>Flexible Pair Builder · Adapted, not reviewed</strong><br>${esc(flexible.rationale)} Hotaru is preserving sourced mechanics instead of treating same-element characters as interchangeable.</div><div class="team-results">${flexible.results.map(card).join('')}</div>`);
  pendingGenerate=false;
}
function schedulePatch(){
  if(patchQueued)return;
  patchQueued=true;
  queueMicrotask(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{patchQueued=false;patchFlexiblePair()})));
}

document.addEventListener('click',event=>{
  if(!event.target.closest('[data-action="generate-smart-team"]'))return;
  pendingGenerate=true;
  schedulePatch();
},{capture:true});

if(app)new MutationObserver(()=>{if(pendingGenerate)schedulePatch()}).observe(app,{childList:true,subtree:true});
