export default {
  id:'candace-offfield-support',
  character:'Candace',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-24',
  role:'Hydro Infusion / Normal Attack Support',
  roleGroup:'Support',
  roleReason:'Candace is primarily an off-field Hydro support who provides melee Hydro Infusion and a Normal Attack DMG Bonus. At C6 she gains useful off-field Hydro application; in Bloom she can instead own reaction damage, and in teams without a dedicated carry she can drive on-field.',
  scaling:'HP / Energy Recharge / optional EM or CRIT',
  scalingDetail:'Her A4 Normal Attack buff scales with Max HP, while support uptime depends on ER. Bloom ownership shifts her toward full EM, and C6/personal-damage investment can justify Hydro DMG and CRIT.',
  focus:'Elemental Burst / Elemental Skill',
  reactionDriven:true,
  targets:{er:{min:170,good:210,great:250,unit:'%'},hp:{min:30000,good:35000,great:40000,unit:''},cr:{min:35,good:50,great:65,unit:'%'},em:{min:500,good:700,great:850,unit:''}},
  mainStats:{sands:['HP%','Energy Recharge'],goblet:['HP%','Hydro DMG%'],circlet:['HP%','CRIT Rate','CRIT DMG']},
  substats:['Energy Recharge','CRIT Rate (Favonius)','HP%','CRIT Rate','CRIT DMG'],
  talentPriority:['burst','skill','attack'],
  weaponPriority:['Favonius Lance','Engulfing Lightning','The Catch','Rightful Reward','Prototype Starglitter','Black Tassel'],
  f2pWeapon:'Rightful Reward',
  artifactPriority:['Scroll of the Hero of Cinder City','Noblesse Oblige','Silken Moon’s Serenade','Emblem of Severed Fate','Instructor'],
  defaultVariant:'offfield-support',
  variants:[
    {
      id:'offfield-support',name:'Off-field NA / Hydro Support',
      note:'Default Candace. Meet Burst uptime first, then stack HP for her Normal Attack buff. At C6, Hydro DMG/CRIT gains value if personal damage is worth investing in.',
      overrides:{
        role:'Hydro Infusion / Normal Attack Support',roleGroup:'Support',focus:'Elemental Burst / Elemental Skill',
        mainStats:{sands:['HP%','Energy Recharge'],goblet:['HP%','Hydro DMG%'],circlet:['HP%','CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','CRIT Rate (Favonius)','HP%','CRIT Rate','CRIT DMG'],
        weaponPriority:['Favonius Lance','Engulfing Lightning','The Catch','Rightful Reward','Prototype Starglitter','Black Tassel'],
        artifactPriority:['Scroll of the Hero of Cinder City','Noblesse Oblige','Silken Moon’s Serenade','Emblem of Severed Fate','Instructor'],
        goalStats:[
          {label:'Energy Recharge',value:'Candace can have high solo-Hydro ER needs; Favonius, a second Hydro unit, Natlan Scroll particles and extra Skill uses substantially lower the requirement.'},
          {label:'Max HP',value:'After ER, stack HP to strengthen her A4 Normal Attack DMG Bonus; level 90 improves this HP-based buff.'},
          {label:'C6 investment',value:'At C6, Hydro DMG and CRIT become more attractive because Candace gains meaningful off-field Hydro damage/application.'}
        ],
        buildSummaryTeams:[
          {name:'Skirk Support',members:['Candace','Skirk','Furina','Escoffier']},
          {name:'Clorinde Quickbloom C6',members:['Candace','Clorinde','Nahida','Fischl']},
          {name:'Arlecchino Hydro Infusion Support',members:['Candace','Arlecchino','Yelan','Bennett']}
        ]
      }
    },
    {
      id:'bloom-dps',name:'Bloom Ownership / Full EM',
      note:'Use only when Candace actually owns a meaningful share of Bloom damage through her infusion, swaps or C6. Do not use this full-EM identity in Hyperbloom or Burgeon teams, where another unit should own the transformative reaction.',
      overrides:{
        role:'Hydro Bloom Trigger / Enabler',roleGroup:'Support',focus:'Elemental Burst / Elemental Skill',reactionDriven:true,
        mainStats:{sands:['Elemental Mastery','Energy Recharge'],goblet:['Elemental Mastery'],circlet:['Elemental Mastery']},
        substats:['Energy Recharge','Elemental Mastery','CRIT Rate (Favonius)','HP%'],
        weaponPriority:['Dragon’s Bane','Kitain Cross Spear','Ballad of the Fjords','Favonius Lance','Moonpiercer'],
        artifactPriority:['Flower of Paradise Lost','Gilded Dreams','Instructor'],
        goalStats:[
          {label:'Energy Recharge',value:'Meet Burst uptime first; Hydro Infusion and swap waves are required for Candace to own Bloom consistently.'},
          {label:'Elemental Mastery',value:'Stack EM aggressively only when Candace is confirmed to own Bloom reactions.'},
          {label:'Team restriction',value:'Do not carry this full-EM build into Hyperbloom or Burgeon; the Electro/Pyro trigger owns those reactions instead.'}
        ],
        buildSummaryTeams:[
          {name:'Nilou Bloom Driver',members:['Candace','Nilou','Nahida','Yaoyao']},
          {name:'Nilou Bloom Kirara',members:['Candace','Nilou','Nahida','Kirara']},
          {name:'Accessible Bloom',members:['Candace','Nilou','Collei','Yaoyao']}
        ]
      }
    },
    {
      id:'onfield-driver',name:'On-field Hydro Driver',
      note:'Use when the team has no stronger dedicated on-fielder and Candace herself drives coordinated attacks with Hydro-infused Normal Attacks. Favonius can proc multiple times during field time and ER needs can drop.',
      overrides:{
        role:'On-field Hydro Driver / Support',roleGroup:'Support',focus:'Normal Attack / Elemental Burst / Elemental Skill',
        mainStats:{sands:['HP%','Energy Recharge'],goblet:['Hydro DMG%','HP%'],circlet:['CRIT Rate','CRIT DMG','HP%']},
        substats:['Energy Recharge','CRIT Rate','CRIT DMG','HP%','Elemental Mastery'],
        weaponPriority:['Favonius Lance','Staff of Homa','The Catch','Deathmatch','Rightful Reward'],
        artifactPriority:['Emblem of Severed Fate','Scroll of the Hero of Cinder City','Noblesse Oblige','Instructor'],
        goalStats:[
          {label:'Driver uptime',value:'Use Candace’s infused Normal Attacks to trigger Xingqiu, Beidou, Yelan and similar coordinated attacks.'},
          {label:'Energy Recharge',value:'On-field Skill usage and extra Favonius procs can lower Candace’s own ER need compared with off-field support.'},
          {label:'Personal damage',value:'Hydro DMG/CRIT is only worth prioritizing after the team’s support and ER requirements are solved.'}
        ],
        buildSummaryTeams:[
          {name:'Hyperbloom Driver',members:['Candace','Nahida','Kuki Shinobu','Beidou']},
          {name:'Electro-Charged Driver',members:['Candace','Beidou','Fischl','Sucrose']},
          {name:'Freeze Driver',members:['Candace','Escoffier','Rosaria','Kaedehara Kazuha']}
        ]
      }
    }
  ],
  strengths:['Unique melee Hydro Infusion and Normal Attack DMG Bonus.','Very inexpensive support build with Favonius/HP options.','C6 adds useful off-field Hydro application.','Can drive reaction teams herself when a dedicated on-fielder is unnecessary.'],
  weaknesses:['Solo-Hydro ER requirements can be high.','Personal damage is modest without heavy investment.','Hydro Infusion has limited demand and can interfere with characters whose own infusions can be overridden.','Off-field Hydro application is limited before C6.'],
  playstyleTips:['Burst before the Normal Attack carry’s field time and keep rotations within the infusion/buff duration.','Meet ER first, then stack HP on support Candace.','Use full EM only for actual Bloom ownership, never by default in Hyperbloom/Burgeon.','At C6, account for her extra off-field Hydro when judging reaction ownership and aura stability.'],
  sourceRefs:[
    {label:'Candace Quick Guide',kind:'Current theorycraft',url:'https://keqingmains.com/q/candace-quickguide/'},
    {label:'Candace Extended Guide',kind:'Mechanics cross-check',url:'https://keqingmains.com/candace/'},
    {label:'Candace current team guide',kind:'Current team cross-check',url:'https://www.icy-veins.com/genshin-impact/candace-team-guide'}
  ]
};