-- Add promotions JSONB column to plans table
ALTER TABLE public.plans
ADD COLUMN
IF
  NOT EXISTS "promotions" jsonb NOT NULL DEFAULT '{"max_promoted_events": 0, "promotion_duration_days": 7}';

  -- Set existing plans to have at least the default promotion values
  UPDATE
    public.plans
  SET "promotions" = '{"max_promoted_events": 0, "promotion_duration_days": 7}'
  WHERE
    "promotions" IS NULL;

  COMMENT ON COLUMN public.plans."promotions" IS 'Promotion configuration for the plan: max_promoted_events (how many events can be promoted), promotion_duration_days (how long each promotion lasts)';