export default {
  id:'chevreuse-overloaded-support',
  character:'Chevreuse',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-24',
  role:'Pyro/Electro Overloaded Support / Healer',
  roleGroup:'Support',
  roleReason:'Chevreuse is primarily a Pyro/Electro-only Overloaded support. Her A1 shreds Pyro and Electro RES after Overloaded, her enhanced Hold Skill grants an HP-scaled ATK buff, and her Skill heals the active character. At C6 she can also function as a general Pyro/Electro DMG support outside strict Overloaded teams; an invested quickswap build trades some HP/healing for personal Pyro damage.',
  scaling:'HP / optional Energy Recharge / optional CRIT',
  scalingDetail:'Support Chevreuse prioritizes enough HP to approach the 40,000 HP A4 cap. Her Burst is not required every rotation for normal support, so ER can be ignored unless the rotation specifically needs Burst. Quickswap DPS variants instead solve ER first and use ATK/Pyro/CRIT.',
  focus:'Elemental Skill / optional Elemental Burst',
  reactionDriven:true,
  targets:{hp:{min:30000,good:36000,great:40000,unit:''},er:{min:100,good:175,great:205,unit:'%'},cr:{min:20,good:45,great:65,unit:'%'}},
  mainStats:{sands:['HP%','Energy Recharge'],goblet:['HP%'],circlet:['HP%','Healing Bonus','CRIT Rate']},
  substats:['HP%','Flat HP','Energy Recharge (if Bursting every rotation)','CRIT Rate (Favonius)'],
  talentPriority:['skill','burst','attack'],
  weaponPriority:['Dialogues of the Desert Sages','Favonius Lance','Black Tassel','Rightful Reward','Symphonist of Scents'],
  f2pWeapon:'Black Tassel',
  artifactPriority:['Noblesse Oblige','Song of Days Past','Scroll of the Hero of Cinder City','2pc HP% + 2pc HP%'],
  defaultVariant:'pure-overloaded-support',
  variants:[
    {
      id:'pure-overloaded-support',name:'Pure Overloaded Support / Healer',
      note:'Default Chevreuse. Keep every teammate Pyro or Electro to preserve her A1 RES Shred, trigger Overloaded before the enhanced Hold Skill, then prioritize HP and practical healing. Burst is optional when the team can trigger Overloaded without it.',
      overrides:{
        role:'Pyro/Electro-only Overloaded Support / Healer',roleGroup:'Support',focus:'Elemental Skill / optional Elemental Burst',
        teamRequirements:{allowedElements:['Pyro','Electro'],requiresReaction:'overload'},
        mainStats:{sands:['HP%','Energy Recharge'],goblet:['HP%'],circlet:['HP%','Healing Bonus','CRIT Rate']},
        substats:['HP%','Flat HP','Energy Recharge (if needed)','CRIT Rate (Favonius)'],
        weaponPriority:['Dialogues of the Desert Sages','Favonius Lance','Black Tassel','Rightful Reward','Symphonist of Scents'],
        artifactPriority:['Noblesse Oblige','Song of Days Past','Scroll of the Hero of Cinder City','2pc HP% + 2pc HP%'],
        goalStats:[
          {label:'HP target',value:'Build toward 40,000 Max HP for the full A4 ATK buff; extra HP beyond the cap is primarily healing value.'},
          {label:'Energy Recharge',value:'Burst is optional for many support rotations. If Burst is required every rotation, ER can rise roughly into the 175–205% range outside Raiden teams and much lower with on-field Raiden.'},
          {label:'Team rule',value:'For A1 Pyro/Electro RES Shred, every party member must be Pyro or Electro and the team must keep triggering Overloaded.'}
        ],
        buildSummaryTeams:[
          {name:'Arlecchino Overloaded',members:['Chevreuse','Arlecchino','Fischl','Bennett']},
          {name:'Clorinde Overloaded',members:['Chevreuse','Clorinde','Fischl','Bennett']},
          {name:'Raiden Overloaded',members:['Chevreuse','Raiden Shogun','Kujou Sara','Bennett']}
        ]
      }
    },
    {
      id:'c6-general-pyro-electro-support',name:'C6 General Pyro / Electro Support',
      minConstellation:6,
      note:'C6-only identity. Chevreuse’s C6 DMG Bonus is strong enough that selected Pyro or Electro carries can use her outside pure Pyro/Electro Overloaded teams. These teams do not automatically receive her A1 RES Shred; each buff must be treated according to its real trigger and restriction.',
      overrides:{
        role:'C6 General Pyro / Electro Buffer / Healer',roleGroup:'Support',focus:'Elemental Skill',minConstellation:6,
        mainStats:{sands:['HP%','Energy Recharge'],goblet:['HP%'],circlet:['HP%','Healing Bonus']},
        substats:['HP%','Flat HP','Energy Recharge'],
        weaponPriority:['Dialogues of the Desert Sages','Favonius Lance','Black Tassel','Rightful Reward','Symphonist of Scents'],
        artifactPriority:['Song of Days Past','Noblesse Oblige','Scroll of the Hero of Cinder City'],
        goalStats:[
          {label:'Constellation gate',value:'Never assign this identity below C6.'},
          {label:'Buff accounting',value:'Outside pure Pyro/Electro teams, do not claim A1 RES Shred. C6 DMG Bonus still buffs Pyro/Electro damage for characters who receive Chevreuse healing.'},
          {label:'Healing',value:'C6 adds delayed teamwide healing, but practical Furina teams still need enough HP and rotation timing to build Fanfare reliably.'}
        ],
        buildSummaryTeams:[
          {name:'Arlecchino Overvape',members:['Chevreuse','Arlecchino','Yelan','Fischl']},
          {name:'Gaming Furina',members:['Chevreuse','Gaming','Furina','Xianyun']},
          {name:'Chasca Furina',members:['Chevreuse','Chasca','Furina','Iansan']}
        ]
      }
    },
    {
      id:'quickswap-dps',name:'Quickswap DPS / Support',
      note:'Invested personal-damage profile for rotations where Chevreuse can Burst every cycle and receives meaningful team buffs. It sacrifices HP/healing and is usually lower account priority than investing in the main carry.',
      overrides:{
        role:'Quickswap Pyro DPS / Support',roleGroup:'Sub-DPS',focus:'Elemental Burst / Elemental Skill',
        mainStats:{sands:['ATK%','Energy Recharge'],goblet:['Pyro DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','CRIT Rate','CRIT DMG','ATK%','HP%'],
        weaponPriority:['Staff of the Scarlet Sands','Staff of Homa','Deathmatch','The Catch','Favonius Lance'],
        artifactPriority:['Emblem of Severed Fate','Golden Troupe + Crimson Witch of Flames','Noblesse Oblige'],
        goalStats:[
          {label:'Burst uptime',value:'Solve rotation-specific ER first; outside Raiden teams, Burst-every-rotation requirements can be high.'},
          {label:'Damage tradeoff',value:'ATK/Pyro/CRIT increases personal damage but lowers the HP-based A4 buff and healing unless substats still reach strong HP.'},
          {label:'C4 interaction',value:'C4 enables additional Hold Skill uses after Burst and materially improves quickswap personal damage.'}
        ],
        buildSummaryTeams:[
          {name:'Raiden Quickswap',members:['Chevreuse','Raiden Shogun','Yelan','Bennett']},
          {name:'Raiden Overloaded',members:['Chevreuse','Raiden Shogun','Fischl','Bennett']},
          {name:'Clorinde Quickswap',members:['Chevreuse','Clorinde','Fischl','Thoma']}
        ]
      }
    }
  ],
  strengths:['Powerful Pyro/Electro RES Shred in pure Overloaded teams.','Up to 40% HP-scaled ATK buff from enhanced Hold Skill.','Provides healing and particles without requiring field time.','C6 adds a major Pyro/Electro DMG Bonus and broader team flexibility.'],
  weaknesses:['A1 RES Shred requires the entire team to be Pyro/Electro.','Healing is mostly active-character focused before C6 and may feel light in high-pressure content.','Overloaded knockback can be awkward against light enemies.','Personal-damage builds trade away easy HP/healing and are often lower investment priority.'],
  playstyleTips:['Trigger Overloaded before using the enhanced Hold Skill so the A4 ATK buff activates.','Do not force Burst every rotation on support builds unless the team needs it.','Keep pure Overloaded teams strictly Pyro/Electro.','Treat off-archetype Chevreuse teams as C6-only unless a reviewed exception explicitly says otherwise.'],
  sourceRefs:[
    {label:'Chevreuse Quick Guide',kind:'Theorycraft reference',url:'https://keqingmains.com/q/chevreuse-quickguide/'},
    {label:'Chevreuse current build guide',kind:'Current build cross-check',url:'https://www.icy-veins.com/genshin-impact/chevreuse-guide-best-builds'}
  ]
};