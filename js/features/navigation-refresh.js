const app=document.getElementById('app');
let queued=false;

function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refreshNavigation()})}
function currentTitle(){return app?.querySelector('main h1')?.textContent?.trim()||'Hotaru'}
function rosterSectionLabel(){
  try{return({characters:'Roster',teams:'Teams',farming:'Farming',weapons:'Weapons'})[localStorage.getItem('hotaru.roster-section.v1')]||'Roster'}catch{return'Roster'}
}
function routeLabel(){
  if(document.getElementById('hotaru-map-view'))return'Map';
  const active=app?.querySelector('.bottom-nav [data-tab].active')?.dataset.tab;
  if(active==='roster')return rosterSectionLabel();
  return({home:'Home',characters:'Characters',build:'Build',more:'More'})[active]||currentTitle();
}
function refreshBottomNav(){
  const nav=app?.querySelector('.bottom-nav');if(!nav)return;
  nav.classList.add('hotaru-nav-expanded');
  const roster=nav.querySelector('[data-tab="roster"]'),build=nav.querySelector('[data-tab="build"]'),more=nav.querySelector('[data-tab="more"]'),menu=nav.querySelector('[data-hotaru-menu]');
  roster?.classList.remove('hotaru-overflow-nav');
  more?.classList.add('hotaru-overflow-nav');
  if(roster&&build&&roster.nextElementSibling!==build)nav.insertBefore(roster,build);
  menu?.classList.toggle('active',Boolean(document.getElementById('hotaru-map-view'))||Boolean(more?.classList.contains('active')));
}
function ensureTopSectionsButton(){
  const brand=app?.querySelector('.topbar .brand');if(!brand)return;
  let button=brand.querySelector('[data-hotaru-top-sections]');
  if(!button){button=document.createElement('button');button.type='button';button.className='hotaru-top-sections';button.dataset.hotaruMenu='1';button.dataset.hotaruTopSections='1';button.setAttribute('aria-label','Open Hotaru navigation menu');const status=brand.querySelector('.source-dot');if(status)brand.insertBefore(button,status);else brand.appendChild(button)}
  button.innerHTML=`<span aria-hidden="true">☰</span><strong>${routeLabel()}</strong>`;
}
function ensureMoreJump(){
  const main=app?.querySelector('main');if(!main||main.querySelector('h1')?.textContent?.trim()!=='More')return;
  if(main.querySelector('.hotaru-more-quick'))return;
  const quick=document.createElement('section');quick.className='hotaru-more-quick';quick.innerHTML=`<button type="button" class="secondary" data-hotaru-open-sync>⌁ Sync account</button><button type="button" class="secondary" data-hotaru-scroll=".grid.two">⇩ Backup & restore</button><button type="button" class="secondary" data-hotaru-scroll="main section.card">⚙ App settings</button>`;main.querySelector('.page-head')?.after(quick);
}
function menuButton({icon,label,sub,attrs=''}){return`<button type="button" class="hotaru-menu-item" ${attrs}><span class="hotaru-menu-icon">${icon}</span><span><strong>${label}</strong><small>${sub}</small></span></button>`}
function upgradeMenu(){
  const menu=document.getElementById('hotaru-section-menu'),grid=menu?.querySelector('.hotaru-menu-grid');if(!grid||grid.dataset.hotaruNavigationRefresh)return;
  grid.dataset.hotaruNavigationRefresh='1';grid.classList.add('hotaru-menu-grid-v2');
  grid.innerHTML=`<div class="hotaru-menu-group-title">Main</div>${menuButton({icon:'⌂',label:'Home',sub:'Today, Resin and priorities',attrs:'data-tab="home"'})}${menuButton({icon:'✦',label:'Character Library',sub:'Guides, builds and materials',attrs:'data-tab="characters"'})}${menuButton({icon:'◇',label:'Build Check',sub:'Evaluate current builds',attrs:'data-tab="build"'})}<div class="hotaru-menu-group-title">Roster</div>${menuButton({icon:'♙',label:'Roster Characters',sub:'Characters, progress and build goals',attrs:'data-hotaru-roster-section="characters"'})}${menuButton({icon:'⚔',label:'Teams & Abyss',sub:'Team recommendations and two-side planning',attrs:'data-hotaru-roster-section="teams"'})}${menuButton({icon:'✿',label:'Farming',sub:'Farm Today and Resin planning',attrs:'data-hotaru-roster-section="farming"'})}${menuButton({icon:'◆',label:'Weapons',sub:'Owned weapon inventory',attrs:'data-hotaru-roster-section="weapons"'})}<div class="hotaru-menu-group-title">Tools & Account</div>${menuButton({icon:'⌖',label:'Interactive Map',sub:'Materials, routes and targets',attrs:'data-hotaru-menu-map'})}${menuButton({icon:'↻',label:'Sync / Import',sub:'UID, HoYoLAB and GOOD import',attrs:'data-hotaru-open-sync'})}${menuButton({icon:'•••',label:'More',sub:'Backup, sources and settings',attrs:'data-tab="more"'})}`;
}
function closeMenu(){document.getElementById('hotaru-section-menu')?.querySelector('[data-hotaru-close-menu]')?.click()}
function openAccountSync(){closeMenu();const button=document.createElement('button');button.type='button';button.dataset.action='uid-modal';button.hidden=true;document.body.appendChild(button);button.click();button.remove()}
function jumpToRoster(section){
  closeMenu();
  try{localStorage.setItem('hotaru.roster-section.v1',section)}catch{}
  const tab=app?.querySelector('.bottom-nav [data-tab="roster"]');if(tab)tab.click();else{const button=document.createElement('button');button.type='button';button.dataset.tab='roster';button.hidden=true;document.body.appendChild(button);button.click();button.remove()}
  document.dispatchEvent(new CustomEvent('hotaru:roster-section-changed',{detail:{section}}));
}
function refreshNavigation(){refreshBottomNav();ensureTopSectionsButton();ensureMoreJump();upgradeMenu()}

const appObserver=new MutationObserver(queue);if(app)appObserver.observe(app,{childList:true});
const bodyObserver=new MutationObserver(()=>{upgradeMenu()});bodyObserver.observe(document.body,{childList:true});
document.addEventListener('hotaru:roster-section-changed',queue);

document.addEventListener('click',event=>{
  const scroll=event.target.closest('[data-hotaru-scroll]');if(scroll){const target=document.querySelector(scroll.dataset.hotaruScroll);if(target){event.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'})}return}
  if(event.target.closest('[data-hotaru-open-sync]')){event.preventDefault();event.stopPropagation();openAccountSync();return}
  const jump=event.target.closest('[data-hotaru-nav-jump]');if(jump){event.preventDefault();event.stopPropagation();jumpToRoster(jump.dataset.hotaruNavJump==='teams'?'teams':'farming')}
});

queue();
