const KQM='https://keqingmains.com/q/candace-quickguide/';
const ICY='https://www.icy-veins.com/genshin-impact/candace-team-guide';
const source={label:'Candace reviewed team theorycraft',url:KQM,type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-24',links:[{label:'Current Candace team cross-check',url:ICY,type:'Reviewed guide',platform:'Guide',reviewedAt:'2026-08-24'}]};
const team=(id,name,members,reaction,why,notes='')=>({id,name,members,reaction,why,notes,confidence:'Reviewed',provenance:'source-informed',source});
export const CANDACE_REVIEWED_TEAMS=[
  team('candace-skirk-furina-escoffier','Skirk Normal Attack support',['Candace','Skirk','Furina','Escoffier'],'freeze','Candace buffs Skirk’s Normal Attacks while Furina and Escoffier provide Hydro/Cryo support within Skirk’s preferred element restriction.'),
  team('candace-skirk-yelan-escoffier','Skirk · Yelan',['Candace','Skirk','Yelan','Escoffier'],'freeze','Candace supplies NA DMG Bonus while Yelan adds coordinated Hydro damage and Escoffier supports Cryo/Hydro damage.'),
  team('candace-skirk-furina-shenhe','Skirk · Shenhe',['Candace','Skirk','Furina','Shenhe'],'freeze','Candace/Furina provide Hydro-side support while Shenhe amplifies Skirk’s Cryo output.'),
  team('candace-clorinde-nahida-fischl','Quickbloom · Clorinde C6 Candace',['Candace','Clorinde','Nahida','Fischl'],'hyperbloom','At C6 Candace adds off-field Hydro and NA DMG Bonus while Nahida/Fischl preserve strong Quicken uptime around Clorinde.'),
  team('candace-clorinde-baizhu-fischl','Quickbloom · Baizhu',['Candace','Clorinde','Baizhu','Fischl'],'hyperbloom','Candace supports Clorinde’s Normal Attacks and adds Hydro at C6 while Baizhu/Fischl support Quicken and sustain.'),
  team('candace-arlecchino-yelan-bennett','Arlecchino NA support',['Candace','Arlecchino','Yelan','Bennett'],'vaporize','Candace’s Normal Attack DMG Bonus supports Arlecchino while Yelan enables Vaporize and Bennett adds ATK support; Arlecchino’s Pyro infusion is not replaced.'),
  team('candace-arlecchino-xingqiu-bennett','Arlecchino NA support · Xingqiu',['Candace','Arlecchino','Xingqiu','Bennett'],'vaporize','Candace buffs Normal Attacks while Xingqiu enables Vaporize and Bennett supports Arlecchino.'),
  team('candace-yoimiya-yelan-bennett','Yoimiya NA support',['Candace','Yoimiya','Yelan','Bennett'],'vaporize','Candace buffs Yoimiya’s Normal Attacks without overriding her bow infusion; Yelan enables Vaporize and Bennett buffs.'),
  team('candace-yoimiya-xingqiu-zhongli','Yoimiya · defensive',['Candace','Yoimiya','Xingqiu','Zhongli'],'vaporize','Candace supplies Normal Attack DMG Bonus while Xingqiu enables Vaporize and Zhongli provides interruption resistance.'),
  team('candace-ayato-yelan-kazuha','Ayato Hydro NA',['Candace','Kamisato Ayato','Yelan','Kaedehara Kazuha'],'','Candace buffs Ayato’s Normal Attack-based Skill slashes while Yelan and Kazuha amplify the Hydro-focused team.'),
  team('candace-ayato-furina-jean','Ayato Furina',['Candace','Kamisato Ayato','Furina','Jean'],'','Candace buffs Ayato’s Normal Attacks while Furina provides DMG Bonus and Jean supplies teamwide healing/VV.'),
  team('candace-wanderer-faruzan-bennett','Wanderer NA support',['Candace','Wanderer','Faruzan','Bennett'],'','Candace can buff Normal Attack damage while Faruzan/Bennett remain the primary Anemo/ATK support core.'),
  team('candace-noelle-furina-gorou','Noelle NA support',['Candace','Noelle','Furina','Gorou'],'crystallize','Candace buffs Noelle’s Normal Attacks while Furina/Gorou supply stronger core synergy and sustain support comes from Noelle.'),

  team('candace-nilou-nahida-yaoyao','Nilou Bloom · Yaoyao',['Candace','Nilou','Nahida','Yaoyao'],'bloom','Candace can own Bloom through Hydro infusion/application while Yaoyao sustains and Nahida supplies Dendro.'),
  team('candace-nilou-nahida-kirara','Nilou Bloom · Kirara',['Candace','Nilou','Nahida','Kirara'],'bloom','Kirara adds defensive utility while Candace supplies Hydro and can build full EM for Bloom ownership.'),
  team('candace-nilou-collei-yaoyao','Nilou Bloom · accessible',['Candace','Nilou','Collei','Yaoyao'],'bloom','Accessible Hydro/Dendro-only Nilou team where Candace can act as the Hydro trigger/driver.'),
  team('candace-nilou-dmc-yaoyao','Nilou Bloom · Traveler',['Candace','Nilou','Dendro Traveler','Yaoyao'],'bloom','Candace drives Hydro while Dendro Traveler/Yaoyao maintain Dendro and sustain.'),
  team('candace-nilou-lauma-nahida','Nilou Bloom · Lauma',['Candace','Nilou','Lauma','Nahida'],'bloom','Current Dendro-heavy Nilou structure where Candace can supply Hydro application and Bloom ownership.'),
  team('candace-nilou-lauma-yaoyao','Nilou Bloom · Lauma sustain',['Candace','Nilou','Lauma','Yaoyao'],'bloom','Yaoyao sustains while Lauma supports Dendro/Bloom and Candace handles Hydro application.'),

  team('candace-nahida-shinobu-beidou','Hyperbloom Driver · Beidou',['Candace','Nahida','Kuki Shinobu','Beidou'],'hyperbloom','Candace drives Hydro-infused attacks while Shinobu owns Hyperbloom; Beidou contributes Burst damage without reliably targeting cores.'),
  team('candace-nahida-shinobu-fischl','Hyperbloom Driver · Fischl',['Candace','Nahida','Kuki Shinobu','Fischl'],'hyperbloom','Candace drives while Shinobu owns Hyperbloom and Fischl adds off-field damage/battery utility.'),
  team('candace-dmc-shinobu-beidou','Hyperbloom · Traveler',['Candace','Dendro Traveler','Kuki Shinobu','Beidou'],'hyperbloom','Accessible driver shell with Shinobu as the dedicated Hyperbloom trigger.'),
  team('candace-collei-shinobu-fischl','Hyperbloom · Collei',['Candace','Collei','Kuki Shinobu','Fischl'],'hyperbloom','Four-star-heavy Hyperbloom shell where Candace provides Hydro and Shinobu owns cores.'),
  team('candace-nahida-raiden-beidou','Hyperbloom · Raiden trigger',['Candace','Nahida','Raiden Shogun','Beidou'],'hyperbloom','Raiden owns Hyperbloom from off-field while Candace drives and Beidou adds multi-target Burst damage.'),

  team('candace-beidou-fischl-sucrose','Electro-Charged Driver',['Candace','Beidou','Fischl','Sucrose'],'electro-charged','Candace can drive Beidou/Fischl with Hydro-infused Normal Attacks while Sucrose provides Anemo support.'),
  team('candace-beidou-fischl-kazuha','Electro-Charged · Kazuha',['Candace','Beidou','Fischl','Kaedehara Kazuha'],'electro-charged','Kazuha supports Hydro/Electro while Candace drives Beidou/Fischl.'),
  team('candace-yelan-fischl-sucrose','Electro-Charged · Yelan',['Candace','Yelan','Fischl','Sucrose'],'electro-charged','Candace drives Yelan coordinated attacks while Fischl provides Electro and Sucrose supports reactions.'),
  team('candace-xingqiu-fischl-sucrose','Electro-Charged · Xingqiu',['Candace','Xingqiu','Fischl','Sucrose'],'electro-charged','Candace’s field time triggers Xingqiu and maintains Hydro while Fischl/Sucrose add Electro/Anemo support.'),

  team('candace-escoffier-rosaria-kazuha','Freeze Driver · Escoffier',['Candace','Escoffier','Rosaria','Kaedehara Kazuha'],'freeze','Candace drives Hydro while Escoffier/Rosaria supply Cryo and Kazuha groups/supports.'),
  team('candace-kaeya-rosaria-sucrose','Freeze Driver · accessible',['Candace','Kaeya','Rosaria','Sucrose'],'freeze','Accessible Freeze driver shell using Candace infusion, dual Cryo and Sucrose grouping.'),
  team('candace-ganyu-rosaria-kazuha','Freeze support · Ganyu',['Candace','Ganyu','Rosaria','Kaedehara Kazuha'],'freeze','Candace supplies Hydro and NA support in rotations where Ganyu/ Rosaria provide Cryo and Kazuha groups.'),

  team('candace-xiangling-bennett-kazuha','Reverse Vaporize support',['Candace','Xiangling','Bennett','Kaedehara Kazuha'],'vaporize','Candace’s Hydro infusion/application can enable Xiangling Reverse Vaporize while Bennett/Kazuha support the Pyro carry.'),
  team('candace-xiangling-bennett-sucrose','Reverse Vaporize · accessible',['Candace','Xiangling','Bennett','Sucrose'],'vaporize','Sucrose adds VV/EM while Candace provides Hydro access for Xiangling and Bennett batteries/buffs.'),
  team('candace-dehya-bennett-kazuha','Vaporize quickswap',['Candace','Dehya','Bennett','Kaedehara Kazuha'],'vaporize','Candace provides Hydro application/buffs while Bennett/Kazuha support Dehya; reaction ownership is rotation-sensitive.'),
  team('candace-thoma-nahida-xingqiu','Burgeon support',['Candace','Thoma','Nahida','Xingqiu'],'burgeon','Candace remains support/driver while Thoma owns Burgeon; do not use Candace’s full-EM Bloom build for the Burgeon damage.'),
  team('candace-dehya-nahida-xingqiu','Burgeon · Dehya trigger',['Candace','Dehya','Nahida','Xingqiu'],'burgeon','Dehya owns Burgeon while Candace/Xingqiu maintain Hydro and Nahida supplies Dendro.')
];
export default CANDACE_REVIEWED_TEAMS;