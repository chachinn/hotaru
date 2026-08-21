export const MAP_BASE='https://genshin-impact-map.appsample.com/location';
export const MAP_STORAGE_KEY='hotaru.map.v1';
export const MAP_QUICK_MARKERS=[
  ['All map',''],['Teleport Waypoints','Teleport Waypoint'],['Statues','Statue of The Seven'],
  ['Oculi','Anemoculus,Geoculus,Electroculus'],['Ore','Ores'],['Artifacts','Artifact'],
  ['Cooking ingredients','Cooking Ingredient'],['Fishing','Fish'],['Sakura Bloom','Sakura Bloom'],
  ['Qingxin','Qingxin'],['Cor Lapis','Cor Lapis'],['Sango Pearl','Sango Pearl'],
  ['Amakumo Fruit','Amakumo Fruit'],['Naku Weed','Naku Weed'],['Crystal Marrow','Crystal Marrow']
];

export function normalizeMarkerNames(value){
  const list=Array.isArray(value)?value:String(value||'').split(',');
  return [...new Set(list.map(x=>String(x).trim()).filter(Boolean))].slice(0,24);
}
export function buildMapUrl(names=[]){
  const params=new URLSearchParams();
  const clean=normalizeMarkerNames(names);if(clean.length)params.set('names',clean.join(','));
  params.set('no_heading','1');
  return `${MAP_BASE}?${params.toString()}`;
}
export function remainingTarget(target){return Math.max(0,Number(target?.needed||0)-Number(target?.owned||0))}
export function normalizeTarget(input={}){
  const name=String(input.name||'').trim();
  return {id:String(input.id||`${Date.now()}-${Math.random().toString(36).slice(2,8)}`),name,needed:Math.max(0,Number(input.needed||0)),owned:Math.max(0,Number(input.owned||0)),complete:Boolean(input.complete)||(!Number.isNaN(Number(input.needed))&&Number(input.needed)>0&&remainingTarget(input)<=0),createdAt:input.createdAt||new Date().toISOString()};
}
export function loadMapState(){
  const base={names:[],targets:[],lastOpenedAt:''};
  try{const parsed=JSON.parse(localStorage.getItem(MAP_STORAGE_KEY)||'{}');return {...base,...parsed,names:normalizeMarkerNames(parsed.names),targets:Array.isArray(parsed.targets)?parsed.targets.map(normalizeTarget).slice(-100):[]}}catch{return base}
}
export function saveMapState(state){try{localStorage.setItem(MAP_STORAGE_KEY,JSON.stringify({...state,names:normalizeMarkerNames(state.names),targets:(state.targets||[]).slice(-100)}));return true}catch{return false}}
