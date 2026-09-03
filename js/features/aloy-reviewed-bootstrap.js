import { registerReviewedTeams } from '../data/team-profiles/index.js';
import { communityRecommendedTeams, registerCommunityTeams } from '../data/team-recommendations.js';
import { ALYOSHA_REVIEWED_TEAMS } from '../data/team-profiles/alyosha-reviewed.js';
import { ALOY_REVIEWED_TEAMS } from '../data/team-profiles/aloy-reviewed.js';
import { AMBER_REVIEWED_TEAMS } from '../data/team-profiles/amber-reviewed.js';
import { BARBARA_REVIEWED_TEAMS } from '../data/team-profiles/barbara-reviewed.js';
import { BEIDOU_REVIEWED_TEAMS } from '../data/team-profiles/beidou-reviewed.js';
import { BENNETT_REVIEWED_TEAMS } from '../data/team-profiles/bennett-reviewed.js';
import { CANDACE_REVIEWED_TEAMS } from '../data/team-profiles/candace-reviewed.js';
import { CHARLOTTE_REVIEWED_TEAMS } from '../data/team-profiles/charlotte-reviewed.js';
import { CHEVREUSE_REVIEWED_TEAMS } from '../data/team-profiles/chevreuse-reviewed.js';
import { CHONGYUN_REVIEWED_TEAMS } from '../data/team-profiles/chongyun-reviewed.js';
import { COLLEI_REVIEWED_TEAMS } from '../data/team-profiles/collei-reviewed.js';
import { DAHLIA_REVIEWED_TEAMS } from '../data/team-profiles/dahlia-reviewed.js';
import { DORI_REVIEWED_TEAMS } from '../data/team-profiles/dori-reviewed.js';
import { FARUZAN_REVIEWED_TEAMS } from '../data/team-profiles/faruzan-reviewed.js';
import { FISCHL_REVIEWED_TEAMS } from '../data/team-profiles/fischl-reviewed.js';
import { FREMINET_REVIEWED_TEAMS } from '../data/team-profiles/freminet-reviewed.js';
import { GAMING_REVIEWED_TEAMS } from '../data/team-profiles/gaming-reviewed.js';
import { GOROU_REVIEWED_TEAMS } from '../data/team-profiles/gorou-reviewed.js';
import { IANSAN_REVIEWED_TEAMS } from '../data/team-profiles/iansan-reviewed.js';
import { IFA_REVIEWED_TEAMS } from '../data/team-profiles/ifa-reviewed.js';
import { ILLUGA_REVIEWED_TEAMS } from '../data/team-profiles/illuga-reviewed.js';
import { JAHODA_REVIEWED_TEAMS } from '../data/team-profiles/jahoda-reviewed.js';
import { KACHINA_REVIEWED_TEAMS } from '../data/team-profiles/kachina-reviewed.js';
import { KAEYA_REVIEWED_TEAMS } from '../data/team-profiles/kaeya-reviewed.js';
import { KAVEH_REVIEWED_TEAMS } from '../data/team-profiles/kaveh-reviewed.js';
import { KIRARA_REVIEWED_TEAMS } from '../data/team-profiles/kirara-reviewed.js';
import { KUJOU_SARA_REVIEWED_TEAMS } from '../data/team-profiles/kujou-sara-reviewed.js';
import { KUKI_SHINOBU_REVIEWED_TEAMS } from '../data/team-profiles/kuki-shinobu-reviewed.js';
import { LAN_YAN_REVIEWED_TEAMS } from '../data/team-profiles/lan-yan-reviewed.js';
import { LAYLA_REVIEWED_TEAMS } from '../data/team-profiles/layla-reviewed.js';
import { LISA_REVIEWED_TEAMS } from '../data/team-profiles/lisa-reviewed.js';
import { LYNETTE_REVIEWED_TEAMS } from '../data/team-profiles/lynette-reviewed.js';
import { MIKA_REVIEWED_TEAMS } from '../data/team-profiles/mika-reviewed.js';
import { NINGGUANG_REVIEWED_TEAMS } from '../data/team-profiles/ningguang-reviewed.js';
import { REMAINING_FOUR_STAR_REVIEWED_TEAMS } from '../data/team-profiles/remaining-four-stars-canonical.js';
import { ARATAKI_ITTO_REVIEWED_TEAMS } from '../data/team-profiles/arataki-itto-reviewed.js';
import { BAIZHU_REVIEWED_TEAMS } from '../data/team-profiles/baizhu-reviewed.js';
import { CHASCA_REVIEWED_TEAMS } from '../data/team-profiles/chasca-reviewed.js';
import { CHIORI_REVIEWED_TEAMS } from '../data/team-profiles/chiori-reviewed.js';
import { CITLALI_REVIEWED_TEAMS } from '../data/team-profiles/citlali-reviewed.js';
import { CYNO_REVIEWED_TEAMS } from '../data/team-profiles/cyno-reviewed.js';
import { DEHYA_REVIEWED_TEAMS } from '../data/team-profiles/dehya-reviewed.js';
import { DILUC_REVIEWED_TEAMS } from '../data/team-profiles/diluc-reviewed.js';
import { EMILIE_REVIEWED_TEAMS } from '../data/team-profiles/emilie-reviewed.js';
import { ESCOFFIER_REVIEWED_TEAMS } from '../data/team-profiles/escoffier-reviewed.js';
import { EULA_REVIEWED_TEAMS } from '../data/team-profiles/eula-reviewed.js';
import { FLINS_REVIEWED_TEAMS } from '../data/team-profiles/flins-reviewed-clean.js';
import { FURINA_REVIEWED_TEAMS } from '../data/team-profiles/furina-reviewed.js';
import { GANYU_REVIEWED_TEAMS } from '../data/team-profiles/ganyu-reviewed.js';
import { HU_TAO_REVIEWED_TEAMS } from '../data/team-profiles/hu-tao-reviewed-clean.js';
import { INEFFA_REVIEWED_TEAMS } from '../data/team-profiles/ineffa-reviewed.js';
import { JEAN_REVIEWED_TEAMS } from '../data/team-profiles/jean-reviewed.js';
import { KAEDEHARA_KAZUHA_REVIEWED_TEAMS } from '../data/team-profiles/kaedehara-kazuha-reviewed.js';
import { KAMISATO_AYAKA_REVIEWED_TEAMS } from '../data/team-profiles/kamisato-ayaka-reviewed.js';
import { KAMISATO_AYATO_REVIEWED_TEAMS } from '../data/team-profiles/kamisato-ayato-reviewed.js';
import { KEQING_REVIEWED_TEAMS } from '../data/team-profiles/keqing-reviewed.js';
import { REMAINING_FIVE_STAR_REVIEWED_TEAMS } from '../data/team-profiles/remaining-five-stars-reviewed.js';

// Register the complete reviewed catalog in one index rebuild. Registering each character
// separately made startup cost grow explosively as the catalog expanded and could freeze
// iOS/PWA interaction for minutes after the shell had already painted.
const REVIEWED_BOOTSTRAP_TEAMS=[
  ...ALYOSHA_REVIEWED_TEAMS,...ALOY_REVIEWED_TEAMS,...AMBER_REVIEWED_TEAMS,...BARBARA_REVIEWED_TEAMS,
  ...BEIDOU_REVIEWED_TEAMS,...BENNETT_REVIEWED_TEAMS,...CANDACE_REVIEWED_TEAMS,...CHARLOTTE_REVIEWED_TEAMS,
  ...CHEVREUSE_REVIEWED_TEAMS,...CHONGYUN_REVIEWED_TEAMS,...COLLEI_REVIEWED_TEAMS,...DAHLIA_REVIEWED_TEAMS,
  ...DORI_REVIEWED_TEAMS,...FARUZAN_REVIEWED_TEAMS,...FISCHL_REVIEWED_TEAMS,...FREMINET_REVIEWED_TEAMS,
  ...GAMING_REVIEWED_TEAMS,...GOROU_REVIEWED_TEAMS,...IANSAN_REVIEWED_TEAMS,...IFA_REVIEWED_TEAMS,
  ...ILLUGA_REVIEWED_TEAMS,...JAHODA_REVIEWED_TEAMS,...KACHINA_REVIEWED_TEAMS,...KAEYA_REVIEWED_TEAMS,
  ...KAVEH_REVIEWED_TEAMS,...KIRARA_REVIEWED_TEAMS,...KUJOU_SARA_REVIEWED_TEAMS,...KUKI_SHINOBU_REVIEWED_TEAMS,
  ...LAN_YAN_REVIEWED_TEAMS,...LAYLA_REVIEWED_TEAMS,...LISA_REVIEWED_TEAMS,...LYNETTE_REVIEWED_TEAMS,
  ...MIKA_REVIEWED_TEAMS,...NINGGUANG_REVIEWED_TEAMS,...REMAINING_FOUR_STAR_REVIEWED_TEAMS,
  ...ARATAKI_ITTO_REVIEWED_TEAMS,...BAIZHU_REVIEWED_TEAMS,...CHASCA_REVIEWED_TEAMS,...CHIORI_REVIEWED_TEAMS,
  ...CITLALI_REVIEWED_TEAMS,...CYNO_REVIEWED_TEAMS,...DEHYA_REVIEWED_TEAMS,...DILUC_REVIEWED_TEAMS,
  ...EMILIE_REVIEWED_TEAMS,...ESCOFFIER_REVIEWED_TEAMS,...EULA_REVIEWED_TEAMS,...FLINS_REVIEWED_TEAMS,
  ...FURINA_REVIEWED_TEAMS,...GANYU_REVIEWED_TEAMS,...HU_TAO_REVIEWED_TEAMS,...INEFFA_REVIEWED_TEAMS,
  ...JEAN_REVIEWED_TEAMS,...KAEDEHARA_KAZUHA_REVIEWED_TEAMS,...KAMISATO_AYAKA_REVIEWED_TEAMS,
  ...KAMISATO_AYATO_REVIEWED_TEAMS,...KEQING_REVIEWED_TEAMS,...REMAINING_FIVE_STAR_REVIEWED_TEAMS
];
registerReviewedTeams(REVIEWED_BOOTSTRAP_TEAMS);
registerCommunityTeams(communityRecommendedTeams());
