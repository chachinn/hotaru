import assert from 'node:assert/strict';
import fs from 'node:fs';
import { inferBuildProfile, statTargets, statTargetRows } from '../js/features/build-engine.js';
import { resolveBuildProfile } from '../js/features/build-profiles.js';

const columbina=resolveBuildProfile({name:'Columbina'},inferBuildProfile({name:'Columbina'}),{buildVariant:'offfield'});
const columbinaRows=statTargetRows(columbina,{});
assert.ok(columbinaRows.some(row=>row.key==='hp'&&row.primary&&/30,000–35,000/.test(row.value)),'Columbina must surface her reviewed 30,000–35,000 HP primary target');
assert.equal(columbinaRows[0].key,'hp','primary scaling should appear before generic CRIT/ER rows');

const hpProfile={role:'Support',scaling:'HP',reviewed:true,targets:{hp:{min:30000,good:35000,great:40000,unit:''},cr:{min:0,good:0,great:0,unit:'%'},cd:{min:0,good:0,great:0,unit:'%'},er:{min:120,good:140,great:160,unit:'%'},em:{min:0,good:0,great:0,unit:''}}};
assert.equal(statTargets(hpProfile,{}).hp.good,35000,'structured reviewed HP target must not be dropped');
assert.ok(statTargetRows(hpProfile,{}).some(row=>row.key==='hp'&&row.target.good===35000),'numeric HP bands must render');

const atkProfile={role:'DPS',scaling:'ATK',reviewed:true,targets:{atk:{min:1600,good:2000,great:2400,unit:''}}};
assert.ok(statTargetRows(atkProfile,{}).some(row=>row.key==='atk'&&row.primary&&row.target.good===2000),'ATK scalers must surface reviewed ATK targets');
const defProfile={role:'Support',scaling:'DEF',reviewed:true,targets:{}};
assert.ok(statTargetRows(defProfile,{}).some(row=>row.key==='def'&&row.primary&&/varies by selected build/.test(row.value)),'DEF must still appear as primary scaling when no trustworthy numeric band exists');
const emProfile={role:'Support',scaling:'Elemental Mastery',reactionDriven:true,reviewed:true,targets:{em:{min:700,good:900,great:1000,unit:''}}};
assert.equal(statTargetRows(emProfile,{}).filter(row=>row.key==='em').length,1,'primary EM must not duplicate the standard EM row');
const baseAtk={role:'Support',scaling:'Base ATK',reviewed:true,goalStats:[{label:'Base ATK',value:'Use the highest Base ATK weapon available'}]};
assert.ok(statTargetRows(baseAtk,{}).some(row=>row.key==='baseAtk'&&row.primary&&/highest Base ATK/.test(row.value)),'Base ATK must remain distinct from total ATK');

const loader=fs.readFileSync(new URL('../js/features/guide-loader.js',import.meta.url),'utf8');
assert.ok(loader.includes('patchPrimaryStatTargets(profile)'),'character Build view must apply primary-stat-aware rows');
assert.ok(loader.includes('card.dataset.statTargetSignature===signature'),'existing MutationObserver integration must be guarded against self-trigger loops');
assert.ok(!loader.includes("new MutationObserver(patchPrimaryStatTargets"),'fix must reuse the existing guide observer rather than add a competing observer');
console.log('Primary stat targets QA passed.');
