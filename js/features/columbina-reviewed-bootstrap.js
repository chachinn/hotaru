import { registerReviewedTeams } from '../data/team-profiles/index.js';
import { COLUMBINA_REVIEWED_TEAMS } from '../data/team-profiles/columbina-reviewed.js';

let registered=false;
export function registerColumbinaReviewedTeams(){
  if(registered)return 0;
  registered=true;
  registerReviewedTeams(COLUMBINA_REVIEWED_TEAMS);
  document.dispatchEvent(new CustomEvent('hotaru:reviewed-character-teams-updated',{detail:{character:'Columbina',count:COLUMBINA_REVIEWED_TEAMS.length}}));
  return COLUMBINA_REVIEWED_TEAMS.length;
}
registerColumbinaReviewedTeams();
