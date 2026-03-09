-- 1. Create Promotions and Discount Codes System table first
CREATE TABLE IF NOT EXISTS public.promotions (
    "promotionId" uuid NOT NULL DEFAULT extensions.gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NULL DEFAULT now(),
    "eventId" uuid NOT NULL,
    code varchar NOT NULL,
    "discountType" varchar NOT NULL DEFAULT 'PERCENTAGE', -- 'PERCENTAGE' or 'FLAT'
    "discountValue" numeric(12,2) NOT NULL DEFAULT 0,
    "maxUses" integer NULL,
    "currentUses" integer NOT NULL DEFAULT 0,
    "validFrom" timestamptz NULL,
    "validUntil" timestamptz NULL,
    "isActive" boolean NOT NULL DEFAULT true,
    CONSTRAINT promotions_pkey PRIMARY KEY ("promotionId"),
    CONSTRAINT promotions_eventId_fkey FOREIGN KEY ("eventId") REFERENCES public.events ("eventId") ON DELETE CASCADE,
    CONSTRAINT promotions_eventId_code_key UNIQUE ("eventId", code)
);

CREATE INDEX IF NOT EXISTS idx_promotions_event ON public.promotions ("eventId");
CREATE INDEX IF NOT EXISTS idx_promotions_code ON public.promotions (code);

-- 2. Add promotion support to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS "promotionId" uuid NULL,
ADD COLUMN IF NOT EXISTS "discountAmount" numeric(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS "promoCode" varchar NULL;

-- 3. Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'orders_promotionid_fkey'
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_promotionid_fkey
      FOREIGN KEY ("promotionId") REFERENCES public.promotions ("promotionId") ON DELETE SET NULL;
  END IF;
END $$;
