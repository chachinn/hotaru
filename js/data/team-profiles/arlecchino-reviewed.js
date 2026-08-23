const GAME8='https://game8.co/games/Genshin-Impact/archives/382103';
const KQM='https://keqingmains.com/q/arlecchino-quickguide/';
const SEVY='https://www.youtube.com/watch?v=D8xP2FXY3CQ';
const REDDIT_AUG='https://www.reddit.com/r/ArlecchinoMains/comments/1vfapxt/best_team_for_her_rn/';
const REDDIT_JUL='https://www.reddit.com/r/ArlecchinoMains/comments/1unshm7/new_best_arlecchino_team_comps/';

const source=(label,url,platform='Guide',type='Reviewed theorycraft',links=[])=>({label,url,platform,type,reviewedAt:'2026-08-23',links});
const kqm=(extra=[])=>source('KQM Arlecchino Quick Guide',KQM,'Guide','Reviewed theorycraft',[{label:'Game8 Arlecchino Best Builds and Teams',url:GAME8,platform:'Guide',type:'Reviewed guide'},...extra]);
const game8=()=>source('Game8 Arlecchino Best Builds and Teams',GAME8,'Guide','Reviewed guide');
const community=(label,url)=>source(label,url,'Reddit','Community-supported discussion');
const team=(id,name,members,reaction,why,sourceInfo,notes='')=>({id,name,members,reaction,why,notes,confidence:sourceInfo.type==='Community-supported discussion'?'Community-sourced':'Reviewed',source:sourceInfo,anchor:'Arlecchino',profileId:'arlecchino'});

export const ARLECCHINO_REVIEWED_TEAMS=[
  team('arle-kqm-vape-yelan-bennett-xilonen','Vaporize · Yelan + Xilonen',['Arlecchino','Yelan','Bennett','Xilonen'],'vaporize','Yelan enables Vaporize while Bennett and Xilonen heavily amplify Arlecchino’s on-field Pyro damage.',kqm()),
  team('arle-kqm-vape-yelan-bennett-kazuha','Vaporize · Yelan + Kazuha',['Arlecchino','Yelan','Bennett','Kaedehara Kazuha'],'vaporize','Yelan supplies fast Hydro while Bennett buffs ATK and Kazuha provides VV, grouping and Pyro DMG support.',kqm([{label:'Sevy Arlecchino Guide',url:SEVY,platform:'YouTube',type:'Guide cross-check'}])),
  team('arle-kqm-vape-yelan-bennett-sucrose','Vaporize · Yelan + Sucrose',['Arlecchino','Yelan','Bennett','Sucrose'],'vaporize','Sucrose provides VV and EM support while Yelan enables Vaporize and Bennett supplies ATK.',kqm()),
  team('arle-kqm-vape-yelan-bennett-lanyan','Vaporize · Yelan + Lan Yan',['Arlecchino','Yelan','Bennett','Lan Yan'],'vaporize','Lan Yan consolidates shielding and VV while Yelan maintains Hydro and Bennett buffs Arlecchino.',kqm()),
  team('arle-kqm-vape-mona-bennett-sucrose','Vaporize · Mona + Bennett + Sucrose',['Arlecchino','Mona','Bennett','Sucrose'],'vaporize','Mona provides short high-value Hydro/buffs; Bennett and Sucrose maximize Arlecchino’s amplified hits.',kqm([{label:'ArlecchinoMains August 2026 team discussion',url:REDDIT_AUG,platform:'Reddit',type:'Community cross-check'}])),
  team('arle-kqm-vape-mona-nicole-sucrose','Vaporize · Mona + Nicole + Sucrose',['Arlecchino','Mona','Nicole','Sucrose'],'vaporize','Nicole replaces Bennett with a strong ATK buff and shield while Sucrose supports EM/VV and Mona enables Vape.',kqm()),
  team('arle-kqm-overvape-mona-bennett-fischl','Overvape · Mona + Bennett + Fischl',['Arlecchino','Mona','Bennett','Fischl'],'vaporize','Mona enables Vaporize while Fischl contributes off-field Electro and current Hexerei buffs; Bennett amplifies Arlecchino.',kqm()),
  team('arle-kqm-overvape-mona-nicole-fischl','Overvape · Mona + Nicole + Fischl',['Arlecchino','Mona','Nicole','Fischl'],'vaporize','Nicole and Fischl form a current ATK-buffing core while Mona provides Hydro for Vaporize.',kqm()),
  team('arle-kqm-lunar-columbina-ineffa-xilonen','Lunar-Charged flex · Columbina + Ineffa',['Arlecchino','Columbina','Ineffa','Xilonen'],'lunar-charged','Columbina and Ineffa form a strong off-field Lunar-Charged core while Xilonen supports the team and Arlecchino remains on field.',kqm()),
  team('arle-kqm-vape-xingqiu-bennett-sucrose','Vaporize · Xingqiu + Sucrose',['Arlecchino','Xingqiu','Bennett','Sucrose'],'vaporize','Xingqiu provides reliable single-target Hydro plus damage reduction; Bennett and Sucrose buff Arlecchino.',kqm()),
  team('arle-kqm-vape-candace-bennett-xilonen','Vaporize · C6 Candace',['Arlecchino','Candace','Bennett','Xilonen'],'vaporize','C6 Candace provides mobile AoE Hydro and Normal Attack DMG support while Bennett and Xilonen amplify Arlecchino.',kqm(),'Candace is specifically recommended at C6 for this off-field Hydro role.'),
  team('arle-kqm-vape-furina-yelan-xilonen','Double Hydro · Furina + Yelan',['Arlecchino','Furina','Yelan','Xilonen'],'vaporize','Double Hydro makes aura management lenient while Yelan and Furina add strong off-field damage and team buffs.',kqm()),

  team('arle-kqm-melt-citlali-bennett-xilonen','Melt · Citlali + Xilonen',['Arlecchino','Citlali','Bennett','Xilonen'],'melt','Citlali enables Forward Melt and shields while Bennett and Xilonen provide strong offensive support.',kqm()),
  team('arle-kqm-melt-citlali-bennett-sucrose','Melt · Citlali + Sucrose',['Arlecchino','Citlali','Bennett','Sucrose'],'melt','Sucrose assists aura setup and buffs EM while Citlali enables Melt and Bennett supplies ATK.',kqm()),
  team('arle-kqm-melt-citlali-bennett-kazuha','Melt · Citlali + Kazuha',['Arlecchino','Citlali','Bennett','Kaedehara Kazuha'],'melt','Kazuha provides grouping/VV and Pyro buffs while Citlali enables Melt and Bennett supplies ATK.',kqm()),
  team('arle-kqm-melt-citlali-nicole-sucrose','Melt · Citlali + Nicole',['Arlecchino','Citlali','Nicole','Sucrose'],'melt','Nicole supplies a strong shield and ATK support while Sucrose and Citlali set up amplified Melt hits.',kqm()),
  team('arle-kqm-melt-citlali-bennett-escoffier','Double Cryo Melt · Escoffier',['Arlecchino','Citlali','Bennett','Escoffier'],'melt','Double Cryo improves Melt consistency; Escoffier adds fast off-field Cryo damage and Citlali shields.',kqm()),
  team('arle-kqm-melt-citlali-bennett-layla','Double Cryo Melt · Layla',['Arlecchino','Citlali','Bennett','Layla'],'melt','Layla adds a second Cryo source and more shielding so Arlecchino can execute Melt strings more safely.',kqm()),
  team('arle-kqm-melt-c6kaeya-bennett-xilonen','Melt · C6 Kaeya',['Arlecchino','Kaeya','Bennett','Xilonen'],'melt','C6 Kaeya’s fast Cryo application can enable Arlecchino Melts while Bennett and Xilonen amplify her damage.',kqm(),'KQM specifically calls out C6 Kaeya for this setup.'),
  team('arle-kqm-melt-escoffier-bennett-venti','Melt · Escoffier + Venti',['Arlecchino','Escoffier','Bennett','Venti'],'melt','Venti’s Anemo and Burst absorption help establish Cryo aura while Escoffier applies Cryo and Bennett buffs Arlecchino.',kqm()),

  team('arle-kqm-overload-fischl-nicole','Overloaded · Fischl + Nicole',['Arlecchino','Chevreuse','Fischl','Nicole'],'overload','Fischl and Nicole form a powerful current ATK-buffing/off-field core while Chevreuse supplies Pyro/Electro shred and buffs.',kqm([{label:'ArlecchinoMains August 2026 team discussion',url:REDDIT_AUG,platform:'Reddit',type:'Community cross-check'}])),
  team('arle-kqm-overload-fischl-bennett','Overloaded · Fischl + Bennett',['Arlecchino','Chevreuse','Fischl','Bennett'],'overload','Chevreuse and Bennett strongly buff Arlecchino and Fischl while Fischl maintains off-field Electro.',kqm()),
  team('arle-kqm-overload-ineffa-bennett','Overloaded · Ineffa + Bennett',['Arlecchino','Chevreuse','Ineffa','Bennett'],'overload','Ineffa trades some Fischl damage for a comfortable shield and Electro application while Bennett and Chevreuse buff Arlecchino.',kqm()),
  team('arle-kqm-overload-fischl-durin','Overloaded · Fischl + Durin',['Arlecchino','Chevreuse','Fischl','Durin'],'overload','Durin provides off-field damage and RES shred while enabling Fischl’s current Hexerei buff; Chevreuse supports the Pyro/Electro shell.',kqm([{label:'ArlecchinoMains July 2026 team discussion',url:REDDIT_JUL,platform:'Reddit',type:'Community cross-check'}])),
  team('arle-kqm-overload-yae-thoma','Overloaded · Yae + Thoma',['Arlecchino','Chevreuse','Yae Miko','Thoma'],'overload','Yae provides off-field Electro while Thoma supplies a continuously refreshed shield for a comfortable Chevreuse team.',kqm()),

  team('arle-kqm-pure-bennett-xilonen-kazuha','Pure Pyro · triple support',['Arlecchino','Bennett','Xilonen','Kaedehara Kazuha'],'mono-pyro','Bennett, Xilonen and Kazuha stack ATK, RES shred and Pyro DMG buffs around Arlecchino.',kqm()),
  team('arle-kqm-pure-bennett-emilie-lanyan','Pure Pyro · Emilie + Lan Yan',['Arlecchino','Bennett','Emilie','Lan Yan'],'mono-pyro','Emilie supplies off-field damage and Burning self-damage mitigation while Lan Yan shields and carries VV.',kqm()),
  team('arle-kqm-geo-bennett-chiori-zhongli','Double Geo · Chiori + Zhongli',['Arlecchino','Bennett','Chiori','Zhongli'],'crystallize','Chiori adds off-field Geo damage, Zhongli supplies a sturdy shield/RES shred, and Bennett buffs Arlecchino.',kqm()),
  team('arle-kqm-geo-bennett-chiori-kachina','Double Geo · Chiori + Kachina',['Arlecchino','Bennett','Chiori','Kachina'],'crystallize','Kachina carries Scroll and buffs Pyro/Geo while Chiori adds off-field Geo damage and Bennett buffs Arlecchino.',kqm()),
  team('arle-kqm-pure-durin-albedo-nicole','Bennett-less · Durin + Nicole',['Arlecchino','Durin','Albedo','Nicole'],'mono-pyro','Nicole buffs and shields Arlecchino while Durin and Albedo contribute strong off-field damage.',kqm()),
  team('arle-kqm-pure-durin-albedo-xilonen','Bennett-less · Durin + Xilonen',['Arlecchino','Durin','Albedo','Xilonen'],'mono-pyro','Xilonen supports Arlecchino while Durin and Albedo supply off-field damage without Bennett’s circle restriction.',kqm()),
  team('arle-kqm-pure-durin-nicole-prune','Bennett-less · Durin + Nicole + Prune',['Arlecchino','Durin','Nicole','Prune'],'mono-pyro','Nicole and Prune focus on buffing Arlecchino and Durin while Nicole also provides defensive utility.',kqm()),
  team('arle-kqm-budget-bennett-lanyan-kachina','Limited roster · Bennett + Lan Yan + Kachina',['Arlecchino','Bennett','Lan Yan','Kachina'],'mono-pyro','A reviewed lower-cost KQM team with Bennett buffs, Lan Yan shielding/VV and Kachina Scroll support.',kqm()),

  team('arle-game8-vape-yelan-bennett-zhongli','Game8 Vaporize · Zhongli',['Arlecchino','Yelan','Bennett','Zhongli'],'vaporize','Game8 lists Zhongli as a defensive Vaporize option alongside Yelan and Bennett.',game8()),
  team('arle-game8-vape-xingqiu-bennett-lanyan','Game8 Vaporize · Xingqiu + Lan Yan',['Arlecchino','Xingqiu','Bennett','Lan Yan'],'vaporize','Game8 lists Xingqiu for Hydro and Lan Yan for shielding/VV in a comfortable Vaporize shell.',game8()),
  team('arle-game8-vape-aino-bennett-candace','Game8 Vaporize · Aino + Candace',['Arlecchino','Aino','Bennett','Candace'],'vaporize','Game8 lists Aino as a slower Hydro option for Arlecchino with Candace and Bennett supporting the Normal Attack-focused team.',game8()),
  team('arle-game8-melt-rosaria-bennett-citlali','Game8 Melt · Rosaria + Citlali',['Arlecchino','Rosaria','Bennett','Citlali'],'melt','Game8 uses Rosaria and Citlali to maintain Cryo while Bennett buffs Arlecchino.',game8()),
  team('arle-game8-overload-fischl-beidou','Game8 Overloaded · Fischl + Beidou',['Arlecchino','Fischl','Chevreuse','Beidou'],'overload','Game8 lists Fischl and Beidou as the Electro core with Chevreuse; Beidou also provides defensive utility.',game8()),
  team('arle-game8-mono-xiangling-xilonen-thoma','Game8 Mono Pyro · Xilonen + Thoma',['Arlecchino','Xiangling','Xilonen','Thoma'],'mono-pyro','Game8 lists Xiangling as off-field Pyro damage with Xilonen support and Thoma shielding.',game8()),
  team('arle-game8-mono-kazuha-xiangling-thoma','Game8 Mono Pyro · Kazuha + Thoma',['Arlecchino','Kaedehara Kazuha','Xiangling','Thoma'],'mono-pyro','Kazuha amplifies Pyro, Xiangling adds off-field damage, and Thoma provides shielding.',game8()),
  team('arle-game8-mono-kazuha-emilie-thoma','Game8 Pyro/Burning · Emilie + Thoma',['Arlecchino','Kaedehara Kazuha','Emilie','Thoma'],'burning','Game8 lists Emilie as an off-field Dendro damage dealer benefiting from Arlecchino’s Pyro while Thoma protects the team.',game8()),
  team('arle-game8-burn-emilie-xiangling-bennett','Game8 Burning · Emilie + Xiangling',['Arlecchino','Emilie','Xiangling','Bennett'],'burning','Game8 uses Emilie and Xiangling as two sustained off-field damage sources while Bennett buffs Arlecchino.',game8()),
  team('arle-game8-burn-nahida-kazuha-bennett','Game8 Burning · Nahida + Kazuha',['Arlecchino','Nahida','Kaedehara Kazuha','Bennett'],'burning','Game8 lists Nahida for Dendro/EM and Kazuha/Bennett for Pyro amplification in a Burning shell.',game8()),
  team('arle-game8-doublegeo-yelan-chiori-zhongli','Game8 Double Geo · Yelan',['Arlecchino','Yelan','Chiori','Zhongli'],'vaporize','Yelan adds off-field Hydro while Chiori/Zhongli provide Geo Resonance, damage and shielding.',game8()),
  team('arle-game8-doublegeo-xingqiu-albedo-zhongli','Game8 Double Geo · Xingqiu',['Arlecchino','Xingqiu','Albedo','Zhongli'],'vaporize','Xingqiu enables Vaporize while Albedo/Zhongli provide Geo Resonance, off-field damage and strong shielding.',game8()),

  team('arle-community-mona-sucrose-bennett','Community · Mona + Sucrose + Bennett',['Arlecchino','Mona','Sucrose','Bennett'],'vaporize','Current ArlecchinoMains discussion independently recommends Mona/Sucrose/Bennett as a high-damage modern Vaporize option.',community('ArlecchinoMains · August 2026 best team discussion',REDDIT_AUG),'Community-supported cross-check; KQM also documents this exact composition.'),
  team('arle-community-beginner-xingqiu-bennett-kazuha','Community · Xingqiu + Bennett + Kazuha',['Arlecchino','Xingqiu','Bennett','Kaedehara Kazuha'],'vaporize','Current community discussion supports this accessible classic Vaporize core around Arlecchino.',community('ArlecchinoMains · August 2026 team discussion',REDDIT_AUG))
];

export const ARLECCHINO_TEAM_REVIEW={
  character:'Arlecchino',
  reviewedAt:'2026-08-23',
  target:30,
  sources:[
    {label:'Game8 Arlecchino Best Builds and Teams',url:GAME8},
    {label:'KQM Arlecchino Quick Guide — Luna VIII',url:KQM},
    {label:'Sevy Arlecchino Guide',url:SEVY},
    {label:'ArlecchinoMains August 2026 discussion',url:REDDIT_AUG},
    {label:'ArlecchinoMains July 2026 discussion',url:REDDIT_JUL}
  ]
};
