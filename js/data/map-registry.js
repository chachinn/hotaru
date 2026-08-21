export const MAP_PROVIDER_ORIGIN='https://genshin-impact-map.appsample.com';
export const MAP_PROVIDER_BROWSE_URL=`${MAP_PROVIDER_ORIGIN}/?lang=EN`;

export const MAP_COMMON_MARKERS={
  shrine:'Shrine of Depth',
  waypoint:'Teleport Waypoint',
  statue:'Statue of The Seven',
  domain:'Domain',
  quests:'World Quests'
};

export const MAP_NATIONS=['Mondstadt','Liyue','Inazuma','Sumeru','Fontaine','Natlan','Nod-Krai','Snezhnaya'];
export const MAP_OCULI={
  Mondstadt:'Anemoculus',
  Liyue:'Geoculus',
  Inazuma:'Electroculus',
  Sumeru:'Dendroculus',
  Fontaine:'Hydroculus',
  Natlan:'Pyroculus'
};

export const MAP_SPECIAL_AREAS=[
  'Dragonspine','The Chasm','Enkanomiya','Chenyu Vale','Sea of Bygone Eras',
  'Ancient Sacred Mountain','Temple of Space','Frost Moon'
];

export const MAP_AREA_DEFINITIONS={
  Dragonspine:{markers:[['Crimson Agate',['Crimson Agate'],'Area collectible']]},
  'The Chasm':{markers:[['Lumenspar',['Lumenspar'],'Area collectible']]},
  Enkanomiya:{markers:[['Key Sigils',['Key Sigil I','Key Sigil II','Key Sigil III','Key Sigil IV','Key Sigil V'],'Area collectible']]},
  'Chenyu Vale':{markers:[['Spirit Carp',['Spirit Carp'],'Area collectible']]},
  'Sea of Bygone Eras':{
    browseUrl:`${MAP_PROVIDER_ORIGIN}/?map=sea-of-bygone-eras`,
    markers:[['Hydroculus',['Hydroculus'],'Area collectible']]
  },
  'Ancient Sacred Mountain':{
    browseUrl:`${MAP_PROVIDER_ORIGIN}/?map=ancient_sacred_mountain`,
    markers:[['Pyroculus',['Pyroculus'],'Area collectible']]
  },
  'Temple of Space':{
    browseUrl:`${MAP_PROVIDER_ORIGIN}/?map=temple_of_space`,
    markers:[['Mnemonic Cluster',[],'Provider area filter']]
  },
  'Frost Moon':{
    browseUrl:`${MAP_PROVIDER_ORIGIN}/?map=frost_moon`,
    markers:[['Lunoculus',['Lunoculus'],'Area collectible']]
  }
};

export const MAP_OCULUS_MARKERS=[...new Set([...Object.values(MAP_OCULI),'Lunoculus'])];
export const MAP_AREA_MARKERS=[...new Set(Object.values(MAP_AREA_DEFINITIONS).flatMap(area=>(area.markers||[]).flatMap(([,names])=>names||[])).filter(Boolean))];

export function mapOculusForRegion(region=''){return MAP_OCULI[String(region||'').trim()]||''}
export function mapAreaDefinition(area=''){return MAP_AREA_DEFINITIONS[String(area||'').trim()]||null}
export function mapAreaBrowseUrl(area=''){return mapAreaDefinition(area)?.browseUrl||''}
export function mapAreaMarkers(area=''){
  return (mapAreaDefinition(area)?.markers||[]).map(([label,names,kind])=>({label,names:[...(names||[])],kind}));
}
export function isKnownMapNation(value=''){return MAP_NATIONS.includes(String(value||'').trim())}
export function isKnownMapArea(value=''){return MAP_SPECIAL_AREAS.includes(String(value||'').trim())}

export function guideExplorationMarkers(region=''){
  const rows=[{label:'Shrines of Depths',name:MAP_COMMON_MARKERS.shrine}];
  const oculus=mapOculusForRegion(region);if(oculus)rows.push({label:oculus,name:oculus});
  rows.push(
    {label:'Teleport Waypoints',name:MAP_COMMON_MARKERS.waypoint},
    {label:'Statues',name:MAP_COMMON_MARKERS.statue},
    {label:'Domains',name:MAP_COMMON_MARKERS.domain},
    {label:'World Quests',name:MAP_COMMON_MARKERS.quests}
  );
  return rows;
}

export function sanitizeProviderBrowseUrl(value=''){
  const text=String(value||'').trim();if(!text)return'';
  try{const url=new URL(text);return url.origin===MAP_PROVIDER_ORIGIN?url.href:''}catch{return''}
}
