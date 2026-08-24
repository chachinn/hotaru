import batchA from './remaining-five-stars-a.js';
import batchB from './remaining-five-stars-b.js';
import batchC from './remaining-five-stars-c.js';
import batchD from './remaining-five-stars-d.js';
import batchE from './remaining-five-stars-e.js';
import batchF from './remaining-five-stars-f.js';

const REVIEWED_AT='2026-08-24';
function slug(value=''){return String(value||'').trim().toLowerCase().normalize('NFKD').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function cleanStrings(values=[]){return(Array.isArray(values)?values:[]).filter(value=>typeof value==='string'&&value.trim()).map(value=>value.trim())}
function sourceRefs(profile={}){
  if(Array.isArray(profile.sourceRefs)&&profile.sourceRefs.length)return profile.sourceRefs;
  const url=typeof profile.source==='string'?profile.source.trim():'';
  return url?[{label:'Current reviewed build and team reference',kind:'Reviewed guide',url}]:[];
}
function validF2PWeapon(profile={}){
  const value=typeof profile.f2pWeapon==='string'?profile.f2pWeapon.trim():'';
  if(value&&value.length<=80&&!/[.!?]\s/.test(value))return value;
  const weapons=cleanStrings(profile.weaponPriority);
  return weapons.at(-1)||'';
}
function normalizeBuildTeams(value=[]){return(Array.isArray(value)?value:[]).filter(team=>Array.isArray(team?.members)&&team.members.length===4).slice(0,3).map(team=>({...team,members:team.members.map(name=>String(name||'').trim()).filter(Boolean)}))}
function normalizeFullTeams(value=[]){return(Array.isArray(value)?value:[]).filter(team=>Array.isArray(team?.members)&&team.members.length===4).map(team=>({...team,members:team.members.map(name=>String(name||'').trim()).filter(Boolean)}))}
function normalizeVariant(variant={},index=0){
  const overrides={...(variant.overrides||{})};
  if('buildSummaryTeams'in overrides)overrides.buildSummaryTeams=normalizeBuildTeams(overrides.buildSummaryTeams);
  return{...variant,id:variant.id||`build-${index+1}`,name:variant.name||`Build ${index+1}`,overrides};
}
function normalizeProfile(profile={}){
  const variants=(Array.isArray(profile.variants)?profile.variants:[]).map(normalizeVariant);
  return{
    ...profile,
    id:profile.id||`reviewed-${slug(profile.character)}`,
    reviewed:true,
    reviewedAt:REVIEWED_AT,
    aliases:cleanStrings(profile.aliases),
    weaponPriority:cleanStrings(profile.weaponPriority),
    artifactPriority:cleanStrings(profile.artifactPriority),
    substats:cleanStrings(profile.substats),
    talentPriority:cleanStrings(profile.talentPriority),
    strengths:cleanStrings(profile.strengths),
    weaknesses:cleanStrings(profile.weaknesses),
    playstyleTips:cleanStrings(profile.playstyleTips),
    f2pWeapon:validF2PWeapon(profile),
    sourceRefs:sourceRefs(profile),
    reviewedTeams:normalizeFullTeams(profile.reviewedTeams),
    variants,
    defaultVariant:profile.defaultVariant||variants[0]?.id||''
  };
}

export const REMAINING_FIVE_STAR_BUILD_PROFILES=[...batchA,...batchB,...batchC,...batchD,...batchE,...batchF].map(normalizeProfile);
export const REMAINING_FIVE_STAR_CHARACTER_NAMES=REMAINING_FIVE_STAR_BUILD_PROFILES.map(profile=>profile.character);
export default REMAINING_FIVE_STAR_BUILD_PROFILES;
