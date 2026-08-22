const STATUS_SCORE={Finished:28,Usable:22,Building:14,'Not Building':2};
const PRIORITY_SCORE={High:12,Medium:7,Low:3};
function key(value=''){return String(value||'').trim().toLowerCase()}
function clamp(value,min,max,fallback=min){const number=Number(value);return Number.isFinite(number)?Math.max(min,Math.min(max,number)):fallback}
function rosterMap(roster=[]){return new Map((roster||[]).map(entry=>[key(entry.name),entry]))}
export function characterInvestmentScore(entry={},weapon=entry?.equippedWeapon||null){
  const talents=entry?.talents||{},talentTotal=['attack','skill','burst'].reduce((sum,name)=>sum+clamp(talents?.[name],1,15,1),0);
  const rarity=clamp(weapon?.rarity,1,5,0),weaponLevel=clamp(weapon?.level,1,90,0),refinement=clamp(weapon?.refinement,1,5,1);
  const weaponRarity=rarity>=5?30:rarity===4?18:rarity===3?8:rarity>0?3:0;
  const score=(clamp(entry?.level,1,90,1)/90)*24+(clamp(entry?.ascension,0,6,0)/6)*10+clamp(entry?.constellation,0,6,0)*9+(talentTotal/30)*24+weaponRarity+(weaponLevel/90)*18+(refinement-1)*2;
  return Math.round(score);
}
export function readinessScore(teamMembers=[],roster=[]){
  const map=rosterMap(roster);let total=0;
  for(const name of teamMembers){const entry=map.get(key(name));if(!entry)continue;total+=(STATUS_SCORE[entry.status]??6)+(PRIORITY_SCORE[entry.priority]??5)+Math.min(10,Math.max(0,Number(entry.level||0))/9)}
  return Math.round(total);
}
export function rosterInvestmentScore(teamMembers=[],roster=[]){
  const map=rosterMap(roster),scores=(teamMembers||[]).map(name=>{const entry=map.get(key(name));return entry?characterInvestmentScore(entry):0}).filter(score=>score>0);
  if(!scores.length)return 0;const total=scores.reduce((sum,score)=>sum+score,0),strongest=Math.max(...scores);
  return Math.round(total*.55+strongest*1.6);
}
export function scoreReviewedTeam(team,{roster=[],ownedNames=[],lockedNames=[]}={}){
  const owned=new Set((ownedNames||[]).map(key)),members=(team.members||[]).map(key),locked=(lockedNames||[]).filter(Boolean).map(key);
  if(locked.some(name=>!members.includes(name)))return Number.NEGATIVE_INFINITY;
  const ownedCount=members.filter(name=>owned.has(name)).length,missingCount=Math.max(0,members.length-ownedCount);
  return ownedCount*100-missingCount*120+readinessScore(team.members,roster)+rosterInvestmentScore(team.members,roster)+(locked.length*40);
}
