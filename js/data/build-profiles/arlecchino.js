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
    {id:'standard',name:'Pyro Main DPS',note:'General on-field build focused on Bond of Life-enhanced Normal Attacks, CRIT and ATK.'},
    {id:'reaction',name:'Vaporize / Melt',note:'Keeps the same core build while Elemental Mastery gains value when Arlecchino reliably triggers amplifying reactions.'}
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
