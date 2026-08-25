import { REMAINING_FOUR_STAR_REVIEWED_TEAMS, REMAINING_FOUR_STAR_TEAM_MAP } from './remaining-four-stars-reviewed.js';
const canonicalMember=value=>value==='Mizuki'?'Yumemizuki Mizuki':value;
for(const team of REMAINING_FOUR_STAR_REVIEWED_TEAMS)team.members=team.members.map(canonicalMember);
export { REMAINING_FOUR_STAR_REVIEWED_TEAMS, REMAINING_FOUR_STAR_TEAM_MAP };
export default REMAINING_FOUR_STAR_REVIEWED_TEAMS;
