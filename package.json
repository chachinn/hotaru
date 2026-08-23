import { getCatalog, getWeaponDetail } from '../data/game-data.js';
import { artifactFarmInfo, weaponFarmInfo } from '../data/equipment-farm-registry.js';
import { buildMapUrl } from './interactive-map.js';
import { stripMarkup, weaponAcquisition } from './guide-engine.js';
import { fallbackArtifactIcon, fallbackWeaponIcon } from './content-media.js';

const esc=value=>String(value??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const modalRoot=()=>document.getElementById('modal-root');
function safeUrl(value=''){try{const url=new URL(String(value||''));return/^https?:$/.test(url.protocol)?url.href:''}catch{return''}}
function close(){const root=modalRoot();if(root)root.innerHTML=''}
function show(title,body){const root=modalRoot();if(!root)return;root.innerHTML=`<div class="modal-backdrop hotaru-item-modal-backdrop" data-hotaru-item-backdrop="1"><section class="modal hotaru-item-modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-head"><div><div class="eyebrow">Equipment details</div><h2>${esc(title)}</h2></div><button class="ghost hotaru-item-close" type="button" data-hotaru-item-close="1" aria-label="Close">✕</button></div>${body}</section></div>`}

function numericValues(value){const out=[];const visit=node=>{if(node==null)return;if(typeof node==='number'&&Number.isFinite(node)){out.push(node);return}if(Array.isArray(node)){node.forEach(visit);return}if(typeof node==='object')Object.values(node).forEach(visit)};visit(value);return out}
function statDisplay(entry){if(!entry)return'';const values=[Number(entry.base),...numericValues(entry.levels)].filter(Number.isFinite),min=values.length?values[0]:null,max=values.length?Math.max(...values):null,isPct=/rate|dmg|recharge|hp%|atk%|def%/i.test(entry.name||'');const fmt=value=>isPct&&Math.abs(value)<=5?`${(value*100).toFixed(1).replace(/\.0$/,'')}%`:Number(value).toFixed(Number(value)%1?1:0);if(min==null)return'';return max!=null&&max!==min?`${fmt(min)} → ${fmt(max)}`:fmt(min)}

function icon(src,name){return src?`<img class="hotaru-item-detail-icon" src="${esc(src)}" alt="" />`:`<div class="hotaru-item-detail-icon hotaru-guide-placeholder">✦</div>`}
function link(info){const href=safeUrl(info?.sourceUrl);return href?`<a class="secondary hotaru-item-source-link" href="${esc(href)}" target="_blank" rel="noopener noreferrer">Open source guide</a>`:''}

export async function openHotaruWeapon(name=''){
  const catalog=getCatalog(),weapon=catalog?.weapons?.find(item=>String(item.name).toLowerCase()===String(name).toLowerCase())||null,detail=weapon?await getWeaponDetail(weapon):null,info=weaponFarmInfo(name),sub=detail?.subStat||weapon?.subStat||'—',base=(detail?.statEntries||[]).find(item=>/base atk/i.test(item.name||'')),subEntry=(detail?.statEntries||[]).find(item=>item!==base),baseText=statDisplay(base)||String(detail?.baseAttack||detail?.baseAtk||'—'),subText=statDisplay(subEntry),passive=stripMarkup(detail?.passiveDesc||detail?.description||weapon?.description||''),acquisition=info?.source||weaponAcquisition(detail||weapon||{}),sourceKind=info?.kind||weaponAcquisition(detail||weapon||{});
  show(name,`<div class="hotaru-item-detail-hero">${icon(fallbackWeaponIcon(detail?.slug||name)||detail?.icon||weapon?.icon,name)}<div><span>${esc(detail?.rarity||weapon?.rarity||'')}★ ${esc(detail?.weapon||weapon?.weapon||'Weapon')}</span><strong>${esc(sub)}</strong>${subText?`<small>${esc(subText)}</small>`:''}</div></div><div class="hotaru-item-detail-grid"><div><span>Base ATK</span><strong>${esc(baseText)}</strong></div><div><span>Secondary stat</span><strong>${esc(sub)}${subText?` · ${esc(subText)}`:''}</strong></div><div><span>How to get</span><strong>${esc(acquisition)}</strong></div><div><span>Source type</span><strong>${esc(sourceKind)}</strong></div>${passive?`<div class="wide"><span>Passive / effect</span><p>${esc(passive.slice(0,700))}${passive.length>700?'…':''}</p></div>`:''}</div><div class="hotaru-item-detail-actions">${link(info)}<a class="secondary" href="${esc(buildMapUrl(['Domain']))}" target="_blank" rel="noopener">Open farming domains</a></div>`);
}

export function openHotaruArtifact(name=''){
  const catalog=getCatalog(),set=catalog?.artifacts?.find(item=>String(item.name).toLowerCase()===String(name).toLowerCase())||null,info=artifactFarmInfo(name),two=stripMarkup(set?.twoPiece||''),four=stripMarkup(set?.fourPiece||'');
  show(name,`<div class="hotaru-item-detail-hero">${icon(fallbackArtifactIcon(name)||set?.icon,name)}<div><span>${esc(info.kind||'Artifact set')}</span><strong>${esc(info.region||'Teyvat')}</strong></div></div><div class="hotaru-item-detail-grid"><div class="wide"><span>Where to farm</span><strong>${esc(info.source)}</strong></div>${two?`<div class="wide"><span>2-Piece Bonus</span><p>${esc(two)}</p></div>`:''}${four?`<div class="wide"><span>4-Piece Bonus</span><p>${esc(four)}</p></div>`:''}</div><div class="hotaru-item-detail-actions">${link(info)}<a class="secondary" href="${esc(buildMapUrl(['Domain']))}" target="_blank" rel="noopener">Open Domain map</a></div>`);
}

document.addEventListener('click',event=>{
  const closeButton=event.target.closest('[data-hotaru-item-close]');if(closeButton){event.preventDefault();close();return}
  if(event.target.matches?.('[data-hotaru-item-backdrop]')){close();return}
  const weapon=event.target.closest('[data-hotaru-weapon]');if(weapon){event.preventDefault();openHotaruWeapon(weapon.dataset.hotaruWeapon).catch(()=>{});return}
  const artifact=event.target.closest('[data-hotaru-artifact]');if(artifact){event.preventDefault();openHotaruArtifact(artifact.dataset.hotaruArtifact)}
});
