export const ARTIFACT_FARM_INFO={
  "Silken Moon's Serenade":{source:'Frostladen Machinery',region:'Nod-Krai',kind:'Artifact Domain',sourceUrl:'https://game8.co/games/Genshin-Impact/archives/402023'},
  'Noblesse Oblige':{source:'Clear Pool and Mountain Cavern',region:'Liyue',kind:'Artifact Domain / Artifact Strongbox'},
  'Aubade of Morningstar and Moon':{source:"Moonchild's Treasures",region:'Nod-Krai',kind:'Artifact Domain',sourceUrl:'https://game8.co/games/Genshin-Impact/archives/393918'},
  'Instructor':{source:'World/elite/boss drops and reliquaries',region:'Teyvat',kind:'4-star world-drop set'},
  'Fragment of Harmonic Whimsy':{source:'Faded Theater',region:'Fontaine',kind:'Artifact Domain'},
  "Night of the Sky's Unveiling":{source:'Frostladen Machinery',region:'Nod-Krai',kind:'Artifact Domain'},
  "Gladiator's Finale":{source:'Normal/Weekly Bosses and Artifact Strongbox',region:'Teyvat',kind:'Boss-drop set / Artifact Strongbox'},
  "Nymph's Dream":{source:'Molten Iron Fortress',region:'Sumeru',kind:'Artifact Domain'},
  'Heart of Depth':{source:'Peak of Vindagnyr',region:'Dragonspine',kind:'Artifact Domain / Artifact Strongbox'},
  'Heart of the Furnace':{source:'Artifact Domain',region:'Snezhnaya',kind:'Artifact Domain'},
  'Scarlet Proof':{source:'Artifact Domain',region:'Snezhnaya',kind:'Artifact Domain'},
  'Disenchantment in Deep Shadow':{source:'Artifact Domain',region:'Snezhnaya',kind:'Artifact Domain'},
  'Tenacity of the Millelith':{source:'Ridge Watch',region:'Liyue',kind:'Artifact Domain / Artifact Strongbox'}
};

export const WEAPON_FARM_INFO={
  'Flame-Forged Insight':{source:'Sunspray Summer Resort event (Version 5.8); currently unavaile if missed',kind:'Limited event weapon',sourceUrl:'https://game8.co/games/Genshin-Impact/archives/538085'},
  'Master Key':{source:'Forge after buying the Diagram from Lyulka in Nod-Krai',kind:'Craftable Claymore',sourceUrl:'https://genshin-impact.fandom.com/wiki/Master_Key'},
  'Favonius Greatsword':{source:'Wishes',kind:'Gacha weapon'},
  'Makhaira Aquamarine':{source:'Limited Weapon Event Wishes when featured',kind:'Limited gacha weapon'}
};

export function artifactFarmInfo(name=''){
  const key=String(name||'').trim();
  return ARTIFACT_FARM_INFO[key]||{source:'Open the Domain map to locate current artifact farming domains.',region:'Teyvat',kind:'Artifact source pending character review'};
}
export function weaponFarmInfo(name=''){
  const key=String(name||'').trim();
  return WEAPON_FARM_INFO[key]||{source:'See the weapon details and current acquisition source; availability can change by banner or event.',kind:'Acquisition source'};
}
