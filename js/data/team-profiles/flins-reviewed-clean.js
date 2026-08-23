import { FLINS_REVIEWED_TEAMS as RAW_FLINS_REVIEWED_TEAMS } from './flins-reviewed.js';
const key=value=>String(value||'').trim().toLowerCase();
const composition=team=>[...(team.members||[])].map(key).sort().join('|');
function sourceList(source={}){const rows=[];for(const item of [source,...(source.links||[])])if(item?.url&&!rows.some(row=>row.url===item.url))rows.push(item);return rows}
const byComposition=new Map();
for(const team of RAW_FLINS_REVIEWED_TEAMS){const id=composition(team),existing=byComposition.get(id);if(!existing){byComposition.set(id,{...team,source:{...(team.source||{}),links:sourceList(team.source||{})}});continue}const merged=sourceList(existing.source||{});for(const item of sourceList(team.source||{}))if(!merged.some(row=>row.url===item.url))merged.push(item);existing.source={...(existing.source||team.source||{}),links:merged};existing.notes=[existing.notes,team.notes].filter(Boolean).filter((value,index,list)=>list.indexOf(value)===index).join(' ');if(existing.provenance!=='exact'&&team.provenance==='exact')existing.provenance='exact'}
export const FLINS_REVIEWED_TEAMS=[...byComposition.values()];
export default FLINS_REVIEWED_TEAMS;
