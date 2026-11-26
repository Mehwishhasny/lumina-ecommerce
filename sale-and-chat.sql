-- LUMINA Maison demo 50% offer + secure visitor-chat rate limiter.
-- Run in your EXISTING LUMINA Supabase project.
-- Requires full-store-upgrade.sql (public.promo_codes) to have been installed.
BEGIN;
DO $$ BEGIN
 IF to_regclass('public.promo_codes') IS NULL THEN
  RAISE EXCEPTION 'Run full-store-upgrade.sql first; promo_codes is missing.';
 END IF;
END $$;

INSERT INTO public.promo_codes(code, discount_type, discount_value, min_order, max_uses, active, expires_at)
VALUES ('MAISON50','percent',50,0,NULL,true,NULL)
ON CONFLICT (code) DO UPDATE SET
 discount_type='percent', discount_value=50, min_order=0,
 max_uses=NULL, active=true, expires_at=NULL;

-- Private rate-limiting state. No visitor chat transcripts stored in Supabase.
CREATE TABLE IF NOT EXISTS public.lumina_chat_limits (
 client_hash text PRIMARY KEY CHECK (length(client_hash)=64),
 window_started_at timestamptz NOT NULL DEFAULT now(),
 attempts integer NOT NULL DEFAULT 0 CHECK(attempts >= 0)
);
ALTER TABLE public.lumina_chat_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.lumina_chat_limits FROM public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.lumina_chat_rate_limit(
 p_client_hash text,
 p_window_seconds integer DEFAULT 3600,
 p_max_messages integer DEFAULT 20
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_attempts integer;
BEGIN
 IF p_client_hash !~ '^[a-f0-9]{64}$' OR p_window_seconds NOT BETWEEN 60 AND 86400 OR p_max_messages NOT BETWEEN 1 AND 50 THEN
  RETURN false;
 END IF;
 INSERT INTO public.lumina_chat_limits(client_hash,window_started_at,attempts)
 VALUES (p_client_hash,now(),1)
 ON CONFLICT(client_hash) DO UPDATE SET
  window_started_at=CASE WHEN public.lumina_chat_limits.window_started_at <= now()-make_interval(secs => p_window_seconds)
    THEN now() ELSE public.lumina_chat_limits.window_started_at END,
  attempts=CASE WHEN public.lumina_chat_limits.window_started_at <= now()-make_interval(secs => p_window_seconds)
    THEN 1 ELSE public.lumina_chat_limits.attempts+1 END
 RETURNING attempts INTO v_attempts;
 RETURN v_attempts <= p_max_messages;
END; $$;
REVOKE ALL ON FUNCTION public.lumina_chat_rate_limit(text,integer,integer) FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.lumina_chat_rate_limit(text,integer,integer) TO service_role;
COMMIT;

-- Confirm sale code; must return MAISON50 / 50 / true.
SELECT code, discount_value AS percent_off, active
FROM public.promo_codes WHERE code='MAISON50';
