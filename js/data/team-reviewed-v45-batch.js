import { normalizeReactionId, teamReaction } from './team-reaction-tags.js';

const reviewedSource=(label,url,platform='Guide',creator='')=>({label,url,type:'Reviewed theorycraft',platform,creator,reviewedAt:'2026-08-22'});
const reviewedTeam=(id,name,members,why,source,notes='',reaction='')=>({id,name,members,why,notes,confidence:'Reviewed',reaction:normalizeReactionId(reaction)||teamReaction({name}),source});
const VARKA='https://www.icy-veins.com/genshin-impact/varka-team-guide';
const PRUNE='https://www.icy-veins.com/genshin-impact/prune-team-guide';
const LOHEN='https://www.icy-veins.com/genshin-impact/lohen-team-guide';
const ZIBAI='https://www.icy-veins.com/genshin-impact/zibai-team-guide';
const ILLUGA='https://www.icy-veins.com/genshin-impact/illuga-team-guide';
const LINNEA='https://www.icy-veins.com/genshin-impact/linnea-team-guide';
const HOYOLAB_LINNEA_ZIBAI='https://www.hoyolab.com/article/44472175';
const varkaSource=reviewedSource('Icy Veins Varka Team Guide',VARKA,'Guide','Jaymo');
const pruneSource=reviewedSource('Icy Veins Prune Team Guide',PRUNE,'Guide','Asher');
const lohenSource=reviewedSource('Icy Veins Lohen Team Guide',LOHEN,'Guide','Mistsplitter Reforged');
const zibaiSource=reviewedSource('Icy Veins Zibai Team Guide',ZIBAI,'Guide','Asher');
const illugaSource=reviewedSource('Icy Veins Illuga Team Guide',ILLUGA,'Guide','Mistsplitter Reforged');
const linneaSource=reviewedSource('Icy Veins Linnea Team Guide',LINNEA,'Guide','GxG Noir');
const hoyolabLinneaSource=reviewedSource('HoYoLAB Linnea Premium Team Showcase',HOYOLAB_LINNEA_ZIBAI,'HoYoLAB','SoraHoshina');

export const V45_REVIEWED_TEAM_BATCH=[
  // Current Icy Veins 7.0 source batch. Exact four-character compositions only.
  reviewedTeam('varka-venti-nicole-durin','Anemo-Pyro · Venti + Nicole',['Varka','Venti','Nicole','Durin'],'Varka leads the source-listed mixed-damage shell with Venti, Nicole, and Durin.',varkaSource),
  reviewedTeam('varka-prune-nicole-durin','Anemo-Pyro · Prune + Nicole',['Varka','Prune','Nicole','Durin'],'Prune and Nicole support Varka while Durin fills the source-listed Pyro slot.',varkaSource),
  reviewedTeam('varka-venti-bennett-durin','Anemo-Pyro · Venti + Bennett',['Varka','Venti','Bennett','Durin'],'Venti supports Varka while Bennett and Durin form the source-listed Pyro pair.',varkaSource),
  reviewedTeam('varka-faruzan-bennett-durin','Anemo-Pyro · Faruzan',['Varka','Faruzan','Bennett','Durin'],'Faruzan supports Varka while Bennett and Durin complete the source-listed shell.',varkaSource),
  reviewedTeam('varka-sucrose-bennett-durin','Anemo-Pyro · Sucrose',['Varka','Sucrose','Bennett','Durin'],'Sucrose supports Varka with Bennett and Durin in the source-listed variation.',varkaSource),
  reviewedTeam('varka-kazuha-bennett-durin','Anemo-Pyro · Kazuha',['Varka','Kaedehara Kazuha','Bennett','Durin'],'Kazuha supports Varka with Bennett and Durin in the source-listed variation.',varkaSource),
  reviewedTeam('varka-lanyan-bennett-durin','Anemo-Pyro · Lan Yan',['Varka','Lan Yan','Bennett','Durin'],'Lan Yan fills the Anemo support slot with Bennett and Durin.',varkaSource),
  reviewedTeam('varka-ifa-bennett-durin','Anemo-Pyro · Ifa',['Varka','Ifa','Bennett','Durin'],'Ifa fills the source-listed Anemo slot while Bennett and Durin support Varka.',varkaSource),
  reviewedTeam('varka-venti-bennett-xiangling','Anemo-Pyro · Xiangling',['Varka','Venti','Bennett','Xiangling'],'Venti supports Varka while Bennett and Xiangling form the source-listed Pyro pair.',varkaSource),
  reviewedTeam('varka-venti-mavuika-bennett','Anemo-Pyro · Mavuika',['Varka','Venti','Mavuika','Bennett'],'Venti supports Varka while Mavuika and Bennett provide the source-listed Pyro pairing.',varkaSource),
  reviewedTeam('varka-venti-thoma-bennett','Anemo-Pyro · Thoma',['Varka','Venti','Thoma','Bennett'],'Venti supports Varka with Thoma and Bennett filling the source-listed Pyro slots.',varkaSource),
  reviewedTeam('varka-venti-iansan-fischl','Anemo-Electro · Iansan + Fischl',['Varka','Venti','Iansan','Fischl'],'Venti supports Varka while Iansan and Fischl form the source-listed Electro pairing.',varkaSource),
  reviewedTeam('varka-venti-fischl-shinobu','Anemo-Electro · Fischl + Shinobu',['Varka','Venti','Fischl','Kuki Shinobu'],'Fischl and Shinobu fill the source-listed Electro slots around Varka and Venti.',varkaSource),
  reviewedTeam('varka-venti-fischl-ineffa','Anemo-Electro · Fischl + Ineffa',['Varka','Venti','Fischl','Ineffa'],'Fischl and Ineffa fill the source-listed Electro slots around Varka and Venti.',varkaSource),
  reviewedTeam('varka-venti-furina-sigewinne','Anemo-Hydro · Furina + Sigewinne',['Varka','Venti','Furina','Sigewinne'],'Furina and Sigewinne provide the source-listed Hydro pairing around Varka and Venti.',varkaSource),
  reviewedTeam('varka-venti-furina-yelan','Anemo-Hydro · Furina + Yelan',['Varka','Venti','Furina','Yelan'],'Furina and Yelan form the source-listed double-Hydro core.',varkaSource),
  reviewedTeam('varka-venti-furina-mona','Anemo-Hydro · Furina + Mona',['Varka','Venti','Furina','Mona'],'Furina and Mona provide the source-listed Hydro core.',varkaSource),
  reviewedTeam('varka-venti-shenhe-escoffier','Anemo-Cryo · Shenhe + Escoffier',['Varka','Venti','Shenhe','Escoffier'],'Shenhe and Escoffier form the source-listed Cryo pairing.',varkaSource),
  reviewedTeam('varka-venti-shenhe-chongyun','Anemo-Cryo · Shenhe + Chongyun',['Varka','Venti','Shenhe','Chongyun'],'Shenhe and Chongyun supply the source-listed Cryo-side support.',varkaSource),
  reviewedTeam('varka-venti-citlali-escoffier','Anemo-Cryo · Citlali + Escoffier',['Varka','Venti','Citlali','Escoffier'],'Citlali and Escoffier complete the source-listed Cryo variation.',varkaSource),
  reviewedTeam('varka-stellar-venti-escoffier','Stellar-Swirl · Venti + Escoffier',['Varka','Venti','Odette','Escoffier'],'Odette enables the explicitly listed Stellar-Swirl archetype.',varkaSource,'','stellar-swirl'),
  reviewedTeam('varka-stellar-venti-qiqi','Stellar-Swirl · Venti + Qiqi',['Varka','Venti','Odette','Qiqi'],'Odette enables the explicitly listed Stellar-Swirl archetype with Qiqi sustain.',varkaSource,'','stellar-swirl'),
  reviewedTeam('varka-stellar-prune-qiqi','Stellar-Swirl · Prune + Qiqi',['Varka','Prune','Odette','Qiqi'],'Prune and Qiqi fill the source-listed Stellar-Swirl support slots.',varkaSource,'','stellar-swirl'),
  reviewedTeam('varka-stellar-prune-escoffier','Stellar-Swirl · Prune + Escoffier',['Varka','Prune','Odette','Escoffier'],'Prune and Escoffier complete the source-listed Varka/Odette Stellar-Swirl shell.',varkaSource,'','stellar-swirl'),

  reviewedTeam('prune-varka-durin-nicole','Varka support',['Varka','Prune','Durin','Nicole'],'Prune supports the listed Varka core with Durin and Nicole.',pruneSource),
  reviewedTeam('prune-venti-durin-nicole','Venti support',['Venti','Prune','Durin','Nicole'],'Prune supports the listed Venti/Durin/Nicole composition.',pruneSource),
  reviewedTeam('prune-ganyu-durin-nicole','Ganyu support',['Ganyu','Durin','Prune','Nicole'],'Prune supports Ganyu with Durin and Nicole in the source-listed composition.',pruneSource),
  reviewedTeam('prune-wriothesley-durin-nicole','Wriothesley support',['Wriothesley','Prune','Durin','Nicole'],'Prune supports Wriothesley with Durin and Nicole.',pruneSource),
  reviewedTeam('prune-arlecchino-nicole-yelan','Arlecchino support',['Arlecchino','Nicole','Prune','Yelan'],'Prune and Nicole support Arlecchino while Yelan supplies off-field Hydro.',pruneSource),
  reviewedTeam('prune-mavuika-xilonen-nicole','Mavuika support',['Mavuika','Xilonen','Nicole','Prune'],'Prune joins Xilonen and Nicole in the source-listed Mavuika support shell.',pruneSource),
  reviewedTeam('prune-lohen-durin-nicole','Lohen support',['Lohen','Prune','Durin','Nicole'],'Prune supports Lohen with Durin and Nicole in the listed team.',pruneSource),

  reviewedTeam('lohen-melt-durin-xilonen','Melt · Durin + Xilonen',['Lohen','Durin','Nicole','Xilonen'],'Durin provides Pyro for the explicitly listed Lohen Melt archetype.',lohenSource,'','melt'),
  reviewedTeam('lohen-melt-durin-citlali','Melt · Durin + Citlali',['Lohen','Durin','Nicole','Citlali'],'The source lists Durin enabling Melt while Nicole and Citlali support Lohen.',lohenSource,'','melt'),
  reviewedTeam('lohen-melt-durin-prune','Melt · Durin + Prune',['Lohen','Durin','Nicole','Prune'],'Durin enables the source-listed Melt shell.',lohenSource,'','melt'),
  reviewedTeam('lohen-melt-mavuika-citlali','Melt · Mavuika + Citlali',['Lohen','Mavuika','Nicole','Citlali'],'Mavuika supplies Pyro in the source-listed Melt team.',lohenSource,'','melt'),
  reviewedTeam('lohen-melt-durin-emilie','Melt · Durin + Emilie',['Lohen','Durin','Nicole','Emilie'],'The source lists Emilie in a Durin/Nicole Melt shell around Lohen.',lohenSource,'','melt'),
  reviewedTeam('lohen-melt-xiangling-albedo','Melt · Xiangling + Albedo',['Lohen','Xiangling','Bennett','Albedo'],'Xiangling and Bennett provide the source-listed Pyro core for Lohen Melt.',lohenSource,'','melt'),
  reviewedTeam('lohen-freeze-mona-escoffier','Freeze · Mona + Escoffier',['Lohen','Mona','Furina','Escoffier'],'Mona and Furina supply Hydro for the explicitly listed Freeze archetype.',lohenSource,'','freeze'),
  reviewedTeam('lohen-freeze-citlali-mona','Freeze · Citlali + Mona',['Lohen','Citlali','Mona','Escoffier'],'Mona supplies Hydro while Citlali and Escoffier support Lohen in the listed Freeze team.',lohenSource,'','freeze'),
  reviewedTeam('lohen-freeze-shenhe-kokomi','Freeze · Shenhe + Kokomi',['Lohen','Shenhe','Sangonomiya Kokomi','Kaedehara Kazuha'],'Kokomi supplies Hydro while Shenhe and Kazuha support Lohen in the listed Freeze team.',lohenSource,'','freeze'),
  reviewedTeam('lohen-freeze-mona-xilonen','Freeze · Mona + Xilonen',['Lohen','Mona','Furina','Xilonen'],'Mona and Furina provide Hydro while Xilonen supports the listed Freeze composition.',lohenSource,'','freeze'),
  reviewedTeam('lohen-stellar-nicole','Stellar-Conduct · Nicole',['Lohen','Yae Miko','Odette','Nicole'],'The guide explicitly describes an Odette/Yae Stellar-Conduct shell with Nicole.',lohenSource,'','stellar-conduct'),
  reviewedTeam('lohen-stellar-sucrose','Stellar-Conduct · Sucrose',['Lohen','Yae Miko','Odette','Sucrose'],'The guide explicitly describes an Odette/Yae Stellar-Conduct shell with Sucrose.',lohenSource,'','stellar-conduct'),

  reviewedTeam('zibai-columbina-linnea-illuga','Lunar-Crystallize · Linnea + Illuga',['Zibai','Columbina','Linnea','Illuga'],'The source lists this Lunar-Crystallize team.',zibaiSource,'','lunar-crystallize'),
  reviewedTeam('zibai-columbina-linnea-gorou','Lunar-Crystallize · Linnea + Gorou',['Zibai','Columbina','Linnea','Gorou'],'A source-listed Zibai Lunar-Crystallize variation.',zibaiSource,'','lunar-crystallize'),
  reviewedTeam('zibai-columbina-linnea-zhongli','Lunar-Crystallize · Linnea + Zhongli',['Zibai','Columbina','Linnea','Zhongli'],'A source-listed Zibai Lunar-Crystallize variation.',zibaiSource,'','lunar-crystallize'),
  reviewedTeam('zibai-columbina-linnea-chiori','Lunar-Crystallize · Linnea + Chiori',['Zibai','Columbina','Linnea','Chiori'],'A source-listed Lunar-Crystallize variation.',zibaiSource,'','lunar-crystallize'),
  reviewedTeam('zibai-columbina-linnea-aino','Lunar-Crystallize · Linnea + Aino',['Zibai','Columbina','Linnea','Aino'],'A source-listed Lunar-Crystallize team.',zibaiSource,'','lunar-crystallize'),
  reviewedTeam('zibai-columbina-linnea-ineffa','Lunar-Crystallize · Linnea + Ineffa',['Zibai','Columbina','Linnea','Ineffa'],'A source-listed Lunar-Crystallize team.',zibaiSource,'','lunar-crystallize'),
  reviewedTeam('zibai-linnea-illuga-aino','Lunar-Crystallize · Aino + Illuga',['Zibai','Linnea','Illuga','Aino'],'A source-listed Lunar-Crystallize option.',zibaiSource,'','lunar-crystallize'),
  reviewedTeam('zibai-linnea-aino-zhongli','Lunar-Crystallize · Aino + Zhongli',['Zibai','Linnea','Aino','Zhongli'],'A source-listed Lunar-Crystallize option.',zibaiSource,'','lunar-crystallize'),
  reviewedTeam('zibai-yelan-illuga-linnea','Lunar-Crystallize · Yelan',['Zibai','Yelan','Illuga','Linnea'],'Yelan supplies Hydro in the source-listed Lunar-Crystallize team.',zibaiSource,'','lunar-crystallize'),
  reviewedTeam('zibai-aino-illuga-gorou','Lunar-Crystallize · F2P Aino',['Zibai','Aino','Illuga','Gorou'],'A source-listed accessible Lunar-Crystallize option.',zibaiSource,'','lunar-crystallize'),
  reviewedTeam('zibai-xingqiu-illuga-gorou','Lunar-Crystallize · F2P Xingqiu',['Zibai','Xingqiu','Illuga','Gorou'],'A source-listed accessible Lunar-Crystallize option.',zibaiSource,'','lunar-crystallize'),
  reviewedTeam('zibai-aino-illuga-barbara','Lunar-Crystallize · F2P Barbara',['Zibai','Aino','Illuga','Barbara'],'A source-listed accessible Lunar-Crystallize option.',zibaiSource,'','lunar-crystallize'),

  reviewedTeam('illuga-zibai-columbina-gorou','Lunar-Crystallize · Zibai + Gorou',['Zibai','Columbina','Illuga','Gorou'],'Illuga supports the source-listed Zibai/Columbina Lunar-Crystallize core.',illugaSource,'','lunar-crystallize'),
  reviewedTeam('illuga-zibai-columbina-zhongli','Lunar-Crystallize · Zibai + Zhongli',['Zibai','Columbina','Illuga','Zhongli'],'Illuga supports the source-listed Lunar-Crystallize core.',illugaSource,'','lunar-crystallize'),
  reviewedTeam('illuga-zibai-columbina-chiori','Lunar-Crystallize · Zibai + Chiori',['Zibai','Columbina','Illuga','Chiori'],'Illuga supports the source-listed Lunar-Crystallize core.',illugaSource,'','lunar-crystallize'),
  reviewedTeam('illuga-zibai-columbina-ineffa','Lunar-Crystallize · Zibai + Ineffa',['Zibai','Columbina','Illuga','Ineffa'],'Illuga supports the source-listed Lunar-Crystallize core.',illugaSource,'','lunar-crystallize'),
  reviewedTeam('illuga-zibai-aino-gorou','Lunar-Crystallize · Zibai + Aino',['Zibai','Aino','Illuga','Gorou'],'Zibai enables Lunar-Crystallize in the source-listed variation.',illugaSource,'','lunar-crystallize'),
  reviewedTeam('illuga-itto-columbina-gorou','Lunar-Crystallize · Itto + Gorou',['Arataki Itto','Columbina','Illuga','Gorou'],'Columbina enables the source-listed Lunar-Crystallize Geo shell.',illugaSource,'','lunar-crystallize'),
  reviewedTeam('illuga-itto-columbina-chiori','Lunar-Crystallize · Itto + Chiori',['Arataki Itto','Columbina','Illuga','Chiori'],'Columbina enables the source-listed Lunar-Crystallize Geo shell.',illugaSource,'','lunar-crystallize'),
  reviewedTeam('illuga-navia-columbina-chiori','Lunar-Crystallize · Navia + Chiori',['Navia','Columbina','Illuga','Chiori'],'Columbina enables the source-listed Lunar-Crystallize Geo shell.',illugaSource,'','lunar-crystallize'),
  reviewedTeam('illuga-navia-columbina-furina','Lunar-Crystallize · Navia + Furina',['Navia','Columbina','Illuga','Furina'],'Columbina enables Lunar-Crystallize in the source-listed Navia/Illuga team.',illugaSource,'','lunar-crystallize'),
  reviewedTeam('illuga-itto-aino-gorou','Geo · Itto + Aino',['Arataki Itto','Aino','Illuga','Gorou'],'The guide lists this Geo team; Hotaru leaves the primary reaction unset.',illugaSource),
  reviewedTeam('illuga-navia-furina-bennett','Geo · Navia + Furina',['Navia','Furina','Bennett','Illuga'],'The guide lists this Geo team; Hotaru leaves the primary reaction unset.',illugaSource),

  reviewedTeam('linnea-columbina-illuga-zibai','Lunar-Crystallize · Zibai',['Linnea','Columbina','Illuga','Zibai'],'The Linnea guide lists this Lunar-Crystallize team.',linneaSource,'','lunar-crystallize'),
  reviewedTeam('linnea-columbina-illuga-itto','Lunar-Crystallize · Itto',['Linnea','Columbina','Illuga','Arataki Itto'],'The source lists this Lunar-Crystallize team.',linneaSource,'','lunar-crystallize'),
  reviewedTeam('linnea-columbina-illuga-navia','Lunar-Crystallize · Navia',['Linnea','Columbina','Illuga','Navia'],'The source lists this Lunar-Crystallize team.',linneaSource,'','lunar-crystallize'),
  reviewedTeam('linnea-columbina-illuga-noelle','Lunar-Crystallize · Noelle',['Linnea','Columbina','Illuga','Noelle'],'The source lists this Lunar-Crystallize team.',linneaSource,'','lunar-crystallize'),
  reviewedTeam('linnea-columbina-illuga-ningguang','Lunar-Crystallize · Ningguang',['Linnea','Columbina','Illuga','Ningguang'],'The source lists this Lunar-Crystallize team.',linneaSource,'','lunar-crystallize'),
  reviewedTeam('linnea-columbina-mona-albedo','Lunar-Crystallize · Mona + Albedo',['Linnea','Columbina','Mona','Albedo'],'The source includes this composition in Linnea’s Lunar-Crystallize team guide.',linneaSource,'','lunar-crystallize'),
  // Same composition as the Zibai/Linnea guide entry: preserve HoYoLAB as secondary provenance, do not double-count.
  reviewedTeam('linnea-hoyolab-zibai-columbina-illuga','Lunar-Crystallize · HoYoLAB premium',['Linnea','Zibai','Columbina','Illuga'],'Verified HoYoLAB creator showcase for the same premium Lunar-Crystallize composition.',hoyolabLinneaSource,'','lunar-crystallize'),
];
