const app=document.getElementById('app');
let queued=false;

function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refreshNavigation()})}
function currentTitle(){return app?.querySelector('main h1')?.textContent?.trim()||'Hotaru'}
function routeLabel(){
  if(document.getElementById('hotaru-map-view'))return'Map';
  const active=app?.querySelector('.bottom-nav [data-tab].active')?.dataset.tab;
  return({home:'Home',characters:'Characters',roster:'Roster',build:'Build',more:'More'})[active]||currentTitle();
}
function refreshBottomNav(){
  const nav=app?.querySelector('.bottom-nav');if(!nav)return;
  nav.classList.add('hotaru-nav-expanded');
  const roster=nav.querySelector('[data-tab="roster"]'),build=nav.querySelector('[data-tab="build"]'),more=nav.querySelector('[data-tab="more"]');
  roster?.classList.remove('hotaru-overflow-nav');
  more?.classList.add('hotaru-overflow-nav');
  if(roster&&build&&roster.nextElementSibling!==build)nav.insertBefore(roster,build);
}
function ensureTopSectionsButton(){
  const brand=app?.querySelector('.topbar .brand');if(!brand)return;
  let button=brand.querySelector('[data-hotaru-top-sections]');
  if(!button){button=document.createElement('button');button.type='button';button.className='hotaru-top-sections';button.dataset.hotaruMenu='1';button.dataset.hotaruTopSections='1';button.setAttribute('aria-label','Open Hotaru sections');const status=brand.querySelector('.source-dot');if(status)brand.insertBefore(button,status);else brand.appendChild(button)}
  button.innerHTML=`<span aria-hidden="true">☰</span><strong>${routeLabel()}</strong>`;
}
function sectionByHeading(text){return[...app.querySelectorAll('main section')].find(section=>section.querySelector('h2')?.textContent?.trim()===text)||null}
function ensureRosterJump(){
  const main=app?.querySelector('main');if(!main||main.querySelector('h1')?.textContent?.trim()!=='My Roster')return;
  const mappings=[['Characters','roster-characters','Characters'],['Smart Team Creator','roster-teams','Teams & Abyss'],['Smart Farming','roster-farming','Farming'],['Owned weapons','roster-weapons','Weapons']];
  const available=[];
  for(const [heading,id,label] of mappings){const section=sectionByHeading(heading);if(section){section.id=id;section.classList.add('hotaru-jump-target');available.push([id,label])}}
  if(!available.length)return;
  let jump=main.querySelector('.hotaru-section-jump');
  if(!jump){jump=document.createElement('nav');jump.className='hotaru-section-jump';jump.setAttribute('aria-label','Roster sections');main.querySelector('.page-head')?.after(jump)}
  const signature=available.map(x=>x[0]).join('|');if(jump.dataset.signature===signature)return;jump.dataset.signature=signature;
  jump.innerHTML=available.map(([id,label])=>`<button type="button" data-hotaru-scroll="#${id}">${label}</button>`).join('');
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
  grid.innerHTML=`<div class="hotaru-menu-group-title">Main</div>${menuButton({icon:'⌂',label:'Home',sub:'Today, Resin and priorities',attrs:'data-tab="home"'})}${menuButton({icon:'✦',label:'Characters',sub:'Guides, builds and materials',attrs:'data-tab="characters"'})}${menuButton({icon:'♙',label:'My Roster',sub:'Your synced characters and goals',attrs:'data-tab="roster"'})}${menuButton({icon:'◇',label:'Build Check',sub:'Evaluate current builds',attrs:'data-tab="build"'})}<div class="hotaru-menu-group-title">Plan</div>${menuButton({icon:'⚔',label:'Teams & Abyss',sub:'Reviewed teams and two-side planning',attrs:'data-hotaru-nav-jump="teams"'})}${menuButton({icon:'✿',label:'Farm Today',sub:'Smart Farming and Resin plan',attrs:'data-hotaru-nav-jump="farm"'})}${menuButton({icon:'⌖',label:'Interactive Map',sub:'Materials, routes and targets',attrs:'data-hotaru-menu-map'})}<div class="hotaru-menu-group-title">Account</div>${menuButton({icon:'↻',label:'Sync / Import',sub:'UID, HoYoLAB and GOOD import',attrs:'data-hotaru-open-sync'})}${menuButton({icon:'•••',label:'More',sub:'Backup, sources and settings',attrs:'data-tab="more"'})}`;
}
function closeMenu(){document.getElementById('hotaru-section-menu')?.querySelector('[data-hotaru-close-menu]')?.click()}
function openAccountSync(){closeMenu();const button=document.createElement('button');button.type='button';button.dataset.action='uid-modal';button.hidden=true;document.body.appendChild(button);button.click();button.remove()}
function jumpToRoster(selector){closeMenu();const tab=app?.querySelector('.bottom-nav [data-tab="roster"]');if(tab)tab.click();else{const button=document.createElement('button');button.type='button';button.dataset.tab='roster';button.hidden=true;document.body.appendChild(button);button.click();button.remove()}let tries=0;const seek=()=>{const target=document.querySelector(selector);if(target){target.scrollIntoView({behavior:'smooth',block:'start'});return}if(tries++<8)setTimeout(seek,70)};setTimeout(seek,40)}
function refreshNavigation(){refreshBottomNav();ensureTopSectionsButton();ensureRosterJump();ensureMoreJump();upgradeMenu()}

const appObserver=new MutationObserver(queue);if(app)appObserver.observe(app,{childList:true});
const bodyObserver=new MutationObserver(()=>{upgradeMenu()});bodyObserver.observe(document.body,{childList:true});

document.addEventListener('click',event=>{
  const scroll=event.target.closest('[data-hotaru-scroll]');if(scroll){const target=document.querySelector(scroll.dataset.hotaruScroll);if(target){event.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'})}return}
  if(event.target.closest('[data-hotaru-open-sync]')){event.preventDefault();event.stopPropagation();openAccountSync();return}
  const jump=event.target.closest('[data-hotaru-nav-jump]');if(jump){event.preventDefault();event.stopPropagation();jumpToRoster(jump.dataset.hotaruNavJump==='teams'?'#roster-teams':'#roster-farming')}
});

queue();