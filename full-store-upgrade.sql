-- LUMINA COMPLETE STORE UPGRADE — DEMO PAYMENTS ONLY
-- Apply to the same Supabase project AFTER tracking and demo-payments SQL.
-- Additive migration. Does not delete orders, inventory, auth users or tracking events.
-- Products and checkout amounts are authoritative on the database server.
BEGIN;

DO $$ BEGIN
  IF to_regprocedure('public.place_demo_order(jsonb,text,text,text,text,text,text)') IS NULL THEN
    RAISE EXCEPTION 'Run demo-payments-upgrade.sql before this upgrade';
  END IF;
  IF to_regclass('public.orders') IS NULL OR to_regclass('public.products') IS NULL
     OR to_regclass('public.store_admins') IS NULL THEN
    RAISE EXCEPTION 'The base LUMINA order and product tables are missing';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.customer_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'Home' CHECK (char_length(label) BETWEEN 2 AND 40),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 30),
  address text NOT NULL CHECK (char_length(address) BETWEEN 5 AND 250),
  city text NOT NULL CHECK (char_length(city) BETWEEN 2 AND 90),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lumina_addresses_user ON public.customer_addresses(user_id, created_at DESC);
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.customer_addresses FROM public, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_addresses TO authenticated;
DROP POLICY IF EXISTS lumina_address_select ON public.customer_addresses;
CREATE POLICY lumina_address_select ON public.customer_addresses FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS lumina_address_insert ON public.customer_addresses;
CREATE POLICY lumina_address_insert ON public.customer_addresses FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS lumina_address_update ON public.customer_addresses;
CREATE POLICY lumina_address_update ON public.customer_addresses FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS lumina_address_delete ON public.customer_addresses;
CREATE POLICY lumina_address_delete ON public.customer_addresses FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

CREATE TABLE IF NOT EXISTS public.wishlists (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_lumina_wishlist_user ON public.wishlists(user_id);
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.wishlists FROM public, anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.wishlists TO authenticated;
DROP POLICY IF EXISTS lumina_wishlist_select ON public.wishlists;
CREATE POLICY lumina_wishlist_select ON public.wishlists FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS lumina_wishlist_insert ON public.wishlists;
CREATE POLICY lumina_wishlist_insert ON public.wishlists FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS lumina_wishlist_delete ON public.wishlists;
CREATE POLICY lumina_wishlist_delete ON public.wishlists FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

CREATE TABLE IF NOT EXISTS public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE CHECK (code = upper(btrim(code)) AND code ~ '^[A-Z0-9_-]{3,24}$'),
  discount_type text NOT NULL CHECK (discount_type IN ('percent','fixed')),
  discount_value numeric(10,2) NOT NULL CHECK (discount_value > 0 AND discount_value <= 999999),
  min_order numeric(12,2) NOT NULL DEFAULT 0 CHECK (min_order >= 0),
  max_uses integer CHECK (max_uses IS NULL OR max_uses > 0),
  used_count integer NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lumina_promo_percent_cap CHECK (discount_type <> 'percent' OR discount_value <= 100)
);
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.promo_codes FROM public, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.promo_codes TO authenticated;
DROP POLICY IF EXISTS lumina_promo_admin_select ON public.promo_codes;
CREATE POLICY lumina_promo_admin_select ON public.promo_codes FOR SELECT TO authenticated USING ((SELECT public.is_store_admin()));
DROP POLICY IF EXISTS lumina_promo_admin_insert ON public.promo_codes;
CREATE POLICY lumina_promo_admin_insert ON public.promo_codes FOR INSERT TO authenticated WITH CHECK ((SELECT public.is_store_admin()));
DROP POLICY IF EXISTS lumina_promo_admin_update ON public.promo_codes;
CREATE POLICY lumina_promo_admin_update ON public.promo_codes FOR UPDATE TO authenticated USING ((SELECT public.is_store_admin())) WITH CHECK ((SELECT public.is_store_admin()));

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal numeric(12,2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_fee numeric(12,2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS promo_code text;
UPDATE public.orders SET subtotal = total WHERE subtotal IS NULL;
ALTER TABLE public.orders ALTER COLUMN subtotal SET NOT NULL;

-- Shipping defaults for this showcase: AED 20, free when product subtotal >= AED 250.
-- Promo discounts apply to item subtotal, not to delivery. No real tax is charged.
-- Returns prices based on the server's currently published catalog, never browser prices.
CREATE OR REPLACE FUNCTION public.quote_store_cart(p_items jsonb, p_code text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_entry jsonb;
  v_line record;
  v_product public.products%ROWTYPE;
  v_subtotal numeric(12,2) := 0;
  v_shipping numeric(12,2);
  v_discount numeric(12,2) := 0;
  v_coupon public.promo_codes%ROWTYPE;
  v_code text := upper(btrim(coalesce(p_code,'')));
BEGIN
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) NOT BETWEEN 1 AND 30 THEN
    RAISE EXCEPTION 'Your cart must have 1 to 30 items.';
  END IF;
  FOR v_entry IN SELECT value FROM jsonb_array_elements(p_items) LOOP
    IF jsonb_typeof(v_entry) <> 'object'
      OR coalesce(v_entry->>'product_id','') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      OR coalesce(v_entry->>'quantity','') !~ '^[0-9]{1,2}$'
      OR (v_entry->>'quantity')::integer NOT BETWEEN 1 AND 20 THEN
      RAISE EXCEPTION 'Invalid item or quantity.';
    END IF;
  END LOOP;
  FOR v_line IN
    SELECT (value->>'product_id')::uuid product_id, sum((value->>'quantity')::int)::int qty
    FROM jsonb_array_elements(p_items) GROUP BY (value->>'product_id')::uuid
  LOOP
    IF v_line.qty NOT BETWEEN 1 AND 20 THEN RAISE EXCEPTION 'Maximum 20 of any product.'; END IF;
    SELECT * INTO v_product FROM public.products WHERE id = v_line.product_id AND active = true;
    IF NOT FOUND OR v_product.stock < v_line.qty THEN RAISE EXCEPTION 'An item is unavailable or out of stock. Please refresh.'; END IF;
    v_subtotal := v_subtotal + (v_product.price * v_line.qty);
  END LOOP;
  v_shipping := CASE WHEN v_subtotal >= 250 THEN 0 ELSE 20 END;
  IF v_code <> '' THEN
    SELECT * INTO v_coupon FROM public.promo_codes WHERE code = v_code AND active = true;
    IF NOT FOUND THEN RAISE EXCEPTION 'Promo code was not found or is inactive.'; END IF;
    IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at <= now() THEN RAISE EXCEPTION 'This promo code has expired.'; END IF;
    IF v_coupon.max_uses IS NOT NULL AND v_coupon.used_count >= v_coupon.max_uses THEN RAISE EXCEPTION 'This promo code is no longer available.'; END IF;
    IF v_subtotal < v_coupon.min_order THEN RAISE EXCEPTION 'Promo minimum order is AED %.', v_coupon.min_order; END IF;
    v_discount := least(v_subtotal, CASE WHEN v_coupon.discount_type = 'percent'
      THEN round(v_subtotal * v_coupon.discount_value / 100, 2) ELSE v_coupon.discount_value END);
  END IF;
  RETURN jsonb_build_object('subtotal',v_subtotal,'shipping_fee',v_shipping,
    'discount_amount',v_discount,'total',v_subtotal - v_discount + v_shipping,
    'promo_code',nullif(v_code,''));
END;
$$;
REVOKE ALL ON FUNCTION public.quote_store_cart(jsonb,text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.quote_store_cart(jsonb,text) TO anon, authenticated;

-- FINAL checkout: validate coupon, create standard demo order and reserve stock
-- in one transaction, then save shipping/discount totals authoritatively.
CREATE OR REPLACE FUNCTION public.place_store_order(
  p_items jsonb, p_name text, p_phone text, p_address text,
  p_city text, p_notes text, p_payment_method text, p_promo_code text DEFAULT NULL
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_order uuid;
  v_subtotal numeric(12,2);
  v_shipping numeric(12,2);
  v_discount numeric(12,2) := 0;
  v_coupon public.promo_codes%ROWTYPE;
  v_code text := upper(btrim(coalesce(p_promo_code,'')));
BEGIN
  IF (SELECT auth.uid()) IS NULL THEN RAISE EXCEPTION 'Please sign in.'; END IF;
  IF char_length(v_code) > 24 THEN RAISE EXCEPTION 'Invalid promo code.'; END IF;
  -- Lock coupon first, so concurrent uses cannot exceed max_uses.
  IF v_code <> '' THEN
    SELECT * INTO v_coupon FROM public.promo_codes WHERE code = v_code AND active = true FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Promo code was not found or is inactive.'; END IF;
    IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at <= now() THEN RAISE EXCEPTION 'This promo code has expired.'; END IF;
    IF v_coupon.max_uses IS NOT NULL AND v_coupon.used_count >= v_coupon.max_uses THEN RAISE EXCEPTION 'This promo code is no longer available.'; END IF;
  END IF;
  v_order := public.place_demo_order(p_items, p_name, p_phone, p_address, p_city, p_notes, p_payment_method);
  SELECT total INTO v_subtotal FROM public.orders WHERE id = v_order AND user_id = (SELECT auth.uid());
  IF NOT FOUND THEN RAISE EXCEPTION 'Could not finish order.'; END IF;
  v_shipping := CASE WHEN v_subtotal >= 250 THEN 0 ELSE 20 END;
  IF v_code <> '' THEN
    IF v_subtotal < v_coupon.min_order THEN RAISE EXCEPTION 'Promo minimum order is AED %.', v_coupon.min_order; END IF;
    v_discount := least(v_subtotal, CASE WHEN v_coupon.discount_type = 'percent'
      THEN round(v_subtotal * v_coupon.discount_value / 100, 2) ELSE v_coupon.discount_value END);
    UPDATE public.promo_codes SET used_count = used_count + 1 WHERE id = v_coupon.id;
  END IF;
  UPDATE public.orders SET subtotal=v_subtotal, shipping_fee=v_shipping,
    discount_amount=v_discount, promo_code=nullif(v_code,''),
    total=v_subtotal + v_shipping - v_discount WHERE id = v_order;
  RETURN v_order;
END;
$$;
REVOKE ALL ON FUNCTION public.place_store_order(jsonb,text,text,text,text,text,text,text)
 FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.place_store_order(jsonb,text,text,text,text,text,text,text)
 TO authenticated;

CREATE TABLE IF NOT EXISTS public.support_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL CHECK (char_length(subject) BETWEEN 5 AND 120),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 1500),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved')),
  admin_reply text CHECK (admin_reply IS NULL OR char_length(admin_reply) <= 1500),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.support_requests FROM public, anon, authenticated;
GRANT SELECT, INSERT ON public.support_requests TO authenticated;
GRANT UPDATE(status,admin_reply,updated_at) ON public.support_requests TO authenticated;
DROP POLICY IF EXISTS lumina_support_read ON public.support_requests;
CREATE POLICY lumina_support_read ON public.support_requests FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()) OR (SELECT public.is_store_admin()));
DROP POLICY IF EXISTS lumina_support_insert ON public.support_requests;
CREATE POLICY lumina_support_insert ON public.support_requests FOR INSERT TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()) AND status = 'open' AND admin_reply IS NULL);
DROP POLICY IF EXISTS lumina_support_update ON public.support_requests;
CREATE POLICY lumina_support_update ON public.support_requests FOR UPDATE TO authenticated
USING ((SELECT public.is_store_admin())) WITH CHECK ((SELECT public.is_store_admin()));

NOTIFY pgrst, 'reload schema';
COMMIT;

-- Verify AFTER commit. Expected: true, true, true.
SELECT to_regclass('public.customer_addresses') IS NOT NULL AS addresses_ready,
       to_regclass('public.promo_codes') IS NOT NULL AS promotions_ready,
       to_regprocedure('public.place_store_order(jsonb,text,text,text,text,text,text,text)') IS NOT NULL AS checkout_ready;
