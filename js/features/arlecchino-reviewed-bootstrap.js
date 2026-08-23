import { registerReviewedTeams } from '../data/team-profiles/index.js';
import { ARLECCHINO_REVIEWED_TEAMS } from '../data/team-profiles/arlecchino-reviewed.js';
import { COLUMBINA_REVIEWED_TEAMS } from '../data/team-profiles/columbina-reviewed.js';

let registered=false;
export function registerReviewedCharacterTeams(){
  if(registered)return 0;
  registered=true;
  registerReviewedTeams(ARLECCHINO_REVIEWED_TEAMS);
  registerReviewedTeams(COLUMBINA_REVIEWED_TEAMS);
  document.dispatchEvent(new CustomEvent('hotaru:reviewed-character-teams-updated',{detail:{characters:['Arlecchino','Columbina'],count:ARLECCHINO_REVIEWED_TEAMS.length+COLUMBINA_REVIEWED_TEAMS.length}}));
  return ARLECCHINO_REVIEWED_TEAMS.length+COLUMBINA_REVIEWED_TEAMS.length;
}

registerReviewedCharacterTeams();
