-- Migration: Add onboarding status to organizers
-- This allows us to track if a user has completed their initial setup.

ALTER TABLE public.organizers
ADD COLUMN IF NOT EXISTS "isOnboarded" boolean NOT NULL DEFAULT false;

-- Add index for status checks
CREATE INDEX IF NOT EXISTS idx_organizers_onboarding ON public.organizers ("isOnboarded");
