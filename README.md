# FinancePro Contact Form

A professional, multi-step contact form for FinancePro with Supabase backend integration.

## 🚀 Features

- **Multi-step wizard** with progress tracking
- **International phone validation** (100+ countries)
- **File attachments** (up to 5 files, 10MB each)
- **Real-time validation** with helpful error messages
- **Supabase integration** for data storage
- **Responsive design** with smooth animations
- **Professional UI** using shadcn components

## 📋 Quick Start

### 1. Supabase Setup (First Time Only)

Choose the guide that fits your needs:

- **Fast Track**: [`QUICK_SETUP.md`](./QUICK_SETUP.md) - Get started in 5 minutes
- **Detailed Guide**: [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) - Complete documentation
- **Checklist**: [`SETUP_CHECKLIST.md`](./SETUP_CHECKLIST.md) - Track your progress

**Quick Setup:**
1. Open [Supabase Dashboard](https://rzudotbbfoklxcebghan.supabase.co)
2. Go to SQL Editor → New Query
3. Copy contents of `supabase-setup.sql`
4. Paste and Run
5. Verify storage bucket `contact-attachments` exists

### 2. Run the Application

```bash
npm install
npm run dev
```

Visit the application and test by submitting a contact form.

## 📁 Project Structure

- `src/App.tsx` - Main form component
- `src/lib/supabase.ts` - Supabase client configuration
- `supabase-setup.sql` - Database setup script
- `QUICK_SETUP.md` - Quick setup guide
- `SUPABASE_SETUP.md` - Detailed setup documentation

## 🔧 Configuration

The application is pre-configured with:
- **Supabase URL**: https://rzudotbbfoklxcebghan.supabase.co
- **API Key**: Already configured in `src/lib/supabase.ts`

## 📊 Viewing Submissions

### In Supabase Dashboard:
1. Go to **Table Editor** → `contact_submissions`
2. View, filter, and export submissions

### Via SQL:
```sql
SELECT * FROM contact_submissions 
ORDER BY created_at DESC;
```

## 🎨 What's Inside?

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Framer Motion** for animations
- **Supabase** for backend
- **Phosphor Icons** for UI icons

## 🐛 Troubleshooting

See [`QUICK_SETUP.md`](./QUICK_SETUP.md) for common issues and solutions.

## 🧹 Just Exploring?

No problem! If you were just checking things out and don't need to keep this code:

- Simply delete your Spark.
- Everything will be cleaned up — no traces left behind.

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
