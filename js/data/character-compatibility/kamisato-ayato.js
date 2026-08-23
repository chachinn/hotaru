import { KAMISATO_AYATO_REVIEWED_TEAMS as TEAMS } from '../team-profiles/kamisato-ayato-reviewed.js';
const SOURCES=[
  {label:'Ayato current reviewed evidence',url:'https://keqingmains.com/q/ayato-quickguide/',type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-24'},
  {label:'Ayato extended reviewed evidence',url:'https://keqingmains.com/ayato/',type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-24'}
];
const key=value=>String(value||'').trim().toLowerCase();
const special=value=>/\bTPS\b|manekin/i.test(String(value||''));
const evidence=new Map();
for(const team of TEAMS){
  for(const member of team.members||[]){
    if(key(member)==='kamisato ayato')continue;
    const k=key(member),entry=evidence.get(k)||{teamIds:[],exact:false,adapted:false};
    entry.teamIds.push(team.id);if(team.provenance==='adapted')entry.adapted=true;else entry.exact=true;evidence.set(k,entry);
  }
}
const explicitAliases=new Map([['ayato','kamisato ayato'],['kazuha','kaedehara kazuha'],['shinobu','kuki shinobu'],['kokomi','sangonomiya kokomi']]);
function normalized(value=''){const raw=key(value);return explicitAliases.get(raw)||raw}
export function kamisatoAyatoCompatibilityForCharacter(value=''){
  const name=String(value||'').trim(),k=normalized(name);
  if(!name)return{character:name,status:'invalid',smartTeamApproved:false,adaptationAllowed:false,sources:[]};
  if(k==='kamisato ayato')return{character:name,status:'self',smartTeamApproved:false,adaptationAllowed:false,sources:SOURCES};
  if(special(name))return{character:name,status:'not-applicable',smartTeamApproved:false,adaptationAllowed:false,sources:[]};
  const row=evidence.get(k);
  if(row)return{character:name,status:row.exact?'exact-source-backed':'source-backed-compatible',smartTeamApproved:true,adaptationAllowed:true,teamIds:[...new Set(row.teamIds)],sources:SOURCES,reason:'Reviewed Ayato team evidence explicitly supports this pairing within at least one valid archetype.'};
  return{character:name,status:'unverified',smartTeamApproved:false,adaptationAllowed:false,sources:SOURCES,reason:'No Ayato-specific reviewed evidence authorizes Smart Team adaptation with this character.'};
}
export function auditKamisatoAyatoCompatibility(names=[]){const rows=names.map(kamisatoAyatoCompatibilityForCharacter);return{character:'Kamisato Ayato',rows,total:rows.length,smartTeamApproved:rows.filter(row=>row.smartTeamApproved).length,unverified:rows.filter(row=>row.status==='unverified').map(row=>row.character),notApplicable:rows.filter(row=>row.status==='not-applicable').map(row=>row.character)}}
export const KAMISATO_AYATO_COMPATIBILITY_POLICY={
  character:'Kamisato Ayato',reviewedAt:'2026-08-24',
  rule:'Compatibility outranks investment. Standard on-field Ayato needs teammates whose buffs, application and cooldowns respect his Skill windows. 4pc Thundering Fury is approved only when frequent Electro-Charged reactions—normally Double Electro with Fischl-level application—can actually reduce Skill cooldown; never carry that build into generic teams. Nilou Bloom EM is restricted to Hydro/Dendro-only Bountiful Bloom teams with Nilou and practical Dendro sustain, because Ayato must own meaningful Bloom triggers. Hyperbloom and Burgeon use direct-damage Ayato while the Electro/Pyro trigger builds EM. Furina shells require real healing for Fanfare. Off-field Burst Ayato is allowed only when another carry intentionally owns the field window. Account level, weapons, artifacts and constellations are tiebreakers after these structural rules. Unverified pairings remain blocked.',
  buildRules:{
    'onfield-hydro':'Preserve Ayato Skill field time, direct Hydro gearing and the team’s reaction/sustain structure.',
    'thundering-fury':'Require frequent Electro application and real cooldown reduction uptime; the build remains ATK/Hydro/CRIT rather than generic EM.',
    'nilou-bloom-em':'Require Nilou plus Hydro/Dendro-only composition and practical Dendro sustain; prioritize ER then EM for Ayato-owned Bountiful Blooms.',
    'burst-support':'Only use when Ayato intentionally gives field time to another carry and can meet his 80-cost Burst requirement.'
  },sources:SOURCES
};
