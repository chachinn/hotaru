const KQM={label:'Ayato current reviewed team evidence',url:'https://keqingmains.com/q/ayato-quickguide/',type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-24'};
const EXT={label:'Ayato extended reviewed team evidence',url:'https://keqingmains.com/ayato/',type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-24'};
const G8={label:'Ayato current representative team evidence',url:'https://game8.co/games/Genshin-Impact/archives/301819',type:'Source-backed guide',platform:'Guide',reviewedAt:'2026-08-24'};
const confidenceFor=s=>s?.type==='Reviewed theorycraft'?'Reviewed':'Community-sourced';
const t=(id,name,members,reaction,why,source=KQM,notes='',provenance='exact')=>({id,name,members,reaction,why,notes,provenance,confidence:confidenceFor(source),source,anchor:'Kamisato Ayato',profileId:'kamisato-ayato'});
export const KAMISATO_AYATO_REVIEWED_TEAMS=[
  t('ayato-g8-fischl-venti-bennett','Rainbow · Fischl/Venti/Bennett',['Kamisato Ayato','Fischl','Venti','Bennett'],'electro-charged','Ayato drives rapid Hydro attacks while Fischl supplies off-field Electro, Venti groups and Bennett buffs/sustains.',G8),
  t('ayato-furina-yelan-xilonen','Mono Hydro · Furina/Yelan/Xilonen',['Kamisato Ayato','Furina','Yelan','Xilonen'],'mono-hydro','Double off-field Hydro lowers Energy pressure while Xilonen heals for Fanfare and shreds resistance.'),
  t('ayato-furina-yunjin-xilonen','Hypercarry · Furina/Yun Jin/Xilonen',['Kamisato Ayato','Furina','Yun Jin','Xilonen'],'mono-hydro','Yun Jin concentrates buffs into Ayato’s Shunsuiken window while Xilonen sustains Furina and amplifies Hydro.'),
  t('ayato-yelan-xingqiu-zhongli','Mono Hydro · Yelan/Xingqiu/Zhongli',['Kamisato Ayato','Yelan','Xingqiu','Zhongli'],'mono-hydro','Triple Hydro lowers ER needs and stacks strong single-target off-field damage behind Zhongli comfort.'),
  t('ayato-furina-bennett-kazuha','Hypercarry · Furina/Bennett/Kazuha',['Kamisato Ayato','Furina','Bennett','Kaedehara Kazuha'],'vaporize','Furina and Kazuha provide large team buffs while Bennett heals and supplies ATK for Ayato’s active window.'),

  t('ayato-escoffier-furina-yelan','Freeze · Escoffier/Furina/Yelan',['Kamisato Ayato','Escoffier','Furina','Yelan'],'freeze','Hydro-heavy single-target damage pairs with Escoffier healing and Hydro/Cryo resistance reduction.'),
  t('ayato-escoffier-furina-citlali','Freeze · Escoffier/Furina/Citlali',['Kamisato Ayato','Escoffier','Furina','Citlali'],'freeze','Citlali adds Cryo, shielding and buffs while Escoffier sustains Furina and heavily reduces relevant resistance.'),
  t('ayato-escoffier-rosaria-shenhe','Freeze · Escoffier/Rosaria/Shenhe',['Kamisato Ayato','Escoffier','Rosaria','Shenhe'],'freeze','Triple Cryo support gives Ayato strong resistance reduction, CRIT support and off-field Cryo pressure.'),
  t('ayato-ganyu-venti-diona','Freeze · Ganyu/Venti/Diona',['Kamisato Ayato','Ganyu','Venti','Diona'],'freeze','Ayato and Ganyu Burst overlap rewards tightly grouped freezable waves while Diona provides sustain.',EXT),
  t('ayato-skirk-escoffier-furina','Off-field Freeze · Skirk/Escoffier/Furina',['Kamisato Ayato','Skirk','Escoffier','Furina'],'freeze','Ayato can shorten his field time and contribute Burst Hydro while Skirk takes the main damage window.',KQM,'Use Ayato’s Burst-oriented identity when Skirk owns the field time.'),

  t('ayato-kuki-nahida-fischl','Hyperbloom · Kuki/Nahida/Fischl',['Kamisato Ayato','Kuki Shinobu','Nahida','Fischl'],'hyperbloom','Ayato creates Dendro Cores, Kuki owns Hyperbloom triggers and Fischl adds strong off-field damage.'),
  t('ayato-kuki-nahida-xingqiu','Hyperbloom · Kuki/Nahida/Xingqiu',['Kamisato Ayato','Kuki Shinobu','Nahida','Xingqiu'],'hyperbloom','Xingqiu adds Hydro damage and particles while Kuki remains the EM Hyperbloom trigger.',EXT),
  t('ayato-raiden-nahida-zhongli','Hyperbloom · Raiden/Nahida/Zhongli',['Kamisato Ayato','Raiden Shogun','Nahida','Zhongli'],'hyperbloom','Raiden triggers Hyperblooms off-field while Nahida supplies Dendro and Zhongli protects Ayato’s Skill window.'),
  t('ayato-raiden-nahida-baizhu','Hyperbloom · Raiden/Nahida/Baizhu',['Kamisato Ayato','Raiden Shogun','Nahida','Baizhu'],'hyperbloom','Baizhu adds sustain and extra Dendro while Raiden remains the reaction trigger.'),
  t('ayato-dori-nahida-fischl','Hyperbloom · Dori/Nahida/Fischl',['Kamisato Ayato','Dori','Nahida','Fischl'],'hyperbloom','A viable alternative Hyperbloom shell where Dori handles trigger/sustain duties and Fischl contributes damage.',EXT),
  t('ayato-electrotraveler-collei-beidou','Budget Hyperbloom · Traveler/Collei/Beidou',['Kamisato Ayato','Electro Traveler','Collei','Beidou'],'hyperbloom','A lower-cost Hyperbloom structure using Traveler as the core trigger while Beidou adds multi-target damage.',EXT),

  t('ayato-thoma-nahida-fischl','Burgeon · Thoma/Nahida/Fischl',['Kamisato Ayato','Thoma','Nahida','Fischl'],'burgeon','Thoma owns Burgeon triggers while Fischl helps clear Burning and Nahida supplies sustained Dendro.'),
  t('ayato-pyrotraveler-lauma-baizhu','Burgeon · Traveler/Lauma/Baizhu',['Kamisato Ayato','Pyro Traveler','Lauma','Baizhu'],'burgeon','Lauma and Baizhu maintain Dendro and sustain while Pyro Traveler owns Burgeon triggers.'),
  t('ayato-pyrotraveler-lauma-escoffier','Burgeon · Traveler/Lauma/Escoffier',['Kamisato Ayato','Pyro Traveler','Lauma','Escoffier'],'burgeon','Escoffier helps suppress Burning while Lauma supplies Dendro support and Pyro Traveler triggers Burgeon.'),
  t('ayato-thoma-collei-fischl','Budget Burgeon · Thoma/Collei/Fischl',['Kamisato Ayato','Thoma','Collei','Fischl'],'burgeon','Accessible Burgeon shell with Fischl helping maintain Core production and Thoma handling triggers.'),
  t('ayato-thoma-dendrotraveler-fischl','Budget Burgeon · Thoma/Traveler/Fischl',['Kamisato Ayato','Thoma','Dendro Traveler','Fischl'],'burgeon','Dendro Traveler supplies the Dendro field while Fischl reduces Burning pressure and Thoma triggers Burgeon.'),
  t('ayato-thoma-nahida-xingqiu','Burgeon · Thoma/Nahida/Xingqiu',['Kamisato Ayato','Thoma','Nahida','Xingqiu'],'burgeon','Double Hydro improves application and Energy while Thoma remains the full-EM Burgeon trigger.',EXT),

  t('ayato-nilou-lauma-baizhu','Nilou Bloom · Lauma/Baizhu',['Kamisato Ayato','Nilou','Lauma','Baizhu'],'bloom','Ayato owns many Bountiful Bloom triggers while Lauma amplifies Bloom and Baizhu supplies sustain.'),
  t('ayato-nilou-nahida-baizhu','Nilou Bloom · Nahida/Baizhu',['Kamisato Ayato','Nilou','Nahida','Baizhu'],'bloom','Nahida provides strong Dendro and EM support while Baizhu keeps the Bountiful Bloom team sustainable.'),
  t('ayato-nilou-dendrotraveler-yaoyao','Budget Nilou Bloom · Traveler/Yaoyao',['Kamisato Ayato','Nilou','Dendro Traveler','Yaoyao'],'bloom','An accessible Hydro/Dendro-only Bountiful Bloom team with Yaoyao healing through self-damage.'),
  t('ayato-nilou-nahida-yaoyao','Nilou Bloom · Nahida/Yaoyao',['Kamisato Ayato','Nilou','Nahida','Yaoyao'],'bloom','Nahida supplies premium Dendro application and Yaoyao provides the required sustain.',EXT),

  t('ayato-fischl-ineffa-kazuha','Lunar-Charged · Fischl/Ineffa/Kazuha',['Kamisato Ayato','Fischl','Ineffa','Kaedehara Kazuha'],'lunar-charged','Ayato supplies consistent AoE Hydro for Ineffa’s Lunar-Charged damage while Fischl batteries and Kazuha amplifies the swirlable elements.'),
  t('ayato-fischl-furina-xilonen','Electro-Charged · Fischl/Furina/Xilonen',['Kamisato Ayato','Fischl','Furina','Xilonen'],'electro-charged','Furina and Fischl add large off-field damage while Xilonen heals, shreds resistance and supports Fanfare.'),
  t('ayato-fischl-furina-jean','Electro-Charged · Fischl/Furina/Jean',['Kamisato Ayato','Fischl','Furina','Jean'],'electro-charged','Jean consolidates teamwide healing and VV for Furina while Fischl maintains Electro pressure.'),
  t('ayato-fischl-beidou-lanyan','Electro-Charged · Fischl/Beidou/Lan Yan',['Kamisato Ayato','Fischl','Beidou','Lan Yan'],'electro-charged','Double Electro supports the short-rotation option while Lan Yan supplies defensive Anemo utility.'),
  t('ayato-fischl-ororon-lanyan','Electro-Charged · Fischl/Ororon/Lan Yan',['Kamisato Ayato','Fischl','Ororon','Lan Yan'],'electro-charged','Fischl and Ororon maintain frequent Electro while Lan Yan provides shielding and resistance reduction.'),
  t('ayato-yae-shinobu-kazuha','Electro-Charged · Yae/Shinobu/Kazuha',['Kamisato Ayato','Yae Miko','Kuki Shinobu','Kaedehara Kazuha'],'electro-charged','Yae supplies off-field Electro damage, Shinobu sustains and Kazuha amplifies both Hydro and Electro.',EXT),

  t('ayato-bennett-xiangling-fischl','Overvape · Bennett/Xiangling/Fischl',['Kamisato Ayato','Bennett','Xiangling','Fischl'],'vaporize','Bennett powers Xiangling and Ayato while Fischl adds Electro for a high-damage Overvape core.'),
  t('ayato-bennett-xiangling-furina','Vaporize · Bennett/Xiangling/Furina',['Kamisato Ayato','Bennett','Xiangling','Furina'],'vaporize','Furina adds Hydro and teamwide amplification while Bennett sustains and batteries Xiangling.'),
  t('ayato-bennett-xiangling-nahida','Burnvape · Bennett/Xiangling/Nahida',['Kamisato Ayato','Bennett','Xiangling','Nahida'],'vaporize','Dendro plus sustained Pyro helps stabilize Burning so Ayato can access more forward Vaporize opportunities.',EXT),
  t('ayato-bennett-xiangling-emilie','Burnvape · Bennett/Xiangling/Emilie',['Kamisato Ayato','Bennett','Xiangling','Emilie'],'vaporize','Emilie benefits from Burning while Bennett and Xiangling maintain Pyro pressure around Ayato.',EXT),
  t('ayato-bennett-mavuika-xilonen','Vaporize · Mavuika/Xilonen',['Kamisato Ayato','Bennett','Mavuika','Xilonen'],'vaporize','Mavuika fills Ayato downtime and Vaporizes key hits while Xilonen supplies Natlan support, healing and resistance reduction.'),
  t('ayato-bennett-mavuika-ororon','Vaporize · Mavuika/Ororon',['Kamisato Ayato','Bennett','Mavuika','Ororon'],'vaporize','Ororon helps charge Mavuika while contributing off-field pressure around alternating Ayato/Mavuika windows.'),
  t('ayato-bennett-kazuha-fischl','Overvape · Bennett/Kazuha/Fischl',['Kamisato Ayato','Bennett','Kaedehara Kazuha','Fischl'],'vaporize','Kazuha can absorb Pyro from Bennett while Fischl supplies Electro, creating a flexible Overvape shell.')
];
export default KAMISATO_AYATO_REVIEWED_TEAMS;
