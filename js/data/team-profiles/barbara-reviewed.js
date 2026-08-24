const KQM='https://keqingmains.com/q/barbara-quickguide/';
const source={label:'Barbara reviewed theorycraft',url:KQM,type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-24'};
const team=(id,name,members,reaction,why,notes='')=>({id,name,members,reaction,why,notes,confidence:'Reviewed',provenance:'source-informed',source});
export const BARBARA_REVIEWED_TEAMS=[
  team('barbara-ayaka-kazuha-shenhe','Freeze · Ayaka premium',['Barbara','Kamisato Ayaka','Kaedehara Kazuha','Shenhe'],'freeze','Barbara supplies healing/Hydro while Ayaka carries and Kazuha/Shenhe amplify Cryo damage.'),
  team('barbara-ayaka-rosaria-sucrose','Freeze · Ayaka accessible',['Barbara','Kamisato Ayaka','Rosaria','Sucrose'],'freeze','Accessible Freeze structure using Barbara as sustain/Hydro and Rosaria/Sucrose as Cryo/Anemo support.'),
  team('barbara-ganyu-rosaria-venti','Freeze · Ganyu',['Barbara','Ganyu','Rosaria','Venti'],'freeze','Barbara sustains and applies close-range Hydro while Venti groups for Ganyu/Rosaria.'),
  team('barbara-wriothesley-rosaria-kazuha','Freeze · Wriothesley',['Barbara','Wriothesley','Rosaria','Kaedehara Kazuha'],'freeze','Barbara offers emergency sustain/Hydro around Wriothesley with Cryo/Anemo support.'),
  team('barbara-skirk-furina-escoffier','Cryo-Hydro sustain',['Barbara','Skirk','Furina','Escoffier'],'freeze','Barbara is a limited-roster Hydro healer/TTDS option when stronger teamwide healers are unavailable.'),
  team('barbara-nilou-nahida-collei','Nilou Bloom · double Dendro',['Barbara','Nilou','Nahida','Collei'],'bloom','Barbara heals through Bloom self-damage while maintaining Hydro in a Hydro/Dendro-only Nilou team.'),
  team('barbara-nilou-nahida-kirara','Nilou Bloom · Kirara',['Barbara','Nilou','Nahida','Kirara'],'bloom','Kirara adds defensive utility while Barbara covers healing and Hydro application.'),
  team('barbara-nilou-lauma-nahida','Nilou Bloom · Lauma',['Barbara','Nilou','Lauma','Nahida'],'bloom','Current Dendro-heavy Nilou shell with Barbara as healer/Hydro applicator.'),
  team('barbara-nilou-collei-dmc','Nilou Bloom · accessible',['Barbara','Nilou','Collei','Dendro Traveler'],'bloom','Lower-cost Hydro/Dendro-only Nilou Bloom structure with Barbara sustaining the team.'),
  team('barbara-nahida-shinobu-fischl','Hyperbloom Driver',['Barbara','Nahida','Kuki Shinobu','Fischl'],'hyperbloom','Barbara drives Hydro while Nahida supplies Dendro and Shinobu owns Hyperbloom; Fischl adds off-field Electro damage.'),
  team('barbara-collei-shinobu-fischl','Hyperbloom · four-star',['Barbara','Collei','Kuki Shinobu','Fischl'],'hyperbloom','Accessible four-star Hyperbloom structure with Barbara driving Hydro.'),
  team('barbara-nahida-raiden-beidou','Hyperbloom · Raiden',['Barbara','Nahida','Raiden Shogun','Beidou'],'hyperbloom','Barbara drives Hydro while Raiden owns Hyperbloom and Beidou contributes off-field damage without stealing cores consistently.'),
  team('barbara-dmc-shinobu-beidou','Hyperbloom · Dendro Traveler',['Barbara','Dendro Traveler','Kuki Shinobu','Beidou'],'hyperbloom','Accessible Hyperbloom shell with Barbara as Hydro driver and Shinobu as reaction trigger.'),
  team('barbara-xingqiu-thoma-dmc','Burgeon',['Barbara','Xingqiu','Thoma','Dendro Traveler'],'burgeon','Barbara offsets Burgeon self-damage; second Hydro prevents Burning from overwhelming Barbara’s limited application.'),
  team('barbara-xingqiu-thoma-nahida','Burgeon · Nahida',['Barbara','Xingqiu','Thoma','Nahida'],'burgeon','Nahida supplies Dendro while Barbara/Xingqiu sustain Hydro and Thoma owns Burgeon.'),
  team('barbara-yelan-thoma-nahida','Burgeon · Yelan',['Barbara','Yelan','Thoma','Nahida'],'burgeon','Yelan provides stronger off-field Hydro while Barbara handles sustain and Thoma owns Burgeon.'),
  team('barbara-beidou-fischl-rosaria','Clam Electro-Charged + Superconduct',['Barbara','Beidou','Fischl','Rosaria'],'electro-charged','Reviewed Clam-driver structure: Electro-Charged plus Cryo enables Superconduct to improve physical Clam bubble damage.'),
  team('barbara-beidou-fischl-kaeya','Clam EC · Kaeya',['Barbara','Beidou','Fischl','Kaeya'],'electro-charged','Kaeya replaces Rosaria while preserving Electro-Charged/Superconduct support for Clam damage.'),
  team('barbara-yae-fischl-rosaria','Clam EC · Yae',['Barbara','Yae Miko','Fischl','Rosaria'],'electro-charged','Barbara drives Yae/Fischl while Rosaria adds Cryo for Superconduct and personal damage.'),
  team('barbara-beidou-yae-rosaria','Clam EC · Beidou Yae',['Barbara','Beidou','Yae Miko','Rosaria'],'electro-charged','Dual off-field Electro pressure with Rosaria supporting Clam physical damage through Superconduct.'),
  team('barbara-fischl-lisa-rosaria','Clam EC · accessible Lisa',['Barbara','Fischl','Lisa','Rosaria'],'electro-charged','Accessible Electro-Charged/Superconduct driver shell using Lisa and Fischl.'),
  team('barbara-bennett-xiangling-zhongli','Vaporize · double Pyro',['Barbara','Bennett','Xiangling','Zhongli'],'vaporize','Two Pyro sources preserve aura for Barbara’s Charged Attacks while Zhongli adds interruption resistance.'),
  team('barbara-bennett-xiangling-sucrose','Vaporize · Sucrose',['Barbara','Bennett','Xiangling','Sucrose'],'vaporize','Sucrose adds EM/VV support while Bennett and Xiangling maintain Pyro for Barbara to Vaporize.'),
  team('barbara-bennett-xiangling-kazuha','Vaporize · Kazuha',['Barbara','Bennett','Xiangling','Kaedehara Kazuha'],'vaporize','Kazuha supports the double-Pyro aura and Hydro damage while Barbara owns Charged Attack Vaporizes.'),
  team('barbara-bennett-jean-kazuha','Vaporize · Sunfire',['Barbara','Bennett','Jean','Kaedehara Kazuha'],'vaporize','Bennett/Jean can continuously apply Pyro through Sunfire while Kazuha adds grouping/support for Barbara.'),
  team('barbara-bennett-jean-sucrose','Vaporize · accessible Sunfire',['Barbara','Bennett','Jean','Sucrose'],'vaporize','Sucrose provides EM/VV support around the Bennett/Jean Pyro application engine.'),
  team('barbara-neuvillette-furina-kazuha','Hydro support flex',['Barbara','Neuvillette','Furina','Kaedehara Kazuha'],'','Barbara can provide healing/TTDS-style utility in limited rosters, though stronger teamwide healers are generally preferred.'),
  team('barbara-klee-xiangling-sucrose','Pyro carry sustain',['Barbara','Klee','Xiangling','Sucrose'],'vaporize','Barbara is a low-cost healer/Hydro flex around a Pyro-heavy carry shell.'),
  team('barbara-kaeya-xiangling-sucrose','Starter reaction core',['Barbara','Kaeya','Xiangling','Sucrose'],'','Free/early-game reaction shell using Barbara for sustain and Hydro access.'),
  team('barbara-razor-fischl-kaeya','Physical sustain',['Barbara','Razor','Fischl','Kaeya'],'electro-charged','Barbara sustains while Fischl batteries Razor and Kaeya enables Superconduct; incidental Electro-Charged is acceptable.')
];
export default BARBARA_REVIEWED_TEAMS;