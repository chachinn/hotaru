const KQM='https://keqingmains.com/q/aloy-quickguide/';
const GAME8='https://game8.co/games/Genshin-Impact/archives/301819';
const ICY='https://www.icy-veins.com/genshin-impact/aloy-team-guide';
const source=(label,url,type='Reviewed theorycraft',platform='Guide')=>({label,url,type,platform,reviewedAt:'2026-08-23'});
const kqm=()=>source('KQM Aloy Quick Guide',KQM);
const game8=()=>source('Game8 Best Team Comps · Aloy',GAME8,'Source-backed guide');
const icy=()=>source('Icy Veins Aloy Team Guide',ICY,'Source-backed guide');
const confidenceFor=s=>s?.type==='Reviewed theorycraft'?'Reviewed':s?.type==='Simulation-backed'?'Simulation-backed':'Community-sourced';
const team=(id,name,members,reaction,why,src,notes='',provenance='exact')=>({id,name,members,reaction,why,notes,provenance,confidence:confidenceFor(src),source:src,anchor:'Aloy',profileId:'aloy'});
export const ALOY_REVIEWED_TEAMS=[
  team('aloy-kqm-melt-kazuha','Reverse Melt · Kazuha',['Aloy','Bennett','Kaedehara Kazuha','Xiangling'],'melt','KQM and current Icy Veins both independently list this exact Reverse Melt shell.',{...kqm(),links:[kqm(),icy()]},'Exact team independently supported by KQM and Icy Veins.'),
  team('aloy-kqm-melt-jean-rosaria','Reverse Melt · Jean/Rosaria',['Aloy','Bennett','Jean','Rosaria'],'melt','KQM exact Reverse Melt example using Jean to spread Pyro and Rosaria as the second Cryo damage dealer.',kqm()),
  team('aloy-kqm-melt-xiangling-shenhe','Reverse Melt · Shenhe',['Aloy','Bennett','Xiangling','Shenhe'],'melt','KQM exact Reverse Melt example with Shenhe as Cryo support.',kqm()),
  team('aloy-kqm-freeze-ayaka','Freeze · Ayaka/Kokomi/Kazuha',['Aloy','Kamisato Ayaka','Sangonomiya Kokomi','Kaedehara Kazuha'],'freeze','KQM exact Freeze example with Ayaka as primary Cryo DPS.',kqm()),
  team('aloy-kqm-freeze-ganyu','Freeze · Ganyu/Mona/Venti',['Aloy','Ganyu','Mona','Venti'],'freeze','KQM exact Freeze example with Ganyu as primary Cryo DPS.',kqm()),
  team('aloy-kqm-freeze-rosaria','Freeze · Rosaria/Xingqiu/Jean',['Aloy','Rosaria','Xingqiu','Jean'],'freeze','KQM exact Freeze example.',kqm()),
  team('aloy-kqm-freeze-kaeya','Freeze · Kaeya/Xingqiu/Jean',['Aloy','Kaeya','Xingqiu','Jean'],'freeze','KQM explicitly presents Rosaria or Kaeya in this exact Freeze slot.',kqm()),
  team('aloy-kqm-mono-ayaka','Mono Cryo · Ayaka',['Aloy','Kamisato Ayaka','Shenhe','Kaedehara Kazuha'],'mono-cryo','KQM exact Mono Cryo example.',kqm()),
  team('aloy-kqm-mono-ganyu','Mono Cryo · Ganyu',['Aloy','Ganyu','Shenhe','Kaedehara Kazuha'],'mono-cryo','KQM exact Mono Cryo example.',kqm()),
  team('aloy-kqm-mono-rosaria-kaeya','Mono Cryo · Rosaria/Kaeya',['Aloy','Rosaria','Kaeya','Jean'],'mono-cryo','KQM exact Mono Cryo example.',kqm()),
  team('aloy-game8-yelan-xiangling-zhongli','Game8 Quickswap · Yelan/Xiangling/Zhongli',['Aloy','Yelan','Xiangling','Zhongli'],'melt','Game8 current representative Aloy team.',game8()),
  team('aloy-icy-freeze-ayaka-jean','Freeze · Furina/Ayaka/Jean',['Aloy','Furina','Kamisato Ayaka','Jean'],'freeze','Icy Veins current Version 7.0 exact Freeze team.',icy()),
  team('aloy-icy-freeze-ayaka-escoffier','Freeze · Furina/Ayaka/Escoffier',['Aloy','Furina','Kamisato Ayaka','Escoffier'],'freeze','Icy Veins current Version 7.0 exact Freeze team.',icy()),
  team('aloy-icy-freeze-ganyu-escoffier','Freeze · Furina/Ganyu/Escoffier',['Aloy','Furina','Ganyu','Escoffier'],'freeze','Icy Veins current Version 7.0 exact Freeze team.',icy()),
  team('aloy-icy-freeze-ganyu-shenhe','Freeze · Furina/Ganyu/Shenhe',['Aloy','Furina','Ganyu','Shenhe'],'freeze','Icy Veins current Version 7.0 exact Freeze team.',icy()),
  team('aloy-icy-freeze-kokomi-shenhe','Freeze · Ganyu/Kokomi/Shenhe',['Aloy','Ganyu','Sangonomiya Kokomi','Shenhe'],'freeze','Icy Veins current Version 7.0 exact Freeze team.',icy()),
  team('aloy-icy-freeze-ganyu-xingqiu','Freeze · Ganyu/Shenhe/Xingqiu',['Aloy','Shenhe','Ganyu','Xingqiu'],'freeze','Icy Veins current Version 7.0 exact Freeze team.',icy()),
  team('aloy-icy-freeze-ayaka-yelan','Freeze · Ayaka/Yelan/Escoffier',['Aloy','Kamisato Ayaka','Yelan','Escoffier'],'freeze','Icy Veins current Version 7.0 exact Freeze team.',icy()),
  team('aloy-icy-melt-sucrose','Melt · Xiangling/Bennett/Sucrose',['Aloy','Xiangling','Bennett','Sucrose'],'melt','Icy Veins current Version 7.0 exact Melt team.',icy()),
  team('aloy-icy-melt-venti','Melt · Xiangling/Bennett/Venti',['Aloy','Xiangling','Bennett','Venti'],'melt','Icy Veins current Version 7.0 exact Melt team.',icy()),
  team('aloy-icy-melt-nicole','Melt · Xiangling/Nicole/Kazuha',['Aloy','Xiangling','Nicole','Kaedehara Kazuha'],'melt','Icy Veins current Version 7.0 exact Melt team.',icy()),
  team('aloy-kqm-freeze-ayaka-mona-kazuha','Freeze · Ayaka/Mona/Kazuha',['Aloy','Kamisato Ayaka','Mona','Kaedehara Kazuha'],'freeze','KQM lists Ayaka as primary Cryo DPS, Mona as Hydro enabler, and Kazuha as preferred Anemo support.',kqm(),'Source-informed role combination.','adapted'),
  team('aloy-kqm-freeze-ayaka-furina-xianyun','Freeze · Ayaka/Furina/Xianyun',['Aloy','Kamisato Ayaka','Furina','Xianyun'],'freeze','KQM lists Ayaka and Furina as compatible Freeze roles and Xianyun as an Anemo/healing option; this preserves Furina healing while remaining composition-distinct.',kqm(),'Source-informed role combination.','adapted'),
  team('aloy-kqm-freeze-wrio-furina-jean','Freeze · Wriothesley/Furina/Jean',['Aloy','Wriothesley','Furina','Jean'],'freeze','KQM specifically notes Aloy as a battery/buffer in Wriothesley teams and recommends healer-backed Furina shells.',kqm(),'Source-informed role combination.','adapted'),
  team('aloy-kqm-freeze-wrio-kokomi-kazuha','Freeze · Wriothesley/Kokomi/Kazuha',['Aloy','Wriothesley','Sangonomiya Kokomi','Kaedehara Kazuha'],'freeze','KQM lists all three roles for standard Freeze teambuilding.',kqm(),'Source-informed role combination.','adapted'),
  team('aloy-kqm-freeze-ganyu-kokomi-kazuha','Freeze · Ganyu/Kokomi/Kazuha',['Aloy','Ganyu','Sangonomiya Kokomi','Kaedehara Kazuha'],'freeze','KQM lists Ganyu, Kokomi and Kazuha as conventional Freeze partners.',kqm(),'Source-informed role combination.','adapted'),
  team('aloy-kqm-freeze-rosaria-yelan-jean','Freeze · Rosaria/Yelan/Jean',['Aloy','Rosaria','Yelan','Jean'],'freeze','KQM lists Rosaria, Yelan and Jean as valid Freeze slots.',kqm(),'Source-informed role combination.','adapted'),
  team('aloy-kqm-freeze-kaeya-kokomi-sucrose','Freeze · Kaeya/Kokomi/Sucrose',['Aloy','Kaeya','Sangonomiya Kokomi','Sucrose'],'freeze','KQM lists Kaeya, Kokomi and Sucrose as accessible Freeze-role options.',kqm(),'Source-informed role combination.','adapted'),
  team('aloy-kqm-freeze-ayaka-kokomi-lynette','Freeze · Ayaka/Kokomi/Lynette',['Aloy','Kamisato Ayaka','Sangonomiya Kokomi','Lynette'],'freeze','KQM lists Lynette as a free Anemo option and Ayaka/Kokomi as conventional Freeze partners.',kqm(),'Source-informed accessible variant.','adapted'),
  team('aloy-kqm-mono-ayaka-shenhe-jean','Mono Cryo · Ayaka/Shenhe/Jean',['Aloy','Kamisato Ayaka','Shenhe','Jean'],'mono-cryo','KQM allows Jean as alternative Anemo sustain in Mono Cryo and lists Ayaka/Shenhe as premier Cryo partners.',kqm(),'Source-informed sustain variant.','adapted'),
  team('aloy-kqm-mono-ganyu-shenhe-jean','Mono Cryo · Ganyu/Shenhe/Jean',['Aloy','Ganyu','Shenhe','Jean'],'mono-cryo','KQM allows Jean as alternative Anemo support in Mono Cryo.',kqm(),'Source-informed sustain variant.','adapted'),
  team('aloy-kqm-mono-ayaka-rosaria-kazuha','Mono Cryo · Ayaka/Rosaria/Kazuha',['Aloy','Kamisato Ayaka','Rosaria','Kaedehara Kazuha'],'mono-cryo','KQM says if Shenhe is unavailable, choose two Cryo DPS options alongside Kazuha.',kqm(),'Source-informed non-Shenhe variant.','adapted'),
  team('aloy-kqm-mono-ganyu-kaeya-kazuha','Mono Cryo · Ganyu/Kaeya/Kazuha',['Aloy','Ganyu','Kaeya','Kaedehara Kazuha'],'mono-cryo','KQM supports double Cryo DPS when Shenhe is not used.',kqm(),'Source-informed non-Shenhe variant.','adapted'),
  team('aloy-kqm-melt-bennett-kazuha-rosaria','Reverse Melt · Kazuha/Rosaria',['Aloy','Bennett','Kaedehara Kazuha','Rosaria'],'melt','KQM states the flex can be another Cryo DPS when Kazuha/Jean sustains Pyro application from Bennett.',kqm(),'Source-informed second-Cryo variant.','adapted'),
  team('aloy-kqm-melt-bennett-jean-xiangling','Reverse Melt · Sunfire/Xiangling',['Aloy','Bennett','Jean','Xiangling'],'melt','KQM identifies Jean and Xiangling as Pyro-application routes in Reverse Melt Aloy teams.',kqm(),'Source-informed Pyro application variant.','adapted'),
  team('aloy-kqm-melt-bennett-kazuha-kaeya','Reverse Melt · Kazuha/Kaeya',['Aloy','Bennett','Kaedehara Kazuha','Kaeya'],'melt','KQM permits a second Cryo DPS in the flex slot while Kazuha sustains Pyro aura.',kqm(),'Source-informed second-Cryo variant.','adapted'),
  team('aloy-kqm-melt-bennett-jean-shenhe','Reverse Melt · Jean/Shenhe',['Aloy','Bennett','Jean','Shenhe'],'melt','KQM supports Jean as Pyro-spreading Anemo and Shenhe as Cryo damage support.',kqm(),'Source-informed support variant.','adapted')
];