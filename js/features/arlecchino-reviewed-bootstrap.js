import { registerReviewedTeams } from '../data/team-profiles/index.js';
import { ARLECCHINO_REVIEWED_TEAMS } from '../data/team-profiles/arlecchino-reviewed.js';

let registered=false;
export function registerArlecchinoReviewedTeams(){
  if(registered)return 0;
  registered=true;
  registerReviewedTeams(ARLECCHINO_REVIEWED_TEAMS);
  document.dispatchEvent(new CustomEvent('hotaru:reviewed-character-teams-updated',{detail:{character:'Arlecchino',count:ARLECCHINO_REVIEWED_TEAMS.length}}));
  return ARLECCHINO_REVIEWED_TEAMS.length;
}

registerArlecchinoReviewedTeams();
