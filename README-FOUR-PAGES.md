# LUMINA Maison · Four-Page Website

A real four-page e-commerce portfolio front end, built on your existing Supabase setup.

## Pages
- `index.html` — Home (animated hero, featured items, category teasers, reviews)
- `about.html` — About LUMINA
- `collection.html` — Full live Supabase catalog, search, category/price filters, favorites and shopping controls
- `contact.html` — Contact form (signed-in support requests saved in existing Supabase support_requests table) and FAQs

The top navigation has exactly Home, About, Collection, Contact. **Orders & tracking** and **Manage store** appear in the Account menu (Manage store only for authorized admins). Cart, wishlists, demo checkout, Live AI Concierge, promo popup and order tracking are shared across all pages.

## Setup
1. Back up your current LUMINA site folder.
2. Extract this ZIP to a NEW folder.
3. Copy your existing working `config.js` from the old folder into this new folder, overwriting the example config. Do not disclose or place secret/service-role keys there; it must only contain the public URL and publishable key.
4. Open the folder in VS Code. Right click `index.html` and use **Open with Live Server**. Then visit `about.html`, `collection.html`, or `contact.html` through the navbar.
5. Sign in via the account icon. Customer order tracking and the admin area are accessed from the profile menu.
6. Test an order in demo mode and test contact with a signed-in user. If `support_requests` is missing, run your original `full-store-upgrade.sql` migration before using the form.

**No additional SQL is necessary if your existing LUMINA setup is already complete.** The site is a portfolio demonstration: no money is deducted. Client replies and AI availability depend on your existing Supabase Edge Function and database configuration. Images load from external URLs. Business contact details were intentionally not invented.
