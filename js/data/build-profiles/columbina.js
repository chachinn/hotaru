export default {
  id:'columbina-lunar-support',
  character:'Columbina',
  aliases:['Damselette','Columbina Hyposelenia'],
  reviewed:true,
  reviewedAt:'2026-08-23',
  role:'Off-field Support / DPS',
  roleGroup:'Support',
  tierRatings:[
    {label:'Main DPS',rating:'—'},
    {label:'Sub-DPS',rating:'SS'},
    {label:'Support',rating:'SS'},
    {label:'Exploration',rating:'B'}
  ],
  voiceActors:[
    {label:'EN',name:'Emi Lo'},
    {label:'JP',name:'Lynn'},
    {label:'CN',name:'Yang Menglu (杨梦露)'},
    {label:'KR',name:'Yu Yeong (유영)'}
  ],
  roleReason:'Columbina is primarily an off-field Hydro Lunar-Reaction enabler, buffer and damage dealer. Her Skill supplies long-lasting Hydro application and Lunar damage while her Burst buffs Lunar-Charged, Lunar-Bloom and Lunar-Crystallize. She also supports a distinct on-field reaction-DPS build.',
  scaling:'HP',
  scalingDetail:'Her personal Lunar damage and buffing value scale strongly with HP, with Game8 placing the practical buff cap around 35,000 HP. ER is rotation-dependent and can be substantially higher than generic guide targets when Bursting every rotation.',
  focus:'Elemental Skill',
  reactionDriven:true,
  defaultVariant:'offfield',
  targets:{
    cr:{min:60,good:70,great:80,unit:'%'},
    cd:{min:160,good:180,great:200,unit:'%'},
    er:{min:160,good:180,great:200,unit:'%'},
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
    sands:['HP%','Energy Recharge'],
    goblet:['HP%'],
    circlet:['CRIT Rate','CRIT DMG','HP%']
  },
  substats:['HP%','Energy Recharge','CRIT Rate','CRIT DMG','Elemental Mastery'],
  talentPriority:['skill','burst','attack'],
  weaponPriority:["Nocturne's Curtain Call",'Reliquary of Truth','Sacrificial Jade','Prototype Amber','Favonius Codex',"Surf's Up",'Tome of the Eternal Flow','Waveriding Whirl'],
  f2pWeapon:'Prototype Amber',
  artifactPriority:["Silken Moon's Serenade",'Aubade of Morningstar and Moon','Tenacity of the Millelith','Deepwood Memories'],
  buildSummaryTeams:[
    {name:'Lunar-Charged · Flins Core',members:['Columbina','Ineffa','Flins','Sucrose']},
    {name:'Lunar-Crystallize · Zibai',members:['Columbina','Zibai','Illuga','Zhongli']}
  ],
  variants:[
    {
      id:'offfield',
      name:'Lunar Reactions Buffer / Support',
      note:'Default off-field build. Prioritize the HP needed for her buff cap, then the ER required by your actual team and Burst frequency, then CRIT for personal Lunar damage.',
      overrides:{
        role:'Off-field Support / DPS',roleGroup:'Support',focus:'Elemental Skill',
        mainStats:{sands:['HP%','Energy Recharge'],goblet:['HP%'],circlet:['CRIT Rate','CRIT DMG','HP%']},
        substats:['HP%','Energy Recharge','CRIT Rate','CRIT DMG','Elemental Mastery'],
        talentPriority:['skill','burst','attack'],
        weaponPriority:["Nocturne's Curtain Call",'Reliquary of Truth','Sacrificial Jade','Prototype Amber','Favonius Codex',"Surf's Up",'Tome of the Eternal Flow','Waveriding Whirl'],
        artifactPriority:["Silken Moon's Serenade",'Aubade of Morningstar and Moon','Tenacity of the Millelith','Deepwood Memories'],
        goalStats:[
          {label:'HP',value:'30,000–35,000; Game8 notes her buffing value caps around 35,000 HP'},
          {label:'Energy Recharge',value:'Game8: ~160%+ with ER weapon / ~180%+ otherwise; KQM every-rotation estimates can reach ~235–300% solo Hydro or ~165–195% with another Hydro'},
          {label:'CRIT Rate',value:'60–80% once HP and ER requirements are met'},
          {label:'CRIT DMG',value:'160–200%+ once HP and ER requirements are met'}
        ],
        buildSummaryTeams:[
          {name:'Lunar-Charged · Flins Core',members:['Columbina','Ineffa','Flins','Sucrose']},
          {name:'Lunar-Crystallize · Zibai',members:['Columbina','Zibai','Illuga','Zhongli']}
        ]
      }
    },
    {
      id:'onfield',
      name:'Lunar-Bloom / Reaction DPS',
      note:'For teams where Columbina contributes more on-field reaction damage. Hydro DMG Goblet becomes a real option; Night of the Sky’s Unveiling is strongest when she can remain on-field or swap in frequently.',
      overrides:{
        role:'On-field Lunar-Bloom DPS',roleGroup:'DPS',focus:'Charged Attack',
        targets:{cr:{min:60,good:70,great:80,unit:'%'},cd:{min:160,good:180,great:200,unit:'%'},er:{min:150,good:200,great:210,unit:'%'},em:{min:0,good:0,great:0,unit:''}},
        targetOverrides:{er:{cases:[{when:{burstCycle:'every'},bySameElement:{'0':{min:195,good:200,great:210,unit:'%'},'1':{min:150,good:160,great:175,unit:'%'},'2':{min:150,good:160,great:175,unit:'%'},'3':{min:150,good:160,great:175,unit:'%'}}},{when:{burstCycle:'everyOther'},bySameElement:{'0':{min:100,good:100,great:105,unit:'%'},'1':{min:100,good:100,great:100,unit:'%'},'2':{min:100,good:100,great:100,unit:'%'},'3':{min:100,good:100,great:100,unit:'%'}}}],favoniusReductionPerProc:12,favoniusReductionMax:36,floor:100}},
        mainStats:{sands:['HP%','Energy Recharge'],goblet:['Hydro DMG%','HP%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['CRIT Rate','CRIT DMG','HP%','Energy Recharge','Elemental Mastery'],
        talentPriority:['skill','attack','burst'],
        weaponPriority:["Nocturne's Curtain Call",'Reliquary of Truth','Prototype Amber','Sacrificial Jade','Lost Prayer to the Sacred Winds','Waveriding Whirl',"Surf's Up",'Tome of the Eternal Flow'],
        artifactPriority:['Aubade of Morningstar and Moon',"Night of the Sky's Unveiling","Silken Moon's Serenade",'Flower of Paradise Lost','Gilded Dreams'],
        goalStats:[
          {label:'HP',value:'Aim near 30,000–35,000 while preserving enough ER and CRIT for the selected rotation'},
          {label:'Energy Recharge',value:'KQM every-rotation on-field estimate: ~195–210% solo Hydro or ~150–175% with another Hydro; every-other-rotation lowers this sharply'},
          {label:'CRIT Rate',value:'60–80%'},
          {label:'CRIT DMG',value:'160–200%+'},
          {label:'Goblet',value:'Hydro DMG% is preferred when Columbina is the main reaction/driver damage source; HP% remains viable when buff scaling is the priority'}
        ],
        buildSummaryTeams:[
          {name:'On-field Lunar-Bloom',members:['Columbina','Lauma','Kuki Shinobu','Aino']},
          {name:'Nilou Lunar-Bloom',members:['Columbina','Lauma','Nilou','Nahida']}
        ]
      }
    }
  ],
  goalStats:[
    {label:'HP',value:'30,000–35,000; prioritize reaching the practical buff cap before optional damage stats'},
    {label:'Energy Recharge',value:'Highly team/rotation dependent: Game8 ~160%+ with ER weapon / ~180%+ otherwise; KQM every-rotation requirements can be much higher'},
    {label:'CRIT Rate',value:'60–80% after HP and ER requirements'},
    {label:'CRIT DMG',value:'160–200%+ after HP and ER requirements'}
  ],
  strengths:[
    'Enables and significantly buffs Lunar-Charged, Lunar-Bloom and Lunar-Crystallize.',
    'Provides strong off-field Hydro application, AoE and uptime while contributing personal Lunar damage.',
    'Raises Moonsign level and can carry supportive Catalysts such as Prototype Amber.',
    'Supports both an off-field Lunar buffer build and a distinct on-field reaction-DPS build.'
  ],
  weaknesses:[
    'ER requirements can become extremely high when Bursting every rotation in low-particle teams.',
    'Her value falls sharply when Lunar Reactions cannot be triggered reliably.',
    'On-field Lunar-Bloom is more restrictive and KQM generally rates Nefer as the stronger Lunar-Bloom on-fielder.'
  ],
  playstyleTips:[
    'Default play: use Skill for long-duration off-field Hydro/Lunar damage, use Burst when your rotation can sustain its ER cost, then swap to the team’s driver or DPS.',
    'Do not chase a generic ER number: Burst frequency, second Hydro, Favonius procs and particle generation materially change the requirement.',
    'For on-field Lunar-Bloom, use Charged Attacks during the Lunar setup and consider Hydro DMG% over HP% when Columbina is contributing a larger share of direct damage.',
    'Prefer Silken Moon’s Serenade for team value unless another teammate already holds it; Aubade and Night of the Sky’s Unveiling become more attractive for personal reaction damage.'
  ],
  sourceRefs:[
    {label:'Game8 Columbina Best Builds and Teams',kind:'Primary build reference',url:'https://game8.co/games/Genshin-Impact/archives/382106'},
    {label:'KQM Columbina Quick Guide',kind:'Current theorycraft cross-check',url:'https://keqingmains.com/q/columbina-quickguide/'},
    {label:'GameWith Columbina Best Teams',kind:'Current team cross-check',url:'https://gamewith.net/genshin-impact/article/show/72185'},
    {label:'HoYoLAB Columbina Full Character Guide',kind:'Voice actor/profile cross-check',url:'https://www.hoyolab.com/article/43265357'}
  ]
};
