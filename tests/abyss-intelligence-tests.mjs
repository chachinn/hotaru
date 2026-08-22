import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CURRENT_ABYSS_CYCLE, abyssCycleStatus } from '../js/data/abyss-cycle.js';
import { applyAbyssCycleIntelligence, reviewedTeamElements } from '../js/features/abyss-intelligence.js';

assert.equal(CURRENT_ABYSS_CYCLE.id,'7.0-2026-08');
assert.equal(CURRENT_ABYSS_CYCLE.startDate,'2026-08-16');
assert.equal(CURRENT_ABYSS_CYCLE.endDate,'2026-09-15');
assert.match(CURRENT_ABYSS_CYCLE.floor12.firstHalf.buff,/Superconduct DMG \+200%/);
assert.match(CURRENT_ABYSS_CYCLE.floor12.secondHalf.buff,/Pyro Normal Attack DMG \+75%/);
assert.equal(abyssCycleStatus(new Date('2026-08-22T00:00:00Z')).active,true);
assert.equal(abyssCycleStatus(new Date('2026-09-16T00:00:00Z')).status,'review-needed');

const characters=[
  ['Tartaglia','Hydro'],['Diona','Cryo'],['Ayaka','Cryo'],['Kaedehara Kazuha','Anemo'],
  ['Arlecchino','Pyro'],['Yelan','Hydro'],['Bennett','Pyro'],['Xilonen','Geo'],
  ['Wriothesley','Cryo'],['Fischl','Electro'],['Beidou','Electro'],['Qiqi','Cryo']
].map(([name,element])=>({name,element}));
assert.deepEqual(reviewedTeamElements({members:['Tartaglia','Diona','Ayaka','Kazuha']},characters).sort(),['Anemo','Cryo','Hydro']);
const freeze={id:'tartaglia-freeze',name:'Freeze',members:['Tartaglia','Diona','Ayaka','Kaedehara Kazuha'],memberStates:[],missing:[],readyCount:4,ownedComplete:true};
const arle={id:'arle-vape-xilonen',name:'Arlecchino Vape',members:['Arlecchino','Yelan','Bennett','Xilonen'],memberStates:[],missing:[],readyCount:4,ownedComplete:true};
const pair={id:'pair',teams:[arle,freeze],missing:[],ownedCount:8,readyCount:8,ownedComplete:true,readyComplete:true,score:1000,nextStep:{type:'ready',reason:'ready'}};
let result=applyAbyssCycleIntelligence({kind:'abyss',results:[pair]},{characters,now:new Date('2026-08-22T00:00:00Z')});
assert.equal(result.cycleApplied,true);
assert.equal(result.results[0].teams[0].id,'tartaglia-freeze','Cryo-capable team should be assigned to the current first half over Arlecchino Vape');
assert.equal(result.results[0].teams[1].id,'arle-vape-xilonen','Arlecchino should be assigned to the +75% Pyro Normal Attack second half');
assert.equal(result.results[0].teams[1].cycleFit.label,'Strong');
assert.ok(result.results[0].teams[1].cycleFit.matches.some(item=>item.includes('+75% Pyro Normal Attack')));

const superconduct={id:'mock-superconduct',name:'Cryo Electro',members:['Wriothesley','Fischl','Beidou','Qiqi'],memberStates:[],missing:[],readyCount:4,ownedComplete:true};
result=applyAbyssCycleIntelligence({kind:'abyss',results:[{...pair,id:'pair-2',teams:[superconduct,arle]}]},{characters,now:new Date('2026-08-22T00:00:00Z')});
assert.equal(result.results[0].teams[0].cycleFit.label,'Strong');
assert.ok(result.results[0].teams[0].cycleFit.matches.some(item=>item.includes('Superconduct lane')));

const stale=applyAbyssCycleIntelligence({kind:'abyss',results:[pair]},{characters,now:new Date('2026-09-16T00:00:00Z')});
assert.equal(stale.cycleApplied,false);assert.equal(stale.results[0].cycleScore,null);assert.equal(stale.results[0].teams[0].id,'arle-vape-xilonen','stale cycle must not reorder the permanent planner result');

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8'),sw=fs.readFileSync(new URL('../service-worker.js',import.meta.url),'utf8'),index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),style=fs.readFileSync(new URL('../style.css',import.meta.url),'utf8'),cycle=fs.readFileSync(new URL('../js/data/abyss-cycle.js',import.meta.url),'utf8');
assert.ok(app.includes('applyAbyssCycleIntelligence'));assert.ok(app.includes('Best current-cycle plan'));assert.ok(app.includes('Cycle review needed'));assert.ok(app.includes('Current Abyss · cycle-aware'));assert.ok(app.includes('Current-cycle intelligence is dated, not guessed'));
assert.ok(style.includes('.abyss-cycle-card'));assert.ok(style.includes('.abyss-fit-line'));assert.ok(cycle.includes('https://www.hoyolab.com/article/46354836'));assert.ok(cycle.includes('https://www.mone.gg/blog/genshin/genshin-impact-spiral-abyss-guide.html'));
assert.ok(sw.includes('hotaru-shell-v26'));assert.ok(sw.includes('js/data/abyss-cycle.js'));assert.ok(sw.includes('js/features/abyss-intelligence.js'));assert.ok(index.includes('app.js?v=1.12.0'));assert.ok(index.includes('style.css?v=1.8.0'));
console.log('Abyss Intelligence current-cycle QA passed.');
