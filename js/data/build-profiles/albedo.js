export default {
  id:'albedo-geo-offfield',
  character:'Albedo',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-23',
  role:'Off-field Geo Sub-DPS / Hexerei Support',
  roleGroup:'Sub-DPS',
  tierRatings:[
    {label:'Main DPS',rating:'—'},
    {label:'Sub-DPS',rating:'A'},
    {label:'Support',rating:'A'},
    {label:'Exploration',rating:'B'}
  ],
  voiceActors:[
    {label:'EN',name:'Khoi Dao'},
    {label:'JP',name:'Nojima Kenji (野島健児)'},
    {label:'CN',name:'Mace'},
    {label:'KR',name:'Kim Myung-jun (김명준)'}
  ],
  roleReason:'Albedo is primarily an off-field Geo damage dealer whose Elemental Skill supplies long-duration DEF-scaling damage. His current Hexerei passives also let him contribute team buffs, creating a real choice between maximizing personal damage and pushing DEF higher for team utility.',
  scaling:'DEF',
  scalingDetail:'Transient Blossoms and current Hexerei value scale primarily with DEF. CRIT remains important for personal damage. His Burst is ATK-scaling and optional in many rotations, so forcing ATK into his main build is usually inefficient.',
  focus:'Elemental Skill',
  reactionDriven:false,
  energyCost:40,
  defaultVariant:'offfield-personal-damage',
  mainStats:{sands:['DEF%'],goblet:['Geo DMG%','DEF%'],circlet:['CRIT Rate','CRIT DMG','DEF%']},
  substats:['CRIT Rate','CRIT DMG','DEF%','Energy Recharge'],
  talentPriority:['skill','burst','attack'],
  weaponPriority:['Uraku Misugiri','Peak Patrol Song','Cinnabar Spindle','Primordial Jade Cutter','Wolf-Fang','Flute of Ezpitzal','Harbinger of Dawn'],
  f2pWeapon:'Flute of Ezpitzal',
  artifactPriority:['Husk of Opulent Dreams','Golden Troupe'],
  targets:{
    def:{min:2000,good:2300,great:3000,unit:''},
    cr:{min:60,good:65,great:70,unit:'%'},
    cd:{min:140,good:160,great:180,unit:'%'},
    er:{min:100,good:120,great:140,unit:'%'}
  },
  variants:[
    {
      id:'offfield-personal-damage',name:'Off-field Personal Damage',
      note:'Default off-field DPS build. Prioritize Skill damage, DEF and CRIT. Husk and Golden Troupe are the main sets; Uraku Misugiri is the strongest personal-damage weapon.',
      overrides:{
        mainStats:{sands:['DEF%'],goblet:['Geo DMG%','DEF%'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['CRIT Rate','CRIT DMG','DEF%','Energy Recharge'],
        weaponPriority:['Uraku Misugiri','Cinnabar Spindle','Peak Patrol Song','Primordial Jade Cutter','Wolf-Fang','Flute of Ezpitzal','Harbinger of Dawn'],
        artifactPriority:['Husk of Opulent Dreams','Golden Troupe'],
        goalStats:[
          {label:'DEF',value:'2,000+ baseline; around 2,300 is a strong personal-damage stopping point'},
          {label:'CRIT Rate',value:'60–70%'},
          {label:'CRIT DMG',value:'140%+'},
          {label:'Energy Recharge',value:'Ignore ER if skipping Burst · C0 Burst every rotation: ~120–140% with 2+ Geo or ~130–150% solo Geo'}
        ],
        buildSummaryTeams:[
          {name:'Hexerei Itto',members:['Albedo','Arataki Itto','Durin','Gorou']},
          {name:'Navia Flex',members:['Albedo','Navia','Fischl','Bennett']}
        ]
      }
    },
    {
      id:'hexerei-team-buff',name:'Hexerei Team-Buff / High DEF',
      note:'Use when maximizing Albedo’s Hexerei team utility matters more than his own peak CRIT damage. Push DEF toward the passive threshold, with Peak Patrol Song becoming especially valuable for team damage.',
      overrides:{
        mainStats:{sands:['DEF%'],goblet:['DEF%','Geo DMG%'],circlet:['DEF%','CRIT Rate','CRIT DMG']},
        substats:['DEF%','CRIT Rate','CRIT DMG','Energy Recharge'],
        weaponPriority:['Peak Patrol Song','Uraku Misugiri','Cinnabar Spindle','Flute of Ezpitzal','Harbinger of Dawn','Wolf-Fang'],
        artifactPriority:['Husk of Opulent Dreams','Golden Troupe'],
        goalStats:[
          {label:'DEF',value:'Aim for ~3,000 DEF to maximize the standard Hexerei buff threshold; some Lunar-Crystallize/Ascendant Gleam contexts can reward even higher DEF'},
          {label:'CRIT',value:'Keep useful CRIT after meeting the chosen DEF target; do not force CRIT ahead of the support threshold'},
          {label:'Energy Recharge',value:'Only build ER if using Burst; ~120–140% with 2+ Geo or ~130–150% solo Geo at C0'},
          {label:'Weapon context',value:'Peak Patrol Song prioritizes team damage; Uraku Misugiri prioritizes Albedo personal damage'}
        ],
        buildSummaryTeams:[
          {name:'Hexerei Klee',members:['Albedo','Klee','Durin','Xilonen']},
          {name:'Lunar-Crystallize',members:['Albedo','Zibai','Illuga','Columbina']}
        ]
      }
    }
  ],
  goalStats:[
    {label:'DEF',value:'2,000–2,300+ personal damage · ~3,000 for Hexerei team-buff focus'},
    {label:'CRIT Rate',value:'60–70%'},
    {label:'CRIT DMG',value:'140%+'},
    {label:'Energy Recharge',value:'No Burst: ignore ER · Burst every rotation at C0: ~120–140% with 2+ Geo / ~130–150% solo Geo'},
    {label:'Constellation context',value:'C1 lowers ER needs substantially; C2 generally makes Burst less attractive for damage efficiency, while C6 can value Burst again'}
  ],
  strengths:[
    'Very low field-time requirement with long-lasting off-field Geo damage.',
    'Current Hexerei passives significantly improve both personal damage and team utility when paired with another Hexerei character.',
    'Strong synergy with Geo Resonance and DEF/Geo support options such as Xilonen and Gorou.',
    'Flexible enough to function as an off-field flex when his Geo application does not disrupt the team’s reaction plan.'
  ],
  weaknesses:[
    'Geo construct placement can still be awkward around bosses outside Hexerei protection.',
    'Maximum Hexerei value requires another Hexerei teammate.',
    'Split scaling makes Burst investment less efficient than Skill-focused investment in many builds.',
    'Geo application can be undesirable in reaction teams that need strict aura control for Vaporize or Melt.'
  ],
  playstyleTips:[
    'Keep the Skill active and refresh/reposition it when enemies move away from its area.',
    'Use a quick Normal Attack after Skill when the rotation benefits from immediately triggering a Transient Blossom or Peak Patrol Song setup.',
    'Do not build ER just because Albedo has a Burst; skip Burst entirely when the rotation gains more from faster swaps.',
    'Pair with at least one other Hexerei character when possible to activate his current Hexerei upgrades.',
    'Choose the high-DEF build only when the extra team buff is actually valuable; otherwise keep stronger personal-damage CRIT balance.'
  ],
  sourceRefs:[
    {label:'Game8 Albedo Rating and Best Builds',kind:'Primary build/tier/team structure',url:'https://game8.co/games/Genshin-Impact/archives/312182'},
    {label:'KQM Albedo Quick Guide',kind:'Current Luna V theorycraft / Hexerei / ER cross-check',url:'https://keqingmains.com/q/albedo-quickguide/'},
    {label:'Game8 Albedo Story and Profile',kind:'Profile and four-language voice-actor cross-check',url:'https://game8.co/games/Genshin-Impact/archives/321594'}
  ]
};