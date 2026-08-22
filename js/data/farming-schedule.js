export const SERVER_OPTIONS=Object.freeze([
  {id:'Asia',label:'Asia',utcOffset:8},
  {id:'America',label:'America',utcOffset:-5},
  {id:'Europe',label:'Europe',utcOffset:1},
  {id:'TW/HK/MO',label:'TW / HK / MO',utcOffset:8}
]);

export const DAILY_RESET_HOUR=4;
export const WEEKDAYS=Object.freeze(['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']);

export const TALENT_BOOK_DAY_GROUPS=Object.freeze([
  {days:['Monday','Thursday','Sunday'],series:['Freedom','Prosperity','Transience','Admonition','Equity','Contention','Moonlight']},
  {days:['Tuesday','Friday','Sunday'],series:['Resistance','Diligence','Elegance','Ingenuity','Justice','Kindling','Elysium']},
  {days:['Wednesday','Saturday','Sunday'],series:['Ballad','Gold','Light','Praxis','Order','Conflict','Vagrancy']}
]);

function serverOption(server='Asia'){return SERVER_OPTIONS.find(item=>item.id===server)||SERVER_OPTIONS[0]}
function pad(value){return String(value).padStart(2,'0')}
function clean(value=''){return String(value||'').trim()}

export function serverGameDay(now=new Date(),server='Asia'){
  const date=now instanceof Date?now:new Date(now),option=serverOption(server),shifted=new Date(date.getTime()+(option.utcOffset-DAILY_RESET_HOUR)*60*60*1000);
  const weekday=WEEKDAYS[shifted.getUTCDay()],dateKey=`${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth()+1)}-${pad(shifted.getUTCDate())}`;
  return{server:option.id,label:option.label,utcOffset:option.utcOffset,resetHour:DAILY_RESET_HOUR,weekday,dateKey};
}

export function talentBookSeries(name=''){
  const text=clean(name).replace(/[’]/g,"'");
  for(const group of TALENT_BOOK_DAY_GROUPS)for(const series of group.series){const escaped=series.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');if(new RegExp(`^(?:Teachings of|Guide (?:to|of)|Philosophies of) ${escaped}$`,'i').test(text))return series}
  return'';
}

export function talentBookSchedule(name=''){
  const series=talentBookSeries(name);if(!series)return{known:false,series:'',days:[],daysLabel:'Check current domain schedule',domain:'Domain of Mastery'};
  const group=TALENT_BOOK_DAY_GROUPS.find(item=>item.series.includes(series));
  return{known:true,series,days:[...(group?.days||[])],daysLabel:(group?.days||[]).join(' / '),domain:['Moonlight','Elysium','Vagrancy'].includes(series)?'Lightless Capital':'Domain of Mastery'};
}

export function talentBookAvailability(name='',{now=new Date(),server='Asia'}={}){
  const schedule=talentBookSchedule(name),day=serverGameDay(now,server);
  return{...schedule,...day,available:schedule.known?schedule.days.includes(day.weekday):null};
}

export function nextTalentBookDays(name='',{now=new Date(),server='Asia'}={}){
  const schedule=talentBookSchedule(name);if(!schedule.known)return[];
  const day=serverGameDay(now,server),start=WEEKDAYS.indexOf(day.weekday),out=[];
  for(let step=1;step<=7;step++){const weekday=WEEKDAYS[(start+step)%7];if(schedule.days.includes(weekday))out.push(weekday);if(out.length>=2)break}
  return out;
}
