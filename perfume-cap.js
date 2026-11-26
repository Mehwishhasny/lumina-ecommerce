/* Replay the entrance/open/close cycle without changing checkout or Supabase. */
(() => {
  'use strict';
  const bottle = document.getElementById('heroPerfume');
  const cap = bottle?.querySelector('.perfume-cap-photo');
  const button = document.getElementById('replayPerfume');
  if (!bottle || !cap || !button) return;
  button.addEventListener('click', () => {
    // Respect the existing Motion toggle. If paused, resume via that button.
    if (document.body.classList.contains('motion-paused')) {
      document.getElementById('motionToggle')?.click();
    }
    bottle.style.animation = 'none';
    cap.style.animation = 'none';
    void bottle.offsetWidth; // Restart both CSS timelines at frame zero.
    bottle.style.animation = '';
    cap.style.animation = '';
  });
})();
