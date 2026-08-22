// ==UserScript==
// @name         Hotaru HoYoLAB Full Roster Exporter
// @namespace    https://github.com/chachinn/hotaru
// @version      1.1.0
// @description  Export your own HoYoLAB Battle Chronicle characters, equipped weapons and artifacts to a local GOOD file for Hotaru.
// @match        https://act.hoyolab.com/app/community-game-records-sea/*
// @exclude      https://act.hoyolab.com/app/community-game-records-sea/rpg/*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      bbs-api-os.hoyolab.com
// ==/UserScript==

(()=>{
'use strict';
const API='https://bbs-api-os.hoyolab.com/game_record/genshin/api';
const PROP_TO_GO={1:'hp',2:'hp',3:'hp_',5:'atk',6:'atk_',7:'def',8:'def',9:'def_',20:'critRate_',22:'critDMG_',23:'enerRech_',26:'heal_',28:'eleMas',30:'physical_dmg_',40:'pyro_dmg_',41:'electro_dmg_',42:'hydro_dmg_',43:'dendro_dmg_',44:'anemo_dmg_',45:'geo_dmg_',46:'cryo_dmg_'};
const SLOT_TO_GO={1:'flower',2:'plume',3:'sands',4:'goblet',5:'circlet'};
const compact=value=>String(value||'').replace(/\s+/g,'');
const pascal=value=>String(value||'').replace(/[’']/g,'').replace(/[^A-Za-z0-9]+(.)?/g,(_,c)=>c?c.toUpperCase():'').replace(/^./,c=>c.toUpperCase());
const isAppleMobile=()=>/iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function userscriptRequest(){if(typeof GM!=='undefined'&&typeof GM.xmlHttpRequest==='function')return options=>GM.xmlHttpRequest(options);if(typeof GM_xmlhttpRequest==='function')return options=>GM_xmlhttpRequest(options);return null}
function request(path,data){
  const adapter=userscriptRequest();
  if(adapter)return new Promise((resolve,reject)=>adapter({method:'POST',url:`${API}/${path}`,headers:{Accept:'application/json, text/plain, */*','Content-Type':'application/json;charset=utf-8','x-rpc-language':'en-us','x-rpc-lang':'en-us'},data:JSON.stringify(data),onload:r=>{try{const parsed=JSON.parse(r.responseText);if(parsed.retcode&&parsed.retcode!==0)return reject(new Error(parsed.message||`HoYoLAB error ${parsed.retcode}`));resolve(parsed)}catch(error){reject(error)}},onerror:()=>reject(new Error('Could not reach HoYoLAB Battle Chronicle. Check your userscript manager website access.'))}));
  return fetch(`${API}/${path}`,{method:'POST',credentials:'include',headers:{Accept:'application/json, text/plain, */*','Content-Type':'application/json;charset=utf-8','x-rpc-language':'en-us','x-rpc-lang':'en-us'},body:JSON.stringify(data)}).then(async response=>{if(!response.ok)throw new Error(`HoYoLAB request failed (${response.status}).`);const parsed=await response.json();if(parsed.retcode&&parsed.retcode!==0)throw new Error(parsed.message||`HoYoLAB error ${parsed.retcode}`);return parsed}).catch(error=>{throw new Error(`This Safari userscript manager could not access HoYoLAB's Battle Chronicle API. ${error.message||''}`.trim())});
}
function readRole(target){try{const r=target?._gs_?.state?.crtRole;return r?.game_uid&&r?.region?{role_id:String(r.game_uid),server:String(r.region)}:null}catch{return null}}
function role(){const unsafe=typeof unsafeWindow!=='undefined'?unsafeWindow:null;return readRole(unsafe)||readRole(window)}
function talents(skills=[],constellations=[]){const active=new Set((constellations||[]).filter(x=>x?.is_actived).flatMap(x=>x?.effect||[]));const values=(skills||[]).filter(x=>x?.skill_type!==3).slice(0,3).map(x=>Number(x.level||1));return{auto:values[0]||1,skill:values[1]||1,burst:values[2]||1,_note:active.size?'Constellation-adjusted levels may require review.':''}}
function artifactRow(item,charName){return{setKey:pascal(item?.set?.name||''),slotKey:SLOT_TO_GO[item?.pos]||'',rarity:Number(item?.rarity||5),level:Number(item?.level||0),mainStatKey:PROP_TO_GO[item?.main_property?.property_type]||'',location:charName,lock:false,substats:(item?.sub_property_list||[]).map(x=>({key:PROP_TO_GO[x?.property_type]||'',value:Number(String(x?.value||0).replace('%',''))}))}}
function weaponRow(item,charName){return{key:pascal(item?.name||''),level:Number(item?.level||1),ascension:Number(item?.promote_level||0),refinement:Number(item?.affix_level||1),location:charName,lock:false}}
function filename(data){return`hotaru-hoyolab-${data.uid||'roster'}-${new Date().toISOString().slice(0,10)}.json`}
async function deliver(data){
  const text=JSON.stringify(data,null,2),name=filename(data),file=new File([text],name,{type:'application/json'});
  if(isAppleMobile()&&typeof navigator.share==='function'&&typeof navigator.canShare==='function'&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:'Hotaru HoYoLAB export',text:'Save this JSON to Files, then import it in Hotaru.'});return'shared'}catch(error){if(error?.name==='AbortError')return'cancelled';throw error}
  }
  const blob=new Blob([text],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);return'downloaded';
}
function toast(text,bad=false){let node=document.getElementById('hotaru-export-status');if(!node){node=document.createElement('div');node.id='hotaru-export-status';Object.assign(node.style,{position:'fixed',right:'18px',bottom:'calc(18px + env(safe-area-inset-bottom, 0px))',zIndex:2147483647,maxWidth:'340px',padding:'12px 14px',borderRadius:'14px',font:'600 13px system-ui',boxShadow:'0 10px 35px rgba(0,0,0,.22)'});document.body.appendChild(node)}node.style.background=bad?'#fff0f0':'#fff';node.style.color=bad?'#9a2828':'#222';node.textContent=text;setTimeout(()=>node.remove(),6000)}
async function run(button){const current=role();if(!current)throw new Error('Open Genshin Battle Chronicle first, wait for your profile to load, then try again.');button.disabled=true;button.textContent='Exporting…';try{const list=await request('character/list',current),ids=(list?.data?.list||[]).map(x=>x.id).filter(Boolean);if(!ids.length)throw new Error('HoYoLAB returned no characters. Make sure this is your own Battle Chronicle.');const detail=await request('character/detail',{...current,character_ids:ids}),rows=detail?.data?.list||[],characters=[],weapons=[],artifacts=[];for(const item of rows){const charName=compact(item?.base?.name||'');if(!charName)continue;const key=charName==='Traveler'?`Traveler${item?.base?.element||''}`:charName;characters.push({key,level:Number(item?.base?.level||1),constellation:Number(item?.base?.actived_constellation_num||0),talent:talents(item?.skills,item?.constellations)});if(item?.weapon?.name)weapons.push(weaponRow(item.weapon,charName));for(const relic of item?.relics||[])artifacts.push(artifactRow(relic,charName))}const data={format:'GOOD',version:2,source:'Hotaru HoYoLAB Exporter',uid:current.role_id,server:current.server,exportedAt:new Date().toISOString(),characters,weapons,artifacts},delivery=await deliver(data);if(delivery==='shared')toast(`Exported ${characters.length} characters. Use Save to Files, then import the JSON in Hotaru.`);else if(delivery==='cancelled')toast('Share sheet closed. Tap Export to Hotaru again when you are ready to save the JSON.');else toast(`Exported ${characters.length} characters for Hotaru.`)}finally{button.disabled=false;button.textContent='Export to Hotaru'}}
function install(){if(document.getElementById('hotaru-hoyolab-export'))return;const button=document.createElement('button');button.id='hotaru-hoyolab-export';button.textContent='Export to Hotaru';Object.assign(button.style,{position:'fixed',right:'18px',bottom:'calc(18px + env(safe-area-inset-bottom, 0px))',zIndex:2147483647,border:'0',borderRadius:'999px',padding:'13px 18px',background:'#ff7aa8',color:'#fff',font:'700 14px system-ui',boxShadow:'0 10px 30px rgba(0,0,0,.2)',cursor:'pointer'});button.addEventListener('click',()=>run(button).catch(error=>toast(error.message,true)));document.body.appendChild(button)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();