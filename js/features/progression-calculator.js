import { buildSmartFarmPlan } from './farm-planner.js';

export function progressionInventoryStatus({inventory={},fullAccountImport={}}={}){
  const inventoryEntries=inventory&&typeof inventory==='object'&&!Array.isArray(inventory)?Object.keys(inventory).filter(key=>Number(inventory[key])>0).length:0;
  const importedMaterials=Math.max(0,Number(fullAccountImport?.materials)||0);
  if(importedMaterials>0)return{kind:'synced',label:'Synced inventory',detail:`${importedMaterials} material entr${importedMaterials===1?'y':'ies'} imported with the latest full-account sync.`,inventoryEntries};
  if(inventoryEntries>0)return{kind:'local',label:'Local inventory',detail:`${inventoryEntries} material entr${inventoryEntries===1?'y':'ies'} available in Hotaru.`,inventoryEntries};
  return{kind:'requirements',label:'Requirements only',detail:'This account snapshot did not include material inventory, so Hotaru can calculate requirements but cannot subtract owned materials yet.',inventoryEntries:0};
}

export function buildCharacterProgression({entry,detail,profile={},weapon=null,inventory={},knownMapNames=[],fullAccountImport={}}={}){
  if(!entry||!detail)throw new Error('Character progression requires a roster entry and current character detail.');
  const activeEntry={...entry,status:'Building'};
  const plan=buildSmartFarmPlan({entries:[{entry:activeEntry,detail,profile,weapon}],inventory,knownMapNames});
  const mapMarkers=[...new Set((plan.items||[]).map(item=>item.mapMarker).filter(Boolean))];
  const remainingExact=(plan.items||[]).filter(item=>item.remaining!==null).reduce((sum,item)=>sum+Math.max(0,Number(item.remaining)||0),0);
  return{
    character:entry.name||'',
    plan,
    tasks:plan.tasks||[],
    materials:plan.items||[],
    mapMarkers,
    remainingExact,
    complete:(plan.tasks||[]).length===0&&(plan.items||[]).length===0,
    inventoryStatus:progressionInventoryStatus({inventory,fullAccountImport})
  };
}
