export const APP_VERSION='1.0.0';
export const SCHEMA_VERSION=2;
export const STORAGE_KEY='hotaru.app.v2';
export const LEGACY_STORAGE_KEY='hotaru.app.v1';
export const DEFAULT_STATE=Object.freeze({schemaVersion:SCHEMA_VERSION,roster:[],weapons:[],builds:[],artifacts:[],uid:'',settings:{haptics:true,compactCards:false,preferOwnedWeapons:true},ui:{tab:'home',characterId:'',characterSection:'build',search:'',element:'All',weapon:'All',rarity:'All',page:1,buildCharacterId:''}});
const cloneDefault=()=>JSON.parse(JSON.stringify(DEFAULT_STATE));
function normalize(input={}){const base=cloneDefault();return{...base,...input,schemaVersion:SCHEMA_VERSION,roster:Array.isArray(input.roster)?input.roster:[],weapons:Array.isArray(input.weapons)?input.weapons:[],builds:Array.isArray(input.builds)?input.builds:[],artifacts:Array.isArray(input.artifacts)?input.artifacts:[],uid:typeof input.uid==='string'?input.uid:'',settings:{...base.settings,...(input.settings||{})},ui:{...base.ui,...(input.ui||{})}}}
export function loadState(){try{const current=localStorage.getItem(STORAGE_KEY);if(current)return normalize(JSON.parse(current));const legacy=localStorage.getItem(LEGACY_STORAGE_KEY);if(legacy){const migrated=normalize(JSON.parse(legacy));localStorage.setItem(STORAGE_KEY,JSON.stringify(migrated));return migrated}}catch{}return cloneDefault()}
export function saveState(state){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(normalize(state)));return true}catch{return false}}
export function exportState(state){return JSON.stringify({app:'Hotaru',appVersion:APP_VERSION,exportedAt:new Date().toISOString(),state:normalize(state)},null,2)}
export function importState(text){const parsed=JSON.parse(text),candidate=parsed?.state||parsed;if(!candidate||typeof candidate!=='object')throw new Error('Invalid Hotaru backup.');return normalize(candidate)}
export function upsertBy(list,item,key='id'){const copy=Array.isArray(list)?[...list]:[],idx=copy.findIndex(entry=>String(entry?.[key])===String(item?.[key]));if(idx>=0)copy[idx]={...copy[idx],...item};else copy.push(item);return copy}
