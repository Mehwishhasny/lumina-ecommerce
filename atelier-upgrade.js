/* Additional store features; does not modify authentication, payment or order data. */
(() => {
  'use strict';
  const app=window.LUMINA_APP;
  const recentKey='lumina_recent_product_ids_v1';
  const $=id=>document.getElementById(id);
  if(!app || !$('recentlyViewedGrid'))return;
  const cleanId=id=>typeof id==='string'&&/^[a-zA-Z0-9_-]{6,100}$/.test(id);
  let viewed=[];
  try {const stored=JSON.parse(localStorage.getItem(recentKey)||'[]');if(Array.isArray(stored))viewed=stored.filter(cleanId).slice(0,8);}catch{}
  function safeImage(raw){try{const u=new URL(raw);return u.protocol==='https:'?u.href:'';}catch{return '';}}
  const formatter=new Intl.NumberFormat('en-AE',{style:'currency',currency:'AED',minimumFractionDigits:2});
  function renderRecent(){
    const products=app.getProducts()||[];
    const available=viewed.map(id=>products.find(p=>p.id===id&&p.active!==false)).filter(Boolean).slice(0,4);
    const section=$('recentlyViewed'),target=$('recentlyViewedGrid');
    section.hidden=!available.length;
    target.replaceChildren();
    for(const product of available){
      const card=document.createElement('article');card.className='atelier-recent-card';
      const preview=document.createElement('button');preview.type='button';preview.className='atelier-recent-photo';preview.dataset.action='quickview';preview.dataset.id=product.id;preview.setAttribute('aria-label',`View ${product.name}`);
      const img=document.createElement('img');img.loading='lazy';img.alt=product.name;img.src=safeImage(product.image_url)||'favicon.svg';preview.append(img);
      const meta=document.createElement('div');meta.className='atelier-recent-meta';meta.textContent=product.category||'Collection';
      const title=document.createElement('button');title.type='button';title.className='atelier-recent-name';title.dataset.action='quickview';title.dataset.id=product.id;title.textContent=product.name;
      const bottom=document.createElement('div');bottom.className='atelier-recent-bottom';
      const price=document.createElement('span');price.className='atelier-recent-price';price.textContent=formatter.format(Number(product.price)||0);
      const add=document.createElement('button');add.type='button';add.className='atelier-recent-add';add.dataset.action='add';add.dataset.id=product.id;add.textContent=Number(product.stock)>0?'Add to bag +':'Sold out';add.disabled=!(Number(product.stock)>0);
      bottom.append(price,add);card.append(preview,meta,title,bottom);target.append(card);
    }
  }
  function renderProgress(subtotal,count){
    const fill=$('cartProgressFill'),note=$('cartProgressText');if(!fill||!note)return;
    const value=Math.max(0,Number(subtotal)||0);const qty=Math.max(0,Number(count)||0);
    fill.style.width=`${Math.max(0,Math.min(100,value/250*100))}%`;
    note.textContent=!qty?'Add items to unlock complimentary delivery':value>=250?'Complimentary delivery unlocked':`${formatter.format(250-value)} away from complimentary delivery`;
  }
  document.addEventListener('lumina:product-view',event=>{
    const id=event.detail?.id;
    if(!cleanId(id))return;
    viewed=[id,...viewed.filter(existing=>existing!==id)].slice(0,8);
    try{localStorage.setItem(recentKey,JSON.stringify(viewed));}catch{}
    renderRecent();
  });
  document.addEventListener('lumina:catalog-updated',renderRecent);
  document.addEventListener('lumina:cart-updated',event=>renderProgress(event.detail?.subtotal,event.detail?.count));
  $('clearRecentlyViewed').addEventListener('click',()=>{viewed=[];try{localStorage.removeItem(recentKey);}catch{}renderRecent();});
  renderRecent();
  // Initial cart is already rendered by app.js, but its first event precedes this script.
  const subtotal=($('cartSubtotal')?.textContent||'').replace(/[^0-9.]/g,'');
  renderProgress(Number(subtotal)||0,Number($('cartCount')?.textContent)||0);
})();
