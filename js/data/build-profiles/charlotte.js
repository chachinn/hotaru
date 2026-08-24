export default {
  id:'charlotte-teamwide-healer',
  character:'Charlotte',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-24',
  role:'Teamwide Cryo Healer / Off-field Applicator',
  roleGroup:'Support',
  roleReason:'Charlotte’s Burst provides powerful partywide healing and short follow-up healing, making her especially valuable with Furina. Her Skill supplies off-field Cryo, while higher personal investment can trade healing stats for Cryo damage; she can also drive on-field with Catalyst Cryo attacks in niche teams.',
  scaling:'ATK / Energy Recharge / Healing Bonus / optional CRIT',
  scalingDetail:'Charlotte’s healing scales with ATK but is Burst-gated, so ER is usually the first requirement. Damage-oriented versions use Cryo DMG and CRIT after sufficient ER, while Favonius variants value CRIT Rate for reliable procs.',
  focus:'Elemental Burst / Elemental Skill',
  reactionDriven:true,
  targets:{er:{min:180,good:220,great:260,unit:'%'},atk:{min:1600,good:1900,great:2200,unit:''},cr:{min:30,good:45,great:60,unit:'%'}},
  mainStats:{sands:['Energy Recharge','ATK%'],goblet:['ATK%'],circlet:['Healing Bonus','CRIT Rate','ATK%']},
  substats:['Energy Recharge','ATK%','CRIT Rate (Favonius)','CRIT DMG'],
  talentPriority:['burst','skill','attack'],
  weaponPriority:['Prototype Amber','Favonius Codex','Oathsworn Eye','Wine and Song','Thrilling Tales of Dragon Slayers'],
  f2pWeapon:'Prototype Amber',
  artifactPriority:['Noblesse Oblige','Tenacity of the Millelith','Song of Days Past','2pc Energy Recharge + 2pc ATK%'],
  defaultVariant:'teamwide-healer',
  variants:[
    {
      id:'teamwide-healer',name:'Teamwide Healer / Furina Support',
      note:'Default Charlotte. Solve Burst uptime first, then build enough ATK/Healing Bonus for the team. Prototype Amber emphasizes healing/energy; Favonius helps team energy and wants practical CRIT Rate.',
      overrides:{
        role:'Teamwide Cryo Healer / Furina Support',roleGroup:'Support',focus:'Elemental Burst / Elemental Skill',
        mainStats:{sands:['Energy Recharge','ATK%'],goblet:['ATK%'],circlet:['Healing Bonus','CRIT Rate','ATK%']},
        substats:['Energy Recharge','ATK%','CRIT Rate (Favonius)','CRIT DMG'],
        weaponPriority:['Prototype Amber','Favonius Codex','Oathsworn Eye','Wine and Song','Thrilling Tales of Dragon Slayers'],
        artifactPriority:['Noblesse Oblige','Tenacity of the Millelith','Song of Days Past','2pc Energy Recharge + 2pc ATK%'],
        goalStats:[
          {label:'Energy Recharge',value:'Charlotte can have very high ER needs as the only Cryo unit; additional Cryo teammates, Favonius procs and longer rotations reduce the requirement substantially.'},
          {label:'Healing',value:'ATK and Healing Bonus improve healing, but do not sacrifice Burst uptime to chase larger heal numbers.'},
          {label:'Furina synergy',value:'Partywide Burst healing rapidly builds Fanfare and restores the team after Furina’s HP drain, making Charlotte a strong Furina healer.'}
        ],
        buildSummaryTeams:[
          {name:'Neuvillette Furina',members:['Charlotte','Neuvillette','Furina','Kaedehara Kazuha']},
          {name:'Ayaka Furina Freeze',members:['Charlotte','Kamisato Ayaka','Furina','Venti']},
          {name:'Skirk Freeze',members:['Charlotte','Skirk','Furina','Yelan']}
        ]
      }
    },
    {
      id:'offfield-cryo-dps',name:'Invested Off-field Cryo / Healer',
      note:'Use when the team already has enough healing and Charlotte’s Skill/Burst damage is worth investing into. Healing remains functional, but this is a damage tradeoff rather than a separate support mechanic.',
      overrides:{
        role:'Off-field Cryo DPS / Healer',roleGroup:'Sub-DPS',focus:'Elemental Burst / Elemental Skill',
        mainStats:{sands:['Energy Recharge','ATK%'],goblet:['Cryo DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','CRIT Rate','CRIT DMG','ATK%'],
        weaponPriority:['Skyward Atlas','Lost Prayer to the Sacred Winds','Favonius Codex','Oathsworn Eye','The Widsith'],
        artifactPriority:['Emblem of Severed Fate','Golden Troupe + Blizzard Strayer','Noblesse Oblige'],
        goalStats:[
          {label:'Energy Recharge',value:'Keep enough ER to Burst on schedule before converting healing main stats into damage.'},
          {label:'CRIT profile',value:'Use a normal ATK/Cryo/CRIT damage profile only when Charlotte’s healing remains sufficient for the team.'},
          {label:'Opportunity cost',value:'Charlotte’s personal damage is modest; do not sacrifice team buffs or necessary healing for small damage gains.'}
        ],
        buildSummaryTeams:[
          {name:'Mono Cryo',members:['Charlotte','Kamisato Ayaka','Shenhe','Kaedehara Kazuha']},
          {name:'Wriothesley Freeze',members:['Charlotte','Wriothesley','Furina','Yelan']},
          {name:'Physical Eula',members:['Charlotte','Eula','Raiden Shogun','Shenhe']}
        ]
      }
    },
    {
      id:'onfield-driver',name:'On-field Cryo Driver',
      note:'Niche enjoyment-focused field-time build. Charlotte uses Cryo Normal/Charged Attacks to drive off-field teammates and trigger Freeze or Reverse Melt, but her personal damage and interruption resistance are weaker than dedicated carries.',
      overrides:{
        role:'On-field Cryo Driver',roleGroup:'Main DPS',focus:'Normal Attack / Elemental Burst / Elemental Skill',
        mainStats:{sands:['ATK%','Elemental Mastery'],goblet:['Cryo DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['CRIT Rate','CRIT DMG','ATK%','Energy Recharge','Elemental Mastery'],
        weaponPriority:['Cashflow Supervision','Tulaytullah’s Remembrance','The Widsith','Flowing Purity','Mappa Mare'],
        artifactPriority:['Marechaussee Hunter','Blizzard Strayer','Wanderer’s Troupe'],
        goalStats:[
          {label:'Field-time condition',value:'Only recommend this when Charlotte is intentionally the on-field driver; her default support build should remain off-field.'},
          {label:'Marechaussee condition',value:'Marechaussee requires reliable HP fluctuation, typically Furina.'},
          {label:'Reaction stats',value:'For Reverse Melt, EM gains value; for Freeze, prioritize ATK/CRIT and avoid overcapping CRIT Rate with Blizzard Strayer.'}
        ],
        buildSummaryTeams:[
          {name:'Freeze Driver',members:['Charlotte','Furina','Yelan','Kaedehara Kazuha']},
          {name:'Reverse Melt Driver',members:['Charlotte','Bennett','Xiangling','Nahida']},
          {name:'Burgeon Driver',members:['Charlotte','Nahida','Xingqiu','Thoma']}
        ]
      }
    }
  ],
  strengths:['Excellent partywide Burst healing.','Strong synergy with Furina’s Fanfare and team HP drain.','Cryo Catalyst attacks give controllable on-field Cryo application.','Can use TTDS, Favonius, Prototype Amber, Noblesse or Tenacity depending team needs.'],
  weaknesses:['Often very Energy Recharge hungry as solo Cryo.','Personal damage remains modest even when invested.','Skill hold time can be awkward and Tap Skill is usually preferred for fast rotations.','On-field play has low interruption resistance and is generally weaker than dedicated carries.'],
  playstyleTips:['Prioritize Burst uptime before healing or damage stats.','Use Tap Skill in most rotations unless Hold Skill marking has a specific payoff.','Pair with additional Cryo or Favonius users when ER is excessive.','Treat the on-field driver profile as intentional field-time play, not Hotaru’s default recommendation.'],
  sourceRefs:[
    {label:'Charlotte Quick Guide',kind:'Theorycraft reference',url:'https://keqingmains.com/q/charlotte-quickguide/'},
    {label:'Charlotte current build guide',kind:'Current build cross-check',url:'https://www.icy-veins.com/genshin-impact/charlotte-guide-best-builds'}
  ]
};