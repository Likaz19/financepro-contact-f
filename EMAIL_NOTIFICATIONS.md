# 📧 Email Notifications Guide

## Overview

Email notifications allow you to receive automatic alerts when new contact forms are submitted. Each submission opens a pre-formatted email in your default email client with all the form details.

## Features

✅ **Automatic Email Composition**: Pre-filled subject and body with all form data  
✅ **Multiple Recipients**: Configure multiple email addresses  
✅ **Enable/Disable Toggle**: Activate or deactivate notifications per recipient  
✅ **Test Functionality**: Send test notifications to verify setup  
✅ **Activity Logs**: Track all email notification attempts  
✅ **Mobile Support**: Works on both desktop and mobile devices  

## How It Works

1. **User submits the contact form**
2. **System processes the submission** to Supabase
3. **Email notifications are triggered** for all enabled recipients
4. **Email client opens** with a pre-formatted message containing:
   - Contact information (name, email, phone)
   - Selected interests (Consulting, Formation)
   - Chosen services and modules
   - Message content
   - Number of attachments
   - Submission timestamp

5. **You manually send the email** from your email client

## Setup Instructions

### Step 1: Access Notification Settings

1. Click the **"Notifications"** button in the top-right corner of the form
2. Select the **"Emails"** tab

### Step 2: Add Email Recipients

1. Click **"Ajouter"** (Add)
2. Enter the recipient's name (e.g., "Jean Dupont")
3. Enter the recipient's email address (e.g., "contact@financepro.com")
4. Click **"Ajouter"** to save

### Step 3: Enable Notifications

- Toggle the switch to **ON** (blue) to enable notifications
- Toggle to **OFF** (gray) to disable without deleting

### Step 4: Test Your Setup

1. Click the **"Test"** button next to a configured email
2. Your email client will open with a sample notification
3. Verify the formatting and content
4. You can send or discard the test email

## Email Format

### Subject Line
```
🔔 Nouveau contact FinancePro: [Name] - [Interests]
```

Example:
```
🔔 Nouveau contact FinancePro: Jean Dupont - Consulting & Formation
```

### Email Body
```
📋 NOUVEAU FORMULAIRE DE CONTACT - FINANCEPRO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 INFORMATIONS DE CONTACT
   Nom: [Full Name]
   Email: [Email Address]
   Téléphone: [Country Code] [Phone Number]

💼 INTÉRÊTS
   [Selected Interests]

🔧 SERVICES CONSULTING SÉLECTIONNÉS
   • [Service 1]
   • [Service 2]
   ...

📚 MODULES FORMATION SÉLECTIONNÉS
   • [Module 1]
   • [Module 2]
   ...

💬 MESSAGE
   [User's message content]

📎 FICHIERS JOINTS: [Number of files]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 Soumis le: [Full Date and Time]
```

## Managing Recipients

### Edit a Recipient
Currently, you need to delete and re-add to modify details.

### Delete a Recipient
1. Click the **trash icon** (🗑️) next to the recipient
2. The recipient will be removed immediately
3. No confirmation dialog (be careful!)

### Enable/Disable Temporarily
Use the toggle switch to temporarily disable notifications without deleting the configuration.

## Viewing Notification History

1. Go to **Notifications** → **Historique** tab
2. View the last 100 email notification attempts
3. Each entry shows:
   - ✅ **Success**: Email client opened successfully
   - ❌ **Failure**: Error occurred
   - Recipient email address
   - Timestamp
   - Error message (if applicable)

4. Click **"Effacer l'historique"** to clear all logs

## How Email Notifications Differ from Webhooks

| Feature | Email Notifications | Webhooks |
|---------|-------------------|----------|
| **Trigger** | Opens email client | Sends HTTP POST |
| **Automation** | Manual send required | Fully automatic |
| **Delivery** | Through your email server | Direct HTTP request |
| **Setup Complexity** | Simple (just email address) | Moderate (requires endpoint) |
| **Best For** | Personal notifications | System integrations |
| **Real-time** | Immediate open | Immediate send |

## Browser Compatibility

### Desktop Browsers
- ✅ Chrome, Edge, Firefox, Safari
- Opens default email client (Outlook, Thunderbird, Mail, etc.)

### Mobile Browsers
- ✅ iOS Safari, Chrome
- ✅ Android Chrome, Samsung Internet
- Opens native email app

### Email Clients Supported
- Gmail (web or app)
- Outlook (web or app)
- Apple Mail
- Thunderbird
- Yahoo Mail
- Any other default email client

## Troubleshooting

### Email client doesn't open
**Problem**: Clicking test or after form submission, nothing happens  
**Solution**: 
- Ensure you have a default email client configured in your OS
- Check browser permissions for opening external applications
- Try a different browser

### Pop-up blocker prevents opening
**Problem**: Browser blocks the email client from opening  
**Solution**:
- Allow pop-ups for this site
- Look for the pop-up blocker icon in the address bar
- Add the site to your browser's allowlist

### Email contains raw text/formatting issues
**Problem**: Line breaks or special characters don't display properly  
**Solution**:
- This is normal for `mailto:` links
- The email client will format it correctly when sent
- If issues persist, copy the content to a new email

### Multiple emails open at once
**Problem**: When multiple recipients are configured, multiple email windows open  
**Solution**:
- This is expected behavior
- Each enabled recipient gets their own email draft
- Consider using webhooks for automated multi-recipient delivery

### Email not showing all form data
**Problem**: Some fields are missing from the email  
**Solution**:
- Verify the field was filled in the form
- Optional fields (like message, phone) only appear if provided
- Check the "Historique" tab for any errors

## Privacy & Security

- ✅ Email addresses stored locally in browser (using useKV)
- ✅ No email addresses sent to external servers
- ✅ You control who receives notifications
- ✅ Form data transmitted securely via Supabase
- ✅ Emails sent through your own email account

## Best Practices

1. **Use a shared team email** (e.g., contact@company.com) for multiple people to access
2. **Test before enabling** to verify formatting and delivery
3. **Don't add too many recipients** (3-5 max) to avoid opening many windows
4. **Combine with webhooks** for automated processing and email for manual review
5. **Check spam folders** if emails don't arrive (though `mailto:` opens locally)
6. **Regularly review logs** to ensure notifications are working

## Advanced Usage

### Filtering Notifications
Currently, all submissions trigger all enabled recipients. To filter:
- Use webhooks with conditional logic on the receiving end
- Or manually filter emails in your inbox using rules

### Forwarding Notifications
Set up email rules in your email client to:
- Auto-forward to specific teams based on keywords
- Apply labels/categories
- Trigger additional automations (Zapier, Make, etc.)

### Combining with CRM
- Use webhooks to send to your CRM API
- Use email notifications for manual follow-up alerts
- Best of both worlds: automation + human oversight

## Technical Details

### Storage
- Configuration stored in: `email-notifications` key (useKV)
- Logs stored in: `email-notification-logs` key (useKV)
- Maximum log entries: 100 (oldest removed automatically)

### mailto: Link Structure
```
mailto:recipient@example.com?subject=encoded-subject&body=encoded-body
```

### Data Sent
The notification includes:
- All form fields from the contact submission
- Submission timestamp (ISO 8601 format)
- Attachment count (files not included in email)

## Limitations

- ❌ Files cannot be automatically attached via `mailto:`
- ❌ Requires manual send from email client
- ❌ Limited to plain text formatting
- ❌ Character limits may apply (varies by email client/OS)
- ❌ Cannot verify delivery (only that email client opened)

## FAQ

**Q: Can I automatically send emails without opening my email client?**  
A: Not with this method. For fully automated emails, consider:
- Setting up a server-side email service
- Using webhook integrations with email automation tools (SendGrid, Mailgun, etc.)

**Q: Can I customize the email format?**  
A: Yes, edit `/src/lib/email-notifications.ts` functions:
- `formatEmailSubject()` - Change subject line
- `formatEmailBody()` - Modify email content and layout

**Q: Will this work if I use webmail (Gmail web, Outlook.com)?**  
A: Yes, but it will try to open your desktop email client. If you only use webmail:
- Set your browser to open Gmail/Outlook as default
- Or use webhooks instead for better integration

**Q: Can I send to different emails based on form selections?**  
A: Not currently built-in. You could:
- Modify the code to filter by `payload.formData.interests`
- Use webhooks with conditional logic
- Set up email filters on the receiving end

**Q: How do I stop receiving notifications?**  
A: Simply toggle OFF the switch next to your email address, or delete it entirely.

## Support

For issues or questions:
1. Check this guide first
2. Review the browser console for errors
3. Test with a simple email address
4. Verify your email client is configured properly
5. Try on a different device/browser

## Related Documentation

- [WEBHOOK_GUIDE.md](./WEBHOOK_GUIDE.md) - For HTTP webhook integrations
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database configuration
- [PRD.md](./PRD.md) - Product requirements and design

---

✨ Email notifications are now configured and ready to alert you of new form submissions!
