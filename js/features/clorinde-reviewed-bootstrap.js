import { registerReviewedTeams } from '../data/team-profiles/index.js';
import { CLORINDE_REVIEWED_TEAMS } from '../data/team-profiles/clorinde-reviewed.js';

let registered=false;
export function registerClorindeReviewedTeams(){
  if(registered)return 0;
  registered=true;
  registerReviewedTeams(CLORINDE_REVIEWED_TEAMS);
  document.dispatchEvent(new CustomEvent('hotaru:reviewed-character-teams-updated',{detail:{character:'Clorinde',count:CLORINDE_REVIEWED_TEAMS.length}}));
  return CLORINDE_REVIEWED_TEAMS.length;
}
registerClorindeReviewedTeams();
