-- Email Quota Tracking for Daily Email Usage
-- Tracks email sends per organizer per day in their timezone

CREATE TABLE
IF
  NOT EXISTS public.email_quota_tracking (
    "quotaTrackingId" uuid NOT NULL DEFAULT extensions.gen_random_uuid()
    , created_at timestamptz NOT NULL DEFAULT now()
    , updated_at timestamptz NULL DEFAULT now()
    , "organizerId" uuid NOT NULL
    , "trackingDate" date NOT NULL
    , "emailsSent" integer NOT NULL DEFAULT 0
    , "emailLimit" integer NOT NULL DEFAULT 500
    , CONSTRAINT email_quota_tracking_pkey PRIMARY KEY ("quotaTrackingId")
    , CONSTRAINT email_quota_tracking_organizer_date_key UNIQUE ("organizerId", "trackingDate")
    , CONSTRAINT email_quota_tracking_organizerId_fkey FOREIGN KEY ("organizerId") REFERENCES public.organizers ("organizerId")
    ON DELETE CASCADE
  );

  -- Index for efficient lookups
  CREATE INDEX
  IF
    NOT EXISTS idx_email_quota_tracking_organizer_date
    ON public.email_quota_tracking ("organizerId", "trackingDate");

    -- Add timezone column to organizers table with PH timezone as default
    ALTER TABLE public.organizers
    ADD COLUMN
    IF
      NOT EXISTS timezone varchar(50) NOT NULL DEFAULT 'Asia/Manila';

      -- Add email usage tracking columns to organizers table
      ALTER TABLE public.organizers
      ADD COLUMN
      IF
        NOT EXISTS "dailyEmailQuota" integer NULL DEFAULT 500
        , ADD COLUMN
        IF
          NOT EXISTS "emailsSentToday" integer NOT NULL DEFAULT 0
          , ADD COLUMN
          IF
            NOT EXISTS "lastEmailResetDate" date NULL DEFAULT CURRENT_DATE;

            -- Function to reset daily email count if date changed
            CREATE OR REPLACE FUNCTION reset_daily_email_if_needed()
            RETURNS TRIGGER AS $ $
            BEGIN
              IF
                NEW."lastEmailResetDate" < CURRENT_DATE
              THEN
                NEW."emailsSentToday" : = 0;
                NEW."lastEmailResetDate" : = CURRENT_DATE;
              END IF;
              RETURN
              NEW;
            END;
            $ $
            LANGUAGE plpgsql;

            -- Trigger to reset email counter daily
            DROP TRIGGER
            IF
              EXISTS trigger_reset_daily_email
              ON public.organizers;
              CREATE TRIGGER trigger_reset_daily_email
              BEFORE UPDATE
              ON public.organizers
              FOR EACH ROW EXECUTE FUNCTION reset_daily_email_if_needed();

              COMMENT ON TABLE public.email_quota_tracking IS 'Tracks daily email usage per organizer for billing and quota enforcement';
              COMMENT ON COLUMN public.email_quota_tracking."emailsSent" IS 'Number of emails sent on the tracking date';
              COMMENT ON COLUMN public.email_quota_tracking."emailLimit" IS 'Daily email limit from the organizers subscription plan';
              COMMENT ON COLUMN public.organizers.timezone IS 'Organizers timezone (IANA timezone string, default: Asia/Manila for Philippines)';
              COMMENT ON COLUMN public.organizers."dailyEmailQuota" IS 'Derived from current subscription plan limit';
              COMMENT ON COLUMN public.organizers."emailsSentToday" IS 'Number of emails sent in current day (in organizer timezone)';
              COMMENT ON COLUMN public.organizers."lastEmailResetDate" IS 'Last date the email counter was reset';