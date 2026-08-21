export default {
  id:'columbina-lunar-support',
  character:'Columbina',
  aliases:['Damselette'],
  reviewed:true,
  reviewedAt:'2026-08-21',
  role:'Off-field Support / DPS',
  roleGroup:'Support',
  roleRatings:[
    {label:'Main DPS',rating:'Variant'},
    {label:'Sub-DPS',rating:'Primary'},
    {label:'Support',rating:'Primary'},
    {label:'Exploration',rating:'Utility'}
  ],
  roleReason:'Columbina applies Hydro and deals Lunar Reaction damage from off-field while her Burst buffs Lunar Reactions; she also has a separate on-field Lunar-Bloom playstyle.',
  scaling:'HP',
  focus:'Elemental Skill',
  reactionDriven:true,
  defaultVariant:'offfield',
  targets:{
    cr:{min:50,good:65,great:75,unit:'%'},
    cd:{min:100,good:140,great:180,unit:'%'},
    er:{min:235,good:270,great:300,unit:'%'},
    em:{min:0,good:0,great:0,unit:''}
  },
  contextOptions:[
    {key:'burstCycle',label:'Burst frequency',default:'every',options:[
      {value:'every',label:'Every rotation'},
      {value:'everyOther',label:'Every other rotation'}
    ]}
  ],
  targetOverrides:{
    er:{
      cases:[
        {when:{burstCycle:'every'},bySameElement:{
          '0':{min:235,good:270,great:300,unit:'%'},
          '1':{min:165,good:180,great:195,unit:'%'},
          '2':{min:165,good:180,great:195,unit:'%'},
          '3':{min:165,good:180,great:195,unit:'%'}
        }},
        {when:{burstCycle:'everyOther'},bySameElement:{
          '0':{min:118,good:135,great:150,unit:'%'},
          '1':{min:100,good:100,great:115,unit:'%'},
          '2':{min:100,good:100,great:115,unit:'%'},
          '3':{min:100,good:100,great:115,unit:'%'}
        }}
      ],
      favoniusReductionPerProc:12,
      favoniusReductionMax:36,
      floor:100
    }
  },
  mainStats:{
    sands:['ER%','HP%'],
    goblet:['HP%'],
    circlet:['CRIT Rate / CRIT DMG','HP%']
  },
  substats:['Energy Recharge','CRIT Rate','CRIT DMG','HP%','Elemental Mastery'],
  talentPriority:['skill','burst','attack'],
  weaponPriority:["Nocturne's Curtain Call",'Sacrificial Jade','Prototype Amber','Favonius Codex','The Widsith','Ash-Graven Drinking Horn'],
  f2pWeapon:'Prototype Amber',
  artifactPriority:["Silken Moon's Serenade",'Aubade of Morningstar and Moon','Tenacity of the Millelith'],
  variants:[
    {id:'offfield',name:'Off-field Support / DPS',note:'Default Lunar Reaction enabler and off-field damage build.',overrides:{role:'Off-field Support / DPS',roleGroup:'Support',focus:'Elemental Skill',mainStats:{sands:['ER%','HP%'],goblet:['HP%'],circlet:['CRIT Rate / CRIT DMG','HP%']},substats:['Energy Recharge','CRIT Rate','CRIT DMG','HP%','Elemental Mastery'],talentPriority:['skill','burst','attack'],weaponPriority:["Nocturne's Curtain Call",'Sacrificial Jade','Prototype Amber','Favonius Codex','The Widsith','Ash-Graven Drinking Horn'],artifactPriority:["Silken Moon's Serenade",'Aubade of Morningstar and Moon','Tenacity of the Millelith']}},
    {id:'onfield',name:'On-field Lunar-Bloom DPS',note:'Uses Columbina on-field for special Charged Attacks while preserving her Lunar Reaction utility.',overrides:{role:'On-field Lunar-Bloom DPS',roleGroup:'DPS',focus:'Charged Attack',targets:{cr:{min:50,good:65,great:75,unit:'%'},cd:{min:100,good:140,great:180,unit:'%'},er:{min:195,good:200,great:210,unit:'%'},em:{min:0,good:0,great:0,unit:''}},targetOverrides:{er:{cases:[{when:{burstCycle:'every'},bySameElement:{'0':{min:195,good:200,great:210,unit:'%'},'1':{min:150,good:160,great:175,unit:'%'},'2':{min:150,good:160,great:175,unit:'%'},'3':{min:150,good:160,great:175,unit:'%'}}},{when:{burstCycle:'everyOther'},bySameElement:{'0':{min:100,good:100,great:105,unit:'%'},'1':{min:100,good:100,great:100,unit:'%'},'2':{min:100,good:100,great:100,unit:'%'},'3':{min:100,good:100,great:100,unit:'%'}}}],favoniusReductionPerProc:12,favoniusReductionMax:36,floor:100}},mainStats:{sands:['ER%','HP%'],goblet:['HP%'],circlet:['CRIT Rate / CRIT DMG','HP%']},substats:['Energy Recharge','CRIT Rate','CRIT DMG','HP%','Elemental Mastery'],talentPriority:['skill','attack','burst'],weaponPriority:["Nocturne's Curtain Call",'Reliquary of Truth',"Surf's Up",'Tome of the Eternal Flow','Dawning Frost','Blackmarrow Lantern','The Widsith','Prototype Amber'],artifactPriority:["Night of the Sky's Unveiling",'Aubade of Morningstar and Moon',"Silken Moon's Serenade"]}}
  ],
  goalStats:[
    {label:'Energy Recharge',value:'Meet the selected team/rotation requirement before offensive stats'},
    {label:'HP%',value:'High-value damage and buff scaling stat after ER needs'},
    {label:'CRIT',value:'Prioritize alongside HP% once ER is comfortable'}
  ],
  strengths:[
    'Enables and significantly buffs Lunar-Charged, Lunar-Bloom and Lunar-Crystallize.',
    'Provides useful off-field Hydro application, AoE and uptime.',
    'Can contribute strong personal damage in Lunar Reaction teams.'
  ],
  weaknesses:[
    'ER requirements can be very high when Bursting every rotation.',
    'Her value falls when Lunar Reactions cannot be triggered reliably.',
    'On-field Lunar-Bloom requires a compatible Dendro setup and is more team-restrictive.'
  ],
  playstyleTips:[
    'Use Skill for off-field Hydro and Lunar Reaction damage; Burst when the selected rotation can sustain its Energy requirement.',
    'If the required ER becomes too costly, Bursting every other rotation can be a better team-DPS tradeoff.'
  ],
  sourceRefs:[
    {label:'KQM Columbina Quick Guide',kind:'Theorycraft guidance',url:'https://keqingmains.com/q/columbina-quickguide/'},
    {label:'Game8 Columbina Build Guide',kind:'Build-guide cross-check',url:'https://game8.co/games/Genshin-Impact/archives/382106'}
  ]
};
