const KQM='https://keqingmains.com/q/collei-quickguide/';
const source={label:'Collei reviewed team theorycraft',url:KQM,type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-24'};
const team=(id,name,members,reaction,why,notes='')=>({id,name,members,reaction,why,notes,confidence:'Reviewed',provenance:'source-informed',source});
export const COLLEI_REVIEWED_TEAMS=[
  team('collei-clorinde-fischl-sucrose','Clorinde Aggravate',['Collei','Clorinde','Fischl','Sucrose'],'aggravate','Collei supplies Dendro for Quicken while Fischl and Sucrose amplify Clorinde’s Electro damage.'),
  team('collei-clorinde-fischl-xilonen','Clorinde Aggravate · Xilonen',['Collei','Clorinde','Fischl','Xilonen'],'aggravate','Xilonen adds resistance reduction and buffs while Collei maintains Quicken for Clorinde/Fischl.'),
  team('collei-raiden-fischl-xilonen','Raiden Aggravate',['Collei','Raiden Shogun','Fischl','Xilonen'],'aggravate','Collei enables Quicken while Raiden/Fischl deal Electro damage and Xilonen supplies support.'),
  team('collei-keqing-fischl-kazuha','Keqing Aggravate',['Collei','Keqing','Fischl','Kaedehara Kazuha'],'aggravate','Collei provides short-field Dendro while Fischl/Kazuha support Keqing’s rapid Aggravate hits.'),
  team('collei-keqing-fischl-lanyan','Keqing Aggravate · Lan Yan',['Collei','Keqing','Fischl','Lan Yan'],'aggravate','Lan Yan supplies Anemo utility and shielding while Collei sustains Quicken for Keqing/Fischl.'),
  team('collei-yae-fischl-lanyan','Yae Aggravate',['Collei','Yae Miko','Fischl','Lan Yan'],'aggravate','Collei supplies Dendro, Yae/Fischl provide Electro damage, and Lan Yan drives or supports with Anemo.'),
  team('collei-yae-fischl-kazuha','Yae Aggravate · Kazuha',['Collei','Yae Miko','Fischl','Kaedehara Kazuha'],'aggravate','Kazuha groups and buffs Electro while Collei enables Quicken for Yae/Fischl.'),
  team('collei-cyno-fischl-zhongli','Cyno Aggravate',['Collei','Cyno','Fischl','Zhongli'],'aggravate','Collei enables Quicken while Fischl adds off-field Electro and Zhongli supplies protection.'),
  team('collei-sethos-fischl-lanyan','Sethos Aggravate',['Collei','Sethos','Fischl','Lan Yan'],'aggravate','Collei supports Quicken while Fischl and Lan Yan complement Sethos’s Electro field time.'),
  team('collei-fischl-venti-kazuha','Aggravated Swirl',['Collei','Fischl','Venti','Kaedehara Kazuha'],'aggravate','Collei supplies Dendro while Venti/Kazuha trigger Electro-related Swirls around Fischl in AoE.'),

  team('collei-alhaitham-yae-shinobu','Alhaitham Quicken',['Collei','Alhaitham','Yae Miko','Kuki Shinobu'],'spread','Collei batteries/supports Alhaitham while Yae and Shinobu maintain Electro for Spread/Aggravate.'),
  team('collei-alhaitham-fischl-shinobu','Alhaitham Quicken · Fischl',['Collei','Alhaitham','Fischl','Kuki Shinobu'],'spread','Collei provides Dendro resonance/application while Fischl and Shinobu sustain Quicken.'),
  team('collei-tighnari-yae-zhongli','Tighnari Spread',['Collei','Tighnari','Yae Miko','Zhongli'],'spread','Collei supplies Dendro resonance and support while Yae enables Spread and Zhongli shreds Dendro/Electro resistance.'),
  team('collei-tighnari-fischl-yaoyao','Tighnari Spread · double Dendro',['Collei','Tighnari','Fischl','Yaoyao'],'spread','Collei and Yaoyao reinforce Dendro while Fischl maintains Quicken for Tighnari.'),

  team('collei-xingqiu-shinobu-nahida','Hyperbloom Support',['Collei','Xingqiu','Kuki Shinobu','Nahida'],'hyperbloom','Collei adds Dendro application while Shinobu remains the Hyperbloom trigger and owns EM/Level scaling.'),
  team('collei-yelan-shinobu-nahida','Hyperbloom · Yelan',['Collei','Yelan','Kuki Shinobu','Nahida'],'hyperbloom','Yelan and Nahida generate cores while Shinobu triggers Hyperbloom; Collei provides extra Dendro.'),
  team('collei-neuv-raiden-nahida','Neuvillette Hyperbloom',['Collei','Neuvillette','Raiden Shogun','Nahida'],'hyperbloom','Neuvillette supplies Hydro, Collei/Nahida provide Dendro, and Raiden owns Hyperbloom.'),
  team('collei-ayato-shinobu-nahida','Ayato Hyperbloom',['Collei','Kamisato Ayato','Kuki Shinobu','Nahida'],'hyperbloom','Ayato drives Hydro while Collei/Nahida provide Dendro and Shinobu owns Hyperbloom.'),
  team('collei-tartaglia-shinobu-nahida','Tartaglia Hyperbloom',['Collei','Tartaglia','Kuki Shinobu','Nahida'],'hyperbloom','Tartaglia drives Hydro while Collei/Nahida generate cores and Shinobu remains the trigger.'),
  team('collei-xingqiu-fischl-sucrose','Sucrose Hyperbloom',['Collei','Xingqiu','Fischl','Sucrose'],'hyperbloom','Sucrose can trigger Hyperbloom through Electro Swirl while Collei supplies Dendro and Xingqiu generates cores.'),

  team('collei-xingqiu-thoma-nahida','Burgeon Support',['Collei','Xingqiu','Thoma','Nahida'],'burgeon','Collei and Nahida generate Dendro cores while Thoma owns Burgeon and receives the EM/Level 90 trigger build.'),
  team('collei-yelan-thoma-nahida','Burgeon · Yelan',['Collei','Yelan','Thoma','Nahida'],'burgeon','Yelan/Nahida create cores, Collei reinforces Dendro, and Thoma remains the Burgeon trigger.'),
  team('collei-ayato-thoma-nahida','Ayato Burgeon',['Collei','Kamisato Ayato','Thoma','Nahida'],'burgeon','Ayato supplies Hydro while Collei/Nahida create cores and Thoma owns Burgeon.'),
  team('collei-neuv-dehya-nahida','Neuvillette Burgeon · Dehya',['Collei','Neuvillette','Dehya','Nahida'],'burgeon','Collei/Nahida provide Dendro, Neuvillette Hydro, and Dehya is the Pyro Burgeon trigger.'),

  team('collei-nilou-nahida-kokomi','Nilou Bloom',['Collei','Nilou','Nahida','Sangonomiya Kokomi'],'bloom','Collei’s front-loaded Dendro helps generate Bountiful Cores while the team remains strictly Hydro/Dendro.'),
  team('collei-nilou-yaoyao-xingqiu','Affordable Nilou Bloom',['Collei','Nilou','Yaoyao','Xingqiu'],'bloom','Yaoyao provides sustain while Collei/Xingqiu support Bloom generation in a legal Hydro/Dendro-only team.'),
  team('collei-nilou-kokomi-dmc','Nilou Bloom · Traveler',['Collei','Nilou','Sangonomiya Kokomi','Dendro Traveler'],'bloom','Collei and Dendro Traveler provide Dendro application while Kokomi supplies Hydro and healing.'),
  team('collei-nilou-barbara-nahida','Nilou Bloom · Barbara',['Collei','Nilou','Barbara','Nahida'],'bloom','Barbara provides Hydro/healing while Collei/Nahida supply Dendro in a valid Bountiful Core team.'),

  team('collei-bennett-venti-kazuha','Burning Anemo',['Collei','Bennett','Venti','Kaedehara Kazuha'],'burning','Collei supplies Dendro while Bennett and Anemo absorption maintain Burning in an AoE-oriented shell.'),
  team('collei-nahida-bennett-kazuha','Burning · Nahida',['Collei','Nahida','Bennett','Kaedehara Kazuha'],'burning','Collei/Nahida provide Dendro while Bennett/Kazuha maintain Pyro and Burning.'),
  team('collei-emilie-bennett-kazuha','Burning · Emilie',['Collei','Emilie','Bennett','Kaedehara Kazuha'],'burning','Collei supplies extra Dendro and support while Emilie benefits from Burning and Bennett/Kazuha provide Pyro/Anemo utility.'),
  team('collei-kinich-emilie-bennett','Kinich Burning',['Collei','Kinich','Emilie','Bennett'],'burning','Collei can hold support artifacts while Kinich/Emilie exploit sustained Burning and Bennett supplies Pyro/buffs.'),

  team('collei-ganyu-bennett-kazuha','Burnmelt Ganyu',['Collei','Ganyu','Bennett','Kaedehara Kazuha'],'melt','Collei helps sustain Burning/Pyro aura so Ganyu can Melt Charged Shots; Ganyu owns the amplifying reaction.'),
  team('collei-wrio-bennett-kazuha','Burnmelt Wriothesley',['Collei','Wriothesley','Bennett','Kaedehara Kazuha'],'melt','Collei contributes Dendro for Burning setup while Wriothesley owns Melt damage.'),

  team('collei-fischl-rosaria-bennett','Physical Collei',['Collei','Fischl','Rosaria','Bennett'],'superconduct','Fischl and Rosaria provide Superconduct while Bennett buffs/heals an intentionally on-field Physical Collei.'),
  team('collei-fischl-layla-bennett','Physical Collei · shielded',['Collei','Fischl','Layla','Bennett'],'superconduct','Layla and Fischl enable Superconduct and shielding while Bennett supports on-field Physical Collei.')
];
export default COLLEI_REVIEWED_TEAMS;