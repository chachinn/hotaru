export default {
  id:'aino-offfield-hydro-support',
  character:'Aino',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-23',
  role:'Off-field Hydro Support / Enabler',
  roleGroup:'Support',
  roleRatings:[
    {label:'Main DPS',rating:'Not recommended'},
    {label:'Sub-DPS',rating:'Secondary'},
    {label:'Support',rating:'Primary'},
    {label:'Exploration',rating:'Utility'}
  ],
  roleReason:'Aino is primarily a swap-in Hydro support whose Burst provides off-field Hydro application, raises the team’s Moonsign level, and enables reaction-focused teams. Game8’s default support build prioritizes Elemental Mastery while her personal Talent damage remains low.',
  scaling:'EM',
  focus:'Elemental Burst',
  reactionDriven:true,
  targets:{
    cr:{min:50,good:60,great:70,unit:'%'},
    cd:{min:100,good:110,great:120,unit:'%'},
    er:{min:150,good:165,great:180,unit:'%'},
    em:{min:600,good:700,great:800,unit:''}
  },
  targetOverrides:{
    er:{
      cases:[
        {bySameElement:{
          '0':{min:150,good:165,great:180,unit:'%'},
          '1':{min:110,good:120,great:130,unit:'%'},
          '2':{min:110,good:120,great:130,unit:'%'},
          '3':{min:110,good:120,great:130,unit:'%'}
        }}
      ],
      floor:100
    }
  },
  mainStats:{
    sands:['Elemental Mastery','ER%'],
    goblet:['Elemental Mastery','Hydro DMG%'],
    circlet:['CRIT Rate / CRIT DMG','Elemental Mastery']
  },
  substats:['Elemental Mastery','CRIT Rate','CRIT DMG','Energy Recharge'],
  talentPriority:['burst','skill','attack'],
  weaponPriority:[
    'Flame-Forged Insight',
    'Master Key',
    'Favonius Greatsword',
    'Makhaira Aquamarine',
    'Skyward Pride',
    'Sacrificial Greatsword'
  ],
  f2pWeapon:'Favonius Greatsword',
  artifactPriority:[
    "Silken Moon's Serenade",
    'Noblesse Oblige',
    'Aubade of Morningstar and Moon',
    'Instructor'
  ],
  goalStats:[
    {label:'Elemental Mastery',value:'Game8 target: about 700–800 EM for the default reaction-support build.'},
    {label:'Energy Recharge',value:'Game8 target: about 150–180% as solo Hydro or 110–130% with a second Hydro. KQM calculates higher needs in some one-Skill-per-Burst rotations, so raise ER when your actual rotation cannot Burst consistently.'},
    {label:'CRIT Rate',value:'Game8 target: about 50–70%; prioritize enough CRIT Rate to trigger Favonius Greatsword reliably when using it.'},
    {label:'CRIT DMG',value:'Game8 target: about 100–120% after EM/ER needs are satisfied.'}
  ],
  strengths:[
    'Provides consistent off-field Hydro through her Burst with very short field time.',
    'Raises the party’s Moonsign level and can enable Ascendant Gleam effects with another Nod-Krai character.',
    'Can hold Silken Moon’s Serenade to provide teamwide Elemental Mastery and Lunar Reaction support.',
    'Works with inexpensive weapons and does not require heavy Talent investment to perform her support role.'
  ],
  weaknesses:[
    'Personal Talent damage is low, so offensive ATK/CRIT investment usually gives less team value than meeting support requirements.',
    'Hydro application is slower without a second Nod-Krai character and can be insufficient for some reaction teams.',
    'Her strongest reaction buffs are constellation-dependent, especially C6.'
  ],
  playstyleTips:[
    'Use Skill for particles/repositioning, then Burst, then swap to the team’s driver or DPS.',
    'For the default Game8 support build, prioritize EM while maintaining enough ER to Burst every rotation.',
    'If Favonius Greatsword is equipped, secure enough CRIT Rate to trigger its passive consistently.',
    'A second Nod-Krai teammate improves her Burst application rate and AoE through Ascendant Gleam.'
  ],
  sourceRefs:[
    {label:'Game8 Aino Best Builds and Teams',kind:'Primary build reference',url:'https://game8.co/games/Genshin-Impact/archives/537903'},
    {label:'KQM Aino Quick Guide',kind:'Current theorycraft cross-check',url:'https://keqingmains.com/q/aino-quickguide/'},
    {label:'GameWith Aino Best Build Guide',kind:'Current build cross-check',url:'https://gamewith.net/genshin-impact/article/show/69272'},
    {label:'La Gazette de Teyvat · Flins/Aino/Kuki/Sucrose Rotation',kind:'YouTube team/rotation cross-check',url:'https://www.youtube.com/watch?v=ZccXtlpp9bY'},
    {label:'HoYoLAB Aino Complete Guide',kind:'Community guide cross-check',url:'https://www.hoyolab.com/article/41509819'}
  ]
};
