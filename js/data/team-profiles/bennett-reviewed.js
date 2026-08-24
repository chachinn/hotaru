const KQM='https://keqingmains.com/q/bennett-quickguide/';
const source={label:'Bennett reviewed team theorycraft',url:KQM,type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-24'};
const team=(id,name,members,reaction,why,notes='')=>({id,name,members,reaction,why,notes,confidence:'Reviewed',provenance:'source-informed',source});
export const BENNETT_REVIEWED_TEAMS=[
  team('bennett-national-sucrose','National · Sucrose',['Bennett','Xiangling','Xingqiu','Sucrose'],'vaporize','Bennett buffs/batteries Xiangling while Xingqiu enables Reverse Vaporize and Sucrose supplies VV/EM support.'),
  team('bennett-national-kazuha','National · Kazuha',['Bennett','Xiangling','Xingqiu','Kaedehara Kazuha'],'vaporize','Kazuha supports Pyro/Hydro while Bennett buffs and batteries Xiangling.'),
  team('bennett-raiden-national','Raiden National',['Bennett','Raiden Shogun','Xiangling','Xingqiu'],'vaporize','Raiden lowers team ER needs and drives while Bennett buffs Xiangling/Raiden and provides sustain.'),
  team('bennett-double-hydro','Double Hydro Vape',['Bennett','Xiangling','Xingqiu','Yelan'],'vaporize','Double Hydro supplies strong single-target damage and enables Xiangling Reverse Vaporize while Bennett batteries/buffs her.'),
  team('bennett-childe-international','International',['Bennett','Tartaglia','Xiangling','Kaedehara Kazuha'],'vaporize','Tartaglia enables Xiangling Reverse Vaporize while Bennett batteries/buffs Xiangling and Kazuha supports both elements.'),
  team('bennett-childe-sucrose','International · Sucrose',['Bennett','Tartaglia','Xiangling','Sucrose'],'vaporize','Accessible International variant using Sucrose for VV, grouping and EM.'),
  team('bennett-kokomi-overvape','Overvape · Kokomi',['Bennett','Xiangling','Sangonomiya Kokomi','Fischl'],'overload','Kokomi drives Hydro while Xiangling Vaporizes and Fischl adds Electro/Overloaded; Bennett buffs key ATK scalers.'),
  team('bennett-ayato-overvape','Overvape · Ayato',['Bennett','Kamisato Ayato','Xiangling','Fischl'],'overload','Ayato drives a Hydro/Pyro/Electro shell while Bennett supports Xiangling and Fischl snapshots his buff.'),

  team('bennett-arlecchino-kazuha-xilonen','Arlecchino Hypercarry',['Bennett','Arlecchino','Kaedehara Kazuha','Xilonen'],'','Bennett supplies a major ATK buff while Kazuha and Xilonen stack offensive support around Arlecchino.'),
  team('bennett-arlecchino-yelan-kazuha','Arlecchino Vaporize',['Bennett','Arlecchino','Yelan','Kaedehara Kazuha'],'vaporize','Yelan enables Vaporize while Bennett and Kazuha amplify Arlecchino.'),
  team('bennett-arlecchino-citlali-kazuha','Arlecchino Melt',['Bennett','Arlecchino','Citlali','Kaedehara Kazuha'],'melt','Citlali enables Melt/shielding while Bennett and Kazuha amplify Arlecchino.'),
  team('bennett-lyney-kazuha-zhongli','Lyney Mono Pyro',['Bennett','Lyney','Kaedehara Kazuha','Zhongli'],'','Bennett provides Pyro resonance, ATK and healing while Kazuha/ Zhongli support Lyney.'),
  team('bennett-lyney-xiangling-kazuha','Lyney Triple Pyro',['Bennett','Lyney','Xiangling','Kaedehara Kazuha'],'','Triple Pyro lowers ER and preserves Lyney’s Pyro-focused passive while Kazuha supports.'),
  team('bennett-klee-xiangling-kazuha','Klee Mono Pyro',['Bennett','Klee','Xiangling','Kaedehara Kazuha'],'','Bennett supports the ATK-scaling Pyro core while Kazuha groups and shreds Pyro RES.'),
  team('bennett-gaming-furina-xianyun','Gaming Plunge',['Bennett','Gaming','Furina','Xianyun'],'vaporize','Bennett buffs Gaming while Furina and Xianyun provide Vaporize, teamwide buffs and Plunge enablement.'),
  team('bennett-diluc-furina-xianyun','Diluc Plunge',['Bennett','Diluc','Furina','Xianyun'],'vaporize','Bennett buffs Diluc’s Plunge carry identity while Furina/Xianyun enable the core.'),
  team('bennett-nav ia-furina-xilonen','Navia Hypercarry',['Bennett','Navia','Furina','Xilonen'],'crystallize','Bennett buffs Navia’s ATK while Furina/Xilonen supply team buffs, sustain and Crystallize-compatible elements.'),

  team('bennett-raiden-sara-kazuha','Raiden Hypercarry',['Bennett','Raiden Shogun','Kujou Sara','Kaedehara Kazuha'],'','Bennett and Sara stack ATK-oriented buffs while Kazuha supports Electro damage around Raiden.'),
  team('bennett-wanderer-faruzan-zhongli','Wanderer Hypercarry',['Bennett','Wanderer','Faruzan','Zhongli'],'','Bennett adds ATK, Faruzan provides Anemo support, and Zhongli prevents interruption.'),
  team('bennett-xiao-faruzan-furina','Xiao Furina',['Bennett','Xiao','Faruzan','Furina'],'','Bennett adds ATK and healing while Faruzan supports Anemo and Furina adds DMG Bonus; healing coverage must be practical for Fanfare.'),
  team('bennett-chasca-furina-ororon','Chasca mixed elements',['Bennett','Chasca','Furina','Ororon'],'','Bennett provides Pyro/healing/ATK while Furina and Ororon supply distinct elements and off-field support for Chasca.'),
  team('bennett-kinich-emilie-dehya','Kinich Burning',['Bennett','Kinich','Emilie','Dehya'],'burning','Bennett buffs Kinich/Emilie while Dehya and Bennett maintain Pyro for Burning.'),
  team('bennett-kinich-emilie-xiangling','Kinich Burning · Xiangling',['Bennett','Kinich','Emilie','Xiangling'],'burning','Xiangling maintains strong Pyro application and benefits from Bennett while Kinich/Emilie exploit Burning.'),
  team('bennett-mavuika-citlali-xilonen','Mavuika Melt',['Bennett','Mavuika','Citlali','Xilonen'],'melt','Bennett supplies ATK and Pyro support while Citlali/Xilonen amplify Mavuika.'),

  team('bennett-arlecchino-fischl-chevreuse','Overloaded · Arlecchino',['Bennett','Arlecchino','Fischl','Chevreuse'],'overload','Pyro/Electro-only Chevreuse shell where Bennett and Chevreuse stack buffs and Fischl supplies Electro.'),
  team('bennett-raiden-fischl-chevreuse','Overloaded · Raiden',['Bennett','Raiden Shogun','Fischl','Chevreuse'],'overload','Raiden/Fischl provide Electro while Bennett/Chevreuse supply Pyro and offensive support.'),
  team('bennett-clorinde-fischl-chevreuse','Overloaded · Clorinde',['Bennett','Clorinde','Fischl','Chevreuse'],'overload','Clorinde drives an all-Pyro/Electro Chevreuse shell with Bennett ATK support.'),
  team('bennett-yoimiya-fischl-chevreuse','Overloaded · Yoimiya',['Bennett','Yoimiya','Fischl','Chevreuse'],'overload','Yoimiya receives Bennett/Chevreuse buffs while Fischl maintains Electro.'),
  team('bennett-beidou-fischl-chevreuse','Overloaded · Beidou trigger shell',['Bennett','Beidou','Fischl','Chevreuse'],'overload','Bennett can take field time to trigger Overloaded/Stormbreaker while Fischl batteries Beidou and Chevreuse supports.'),
  team('bennett-furina-ororon-fischl','TF Overvape',['Bennett','Furina','Ororon','Fischl'],'overload','Modern on-field Thundering Fury Bennett uses Furina/Ororon/Fischl to sustain Electro/Hydro reactions and rapidly reset Skill.'),

  team('bennett-chongyun-rosaria-kaeya','Forward Melt',['Bennett','Chongyun','Rosaria','Kaeya'],'melt','Chongyun gives Bennett Cryo Normal Attacks while Rosaria/Kaeya maintain Cryo for Bennett’s Pyro Skill/Burst to Melt.'),
  team('bennett-chongyun-rosaria-sucrose','Forward Melt · Sucrose',['Bennett','Chongyun','Rosaria','Sucrose'],'melt','Sucrose adds EM/VV support to Bennett’s Melt driver shell.'),
  team('bennett-ganyu-xiangling-zhongli','Ganyu Melt support',['Bennett','Ganyu','Xiangling','Zhongli'],'melt','Bennett buffs/batteries Xiangling and buffs Ganyu while Xiangling maintains Pyro for Ganyu Melt.'),
  team('bennett-ganyu-nahida-dehya','Ganyu Burnmelt',['Bennett','Ganyu','Nahida','Dehya'],'burning','Bennett and Dehya maintain Pyro around Nahida Burning so Ganyu can Melt Charged Attacks.'),

  team('bennett-nahida-xingqiu-yelan','Burgeon Driver · double Hydro',['Bennett','Nahida','Xingqiu','Yelan'],'burgeon','On-field full-EM Bennett owns Burgeon while double Hydro controls Burning and Nahida supplies Dendro.'),
  team('bennett-nahida-xingqiu-baizhu','Burgeon Driver · Baizhu',['Bennett','Nahida','Xingqiu','Baizhu'],'burgeon','Bennett owns Burgeon while Baizhu adds Dendro sustain and Xingqiu maintains Hydro.'),
  team('bennett-nahida-yelan-baizhu','Burgeon Driver · Yelan',['Bennett','Nahida','Yelan','Baizhu'],'burgeon','Yelan supplies Hydro while Nahida/Baizhu maintain Dendro and Bennett triggers Burgeon.'),

  team('bennett-furina-xingqiu-xianyun','Vaporize Plunge',['Bennett','Furina','Xingqiu','Xianyun'],'vaporize','Xianyun enables Bennett Plunges while Furina/Xingqiu maintain Hydro for Vaporize and team buffs.'),
  team('bennett-furina-yelan-xianyun','Double Hydro Plunge',['Bennett','Furina','Yelan','Xianyun'],'vaporize','Double Hydro supports Furina and enables Bennett-owned Vaporize Plunges with Xianyun.'),
  team('bennett-rosaria-kaeya-xianyun','Melt Plunge',['Bennett','Rosaria','Kaeya','Xianyun'],'melt','Rosaria/Kaeya maintain Cryo while Xianyun enables Bennett to Melt Pyro Plunges.'),
  team('bennett-furina-sucrose-gaming','Gaming support rotation',['Bennett','Furina','Sucrose','Gaming'],'vaporize','Bennett buffs Gaming while Furina and Sucrose provide Hydro, DMG Bonus and Anemo/EM support.'),

  team('bennett-eula-raiden-mika','Eula support',['Bennett','Eula','Raiden Shogun','Mika'],'','Bennett can stack ATK with Mika support while Raiden batteries Eula; circle timing must fit Eula’s Burst window.'),
  team('bennett-freminet-fischl-mika','Freminet support',['Bennett','Freminet','Fischl','Mika'],'','Bennett buffs Freminet while Fischl enables Superconduct and Mika supports Physical damage.'),
  team('bennett-ningguang-zhongli-xiangling','Ningguang double Geo/Pyro',['Bennett','Ningguang','Zhongli','Xiangling'],'crystallize','Bennett and Xiangling provide Pyro resonance/off-field damage while Zhongli supports Ningguang.'),
  team('bennett-noelle-furina-gorou','Noelle Furina support',['Bennett','Noelle','Furina','Gorou'],'crystallize','Bennett is a flexible ATK support though Noelle values DEF heavily; Furina/Gorou remain the main synergy core.','Lower-priority flex, not a best-in-slot Bennett team.')
];
export default BENNETT_REVIEWED_TEAMS;