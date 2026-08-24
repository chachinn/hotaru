export default {
  id:'beidou-offfield-burst-dps',
  character:'Beidou',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-24',
  role:'Off-field Electro Burst DPS',
  roleGroup:'Sub-DPS',
  roleReason:'Beidou converts a short Skill/Burst setup into high multi-target off-field damage, interruption resistance and damage reduction. Her main practical constraint is Energy Recharge, so team battery quality materially changes gearing.',
  scaling:'ATK / CRIT / Electro DMG / Energy Recharge',
  scalingDetail:'Her Burst is the overwhelming priority. Standard teams value ER to requirement, then CRIT and ATK; Aggravate adds meaningful Elemental Mastery value without replacing ER or CRIT.',
  focus:'Elemental Burst / Elemental Skill',
  reactionDriven:true,
  targets:{er:{min:140,good:180,great:220,unit:'%'},atk:{min:1600,good:1800,great:2000,unit:''},cr:{min:60,good:70,great:75,unit:'%'},cd:{min:120,good:150,great:180,unit:'%'}},
  mainStats:{sands:['Energy Recharge','ATK%'],goblet:['Electro DMG%'],circlet:['CRIT Rate','CRIT DMG']},
  substats:['Energy Recharge','CRIT Rate','CRIT DMG','ATK%','Elemental Mastery'],
  talentPriority:['burst','skill','attack'],
  weaponPriority:['Beacon of the Reed Sea','Serpent Spine','Wolf’s Gravestone','Akuoumaru','Ultimate Overlord’s Mega Magic Sword','Prototype Archaic'],
  f2pWeapon:'Ultimate Overlord’s Mega Magic Sword',
  artifactPriority:['Emblem of Severed Fate'],
  defaultVariant:'offfield-burst-dps',
  variants:[
    {
      id:'offfield-burst-dps',name:'Off-field Burst DPS',
      note:'Default Beidou build for Electro-Charged, Overloaded, Stellar-Conduct and general multi-target teams. Solve the exact ER requirement first, then invest into CRIT and ATK.',
      overrides:{
        role:'Off-field Electro Burst DPS',roleGroup:'Sub-DPS',focus:'Elemental Burst / Elemental Skill',
        mainStats:{sands:['Energy Recharge','ATK%'],goblet:['Electro DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','CRIT Rate','CRIT DMG','ATK%'],
        weaponPriority:['Beacon of the Reed Sea','Serpent Spine','Wolf’s Gravestone','Akuoumaru','Ultimate Overlord’s Mega Magic Sword','Prototype Archaic'],
        artifactPriority:['Emblem of Severed Fate'],
        goalStats:[
          {label:'Energy Recharge',value:'ER varies sharply with battery quality: solo Electro can need roughly 185–250%+, while strong Electro batteries/Favonius can lower the requirement substantially.'},
          {label:'CRIT',value:'About 60–75% CRIT Rate and 120–180% CRIT DMG are practical goals after ER.'},
          {label:'ATK',value:'About 1,600–2,000 ATK is a useful target after the Burst rotation is stable.'}
        ],
        buildSummaryTeams:[
          {name:'Electro-Charged Driver',members:['Beidou','Fischl','Xingqiu','Sucrose']},
          {name:'Overloaded',members:['Beidou','Fischl','Chevreuse','Arlecchino']},
          {name:'Stellar-Conduct',members:['Beidou','Sandrone','Qiqi','Odette']}
        ]
      }
    },
    {
      id:'aggravate-sub-dps',name:'Aggravate Sub-DPS',
      note:'Use when Beidou consistently benefits from Quicken/Aggravate. EM gains real value, but do not sacrifice required ER or strong CRIT/ATK pieces just to force EM.',
      overrides:{
        role:'Off-field Aggravate DPS',roleGroup:'Sub-DPS',focus:'Elemental Burst / Elemental Skill',reactionDriven:true,
        mainStats:{sands:['ATK%','Elemental Mastery','Energy Recharge'],goblet:['Electro DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','CRIT Rate','CRIT DMG','Elemental Mastery','ATK%'],
        weaponPriority:['Serpent Spine','Beacon of the Reed Sea','Wolf’s Gravestone','Akuoumaru','Ultimate Overlord’s Mega Magic Sword','Mailed Flower'],
        artifactPriority:['Emblem of Severed Fate','Thundering Fury + ATK%','Thundering Fury + Elemental Mastery'],
        goalStats:[
          {label:'Energy Recharge',value:'Meet Burst uptime first; a second Electro unit remains highly valuable even in Quicken teams.'},
          {label:'Elemental Mastery',value:'EM becomes valuable because Beidou owns Aggravate procs, but ATK Sands can still win with stronger substats/buffs.'},
          {label:'CRIT',value:'Keep a normal CRIT-focused damage profile; Aggravate does not turn Beidou into a full-EM trigger.'}
        ],
        buildSummaryTeams:[
          {name:'Keqing Aggravate',members:['Beidou','Keqing','Nahida','Kaedehara Kazuha']},
          {name:'Clorinde Aggravate',members:['Beidou','Clorinde','Nahida','Fischl']},
          {name:'Cyno Aggravate',members:['Beidou','Cyno','Nahida','Baizhu']}
        ]
      }
    }
  ],
  strengths:['Exceptional Burst damage in two-target and multi-target combat.','Adds damage reduction and interruption resistance while off-field.','Flexible across Electro-Charged, Aggravate, Overloaded and newer Stellar-Conduct shells.','Perfect-counter Skill can generate useful particles and frontloaded damage.'],
  weaknesses:['Burst energy cost makes team battery quality a major constraint.','Single-target damage is much lower because Stormbreaker cannot chain effectively.','Requires an on-field driver whose attacks can trigger Stormbreaker consistently.','A perfect counter is strong but should not be forced if it delays the rotation.'],
  playstyleTips:['Use Skill for particles, Burst, then swap to the driver who will trigger Stormbreaker repeatedly.','Build only as much ER as the actual team/rotation requires, then invest into damage.','Do not treat Fischl or Beidou as reliable Hyperbloom triggers; use a dedicated core trigger if playing Hyperbloom.','Prefer multi-target chambers where Stormbreaker chains can realize Beidou’s damage ceiling.'],
  sourceRefs:[
    {label:'Beidou Quick Guide',kind:'Current theorycraft',url:'https://keqingmains.com/q/beidou-quickguide/'},
    {label:'Beidou current build guide',kind:'Current build cross-check',url:'https://www.icy-veins.com/genshin-impact/beidou-guide-best-builds'},
    {label:'Beidou current team guide',kind:'Current team cross-check',url:'https://www.icy-veins.com/genshin-impact/beidou-team-guide'}
  ]
};