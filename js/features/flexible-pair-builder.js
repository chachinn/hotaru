import { canonicalTeamCharacter } from '../data/team-profiles/index.js';

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
function rosterSet(roster=[]){return new Set((roster||[]).map(entry=>key(entryTeamName(entry))))}
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

export function buildFlexiblePairTeams({roster=[],lockedNames=[],allowUnowned=false,limit=12}={}){
  const locks=unique(lockedNames).map(name=>{
    const row=(roster||[]).find(entry=>key(entry.name)===key(name)||key(entry.teamName)===key(name));
    return canonicalTeamCharacter(row?.teamName||name);
  }).slice(0,2);
  const supported=locks.length===2&&pairKey(locks)===pairKey(['Odette','Flins']);
  if(!supported)return{kind:'flexible-pair',supported:false,results:[],previewAvailable:false,lockedNames:locks};
  const all=odetteFlinsCandidates(roster),eligible=allowUnowned?all:all.filter(team=>team.ownedComplete),requested=Math.max(1,Math.min(24,Number(limit)||12));
  return{
    kind:'flexible-pair',supported:true,adapted:true,lockedNames:locks,
    results:eligible.slice(0,requested),
    previewAvailable:all.some(team=>!team.ownedComplete),
    exactPair:false,
    rationale:'No exact sourced Odette + Flins composition is currently in Hotaru. These options preserve Flins’s sourced Lunar-Charged requirements and use Odette only as the flexible off-field slot.'
  };
}

export const FLEXIBLE_PAIR_POLICY={
  label:'Adapted · Off-meta',
  supportedPairs:[['Odette','Flins']],
  sources:[KQM_FLINS,IV_ODETTE]
};
