// Explicit, source-backed Smart Team reaction metadata.
// Never infer a primary reaction from character elements alone: a team can contain
// multiple possible reactions, while the source may be recommending a different archetype.
// As of Genshin 7.0, Lunar-Vaporize is not an official reaction; keep normal Vaporize separate.
export const TEAM_REACTIONS=[
  ['vaporize','Vaporize'],['melt','Melt'],['freeze','Freeze'],['overload','Overload / Overloaded'],
  ['electro-charged','Electro-Charged'],['superconduct','Superconduct'],['swirl','Swirl'],['crystallize','Crystallize'],
  ['burning','Burning'],['bloom','Bloom'],['hyperbloom','Hyperbloom'],['burgeon','Burgeon'],['quicken','Quicken'],
  ['aggravate','Aggravate'],['spread','Spread'],['lunar-charged','Lunar-Charged'],['lunar-bloom','Lunar-Bloom'],
  ['lunar-crystallize','Lunar-Crystallize'],['stellar-conduct','Stellar-Conduct'],['stellar-swirl','Stellar-Swirl']
].map(([id,label])=>({id,label}));

const LABELS=new Map(TEAM_REACTIONS.map(item=>[item.id,item.label]));
const VALID=new Set(LABELS.keys());
const RULES=[
  ['lunar-crystallize',/\blunar[- ]crystall(?:ize|ise)\b/i],
  ['lunar-charged',/\blunar[- ]charged\b/i],
  ['lunar-bloom',/\blunar[- ]bloom\b/i],
  ['stellar-conduct',/\bstellar[- ]conduct\b/i],
  ['stellar-swirl',/\bstellar[- ]swirl\b/i],
  ['electro-charged',/\belectro[- ]charged\b/i],
  ['superconduct',/\bsuperconduct\b/i],
  ['hyperbloom',/\bhyperbloom\b/i],
  ['burgeon',/\bburgeon\b/i],
  ['aggravate',/\baggravate\b/i],
  ['quicken',/\bquicken\b/i],
  ['spread',/\bspread\b/i],
  ['vaporize',/\b(?:reverse|forward)?\s*vapori[sz]e\b/i],
  ['melt',/\b(?:reverse|forward|burn)?\s*melt\b/i],
  ['freeze',/\bfreeze\b/i],
  ['overload',/\boverload(?:ed)?\b/i],
  ['burning',/\bburning\b/i],
  ['bloom',/\bbloom\b/i],
  ['crystallize',/\bcrystalli[sz]e\b/i],
  ['swirl',/\bswirl\b/i]
];

export function normalizeReactionId(value=''){
  const id=String(value||'').trim().toLowerCase().replace(/[_\s]+/g,'-');
  return VALID.has(id)?id:'';
}
export function explicitReactionFromArchetype(value=''){
  const text=String(value||'').trim();if(!text)return'';
  for(const [id,pattern] of RULES)if(pattern.test(text))return id;
  return'';
}
export function teamReaction(team={}){return normalizeReactionId(team.reaction)||explicitReactionFromArchetype(team.name||'')}
export function reactionLabel(value=''){const id=normalizeReactionId(value);return id?(LABELS.get(id)||id):''}
export function teamMatchesReaction(team={},reaction='all'){const wanted=normalizeReactionId(reaction);if(!wanted)return true;return teamReaction(team)===wanted}
export const TEAM_REACTION_POLICY={sourceBackedOnly:true,elementInference:false,unknownAllowed:true,simulationUnknownByDefault:true};
