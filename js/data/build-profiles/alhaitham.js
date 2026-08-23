export default {
  id:'alhaitham-dendro-main-dps',
  character:'Alhaitham',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-23',
  role:'On-field Dendro Main DPS / Enabler',
  roleGroup:'Main DPS',
  tierRatings:[
    {label:'Main DPS',rating:'A'},
    {label:'Sub-DPS',rating:'—'},
    {label:'Support',rating:'—'},
    {label:'Exploration',rating:'S'}
  ],
  tierSource:'Game8 Alhaitham Rating and Best Builds — March 31, 2026',
  voiceActors:[
    {label:'EN',name:'Nazeeh Tarsha'},
    {label:'JP',name:'Umehara Yuuichirou (梅原裕一郎)'},
    {label:'CN',name:'Yang Chaoran (杨超然)'},
    {label:'KR',name:'Jun Seung Hwa (전승화)'}
  ],
  roleReason:'Alhaitham is an on-field Dendro damage dealer whose Chisel-Light Mirrors convert his attacks to Dendro and trigger Projection Attacks. He is strongest as a Spread DPS or as the on-field Dendro enabler for Quickbloom, Hyperbloom, Burgeon, and Nilou Bloom teams.',
  scaling:'EM',
  scalingDetail:'EM-priority hybrid scaling. His Skill/Projection damage and A4 passive strongly reward Elemental Mastery, while ATK still contributes to Talent damage. KQM recommends meeting ER, reaching roughly 200–300 EM including buffs in Quicken, then prioritizing CRIT.',
  focus:'Elemental Skill',
  reactionDriven:true,
  targets:{
    cr:{min:60,good:70,great:80,unit:'%'},
    cd:{min:120,good:150,great:180,unit:'%'},
    er:{min:120,good:130,great:140,unit:'%'},
    em:{min:200,good:250,great:300,unit:''}
  },
  targetOverrides:{
    er:{
      cases:[
        {bySameElement:{
          '0':{min:160,good:175,great:220,unit:'%'},
          '1':{min:120,good:130,great:140,unit:'%'},
          '2':{min:105,good:115,great:130,unit:'%'},
          '3':{min:105,good:115,great:125,unit:'%'}
        }}
      ],
      floor:100
    }
  },
  mainStats:{
    sands:['Elemental Mastery'],
    goblet:['Dendro DMG%'],
    circlet:['CRIT Rate','CRIT DMG']
  },
  substats:['Elemental Mastery','Energy Recharge','CRIT Rate','CRIT DMG','ATK%'],
  talentPriority:['skill','attack','burst'],
  weaponPriority:[
    'Light of Foliar Incision',
    'Uraku Misugiri',
    'Primordial Jade Cutter',
    'Wolf-Fang',
    'Iron Sting',
    'Mistsplitter Reforged',
    'Haran Geppaku Futsu',
    'Toukabou Shigure',
    "Xiphos' Moonlight",
    'Harbinger of Dawn'
  ],
  f2pWeapon:'Iron Sting',
  artifactPriority:[
    'Gilded Dreams',
    'Deepwood Memories',
    'Golden Troupe',
    'Marechaussee Hunter'
  ],
  artifactAlternatives:[
    '2pc Elemental Mastery + 2pc Elemental Mastery',
    '2pc Elemental Mastery + 2pc Deepwood Memories',
    '2pc Elemental Mastery + 2pc Golden Troupe',
    '2pc Emblem of Severed Fate + 2pc Elemental Mastery'
  ],
  buildSummaryTeams:[
    {name:'Quickbloom',members:['Alhaitham','Nahida','Yelan','Kuki Shinobu']},
    {name:'Spread',members:['Alhaitham','Nahida','Yae Miko','Zhongli']}
  ],
  defaultVariant:'dendro-main-dps',
  variants:[
    {
      id:'dendro-main-dps',
      name:'Dendro Main DPS',
      note:'Game8 default build when another teammate can hold Deepwood Memories.',
      overrides:{
        mainStats:{sands:['Elemental Mastery'],goblet:['Dendro DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['Elemental Mastery','Energy Recharge','CRIT Rate','CRIT DMG','ATK%'],
        artifactPriority:['Gilded Dreams','Deepwood Memories','Golden Troupe','Marechaussee Hunter'],
        weaponPriority:['Light of Foliar Incision','Uraku Misugiri','Primordial Jade Cutter','Wolf-Fang','Iron Sting','Mistsplitter Reforged','Haran Geppaku Futsu','Toukabou Shigure',"Xiphos' Moonlight",'Harbinger of Dawn'],
        goalStats:[
          {label:'Energy Recharge',value:'±130% Total Energy Recharge (Game8 default)'},
          {label:'Elemental Mastery',value:'200–300 including buffs before prioritizing CRIT in Quicken (KQM)'},
          {label:'CRIT',value:'Prioritize after ER and the practical EM threshold'}
        ],
        buildSummaryTeams:[
          {name:'Quickbloom',members:['Alhaitham','Nahida','Yelan','Kuki Shinobu']},
          {name:'Spread',members:['Alhaitham','Nahida','Yae Miko','Zhongli']}
        ]
      }
    },
    {
      id:'solo-dendro-dps',
      name:'Solo Dendro DPS',
      note:'Game8 alternative when no teammate can carry Deepwood Memories; Alhaitham uses Deepwood himself and needs substantially more ER.',
      overrides:{
        mainStats:{sands:['Elemental Mastery'],goblet:['Dendro DMG%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['Elemental Mastery','Energy Recharge','CRIT Rate','CRIT DMG','ATK%'],
        artifactPriority:['Deepwood Memories','Gilded Dreams','Golden Troupe','Marechaussee Hunter'],
        weaponPriority:['Light of Foliar Incision','Uraku Misugiri','Primordial Jade Cutter','Wolf-Fang','Iron Sting','Mistsplitter Reforged','Haran Geppaku Futsu','Toukabou Shigure',"Xiphos' Moonlight",'Harbinger of Dawn'],
        targets:{
          cr:{min:60,good:70,great:80,unit:'%'},
          cd:{min:120,good:150,great:180,unit:'%'},
          er:{min:150,good:160,great:180,unit:'%'},
          em:{min:200,good:250,great:300,unit:''}
        },
        goalStats:[
          {label:'Energy Recharge',value:'±160% Total Energy Recharge (Game8 solo-Dendro default)'},
          {label:'Elemental Mastery',value:'200–300 including buffs before prioritizing CRIT in Quicken (KQM)'},
          {label:'Advanced ER context',value:'KQM solo-Dendro rotations can reach roughly 175–220% depending on particles and Burst frequency'}
        ],
        buildSummaryTeams:[
          {name:'Quickbloom',members:['Alhaitham','Xingqiu','Raiden Shogun','Baizhu']},
          {name:'Burgeon',members:['Alhaitham','Thoma','Xingqiu','Baizhu']}
        ]
      }
    }
  ],
  goalStats:[
    {label:'Energy Recharge',value:'~130% default (Game8) · ~160% solo Dendro (Game8) · KQM solo-Dendro rotations can reach 175–220%'},
    {label:'Elemental Mastery',value:'200–300 including buffs before prioritizing CRIT in Quicken (KQM)'},
    {label:'CRIT',value:'Prioritize after ER and the practical EM threshold; Game8 does not prescribe one fixed CRIT ratio'},
    {label:'ER context',value:'Nahida + Fischl + Electro/Dendro 105–115% · Nahida 120–130% · common second-Dendro shells 130–140% (KQM)'}
  ],
  strengths:[
    'Strong on-field Dendro damage with flexible field-time through Chisel-Light Mirror management.',
    'Excellent Dendro application for Spread, Quickbloom, Hyperbloom, Burgeon, and Nilou Bloom teams.',
    'Scales well with Elemental Mastery while still benefiting from CRIT and ATK, giving him many viable weapons and artifact combinations.',
    'Can use accessible options such as Iron Sting while premium CRIT swords raise his personal damage ceiling.'
  ],
  weaknesses:[
    'Mirror timing and field-time management matter; poor rotations can sharply reduce Projection Attack uptime.',
    'Energy needs vary widely by team and Burst frequency, especially when he is the only Dendro character.',
    'He competes for on-field time and should not be paired with other field-hungry Dendro carries such as Kaveh.',
    'His relative meta position has declined as newer Dendro/Lunar-Bloom carries gained stronger specialized teams.'
  ],
  playstyleTips:[
    'Set up off-field teammates first, then enter Alhaitham’s field window with three Chisel-Light Mirrors whenever possible.',
    'Prioritize keeping three-Mirror Projection Attacks active; refresh Mirrors with Skill/Charged Attack at the correct timing rather than spending them immediately.',
    'Use EM Sands by default for both Game8 builds.',
    'If another teammate can hold Deepwood Memories, use Gilded Dreams for Alhaitham; otherwise switch to the Solo Dendro DPS build and use Deepwood himself.',
    'Level 90 is especially valuable because Spread and Bloom-family reaction damage scales strongly with character level.'
  ],
  sourceRefs:[
    {label:'Game8 Alhaitham Rating and Best Builds',kind:'Primary build and tier reference',url:'https://game8.co/games/Genshin-Impact/archives/383712'},
    {label:'Game8 Alhaitham Best Team Comps',kind:'Primary team reference',url:'https://game8.co/games/Genshin-Impact/archives/403132'},
    {label:'KQM Alhaitham Quick Guide',kind:'Theorycraft build/team cross-check',url:'https://keqingmains.com/q/alhaitham-quickguide/'},
    {label:'KQM Lauma Quick Guide',kind:'Current-version Quickbloom cross-check',url:'https://keqingmains.com/q/lauma-quickguide/'},
    {label:'HoYoLAB Alhaitham Team Building Guide',kind:'Community guide cross-check',url:'https://www.hoyolab.com/article/15129699'},
    {label:'HoYoLAB Version 4.7 Alhaitham Team Compositions',kind:'Community team cross-check',url:'https://www.hoyolab.com/article/29930749'},
    {label:'Sevy Alhaitham Guide',kind:'YouTube build/team cross-check',url:'https://www.youtube.com/watch?v=E4VU4ENmvcA'}
  ]
};
