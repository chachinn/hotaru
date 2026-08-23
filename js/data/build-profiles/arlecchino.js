export default {
  id:'arlecchino-main-dps',
  character:'Arlecchino',
  aliases:['The Knave'],
  reviewed:true,
  reviewedAt:'2026-08-23',
  role:'On-field Pyro Main DPS',
  roleGroup:'Main DPS',
  roleRatings:[
    {label:'Main DPS',rating:'Primary'},
    {label:'Sub-DPS',rating:'—'},
    {label:'Support',rating:'—'},
    {label:'Exploration',rating:'Strong'}
  ],
  tierRatings:[
    {label:'Main DPS',rating:'S'},
    {label:'Sub-DPS',rating:'—'},
    {label:'Support',rating:'—'},
    {label:'Exploration',rating:'S'}
  ],
  tierSource:'Game8 Arlecchino Best Builds and Teams — March 31, 2026',
  voiceActors:[
    {label:'EN',name:'Erin Yvette'},
    {label:'JP',name:'Mori Nanako (森なな子)'},
    {label:'CN',name:'Huang Ying (黄莺)'},
    {label:'KR',name:'Lee Myung-hee (이명희)'}
  ],
  roleReason:'Arlecchino is an on-field Pyro carry whose Bond of Life empowers and converts her Normal Attacks. She does not rely on Burst for damage and can preserve her Bond of Life and Pyro conversion through swaps.',
  scaling:'ATK',
  scalingDetail:'ATK-scaling Normal Attack carry. CRIT and ATK are the default offensive priorities; Elemental Mastery gains value specifically in Vaporize and Melt teams.',
  focus:'Normal Attack',
  energyCost:60,
  reactionDriven:false,
  defaultErTarget:100,
  defaultVariant:'pyro-main-dps',
  targets:{
    cr:{min:60,good:70,great:80,unit:'%'},
    cd:{min:120,good:160,great:190,unit:'%'},
    er:{min:100,good:100,great:110,unit:'%'},
    em:{min:0,good:0,great:0,unit:''},
    atk:{min:1800,good:2000,great:2300,unit:''}
  },
  contextOptions:[
    {key:'burstPolicy',label:'Burst usage',default:'emergency',options:[
      {value:'emergency',label:'Emergency / not every rotation'},
      {value:'every',label:'Every rotation'}
    ]}
  ],
  targetOverrides:{
    er:{
      cases:[
        {when:{burstPolicy:'every'},bySameElement:{
          '0':{min:150,good:150,great:165,unit:'%'},
          '1':{min:140,good:145,great:150,unit:'%'},
          '2':{min:120,good:120,great:130,unit:'%'},
          '3':{min:120,good:120,great:130,unit:'%'}
        }}
      ],
      favoniusReductionPerProc:8,
      favoniusReductionMax:20,
      floor:100
    }
  },
  mainStats:{
    sands:['ATK%'],
    goblet:['Pyro DMG%'],
    circlet:['CRIT Rate','CRIT DMG']
  },
  substats:['CRIT Rate','CRIT DMG','Energy Recharge','ATK%'],
  talentPriority:['attack','skill','burst'],
  weaponPriority:[
    "Crimson Moon's Semblance",
    'Staff of Homa',
    'Primordial Jade Winged-Spear',
    'Deathmatch',
    'Blackcliff Pole',
    'Staff of the Scarlet Sands',
    'Fractured Halo',
    'Ballad of the Fjords',
    'White Tassel'
  ],
  f2pWeapon:'White Tassel',
  artifactPriority:[
    'Fragment of Harmonic Whimsy',
    'Echoes of an Offering',
    "Gladiator's Finale",
    'Crimson Witch of Flames',
    'Gilded Dreams',
    "Night of the Sky's Unveiling",
    'Unfinished Reverie'
  ],
  buildSummaryTeams:[
    {name:'Vaporize',members:['Arlecchino','Yelan','Bennett','Xilonen']},
    {name:'Melt',members:['Arlecchino','Citlali','Bennett','Xilonen']}
  ],
  variants:[
    {
      id:'pyro-main-dps',
      name:'Pyro Main DPS',
      note:'Game8 default build. Use this as the general-purpose Arlecchino setup: ATK Sands, Pyro Goblet, CRIT Circlet, and Fragment of Harmonic Whimsy.',
      overrides:{
        reactionDriven:false,
        mainStats:{sands:['ATK%'],goblet:['Pyro DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['CRIT Rate','CRIT DMG','Energy Recharge','ATK%'],
        weaponPriority:["Crimson Moon's Semblance",'Staff of Homa','Primordial Jade Winged-Spear','Deathmatch','Blackcliff Pole','Staff of the Scarlet Sands','White Tassel'],
        artifactPriority:['Fragment of Harmonic Whimsy','Echoes of an Offering',"Gladiator's Finale",'Crimson Witch of Flames'],
        goalStats:[
          {label:'ATK',value:'2,000+'},
          {label:'CRIT Rate',value:'70–80%'},
          {label:'CRIT DMG',value:'160%+'},
          {label:'Energy Recharge',value:'No dedicated ER needed when Burst is reserved for emergency healing'}
        ],
        buildSummaryTeams:[
          {name:'Vaporize',members:['Arlecchino','Yelan','Bennett','Xilonen']},
          {name:'Pure Pyro',members:['Arlecchino','Bennett','Xilonen','Kaedehara Kazuha']}
        ]
      }
    },
    {
      id:'amplifying-pyro',
      name:'Vaporize / Melt DPS',
      note:'KQM amplifying-reaction build. ATK% and EM Sands are both viable when Arlecchino consistently triggers Vaporize or Melt; meet CRIT first, then balance ATK and EM.',
      overrides:{
        reactionDriven:true,
        mainStats:{sands:['ATK%','Elemental Mastery'],goblet:['Pyro DMG%','ATK%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['CRIT Rate','CRIT DMG','ATK%','Elemental Mastery'],
        weaponPriority:["Crimson Moon's Semblance",'Primordial Jade Winged-Spear','Staff of the Scarlet Sands','Staff of Homa','Ballad of the Fjords','Deathmatch','White Tassel'],
        artifactPriority:['Fragment of Harmonic Whimsy','Crimson Witch of Flames','Gilded Dreams',"Gladiator's Finale"],
        goalStats:[
          {label:'CRIT',value:'Prioritize CRIT consistency first'},
          {label:'ATK / EM',value:'KQM: CRIT > ATK% ≥ EM in Vaporize; use EM only when reactions are reliable'},
          {label:'Energy Recharge',value:'Generally 0 additional ER when Burst is emergency-only'}
        ],
        buildSummaryTeams:[
          {name:'Vaporize',members:['Arlecchino','Yelan','Bennett','Kaedehara Kazuha']},
          {name:'Melt',members:['Arlecchino','Citlali','Bennett','Sucrose']}
        ]
      }
    },
    {
      id:'ascendant-gleam',
      name:'Ascendant Gleam / Lunar-Charged',
      note:'Conditional KQM build for teams with off-field Lunar-Charged damage dealers such as Ineffa and Columbina. Night of the Sky’s Unveiling becomes competitive with Fragment and can be preferred for its teamwide Lunar-Charged buff.',
      overrides:{
        reactionDriven:true,
        mainStats:{sands:['ATK%'],goblet:['Pyro DMG%','ATK%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['CRIT Rate','CRIT DMG','ATK%','Energy Recharge'],
        weaponPriority:["Crimson Moon's Semblance",'Primordial Jade Winged-Spear','Staff of Homa','Fractured Halo','Deathmatch','White Tassel'],
        artifactPriority:["Night of the Sky's Unveiling",'Fragment of Harmonic Whimsy',"Gladiator's Finale"],
        goalStats:[
          {label:'ATK',value:'2,000+ remains a useful practical target'},
          {label:'CRIT Rate',value:'70–80% practical target'},
          {label:'CRIT DMG',value:'160%+ practical target'},
          {label:'Condition',value:'Use only in an Ascendant Gleam team with a legitimate Lunar-Charged core'}
        ],
        buildSummaryTeams:[
          {name:'Lunar-Charged flex',members:['Arlecchino','Columbina','Ineffa','Xilonen']},
          {name:'Lunar-Charged flex',members:['Arlecchino','Columbina','Ineffa','Nicole']}
        ]
      }
    }
  ],
  goalStats:[
    {label:'ATK',value:'2,000+'},
    {label:'CRIT Rate',value:'70–80%'},
    {label:'CRIT DMG',value:'160%+'},
    {label:'Energy Recharge',value:'Usually no ER investment when Burst is reserved for emergency healing; if Bursting every rotation, KQM estimates 150%+ solo Pyro, 140–150% double Pyro, and ~120% triple Pyro'}
  ],
  strengths:[
    'Excellent on-field Pyro damage with Normal Attacks as the overwhelming majority of her output.',
    'Bond of Life and Pyro conversion persist through swaps, giving her more rotation flexibility than many field carries.',
    'Not dependent on Elemental Burst for damage and can devote nearly all artifact investment to offense.',
    'Supports several strong archetypes including Vaporize, Melt, Overloaded, Pure Pyro, Double Geo, and modern Lunar-Charged flex teams.'
  ],
  weaknesses:[
    'Cannot receive normal in-combat healing from teammates; her Burst is her only combat healing source.',
    'Amplifying-reaction teams require careful aura and combo management so the intended Normal Attacks trigger Vaporize or Melt.',
    'Using Burst every rotation usually lowers damage and creates much higher ER requirements.',
    'Most generic Dendro pairings are poor fits; Burning/Burgeon can add dangerous self-damage and EM opportunity cost, with specialized exceptions such as Emilie.'
  ],
  playstyleTips:[
    'Open with Skill, rotate through teammates while Blood-Debt Directives upgrade, then return and use a Charged Attack to claim Bond of Life before starting Normal Attacks.',
    'Normal Attack is the critical Talent. Game8 displays Normal Attack → Skill → Burst, while KQM stresses that Normal Attack is vastly more important and rates Burst above Skill only after Normal Attack and character level.',
    'Treat Burst primarily as emergency self-healing; when Burst is needed, use it at the start of a rotation rather than interrupting the middle of the Normal Attack combo.',
    'Use EM Sands only in reliable Vaporize/Melt setups; Pure Pyro, Overloaded, Geo, and Lunar-Charged flex builds generally favor ATK%.',
    'Fragment of Harmonic Whimsy is the general best set. Night of the Sky’s Unveiling is a conditional alternative specifically for Ascendant Gleam teams.'
  ],
  sourceRefs:[
    {label:'Game8 Arlecchino Best Builds and Teams',kind:'Primary build/tier/team reference',url:'https://game8.co/games/Genshin-Impact/archives/382103'},
    {label:'KQM Arlecchino Quick Guide — Luna VIII',kind:'Current theorycraft build/team/ER cross-check',url:'https://keqingmains.com/q/arlecchino-quickguide/'},
    {label:'KQM Changelog — Arlecchino updated July 23, 2026',kind:'Current-version freshness verification',url:'https://keqingmains.com/changelog/'},
    {label:'Sevy Arlecchino Guide',kind:'YouTube guide cross-check',url:'https://www.youtube.com/watch?v=D8xP2FXY3CQ'},
    {label:'HoYoLAB Arlecchino Character Guide',kind:'Profile and voice-actor cross-check',url:'https://www.hoyolab.com/article/36369488'},
    {label:'ArlecchinoMains current team discussions',kind:'Community meta cross-check',url:'https://www.reddit.com/r/ArlecchinoMains/'}
  ]
};
