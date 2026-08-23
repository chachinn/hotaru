import arlecchino from './arlecchino.js';
import tartaglia from './tartaglia.js';
import columbina from './columbina.js';
import clorinde from './clorinde.js';
import odette from './odette.js';
import aino from './aino.js';
import alhaitham from './alhaitham.js';
import albedo from './albedo.js';
import aloy from './aloy.js';
import amber from './amber.js';
import aratakiItto from './arataki-itto.js';
import baizhu from './baizhu.js';
import chasca from './chasca.js';
import chiori from './chiori.js';
import citlali from './citlali.js';
import cyno from './cyno.js';
import dehya from './dehya.js';
import diluc from './diluc.js';
import emilie from './emilie.js';
import escoffier from './escoffier.js';
import eula from './eula.js';
import flins from './flins.js';
import furina from './furina.js';
import ganyu from './ganyu.js';

export const REVIEWED_BUILD_PROFILES=[arlecchino,tartaglia,columbina,clorinde,odette,aino,alhaitham,albedo,aloy,amber,aratakiItto,baizhu,chasca,chiori,citlali,cyno,dehya,diluc,emilie,escoffier,eula,flins,furina,ganyu];

function key(value=''){return String(value||'').trim().toLowerCase()}
const PROFILE_INDEX=new Map();
for(const profile of REVIEWED_BUILD_PROFILES){PROFILE_INDEX.set(key(profile.character),profile);for(const alias of profile.aliases||[])PROFILE_INDEX.set(key(alias),profile)}
export function reviewedBuildProfile(name=''){return PROFILE_INDEX.get(key(name))||null}
