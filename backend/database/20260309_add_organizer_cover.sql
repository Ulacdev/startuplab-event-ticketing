-- Add coverImageUrl to organizers table
ALTER TABLE public.organizers ADD COLUMN IF NOT EXISTS "coverImageUrl" text null;
