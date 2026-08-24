export default {
  id:'chongyun-burst-enabler',
  character:'Chongyun',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-24',
  role:'Cryo Infusion Enabler / Burst Support',
  roleGroup:'Support',
  roleReason:'Chongyun provides melee Cryo infusion, ATK Speed, low-cost Burst damage, Cryo particles and a delayed Cryo RES reduction. His default role is off-field support or quickswap Burst damage; Melt ownership and intentional on-field Plunge play materially change his stat and talent priorities.',
  scaling:'ATK / Cryo DMG / CRIT / conditional EM',
  scalingDetail:'General support uses ATK/Cryo/CRIT after modest ER needs are met. Elemental Mastery is only valuable when Chongyun actually owns Melt hits, especially his Burst. On-field Plunge play values Normal Attack levels and sustained field-time damage instead of purely quickswap Burst output.',
  focus:'Elemental Burst / Elemental Skill',
  reactionDriven:true,
  targets:{er:{min:110,good:125,great:140,unit:'%'},atk:{min:1600,good:1800,great:2000,unit:''},cr:{min:45,good:60,great:70,unit:'%'}},
  mainStats:{sands:['ATK%','Energy Recharge'],goblet:['Cryo DMG%'],circlet:['CRIT Rate','CRIT DMG']},
  substats:['Energy Recharge to rotation need','CRIT Rate','CRIT DMG','ATK%'],
  talentPriority:['burst','skill','attack'],
  weaponPriority:['Wolf’s Gravestone','Beacon of the Reed Sea','Serpent Spine','Sacrificial Greatsword','Favonius Greatsword'],
  f2pWeapon:'Sacrificial Greatsword',
  artifactPriority:['Noblesse Oblige','Emblem of Severed Fate','2pc Cryo DMG + 2pc Burst DMG','Blizzard Strayer'],
  defaultVariant:'burst-support-enabler',
  variants:[
    {
      id:'burst-support-enabler',name:'Burst Support / Cryo Infusion Enabler',
      note:'Default Chongyun. Use Skill to enable melee Cryo infusion and ATK Speed, then Burst for low-cost damage and Noblesse uptime. Do not force EM unless Chongyun is actually Melting his own hits.',
      overrides:{
        role:'Cryo Infusion Enabler / Burst Support',roleGroup:'Support',focus:'Elemental Burst / Elemental Skill',
        mainStats:{sands:['ATK%','Energy Recharge'],goblet:['Cryo DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['Energy Recharge to rotation need','CRIT Rate','CRIT DMG','ATK%'],
        weaponPriority:['Wolf’s Gravestone','Sacrificial Greatsword','Favonius Greatsword','Serpent Spine','Skyward Pride'],
        artifactPriority:['Noblesse Oblige','Emblem of Severed Fate','2pc Cryo DMG + 2pc Burst DMG','Blizzard Strayer'],
        goalStats:[
          {label:'Energy Recharge',value:'His 40-cost Burst usually keeps ER modest; roughly 120–130% is a practical general target and Cryo teammates can lower it further.'},
          {label:'Infusion rule',value:'His field infuses Sword, Claymore and Polearm Normal/Charged attacks with Cryo. Do not place it under carries whose own infusion or physical-damage plan is harmed by conversion.'},
          {label:'C2 utility',value:'At C2, Skills and Bursts cast inside the Frost Field receive cooldown reduction, adding real team utility beyond damage.'}
        ],
        buildSummaryTeams:[
          {name:'Kaeya Freeze',members:['Chongyun','Kaeya','Xingqiu','Jean']},
          {name:'Mono Cryo',members:['Chongyun','Shenhe','Kaeya','Kaedehara Kazuha']},
          {name:'Ayaka Cryo Support',members:['Chongyun','Kamisato Ayaka','Shenhe','Sangonomiya Kokomi']}
        ]
      }
    },
    {
      id:'reverse-melt-burst',name:'Reverse Melt Burst DPS',
      note:'Use when Chongyun’s Burst is deliberately Melting a maintained Pyro aura. EM becomes a real damage stat here; it should not leak into Freeze, Mono Cryo, or teams where another unit owns the transformative/reaction damage.',
      overrides:{
        role:'Reverse Melt Quickswap Burst DPS',roleGroup:'Sub-DPS',focus:'Elemental Burst / Elemental Skill',
        mainStats:{sands:['Elemental Mastery','ATK%'],goblet:['Cryo DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['CRIT Rate','CRIT DMG','Elemental Mastery','ATK%','Energy Recharge to rotation need'],
        weaponPriority:['Beacon of the Reed Sea','Serpent Spine','Mailed Flower','Wolf’s Gravestone','Akuoumaru'],
        artifactPriority:['Gilded Dreams','Lavawalker','Emblem of Severed Fate','2pc Cryo DMG + 2pc Elemental Mastery'],
        goalStats:[
          {label:'Reaction ownership',value:'Only prioritize EM when Chongyun actually owns Reverse Melt hits. His Burst can Melt its blades from a stable Pyro aura.'},
          {label:'Pyro setup',value:'Bennett plus Xiangling, Pyro-absorbed Anemo, or another reviewed Pyro core must establish enough aura before Chongyun’s Burst.'},
          {label:'Bennett C6 warning',value:'Forward-Melt Bennett teams relying on Chongyun’s Cryo infusion break when Bennett C6 Pyro infusion overrides it; Reverse-Melt Chongyun Burst teams do not rely on that same Normal Attack interaction.'}
        ],
        buildSummaryTeams:[
          {name:'Reverse Melt',members:['Chongyun','Rosaria','Xiangling','Bennett']},
          {name:'Reverse Melt Kazuha',members:['Chongyun','Kaeya','Bennett','Kaedehara Kazuha']},
          {name:'Vapemelt',members:['Chongyun','Xingqiu','Xiangling','Bennett']}
        ]
      }
    },
    {
      id:'onfield-cryo-plunge',name:'On-field Cryo Plunge DPS',
      note:'Niche field-time identity enabled by Xianyun. Chongyun uses his own Cryo infusion and Plunge attacks while Shenhe/Furina or other reviewed supports amplify sustained Cryo damage. This is not the default Smart Team role.',
      overrides:{
        role:'On-field Cryo Plunge DPS',roleGroup:'Main DPS',focus:'Normal Attack / Elemental Skill / Elemental Burst',
        mainStats:{sands:['ATK%'],goblet:['Cryo DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['CRIT Rate','CRIT DMG','ATK%','Energy Recharge'],
        weaponPriority:['Beacon of the Reed Sea','Serpent Spine','Wolf’s Gravestone','Redhorn Stonethresher','Tidal Shadow'],
        artifactPriority:['Marechaussee Hunter','Blizzard Strayer','Gladiator’s Finale + Blizzard Strayer'],
        goalStats:[
          {label:'Field-time condition',value:'Only recommend this build when Chongyun is intentionally the on-field Cryo attacker; otherwise use the Burst-support profile.'},
          {label:'Xianyun requirement',value:'The Plunge identity depends on Xianyun’s Plunge enablement and buffing rather than Chongyun’s baseline kit alone.'},
          {label:'Marechaussee condition',value:'Marechaussee Hunter requires reliable HP fluctuation, most naturally supplied by Furina teams.'}
        ],
        buildSummaryTeams:[
          {name:'Cryo Plunge',members:['Chongyun','Furina','Shenhe','Xianyun']},
          {name:'Cryo Plunge Kazuha',members:['Chongyun','Shenhe','Kaedehara Kazuha','Xianyun']},
          {name:'Freeze Plunge',members:['Chongyun','Furina','Yelan','Xianyun']}
        ]
      }
    }
  ],
  strengths:['Unique melee Cryo infusion enables specialized Freeze and Melt rotations.','Low 40-Energy Burst gives efficient quickswap damage and Noblesse uptime.','C2 cooldown reduction and A1 ATK Speed add team utility.','Can shift into Melt Burst damage or niche Xianyun Plunge carry play.'],
  weaknesses:['Cryo infusion can actively hurt Physical or incompatible infusion carries.','Claymore/Skill/Burst blunt damage can Shatter Frozen enemies.','Personal damage is modest without investment and reaction setup.','Forward-Melt Bennett interaction is incompatible with Bennett C6 Pyro infusion.'],
  playstyleTips:['Use Skill before the melee driver when Cryo infusion is desired.','Do not assume Blizzard Strayer’s Frozen bonus against bosses or unfreezable enemies.','In Melt teams, confirm Chongyun owns the Melt before recommending EM.','Treat on-field Plunge as an intentional niche identity rather than a default investment-based promotion.'],
  sourceRefs:[
    {label:'Chongyun Quick Guide',kind:'Theorycraft reference',url:'https://keqingmains.com/q/chongyun-quickguide/'},
    {label:'Chongyun current build guide',kind:'Current build cross-check',url:'https://www.icy-veins.com/genshin-impact/chongyun-guide-best-builds'},
    {label:'Xianyun Plunge reference',kind:'Team mechanics cross-check',url:'https://www.icy-veins.com/genshin-impact/xianyun-cloud-retainer-guide-best-builds'}
  ]
};