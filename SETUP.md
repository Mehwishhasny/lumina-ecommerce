# LUMINA — Professional Store Edition

A polished, photograph-led Supabase e-commerce portfolio project built from the previous LUMINA cap animation edition. This update preserves customer sign-in, carts, products, wishlists, saved addresses, checkout, simulated card/COD/Google Pay/mobile-wallet payments, order status, receipts, support, and the admin dashboard.

## What's new
- Removed the scrolling slogan strip, repeated feature cards and excessive homepage copy.
- Refined typography, spacing, collections, product grid, mobile layout and footer.
- Kept the original perfume entrance and opening/closing cap hero animation.
- Added **a second photo-based perfume reveal** in the fragrance section. Hover or keyboard focus the picture, or click **Play reveal** on mobile, to see its cap lift and close.
- Added **12 more sample products**, bringing the full catalog to **20** after running the SQL seed in your existing Supabase project.

## Install on Windows
1. **Back up your current LUMINA folder**. Unzip this edition into a new folder.
2. Copy the existing working `config.js` from your old LUMINA folder into the new folder, replacing the placeholder. Use only a publishable or anon key, never a service-role key.
3. In Supabase SQL Editor, run `add-12-products.sql` against **the same project** with your current `public.products` table. This is safe to re-run: it uses fixed UUIDs and `ON CONFLICT DO NOTHING`.
4. Open this folder in VS Code and right-click `index.html` → **Open with Live Server**.
5. Refresh the page with `Ctrl + Shift + R`.
6. Check the 20 items, test customer checkout and tracking, then verify admin access. No existing product, stock level, customer, or order is modified by the new seed.

**If you still see 8 products:** The 12 new products were not inserted in the same Supabase project used by `config.js`; or the page is cached. Query `SELECT COUNT(*) FROM public.products WHERE active = true;` in the correct project.

## Photography and animation
The site deliberately uses **real photographic URLs**, not illustrated placeholders for the product content. Photographs are externally hosted (mostly Unsplash). The new Golden Hour hover reveal uses a second independently sourced photo. Internet access is required to display them. If your source blocks hotlinking, replace the URLs with your own licensed locally hosted product photos.

**Important:** The cap separation on both product shots is a CSS-masked photographic approximation, not real 3D geometry. Physical precision requires two transparent product images (cap and body) or an accurate 3D model.

## Payments / business disclaimer
This remains a **portfolio-only store**. Card, Google Pay and mobile wallet approvals are simulated; COD is only marked collected in the demonstration dashboard. **No actual payment is processed.** Do not enter real card numbers or collect genuine payments here. Live deployment should be accompanied by testing of Supabase RLS and DB functions, order creation and status permissions.
