# Planning Guide

A professional multi-step contact form for FinancePro, a financial consulting and training company, that guides users through collecting their information, interests, and specific service needs with smooth transitions and clear visual feedback.

**Experience Qualities**:
1. **Professional** - The form should feel trustworthy and business-appropriate, reflecting FinancePro's corporate identity
2. **Guided** - Users should never feel lost, with clear progress indicators and easy navigation between steps
3. **Responsive** - Every interaction provides immediate feedback with smooth animations and clear state changes

**Complexity Level**: Light Application (multiple features with basic state)
  - Multi-step form with conditional logic, progress tracking, data persistence across steps, client-side validation, file upload with preview and management, API submission with error handling, and confirmation review step

## Essential Features

### Multi-Step Navigation
- **Functionality**: Four-step form with next/previous navigation and progress indicator
- **Purpose**: Break complex form into digestible chunks to reduce abandonment
- **Trigger**: User clicks "Suivant" (Next) or "Retour" (Back) buttons
- **Progression**: Step visibility toggles → Progress bar updates → Smooth fade animation → Focus on first input
- **Success criteria**: Users can navigate forward/backward without losing data, progress bar accurately reflects position

### Contact Information Collection (Step 1)
- **Functionality**: Collects name, email, phone number with international country code selector, and address with optional Google Places autocomplete
- **Purpose**: Gather essential contact details before service-specific questions
- **Trigger**: User loads the form
- **Progression**: User fills fields → Optional autocomplete suggestions for address → Clicks "Suivant" → Validation check → Advance to step 2 or show errors
- **Success criteria**: All required fields validated before advancing, data persists when navigating back, Google Places autocomplete works if configured

### Interest Selection (Step 2)
- **Functionality**: Checkbox selection for Consulting and/or Formation (Training)
- **Purpose**: Determine which service categories to display in step 3
- **Trigger**: User advances from step 1
- **Progression**: User checks interests → Clicks "Suivant" → Step 3 displays relevant options
- **Success criteria**: At least one interest can be selected, selections control conditional visibility in next step

### Service/Module Selection (Step 3)
- **Functionality**: Conditional display of consulting services or training modules based on step 2 selections
- **Purpose**: Collect specific service interests to route leads appropriately
- **Trigger**: User advances from step 2
- **Progression**: Display consulting options if selected → Display training options if selected → User checks items → Advance to step 4
- **Success criteria**: Only relevant options display, both sections can show simultaneously if both interests selected

### Message Input (Step 4)
- **Functionality**: Optional free-text message field with character counter and validation
- **Purpose**: Allow users to provide additional context about their needs
- **Trigger**: User advances from step 3
- **Progression**: User types message (optional) → Character count updates → Validation checks length → Advance to file upload
- **Success criteria**: Character counter displays correctly, validation enforces 10-1000 character range if provided

### File Attachments (Step 5)
- **Functionality**: Optional file upload with drag-and-drop support, preview, and file management
- **Purpose**: Allow users to attach relevant documents (CVs, company documents, financial statements, etc.)
- **Trigger**: User advances from step 4
- **Progression**: User clicks upload area → File picker opens → User selects files → Files validate (size, count) → Preview list displays → User can remove files → Advance to confirmation
- **Success criteria**: Files upload successfully, preview shows file name and size with appropriate icons, users can remove files, validation prevents oversized files (>10MB) and too many files (>5), accepted formats: PDF, DOC, DOCX, images (JPG, PNG, GIF), TXT, Excel files

### Confirmation & Review (Step 6)
- **Functionality**: Summary of all entered data including attachments with edit buttons for each section
- **Purpose**: Allow users to review and verify all information before submission
- **Trigger**: User advances from step 5
- **Progression**: Display all form data grouped by section including file list → User clicks "Modifier" to edit any section → User clicks "Confirmer et envoyer" → API submission begins
- **Success criteria**: All data displays accurately including attachment file names and sizes, edit buttons navigate to correct steps, data and files persist when returning

### API Submission
- **Functionality**: Supabase database insert to `contact_submissions` table with file upload to storage bucket, webhook integration to external services, loading state and error handling
- **Purpose**: Submit form data including file attachments to Supabase backend and configured webhooks with proper error recovery
- **Trigger**: User clicks "Confirmer et envoyer" on confirmation step
- **Progression**: Disable button → Show "Envoi en cours..." → Insert data to Supabase → Upload files to storage → Send to enabled webhooks → Handle responses → Show success screen or error message
- **Success criteria**: Loading state displays during submission, files are properly uploaded to Supabase Storage bucket, webhooks receive POST requests with form data, success shows animated confirmation, errors display with helpful messages and retry option, webhook failures show warnings but don't block submission

### Footer with Contact & Social Links
- **Functionality**: Site-wide footer displaying company information, contact details, and social media links
- **Purpose**: Provide easy access to contact information and social channels throughout the user journey
- **Trigger**: Visible on all screens (form and success state)
- **Progression**: Static footer at bottom → Hover interactions on links and social icons → Click to call/email/visit social profiles
- **Success criteria**: All contact links are clickable (phone, WhatsApp, email), social icons link to correct platforms with proper target="_blank", responsive layout adapts to mobile

### Webhook Integration
- **Functionality**: Configure and manage external webhooks to receive form submissions, view delivery logs and status
- **Purpose**: Enable integration with third-party services (Zapier, Make.com, custom APIs) for automated workflows
- **Trigger**: Click "Paramètres" button in form header, navigate to Webhooks tab
- **Progression**: Open settings dialog → Add/edit/delete webhooks → Configure URL and headers → Enable/disable webhooks → View delivery logs → Close dialog
- **Success criteria**: Webhooks can be added with name and URL, custom headers support JSON format, webhooks can be toggled on/off, webhooks receive POST with form data on submission, delivery logs show success/failure with timestamps and error messages, failed webhooks don't block form submission, copy example payload feature works

### Google Places Address Autocomplete (Optional)
- **Functionality**: Optional Google Places API integration for address field autocomplete with real-time suggestions
- **Purpose**: Improve address entry accuracy and user experience with validated, standardized addresses
- **Trigger**: User configures Google Places API key in settings, then types in address field
- **Progression**: Admin adds API key in settings → Address field shows autocomplete icon → User types → Suggestions appear → User selects → Address fills automatically
- **Success criteria**: API key can be configured and stored securely, address field shows autocomplete indicator when active, suggestions appear as user types (minimum 3 characters), selected address fills field correctly, works without API key configured (manual entry), comprehensive setup guide available

## Edge Case Handling
- **No Interest Selected**: Validation prevents progression from step 2 until at least one interest is selected
- **Back Navigation**: All previously entered data and files preserved when navigating backwards, errors cleared on navigation
- **Empty Message**: Message field is optional but if provided must be 10-1000 characters
- **Invalid Email/Phone**: Inline validation with specific error messages prevents progression
- **File Size Limits**: Files over 10MB rejected with clear error message, users notified before upload attempt
- **File Count Limits**: Maximum 5 files allowed, additional files rejected with toast notification
- **Unsupported File Types**: Only specified formats accepted (.pdf, .doc, .docx, images, .txt, Excel)
- **File Removal**: Users can remove uploaded files before submission, list updates dynamically
- **API Failures**: Error alerts display with retry option, submission state resets to allow re-attempts
- **Network Timeout**: Fetch errors caught and displayed with user-friendly messages
- **Rapid Clicking**: Button disabled during submission to prevent duplicate requests
- **Edit During Confirmation**: Users can return to any previous step from confirmation screen to modify data and files
- **Webhook Failures**: Failed webhooks show warning toasts but don't block submission, successful Supabase insert is prioritized
- **Invalid Webhook URL**: URL validation prevents adding malformed webhook URLs
- **Webhook Timeout**: 10 second timeout per webhook prevents hanging
- **No Webhooks Configured**: Form works normally without any webhooks, integration is optional
- **Multiple Webhooks**: All enabled webhooks fire in parallel, individual failures don't affect others
- **No Google API Key**: Address field works as manual text input without autocomplete
- **Google API Load Failure**: Falls back to manual entry with user notification
- **Invalid API Key**: Error shown in settings, autocomplete disabled
- **Address Manual Override**: Users can type manually even with autocomplete enabled

## Validation Rules
Client-side validation enforces data quality before API submission:

- **Name**: Required, minimum 2 characters
- **Email**: Required, valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- **Phone**: Optional, but if provided must contain 8-15 digits (allows formatting characters)
- **Interests**: Required, at least one selection (Consulting or Formation)
- **Message**: Optional, but if provided must be 10-1000 characters
- **Attachments**: Optional, maximum 5 files, each file maximum 10MB, accepted formats: .pdf, .doc, .docx, .jpg, .jpeg, .png, .gif, .txt, .xlsx, .xls
- **Inline Errors**: Display immediately below invalid fields in red with specific error text
- **Progressive Validation**: Errors clear when user starts typing corrections or removes problematic files

## API Configuration
The form is integrated with Supabase for real-time data persistence and file storage, plus supports webhook integrations for external services:

### Supabase Backend
- **Database**: Supabase PostgreSQL database
- **Table**: `contact_submissions` - stores all form submission data
- **Storage Bucket**: `contact-attachments` - stores uploaded files
- **Authentication**: Uses Supabase anon key for public access with Row Level Security (RLS) policies
- **Data Structure**:
  - Text fields: `name`, `email`, `country_code`, `phone`, `message`
  - Array fields: `interests`, `services`, `modules`
  - Auto-generated: `id` (UUID), `created_at` (timestamp)
- **File Storage**: Files uploaded to `{submission_id}/{timestamp}_{filename}` path structure
- **Success Response**: Successful insert triggers success screen
- **Error Handling**: Supabase errors are caught and displayed to the user with helpful messages
- **Loading State**: Button shows "Envoi en cours..." and disables during submission
- **Toast Notifications**: Success/error toasts via sonner library

### Webhook Integration
- **Configuration**: Stored in browser using `useKV` hook with key 'webhooks'
- **Management UI**: Accessible via "Paramètres" button in form header, Webhooks tab
- **Webhook Structure**: Each webhook has id, name, url, enabled status, optional custom headers, and creation timestamp
- **Payload Format**: JSON POST with formData object, submittedAt timestamp, and attachmentCount
- **Delivery**: All enabled webhooks fire in parallel after successful Supabase submission
- **Timeout**: 10 second timeout per webhook request
- **Error Handling**: Individual webhook failures log warnings but don't block submission
- **Logs**: Last 100 webhook delivery attempts stored with status, timestamp, and error details
- **Headers**: Support for custom HTTP headers (e.g., Authorization tokens) in JSON format

### Google Places API (Optional)
- **Configuration**: API key stored in browser using `useKV` hook with key 'google-places-api-key'
- **Management UI**: Accessible via "Paramètres" button, Adresses tab
- **Loading**: Script loaded dynamically when API key is configured
- **Language**: French language settings for appropriate localization
- **Fields**: Requests formatted_address, address_components, and geometry from Places API
- **Autocomplete Type**: Restricted to 'address' type for relevant suggestions
- **Fallback**: Works as standard text input if API key not configured or load fails
- **Security**: Client-side key storage, should be restricted by domain in Google Cloud Console

See `API_SETUP.md` for detailed database schema and storage bucket configuration instructions.
See `WEBHOOK_GUIDE.md` for webhook integration examples and troubleshooting.
See `GOOGLE_PLACES_SETUP.md` for Google Places API configuration and setup guide.

## Design Direction
The design should feel corporate and trustworthy with a clean, professional aesthetic that reflects financial expertise. Clear blue tones communicate reliability and competence, while gold accents add a touch of premium quality. The interface should be minimal and focused, avoiding distractions from the form completion goal.

## Color Selection
Complementary scheme with primary blues and accent gold to create professional contrast and visual interest.

- **Primary Color**: Deep Blue (oklch(0.42 0.15 264)) - Communicates trust, stability, and financial expertise
- **Secondary Colors**: Lighter Blue (oklch(0.55 0.12 264)) for supporting elements and hover states
- **Accent Color**: Soft Gold (oklch(0.88 0.12 85)) - Highlights secondary actions and adds warmth to the corporate palette
- **Foreground/Background Pairings**:
  - Background (Light Gray oklch(0.97 0 0)): Dark Blue text (oklch(0.25 0.15 264)) - Ratio 11.2:1 ✓
  - Card (White oklch(1 0 0)): Dark Blue text (oklch(0.25 0.15 264)) - Ratio 12.6:1 ✓
  - Primary (Deep Blue oklch(0.42 0.15 264)): White text (oklch(1 0 0)) - Ratio 7.8:1 ✓
  - Secondary (Light Blue oklch(0.55 0.12 264)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Accent (Soft Gold oklch(0.88 0.12 85)): Dark Blue text (oklch(0.25 0.15 264)) - Ratio 8.4:1 ✓

## Font Selection
Clean, professional sans-serif typography that conveys modern financial services while maintaining excellent readability across all devices. Inter provides the professional appearance expected in financial services.

- **Typographic Hierarchy**:
  - H2 (Main Title): Inter SemiBold/28px/tight letter spacing - Commands attention at form top
  - Subtitle: Inter Regular/16px/normal spacing - Provides context without competing with title
  - Labels: Inter SemiBold/14px/normal spacing - Clear field identification
  - Inputs: Inter Regular/15px/normal spacing - Comfortable reading and typing
  - Buttons: Inter SemiBold/17px/normal spacing - Clear call-to-action emphasis

## Animations
Animations should feel professional and purposeful - smooth transitions between steps that guide attention without feeling playful or distracting. Every motion reinforces progress and builds confidence.

- **Purposeful Meaning**: Step transitions fade in with subtle upward movement to suggest forward progress. Success checkmark scales and pops to create a rewarding completion moment.
- **Hierarchy of Movement**: Progress bar has highest priority (smooth width transition), followed by step fade transitions, then micro-interactions on inputs and buttons

## Component Selection
- **Components**:
  - Button (shadcn) - Primary and secondary variants for navigation with size="lg" for prominence, ghost variant for edit buttons and file removal
  - Input (shadcn) - Text, email, phone fields with proper HTML5 types and error state styling, file input for attachments
  - Textarea (shadcn) - Message field with rows={4} and maxLength={1000}
  - Checkbox (shadcn) - Interest and service selections with label wrappers
  - Progress (shadcn) - Linear progress indicator showing form completion percentage (now 6 steps)
  - Card (shadcn) - Container for form with subtle shadow
  - Label (shadcn) - Accessible field labels paired with inputs, required fields marked with asterisk
  - Alert (shadcn) - Error message display for API failures with destructive variant
  
- **Customizations**:
  - Custom step container with conditional rendering and fade animations using framer-motion
  - Custom success screen with animated checkmark using CSS animations
  - Custom file upload area with drag-and-drop styling and hover effects
  - Custom file preview list with file type icons and remove buttons
  - Progress bar customized to use brand colors
  
- **States**:
  - Buttons: Default, hover (darker blue), disabled (muted), loading (for submit)
  - Inputs: Default, focus (blue border + shadow), filled, error (red border)
  - Checkboxes: Unchecked, checked, hover
  - File upload area: Default (dashed border), hover (primary border), has files (file list visible)
  
- **Icon Selection**:
  - CheckCircle (Phosphor) for success confirmation and webhook success status
  - Warning (Phosphor) for error alerts and webhook failures
  - PencilSimple (Phosphor) for edit buttons on confirmation screen and webhook edit
  - UploadSimple (Phosphor) for file upload area
  - FilePdf, FileDoc, FileImage, File (Phosphor) for file type indicators in preview
  - Trash (Phosphor) for file removal and webhook deletion buttons
  - Phone (Phosphor) for phone contact link in footer
  - Envelope (Phosphor) for email contact link in footer
  - MapPin (Phosphor) for location display in footer and address autocomplete indicator
  - WhatsappLogo (Phosphor) for WhatsApp link in footer
  - FacebookLogo, LinkedinLogo, InstagramLogo (Phosphor) for social media links in footer
  - GearSix (Phosphor) for settings button
  - WebhooksLogo (Phosphor) for webhook configuration interface
  - Copy (Phosphor) for copy example payload button
  - Clock (Phosphor) for webhook logs empty state
  - Key (Phosphor) for API key configuration
  - CaretUpDown (Phosphor) for country code dropdown
  - Check (Phosphor) for selected items in dropdowns
  
- **Spacing**: Consistent use of Tailwind spacing scale - gap-6 between form sections, gap-4 for checkbox groups, px-8 py-6 for card padding, gap-8 for footer grid columns, gap-3 for file list items

- **Mobile**: Form container max-width constrains on desktop, full-width with padding on mobile. Stack all elements vertically. Buttons remain full-width on all screens for easy touch targets. Progress bar stays fixed at top visually. Footer switches from 3-column to single-column layout on mobile. File upload area adjusts to smaller screens with responsive padding.
