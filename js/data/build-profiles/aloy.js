export default {
  id:'aloy-cryo-quickswap',
  character:'Aloy',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-23',
  role:'Cryo Quickswap DPS / Battery-Support',
  roleGroup:'Sub-DPS',
  tierRatings:[
    {label:'Main DPS',rating:'D'},
    {label:'Sub-DPS',rating:'—'},
    {label:'Support',rating:'—'},
    {label:'Exploration',rating:'A'}
  ],
  voiceActors:[
    {label:'EN',name:'Giselle Fernandez'},
    {label:'JP',name:'Takagaki Ayahi (高垣彩陽)'},
    {label:'CN',name:'Mufei (沐霏)'},
    {label:'KR',name:'Jo Hyeon-jung (조현정)'}
  ],
  roleReason:'Aloy is best used as a low-field-time Cryo quickswap unit. Reverse Melt maximizes her personal Burst/Skill damage, while Freeze and Mono Cryo teams use her as a Cryo battery, Noblesse buffer, and secondary quickswap damage dealer. Her Rushing Ice Normal Attack infusion is inconsistent enough that it should not define the default build.',
  scaling:'ATK',
  scalingDetail:'Her Skill and Burst scale with ATK and benefit from Cryo DMG and CRIT. Reverse Melt adds meaningful Elemental Mastery value. Freeze can lean harder into CRIT DMG because Cryo Resonance and Blizzard Strayer supply CRIT Rate.',
  focus:'Elemental Burst',
  reactionDriven:true,
  energyCost:40,
  defaultVariant:'reverse-melt-burst',
  mainStats:{sands:['Elemental Mastery','Energy Recharge','ATK%'],goblet:['Cryo DMG%'],circlet:['CRIT Rate','CRIT DMG']},
  substats:['Energy Recharge','CRIT Rate','CRIT DMG','Elemental Mastery','ATK%'],
  talentPriority:['burst','skill','attack'],
  weaponPriority:['Polar Star','Aqua Simulacra','Thundering Pulse','The First Great Magic','Skyward Harp','Sacrificial Bow','Elegy for the End','The Stringless','Prototype Crescent','Song of Stillness'],
  f2pWeapon:'Prototype Crescent',
  artifactPriority:['Emblem of Severed Fate','Gilded Dreams','Lavawalker','Blizzard Strayer','Noblesse Oblige','Marechaussee Hunter'],
  targets:{
    cr:{min:55,good:65,great:75,unit:'%'},
    cd:{min:120,good:150,great:180,unit:'%'},
    er:{min:100,good:125,great:165,unit:'%'},
    atk:{min:1600,good:1800,great:2000,unit:''}
  },
  variants:[
    {
      id:'reverse-melt-burst',name:'Reverse Melt Burst DPS',
      note:'Aloy’s highest personal-damage archetype. Pyro and Anemo teammates enable Reverse Melts on her Skill and Burst; EM becomes a real damage stat and Emblem/Gilded/Lavawalker are all legitimate set directions.',
      overrides:{
        reactionDriven:true,
        mainStats:{sands:['Elemental Mastery','Energy Recharge','ATK%'],goblet:['Cryo DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','CRIT Rate','CRIT DMG','Elemental Mastery','ATK%'],
        weaponPriority:['Polar Star','Sacrificial Bow','Aqua Simulacra','Hunter’s Path','Thundering Pulse','The First Great Magic','Skyward Harp','Elegy for the End','The Stringless','Prototype Crescent','Song of Stillness'],
        artifactPriority:['Emblem of Severed Fate','Gilded Dreams','Lavawalker','Blizzard Strayer + Wanderer’s Troupe','Blizzard Strayer + ATK% Set'],
        goalStats:[
          {label:'Energy Recharge',value:'Solo Cryo ~140–165% · double Cryo, Venti, one Favonius proc, or Sacrificial Bow ~100–125%'},
          {label:'Stat priority',value:'ER until requirement > CRIT > EM > ATK%'},
          {label:'Sands choice',value:'EM is often best with Bennett; ER can win when requirements exceed ~150%; ATK% remains viable with strong substats'},
          {label:'CRIT',value:'Balance toward roughly 1:2 CRIT Rate:CRIT DMG after team/weapon buffs'}
        ],
        buildSummaryTeams:[
          {name:'Reverse Melt · Kazuha',members:['Aloy','Bennett','Kaedehara Kazuha','Xiangling']},
          {name:'Reverse Melt · Shenhe',members:['Aloy','Bennett','Xiangling','Shenhe']}
        ]
      }
    },
    {
      id:'freeze-mono-support',name:'Freeze / Mono Cryo Battery-Support',
      note:'Support-oriented Cryo build. Aloy batteries a primary Cryo DPS, enables Cryo Resonance, and uses her low-cost Burst to maintain 4pc Noblesse Oblige when nobody else holds it.',
      overrides:{
        reactionDriven:false,
        mainStats:{sands:['ATK%','Energy Recharge'],goblet:['Cryo DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','CRIT DMG','CRIT Rate','ATK%'],
        weaponPriority:['Sacrificial Bow','Favonius Warbow','Elegy for the End','Polar Star','Skyward Harp','Aqua Simulacra','Prototype Crescent','Song of Stillness'],
        artifactPriority:['Noblesse Oblige','Blizzard Strayer','Marechaussee Hunter','Cryo DMG + Burst DMG','Cryo DMG + ATK%'],
        goalStats:[
          {label:'Energy Recharge',value:'Solo Cryo ~140–165% · double Cryo / Venti / Favonius / Sacrificial ~100–125%'},
          {label:'Support set',value:'Use 4pc Noblesse if no teammate already holds it; Aloy’s 40-cost Burst supports reliable uptime'},
          {label:'Battery focus',value:'R4+ Sacrificial Bow can double Skill particle generation; Favonius trades personal damage for team Energy'},
          {label:'Talent priority',value:'Burst > Skill > Normal Attack'}
        ],
        buildSummaryTeams:[
          {name:'Freeze · Ayaka',members:['Aloy','Kamisato Ayaka','Sangonomiya Kokomi','Kaedehara Kazuha']},
          {name:'Mono Cryo · Ganyu',members:['Aloy','Ganyu','Shenhe','Kaedehara Kazuha']}
        ]
      }
    },
    {
      id:'freeze-personal-damage',name:'Freeze Personal Damage',
      note:'Use when Aloy is not the Noblesse holder and you want more of her own Cryo damage. Blizzard Strayer is the main Freeze set; Marechaussee Hunter becomes strong with Furina.',
      overrides:{
        reactionDriven:false,
        mainStats:{sands:['ATK%'],goblet:['Cryo DMG%'],circlet:['CRIT DMG','CRIT Rate']},
        substats:['Energy Recharge','CRIT DMG','CRIT Rate','ATK%'],
        weaponPriority:['Polar Star','Skyward Harp','Aqua Simulacra','The First Great Magic','Thundering Pulse','Hunter’s Path','Prototype Crescent','Song of Stillness','Sacrificial Bow','Amos’ Bow','Alley Hunter','The Viridescent Hunt'],
        artifactPriority:['Blizzard Strayer','Marechaussee Hunter','Noblesse Oblige','Cryo DMG + Burst DMG','Cryo DMG + ATK%'],
        goalStats:[
          {label:'Energy Recharge',value:'Meet the same team-specific requirement first: ~140–165% solo Cryo or ~100–125% with common battery reductions'},
          {label:'Stat priority',value:'ER until requirement > CRIT DMG ≥ CRIT Rate > ATK%'},
          {label:'CRIT Rate context',value:'Account for +15% Cryo Resonance and up to +40% Blizzard Strayer CRIT Rate against Frozen targets; avoid overcapping'},
          {label:'Furina context',value:'4pc Marechaussee Hunter is a strong personal-damage alternative when Furina reliably changes team HP'}
        ],
        buildSummaryTeams:[
          {name:'Freeze · Ganyu',members:['Aloy','Furina','Ganyu','Escoffier']},
          {name:'Freeze · Ayaka',members:['Aloy','Furina','Kamisato Ayaka','Jean']}
        ]
      }
    }
  ],
  goalStats:[
    {label:'Energy Recharge',value:'~140–165% solo Cryo · ~100–125% with double Cryo, Venti, a Favonius proc, or Sacrificial Bow'},
    {label:'CRIT',value:'Build to the team context; Freeze receives substantial external CRIT Rate from Cryo Resonance/Blizzard Strayer'},
    {label:'Elemental Mastery',value:'High-value in Reverse Melt; not a priority in Freeze/Mono Cryo'},
    {label:'ATK',value:'Useful after required ER and reaction-specific stats'}
  ],
  strengths:[
    '40-cost Burst gives her frequent quickswap Cryo damage and easy Noblesse uptime.',
    'Skill immediately generates five Cryo particles, making her a useful Cryo battery.',
    'Reverse Melt can produce respectable personal Burst/Skill damage with low field time.',
    'Can enable Cryo Resonance while contributing more offense than some defensive Cryo batteries.'
  ],
  weaknesses:[
    'Rushing Ice / Cryo Normal Attack infusion is inconsistent because Coil stacks depend on Bomblet hits.',
    'Long Skill cooldown limits particle generation unless high-refinement Sacrificial Bow resets it.',
    'No obtainable Constellations, so her ceiling cannot be raised through copies.',
    'She is rarely the strongest available option for a team and depends heavily on teammates for overall DPS.'
  ],
  playstyleTips:[
    'Default quickswap sequence is Skill, swap to an Anemo grouper to manipulate Bomblets, then return for Burst.',
    'In Reverse Melt, maintain Pyro aura before Aloy’s large Cryo hits instead of forcing unreliable Normal Attack infusion.',
    'In Freeze/Mono Cryo, prioritize battery and team buff duties before chasing Aloy personal damage.',
    'Do not overcap CRIT Rate on Blizzard Strayer builds after Cryo Resonance and frozen-target bonuses.',
    'Use Sacrificial Bow mainly when its extra Skill cast materially improves Energy or Rushing Ice consistency.'
  ],
  sourceRefs:[
    {label:'Game8 Aloy Rating and Best Builds',kind:'Primary build/tier structure',url:'https://game8.co/games/Genshin-Impact/archives/337957'},
    {label:'Game8 Best Team Comps · Aloy',kind:'Primary team reference',url:'https://game8.co/games/Genshin-Impact/archives/301819'},
    {label:'KQM Aloy Quick Guide',kind:'Theorycraft build/ER/team cross-check',url:'https://keqingmains.com/q/aloy-quickguide/'},
    {label:'Icy Veins Aloy Guide / Team Guide',kind:'Current Version 7.0 team/build freshness cross-check',url:'https://www.icy-veins.com/genshin-impact/aloy-guide-best-builds'}
  ]
};