# ✅ SETUP CHECKLIST - FinancePro Contact Form

Use this checklist to track your setup progress.

---

## 🎯 Essential Setup (Required - 2 minutes)

### Database Table Setup

- [ ] **Step 1:** Open Supabase Dashboard  
  → Go to https://rzudotbbfoklxcebghan.supabase.co

- [ ] **Step 2:** Open SQL Editor  
  → Click "SQL Editor" in sidebar → "New Query"

- [ ] **Step 3:** Copy SQL Script  
  → Open `DATABASE_QUICK_SETUP.md` or use the red alert button

- [ ] **Step 4:** Run SQL Script  
  → Paste in SQL Editor → Click "Run"

- [ ] **Step 5:** Verify Table Created  
  → Click "Table Editor" → See `contact_submissions` table

- [ ] **Step 6:** Verify Storage Created  
  → Click "Storage" → See `contact-attachments` bucket

- [ ] **Step 7:** Test Form Submission  
  → Submit a test form → Check for success message

- [ ] **Step 8:** Verify Data Saved  
  → Table Editor → `contact_submissions` → See your test submission

---

## 🔔 Optional Setup (Recommended)

### Email Notifications

- [ ] Click "Notifications" button in the form
- [ ] Go to "Emails" tab
- [ ] Add your email address
- [ ] Enable notifications
- [ ] Test by submitting the form
- [ ] Check your email client opens with form data

See `EMAIL_NOTIFICATIONS.md` for details.

### Webhook Integration

- [ ] Click "Notifications" button in the form
- [ ] Go to "Webhooks" tab  
- [ ] Add your webhook URL (Slack, Discord, Make.com, Zapier, etc.)
- [ ] Name your webhook
- [ ] Enable it
- [ ] Test by submitting the form
- [ ] Verify webhook received the data

See `WEBHOOK_GUIDE.md` for details.

---

## ✅ Verification Steps

### Form Works Correctly

- [ ] No red error alert showing
- [ ] All form fields work
- [ ] Country code selector works
- [ ] Phone validation works
- [ ] File upload works (up to 5 files, max 10MB each)
- [ ] Progress bar updates correctly
- [ ] Navigation between steps works
- [ ] Back button works
- [ ] Summary page shows all data correctly
- [ ] "Confirmer et envoyer" submits successfully
- [ ] Success screen appears with checkmark animation

### Data is Saved in Supabase

- [ ] Form submission appears in `contact_submissions` table
- [ ] Name, email, and phone saved correctly
- [ ] Interests array saved correctly
- [ ] Services/modules arrays saved correctly
- [ ] Message text saved correctly
- [ ] Timestamp (created_at) is correct
- [ ] Uploaded files appear in `contact-attachments` bucket
- [ ] Files are organized by submission ID

### Notifications Work (If Enabled)

- [ ] Email client opens with pre-filled message (if email notifications enabled)
- [ ] Email contains all form data
- [ ] Webhook receives POST request (if webhooks enabled)
- [ ] Webhook payload contains correct data
- [ ] Webhook logs show in "Historique" tab

---

## 🎨 Customization Checklist (Optional)

- [ ] Update logo (in `src/components/FinanceProLogo.tsx`)
- [ ] Change colors (in `src/index.css`)
- [ ] Modify form fields (in `src/App.tsx`)
- [ ] Update contact information (in `src/components/Footer.tsx`)
- [ ] Customize email template (in `src/lib/email-notifications.ts`)
- [ ] Add/remove services and modules options
- [ ] Change form steps or add new ones
- [ ] Modify validation rules
- [ ] Update success message

---

## 📊 Monitoring Checklist

- [ ] Check submissions daily/weekly in Supabase Table Editor
- [ ] Export to CSV periodically for backup
- [ ] Review uploaded files in Storage
- [ ] Monitor email notification logs
- [ ] Check webhook logs for failures
- [ ] Review Supabase API logs for errors
- [ ] Set up Supabase alerts for quota warnings

---

## 🆘 Troubleshooting Checklist

If something doesn't work, check:

- [ ] Supabase dashboard URL is correct: https://rzudotbbfoklxcebghan.supabase.co
- [ ] SQL script ran successfully without errors
- [ ] `contact_submissions` table exists in Table Editor
- [ ] `contact-attachments` bucket exists in Storage
- [ ] RLS policies are enabled (shown in table settings)
- [ ] Storage policies are enabled (shown in bucket settings)
- [ ] Browser cache cleared (hard refresh: Ctrl+Shift+R)
- [ ] API key is correct in `src/lib/supabase.ts`
- [ ] Internet connection is stable
- [ ] No browser console errors (F12 → Console tab)

---

## 📝 Current Status

**Date:** _________________

**Database Setup:** ☐ Not Started | ☐ In Progress | ☐ Complete

**Email Notifications:** ☐ Not Configured | ☐ Configured | ☐ Tested & Working

**Webhook Integration:** ☐ Not Configured | ☐ Configured | ☐ Tested & Working

**Form Status:** ☐ Not Working | ☐ Partially Working | ☐ Fully Working

**Total Test Submissions:** _________________

**Issues Encountered:** 

_________________________________________________________________

_________________________________________________________________

**Notes:**

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

---

## 🎉 Setup Complete!

Once all essential items are checked:

✅ Your form is fully functional  
✅ Submissions are saved securely  
✅ Files are uploaded to cloud storage  
✅ You can view all data in Supabase  
✅ (Optional) Notifications are working  

**Next:** Share your form URL with clients and start collecting submissions!

---

**Quick Links:**

- 📖 Detailed Setup: `SUPABASE_SETUP.md`
- ⚡ Quick Setup: `DATABASE_QUICK_SETUP.md`
- 📧 Email Guide: `EMAIL_NOTIFICATIONS.md`
- 🪝 Webhook Guide: `WEBHOOK_GUIDE.md`
- 🆘 Start Here: `START_HERE.md`
