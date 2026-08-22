import { loadCatalog } from '../data/game-data.js';

const app=document.getElementById('app');
const FILTER_KEY='hotaru.character-ownership.v1';
const PAGE_KEY='hotaru.character-ownership-page.v1';
let patchQueued=false;
let catalogPromise=null;

function safeGet(key,fallback=''){try{return localStorage.getItem(key)||fallback}catch{return fallback}}
function safeSet(key,value){try{localStorage.setItem(key,value)}catch{}}
function ownership(){const value=safeGet(FILTER_KEY,'All');return['All','Owned','Unowned'].includes(value)?value:'All'}
function ownedIds(){
  for(const key of ['hotaru.app.v3','hotaru.app.v2','hotaru.app.v1']){
    try{const parsed=JSON.parse(localStorage.getItem(key)||'null');const roster=Array.isArray(parsed?.roster)?parsed.roster:[];if(roster.length||parsed)return new Set(roster.map(item=>String(item?.id||'')).filter(Boolean))}catch{}
  }
  return new Set();
}
function charactersMain(){const main=app?.querySelector('main');return main?.querySelector('h1')?.textContent?.trim()==='Characters'&&!main.querySelector('.detail-head')?main:null}
function esc(value=''){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function rarity(value){const n=Number(value);return Number.isFinite(n)&&n>0?n:4}
function ensureControl(main){
  const filters=main.querySelector('.filters');if(!filters)return null;
  let field=filters.querySelector('.hotaru-ownership-field');
  if(!field){field=document.createElement('div');field.className='field hotaru-ownership-field';field.innerHTML='<label for="filter-ownership">Ownership</label><select id="filter-ownership"><option>All</option><option>Owned</option><option>Unowned</option></select>';filters.appendChild(field)}
  const select=field.querySelector('#filter-ownership'),value=ownership();if(select&&select.value!==value)select.value=value;return select;
}
async function fullCatalog(){if(!catalogPromise)catalogPromise=loadCatalog().catch(()=>null);return catalogPromise}
function currentFilters(main){return{q:String(main.querySelector('#character-search')?.value||'').toLowerCase().trim(),element:main.querySelector('#filter-element')?.value||'All',weapon:main.querySelector('#filter-weapon')?.value||'All',rarity:main.querySelector('#filter-rarity')?.value?.replace('★','')||'All'}}
function matches(character,filters,owned,mode){
  if(filters.q&&!`${character.name} ${character.element} ${character.weapon}`.toLowerCase().includes(filters.q))return false;
  if(filters.element!=='All'&&character.element!==filters.element)return false;
  if(filters.weapon!=='All'&&character.weapon!==filters.weapon)return false;
  if(filters.rarity!=='All'&&String(character.rarity)!==String(filters.rarity))return false;
  const isOwned=owned.has(String(character.id));
  return mode==='Owned'?isOwned:mode==='Unowned'?!isOwned:true;
}
function card(character){return `<button class="card character-card" data-character="${esc(character.id)}"><div class="character-art">${character.icon?`<img src="${esc(character.icon)}" alt="${esc(character.name)}" loading="lazy" decoding="async" />`:'<div class="fallback">✦</div>'}</div><div class="character-info"><div class="character-name">${esc(character.name)}</div><div class="character-meta"><span>${esc(character.element)}</span><span>·</span><span>${esc(character.weapon)}</span><span>·</span><span>${rarity(character.rarity)}★</span></div></div></button>`}
async function applyOwnershipFilter(){
  patchQueued=false;const main=charactersMain();if(!main)return;const select=ensureControl(main);if(!select)return;
  const mode=ownership();if(mode==='All')return;
  const catalog=await fullCatalog();if(!catalog||charactersMain()!==main)return;
  const owned=ownedIds(),filters=currentFilters(main),all=(catalog.characters||[]).filter(character=>matches(character,filters,owned,mode)).sort((a,b)=>rarity(b.rarity)-rarity(a.rarity)||a.name.localeCompare(b.name));
  const perPage=24,pages=Math.max(1,Math.ceil(all.length/perPage));let page=Math.max(1,Number(safeGet(PAGE_KEY,'1'))||1);page=Math.min(page,pages);safeSet(PAGE_KEY,String(page));const shown=all.slice((page-1)*perPage,page*perPage);
  const grid=main.querySelector('.grid.auto'),pager=main.querySelector('.pagination'),count=main.querySelector('.section-head .muted.small');if(!grid||!pager)return;
  const signature=JSON.stringify([mode,filters.q,filters.element,filters.weapon,filters.rarity,page,all.map(c=>String(c.id))]);
  if(grid.dataset.hotaruOwnershipSignature!==signature){grid.dataset.hotaruOwnershipSignature=signature;grid.innerHTML=shown.map(card).join('')||'<div class="card empty"><div class="empty-symbol">⌕</div><h3>No matches</h3><p>Try another filter.</p></div>'}
  const pagerHtml=`<button class="secondary" data-hotaru-owned-page="${page-1}" ${page<=1?'disabled':''}>Previous</button><span>${page} / ${pages}</span><button class="secondary" data-hotaru-owned-page="${page+1}" ${page>=pages?'disabled':''}>Next</button>`;if(pager.innerHTML!==pagerHtml)pager.innerHTML=pagerHtml;
  const label=`${all.length} matching ${mode.toLowerCase()} characters`;if(count&&count.textContent!==label)count.textContent=label;
}
function schedulePatch(){if(patchQueued)return;patchQueued=true;requestAnimationFrame(applyOwnershipFilter)}
if(app)new MutationObserver(schedulePatch).observe(app,{childList:true,subtree:true});
document.addEventListener('change',event=>{
  if(event.target?.id==='filter-ownership'){
    safeSet(FILTER_KEY,event.target.value);safeSet(PAGE_KEY,'1');
    if(event.target.value==='All'){const native=document.getElementById('filter-rarity');native?.dispatchEvent(new Event('change',{bubbles:true}))}else schedulePatch();
    return;
  }
  if(['filter-element','filter-weapon','filter-rarity'].includes(event.target?.id||'')){safeSet(PAGE_KEY,'1');schedulePatch()}
});
document.addEventListener('input',event=>{if(event.target?.id==='character-search'){safeSet(PAGE_KEY,'1');schedulePatch()}});
document.addEventListener('click',event=>{const button=event.target.closest('[data-hotaru-owned-page]');if(!button)return;event.preventDefault();const page=Math.max(1,Number(button.dataset.hotaruOwnedPage)||1);safeSet(PAGE_KEY,String(page));schedulePatch();window.scrollTo({top:0,behavior:'smooth'})},{capture:true});
schedulePatch();
