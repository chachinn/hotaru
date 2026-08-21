import { reviewedBuildProfile } from '../data/build-profiles/index.js';

function clone(value){return value==null?value:JSON.parse(JSON.stringify(value))}
function mergeProfile(base={},overrides={}){
  return{
    ...base,
    ...clone(overrides),
    mainStats:clone(overrides.mainStats||base.mainStats||{}),
    substats:clone(overrides.substats||base.substats||[]),
    targets:clone(overrides.targets||base.targets||{}),
    targetOverrides:clone(overrides.targetOverrides||base.targetOverrides||{}),
    contextOptions:clone(overrides.contextOptions||base.contextOptions||[]),
    sourceRefs:clone(overrides.sourceRefs||base.sourceRefs||[]),
    weaponPriority:clone(overrides.weaponPriority||base.weaponPriority||[]),
    artifactPriority:clone(overrides.artifactPriority||base.artifactPriority||[]),
    talentPriority:clone(overrides.talentPriority||base.talentPriority||[])
  };
}

export function resolveBuildProfile(detail={},fallback={},context={}){
  const reviewed=reviewedBuildProfile(detail?.name||fallback?.character||'');
  if(!reviewed)return{...fallback,profileSource:'inferred',confidenceLabel:'Inferred',activeVariant:null};
  const base=mergeProfile(fallback,reviewed),variants=Array.isArray(reviewed.variants)?reviewed.variants:[],requested=context?.buildVariant||reviewed.defaultVariant||variants[0]?.id||'',variant=variants.find(item=>item.id===requested)||variants.find(item=>item.id===reviewed.defaultVariant)||variants[0]||null,merged=variant?.overrides?mergeProfile(base,variant.overrides):base;
  return{
    ...merged,
    variants:clone(variants),
    defaultVariant:reviewed.defaultVariant||variants[0]?.id||'',
    activeVariant:variant?{id:variant.id,name:variant.name,note:variant.note||''}:null,
    confidence:100,
    confidenceLabel:'Reviewed',
    profileSource:'reviewed'
  };
}

export function profileSourceLabel(profile={}){return profile.profileSource==='reviewed'?'Reviewed character profile':'General inferred profile'}
export function profileSources(profile={}){return Array.isArray(profile.sourceRefs)?profile.sourceRefs:[]}
export function profileVariantOptions(profile={}){return(Array.isArray(profile.variants)?profile.variants:[]).filter(item=>item?.id&&item?.name)}
