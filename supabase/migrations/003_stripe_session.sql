-- Add Stripe session ID to link webhook-created reports back to payments
ALTER TABLE scan_results
  ADD COLUMN IF NOT EXISTS stripe_session_id text;

-- Index for fast polling on the success page
CREATE INDEX IF NOT EXISTS scan_results_stripe_session_idx
  ON scan_results (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;
