export default {
  id:'alyosha-stellar-support',
  character:'Alyosha',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-24',
  role:'Electro Support / Healer',
  roleGroup:'Support',
  roleReason:'Alyosha is a short-field-time Electro support whose Skill and Burst provide Hunter’s Precision buffs, off-field Electro and healing. His premium identity is Stellar-Conduct support, while C6 and general ATK support let him function outside Stellar teams.',
  scaling:'ATK / Energy Recharge',
  scalingDetail:'ATK improves healing and personal damage; Energy Recharge is the first practical requirement because his Burst is central to healing, Electro application and rotation uptime.',
  focus:'Elemental Burst / Elemental Skill',
  reactionDriven:true,
  targets:{er:{min:145,good:180,great:220,unit:'%'},atk:{min:1800,good:2200,great:2600,unit:''},cr:{min:35,good:50,great:65,unit:'%'}},
  mainStats:{sands:['Energy Recharge','ATK%'],goblet:['ATK%'],circlet:['Healing Bonus','ATK%','CRIT Rate']},
  substats:['Energy Recharge','CRIT Rate (Favonius)','ATK%','CRIT Rate','CRIT DMG'],
  talentPriority:['burst','skill','attack'],
  weaponPriority:['Engulfing Lightning','Favonius Lance','Tamayuratei no Ohanashi','The Catch','Skyward Spine','Prototype Starglitter'],
  f2pWeapon:'The Catch',
  artifactPriority:['Heart of the Furnace','Noblesse Oblige','Instructor','Deepwood Memories','Silken Moon’s Serenade','Song of Days Past'],
  defaultVariant:'stellar-conduct-support',
  variants:[
    {
      id:'stellar-conduct-support',
      name:'Stellar-Conduct Support',
      note:'Primary Alyosha identity. Use Heart of the Furnace only when no teammate already holds it and Alyosha can trigger the Stellar reaction; otherwise use Noblesse. Meet the exact Burst rotation requirement before adding ATK or CRIT.',
      overrides:{
        role:'Stellar-Conduct Electro Support / Healer',roleGroup:'Support',focus:'Elemental Burst / Elemental Skill',
        mainStats:{sands:['Energy Recharge','ATK%'],goblet:['ATK%'],circlet:['Healing Bonus','ATK%','CRIT Rate']},
        substats:['Energy Recharge','CRIT Rate (Favonius)','ATK%','CRIT Rate','CRIT DMG'],
        weaponPriority:['Engulfing Lightning','Favonius Lance','Tamayuratei no Ohanashi','The Catch','Skyward Spine','Prototype Starglitter'],
        artifactPriority:['Heart of the Furnace','Noblesse Oblige'],
        goalStats:[
          {label:'Energy Recharge',value:'Solo Electro C0 commonly needs very high ER; one Electro teammate substantially lowers the requirement. Use the exact team rotation as the final authority.'},
          {label:'ATK',value:'About 2,000–2,800 ATK is a useful support/healing range after ER is solved.'},
          {label:'Favonius CRIT Rate',value:'Roughly 40–60% CRIT Rate is practical when Favonius Lance needs reliable procs.'}
        ],
        buildSummaryTeams:[
          {name:'Sandrone Stellar-Conduct',members:['Alyosha','Sandrone','Odette','Yae Miko']},
          {name:'Cryo Traveler Stellar-Conduct',members:['Alyosha','Cryo Traveler','Odette','Yae Miko']},
          {name:'Accessible Stellar-Conduct',members:['Alyosha','Cryo Traveler','Kaeya','Sucrose']}
        ]
      }
    },
    {
      id:'general-electro-support',
      name:'General Electro / ATK Support',
      note:'Use outside dedicated Stellar-Conduct teams when the on-fielder appreciates Alyosha’s ATK buff, healing and off-field Electro. C6 materially improves this identity with additional support value.',
      overrides:{
        role:'General Electro Support / Healer',roleGroup:'Support',focus:'Elemental Burst / Elemental Skill',
        mainStats:{sands:['Energy Recharge','ATK%'],goblet:['ATK%'],circlet:['Healing Bonus','ATK%','CRIT Rate']},
        substats:['Energy Recharge','CRIT Rate (Favonius)','ATK%'],
        weaponPriority:['Favonius Lance','Engulfing Lightning','Tamayuratei no Ohanashi','The Catch','Prototype Starglitter'],
        artifactPriority:['Noblesse Oblige','Instructor','Deepwood Memories','Silken Moon’s Serenade','Song of Days Past'],
        goalStats:[
          {label:'Energy Recharge',value:'Meet Burst uptime for the chosen rotation before investing in healing or personal damage.'},
          {label:'ATK',value:'Stack ATK after ER to strengthen healing and his general on-fielder buff package.'},
          {label:'Constellation note',value:'C6 is the major breakpoint for general-support value outside Stellar-Conduct.'}
        ],
        buildSummaryTeams:[
          {name:'Overloaded Support',members:['Alyosha','Arlecchino','Chevreuse','Bennett']},
          {name:'Lunar-Charged Support',members:['Alyosha','Flins','Columbina','Sucrose']},
          {name:'Chasca Support',members:['Alyosha','Chasca','Furina','Durin']}
        ]
      }
    }
  ],
  goalStats:[
    {label:'Energy Recharge',value:'ER varies sharply with Electro teammates, Favonius and constellations; solve Burst uptime first.'},
    {label:'ATK',value:'About 2,000–2,800 after ER is a practical healing/support target.'},
    {label:'CRIT Rate',value:'Only prioritize CRIT Rate heavily when Favonius Lance needs reliable activation.'}
  ],
  strengths:['Short field time with healing, off-field Electro and on-fielder buffs.','Strong dedicated utility for Stellar-Conduct teams.','Free-accessible character with strong ER weapon options.','Can pivot into a general Electro support role, especially at C6.'],
  weaknesses:['Cannot enable Stellar-Conduct by himself.','Personal damage is modest relative to dedicated damage dealers.','Solo-Electro C0 teams can require very high Energy Recharge.','Most buffs affect the active character rather than the whole party.'],
  playstyleTips:['Use Skill and Burst before handing field time to the main DPS.','Meet the exact ER requirement before stacking ATK.','Do not duplicate Heart of the Furnace if another teammate is already the better holder.','In non-Stellar teams, treat Alyosha as a support first rather than forcing personal damage.'],
  sourceRefs:[
    {label:'Alyosha current theorycraft quick guide',kind:'Current theorycraft',url:'https://keqingmains.com/q/alyosha-quickguide/'},
    {label:'Alyosha current build guide',kind:'Current build cross-check',url:'https://www.icy-veins.com/genshin-impact/alyosha-guide-best-builds'}
  ]
};