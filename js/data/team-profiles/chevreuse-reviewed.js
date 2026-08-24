const KQM='https://keqingmains.com/q/chevreuse-quickguide/';
const ICY='https://www.icy-veins.com/genshin-impact/chevreuse-team-guide';
const source={label:'Chevreuse reviewed team theorycraft',url:KQM,type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-24',links:[{label:'Current Chevreuse team cross-check',url:ICY,type:'Reviewed guide',platform:'Guide',reviewedAt:'2026-08-24'}]};
const team=(id,name,members,reaction,why,notes='',extra={})=>({id,name,members,reaction,why,notes,confidence:'Reviewed',provenance:'source-informed',source,...extra});
const c6={c6Only:true,minConstellation:{Chevreuse:6}};
export const CHEVREUSE_REVIEWED_TEAMS=[
  team('chev-arle-fischl-bennett','Arlecchino Overloaded',['Chevreuse','Arlecchino','Fischl','Bennett'],'overload','Fischl supplies fast off-field Electro while Chevreuse and Bennett stack offensive support around Arlecchino.'),
  team('chev-arle-yae-bennett','Arlecchino Overloaded · Yae',['Chevreuse','Arlecchino','Yae Miko','Bennett'],'overload','Yae supplies off-field Electro while Bennett and Chevreuse amplify Arlecchino in an all-Pyro/Electro shell.'),
  team('chev-arle-fischl-thoma','Arlecchino Overloaded · shielded',['Chevreuse','Arlecchino','Fischl','Thoma'],'overload','Fischl maintains Electro and Thoma adds interruption protection without breaking Chevreuse’s Pyro/Electro-only A1 requirement.'),
  team('chev-arle-ineffa-bennett','Arlecchino Overloaded · Ineffa',['Chevreuse','Arlecchino','Ineffa','Bennett'],'overload','Ineffa provides Electro-side utility while Bennett and Chevreuse support Arlecchino without introducing a third element.'),

  team('chev-raiden-fischl-bennett','Raiden Overloaded',['Chevreuse','Raiden Shogun','Fischl','Bennett'],'overload','Raiden drives and batteries the team while Fischl adds off-field Electro and Bennett/Chevreuse provide Pyro-side buffs.'),
  team('chev-raiden-sara-bennett','Raiden Hyper Overloaded',['Chevreuse','Raiden Shogun','Kujou Sara','Bennett'],'overload','Sara and Bennett stack buffs around Raiden while Chevreuse supplies RES Shred, ATK and sustain.'),
  team('chev-raiden-xiangling-bennett','Raiden Xiangling Overloaded',['Chevreuse','Raiden Shogun','Xiangling','Bennett'],'overload','Raiden lowers team ER pressure while Xiangling and Bennett form the Pyro side and Chevreuse supplies Overloaded support.'),

  team('chev-clorinde-fischl-bennett','Clorinde Overloaded',['Chevreuse','Clorinde','Fischl','Bennett'],'overload','Clorinde drives while Fischl supplies off-field Electro and Bennett/Chevreuse provide strong ATK-oriented support.'),
  team('chev-clorinde-fischl-thoma','Clorinde Overloaded · shielded',['Chevreuse','Clorinde','Fischl','Thoma'],'overload','Thoma trades Bennett’s offensive ceiling for interruption resistance while keeping the required Pyro/Electro-only structure.'),
  team('chev-clorinde-yae-thoma','Clorinde Overloaded · Yae',['Chevreuse','Clorinde','Yae Miko','Thoma'],'overload','Yae supplies off-field Electro damage and Thoma adds shielding while Chevreuse buffs the all-Pyro/Electro shell.'),

  team('chev-keqing-fischl-xiangling','Keqing Overloaded',['Chevreuse','Keqing','Fischl','Xiangling'],'overload','Fischl reinforces Electro damage and Xiangling keeps Pyro application active so Chevreuse can maintain her RES Shred.'),
  team('chev-keqing-sara-xiangling','Keqing Hyper Overloaded',['Chevreuse','Keqing','Kujou Sara','Xiangling'],'overload','Sara buffs Keqing while Xiangling supplies off-field Pyro and Chevreuse enables the Overloaded support package.'),

  team('chev-yoimiya-fischl-bennett','Yoimiya Overloaded',['Chevreuse','Yoimiya','Fischl','Bennett'],'overload','Yoimiya benefits from Bennett and Chevreuse while Fischl supplies reliable ranged Electro application.'),
  team('chev-yoimiya-yae-thoma','Yoimiya Overloaded · shielded',['Chevreuse','Yoimiya','Yae Miko','Thoma'],'overload','Yae supplies ranged Electro while Thoma protects Yoimiya’s attack string and preserves the Pyro/Electro-only restriction.'),
  team('chev-yanfei-fischl-bennett','Yanfei Overloaded',['Chevreuse','Yanfei','Fischl','Bennett'],'overload','Yanfei’s range handles Overloaded knockback well while Fischl, Bennett and Chevreuse provide the core support.'),
  team('chev-yanfei-beidou-bennett','Yanfei Overloaded · Beidou',['Chevreuse','Yanfei','Beidou','Bennett'],'overload','Yanfei drives Beidou’s Burst while Bennett and Chevreuse support both ATK-scaling damage dealers.'),
  team('chev-klee-fischl-bennett','Klee Overloaded',['Chevreuse','Klee','Fischl','Bennett'],'overload','Klee supplies on-field Pyro while Fischl maintains Electro and Bennett/Chevreuse stack buffs.'),
  team('chev-diluc-fischl-bennett','Diluc Overloaded',['Chevreuse','Diluc','Fischl','Bennett'],'overload','Diluc receives Bennett/Chevreuse buffs while Fischl maintains Electro for Overloaded and RES Shred.'),
  team('chev-gaming-fischl-bennett','Gaming Overloaded',['Chevreuse','Gaming','Fischl','Bennett'],'overload','Gaming stays within a Pyro/Electro-only shell where Fischl supplies Electro and Bennett/Chevreuse support his Plunging damage.'),

  team('chev-mavuika-fischl-iansan','Mavuika Overloaded',['Chevreuse','Mavuika','Fischl','Iansan'],'overload','Fischl supplies off-field Electro while Iansan and Chevreuse add buffs around Mavuika without breaking the elemental restriction.'),
  team('chev-varesa-mavuika-iansan','Varesa Overloaded',['Chevreuse','Varesa','Mavuika','Iansan'],'overload','Varesa drives while Mavuika supplies Pyro and Iansan/Chevreuse reinforce the ATK-oriented support package.'),
  team('chev-varesa-fischl-iansan','Varesa Overloaded · Fischl',['Chevreuse','Varesa','Fischl','Iansan'],'overload','Fischl adds off-field Electro and Iansan buffs Varesa while Chevreuse supplies healing and Pyro/Electro support.'),

  team('chev-beidou-fischl-bennett','Beidou/Fischl Overloaded',['Chevreuse','Beidou','Fischl','Bennett'],'overload','Bennett can take field time while Fischl batteries Beidou and Chevreuse supports the full Pyro/Electro shell.'),
  team('chev-xiangling-fischl-bennett','Xiangling/Fischl Overloaded',['Chevreuse','Xiangling','Fischl','Bennett'],'overload','Bennett batteries Xiangling while Fischl provides Electro and Chevreuse supplies RES Shred plus ATK support.'),
  team('chev-dehya-fischl-bennett','Dehya Overloaded',['Chevreuse','Dehya','Fischl','Bennett'],'overload','Fischl maintains Electro while Bennett and Chevreuse buff Dehya in a legal Pyro/Electro-only structure.'),
  team('chev-sethos-xiangling-bennett','Sethos Overloaded',['Chevreuse','Sethos','Xiangling','Bennett'],'overload','Sethos drives Electro damage while Xiangling supplies Pyro and Bennett/Chevreuse provide support.'),
  team('chev-razor-xiangling-bennett','Razor Overloaded',['Chevreuse','Razor','Xiangling','Bennett'],'overload','Razor drives while Xiangling supplies off-field Pyro and Bennett/Chevreuse stack buffs in the restricted shell.'),
  team('chev-electro-traveler-xiangling-bennett','Electro Traveler Overloaded',['Chevreuse','Electro Traveler','Xiangling','Bennett'],'overload','Electro Traveler supplies Electro and energy utility while Xiangling/Bennett form the Pyro core and Chevreuse enables Overloaded support.'),

  team('chev-c6-arle-yelan-fischl','C6 Arlecchino Overvape',['Chevreuse','Arlecchino','Yelan','Fischl'],'overload','At C6, Chevreuse can support Arlecchino and Fischl with Pyro/Electro DMG Bonus while Yelan adds Vaporize support; this is not a pure A1 team.','C6-only off-archetype team; do not claim A1 RES Shred.',c6),
  team('chev-c6-gaming-furina-xianyun','C6 Gaming Furina',['Chevreuse','Gaming','Furina','Xianyun'],'vaporize','C6 Chevreuse provides Pyro DMG support and healing while Furina/Xianyun enable the Plunge core.','C6-only; A1 RES Shred is inactive because the team is not Pyro/Electro-only.',c6),
  team('chev-c6-chasca-furina-iansan','C6 Chasca Furina · Iansan',['Chevreuse','Chasca','Furina','Iansan'],'','C6 Chevreuse contributes Pyro/Electro DMG support and healing while Furina and Iansan support Chasca’s mixed-element shell.','C6-only off-archetype support.',c6),
  team('chev-c6-chasca-furina-ororon','C6 Chasca Furina · Ororon',['Chevreuse','Chasca','Furina','Ororon'],'electro-charged','C6 Chevreuse supplies healing and Pyro/Electro DMG support while Ororon and Furina contribute off-field damage for Chasca.','C6-only off-archetype support.',c6),
  team('chev-c6-raiden-yelan-bennett','C6 Raiden Quickswap',['Chevreuse','Raiden Shogun','Yelan','Bennett'],'overload','Raiden and Chevreuse can both benefit from Bennett and Chevreuse buffs while Yelan adds coordinated Hydro damage; Chevreuse can use a quickswap DPS build here.','C6-only off-archetype team; A1 RES Shred is inactive.',c6),
  team('chev-c6-mavuika-furina-xilonen','C6 Mavuika Furina',['Chevreuse','Mavuika','Furina','Xilonen'],'vaporize','C6 Chevreuse provides Pyro DMG support and healing while Furina/Xilonen amplify Mavuika.','C6-only off-archetype support.',c6),
  team('chev-c6-yoimiya-yelan-bennett','C6 Yoimiya Vaporize',['Chevreuse','Yoimiya','Yelan','Bennett'],'vaporize','C6 Chevreuse adds Pyro DMG support and healing while Yelan enables Vaporize and Bennett supplies ATK.','C6-only; do not attribute A1 RES Shred.',c6),
  team('chev-c6-lyney-furina-xilonen','C6 Lyney Furina',['Chevreuse','Lyney','Furina','Xilonen'],'vaporize','C6 Chevreuse can provide Pyro DMG support and healing in a mixed-element Lyney shell while Furina/Xilonen add major team buffs.','C6-only off-archetype support.',c6)
];
export default CHEVREUSE_REVIEWED_TEAMS;