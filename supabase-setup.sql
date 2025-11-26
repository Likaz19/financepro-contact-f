-- =====================================================
-- FinancePro Contact Form - Supabase Setup Script
-- =====================================================
-- Run this script in your Supabase SQL Editor
-- Dashboard: https://rzudotbbfoklxcebghan.supabase.co
-- =====================================================

-- =====================================================
-- STEP 1: Create the contact_submissions table
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country_code TEXT,
  phone TEXT,
  address TEXT,
  interests TEXT[] NOT NULL,
  services TEXT[] DEFAULT '{}',
  modules TEXT[] DEFAULT '{}',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 2: Create indexes for better performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at 
  ON contact_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email 
  ON contact_submissions(email);

-- =====================================================
-- STEP 3: Enable Row Level Security (RLS)
-- =====================================================

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 4: Create RLS Policies
-- =====================================================

-- Drop existing policies if they exist (for re-running the script)
DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated reads" ON contact_submissions;
DROP POLICY IF EXISTS "Service role has full access" ON contact_submissions;

-- Policy to allow inserts from anyone (for form submissions)
CREATE POLICY "Allow public inserts" ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy to allow only authenticated users to read (for admin viewing)
CREATE POLICY "Allow authenticated reads" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy to allow service role to do everything (for admin operations)
CREATE POLICY "Service role has full access" ON contact_submissions
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- STEP 5: Create Storage Bucket (run this separately if needed)
-- =====================================================
-- Note: Storage buckets are usually created via the UI or REST API
-- If you need to create it via SQL, you can use:

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'contact-attachments',
  'contact-attachments',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STEP 6: Create Storage Policies
-- =====================================================

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Policy to allow public uploads to contact-attachments bucket
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'contact-attachments');

-- Policy to allow authenticated users to read files
CREATE POLICY "Allow authenticated reads" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'contact-attachments');

-- Policy to allow authenticated users to delete files (for admin)
CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'contact-attachments');

-- =====================================================
-- STEP 7: Verification Queries
-- =====================================================

-- Verify table was created
SELECT 
  table_name, 
  table_type
FROM information_schema.tables 
WHERE table_name = 'contact_submissions';

-- Verify indexes were created
SELECT 
  indexname, 
  indexdef
FROM pg_indexes 
WHERE tablename = 'contact_submissions';

-- Verify RLS is enabled
SELECT 
  tablename, 
  rowsecurity
FROM pg_tables 
WHERE tablename = 'contact_submissions';

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'contact_submissions';

-- =====================================================
-- STEP 8: Sample Queries for Testing
-- =====================================================

-- View all submissions (run after testing the form)
-- SELECT 
--   id,
--   name,
--   email,
--   country_code || ' ' || phone as full_phone,
--   interests,
--   services,
--   modules,
--   message,
--   created_at
-- FROM contact_submissions
-- ORDER BY created_at DESC
-- LIMIT 10;

-- Count submissions by interest
-- SELECT 
--   unnest(interests) as interest,
--   COUNT(*) as count
-- FROM contact_submissions
-- GROUP BY interest
-- ORDER BY count DESC;

-- Find submissions with attachments (after implementing file uploads)
-- SELECT 
--   cs.id,
--   cs.name,
--   cs.email,
--   COUNT(so.id) as file_count
-- FROM contact_submissions cs
-- LEFT JOIN storage.objects so ON so.name LIKE cs.id::text || '/%'
-- GROUP BY cs.id, cs.name, cs.email
-- HAVING COUNT(so.id) > 0
-- ORDER BY cs.created_at DESC;

-- =====================================================
-- Setup Complete!
-- =====================================================
-- Next steps:
-- 1. Test the form by submitting a contact request
-- 2. Verify data appears in the contact_submissions table
-- 3. Test file uploads and verify they appear in storage
-- 4. Set up email notifications (optional)
-- =====================================================
