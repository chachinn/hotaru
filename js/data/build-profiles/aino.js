export default {
  id:'aino-offfield-hydro-support',
  character:'Aino',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-23',
  role:'Off-field Hydro Support / Enabler',
  roleGroup:'Support',
  roleRatings:[
    {label:'Main DPS',rating:'Not recommended'},
    {label:'Sub-DPS',rating:'Secondary'},
    {label:'Support',rating:'Primary'},
    {label:'Exploration',rating:'Utility'}
  ],
  tierRatings:[
    {label:'Main DPS',rating:'—'},
    {label:'Sub-DPS',rating:'A'},
    {label:'Support',rating:'—'},
    {label:'Exploration',rating:'B'}
  ],
  tierSource:'Game8 Aino Best Builds and Teams — tier list table',
  voiceActors:[
    {label:'EN',name:'Annabel Brook'},
    {label:'JP',name:'Takamori Natsumi (高森奈津美)'},
    {label:'CN',name:'Ge Zirui (葛子瑞)'},
    {label:'KR',name:'Jo Kyeong-i (조경이)'}
  ],
  roleReason:'Aino is primarily a swap-in Hydro support whose Burst provides off-field Hydro application, raises the team’s Moonsign level, and enables reaction-focused teams. Her personal Talent damage is usually a small part of team DPS, so Burst uptime and support utility take priority over conventional DPS stats.',
  scaling:'EM',
  scalingDetail:'Her Talents have ATK scaling, while her A4 adds Burst damage based on Elemental Mastery and her relevant transformative reaction damage scales with EM. In practice she is built around ER first, then the stats required by her weapon and reaction role.',
  focus:'Elemental Burst',
  reactionDriven:true,
  targets:{
    cr:{min:40,good:55,great:70,unit:'%'},
    cd:{min:80,good:100,great:120,unit:'%'},
    er:{min:155,good:190,great:220,unit:'%'},
    em:{min:500,good:700,great:800,unit:''}
  },
  mainStats:{
    sands:['Energy Recharge','Elemental Mastery'],
    goblet:['Elemental Mastery','Hydro DMG%'],
    circlet:['Elemental Mastery','CRIT Rate','CRIT DMG']
  },
  substats:['Energy Recharge','CRIT Rate (Favonius)','Elemental Mastery','CRIT Rate','CRIT DMG','ATK%'],
  talentPriority:['burst','skill','attack'],
  weaponPriority:[
    'Flame-Forged Insight',
    'Master Key',
    'Favonius Greatsword',
    'Makhaira Aquamarine',
    'Forest Regalia',
    'Sacrificial Greatsword',
    'Katsuragikiri Nagamasa'
  ],
  f2pWeapon:'Master Key',
  artifactPriority:[
    "Silken Moon's Serenade",
    'Noblesse Oblige',
    'Aubade of Morningstar and Moon',
    'Instructor',
    'Scroll of the Hero of Cinder City',
    'Deepwood Memories'
  ],
  buildSummaryTeams:[
    {name:'Flins Lunar Charge',members:['Aino','Flins','Ineffa','Sucrose']},
    {name:'Nilou Bloom',members:['Aino','Nahida','Nilou','Baizhu']}
  ],
  defaultVariant:'offfield-hydro-support',
  variants:[
    {
      id:'offfield-hydro-support',
      name:'Off-field Hydro Support',
      note:'Aino has one primary source-supported playstyle: keep her Burst available for off-field Hydro and Moonsign support. ER is weapon- and team-dependent; EM becomes more valuable when she owns reaction damage.',
      overrides:{
        mainStats:{sands:['Energy Recharge','Elemental Mastery'],goblet:['Elemental Mastery','Hydro DMG%'],circlet:['Elemental Mastery','CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','CRIT Rate (Favonius)','Elemental Mastery','CRIT Rate','CRIT DMG','ATK%'],
        weaponPriority:['Flame-Forged Insight','Master Key','Favonius Greatsword','Makhaira Aquamarine','Forest Regalia','Sacrificial Greatsword','Katsuragikiri Nagamasa'],
        artifactPriority:["Silken Moon's Serenade",'Noblesse Oblige','Aubade of Morningstar and Moon','Instructor','Scroll of the Hero of Cinder City','Deepwood Memories'],
        goalStats:[
          {label:'Energy Recharge',value:'KQM: 190–250%+ baseline · 155–205% Favonius · 100–140% Flame-Forged Insight; C4 lowers requirements further'},
          {label:'Elemental Mastery',value:'Game8 reaction-oriented target around 700–800; do not sacrifice required ER just to reach EM'},
          {label:'Favonius CRIT Rate',value:'Build enough CRIT Rate to trigger Favonius consistently when using it'},
          {label:'Damage stats',value:'EM for Bloom/Lunar-Charged ownership; otherwise personal damage is low priority'}
        ],
        buildSummaryTeams:[
          {name:'Flins Lunar Charge',members:['Aino','Flins','Ineffa','Sucrose']},
          {name:'Nilou Bloom',members:['Aino','Nahida','Nilou','Baizhu']}
        ]
      }
    }
  ],
  goalStats:[
    {label:'Energy Recharge',value:'KQM: 190–250%+ baseline · 155–205% Favonius · 100–140% Flame-Forged Insight; C4 lowers requirements further'},
    {label:'Elemental Mastery',value:'Game8 reaction-oriented target around 700–800; ER remains the first requirement for reliable Burst uptime'},
    {label:'Favonius CRIT Rate',value:'Prioritize enough CRIT Rate to trigger Favonius before optional personal-damage stats'},
    {label:'Main-stat context',value:'ER / EM Sands · EM / Hydro DMG Goblet · EM / CRIT Circlet depending on weapon and reaction ownership'}
  ],
  strengths:[
    'Provides consistent off-field Hydro through her Burst with very short field time.',
    'Raises the party’s Moonsign level and can enable Ascendant Gleam effects with another Nod-Krai character.',
    'Can hold Silken Moon’s Serenade to provide teamwide Elemental Mastery and Lunar Reaction support.',
    'Works with inexpensive weapons and does not require heavy Talent investment to perform her support role.'
  ],
  weaknesses:[
    'Personal Talent damage is low, so offensive ATK/CRIT investment usually gives less team value than meeting support requirements.',
    'Hydro application is slower without a second Nod-Krai character and can be insufficient for some reaction teams.',
    'Her ER requirement can be very high without an Energy-focused weapon or favorable team particle generation.',
    'Her strongest reaction buffs are constellation-dependent, especially C6.'
  ],
  playstyleTips:[
    'Use Skill for particles/repositioning, then Burst, then swap to the team’s driver or DPS.',
    'Meet ER requirements before chasing EM or personal damage; KQM’s baseline can exceed 200% without an Energy-focused weapon.',
    'If Favonius Greatsword is equipped, secure enough CRIT Rate to trigger its passive consistently.',
    'A second Nod-Krai teammate improves her Burst application rate and AoE through Ascendant Gleam.',
    'Use EM main stats when Aino owns meaningful Bloom/Lunar-Charged reaction damage; otherwise support uptime is more important than personal damage.'
  ],
  sourceRefs:[
    {label:'Game8 Aino Best Builds and Teams',kind:'Primary build reference',url:'https://game8.co/games/Genshin-Impact/archives/537903'},
    {label:'KQM Aino Quick Guide',kind:'Current theorycraft cross-check',url:'https://keqingmains.com/q/aino-quickguide/'},
    {label:'GameWith Aino Best Build Guide',kind:'Current build cross-check',url:'https://gamewith.net/genshin-impact/article/show/69272'},
    {label:'La Gazette de Teyvat · Flins/Aino/Kuki/Sucrose Rotation',kind:'YouTube team/rotation cross-check',url:'https://www.youtube.com/watch?v=ZccXtlpp9bY'},
    {label:'HoYoLAB Aino Complete Guide',kind:'Community guide cross-check',url:'https://www.hoyolab.com/article/41509819'},
    {label:'HoYoLAB Aino Voice Actors',kind:'Voice actor cross-check',url:'https://www.hoyolab.com/article/42150481'}
  ]
};
