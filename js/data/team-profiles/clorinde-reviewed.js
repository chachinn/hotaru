const KQM='https://keqingmains.com/q/clorinde-quickguide/';
const GAME8='https://game8.co/games/Genshin-Impact/archives/417218';
const source=(label,url,type='Reviewed theorycraft')=>({label,url,platform:'Guide',type,reviewedAt:'2026-08-23'});
const kqm=()=>source('KQM Clorinde Quick Guide',KQM);
const game8=()=>source('Game8 Clorinde Best Builds and Teams',GAME8,'Primary reviewed guide');
const team=(id,name,members,reaction,why,sourceInfo,notes='',provenance='exact')=>({id,name,members,reaction,why,notes,provenance,confidence:provenance==='exact'?'Reviewed':'Source-informed',source:sourceInfo,anchor:'Clorinde',profileId:'clorinde'});

export const CLORINDE_REVIEWED_TEAMS=[
  team('clo-kqm-agg-fischl-nahida-kazuha','Aggravate · Fischl + Nahida + Kazuha',['Clorinde','Fischl','Nahida','Kaedehara Kazuha'],'aggravate','Standard reviewed Aggravate shell with Fischl damage/battery, Nahida Dendro and Kazuha Electro support.',kqm()),
  team('clo-kqm-agg-sara-nahida-xilonen','Aggravate · Sara + Nahida + Xilonen',['Clorinde','Kujou Sara','Nahida','Xilonen'],'aggravate','Reviewed Sara hyper-buff Aggravate example with Nahida and Xilonen.',kqm()),
  team('clo-kqm-agg-fischl-kirara-sucrose','Aggravate · Kirara + Sucrose',['Clorinde','Fischl','Kirara','Sucrose'],'aggravate','Reviewed defensive Aggravate example and Thundering Fury rotation shell.',kqm()),
  team('clo-kqm-agg-fischl-nahida-sucrose','Aggravate · Fischl + Nahida + Sucrose',['Clorinde','Fischl','Nahida','Sucrose'],'aggravate','Sucrose is explicitly recommended as an effective offensive Aggravate support.',kqm(),'Source-backed Anemo substitution.','adapted'),
  team('clo-kqm-agg-fischl-nahida-xilonen','Aggravate · Fischl + Nahida + Xilonen',['Clorinde','Fischl','Nahida','Xilonen'],'aggravate','Xilonen is explicitly recommended as a powerful offensive support and works naturally in Clorinde Quicken shells.',kqm(),'Source-backed support substitution.','adapted'),
  team('clo-kqm-agg-fischl-kirara-kazuha','Aggravate · Kirara + Kazuha',['Clorinde','Fischl','Kirara','Kaedehara Kazuha'],'aggravate','Preserves the reviewed Fischl/Kirara defensive core while using the explicitly recommended premium Anemo debuffer.',kqm(),'Source-informed variant.','adapted'),

  team('clo-kqm-qb-fischl-nahida-furina','Quickbloom · Furina',['Clorinde','Fischl','Nahida','Furina'],'quickbloom','Reviewed Quickbloom example; Furina supplies Hydro, damage and teamwide buffing.',kqm()),
  team('clo-kqm-qb-fischl-nahida-yelan','Quickbloom · Yelan',['Clorinde','Fischl','Nahida','Yelan'],'quickbloom','Reviewed Yelan alternative in the same Quickbloom shell.',kqm()),
  team('clo-game8-qb-nahida-furina-baizhu','Quickbloom · Baizhu sustain',['Clorinde','Nahida','Furina','Baizhu'],'quickbloom','Game8 lists this Clorinde Hyperbloom/Quickbloom composition with Nahida, Furina and Baizhu.',game8()),
  team('clo-kqm-qb-fischl-nahida-xingqiu','Quickbloom · Xingqiu',['Clorinde','Fischl','Nahida','Xingqiu'],'quickbloom','KQM allows Hydro units in the Quicken flex slot; Xingqiu preserves off-field Hydro and adds interruption resistance.',kqm(),'Source-informed Hydro substitution.','adapted'),

  team('clo-kqm-qburn-fischl-emilie-mavuika','Quickburn · Mavuika',['Clorinde','Fischl','Emilie','Mavuika'],'quickburn','Reviewed Quickburn example using Mavuika off-field Pyro with Emilie and Fischl.',kqm()),
  team('clo-kqm-qburn-fischl-emilie-xiangling','Quickburn · Xiangling',['Clorinde','Fischl','Emilie','Xiangling'],'quickburn','Reviewed Xiangling variation; frequent Burning/Overload enables the reaction-focused build.',kqm()),

  team('clo-kqm-over-sara-mavuika','Overload · Sara + Mavuika',['Clorinde','Chevreuse','Kujou Sara','Mavuika'],'overload','Reviewed Chevreuse Overload example using Sara and Mavuika.',kqm()),
  team('clo-kqm-over-sara-pyrotrav','Overload · Sara + Pyro Traveler',['Clorinde','Chevreuse','Kujou Sara','Pyro Traveler'],'overload','Reviewed Pyro Traveler alternative in the Sara Overload shell.',kqm()),
  team('clo-kqm-over-fischl-mavuika','Overload · Fischl + Mavuika',['Clorinde','Chevreuse','Fischl','Mavuika'],'overload','Reviewed Chevreuse shell with Fischl and Mavuika.',kqm()),
  team('clo-kqm-over-fischl-xiangling','Overload · Fischl + Xiangling',['Clorinde','Chevreuse','Fischl','Xiangling'],'overload','Reviewed Xiangling alternative in the Fischl Overload shell.',kqm()),
  team('clo-kqm-over-ororon-mavuika','Overload · Ororon + Mavuika',['Clorinde','Chevreuse','Ororon','Mavuika'],'overload','Reviewed Ororon/Mavuika Chevreuse composition.',kqm()),
  team('clo-kqm-over-ororon-pyrotrav','Overload · Ororon + Pyro Traveler',['Clorinde','Chevreuse','Ororon','Pyro Traveler'],'overload','Reviewed Pyro Traveler alternative with Ororon.',kqm()),
  team('clo-kqm-over-iansan-mavuika','Overload · Iansan + Mavuika',['Clorinde','Chevreuse','Iansan','Mavuika'],'overload','Reviewed Iansan/Mavuika Overload example.',kqm()),
  team('clo-kqm-over-iansan-xiangling','Overload · Iansan + Xiangling',['Clorinde','Chevreuse','Iansan','Xiangling'],'overload','Reviewed Xiangling alternative with Iansan.',kqm()),
  team('clo-kqm-over-iansan-thoma','Overload · Iansan + Thoma',['Clorinde','Chevreuse','Iansan','Thoma'],'overload','KQM explicitly gives a Thoma rotation for this Iansan/Chevreuse shell.',kqm()),
  team('clo-game8-over-fischl-thoma','Overload · Fischl + Thoma',['Clorinde','Fischl','Chevreuse','Thoma'],'overload','Game8 lists Fischl, Chevreuse and Thoma as a representative Clorinde Overload team.',game8()),
  team('clo-kqm-over-yae-mavuika','Overload · Yae + Mavuika',['Clorinde','Chevreuse','Yae Miko','Mavuika'],'overload','Yae is explicitly listed as an adequate off-field Electro option and Mavuika as a premier Pyro partner.',kqm(),'Source-informed teammate combination.','adapted'),
  team('clo-kqm-over-fischl-bennett','Overload · Fischl + Bennett',['Clorinde','Chevreuse','Fischl','Bennett'],'overload','Bennett and Fischl are both explicitly recommended Clorinde partners in Chevreuse-compatible Pyro/Electro teams.',kqm(),'Source-informed support combination.','adapted'),

  team('clo-kqm-ec-furina-kazuha-ororon','Electro-Charged · Furina + Ororon',['Clorinde','Furina','Kaedehara Kazuha','Ororon'],'electro-charged','Reviewed Electro-Charged example with Furina, Kazuha and Ororon.',kqm()),
  team('clo-kqm-ec-furina-kazuha-fischl','Electro-Charged · Furina + Fischl',['Clorinde','Furina','Kaedehara Kazuha','Fischl'],'electro-charged','Reviewed Fischl alternative in the Furina/Kazuha EC shell.',kqm()),
  team('clo-kqm-ec-furina-xilonen-ororon','Electro-Charged · Xilonen + Ororon',['Clorinde','Furina','Xilonen','Ororon'],'electro-charged','Reviewed Furina/Xilonen/Ororon Electro-Charged example.',kqm()),
  team('clo-kqm-ec-furina-xilonen-sara','Electro-Charged · Xilonen + Sara',['Clorinde','Furina','Xilonen','Kujou Sara'],'electro-charged','Reviewed Sara alternative in the Furina/Xilonen shell.',kqm()),
  team('clo-game8-ec-xingqiu-furina-jean','Electro-Charged · Double Hydro',['Clorinde','Xingqiu','Furina','Jean'],'electro-charged','Game8 representative double-Hydro Electro-Charged team.',game8()),
  team('clo-game8-ec-yelan-xingqiu-sucrose','Electro-Charged · Yelan + Xingqiu',['Clorinde','Yelan','Xingqiu','Sucrose'],'electro-charged','Game8 representative Hydro-heavy Electro-Charged team with Sucrose.',game8()),

  team('clo-game8-lc-ineffa-columbina-xingqiu','Lunar-Charged · Ineffa + Columbina',['Clorinde','Ineffa','Columbina','Xingqiu'],'lunar-charged','Game8 representative Lunar-Charged composition using both dedicated Lunar enablers.',game8()),
  team('clo-game8-lc-ineffa-columbina-furina','Lunar-Charged · Ineffa + Columbina + Furina',['Clorinde','Ineffa','Columbina','Furina'],'lunar-charged','Preserves Game8’s Ineffa/Columbina Lunar-Charged core while using its separately recommended Furina Hydro support.',game8(),'Source-informed Hydro flex.','adapted'),
  team('clo-game8-lc-ineffa-columbina-yelan','Lunar-Charged · Ineffa + Columbina + Yelan',['Clorinde','Ineffa','Columbina','Yelan'],'lunar-charged','Preserves Game8’s dedicated Lunar core while using its recommended Yelan Hydro option.',game8(),'Source-informed Hydro flex.','adapted'),

  team('clo-game8-hyper-fischl-sara-kazuha','Hypercarry · Sara + Kazuha',['Clorinde','Fischl','Kujou Sara','Kaedehara Kazuha'],'hypercarry','Game8 representative Clorinde Hypercarry team.',game8()),
  team('clo-game8-hyper-fischl-chiori-zhongli','Hypercarry · Double Geo',['Clorinde','Fischl','Chiori','Zhongli'],'hypercarry','Game8 representative Clorinde/Fischl Double Geo team.',game8()),
  team('clo-kqm-hyper-fischl-iansan-xilonen','Hypercarry · Iansan + Xilonen',['Clorinde','Fischl','Iansan','Xilonen'],'hypercarry','Iansan and Xilonen are explicitly recommended offensive supports, with Fischl providing battery and off-field damage.',kqm(),'Source-informed raw Electro shell.','adapted'),
  team('clo-kqm-hyper-sara-kazuha-xilonen','Hypercarry · Sara + dual support',['Clorinde','Kujou Sara','Kaedehara Kazuha','Xilonen'],'hypercarry','Sara, Kazuha and Xilonen are all explicitly recommended for maximizing Clorinde personal Electro damage.',kqm(),'Source-informed hypercarry shell; monitor Energy without Fischl.','adapted'),

  team('clo-kqm-shield-fischl-nahida-lanyan','Aggravate · Lan Yan shield',['Clorinde','Fischl','Nahida','Lan Yan'],'aggravate','Lan Yan is explicitly recommended as a strong shield and supportive Catalyst user.',kqm(),'Source-backed defensive substitution.','adapted'),
  team('clo-kqm-agg-fischl-nahida-lynette','Aggravate · Lynette accessible',['Clorinde','Fischl','Nahida','Lynette'],'aggravate','Lynette is explicitly listed as a viable VV support for Clorinde.',kqm(),'Source-backed accessible Anemo substitution.','adapted')
];
