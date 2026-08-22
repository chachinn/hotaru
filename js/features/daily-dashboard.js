import { buildGoal, goalSummary } from './build-goals.js';
import { normalizeRoster, sortRoster, rosterProgress } from './roster-intelligence.js';
import { reviewedBuildProfile } from '../data/build-profiles/index.js';
import { matchReviewedTeams, teamCoverage } from './roster-team-matcher.js';

function variantProfile(name='',variantId=''){
  const reviewed=reviewedBuildProfile(name);if(!reviewed)return{};
  const variant=(reviewed.variants||[]).find(item=>item.id===variantId);
  return variant?.overrides?{...reviewed,...variant.overrides,talentPriority:variant.overrides.talentPriority||reviewed.talentPriority}:reviewed;
}
function weaponFor(entry={},weapons=[]){return(weapons||[]).find(item=>String(item.id)===String(entry.weaponId))||null}

export function buildDailyDashboard({roster=[],characters=[],weapons=[],dailyPlan=null,resinPlan=null}={}){
  const normalized=sortRoster(normalizeRoster(roster,characters));
  const active=normalized.filter(entry=>entry.status!=='Not Building'&&entry.status!=='Finished');
  const focus=active.map(entry=>{const weapon=weaponFor(entry,weapons),goal=buildGoal(entry,variantProfile(entry.name,entry.buildVariant),weapon);return{name:entry.name,id:entry.id,status:entry.status,priority:entry.priority,progress:rosterProgress(entry,weapon),nextGoal:goalSummary(goal),complete:goal.complete}}).slice(0,3);
  const coverage=teamCoverage(normalized),pendingTeams=coverage.filter(item=>item.status==='pending');
  const bestTeam=matchReviewedTeams({roster:normalized,allowUnowned:false,limit:1}).results?.[0]||null;
  return{
    counts:{saved:normalized.length,active:active.length,building:normalized.filter(entry=>entry.status==='Building').length,finished:normalized.filter(entry=>entry.status==='Finished').length},
    focus,
    bestTeam,
    pendingTeamReviews:pendingTeams.length,
    today:dailyPlan?.top||[],
    blockedToday:dailyPlan?.blocked||[],
    unverifiedToday:dailyPlan?.unverified||[],
    highestImpact:dailyPlan?.highestImpact||null,
    resin:{budget:Number(resinPlan?.budget||0),spent:Number(resinPlan?.spent||0),remaining:Number(resinPlan?.remaining||0)},
    empty:normalized.length===0,
    activeEmpty:active.length===0
  };
}
