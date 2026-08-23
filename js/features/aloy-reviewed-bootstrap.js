import { registerReviewedTeams } from '../data/team-profiles/index.js';
import { ALOY_REVIEWED_TEAMS } from '../data/team-profiles/aloy-reviewed.js';
import { AMBER_REVIEWED_TEAMS } from '../data/team-profiles/amber-reviewed.js';
import { ARATAKI_ITTO_REVIEWED_TEAMS } from '../data/team-profiles/arataki-itto-reviewed.js';

registerReviewedTeams(ALOY_REVIEWED_TEAMS);
registerReviewedTeams(AMBER_REVIEWED_TEAMS);
registerReviewedTeams(ARATAKI_ITTO_REVIEWED_TEAMS);
