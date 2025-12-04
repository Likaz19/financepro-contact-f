# 🔧 Fix: Webhook Connection Refused Error

## ❌ Error Message

```
Proxy error: Connection refused (localhost:8000)
```

or

```
Webhook "..." non livré: URL non accessible (vérifiez que le serveur est en ligne)
```

## ✅ Quick Fix (1 Minute)

This error happens when you have a webhook configured to point to `localhost:8000` (or another local address), but there's no server running at that address.

### Solution: Disable or Remove the Localhost Webhook

1. **Open Settings**
   - Click the **"Paramètres"** button (with gear icon) at the top right of your form

2. **Go to Webhooks Tab**
   - Click on the **"Webhooks"** tab

3. **Find the Localhost Webhook**
   - Look for any webhook with a URL like:
     - `http://localhost:8000`
     - `http://127.0.0.1:8000`
     - `http://localhost:3000`
     - Any other localhost URL

4. **Disable or Delete It**
   - Either toggle the switch to **OFF** to disable it
   - Or click the trash icon to delete it completely

5. **Test Again**
   - Submit the form to verify the error is gone

## 💡 Understanding the Issue

### What is a localhost webhook?

- `localhost` webhooks are only used for **local development and testing**
- They send form data to a server running on your own computer
- They will **never work in production** or on deployed sites

### When should you use localhost webhooks?

✅ **Use localhost webhooks when:**
- You're actively developing and testing a local server
- You're running `npm run dev` or similar on your machine
- You want to test webhook integration before deploying

❌ **Don't use localhost webhooks when:**
- You're not running a local server
- You want real notifications or integrations
- You're using the app in production

### What should you use instead?

For real webhook integrations, use **public URLs** from services like:

1. **Zapier** - https://zapier.com/app/zaps
   - Free tier available
   - Easiest to set up
   - Connects to 5,000+ apps

2. **Make.com** - https://www.make.com/
   - Free tier available
   - More flexible than Zapier
   - Visual automation builder

3. **n8n** - https://n8n.io/
   - Self-hosted option
   - Must deploy to a server (not localhost)
   - Use ngrok for local testing

4. **Discord Webhook** - Free and instant
   - Create a webhook in any Discord channel
   - Settings → Integrations → Webhooks → New Webhook
   - Copy the URL

5. **Slack Webhook** - Free for your workspace
   - Create an Incoming Webhook in Slack
   - Add to any channel
   - Get instant notifications

## 🔍 Important Notes

### The form still works!

Even if webhooks fail:
- ✅ Your form submission is **saved to Supabase** successfully
- ✅ File attachments are **uploaded to storage** successfully
- ⚠️ Only the webhook notification fails

Webhook failures **do not prevent** form submission!

### Multiple webhooks

You can have multiple webhooks configured:
- Some can be enabled, others disabled
- Failed webhooks show a warning, but don't break the app
- Successful webhooks work normally

### Testing webhooks

To test a webhook before adding it:
1. Use a service like **webhook.site** to get a test URL
2. Add the webhook.site URL to your form
3. Submit the form
4. Check webhook.site to see the payload
5. Replace with your real webhook URL when ready

## 📚 More Information

- See **`WEBHOOK_GUIDE.md`** for complete webhook documentation
- See **`START_HERE.md`** for general troubleshooting
- See **`WEBHOOK_TESTING.md`** for webhook testing strategies

## 🆘 Still Having Issues?

If the error persists after removing localhost webhooks:

1. Check the **Webhooks tab** in settings for all configured webhooks
2. Make sure all URLs start with `https://` (not `http://`)
3. Test each webhook URL in your browser or with Postman
4. Check the **Historique** (Logs) tab in settings to see webhook delivery results
5. Temporarily disable all webhooks to verify the form works

---

**Quick Summary:** Remove or disable any webhooks with `localhost` URLs, and the error will disappear! 🎉
