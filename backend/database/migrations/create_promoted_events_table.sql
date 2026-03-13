-- Create promoted_events table for tracking event promotions
CREATE TABLE promoted_events (
  promotion_id UUID PRIMARY KEY DEFAULT gen_random_uuid()
  , "eventId" UUID NOT NULL REFERENCES public.events("eventId")
  ON DELETE CASCADE
  , "organizerId" UUID NOT NULL REFERENCES public.organizers("organizerId")
  ON DELETE CASCADE
  , "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  , expires_at TIMESTAMP WITH TIME ZONE NOT NULL
  , duration_days INT DEFAULT 7
  , created_by UUID REFERENCES auth.users(id)
);

-- Create index for efficient querying
CREATE INDEX idx_promoted_events_organizer
ON promoted_events("organizerId");
CREATE INDEX idx_promoted_events_expires
ON promoted_events(expires_at);
CREATE INDEX idx_promoted_events_event
ON promoted_events("eventId");

-- Add comment
COMMENT ON TABLE promoted_events IS 'Tracks which events are promoted by organizers. Auto-expires based on plan duration.';