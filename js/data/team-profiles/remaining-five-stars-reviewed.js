import { REMAINING_FIVE_STAR_BUILD_PROFILES } from '../build-profiles/remaining-five-stars.js';

const REVIEWED_AT='2026-08-24';
function slug(value=''){return String(value||'').trim().toLowerCase().normalize('NFKD').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function key(value=''){return String(value||'').trim().toLowerCase()}
function sourceFor(team={},profile={}){
  const source=team?.source||{};
  if(source?.url)return{...source,label:source.label||'Current reviewed team reference',type:source.type||'Reviewed guide',platform:source.platform||'Guide',reviewedAt:source.reviewedAt||REVIEWED_AT};
  const fallback=profile.sourceRefs?.[0];
  return fallback?.url?{label:fallback.label||'Current reviewed team reference',url:fallback.url,type:fallback.kind||'Reviewed guide',platform:fallback.platform||'Guide',reviewedAt:REVIEWED_AT}:{label:'Reviewed team structure',url:'',type:'Reviewed guide',platform:'Guide',reviewedAt:REVIEWED_AT};
}
function reactionFromName(value=''){
  const text=String(value||'').toLowerCase();
  const rules=[
    ['lunar-crystallize',/lunar[- ]crystall/],['lunar-charged',/lunar[- ]charged/],['lunar-bloom',/lunar[- ]bloom/],
    ['stellar-conduct',/stellar[- ]conduct/],['stellar-swirl',/stellar[- ]swirl/],['electro-charged',/electro[- ]charged|taser/],
    ['hyperbloom',/hyperbloom|quickbloom/],['burgeon',/burgeon/],['aggravate',/aggravate/],['quicken',/quicken/],['spread',/spread/],
    ['vaporize',/vapori[sz]e|\bvape\b/],['melt',/\bmelt\b/],['freeze',/freeze/],['overload',/overload/],['burning',/burning|burn-melt|burn-vape/],
    ['bloom',/\bbloom\b/],['crystallize',/crystall/],['swirl',/swirl/]
  ];
  return rules.find(([,pattern])=>pattern.test(text))?.[0]||'';
}
function compositionKey(members=[]){return[...new Set((members||[]).map(name=>key(name)).filter(Boolean))].sort().join('|')}
function variantSamples(profile={}){return(profile.variants||[]).flatMap(variant=>(variant?.overrides?.buildSummaryTeams||[]).map(team=>({...team,_variant:variant.name||'Reviewed build',_note:variant.note||''})))}

const rows=[];
for(const profile of REMAINING_FIVE_STAR_BUILD_PROFILES){
  const anchor=profile.character,seen=new Set(),full=(profile.reviewedTeams||[]).map(team=>({...team,_variant:'Reviewed Team Comps',_note:''})),candidates=[...full,...variantSamples(profile)];
  for(const [index,team] of candidates.entries()){
    const members=(team.members||[]).map(name=>String(name||'').trim()).filter(Boolean);
    if(members.length!==4||!members.some(name=>key(name)===key(anchor)))continue;
    const comp=compositionKey(members);if(!comp||seen.has(comp))continue;seen.add(comp);
    rows.push({
      id:`${slug(anchor)}-reviewed-${index+1}`,
      name:String(team.name||team._variant||'Reviewed Team').trim(),members,
      reaction:reactionFromName(`${team.name||''} ${team._variant||''}`),
      why:`Reviewed composition for ${anchor}; Hotaru preserves the listed four-character structure before considering account-investment substitutions.`,
      notes:team._note||'',provenance:'source-informed',confidence:'Reviewed',source:sourceFor(team,profile),anchor,profileId:profile.id
    });
  }
}

export const REMAINING_FIVE_STAR_REVIEWED_TEAMS=rows;
export function remainingFiveStarReviewedTeamsForCharacter(name=''){const wanted=key(name);return rows.filter(team=>team.members.some(member=>key(member)===wanted))}
export default REMAINING_FIVE_STAR_REVIEWED_TEAMS;
