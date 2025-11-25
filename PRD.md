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
- **Functionality**: Collects name, email, and phone number with validation
- **Purpose**: Gather essential contact details before service-specific questions
- **Trigger**: User loads the form
- **Progression**: User fills fields → Clicks "Suivant" → Validation check → Advance to step 2 or show errors
- **Success criteria**: All required fields validated before advancing, data persists when navigating back

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
- **Functionality**: POST request to /api/contact endpoint with FormData (multipart/form-data) for file uploads, loading state and error handling
- **Purpose**: Submit form data including file attachments to backend with proper error recovery
- **Trigger**: User clicks "Confirmer et envoyer" on confirmation step
- **Progression**: Disable button → Show "Envoi en cours..." → Send POST request with FormData → Handle response → Show success screen or error message
- **Success criteria**: Loading state displays during submission, files are properly encoded in FormData, success shows animated confirmation, errors display with helpful messages and retry option

### Footer with Contact & Social Links
- **Functionality**: Site-wide footer displaying company information, contact details, and social media links
- **Purpose**: Provide easy access to contact information and social channels throughout the user journey
- **Trigger**: Visible on all screens (form and success state)
- **Progression**: Static footer at bottom → Hover interactions on links and social icons → Click to call/email/visit social profiles
- **Success criteria**: All contact links are clickable (phone, WhatsApp, email), social icons link to correct platforms with proper target="_blank", responsive layout adapts to mobile

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
The form submits to a backend endpoint with the following configuration:

- **Endpoint**: `/api/contact` (relative URL, configure in production)
- **Method**: `POST`
- **Content-Type**: `multipart/form-data` (automatically set by browser when using FormData)
- **Body**: FormData object containing all form fields and file attachments:
  - Text fields: `name`, `email`, `phone`, `message`
  - JSON-stringified arrays: `interests`, `services`, `modules`
  - Files: `attachment_0`, `attachment_1`, ... `attachment_N` (one per uploaded file)
- **Success Response**: Any 2xx status code shows success screen
- **Error Handling**: 4xx/5xx errors display error message from response body or generic fallback
- **Loading State**: Button shows "Envoi en cours..." and disables during submission
- **Toast Notifications**: Success/error toasts via sonner library

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
  - CheckCircle (Phosphor) for success confirmation
  - Warning (Phosphor) for error alerts
  - PencilSimple (Phosphor) for edit buttons on confirmation screen
  - UploadSimple (Phosphor) for file upload area
  - FilePdf, FileDoc, FileImage, File (Phosphor) for file type indicators in preview
  - Trash (Phosphor) for file removal buttons
  - Phone (Phosphor) for phone contact link in footer
  - Envelope (Phosphor) for email contact link in footer
  - MapPin (Phosphor) for location display in footer
  - WhatsappLogo (Phosphor) for WhatsApp link in footer
  - FacebookLogo, LinkedinLogo, InstagramLogo (Phosphor) for social media links in footer
  
- **Spacing**: Consistent use of Tailwind spacing scale - gap-6 between form sections, gap-4 for checkbox groups, px-8 py-6 for card padding, gap-8 for footer grid columns, gap-3 for file list items

- **Mobile**: Form container max-width constrains on desktop, full-width with padding on mobile. Stack all elements vertically. Buttons remain full-width on all screens for easy touch targets. Progress bar stays fixed at top visually. Footer switches from 3-column to single-column layout on mobile. File upload area adjusts to smaller screens with responsive padding.
