const KQM='https://keqingmains.com/q/diluc-quickguide/';
const GAME8='https://game8.co/games/Genshin-Impact/archives/297518';
const IV='https://www.icy-veins.com/genshin-impact/diluc-guide-best-builds';
const CITLALI='https://game8.co/games/Genshin-Impact/archives/461989';
const source=(label,url,type='Reviewed theorycraft')=>({label,url,type,platform:'Guide',reviewedAt:'2026-08-23'});
const kqm=()=>source('KQM Diluc Quick Guide',KQM);
const game8=()=>source('Game8 Diluc Best Builds and Teams',GAME8,'Source-backed guide');
const icy=()=>source('Icy Veins Diluc Guide',IV,'Source-backed guide');
const citlali=()=>source('Game8 Citlali Best Builds and Teams',CITLALI,'Source-backed guide');
const confidenceFor=s=>s?.type==='Reviewed theorycraft'?'Reviewed':'Community-sourced';
const team=(id,name,members,reaction,why,src,notes='',provenance='exact')=>({id,name,members,reaction,why,notes,provenance,confidence:confidenceFor(src),source:src,anchor:'Diluc',profileId:'diluc'});
export const DILUC_REVIEWED_TEAMS=[
  team('diluc-game8-plunge-furina-bennett-xianyun','Plunge Vape · Furina/Bennett/Xianyun',['Diluc','Furina','Bennett','Xianyun'],'vaporize','Game8 exact Xianyun Plunge team and current July 2026 guide-supported premium route.',{...game8(),links:[game8(),icy()]}),
  team('diluc-game8-plunge-rosaria-bennett-xianyun','Plunge Melt · Rosaria/Bennett/Xianyun',['Diluc','Rosaria','Bennett','Xianyun'],'melt','Game8 exact Plunge Melt team.',game8()),
  team('diluc-game8-vape-xingqiu-bennett-kazuha','Vaporize · Xingqiu/Bennett/Kazuha',['Diluc','Xingqiu','Bennett','Kaedehara Kazuha'],'vaporize','Game8 exact classic Vaporize team.',game8()),
  team('diluc-game8-melt-rosaria-bennett-sucrose','Melt · Rosaria/Bennett/Sucrose',['Diluc','Rosaria','Bennett','Sucrose'],'melt','Game8 exact regular Melt team.',game8()),
  team('diluc-game8-overload-fischl-chevreuse-bennett','Overloaded · Fischl/Chevreuse/Bennett',['Diluc','Fischl','Chevreuse','Bennett'],'overload','Game8 exact Overload team.',game8()),
  team('diluc-game8-f2p-kaeya-geotraveler-noelle','F2P Melt · Kaeya/Geo Traveler/Noelle',['Diluc','Kaeya','Geo Traveler','Noelle'],'melt','Game8 exact F2P team.',game8()),
  team('diluc-game8-vape-yelan-albedo-zhongli','Vaporize · Yelan/Albedo/Zhongli',['Diluc','Yelan','Albedo','Zhongli'],'vaporize','Game8 current Best Team Comp exact alternative.',game8()),

  team('diluc-kqm-vape-xingqiu-sucrose-bennett','Vaporize · Xingqiu/Sucrose/Bennett',['Diluc','Xingqiu','Sucrose','Bennett'],'vaporize','KQM exact Vaporize example.',kqm()),
  team('diluc-kqm-vape-xingqiu-yelan-bennett','Double Hydro Vape · Xingqiu/Yelan/Bennett',['Diluc','Xingqiu','Yelan','Bennett'],'vaporize','KQM exact Double Hydro Vaporize example.',kqm()),
  team('diluc-kqm-melt-kaeya-kazuha-bennett','Melt · Kaeya/Kazuha/Bennett',['Diluc','Kaeya','Kaedehara Kazuha','Bennett'],'melt','KQM exact Melt example.',kqm()),
  team('diluc-kqm-melt-rosaria-kazuha-diona','Melt · Rosaria/Kazuha/Diona',['Diluc','Rosaria','Kaedehara Kazuha','Diona'],'melt','KQM exact Melt example.',kqm()),
  team('diluc-kqm-vape-xingqiu-albedo-zhongli','Vaporize · Xingqiu/Albedo/Zhongli',['Diluc','Xingqiu','Albedo','Zhongli'],'vaporize','KQM exact Geo-flex Vaporize example.',kqm()),
  team('diluc-kqm-overvape-xingqiu-fischl-beidou','Overvape · Xingqiu/Fischl/Beidou',['Diluc','Xingqiu','Fischl','Beidou'],'overvape','KQM exact Vaporize + Overload example.',kqm()),

  team('diluc-kqm-mono-kazuha-xiangling-bennett','Mono Pyro · Kazuha/Xiangling/Bennett',['Diluc','Kaedehara Kazuha','Xiangling','Bennett'],'mono-pyro','KQM exact Mono Pyro example.',kqm()),
  team('diluc-kqm-mono-jean-xiangling-bennett','Mono Pyro · Jean/Xiangling/Bennett',['Diluc','Jean','Xiangling','Bennett'],'mono-pyro','KQM exact Mono Pyro example.',kqm()),
  team('diluc-kqm-mono-venti-dehya-bennett','Mono Pyro · Venti/Dehya/Bennett',['Diluc','Venti','Dehya','Bennett'],'mono-pyro','KQM exact Mono Pyro example.',kqm()),
  team('diluc-kqm-mono-kazuha-xiangling-zhongli','Mono Pyro · Kazuha/Xiangling/Zhongli',['Diluc','Kaedehara Kazuha','Xiangling','Zhongli'],'mono-pyro','KQM exact Mono Pyro example.',kqm()),

  team('diluc-kqm-burgeon-nahida-xingqiu-kokomi','Burgeon · Nahida/Xingqiu/Kokomi',['Diluc','Nahida','Xingqiu','Sangonomiya Kokomi'],'burgeon','KQM exact Retriburgeon example.',kqm()),
  team('diluc-kqm-burgeon-dmc-xingqiu-zhongli','Burgeon · Dendro Traveler/Xingqiu/Zhongli',['Diluc','Dendro Traveler','Xingqiu','Zhongli'],'burgeon','KQM exact Retriburgeon example.',kqm()),
  team('diluc-kqm-burgeon-yaoyao-yelan-ayato','Burgeon · Yaoyao/Yelan/Ayato',['Diluc','Yaoyao','Yelan','Kamisato Ayato'],'burgeon','KQM exact Double Hydro Burgeon example.',kqm()),
  team('diluc-kqm-burgeon-yaoyao-xingqiu-bennett','Burgeon · Yaoyao/Xingqiu/Bennett',['Diluc','Yaoyao','Xingqiu','Bennett'],'burgeon','KQM exact Burgeon example; Bennett is workable but can steal Burgeons.',kqm()),

  team('diluc-modern-plunge-citlali-bennett-xianyun','Plunge Melt · Citlali/Bennett/Xianyun',['Diluc','Citlali','Bennett','Xianyun'],'melt','Current Game8 Citlali guide identifies Diluc as a Melt DPS partner, while current Diluc guides identify Xianyun Plunge as his highest-ceiling route.',{...citlali(),links:[citlali(),game8(),icy()]},'Cross-source modern Plunge Melt composition.','adapted'),
  team('diluc-modern-plunge-ganyu-bennett-xianyun','Plunge Melt · Ganyu/Bennett/Xianyun',['Diluc','Ganyu','Bennett','Xianyun'],'melt','Current Plunge guides support Cryo application for Melt with Xianyun; Ganyu supplies off-field Cryo.',icy(),'Source-informed Plunge Melt variant.','adapted'),
  team('diluc-modern-plunge-kaeya-bennett-xianyun','Plunge Melt · Kaeya/Bennett/Xianyun',['Diluc','Kaeya','Bennett','Xianyun'],'melt','Kaeya is a KQM-supported Melt applier and Xianyun enables Diluc’s Plunge route.',{...icy(),links:[icy(),kqm()]},'Source-informed accessible Plunge Melt variant.','adapted'),
  team('diluc-modern-plunge-furina-xilonen-xianyun','Plunge Vape · Furina/Xilonen/Xianyun',['Diluc','Furina','Xilonen','Xianyun'],'vaporize','Furina/Xianyun define the current Plunge Vape core; Xilonen adds healing/buffing without competing for field time.',icy(),'Source-informed modern Plunge variant.','adapted'),

  team('diluc-adapt-vape-yelan-bennett-kazuha','Vaporize · Yelan/Bennett/Kazuha',['Diluc','Yelan','Bennett','Kaedehara Kazuha'],'vaporize','KQM supports Yelan as Hydro and Kazuha/Bennett as standard amplification supports.',kqm(),'Source-informed classic Vaporize variant.','adapted'),
  team('diluc-adapt-vape-xingqiu-bennett-zhongli','Vaporize · Xingqiu/Bennett/Zhongli',['Diluc','Xingqiu','Bennett','Zhongli'],'vaporize','KQM supports Xingqiu Vaporize and Zhongli as universal shield/RES-shred flex.',kqm(),'Source-informed Vaporize comfort variant.','adapted'),
  team('diluc-adapt-vape-yelan-bennett-sucrose','Vaporize · Yelan/Bennett/Sucrose',['Diluc','Yelan','Bennett','Sucrose'],'vaporize','KQM supports the Hydro + Anemo + Bennett role structure for Diluc reaction teams.',kqm(),'Source-informed Vaporize variant.','adapted'),
  team('diluc-adapt-melt-kaeya-sucrose-bennett','Melt · Kaeya/Sucrose/Bennett',['Diluc','Kaeya','Sucrose','Bennett'],'melt','KQM supports Kaeya Melt and Sucrose as an Anemo/EM buffer.',kqm(),'Source-informed Melt variant.','adapted'),
  team('diluc-adapt-melt-rosaria-kazuha-bennett','Melt · Rosaria/Kazuha/Bennett',['Diluc','Rosaria','Kaedehara Kazuha','Bennett'],'melt','KQM supports Rosaria Melt and Kazuha/Bennett as amplification supports.',kqm(),'Source-informed Melt variant.','adapted'),
  team('diluc-adapt-overload-yae-chevreuse-bennett','Overloaded · Yae/Chevreuse/Bennett',['Diluc','Yae Miko','Chevreuse','Bennett'],'overload','Game8 establishes Diluc/Chevreuse Overload; Yae fills the supported Electro off-field role while preserving Pyro/Electro-only restrictions.',game8(),'Source-informed Chevreuse variant.','adapted'),
  team('diluc-adapt-overload-fischl-chevreuse-dehya','Overloaded · Fischl/Chevreuse/Dehya',['Diluc','Fischl','Chevreuse','Dehya'],'overload','Game8 establishes the Chevreuse core and KQM lists Dehya as a Mono/defensive Pyro flex.',{...game8(),links:[game8(),kqm()]},'Source-informed Pyro/Electro-only variant.','adapted'),

  team('diluc-adapt-mono-sucrose-xiangling-bennett','Mono Pyro · Sucrose/Xiangling/Bennett',['Diluc','Sucrose','Xiangling','Bennett'],'mono-pyro','KQM explicitly allows virtually any Anemo VV unit in Mono Pyro and lists Xiangling/Bennett as preferred Pyro teammates.',kqm(),'Source-informed Mono Pyro variant.','adapted'),
  team('diluc-adapt-mono-heizou-xiangling-bennett','Mono Pyro · Heizou/Xiangling/Bennett',['Diluc','Shikanoin Heizou','Xiangling','Bennett'],'mono-pyro','KQM lists Heizou among valid Anemo VV options for Mono Pyro.',kqm(),'Source-informed Mono Pyro variant.','adapted'),
  team('diluc-adapt-mono-sayu-xiangling-bennett','Mono Pyro · Sayu/Xiangling/Bennett',['Diluc','Sayu','Xiangling','Bennett'],'mono-pyro','KQM lists Sayu among valid Anemo VV options for Mono Pyro.',kqm(),'Source-informed Mono Pyro variant.','adapted'),
  team('diluc-adapt-mono-anemotraveler-xiangling-bennett','Mono Pyro · Anemo Traveler/Xiangling/Bennett',['Diluc','Anemo Traveler','Xiangling','Bennett'],'mono-pyro','KQM lists Anemo Traveler among valid VV options for Mono Pyro.',kqm(),'Source-informed accessible Mono Pyro variant.','adapted'),

  team('diluc-adapt-burgeon-baizhu-xingqiu-yelan','Burgeon · Baizhu/Xingqiu/Yelan',['Diluc','Baizhu','Xingqiu','Yelan'],'burgeon','KQM lists Baizhu as Dendro/healer and Xingqiu/Yelan as Hydro options; Double Hydro maintains Core generation.',kqm(),'Source-informed Burgeon variant.','adapted'),
  team('diluc-adapt-burgeon-collei-xingqiu-zhongli','Burgeon · Collei/Xingqiu/Zhongli',['Diluc','Collei','Xingqiu','Zhongli'],'burgeon','KQM lists Collei, Xingqiu and Zhongli for the Dendro/Hydro/flex roles, with the caveat that Collei’s Burst may not cover the full combo.',kqm(),'Source-informed Burgeon variant.','adapted'),
  team('diluc-adapt-burgeon-nahida-xingqiu-zhongli','Burgeon · Nahida/Xingqiu/Zhongli',['Diluc','Nahida','Xingqiu','Zhongli'],'burgeon','KQM specifically notes Xingqiu as the reliable solo Hydro partner with Nahida and Zhongli as a useful universal flex.',kqm(),'Source-informed Burgeon comfort variant.','adapted')
];
export default DILUC_REVIEWED_TEAMS;