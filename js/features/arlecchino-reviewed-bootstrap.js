import { registerReviewedTeams } from '../data/team-profiles/index.js';
import { ARLECCHINO_REVIEWED_TEAMS } from '../data/team-profiles/arlecchino-reviewed.js';
import { COLUMBINA_REVIEWED_TEAMS } from '../data/team-profiles/columbina-reviewed.js';
import { CLORINDE_REVIEWED_TEAMS } from '../data/team-profiles/clorinde-reviewed.js';

let registered=false;
export function registerReviewedCharacterTeams(){
  if(registered)return 0;
  registered=true;
  registerReviewedTeams(ARLECCHINO_REVIEWED_TEAMS);
  registerReviewedTeams(COLUMBINA_REVIEWED_TEAMS);
  registerReviewedTeams(CLORINDE_REVIEWED_TEAMS);
  const count=ARLECCHINO_REVIEWED_TEAMS.length+COLUMBINA_REVIEWED_TEAMS.length+CLORINDE_REVIEWED_TEAMS.length;
  document.dispatchEvent(new CustomEvent('hotaru:reviewed-character-teams-updated',{detail:{characters:['Arlecchino','Columbina','Clorinde'],count}}));
  return count;
}

registerReviewedCharacterTeams();
