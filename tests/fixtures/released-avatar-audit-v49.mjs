import { RELEASED_AVATAR_AUDIT_V45 } from './released-avatar-audit-v45.mjs';

// Version 7.1 adds Vesna and Vodyanitsa to the playable-character audit while
// preserving the frozen v45 fixture for historical regression suites.
export const RELEASED_AVATAR_AUDIT_V49=['Vesna','Vodyanitsa',...RELEASED_AVATAR_AUDIT_V45];
export const NAMED_CHARACTER_COUNT=120;
export const TEAM_ELIGIBLE_COUNT=134;
export const SPECIAL_AVATAR_COUNT=16;
