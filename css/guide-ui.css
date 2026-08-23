import { profileSourceLabel, profileSources } from './build-profiles.js';
import { sampleTeams } from './guide-engine.js';

const esc=value=>String(value??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function safeUrl(value=''){try{const url=new URL(String(value||''));return/^https?:$/.test(url.protocol)?url.href:''}catch{return''}}
function cardByHeading(root,text){return [...root.querySelectorAll('.hotaru-reference-card')].find(card=>[...card.querySelectorAll('h2')].some(h=>h.textContent.trim()===text))}
function renameHeading(root,from,to){const card=cardByHeading(root,from);const heading=card?.querySelector('h2');if(heading)heading.textContent=to;return card}
function reorderRows(container,priority=[]){if(!container||!priority.length)return;const order=new Map(priority.map((name,index)=>[String(name).toLowerCase(),index]));const rows=[...container.children];rows.sort((a,b)=>{const an=a.querySelector('strong')?.textContent?.trim().toLowerCase()||'',bn=b.querySelector('strong')?.textContent?.trim().toLowerCase()||'';const ai=order.get(an),bi=order.get(bn);return(ai??999)-(bi??999)}).forEach(row=>container.appendChild(row))}
function reorderTalent(card,priority=[]){if(!card||!priority.length)return;const labels={attack:'Normal Attack',skill:'Elemental Skill',burst:'Elemental Burst'},order=priority.map(key=>labels[String(key).toLowerCase()]).filter(Boolean),grid=card.querySelector('.hotaru-priority-grid');if(!grid)return;const rows=[...grid.children];rows.sort((a,b)=>order.indexOf(a.querySelector('strong')?.textContent?.trim())-order.indexOf(b.querySelector('strong')?.textContent?.trim())).forEach((row,index)=>{const badge=row.querySelector('b');if(badge)badge.textContent=`${index+1}${index===0?'st':index===1?'nd':'rd'}`;grid.appendChild(row)})}
function equipmentButton(kind,name,label=name){return`<button type="button" class="hotaru-build-equipment-link" data-hotaru-${kind}="${esc(name)}">${esc(label)}</button>`}
function mainStatRows(profile){return[['Sands',(profile.mainStats?.sands||[]).join(' / ')],['Goblet',(profile.mainStats?.goblet||[]).join(' / ')],['Circlet',(profile.mainStats?.circlet||[]).join(' / ')]].filter(([,value])=>value)}
function sampleTeamRows(profile,detail,catalog){if(Array.isArray(profile?.buildSummaryTeams)&&profile.buildSummaryTeams.length)return profile.buildSummaryTeams.slice(0,2).map(team=>({name:team.name,members:(team.members||[]).map(name=>({name}))}));try{return sampleTeams(detail||{},catalog||{}).slice(0,2)}catch{return[]}}
function summaryCard(profile,detail,catalog){
  const weapons=(profile.weaponPriority||[]).filter(Boolean),bestWeapon=weapons[0]||'',replacement=weapons.slice(1,4),artifact=(profile.artifactPriority||[]).filter(Boolean)[0]||'',teams=sampleTeamRows(profile,detail,catalog),stats=mainStatRows(profile),substats=(profile.substats||[]).join(', ');
  return`<section class="section card hotaru-reference-card hotaru-game8-card hotaru-build-summary"><div class="section-head"><div><div class="eyebrow">${esc(profile.role||'Recommended build')}</div><h2>Build Summary</h2></div><span class="pill ${profile.profileSource==='reviewed'?'good':'warn'}">${esc(profileSourceLabel(profile))}</span></div><div class="hotaru-build-table" role="table" aria-label="Build summary">
    <div class="hotaru-build-table-row"><strong>Best Weapon</strong><div>${bestWeapon?equipmentButton('weapon',bestWeapon):'See ranked weapons below'}</div></div>
    <div class="hotaru-build-table-row"><strong>Replacement Weapons</strong><div class="hotaru-build-ranked-links">${replacement.length?replacement.map((name,index)=>`<span><b>${index+1}.</b>${equipmentButton('weapon',name)}</span>`).join(''):'See ranked weapons below'}</div></div>
    <div class="hotaru-build-table-row"><strong>Best Artifacts</strong><div>${artifact?equipmentButton('artifact',artifact,`${artifact} ×4`):'See ranked artifacts below'}</div></div>
    <div class="hotaru-build-table-row"><strong>Artifact Main Stats</strong><div class="hotaru-build-mainstats">${stats.map(([slot,value])=>`<span><b>${esc(slot)}:</b> ${esc(value)}</span>`).join('')}</div></div>
    <div class="hotaru-build-table-row"><strong>Artifact Sub Stats</strong><div>${esc(substats||'See reviewed stat priority')}</div></div>
    <div class="hotaru-build-table-row"><strong>Sample Teams</strong><div class="hotaru-build-sample-teams">${teams.length?teams.map(team=>`<span><b>${esc(team.name)}</b>${(team.members||[]).slice(0,4).map(member=>`<i>${esc(member.name)}</i>`).join('')}</span>`).join(''):'See Best Team Comps below'}</div></div>
  </div><p class="muted small hotaru-build-table-hint">Tap a weapon or artifact to open its stats, effects and acquisition/farming details.</p></section>`}
function strengthsCard(profile){const strengths=(profile.strengths||[]).filter(Boolean),weaknesses=(profile.weaknesses||[]).filter(Boolean);if(!strengths.length&&!weaknesses.length)return'';return`<section class="section card hotaru-reference-card hotaru-game8-card"><div class="section-head"><h2>Strengths & Weaknesses</h2><span class="pill good">Reviewed</span></div><div class="hotaru-procon-grid"><div><h3>Strengths</h3>${strengths.map(text=>`<p><b>＋</b><span>${esc(text)}</span></p>`).join('')}</div><div><h3>Weaknesses</h3>${weaknesses.map(text=>`<p><b>−</b><span>${esc(text)}</span></p>`).join('')}</div></div></section>`}
function howToUse(profile){const tips=(profile.playstyleTips||[]).filter(Boolean);if(!tips.length)return'';return`<div class="hotaru-howto"><h3>How to Use</h3>${tips.map((tip,index)=>`<div><b>${index+1}</b><p>${esc(tip)}</p></div>`).join('')}</div>`}
function sourcesCard(profile){const sources=profileSources(profile);if(!sources.length)return'';return`<section class="section card hotaru-reference-card hotaru-source-card"><div class="section-head"><h2>Guide Sources</h2><span class="pill good">Reviewed</span></div><div class="hotaru-source-list">${sources.map(source=>{const href=safeUrl(source.url);return href?`<a href="${esc(href)}" target="_blank" rel="noopener noreferrer"><strong>${esc(source.label)}</strong><span>${esc(source.kind||'Reference')}</span></a>`:''}).join('')}</div></section>`}
function appendMarkup(root,html){if(!html)return;const holder=document.createElement('div');holder.innerHTML=html;while(holder.firstElementChild)root.appendChild(holder.firstElementChild)}

export function enhanceGame8Guide({profile,detail,catalog}={}){
  const root=document.getElementById('hotaru-deep-guide');if(!root||!profile||root.dataset.game8Enhanced==='1')return;root.dataset.game8Enhanced='1';root.classList.add('hotaru-game8-guide');
  const section=root.dataset.section||'';
  if(section==='overview'){
    const profileCard=root.querySelector('.hotaru-reference-card');const eyebrow=profileCard?.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent='Rating & Info';
    const strengths=strengthsCard(profile);if(strengths&&profileCard)profileCard.insertAdjacentHTML('afterend',strengths);
    const talent=renameHeading(root,'Talent priority','Talents & How to Use');reorderTalent(talent,profile.talentPriority||[]);const how=howToUse(profile);if(how&&talent&&!talent.querySelector('.hotaru-howto'))talent.insertAdjacentHTML('beforeend',how);
    appendMarkup(root,sourcesCard(profile));
  }else if(section==='build'){
    root.insertAdjacentHTML('afterbegin',summaryCard(profile,detail,catalog));
    renameHeading(root,'Build variants','Build Variants');
    const artifacts=renameHeading(root,'Artifacts ranked','Best Artifacts');reorderRows(artifacts?.querySelector('.hotaru-guide-list'),profile.artifactPriority||[]);
    const weapons=renameHeading(root,'Recommended weapons','Best Weapons');reorderRows(weapons?.querySelector('.hotaru-guide-list'),profile.weaponPriority||[]);
    renameHeading(root,'Team comps','Best Team Comps');appendMarkup(root,sourcesCard(profile));
  }else if(section==='materials'){
    renameHeading(root,'Material summary','Materials');renameHeading(root,'Ascension by level','Ascension Materials by Level');renameHeading(root,'Talent level-up materials','Talent Level-Up Materials');renameHeading(root,'Exploration shortcuts','Farm Locations');appendMarkup(root,sourcesCard(profile));
  }
}
