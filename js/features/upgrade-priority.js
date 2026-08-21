function nameKey(value=''){return String(value||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
export function priorityIndex(list=[],name=''){const target=nameKey(name);return(Array.isArray(list)?list:[]).findIndex(item=>nameKey(item)===target)}

export function buildUpgradeActions({profile={},checks={},targets={},mainPoints=0,weapon=null,artifactSet=null,ownedWeapons=[]}={}){
  const issues=[],source=profile.profileSource==='reviewed'?'Reviewed profile + Hotaru analysis':'Hotaru inferred analysis',push=(priority,stat,message,progression='RNG',impact='Medium',farmCategory='Artifacts')=>issues.push({priority,stat,message,progression,impact,source,farmCategory}),ownedNames=new Set((ownedWeapons||[]).map(item=>nameKey(item?.name))),selectedRank=priorityIndex(profile.weaponPriority,weapon?.name),betterOwned=(profile.weaponPriority||[]).find((name,index)=>ownedNames.has(nameKey(name))&&(selectedRank<0||index<selectedRank));
  if(betterOwned&&nameKey(betterOwned)!==nameKey(weapon?.name))push(.5,'Weapon swap',`You already own ${betterOwned}, which is a higher reviewed recommendation for this profile.`,'Guaranteed','High','Weapon');
  if(checks.er?.state==='low')push(1,'Energy Recharge',`Raise ER toward ~${targets.er.good}% for this selected build context.`,'RNG','High','Artifacts');
  const damageRole=/dps/i.test(profile.role||'');if(damageRole&&checks.cr?.state==='low')push(2,'CRIT Rate',`Raise CRIT Rate toward ${targets.cr.good}% before chasing more CRIT DMG.`,'RNG','High','Artifacts');
  if(damageRole&&checks.cd?.state==='low')push(3,'CRIT DMG',`CRIT DMG is below Hotaru's ${profile.profileSource==='reviewed'?'reviewed':'general'} ${profile.role} target.`,'RNG','Medium','Artifacts');
  if(profile.reactionDriven&&checks.em?.state==='low')push(2.5,'Elemental Mastery',`This profile benefits from reactions; add EM toward ${targets.em.good} after higher-priority requirements.`,'RNG','Medium','Artifacts');
  if(mainPoints<14)push(1.5,'Artifact main stats',`One or more artifact main stats do not match the ${profile.profileSource==='reviewed'?'reviewed':'inferred'} build profile.`,'RNG','High','Artifacts');
  const artifactRank=priorityIndex(profile.artifactPriority,artifactSet?.name);if(artifactSet&&profile.profileSource==='reviewed'&&profile.artifactPriority?.length&&artifactRank<0)push(4,'Artifact set',`${artifactSet.name} is not among this reviewed profile's preferred sets; compare it with ${profile.artifactPriority.slice(0,2).join(' or ')}.`,'RNG','Low','Artifacts');
  issues.sort((a,b)=>a.priority-b.priority);return issues.map((item,index)=>({...item,rank:index+1}));
}
