const KQM='https://keqingmains.com/q/vodyanitsa-quickguide/';
const PRYDWEN='https://www.prydwen.gg/genshin-impact/characters/vodyanitsa';

export default {
  id:'vodyanitsa-hydro-cryo-support',
  character:'Vodyanitsa',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-09-29',
  role:'Hydro/Cryo/Stellar-Swirl Support & Healer',
  roleGroup:'Support',
  roleReason:'Vodyanitsa is a low-field-time HP-scaling healer and buffer for Hydro, Cryo, and Stellar-Swirl teams. She shreds Hydro/Cryo RES, adds Anemo RES shred and Stellar-Swirl base damage when a Wandering Vortex already exists, and provides interruption resistance.',
  scaling:'HP',
  scalingDetail:'Her normal support build stacks Max HP to strengthen healing and her additive damage buff, which begins scaling above 40,000 HP and caps at 65,000 HP. She usually does not need Burst every rotation.',
  focus:'Elemental Skill',
  reactionDriven:false,
  defaultVariant:'hp-support',
  targets:{
    hp:{min:40000,good:55000,great:65000,unit:''},
    er:{min:100,good:130,great:155,unit:'%'},
    cr:{min:5,good:25,great:45,unit:'%'},
    cd:{min:50,good:80,great:120,unit:'%'},
    em:{min:0,good:0,great:0,unit:''}
  },
  mainStats:{sands:['HP%'],goblet:['HP%'],circlet:['HP%']},
  substats:['HP%','Energy Recharge if Bursting','CRIT Rate if required by weapon','Flat HP'],
  talentPriority:['skill','burst','attack'],
  weaponPriority:[
    'Hymn of the Maelstrom',
    'Thrilling Tales of Dragon Slayers',
    'Prototype Amber',
    'Jadefall\'s Splendor',
    'Everlasting Moonglow',
    'Sacrificial Jade'
  ],
  f2pWeapon:'Thrilling Tales of Dragon Slayers',
  artifactPriority:[
    'Tenacity of the Millelith',
    '2pc HP combinations',
    'Scroll of the Hero of Cinder City',
    'Archaic Petra',
    'Ocean-Hued Clam',
    'Song of Days Past'
  ],
  buildSummaryTeams:[
    {name:'Freeze · Skirk',members:['Vodyanitsa','Skirk','Furina','Escoffier']},
    {name:'Stellar-Swirl · Vesna',members:['Vodyanitsa','Vesna','Odette','Cryo Traveler']},
    {name:'Hydro · Neuvillette',members:['Vodyanitsa','Neuvillette','Furina','Escoffier']}
  ],
  variants:[
    {
      id:'hp-support',
      name:'HP Support / Healer',
      note:'Default build for Hydro, Cryo, and Stellar-Swirl support. Stack HP first; only build meaningful ER when the selected team actually wants her Burst every rotation.',
      overrides:{
        role:'Hydro/Cryo/Stellar-Swirl Support & Healer',
        roleGroup:'Support',
        focus:'Elemental Skill',
        targets:{hp:{min:40000,good:55000,great:65000,unit:''},er:{min:100,good:130,great:155,unit:'%'},cr:{min:5,good:25,great:45,unit:'%'},cd:{min:50,good:80,great:120,unit:'%'},em:{min:0,good:0,great:0,unit:''}},
        mainStats:{sands:['HP%'],goblet:['HP%'],circlet:['HP%']},
        substats:['HP%','Energy Recharge if Bursting','CRIT Rate if required by weapon','Flat HP'],
        talentPriority:['skill','burst','attack'],
        weaponPriority:['Hymn of the Maelstrom','Thrilling Tales of Dragon Slayers','Prototype Amber',"Jadefall's Splendor",'Everlasting Moonglow','Sacrificial Jade'],
        artifactPriority:['Tenacity of the Millelith','2pc HP combinations','Scroll of the Hero of Cinder City','Archaic Petra','Ocean-Hued Clam','Song of Days Past'],
        goalStats:[
          {label:'HP',value:'Build above 40,000 HP and push toward 65,000 HP when practical; her additive support scaling caps there.'},
          {label:'Energy Recharge',value:'Usually optional because her Burst can be skipped. If Bursting every rotation, double-Hydro teams can need roughly 145–155% with Prototype Amber or 210–220% with other weapons; triple Hydro lowers this.'},
          {label:'Main stats',value:'HP% / HP% / HP% is the default support setup. Healing Bonus or CRIT is only a niche choice after HP needs are already satisfied.'},
          {label:'Stellar-Swirl rule',value:'Vodyanitsa supports Stellar Swirl but does not enable it. A valid Stellar-Swirl team still needs a true enabler such as Vesna or the existing Odette/Cryo-Traveler structure.'}
        ],
        buildSummaryTeams:[
          {name:'Freeze · Skirk',members:['Vodyanitsa','Skirk','Furina','Escoffier']},
          {name:'Stellar-Swirl · Vesna',members:['Vodyanitsa','Vesna','Odette','Cryo Traveler']},
          {name:'Hydro · Neuvillette',members:['Vodyanitsa','Neuvillette','Furina','Escoffier']}
        ]
      }
    },
    {
      id:'nilou-bloom-trigger',
      name:'Nilou Bloom Trigger',
      note:'A separate Full-EM build only for Nilou Bloom teams where Vodyanitsa owns a substantial share of Bloom triggers. Keep the Hydro + Dendro-only Nilou restriction intact.',
      overrides:{
        role:'On-field Bloom Trigger / Healer',
        roleGroup:'Support',
        focus:'Elemental Mastery / Bloom ownership',
        reactionDriven:true,
        targets:{hp:{min:25000,good:35000,great:45000,unit:''},er:{min:100,good:120,great:150,unit:'%'},cr:{min:5,good:20,great:40,unit:'%'},cd:{min:50,good:80,great:120,unit:'%'},em:{min:600,good:800,great:1000,unit:''}},
        mainStats:{sands:['Elemental Mastery'],goblet:['Elemental Mastery'],circlet:['Elemental Mastery']},
        substats:['Elemental Mastery','HP%','Energy Recharge if Bursting'],
        talentPriority:['skill','burst','attack'],
        weaponPriority:['Sacrificial Fragments','Mappa Mare','Magic Guide'],
        artifactPriority:['Flower of Paradise Lost','Gilded Dreams'],
        goalStats:[
          {label:'Elemental Mastery',value:'Full EM main stats and EM substats are justified here because Vodyanitsa can own a substantial share of the Bloom triggers.'},
          {label:'Team restriction',value:'Nilou Bountiful Core teams must remain Hydro + Dendro only. Do not add Anemo, Cryo, Electro, Geo, or Pyro teammates to this build.'},
          {label:'Sustain',value:'Retain enough HP for practical healing because Bountiful Cores damage the active character.'}
        ],
        buildSummaryTeams:[
          {name:'Nilou Bloom · Lauma + Nahida',members:['Vodyanitsa','Nilou','Lauma','Nahida']}
        ]
      }
    }
  ],
  goalStats:[
    {label:'HP',value:'40,000+ to activate meaningful additive support scaling; up to 65,000 HP for the cap.'},
    {label:'Energy Recharge',value:'Do not build ER by default if Burst is skipped; use team-specific ER only when Bursting on a fixed rotation.'},
    {label:'Main stats',value:'HP% / HP% / HP% in normal support teams.'}
  ],
  strengths:[
    'Provides healing and interruption resistance with very low field time.',
    'Shreds Hydro and Cryo RES and can also shred Anemo RES in Stellar-Swirl teams.',
    'Adds HP-scaled base damage to supported Hydro/Cryo or Stellar-Swirl damage.',
    'Has a legitimate separate Full-EM Nilou Bloom trigger build when she owns the reaction.'
  ],
  weaknesses:[
    'Does not enable Stellar Swirl herself despite being one of its strongest supports.',
    'Her periodic Hydro application can interfere with Stellar-Swirl aura patterns against Freeze-immune or Freeze-resistant targets.',
    'Personal damage is low in the normal HP support build.',
    'Burst-focused ER investment can be expensive and is often unnecessary.'
  ],
  playstyleTips:[
    'Use Skill before the main carry; if using Thrilling Tales, swap from Vodyanitsa directly into the intended ATK-scaling recipient.',
    'Do not assume her Hydro application is enough for Reverse Vaporize or Dendro teams by itself.',
    'In Stellar-Swirl teams, verify a real Stellar-Swirl enabler is present before recommending the team.',
    'Only switch to Full EM in the Nilou Bloom trigger build; normal Freeze, Hydro, and Stellar-Swirl support stays HP-focused.'
  ],
  sourceRefs:[
    {label:'KQM Vodyanitsa Quick Guide',kind:'Primary theorycraft reference',url:KQM},
    {label:'Prydwen Vodyanitsa Guide',kind:'Current build and team cross-check',url:PRYDWEN}
  ]
};
