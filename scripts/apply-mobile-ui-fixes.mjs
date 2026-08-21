import fs from 'node:fs';

function read(path){return fs.readFileSync(path,'utf8')}
function write(path,text){fs.writeFileSync(path,text)}
function replaceExact(text,from,to,label){if(!text.includes(from))throw new Error(`Missing patch anchor: ${label}`);return text.replace(from,to)}

let s=read('js/data/game-data.js');
s=replaceExact(s,
"function weaponType(value=''){const text=String(value||'').toUpperCase();if(text.includes('SWORD_ONE_HAND')||text==='SWORD')return'Sword';if(text.includes('CLAYMORE'))return'Claymore';if(text.includes('POLE')||text.includes('POLEARM'))return'Polearm';if(text.includes('BOW'))return'Bow';if(text.includes('CATALYST'))return'Catalyst';return value?String(value):'Unknown'}\nfunction element(value=''){",
"function weaponType(value=''){const text=String(value||'').toUpperCase();if(text.includes('SWORD_ONE_HAND')||text==='SWORD')return'Sword';if(text.includes('CLAYMORE'))return'Claymore';if(text.includes('POLE')||text.includes('POLEARM'))return'Polearm';if(text.includes('BOW'))return'Bow';if(text.includes('CATALYST'))return'Catalyst';return value?String(value):'Unknown'}\nfunction rarityValue(value,fallback=4){const number=Number(value);if(Number.isFinite(number)&&number>=1&&number<=5)return number;const text=String(value??'').trim().toLowerCase();if(/quality[_ -]?orange|legendary|orange|gold/.test(text))return 5;if(/quality[_ -]?purple|\\brare\\b|purple/.test(text))return 4;if(/quality[_ -]?blue|blue/.test(text))return 3;if(/quality[_ -]?green|green/.test(text))return 2;if(/quality[_ -]?white|white/.test(text))return 1;const safe=Number(fallback);return Number.isFinite(safe)&&safe>=1&&safe<=5?safe:4}\nexport function sameWeaponType(weapon,requiredType=''){const required=weaponType(requiredType);if(required==='Unknown')return false;return weaponType(weapon?.type||weapon?.weapon)===required}\nfunction element(value=''){",
'game data helpers');
s=s.replace("rarity:Number(item?.rank||item?.rarity||4)","rarity:rarityValue(item?.rank??item?.rarity,4)");
s=s.replace("rarity:Number(item?.rank||item?.rarity||1),weapon:","rarity:rarityValue(item?.rank??item?.rarity,1),weapon:");
s=s.replace("rarity:Number(raw.rarity||character.rarity),icon:","rarity:rarityValue(raw.rarity??character.rarity,character.rarity),icon:");
s=replaceExact(s,"export const helpers={slug,weaponType,element};","export const helpers={slug,weaponType,rarityValue,element};",'export rarity helper');
write('js/data/game-data.js',s);

s=read('app.js');
s=replaceExact(s,
"import { loadCatalog, refreshCatalog, getCharacterDetail, hydrateWeaponCandidates } from './js/data/game-data.js';",
"import { loadCatalog, refreshCatalog, getCharacterDetail, hydrateWeaponCandidates, sameWeaponType } from './js/data/game-data.js';",
'app game-data import');
s=replaceExact(s,
"import { ascensionTotals, talentTotals, mergeNeeds } from './js/features/farming.js';\n",
"import { ascensionTotals, talentTotals, mergeNeeds } from './js/features/farming.js';\nimport { safeCharacterRarity } from './js/features/content-media.js';\n",
'app rarity import');
s=replaceExact(s,"${esc(current.element)} · ${esc(current.weapon)} · ${current.rarity}★","${esc(current.element)} · ${esc(current.weapon)} · ${safeCharacterRarity(current.rarity,4)}★",'home rarity');
s=replaceExact(s,"${esc(c.element)}</span><span>·</span><span>${esc(c.weapon)}</span><span>·</span><span>${c.rarity}★","${esc(c.element)}</span><span>·</span><span>${esc(c.weapon)}</span><span>·</span><span>${safeCharacterRarity(c.rarity,4)}★",'catalog rarity');
s=replaceExact(s,"<span class=\"pill gray\">${characterDetail.rarity}★</span>","<span class=\"pill gray\">${safeCharacterRarity(characterDetail.rarity,character.rarity)}★</span>",'detail rarity');
s=replaceExact(s,
"  const stats=saved.stats||rosterEntry(character.id)?.stats||{},mains=saved.mainStats||{},context=saved.context||{},ownedWeapons=state.weapons.filter(w=>!w.type||w.type===character.weapon||w.weapon===character.weapon),ownedNames=new Set(ownedWeapons.map(w=>w.name)),compatibleWeapons=(catalog?.weapons||[]).filter(w=>!w.weapon||w.weapon===character.weapon),weaponOptions=[...ownedWeapons,...compatibleWeapons].filter((w,index,list)=>w?.name&&list.findIndex(x=>x?.name===w.name)===index).sort((a,b)=>Number(ownedNames.has(b.name))-Number(ownedNames.has(a.name))||Number(b.rarity||0)-Number(a.rarity||0)||a.name.localeCompare(b.name));",
"  const stats=saved.stats||rosterEntry(character.id)?.stats||{},mains=saved.mainStats||{},context=saved.context||{},ownedWeapons=state.weapons.filter(w=>sameWeaponType(w,character.weapon)),ownedNames=new Set(ownedWeapons.map(w=>w.name)),compatibleWeapons=(catalog?.weapons||[]).filter(w=>sameWeaponType(w,character.weapon)),weaponOptions=[...ownedWeapons,...compatibleWeapons].filter((w,index,list)=>w?.name&&list.findIndex(x=>x?.name===w.name)===index).sort((a,b)=>Number(ownedNames.has(b.name))-Number(ownedNames.has(a.name))||Number(b.rarity||0)-Number(a.rarity||0)||a.name.localeCompare(b.name));",
'strict weapon type');
s=replaceExact(s,'<div class="field"><label>Weapon</label><select id="build-weapon">','<div class="field"><label>Weapon <span class="field-hint">${esc(character.weapon)} only</span></label><select id="build-weapon">','weapon field label');
write('app.js',s);

s=read('style.css');
s=replaceExact(s,'html{touch-action:manipulation}','html{touch-action:manipulation;-webkit-text-size-adjust:100%;text-size-adjust:100%}','ios text size');
s=replaceExact(s,'.card-button{width:100%;text-align:left;color:inherit;cursor:pointer}', '.card-button{width:100%;text-align:left;color:inherit;cursor:pointer}.card-button>strong,.card-button>span{display:block}.card-button>strong+span{margin-top:4px}','card copy layout');
s=replaceExact(s,'.field label,.field-label{font-size:11px;color:var(--muted);font-weight:750}', '.field label,.field-label{font-size:11px;color:var(--muted);font-weight:750}.field-hint{margin-left:5px;font-size:10px!important;color:var(--pink-600)!important;font-weight:780}','field hint');
write('style.css',s);

s=read('css/guide-ui.css');
s=replaceExact(s,'.hotaru-guide-copy strong,.hotaru-guide-copy span{display:block}', '.hotaru-guide-copy{min-width:0;width:100%;max-width:100%}.hotaru-guide-copy strong,.hotaru-guide-copy span{display:block;word-break:normal}.hotaru-guide-copy strong{overflow-wrap:normal}.hotaru-guide-copy p{overflow-wrap:break-word;word-break:normal}','guide copy width');
s=replaceExact(s,
'@media(max-width:560px){.hotaru-role-rating-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hotaru-profile-grid,.hotaru-material-columns,.hotaru-material-source-grid,.hotaru-variant-grid{grid-template-columns:1fr}.hotaru-guide-row{grid-template-columns:24px 44px minmax(0,1fr)}.hotaru-guide-row>.score-badge{grid-column:3;justify-self:start}.hotaru-guide-item-icon{width:42px;height:42px}',
'@media(max-width:560px){.hotaru-role-rating-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hotaru-profile-grid,.hotaru-material-columns,.hotaru-material-source-grid,.hotaru-variant-grid{grid-template-columns:1fr}.hotaru-guide-row{display:flex;width:100%;min-width:0;align-items:flex-start;gap:9px}.hotaru-guide-rank{flex:0 0 28px}.hotaru-guide-row>.hotaru-guide-item-icon,.hotaru-guide-row>.hotaru-guide-placeholder{flex:0 0 42px}.hotaru-guide-copy{flex:1 1 0;min-width:0}.hotaru-guide-row>.score-badge{flex:0 0 42px;min-width:42px;width:42px;height:42px;align-self:flex-start}.hotaru-guide-item-icon{width:42px;height:42px}',
'mobile guide row');
write('css/guide-ui.css',s);

for(const file of ['service-worker.js','index.html']){
  s=read(file);
  s=s.replaceAll('style.css?v=1.0.0','style.css?v=1.1.0').replaceAll('css/guide-ui.css?v=1.1.0','css/guide-ui.css?v=1.2.0').replaceAll('app.js?v=1.1.0','app.js?v=1.2.0');
  if(file==='service-worker.js')s=s.replaceAll('hotaru-shell-v14','hotaru-shell-v15');
  write(file,s);
}

for(const file of ['tests/game8-structure-tests.mjs','tests/consistency-tests.mjs','tests/guide-tests.mjs','tests/build-map-fixes-tests.mjs','tests/run-tests.mjs']){
  s=read(file).replaceAll('hotaru-shell-v14','hotaru-shell-v15').replaceAll('css\\/guide-ui\\.css\\?v=1\\.1\\.0','css\\/guide-ui\\.css\\?v=1\\.2\\.0').replaceAll('css/guide-ui.css?v=1.1.0','css/guide-ui.css?v=1.2.0');
  write(file,s);
}

write('tests/mobile-ui-regression-tests.mjs',`import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { helpers, sameWeaponType } from '../js/data/game-data.js';
import { safeCharacterRarity } from '../js/features/content-media.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
assert.equal(helpers.rarityValue('QUALITY_ORANGE',4),5);
assert.equal(helpers.rarityValue(Number.NaN,4),4);
assert.equal(safeCharacterRarity(Number.NaN,5),5);
assert.equal(sameWeaponType({weapon:'Catalyst'},'Catalyst'),true);
assert.equal(sameWeaponType({type:'Catalyst'},'Catalyst'),true);
assert.equal(sameWeaponType({weapon:'Sword'},'Catalyst'),false);
assert.equal(sameWeaponType({name:'Untyped weapon'},'Catalyst'),false);
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert.match(app,/safeCharacterRarity\\(current\\.rarity,4\\)/);
assert.match(app,/filter\\(w=>sameWeaponType\\(w,character\\.weapon\\)\\)/);
assert.match(app,/field-hint[^\\n]*only/);
const style=fs.readFileSync(path.join(root,'style.css'),'utf8');
assert.match(style,/\\.card-button>strong,\\.card-button>span\\{display:block\\}/);
assert.match(style,/-webkit-text-size-adjust:100%/);
const guideCss=fs.readFileSync(path.join(root,'css/guide-ui.css'),'utf8');
assert.match(guideCss,/@media\\(max-width:560px\\)[\\s\\S]*\\.hotaru-guide-row\\{display:flex;/);
assert.match(guideCss,/\\.hotaru-guide-copy\\{min-width:0;width:100%;max-width:100%\\}/);
const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
assert.match(sw,/hotaru-shell-v15/);assert.match(sw,/style\\.css\\?v=1\\.1\\.0/);assert.match(sw,/css\\/guide-ui\\.css\\?v=1\\.2\\.0/);assert.match(sw,/app\\.js\\?v=1\\.2\\.0/);
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.match(index,/style\\.css\\?v=1\\.1\\.0/);assert.match(index,/css\\/guide-ui\\.css\\?v=1\\.2\\.0/);assert.match(index,/app\\.js\\?v=1\\.2\\.0/);
console.log('Hotaru mobile UI + rarity + same-weapon-type regression QA passed.');
`);

const pkg=JSON.parse(read('package.json'));if(!pkg.scripts.test.includes('mobile-ui-regression-tests.mjs'))pkg.scripts.test+=' && node tests/mobile-ui-regression-tests.mjs';write('package.json',JSON.stringify(pkg,null,2)+'\n');
console.log('Applied Hotaru mobile UI fixes.');
