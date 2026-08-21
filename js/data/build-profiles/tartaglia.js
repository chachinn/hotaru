export default {
  id:'tartaglia-main-dps',
  character:'Tartaglia',
  aliases:['Childe'],
  reviewed:true,
  reviewedAt:'2026-08-21',
  role:'On-field Enabler / DPS',
  roleGroup:'DPS',
  roleRatings:[
    {label:'Main DPS',rating:'Primary'},
    {label:'Sub-DPS',rating:'Enabler'},
    {label:'Support',rating:'—'},
    {label:'Exploration',rating:'Utility'}
  ],
  roleReason:'Tartaglia combines fast on-field Hydro application in Melee Stance with meaningful personal damage and a high-scaling Burst.',
  scaling:'ATK',
  focus:'Elemental Skill',
  energyCost:60,
  reactionDriven:true,
  defaultErTarget:120,
  defaultVariant:'vape',
  targets:{
    cr:{min:50,good:65,great:75,unit:'%'},
    cd:{min:100,good:140,great:180,unit:'%'},
    er:{min:100,good:120,great:130,unit:'%'},
    em:{min:0,good:0,great:0,unit:''}
  },
  targetOverrides:{er:{favoniusReductionPerProc:5,favoniusReductionMax:15,floor:100}},
  mainStats:{
    sands:['ATK%'],
    goblet:['Hydro DMG%'],
    circlet:['CRIT Rate / CRIT DMG']
  },
  substats:['Energy Recharge','CRIT Rate','CRIT DMG','ATK%','Elemental Mastery'],
  talentPriority:['skill','burst','attack'],
  weaponPriority:['Polar Star','Aqua Simulacra',"Hunter's Path",'Skyward Harp','Thundering Pulse','The First Great Magic','The Viridescent Hunt'],
  f2pWeapon:'Hamayumi',
  artifactPriority:["Nymph's Dream",'Heart of Depth'],
  variants:[
    {id:'vape',name:'Vaporize / International Driver',note:'Uses fast Hydro application to enable off-field Pyro damage while contributing Burst and Melee Stance damage.',overrides:{reactionDriven:true,substats:['Energy Recharge','CRIT Rate','CRIT DMG','ATK%','Elemental Mastery']}},
    {id:'driver',name:'Electro-Charged / Reaction Driver',note:'Leans on fast Hydro application and multi-target Riptide interactions while teammates deal off-field damage.',overrides:{reactionDriven:true,substats:['Energy Recharge','CRIT Rate','CRIT DMG','ATK%','Elemental Mastery']}}
  ],
  goalStats:[
    {label:'Energy Recharge',value:'About 100–130% in common Ranged Burst rotations; team dependent'},
    {label:'CRIT',value:'Balance CRIT Rate and CRIT DMG after meeting ER needs'},
    {label:'ATK%',value:'Prioritize after ER and CRIT; exact value depends on team buffs'}
  ],
  strengths:[
    'Very fast Hydro application makes him a strong on-field reaction enabler.',
    'Riptide becomes especially valuable against grouped multi-target encounters.',
    'Elemental Burst provides strong front-loaded damage when used in the right reaction setup.'
  ],
  weaknesses:[
    'Melee Stance duration directly affects cooldown, so rotation discipline matters.',
    'Team performance is often rotation-sensitive and can feel punishing when cooldowns desync.',
    'Artifact and weapon optimization can change depending on whether the rotation emphasizes Burst or sustained Melee damage.'
  ],
  playstyleTips:[
    'Keep Melee Stance field time controlled rather than staying in it until the maximum duration; shorter planned windows keep the next rotation available sooner.',
    'Ranged Burst is commonly preferred in standard rotations because it refunds Energy and is easier to sustain; exact Burst choice depends on the team.'
  ],
  sourceRefs:[
    {label:'KQM Tartaglia Guide',kind:'Theorycraft guidance',url:'https://keqingmains.com/tartaglia/'},
    {label:'Game8 Tartaglia Build Guide',kind:'Build-guide cross-check',url:'https://game8.co/games/Genshin-Impact/archives/305862'}
  ]
};
