import { ALOY_REVIEWED_TEAMS } from '../team-profiles/aloy-reviewed.js';
const GAME8='https://game8.co/games/Genshin-Impact/archives/337957';
const KQM='https://keqingmains.com/q/aloy-quickguide/';
const ICY='https://www.icy-veins.com/genshin-impact/aloy-team-guide';
const source=(label,url,type='Reviewed theorycraft')=>({label,url,type,platform:'Guide',reviewedAt:'2026-08-23'});
const SOURCES=[source('Game8 Aloy Rating and Best Builds',GAME8,'Source-backed guide'),source('KQM Aloy Quick Guide',KQM),source('Icy Veins Aloy Team Guide',ICY,'Source-backed guide')];
function key(v=''){return String(v||'').trim().toLowerCase()}
function specialAvatar(v=''){const n=String(v||'').trim();return /\bTPS\b/i.test(n)||/manekin/i.test(n)}
function canonical(v=''){
 const n=String(v||'').trim();
 if(/\b(?:aether|lumine)\s+anemo\b/i.test(n))return'Anemo Traveler';
 if(/\b(?:aether|lumine)\s+geo\b/i.test(n))return'Geo Traveler';
 if(/\b(?:aether|lumine)\s+electro\b/i.test(n))return'Electro Traveler';
 if(/\b(?:aether|lumine)\s+dendro\b/i.test(n))return'Dendro Traveler';
 if(/\b(?:aether|lumine)\s+hydro\b/i.test(n))return'Hydro Traveler';
 if(/\b(?:aether|lumine)\s+pyro\b/i.test(n))return'Pyro Traveler';
 if(/\b(?:aether|lumine)\s+cryo\b/i.test(n))return'Cryo Traveler';
 return n;
}
const evidence=new Map();
for(const team of ALOY_REVIEWED_TEAMS){for(const member of team.members||[]){if(key(member)==='aloy')continue;const k=key(member),row=evidence.get(k)||{teams:[],sources:[],reactions:[]};row.teams.push(team.id);if(team.reaction)row.reactions.push(team.reaction);if(team.source?.url&&!row.sources.some(s=>s.url===team.source.url))row.sources.push(team.source);evidence.set(k,row)}}
const CAVEATS=new Map([
 [key('Nilou'),'Nilou Bountiful Core teams require only Hydro and Dendro; Cryo Aloy breaks that restriction.'],
 [key('Chevreuse'),'Chevreuse’s strongest Overload passive requires Pyro/Electro-only teammates; Aloy does not belong in that shell.'],
 [key('Ganyu'),'Ganyu can be Aloy’s primary Cryo DPS in Freeze/Mono Cryo, but Yelan/Xingqiu are less ideal when Ganyu does not Normal Attack.'],
 [key('Furina'),'Furina is compatible in Freeze, but pair her with strong healing such as Jean or Escoffier to build Fanfare and offset HP drain.'],
 [key('Bennett'),'Bennett is the core Reverse Melt enabler/buffer; keep a reliable Pyro aura source and avoid disrupting Melt ownership.'],
 [key('Venti'),'Venti is excellent in multi-target Freeze and lowers ER needs, but he does not reliably pull Aloy’s Chillwater Bomblets.']
]);
export function aloyCompatibilityForCharacter(value=''){
 const raw=String(value||'').trim(),canon=canonical(raw),k=key(canon);
 if(!raw)return{character:raw,canonical:canon,status:'invalid',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Missing character name'};
 if(k==='aloy')return{character:raw,canonical:'Aloy',status:'self',smartTeamApproved:false,adaptationAllowed:false,sources:SOURCES,reason:'Aloy cannot be paired with herself.'};
 if(specialAvatar(raw))return{character:raw,canonical:canon,status:'not-applicable',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Special/TPS avatar records are not Smart Team characters.'};
 const exact=evidence.get(k);
 if(exact)return{character:raw,canonical:canon,status:'source-backed-compatible',smartTeamApproved:true,adaptationAllowed:true,sources:exact.sources.length?exact.sources:SOURCES,teamIds:[...new Set(exact.teams)],reactions:[...new Set(exact.reactions)],caveat:CAVEATS.get(k)||'',reason:'This character appears in an exact or explicitly source-informed reviewed Aloy team.'};
 return{character:raw,canonical:canon,status:'unverified',smartTeamApproved:false,adaptationAllowed:false,sources:SOURCES,caveat:CAVEATS.get(k)||'',reason:'No Aloy-specific reviewed evidence is strong enough to authorize Smart Team adaptation. Hotaru blocks the pairing instead of inferring compatibility from element alone.'};
}
export function auditAloyCompatibility(characterNames=[]){const rows=(characterNames||[]).map(aloyCompatibilityForCharacter),counts={};for(const row of rows)counts[row.status]=(counts[row.status]||0)+1;return{character:'Aloy',reviewedAt:'2026-08-23',rows,total:rows.length,counts,smartTeamApproved:rows.filter(r=>r.smartTeamApproved).length,unverified:rows.filter(r=>r.status==='unverified').map(r=>r.character),sources:SOURCES}}
export const ALOY_COMPATIBILITY_POLICY={character:'Aloy',reviewedAt:'2026-08-23',rule:'Every released avatar record receives an explicit Aloy compatibility status. Only exact or explicitly source-informed Reverse Melt, Freeze, or Mono Cryo evidence may authorize Smart Team adaptation; unverified and team-restriction conflicts remain blocked.',sources:SOURCES};