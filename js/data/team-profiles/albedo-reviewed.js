const KQM='https://keqingmains.com/q/albedo-quickguide/';
const GAME8='https://game8.co/games/Genshin-Impact/archives/312182';
const source=(label,url,type='Reviewed theorycraft')=>({label,url,platform:'Guide',type,reviewedAt:'2026-08-23'});
const kqm=()=>source('KQM Albedo Quick Guide',KQM);
const game8=()=>source('Game8 Albedo Rating and Best Builds',GAME8,'Source-backed guide');
const team=(id,name,members,reaction,why,sourceInfo,notes='',provenance='exact')=>({id,name,members,reaction,why,notes,provenance,confidence:provenance==='exact'?'Reviewed':'Source-informed',source:sourceInfo,anchor:'Albedo',profileId:'albedo'});
export const ALBEDO_REVIEWED_TEAMS=[
team('alb-itto-durin-gorou','Geo · Itto + Durin + Gorou',['Albedo','Arataki Itto','Durin','Gorou'],'geo','Current KQM example.',kqm()),
team('alb-navia-fischl-bennett','Navia · Fischl + Bennett',['Albedo','Navia','Fischl','Bennett'],'crystallize','Current KQM example.',kqm()),
team('alb-arle-durin-chiori','Double Geo/Pyro · Arlecchino',['Albedo','Arlecchino','Durin','Chiori'],'geo','Current KQM example.',kqm()),
team('alb-zibai-illuga-columbina','Lunar-Crystallize · Zibai',['Albedo','Zibai','Illuga','Columbina'],'lunar-crystallize','Current KQM example.',kqm()),
team('alb-columbina-mona-xilonen','Lunar-Crystallize · Mona/Xilonen',['Albedo','Columbina','Mona','Xilonen'],'lunar-crystallize','Current KQM example.',kqm()),
team('alb-childe-durin-xilonen','Hexerei · Tartaglia/Durin',['Albedo','Tartaglia','Durin','Xilonen'],'vaporize','Current KQM example.',kqm()),
team('alb-klee-furina-xilonen','Hexerei Klee · Furina/Xilonen',['Albedo','Klee','Furina','Xilonen'],'geo','Current KQM example.',kqm()),
team('alb-noelle-fischl-gorou','Limited roster · Noelle',['Albedo','Noelle','Fischl','Gorou'],'geo','Current KQM limited-roster example.',kqm()),
team('alb-g8-navia-durin-bennett','Navia · Durin/Bennett',['Albedo','Navia','Durin','Bennett'],'crystallize','Game8 representative team.',game8()),
team('alb-g8-klee-bennett-zhongli','Klee · Bennett/Zhongli',['Albedo','Klee','Bennett','Zhongli'],'geo','Game8 representative team.',game8()),
team('alb-g8-venti-durin-bennett','Venti · Durin/Bennett',['Albedo','Venti','Durin','Bennett'],'geo','Game8 representative team.',game8()),
team('alb-itto-gorou-zhongli','Mono Geo · Itto',['Albedo','Arataki Itto','Gorou','Zhongli'],'geo','KQM identifies all three as synergistic Geo partners.',kqm(),'Source-informed.','adapted'),
team('alb-itto-gorou-xilonen','Mono Geo · Itto/Xilonen',['Albedo','Arataki Itto','Gorou','Xilonen'],'geo','Xilonen is one of Albedo’s best Geo partners.',kqm(),'Source-informed.','adapted'),
team('alb-noelle-gorou-yelan','Noelle · Yelan',['Albedo','Noelle','Gorou','Yelan'],'geo','Preserves the reviewed Noelle/Gorou core with an off-field flex.',kqm(),'Source-informed.','adapted'),
team('alb-noelle-gorou-furina','Noelle · Furina',['Albedo','Noelle','Gorou','Furina'],'geo','Noelle sustains Furina while Albedo/Gorou support Geo damage.',kqm(),'Source-informed.','adapted'),
team('alb-navia-furina-xilonen','Navia · Furina/Xilonen',['Albedo','Navia','Furina','Xilonen'],'crystallize','Navia and Xilonen are explicitly recommended Albedo partners.',kqm(),'Source-informed.','adapted'),
team('alb-navia-fischl-xilonen','Navia · Fischl/Xilonen',['Albedo','Navia','Fischl','Xilonen'],'crystallize','Preserves exact Navia/Fischl core with Xilonen support.',kqm(),'Source-informed.','adapted'),
team('alb-navia-durin-xilonen','Navia · Durin/Xilonen',['Albedo','Navia','Durin','Xilonen'],'crystallize','Combines supported Navia, Durin and Xilonen roles.',kqm(),'Source-informed.','adapted'),
team('alb-ning-gorou-zhongli','Ningguang · Gorou/Zhongli',['Albedo','Ningguang','Gorou','Zhongli'],'geo','Ningguang is listed as compatible Geo on-fielder.',kqm(),'Source-informed.','adapted'),
team('alb-ning-xilonen-bennett','Ningguang · Xilonen/Bennett',['Albedo','Ningguang','Xilonen','Bennett'],'geo','Uses supported Ningguang and Xilonen roles.',kqm(),'Source-informed.','adapted'),
team('alb-zibai-illuga-xilonen','Lunar-Crystallize · Zibai/Xilonen',['Albedo','Zibai','Illuga','Xilonen'],'lunar-crystallize','Zibai/Illuga are supported Lunar-Crystallize partners; Xilonen is a premier Geo support.',kqm(),'Source-informed.','adapted'),
team('alb-zibai-columbina-xilonen','Lunar-Crystallize · Zibai/Columbina',['Albedo','Zibai','Columbina','Xilonen'],'lunar-crystallize','Preserves KQM-supported Lunar-Crystallize roles.',kqm(),'Source-informed.','adapted'),
team('alb-chiori-zhongli-hutao','Double Geo · Hu Tao',['Albedo','Chiori','Zhongli','Hu Tao'],'geo','KQM says Albedo+Chiori can form a Double Geo off-field core in many teams.',kqm(),'Source-informed.','adapted'),
team('alb-chiori-zhongli-xiao','Double Geo · Xiao',['Albedo','Chiori','Zhongli','Xiao'],'geo','Albedo+Chiori Double Geo off-field core around an on-field carry.',kqm(),'Source-informed.','adapted'),
team('alb-klee-durin-xilonen','Hexerei Klee · Durin/Xilonen',['Albedo','Klee','Durin','Xilonen'],'geo','Klee and Durin are highlighted Hexerei partners; Xilonen buffs Albedo.',kqm(),'Source-informed.','adapted'),
team('alb-klee-durin-bennett','Hexerei Klee · Durin/Bennett',['Albedo','Klee','Durin','Bennett'],'geo','Supported Klee/Durin Hexerei core with Bennett.',kqm(),'Source-informed.','adapted'),
team('alb-venti-durin-mona','Hexerei Venti · Durin/Mona',['Albedo','Venti','Durin','Mona'],'geo','KQM lists Venti and Mona among Hexerei teammates for Albedo.',kqm(),'Source-informed.','adapted'),
team('alb-razor-fischl-zhongli','Razor · Fischl/Zhongli',['Albedo','Razor','Fischl','Zhongli'],'geo','Razor and Fischl are Hexerei partners; Zhongli activates Geo Resonance.',kqm(),'Source-informed.','adapted'),
team('alb-razor-durin-zhongli','Razor · Durin/Zhongli',['Albedo','Razor','Durin','Zhongli'],'geo','Razor on-field with Durin Hexerei synergy and Zhongli Geo support.',kqm(),'Source-informed.','adapted'),
team('alb-xilonen-furina-chiori','Geo flex · Xilonen/Furina/Chiori',['Albedo','Xilonen','Furina','Chiori'],'geo','KQM supports Xilonen, Furina synergy and Chiori as Albedo partners.',kqm(),'Source-informed.','adapted'),
team('alb-kachina-furina-noelle','Geo flex · Kachina/Furina/Noelle',['Albedo','Kachina','Furina','Noelle'],'geo','Kachina and Noelle are supported Geo partners; Noelle sustains Furina.',kqm(),'Source-informed.','adapted'),
team('alb-navia-kachina-bennett','Navia · Kachina/Bennett',['Albedo','Navia','Kachina','Bennett'],'crystallize','Navia and Kachina are supported Geo partners with Bennett flex.',kqm(),'Source-informed.','adapted')
];