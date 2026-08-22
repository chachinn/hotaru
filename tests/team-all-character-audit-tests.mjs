import assert from 'node:assert/strict';
import { RELEASED_AVATAR_AUDIT_V45, NAMED_CHARACTER_COUNT, TEAM_ELIGIBLE_COUNT, SPECIAL_AVATAR_COUNT } from './fixtures/released-avatar-audit-v45.mjs';
import { auditTeamCatalog, classifyTeamCatalogEntry } from '../js/data/team-character-audit.js';
import { recommendedTeamsForCharacter, compositionKey, teamHasValidSource } from '../js/data/team-recommendations.js';
import { normalizeReactionId } from '../js/data/team-reaction-tags.js';
import { matchReviewedTeams } from '../js/features/roster-team-matcher.js';

assert.equal(RELEASED_AVATAR_AUDIT_V45.length,148,'v45 audit fixture must contain exactly 148 avatar records');
assert.equal(RELEASED_AVATAR_AUDIT_V45.slice(0,NAMED_CHARACTER_COUNT).length,118);
const audit=auditTeamCatalog(RELEASED_AVATAR_AUDIT_V45);
assert.equal(audit.total,148);
assert.equal(audit.teamEligible,TEAM_ELIGIBLE_COUNT);
assert.equal(audit.notApplicable,SPECIAL_AVATAR_COUNT);
assert.equal(audit.blockers.length,0,`No character may have a source/reaction/dedupe blocker: ${JSON.stringify(audit.blockers.slice(0,5))}`);

let passed=0;
for(const row of audit.rows){
  const classification=classifyTeamCatalogEntry(row.name);
  assert.equal(classification.teamEligible,row.teamEligible,`${row.name}: classification must be deterministic`);
  if(!row.teamEligible){
    assert.equal(row.status,'not-applicable',`${row.name}: special avatar must be explicit N/A`);
    console.log(`PASS ${String(++passed).padStart(3,'0')}/148 · ${row.name} · N/A (${row.reason})`);
    continue;
  }
  const teams=recommendedTeamsForCharacter(row.canonical);
  assert.equal(teams.length,row.count,`${row.name}: audit count must match indexed recommendation lookup`);
  const keys=new Set();
  for(const team of teams){
    assert.equal(team.members?.length,4,`${row.name}: every team must have 4 members`);
    assert.ok(teamHasValidSource(team),`${row.name}: every counted team needs valid provenance`);
    const comp=compositionKey(team);assert.ok(comp,`${row.name}: composition key required`);assert.ok(!keys.has(comp),`${row.name}: duplicate composition ${comp}`);keys.add(comp);
    if(team.reaction)assert.ok(normalizeReactionId(team.reaction),`${row.name}: explicit reaction must be canonical`);
  }
  const roster=[{name:row.canonical,teamName:row.canonical}];
  const result=matchReviewedTeams({roster,lockedNames:[row.canonical],allowUnowned:true,limit:'all'});
  assert.equal(result.sourceTotal,row.count,`${row.name}: locked-character matcher must query full indexed source pool`);
  assert.equal(result.results.length,row.count,`${row.name}: Allow unowned must expose all sourced locked-character teams`);
  const ownedOnly=matchReviewedTeams({roster,lockedNames:[row.canonical],allowUnowned:false,limit:'all'});
  assert.ok(ownedOnly.results.every(team=>team.ownedComplete),`${row.name}: ownership gate must never leak missing-character teams`);
  assert.equal(row.sourceGap,row.count<30,`${row.name}: 30-team floor state must be exact`);
  console.log(`PASS ${String(++passed).padStart(3,'0')}/148 · ${row.name} · ${row.count} sourced · ${row.sourceGap?'SOURCE GAP':'30+ OK'}`);
}
assert.equal(passed,148);
console.log(`All-character QA: 148/148 PASS · ${audit.teamEligible} team-eligible · ${audit.notApplicable} special/N/A · ${audit.thirtyPlus} at 30+ · ${audit.sourceGaps.length} source gaps.`);
