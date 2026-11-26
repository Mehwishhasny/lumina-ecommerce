# LUMINA — Maison Edition (Colors & Fonts)

This edition is a **visual redesign** of the LUMINA Atelier website and retains the same JavaScript, animations, product records, customer login, cart, reviews, order tracking, and **demo-only** payment options.

## Theme colors
- Wine (buttons, navigation, footer): `#482D3A`
- Warm ivory (base background): `#FFFBF8`
- Soft blush (hero, panels): `#F3E5E5`
- Dusty rose (eyebrows, accents): `#906674`
- Champagne (subtle highlights): `#C7A886`
- Text (deep ink): `#31252C`

## Fonts
- **Cormorant Garamond** — large hero headlines, section headings, editorial review quotations.
- **Plus Jakarta Sans** — product names, pricing, buttons, navigation, filters, checkout, and admin interfaces.

Fonts are loaded from Google Fonts when internet is available. If blocked, the layout falls back to Georgia and Arial.

## Install
1. Unzip this folder; keep a backup of your previous website.
2. Copy your working **`config.js`** from the current website into this folder to keep your Supabase connection. Never publish or paste a secret/service-role key.
3. Open `index.html` from VS Code with **Live Server**.
4. Refresh with **Ctrl + Shift + R**.

**No new SQL is needed.** This update adds `maison-theme.css` and changes font links and favicon colors. Do not mix different editions' `index.html` files.

**Payments remain portfolio simulations.** Card, wallet and Google Pay are demo options; no real transactions are processed.
