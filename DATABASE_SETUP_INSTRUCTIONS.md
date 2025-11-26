# 🚀 Quick Database Setup for FinancePro Contact Form

## ⚠️ Action Required: Create the Database Table

Your contact form needs a database table to store submissions. Follow these simple steps:

---

## Step-by-Step Instructions

### 1️⃣ Open Supabase Dashboard

Go to: **https://rzudotbbfoklxcebghan.supabase.co**

Login with your Supabase account.

---

### 2️⃣ Open SQL Editor

1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button

---

### 3️⃣ Copy and Paste the SQL Script

Copy **ALL** the code from the file `supabase-setup.sql` in this project, or copy this simplified version:

```sql
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at 
  ON contact_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email 
  ON contact_submissions(email);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit forms (INSERT)
CREATE POLICY "Allow public inserts" ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to view submissions (SELECT)
CREATE POLICY "Allow authenticated reads" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);
```

---

### 4️⃣ Run the Script

1. Paste the SQL code into the SQL Editor
2. Click **"Run"** or press `Ctrl/Cmd + Enter`
3. You should see a success message

---

### 5️⃣ Verify the Table Was Created

1. Click on **"Table Editor"** in the left sidebar
2. Look for the table named **`contact_submissions`**
3. You should see columns: `id`, `name`, `email`, `country_code`, `phone`, `interests`, `services`, `modules`, `message`, `created_at`

---

### 6️⃣ (Optional) Create Storage Bucket for File Attachments

If you want users to be able to attach files:

1. Click on **"Storage"** in the left sidebar
2. Click **"Create a new bucket"**
3. Settings:
   - **Name**: `contact-attachments`
   - **Public bucket**: ❌ Uncheck (keep private)
   - **File size limit**: `10485760` (10MB)
4. Click **"Create bucket"**

Then add storage policies by running this SQL:

```sql
-- Allow public uploads to contact-attachments bucket
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'contact-attachments');

-- Allow authenticated users to read files
CREATE POLICY "Allow authenticated reads" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'contact-attachments');
```

---

## ✅ You're Done!

Your contact form is now ready to accept submissions!

### Test It:

1. Open your FinancePro contact form
2. Fill out the form and submit
3. Go to **Table Editor** → **contact_submissions** in Supabase
4. You should see your test submission appear

---

## 📊 View Submissions Later

To see all contact form submissions:

1. Open Supabase Dashboard
2. Go to **"Table Editor"**
3. Click on **`contact_submissions`**
4. View, filter, sort, and export your data

You can also export to CSV for use in Excel or Google Sheets!

---

## 🆘 Troubleshooting

**Error: "Could not find the table 'public.contact_submissions'"**
- The table hasn't been created yet. Follow steps 1-4 above.

**Error: "Permission denied"**
- Make sure you ran the RLS policies (steps in the SQL script)

**Files not uploading?**
- Make sure you completed Step 6 (Storage Bucket setup)

---

## Need Help?

Check the detailed guide in `SUPABASE_SETUP.md` for more information.
