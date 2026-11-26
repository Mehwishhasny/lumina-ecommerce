# Update checklist — your current LUMINA project

1. **Do not delete your working site yet.** Back it up.
2. Extract this new ZIP into a different folder.
3. Copy the old `config.js` (with your Supabase URL and **public** publishable/anon key) into this folder, overwriting the blank template. Never put `service_role` or a secret key here.
4. The **only new SQL** needed for the new reviews feature is `reviews-upgrade.sql`. Run it in the **same Supabase project** as LUMINA. Existing tables and data are kept.
5. Start **VS Code → Open Folder → index.html → Open with Live Server**.
6. Check all 4 hero slides, Featured Products, All Products, Cart, and Reviews.
7. Sign in as admin and verify **Manage Store → Reviews**. Admin approves a review only after a customer submits it for a delivered order.
8. If product photographs are blank, check access to `images.unsplash.com` and the `image_url` column in Supabase.
9. Payments remain simulated: **Card, Cash on Delivery, Google Pay and Mobile Wallet**; no live payment gateway is connected.

If the browser still shows the previous layout, press **Ctrl+Shift+R** or stop/restart Live Server for this new folder.
