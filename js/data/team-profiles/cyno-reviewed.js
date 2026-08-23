const KQM='https://keqingmains.com/q/cyno-quickguide/';
const GAME8='https://game8.co/games/Genshin-Impact/archives/315233';
const source=(label,url,type='Reviewed theorycraft')=>({label,url,type,platform:'Guide',reviewedAt:'2026-08-23'});
const kqm=()=>source('KQM Cyno Quick Guide',KQM);
const game8=()=>source('Game8 Cyno Best Builds and Teams',GAME8,'Source-backed guide');
const confidenceFor=s=>s?.type==='Reviewed theorycraft'?'Reviewed':'Community-sourced';
const team=(id,name,members,reaction,why,src,notes='',provenance='exact')=>({id,name,members,reaction,why,notes,provenance,confidence:confidenceFor(src),source:src,anchor:'Cyno',profileId:'cyno'});
export const CYNO_REVIEWED_TEAMS=[
  team('cyno-game8-qb-nahida-yelan-baizhu','Quickbloom · Nahida/Yelan/Baizhu',['Cyno','Nahida','Yelan','Baizhu'],'quickbloom','Game8 exact Hyperbloom/Quickbloom team.',game8()),
  team('cyno-game8-qb-nahida-fischl-kokomi','Quickbloom · Nahida/Fischl/Kokomi',['Cyno','Nahida','Fischl','Sangonomiya Kokomi'],'quickbloom','Game8 exact Hyperbloom team.',game8()),
  team('cyno-game8-qb-collei-xingqiu-yaoyao','Quickbloom · Collei/Xingqiu/Yaoyao',['Cyno','Collei','Xingqiu','Yaoyao'],'quickbloom','Game8 exact lower-cost Hyperbloom team.',game8()),
  team('cyno-game8-aggravate-fischl-nahida-baizhu','Aggravate · Fischl/Nahida/Baizhu',['Cyno','Fischl','Nahida','Baizhu'],'aggravate','Game8 exact Aggravate team.',game8()),
  team('cyno-game8-aggravate-fischl-nahida-zhongli','Aggravate · Fischl/Nahida/Zhongli',['Cyno','Fischl','Nahida','Zhongli'],'aggravate','Game8 exact Aggravate team.',game8()),
  team('cyno-game8-aggravate-kazuha-collei-kuki','Aggravate · Kazuha/Collei/Kuki',['Cyno','Kaedehara Kazuha','Collei','Kuki Shinobu'],'aggravate','Game8 exact Aggravate team.',game8()),
  team('cyno-game8-aggravate-beidou-nahida-zhongli','Aggravate · Beidou/Nahida/Zhongli',['Cyno','Beidou','Nahida','Zhongli'],'aggravate','Game8 exact Aggravate option.',game8()),

  team('cyno-kqm-qb-nahida-yelan-kuki','Quickbloom · Nahida/Yelan/Kuki',['Cyno','Nahida','Yelan','Kuki Shinobu'],'quickbloom','KQM exact high-damage Quickbloom team.',kqm()),
  team('cyno-kqm-qb-nahida-xingqiu-baizhu','Quickbloom · Nahida/Xingqiu/Baizhu',['Cyno','Nahida','Xingqiu','Baizhu'],'quickbloom','KQM exact Quickbloom team with strong defensive utility.',kqm()),
  team('cyno-kqm-qb-dmc-xingqiu-beidou','Quickbloom · Dendro Traveler/Xingqiu/Beidou',['Cyno','Dendro Traveler','Xingqiu','Beidou'],'quickbloom','KQM exact accessible Quickbloom team.',kqm()),
  team('cyno-kqm-aggravate-baizhu-nahida-fischl','Aggravate · Baizhu/Nahida/Fischl',['Cyno','Baizhu','Nahida','Fischl'],'aggravate','KQM exact Double Dendro + Double Electro team.',kqm()),
  team('cyno-kqm-aggravate-nahida-yae-zhongli','Aggravate · Nahida/Yae/Zhongli',['Cyno','Nahida','Yae Miko','Zhongli'],'aggravate','KQM exact Aggravate team.',kqm()),
  team('cyno-kqm-aggravate-yaoyao-fischl-kazuha','Aggravate · Yaoyao/Fischl/Kazuha',['Cyno','Yaoyao','Fischl','Kaedehara Kazuha'],'aggravate','KQM exact Aggravate team.',kqm()),
  team('cyno-kqm-quickburn-nahida-thoma-fischl','Quickburn · Nahida/Thoma/Fischl',['Cyno','Nahida','Thoma','Fischl'],'quickburn','KQM exact Quickburn team; Nahida + Thoma are specifically required for this archetype.',kqm()),
  team('cyno-kqm-chaos-nahida-thoma-yelan','Chaos · Nahida/Thoma/Yelan',['Cyno','Nahida','Thoma','Yelan'],'quickburn','KQM exact Quickburn + Quickbloom Chaos team.',kqm()),

  team('cyno-adapt-qb-nahida-furina-baizhu','Quickbloom · Nahida/Furina/Baizhu',['Cyno','Nahida','Furina','Baizhu'],'quickbloom','KQM specifically highlights Furina with Cyno and prefers Baizhu as healer in these Quickbloom teams.',kqm(),'Source-informed from KQM Furina/Baizhu guidance.','adapted'),
  team('cyno-adapt-qb-nahida-furina-kuki','Quickbloom · Nahida/Furina/Kuki',['Cyno','Nahida','Furina','Kuki Shinobu'],'quickbloom','KQM supports Furina and Kuki as long-duration Hydro/Electro sustain options.',kqm(),'Source-informed teammate combination.','adapted'),
  team('cyno-adapt-qb-nahida-yelan-zhongli','Quickbloom · Nahida/Yelan/Zhongli',['Cyno','Nahida','Yelan','Zhongli'],'quickbloom','KQM supports Yelan Quickbloom and Zhongli as the premium defensive flex.',kqm(),'Source-informed Quickbloom variant.','adapted'),
  team('cyno-adapt-qb-nahida-xingqiu-kuki','Quickbloom · Nahida/Xingqiu/Kuki',['Cyno','Nahida','Xingqiu','Kuki Shinobu'],'quickbloom','KQM supports Xingqiu for Hydro and interruption resistance and Kuki for healing/Electro utility.',kqm(),'Source-informed Quickbloom variant.','adapted'),
  team('cyno-adapt-qb-baizhu-yelan-fischl','Quickbloom · Baizhu/Yelan/Fischl',['Cyno','Baizhu','Yelan','Fischl'],'quickbloom','KQM supports Baizhu as long-duration Dendro sustain, Yelan as Hydro and Fischl as the second Electro battery.',kqm(),'Source-informed Quickbloom variant.','adapted'),
  team('cyno-adapt-qb-baizhu-xingqiu-fischl','Quickbloom · Baizhu/Xingqiu/Fischl',['Cyno','Baizhu','Xingqiu','Fischl'],'quickbloom','KQM teammate roles support this durable second-Electro Quickbloom shell.',kqm(),'Source-informed Quickbloom variant.','adapted'),
  team('cyno-adapt-qb-dmc-yelan-kuki','Quickbloom · Dendro Traveler/Yelan/Kuki',['Cyno','Dendro Traveler','Yelan','Kuki Shinobu'],'quickbloom','KQM supports Dendro Traveler as an accessible Dendro enabler, Yelan Hydro and Kuki sustain.',kqm(),'Source-informed accessible variant.','adapted'),
  team('cyno-adapt-qb-dmc-xingqiu-kuki','Quickbloom · Dendro Traveler/Xingqiu/Kuki',['Cyno','Dendro Traveler','Xingqiu','Kuki Shinobu'],'quickbloom','Accessible Quickbloom using KQM-supported long-duration teammates.',kqm(),'Source-informed accessible variant.','adapted'),
  team('cyno-adapt-qb-yaoyao-yelan-fischl','Quickbloom · Yaoyao/Yelan/Fischl',['Cyno','Yaoyao','Yelan','Fischl'],'quickbloom','KQM lists Yaoyao as a Baizhu alternative and Fischl as a strong second Electro.',kqm(),'Source-informed Quickbloom variant.','adapted'),
  team('cyno-adapt-qb-kirara-xingqiu-fischl','Quickbloom · Kirara/Xingqiu/Fischl',['Cyno','Kirara','Xingqiu','Fischl'],'quickbloom','KQM supports Kirara as defensive Dendro, Xingqiu for Hydro/IR and Fischl for battery damage.',kqm(),'Source-informed defensive Quickbloom variant.','adapted'),

  team('cyno-adapt-aggravate-nahida-fischl-kazuha','Aggravate · Nahida/Fischl/Kazuha',['Cyno','Nahida','Fischl','Kaedehara Kazuha'],'aggravate','KQM supports Nahida/Fischl plus Kazuha as an Aggravate shell when sustain is not required.',kqm(),'Source-informed offensive Aggravate variant.','adapted'),
  team('cyno-adapt-aggravate-nahida-fischl-sucrose','Aggravate · Nahida/Fischl/Sucrose',['Cyno','Nahida','Fischl','Sucrose'],'aggravate','KQM explicitly notes Sucrose can refresh her EM buff from off-field during Cyno field time.',kqm(),'Source-informed Aggravate variant.','adapted'),
  team('cyno-adapt-aggravate-baizhu-fischl-kazuha','Aggravate · Baizhu/Fischl/Kazuha',['Cyno','Baizhu','Fischl','Kaedehara Kazuha'],'aggravate','Baizhu provides long-duration sustain while Fischl lowers ER and Kazuha buffs Electro.',kqm(),'Source-informed Aggravate variant.','adapted'),
  team('cyno-adapt-aggravate-baizhu-yae-zhongli','Aggravate · Baizhu/Yae/Zhongli',['Cyno','Baizhu','Yae Miko','Zhongli'],'aggravate','KQM supports Baizhu, Yae and Zhongli as compatible long-duration Aggravate teammates.',kqm(),'Source-informed Aggravate variant.','adapted'),
  team('cyno-adapt-aggravate-yaoyao-fischl-zhongli','Aggravate · Yaoyao/Fischl/Zhongli',['Cyno','Yaoyao','Fischl','Zhongli'],'aggravate','Yaoyao is a KQM-listed Baizhu alternative while Fischl and Zhongli cover battery and defense.',kqm(),'Source-informed Aggravate variant.','adapted'),
  team('cyno-adapt-aggravate-kirara-fischl-kazuha','Aggravate · Kirara/Fischl/Kazuha',['Cyno','Kirara','Fischl','Kaedehara Kazuha'],'aggravate','Kirara supplies shielding and Dendro Resonance utility; Fischl/Kazuha cover Electro support.',kqm(),'Source-informed Aggravate variant.','adapted'),
  team('cyno-adapt-aggravate-dmc-fischl-zhongli','Aggravate · Dendro Traveler/Fischl/Zhongli',['Cyno','Dendro Traveler','Fischl','Zhongli'],'aggravate','Accessible Aggravate shell using KQM-supported roles.',kqm(),'Source-informed accessible variant.','adapted'),
  team('cyno-adapt-aggravate-nahida-beidou-zhongli','Aggravate · Nahida/Beidou/Zhongli',['Cyno','Nahida','Beidou','Zhongli'],'aggravate','KQM supports Beidou as a second Electro with defensive value and Zhongli as shield flex.',kqm(),'Source-informed Aggravate variant.','adapted'),

  team('cyno-adapt-chaos-nahida-thoma-xingqiu','Chaos · Nahida/Thoma/Xingqiu',['Cyno','Nahida','Thoma','Xingqiu'],'quickburn','KQM explicitly allows Xingqiu in Chaos, noting stronger Hydro application reduces Quicken uptime but improves damage reduction.',kqm(),'Source-informed exact archetype substitution.','adapted'),
  team('cyno-adapt-quickburn-nahida-thoma-yae','Quickburn · Nahida/Thoma/Yae',['Cyno','Nahida','Thoma','Yae Miko'],'quickburn','KQM defines Quickburn as Cyno + Nahida + Thoma + Electro; Yae is a supported off-field Electro option.',kqm(),'Source-informed Quickburn variant.','adapted'),
  team('cyno-adapt-quickburn-nahida-thoma-kuki','Quickburn · Nahida/Thoma/Kuki',['Cyno','Nahida','Thoma','Kuki Shinobu'],'quickburn','KQM Quickburn structure supports another Electro in the fourth slot; Kuki adds healing and lowers Cyno ER.',kqm(),'Source-informed Quickburn variant.','adapted'),
  team('cyno-adapt-quickburn-nahida-thoma-beidou','Quickburn · Nahida/Thoma/Beidou',['Cyno','Nahida','Thoma','Beidou'],'quickburn','KQM Quickburn structure supports another Electro; Beidou contributes off-field damage and interruption resistance.',kqm(),'Source-informed Quickburn variant.','adapted')
];
export default CYNO_REVIEWED_TEAMS;