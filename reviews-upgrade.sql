-- LUMINA | Customer reviews, moderation and verified-delivery eligibility.
-- Run in the same Supabase project AFTER the existing full-store and tracking setup.
-- Does not modify orders, products, payments, or existing inventory.

CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  display_name text NOT NULL CHECK (char_length(trim(display_name)) BETWEEN 2 AND 36),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body text NOT NULL CHECK (char_length(trim(body)) BETWEEN 25 AND 600),
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_once_per_purchased_item UNIQUE(user_id,order_id,product_id)
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_published
  ON public.product_reviews(approved,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_reviews_owner
  ON public.product_reviews(user_id);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.product_reviews FROM PUBLIC,anon,authenticated;
GRANT SELECT ON TABLE public.product_reviews TO anon,authenticated;
GRANT INSERT,UPDATE ON TABLE public.product_reviews TO authenticated;

DROP POLICY IF EXISTS "lumina_reviews_visible" ON public.product_reviews;
CREATE POLICY "lumina_reviews_visible" ON public.product_reviews
FOR SELECT TO anon,authenticated
USING (approved = true OR user_id = (SELECT auth.uid()) OR (SELECT public.is_store_admin()));

DROP POLICY IF EXISTS "lumina_reviews_purchased" ON public.product_reviews;
CREATE POLICY "lumina_reviews_purchased" ON public.product_reviews
FOR INSERT TO authenticated
WITH CHECK (
  user_id = (SELECT auth.uid())
  AND approved = false
  AND EXISTS (
     SELECT 1 FROM public.orders o
     JOIN public.order_items i ON i.order_id=o.id
     WHERE o.id=order_id AND o.user_id=(SELECT auth.uid())
       AND o.status IN ('delivered','completed')
       AND i.product_id=product_id
  )
);

DROP POLICY IF EXISTS "lumina_reviews_admin_update" ON public.product_reviews;
CREATE POLICY "lumina_reviews_admin_update" ON public.product_reviews
FOR UPDATE TO authenticated
USING ((SELECT public.is_store_admin()))
WITH CHECK ((SELECT public.is_store_admin()));

SELECT 'Customer review table is ready' AS result;
