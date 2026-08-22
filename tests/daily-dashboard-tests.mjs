import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildDailyDashboard } from '../js/features/daily-dashboard.js';

const characters=[{id:'1',name:'Arlecchino'},{id:'2',name:'Yelan'},{id:'3',name:'Bennett'},{id:'4',name:'Kazuha'}];
const roster=characters.map((c,index)=>({id:c.id,name:c.name,status:index===0?'Building':'Usable',priority:index===0?'High':'Medium',level:80,targetLevel:90,ascension:5,targetAscension:6,talents:{attack:6,skill:8,burst:8},targetTalents:{attack:6,skill:9,burst:9}}));
const dailyPlan={top:[{title:'Teachings of Order',type:'resin',resin:40,claimHint:'2 × rewards',characters:['Arlecchino']},{title:'Rainbow Rose',type:'world',resin:0,subtitle:'Local specialty',characters:['Arlecchino']}],blocked:[{title:'Guide to Equity'}],unverified:[],highestImpact:{character:'Arlecchino',kind:'Ascension',current:5,target:6}};
const resinPlan={budget:180,spent:120,remaining:60};
const dashboard=buildDailyDashboard({roster,characters,weapons:[],dailyPlan,resinPlan});
assert.equal(dashboard.counts.saved,4);assert.equal(dashboard.counts.active,4);assert.equal(dashboard.focus[0].name,'Arlecchino');assert.match(dashboard.focus[0].nextGoal,/Ascension|Character Level|Skill|Burst/);assert.equal(dashboard.today.length,2);assert.equal(dashboard.resin.remaining,60);assert.ok(dashboard.bestTeam);assert.equal(dashboard.bestTeam.members.length,4);

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const style=fs.readFileSync(new URL('../style.css',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../service-worker.js',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.ok(app.includes('Your day, sorted.'));assert.ok(app.includes('Roster focus'));assert.ok(app.includes('Team snapshot'));assert.ok(app.includes('scheduleHomeFarmRefresh'));assert.ok(app.includes('refresh-daily-dashboard'));assert.ok(app.includes('open-farm-planner'));assert.ok(app.includes('open-team-creator'));
assert.ok(style.includes('.daily-hero-stats'));assert.ok(style.includes('.daily-task-row'));assert.ok(style.includes('.daily-split'));
assert.ok(sw.includes('hotaru-shell-v24'));assert.ok(sw.includes('js/features/daily-dashboard.js'));assert.ok(index.includes('app.js?v=1.10.0'));assert.ok(index.includes('style.css?v=1.7.0'));
console.log('Daily Dashboard tests passed.');
