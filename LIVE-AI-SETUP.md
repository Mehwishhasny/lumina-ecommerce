# LIVE AI SETUP — LUMINA Maison

The rule-based chatbot is replaced by real AI replies. The site cannot call an AI model until **you** deploy the included Edge Function and create an API key; do not put that key into `config.js` or `index.html`.

## A. Add demo sale and chat protection SQL

Supabase Dashboard → SQL Editor → New query → paste `sale-and-chat.sql` → Run. This safely adds MAISON50 and a private rate-limiter table/function; no customers or orders are deleted.

## B. Create a Gemini API key

Open https://aistudio.google.com/apikey, make a key in your own project. Do not paste the key into chat, GitHub or frontend JS. Availability and free quota depend on model/account. Recommended default `gemini-3.8-flash`; if unavailable, configure `GEMINI_MODEL` to a currently accessible model that supports generateContent.

## C. Add Supabase function secrets

In Supabase Dashboard → Edge Functions → Secrets (or Edge Function Secrets in Settings), set:

- `GEMINI_API_KEY`: your API key from AI Studio
- `CHAT_RATE_SALT`: a long random secret, e.g. 32+ random characters
- `ALLOWED_ORIGINS`: comma-separated allowed website origins, e.g. `https://yourdomain.com` (local Live Server 127.0.0.1/localhost ports are allowed automatically)
- Optional `GEMINI_MODEL`: `gemini-3.8-flash`

`SUPABASE_URL` and `SUPABASE_SECRET_KEYS` (or legacy `SUPABASE_SERVICE_ROLE_KEY`) are injected by Supabase Edge Functions. The code supports both automatically using Supabase’s client library. NEVER put any secret/service key in the website. The function fails closed if it cannot securely enforce rate limiting.

## D. Deploy the function (choose one)

### Option 1: Supabase Dashboard (no CLI)

Go to Supabase → Edge Functions → Deploy a new function → Via Editor. Name: `lumina-chat`. Copy all code from `supabase/functions/lumina-chat/index.ts` into `index.ts`. In the function's settings, **disable JWT verification** so unauthenticated store visitors can chat; the function itself enforces allowed origins and rate limits. Deploy.

### Option 2: Supabase CLI

Inside this project folder, run:

```sh
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase functions deploy lumina-chat --no-verify-jwt
```

Use a compatible Node.js/npm installation and your actual project reference. The `supabase/config.toml` is included for CLI deployment. When deployed you should see `https://YOUR_PROJECT_REF.supabase.co/functions/v1/lumina-chat` in the dashboard.

## E. Test locally

1. Keep your working public `config.js`.
2. VS Code → Live Server → open the website.
3. Open the bottom-right LUMINA Concierge and ask: “Do you have any perfumes under AED 250?”
4. If the Edge Function was deployed correctly and the API key/model are valid, a live AI response appears. Live prices and stock are sourced from your Supabase `products` table.
5. Open the 50% Off popup and click “Shop the offer.” Add a product to cart → checkout → check the discount line (`MAISON50`, 50% off item subtotal).

## Troubleshooting

- **Live AI is not configured**: `config.js` still empty, function missing, or server secrets not set.
- **403 Origin not allowed**: Add your deployed exact site origin to `ALLOWED_ORIGINS` (no trailing slash). HTTP localhost/127.0.0.1 are allowed for local testing.
- **429**: Rate limit / AI provider quota. Do not repeatedly retry.
- **503**: The function lacks secrets, secure client fingerprint, Supabase service key, or AI provider is unavailable. Supabase → Edge Functions → Logs has details. If your Supabase gateway doesn't populate `cf-connecting-ip` or `x-real-ip`, adapt IP retrieval to a trusted proxy header; do not just trust a browser-supplied IP.
- **Sale code invalid**: Run `sale-and-chat.sql` and verify `MAISON50` appears as active. Your earlier `full-store-upgrade.sql` must already exist.
- **No chat responses**: Test the function from your website origin; browser DevTools → Network will show the status, while secrets remain hidden.

AI interactions are sent to the configured model provider; don't enter addresses, passwords, payment details or sensitive data in chat. This is not a human live-agent channel and does not have access to private customer orders.
