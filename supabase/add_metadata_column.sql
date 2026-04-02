-- Migration: Add metadata column to thought_records
-- This stores draft session state (currentStep) for resume functionality

-- Add the metadata column as jsonb (nullable)
ALTER TABLE public.thought_records
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT NULL;

-- Add a comment to document the column's purpose
COMMENT ON COLUMN public.thought_records.metadata IS 'Draft session metadata, e.g. { "currentStep": 3 }. Cleared on final submit.';
