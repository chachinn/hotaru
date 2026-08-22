export const CURRENT_ABYSS_CYCLE=Object.freeze({
  id:'7.0-2026-08',
  version:'7.0',
  label:'Version 7.0 · Aug 16–Sep 15, 2026',
  startDate:'2026-08-16',
  endDate:'2026-09-15',
  reviewedAt:'2026-08-22',
  scope:'Floors 11–12',
  blessing:'While the active character is inside a Polestar Field, damaging opponents can trigger a True DMG shockwave once every 4s.',
  floor11:{
    firstHalf:{buff:'Cryo DMG +60%',focus:['Cryo']},
    secondHalf:{buff:'Pyro DMG +60%',focus:['Pyro']}
  },
  floor12:{
    firstHalf:{
      label:'First half',
      buff:'Superconduct DMG +200% · Stellar-Conduct DMG +75%',
      focus:['Cryo','Electro'],
      preferred:['Superconduct','Stellar-Conduct'],
      summary:'Best fit: Cryo + Electro or Stellar-Conduct. Bring elemental damage, enough AoE for 12-1, and a reliable answer to the 12-2 Electro ward.',
      chambers:[
        {id:'12-1',enemies:'Ruin waves → Perpetual Mechanical Array',needs:['AoE into single-target','Elemental damage'],note:'Ruin enemies and PMA have very high Physical RES; PMA rewards focused burst during its vulnerable window.'},
        {id:'12-2',enemies:'Chimeric Horned Bear → Chimeric Winged Lion',needs:['Pyro / Cryo / Dendro for Electro ward','PHEC or Stellar reaction for orb mechanic'],note:'Stellar reactions get special interactions, but are not mandatory.'},
        {id:'12-3',enemies:'Furiosa',needs:['Single-target','Root clearing','RES reduction helpful'],note:'Destroy Hindering Roots to create a punish window; strong mobility or fast/off-field hits help.'}
      ]
    },
    secondHalf:{
      label:'Second half',
      buff:'Pyro Normal Attack DMG +75%',
      focus:['Pyro'],
      preferred:['Pyro Normal Attack'],
      summary:'Best fit: a Pyro on-field carry, especially Normal-Attack focused, with broad elemental coverage for shields and enough sustain for dangerous boss patterns.',
      chambers:[
        {id:'12-1',enemies:'Construction Specialist Mek → Icewind Suite',needs:['Single-target','Pyro strongly useful','Sustain helpful'],note:'The side is boss-heavy; do not rely on a fragile all-offense plan unless your damage is comfortably ahead.'},
        {id:'12-2',enemies:'Iniquitous Baptist → Cryo Abyss Mage',needs:['Hydro for Pyro shield','Pyro for Cryo shield','Dendro / Pyro / Cryo for Electro shield'],note:'The Baptist cycles Pyro, Cryo and Electro shields. The following Cryo Mage is Cryo-immune until its shield is broken.'},
        {id:'12-3',enemies:'Secret Source Automaton: Hunter-Seeker → Gluttonous Yumkasaur Mountain King',needs:['Single-target','Pyro','RES reduction helpful'],note:'A Natlan unit can expose the Hunter-Seeker faster, but it is not mandatory.'}
      ]
    }
  },
  sources:[
    {label:'HoYoLAB · Version 7.0 Floor 12 guide',url:'https://www.hoyolab.com/article/46354836',type:'Current-cycle community guide'},
    {label:'Mone · Spiral Abyss 7.0 guide',url:'https://www.mone.gg/blog/genshin/genshin-impact-spiral-abyss-guide.html',type:'Current-cycle community guide'},
    {label:'Genshin Impact Wiki · Spiral Abyss reset cadence',url:'https://genshin-impact.fandom.com/wiki/Spiral_Abyss',type:'Reset reference'}
  ]
});

function dateValue(value){const text=String(value||'').slice(0,10);const [y,m,d]=text.split('-').map(Number);return Number.isFinite(y)&&Number.isFinite(m)&&Number.isFinite(d)?Date.UTC(y,m-1,d):NaN}
export function abyssCycleStatus(now=new Date(),cycle=CURRENT_ABYSS_CYCLE){
  const current=Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()),start=dateValue(cycle.startDate),end=dateValue(cycle.endDate);
  if(!Number.isFinite(current)||!Number.isFinite(start)||!Number.isFinite(end))return{active:false,status:'review-needed',label:'Cycle review needed'};
  if(current<start)return{active:false,status:'upcoming',label:`Starts ${cycle.startDate}`};
  if(current>end)return{active:false,status:'review-needed',label:'Cycle review needed'};
  return{active:true,status:'current',label:'Current reviewed cycle'};
}
