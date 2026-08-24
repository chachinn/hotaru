export default {
  id:'barbara-healer',
  character:'Barbara',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-24',
  role:'Hydro Healer / Driver',
  roleGroup:'Support',
  roleReason:'Barbara is primarily an HP-scaling healer with inexpensive Hydro utility, but her Catalyst normals let her act as an on-field reaction driver and her Charged Attacks support a niche Vaporize DPS identity.',
  scaling:'HP / Healing Bonus / optional EM or CRIT',
  focus:'Elemental Skill / Elemental Burst',
  reactionDriven:true,
  targets:{hp:{min:25000,good:30000,great:35000,unit:''},er:{min:100,good:120,great:140,unit:'%'},em:{min:300,good:500,great:700,unit:''}},
  mainStats:{sands:['HP%'],goblet:['HP%'],circlet:['Healing Bonus']},
  substats:['HP%','Flat HP'],
  talentPriority:['skill','burst','attack'],
  weaponPriority:['Thrilling Tales of Dragon Slayers','Prototype Amber','Everlasting Moonglow','Sacrificial Fragments','Hakushin Ring'],
  f2pWeapon:'Thrilling Tales of Dragon Slayers',
  artifactPriority:['Ocean-Hued Clam','Maiden Beloved','Song of Days Past'],
  defaultVariant:'pure-healer',
  variants:[
    {
      id:'pure-healer',name:'Pure Healer / TTDS Support',
      note:'Default low-field-time Barbara. Stack HP and Healing Bonus, use Skill for sustained healing and Burst as emergency recovery rather than forcing Burst every rotation.',
      overrides:{
        role:'Hydro Healer / TTDS Support',roleGroup:'Support',focus:'Elemental Skill / Elemental Burst',
        mainStats:{sands:['HP%'],goblet:['HP%'],circlet:['Healing Bonus']},substats:['HP%','Flat HP'],
        weaponPriority:['Thrilling Tales of Dragon Slayers','Prototype Amber','Everlasting Moonglow'],artifactPriority:['Ocean-Hued Clam','Maiden Beloved','Song of Days Past'],
        goalStats:[{label:'HP',value:'Prioritize HP and Healing Bonus for reliable sustain.'},{label:'Energy Recharge',value:'Do not force ER for every-rotation Burst; Barbara’s Burst is commonly emergency healing.'},{label:'TTDS rotation',value:'Swap directly from Barbara into the intended ATK-scaling recipient when using Thrilling Tales.'}],
        buildSummaryTeams:[
          {name:'Freeze Sustain',members:['Barbara','Kamisato Ayaka','Kaedehara Kazuha','Shenhe']},
          {name:'Nilou Bloom Healer',members:['Barbara','Nilou','Nahida','Collei']},
          {name:'Limited Roster Sustain',members:['Barbara','Kaeya','Xiangling','Sucrose']}
        ]
      }
    },
    {
      id:'clam-driver',name:'Ocean-Hued Clam Driver',
      note:'On-field Barbara uses Normal/Charged Attacks to heal the party while driving off-field Electro/Cryo/Dendro damage. This is a real field-time identity, not a healer artifact swap.',
      overrides:{
        role:'On-field Hydro Driver / Healer',roleGroup:'Support',focus:'Elemental Skill / Normal Attack',
        mainStats:{sands:['HP%'],goblet:['HP%'],circlet:['Healing Bonus']},substats:['HP%','Flat HP','Elemental Mastery'],
        weaponPriority:['Everlasting Moonglow','Prototype Amber','Hakushin Ring','Sacrificial Fragments'],artifactPriority:['Ocean-Hued Clam'],
        goalStats:[{label:'Healing throughput',value:'Enough HP/Healing Bonus to maintain strong Clam bubbles while driving.'},{label:'Driver uptime',value:'Use Barbara’s fast Catalyst attacks to trigger teammates’ coordinated attacks and maintain Hydro.'},{label:'Reaction ownership',value:'EM is only valuable when Barbara actually owns meaningful transformative reactions.'}],
        buildSummaryTeams:[
          {name:'Electro-Charged Driver',members:['Barbara','Beidou','Fischl','Rosaria']},
          {name:'Hyperbloom Driver',members:['Barbara','Nahida','Kuki Shinobu','Fischl']},
          {name:'Burgeon Driver',members:['Barbara','Xingqiu','Thoma','Dendro Traveler']}
        ]
      }
    },
    {
      id:'vaporize-dps',name:'Vaporize Charged-Attack DPS',
      note:'Niche on-field damage build centered on Barbara owning forward Vaporize Charged Attacks. Requires enough Pyro aura and very different offensive stats from healer Barbara.',
      overrides:{
        role:'On-field Vaporize DPS',roleGroup:'Main DPS',focus:'Normal Attack / Elemental Skill',
        mainStats:{sands:['Elemental Mastery','ATK%'],goblet:['Hydro DMG%'],circlet:['CRIT Rate','CRIT DMG']},substats:['CRIT Rate','CRIT DMG','Elemental Mastery','ATK%'],
        weaponPriority:['Skyward Atlas','The Widsith','A Thousand Floating Dreams','Wandering Evenstar','Mappa Mare'],artifactPriority:['Wanderer’s Troupe','Heart of Depth + ATK%'],
        goalStats:[{label:'CRIT',value:'Build conventional DPS CRIT after securing sufficient Pyro aura.'},{label:'Elemental Mastery',value:'EM is valuable because Barbara is intended to own Vaporize Charged Attacks.'},{label:'Pyro application',value:'Use at least two reliable Pyro sources or continuous Pyro Swirl so Hydro does not overtake the aura.'}],
        buildSummaryTeams:[
          {name:'Vaporize Double Pyro',members:['Barbara','Bennett','Xiangling','Zhongli']},
          {name:'Vaporize Anemo',members:['Barbara','Bennett','Jean','Kaedehara Kazuha']},
          {name:'Vaporize Sucrose',members:['Barbara','Bennett','Xiangling','Sucrose']}
        ]
      }
    }
  ],
  strengths:['Free and easy to gear as a dedicated healer.','Can hold Thrilling Tales for inexpensive offensive support.','Catalyst attacks give controllable on-field Hydro application.','C6 provides a unique automatic revival safety net.'],
  weaknesses:['Skill periodically applies Hydro to the active character, increasing Freeze vulnerability.','Skill generates no particles, so Burst energy is awkward.','Off-field Hydro range/application is limited.','DPS variants demand field time and careful aura/stamina management.'],
  playstyleTips:['Use Skill for sustained healing and Burst as emergency teamwide recovery.','When using TTDS, swap from Barbara directly into the intended buff recipient.','Use the Clam Driver build only when Barbara is actually taking field time.','For Vaporize DPS, preserve Pyro aura and manage Charged Attack stamina.'],
  sourceRefs:[
    {label:'Barbara Quick Guide',kind:'Theorycraft reference',url:'https://keqingmains.com/q/barbara-quickguide/'},
    {label:'Barbara Extended Guide',kind:'Mechanics cross-check',url:'https://keqingmains.com/barbara/'},
    {label:'Current 7.0 roster context',kind:'Current-version cross-check',url:'https://www.icy-veins.com/genshin-impact/tier-list'}
  ]
};