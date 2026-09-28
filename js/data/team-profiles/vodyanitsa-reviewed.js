const KQM='https://keqingmains.com/q/vodyanitsa-quickguide/';
const PRYDWEN='https://www.prydwen.gg/genshin-impact/characters/vodyanitsa';
const source=(label,url,type='Reviewed theorycraft')=>({label,url,platform:'Guide',type,reviewedAt:'2026-09-29'});
const kqm=()=>source('Vodyanitsa Quick Guide',KQM);
const prydwen=()=>source('Vodyanitsa Build and Team Guide',PRYDWEN);
const team=(id,name,members,reaction,why,sourceInfo,options={})=>({
  id,name,members,reaction,why,
  notes:options.notes||'',
  provenance:options.provenance||'exact',
  confidence:options.provenance==='adapted'?'Source-informed':'Reviewed',
  source:sourceInfo,
  anchor:'Vodyanitsa',
  profileId:'vodyanitsa-hydro-cryo-support',
  ...(options.constraints?{constraints:options.constraints}:{})
});

export const VODYANITSA_REVIEWED_TEAMS=[
  team('vody-skirk-furina-escoffier','Freeze · Skirk premium',['Vodyanitsa','Skirk','Furina','Escoffier'],'freeze','A pure Hydro/Cryo shell where Vodyanitsa supplies healing, interruption resistance, and RES shred while Furina and Escoffier support Skirk.',prydwen()),
  team('vody-lohen-mona-escoffier','Freeze · Lohen',['Vodyanitsa','Lohen','Mona','Escoffier'],'freeze','Vodyanitsa and Escoffier provide sustain and Cryo/Hydro support around Lohen while Mona supplies additional Hydro and offensive utility.',kqm()),
  team('vody-sandrone-odette-alyosha','Stellar-Conduct · Sandrone',['Vodyanitsa','Sandrone','Odette','Alyosha'],'stellar-conduct','Vodyanitsa adds sustain and Cryo/Hydro support to an existing Sandrone–Odette Stellar-Conduct core without being treated as the Stellar reaction enabler.',kqm()),
  team('vody-cryo-traveler-odette-yae','Stellar-Conduct · Cryo Traveler',['Vodyanitsa','Cryo Traveler','Odette','Yae Miko'],'stellar-conduct','Odette and Yae form the Stellar-Conduct engine while Vodyanitsa supplies sustain and support around Cryo Traveler.',kqm()),
  team('vody-neuv-furina-escoffier','Freeze · Neuvillette + Furina',['Vodyanitsa','Neuvillette','Furina','Escoffier'],'freeze','Vodyanitsa heals and supports the Hydro core while Escoffier supplies Cryo support; her healing also gives Furina a practical sustain plan.',prydwen()),
  team('vody-neuv-furina-xilonen','Hydro · Neuvillette + Xilonen',['Vodyanitsa','Neuvillette','Furina','Xilonen'],'','A Hydro-focused Neuvillette shell where Vodyanitsa provides healing and Hydro RES shred while Xilonen and Furina amplify team damage.',kqm()),
  team('vody-neuv-xilonen-kazuha','Hydro · Neuvillette hypercarry',['Vodyanitsa','Neuvillette','Xilonen','Kaedehara Kazuha'],'','Vodyanitsa provides Hydro RES shred, healing, and interruption resistance while Xilonen and Kazuha supply additional offensive support.',kqm()),
  team('vody-hydro-traveler-mona-albedo','Hydro · Traveler + Mona',['Vodyanitsa','Hydro Traveler','Mona','Albedo'],'','A source-listed flexible Hydro team where Vodyanitsa supports Hydro Traveler and Mona while Albedo contributes off-field damage.',kqm()),
  team('vody-ayato-citlali-escoffier','Freeze · Ayato',['Vodyanitsa','Kamisato Ayato','Citlali','Escoffier'],'freeze','Ayato receives Vodyanitsa’s Hydro support while Citlali and Escoffier provide the Cryo side of the Freeze shell.',kqm()),
  team('vody-varka-mona-prune','Hydro · Varka',['Vodyanitsa','Varka','Mona','Prune'],'','Vodyanitsa strengthens Varka’s Hydro-oriented mode while Mona and Prune provide the reviewed support core.',prydwen(),{constraints:{pruneMinConstellation:6,monaMinConstellation:2},notes:'This quantified comparison assumes C6 Prune and C2 Mona.'}),
  team('vody-chasca-furina-mavuika','Hydro/Cryo support · Chasca',['Vodyanitsa','Chasca','Furina','Mavuika'],'','Vodyanitsa acts as the sustain and Hydro support slot while Furina and Mavuika provide off-field pressure around Chasca.',kqm()),
  team('vody-vesna-odette-traveler','Stellar-Swirl · Vesna + Cryo Traveler',['Vodyanitsa','Vesna','Odette','Cryo Traveler'],'stellar-swirl','Vesna is the true Stellar-Swirl enabler and on-field carry; Odette and Cryo Traveler provide the Cryo Stellar core while Vodyanitsa buffs and sustains.',kqm()),
  team('vody-vesna-odette-c6-faruzan','Stellar-Swirl · Vesna + Faruzan',['Vodyanitsa','Vesna','Odette','Faruzan'],'stellar-swirl','Vesna enables Stellar Swirl while Vodyanitsa supplies sustain and Stellar-Swirl support; Odette and a fully developed Faruzan complete the premium shell.',prydwen(),{constraints:{faruzanMinConstellation:6},notes:'This specific premium comparison assumes C6 Faruzan.'}),
  team('vody-mizuki-odette-traveler','Stellar-Swirl · Mizuki premium',['Vodyanitsa','Yumemizuki Mizuki','Odette','Cryo Traveler'],'stellar-swirl','Mizuki drives the team while Odette and Cryo Traveler establish the Stellar-Swirl structure; Vodyanitsa supports but does not enable the reaction herself.',prydwen()),
  team('vody-mizuki-traveler-diona','Stellar-Swirl · Mizuki limited roster',['Vodyanitsa','Yumemizuki Mizuki','Cryo Traveler','Diona'],'stellar-swirl','A lower-cost Mizuki structure where Cryo Traveler and Diona maintain Cryo-side support and Vodyanitsa covers healing and buffs.',kqm()),
  team('vody-nilou-lauma-nahida','Nilou Bloom · Full EM trigger',['Vodyanitsa','Nilou','Lauma','Nahida'],'bloom','Vodyanitsa can stay on-field and own a substantial share of Bountiful Bloom triggers while also healing through Bloom self-damage.',kqm(),{notes:'Use the dedicated Full-EM Nilou Bloom trigger build; preserve Hydro + Dendro only.'}),
  team('vody-varka-mona-prune-general','Hydro · Varka general investment',['Vodyanitsa','Varka','Mona','Prune'],'','The same reviewed Hydro-Varka shell remains structurally valid below the quantified premium constellations, but its published premium comparison assumes higher investment.',kqm(),{provenance:'adapted',notes:'Structure is source-backed; premium constellation assumptions are not required for basic structural validity.'}),
  team('vody-lohen-mona-escoffier-premium','Freeze · Lohen premium comparison',['Vodyanitsa','Lohen','Escoffier','Mona'],'freeze','A quantified Freeze comparison where Vodyanitsa improves Lohen’s Hydro/Cryo support shell alongside Escoffier and Mona.',prydwen(),{constraints:{monaMinConstellation:4},notes:'This quantified comparison assumes C4 Mona.'})
];

export default VODYANITSA_REVIEWED_TEAMS;
