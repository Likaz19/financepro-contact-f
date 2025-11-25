# API Configuration Guide - Supabase Integration

This form is integrated with Supabase for data persistence and file storage. The configuration is complete and ready to use.

## Supabase Configuration

**Project URL**: `https://rzudotbbfoklxcebghan.supabase.co`  
**Anon Key**: Configured in `src/lib/supabase.ts`

The Supabase client is initialized and ready to use throughout the application.

## Database Schema Required

You need to create the following table in your Supabase database:

### Table: `contact_submissions`

```sql
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country_code TEXT,
  phone TEXT,
  interests TEXT[] NOT NULL,
  services TEXT[],
  modules TEXT[],
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
```

## Storage Bucket Required

You need to create a storage bucket for file attachments:

### Bucket: `contact-attachments`

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `contact-attachments`
3. Configure bucket settings:
   - Public: `false` (files are private)
   - File size limit: `10MB`
   - Allowed MIME types: `application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/jpeg, image/png, image/gif, text/plain, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

4. Set up storage policies:

```sql
-- Policy to allow uploads from anyone
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'contact-attachments');

-- Policy to allow authenticated users to read files
CREATE POLICY "Allow authenticated reads" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'contact-attachments');
```

## How It Works

1. **Form Submission**: When the user clicks "Confirmer et envoyer", the form data is inserted into the `contact_submissions` table
2. **File Upload**: If files are attached, they are uploaded to the `contact-attachments` bucket with a folder structure: `{submission_id}/{timestamp}_{filename}`
3. **Success**: Upon successful submission, the success screen is displayed
4. **Error Handling**: Any Supabase errors are caught and displayed to the user with helpful messages

## Data Structure

The form sends the following data to Supabase:

```typescript
{
  name: string          // Full name
  email: string         // Email address
  country_code: string  // Phone country code (e.g., "+221")
  phone: string         // Phone number without country code
  interests: string[]   // ["Consulting", "Formation"]
  services: string[]    // Selected consulting services
  modules: string[]     // Selected training modules
  message: string       // Optional message
  created_at: string    // Auto-generated timestamp
}
```

## Viewing Submissions

To view form submissions in Supabase:

1. Go to your Supabase dashboard
2. Navigate to Table Editor
3. Select the `contact_submissions` table
4. View all submissions with filters and sorting

To view uploaded files:

1. Go to Storage in your Supabase dashboard
2. Select the `contact-attachments` bucket
3. Browse folders by submission ID

## Testing the Integration

1. Fill out the form completely
2. Attach some test files (optional)
3. Click "Confirmer et envoyer"
4. Check your Supabase dashboard to verify:
   - New row in `contact_submissions` table
   - Files in `contact-attachments` bucket (if uploaded)

## Production Considerations

1. **Email Notifications**: Set up Supabase Edge Functions or webhooks to send email notifications when new submissions arrive
2. **Admin Dashboard**: Create an admin interface to manage and respond to submissions
3. **Rate Limiting**: Implement rate limiting on the table inserts to prevent spam
4. **File Scanning**: Add virus scanning for uploaded files before storage
5. **Backup**: Configure automated backups for the submissions table
6. **Monitoring**: Set up alerts for failed submissions or errors

## Troubleshooting

**Error: "Failed to insert row"**
- Ensure the `contact_submissions` table exists
- Verify RLS policies are configured correctly
- Check that the anon key has insert permissions

**Error: "Storage bucket not found"**
- Ensure the `contact-attachments` bucket exists
- Verify storage policies allow public uploads

**Error: "File upload failed"**
- Check file size is under 10MB
- Verify MIME type is allowed
- Ensure bucket has sufficient storage space
