# Planning Guide

A professional multi-step contact form for FinancePro, a financial consulting and training company, that guides users through collecting their information, interests, and specific service needs with smooth transitions and clear visual feedback.

**Experience Qualities**:
1. **Professional** - The form should feel trustworthy and business-appropriate, reflecting FinancePro's corporate identity
2. **Guided** - Users should never feel lost, with clear progress indicators and easy navigation between steps
3. **Responsive** - Every interaction provides immediate feedback with smooth animations and clear state changes

**Complexity Level**: Light Application (multiple features with basic state)
  - Multi-step form with conditional logic, progress tracking, and data persistence across steps

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

### Message & Submission (Step 4)
- **Functionality**: Free-text message field and form submission with success animation
- **Purpose**: Allow users to provide additional context before submitting
- **Trigger**: User advances from step 3
- **Progression**: User types message → Clicks "Envoyer" → Form hides → Success screen animates in
- **Success criteria**: Submission triggers animated checkmark and confirmation message

## Edge Case Handling
- **No Interest Selected**: Allow progression - users may want consulting info without specifying upfront
- **Back Navigation**: All previously entered data preserved when navigating backwards
- **Empty Message**: Message field is optional to reduce friction
- **Direct URL Access**: Form always starts at step 1 with fresh state
- **Rapid Clicking**: Debounce navigation buttons to prevent skipping steps

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
  - Button (shadcn) - Primary and secondary variants for navigation with size="lg" for prominence
  - Input (shadcn) - Text, email, phone fields with proper HTML5 types
  - Textarea (shadcn) - Message field with rows={4}
  - Checkbox (shadcn) - Interest and service selections with label wrappers
  - Progress (shadcn) - Linear progress indicator showing form completion percentage
  - Card (shadcn) - Container for form with subtle shadow
  - Label (shadcn) - Accessible field labels paired with inputs
  
- **Customizations**:
  - Custom step container with conditional rendering and fade animations using framer-motion
  - Custom success screen with animated checkmark using CSS animations
  - Progress bar customized to use brand colors
  
- **States**:
  - Buttons: Default, hover (darker blue), disabled (muted)
  - Inputs: Default, focus (blue border + shadow), filled, error (if validation added)
  - Checkboxes: Unchecked, checked, hover
  
- **Icon Selection**:
  - CheckCircle (Phosphor) for success confirmation
  - ArrowRight/ArrowLeft for navigation buttons (optional enhancement)
  
- **Spacing**: Consistent use of Tailwind spacing scale - gap-6 between form sections, gap-4 for checkbox groups, px-8 py-6 for card padding

- **Mobile**: Form container max-width constrains on desktop, full-width with padding on mobile. Stack all elements vertically. Buttons remain full-width on all screens for easy touch targets. Progress bar stays fixed at top visually.
