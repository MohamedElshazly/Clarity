-- Migration: Add distortion_slugs column to thought_records
-- This allows storing multiple cognitive distortions instead of just one

-- Add the distortion_slugs column as a text array
ALTER TABLE public.thought_records
ADD COLUMN IF NOT EXISTS distortion_slugs text[] NOT NULL DEFAULT '{}';

-- Migrate existing single distortion_slug to the array (if any exist)
UPDATE public.thought_records
SET distortion_slugs = ARRAY[distortion_slug]
WHERE distortion_slug IS NOT NULL AND distortion_slugs = '{}';
