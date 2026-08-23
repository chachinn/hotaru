const STATUS_SCORE={Finished:18,Usable:10,Building:2,'Not Building':-8};
const PRIORITY_SCORE={High:8,Medium:4,Low:0};
function key(value=''){return String(value||'').trim().toLowerCase()}
function compactKey(value=''){return String(value||'').normalize('NFKD').replace(/[^a-z0-9]/gi,'').toLowerCase()}
function clamp(value,min,max,fallback=min){const number=Number(value);return Number.isFinite(number)?Math.max(min,Math.min(max,number)):fallback}
function rosterMap(roster=[]){return new Map((roster||[]).map(entry=>[key(entry.name),entry]))}
function artifactMap(artifacts=[]){
  const map=new Map();
  for(const artifact of artifacts||[]){const location=compactKey(artifact?.location);if(!location)continue;if(!map.has(location))map.set(location,[]);map.get(location).push(artifact)}
  return map;
}
function levelPenalty(level=1){
  const n=clamp(level,1,90,1);
  if(n>=90)return 30;
  if(n>=80)return 0;
  if(n>=70)return-70;
  if(n>=60)return-140;
  if(n>=50)return-210;
  return-300;
}
function talentPenalty(talents={}){
  const total=['attack','skill','burst'].reduce((sum,name)=>sum+clamp(talents?.[name],1,15,1),0);
  if(total>=24)return 20;
  if(total>=18)return 0;
  if(total>=12)return-45;
  return-90;
}
function weaponScore(weapon=null,dataAvailable=false){
  if(!weapon)return dataAvailable?-110:0;
  const rarity=clamp(weapon?.rarity,1,5,0),level=clamp(weapon?.level,1,90,1),refinement=clamp(weapon?.refinement,1,5,1);
  const rarityScore=rarity>=5?34:rarity===4?22:rarity===3?10:4;
  const lowLevelPenalty=level>=80?0:level>=70?-20:level>=60?-55:-100;
  return rarityScore+(level/90)*72+(refinement-1)*3+lowLevelPenalty;
}
function artifactScore(rows=[],dataAvailable=false){
  if(!dataAvailable)return 0;
  const equipped=(rows||[]).filter(Boolean).slice(0,5);
  if(!equipped.length)return-150;
  const count=equipped.length,totalLevel=equipped.reduce((sum,row)=>sum+clamp(row?.level,0,20,0),0),average=totalLevel/count;
  const countPenalty=(5-count)*-24;
  const levelPart=(totalLevel/100)*110;
  const floorPenalty=average>=16?20:average>=12?0:average>=8?-55:-110;
  return levelPart+countPenalty+floorPenalty;
}
export function characterInvestmentScore(entry={},weapon=entry?.equippedWeapon||null,{artifacts=[],artifactDataAvailable=false,weaponDataAvailable=false}={}){
  const talents=entry?.talents||{},talentTotal=['attack','skill','burst'].reduce((sum,name)=>sum+clamp(talents?.[name],1,15,1),0);
  const level=clamp(entry?.level,1,90,1),ascension=clamp(entry?.ascension,0,6,0),constellation=clamp(entry?.constellation,0,6,0);
  const levelScore=Math.pow(level/90,2)*160;
  const ascensionScore=(ascension/6)*36;
  const talentScore=(Math.max(0,talentTotal-3)/27)*92;
  const constellationScore=constellation*6;
  const manualScore=(STATUS_SCORE[entry?.status]??0)+(PRIORITY_SCORE[entry?.priority]??0);
  const score=levelScore+ascensionScore+talentScore+constellationScore+weaponScore(weapon,weaponDataAvailable)+artifactScore(artifacts,artifactDataAvailable)+levelPenalty(level)+talentPenalty(talents)+manualScore;
  return Math.round(score);
}
export function readinessScore(teamMembers=[],roster=[]){
  const map=rosterMap(roster);let total=0;
  for(const name of teamMembers){const entry=map.get(key(name));if(!entry)continue;const level=clamp(entry?.level,1,90,1);total+=(level>=90?24:level>=80?16:level>=70?4:-20)+(STATUS_SCORE[entry.status]??0)+(PRIORITY_SCORE[entry.priority]??0)}
  return Math.round(total);
}
export function teamLevelReadiness(teamMembers=[],roster=[]){
  const map=rosterMap(roster),levels=(teamMembers||[]).map(name=>{const entry=map.get(key(name));return entry?clamp(entry?.level,1,90,1):0});
  const level90Count=levels.filter(level=>level>=90).length,level80PlusCount=levels.filter(level=>level>=80).length,below80Count=levels.filter(level=>level<80).length;
  return{levels,level90Count,level80PlusCount,below80Count,allLevel90:levels.length>0&&level90Count===levels.length,averageLevel:levels.length?Math.round(levels.reduce((sum,level)=>sum+level,0)/levels.length):0};
}
export function rosterInvestmentScore(teamMembers=[],roster=[],{artifacts=[],weaponDataAvailable=false,artifactDataAvailable=false}={}){
  const map=rosterMap(roster),byLocation=artifactMap(artifacts),scores=(teamMembers||[]).map(name=>{
    const entry=map.get(key(name));if(!entry)return-400;
    const rows=byLocation.get(compactKey(entry.name))||byLocation.get(compactKey(entry.teamName))||[];
    return characterInvestmentScore(entry,entry?.equippedWeapon||null,{artifacts:rows,artifactDataAvailable,weaponDataAvailable});
  });
  if(!scores.length)return 0;
  const sorted=[...scores].sort((a,b)=>b-a),total=scores.reduce((sum,score)=>sum+score,0),strongest=sorted[0]||0,second=sorted[1]||0,weakest=sorted[sorted.length-1]||0;
  const underbuilt=scores.filter(score=>score<40).length;
  return Math.round(total+strongest*.75+second*.25+weakest*.35-underbuilt*120);
}
export function scoreReviewedTeam(team,{roster=[],ownedNames=[],lockedNames=[],artifacts=[]}={}){
  const owned=new Set((ownedNames||[]).map(key)),members=(team.members||[]).map(key),locked=(lockedNames||[]).filter(Boolean).map(key);
  if(locked.some(name=>!members.includes(name)))return Number.NEGATIVE_INFINITY;
  const ownedCount=members.filter(name=>owned.has(name)).length,missingCount=Math.max(0,members.length-ownedCount);
  const weaponDataAvailable=(roster||[]).some(entry=>entry?.equippedWeapon),artifactDataAvailable=Array.isArray(artifacts)&&artifacts.length>0,levels=teamLevelReadiness(team.members,roster);
  const levelPriority=(levels.level90Count*180)+(levels.allLevel90?520:0)-(levels.below80Count*220);
  return ownedCount*100-missingCount*120+readinessScore(team.members,roster)+rosterInvestmentScore(team.members,roster,{artifacts,weaponDataAvailable,artifactDataAvailable})+levelPriority+(locked.length*40);
}
