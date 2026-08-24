export default {
  id:'bennett-burst-support',
  character:'Bennett',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-24',
  role:'ATK Buffer / Healer / Pyro Battery',
  roleGroup:'Support',
  roleReason:'Bennett’s Burst combines a large Flat ATK buff with fast healing, while his low-cooldown Skill supplies Pyro particles and application. He can also become the on-field reaction trigger or Plunge carry when the team is explicitly built around that field time.',
  scaling:'Base ATK / Energy Recharge / HP / optional EM or CRIT',
  scalingDetail:'The Burst ATK buff scales only with Bennett’s character Base ATK plus weapon Base ATK. Support healing scales with HP, while invested reaction builds shift toward EM, Pyro DMG and CRIT after ER is solved.',
  focus:'Elemental Burst / Elemental Skill',
  reactionDriven:true,
  targets:{er:{min:160,good:200,great:240,unit:'%'},hp:{min:20000,good:25000,great:30000,unit:''},cr:{min:50,good:65,great:75,unit:'%'}},
  mainStats:{sands:['Energy Recharge','HP%'],goblet:['HP%','Pyro DMG%'],circlet:['Healing Bonus','CRIT Rate','CRIT DMG']},
  substats:['Energy Recharge','HP%','CRIT Rate','CRIT DMG','Elemental Mastery'],
  talentPriority:['burst','skill','attack'],
  weaponPriority:['Aquila Favonia','Mistsplitter Reforged','The Alley Flash','Sapwood Blade','Favonius Sword','Prototype Rancour'],
  f2pWeapon:'Sapwood Blade',
  artifactPriority:['Noblesse Oblige','Instructor','The Exile'],
  defaultVariant:'burst-support',
  variants:[
    {
      id:'burst-support',name:'Burst Support / Healer',
      note:'Default Bennett. Use the highest useful Base ATK weapon you can while still meeting Burst uptime. Healing investment is optional once sustain is already comfortable.',
      overrides:{
        role:'ATK Buffer / Healer / Pyro Battery',roleGroup:'Support',focus:'Elemental Burst / Elemental Skill',
        mainStats:{sands:['Energy Recharge','HP%'],goblet:['HP%','Pyro DMG%'],circlet:['Healing Bonus','CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','HP%','CRIT Rate','CRIT DMG'],
        weaponPriority:['Aquila Favonia','Mistsplitter Reforged','The Alley Flash','Sapwood Blade','Favonius Sword','Prototype Rancour'],
        artifactPriority:['Noblesse Oblige','Instructor','The Exile'],
        goalStats:[
          {label:'Energy Recharge',value:'Roughly 195–255% solo Pyro, 175–220% double Pyro and 160–190% triple Pyro are useful general 20s-rotation ranges; exact teams can differ substantially.'},
          {label:'Base ATK',value:'The Burst ATK buff uses Bennett’s character Base ATK plus weapon Base ATK only; artifact ATK does not increase the Flat ATK buff.'},
          {label:'Healing',value:'HP and Healing Bonus are comfort stats after ER; Bennett usually heals enough without dedicated healing sets.'}
        ],
        buildSummaryTeams:[
          {name:'National',members:['Bennett','Xiangling','Xingqiu','Sucrose']},
          {name:'Hypercarry Support',members:['Bennett','Raiden Shogun','Kujou Sara','Kaedehara Kazuha']},
          {name:'Mono Pyro',members:['Bennett','Arlecchino','Xiangling','Kaedehara Kazuha']}
        ]
      }
    },
    {
      id:'onfield-reaction-dps',name:'On-field Reaction DPS',
      note:'Use when Bennett personally spends field time spamming Skill and triggering Vaporize, Melt, Overvape or Thundering Fury reactions. Offensive main stats become real, and his ER requirement drops with repeated Skill uses.',
      overrides:{
        role:'On-field Pyro Reaction DPS',roleGroup:'Main DPS',focus:'Elemental Skill / Elemental Burst',
        mainStats:{sands:['Elemental Mastery','ATK%','Energy Recharge'],goblet:['Pyro DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge','CRIT Rate','CRIT DMG','Elemental Mastery','ATK%'],
        weaponPriority:['Mistsplitter Reforged','Haran Geppaku Futsu','Wolf-Fang','The Alley Flash','Finale of the Deep','Iron Sting'],
        artifactPriority:['Crimson Witch of Flames','Thundering Fury','Marechaussee Hunter','Gilded Dreams'],
        goalStats:[
          {label:'Energy Recharge',value:'On-field Bennett with four or more Skill uses can often function around roughly 100–135% ER; determine the exact requirement from the actual rotation.'},
          {label:'Reaction stats',value:'EM Sands is often strongest when Bennett owns reactions; ATK% is more flexible when ownership is inconsistent.'},
          {label:'Artifact condition',value:'Use Thundering Fury only when frequent Electro reactions actually reduce Skill cooldown; use Marechaussee only with reliable HP fluctuation such as Furina.'}
        ],
        buildSummaryTeams:[
          {name:'Forward Melt',members:['Bennett','Chongyun','Rosaria','Kaeya']},
          {name:'Overvape TF',members:['Bennett','Furina','Ororon','Fischl']},
          {name:'Double Hydro Vape',members:['Bennett','Xingqiu','Yelan','Xiangling']}
        ]
      }
    },
    {
      id:'full-em-trigger',name:'Burgeon / Overloaded Trigger',
      note:'Full-EM Bennett is only appropriate when he owns a high share of Burgeon or Overloaded reaction damage. Burst uptime remains mandatory because his Burst enables his short Skill cooldown and C6 Pyro infusion.',
      overrides:{
        role:'On-field Transformative Reaction Trigger',roleGroup:'Main DPS',focus:'Elemental Skill / Elemental Burst',reactionDriven:true,
        mainStats:{sands:['Elemental Mastery','Energy Recharge'],goblet:['Elemental Mastery'],circlet:['Elemental Mastery']},
        substats:['Energy Recharge','Elemental Mastery','CRIT Rate','ATK%'],
        weaponPriority:['Xiphos’ Moonlight','Freedom-Sworn','Iron Sting','Toukabou Shigure','Sapwood Blade'],
        artifactPriority:['Flower of Paradise Lost','Gilded Dreams','Thundering Fury'],
        goalStats:[
          {label:'Energy Recharge',value:'Meet Burst uptime first even on full EM; Burst is still central to Bennett’s trigger frequency and team buff.'},
          {label:'Elemental Mastery',value:'Stack EM aggressively only when Bennett actually owns Burgeon or frequent Overloaded triggers.'},
          {label:'Character Level',value:'Level 90 is important for transformative reaction damage.'}
        ],
        buildSummaryTeams:[
          {name:'Burgeon Driver',members:['Bennett','Nahida','Xingqiu','Yelan']},
          {name:'Burgeon Sustain',members:['Bennett','Nahida','Xingqiu','Baizhu']},
          {name:'TF Overloaded',members:['Bennett','Fischl','Chevreuse','Beidou']}
        ]
      }
    },
    {
      id:'xianyun-plunge',name:'Xianyun Plunge DPS',
      note:'Dedicated Plunge identity enabled by Xianyun. Bennett takes sustained field time and converts his Pyro infusion/reaction access into repeated Plunging Attacks.',
      overrides:{
        role:'On-field Pyro Plunge DPS',roleGroup:'Main DPS',focus:'Normal Attack / Elemental Skill / Elemental Burst',
        mainStats:{sands:['Elemental Mastery','ATK%'],goblet:['Pyro DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['CRIT Rate','CRIT DMG','Elemental Mastery','ATK%','Energy Recharge'],
        weaponPriority:['Mistsplitter Reforged','Haran Geppaku Futsu','Harbinger of Dawn','Wolf-Fang','Finale of the Deep'],
        artifactPriority:['Long Night’s Oath','Marechaussee Hunter','Crimson Witch of Flames'],
        goalStats:[
          {label:'Plunge condition',value:'This build requires Xianyun; do not recommend it as a generic Bennett DPS build without Plunge enablement.'},
          {label:'Reaction ownership',value:'With Hydro teammates, build enough EM for Bennett-owned Vaporize plunges while keeping a normal CRIT profile.'},
          {label:'Harbinger condition',value:'Harbinger of Dawn is only strong when its HP passive can remain active; Xianyun healing makes that condition more practical.'}
        ],
        buildSummaryTeams:[
          {name:'Vaporize Plunge',members:['Bennett','Furina','Xingqiu','Xianyun']},
          {name:'Double Hydro Plunge',members:['Bennett','Furina','Yelan','Xianyun']},
          {name:'Melt Plunge',members:['Bennett','Rosaria','Kaeya','Xianyun']}
        ]
      }
    }
  ],
  strengths:['One of the strongest universal ATK buffers in the game.','Fast single-target healing with very low field time.','Excellent Pyro particle generation through a short-cooldown Skill.','Can transition into real on-field reaction or Plunge builds instead of being support-only.'],
  weaknesses:['Burst confines many teams to a fixed circle.','Self-Pyro application can let enemy attacks trigger dangerous reactions.','Healing normally stops above 70% HP, which can conflict with some effects.','High-ER support teams can force lower-Base-ATK weapon compromises.'],
  playstyleTips:['Burst before the main damage window and funnel Skill particles to Pyro teammates when needed.','Meet ER before chasing healing or personal damage on support Bennett.','Do not use full EM unless Bennett is truly the transformative reaction trigger.','Treat Xianyun Plunge as a dedicated team identity rather than a generic DPS recommendation.'],
  sourceRefs:[
    {label:'Bennett Quick Guide',kind:'Current theorycraft',url:'https://keqingmains.com/q/bennett-quickguide/'},
    {label:'Bennett current profile and build guide',kind:'Current build cross-check',url:'https://www.icy-veins.com/genshin-impact/bennett-profile-talents-constellations'}
  ]
};