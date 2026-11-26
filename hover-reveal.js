/* Photo-based hover reveal, no framework and no effect on checkout/database. */
(() => {
  'use strict';
  const stage = document.getElementById('hoverRevealStage');
  const play = document.getElementById('playHoverReveal');
  if(!stage || !play) return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame;
  const run = () => {
    if(reduced.matches || document.body.classList.contains('motion-paused')) return;
    stage.classList.remove('is-playing');
    // restart CSS keyframes on every hover or tap
    void stage.offsetWidth;
    stage.classList.add('is-playing');
  };
  const reset=()=>stage.classList.remove('is-playing');
  stage.addEventListener('mouseenter',run);
  stage.addEventListener('focusin',run);
  stage.addEventListener('mouseleave',reset);
  play.addEventListener('click',run);
  stage.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();run();}});
})();
