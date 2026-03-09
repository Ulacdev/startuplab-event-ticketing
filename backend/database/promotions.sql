-- Promotions and Discount Codes System
-- This table stores discount codes that can be applied to orders.

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
