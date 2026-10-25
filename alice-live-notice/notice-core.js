(function(root){
 'use strict';
 const GALLERY='https://alice-shop-product-catalog.darkhake10.chatgpt.site';
 const DEFAULT_LIVE_LINK='https://vt.tiktok.com/ZS9UogaVYpump-6JVc5/';
 const CANCEL_STYLES=[
  {id:'simple',label:'温柔通知 · 本场停播',text:'💛 *A little update from Alice*\nWe’ll miss you this session! Thank you for understanding. We can’t wait to see you next time.'},
  {id:'break',label:'休息一下 · 下次相见',text:'💛 *A little pause today*\nWe’re taking a short break from live shopping today. Thank you for being here. See you again soon!'},
  {id:'new_arrivals',label:'准备新品 · 期待下次',text:'💛 *Getting lovely things ready for you*\nWe’re skipping this session while we prepare new arrivals. We’re excited to share them with you next time!'},
  {id:'schedule',label:'临时调整 · 时间待定',text:'💛 *A little change of plans*\nOur live plans have changed. Thank you for your patience! We’ll share the new time here as soon as it’s confirmed.'},
  {id:'later',label:'临时调整 · 稍后开播（填时间）',scheduled:true,text:'💛 *A little later than planned*\nWe’re moving this session to a later time. Thank you for waiting. We’d love to see you at the updated time below!'},
  {id:'reschedule',label:'直播改期 · 公布新时间（填时间）',scheduled:true,text:'💛 *Let’s make a new date!*\nWe’ve rescheduled our live shopping session. Thank you for being so understanding. Join us at the new time below!'},
  {id:'next_live',label:'本场停播 · 预约下一场（填时间）',scheduled:true,text:'💛 *See you at our next live!*\nWe’re sitting this session out, but our next live is planned below. We’d love for you to join us!'},
  {id:'technical',label:'设备或网络 · 暂停本场',text:'💛 *A little technical hiccup*\nOur connection or equipment needs a little attention, so we’re sitting this session out. Thank you for your patience. We hope to see you again soon!'},
  {id:'sourcing',label:'外出选品 · 带回新惊喜',text:'💛 *Out finding lovely things for you*\nWe’re skipping this session while we look for new favorites. Thank you for your support. We can’t wait to show you what we find!'},
  {id:'personal',label:'临时有事 · 感谢体谅',text:'💛 *A quick note from Alice*\nSomething has come up, so we won’t be live this session. Thank you for your kindness and understanding. See you next time!'}
 ];
 const PURCHASE_GUIDES=[
  {id:'none',label:'不补充 · 保持简短',text:''},
  {id:'simple',label:'简短下单 · 图片＋数量',text:'To order, send a product screenshot + quantity in our Claims group. We’ll help you with the rest! 💛'},
  {id:'steps',label:'详细步骤 · 浏览、截图、确认',text:'How to order:\n1. Browse the product page and pick your favorites.\n2. Send a screenshot + quantity in our Claims group.\n3. We’ll confirm availability and order details with you. 💛'},
  {id:'help',label:'先咨询 · 帮客户选款',text:'Need a hand choosing? Send us a product screenshot + quantity, and we’ll be happy to help with the details before you order. 💛'}
 ];
 const ZONES=[{id:'America/New_York',label:'US Eastern',zh:'美国 · 美东'},{id:'Europe/Berlin',label:'Central Europe',zh:'欧洲 · 中欧'}];
 function instant(date,time){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||!/^\d{2}:\d{2}$/.test(time||''))return null;
  const [y,m,d]=date.split('-').map(Number),[h,min]=time.split(':').map(Number);
  if(y<2020||y>2100||m<1||m>12||d<1||d>31||h>23||min>59)return null;
  const value=new Date(Date.UTC(y,m-1,d,h-8,min)),local=new Date(value.getTime()+8*3600000);
  if(local.getUTCFullYear()!==y||local.getUTCMonth()!==m-1||local.getUTCDate()!==d)return null;
  return value;
 }
 function times(date,time){
  const value=instant(date,time);if(!value)return [];
  return ZONES.map(z=>{
   const day=new Intl.DateTimeFormat('en-US',{timeZone:z.id,weekday:'short',month:'short',day:'numeric'}).format(value);
   const clock=new Intl.DateTimeFormat('en-US',{timeZone:z.id,hour:'numeric',minute:'2-digit',hour12:true}).format(value);
   const zone=new Intl.DateTimeFormat(z.id.startsWith('Europe/')?'en-GB':'en-US',{timeZone:z.id,timeZoneName:'short'}).formatToParts(value).find(p=>p.type==='timeZoneName').value;
   return {...z,day,clock,zone,text:`${z.label}: ${day} · ${clock} ${zone}`};
  });
 }
 function validLink(link){try{const u=new URL(link);return u.protocol==='https:'&&!!u.hostname&&!u.username&&!u.password}catch{return false}}
 function defaultLink(settings){const link=String(settings?.link||'').trim();return validLink(link)?link:DEFAULT_LIVE_LINK}
 function cancelStyle(input){return CANCEL_STYLES.find(s=>s.id===input.cancelStyle)||CANCEL_STYLES[0]}
 function usesNextTime(input){return input.type==='cancel'&&(!!input.nextTime||!!cancelStyle(input).scheduled)}
 function validate(input){
  const errors=[];if(!['preview','cancel'].includes(input.type))errors.push('请选择公告类型。');
  if((input.type==='preview'||usesNextTime(input))&&!instant(input.date,input.time))errors.push('请填写有效的中国日期和时间。');
  if((input.type==='preview'||usesNextTime(input))&&!validLink(String(input.link||'').trim()))errors.push('请粘贴完整的 https:// 直播链接。');
  return errors;
 }
 function build(input){
  const link=String(input.link||'').trim(),picks=String(input.picks||'').trim(),note=String(input.note||'').trim(),zones=times(input.date,input.time);let lines=[];
  if(input.type==='cancel'){
   lines=cancelStyle(input).text.split('\n');
   if(usesNextTime(input)&&zones.length){lines.push('','🗓️ *'+(cancelStyle(input).scheduled?'Updated live time:':'Our next live:')+'*');lines.push(...zones.map((z,i)=>(i===0?'🇺🇸 ':'🇪🇺 ')+z.text));if(link)lines.push('','🎥 *Join us live:*',link)}
  }
  else{
   lines=['🎥 *Come join Alice live!* 💛'];
   if(zones.length)lines.push('',...zones.map((z,i)=>(i===0?'🇺🇸 ':'🇪🇺 ')+z.text));
   const themes=[];
   if(input.topicSelections){const clean=values=>Array.isArray(values)?[...new Set(values.filter(v=>typeof v==='string').map(v=>v.trim()).filter(Boolean))]:[],categories=clean(input.topicSelections.category),stores=clean(input.topicSelections.store);if(categories.length)themes.push('💎 *Featuring:* '+categories.join(' · '));if(stores.length)themes.push('📍 *'+(stores.length>1?'Shops:':'Shop:')+'* '+stores.join(' · '));if(picks)themes.push('✨ *Theme:* '+picks)}else if(picks)themes.push((input.topicKind==='store'?'📍 Shop: ':'💎 ')+picks);
   if(themes.length)lines.push('',...themes);
   if(link)lines.push('','🎥 *Join us live:*',link);
  }
  if(note)lines.push('',note);
  if(input.gallery){lines.push('','🛍️ *Browse our products:*',GALLERY);const guide=PURCHASE_GUIDES.find(g=>g.id===input.purchaseGuide);if(guide?.text)lines.push(guide.text.replace('How to order:','*How to order:*'))}return lines.join('\n');
 }
 function shareLink(text){return 'https://wa.me/?text='+encodeURIComponent(String(text||''))}
 const api={GALLERY,DEFAULT_LIVE_LINK,CANCEL_STYLES,PURCHASE_GUIDES,ZONES,instant,times,validate,validLink,defaultLink,usesNextTime,build,shareLink};if(typeof module==='object'&&module.exports)module.exports=api;else root.AliceNotice=api;
})(typeof window==='undefined'?{}:window);
