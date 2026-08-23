import { GANYU_REVIEWED_TEAMS } from '../team-profiles/ganyu-reviewed.js';
const KQM='https://keqingmains.com/q/ganyu-quickguide/',IV='https://www.icy-veins.com/genshin-impact/ganyu-guide-best-builds';
const source=(label,url,type)=>({label,url,type,platform:'Guide',reviewedAt:'2026-08-23'}),SOURCES=[source('Current Ganyu theorycraft',KQM,'Reviewed theorycraft'),source('Current Ganyu build cross-check',IV,'Source-backed guide')];
function key(v=''){return String(v||'').trim().toLowerCase()} function special(v=''){return /\bTPS\b|manekin/i.test(String(v||''))}
function canonical(v=''){const n=String(v||'').trim();for(const e of ['Anemo','Geo','Electro','Dendro','Hydro','Pyro','Cryo'])if(new RegExp(`\\b(?:aether|lumine)\\s+${e}\\b`,'i').test(n))return`${e} Traveler`;return n}
const evidence=new Map();for(const t of GANYU_REVIEWED_TEAMS)for(const m of t.members||[]){if(key(m)==='ganyu')continue;const k=key(m),r=evidence.get(k)||{teams:[],sources:[],reactions:[]};r.teams.push(t.id);if(t.reaction)r.reactions.push(t.reaction);for(const s of [t.source,...(t.source?.links||[])])if(s?.url&&!r.sources.some(x=>x.url===s.url))r.sources.push(s);evidence.set(k,r)}
const caveat=new Map([
[key('Furina'),'Strong Freeze partner and enables Marechaussee Hunter through HP drain, but pair her with real healing such as Escoffier or Charlotte so Fanfare remains healthy.'],
[key('Escoffier'),'Excellent Freeze support when the team remains Hydro/Cryo: healing sustains Furina and her full Cryo/Hydro RES shred rewards pure Hydro/Cryo structure.'],
[key('Shenhe'),'High-value Cryo buffer/battery for Freeze or Mono Cryo.'],
[key('Citlali'),'Cryo support and shielding help Ganyu complete uninterrupted Frostflake shots.'],
[key('Kaedehara Kazuha'),'Groups and shreds/buffs Cryo; valuable in Freeze, Mono Cryo, and advanced Melt shells.'],
[key('Venti'),'Exceptional grouping can multiply Celestial Shower damage against pullable enemies; value drops sharply on ungroupable targets.'],
[key('Mona'),'Freeze/Omen support; Hydro uptime and survivability depend on the other slots.'],
[key('Sangonomiya Kokomi'),'Comfort Hydro/healing option for Freeze with stable application.'],
[key('Charlotte'),'Teamwide healer/battery that pairs especially well with Furina Freeze.'],
[key('Rosaria'),'Cryo battery and CRIT support; useful in Freeze and Mono Cryo.'],
[key('Zhongli'),'Excellent interruption resistance for Charged Attack Ganyu and useful RES shred; especially valuable in Melt.'],
[key('Bennett'),'Core Melt buffer/healer, but Bennett alone is not enough persistent Pyro for easy Melt uptime.'],
[key('Xiangling'),'Strong persistent off-field Pyro for classic Melt; typically paired with Bennett and interruption resistance.'],
[key('Dehya'),'Off-field Pyro plus interruption resistance makes Burnmelt/Melt more comfortable.'],
[key('Nahida'),'Enables Burnmelt by sustaining Dendro/Burning; requires a Pyro partner and does not replace interruption protection.'],
[key('Emilie'),'Burning-compatible off-field damage partner for Burnmelt; keep Burning active to justify Reverie.'],
[key('Kamisato Ayaka'),'Ganyu can switch to Burst-centric Cryo support while Ayaka takes field time.'],
[key('Wriothesley'),'Ganyu can act as off-field Cryo support; do not force Charged Attack field time in this shell.'],
[key('Skirk'),'Ganyu can supply off-field Cryo/Burst support around Skirk-focused Freeze teams.'],
[key('Arlecchino'),'Ganyu may act as off-field Cryo support for occasional Melt; she is not the on-field Charged Attack carry in this pairing.'],
[key('Xingqiu'),'Not a generic on-field Ganyu partner: his coordinated attacks require Normal Attacks, while DPS Ganyu primarily uses Charged Attacks. Approved only in off-field/flex contexts explicitly reviewed.'],
[key('Yelan'),'Likewise, Yelan’s coordinated attacks favor Normal Attacks and should not be generically substituted into on-field Charged Attack Ganyu teams.']
]);
export function ganyuCompatibilityForCharacter(value=''){const raw=String(value||'').trim(),canon=canonical(raw),k=key(canon);if(!raw)return{character:raw,canonical:canon,status:'invalid',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Missing character name'};if(k==='ganyu')return{character:raw,canonical:'Ganyu',status:'self',smartTeamApproved:false,adaptationAllowed:false,sources:SOURCES,reason:'Ganyu cannot pair with herself.'};if(special(raw))return{character:raw,canonical:canon,status:'not-applicable',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Special/TPS avatar records are not Smart Team characters.'};const e=evidence.get(k);if(e)return{character:raw,canonical:canon,status:'source-backed-compatible',smartTeamApproved:true,adaptationAllowed:true,sources:e.sources.length?e.sources:SOURCES,teamIds:[...new Set(e.teams)],reactions:[...new Set(e.reactions)],caveat:caveat.get(k)||'',reason:'This character appears in an exact or explicitly source-informed reviewed Ganyu team.'};return{character:raw,canonical:canon,status:'unverified',smartTeamApproved:false,adaptationAllowed:false,sources:SOURCES,caveat:caveat.get(k)||'',reason:'No Ganyu-specific reviewed evidence authorizes Smart Team adaptation for this pairing.'}}
export function auditGanyuCompatibility(names=[]){const rows=(names||[]).map(ganyuCompatibilityForCharacter),counts={};for(const r of rows)counts[r.status]=(counts[r.status]||0)+1;return{character:'Ganyu',reviewedAt:'2026-08-23',rows,total:rows.length,counts,smartTeamApproved:rows.filter(r=>r.smartTeamApproved).length,unverified:rows.filter(r=>r.status==='unverified').map(r=>r.character),sources:SOURCES}}
export const GANYU_COMPATIBILITY_POLICY={character:'Ganyu',reviewedAt:'2026-08-23',rule:'Every released avatar record receives an explicit Ganyu compatibility status. Smart Team must respect selected build identity before investment. Freeze/Mono Cryo prioritizes Hydro/Cryo support, grouping, and Burst/Charged-Attack synergy. Melt/Burnmelt requires reliable Pyro or Burning aura and strongly values interruption resistance; Burst usage must not be assumed safe if it steals Melt aura. Off-field Support may join other carries without forcing Ganyu field time. Normal-Attack-triggered coordinated supports must not be generically substituted into on-field Charged Attack Ganyu teams. Unverified pairings remain blocked.',sources:SOURCES};