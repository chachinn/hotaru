export const TEAM_PICKER_ELEMENTS=['Anemo','Geo','Electro','Dendro','Hydro','Pyro','Cryo'];

function key(value=''){return String(value||'').trim().toLowerCase()}
function normalizedElement(value=''){const raw=String(value||'').trim();return TEAM_PICKER_ELEMENTS.find(element=>element.toLowerCase()===raw.toLowerCase())||''}
export function inferredTravelerElement(character={}){
  const direct=normalizedElement(character?.element);if(direct)return direct;
  const text=[character?.name,character?.slug,character?.sourceId,character?.id,character?.description].filter(Boolean).join(' ').toLowerCase();
  return TEAM_PICKER_ELEMENTS.find(element=>new RegExp(`(?:^|[^a-z])${element.toLowerCase()}(?:[^a-z]|$)`).test(text))||'';
}
export function teamPickerIdentity(character={}){
  const name=String(character?.name||'').trim(),isTraveler=/^(?:traveler|aether|lumine)(?:\b|\s|[-_(])/i.test(name)||/traveler/i.test(name);
  if(!isTraveler)return{name,value:name,label:name};
  const element=inferredTravelerElement(character);if(!element)return{name,value:'',label:'',special:true};
  const value=`${element} Traveler`;return{name,value,label:value,element};
}
export function teamPickerCharacters(characters=[]){
  const out=[],seen=new Set();
  for(const character of characters||[]){const identity=teamPickerIdentity(character),value=String(identity.value||'').trim();if(!value)continue;const signature=key(value);if(seen.has(signature))continue;seen.add(signature);out.push({...character,teamPickerValue:value,teamPickerLabel:identity.label||value})}
  return out;
}
