const KQM='https://keqingmains.com/baizhu/';
const GAME8='https://game8.co/games/Genshin-Impact/archives/314348';
const source=(label,url,type='Reviewed theorycraft')=>({label,url,type,platform:'Guide',reviewedAt:'2026-08-23'});
const kqm=()=>source('KQM Baizhu Guide: Beyond Mortality',KQM);
const game8=()=>source('Game8 Baizhu Rating and Best Builds',GAME8,'Source-backed guide');
const confidenceFor=s=>s?.type==='Reviewed theorycraft'?'Reviewed':s?.type==='Simulation-backed'?'Simulation-backed':'Community-sourced';
const team=(id,name,members,reaction,why,src,notes='',provenance='exact')=>({id,name,members,reaction,why,notes,provenance,confidence:confidenceFor(src),source:src,anchor:'Baizhu',profileId:'baizhu'});
export const BAIZHU_REVIEWED_TEAMS=[
  team('baizhu-kqm-aggravate-raiden-yae-kazuha','Aggravate · Raiden/Yae/Kazuha',['Baizhu','Raiden Shogun','Yae Miko','Kaedehara Kazuha'],'aggravate','KQM exact Aggravate example.',kqm()),
  team('baizhu-kqm-spread-tighnari-fischl-yae','Spread · Tighnari/Fischl/Yae',['Baizhu','Tighnari','Fischl','Yae Miko'],'spread','KQM exact quickswap Spread example.',kqm()),
  team('baizhu-kqm-quickbloom-alhaitham-fischl-furina','Quickbloom · Alhaitham/Fischl/Furina',['Baizhu','Alhaitham','Fischl','Furina'],'quickbloom','KQM exact Alhaitham Quickbloom example.',kqm()),
  team('baizhu-kqm-quickbloom-cyno-fischl-furina','Quickbloom · Cyno/Fischl/Furina',['Baizhu','Cyno','Fischl','Furina'],'quickbloom','KQM exact Cyno Quickbloom example.',kqm()),
  team('baizhu-kqm-aggravate-keqing-fischl-sucrose','Aggravate · Keqing/Fischl/Sucrose',['Baizhu','Keqing','Fischl','Sucrose'],'aggravate','KQM exact Keqing Aggravate example.',kqm()),
  team('baizhu-kqm-hb-raiden-yelan-nahida','Hyperbloom · Raiden/Yelan/Nahida',['Baizhu','Raiden Shogun','Yelan','Nahida'],'hyperbloom','KQM exact Hyperbloom/Quickbloom example.',kqm()),
  team('baizhu-kqm-hb-raiden-xingqiu-alhaitham','Hyperbloom · Raiden/Xingqiu/Alhaitham',['Baizhu','Raiden Shogun','Xingqiu','Alhaitham'],'hyperbloom','KQM exact Alhaitham Hyperbloom example.',kqm()),
  team('baizhu-kqm-hb-raiden-neuvi-furina','Hyperbloom · Raiden/Neuvillette/Furina',['Baizhu','Raiden Shogun','Neuvillette','Furina'],'hyperbloom','KQM exact Neuvillette-Furina Hyperbloom example.',kqm()),
  team('baizhu-kqm-hb-cyno-furina-nahida','Quickbloom · Cyno/Furina/Nahida',['Baizhu','Cyno','Furina','Nahida'],'quickbloom','KQM exact Cyno Quickbloom example.',kqm()),
  team('baizhu-kqm-hb-kuki-xq-yelan','Hyperbloom Driver · Shinobu/Xingqiu/Yelan',['Baizhu','Kuki Shinobu','Xingqiu','Yelan'],'hyperbloom','KQM exact on-field Baizhu Hyperbloom-driver example.',kqm()),
  team('baizhu-kqm-hb-razor-xq-nahida','Hyperbloom · Razor/Xingqiu/Nahida',['Baizhu','Razor','Xingqiu','Nahida'],'hyperbloom','KQM exact Razor Hyperbloom example.',kqm()),
  team('baizhu-kqm-burgeon-thoma-yelan-furina','Burgeon Driver · Thoma/Yelan/Furina',['Baizhu','Thoma','Yelan','Furina'],'burgeon','KQM exact high-performing on-field Baizhu Burgeon-driver example.',kqm()),
  team('baizhu-kqm-burgeon-thoma-xq-fischl','Burgeon · Thoma/Xingqiu/Fischl',['Baizhu','Thoma','Xingqiu','Fischl'],'burgeon','KQM exact Burgeon/Overloaded example.',kqm()),
  team('baizhu-kqm-burgeon-thoma-ayato-traveler','Burgeon · Thoma/Ayato/Dendro Traveler',['Baizhu','Thoma','Kamisato Ayato','Dendro Traveler'],'burgeon','KQM exact Burgeon example.',kqm()),
  team('baizhu-kqm-burgeon-xiangling-neuvi-furina','Burgeon · Xiangling/Neuvillette/Furina',['Baizhu','Xiangling','Neuvillette','Furina'],'burgeon','KQM exact Neuvillette-Furina Burgeon example.',kqm()),
  team('baizhu-kqm-burgeon-yoimiya-yelan-furina','Burgeon-Vape · Yoimiya/Yelan/Furina',['Baizhu','Yoimiya','Yelan','Furina'],'burgeon','KQM exact Yoimiya Burgeon-Vape example.',kqm()),
  team('baizhu-kqm-vape-hutao-furina-yelan','Vape/Bloom · Hu Tao/Furina/Yelan',['Baizhu','Hu Tao','Furina','Yelan'],'vaporize','KQM exact Hu Tao team using Baizhu mainly for teamwide healing and interruption resistance.',kqm()),
  team('baizhu-kqm-nilou-neuvi-nahida','Nilou Bloom · Neuvillette/Nahida',['Baizhu','Nilou','Nahida','Neuvillette'],'bloom','KQM exact Nilou Bloom example.',kqm()),
  team('baizhu-kqm-nilou-ayato-nahida','Nilou Bloom · Ayato/Nahida',['Baizhu','Nilou','Nahida','Kamisato Ayato'],'bloom','KQM exact Nilou Bloom example.',kqm()),
  team('baizhu-kqm-nilou-alhaitham-yelan','Nilou Bloom · Alhaitham/Yelan',['Baizhu','Nilou','Alhaitham','Yelan'],'bloom','KQM exact Nilou Bloom example.',kqm()),
  team('baizhu-kqm-nilou-kaveh-xq','Nilou Bloom · Kaveh/Xingqiu',['Baizhu','Nilou','Kaveh','Xingqiu'],'bloom','KQM exact Nilou Bloom example.',kqm()),
  team('baizhu-kqm-nilou-traveler-xq','Nilou Bloom Driver · Dendro Traveler/Xingqiu',['Baizhu','Nilou','Dendro Traveler','Xingqiu'],'bloom','KQM exact accessible Nilou Bloom driver example.',kqm()),
  team('baizhu-kqm-nilou-collei-barbara','Nilou Bloom · Collei/Barbara',['Baizhu','Nilou','Collei','Barbara'],'bloom','KQM exact F2P Nilou Bloom example.',kqm()),
  team('baizhu-kqm-flex-neuvi-furina-kazuha','Flex Healer · Neuvillette/Furina/Kazuha',['Baizhu','Furina','Kaedehara Kazuha','Neuvillette'],'bloom','KQM exact Neuvillette hypercarry healer example.',kqm()),
  team('baizhu-kqm-flex-wanderer-furina-faruzan','Flex Healer · Wanderer/Furina/Faruzan',['Baizhu','Furina','Faruzan','Wanderer'],'anemo','KQM exact Wanderer-Furina healer example.',kqm()),
  team('baizhu-kqm-flex-eula-furina-raiden','Flex Healer · Eula/Furina/Raiden',['Baizhu','Furina','Raiden Shogun','Eula'],'hyperbloom','KQM exact Eula-Furina healer example.',kqm()),

  team('baizhu-game8-hb-cyno-nahida-yelan','Game8 Hyperbloom · Cyno/Nahida/Yelan',['Baizhu','Cyno','Nahida','Yelan'],'hyperbloom','Game8 current exact Hyperbloom example.',game8()),
  team('baizhu-game8-hb-alhaitham-raiden-furina','Game8 Hyperbloom · Alhaitham/Raiden/Furina',['Baizhu','Alhaitham','Raiden Shogun','Furina'],'hyperbloom','Game8 current exact Hyperbloom example.',game8()),
  team('baizhu-game8-hb-ayato-kuki-nahida','Game8 Hyperbloom · Ayato/Shinobu/Nahida',['Baizhu','Kamisato Ayato','Kuki Shinobu','Nahida'],'hyperbloom','Game8 current exact Hyperbloom example.',game8()),
  team('baizhu-game8-hb-kaveh-kuki-xq','Game8 Hyperbloom · Kaveh/Shinobu/Xingqiu',['Baizhu','Kaveh','Kuki Shinobu','Xingqiu'],'hyperbloom','Game8 current exact Hyperbloom example.',game8()),
  team('baizhu-game8-hb-neuvi-lauma-ineffa','Game8 Hyperbloom · Neuvillette/Lauma/Ineffa',['Baizhu','Neuvillette','Lauma','Ineffa'],'hyperbloom','Game8 current exact Hyperbloom example with newer reaction supports.',game8()),

  team('baizhu-adapt-aggravate-keqing-fischl-kazuha','Aggravate · Keqing/Fischl/Kazuha',['Baizhu','Keqing','Fischl','Kaedehara Kazuha'],'aggravate','KQM explicitly lists Keqing/Fischl and Kazuha as strong Aggravate roles.',kqm(),'Source-informed role combination.','adapted'),
  team('baizhu-adapt-aggravate-raiden-fischl-kazuha','Aggravate · Raiden/Fischl/Kazuha',['Baizhu','Raiden Shogun','Fischl','Kaedehara Kazuha'],'aggravate','KQM supports Raiden, Fischl and Kazuha within Baizhu Aggravate shells.',kqm(),'Source-informed role combination.','adapted'),
  team('baizhu-adapt-aggravate-yae-fischl-sucrose','Aggravate · Yae/Fischl/Sucrose',['Baizhu','Yae Miko','Fischl','Sucrose'],'aggravate','KQM supports Yae/Fischl and Sucrose in Baizhu Aggravate teams.',kqm(),'Source-informed role combination.','adapted'),
  team('baizhu-adapt-spread-alhaitham-yae-fischl','Spread · Alhaitham/Yae/Fischl',['Baizhu','Alhaitham','Yae Miko','Fischl'],'spread','KQM identifies Alhaitham as a top Spread partner and Yae/Fischl as strong Electro enablers.',kqm(),'Source-informed role combination.','adapted'),
  team('baizhu-adapt-spread-tighnari-fischl-sucrose','Spread · Tighnari/Fischl/Sucrose',['Baizhu','Tighnari','Fischl','Sucrose'],'spread','KQM supports Tighnari with Electro and Anemo utility in Quicken teams.',kqm(),'Source-informed role combination.','adapted'),
  team('baizhu-adapt-hb-kuki-yelan-nahida','Hyperbloom · Shinobu/Yelan/Nahida',['Baizhu','Kuki Shinobu','Yelan','Nahida'],'hyperbloom','KQM supports Shinobu as Hyperbloom trigger, Yelan Hydro application, and Nahida as one of Baizhu’s best Dendro partners.',kqm(),'Source-informed role combination.','adapted'),
  team('baizhu-adapt-hb-raiden-xq-nahida','Hyperbloom · Raiden/Xingqiu/Nahida',['Baizhu','Raiden Shogun','Xingqiu','Nahida'],'hyperbloom','KQM supports Raiden Hyperbloom with Xingqiu and Nahida roles.',kqm(),'Source-informed role combination.','adapted'),
  team('baizhu-adapt-burgeon-thoma-xq-yelan','Burgeon Driver · Thoma/Xingqiu/Yelan',['Baizhu','Thoma','Xingqiu','Yelan'],'burgeon','KQM says Double Hydro helps prevent Burning in Baizhu-Thoma Burgeon.',kqm(),'Source-informed role combination.','adapted'),
  team('baizhu-adapt-burgeon-thoma-ayato-nahida','Burgeon · Thoma/Ayato/Nahida',['Baizhu','Thoma','Kamisato Ayato','Nahida'],'burgeon','KQM states on-field Ayato can support a second Dendro teammate in Thoma Burgeon.',kqm(),'Source-informed role combination.','adapted'),
  team('baizhu-adapt-nilou-nahida-kokomi','Nilou Bloom · Nahida/Kokomi',['Baizhu','Nilou','Nahida','Sangonomiya Kokomi'],'bloom','KQM explicitly states Kokomi and Baizhu work well together in Nilou Bloom, with Nahida preferred as second Dendro.',kqm(),'Source-informed role combination.','adapted'),
  team('baizhu-adapt-nilou-nahida-furina','Nilou Bloom · Nahida/Furina',['Baizhu','Nilou','Nahida','Furina'],'bloom','KQM notes Baizhu’s healing comfortably handles Furina even in Nilou Bloom.',kqm(),'Source-informed role combination.','adapted'),
  team('baizhu-adapt-flex-yoimiya-furina-yelan','Flex Healer · Yoimiya/Furina/Yelan',['Baizhu','Yoimiya','Furina','Yelan'],'vaporize','KQM identifies Yoimiya + Furina as a strong Baizhu synergy and Yelan as the Hydro damage/enabler.',kqm(),'Source-informed from KQM synergy notes.','adapted')
];
export default BAIZHU_REVIEWED_TEAMS;