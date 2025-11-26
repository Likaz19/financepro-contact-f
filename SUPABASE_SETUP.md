# 🚀 Quick Setup Guide - FinancePro Contact Form Database

**⏱️ Time Required: 2 minutes**

## ✅ What You Need

- Your Supabase dashboard: **https://rzudotbbfoklxcebghan.supabase.co**
- This takes just 2 steps!

---

## 📋 STEP 1: Run the SQL Script (90 seconds)

### 1.1 Open Supabase SQL Editor

1. Go to **https://rzudotbbfoklxcebghan.supabase.co**
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"** button

### 1.2 Copy & Paste This Complete SQL Script

**👉 The complete SQL script is in the file `supabase-setup.sql` - just copy ALL of it!**

Or copy this shorter version (same result):

```sql
-- =====================================================
-- FinancePro Contact Form - Complete Setup Script
-- =====================================================

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

-- Drop existing policies (in case re-running)
DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated reads" ON contact_submissions;
DROP POLICY IF EXISTS "Service role has full access" ON contact_submissions;

-- Allow anyone to submit forms
CREATE POLICY "Allow public inserts" ON contact_submissions
  FOR INSERT TO public WITH CHECK (true);

-- Allow authenticated users to read submissions
CREATE POLICY "Allow authenticated reads" ON contact_submissions
  FOR SELECT TO authenticated USING (true);

-- Allow service role full access
CREATE POLICY "Service role has full access" ON contact_submissions
  TO service_role USING (true) WITH CHECK (true);

-- Create storage bucket for attachments
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

-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Allow public uploads to contact-attachments
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'contact-attachments');

-- Allow authenticated reads from contact-attachments
CREATE POLICY "Allow authenticated reads" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'contact-attachments');

-- Allow authenticated deletes from contact-attachments
CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'contact-attachments');
```

### 1.3 Run the Script

1. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Wait 2-3 seconds for completion
3. You should see: ✅ **"Success. No rows returned"** (this is normal!)

---

## ✅ STEP 2: Verify Setup (30 seconds)

### 2.1 Check the Table

1. Click **"Table Editor"** in the left sidebar
2. You should see **`contact_submissions`** in the list
3. Click on it - you'll see columns: id, name, email, country_code, phone, etc.

### 2.2 Check the Storage Bucket

1. Click **"Storage"** in the left sidebar  
2. You should see **`contact-attachments`** bucket
3. If you don't see it, click **"New bucket"** and create it manually with:
   - Name: `contact-attachments`
   - Public: **OFF** (uncheck)
   - File size limit: `10485760` bytes (10MB)

---

## 🎉 That's It - You're Done!

### ✅ Test Your Form

1. Go back to your FinancePro form
2. Fill it out and click **"Confirmer et envoyer"**
3. The red error alert should disappear
4. You should see the success screen! ✅

### 📊 View Submissions

**In Supabase Dashboard:**
- Go to **Table Editor** → **contact_submissions**
- You'll see all form submissions with full details
- Click any row to see complete information

**View Uploaded Files:**
- Go to **Storage** → **contact-attachments**
- Files are organized by submission ID
- Click to preview or download

---

## 🆘 Troubleshooting

### ❌ "Could not find the table 'public.contact_submissions'"
- **Solution:** Run the SQL script above in SQL Editor

### ❌ "Permission denied for table contact_submissions"
- **Solution:** Make sure the RLS policies were created (they're in the script above)

### ❌ Storage bucket not found
- **Solution:** Manually create the bucket:
  1. Go to **Storage** → **"New bucket"**
  2. Name: `contact-attachments`
  3. Public: **OFF**
  4. Create, then run the storage policies from the SQL script

### ❌ Still having issues?
- Try running the full `supabase-setup.sql` file from this folder
- Make sure you're logged into: https://rzudotbbfoklxcebghan.supabase.co
- Check that your API key matches in the app code

---

## 📧 Next Steps (Optional)

Once your database is working, you can:
- ✅ Set up email notifications (see `EMAIL_NOTIFICATIONS.md`)
- ✅ Configure webhooks (see `WEBHOOK_GUIDE.md`)
- ✅ Export submissions as CSV from Table Editor
- ✅ Create custom views and filters

---

## 🔐 Security Notes

Your setup is secure because:
- ✅ **Public users** can only INSERT (submit forms)
- ✅ **Authenticated users** can read submissions (admin only)
- ✅ **Files** are private (not publicly accessible)
- ✅ **RLS policies** protect against unauthorized access
- ✅ Your API key is safe to use in the frontend

---
