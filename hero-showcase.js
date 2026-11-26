/* LUMINA four-product editorial hero. Never touches checkout, auth, orders or inventory. */
(() => {
  'use strict';
  const root = document.getElementById('featuredShowcase');
  if (!root) return;
  const stage = root.querySelector('#immersiveStage');
  const slides = [...root.querySelectorAll('.hero-slide')];
  const thumbs = [...root.querySelectorAll('[data-showcase-to]')];
  const replay = root.querySelector('#replayPerfume');
  const prev = root.querySelector('#heroPrev');
  const next = root.querySelector('#heroNext');
  const description = root.querySelector('#heroDescription');
  const eyebrow = root.querySelector('#heroEyebrow');
  const title = root.querySelector('#heroTitle');
  const caption = root.querySelector('#heroCaption');
  const productIndex = root.querySelector('#heroProductIndex');
  const productName = root.querySelector('#heroProductName');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const features = [
    { eyebrow:'THE FRAGRANCE EDIT', title:'A little more <em>extraordinary.</em>', detail:'The signature scent, presented with a little theatre.', caption:'01 — Signature Perfume', label:'FRAGRANCE / 01', name:'Signature notes' },
    { eyebrow:'THE BEAUTY EDIT', title:'Your daily <em>ritual.</em>', detail:'A luminous introduction to your daily ritual.', caption:'02 — Botanical Skincare Set', label:'BEAUTY / 02', name:'Everyday glow' },
    { eyebrow:'THE KITCHEN EDIT', title:'Make room for <em>slow mornings.</em>', detail:'Warmth in every detail, from morning to evening.', caption:'03 — Ceramic Coffee Mug', label:'KITCHEN / 03', name:'The morning edit' },
    { eyebrow:'THE ACCESSORY EDIT', title:'Beautifully made for <em>everywhere.</em>', detail:'An everyday favorite with effortless movement.', caption:'04 — Everyday Tote Bag', label:'ACCESSORIES / 04', name:'Carry it well' }
  ];
  let active = 0;
  let automaticTimer = null;
  let hovering = false;
  let inView = true;
  const DURATION = 8500;
  function isPaused() {
    return document.hidden || reduceMotion.matches || document.body.classList.contains('motion-paused') || hovering || !inView;
  }
  function schedule() {
    window.clearTimeout(automaticTimer);
    automaticTimer = null;
    if (isPaused()) return;
    automaticTimer = window.setTimeout(() => goTo(active+1), DURATION);
  }
  function replayActive() {
    if (reduceMotion.matches) return;
    const current = slides[active];
    // Restart just the current slide's own animations, never animations in other sections.
    current.classList.remove('is-active');
    void current.offsetWidth;
    current.classList.add('is-active');
  }
  function goTo(number, forceReplay=false) {
    const index = (number + slides.length) % slides.length;
    if (index === active && !forceReplay) { schedule(); return; }
    const previous = slides[active];
    previous.classList.remove('is-active');
    previous.setAttribute('aria-hidden','true');
    active = index;
    const current = slides[active];
    current.classList.add('is-active');
    current.setAttribute('aria-hidden','false');
    const copy = features[active];
    eyebrow.textContent = `${copy.eyebrow} · ${String(active+1).padStart(2,'0')} / 04`;
    title.innerHTML = copy.title; // All four titles are static trusted strings above.
    description.textContent = copy.detail;
    caption.textContent = copy.caption;
    productIndex.textContent = copy.label;
    productName.textContent = copy.name;
    thumbs.forEach((button,i) => {
      button.classList.toggle('is-current',i===active);
      button.setAttribute('aria-current',i===active?'true':'false');
    });
    stage.setAttribute('aria-label',`${copy.caption}, featured product ${active+1} of ${slides.length}`);
    schedule();
  }
  thumbs.forEach(button => button.addEventListener('click', () => goTo(Number(button.dataset.showcaseTo),true)));
  prev?.addEventListener('click', () => goTo(active-1));
  next?.addEventListener('click', () => goTo(active+1));
  replay?.addEventListener('click', () => {
    if(document.body.classList.contains('motion-paused')) document.getElementById('motionToggle')?.click();
    replayActive();
    schedule();
  });
  // Stop auto-advance while someone is using the carousel or when reduced motion is preferred.
  stage.addEventListener('mouseenter', () => { hovering = true; schedule(); });
  stage.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  stage.addEventListener('focusin', () => { hovering = true; schedule(); });
  stage.addEventListener('focusout', (e) => { if (!stage.contains(e.relatedTarget)) { hovering = false; schedule(); } });
  document.addEventListener('visibilitychange',schedule);
  reduceMotion.addEventListener?.('change',schedule);
  root.querySelector('#motionToggle')?.addEventListener('click', () => window.setTimeout(schedule,0));
  let startX=null;
  stage.addEventListener('touchstart',(event)=>{ if(event.touches.length===1) startX=event.touches[0].clientX; },{passive:true});
  stage.addEventListener('touchend',(event)=>{
    if(startX===null || !event.changedTouches.length) return;
    const dx=event.changedTouches[0].clientX-startX;startX=null;
    if(Math.abs(dx)>65) goTo(active+(dx<0?1:-1));
  },{passive:true});
  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver(entries => {
      inView=entries[0]?.isIntersecting??true;
      schedule();
    },{threshold:.08});
    observer.observe(root);
  }
  schedule();
})();
