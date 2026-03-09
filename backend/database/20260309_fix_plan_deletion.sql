-- Migration: Allow deleting plans by cascading to subscription history
-- This solves the 'violates foreign key constraint' error when deleting a plan.

-- 1. Drop the existing restricted constraint
ALTER TABLE IF EXISTS public.organizersubscriptions
DROP CONSTRAINT IF EXISTS organizersubscriptions_planId_fkey;

-- 2. Re-add the constraint with CASCADE
-- This allows deleting a plan even if it has subscription records (it will delete the records too)
ALTER TABLE public.organizersubscriptions
ADD CONSTRAINT organizersubscriptions_planId_fkey
FOREIGN KEY ("planId") REFERENCES public.plans("planId") ON DELETE CASCADE;

-- 3. Also ensure the planFeatures table cascades (it should already be, but let's be sure)
ALTER TABLE IF EXISTS public."planFeatures"
DROP CONSTRAINT IF EXISTS "planFeatures_planId_fkey";

ALTER TABLE public."planFeatures"
ADD CONSTRAINT "planFeatures_planId_fkey"
FOREIGN KEY ("planId") REFERENCES public.plans("planId") ON DELETE CASCADE;
