import { registerReviewedTeams } from '../data/team-profiles/index.js';
import { ALOY_REVIEWED_TEAMS } from '../data/team-profiles/aloy-reviewed.js';
import { AMBER_REVIEWED_TEAMS } from '../data/team-profiles/amber-reviewed.js';

registerReviewedTeams(ALOY_REVIEWED_TEAMS);
registerReviewedTeams(AMBER_REVIEWED_TEAMS);
