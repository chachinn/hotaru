export default {
  id:'odette-stellar-sub-dps',
  character:'Odette',
  aliases:[],
  reviewed:true,
  reviewedAt:'2026-08-23',
  role:'Off-field Sub-DPS / Stellar Support',
  roleGroup:'Sub DPS',
  roleRatings:[
    {label:'Main DPS',rating:'Not primary'},
    {label:'Sub-DPS',rating:'Primary'},
    {label:'Support',rating:'Primary'},
    {label:'Exploration',rating:'Standard'}
  ],
  roleReason:'Odette is an off-field Cryo Stellar Linchpin whose Skill provides personal Stellar/Cryo damage while enabling and buffing Stellar reactions for the team.',
  scaling:'ATK',
  focus:'Elemental Skill',
  reactionDriven:true,
  targets:{
    cr:{min:60,good:75,great:80,unit:'%'},
    cd:{min:120,good:160,great:190,unit:'%'},
    er:{min:100,good:120,great:150,unit:'%'},
    em:{min:100,good:150,great:200,unit:''}
  },
  mainStats:{
    sands:['ATK%'],
    goblet:['ATK%'],
    circlet:['CRIT Rate / CRIT DMG']
  },
  substats:['CRIT Rate','CRIT DMG','ATK%','Elemental Mastery','Energy Recharge'],
  talentPriority:['skill','burst','attack'],
  weaponPriority:[
    'Whitelake Frostfeather',
    'Absolution',
    'Primordial Jade Cutter',
    'Azurelight',
    'Light of Foliar Incision',
    'Uraku Misugiri',
    'Mistsplitter Reforged',
    'Finale of the Deep',
    'Freedom-Sworn'
  ],
  f2pWeapon:'Finale of the Deep',
  artifactPriority:[
    'Heart of the Furnace',
    'Scarlet Proof',
    'Disenchantment in Deep Shadow'
  ],
  goalStats:[
    {label:'ATK',value:'About 2,400+ before chasing extra EM; higher ATK continues to improve her Stellar damage passive.'},
    {label:'CRIT',value:'Aim toward roughly 80% CRIT Rate / 160% CRIT DMG with a balanced ratio.'},
    {label:'Elemental Mastery',value:'About 150–200 is useful after CRIT and ATK; EM is secondary, not her primary scaling stat.'},
    {label:'Energy Recharge',value:'Meet only the ER your chosen rotation needs; do not replace ATK/CRIT with unnecessary ER.'}
  ],
  strengths:[
    'Enables Stellar-Conduct and Stellar Swirl through her Stellar Linchpin.',
    'Contributes meaningful off-field personal damage while supporting Stellar teams.',
    'Benefits strongly from offensive ATK and CRIT investment instead of an EM-only support build.'
  ],
  weaknesses:[
    'Provides no sustain, so teams still need a healer or shielder when required.',
    'Her strongest value is concentrated in Stellar-reaction teams.',
    'Some generic DMG% weapon buffs do not improve direct Stellar reaction damage.'
  ],
  playstyleTips:[
    'Use Elemental Skill to deploy Odette’s off-field Dance Double, then use the special Skill state as your main personal-damage contribution.',
    'Prioritize CRIT and ATK before EM; EM is a useful secondary Stellar stat rather than the build’s scaling foundation.',
    'Use Burst when the rotation can support it without sacrificing the offensive stats that drive her main damage.'
  ],
  sourceRefs:[
    {label:'GameWith Odette Best Build Guide',kind:'Current build-guide cross-check',url:'https://gamewith.net/genshin-impact/article/show/76476'}
  ]
};
