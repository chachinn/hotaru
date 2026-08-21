export default {
  id:'arlecchino-main-dps',
  character:'Arlecchino',
  aliases:['The Knave'],
  reviewed:true,
  reviewedAt:'2026-08-21',
  role:'On-field DPS',
  roleGroup:'DPS',
  roleRatings:[
    {label:'Main DPS',rating:'Primary'},
    {label:'Sub-DPS',rating:'—'},
    {label:'Support',rating:'—'},
    {label:'Exploration',rating:'Utility'}
  ],
  roleReason:'Arlecchino is an on-field Pyro damage dealer whose Bond of Life empowers her Normal Attacks.',
  scaling:'ATK',
  focus:'Normal Attack',
  energyCost:60,
  reactionDriven:false,
  defaultErTarget:100,
  defaultVariant:'standard',
  targets:{
    cr:{min:50,good:70,great:80,unit:'%'},
    cd:{min:100,good:160,great:190,unit:'%'},
    er:{min:100,good:100,great:110,unit:'%'},
    em:{min:0,good:0,great:0,unit:''}
  },
  contextOptions:[
    {key:'burstPolicy',label:'Burst usage',default:'emergency',options:[
      {value:'emergency',label:'Emergency / not every rotation'},
      {value:'every',label:'Every rotation'}
    ]}
  ],
  targetOverrides:{
    er:{
      cases:[
        {when:{burstPolicy:'every'},bySameElement:{
          '0':{min:150,good:150,great:165,unit:'%'},
          '1':{min:140,good:145,great:160,unit:'%'},
          '2':{min:120,good:120,great:135,unit:'%'},
          '3':{min:120,good:120,great:135,unit:'%'}
        }}
      ],
      favoniusReductionPerProc:8,
      favoniusReductionMax:20,
      floor:100
    }
  },
  mainStats:{
    sands:['ATK%','Elemental Mastery'],
    goblet:['Pyro DMG%','ATK%'],
    circlet:['CRIT Rate / CRIT DMG']
  },
  substats:['CRIT Rate','CRIT DMG','ATK%','Elemental Mastery'],
  talentPriority:['attack','burst','skill'],
  weaponPriority:["Crimson Moon's Semblance",'Primordial Jade Winged-Spear','Staff of the Scarlet Sands','Staff of Homa','Deathmatch','White Tassel'],
  f2pWeapon:'White Tassel',
  artifactPriority:['Fragment of Harmonic Whimsy',"Night of the Sky's Unveiling","Gladiator's Finale"],
  variants:[
    {id:'standard',name:'Pyro Main DPS',note:'General on-field build focused on Bond of Life-enhanced Normal Attacks, CRIT and ATK.',overrides:{reactionDriven:false,mainStats:{sands:['ATK%','Elemental Mastery'],goblet:['Pyro DMG%','ATK%'],circlet:['CRIT Rate / CRIT DMG']},substats:['CRIT Rate','CRIT DMG','ATK%','Elemental Mastery']}},
    {id:'reaction',name:'Vaporize / Melt',note:'Elemental Mastery gains value when Arlecchino reliably triggers amplifying reactions.',overrides:{reactionDriven:true,mainStats:{sands:['ATK%','Elemental Mastery'],goblet:['Pyro DMG%','ATK%'],circlet:['CRIT Rate / CRIT DMG']},substats:['CRIT Rate','CRIT DMG','Elemental Mastery','ATK%']}}
  ],
  goalStats:[
    {label:'ATK',value:'2,000+ practical target'},
    {label:'CRIT Rate',value:'70–80% target range'},
    {label:'CRIT DMG',value:'160%+ target range'},
    {label:'Energy Recharge',value:'Usually no ER investment when Burst is reserved for emergency healing'}
  ],
  strengths:[
    'High on-field Pyro damage with strong built-in Normal Attack scaling.',
    'Bond of Life persists through swaps, giving her rotations some flexibility.',
    'Can run highly offensive teams when the player is comfortable managing survivability.'
  ],
  weaknesses:[
    'Cannot receive normal in-combat healing from teammates, so shield or defensive utility can be valuable.',
    'Interruptions can break her Normal Attack sequence and lower damage.',
    'Using Burst every rotation is generally a damage tradeoff and greatly increases ER needs.'
  ],
  playstyleTips:[
    'Apply Skill first, cycle through supports while the mark develops, then return and use a Charged Attack to claim Bond of Life before the Normal Attack sequence.',
    'Treat Burst primarily as emergency self-healing unless the selected rotation specifically budgets for frequent Burst use.'
  ],
  sourceRefs:[
    {label:'KQM Arlecchino Quick Guide',kind:'Theorycraft guidance',url:'https://keqingmains.com/q/arlecchino-quickguide/'},
    {label:'Game8 Arlecchino Build Guide',kind:'Build-guide cross-check',url:'https://game8.co/games/Genshin-Impact/archives/382103'}
  ]
};
