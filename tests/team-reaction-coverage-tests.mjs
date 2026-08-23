import assert from 'node:assert/strict';
import { TEAM_REACTIONS, explicitReactionFromArchetype, teamReaction, teamMatchesReaction } from '../js/data/team-reaction-tags.js';
import { allRecommendedTeams, recommendedTeamsForCharacter, queryRecommendedTeams, teamHasValidSource, TEAM_SOURCE_PLATFORMS } from '../js/data/team-recommendations.js';
import { matchReviewedTeams } from '../js/features/roster-team-matcher.js';

const ids=new Set(TEAM_REACTIONS.map(row=>row.id));
for(const id of ['vaporize','melt','freeze','overload','electro-charged','superconduct','swirl','crystallize','burning','bloom','hyperbloom','burgeon','quicken','aggravate','spread','lunar-charged','lunar-bloom','lunar-crystallize','stellar-conduct','stellar-swirl'])assert.ok(ids.has(id),`reaction list contains ${id}`);
assert.equal(ids.has('lunar-vaporize'),false,'Do not invent Lunar Vaporize');
assert.equal(explicitReactionFromArchetype('Reverse Vaporize'),'vaporize');
assert.equal(explicitReactionFromArchetype('Stellar-Swirl · test'),'stellar-swirl');
assert.equal(explicitReactionFromArchetype('Generic Pyro + Hydro'),'','elements alone must not infer a reaction');
assert.equal(teamReaction({name:'Lunar-Charged · example'}),'lunar-charged');
assert.equal(teamReaction({name:'Generic team',confidence:'Simulation-backed'}),'','unknown simulation team remains untagged');
assert.equal(teamMatchesReaction({name:'Generic team'},'all'),true);
assert.deepEqual(TEAM_SOURCE_PLATFORMS,['Guide','HoYoLAB','YouTube','TikTok','Reddit','GitHub']);

const all=allRecommendedTeams();
assert.ok(all.length>0);
assert.ok(all.every(teamHasValidSource),'every recommendation included in the registry needs valid provenance');
const lunar=queryRecommendedTeams({reaction:'lunar-crystallize'});
assert.ok(lunar.length>0,'explicit Lunar-Crystallize results exist');
assert.ok(lunar.every(team=>team.reaction==='lunar-crystallize'));
const genericUnknown=all.filter(team=>team.confidence==='Simulation-backed');
assert.ok(genericUnknown.every(team=>!team.reaction),'simulation rows must not receive guessed reaction metadata');

const odetteTeams=recommendedTeamsForCharacter('Odette');
assert.ok(odetteTeams.length>3,'Odette full source pool must be retained separately from ownership-filtered results');
const roster=[{name:'Odette',teamName:'Odette'}];
const hidden=matchReviewedTeams({roster,lockedNames:['Odette'],allowUnowned:false,limit:'all'});
const visible=matchReviewedTeams({roster,lockedNames:['Odette'],allowUnowned:true,limit:'all'});
assert.equal(visible.sourceTotal,odetteTeams.length);
assert.equal(visible.results.length,odetteTeams.length);
assert.equal(hidden.sourceTotal,odetteTeams.length,'ownership-safe result view must still know full sourced coverage');
assert.equal(hidden.results.length,hidden.ownedTotal);
assert.equal(hidden.missingTotal,hidden.sourceTotal-hidden.ownedTotal);
console.log('Team Reaction + ownership-aware coverage tests passed.');
