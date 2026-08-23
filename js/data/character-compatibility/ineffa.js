import { INEFFA_REVIEWED_TEAMS } from '../team-profiles/ineffa-reviewed.js';
const KQM='https://keqingmains.com/q/ineffa-quickguide/',IV='https://www.icy-veins.com/genshin-impact/ineffa-team-guide';
const source=(label,url,type)=>({label,url,type,platform:'Guide',reviewedAt:'2026-08-23'}),SOURCES=[source('Current Ineffa theorycraft',KQM,'Reviewed theorycraft'),source('Current Ineffa team cross-check',IV,'Source-backed guide')];
function key(v=''){return String(v||'').trim().toLowerCase()} function special(v=''){return /\bTPS\b|manekin/i.test(String(v||''))}
function canonical(v=''){const n=String(v||'').trim();for(const e of ['Anemo','Geo','Electro','Dendro','Hydro','Pyro','Cryo'])if(new RegExp(`\\b(?:aether|lumine)\\s+${e}\\b`,'i').test(n))return`${e} Traveler`;return n}
const evidence=new Map();for(const t of INEFFA_REVIEWED_TEAMS)for(const m of t.members||[]){if(key(m)==='ineffa')continue;const k=key(m),r=evidence.get(k)||{teams:[],sources:[],reactions:[]};r.teams.push(t.id);if(t.reaction)r.reactions.push(t.reaction);for(const s of [t.source,...(t.source?.links||[])])if(s?.url&&!r.sources.some(x=>x.url===s.url))r.sources.push(s);evidence.set(k,r)}
const caveat=new Map([
[key('Flins'),'Premier Lunar-Charged carry partner. Ineffa supplies the second Nod-Krai/Moonsign unit, shield, particles, EM support and Lunar-Charged base-damage support.'],
[key('Columbina'),'Premier Hydro/Lunar partner. Usually let the higher personal-damage unit hold Aubade and the lower-invested Lunar support hold Silken Moon’s Serenade.'],
[key('Aino'),'Accessible Hydro/Moonsign partner whose C1/C6 and SMS access strengthen Lunar teams.'],
[key('Jahoda'),'Anemo healer/VV/EM support with extra Moonsign value; higher constellations improve her Lunar support.'],
[key('Fischl'),'Excellent off-field Electro and particle support; Hexerei EM buffs further improve Lunar-Charged teams.'],
[key('Ororon'),'Useful AoE Electro/Scroll support, but generic DMG Bonus does not directly scale Ineffa’s Lunar-Charged damage.'],
[key('Furina'),'Good Hydro/direct-damage option; her teamwide DMG Bonus does not directly increase Lunar-Charged reaction damage and she needs healing to sustain Fanfare.'],
[key('Yelan'),'Strong Hydro/direct-damage partner. Her ramping DMG Bonus helps the on-fielder’s Talent damage rather than direct Lunar-Charged reaction damage.'],
[key('Xingqiu'),'Reliable Hydro, damage reduction and C2 Hydro RES shred; especially comfortable with Ineffa’s shield.'],
[key('Neuvillette'),'Strong on-field Hydro driver who appreciates shielding and can maintain good Lunar-Charged uptime.'],
[key('Sangonomiya Kokomi'),'Comfort Hydro driver/healer; especially useful when healing or stable Hydro matters more than peak AoE.'],
[key('Kamisato Ayato'),'On-field Hydro driver supported by Ineffa’s shield and off-field Electro.'],
[key('Tartaglia'),'Fast on-field Hydro driver; Ineffa provides shield/off-field Electro for Lunar-Charged.'],
[key('Sucrose'),'Best generic Anemo Lunar buffer through teamwide EM share, VV shred and ability to drive reactions.'],
[key('Kaedehara Kazuha'),'Strong grouping/VV support, but his DMG Bonus does not directly scale Lunar-Charged.'],
[key('Xilonen'),'Long-duration RES shred and healing are valuable; Scroll DMG Bonus is less important when Lunar-Charged dominates.'],
[key('Chevreuse'),'Core enabler for Ineffa Overloaded teams. Keep the team strictly Pyro/Electro when relying on Chevreuse’s full kit.'],
[key('Arlecchino'),'Strong Overloaded carry who values Ineffa’s shield; full-EM Ineffa is valid when she repeatedly triggers Overloaded.'],
[key('Lyney'),'Ineffa shields Charged Shots in Chevreuse Overloaded teams.'],
[key('Yoimiya'),'Ineffa’s shield protects Normal Attack strings in Overloaded or Overvape shells.'],
[key('Nahida'),'Strong Dendro application for Hyperbloom/Quickbloom or pure Quicken; build choice depends on whether Ineffa is triggering seeds or dealing direct Quicken damage.'],
[key('Lauma'),'Premier Hyperbloom buffer; Ineffa can trade trigger speed for shielding and Moonsign/Ascendant Gleam value.'],
[key('Alhaitham'),'Quickbloom/Quicken carry who values Ineffa’s shield and EM share.'],
[key('Cyno'),'Quickbloom/Lunar-compatible carry who values Ineffa’s EM support, particles and shield.'],
[key('Tighnari'),'Pure Quicken carry where Ineffa works as shield/EM/Electro support; this is a Golden Troupe/Electro Goblet context for Ineffa.'],
[key('Yae Miko'),'Strong Quicken/off-field Electro partner; in pure Quicken, Ineffa’s direct Skill damage matters more than Lunar gear.' ]
]);
export function ineffaCompatibilityForCharacter(value=''){const raw=String(value||'').trim(),canon=canonical(raw),k=key(canon);if(!raw)return{character:raw,canonical:canon,status:'invalid',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Missing character name'};if(k==='ineffa')return{character:raw,canonical:'Ineffa',status:'self',smartTeamApproved:false,adaptationAllowed:false,sources:SOURCES,reason:'Ineffa cannot pair with herself.'};if(special(raw))return{character:raw,canonical:canon,status:'not-applicable',smartTeamApproved:false,adaptationAllowed:false,sources:[],reason:'Special/TPS avatar records are not Smart Team characters.'};const e=evidence.get(k);if(e)return{character:raw,canonical:canon,status:'source-backed-compatible',smartTeamApproved:true,adaptationAllowed:true,sources:e.sources.length?e.sources:SOURCES,teamIds:[...new Set(e.teams)],reactions:[...new Set(e.reactions)],caveat:caveat.get(k)||'',reason:'This character appears in an exact or explicitly source-informed reviewed Ineffa team.'};return{character:raw,canonical:canon,status:'unverified',smartTeamApproved:false,adaptationAllowed:false,sources:SOURCES,caveat:caveat.get(k)||'',reason:'No Ineffa-specific reviewed evidence authorizes Smart Team adaptation for this pairing.'}}
export function auditIneffaCompatibility(names=[]){const rows=(names||[]).map(ineffaCompatibilityForCharacter),counts={};for(const r of rows)counts[r.status]=(counts[r.status]||0)+1;return{character:'Ineffa',reviewedAt:'2026-08-23',rows,total:rows.length,counts,smartTeamApproved:rows.filter(r=>r.smartTeamApproved).length,unverified:rows.filter(r=>r.status==='unverified').map(r=>r.character),sources:SOURCES}}
export const INEFFA_COMPATIBILITY_POLICY={character:'Ineffa',reviewedAt:'2026-08-23',rule:'Every released avatar record receives an explicit Ineffa compatibility status. Smart Team must respect selected build identity before investment. Lunar-Charged requires Hydro and strongly prefers a second Moonsign teammate for Ascendant Gleam; generic DMG Bonus must not be treated as direct Lunar-Charged scaling. Hyperbloom/Overloaded trigger builds are only selected when Ineffa actually owns reaction triggers and therefore justify heavy EM. Pure Quicken may use Golden Troupe and Electro DMG Bonus. Shield/support mode prioritizes team utility over personal damage. Unverified pairings remain blocked.',sources:SOURCES};