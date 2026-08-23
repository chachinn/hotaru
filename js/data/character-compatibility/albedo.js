import { ALBEDO_REVIEWED_TEAMS } from '../team-profiles/albedo-reviewed.js';
const GAME8='https://game8.co/games/Genshin-Impact/archives/312182';
const KQM='https://keqingmains.com/q/albedo-quickguide/';
const source=(label,url)=>({label,url,platform:'Guide',reviewedAt:'2026-08-23'});
const SOURCES=[source('Game8 Albedo Rating and Best Builds',GAME8),source('KQM Albedo Quick Guide',KQM)];
function key(value=''){return String(value||'').trim().toLowerCase()}
function specialAvatar(value=''){const name=String(value||'').trim();return /\bTPS\b/i.test(name)||/manekin/i.test(name)}
function canonical(value=''){
 const name=String(value||'').trim();
 if(/\b(?:aether|lumine)\s+anemo\b/i.test(name))return'Anemo Traveler';
 if(/\b(?:aether|lumine)\s+geo\b/i.test(name))return'Geo Traveler';
 if(/\b(?:aether|lumine)\s+electro\b/i.test(name))return'Electro Traveler';
 if(/\b(?:aether|lumine)\s+dendro\b/i.test(name))return'Dendro Traveler';
 if(/\b(?:aether|lumine)\s+hydro\b/i.test(name))return'Hydro Traveler';
 if(/\b(?:aether|lumine)\s+pyro\b/i.test(name))return'Pyro Traveler';
 if(/\b(?:aether|lumine)\s+cryo\b/i.test(name))return'Cryo Traveler';
 return name;
}
const evidence=new Map();
for(const team of ALBEDO_REVIEWED_TEAMS){for(const member of team.members||[]){if(key(member)==='albedo')continue;const k=key(member),row=evidence.get(k)||{teams:[],sources:[],reactions:[]};row.teams.push(team.id);if(team.reaction)row.reactions.push(team.reaction);if(team.source?.url&&!row.sources.some(s=>s.url===team.source.url))row.sources.push(team.source);evidence.set(k,row)}}
const CAVEATS=new Map([
 [key('Nilou'),'Nilou Bountiful Core teams require only Hydro and Dendro; Geo Albedo breaks that restriction.'],
 [key('Chevreuse'),'Chevreuse’s strongest Overload passive requires a Pyro/Electro-only party, so Albedo cannot be inserted into that shell.'],
 [key('Hu Tao'),'Use Albedo only in a reviewed Double Geo/flex shell; careless Geo application can interfere with strict Vaporize aura management.'],
 [key('Arlecchino'),'Use Albedo only in reviewed Geo/Hexerei shells; do not insert him into reaction-sensitive Vaporize/Melt teams automatically.'],
 [key('Zibai'),'Lunar-Crystallize teams may want Albedo at higher DEF to maximize the relevant team bonus.']
]);
export function albedoCompatibilityForCharacter(value=''){
 const raw=String(value||'').trim(),canon=canonical(raw),k=key(canon);
 if(!raw)return{character:raw,canonical:canon,status:'invalid',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Missing character name'};
 if(k==='albedo')return{character:raw,canonical:'Albedo',status:'self',smartTeamApproved:false,adaptationAllowed:false,sources:SOURCES,reason:'Albedo cannot be paired with himself.'};
 if(specialAvatar(raw))return{character:raw,canonical:canon,status:'not-applicable',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Special/TPS avatar records are not Smart Team characters.'};
 const exact=evidence.get(k);
 if(exact)return{character:raw,canonical:canon,status:'source-backed-compatible',smartTeamApproved:true,adaptationAllowed:true,sources:exact.sources.length?exact.sources:SOURCES,teamIds:[...new Set(exact.teams)],reactions:[...new Set(exact.reactions)],caveat:CAVEATS.get(k)||'',reason:'This character appears in an exact or explicitly source-informed reviewed Albedo team.'};
 return{character:raw,canonical:canon,status:'unverified',smartTeamApproved:false,adaptationAllowed:false,sources:SOURCES,caveat:CAVEATS.get(k)||'',reason:'No Albedo-specific reviewed evidence is strong enough to authorize Smart Team adaptation. Hotaru blocks the pair instead of inventing a team.'};
}
export function auditAlbedoCompatibility(characterNames=[]){const rows=(characterNames||[]).map(albedoCompatibilityForCharacter),counts={};for(const row of rows)counts[row.status]=(counts[row.status]||0)+1;return{character:'Albedo',reviewedAt:'2026-08-23',rows,total:rows.length,counts,smartTeamApproved:rows.filter(r=>r.smartTeamApproved).length,unverified:rows.filter(r=>r.status==='unverified').map(r=>r.character),sources:SOURCES}}
export const ALBEDO_COMPATIBILITY_POLICY={character:'Albedo',reviewedAt:'2026-08-23',rule:'Every released avatar record receives an explicit Albedo compatibility status. Only exact or explicitly source-informed reviewed archetype evidence may authorize Smart Team adaptation; unverified or reaction-restricted pairings remain blocked.',sources:SOURCES};