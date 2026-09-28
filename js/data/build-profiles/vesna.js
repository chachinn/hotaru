export default {
  id:'vesna-stellar-swirl-dps',
  character:'Vesna',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-09-29',
  role:'On-field Stellar-Swirl DPS',
  roleGroup:'DPS',
  roleReason:'Vesna is an on-field Anemo carry who both enables Stellar Swirl and deals large amounts of direct Stellar-Swirl damage during her Elemental Skill window.',
  scaling:'ATK',
  scalingDetail:'Her reviewed build balances CRIT first, then ATK and Elemental Mastery. ATK and EM are close enough that the better main stat can depend on weapon and team buffs.',
  focus:'Elemental Skill',
  reactionDriven:true,
  defaultVariant:'stellar-swirl',
  targets:{
    cr:{min:69,good:75,great:84,unit:'%'},
    cd:{min:180,good:200,great:220,unit:'%'},
    er:{min:100,good:120,great:140,unit:'%'},
    em:{min:100,good:150,great:200,unit:''}
  },
  mainStats:{
    sands:['ATK%','Elemental Mastery'],
    goblet:['ATK%','Elemental Mastery'],
    circlet:['CRIT Rate','CRIT DMG']
  },
  substats:['CRIT Rate','CRIT DMG','ATK%','Elemental Mastery','Energy Recharge'],
  talentPriority:['skill','burst','attack'],
  weaponPriority:[
    'Beyond the Chrysalis',
    'Whitelake Frostfeather',
    'New Bough',
    'Light of Foliar Incision',
    'Absolution',
    'Uraku Misugiri',
    'Emberwell',
    'Azurelight',
    'Primordial Jade Cutter',
    'Freedom-Sworn',
    'Silver Light',
    'Finale of the Deep',
    'Wolf-Fang',
    'Iron Sting'
  ],
  f2pWeapon:'Emberwell',
  artifactPriority:['Scarlet Proof','Viridescent Venerer'],
  buildSummaryTeams:[
    {name:'Stellar-Swirl · Vodyanitsa core',members:['Vesna','Vodyanitsa','Cryo Traveler','Odette']},
    {name:'Stellar-Swirl · Faruzan core',members:['Vesna','Cryo Traveler','Faruzan','Odette']},
    {name:'Stellar-Swirl · accessible sustain',members:['Vesna','Cryo Traveler','Faruzan','Diona']}
  ],
  variants:[
    {
      id:'stellar-swirl',
      name:'Stellar-Swirl On-field DPS',
      note:'Vesna has one materially distinct reviewed build: stay on-field for her Skill damage window, maintain a reliable Cryo source for Stellar Swirl, and balance CRIT with ATK and EM rather than forcing a Full-EM setup.',
      overrides:{
        role:'On-field Stellar-Swirl DPS',
        roleGroup:'DPS',
        focus:'Elemental Skill',
        mainStats:{sands:['ATK%','Elemental Mastery'],goblet:['ATK%','Elemental Mastery'],circlet:['CRIT Rate','CRIT DMG']},
        substats:['CRIT Rate','CRIT DMG','ATK%','Elemental Mastery','Energy Recharge'],
        talentPriority:['skill','burst','attack'],
        weaponPriority:['Beyond the Chrysalis','Whitelake Frostfeather','New Bough','Light of Foliar Incision','Absolution','Uraku Misugiri','Emberwell','Azurelight','Primordial Jade Cutter','Freedom-Sworn','Silver Light','Finale of the Deep','Wolf-Fang','Iron Sting'],
        artifactPriority:['Scarlet Proof','Viridescent Venerer'],
        goalStats:[
          {label:'ATK',value:'Aim around 2,600+ before trading good CRIT rolls away; exact value changes with weapon and team buffs.'},
          {label:'Elemental Mastery',value:'100+ is a useful baseline. ATK and EM remain close enough that stronger substats can decide between them.'},
          {label:'Energy Recharge',value:'About 100–130% in common teams; roughly 120–140% with a second Anemo and potentially 150–170% without one if the rotation needs Burst consistently.'},
          {label:'CRIT Rate',value:'About 69–84% before temporary bonuses; avoid overcapping with Scarlet Proof and Cryo Resonance.'},
          {label:'CRIT DMG',value:'About 180%+ after meeting CRIT Rate and rotation needs.'}
        ],
        buildSummaryTeams:[
          {name:'Stellar-Swirl · Vodyanitsa core',members:['Vesna','Vodyanitsa','Cryo Traveler','Odette']},
          {name:'Stellar-Swirl · Faruzan core',members:['Vesna','Cryo Traveler','Faruzan','Odette']},
          {name:'Stellar-Swirl · accessible sustain',members:['Vesna','Cryo Traveler','Faruzan','Diona']}
        ]
      }
    }
  ],
  goalStats:[
    {label:'ATK',value:'Aim around 2,600+ before sacrificing strong CRIT rolls.'},
    {label:'Elemental Mastery',value:'100+ baseline; more remains valuable after CRIT and ATK are healthy.'},
    {label:'Energy Recharge',value:'Common target 100–130%, with higher needs when the team lacks a second Anemo battery.'},
    {label:'CRIT Rate',value:'About 69–84% before temporary bonuses.'},
    {label:'CRIT DMG',value:'About 180%+.'}
  ],
  strengths:[
    'Enables Stellar Swirl herself while also dealing large direct Stellar-Swirl damage.',
    'Scales well with both ATK and Elemental Mastery, allowing flexible artifact optimization.',
    'Has strong reviewed synergy with Odette, Cryo Traveler, Faruzan and Vodyanitsa.'
  ],
  weaknesses:[
    'Needs reliable Cryo application to keep Stellar-Swirl output consistent.',
    'Her important damage window is on-field, so pairing her with another field-hungry carry is inefficient.',
    'Energy needs rise noticeably when she is the only Anemo unit and the rotation relies on her Burst.'
  ],
  playstyleTips:[
    'Set up off-field Cryo and team buffs before entering Vesna’s Skill window.',
    'Keep Vesna on-field through the important Skill sequence instead of treating her as a quickswap Skill user.',
    'Do not force Full EM: her reviewed damage profile wants CRIT plus a balanced mix of ATK and EM.'
  ],
  sourceRefs:[
    {label:'Icy Veins Vesna Build Guide',kind:'Current build reference',url:'https://www.icy-veins.com/genshin-impact/vesna-guide-best-builds'},
    {label:'Icy Veins Vesna Team Guide',kind:'Current team reference',url:'https://www.icy-veins.com/genshin-impact/vesna-team-guide'}
  ]
};
