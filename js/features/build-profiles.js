import { reviewedBuildProfile } from '../data/build-profiles/index.js';

function clone(value){return value==null?value:JSON.parse(JSON.stringify(value))}

export function resolveBuildProfile(detail={},fallback={}){
  const reviewed=reviewedBuildProfile(detail?.name||fallback?.character||'');
  if(!reviewed)return{...fallback,profileSource:'inferred',confidenceLabel:'Inferred'};
  return{
    ...fallback,
    ...clone(reviewed),
    mainStats:clone(reviewed.mainStats||fallback.mainStats||{}),
    substats:clone(reviewed.substats||fallback.substats||[]),
    confidence:100,
    confidenceLabel:'Reviewed',
    profileSource:'reviewed'
  };
}

export function profileSourceLabel(profile={}){
  return profile.profileSource==='reviewed'?'Reviewed character profile':'General inferred profile';
}

export function profileSources(profile={}){return Array.isArray(profile.sourceRefs)?profile.sourceRefs:[]}
