/* LUMINA Reviews: genuine delivered-purchase reviews require approval.
   Example quotes below are visibly labeled as design previews, never genuine testimonials. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const app = () => window.LUMINA_APP;
  const safe = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const date = v => v ? new Date(v).toLocaleDateString('en-AE',{year:'numeric',month:'short',day:'numeric'}) : '';
  const examples = [
    { rating:5,display_name:'Example shopper',body:'Everything felt simple to explore, from the collections to checkout.',product_name:'Store experience' },
    { rating:5,display_name:'Example shopper',body:'The product imagery and clear categories made browsing enjoyable.',product_name:'Product discovery' },
    { rating:4,display_name:'Example shopper',body:'The order tracking timeline was helpful and easy to understand.',product_name:'Order tracking' }
  ];
  let reviewSetupError = false;
  function card(r,example=false) {
    return `<article class="review-card">
      <div class="review-stars" aria-label="${Number(r.rating)} out of 5 stars">${'★'.repeat(Number(r.rating))}<span>${'☆'.repeat(5-Number(r.rating))}</span></div>
      <blockquote>“${safe(r.body)}”</blockquote>
      <div class="review-card-foot"><div><strong>${safe(r.display_name)}</strong><small>${safe(r.product_name || 'Product review')}</small></div><span>${example ? 'DEMO EXAMPLE' : date(r.created_at)}</span></div>
    </article>`;
  }
  function showExample(reason) {
    $('reviewsGrid').innerHTML = examples.map(r=>card(r,true)).join('');
    $('reviewsDisclosure').textContent = reason || 'Illustrative sample quotes for the portfolio preview — not real customer testimonials.';
    $('reviewsDisclosure').hidden=false;
  }
  async function loadReviews() {
    const db=app()?.getClient?.();
    if (!db) { showExample(); return; }
    const {data,error}=await db.from('product_reviews')
      .select('id,display_name,rating,body,created_at,products(name)')
      .eq('approved',true).order('created_at',{ascending:false}).limit(6);
    if (error) {
      reviewSetupError=true;
      showExample('Illustrative quotes only. Run reviews-upgrade.sql to enable genuine customer reviews.');
      return;
    }
    reviewSetupError=false;
    if(!data?.length){ showExample('Illustrative sample quotes — published customer reviews will appear here once approved.'); return; }
    $('reviewsGrid').innerHTML=data.map(r=>card({...r,product_name:r.products?.name||'Product review'})).join('');
    $('reviewsDisclosure').hidden=true;
  }
  function setMessage(text,ok=false) {
    $('reviewFormMessage').textContent=text;
    $('reviewFormMessage').classList.toggle('is-success',ok);
  }
  async function openReview() {
    const db=app()?.getClient?.();
    const user=app()?.getUser?.();
    if(!db) { alert('Connect Supabase to submit a real review.'); return; }
    if(!user) { document.getElementById('accountBtn')?.click(); return; }
    $('reviewModal').hidden=false;
    document.body.classList.add('locked');
    const select=$('reviewPurchaseSelect');
    select.innerHTML='<option value="">Loading delivered purchases…</option>';
    setMessage('');
    const {data,error}=await db.from('orders')
      .select('id,status,order_items(product_id,product_name)')
      .eq('user_id',user.id).in('status',['delivered','completed']).order('created_at',{ascending:false});
    if(error) {
      select.innerHTML='<option value="">Unable to load delivered orders</option>';
      setMessage('Could not load purchases: '+error.message);return;
    }
    const seen=new Set();
    const options=[];
    for(const order of data||[]) {
      for(const item of order.order_items || []) {
        if(!item.product_id) continue;
        const key=order.id+'|'+item.product_id;
        if(seen.has(key)) continue;
        seen.add(key);
        options.push(`<option value="${safe(key)}">${safe(item.product_name)} · order #${safe(order.id.slice(0,8))}</option>`);
      }
    }
    select.innerHTML='<option value="">Choose a delivered product</option>'+options.join('');
    if(!options.length) setMessage('No delivered purchases yet. Once an order is marked Delivered, you can review its products.');
  }
  async function sendReview(event) {
    event.preventDefault();
    const db=app()?.getClient?.(),user=app()?.getUser?.();
    if(!db || !user) {setMessage('Please sign in to submit your review.');return;}
    const form=event.currentTarget;
    const [order_id,product_id]=String(form.elements.purchase.value).split('|');
    if(!order_id||!product_id){setMessage('Select a delivered product.');return;}
    const body=form.elements.body.value.trim();
    const display_name=form.elements.display_name.value.trim();
    if(display_name.length<2||body.length<25){setMessage('Please enter a name and at least 25 characters of feedback.');return;}
    const button=$('reviewSubmit');button.disabled=true;
    const {error}=await db.from('product_reviews').insert({user_id:user.id,order_id,product_id,display_name,body,rating:Number(form.elements.rating.value)});
    button.disabled=false;
    if(error){setMessage('Could not submit: '+error.message);return;}
    setMessage('Thanks! Your review was received and is awaiting approval.',true);
    form.reset();
    await loadReviews();
  }
  async function adminReviews() {
    const target=$('adminReviewsList');
    const db=app()?.getClient?.();
    if(!target||!db||!app()?.getIsAdmin?.())return;
    target.textContent='Loading customer reviews…';
    const {data,error}=await db.from('product_reviews')
      .select('id,display_name,rating,body,approved,created_at,products(name)')
      .order('created_at',{ascending:false}).limit(100);
    if(error){target.textContent='Review list unavailable: '+error.message;return;}
    target.innerHTML=data?.length?data.map(r=>`<article class="admin-review-row" data-review-id="${safe(r.id)}">
      <div class="review-stars">${'★'.repeat(Number(r.rating))}</div>
      <strong>${safe(r.display_name)} · ${safe(r.products?.name||'Product')}</strong>
      <p>${safe(r.body)}</p>
      <small>${date(r.created_at)} · ${r.approved?'Published':'Awaiting approval'}</small>
      <button class="btn btn-outline btn-small" type="button" data-review-approve="${safe(r.id)}" data-approved="${r.approved}">${r.approved?'Unpublish':'Approve and publish'}</button>
    </article>`).join(''):'<p>No reviews submitted yet.</p>';
  }
  async function toggleApproved(button) {
    if(!app()?.getIsAdmin?.())return;
    const db=app()?.getClient?.();
    button.disabled=true;
    const newValue=button.dataset.approved!=='true';
    const {error}=await db.from('product_reviews').update({approved:newValue}).eq('id',button.dataset.reviewApprove);
    button.disabled=false;
    if(error){alert('Unable to update review: '+error.message);return;}
    await Promise.all([adminReviews(),loadReviews()]);
  }
  $('writeReviewBtn')?.addEventListener('click',openReview);
  $('reviewForm')?.addEventListener('submit',sendReview);
  $('refreshAdminReviews')?.addEventListener('click',adminReviews);
  $('adminReviewsList')?.addEventListener('click',e=>{const button=e.target.closest('[data-review-approve]');if(button)toggleApproved(button);});
  document.addEventListener('lumina:admin-reviews',adminReviews);
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-close="reviewModal"]')) { $('reviewModal').hidden=true; document.body.classList.remove('locked'); }
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && !$('reviewModal').hidden){$('reviewModal').hidden=true;document.body.classList.remove('locked');}
  });
  loadReviews();
  // When auth/session changes and reviews tab is later opened, the state getters remain current.
})();
