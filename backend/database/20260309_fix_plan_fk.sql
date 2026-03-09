-- Fix: Add missing foreign key between organizers.currentPlanId and plans.planId
-- This resolves the PGRST200 error: "Could not find a relationship between 'organizers' and 'plans'"

-- 1. Ensure the currentPlanId column exists
ALTER TABLE public.organizers
  ADD COLUMN IF NOT EXISTS "currentPlanId" uuid NULL;

ALTER TABLE public.organizers
  ADD COLUMN IF NOT EXISTS "subscriptionStatus" varchar NULL DEFAULT 'free';

ALTER TABLE public.organizers
  ADD COLUMN IF NOT EXISTS "planExpiresAt" timestamptz NULL;

-- 2. Add the foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'organizers_currentplanid_fkey'
  ) THEN
    ALTER TABLE public.organizers
      ADD CONSTRAINT organizers_currentplanid_fkey
      FOREIGN KEY ("currentPlanId") REFERENCES public.plans("planId") ON DELETE SET NULL;
  END IF;
END $$;

-- 3. Reload the PostgREST schema cache so the join works immediately
NOTIFY pgrst, 'reload schema';
