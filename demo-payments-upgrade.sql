-- LUMINA DEMO PAYMENTS (NO REAL MONEY)
-- Run ONCE in the same Supabase project used by your working storefront.
-- Requires existing orders table and place_order(jsonb,text,text,text,text,text).
-- Does not call any payment provider, accept card details, or charge a customer.
-- Keeps your existing products, orders, order tracking, and admin access.

BEGIN;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'not_recorded',
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'not_recorded',
  ADD COLUMN IF NOT EXISTS payment_reference text,
  ADD COLUMN IF NOT EXISTS payment_updated_at timestamptz;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.orders'::regclass
      AND conname = 'lumina_demo_payment_method_check'
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT lumina_demo_payment_method_check
      CHECK (payment_method IN ('not_recorded','card','cash_on_delivery','google_pay','mobile_wallet'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.orders'::regclass
      AND conname = 'lumina_demo_payment_status_check'
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT lumina_demo_payment_status_check
      CHECK (payment_status IN ('not_recorded','demo_success','pending_cod','demo_collected'));
  END IF;
END $$;

-- New demo checkout calls the trusted existing checkout function for stock,
-- price, logged-in ownership, and item checks. Updates happen atomically.
CREATE OR REPLACE FUNCTION public.place_demo_order(
  p_items jsonb,
  p_name text,
  p_phone text,
  p_address text,
  p_city text,
  p_notes text,
  p_payment_method text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user uuid := (select auth.uid());
  v_method text := lower(btrim(coalesce(p_payment_method,'')));
  v_order uuid;
  v_status text;
  v_reference text;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Please sign in to submit a demo order.';
  END IF;

  IF v_method NOT IN ('card','cash_on_delivery','google_pay','mobile_wallet') THEN
    RAISE EXCEPTION 'Please select an available demo payment method.';
  END IF;

  -- Existing function calculates prices in the DB and creates a normal order.
  v_order := public.place_order(
    p_items, p_name, p_phone, p_address, p_city, p_notes
  );

  v_status := CASE WHEN v_method = 'cash_on_delivery'
    THEN 'pending_cod' ELSE 'demo_success' END;
  v_reference := CASE WHEN v_method = 'cash_on_delivery'
    THEN NULL
    ELSE 'SIM-' || upper(left(replace(v_order::text,'-',''),12))
  END;

  UPDATE public.orders
  SET payment_method = v_method,
      payment_status = v_status,
      payment_reference = v_reference,
      payment_updated_at = now()
  WHERE id = v_order AND user_id = v_user;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Could not save demo payment selection.';
  END IF;

  RETURN v_order;
END;
$$;

REVOKE ALL ON FUNCTION public.place_demo_order(jsonb,text,text,text,text,text,text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.place_demo_order(jsonb,text,text,text,text,text,text)
  TO authenticated;

-- The store owner can simulate receiving COD cash from the admin dashboard.
-- No cash collection or fund transfer happens here.
CREATE OR REPLACE FUNCTION public.mark_demo_cod_collected(
  p_order_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
BEGIN
  IF (select auth.uid()) IS NULL OR NOT public.is_store_admin() THEN
    RAISE EXCEPTION 'Administrator access required.';
  END IF;

  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found.';
  END IF;

  IF v_order.status = 'cancelled' THEN
    RAISE EXCEPTION 'Cannot collect COD on a cancelled order.';
  END IF;

  IF v_order.payment_method <> 'cash_on_delivery'
     OR v_order.payment_status <> 'pending_cod' THEN
    RAISE EXCEPTION 'Only pending demo COD orders can be marked collected.';
  END IF;

  UPDATE public.orders
  SET payment_status = 'demo_collected',
      payment_reference = 'COD-SIM-' || upper(left(replace(p_order_id::text,'-',''),12)),
      payment_updated_at = now()
  WHERE id = p_order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.mark_demo_cod_collected(uuid)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_demo_cod_collected(uuid)
  TO authenticated;

COMMENT ON FUNCTION public.place_demo_order(jsonb,text,text,text,text,text,text)
  IS 'Portfolio/demo order placement ONLY. No real payment services or charges.';
COMMENT ON COLUMN public.orders.payment_status
  IS 'Demo-only payment result; demo_success and demo_collected never imply real funds.';

-- Help PostgREST recognize the new function/columns immediately.
NOTIFY pgrst, 'reload schema';
COMMIT;

-- Check the upgrade succeeded (past orders remain "not_recorded"):
SELECT
  to_regprocedure('public.place_demo_order(jsonb,text,text,text,text,text,text)') IS NOT NULL AS demo_checkout_ready,
  to_regprocedure('public.mark_demo_cod_collected(uuid)') IS NOT NULL AS demo_cod_ready,
  (SELECT count(*) FROM public.orders) AS existing_orders_preserved;
