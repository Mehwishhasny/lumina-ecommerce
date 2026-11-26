/* LUMINA Maison live AI chat and verified demo sale offer.
   AI requests go only to a Supabase Edge Function. No API keys or personal order data here. */
(() => {
 'use strict';
 const $ = id => document.getElementById(id);
 const panel = $('conciergePanel');
 const messages = $('conciergeMessages');
 const launcher = $('conciergeLauncher');
 const input = $('conciergeInput');
 const sale = $('maisonSaleModal');
 if (!panel || !messages || !launcher || !sale) return;
 const FORM = $('conciergeForm');
 const submit = FORM.querySelector('button[type="submit"]');
 const cfg = window.LUMINA_CONFIG || {};
 const projectUrl = String(cfg.supabaseUrl || '').trim().replace(/\/$/,'');
 const publicKey = String(cfg.supabaseKey || '').trim();
 const isConfigured = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(projectUrl) && publicKey.length > 20;
 const chatEndpoint = isConfigured ? `${projectUrl}/functions/v1/lumina-chat` : null;
 const history = [];
 let chatStarted = false;
 let waiting = false;
 let seenThisSession = false;
 let previousFocus = null;
 const SALE_CODE = 'MAISON50';
 const memory = (() => { try { return sessionStorage; } catch { return null; } })();
 const money = n => `AED ${Number(n).toFixed(2)}`;
 const app = () => window.LUMINA_APP;
 function bubble(content,isUser=false){
   const el=document.createElement('div');el.className='lumina-msg'+(isUser?' is-user':'');
   const label=document.createElement('span');label.className='lumina-msg-label';label.textContent=isUser?'You':'LUMINA AI';
   const b=document.createElement('div');b.className='lumina-msg-bubble';b.textContent=content;
   el.append(label,b);messages.append(el);messages.scrollTop=messages.scrollHeight;return el;
 }
 function buttons(bubbleElement,items){
   if(!items.length)return;
   const row=document.createElement('div');row.className='lumina-msg-tools';
   items.forEach(([label,action])=>{
     const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.conciergeAction=action;row.append(b);
   });bubbleElement.append(row);
 }
 function productCards(parent,query){
   const text=String(query||'').toLowerCase().trim();
   if(!text)return;
   const names = (app()?.getProducts?.()||[]).filter(p=>p.active !== false);
   const aliases=[['perfume','fragrance'],['serum','skin'],['skincare','beauty'],['gift','featured'],['bag','tote'],['kitchen','mug'],['coffee','mug'],['candle','home']];
   const terms=text.split(/[^a-z0-9]+/).filter(t=>t.length>2 && !['show','find','what','the','products','have','for','please','you','and','can','item','something','under','some','want','with','recommend'].includes(t));
   aliases.forEach(([word,term])=>{if(text.includes(word))terms.push(term);});
   const found=names.map(p=>{const name=String(p.name||'').toLowerCase(),cat=String(p.category||'').toLowerCase();return {p,score:terms.reduce((score,term)=>score+(name.includes(term)?3:0)+(cat.includes(term)?1:0),0)};})
    .filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.p);
   if(!found.length)return;
   const wrap=document.createElement('div');wrap.className='lumina-chat-products';
   found.forEach(p=>{
     const btn=document.createElement('button');btn.type='button';btn.className='lumina-chat-product';btn.dataset.action='quickview';btn.dataset.id=p.id;
     const img=document.createElement('img');img.alt='';img.loading='lazy';try{const url=new URL(String(p.image_url||''));img.src=url.protocol==='https:'?url.href:'favicon.svg';}catch{img.src='favicon.svg';}
     const info=document.createElement('span');info.className='lumina-chat-product-info';const name=document.createElement('strong');name.textContent=p.name;
     const price=document.createElement('small');price.textContent=`${money(p.price)} · ${Number(p.stock)>0?'In stock':'Out of stock'}`;
     const arrow=document.createElement('span');arrow.className='lumina-product-arrow';arrow.textContent='↗';
     info.append(name,price);btn.append(img,info,arrow);wrap.append(btn);
   });parent.append(wrap);messages.scrollTop=messages.scrollHeight;
 }
 function openChat(){
   panel.hidden=false;launcher.setAttribute('aria-expanded','true');
   if(!chatStarted){chatStarted=true;
     const el=bubble('Hi! I’m LUMINA’s live AI shopping assistant. I can help with products, delivery, promo codes, and demo payments. What would you like to know?');
     buttons(el,[['Shop products','shop'],['50% OFF offer','sale'],['Track order','track']]);
     if(!isConfigured)bubble('AI setup is not connected yet. The store owner needs to deploy the lumina-chat Edge Function and add a Gemini API key. You can still use the quick links below.');
   }
   input.focus();messages.scrollTop=messages.scrollHeight;
 }
 function closeChat(){panel.hidden=true;launcher.setAttribute('aria-expanded','false');}
 launcher.addEventListener('click',()=>panel.hidden?openChat():closeChat());
 $('conciergeClose').addEventListener('click',()=>{closeChat();launcher.focus();});
 function openOriginal(id){closeChat();$(id)?.click();}
 function performAction(action){
   if(action==='shop'){closeChat();if(document.body.dataset.page==='collection'){$('shop')?.scrollIntoView({behavior:'smooth'});$('productSearch')?.focus({preventScroll:true});}else{location.href='collection.html#shop';}}
   if(action==='track')openOriginal('accountBtn');
   if(action==='support')openOriginal('footerSupport');
   if(action==='sale'){closeChat();openSale(true);}
   if(action==='payment'){
     const el=bubble('All four options—Card, Cash on Delivery, Google Pay and Mobile Wallet—are simulated. No real money is charged and no card numbers are required.');buttons(el,[['Shop items','shop']]);
   }
 }
 function setWaiting(on){waiting=on;submit.disabled=on;input.disabled=on;submit.setAttribute('aria-label',on?'Waiting for AI reply':'Send message');}
 async function askAI(message){
   if(!chatEndpoint) { bubble('Live AI is not configured. The store owner must deploy the Edge Function and set the server-side API key.');return; }
   const limitedHistory=history.slice(-8);
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),28000);
   setWaiting(true);
   const loading=bubble('Thinking…');
   try {
     const response=await fetch(chatEndpoint,{
       method:'POST', mode:'cors', signal:controller.signal,
       headers:{'content-type':'application/json',apikey:publicKey},
       body:JSON.stringify({message,history:limitedHistory})
     });
     let data={};try{data=await response.json();}catch{}
     if(!response.ok)throw Error(data.error||`Live chat is unavailable (${response.status}).`);
     if(typeof data.reply !== 'string' || !data.reply.trim())throw Error('The assistant returned an empty response.');
     loading.remove();
     const el=bubble(data.reply.slice(0,2200));
     productCards(el,message);
     history.push({role:'user',text:message},{role:'model',text:data.reply.slice(0,2200)});
     if(history.length>12)history.splice(0,history.length-12);
   }catch(error){
     loading.remove();
     const detail=error?.name==='AbortError'?'The response took too long. Please try again.':String(error.message||'Please try again.');
     const el=bubble(`Live chat could not connect. ${detail}`);buttons(el,[['Shop products','shop'],['Contact support','support']]);
   } finally {clearTimeout(timer);setWaiting(false);input.focus();}
 }
 FORM.addEventListener('submit',event=>{
   event.preventDefault();const message=input.value.trim().slice(0,500);if(!message||waiting)return;
   input.value='';bubble(message,true);askAI(message);
 });
 $('luminaConcierge').addEventListener('click',event=>{
   if(event.target.closest('[data-action="quickview"]')){closeChat();return;}
   const topic=event.target.closest('[data-concierge-topic]');
   if(topic){const action=topic.dataset.conciergeTopic;
     if(action==='sale'){performAction('sale');return;}
     if(action==='track'||action==='payment'){performAction(action);return;}
     if(action==='products'){performAction('shop');return;}
   }
   const action=event.target.closest('[data-concierge-action]');if(action)performAction(action.dataset.conciergeAction);
 });
 // Promotional modal: deliberately no false countdown or fake scarcity.
 function openSale(manual=false){
   if(!sale.hidden)return;
   if(!manual && memory?.getItem('lumina_sale_seen'))return;
   if(!manual && [...document.querySelectorAll('.modal-wrap')].some(m=>!m.hidden))return;
   previousFocus=document.activeElement;
   sale.hidden=false;memory?.setItem('lumina_sale_seen','1');seenThisSession=true;
   $('maisonSaleDialog').focus();
 }
 function closeSale(){sale.hidden=true;if(previousFocus?.isConnected)previousFocus.focus();}
 $('saleClose').addEventListener('click',closeSale);
 sale.querySelector('[data-sale-dismiss]').addEventListener('click',closeSale);
 $('saleTopTrigger')?.addEventListener('click',()=>openSale(true));
 $('saleNavTrigger')?.addEventListener('click',()=>openSale(true));
 async function copyCode(){
   let copied=false;
   try{if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(SALE_CODE);copied=true;}}catch{}
   memory?.setItem('lumina_sale_code',SALE_CODE);
   const inputField=$('promoCodeInput');if(inputField)inputField.value=SALE_CODE;
   $('copySaleCode').textContent=copied?'Copied ✓':'Code ready ✓';
 }
 $('copySaleCode').addEventListener('click',copyCode);
 $('saleShopButton').addEventListener('click',()=>{memory?.setItem('lumina_sale_code',SALE_CODE);$('promoCodeInput').value=SALE_CODE;closeSale();location.href='collection.html#shop';});
 // Existing checkout will use the promotion only if SQL created MAISON50.
 document.addEventListener('lumina:checkout-open',()=>{
   const saved=memory?.getItem('lumina_sale_code');if(saved!==SALE_CODE)return;
   $('promoCodeInput').value=SALE_CODE;
   setTimeout(()=>$('applyPromoBtn')?.click(),60);
 });
 document.addEventListener('keydown',event=>{
   if(sale.hidden)return;
   if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeSale();return;}
   if(event.key==='Tab'){
     const tabEls=[...sale.querySelectorAll('button:not([disabled])')];if(!tabEls.length)return;
     const first=tabEls[0],last=tabEls[tabEls.length-1];
     if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
     if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
   }
 },true);
 // Delay the popup slightly so it does not block the first paint.
 setTimeout(()=>{if(!seenThisSession)openSale(false);},2300);
})();
