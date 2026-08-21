import arlecchino from './arlecchino.js';
import tartaglia from './tartaglia.js';
import columbina from './columbina.js';

export const REVIEWED_BUILD_PROFILES=[arlecchino,tartaglia,columbina];

function key(value=''){return String(value||'').trim().toLowerCase()}
const PROFILE_INDEX=new Map();
for(const profile of REVIEWED_BUILD_PROFILES){
  PROFILE_INDEX.set(key(profile.character),profile);
  for(const alias of profile.aliases||[])PROFILE_INDEX.set(key(alias),profile);
}

export function reviewedBuildProfile(name=''){return PROFILE_INDEX.get(key(name))||null}
