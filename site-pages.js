/* LUMINA four-page integrations. Keeps account, cart, checkout and live concierge common to all pages. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const page = document.body.dataset.page;
  if (page === 'collection') {
    const selected = new URLSearchParams(location.search).get('category') || 'All';
    document.querySelectorAll('.collection-prompt-links a').forEach(a => {
      const target = new URL(a.href, location.href);
      a.setAttribute('aria-current', String((target.searchParams.get('category') || 'All') === selected));
    });
  }
  // Home editorial sections are teasers; the full catalog is on Collection.
  const form = $('pageContactForm');
  if (form) {
    const feedback = $('pageContactFeedback');
    form.addEventListener('submit', async event => {
      event.preventDefault();
      feedback.className = 'contact-feedback';
      const app = window.LUMINA_APP;
      const db = app?.getClient?.();
      const user = app?.getUser?.();
      if (!db) { feedback.textContent = 'Connect the LUMINA Supabase project to send a message.';feedback.classList.add('is-error'); return; }
      if (!user) {
        feedback.textContent = 'Please sign in first so you can see our reply in your account.';
        feedback.classList.add('is-error');
        $('accountBtn')?.click();
        return;
      }
      const submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      feedback.textContent = 'Sending your message…';
      const subject = form.elements.subject.value.trim();
      const message = form.elements.message.value.trim();
      try {
        const { error } = await db.from('support_requests').insert({user_id:user.id,subject,message});
        if (error) throw error;
        form.reset();
        feedback.textContent = 'Message sent! You can see replies in Account → Customer Support.';
        feedback.classList.add('is-success');
      } catch (error) {
        feedback.textContent = error?.message || 'Unable to send message. Please try again.';
        feedback.classList.add('is-error');
      } finally { submit.disabled=false; }
    });
  }
  $('contactChatBtn')?.addEventListener('click', () => { if ($('conciergePanel')?.hidden) $('conciergeLauncher')?.click(); else $('conciergeInput')?.focus(); });
  $('contactAccountBtn')?.addEventListener('click', () => $('accountBtn')?.click());
})();
