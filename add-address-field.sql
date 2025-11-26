-- =====================================================
-- Migration Script: Add Address Field
-- =====================================================
-- This script adds the 'address' column to existing
-- contact_submissions tables.
-- Run this ONLY if your table already exists without
-- the address field.
-- =====================================================

-- Add the address column if it doesn't exist
ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Optional: Add a comment to document the column
COMMENT ON COLUMN contact_submissions.address IS 'Physical address (city, country) of the contact';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contact_submissions'
ORDER BY ordinal_position;
