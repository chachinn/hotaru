export default {
  id:'clorinde-electro-main-dps',
  character:'Clorinde',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-23',
  role:'On-field Electro Main DPS',
  roleGroup:'Main DPS',
  tierRatings:[
    {label:'Main DPS',rating:'A'},
    {label:'Sub-DPS',rating:'—'},
    {label:'Support',rating:'—'},
    {label:'Exploration',rating:'S'}
  ],
  voiceActors:[
    {label:'EN',name:'Crystal Lee'},
    {label:'JP',name:'Ishikawa Yui (石川由依)'},
    {label:'CN',name:'Zhao Hanyu (赵涵雨)'},
    {label:'KR',name:'Shin Na-ri (신나리)'}
  ],
  roleReason:'Clorinde is an on-field Electro Sword carry whose Skill converts her inputs into rapid ranged shots and lunges. She is flexible across raw Electro, Aggravate, Quickbloom, Quickburn, Overload, Electro-Charged and Lunar-Charged teams, with meaningful artifact/stat changes in reaction-heavy or Thundering Fury rotations.',
  scaling:'ATK',
  scalingDetail:'ATK and CRIT are her universal offensive core. EM becomes meaningfully valuable in Aggravate, Quickbloom and Quickburn, while it is a low-priority or dead stat in raw Electro and most Overload setups. Her Burst frequency changes ER needs substantially.',
  focus:'Elemental Skill',
  reactionDriven:false,
  energyCost:60,
  defaultVariant:'standard-electro',
  contextOptions:[
    {key:'burstCycle',label:'Burst frequency',default:'everyOther',options:[
      {value:'every',label:'Every Skill combo'},
      {value:'everyOther',label:'Every other Skill combo'}
    ]}
  ],
  targets:{
    cr:{min:70,good:75,great:80,unit:'%'},
    cd:{min:160,good:180,great:200,unit:'%'},
    er:{min:110,good:120,great:130,unit:'%'},
    em:{min:0,good:0,great:0,unit:''},
    atk:{min:1800,good:2000,great:2200,unit:''}
  },
  targetOverrides:{
    er:{
      cases:[
        {when:{burstCycle:'every'},bySameElement:{
          '0':{min:200,good:210,great:225,unit:'%'},
          '1':{min:120,good:130,great:140,unit:'%'},
          '2':{min:120,good:130,great:140,unit:'%'},
          '3':{min:120,good:130,great:140,unit:'%'}
        }},
        {when:{burstCycle:'everyOther'},bySameElement:{
          '0':{min:110,good:120,great:130,unit:'%'},
          '1':{min:100,good:100,great:110,unit:'%'},
          '2':{min:100,good:100,great:110,unit:'%'},
          '3':{min:100,good:100,great:110,unit:'%'}
        }}
      ],
      favoniusReductionPerProc:10,
      favoniusReductionMax:40,
      floor:100
    }
  },
  mainStats:{sands:['ATK%'],goblet:['Electro DMG%'],circlet:['CRIT Rate','CRIT DMG']},
  substats:['Energy Recharge','CRIT Rate','CRIT DMG','ATK%','Elemental Mastery'],
  talentPriority:['skill','burst','attack'],
  weaponPriority:['Absolution','Haran Geppaku Futsu','Uraku Misugiri','Mistsplitter Reforged','Primordial Jade Cutter','The Black Sword','Finale of the Deep','Calamity of Eshu','Harbinger of Dawn'],
  f2pWeapon:'Finale of the Deep',
  artifactPriority:['Fragment of Harmonic Whimsy','Thundering Fury','Echoes of an Offering',"Gladiator's Finale"],
  buildSummaryTeams:[
    {name:'Aggravate',members:['Clorinde','Fischl','Nahida','Kaedehara Kazuha']},
    {name:'Lunar-Charged',members:['Clorinde','Ineffa','Columbina','Xingqiu']}
  ],
  variants:[
    {
      id:'standard-electro',name:'Standard Electro / Hypercarry',
      note:'General-purpose build for raw Electro, Hypercarry, Overload, Electro-Charged and Lunar-Charged teams when Clorinde is not relying on EM-heavy reaction ownership.',
      overrides:{
        reactionDriven:false,
        mainStats:{sands:['ATK%'],goblet:['Electro DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','CRIT Rate','CRIT DMG','ATK%'],
        artifactPriority:['Fragment of Harmonic Whimsy','Echoes of an Offering',"Gladiator's Finale"],
        weaponPriority:['Absolution','Haran Geppaku Futsu','Uraku Misugiri','Mistsplitter Reforged','Primordial Jade Cutter','The Black Sword','Finale of the Deep','Calamity of Eshu','Harbinger of Dawn'],
        goalStats:[
          {label:'ATK',value:'1,800–2,000+'},
          {label:'CRIT Rate',value:'70–80% before combat buffs; avoid overcapping with her ascension/passive bonuses'},
          {label:'CRIT DMG',value:'160%+'},
          {label:'Energy Recharge',value:'110–130% for Burst every other Skill combo when solo Electro; double Electro can approach 100%'}
        ],
        buildSummaryTeams:[
          {name:'Hypercarry',members:['Clorinde','Fischl','Kujou Sara','Kaedehara Kazuha']},
          {name:'Lunar-Charged',members:['Clorinde','Ineffa','Columbina','Xingqiu']}
        ]
      }
    },
    {
      id:'aggravate',name:'Aggravate / Quicken',
      note:'Reaction-focused Quicken build. Keep CRIT and ATK strong; EM gains real value because Clorinde triggers frequent Aggravates, but ATK% remains a strong Sands option.',
      overrides:{
        reactionDriven:true,
        mainStats:{sands:['ATK%','Elemental Mastery'],goblet:['Electro DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','CRIT Rate','CRIT DMG','ATK%','Elemental Mastery'],
        artifactPriority:['Fragment of Harmonic Whimsy','Thundering Fury','Echoes of an Offering',"Gladiator's Finale"],
        weaponPriority:['Absolution','Haran Geppaku Futsu','Uraku Misugiri','Mistsplitter Reforged','Primordial Jade Cutter','The Black Sword','Finale of the Deep','Harbinger of Dawn'],
        goalStats:[
          {label:'CRIT',value:'Highest-value offensive stats after ER'},
          {label:'ATK / EM Sands',value:'Choose by substats and team buffs; ATK% is generally favored at C2+'},
          {label:'Elemental Mastery',value:'Useful because Clorinde triggers frequent Aggravates; do not sacrifice CRIT or required ER to force EM'},
          {label:'Energy Recharge',value:'Double Electro often lowers Burst requirements substantially'}
        ],
        buildSummaryTeams:[
          {name:'Aggravate',members:['Clorinde','Fischl','Nahida','Kaedehara Kazuha']},
          {name:'Aggravate Shielded',members:['Clorinde','Fischl','Kirara','Sucrose']}
        ]
      }
    },
    {
      id:'thundering-fury-quicken',name:'Thundering Fury Quicken',
      note:'Distinct Quicken rotation build using 4pc Thundering Fury to shorten Skill downtime and support roughly 25-second two-window rotations. Use only when reactions are frequent enough to trigger the set reliably.',
      overrides:{
        reactionDriven:true,
        mainStats:{sands:['ATK%','Elemental Mastery'],goblet:['Electro DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','CRIT Rate','CRIT DMG','ATK%','Elemental Mastery'],
        artifactPriority:['Thundering Fury','Fragment of Harmonic Whimsy','Echoes of an Offering',"Gladiator's Finale"],
        weaponPriority:['Absolution','Haran Geppaku Futsu','Uraku Misugiri','Mistsplitter Reforged','Primordial Jade Cutter','The Black Sword','Finale of the Deep','Harbinger of Dawn'],
        goalStats:[
          {label:'Rotation',value:'Use the shorter-cooldown Quicken rotation only when 4pc Thundering Fury can trigger consistently'},
          {label:'CRIT / ATK',value:'Remain core offensive stats'},
          {label:'Elemental Mastery',value:'Useful in Quicken; choose ATK% or EM Sands by actual substats/team buffs'},
          {label:'Energy Recharge',value:'Use team-specific ER; frequent Electro teammates and repeated Skill windows can reduce practical needs'}
        ],
        buildSummaryTeams:[
          {name:'TF Aggravate',members:['Clorinde','Fischl','Kirara','Sucrose']},
          {name:'TF Quickbloom',members:['Clorinde','Fischl','Nahida','Yelan']}
        ]
      }
    },
    {
      id:'quickbloom-quickburn',name:'Quickbloom / Quickburn Reaction DPS',
      note:'Use when Clorinde personally triggers meaningful Hyperbloom or frequent Overload alongside Quicken. EM can rival ATK% on Sands before C2, unlike standard Overload where EM is usually low value for Clorinde.',
      overrides:{
        reactionDriven:true,
        mainStats:{sands:['ATK%','Elemental Mastery'],goblet:['Electro DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','CRIT Rate','CRIT DMG','ATK%','Elemental Mastery'],
        artifactPriority:['Fragment of Harmonic Whimsy','Thundering Fury','Echoes of an Offering',"Gladiator's Finale"],
        weaponPriority:['Absolution','Haran Geppaku Futsu','Uraku Misugiri','Mistsplitter Reforged','Primordial Jade Cutter','The Black Sword','Finale of the Deep','Harbinger of Dawn'],
        goalStats:[
          {label:'ATK / EM Sands',value:'Both can be competitive before C2; ATK% becomes more favored at C2+'},
          {label:'CRIT',value:'Still Clorinde’s highest-value offensive stat family'},
          {label:'Elemental Mastery',value:'Moderate-to-high value when Clorinde owns Hyperbloom or frequent Quickburn Overloads'},
          {label:'Energy Recharge',value:'Meet the selected Burst frequency first'}
        ],
        buildSummaryTeams:[
          {name:'Quickbloom',members:['Clorinde','Fischl','Nahida','Furina']},
          {name:'Quickburn',members:['Clorinde','Fischl','Emilie','Mavuika']}
        ]
      }
    }
  ],
  goalStats:[
    {label:'ATK',value:'1,800–2,000+'},
    {label:'CRIT Rate',value:'70–80%'},
    {label:'CRIT DMG',value:'160%+'},
    {label:'Energy Recharge',value:'Solo Electro: 200%+ if Bursting every Skill combo or 110–130% every other combo · Double Electro: 120–140% every combo or ~100% every other'},
    {label:'Reaction context',value:'EM is useful in Aggravate, Quickbloom and Quickburn; it is low-value in raw Electro and standard Overload'}
  ],
  strengths:[
    'Flexible on-field DPS who fits a very wide range of reaction and raw-damage teams.',
    'Fast ranged shots, AoE lunges and high mobility let her reposition without fully sacrificing damage uptime.',
    'Frequent self-healing reduces the need for a dedicated healer in many teams.',
    'Normal-Attack-coded Skill hits drive off-field effects such as Fischl C6 efficiently.'
  ],
  weaknesses:[
    'Skill cooldown is long relative to field duration unless a Thundering Fury reaction setup is used.',
    'No innate interruption resistance at C0, so shields or careful movement can be important.',
    'Mobile/high-ping play can reduce her maximum input throughput.',
    'Her strongest teams often benefit heavily from high-constellation 4-star supports such as Fischl, Sara or Chevreuse.'
  ],
  playstyleTips:[
    'Enter Skill state, then use the N3E rhythm: three pistolet shots to build Bond of Life followed by the empowered lunge.',
    'A second Electro teammate is usually valuable for pre-field Electro application, A1 setup and Energy.',
    'Do not treat EM as universal: it is strong only in the variants where Clorinde actually owns meaningful reactions.',
    'Use Thundering Fury only when the team can trigger enough reactions to make its cooldown reduction meaningful.',
    'On mobile, prioritize consistent N3E execution over attempting frame-tight extra inputs.'
  ],
  sourceRefs:[
    {label:'Game8 Clorinde Best Builds and Teams',kind:'Primary build/tier/team reference',url:'https://game8.co/games/Genshin-Impact/archives/417218'},
    {label:'KQM Clorinde Quick Guide',kind:'Theorycraft build/team/ER cross-check',url:'https://keqingmains.com/q/clorinde-quickguide/'},
    {label:'HoYoLAB Clorinde Detailed Character Guide',kind:'Profile and voice-actor cross-check',url:'https://www.hoyolab.com/article/29626503'}
  ]
};
