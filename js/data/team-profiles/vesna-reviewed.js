const ICY='https://www.icy-veins.com/genshin-impact/vesna-team-guide';
const PRYDWEN='https://www.prydwen.gg/genshin-impact/characters/vodyanitsa';
const source=(label,url,type='Reviewed guide')=>({label,url,platform:'Guide',type,reviewedAt:'2026-09-29'});
const icy=()=>source('Vesna Team Guide',ICY);
const prydwen=()=>source('Vodyanitsa Team Calculations',PRYDWEN,'Reviewed theorycraft cross-check');
const team=(id,name,members,why,sourceInfo,options={})=>({
  id,name,members,reaction:'stellar-swirl',why,
  notes:options.notes||'',
  provenance:options.provenance||'exact',
  confidence:options.provenance==='adapted'?'Source-informed':'Reviewed',
  source:sourceInfo,
  anchor:'Vesna',
  profileId:'vesna-stellar-swirl-dps',
  ...(options.constraints?{constraints:options.constraints}:{})
});

export const VESNA_REVIEWED_TEAMS=[
  team('vesna-vodyanitsa-faruzan-odette','Stellar-Swirl · Vodyanitsa + Faruzan',['Vesna','Vodyanitsa','Faruzan','Odette'],'Vodyanitsa supplies sustain and Stellar-Swirl support while Faruzan and Odette reinforce Vesna’s Anemo/Cryo reaction core.',icy()),
  team('vesna-vodyanitsa-traveler-odette','Stellar-Swirl · Vodyanitsa + Cryo Traveler',['Vesna','Vodyanitsa','Cryo Traveler','Odette'],'Cryo Traveler and Odette provide the Cryo-side reaction engine while Vodyanitsa adds healing, interruption resistance, and Stellar-Swirl support.',icy()),
  team('vesna-traveler-faruzan-odette','Stellar-Swirl · Faruzan + Cryo Traveler',['Vesna','Cryo Traveler','Faruzan','Odette'],'Cryo Traveler and Odette maintain strong Cryo-side Stellar-Swirl contribution while Faruzan supports the Anemo side.',icy()),
  team('vesna-traveler-faruzan-diona','Stellar-Swirl · Diona sustain',['Vesna','Cryo Traveler','Faruzan','Diona'],'Diona adds sustain and Cryo support while Cryo Traveler and Faruzan support Vesna’s Stellar-Swirl field time.',icy()),
  team('vesna-vodyanitsa-faruzan-escoffier','Stellar-Swirl · Vodyanitsa + Escoffier',['Vesna','Vodyanitsa','Faruzan','Escoffier'],'Escoffier supplies off-field Cryo while Vodyanitsa covers sustain and Faruzan supports Vesna’s Anemo damage.',icy()),
  team('vesna-qiqi-sucrose-diona','Stellar-Swirl · Qiqi + Sucrose',['Vesna','Qiqi','Sucrose','Diona'],'A sustain-heavy Stellar-Swirl option using Qiqi and Diona for Cryo presence with Sucrose providing Anemo and EM-oriented support.',icy()),
  team('vesna-lanyan-traveler-qiqi','Stellar-Swirl · Lan Yan + Cryo Traveler',['Vesna','Lan Yan','Cryo Traveler','Qiqi'],'Cryo Traveler and Qiqi maintain the Cryo side while Lan Yan supplies defensive support around Vesna’s on-field window.',icy()),
  team('vesna-venti-nicole-odette','Stellar-Swirl · Nicole + Venti',['Vesna','Venti','Nicole','Odette'],'Nicole contributes teamwide offensive support, Odette supplies the Cryo Stellar core, and Venti fills the additional Anemo slot.',icy()),
  team('vesna-qiqi-odette-c6-faruzan','Stellar-Swirl · Qiqi premium alternative',['Vesna','Qiqi','Odette','Faruzan'],'A sustain alternative to Vodyanitsa that keeps Odette and a fully developed Faruzan around Vesna.',prydwen(),{constraints:{faruzanMinConstellation:6},notes:'This specific comparison assumes C6 Faruzan.'}),
  team('vesna-c6-diona-odette-c6-faruzan','Stellar-Swirl · Diona premium alternative',['Vesna','Diona','Odette','Faruzan'],'A shield-and-heal alternative using Diona with Odette and Faruzan around Vesna.',prydwen(),{constraints:{dionaMinConstellation:6,faruzanMinConstellation:6},notes:'This specific comparison assumes C6 Diona and C6 Faruzan.'}),
  team('vesna-nicole-odette-c6-faruzan','Stellar-Swirl · Nicole support',['Vesna','Nicole','Odette','Faruzan'],'Nicole provides shielding and ATK support while Odette and Faruzan support Vesna’s Stellar-Swirl damage.',prydwen(),{constraints:{faruzanMinConstellation:6},notes:'This specific comparison assumes C6 Faruzan.'})
];

export default VESNA_REVIEWED_TEAMS;
