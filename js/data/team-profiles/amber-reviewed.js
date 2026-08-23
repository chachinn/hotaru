const KQM='https://keqingmains.com/q/amber-quickguide/';
const GAME8='https://game8.co/games/Genshin-Impact/archives/297535';
const ICY='https://www.icy-veins.com/genshin-impact/amber-team-guide';
const source=(label,url,type='Reviewed theorycraft')=>({label,url,type,platform:'Guide',reviewedAt:'2026-08-23'});
const kqm=()=>source('KQM Amber Quick Guide',KQM),game8=()=>source('Game8 Amber Rating and Best Builds',GAME8,'Source-backed guide'),icy=()=>source('Icy Veins Amber Team Guide',ICY,'Source-backed guide');
const multi=(primary,...rest)=>({...primary,links:[primary,...rest]});
const confidence=s=>s?.type==='Reviewed theorycraft'?'Reviewed':'Community-sourced';
const team=(id,name,members,reaction,why,src,notes='',provenance='exact')=>({id,name,members,reaction,why,notes,provenance,confidence:confidence(src),source:src,anchor:'Amber',profileId:'amber'});
export const AMBER_REVIEWED_TEAMS=[
team('amb-melt-citlali-xilonen-bennett','Melt CA · Citlali/Xilonen/Bennett',['Amber','Citlali','Xilonen','Bennett'],'melt','Exact KQM Melt Charged Shot example.',kqm()),
team('amb-melt-rosaria-zhongli-bennett','Melt CA · Rosaria/Zhongli/Bennett',['Amber','Rosaria','Zhongli','Bennett'],'melt','Exact KQM Melt Charged Shot example.',kqm()),
team('amb-bunny-citlali-sucrose-bennett','Bunny Bomber · Citlali/Sucrose/Bennett',['Amber','Citlali','Sucrose','Bennett'],'melt','Exact KQM Bunny Bomber example.',kqm()),
team('amb-bunny-rosaria-sucrose-diona','Bunny Bomber · Rosaria/Sucrose/Diona',['Amber','Rosaria','Sucrose','Diona'],'melt','Exact KQM Bunny Bomber example.',kqm()),
team('amb-burgeon-collei-kokomi-rosaria','Burgeon · Collei/Kokomi/Rosaria',['Amber','Collei','Sangonomiya Kokomi','Rosaria'],'burgeon','Exact KQM Burgeon example.',kqm()),
team('amb-burgeon-nahida-nilou-diona','Burgeon · Nahida/Nilou/Diona',['Amber','Nahida','Nilou','Diona'],'burgeon','Exact KQM Burgeon example with Sacrificial Sword Nilou.',kqm()),
team('amb-support-hutao-yelan-sucrose','Burst Support · Hu Tao/Yelan/Sucrose',['Amber','Hu Tao','Yelan','Sucrose'],'vaporize','Exact KQM Hu Tao VV Burst Support example.',kqm()),
team('amb-support-hutao-xingqiu-kazuha','Burst Support · Hu Tao/Xingqiu/Kazuha',['Amber','Hu Tao','Xingqiu','Kaedehara Kazuha'],'vaporize','Exact KQM and Game8 Hu Tao support shell.',multi(kqm(),game8())),
team('amb-game8-lyney-kazuha-bennett','Support · Lyney/Kazuha/Bennett',['Amber','Lyney','Kaedehara Kazuha','Bennett'],'mono-pyro','Exact Game8 and Icy Veins support shell.',multi(game8(),icy())),
team('amb-game8-melt-rosaria-layla-bennett','Melt · Rosaria/Layla/Bennett',['Amber','Rosaria','Layla','Bennett'],'melt','Exact Game8 Melt team.',game8()),
team('amb-game8-melt-rosaria-kazuha-bennett','Melt · Rosaria/Kazuha/Bennett',['Amber','Rosaria','Kaedehara Kazuha','Bennett'],'melt','Exact Game8 and Icy Veins Melt team.',multi(game8(),icy())),
team('amb-game8-melt-rosaria-kazuha-citlali','Melt · Rosaria/Kazuha/Citlali',['Amber','Rosaria','Kaedehara Kazuha','Citlali'],'melt','Exact Game8 Melt team.',game8()),
team('amb-icy-rosaria-nicole-durin','Melt · Rosaria/Nicole/Durin',['Amber','Rosaria','Nicole','Durin'],'melt','Current Icy Veins 7.0 premium Amber team.',icy()),
team('amb-icy-ganyu-bennett-layla','Melt · Ganyu/Bennett/Layla',['Amber','Ganyu','Bennett','Layla'],'melt','Current Icy Veins 7.0 team.',icy()),
team('amb-icy-lohen-bennett-citlali','Melt · Lohen/Bennett/Citlali',['Amber','Lohen','Bennett','Citlali'],'melt','Current Icy Veins 7.0 team.',icy()),
team('amb-icy-hutao-kazuha-yelan','Support · Hu Tao/Kazuha/Yelan',['Amber','Hu Tao','Kaedehara Kazuha','Yelan'],'vaporize','Current Icy Veins 7.0 support team.',icy()),
team('amb-icy-lyney-durin-nicole','Support · Lyney/Durin/Nicole',['Amber','Lyney','Durin','Nicole'],'mono-pyro','Current Icy Veins 7.0 support team.',icy()),
team('amb-melt-citlali-zhongli-bennett','Melt CA · Citlali/Zhongli/Bennett',['Amber','Citlali','Zhongli','Bennett'],'melt','KQM explicitly lists Citlali, Zhongli and Bennett as Melt partners.',kqm(),'Source-informed role combination.','adapted'),
team('amb-melt-citlali-lanyan-bennett','Melt CA · Citlali/Lan Yan/Bennett',['Amber','Citlali','Lan Yan','Bennett'],'melt','KQM explicitly lists Citlali, Lan Yan and Bennett as Melt partners.',kqm(),'Source-informed shield variant.','adapted'),
team('amb-melt-rosaria-xilonen-bennett','Melt CA · Rosaria/Xilonen/Bennett',['Amber','Rosaria','Xilonen','Bennett'],'melt','KQM explicitly lists another Cryo unit, Xilonen and Bennett as Melt roles.',kqm(),'Source-informed role combination.','adapted'),
team('amb-melt-ganyu-xilonen-bennett','Melt CA · Ganyu/Xilonen/Bennett',['Amber','Ganyu','Xilonen','Bennett'],'melt','KQM allows another Cryo unit with Xilonen and Bennett.',kqm(),'Source-informed role combination.','adapted'),
team('amb-melt-ganyu-zhongli-bennett','Melt CA · Ganyu/Zhongli/Bennett',['Amber','Ganyu','Zhongli','Bennett'],'melt','KQM supports another Cryo unit, Zhongli and Bennett for Charged Shots.',kqm(),'Source-informed shield variant.','adapted'),
team('amb-melt-furina-citlali-bennett','Melt CA · Furina/Citlali/Bennett',['Amber','Furina','Citlali','Bennett'],'melt','KQM lists Furina as a Melt Charged Attack flex and Citlali as Melt enabler/shielder; Bennett supplies healing/buff.',kqm(),'Source-informed Furina variant.','adapted'),
team('amb-melt-rosaria-layla-xilonen','Melt CA · Rosaria/Layla/Xilonen',['Amber','Rosaria','Layla','Xilonen'],'melt','KQM lists Cryo teammates plus shielding and Xilonen as valid Melt roles.',kqm(),'Source-informed Bennett-less variant.','adapted'),
team('amb-burgeon-nahida-kokomi-zhongli','Burgeon · Nahida/Kokomi/Zhongli',['Amber','Nahida','Sangonomiya Kokomi','Zhongli'],'burgeon','KQM lists Nahida, Kokomi and Zhongli as Burgeon partners.',kqm(),'Source-informed role combination.','adapted'),
team('amb-burgeon-nahida-furina-layla','Burgeon · Nahida/Furina/Layla',['Amber','Nahida','Furina','Layla'],'burgeon','KQM lists Nahida, Furina and Layla for Dendro/Hydro/shield roles.',kqm(),'Source-informed Freeze-Burgeon shell.','adapted'),
team('amb-burgeon-collei-kokomi-diona','Burgeon · Collei/Kokomi/Diona',['Amber','Collei','Sangonomiya Kokomi','Diona'],'burgeon','KQM lists Collei, Kokomi and Diona as valid Burgeon roles.',kqm(),'Source-informed accessible shell.','adapted'),
team('amb-burgeon-dmc-kokomi-rosaria','Burgeon · Dendro Traveler/Kokomi/Rosaria',['Amber','Aether Dendro','Sangonomiya Kokomi','Rosaria'],'burgeon','KQM lists Dendro Traveler, Kokomi and Rosaria as valid roles.',kqm(),'Source-informed Traveler variant.','adapted'),
team('amb-burgeon-yaoyao-furina-layla','Burgeon · Yaoyao/Furina/Layla',['Amber','Yaoyao','Furina','Layla'],'burgeon','KQM lists Yaoyao, Furina and Layla as valid Burgeon roles.',kqm(),'Source-informed sustain shell.','adapted'),
team('amb-burgeon-nahida-ayato-zhongli','Burgeon · Nahida/Ayato/Zhongli',['Amber','Nahida','Kamisato Ayato','Zhongli'],'burgeon','KQM lists Ayato as off-field Hydro option alongside Nahida and Zhongli.',kqm(),'Source-informed role combination.','adapted'),
team('amb-burgeon-collei-furina-kirara','Burgeon · Collei/Furina/Kirara',['Amber','Collei','Furina','Kirara'],'burgeon','KQM lists Collei, Furina and Kirara; Collei supplies enough Dendro that Kirara can be the shield flex.',kqm(),'Source-informed shield shell.','adapted'),
team('amb-burgeon-nahida-kokomi-sucrose','Burgeon · Nahida/Kokomi/Sucrose',['Amber','Nahida','Sangonomiya Kokomi','Sucrose'],'burgeon','KQM lists Sucrose for EM/grouping and Hydro absorption.',kqm(),'Source-informed EM shell.','adapted'),
team('amb-burgeon-nahida-kokomi-lynette','Burgeon · Nahida/Kokomi/Lynette',['Amber','Nahida','Sangonomiya Kokomi','Lynette'],'burgeon','KQM lists Lynette for taunt and Hydro absorption in Burgeon.',kqm(),'Source-informed taunt shell.','adapted'),
team('amb-burgeon-collei-kokomi-ganyu','Burgeon · Collei/Kokomi/Ganyu',['Amber','Collei','Sangonomiya Kokomi','Ganyu'],'burgeon','KQM lists Ganyu as Cryo flex to improve Core generation through Freeze.',kqm(),'Source-informed Freeze-Burgeon shell.','adapted'),
team('amb-support-hutao-xingqiu-sucrose','Burst Support · Hu Tao/Xingqiu/Sucrose',['Amber','Hu Tao','Xingqiu','Sucrose'],'vaporize','KQM explicitly lists Xingqiu and Sucrose in Hu Tao VV support roles.',kqm(),'Source-informed VV variant.','adapted'),
team('amb-support-hutao-yelan-kazuha','Burst Support · Hu Tao/Yelan/Kazuha',['Amber','Hu Tao','Yelan','Kaedehara Kazuha'],'vaporize','KQM explicitly lists Yelan and Kazuha as Hu Tao VV support roles.',kqm(),'Source-informed VV variant.','adapted'),
team('amb-support-hutao-yelan-jean','Burst Support · Hu Tao/Yelan/Jean',['Amber','Hu Tao','Yelan','Jean'],'vaporize','KQM lists Jean as VV/emergency healer and Yelan as Hydro enabler.',kqm(),'Source-informed sustain variant.','adapted'),
team('amb-support-hutao-xingqiu-sayu','Burst Support · Hu Tao/Xingqiu/Sayu',['Amber','Hu Tao','Xingqiu','Sayu'],'vaporize','KQM lists Sayu as VV/emergency healer and Xingqiu as Hydro enabler.',kqm(),'Source-informed accessible variant.','adapted'),
team('amb-support-hutao-yelan-heizou','Burst Support · Hu Tao/Yelan/Heizou',['Amber','Hu Tao','Yelan','Shikanoin Heizou'],'vaporize','KQM lists Heizou as a VV/grouping option and Yelan as Hydro enabler.',kqm(),'Source-informed VV variant.','adapted')
];