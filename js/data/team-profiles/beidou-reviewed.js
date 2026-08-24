const KQM='https://keqingmains.com/q/beidou-quickguide/';
const ICY='https://www.icy-veins.com/genshin-impact/beidou-team-guide';
const source={label:'Beidou reviewed team theorycraft',url:ICY,type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-24',links:[{label:'Beidou mechanics cross-check',url:KQM,type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-24'}]};
const team=(id,name,members,reaction,why,notes='')=>({id,name,members,reaction,why,notes,confidence:'Reviewed',provenance:'source-informed',source});
export const BEIDOU_REVIEWED_TEAMS=[
  team('beidou-sucrose-fischl-xingqiu','Electro-Charged · Sucrose',['Beidou','Sucrose','Fischl','Xingqiu'],'electro-charged','Sucrose drives Beidou/Xingqiu coordinated attacks while Fischl batteries Beidou and supplies off-field Electro.'),
  team('beidou-tartaglia-fischl-bennett','Electro-Charged · Tartaglia',['Beidou','Tartaglia','Fischl','Bennett'],'electro-charged','Tartaglia drives Stormbreaker while Fischl batteries Beidou; Bennett supplies sustain and ATK.'),
  team('beidou-ayato-fischl-kazuha','Electro-Charged · Ayato',['Beidou','Kamisato Ayato','Fischl','Kaedehara Kazuha'],'electro-charged','Ayato provides consistent Normal Attacks and Hydro while Fischl handles battery duty and Kazuha supports both elements.'),
  team('beidou-kokomi-fischl-yelan','Electro-Charged · Kokomi',['Beidou','Sangonomiya Kokomi','Fischl','Yelan'],'electro-charged','Kokomi drives Beidou and Yelan safely while Fischl lowers Beidou’s ER burden.'),
  team('beidou-barbara-fischl-rosaria','Electro-Charged · Barbara driver',['Beidou','Barbara','Fischl','Rosaria'],'electro-charged','Barbara drives off-field Electro while Rosaria adds Cryo and Superconduct utility; Fischl batteries Beidou.'),
  team('beidou-heizou-fischl-xingqiu','Electro-Charged · Heizou',['Beidou','Shikanoin Heizou','Fischl','Xingqiu'],'electro-charged','Heizou drives Stormbreaker/Xingqiu and provides Anemo support while Fischl batteries Beidou.'),
  team('beidou-flins-sucrose-aino','Lunar-Charged shell',['Beidou','Flins','Sucrose','Aino'],'lunar-charged','Beidou contributes conventional Electro Burst damage around a Flins/Aino Lunar-Charged shell; she is not the Lunar reaction enabler.'),

  team('beidou-keqing-nahida-kazuha','Aggravate · Keqing',['Beidou','Keqing','Nahida','Kaedehara Kazuha'],'aggravate','Keqing drives while Nahida enables Quicken and Kazuha supports Electro; Beidou owns repeated Aggravate procs.'),
  team('beidou-keqing-dmc-jean','Aggravate · accessible Keqing',['Beidou','Keqing','Dendro Traveler','Jean'],'aggravate','Dendro Traveler enables Quicken and Jean covers sustain/VV while Keqing drives Beidou’s Burst.'),
  team('beidou-clorinde-nahida-fischl','Aggravate · Clorinde',['Beidou','Clorinde','Nahida','Fischl'],'aggravate','Clorinde drives Stormbreaker, Nahida enables Aggravate, and Fischl batteries Beidou.'),
  team('beidou-clorinde-kirara-fischl','Aggravate · Kirara',['Beidou','Clorinde','Kirara','Fischl'],'aggravate','Kirara adds defensive Dendro application while Fischl supplies battery and Clorinde drives.'),
  team('beidou-cyno-nahida-baizhu','Aggravate · Cyno',['Beidou','Cyno','Nahida','Baizhu'],'aggravate','Cyno’s long field time triggers Stormbreaker consistently while Nahida/Baizhu maintain Dendro and sustain.'),
  team('beidou-yae-nahida-fischl','Aggravate · Yae',['Beidou','Yae Miko','Nahida','Fischl'],'aggravate','Yae can take driving windows while Nahida enables Quicken and Fischl solves much of Beidou’s energy need.'),
  team('beidou-sethos-nahida-fischl','Aggravate · Sethos',['Beidou','Sethos','Nahida','Fischl'],'aggravate','Sethos drives an accessible Quicken shell with Fischl battery and Nahida Dendro application.'),
  team('beidou-tighnari-yae-baizhu','Quicken quickswap',['Beidou','Tighnari','Yae Miko','Baizhu'],'quicken','Quickswap Quicken structure where Yae supplies Electro field presence and Baizhu sustain; Beidou is strongest when the rotation includes enough Normal/Charged triggers.'),

  team('beidou-arlecchino-fischl-chevreuse','Overloaded · Arlecchino',['Beidou','Arlecchino','Fischl','Chevreuse'],'overload','Arlecchino drives Stormbreaker in a Pyro/Electro-only Chevreuse shell; Fischl batteries Beidou.'),
  team('beidou-yoimiya-fischl-chevreuse','Overloaded · Yoimiya',['Beidou','Yoimiya','Fischl','Chevreuse'],'overload','Yoimiya’s fast Normal Attacks trigger Stormbreaker reliably while Chevreuse buffs the Pyro/Electro team.'),
  team('beidou-yanfei-fischl-chevreuse','Overloaded · Yanfei',['Beidou','Yanfei','Fischl','Chevreuse'],'overload','Yanfei drives Beidou/Fischl from range while Chevreuse supplies sustain and Overloaded buffs.'),
  team('beidou-klee-fischl-chevreuse','Overloaded · Klee',['Beidou','Klee','Fischl','Chevreuse'],'overload','Klee drives an all-Pyro/Electro shell with Fischl battery and Chevreuse support.'),
  team('beidou-raiden-xiangling-chevreuse','Overloaded · Raiden',['Beidou','Raiden Shogun','Xiangling','Chevreuse'],'overload','Raiden can battery Beidou and cover a separate field window; Stormbreaker does not trigger from Raiden Burst attacks, so rotations must sequence Beidou with normal-attack field time.'),
  team('beidou-gaming-fischl-chevreuse','Overloaded · Gaming',['Beidou','Gaming','Fischl','Chevreuse'],'overload','Gaming uses Normal Attacks between plunges to trigger Stormbreaker while Fischl and Chevreuse maintain the Overloaded shell.'),

  team('beidou-sandrone-yae-qiqi','Stellar-Conduct · Sandrone + Yae',['Beidou','Sandrone','Yae Miko','Qiqi'],'stellar-conduct','Sandrone drives while Yae supplies additional Electro and Qiqi covers Cryo sustain in a current Stellar-Conduct shell.'),
  team('beidou-sandrone-diona-qiqi','Stellar-Conduct · double Cryo',['Beidou','Sandrone','Diona','Qiqi'],'stellar-conduct','A sustain-heavy Sandrone Stellar-Conduct structure where Beidou contributes off-field Electro Burst damage.'),
  team('beidou-wrio-sandrone-diona','Stellar-Conduct · Wriothesley',['Beidou','Wriothesley','Sandrone','Diona'],'stellar-conduct','Wriothesley and Sandrone form the damage core while Diona sustains and Beidou supplies off-field Electro.'),
  team('beidou-cyno-sandrone-baizhu','Stellar-Conduct · Cyno',['Beidou','Cyno','Sandrone','Baizhu'],'stellar-conduct','Cyno takes the extended driver window while Sandrone provides the Stellar structure and Baizhu covers sustain.'),
  team('beidou-traveler-odette-alyosha','Stellar-Conduct · Cryo Traveler',['Beidou','Cryo Traveler','Odette','Alyosha'],'stellar-conduct','Cryo Traveler and Odette provide the Stellar reaction framework while Alyosha supports and Beidou contributes off-field Electro.'),
  team('beidou-sandrone-odette-alyosha','Stellar-Conduct · Odette core',['Beidou','Sandrone','Odette','Alyosha'],'stellar-conduct','Odette enables Stellar-Conduct while Alyosha sustains and Sandrone drives Beidou’s Burst.'),

  team('beidou-alhaitham-nahida-shinobu','Quickbloom support',['Beidou','Alhaitham','Nahida','Kuki Shinobu'],'hyperbloom','Shinobu is the dedicated Hyperbloom trigger; Beidou contributes Burst damage without being relied on to hit Dendro Cores.'),
  team('beidou-nahida-xingqiu-shinobu','Hyperbloom · Nahida driver',['Beidou','Nahida','Xingqiu','Kuki Shinobu'],'hyperbloom','Nahida drives Xingqiu/Beidou while Shinobu owns Hyperbloom. Beidou is included for personal multi-target damage, not core triggering.'),
  team('beidou-baizhu-xingqiu-raiden','Hyperbloom · Raiden trigger',['Beidou','Baizhu','Xingqiu','Raiden Shogun'],'hyperbloom','Raiden owns Hyperbloom from off-field while Baizhu drives/supports and Beidou contributes Burst damage; rotations must respect Beidou/Raiden Burst incompatibility.'),

  team('beidou-eula-fischl-mika','Physical · Eula',['Beidou','Eula','Fischl','Mika'],'','Beidou and Fischl provide Electro for Superconduct while Mika sustains/buffs Eula; Eula’s Normal Attacks trigger Stormbreaker.'),
  team('beidou-razor-fischl-mika','Physical · Razor',['Beidou','Razor','Fischl','Mika'],'','Razor drives Beidou’s Burst while Fischl batteries and Mika supplies physical-oriented support.'),
  team('beidou-freminet-fischl-mika','Physical · Freminet',['Beidou','Freminet','Fischl','Mika'],'','Freminet drives Stormbreaker and benefits from Electro access for Superconduct; Fischl handles battery duty.'),

  team('beidou-neuvillette-fischl-kazuha','Neuvillette Electro-Charged',['Beidou','Neuvillette','Fischl','Kaedehara Kazuha'],'electro-charged','Beidou can contribute off-field damage, but Neuvillette Charged Attacks do not continuously trigger Stormbreaker; use Normal Attack weave/rotation support only when practical.','Lower-synergy option than normal-attack drivers.'),
  team('beidou-noelle-fischl-gorou','Geo driver flex',['Beidou','Noelle','Fischl','Gorou'],'','Noelle’s infused Normal Attacks can drive Stormbreaker while Fischl batteries Beidou; this is a flexible multi-target option rather than a dedicated Geo best-in-slot core.')
];
export default BEIDOU_REVIEWED_TEAMS;