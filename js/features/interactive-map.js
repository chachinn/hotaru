import { MAP_PROVIDER_BROWSE_URL, MAP_COMMON_MARKERS, MAP_OCULUS_MARKERS, MAP_AREA_MARKERS, sanitizeProviderBrowseUrl } from '../data/map-registry.js';
export const MAP_BASE='https://genshin-impact-map.appsample.com/location';
export const MAP_BROWSE_URL=MAP_PROVIDER_BROWSE_URL;
export const MAP_STORAGE_KEY='hotaru.map.v1';

export const MAP_FILTER_GROUPS={
  'Exploration':[MAP_COMMON_MARKERS.shrine,MAP_COMMON_MARKERS.waypoint,MAP_COMMON_MARKERS.statue,MAP_COMMON_MARKERS.domain,'Common Chest','Exquisite Chest','Precious Chest','Luxurious Chest','Seelie','Viewpoint',MAP_COMMON_MARKERS.quests],
  'Oculi & Collectibles':[...MAP_OCULUS_MARKERS,'Crimson Agate','Spirit Carp','Lumenspar','Key Sigil I','Key Sigil II','Key Sigil III','Key Sigil IV','Key Sigil V','Sacred Seal','Radiant Spincrystal','Mnemonic Cluster'],
  'Local Specialties':['Dandelion Seed','Cecilia','Calla Lily','Small Lamp Grass','Philanemo Mushroom','Valberry','Windwheel Aster','Wolfhook','Cor Lapis','Glaze Lily','Jueyun Chili','Noctilucous Jade','Qingxin','Silk Flower','Starconch','Violetgrass','Amakumo Fruit','Crystal Marrow','Dendrobium','Naku Weed','Onikabuto','Sakura Bloom','Sango Pearl','Sea Ganoderma','Scarab','Redcrest','Tidalga','Lakelight Lily','Rainbow Rose','Romaritime Flower','Spring of the First Dewdrop','Beryl Conch','Subdetection Unit','Lumidouce Bell','Marcotte','Cacahuatl','Grainfruit','Candlecap Mushroom','Embercore Flower','Spinel Fruit','Lakkaberry','Midsommar Berry','Icy Pebble','Windrest Flower'],
  'General Materials':['Mist Flower Corolla','Flaming Flower Stamen','Electro Crystal','Crystal Core','Butterfly Wings','Snapdragon','Horsetail','Frog','Lizard Tail','Crab','Raw Meat','Fowl','Matsutake','Pinecone','Bird Egg','Sweet Flower','Mint','Mushroom','Berry','Sunsettia','Apple','Lotus Head','Carrot','Radish','Cooking Ingredient','Harvestable Plant'],
  'Artifacts':['Artifact'],
  'Ore & Mining':['Ores','White Iron Chunk','Crystal Chunk','Magical Crystal Chunk','Starsilver','Amethyst Lump'],
  'Enemies & Bosses':['Hilichurl','Mitachurl','Fatui Skirmisher','Fatui Mirror Maiden','Whopperflower','Specter','Ruin Sentinel','Ruin Grader','Anemo Hypostasis','Geo Hypostasis','Electro Hypostasis','Cryo Hypostasis','Pyro Hypostasis','Oceanid','Cryo Regisvine','Pyro Regisvine','Primo Geovishap','Maguu Kenki','Perpetual Mechanical Array'],
  'Fishing':['Fish','Medaka','Glaze Medaka','Sweet-Flower Medaka','Aizen Medaka','Dawncatcher','Crystalfish','Lunged Stickleback','Betta','Venomspine Fish','Akai Maou','Snowstrider','Golden Koi','Rusty Koi','Raimei Angelfish'],
  'Wood':['Fir Wood','Pine Wood','Bamboo Segment','Sandbearer Wood','Birch Wood','Cuihua Wood','Fragrant Cedar Wood','Otogi Wood','Maple Wood','Aralia Wood','Yumemiru Wood']
};

export const MAP_QUICK_MARKERS=[
  ['All map',''],['Teleport Waypoints','Teleport Waypoint'],['Statues','Statue of The Seven'],
  ['Oculi',MAP_OCULUS_MARKERS.join(',')],['Local specialties','Sakura Bloom,Qingxin,Lakelight Lily,Windrest Flower'],
  ['Ore','Ores'],['Artifacts','Artifact'],['Ingredients','Cooking Ingredient'],['Fishing','Fish']
];

export function getMapFilterGroups(){return Object.keys(MAP_FILTER_GROUPS)}
export function getMapFilterOptions(group='All'){
  const values=group&&group!=='All'?(MAP_FILTER_GROUPS[group]||[]):Object.values(MAP_FILTER_GROUPS).flat();
  return [...new Set(values)].sort((a,b)=>a.localeCompare(b));
}
export function normalizeMarkerNames(value){
  const list=Array.isArray(value)?value:String(value||'').split(',');
  return [...new Set(list.map(x=>String(x).trim()).filter(Boolean))].slice(0,24);
}
export function buildMapUrl(names=[],options={}){
  if(options?.browseAll)return sanitizeProviderBrowseUrl(options?.browseUrl)||MAP_BROWSE_URL;
  const params=new URLSearchParams();
  const clean=normalizeMarkerNames(names);if(clean.length)params.set('names',clean.join(','));
  params.set('no_heading','1');
  return `${MAP_BASE}?${params.toString()}`;
}
export function remainingTarget(target){return Math.max(0,Number(target?.needed||0)-Number(target?.owned||0))}
export function normalizeTarget(input={}){
  const name=String(input.name||'').trim();
  return {id:String(input.id||`${Date.now()}-${Math.random().toString(36).slice(2,8)}`),name,category:String(input.category||'').trim(),needed:Math.max(0,Number(input.needed||0)),owned:Math.max(0,Number(input.owned||0)),complete:Boolean(input.complete)||(!Number.isNaN(Number(input.needed))&&Number(input.needed)>0&&remainingTarget(input)<=0),createdAt:input.createdAt||new Date().toISOString()};
}
export function loadMapState(){
  const base={names:[],targets:[],lastOpenedAt:'',browseAll:false,browseUrl:''};
  try{const parsed=JSON.parse(localStorage.getItem(MAP_STORAGE_KEY)||'{}');return {...base,...parsed,browseAll:Boolean(parsed.browseAll),browseUrl:sanitizeProviderBrowseUrl(parsed.browseUrl),names:normalizeMarkerNames(parsed.names),targets:Array.isArray(parsed.targets)?parsed.targets.map(normalizeTarget).slice(-100):[]}}catch{return base}
}
export function saveMapState(state){try{localStorage.setItem(MAP_STORAGE_KEY,JSON.stringify({...state,browseAll:Boolean(state.browseAll),browseUrl:sanitizeProviderBrowseUrl(state.browseUrl),names:normalizeMarkerNames(state.names),targets:(state.targets||[]).slice(-100)}));return true}catch{return false}}
