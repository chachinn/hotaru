const KQM='https://keqingmains.com/q/charlotte-quickguide/';
const ICY='https://www.icy-veins.com/genshin-impact/charlotte-guide-best-builds';
const source={label:'Charlotte reviewed team theorycraft',url:KQM,type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-24',links:[{label:'Current Charlotte build cross-check',url:ICY,type:'Reviewed guide',platform:'Guide',reviewedAt:'2026-08-24'}]};
const team=(id,name,members,reaction,why,notes='')=>({id,name,members,reaction,why,notes,confidence:'Reviewed',provenance:'source-informed',source});
export const CHARLOTTE_REVIEWED_TEAMS=[
  team('charlotte-neuv-furina-kazuha','Neuvillette Furina',['Charlotte','Neuvillette','Furina','Kaedehara Kazuha'],'freeze','Charlotte’s partywide healing rapidly restores Furina-drained HP while Kazuha supports Hydro and Neuvillette carries.'),
  team('charlotte-neuv-furina-escoffier','Neuvillette Furina · Escoffier',['Charlotte','Neuvillette','Furina','Escoffier'],'freeze','Charlotte handles teamwide healing while Escoffier adds Cryo damage/support and Furina buffs Neuvillette.'),
  team('charlotte-neuv-furina-citlali','Neuvillette Furina · Citlali',['Charlotte','Neuvillette','Furina','Citlali'],'freeze','Charlotte covers Fanfare healing while Citlali provides shielding/support around Neuvillette and Furina.'),
  team('charlotte-yelan-furina-kazuha','Furina double Hydro quickswap',['Charlotte','Yelan','Furina','Kaedehara Kazuha'],'freeze','Charlotte converts Furina HP drain into Fanfare while Yelan and Kazuha supply offense.'),
  team('charlotte-hutao-furina-rosaria','Hu Tao Furina',['Charlotte','Hu Tao','Furina','Rosaria'],'melt','Charlotte enables Furina Fanfare and Cryo application while Rosaria supports occasional Melt; healing timing changes Hu Tao’s low-HP assumptions.'),
  team('charlotte-navia-furina-xilonen','Navia Furina',['Charlotte','Navia','Furina','Xilonen'],'crystallize','Charlotte is a teamwide Furina healer while Xilonen and Furina support Navia; Cryo contributes Crystallize shards.'),
  team('charlotte-clorinde-furina-fischl','Clorinde Furina',['Charlotte','Clorinde','Furina','Fischl'],'electro-charged','Charlotte provides Furina-compatible healing while Clorinde drives and Fischl supplies off-field Electro.'),
  team('charlotte-raiden-furina-yelan','Raiden Furina',['Charlotte','Raiden Shogun','Furina','Yelan'],'electro-charged','Charlotte heals the party for Fanfare while Raiden batteries and drives the Hydro-heavy core.'),

  team('charlotte-ayaka-furina-venti','Ayaka Furina Freeze',['Charlotte','Kamisato Ayaka','Furina','Venti'],'freeze','Charlotte lowers Freeze-team sustain pressure and generates Fanfare while Venti groups for Ayaka.'),
  team('charlotte-ayaka-furina-kazuha','Ayaka Furina Freeze · Kazuha',['Charlotte','Kamisato Ayaka','Furina','Kaedehara Kazuha'],'freeze','Charlotte heals and supplies Cryo resonance while Furina/Kazuha amplify Ayaka.'),
  team('charlotte-ayaka-shenhe-kazuha','Ayaka Mono Cryo support',['Charlotte','Kamisato Ayaka','Shenhe','Kaedehara Kazuha'],'','Charlotte provides Cryo sustain/TTDS-style utility while Shenhe/Kazuha maximize Ayaka’s Cryo damage.'),
  team('charlotte-ganyu-furina-venti','Ganyu Freeze',['Charlotte','Ganyu','Furina','Venti'],'freeze','Charlotte heals for Furina Fanfare and provides Cryo resonance while Venti groups for Ganyu.'),
  team('charlotte-wrio-furina-yelan','Wriothesley Freeze',['Charlotte','Wriothesley','Furina','Yelan'],'freeze','Charlotte supplies partywide healing for Furina while Wriothesley carries and Yelan contributes Hydro damage.'),
  team('charlotte-wrio-furina-kazuha','Wriothesley Furina · Kazuha',['Charlotte','Wriothesley','Furina','Kaedehara Kazuha'],'freeze','Charlotte heals and applies Cryo while Furina/Kazuha support Wriothesley.'),
  team('charlotte-skirk-furina-yelan','Skirk Freeze',['Charlotte','Skirk','Furina','Yelan'],'freeze','Charlotte is a Cryo healer within Skirk’s Hydro/Cryo-focused team while Furina/Yelan provide Hydro support.'),
  team('charlotte-skirk-furina-escoffier','Skirk · Escoffier',['Charlotte','Skirk','Furina','Escoffier'],'freeze','Double Cryo lowers Charlotte ER while Escoffier/Furina amplify Skirk and Charlotte handles healing.'),
  team('charlotte-skirk-yelan-escoffier','Skirk · double Cryo/Hydro',['Charlotte','Skirk','Yelan','Escoffier'],'freeze','Charlotte and Escoffier provide Cryo support/sustain while Yelan contributes coordinated Hydro damage.'),
  team('charlotte-ganyu-shenhe-kazuha','Mono Cryo Ganyu',['Charlotte','Ganyu','Shenhe','Kaedehara Kazuha'],'','Charlotte’s healing is more valuable in Mono Cryo where Freeze is unavailable; Shenhe/Kazuha support Ganyu.'),

  team('charlotte-eula-raiden-shenhe','Eula Physical',['Charlotte','Eula','Raiden Shogun','Shenhe'],'','Charlotte sustains and supplies Cryo while Raiden enables Superconduct/battery and Shenhe supports Cryo/Physical-adjacent damage.'),
  team('charlotte-eula-fischl-mika','Eula Physical · Mika',['Charlotte','Eula','Fischl','Mika'],'','Charlotte is redundant sustain but can consolidate Cryo application in a comfort-heavy Physical shell.'),
  team('charlotte-freminet-fischl-furina','Freminet Furina',['Charlotte','Freminet','Fischl','Furina'],'freeze','Charlotte heals Furina drain while Fischl enables Superconduct and Freminet drives.'),
  team('charlotte-razor-fischl-furina','Razor Furina',['Charlotte','Razor','Fischl','Furina'],'electro-charged','Charlotte heals for Furina and supplies Cryo for Superconduct while Razor drives.'),

  team('charlotte-nahida-shinobu-xingqiu','Hyperbloom healer',['Charlotte','Nahida','Kuki Shinobu','Xingqiu'],'hyperbloom','Charlotte is a flex teamwide healer/Cryo applicator; Shinobu remains the dedicated Hyperbloom trigger.'),
  team('charlotte-alhaitham-shinobu-yelan','Alhaitham Hyperbloom',['Charlotte','Alhaitham','Kuki Shinobu','Yelan'],'hyperbloom','Charlotte provides healing/Cryo flex while Shinobu owns Hyperbloom and Alhaitham drives Dendro.'),
  team('charlotte-nahida-thoma-xingqiu','Burgeon healer',['Charlotte','Nahida','Thoma','Xingqiu'],'burgeon','Charlotte consolidates healing while Thoma owns Burgeon and Xingqiu/Nahida maintain cores.'),
  team('charlotte-nahida-dehya-yelan','Burgeon · Dehya',['Charlotte','Nahida','Dehya','Yelan'],'burgeon','Charlotte heals and applies Cryo while Dehya owns Burgeon and Yelan/Nahida supply cores.'),

  team('charlotte-driver-furina-xingqiu-kazuha','On-field Freeze Driver',['Charlotte','Furina','Xingqiu','Kaedehara Kazuha'],'freeze','Charlotte intentionally stays on field to drive Xingqiu while Furina/Kazuha provide buffs, Hydro application and team damage.'),
  team('charlotte-driver-xingqiu-yelan-kazuha','On-field Mono Hydro/Cryo Driver',['Charlotte','Xingqiu','Yelan','Kaedehara Kazuha'],'freeze','Charlotte’s Cryo Catalyst attacks drive coordinated Hydro attacks for frequent Freeze.'),
  team('charlotte-driver-bennett-xiangling-nahida','Reverse Melt Driver',['Charlotte','Bennett','Xiangling','Nahida'],'melt','Charlotte can intentionally trigger Reverse Melt with Cryo attacks over Burning/Pyro aura while Bennett/Xiangling support.'),
  team('charlotte-driver-bennett-xiangling-kazuha','Reverse Melt · Kazuha',['Charlotte','Bennett','Xiangling','Kaedehara Kazuha'],'melt','Bennett/Xiangling establish Pyro while Kazuha supports and Charlotte owns selected Reverse Melt hits.'),
  team('charlotte-driver-nahida-yelan-thoma','Burgeon Driver',['Charlotte','Nahida','Yelan','Thoma'],'burgeon','Charlotte drives Yelan/Nahida while Thoma remains the Burgeon trigger and owns transformative damage.'),
  team('charlotte-driver-nahida-yelan-shinobu','Hyperbloom Driver',['Charlotte','Nahida','Yelan','Kuki Shinobu'],'hyperbloom','Charlotte drives Yelan/Nahida while Shinobu owns Hyperbloom; Cryo can reduce unwanted Dendro consumption through Freeze.'),

  team('charlotte-arlecchino-bennett-kazuha','Arlecchino speedrun Cryo flex',['Charlotte','Arlecchino','Bennett','Kaedehara Kazuha'],'melt','Charlotte can provide brief Cryo setup in short rotations, but does not sustain Melt for normal extended Arlecchino gameplay.','Speedrun/niche setup only; Arlecchino cannot benefit from Charlotte’s healing.'),
  team('charlotte-wrio-shenhe-kazuha','Wriothesley Mono Cryo',['Charlotte','Wriothesley','Shenhe','Kaedehara Kazuha'],'','Charlotte supplies sustain and Cryo resonance while Shenhe/Kazuha amplify Wriothesley.'),
  team('charlotte-ayato-furina-kazuha','Ayato Furina Freeze flex',['Charlotte','Kamisato Ayato','Furina','Kaedehara Kazuha'],'freeze','Charlotte handles Furina healing while Ayato drives and Kazuha supports Hydro/Cryo reactions.'),
  team('charlotte-kokomi-furina-ganyu','Double Hydro Freeze',['Charlotte','Sangonomiya Kokomi','Furina','Ganyu'],'freeze','Charlotte is redundant sustain but can add Cryo resonance/application in a comfort-heavy Freeze shell.','Lower-priority flex because Kokomi already heals.')
];
export default CHARLOTTE_REVIEWED_TEAMS;