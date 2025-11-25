# Quick Setup Guide - FinancePro Contact Form

## 🚀 Quick Start (5 minutes)

### Step 1: Run the SQL Script

1. **Open Supabase Dashboard**
   - Go to: https://rzudotbbfoklxcebghan.supabase.co
   - Sign in to your account

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Setup Script**
   - Open the `supabase-setup.sql` file from this project
   - Copy ALL the contents
   - Paste into the Supabase SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

4. **Verify Success**
   - You should see "Success. No rows returned" (this is normal)
   - Scroll down to see verification query results
   - You should see the `contact_submissions` table listed

### Step 2: Verify Storage Bucket

1. **Check Storage**
   - Click "Storage" in the left sidebar
   - You should see a bucket named `contact-attachments`

2. **If the bucket wasn't created automatically:**
   - Click "Create a new bucket"
   - Name: `contact-attachments`
   - Public: **Unchecked** (keep it private)
   - File size limit: `10485760` (10MB)
   - Click "Create bucket"

### Step 3: Test the Application

1. **Open the Application**
   - Run your FinancePro form application
   - Fill out the form with test data
   - Upload a test file
   - Click "Confirmer et envoyer"

2. **Verify in Supabase**
   - **Check Table**: Go to "Table Editor" → `contact_submissions`
     - You should see your test submission
   - **Check Storage**: Go to "Storage" → `contact-attachments`
     - You should see your uploaded file

## ✅ Checklist

- [ ] Supabase SQL script executed successfully
- [ ] `contact_submissions` table created
- [ ] RLS policies created (3 policies)
- [ ] Indexes created (2 indexes)
- [ ] Storage bucket `contact-attachments` exists
- [ ] Storage policies created (3 policies)
- [ ] Test form submission successful
- [ ] Test file upload successful

## 🔍 Verification Commands

### Check if table exists:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'contact_submissions';
```

### Check if policies exist:
```sql
SELECT policyname FROM pg_policies 
WHERE tablename = 'contact_submissions';
```

### Check if storage bucket exists:
```sql
SELECT id, name FROM storage.buckets 
WHERE id = 'contact-attachments';
```

### View recent submissions:
```sql
SELECT * FROM contact_submissions 
ORDER BY created_at DESC 
LIMIT 5;
```

## 🐛 Troubleshooting

### "Permission denied for table contact_submissions"
**Solution**: Re-run the RLS policies section of the SQL script (STEP 4)

### "Storage bucket not found"
**Solution**: Create the bucket manually via the UI (see Step 2 above)

### "Row level security policy violation"
**Solution**: Make sure RLS is enabled and the public insert policy exists:
```sql
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON contact_submissions
  FOR INSERT TO public WITH CHECK (true);
```

### Files not uploading
**Solutions**:
1. Check file size is under 10MB
2. Verify storage bucket exists
3. Re-run storage policies (STEP 6 of SQL script)

## 📊 Viewing Submissions

### In Supabase Dashboard:
1. Go to **Table Editor**
2. Select `contact_submissions`
3. View, filter, and export data

### Via SQL:
```sql
-- All submissions
SELECT 
  name,
  email,
  country_code || ' ' || phone as phone,
  interests,
  created_at
FROM contact_submissions
ORDER BY created_at DESC;

-- By interest type
SELECT * FROM contact_submissions
WHERE 'Consulting' = ANY(interests);

-- With message
SELECT * FROM contact_submissions
WHERE message IS NOT NULL AND message != '';
```

## 🔐 Security Notes

✅ **What's Safe**:
- Anon key exposed in frontend (protected by RLS)
- Public users can only INSERT submissions
- Public users can only UPLOAD files

✅ **What's Protected**:
- Only authenticated users can READ submissions
- Only authenticated users can READ/delete files
- Service role has full admin access

## 📧 Next Steps (Optional)

1. **Set up email notifications** when new submissions arrive
2. **Create an admin dashboard** to manage submissions
3. **Export data** regularly for backup
4. **Monitor usage** via Supabase logs
5. **Configure webhooks** to send data to external services (Zapier, Make.com, etc.)
   - See [WEBHOOK_QUICK_START.md](./WEBHOOK_QUICK_START.md) for setup guides
   - See [WEBHOOK_TESTING.md](./WEBHOOK_TESTING.md) to test with free tools

## 📞 Support

If you encounter issues:
1. Check the detailed `SUPABASE_SETUP.md` guide
2. Review Supabase logs: Dashboard → API → Logs
3. Verify RLS policies are active
4. Test with a simple submission first

---

**Setup Time**: ~5 minutes  
**Difficulty**: Easy  
**Status**: ✅ Ready to use after completing steps above
