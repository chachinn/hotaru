import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseShowcase } from '../js/data/enka.js';
import { mergeUIDShowcase, updateUIDImportHistory, secondsUntilUIDRefresh } from '../js/features/uid-import.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');

assert.doesNotMatch(app,/onclick="event\.stopPropagation\(\)"/,'Modal content must not swallow delegated button clicks');
assert.match(app,/class="modal-backdrop" data-modal-backdrop/,'Backdrop should have a dedicated non-action marker');
assert.match(app,/event\.target\.matches\?\.\('\[data-modal-backdrop\]'\)/,'Only direct backdrop taps should dismiss the modal');
assert.match(app,/data-action="close-modal">Close/,'Close remains a delegated action');
assert.match(app,/data-action="import-uid">Import \/ refresh UID/,'UID import button remains a delegated modal action');
assert.match(app,/Quick UID Import uses Enka/);
assert.match(app,/rotating the showcase accumulates characters/);

const data={
  ttl:300,
  playerInfo:{nickname:'Traveler',level:60,showAvatarInfoList:[{avatarId:10000002,level:80}]},
  avatarInfoList:[{
    avatarId:10000002,
    propMap:{'4001':{val:'90'},'1002':{val:'6'}},
    talentIdList:[1,2],
    fightPropMap:{'2000':15000,'2001':1800,'2002':800,'20':0.62,'22':1.4,'23':1.25,'28':80},
    equipList:[{itemId:11501,weapon:{level:90,affixMap:{'1':1}},flat:{itemType:'ITEM_WEAPON'}}]
  }]
};
const parsed=parseShowcase(data,'800123456');
assert.equal(parsed.roster.length,1);
assert.equal(parsed.roster[0].level,90);
assert.equal(parsed.roster[0].ascension,6);
assert.equal(parsed.roster[0].constellation,2);
assert.equal(parsed.roster[0].equippedWeaponLevel,90);
assert.equal(parsed.roster[0].equippedWeaponRefinement,2);

const existing=[{id:'10000002',name:'Kamisato Ayaka',level:70,ascension:5,constellation:0,status:'Building',priority:'High',talents:{attack:8,skill:8,burst:9},targetLevel:90,targetAscension:6,targetWeaponLevel:90,targetTalents:{attack:9,skill:9,burst:10},buildVariant:'freeze',notes:'keep this goal',source:'Manual'}];
const catalog=[{id:'10000002',name:'Kamisato Ayaka'},{id:'10000003',name:'Jean'}];
const merged=mergeUIDShowcase(existing,parsed.roster,catalog);
assert.equal(merged.added,0);assert.equal(merged.refreshed,1);assert.equal(merged.roster.length,1);
const refreshed=merged.roster[0];
assert.equal(refreshed.level,90,'Fresh UID facts should update current level');
assert.equal(refreshed.ascension,6,'Fresh UID facts should update ascension');
assert.equal(refreshed.constellation,2,'Fresh UID facts should update constellation');
assert.equal(refreshed.weaponId,'11501','Fresh detailed UID equipment should refresh the currently equipped weapon');
assert.equal(refreshed.status,'Building','Local build status must survive UID refresh');
assert.equal(refreshed.priority,'High','Local priority must survive UID refresh');
assert.deepEqual(refreshed.talents,{attack:8,skill:8,burst:9},'Locally tracked talents must survive until Hotaru has a reviewed skill-id mapper');
assert.deepEqual(refreshed.targetTalents,{attack:9,skill:9,burst:10});
assert.equal(refreshed.buildVariant,'freeze');
assert.equal(refreshed.notes,'keep this goal');
assert.match(refreshed.source,/Enka UID/);

const second=mergeUIDShowcase(merged.roster,[{id:'10000003',level:50,ascension:3,constellation:0,source:'Enka UID'}],catalog);
assert.equal(second.added,1);assert.equal(second.roster.length,2,'Rotated showcase imports must accumulate instead of replace');

const history=updateUIDImportHistory({uid:'800123456',seenCharacterIds:['10000002']},{...parsed,roster:[...parsed.roster,{id:'10000003'}]});
assert.deepEqual(history.seenCharacterIds,['10000002','10000003']);
assert.equal(history.lastShowcaseCount,2);
assert.ok(secondsUntilUIDRefresh(history,'800123456',Date.parse(history.lastImportedAt))>=299,'TTL guard should prevent wasteful immediate repeat fetches');
assert.equal(secondsUntilUIDRefresh(history,'700123456',Date.parse(history.lastImportedAt)),0,'A different UID must not inherit another UID TTL');

const previewOnly=parseShowcase({playerInfo:{showAvatarInfoList:[{avatarId:10000003,level:40}]},ttl:0},'800123456');
assert.equal(previewOnly.roster.length,1,'Basic public showcase IDs should still import when detailed avatarInfoList is unavailable');
assert.equal(previewOnly.roster[0].id,'10000003');
assert.equal(previewOnly.roster[0].level,40);
const previewRefresh=mergeUIDShowcase([{...refreshed,constellation:4}],previewOnly.roster,catalog);
assert.equal(previewRefresh.roster.find(x=>x.id==='10000003')?.level,40);
const samePreview=parseShowcase({playerInfo:{showAvatarInfoList:[{avatarId:10000002,level:90}]},ttl:0},'800123456');
const preservedPreview=mergeUIDShowcase([{...refreshed,constellation:4}],samePreview.roster,catalog);
assert.equal(preservedPreview.roster[0].constellation,4,'Minimal showcase previews must not erase detailed constellation data collected earlier');

assert.match(sw,/hotaru-shell-v26/);assert.match(sw,/js\/features\/uid-import\.js/);assert.match(sw,/app\.js\?v=1\.12\.0/);
assert.match(index,/app\.js\?v=1\.12\.0/);
console.log('Hotaru modal interaction + Smart UID accumulation regression QA passed.');
