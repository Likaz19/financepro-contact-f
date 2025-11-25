# Supabase Setup Guide for FinancePro Contact Form

This guide will help you set up the required Supabase database table and storage bucket for the contact form.

## Prerequisites

- Supabase project created at: https://rzudotbbfoklxcebghan.supabase.co
- Access to the Supabase dashboard
- API key already configured in the application

## Step 1: Create Database Table

1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the following SQL:

```sql
-- Create the contact_submissions table
CREATE TABLE contact_submissions (
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

-- Create an index on created_at for faster sorting
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Create an index on email for searching
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

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

-- Optional: Policy to allow service role to do everything (for admin operations)
CREATE POLICY "Service role has full access" ON contact_submissions
  TO service_role
  USING (true)
  WITH CHECK (true);
```

5. Click "Run" to execute the SQL
6. Verify the table was created by going to "Table Editor" and finding `contact_submissions`

## Step 2: Create Storage Bucket

1. Go to "Storage" in the left sidebar
2. Click "Create a new bucket"
3. Configure the bucket:
   - **Name**: `contact-attachments`
   - **Public bucket**: Uncheck (files should be private)
   - **File size limit**: `10485760` (10MB in bytes)
   - **Allowed MIME types**: Leave empty or specify:
     ```
     application/pdf,
     application/msword,
     application/vnd.openxmlformats-officedocument.wordprocessingml.document,
     image/jpeg,
     image/png,
     image/gif,
     text/plain,
     application/vnd.ms-excel,
     application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
     ```
4. Click "Create bucket"

## Step 3: Configure Storage Policies

1. In the Storage section, click on the `contact-attachments` bucket
2. Click on "Policies" tab
3. Click "New Policy"
4. Choose "Create a policy from scratch"
5. Add the following policies:

**Policy 1: Allow Public Uploads**
```sql
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'contact-attachments');
```

**Policy 2: Allow Authenticated Reads**
```sql
CREATE POLICY "Allow authenticated reads" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'contact-attachments');
```

**Policy 3: Allow Authenticated Deletes (Optional - for admin file management)**
```sql
CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'contact-attachments');
```

## Step 4: Test the Integration

1. Open your FinancePro form application
2. Fill out the form with test data
3. Attach a test file (optional)
4. Click "Confirmer et envoyer"
5. Verify in Supabase:
   - Go to "Table Editor" → `contact_submissions` → You should see your test submission
   - Go to "Storage" → `contact-attachments` → You should see your uploaded file(s)

## Viewing Submissions

### In Supabase Dashboard

**View all submissions:**
1. Go to "Table Editor"
2. Select `contact_submissions`
3. View, filter, and sort submissions
4. Export to CSV if needed

**View uploaded files:**
1. Go to "Storage"
2. Select `contact-attachments` bucket
3. Browse folders by submission ID
4. Download files as needed

### Creating an Admin Query

You can create custom queries in the SQL Editor:

```sql
-- View recent submissions
SELECT 
  id,
  name,
  email,
  phone,
  interests,
  services,
  modules,
  message,
  created_at
FROM contact_submissions
ORDER BY created_at DESC
LIMIT 50;

-- View submissions by interest
SELECT * FROM contact_submissions
WHERE 'Consulting' = ANY(interests)
ORDER BY created_at DESC;

-- View submissions with phone numbers
SELECT * FROM contact_submissions
WHERE phone IS NOT NULL AND phone != ''
ORDER BY created_at DESC;
```

## Email Notifications (Optional)

To receive email notifications when new submissions arrive:

### Option 1: Database Webhooks

1. Go to "Database" → "Webhooks"
2. Create a new webhook on `contact_submissions` table
3. Trigger on INSERT events
4. Point to your email notification service endpoint

### Option 2: Edge Functions

Create a Supabase Edge Function that listens for new rows and sends emails:

```typescript
// supabase/functions/notify-new-submission/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { record } = await req.json()
  
  // Send email using your preferred email service
  // (SendGrid, Mailgun, Resend, etc.)
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

## Security Considerations

### Row Level Security (RLS)

The table is protected with RLS policies:
- **Public users** can INSERT new submissions (form submissions)
- **Authenticated users** can SELECT/read submissions (admin access)
- **Service role** has full access (backend operations)

### Storage Security

Files are stored in a private bucket:
- **Public users** can UPLOAD files (when submitting form)
- **Authenticated users** can READ/download files (admin access)
- Files are organized by submission ID for easy management

### API Key Security

The anon key is safe to expose in the frontend because:
- RLS policies restrict what public users can do
- Only INSERT operations are allowed on submissions
- Only UPLOAD operations are allowed on storage
- No sensitive data can be read without authentication

## Troubleshooting

### "Permission denied for table contact_submissions"
- Ensure RLS policies are created correctly
- Verify the policies are enabled
- Check that you're using the anon key, not the service role key

### "Storage bucket not found"
- Verify the bucket name is exactly `contact-attachments`
- Ensure the bucket was created successfully
- Check that storage policies are set up

### "Row level security policy violation"
- The public insert policy must be created
- Run the policy SQL again if needed
- Check that RLS is enabled on the table

### Files not uploading
- Verify file size is under 10MB
- Check that the storage bucket exists
- Ensure storage policies allow public uploads
- Verify the MIME type is allowed

## Monitoring

### View Activity

1. Go to "API" → "Logs" to see all API requests
2. Filter by table name or operation type
3. Monitor for errors or unusual activity

### Set Up Alerts

1. Go to "Project Settings" → "Integrations"
2. Set up alerts for:
   - High error rates
   - Storage quota warnings
   - Database performance issues

## Data Export

To export all submissions:

```sql
-- Export as CSV
COPY (
  SELECT * FROM contact_submissions
  ORDER BY created_at DESC
) TO STDOUT WITH CSV HEADER;
```

Or use the Supabase dashboard:
1. Go to "Table Editor"
2. Select `contact_submissions`
3. Click the export button
4. Choose CSV or JSON format

## Next Steps

1. Set up email notifications for new submissions
2. Create an admin dashboard to manage submissions
3. Configure automated backups
4. Set up monitoring and alerts
5. Add analytics to track form completion rates
