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
  scalingDetail:'Her Talents have ATK scaling, while her A4 adds Burst damage based on Elemental Mastery. Her practical build changes meaningfully depending on whether she is only enabling reactions, personally triggering Bloom, or contributing Lunar-Charged reaction damage.',
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
    'Flame-Forged Insight','Master Key','Favonius Greatsword','Makhaira Aquamarine','Forest Regalia','Sacrificial Greatsword','Katsuragikiri Nagamasa'
  ],
  f2pWeapon:'Master Key',
  artifactPriority:["Silken Moon's Serenade",'Noblesse Oblige','Aubade of Morningstar and Moon','Instructor','Scroll of the Hero of Cinder City','Deepwood Memories','Flower of Paradise Lost','Gilded Dreams'],
  buildSummaryTeams:[
    {name:'Flins Lunar-Charged',members:['Aino','Flins','Ineffa','Sucrose']},
    {name:'Nilou Bloom',members:['Aino','Nahida','Nilou','Baizhu']}
  ],
  defaultVariant:'offfield-hydro-support',
  variants:[
    {
      id:'offfield-hydro-support',
      name:'Off-field Hydro Support',
      note:'General support build for reliable Burst uptime, off-field Hydro and Moonsign utility. Meet ER first; use Favonius CRIT or optional EM/damage stats only after the rotation is stable.',
      overrides:{
        role:'Off-field Hydro Support / Enabler',roleGroup:'Support',focus:'Elemental Burst',
        mainStats:{sands:['Energy Recharge','Elemental Mastery'],goblet:['Elemental Mastery','Hydro DMG%'],circlet:['Elemental Mastery','CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','CRIT Rate (Favonius)','Elemental Mastery','CRIT Rate','CRIT DMG','ATK%'],
        weaponPriority:['Flame-Forged Insight','Master Key','Favonius Greatsword','Makhaira Aquamarine','Forest Regalia','Sacrificial Greatsword','Katsuragikiri Nagamasa'],
        artifactPriority:["Silken Moon's Serenade",'Noblesse Oblige','Instructor','Scroll of the Hero of Cinder City','Deepwood Memories'],
        goalStats:[
          {label:'Energy Recharge',value:'190–250%+ baseline · 155–205% with Favonius · 100–140% with Flame-Forged Insight; C4 lowers requirements further'},
          {label:'Favonius CRIT Rate',value:'Build enough CRIT Rate to trigger Favonius consistently when using it'},
          {label:'Optional offense',value:'Only invest in EM or CRIT after the Burst can be used on the intended rotation'}
        ],
        buildSummaryTeams:[
          {name:'Flins Lunar-Charged',members:['Aino','Flins','Ineffa','Sucrose']},
          {name:'Freeze Support',members:['Aino','Rosaria','Kaeya','Lan Yan']}
        ]
      }
    },
    {
      id:'bloom-trigger',
      name:'Bloom Trigger / Full EM',
      note:'Use when Aino personally owns meaningful Bloom damage. Keep enough ER for Burst uptime, then push Elemental Mastery instead of conventional ATK/CRIT damage stats.',
      overrides:{
        role:'Off-field Bloom Trigger / Hydro Enabler',roleGroup:'Support',focus:'Elemental Burst',reactionDriven:true,
        mainStats:{sands:['Elemental Mastery','Energy Recharge'],goblet:['Elemental Mastery'],circlet:['Elemental Mastery']},
        substats:['Energy Recharge','Elemental Mastery','CRIT Rate (Favonius)'],
        weaponPriority:['Flame-Forged Insight','Master Key','Makhaira Aquamarine','Forest Regalia','Favonius Greatsword','Sacrificial Greatsword','Katsuragikiri Nagamasa'],
        artifactPriority:["Silken Moon's Serenade",'Flower of Paradise Lost','Gilded Dreams','Instructor'],
        goalStats:[
          {label:'Energy Recharge',value:'Meet the exact rotation requirement before stacking EM'},
          {label:'Elemental Mastery',value:'Full-EM priority once Burst uptime is secure'},
          {label:'Character Level',value:'Level 90 is valuable when Aino owns Bloom reaction damage'}
        ],
        buildSummaryTeams:[
          {name:'Nilou Bloom',members:['Aino','Lauma','Nilou','Kirara']},
          {name:'Burgeon',members:['Aino','Nahida','Barbara','Thoma']}
        ]
      }
    },
    {
      id:'lunar-charged-damage',
      name:'Lunar-Charged Damage',
      note:'Use when Aino contributes meaningful Lunar-Charged reaction damage. After ER, balance EM with CRIT rather than building pure EM.',
      overrides:{
        role:'Off-field Lunar-Charged Enabler / Reaction DPS',roleGroup:'Support',focus:'Elemental Burst',reactionDriven:true,
        mainStats:{sands:['Energy Recharge','Elemental Mastery'],goblet:['Elemental Mastery','Hydro DMG%'],circlet:['CRIT Rate','CRIT DMG','Elemental Mastery']},
        substats:['Energy Recharge','CRIT Rate','CRIT DMG','Elemental Mastery','ATK%'],
        weaponPriority:['Flame-Forged Insight','Master Key','Favonius Greatsword','Makhaira Aquamarine','Forest Regalia','Sacrificial Greatsword'],
        artifactPriority:["Silken Moon's Serenade",'Aubade of Morningstar and Moon','Gilded Dreams'],
        goalStats:[
          {label:'Energy Recharge',value:'Meet Burst uptime first; weapon and team particles change the requirement substantially'},
          {label:'Elemental Mastery',value:'Build meaningful EM for reaction damage without sacrificing required ER'},
          {label:'CRIT',value:'Add CRIT once ER is solved because Lunar-Charged damage can reward a hybrid EM/CRIT setup'}
        ],
        buildSummaryTeams:[
          {name:'Flins Lunar-Charged',members:['Aino','Flins','Ineffa','Sucrose']},
          {name:'Ineffa Quickswap',members:['Aino','Ineffa','Fischl','Shikanoin Heizou']}
        ]
      }
    }
  ],
  goalStats:[
    {label:'Energy Recharge',value:'190–250%+ baseline · 155–205% Favonius · 100–140% Flame-Forged Insight; C4 lowers requirements further'},
    {label:'Reaction ownership',value:'Full EM for Bloom ownership; EM + CRIT for meaningful Lunar-Charged damage; support uptime first otherwise'},
    {label:'Favonius CRIT Rate',value:'Prioritize enough CRIT Rate to trigger Favonius before optional personal-damage stats'}
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
    'Meet ER requirements before chasing EM or personal damage.',
    'If Favonius Greatsword is equipped, secure enough CRIT Rate to trigger its passive consistently.',
    'Use the Bloom Trigger build only when Aino actually owns Bloom damage; use the Lunar-Charged build when her reaction damage is a meaningful team contribution.'
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
