/* LUMINA dimensional motion: entirely local, with no tracking or external requests. */
(() => {
  'use strict';
  const stage = document.getElementById('immersiveStage');
  const scene = document.getElementById('stageWorld');
  const toggle = document.getElementById('motionToggle');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  try { if (localStorage.getItem('lumina_motion_off') === 'true') paused = true; } catch(e) {}
  function applyMotion() {
    document.body.classList.toggle('motion-paused',paused);
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.setAttribute('aria-label',paused?'Resume 3D animation':'Pause 3D animation');
    toggle.querySelector('span').textContent=paused?'▶':'❚❚';
    if (paused) { scene.style.setProperty('--scene-x','0deg'); scene.style.setProperty('--scene-y','0deg'); }
  }
  toggle.addEventListener('click',() => {
    paused = !paused; applyMotion();
    try { localStorage.setItem('lumina_motion_off',String(paused)); } catch(e) {}
  });
  applyMotion();
  const canHover = window.matchMedia('(hover:hover) and (pointer:fine)');
  let stageFrame=0;
  function resetScene(){ scene.style.setProperty('--scene-x','0deg');scene.style.setProperty('--scene-y','0deg'); }
  stage.addEventListener('pointermove',event => {
    if(paused || !canHover.matches) return;
    cancelAnimationFrame(stageFrame);
    const bounds=stage.getBoundingClientRect();
    const nx=(event.clientX-bounds.left)/bounds.width-.5;
    const ny=(event.clientY-bounds.top)/bounds.height-.5;
    stageFrame=requestAnimationFrame(()=>{
      scene.style.setProperty('--scene-x',`${(-ny*13).toFixed(2)}deg`);
      scene.style.setProperty('--scene-y',`${(nx*17).toFixed(2)}deg`);
    });
  },{passive:true});
  stage.addEventListener('pointerleave',resetScene);

  // Event delegation also covers products created dynamically by Supabase.
  let lastTilt = null;
  document.addEventListener('pointermove',event=>{
    if(paused || !canHover.matches) return;
    const card = event.target.closest('.product-card.tilt-surface,.experience-tile.tilt-surface,.collection-card.tilt-surface');
    if(card !== lastTilt){
      if(lastTilt){lastTilt.style.removeProperty('--tilt-x');lastTilt.style.removeProperty('--tilt-y');}
      lastTilt=card;
    }
    if(!card) return;
    const b=card.getBoundingClientRect();
    const x=(event.clientX-b.left)/Math.max(1,b.width)-.5;
    const y=(event.clientY-b.top)/Math.max(1,b.height)-.5;
    const limit=card.classList.contains('product-card')?4.3:5.5;
    card.style.setProperty('--tilt-x',`${(-y*limit).toFixed(2)}deg`);
    card.style.setProperty('--tilt-y',`${(x*limit).toFixed(2)}deg`);
  },{passive:true});
  document.addEventListener('pointerover',event=>{
    if(event.target.closest('.product-card,.experience-tile,.collection-card'))return;
    if(lastTilt){lastTilt.style.removeProperty('--tilt-x');lastTilt.style.removeProperty('--tilt-y');lastTilt=null;}
  },{passive:true});
  document.addEventListener('pointerout',event=>{
    const card=event.target.closest('.tilt-surface');
    if(card && !card.contains(event.relatedTarget)){
      card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');
      if(lastTilt===card)lastTilt=null;
    }
  },{passive:true});

  // Reveal static sections as they enter the viewport; do not hide product cards or dialogs.
  const revealEls=[...document.querySelectorAll('.collections .section-heading,.collection-card,.shop-section .section-heading,.experience-head,.experience-tile,.story,.faq-section .section-heading')];
  if('IntersectionObserver' in window && !reduced.matches){
    revealEls.forEach(el=>el.classList.add('reveal'));
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}});
    },{threshold:.08,rootMargin:'0px 0px 50px 0px'});
    revealEls.forEach(el=>observer.observe(el));
  }
  const mobileMenu=document.getElementById('mobileMenuToggle');
  const menu=document.getElementById('mainNavigation');
  function closeMobileMenu(){menu.classList.remove('mobile-open');mobileMenu.setAttribute('aria-expanded','false');mobileMenu.setAttribute('aria-label','Open navigation');mobileMenu.textContent='☰';}
  if (mobileMenu && menu) {
    mobileMenu.addEventListener('click',()=>{
      const expanded=menu.classList.toggle('mobile-open');
      mobileMenu.setAttribute('aria-expanded',String(expanded));
      mobileMenu.setAttribute('aria-label',expanded?'Close navigation':'Open navigation');
      mobileMenu.textContent=expanded?'✕':'☰';
    });
    menu.addEventListener('click',event=>{if(event.target.closest('a,button'))closeMobileMenu();});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMobileMenu();});
    document.addEventListener('click',event=>{if(!menu.contains(event.target)&&!mobileMenu.contains(event.target))closeMobileMenu();});
  }

  const trackButton=document.getElementById('expTrackBtn');
  if(trackButton){trackButton.addEventListener('click',()=>document.getElementById('accountBtn')?.click());}
})();
