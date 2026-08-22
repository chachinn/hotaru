import { canonicalTeamCharacter } from '../data/team-profiles/index.js';
import { recommendedTeamsForCharacter, teamHasValidSource } from '../data/team-recommendations.js';
import { teamMatchesReaction } from '../data/team-reaction-tags.js';

const KQM_FLINS='https://keqingmains.com/q/flins-quickguide/';
const IV_ODETTE='https://www.icy-veins.com/genshin-impact/odette-team-guide';

const NOD_KRAI_HYDRO=['Columbina','Aino'];
const NOD_KRAI_ELECTRO=['Ineffa'];
const HYDRO=['Columbina','Aino','Yelan','Furina','Mona','Sangonomiya Kokomi','Xingqiu','Candace'];
const ELECTRO=['Ineffa','Fischl','Iansan','Kujou Sara','Kuki Shinobu','Dori','Ororon','Yae Miko','Beidou'];
const PREFERENCE=new Map([
  ['ineffa',120],['columbina',120],['aino',105],['fischl',88],['iansan',78],['ororon',74],['yae miko',72],['kuki shinobu',68],['kujou sara',64],['beidou',60],['dori',52],
  ['yelan',72],['furina',68],['mona',64],['sangonomiya kokomi',62],['xingqiu',58],['candace',48]
]);

function key(value=''){return String(value||'').trim().toLowerCase()}
function unique(values=[]){return [...new Set(values.map(value=>String(value||'').trim()).filter(Boolean))]}
function pairKey(values=[]){return unique(values.map(canonicalTeamCharacter)).map(key).sort().join('|')}
function entryTeamName(entry={}){return canonicalTeamCharacter(entry.teamName||entry.name)}
function rosterSet(roster=[]){return new Set((roster||[]).flatMap(entry=>[entryTeamName(entry),entry.name]).map(key).filter(Boolean))}
function preference(name=''){return PREFERENCE.get(key(name))||40}
function source(){return{
  label:'KQM Flins + Icy Veins Odette',
  url:KQM_FLINS,
  type:'Adapted from reviewed theorycraft',
  reviewedAt:'2026-08-22',
  links:[
    {label:'KQM Flins Quick Guide',url:KQM_FLINS},
    {label:'Icy Veins Odette Team Guide',url:IV_ODETTE}
  ]
}}
function sourceItems(sourceInfo={}){const raw=[...(Array.isArray(sourceInfo?.links)?sourceInfo.links:[]),sourceInfo],seen=new Set(),out=[];for(const item of raw){if(!item?.url)continue;const sig=`${item.label||''}|${item.url}`;if(seen.has(sig))continue;seen.add(sig);out.push({label:item.label||'Source',url:item.url,type:item.type||sourceInfo.type||'Sourced team'})}return out}
function compositionKey(members=[]){return members.map(canonicalTeamCharacter).map(key).sort().join('|')}
function makeTeam({members,hydro,electro,moon,owned,index}){
  const canonical=members.map(canonicalTeamCharacter),missing=canonical.filter(name=>!owned.has(key(name))),ownedCount=4-missing.length;
  const supportParts=[];
  if(hydro)supportParts.push(`${hydro} keeps the Hydro side of Lunar-Charged active`);
  if(electro)supportParts.push(`${electro} adds off-field Electro/energy support`);
  if(moon)supportParts.push(`${moon} helps Flins reach Ascendant Gleam`);
  return{
    id:`adapted-odette-flins-${index+1}`,
    name:`Adapted Lunar-Charged · ${hydro||moon}`,
    members:canonical,
    why:`Flins stays on field for Lunar-Charged while Odette takes the flexible off-field slot. ${supportParts.join('; ')}.`,
    notes:'Off-meta adaptation, not an exact reviewed Odette + Flins composition. KQM allows an Anemo/Flex fourth slot in Flins teams, but Odette’s Cryo application can compete with Hydro/Electro aura. Keep Lunar-Charged uptime and Flins’s field window as the priority.',
    confidence:'Adapted',
    adaptationTier:'Off-meta',
    adaptedFrom:'Flins — Electro — Hydro — Anemo/Flex',
    reaction:'lunar-charged',
    source:source(),
    missing,ownedCount,ownedComplete:missing.length===0,
    score:ownedCount*1000+preference(hydro)+preference(electro)+preference(moon)
  };
}

function odetteFlinsCandidates(roster=[]){
  const owned=rosterSet(roster),raw=[];
  for(const moonHydro of NOD_KRAI_HYDRO){
    for(const electro of ELECTRO){
      if(key(electro)===key(moonHydro))continue;
      raw.push({members:['Flins','Odette',moonHydro,electro],hydro:moonHydro,electro,moon:moonHydro});
    }
  }
  for(const moonElectro of NOD_KRAI_ELECTRO){
    for(const hydro of HYDRO){
      if(key(hydro)===key(moonElectro))continue;
      raw.push({members:['Flins','Odette',moonElectro,hydro],hydro,electro:moonElectro,moon:moonElectro});
    }
  }
  const seen=new Set(),out=[];
  for(const item of raw){
    if(new Set(item.members.map(key)).size!==4)continue;
    const comp=compositionKey(item.members);if(seen.has(comp))continue;seen.add(comp);
    out.push(makeTeam({...item,owned,index:out.length}));
  }
  return out.sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name));
}

function sourceRank(team={}){return team.confidence==='Reviewed'?3:team.confidence==='Community-sourced'?2:team.confidence==='Simulation-backed'?1:0}
function genericPairCandidates(roster=[],locks=[],reaction='all'){
  const owned=rosterSet(roster),pools=locks.map(lock=>recommendedTeamsForCharacter(lock).filter(team=>teamHasValidSource(team)&&teamMatchesReaction(team,reaction)));
  if(pools.some(pool=>!pool.length))return{all:[],coverageGap:true};
  const supportMap=new Map(),sideSources=[[],[]];
  pools.forEach((pool,side)=>{
    for(const team of pool){
      const members=(team.members||[]).map(canonicalTeamCharacter),links=sourceItems(team.source||{});
      sideSources[side].push(...links);
      for(const member of members){
        if(locks.some(lock=>key(lock)===key(member)))continue;
        const memberKey=key(member);if(!memberKey)continue;
        const row=supportMap.get(memberKey)||{name:member,sides:new Set(),frequency:0,sourceRank:0,links:[]};
        row.sides.add(side);row.frequency+=1;row.sourceRank=Math.max(row.sourceRank,sourceRank(team));row.links.push(...links);supportMap.set(memberKey,row);
      }
    }
  });
  const supports=[...supportMap.values()].sort((a,b)=>b.sides.size-a.sides.size+(b.frequency-a.frequency)*0.01+(b.sourceRank-a.sourceRank)*0.001||a.name.localeCompare(b.name)).slice(0,18);
  const out=[],seen=new Set();
  for(let i=0;i<supports.length;i++)for(let j=i+1;j<supports.length;j++){
    const a=supports[i],b=supports[j],covered=new Set([...a.sides,...b.sides]);if(covered.size<2)continue;
    const members=[...locks,a.name,b.name].map(canonicalTeamCharacter);if(new Set(members.map(key)).size!==4)continue;
    const comp=compositionKey(members);if(seen.has(comp))continue;seen.add(comp);
    const missing=members.filter(name=>!owned.has(key(name))),ownedCount=4-missing.length;
    const links=[],linkSeen=new Set();for(const item of [...a.links,...b.links,...sideSources.flat()]){const sig=`${item.label}|${item.url}`;if(linkSeen.has(sig))continue;linkSeen.add(sig);links.push(item);if(links.length>=4)break}
    const common=[a,b].filter(row=>row.sides.size===2).map(row=>row.name),sharedCopy=common.length?`${common.join(' and ')} recur in sourced teams for both selected characters.`:`${a.name} and ${b.name} are taken from the selected characters’ separate sourced team pools.`;
    out.push({
      id:`adapted-pair-${key(locks[0]).replace(/[^a-z0-9]+/g,'-')}-${key(locks[1]).replace(/[^a-z0-9]+/g,'-')}-${out.length+1}`,
      name:`Source-backed pair · ${a.name} + ${b.name}`,
      members,
      why:`No exact sourced ${locks[0]} + ${locks[1]} four-person composition is currently indexed. ${sharedCopy}`,
      notes:'Adapted pair bridge: both locked characters are kept, while the remaining slots come only from teammates that appear in sourced recommendations for one or both locks. This is not relabeled as a reviewed exact composition.',
      confidence:'Adapted',adaptationTier:'Source-backed pair bridge',adaptedFrom:`Separate sourced team pools for ${locks[0]} and ${locks[1]}`,
      reaction:'',
      source:{label:`${locks[0]} + ${locks[1]} sourced team references`,url:links[0]?.url||'',type:'Source-backed adaptation',links},
      missing,ownedCount,ownedComplete:missing.length===0,
      score:ownedCount*1000+(a.sides.size+b.sides.size)*100+(a.frequency+b.frequency)*10+(a.sourceRank+b.sourceRank)
    });
  }
  return{all:out.sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name)),coverageGap:false};
}

export function buildFlexiblePairTeams({roster=[],lockedNames=[],allowUnowned=false,limit=12,reaction='all'}={}){
  const locks=unique(lockedNames).map(name=>{
    const row=(roster||[]).find(entry=>key(entry.name)===key(name)||key(entry.teamName)===key(name));
    return canonicalTeamCharacter(row?.teamName||name);
  }).slice(0,2);
  if(locks.length!==2)return{kind:'flexible-pair',supported:false,results:[],previewResults:[],previewAvailable:false,lockedNames:locks};
  const requested=Math.max(1,Math.min(24,Number(limit)||12));
  if(pairKey(locks)===pairKey(['Odette','Flins'])){
    const all=odetteFlinsCandidates(roster).filter(team=>teamMatchesReaction(team,reaction)),eligible=allowUnowned?all:all.filter(team=>team.ownedComplete);
    return{
      kind:'flexible-pair',supported:true,adapted:true,lockedNames:locks,
      results:eligible.slice(0,requested),previewResults:all.slice(0,requested),
      previewAvailable:all.some(team=>!team.ownedComplete),exactPair:false,
      rationale:'No exact sourced Odette + Flins composition is currently in Hotaru. These options preserve Flins’s sourced Lunar-Charged requirements and use Odette only as the flexible off-field slot.'
    };
  }
  const generic=genericPairCandidates(roster,locks,reaction),eligible=allowUnowned?generic.all:generic.all.filter(team=>team.ownedComplete);
  return{
    kind:'flexible-pair',supported:!generic.coverageGap,adapted:true,generic:true,coverageGap:generic.coverageGap,lockedNames:locks,
    results:eligible.slice(0,requested),previewResults:generic.all.slice(0,requested),previewAvailable:generic.all.some(team=>!team.ownedComplete),exactPair:false,
    rationale:`No exact sourced four-person composition currently contains both ${locks[0]} and ${locks[1]}. Hotaru is showing a clearly labeled source-backed pair bridge instead of returning a dead end.`
  };
}

export const FLEXIBLE_PAIR_POLICY={
  label:'Adapted · Source-backed',
  specialPairs:[['Odette','Flins']],
  genericPairBridge:true,
  sources:[KQM_FLINS,IV_ODETTE]
};
