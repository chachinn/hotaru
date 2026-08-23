const KQM='https://keqingmains.com/q/chasca-quickguide/';
const GAME8='https://game8.co/games/Genshin-Impact/archives/462001';
const source=(label,url,type='Reviewed theorycraft')=>({label,url,type,platform:'Guide',reviewedAt:'2026-08-23'});
const kqm=()=>source('KQM Chasca Quick Guide',KQM);
const game8=()=>source('Game8 Chasca Best Builds and Teams',GAME8,'Source-backed guide');
const confidenceFor=s=>s?.type==='Reviewed theorycraft'?'Reviewed':'Community-sourced';
const team=(id,name,members,reaction,why,src,notes='',provenance='exact')=>({id,name,members,reaction,why,notes,provenance,confidence:confidenceFor(src),source:src,anchor:'Chasca',profileId:'chasca'});
export const CHASCA_REVIEWED_TEAMS=[
  team('chasca-game8-rainbow-mavuika-ororon-citlali','Rainbow · Mavuika/Ororon/Citlali',['Chasca','Mavuika','Ororon','Citlali'],'rainbow','Game8 exact Rainbow team with three PHEC Elements.',game8()),
  team('chasca-game8-rainbow-durin-fischl-citlali','Rainbow · Durin/Fischl/Citlali',['Chasca','Durin','Fischl','Citlali'],'rainbow','Game8 exact Rainbow team.',game8()),
  team('chasca-game8-lunar-ineffa-columbina-bennett','Lunar-Charged · Ineffa/Columbina/Bennett',['Chasca','Ineffa','Columbina','Bennett'],'lunar-charged','Game8 exact Lunar-Charged Rainbow team.',game8()),
  team('chasca-game8-overvape-ororon-furina-bennett','Overvape · Ororon/Furina/Bennett',['Chasca','Ororon','Furina','Bennett'],'overvape','Game8 exact Rainbow/Overvape team and KQM core archetype.',{...game8(),links:[game8(),kqm()]}),
  team('chasca-game8-vapemelt-furina-bennett-citlali','Vapemelt · Furina/Bennett/Citlali',['Chasca','Furina','Bennett','Citlali'],'vapemelt','Game8 exact Rainbow/Vapemelt team and current KQM premium core.',{...game8(),links:[game8(),kqm()]}),
  team('chasca-game8-melt-mavuika-bennett-citlali','Melt · Mavuika/Bennett/Citlali',['Chasca','Mavuika','Bennett','Citlali'],'melt','Game8 exact Melt team and KQM exact example shell.',{...game8(),links:[game8(),kqm()]}),
  team('chasca-game8-melt-escoffier-citlali-bennett','Melt · Escoffier/Citlali/Bennett',['Chasca','Escoffier','Citlali','Bennett'],'melt','Game8 exact double-Cryo Melt team.',game8()),
  team('chasca-game8-vape-furina-xiangling-bennett','Vaporize · Furina/Xiangling/Bennett',['Chasca','Furina','Xiangling','Bennett'],'vaporize','Game8 exact Vaporize team.',game8()),
  team('chasca-game8-vape-furina-dehya-xilonen','Vaporize · Furina/Dehya/Xilonen',['Chasca','Furina','Dehya','Xilonen'],'vaporize','Game8 exact Vaporize team with non-PHEC Xilonen utility.',game8(),'Xilonen is more comfortable at C1+ Chasca because non-PHEC teammates reduce conversion value at C0.'),
  team('chasca-game8-ec-ineffa-ororon-columbina','Lunar-Charged · Ineffa/Ororon/Columbina',['Chasca','Ineffa','Ororon','Columbina'],'lunar-charged','Game8 exact Lunar-Charged team.',game8()),
  team('chasca-game8-ec-fischl-ororon-kokomi','Electro-Charged · Fischl/Ororon/Kokomi',['Chasca','Fischl','Ororon','Sangonomiya Kokomi'],'electro-charged','Game8 exact Electro-Charged team.',game8()),
  team('chasca-game8-overload-yae-dehya-bennett','Overload · Yae/Dehya/Bennett',['Chasca','Yae Miko','Dehya','Bennett'],'overload','Game8 exact Overload team.',game8()),
  team('chasca-game8-overload-fischl-xiangling-bennett','Overload · Fischl/Xiangling/Bennett',['Chasca','Fischl','Xiangling','Bennett'],'overload','Game8 exact Overload team.',game8()),

  team('chasca-kqm-overvape-ineffa-furina-bennett','Overvape · Ineffa/Furina/Bennett',['Chasca','Ineffa','Furina','Bennett'],'overvape','KQM identifies Bennett/Furina as the core and Ineffa as a strong Electro/Lunar-Charged option.',kqm(),'Source-informed from KQM Overvape roles.','adapted'),
  team('chasca-kqm-overvape-fischl-furina-bennett','Overvape · Fischl/Furina/Bennett',['Chasca','Fischl','Furina','Bennett'],'overvape','KQM supports Fischl as an off-field Electro option in the Bennett/Furina core.',kqm(),'Source-informed from KQM Overvape roles.','adapted'),
  team('chasca-kqm-overvape-yae-furina-bennett','Overvape · Yae/Furina/Bennett',['Chasca','Yae Miko','Furina','Bennett'],'overvape','KQM supports Yae as an Electro off-field damage option.',kqm(),'Source-informed from KQM Overvape roles.','adapted'),
  team('chasca-kqm-overvape-iansan-furina-bennett','Overvape · Iansan/Furina/Bennett',['Chasca','Iansan','Furina','Bennett'],'overvape','KQM highlights Iansan as a strong ATK buffer whose movement condition Chasca naturally satisfies.',kqm(),'Source-informed current teammate variant.','adapted'),
  team('chasca-kqm-vape-mona-pyrotrav-bennett','Vaporize · Mona/Pyro Traveler/Bennett',['Chasca','Mona','Pyro Traveler','Bennett'],'vaporize','KQM presents this as an accessible Vaporize setup with Pyro Traveler on Scroll.',kqm()),
  team('chasca-kqm-vape-furina-mavuika-bennett','Vaporize · Furina/Mavuika/Bennett',['Chasca','Furina','Mavuika','Bennett'],'vaporize','KQM rates Mavuika as one of Chasca’s best Pyro teammates and Furina/Bennett as premier Vape partners.',kqm(),'Source-informed role combination.','adapted'),
  team('chasca-kqm-vape-furina-pyrotrav-bennett','Vaporize · Furina/Pyro Traveler/Bennett',['Chasca','Furina','Pyro Traveler','Bennett'],'vaporize','KQM supports Pyro Traveler as a Scroll holder with minimal conflicting Pyro application.',kqm(),'Source-informed role combination.','adapted'),
  team('chasca-kqm-vape-mona-mavuika-bennett','Vaporize · Mona/Mavuika/Bennett',['Chasca','Mona','Mavuika','Bennett'],'vaporize','KQM supports Mona as Hydro buff/application and Mavuika as premium Pyro damage/buffing.',kqm(),'Source-informed role combination.','adapted'),

  team('chasca-kqm-melt-rosaria-pyrotrav-bennett','Melt · Rosaria/Pyro Traveler/Bennett',['Chasca','Rosaria','Pyro Traveler','Bennett'],'melt','KQM exact accessible Melt example.',kqm()),
  team('chasca-kqm-melt-escoffier-pyrotrav-bennett','Melt · Escoffier/Pyro Traveler/Bennett',['Chasca','Escoffier','Pyro Traveler','Bennett'],'melt','KQM exact accessible Melt example.',kqm()),
  team('chasca-kqm-melt-citlali-xiangling-bennett','Melt · Citlali/Xiangling/Bennett',['Chasca','Citlali','Xiangling','Bennett'],'melt','KQM exact Citlali/Xiangling Melt example.',kqm()),
  team('chasca-kqm-melt-citlali-rosaria-bennett','Melt · Citlali/Rosaria/Bennett',['Chasca','Citlali','Rosaria','Bennett'],'melt','KQM exact double-Cryo Melt example.',kqm()),
  team('chasca-kqm-melt-citlali-shenhe-bennett','Melt · Citlali/Shenhe/Bennett',['Chasca','Citlali','Shenhe','Bennett'],'melt','KQM exact double-Cryo Melt example.',kqm()),
  team('chasca-kqm-melt-citlali-layla-bennett','Melt · Citlali/Layla/Bennett',['Chasca','Citlali','Layla','Bennett'],'melt','KQM lists Layla as a Cryo shield/buff option in Melt.',kqm(),'Source-informed from KQM Cryo teammate list.','adapted'),
  team('chasca-kqm-melt-escoffier-mavuika-bennett','Melt · Escoffier/Mavuika/Bennett',['Chasca','Escoffier','Mavuika','Bennett'],'melt','KQM supports Escoffier as off-field Cryo damage/healing and Mavuika as premium Pyro partner.',kqm(),'Source-informed role combination.','adapted'),

  team('chasca-kqm-vapemelt-furina-bennett-escoffier','Vapemelt · Furina/Bennett/Escoffier',['Chasca','Furina','Bennett','Escoffier'],'vapemelt','KQM premium Vapemelt variant with Furina/Bennett and Escoffier.',kqm()),
  team('chasca-kqm-vapemelt-mona-bennett-citlali','Vapemelt · Mona/Bennett/Citlali',['Chasca','Mona','Bennett','Citlali'],'vapemelt','KQM supports Mona as Hydro buff/application and Citlali as a premier Cryo option.',kqm(),'Source-informed Vapemelt variant.','adapted'),
  team('chasca-kqm-vapemelt-furina-bennett-rosaria','Vapemelt · Furina/Bennett/Rosaria',['Chasca','Furina','Bennett','Rosaria'],'vapemelt','KQM supports Rosaria as off-field Cryo in Furina/Bennett Vapemelt.',kqm(),'Source-informed Vapemelt variant.','adapted'),
  team('chasca-kqm-vapemelt-furina-bennett-shenhe','Vapemelt · Furina/Bennett/Shenhe',['Chasca','Furina','Bennett','Shenhe'],'vapemelt','KQM supports Shenhe as Cryo-shell buffer in Vapemelt.',kqm(),'Source-informed Vapemelt variant.','adapted'),
  team('chasca-kqm-freeze-furina-citlali-escoffier','Freeze · Furina/Citlali/Escoffier',['Chasca','Furina','Citlali','Escoffier'],'freeze','KQM supports Furina plus strong Cryo application/sustain when Bennett is omitted for a true Freeze dynamic.',kqm(),'Source-informed Freeze variant.','adapted'),
  team('chasca-kqm-freeze-mona-citlali-layla','Freeze · Mona/Citlali/Layla',['Chasca','Mona','Citlali','Layla'],'freeze','KQM lists Mona, Citlali and Layla as compatible Hydro/Cryo options for Freeze.',kqm(),'Source-informed Freeze variant.','adapted'),

  team('chasca-kqm-lunar-ineffa-furina-bennett','Lunar-Charged · Ineffa/Furina/Bennett',['Chasca','Ineffa','Furina','Bennett'],'lunar-charged','KQM notes Ineffa opens Lunar-Charged while Furina/Bennett remain premier Hydro/Pyro support.',kqm(),'Source-informed current Lunar-Charged variant.','adapted'),
  team('chasca-kqm-lunar-ineffa-columbina-citlali','Lunar-Charged · Ineffa/Columbina/Citlali',['Chasca','Ineffa','Columbina','Citlali'],'lunar-charged','Game8 and KQM both support Ineffa/Columbina as Lunar-Charged pieces; Citlali adds Cryo shell conversion, shield and RES shred.',{...kqm(),links:[kqm(),game8()]},'Source-informed cross-source variant.','adapted'),
  team('chasca-kqm-rainbow-mavuika-furina-iansan','Rainbow · Mavuika/Furina/Iansan',['Chasca','Mavuika','Furina','Iansan'],'rainbow','KQM highlights Mavuika, Furina and Iansan as premium current Chasca teammates.',kqm(),'Source-informed premium Rainbow variant.','adapted'),
  team('chasca-kqm-rainbow-citlali-furina-ororon','Rainbow · Citlali/Furina/Ororon',['Chasca','Citlali','Furina','Ororon'],'rainbow','KQM supports each slot as off-field PHEC utility while preserving three unique teammate Elements.',kqm(),'Source-informed Rainbow variant.','adapted')
];
export default CHASCA_REVIEWED_TEAMS;