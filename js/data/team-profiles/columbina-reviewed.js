const KQM='https://keqingmains.com/q/columbina-quickguide/';
const GAME8='https://game8.co/games/Genshin-Impact/archives/382106';
const GAMEWITH='https://gamewith.net/genshin-impact/article/show/72185';
const GENSHINLAB='https://genshinlab.com/team/columbina_team_guide/';
const source=(label,url,type='Reviewed theorycraft')=>({label,url,platform:'Guide',type,reviewedAt:'2026-08-23'});
const kqm=()=>source('KQM Columbina Quick Guide',KQM);
const game8=()=>source('Game8 Columbina Best Builds and Teams',GAME8,'Reviewed guide');
const gamewith=()=>source('GameWith Best Teams for Columbina',GAMEWITH,'Current team cross-check');
const genshinlab=()=>source('GenshinLab Columbina Team Guide',GENSHINLAB,'Current team cross-check');
const team=(id,name,members,reaction,why,sourceInfo,notes='',provenance='exact')=>({id,name,members,reaction,why,notes,provenance,confidence:provenance==='exact'?'Reviewed':'Source-informed',source:sourceInfo,anchor:'Columbina',profileId:'columbina'});

export const COLUMBINA_REVIEWED_TEAMS=[
  team('col-kqm-lc-flins-ineffa-sucrose','Lunar-Charged · Flins + Ineffa',['Columbina','Flins','Ineffa','Sucrose'],'lunar-charged','KQM standard Flins–Ineffa–Columbina core with Sucrose as the Anemo support.',kqm()),
  team('col-kqm-lc-flins-fischl-xilonen','Lunar-Charged · Flins + Fischl',['Columbina','Flins','Fischl','Xilonen'],'lunar-charged','KQM Ineffa-less Flins team; Fischl supplies Electro and Xilonen supplies sustain and support.',kqm()),
  team('col-kqm-lc-flins-fischl-jean','Lunar-Charged · Flins + Jean',['Columbina','Flins','Fischl','Jean'],'lunar-charged','KQM explicitly lists Jean as a protection/sustain alternative to Xilonen in this Flins–Fischl shell.',kqm(),'Source-informed substitution explicitly named by KQM.','adapted'),
  team('col-kqm-lc-flins-fischl-sayu','Lunar-Charged · Flins + Sayu',['Columbina','Flins','Fischl','Sayu'],'lunar-charged','KQM explicitly lists Sayu as a sustain alternative in the Flins–Fischl shell.',kqm(),'Source-informed substitution explicitly named by KQM.','adapted'),
  team('col-kqm-lc-flins-fischl-lanyan','Lunar-Charged · Flins + Lan Yan',['Columbina','Flins','Fischl','Lan Yan'],'lunar-charged','KQM explicitly lists Lan Yan as a protection alternative in the Flins–Fischl shell.',kqm(),'Source-informed substitution explicitly named by KQM.','adapted'),
  team('col-kqm-lc-flins-fischl-sucrose','Lunar-Charged · Flins + Sucrose',['Columbina','Flins','Fischl','Sucrose'],'lunar-charged','KQM notes Sucrose can replace the sustain slot when Columbina uses Prototype Amber.',kqm(),'Use Prototype Amber or otherwise provide adequate sustain.','adapted'),
  team('col-kqm-lc-raiden-ineffa-sucrose','Lunar-Charged · Raiden',['Columbina','Raiden Shogun','Ineffa','Sucrose'],'lunar-charged','KQM highlights Raiden with Ineffa and Columbina for strong team DPS and valuable Energy refund.',kqm()),
  team('col-kqm-lc-fischl-aino-lanyan','Lunar-Charged · Limited roster',['Columbina','Fischl','Aino','Lan Yan'],'lunar-charged','KQM limited-roster Lunar-Charged option using three obtainable 4-star teammates.',kqm()),
  team('col-kqm-lc-arlecchino-ineffa-xilonen','Lunar-Charged · Arlecchino',['Columbina','Arlecchino','Ineffa','Xilonen'],'lunar-charged','KQM identifies Pyro DPS characters as viable Columbina Lunar-Charged drivers; this preserves the Ineffa + support shell already source-backed for Arlecchino.',kqm(),'Source-informed KQM Pyro-DPS adaptation.','adapted'),
  team('col-kqm-lc-hutao-ineffa-xilonen','Lunar-Charged · Hu Tao',['Columbina','Hu Tao','Ineffa','Xilonen'],'lunar-charged','KQM names Hu Tao among Pyro DPS options for Columbina Lunar-Charged teams.',kqm(),'Source-informed KQM Pyro-DPS adaptation.','adapted'),
  team('col-kqm-lc-yoimiya-ineffa-xilonen','Lunar-Charged · Yoimiya',['Columbina','Yoimiya','Ineffa','Xilonen'],'lunar-charged','KQM names Yoimiya among Pyro DPS options for Columbina Lunar-Charged teams.',kqm(),'Source-informed KQM Pyro-DPS adaptation.','adapted'),
  team('col-kqm-lc-lyney-ineffa-xilonen','Lunar-Charged · Lyney',['Columbina','Lyney','Ineffa','Xilonen'],'lunar-charged','KQM names Lyney among Pyro DPS options for Columbina Lunar-Charged teams.',kqm(),'Source-informed KQM Pyro-DPS adaptation.','adapted'),
  team('col-kqm-lc-durin-ineffa-xilonen','Lunar-Charged · Durin',['Columbina','Durin','Ineffa','Xilonen'],'lunar-charged','KQM names Durin among Pyro DPS options for Columbina Lunar-Charged teams.',kqm(),'Source-informed KQM Pyro-DPS adaptation.','adapted'),

  team('col-kqm-lb-nefer-nahida','Lunar-Bloom · Nefer + Nahida',['Columbina','Lauma','Nefer','Nahida'],'lunar-bloom','KQM Nefer hypercarry example with Nahida as the offensive final slot.',kqm()),
  team('col-kqm-lb-nefer-shinobu','Lunar-Bloom · Nefer + Shinobu',['Columbina','Lauma','Nefer','Kuki Shinobu'],'lunar-bloom','KQM Nefer example using Shinobu for sustain and Instructor support.',kqm()),
  team('col-kqm-lb-nefer-zhongli','Lunar-Bloom · Nefer + Zhongli',['Columbina','Lauma','Nefer','Zhongli'],'lunar-bloom','KQM Nefer example using Zhongli for shielding and resistance utility.',kqm()),
  team('col-kqm-lb-nefer-budget','Lunar-Bloom · Accessible Nefer',['Columbina','Collei','Nefer','Aino'],'lunar-bloom','KQM accessible Nefer Lunar-Bloom team without Lauma.',kqm()),
  team('col-kqm-lb-ineffa-ayato','Lunar-Bloom/Hyperbloom · Ayato',['Columbina','Lauma','Ineffa','Kamisato Ayato'],'hyperbloom','KQM example balancing Lunar-Charged uptime and Hyperbloom with Ayato driving Hydro.',kqm()),
  team('col-kqm-lb-nilou-nahida','Lunar-Bloom · Nilou + Nahida',['Columbina','Lauma','Nilou','Nahida'],'lunar-bloom','KQM Nilou Lunar-Bloom example with Nahida; Columbina can drive and contribute both Lunar-Bloom and Bountiful Bloom damage.',kqm()),
  team('col-kqm-lb-nilou-baizhu','Lunar-Bloom · Nilou + Baizhu',['Columbina','Lauma','Nilou','Baizhu'],'lunar-bloom','KQM Nilou Lunar-Bloom example using Baizhu for sustain.',kqm()),
  team('col-kqm-lb-nilou-yaoyao','Lunar-Bloom · Nilou + Yaoyao',['Columbina','Lauma','Nilou','Yaoyao'],'lunar-bloom','KQM Nilou Lunar-Bloom example using Yaoyao for Dendro application and healing.',kqm()),
  team('col-kqm-lb-onfield-shinobu-aino','On-field Lunar-Bloom · Shinobu + Aino',['Columbina','Lauma','Kuki Shinobu','Aino'],'lunar-bloom','KQM simple on-field Columbina Lunar-Bloom team; Night of the Sky’s Unveiling is highlighted for this setup.',kqm()),
  team('col-gamewith-lb-nefer-sucrose','Lunar-Bloom · Nefer + Sucrose',['Columbina','Nefer','Lauma','Sucrose'],'lunar-bloom','GameWith lists this premium Lunar-Bloom team with Sucrose maximizing team damage.',gamewith()),
  team('col-genshinlab-lb-nefer-yaoyao','Lunar-Bloom · Nefer + Yaoyao',['Columbina','Nefer','Lauma','Yaoyao'],'lunar-bloom','GenshinLab lists Nefer, Lauma, Yaoyao and Columbina together as an SS-tier Lunar-Bloom team.',genshinlab()),
  team('col-genshinlab-hyperbloom-yelan-shinobu','Lunar Hyperbloom · Yelan + Shinobu',['Columbina','Lauma','Yelan','Kuki Shinobu'],'hyperbloom','GenshinLab lists Lauma, Columbina, Yelan and Kuki Shinobu as its Lunar Hyper-Bloom team.',genshinlab()),

  team('col-kqm-lcrys-zibai-zhongli','Lunar-Crystallize · Zibai + Zhongli',['Columbina','Zibai','Illuga','Zhongli'],'lunar-crystallize','KQM standard Zibai Triple Geo example using Zhongli for general-use shielding.',kqm()),
  team('col-kqm-lcrys-zibai-gorou','Lunar-Crystallize · Zibai + Gorou',['Columbina','Zibai','Illuga','Gorou'],'lunar-crystallize','KQM standard Zibai Triple Geo example using Gorou as the fourth Geo support.',kqm()),
  team('col-kqm-lcrys-zibai-chiori','Lunar-Crystallize · Zibai + Chiori',['Columbina','Zibai','Illuga','Chiori'],'lunar-crystallize','KQM standard Zibai Triple Geo example using Chiori for off-field Geo damage.',kqm()),
  team('col-kqm-lcrys-navia','Lunar-Crystallize · Navia',['Columbina','Navia','Xilonen','Furina'],'lunar-crystallize','KQM example where Columbina enables Lunar-Crystallize for Navia while Xilonen and Furina provide major support.',kqm()),
  team('col-kqm-lcrys-ning-chiori','Lunar-Crystallize · Ningguang + Chiori',['Columbina','Ningguang','Illuga','Chiori'],'lunar-crystallize','KQM Ningguang Lunar-Crystallize example with Chiori contributing off-field Geo damage.',kqm()),
  team('col-kqm-lcrys-ning-kachina','Lunar-Crystallize · Ningguang + Kachina',['Columbina','Ningguang','Illuga','Kachina'],'lunar-crystallize','KQM explicitly allows Kachina when Chiori is unavailable in the Ningguang Lunar-Crystallize team.',kqm(),'Source-backed KQM alternative.','adapted'),
  team('col-kqm-lcrys-microwave','Lunar-Crystallize · Microwave',['Columbina','Zhongli','Geo Traveler','Albedo'],'lunar-crystallize','KQM old-school Geo construct Microwave core updated with Columbina Lunar-Crystallize.',kqm()),
  team('col-gamewith-lcrys-noelle','Lunar-Crystallize · F2P Noelle',['Columbina','Noelle','Illuga','Gorou'],'lunar-crystallize','GameWith lists this F2P Lunar-Crystallize team with Noelle as the main damage dealer.',gamewith()),

  team('col-game8-buffer-flins-ineffa','Game8 Lunar-Charged core',['Columbina','Flins','Ineffa','Sucrose'],'lunar-charged','Game8 lists Lunar-Charged among Columbina’s representative support teams and the same core is independently detailed by KQM.',game8()),
  team('col-game8-buffer-zibai-illuga','Game8 Lunar-Crystallize core',['Columbina','Zibai','Illuga','Zhongli'],'lunar-crystallize','Game8 lists Lunar-Crystallize among Columbina’s representative support teams; KQM independently details the Zibai–Illuga core.',game8())
];
