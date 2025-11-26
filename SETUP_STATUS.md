# ✅ FinancePro Contact Form - Setup Checklist

Use this checklist to make sure everything is configured correctly.

---

## 🔴 **CRITICAL - MUST DO FIRST**

### [ ] 1. Create Database Table in Supabase

**Status:** ❌ NOT DONE (You're seeing this error because of this)

**What to do:**
1. Open https://rzudotbbfoklxcebghan.supabase.co
2. Go to SQL Editor → New Query
3. Copy/paste the content of `supabase-setup.sql`
4. Click Run
5. Verify the table appears in Table Editor

**Time needed:** 2-3 minutes

**Full instructions:** See `DATABASE_SETUP_INSTRUCTIONS.md`

---

## 🟡 **OPTIONAL - Recommended**

### [ ] 2. Create Storage Bucket for File Uploads

**What to do:**
1. In Supabase dashboard, go to Storage
2. Create new bucket named `contact-attachments`
3. Set it to Private
4. Set file size limit to 10MB
5. Run the storage policies SQL (in `supabase-setup.sql`)

**Time needed:** 2 minutes

### [ ] 3. Test the Form

**What to do:**
1. Fill out and submit a test form
2. Check Supabase Table Editor for the submission
3. If you added storage, try uploading a file

**Time needed:** 2 minutes

### [ ] 4. Set Up Email Notifications (Optional)

**What to do:**
1. Click "Notifications" button in the form
2. Go to "Emails" tab
3. Add your email address
4. Click "Test" to verify it works

**Documentation:** `EMAIL_QUICK_START.md`

### [ ] 5. Set Up Webhooks (Optional)

**What to do:**
1. Click "Notifications" button in the form
2. Go to "Webhooks" tab
3. Add your webhook URL
4. Test and enable

**Documentation:** `WEBHOOK_QUICK_START.md`

---

## 📊 Verification

Once you've completed step 1 (Database Table), verify:

- ✅ Form submits without errors
- ✅ Data appears in Supabase Table Editor
- ✅ Success screen shows after submission
- ✅ (If storage configured) Files upload successfully

---

## 🆘 Troubleshooting

**"Could not find the table 'public.contact_submissions'"**
→ You haven't completed Step 1. Run the SQL script in Supabase.

**"Permission denied for table contact_submissions"**
→ The RLS policies weren't created. Re-run the complete SQL script.

**"Storage bucket not found"**
→ Complete Step 2 to create the storage bucket.

**Files uploading but not visible**
→ Check the storage policies were created correctly.

---

## 📞 Support

If you're stuck:
1. Check `DATABASE_SETUP_INSTRUCTIONS.md` for detailed steps
2. Check `SUPABASE_SETUP.md` for comprehensive guide
3. Check the Supabase dashboard logs for specific errors

---

**Last Updated:** Check README.md for current status
