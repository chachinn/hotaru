const KQM='https://keqingmains.com/q/dahlia-quickguide/';
const source={label:'Dahlia reviewed team theorycraft',url:KQM,type:'Reviewed theorycraft',platform:'Guide',reviewedAt:'2026-08-24'};
const team=(id,name,members,reaction,why,notes='')=>({id,name,members,reaction,why,notes,confidence:'Reviewed',provenance:'source-informed',source});
export const DAHLIA_REVIEWED_TEAMS=[
  team('dahlia-skirk-escoffier-furina','Skirk Freeze',['Dahlia','Skirk','Escoffier','Furina'],'freeze','Dahlia shields Skirk and adds Attack SPD while Escoffier supplies healing/support and Furina provides Hydro damage and buffs.'),
  team('dahlia-skirk-escoffier-xingqiu','Skirk Freeze · Xingqiu',['Dahlia','Skirk','Escoffier','Xingqiu'],'freeze','Xingqiu adds off-field Hydro that Dahlia lacks, Escoffier supports Cryo, and Dahlia enables shield-dependent weapon options plus Attack SPD.'),
  team('dahlia-skirk-escoffier-yelan','Skirk Freeze · Yelan',['Dahlia','Skirk','Escoffier','Yelan'],'freeze','Yelan supplies coordinated Hydro damage while Escoffier heals and Dahlia provides Skirk a shield and Attack SPD.'),
  team('dahlia-skirk-citlali-furina','Skirk Freeze · Citlali',['Dahlia','Skirk','Citlali','Furina'],'freeze','Dahlia adds Hydro typing and Attack SPD while Citlali shields/supports and Furina supplies damage; sustain is comfort-dependent.','Lower-sustain option; use only where team healing/Furina management is practical.'),
  team('dahlia-skirk-shenhe-xingqiu','Skirk Freeze · Shenhe',['Dahlia','Skirk','Shenhe','Xingqiu'],'freeze','Dahlia shields and speeds Skirk, Shenhe buffs Cryo, and Xingqiu supplies the off-field Hydro application Dahlia does not.'),

  team('dahlia-wanderer-faruzan-bennett','Wanderer Hypercarry',['Dahlia','Wanderer','Faruzan','Bennett'],'','Dahlia shields Wanderer and increases Normal Attack speed while Faruzan and Bennett provide dedicated Anemo/ATK support.'),
  team('dahlia-wanderer-faruzan-furina','Wanderer Furina',['Dahlia','Wanderer','Faruzan','Furina'],'','Dahlia provides interruption protection and Attack SPD while Furina buffs team damage.','Comfort/offense option; Furina Fanfare is limited without additional teamwide healing, so this is not a default recommendation.'),
  team('dahlia-wanderer-faruzan-mika','Wanderer Attack SPD',['Dahlia','Wanderer','Faruzan','Mika'],'','Dahlia and Mika stack Attack SPD while Mika heals and Faruzan provides Anemo support; lower buff ceiling than Bennett but comfortable.'),

  team('dahlia-ayato-furina-xilonen','Ayato Furina',['Dahlia','Kamisato Ayato','Furina','Xilonen'],'','Ayato’s long rotation can let Dahlia use two Skills, lowering ER; Xilonen heals/buffs while Dahlia adds shield and Attack SPD.'),
  team('dahlia-ayato-kazuha-bennett','Ayato Hypercarry',['Dahlia','Kamisato Ayato','Kaedehara Kazuha','Bennett'],'','Dahlia supports Ayato’s Normal Attack window with Attack SPD and a shield while Kazuha/Bennett provide offensive buffs.'),
  team('dahlia-ayato-yunjin-bennett','Ayato Normal Attack',['Dahlia','Kamisato Ayato','Yun Jin','Bennett'],'','Dahlia and Yun Jin both support Ayato’s Normal Attack-focused field time while Bennett supplies healing and ATK.'),
  team('dahlia-ayato-fischl-bennett','Ayato Electro-Charged flex',['Dahlia','Kamisato Ayato','Fischl','Bennett'],'electro-charged','Dahlia shields and speeds Ayato while Fischl provides off-field Electro and Bennett sustains/buffs.'),

  team('dahlia-yoimiya-yelan-bennett','Yoimiya Vaporize',['Dahlia','Yoimiya','Yelan','Bennett'],'vaporize','Dahlia protects Yoimiya’s attack string and adds Attack SPD; Yelan provides the actual off-field Hydro application and Bennett buffs/heals.'),
  team('dahlia-yoimiya-xingqiu-bennett','Yoimiya Vaporize · Xingqiu',['Dahlia','Yoimiya','Xingqiu','Bennett'],'vaporize','Xingqiu enables Vaporize while Dahlia supplies shield/Attack SPD and Bennett adds ATK/healing.'),
  team('dahlia-yoimiya-yelan-yunjin','Yoimiya Double Normal Support',['Dahlia','Yoimiya','Yelan','Yun Jin'],'vaporize','Dahlia shields/speeds Yoimiya while Yun Jin buffs Normal Attacks and Yelan supplies Hydro.','No dedicated healer; use as a shield-reliant offense setup.'),

  team('dahlia-arlecchino-xilonen-bennett','Arlecchino Hypercarry',['Dahlia','Arlecchino','Xilonen','Bennett'],'','Dahlia can use Archaic Petra with Xilonen-generated Crystallize while shielding and speeding Arlecchino; Bennett supplies ATK.'),
  team('dahlia-arlecchino-yelan-bennett','Arlecchino Vaporize',['Dahlia','Arlecchino','Yelan','Bennett'],'vaporize','Yelan supplies off-field Hydro while Dahlia adds shield/Attack SPD and Bennett buffs; Arlecchino cannot benefit from Dahlia healing because Dahlia has none.'),
  team('dahlia-arlecchino-fischl-bennett','Arlecchino Overloaded flex',['Dahlia','Arlecchino','Fischl','Bennett'],'overload','Dahlia provides a shield and Attack SPD while Fischl adds off-field Electro and Bennett buffs.','This is not a Chevreuse team and does not receive Chevreuse’s Pyro/Electro RES Shred.'),

  team('dahlia-wrio-shenhe-escoffier','Wriothesley Mono Cryo/Hydro support',['Dahlia','Wriothesley','Shenhe','Escoffier'],'freeze','Dahlia adds Hydro contact, shield and Attack SPD while Shenhe/Escoffier amplify and sustain Wriothesley.'),
  team('dahlia-wrio-furina-mika','Wriothesley Furina',['Dahlia','Wriothesley','Furina','Mika'],'freeze','Mika supplies healing and extra Attack SPD while Dahlia shields and Furina buffs Wriothesley.'),
  team('dahlia-wrio-xingqiu-shenhe','Wriothesley Freeze',['Dahlia','Wriothesley','Xingqiu','Shenhe'],'freeze','Xingqiu supplies reliable off-field Hydro while Dahlia shields/speeds Wriothesley and Shenhe buffs Cryo.','No dedicated healer; rely on Wriothesley self-sustain and Dahlia shield where appropriate.'),

  team('dahlia-clorinde-fischl-nahida','Clorinde Quickbloom flex',['Dahlia','Clorinde','Fischl','Nahida'],'aggravate','Dahlia supports Clorinde’s Normal Attack sequence while Fischl/Nahida sustain Quicken; Dahlia’s limited Hydro may create occasional cores but is not a Hyperbloom engine.'),
  team('dahlia-clorinde-fischl-bennett','Clorinde Attack SPD',['Dahlia','Clorinde','Fischl','Bennett'],'','Dahlia adds shield/Attack SPD while Fischl provides Electro damage and Bennett buffs; this is a direct-damage support shell rather than a reaction-specialist team.'),
  team('dahlia-sethos-fischl-nahida','Sethos Burst Normal Attack',['Dahlia','Sethos','Fischl','Nahida'],'aggravate','During Sethos Burst Normal Attack gameplay, Dahlia can contribute shield and Attack SPD while Fischl/Nahida maintain Quicken.'),

  team('dahlia-ningguang-illuga-bennett','Ningguang Illuga',['Dahlia','Ningguang','Illuga','Bennett'],'crystallize','Dahlia provides the shield needed for Geo Resonance, supports Illuga’s full passive, and can let Ningguang fit an extra Normal Attack.'),
  team('dahlia-ningguang-albedo-bennett','Ningguang Albedo',['Dahlia','Ningguang','Albedo','Bennett'],'crystallize','Dahlia shields for Geo Resonance and adds Attack SPD while Albedo supplies Geo damage and Bennett buffs Ningguang.'),
  team('dahlia-noelle-furina-gorou','Noelle Furina',['Dahlia','Noelle','Furina','Gorou'],'crystallize','Noelle provides team healing for Furina and drives Geo attacks while Dahlia adds shield/Attack SPD and Hydro resonance with Furina.'),

  team('dahlia-freminet-furina-fischl','Freminet Furina',['Dahlia','Freminet','Furina','Fischl'],'freeze','Dahlia shields and adds Attack SPD while Fischl enables Superconduct and Furina buffs.','Sustain is limited; use where Freminet/Furina management and Dahlia’s shield are sufficient.'),
  team('dahlia-freminet-xingqiu-fischl','Freminet Shatter/Physical',['Dahlia','Freminet','Xingqiu','Fischl'],'freeze','Xingqiu supplies Hydro, Fischl enables Superconduct, and Dahlia shields/speeds Freminet’s Normal Attack sequence.'),
  team('dahlia-razor-mika-fischl','Razor Physical',['Dahlia','Razor','Mika','Fischl'],'','Dahlia and Mika add Attack SPD while Mika heals and Fischl batteries Razor; Dahlia is a comfort Normal Attack support.'),

  team('dahlia-kaeya-xingqiu-chongyun','Kaeya Freeze Driver',['Dahlia','Kaeya','Xingqiu','Chongyun'],'freeze','Chongyun enables Cryo-infused Kaeya Normal Attacks, Xingqiu maintains Hydro, and Dahlia adds shield/Attack SPD.','No dedicated healer; use as a shield-reliant Freeze setup.'),
  team('dahlia-heizou-faruzan-bennett','Heizou Normal-chain flex',['Dahlia','Shikanoin Heizou','Faruzan','Bennett'],'','Dahlia adds shield/Attack SPD to Heizou’s field time while Faruzan and Bennett provide Anemo/ATK support.'),

  team('dahlia-zibai-illuga-aino','Zibai Lunar-Crystallize sustain',['Dahlia','Zibai','Illuga','Aino'],'crystallize','Dahlia is a reviewed sustain option for Zibai, contributes Hydro for Lunar-Crystallize access, and helps Illuga’s team condition.','Use the Lunar-reaction engine’s dedicated rules; do not treat this as ordinary legacy Crystallize optimization.'),
  team('dahlia-zibai-illuga-yelan','Zibai Lunar-Crystallize · Yelan',['Dahlia','Zibai','Illuga','Yelan'],'crystallize','Dahlia shields while Yelan supplies Hydro damage and Illuga supports Zibai; Dahlia’s Hydro typing helps sustain the lunar reaction setup.'),
  team('dahlia-zibai-illuga-furina','Zibai Lunar-Crystallize · Furina',['Dahlia','Zibai','Illuga','Furina'],'crystallize','Dahlia provides shielding while Furina supplies Hydro buffs/damage and Illuga supports Zibai.','Furina Fanfare requires practical healing elsewhere; use only if the Zibai/Illuga setup supplies or accounts for it.'),

  team('dahlia-skirk-furina-escoffier','Skirk Furina alternate order',['Dahlia','Skirk','Furina','Escoffier'],'freeze','Same core role: Dahlia shields and speeds Skirk while Escoffier heals and Furina buffs.','Canonical composition retained only once by composition-key QA.')
];
export default DAHLIA_REVIEWED_TEAMS;