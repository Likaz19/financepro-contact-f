# 🚀 2-MINUTE DATABASE SETUP

## Step 1: Copy This SQL Script

Go to **https://rzudotbbfoklxcebghan.supabase.co** → Click **"SQL Editor"** → Click **"New Query"**

Then copy and paste this ENTIRE script:

```sql
-- FinancePro Contact Form - Complete Database Setup
-- This creates everything you need in one go!

-- Create the contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country_code TEXT,
  phone TEXT,
  interests TEXT[] NOT NULL,
  services TEXT[] DEFAULT '{}',
  modules TEXT[] DEFAULT '{}',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe to run multiple times)
DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated reads" ON contact_submissions;
DROP POLICY IF EXISTS "Service role has full access" ON contact_submissions;

-- Allow anyone to submit forms (public inserts)
CREATE POLICY "Allow public inserts" ON contact_submissions
  FOR INSERT TO public WITH CHECK (true);

-- Allow authenticated users to read submissions (admin access)
CREATE POLICY "Allow authenticated reads" ON contact_submissions
  FOR SELECT TO authenticated USING (true);

-- Allow service role full access (backend operations)
CREATE POLICY "Service role has full access" ON contact_submissions
  TO service_role USING (true) WITH CHECK (true);

-- Create storage bucket for file attachments
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
) ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies (safe to run multiple times)
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Allow public to upload files when submitting forms
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'contact-attachments');

-- Allow authenticated users to read/download files (admin)
CREATE POLICY "Allow authenticated reads" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'contact-attachments');

-- Allow authenticated users to delete files (admin)
CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'contact-attachments');
```

## Step 2: Click "Run"

Press the **"Run"** button or hit `Ctrl+Enter` / `Cmd+Enter`

✅ You should see: **"Success. No rows returned"** - this is correct!

## Step 3: Verify

1. Click **"Table Editor"** → You should see `contact_submissions`
2. Click **"Storage"** → You should see `contact-attachments` bucket

## Step 4: Test Your Form!

Go back to your FinancePro form and submit a test. The error should be gone! 🎉

---

## 🆘 Troubleshooting

**Problem: Storage bucket not appearing**
- Go to Storage → New bucket
- Name: `contact-attachments`
- Public: OFF
- File size limit: `10485760`
- Click Create

**Problem: Still getting errors**
- Make sure you're at: https://rzudotbbfoklxcebghan.supabase.co
- Try running the script again (it's safe to run multiple times)
- Check that you clicked "Run" after pasting

---

## 📊 View Your Submissions

**Table Editor** → `contact_submissions` = All form data  
**Storage** → `contact-attachments` = All uploaded files

You can export to CSV anytime from the Table Editor!
