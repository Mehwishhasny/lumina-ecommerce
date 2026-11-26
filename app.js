/* Lumina: a static, Supabase-powered e-commerce storefront.
   A preview catalog appears until config.js is connected.
   Order prices and stock are checked by the DATABASE, not this file. */
(() => {
  'use strict';

  const PHOTO = 'https://images.unsplash.com/';
  const previewProducts = [
    { id:'11111111-1111-4111-8111-111111111111',name:'Everyday Tote Bag',category:'Accessories',description:'A versatile, everyday companion.',price:129,stock:18,featured:true,active:true,image_url:PHOTO+'photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=650&q=80' },
    { id:'22222222-2222-4222-8222-222222222222',name:'Minimalist Watch',category:'Accessories',description:'Timeless style in every detail.',price:299,stock:12,featured:true,active:true,image_url:PHOTO+'photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=650&q=80' },
    { id:'33333333-3333-4333-8333-333333333333',name:'Cozy Home Throw',category:'Home',description:'Soft texture for slow afternoons.',price:189,stock:11,featured:true,active:true,image_url:PHOTO+'photo-1600166898405-da9535204843?auto=format&fit=crop&w=650&q=80' },
    { id:'44444444-4444-4444-8444-444444444444',name:'Botanical Skincare Set',category:'Beauty',description:'A little moment of self-care.',price:165,stock:20,featured:true,active:true,image_url:PHOTO+'photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=650&q=80' },
    { id:'55555555-5555-4555-8555-555555555555',name:'Everyday Sneakers',category:'Lifestyle',description:'Comfort made for your daily plans.',price:245,stock:16,featured:false,active:true,image_url:PHOTO+'photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=650&q=80' },
    { id:'66666666-6666-4666-8666-666666666666',name:'Modern Table Lamp',category:'Home',description:'Warm light, calmer evenings.',price:219,stock:9,featured:false,active:true,image_url:PHOTO+'photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=650&q=80' },
    { id:'77777777-7777-4777-8777-777777777777',name:'Wireless Headphones',category:'Tech',description:'A better soundtrack to your day.',price:349,stock:15,featured:false,active:true,image_url:PHOTO+'photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=650&q=80' },
    { id:'88888888-8888-4888-8888-888888888888',name:'Signature Perfume',category:'Beauty',description:'Your everyday finishing touch.',price:195,stock:14,featured:false,active:true,image_url:PHOTO+'photo-1541643600914-78b084683601?auto=format&fit=crop&w=650&q=80' },
    { id:'032d088f-83c4-5ad6-aa17-c12539e48005',name:"Linen Cushion Cover",category:"Home",description:"An understated accent for relaxed spaces.",price:89,stock:23,featured:true,active:true,image_url:PHOTO+'photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=650&q=80' },
    { id:'c222896b-148b-52c1-ac1d-f55361badcac',name:"Ceramic Coffee Mug",category:"Home",description:"A simple favorite for the daily ritual.",price:75,stock:30,featured:false,active:true,image_url:PHOTO+'photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=650&q=80' },
    { id:'86c3d7d3-8be5-58a2-b35a-eefa7543c7d7',name:"Scented Candle",category:"Home",description:"Warm notes for calmer evenings.",price:99,stock:24,featured:true,active:true,image_url:PHOTO+'photo-1603006905003-be475563bc59?auto=format&fit=crop&w=650&q=80' },
    { id:'575071e6-4c2d-54a3-89d4-7b5918666062',name:"Everyday Backpack",category:"Accessories",description:"Practical design for days on the move.",price:199,stock:17,featured:false,active:true,image_url:PHOTO+'photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=650&q=80' },
    { id:'1c37c85f-855e-552d-9c21-04f0ac6e5d37',name:"Classic Sunglasses",category:"Accessories",description:"A timeless finishing touch.",price:149,stock:21,featured:false,active:true,image_url:PHOTO+'photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=650&q=80' },
    { id:'742bc757-9e82-5f0d-978a-c3af07d46b0c',name:"Crossbody Bag",category:"Accessories",description:"Compact and effortless for every day.",price:239,stock:13,featured:true,active:true,image_url:PHOTO+'photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=650&q=80' },
    { id:'f3595ec4-79db-57fe-a17b-1a24c2f4c4bf',name:"Face Care Essentials",category:"Beauty",description:"A gentle addition to your skincare shelf.",price:139,stock:25,featured:false,active:true,image_url:PHOTO+'photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=650&q=80' },
    { id:'2f8808e4-9bf8-5b06-a69d-15ee16973d50',name:"Evening Fragrance",category:"Beauty",description:"A warm, refined scent for after dark.",price:229,stock:14,featured:true,active:true,image_url:PHOTO+'photo-1594035910387-fea47794261f?auto=format&fit=crop&w=650&q=80' },
    { id:'be7eb0aa-8a7f-50a6-ab3b-7ae8ece25b17',name:"Everyday Camera",category:"Tech",description:"Capture the moments worth keeping.",price:499,stock:8,featured:false,active:true,image_url:PHOTO+'photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=650&q=80' },
    { id:'8bdf2e5e-b08a-52ac-b368-0e2154d6be90',name:"Wireless Speaker",category:"Tech",description:"Compact audio for every corner.",price:279,stock:12,featured:false,active:true,image_url:PHOTO+'photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=650&q=80' },
    { id:'8feacc48-68b2-5883-b35b-89db16faabd0',name:"Canvas Trainers",category:"Lifestyle",description:"A casual essential you will reach for.",price:179,stock:26,featured:false,active:true,image_url:PHOTO+'photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=650&q=80' },
    { id:'9769e411-c5df-59d1-ba54-17e69b5b1084',name:"Weekend Jacket",category:"Lifestyle",description:"An easy layer for changing days.",price:319,stock:10,featured:false,active:true,image_url:PHOTO+'photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=650&q=80' }
  ];

  const $ = (id) => document.getElementById(id);
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeImage = (url) => { try { const u = new URL(String(url)); return ['https:','http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
  const money = (value) => new Intl.NumberFormat('en-AE', {style:'currency',currency:'AED'}).format(Number(value || 0));
  const dateText = (iso) => iso ? new Intl.DateTimeFormat('en-AE', {day:'numeric',month:'short',year:'numeric'}).format(new Date(iso)) : '';
  const dateTimeText = (iso) => iso ? new Intl.DateTimeFormat('en-AE', {day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(iso)) : '';
  const secureLink = (url) => { try { const u = new URL(String(url)); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; } };
  const orderRef = (id) => String(id||'').slice(0,8).toUpperCase();
  const configuration = window.LUMINA_CONFIG || {};
  const hasCredentials = !!(configuration.supabaseUrl && configuration.supabaseKey);
  let db = null;
  let connectionProblem = '';
  if (hasCredentials) {
    if (!window.supabase?.createClient) {
      connectionProblem = 'The Supabase JavaScript library did not load. Check your internet connection.';
    } else {
      try {
        db = window.supabase.createClient(configuration.supabaseUrl, configuration.supabaseKey);
      } catch (error) {
        connectionProblem = `Could not connect to Supabase: ${error.message || 'invalid project settings'}`;
      }
    }
  }
  const connected = !!db;
  // Preview products remain visible when the project is not yet seeded or cannot be reached.
  // They are never treated as database stock during checkout.
  let products = previewProducts;
  let catalogSource = 'preview';
  let catalogProblem = connectionProblem;
  let user = null;
  let isAdmin = false;
  let category = new URLSearchParams(location.search).get('category') || 'All';
  let query = '';
  let sort = 'featured';
  let authMode = 'signin';
  let toastTimer;
  let cart = readCart();
  let adminOrdersCache = [];
  let orderReceiptsCache = [];
  let addresses = [];
  let wishlist = new Set();
  let favoritesOnly = false;
  let checkoutQuoteSeq = 0;
  let adminPromoCache = [];
  let supportCache = [];

  const statusNames = {new:'Order placed',processing:'Processing',packed:'Packed',shipped:'Shipped',delivered:'Delivered',completed:'Completed',cancelled:'Cancelled'};
  const trackSteps = ['new','processing','packed','shipped','delivered'];
  const paymentNames = {not_recorded:'Not recorded (older order)',card:'Demo card',cash_on_delivery:'Cash on Delivery',google_pay:'Google Pay (demo)',mobile_wallet:'Mobile Wallet (demo)'};
  const paymentStatusNames = {not_recorded:'Not recorded',demo_success:'Demo approved — no charge',pending_cod:'Awaiting cash on delivery (demo)',demo_collected:'COD collected (simulated)'};
  const paymentMethodNotes = {
    card:['Demo card selected','Sample Visa ending in 4242. No card number, expiry or CVV is required.'],
    cash_on_delivery:['Cash on Delivery selected','The order will be marked as awaiting COD payment in demo mode. No cash is collected by this website.'],
    google_pay:['Google Pay demo selected','This simulates a successful Google Pay checkout. No Google Pay window opens and no real money moves.'],
    mobile_wallet:['Mobile Wallet demo selected','This simulates an Apple Pay-style/mobile wallet checkout. No wallet is contacted.']
  };
  const allowedNext = {new:['new','processing','cancelled'],processing:['processing','packed','cancelled'],packed:['packed','shipped','cancelled'],shipped:['shipped','delivered'],delivered:['delivered'],completed:['completed'],cancelled:['cancelled']};


  function readCart() {
    try { const value = JSON.parse(localStorage.getItem('lumina_cart') || '{}'); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
    catch { return {}; }
  }
  function saveCart() { try { localStorage.setItem('lumina_cart', JSON.stringify(cart)); } catch {} }
  function notice(text) { const n = $('toast'); n.textContent = text; n.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => n.classList.remove('visible'), 4000); }
  function itemList() { return Object.entries(cart).map(([id,qty]) => ({product:products.find(p => p.id === id),qty:Math.max(0,Math.floor(Number(qty)||0))})).filter(x => x.product && x.product.active !== false && x.qty > 0); }
  function total() { return itemList().reduce((sum,entry) => sum + Number(entry.product.price) * entry.qty,0); }
  function count() { return itemList().reduce((sum,entry) => sum + entry.qty,0); }
  function locked() { return ![...document.querySelectorAll('.modal-wrap')].every(x => x.hidden) || $('cartDrawer').classList.contains('open'); }
  function scrollLock() { document.body.classList.toggle('locked',locked()); }
  function openModal(id) { $(id).hidden = false; scrollLock(); }
  function closeModal(id) { $(id).hidden = true; scrollLock(); }
  function openCart() { renderCart(); $('drawerBackdrop').hidden=false; $('cartDrawer').classList.add('open'); $('cartDrawer').setAttribute('aria-hidden','false'); scrollLock(); }
  function closeCart() { $('cartDrawer').classList.remove('open'); $('cartDrawer').setAttribute('aria-hidden','true'); $('drawerBackdrop').hidden=true; scrollLock(); }
  // Always respect the actual photo URL stored for each Supabase product.
  // These photo URLs are used only when an older product has no image_url.
  const starterPhotoFallbacks = Object.fromEntries(previewProducts.map(p => [p.name, p.image_url]));
  function productPicture(product) {
    return safeImage(product.image_url) || starterPhotoFallbacks[product.name] || placeholder();
  }
  function imgTag(product) { return `<img loading="lazy" src="${escapeHTML(productPicture(product))}" alt="${escapeHTML(product.name)}" onerror="this.onerror=null;this.src='${placeholder()}'" />`; }
  function placeholder() { return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700"><rect width="100%" height="100%" fill="#eae2e7"/><text x="50%" y="50%" text-anchor="middle" font-size="60" fill="#a68faf">✳</text></svg>'); }

  function renderFeaturedProducts() {
    const target = $('featuredProductsGrid');
    if (!target) return;
    const curated = products.filter(p => p.active !== false && p.featured && Number(p.stock) > 0).slice(0,4);
    const items = curated.length ? curated : products.filter(p => p.active !== false).slice(0,4);
    target.innerHTML = items.map((p,index)=>`<article class="featured-card">
      <div class="featured-photo">
        <button type="button" class="featured-image-button" data-action="quickview" data-id="${escapeHTML(p.id)}" aria-label="View ${escapeHTML(p.name)}">${imgTag(p)}</button>
        <span class="featured-index">0${index+1} / THE EDIT</span>
        <button class="featured-cart-action" type="button" data-action="add" data-id="${escapeHTML(p.id)}" aria-label="Add ${escapeHTML(p.name)} to bag">Add to bag ↗</button>
      </div>
      <div class="featured-meta"><span>${escapeHTML(p.category)}</span><span>${money(p.price)}</span></div>
      <button type="button" class="featured-title" data-action="quickview" data-id="${escapeHTML(p.id)}">${escapeHTML(p.name)}</button>
    </article>`).join('');
  }

  let priceRange='all';
  let stockOnly=false;
  function currentPriceMatches(price){
    const value=Number(price)||0;
    if(priceRange==='under150')return value<150;
    if(priceRange==='150to300')return value>=150&&value<=300;
    if(priceRange==='over300')return value>300;
    return true;
  }
  function renderProducts() {
    const visibleCategories = ['All',...new Set(products.filter(p=>p.active !== false).map(p=>p.category).filter(Boolean))];
    if (!visibleCategories.includes(category)) category='All';
    $('categoryPills').innerHTML = visibleCategories.map(c=>`<button class="pill ${c===category?'active':''}" data-category="${escapeHTML(c)}" aria-pressed="${c===category}">${escapeHTML(c)}</button>`).join('');
    let list = products.filter(p=>p.active !== false && (category==='All'||p.category===category) && (`${p.name} ${p.category} ${p.description||''}`).toLowerCase().includes(query));
    list = favoritesOnly ? [...list].filter(p => wishlist.has(p.id)) : [...list];
    list = list.filter(p => currentPriceMatches(p.price) && (!stockOnly || Number(p.stock)>0));
    const resultCount = $('productResultCount');
    if(resultCount) resultCount.textContent=`${list.length} ${list.length===1?'item':'items'} found`;
    if(sort==='low') list.sort((a,b)=>Number(a.price)-Number(b.price));
    if(sort==='high') list.sort((a,b)=>Number(b.price)-Number(a.price));
    if(sort==='new') list.sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0));
    if(sort==='featured') list.sort((a,b)=>Number(!!b.featured)-Number(!!a.featured));
    $('productGrid').innerHTML = list.map(p=>`<article class="product-card tilt-surface" data-photo-motion="${escapeHTML(({Beauty:'roll',Accessories:'sway',Home:'lift',Tech:'float',Lifestyle:'bounce'})[p.category]||'lift')}"><div class="product-media"><button type="button" class="product-preview" data-action="quickview" data-id="${escapeHTML(p.id)}" aria-label="View ${escapeHTML(p.name)} details">${imgTag(p)}</button>${p.featured?'<span class="product-tag">FEATURED</span>':''}<button class="favorite-heart ${wishlist.has(p.id)?'is-saved':''}" type="button" data-action="favorite" data-id="${escapeHTML(p.id)}" aria-pressed="${wishlist.has(p.id)}" aria-label="${wishlist.has(p.id)?'Remove':'Save'} ${escapeHTML(p.name)} ${wishlist.has(p.id)?'from':'to'} favorites">${wishlist.has(p.id)?'♥':'♡'}</button><button class="quick-add" data-action="add" data-id="${escapeHTML(p.id)}" title="Add to bag" aria-label="Add ${escapeHTML(p.name)} to bag" ${Number(p.stock)<=0?'disabled':''}>+</button></div><div class="product-category">${escapeHTML(p.category)}</div><button class="product-title-button" type="button" data-action="quickview" data-id="${escapeHTML(p.id)}"><h3 class="product-name">${escapeHTML(p.name)}</h3></button><p class="product-description">${escapeHTML(p.description||'Thoughtfully selected for your day.')}</p><div class="product-price">${money(p.price)} ${Number(p.stock)<=0?'<span class="out-stock">Sold out</span>':''}</div></article>`).join('');
    $('wishCount').textContent = wishlist.size;
    $('favoritesFilterBtn').classList.toggle('active',favoritesOnly);
    $('favoritesFilterBtn').setAttribute('aria-pressed',String(favoritesOnly));
    $('emptyProducts').hidden = !!list.length;
    const banner = $('setupBanner');
    banner.hidden = catalogSource === 'database';
    if (!banner.hidden) {
      let explanation = 'This is a sample catalog. Set up Supabase to enable real stock, accounts and orders.';
      if (hasCredentials && catalogProblem) explanation = `${catalogProblem} These are sample products, not saved database items. Checkout is unavailable.`;
      else if (hasCredentials) explanation = 'There are no visible products in Supabase yet. Run seed-products.sql in the Supabase SQL Editor to add the eight starter products. These are preview items, not available to order.';
      banner.innerHTML = `<span>Sample catalog</span> ${escapeHTML(explanation)} <a href="SETUP.md" target="_blank" rel="noopener">Setup guide ↗</a>`;
    }
    renderFeaturedProducts();
    renderCart();
    document.dispatchEvent(new Event('lumina:catalog-updated'));
  }
  function renderCart() {
    const lines = itemList();
    $('cartCount').textContent = count(); $('drawerCount').textContent = `(${count()})`;
    $('cartSubtotal').textContent = money(total()); $('checkoutTotal').textContent = money(total());
    $('cartDeliveryText').textContent = total() >= 250 ? 'You qualify for free demo delivery!' : `${money(Math.max(0, 250-total()))} away from free demo delivery · AED 20 below AED 250`;
    $('checkoutBtn').disabled = !lines.length;
    $('cartItems').innerHTML = lines.length ? lines.map(({product:p,qty}) => `<div class="cart-line">${imgTag(p)}<div><h3>${escapeHTML(p.name)}</h3><small>${escapeHTML(p.category)}</small><strong>${money(p.price)}</strong><div class="qty-box"><button data-action="minus" data-id="${escapeHTML(p.id)}" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-action="plus" data-id="${escapeHTML(p.id)}" aria-label="Increase quantity">+</button></div></div><button class="remove" data-action="remove" data-id="${escapeHTML(p.id)}">Remove</button></div>`).join('') : '<div class="cart-empty"><div>♧</div><h3>Your bag feels lonely.</h3><p>Find something lovely in our collection.</p><button class="btn btn-dark" id="emptyShopBtn">Explore products ↗</button></div>';
    document.dispatchEvent(new CustomEvent('lumina:cart-updated',{detail:{subtotal:total(),count:count()}}));
  }
  function addToCart(id,delta) {
    const p=products.find(x=>x.id===id && x.active!==false);
    if(!p){ notice('This item is no longer available.'); return; }
    const next=Math.max(0,Math.floor(Number(cart[id])||0)+delta);
    if(next>Number(p.stock)){ notice(`Only ${p.stock} available right now.`); return; }
    if(next===0) delete cart[id]; else cart[id]=next;
    saveCart(); renderCart(); if(delta>0) notice('Added to your shopping bag.');
  }
  function openAccount() {
    if(!connected){ notice('Connect Supabase to enable customer accounts.'); openModal('authModal'); return; }
    if(!user){ showAuth('signin'); return; }
    $('accountEmail').textContent = user.email || '';
    $('adminBtn').hidden = !isAdmin;
    openModal('accountModal');
  }
  function showAuth(tab='signin') {
    authMode=tab; $('authTitle').textContent=tab==='signup'?'Join the good things.':'Welcome back.';
    $('authSubmit').innerHTML=tab==='signup'?'Create account <span>↗</span>':'Sign in <span>↗</span>';
    $('authHint').textContent=tab==='signup'?'You may need to confirm your email before signing in.':'New here? Select “Create account” above.';
    $('authForm').elements.password.autocomplete=tab==='signup'?'new-password':'current-password';
    document.querySelectorAll('[data-auth-tab]').forEach(b=>b.classList.toggle('active',b.dataset.authTab===tab));
    openModal('authModal');
  }
  async function syncAuth() {
    if (!db) return;
    const { data:{session},error }=await db.auth.getSession();
    if (error) { notice(error.message); return; }
    user=session?.user || null;
    isAdmin=false;
    if(user) {
      const {data, error:adminError}=await db.from('store_admins').select('user_id').eq('user_id',user.id).maybeSingle();
      if (!adminError && data) isAdmin=true;
    }
    $('accountBtn').title=user?'My account':'Sign in';
    $('adminBtn').hidden=!isAdmin;
    await loadProducts();
    if(user) { await Promise.all([loadAddresses(), loadWishlist()]); } else { addresses=[];wishlist=readGuestWishlist();renderProducts(); }
  }
  async function loadProducts() {
    if(!db){renderProducts();return;}
    try {
      const {data,error}=await db.from('products').select('id,name,category,description,price,stock,image_url,featured,active,created_at').order('created_at',{ascending:false});
      if (error) throw error;
      if (!data?.length) {
        // An empty table (or no visible products under RLS) should not produce a blank page.
        catalogSource = 'preview';
        catalogProblem = '';
        products = previewProducts;
      } else {
        catalogSource = 'database';
        catalogProblem = '';
        products = data;
      }
    } catch (error) {
      catalogSource = 'preview';
      catalogProblem = `Could not load database products: ${error.message || 'unknown error'}.`;
      products = previewProducts;
      notice('Database products unavailable. Showing sample catalog.');
    }
    renderProducts();
  }
  async function submitAuth(event) {
    event.preventDefault();
    if(!db){notice('To use accounts, first connect Supabase in config.js.');return;}
    const form=event.currentTarget;
    const email=form.elements.email.value.trim(); const password=form.elements.password.value;
    const button=$('authSubmit'); button.disabled=true;
    try {
      if(authMode==='signup') {
        const {data,error}=await db.auth.signUp({email,password});
        if(error) throw error;
        if(data.session) { notice('Account created! You are signed in.'); closeModal('authModal'); await syncAuth(); }
        else notice('Account created. Check your inbox to confirm your email, then sign in.');
      } else {
        const {error}=await db.auth.signInWithPassword({email,password});
        if(error) throw error;
        closeModal('authModal'); notice('Welcome back!'); await syncAuth();
      }
      form.elements.password.value='';
    } catch(e){notice(e.message||'Could not sign in.');}
    finally {button.disabled=false;}
  }
  function beginCheckout() {
    if(!itemList().length){notice('Your shopping bag is empty.');return;}
    if(!db){notice('Sample catalog: connect Supabase before placing orders.');return;}
    if(catalogSource !== 'database'){notice('These are preview products. Add real products using seed-products.sql before checkout.');return;}
    if(!user){closeCart();showAuth('signin');notice('Please sign in to place your order.');return;}
    closeCart();checkoutError('');$('checkoutTotal').textContent=money(total());
    populateAddressSelect();updatePaymentUI();openModal('checkoutModal');document.dispatchEvent(new Event('lumina:checkout-open'));quoteCheckout();
  }
  // Match the exact customer-input rules enforced by Supabase place_order().
  function validateCheckoutFields(form) {
    const rules = [
      ['customer_name', 'Full name', 2, 100],
      ['phone', 'Phone number', 6, 30],
      ['address', 'Delivery address', 5, 250],
      ['city', 'City', 2, 90]
    ];
    for (const [name, label, min, max] of rules) {
      const input = form.elements[name];
      const length = input.value.trim().length;
      if (length < min || length > max) {
        return { input, message: `${label} must be between ${min} and ${max} characters (excluding spaces at the beginning or end).` };
      }
    }
    if (form.elements.notes.value.length > 500) {
      return {input:form.elements.notes, message:'Order note must not exceed 500 characters.'};
    }
    return null;
  }
  function checkoutError(message) {
    const error = $('checkoutError');
    error.textContent = message || '';
    error.hidden = !message;
  }
  function updatePaymentUI() {
    const f = $('checkoutForm');
    const method = f.elements.payment_method.value || 'card';
    const description = paymentMethodNotes[method] || paymentMethodNotes.card;
    $('paymentMethodInfo').innerHTML = `<strong>${escapeHTML(description[0])}</strong><p>${escapeHTML(description[1])}</p>`;
    $('placeOrderBtn').innerHTML = `${method === 'cash_on_delivery' ? 'Place COD demo order' : 'Confirm demo payment'} <span>↗</span>`;
    document.querySelectorAll('.demo-method').forEach(el=>el.classList.toggle('selected', el.querySelector('input')?.checked));
  }
  function paymentInfoHTML(o) {
    const method = o.payment_method || 'not_recorded';
    const status = o.payment_status || 'not_recorded';
    const reference = o.payment_reference ? `<small>Reference: ${escapeHTML(o.payment_reference)}</small>` : '';
    return `<div class="order-payment-details"><div><span>Payment method</span><strong>${escapeHTML(paymentNames[method]||method)}</strong></div><div><span>Payment status</span><strong>${escapeHTML(paymentStatusNames[status]||status)}</strong>${reference}</div></div>`;
  }
  async function placeOrder(event) {
    event.preventDefault();
    if(!db||!user){notice('Sign in to place an order.');return;}
    const f=event.currentTarget;
    checkoutError('');
    const invalid = validateCheckoutFields(f);
    if (invalid) { checkoutError(invalid.message); invalid.input.focus(); return; }
    const entries=itemList();if(!entries.length){notice('Your bag is empty.');return;}
    const paymentMethod = f.elements.payment_method.value;
    if(!paymentMethodNotes[paymentMethod]){checkoutError('Please choose a demo payment method.');return;}
    const requestedNotes = f.elements.notes.value.trim();
    if (requestedNotes.length > 500) { checkoutError('Your order note must be shorter than 500 characters.'); return; }
    const button=$('placeOrderBtn');button.disabled=true;
    try {
      const {data,error}=await db.rpc('place_store_order',{
        p_items:entries.map(({product,qty})=>({product_id:product.id,quantity:qty})),
        p_name:f.elements.customer_name.value.trim(),
        p_phone:f.elements.phone.value.trim(),
        p_address:f.elements.address.value.trim(),
        p_city:f.elements.city.value.trim(),
        p_notes:requestedNotes,
        p_payment_method:paymentMethod,
        p_promo_code:f.elements.promo_code.value.trim().toUpperCase() || null
      });
      if(error) throw error;
      cart={};saveCart();renderCart();f.reset();document.dispatchEvent(new Event('lumina:order-complete'));quoteCheckout();closeModal('checkoutModal');
      await loadProducts();notice(`${paymentMethod === 'cash_on_delivery' ? 'COD demo order placed' : 'Demo payment approved — no charge'}! Order: ${String(data).slice(0,8).toUpperCase()}`);
      await showOrders(data);
    }catch(e){
      let message=e.message||'Demo order could not be submitted.';
      if(/place_store_order|function public.place_store_order|Could not find the function/i.test(message)) message='The full store upgrade is not installed in Supabase. Run full-store-upgrade.sql, then refresh the page.';
      checkoutError(message);
      notice(message);
    }
    finally{button.disabled=false;}
  }
  function timelineHTML(order) {
    const rawEvents = Array.isArray(order.order_status_events) ? order.order_status_events : [];
    const events = [...rawEvents].sort((a,b)=>new Date(a.changed_at)-new Date(b.changed_at));
    const cancelled = order.status === 'cancelled';
    const current = order.status === 'completed' ? 'delivered' : order.status;
    const currentIndex = trackSteps.indexOf(current);
    const steps = cancelled ? ['new','cancelled'] : trackSteps;
    const timeline = steps.map((step,i)=>{
      const done = cancelled ? i < 2 : currentIndex >= i;
      const exactEvent = [...events].reverse().find(e=>e.status===step || (step==='delivered'&&e.status==='completed'));
      const when = exactEvent ? dateTimeText(exactEvent.changed_at) : done ? 'Date not recorded' : 'Not yet reached';
      const cls = step === current || (cancelled && step==='cancelled') ? 'current' : done ? 'done' : 'waiting';
      return `<li class="track-step ${cls}"><span class="track-dot">${done?'✓':i+1}</span><div><strong>${escapeHTML(statusNames[step])}</strong><small>${escapeHTML(when)}</small></div></li>`;
    }).join('');
    const courier = order.courier_name ? `<div><span>Courier</span><strong>${escapeHTML(order.courier_name)}</strong></div>` : '';
    const tracking = order.tracking_number ? `<div><span>Tracking number</span><strong class="tracking-number">${escapeHTML(order.tracking_number)}</strong></div>` : '';
    const eta = order.estimated_delivery ? `<div><span>Estimated delivery</span><strong>${dateText(order.estimated_delivery+'T12:00:00')}</strong></div>` : '';
    const url = secureLink(order.tracking_url);
    const courierUrl = url ? `<a class="btn btn-outline btn-small" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">Open courier tracking ↗</a>` : '';
    const shipments = (courier||tracking||eta||courierUrl) ? `<div class="tracking-shipment"><h4>Shipment information</h4><div class="tracking-details">${courier}${tracking}${eta}</div>${courierUrl}</div>` : '<p class="tracking-muted">Shipment details will appear when the store adds them.</p>';
    const history = events.length ? `<details class="tracking-history"><summary>View status updates (${events.length})</summary><ul>${[...events].reverse().map(e=>`<li><b>${escapeHTML(statusNames[e.status]||e.status)}</b><small>${dateTimeText(e.changed_at)}</small>${e.note?`<p>${escapeHTML(e.note)}</p>`:''}</li>`).join('')}</ul></details>` : '';
    return `<section class="tracking-panel"><h4>Delivery progress</h4><ol class="tracking-steps">${timeline}</ol>${shipments}${history}</section>`;
  }
  function customerOrderHTML(o) {
    const items = (o.order_items||[]).map(i=>`<div class="order-line"><span>${escapeHTML(i.product_name)} × ${Number(i.quantity)}</span><span>${money(Number(i.quantity)*Number(i.unit_price))}</span></div>`).join('');
    return `<article class="order-card" id="order-${escapeHTML(o.id)}"><div class="order-card-head"><div><strong>Order #${escapeHTML(orderRef(o.id))}</strong><small>${dateText(o.created_at)}</small></div><span class="status-chip ${escapeHTML(o.status)}">${escapeHTML(statusNames[o.status]||o.status)}</span></div>${items}<div class="order-line"><span>Products</span><span>${money(o.subtotal??o.total)}</span></div><div class="order-line"><span>Delivery</span><span>${money(o.shipping_fee||0)}</span></div>${Number(o.discount_amount)>0?`<div class="order-line"><span>Promo ${escapeHTML(o.promo_code||'')}</span><span>− ${money(o.discount_amount)}</span></div>`:''}<div class="order-line order-total"><span>Order total</span><span>${money(o.total)}</span></div><p class="delivery-address"><b>Delivering to:</b> ${escapeHTML(o.address)}, ${escapeHTML(o.city)}</p>${o.notes?`<p class="delivery-address"><b>Order instructions:</b> ${escapeHTML(o.notes)}</p>`:''}${paymentInfoHTML(o)}<button type="button" class="btn btn-outline btn-small receipt-button" data-action="receipt" data-id="${escapeHTML(o.id)}">View printable receipt ↗</button>${timelineHTML(o)}</article>`;
  }
  async function showOrders(highlightId = null) {
    if(!db||!user){showAuth('signin');return;}
    closeModal('accountModal');openModal('ordersModal');$('ordersList').innerHTML='<p>Loading your orders...</p>';
    const expectedUser=user.id;
    const {data,error}=await db.from('orders')
      .select('id,buyer_name,email,phone,total,subtotal,shipping_fee,discount_amount,promo_code,status,created_at,address,city,notes,payment_method,payment_status,payment_reference,courier_name,tracking_number,tracking_url,estimated_delivery,order_items(product_name,quantity,unit_price),order_status_events(status,note,changed_at)')
      .order('created_at',{ascending:false});
    if(user?.id!==expectedUser)return;
    if(error){$('ordersList').innerHTML=`<p class="checkout-error">${escapeHTML(error.message)}. If this refers to a missing tracking field, run order-tracking-upgrade.sql in Supabase.</p>`;return;}
    orderReceiptsCache=data||[];
    $('ordersList').innerHTML=(data||[]).length?data.map(customerOrderHTML).join(''):'<div class="empty-state"><h3>No orders yet</h3><p>Your future finds will appear here.</p></div>';
    if(highlightId){const card=document.getElementById('order-'+highlightId);if(card)card.scrollIntoView({behavior:'smooth',block:'nearest'});}
  }
  async function showAdmin(tab='overview') {
    if(!db||!user||!isAdmin){notice('Administrator access required.');return;}
    closeModal('accountModal');openModal('adminModal');switchAdminTab(tab);
  }
  function switchAdminTab(tab) {
    document.querySelectorAll('[data-admin-tab]').forEach(b=>b.classList.toggle('active',b.dataset.adminTab===tab));
    ['overview','products','orders','promos','support','reviews'].forEach(key=>{
      $('admin'+key[0].toUpperCase()+key.slice(1)+'Section').hidden = key!==tab;
    });
    if(tab==='products') renderAdminProducts();
    if(tab==='orders' || tab==='overview') loadAdminOrders();
    if(tab==='promos') loadPromos();
    if(tab==='support') loadSupport(true);
    if(tab==='reviews') document.dispatchEvent(new Event('lumina:admin-reviews'));
  }
  function renderAdminProducts() {
    const realProducts = catalogSource === 'database' ? products : [];
    $('adminProductList').innerHTML=realProducts.length?realProducts.map(p=>`<div class="admin-product-row">${imgTag(p)}<div><b>${escapeHTML(p.name)}</b><small>${escapeHTML(p.category)} · ${money(p.price)} · ${p.stock} in stock${p.active?'':' · HIDDEN'}</small></div><div class="admin-product-actions"><button data-action="edit-product" data-id="${escapeHTML(p.id)}">Edit</button><button data-action="toggle-product" data-id="${escapeHTML(p.id)}">${p.active?'Hide':'Show'}</button></div></div>`).join(''):'<p>No database products are available. Select Add product, or run seed-products.sql in Supabase.</p>';
  }
  function editProduct(id) {
    if(!isAdmin)return;
    const p=products.find(x=>x.id===id);
    const f=$('productForm');f.reset();
    f.elements.id.value=p?.id||'';f.elements.name.value=p?.name||'';f.elements.category.value=p?.category||'Home';
    f.elements.description.value=p?.description||'';f.elements.image_url.value=p?.image_url||'';
    f.elements.price.value=p?.price||'';f.elements.stock.value=p?.stock??0;
    f.elements.featured.checked=!!p?.featured;f.elements.active.checked=p?.active!==false;
    $('productModalTitle').textContent=p?'Edit product':'Add product';openModal('productModal');
  }
  async function saveProduct(event) {
    event.preventDefault();if(!db||!isAdmin)return;
    const f=event.currentTarget;const id=f.elements.id.value;
    const image=f.elements.image_url.value.trim();
    if(image && !/^https:\/\//i.test(image)){notice('Product images must use an HTTPS URL.');return;}
    const record={name:f.elements.name.value.trim(),category:f.elements.category.value,description:f.elements.description.value.trim(),image_url:image||null,price:Number(f.elements.price.value),stock:Number(f.elements.stock.value),featured:f.elements.featured.checked,active:f.elements.active.checked};
    const button=$('saveProductBtn');button.disabled=true;
    const result=id?await db.from('products').update(record).eq('id',id).select('id'):await db.from('products').insert(record).select('id');
    button.disabled=false;
    if(result.error){notice(result.error.message);return;}
    closeModal('productModal');await loadProducts();renderAdminProducts();notice('Product saved successfully.');
  }
  async function toggleProduct(id) {
    if(!db||!isAdmin)return;
    const p=products.find(x=>x.id===id);if(!p)return;
    const {error}=await db.from('products').update({active:!p.active}).eq('id',id);
    if(error){notice(error.message);return;}
    await loadProducts();renderAdminProducts();notice(p.active?'Product hidden from shop.':'Product is now visible.');
  }
  function adminOrderHTML(o) {
    const transitions = allowedNext[o.status] || [o.status];
    const opts = transitions.map(s=>`<option value="${escapeHTML(s)}" ${s===o.status?'selected':''}>${escapeHTML(statusNames[s]||s)}</option>`).join('');
    return `<article class="admin-order"><div class="admin-order-top"><div><strong>#${escapeHTML(orderRef(o.id))} · ${escapeHTML(o.buyer_name)}</strong><small>${dateText(o.created_at)} · ${escapeHTML(o.email)} · ${escapeHTML(o.phone)}</small></div><strong>${money(o.total)}</strong></div><p><b>Address:</b> ${escapeHTML(o.address)}, ${escapeHTML(o.city)}${o.notes?' — Note: '+escapeHTML(o.notes):''}</p><p><b>Items:</b> ${(o.order_items||[]).map(i=>`${escapeHTML(i.product_name)} × ${Number(i.quantity)}`).join(' · ')}</p><p class="order-amount-details">Products ${money(o.subtotal??o.total)} · Delivery ${money(o.shipping_fee||0)} · Discount ${money(o.discount_amount||0)} ${o.promo_code?' · Code '+escapeHTML(o.promo_code):''}</p>${paymentInfoHTML(o)}<div class="admin-order-foot"><span class="status-chip ${escapeHTML(o.status)}">${escapeHTML(statusNames[o.status]||o.status)}</span><span class="tracking-muted">Updated by store admin</span></div>${o.payment_method==='cash_on_delivery'&&o.payment_status==='pending_cod'&&o.status!=='cancelled'?`<button type="button" class="btn btn-outline btn-small demo-cod-collect" data-action="demo-cod-collect" data-id="${escapeHTML(o.id)}">Mark COD collected (demo)</button>`:''}<form class="admin-tracking-form" data-order-id="${escapeHTML(o.id)}"><h4>Manage delivery & tracking</h4><div class="tracking-form-grid"><label>Order status<select name="status" required>${opts}</select></label><label>Courier<input name="courier" maxlength="80" placeholder="e.g. Aramex" value="${escapeHTML(o.courier_name||'')}"/></label><label>Tracking number<input name="tracking_number" maxlength="100" placeholder="Shipping reference" value="${escapeHTML(o.tracking_number||'')}"/></label><label>Estimated delivery<input name="estimated_delivery" type="date" value="${escapeHTML(o.estimated_delivery||'')}"/></label><label class="wide">Courier tracking URL (HTTPS only)<input name="tracking_url" type="url" placeholder="https://courier.example/track/..." maxlength="500" value="${escapeHTML(o.tracking_url||'')}"/></label><label class="wide">Update note to customer <span class="optional">(optional)</span><input name="note" maxlength="500" placeholder="e.g. Package handed to courier"/></label></div><p class="tracking-form-error" role="alert" hidden></p><div class="tracking-save-row"><button class="btn btn-dark btn-small" type="submit">Save tracking update ↗</button></div></form></article>`;
  }
  function renderAdminOrders() {
    const filter = $('adminOrderStatusFilter').value;
    const q = $('adminOrderSearch').value.trim().toLowerCase();
    const selected = adminOrdersCache.filter(o=>{
      if(filter!=='all' && o.status!==filter)return false;
      return !q || `${o.id} ${o.buyer_name} ${o.email} ${o.tracking_number||''}`.toLowerCase().includes(q);
    });
    const tally = {all:adminOrdersCache.length,new:0,processing:0,packed:0,shipped:0,delivered:0,cancelled:0};
    adminOrdersCache.forEach(o=>{ if(Object.hasOwn(tally,o.status))tally[o.status]++; if(o.status==='completed')tally.delivered++; });
    $('adminOrderStats').innerHTML=[['All','all'],['New','new'],['Processing','processing'],['Packed','packed'],['Shipped','shipped'],['Delivered','delivered'],['Cancelled','cancelled']].map(([label,k])=>`<div class="stat-tile"><strong>${tally[k]}</strong><small>${label}</small></div>`).join('');
    $('adminOrdersList').innerHTML=selected.length ? selected.map(adminOrderHTML).join('') : '<p>No orders match your filters.</p>';
  }
  async function loadAdminOrders() {
    if(!db||!isAdmin)return;
    $('adminOrdersList').innerHTML='<p>Loading orders...</p>';
    const {data,error}=await db.from('orders')
      .select('id,buyer_name,email,phone,address,city,notes,total,subtotal,shipping_fee,discount_amount,promo_code,status,created_at,payment_method,payment_status,payment_reference,courier_name,tracking_number,tracking_url,estimated_delivery,order_items(product_name,quantity,unit_price)')
      .order('created_at',{ascending:false}).limit(200);
    if(error){$('adminOrdersList').innerHTML=`<p class="checkout-error">${escapeHTML(error.message)}. Run order-tracking-upgrade.sql if tracking fields do not exist.</p>`;return;}
    adminOrdersCache=data||[];
    renderAdminOrders(); renderOverview();
  }
  async function collectDemoCOD(orderId) {
    if(!db || !isAdmin) return;
    const {error}=await db.rpc('mark_demo_cod_collected',{p_order_id:orderId});
    if(error){notice(error.message || 'Could not record demo COD collection.');return;}
    notice('COD collection marked in demo mode — no money handled.');
    await loadAdminOrders();
  }
  async function saveTracking(event) {
    event.preventDefault();
    if(!db||!isAdmin)return;
    const f=event.target.closest('.admin-tracking-form');
    if(!f)return;
    const status=f.elements.status.value;
    const courier=f.elements.courier.value.trim();
    const tracking=f.elements.tracking_number.value.trim();
    const url=f.elements.tracking_url.value.trim();
    const eta=f.elements.estimated_delivery.value||null;
    const note=f.elements.note.value.trim();
    const err=f.querySelector('.tracking-form-error');
    err.hidden=true;err.textContent='';
    if(['shipped','delivered'].includes(status) && (!courier||!tracking)){
      err.textContent='Enter a courier and tracking number before marking this order shipped.';err.hidden=false;return;
    }
    if(url&&!secureLink(url)){
      err.textContent='Use a valid HTTPS URL for courier tracking.';err.hidden=false;return;
    }
    const btn=f.querySelector('button[type="submit"]');btn.disabled=true;btn.textContent='Saving...';
    try {
      const {error}=await db.rpc('update_order_fulfillment',{
        p_order_id:f.dataset.orderId,
        p_status:status,
        p_courier_name:courier||null,
        p_tracking_number:tracking||null,
        p_tracking_url:url||null,
        p_estimated_delivery:eta,
        p_note:note||null
      });
      if(error)throw error;
      notice('Order tracking updated. Customers can see it in My orders.');
      await loadAdminOrders();
      await loadProducts();
    } catch(error) {
      err.textContent=error.message||'Could not save the delivery update.';err.hidden=false;
      notice('Tracking update was not saved.');
    } finally {btn.disabled=false;btn.textContent='Save tracking update ↗';}
  }

  // ================== Complete store features ==================
  function readGuestWishlist() {
    try {const values=JSON.parse(localStorage.getItem('lumina_guest_wishlist')||'[]');return new Set(Array.isArray(values)?values.filter(id=>typeof id==='string'):[]);}catch{return new Set();}
  }
  async function loadWishlist() {
    if(!db||!user)return;
    const local=readGuestWishlist();
    const {data,error}=await db.from('wishlists').select('product_id').eq('user_id',user.id);
    if(error){notice('Wishlist needs full-store-upgrade.sql in Supabase.');wishlist=local;renderProducts();return;}
    wishlist=new Set((data||[]).map(i=>i.product_id));
    for(const id of local){
      if(!wishlist.has(id)) {
        const {error:insertError}=await db.from('wishlists').upsert({user_id:user.id,product_id:id},{onConflict:'user_id,product_id'});
        if(!insertError) wishlist.add(id);
      }
    }
    localStorage.removeItem('lumina_guest_wishlist');
    renderProducts();
  }
  async function toggleFavorite(id) {
    const p=products.find(p=>p.id===id);
    if(!p)return;
    const wasSaved=wishlist.has(id);
    if(wasSaved)wishlist.delete(id);else wishlist.add(id);
    if(user&&db){
      const {error}=wasSaved?await db.from('wishlists').delete().eq('user_id',user.id).eq('product_id',id)
        :await db.from('wishlists').upsert({user_id:user.id,product_id:id},{onConflict:'user_id,product_id'});
      if(error){if(wasSaved)wishlist.add(id);else wishlist.delete(id);notice(error.message);return;}
    } else {try{localStorage.setItem('lumina_guest_wishlist',JSON.stringify([...wishlist]));}catch{}}
    renderProducts();renderWishlist();
    notice(wasSaved?'Removed from your wishlist.':'Saved to your wishlist!');
  }
  function renderWishlist() {
    const favorites=products.filter(p=>wishlist.has(p.id)&&p.active!==false);
    $('wishlistList').innerHTML=favorites.length?favorites.map(p=>`<article class="wish-line">${imgTag(p)}<div><strong>${escapeHTML(p.name)}</strong><small>${money(p.price)}</small><div class="wish-actions"><button type="button" class="btn btn-dark btn-small" data-action="wish-add" data-id="${escapeHTML(p.id)}" ${Number(p.stock)<=0?'disabled':''}>Add to bag</button><button type="button" class="link-btn" data-action="favorite" data-id="${escapeHTML(p.id)}">Remove ♡</button></div></div></article>`).join(''):'<p class="empty-note">No favorites yet. Tap ♡ on products you love.</p>';
  }
  function showWishlist() {closeModal('accountModal');renderWishlist();openModal('wishlistModal');}
  function showQuickView(id) {
    const p=products.find(p=>p.id===id&&p.active!==false);if(!p)return;
    document.dispatchEvent(new CustomEvent('lumina:product-view',{detail:{id:p.id}}));
    $('quickViewBody').innerHTML=`<div class="quickview-grid"><div class="quickview-image">${imgTag(p)}</div><div class="quickview-copy"><p class="eyebrow small">${escapeHTML(p.category)}</p><h2 id="quickViewTitle">${escapeHTML(p.name)}</h2><p class="quickview-price">${money(p.price)}</p><p>${escapeHTML(p.description||'Thoughtfully curated for your everyday.')}</p><p class="quickview-availability">${Number(p.stock)>0?`${Number(p.stock)} available`:'Out of stock'}</p><button type="button" class="btn btn-dark full" data-action="quick-add-close" data-id="${escapeHTML(p.id)}" ${Number(p.stock)<=0?'disabled':''}>Add to bag ↗</button><button type="button" class="link-btn full" data-action="favorite" data-id="${escapeHTML(p.id)}">${wishlist.has(p.id)?'♥ Remove from favorites':'♡ Save to favorites'}</button><p class="fine-print">This is a demo store. Orders and payments are simulated.</p></div></div>`;
    openModal('quickViewModal');
  }
  async function loadAddresses() {
    if(!db||!user){addresses=[];return;}
    const {data,error}=await db.from('customer_addresses').select('id,label,full_name,phone,address,city,created_at').eq('user_id',user.id).order('created_at',{ascending:false});
    if(error){addresses=[];notice('Saved addresses need full-store-upgrade.sql.');return;}
    addresses=data||[];
    populateAddressSelect();
  }
  function populateAddressSelect() {
    const select=$('savedAddressSelect');
    select.innerHTML='<option value="">Enter a new address</option>'+addresses.map(a=>`<option value="${escapeHTML(a.id)}">${escapeHTML(a.label)} — ${escapeHTML(a.city)} (${escapeHTML(a.full_name)})</option>`).join('');
  }
  function applyAddress(id) {
    const a=addresses.find(x=>x.id===id);if(!a)return;
    const f=$('checkoutForm');
    f.elements.customer_name.value=a.full_name;
    f.elements.phone.value=a.phone;
    f.elements.address.value=a.address;
    f.elements.city.value=a.city;
  }
  function renderAddresses() {
    $('addressesList').innerHTML=addresses.length?addresses.map(a=>`<article class="saved-address-card"><div><b>${escapeHTML(a.label)}</b><p>${escapeHTML(a.full_name)} · ${escapeHTML(a.phone)}</p><p>${escapeHTML(a.address)}, ${escapeHTML(a.city)}</p></div><button type="button" class="btn btn-outline btn-small" data-action="remove-address" data-id="${escapeHTML(a.id)}">Delete</button></article>`).join(''):'<p class="empty-note">You have no saved delivery addresses.</p>';
  }
  async function showAddresses() {
    if(!user){showAuth('signin');return;}
    closeModal('accountModal');await loadAddresses();renderAddresses();openModal('addressesModal');
  }
  async function saveAddress(event) {
    event.preventDefault();if(!db||!user)return;
    const f=event.currentTarget;const btn=f.querySelector('[type="submit"]');btn.disabled=true;
    const record={user_id:user.id,label:f.elements.label.value.trim(),full_name:f.elements.full_name.value.trim(),phone:f.elements.phone.value.trim(),address:f.elements.address.value.trim(),city:f.elements.city.value.trim()};
    const {error}=await db.from('customer_addresses').insert(record);
    btn.disabled=false;
    if(error){notice(error.message);return;}
    f.reset();await loadAddresses();renderAddresses();notice('Address saved.');
  }
  async function removeAddress(id) {
    if(!db||!user)return;
    const {error}=await db.from('customer_addresses').delete().eq('id',id).eq('user_id',user.id);
    if(error){notice(error.message);return;}await loadAddresses();renderAddresses();notice('Address deleted.');
  }
  function cartItemsPayload() {return itemList().map(({product,qty})=>({product_id:product.id,quantity:qty}));}
  // Quotes are recalculated in Postgres when an order is placed; previews are informational.
  async function quoteCheckout() {
    const seq=++checkoutQuoteSeq;
    const subtotal=total();const shipping=subtotal>=250?0:20;
    let quote={subtotal,shipping_fee:shipping,discount_amount:0,total:subtotal+shipping};
    const code=$('promoCodeInput').value.trim().toUpperCase();
    $('promoResult').textContent=code?'Checking promo...':(shipping===0?'Free demo delivery applied.':'AED 20 delivery · Free when items reach AED 250.');
    if(db && user && itemList().length){
      const {data,error}=await db.rpc('quote_store_cart',{p_items:cartItemsPayload(),p_code:code||null});
      if(seq!==checkoutQuoteSeq)return;
      if(error){
        $('promoResult').textContent=error.message||'Could not calculate demo total.';
        $('promoResult').classList.add('quote-error');
        $('placeOrderBtn').disabled=true;
      } else {
        quote=data;
        $('promoResult').classList.remove('quote-error');
        $('promoResult').textContent=code?`Promo ${code} applied! ${money(quote.discount_amount)} off.`:(Number(quote.shipping_fee)===0?'Free demo delivery applied.':'AED 20 delivery · Free when items reach AED 250.');
        $('placeOrderBtn').disabled=false;
      }
    }
    if(seq!==checkoutQuoteSeq)return;
    $('checkoutSubtotal').textContent=money(quote.subtotal);
    $('checkoutShipping').textContent=money(quote.shipping_fee);
    $('checkoutDiscount').textContent='− '+money(quote.discount_amount);
    $('checkoutTotal').textContent=money(quote.total);
  }
  function receiptBody(o) {
    const lines=(o.order_items||[]).map(i=>`<div class="receipt-line"><span>${escapeHTML(i.product_name)} × ${Number(i.quantity)}</span><b>${money(Number(i.quantity)*Number(i.unit_price))}</b></div>`).join('');
    return `<div class="receipt-header"><p class="eyebrow small">LUMINA · DEMO STORE</p><h2 id="receiptTitle">Order summary</h2><p>Not a tax invoice or proof of payment.</p></div><div class="receipt-info"><div><small>Order reference</small><strong>#${escapeHTML(orderRef(o.id))}</strong></div><div><small>Date</small><strong>${dateText(o.created_at)}</strong></div><div><small>Customer</small><strong>${escapeHTML(o.buyer_name||'')}</strong></div><div><small>Payment</small><strong>${escapeHTML(paymentNames[o.payment_method]||'Demo')}</strong></div></div><p><b>Delivery:</b> ${escapeHTML(o.address)}, ${escapeHTML(o.city)}</p>${o.notes?`<p><b>Delivery notes:</b> ${escapeHTML(o.notes)}</p>`:''}<div class="receipt-lines">${lines}</div><div class="receipt-line"><span>Products</span><b>${money(o.subtotal??o.total)}</b></div><div class="receipt-line"><span>Delivery</span><b>${money(o.shipping_fee||0)}</b></div>${Number(o.discount_amount)>0?`<div class="receipt-line"><span>Promo discount</span><b>− ${money(o.discount_amount)}</b></div>`:''}<div class="receipt-line receipt-grand"><span>Demo total</span><b>${money(o.total)}</b></div><p class="fine-print">${escapeHTML(paymentStatusNames[o.payment_status]||'Demo order')} · No real money was charged or received. This printout is for a portfolio project.</p>`;
  }
  function showReceipt(id) {
    const o=orderReceiptsCache.find(o=>o.id===id);if(!o)return;
    $('receiptBody').innerHTML=receiptBody(o);openModal('receiptModal');
  }
  function renderOverview() {
    const orders=adminOrdersCache;
    const active=orders.filter(o=>o.status!=='cancelled');
    const demoValue=active.reduce((sum,o)=>sum+Number(o.total||0),0);
    const unfulfilled=active.filter(o=>!['delivered','completed'].includes(o.status)).length;
    const lowStock=products.filter(p=>p.active!==false&&Number(p.stock)<=5).length;
    const buyers=new Set(orders.map(o=>o.email).filter(Boolean)).size;
    $('overviewCards').innerHTML=[['Demo order value',money(demoValue)],['Orders',orders.length],['To fulfill',unfulfilled],['Customers',buyers],['Low-stock products',lowStock]].map(([label,value])=>`<div class="overview-tile"><small>${escapeHTML(label)}</small><strong>${escapeHTML(value)}</strong></div>`).join('');
    $('overviewRecent').innerHTML='<h3>Latest orders</h3>'+(orders.length?orders.slice(0,5).map(o=>`<div class="overview-row"><span>#${escapeHTML(orderRef(o.id))} · ${escapeHTML(o.buyer_name)}</span><span>${money(o.total)} <small>(${escapeHTML(statusNames[o.status]||o.status)})</small></span></div>`).join(''):'<p>No customer orders yet.</p>');
  }
  async function loadPromos() {
    if(!isAdmin)return;
    $('adminPromoList').innerHTML='<p>Loading promotions...</p>';
    const {data,error}=await db.from('promo_codes').select('id,code,discount_type,discount_value,min_order,max_uses,used_count,active,expires_at').order('created_at',{ascending:false});
    if(error){$('adminPromoList').textContent=error.message;return;}
    adminPromoCache=data||[];
    $('adminPromoList').innerHTML=adminPromoCache.length?adminPromoCache.map(p=>`<div class="admin-promo-row"><div><strong>${escapeHTML(p.code)}</strong><small>${p.discount_type==='percent'?`${Number(p.discount_value)}%`:`${money(p.discount_value)}`} off · Min ${money(p.min_order)} · Used ${p.used_count}${p.max_uses?'/'+p.max_uses:''}${p.expires_at?' · Expires '+dateText(p.expires_at):''}</small></div><button type="button" class="btn btn-outline btn-small" data-action="toggle-promo" data-id="${escapeHTML(p.id)}">${p.active?'Deactivate':'Activate'}</button></div>`).join(''):'<p>No codes yet. Create your first promotion above.</p>';
  }
  async function createPromo(event) {
    event.preventDefault();if(!isAdmin)return;
    const f=event.currentTarget;
    const t=f.elements.discount_type.value;const v=Number(f.elements.discount_value.value);
    if(!Number.isFinite(v)||v<=0||(t==='percent'&&v>100)){notice('Enter a valid discount value.');return;}
    const record={code:f.elements.code.value.trim().toUpperCase(),discount_type:t,discount_value:v,min_order:Number(f.elements.min_order.value)||0,max_uses:f.elements.max_uses.value?Number(f.elements.max_uses.value):null,expires_at:f.elements.expires_at.value?new Date(f.elements.expires_at.value+'T23:59:59').toISOString():null};
    const {error}=await db.from('promo_codes').insert(record);
    if(error){notice(error.message);return;}f.reset();notice('Promo created.');loadPromos();
  }
  async function togglePromo(id) {
    if(!isAdmin)return;const promo=adminPromoCache.find(p=>p.id===id);if(!promo)return;
    const {error}=await db.from('promo_codes').update({active:!promo.active}).eq('id',id);
    if(error)notice(error.message);else{notice('Promo updated.');loadPromos();}
  }
  async function loadSupport(admin=false) {
    if(!db||!user)return;
    const target=admin?'adminSupportList':'customerSupportList';$(target).innerHTML='<p>Loading messages...</p>';
    const {data,error}=await db.from('support_requests').select('id,user_id,subject,message,status,admin_reply,created_at').order('created_at',{ascending:false}).limit(admin?100:50);
    if(error){$(target).textContent=error.message;return;}
    if(admin){supportCache=data||[];
      $(target).innerHTML=(data||[]).length?data.map(t=>`<article class="support-ticket"><div class="ticket-head"><b>${escapeHTML(t.subject)}</b><small>${dateText(t.created_at)} · ${escapeHTML(t.status)}</small></div><p>${escapeHTML(t.message)}</p><form class="reply-form" data-ticket-id="${escapeHTML(t.id)}"><label>Admin reply<textarea name="reply" rows="2" maxlength="1500" placeholder="Reply to this customer">${escapeHTML(t.admin_reply||'')}</textarea></label><label class="reply-check"><input type="checkbox" name="resolved" ${t.status==='resolved'?'checked':''}/> Mark resolved</label><button type="submit" class="btn btn-dark btn-small">Save response</button></form></article>`).join(''):'<p>No support requests yet.</p>';
    } else $(target).innerHTML=(data||[]).length?data.map(t=>`<article class="support-ticket"><div class="ticket-head"><b>${escapeHTML(t.subject)}</b><small>${dateText(t.created_at)} · ${escapeHTML(t.status)}</small></div><p>${escapeHTML(t.message)}</p>${t.admin_reply?`<div class="support-answer"><b>Store reply</b><p>${escapeHTML(t.admin_reply)}</p></div>`:'<p class="fine-print">Awaiting store response</p>'}</article>`).join(''):'<p class="empty-note">No requests yet.</p>';
  }
  async function showSupport() {
    if(!user){showAuth('signin');return;}
    closeModal('accountModal');openModal('supportModal');loadSupport(false);
  }
  async function submitSupport(event) {
    event.preventDefault();if(!db||!user)return;
    const f=event.currentTarget;
    const {error}=await db.from('support_requests').insert({user_id:user.id,subject:f.elements.subject.value.trim(),message:f.elements.message.value.trim()});
    if(error){notice(error.message);return;}
    f.reset();notice('Support message sent.');loadSupport(false);
  }
  async function saveSupportReply(event) {
    event.preventDefault();if(!db||!isAdmin)return;
    const f=event.target;
    const {error}=await db.from('support_requests').update({admin_reply:f.elements.reply.value.trim()||null,status:f.elements.resolved.checked?'resolved':'open',updated_at:new Date().toISOString()}).eq('id',f.dataset.ticketId);
    if(error){notice(error.message);return;}notice('Reply saved.');loadSupport(true);
  }

  // Centralized handlers keep dynamic product and order buttons functional.
  document.addEventListener('click',(event)=>{
    const b=event.target.closest('button,[data-collection]');if(!b)return;
    if(b.dataset.close){closeModal(b.dataset.close);return;}
    if(b.dataset.authTab){showAuth(b.dataset.authTab);return;}
    if(b.dataset.adminTab){switchAdminTab(b.dataset.adminTab);return;}
    if(b.dataset.category){category=b.dataset.category;renderProducts();return;}
    if(b.dataset.collection){category=b.dataset.collection;query='';$('productSearch').value='';renderProducts();return;}
    const id=b.dataset.id;
    if(b.dataset.action==='quickview'){showQuickView(id);return;}
    if(b.dataset.action==='favorite'){toggleFavorite(id);return;}
    if(b.dataset.action==='wish-add'){addToCart(id,1);closeModal('wishlistModal');openCart();return;}
    if(b.dataset.action==='quick-add-close'){addToCart(id,1);closeModal('quickViewModal');openCart();return;}
    if(b.dataset.action==='remove-address'){removeAddress(id);return;}
    if(b.dataset.action==='receipt'){showReceipt(id);return;}
    if(b.dataset.action==='toggle-promo'){togglePromo(id);return;}
    if(b.dataset.action==='add'){addToCart(id,1);return;}
    if(b.dataset.action==='plus'){addToCart(id,1);return;}
    if(b.dataset.action==='minus'){addToCart(id,-1);return;}
    if(b.dataset.action==='remove'){delete cart[id];saveCart();renderCart();return;}
    if(b.dataset.action==='edit-product'){editProduct(id);return;}
    if(b.dataset.action==='toggle-product'){toggleProduct(id);return;}
    if(b.dataset.action==='demo-cod-collect'){collectDemoCOD(id);return;}
    if(b.id==='cartBtn'||b.id==='footerCart')openCart();
    if(b.id==='wishBtn'||b.id==='myWishlistBtn')showWishlist();
    if(b.id==='favoritesFilterBtn'){favoritesOnly=!favoritesOnly;renderProducts();}
    if(b.id==='myAddressesBtn')showAddresses();
    if(b.id==='mySupportBtn'||b.id==='footerSupport')showSupport();
    if(b.id==='refreshOverview')loadAdminOrders();
    if(b.id==='refreshSupport')loadSupport(true);
    if(b.id==='applyPromoBtn')quoteCheckout();
    if(b.id==='printReceiptBtn')window.print();
    if(b.id==='closeCart'||b.id==='keepShopping'||b.id==='emptyShopBtn')closeCart();
    if(b.id==='accountBtn'||b.id==='footerAccount')openAccount();
    if(b.id==='checkoutBtn')beginCheckout();
    if(b.id==='myOrdersBtn'||b.id==='trackNavBtn'||b.id==='footerTracking'||b.id==='trackingRefreshBtn')showOrders();
    if(b.id==='adminBtn')showAdmin();
    if(b.id==='newProductBtn')editProduct(null);
    if(b.id==='refreshAdminOrders')loadAdminOrders();
    if(b.id==='headerSearch'){if(document.body.dataset.page==='collection'){$('shop').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('productSearch').focus(),400);}else{window.location.href='collection.html#shop';}}
    if(b.id==='clearFilters'){category='All';query='';priceRange='all';stockOnly=false;$('productSearch').value='';$('priceFilter').value='all';$('stockFilter').checked=false;favoritesOnly=false;renderProducts();}
    if(b.id==='signOutBtn'&&db){db.auth.signOut().then(({error})=>{if(error)notice(error.message);else{closeModal('accountModal');notice('Signed out.');syncAuth();}});}
  });
  $('drawerBackdrop').addEventListener('click',closeCart);
  $('productSearch').addEventListener('input',(e)=>{query=e.target.value.trim().toLowerCase();renderProducts();});
  $('sortSelect').addEventListener('change',(e)=>{sort=e.target.value;renderProducts();});
  $('priceFilter').addEventListener('change',(e)=>{priceRange=e.target.value;renderProducts();});
  $('stockFilter').addEventListener('change',(e)=>{stockOnly=e.target.checked;renderProducts();});
  $('authForm').addEventListener('submit',submitAuth);
  $('checkoutForm').addEventListener('submit',placeOrder);
  $('checkoutForm').addEventListener('input',()=>checkoutError(''));
  $('savedAddressSelect').addEventListener('change',e=>applyAddress(e.target.value));
  $('promoCodeInput').addEventListener('change',quoteCheckout);
  $('addressForm').addEventListener('submit',saveAddress);
  $('supportForm').addEventListener('submit',submitSupport);
  $('promoForm').addEventListener('submit',createPromo);
  $('adminSupportList').addEventListener('submit',e=>{if(e.target.matches('.reply-form'))saveSupportReply(e);});
  $('checkoutForm').addEventListener('change',(e)=>{if(e.target.name==='payment_method') updatePaymentUI();});
  updatePaymentUI();
  $('productForm').addEventListener('submit',saveProduct);
  $('adminOrdersList').addEventListener('submit',(e)=>{if(e.target.matches('.admin-tracking-form'))saveTracking(e);});
  $('adminOrderSearch').addEventListener('input',renderAdminOrders);
  $('adminOrderStatusFilter').addEventListener('change',renderAdminOrders);
  document.addEventListener('keydown',(e)=>{if(e.key==='Escape'){['reviewModal','receiptModal','supportModal','addressesModal','wishlistModal','quickViewModal','productModal','adminModal','ordersModal','checkoutModal','accountModal','authModal'].forEach(id=>{if(!$(id).hidden){closeModal(id);return;}});closeCart();}});
  $('year').textContent=new Date().getFullYear();
  wishlist=readGuestWishlist();
  window.LUMINA_APP = {
    getClient:()=>db,
    getUser:()=>user,
    getIsAdmin:()=>isAdmin,
    getProducts:()=>products,
    getCatalogSource:()=>catalogSource
  };
  renderProducts(); // Show a clearly labeled preview immediately, including on slow connections.
  if(db){db.auth.onAuthStateChange(()=>{setTimeout(syncAuth,0);});syncAuth();}
})();
