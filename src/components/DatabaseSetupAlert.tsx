import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Warning, Database, ArrowRight, FileText } from "@phosphor-icons/react"

export function DatabaseSetupAlert() {
  const openSupabase = () => {
    window.open('https://rzudotbbfoklxcebghan.supabase.co', '_blank')
  }

  const copySQL = async () => {
    const sqlScript = `-- Create the contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at 
  ON contact_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email 
  ON contact_submissions(email);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit forms (INSERT)
CREATE POLICY "Allow public inserts" ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to view submissions (SELECT)
CREATE POLICY "Allow authenticated reads" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create storage bucket for file attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'contact-attachments',
  'contact-attachments',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'contact-attachments');

CREATE POLICY "Allow authenticated reads" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'contact-attachments');`

    try {
      await navigator.clipboard.writeText(sqlScript)
      alert('✅ Script SQL copié! Allez dans Supabase → SQL Editor → New Query → Collez → Run')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Alert variant="destructive" className="mb-6 border-2">
      <div className="flex gap-3">
        <Warning className="h-6 w-6 mt-0.5 flex-shrink-0" weight="fill" />
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Database size={20} weight="fill" />
            Configuration requise : Base de données
          </h3>
          <AlertDescription className="text-sm space-y-4">
            <p className="font-medium text-base">
              La table de base de données n'existe pas encore. Setup en 3 minutes :
            </p>
            
            <div className="bg-background/20 p-4 rounded-lg space-y-3 border border-white/10">
              <p className="font-semibold text-sm">📋 Étapes rapides :</p>
              <ol className="list-decimal list-inside space-y-2 text-sm ml-2">
                <li>Cliquez sur "Ouvrir Supabase" ci-dessous</li>
                <li>Dans Supabase : SQL Editor → New Query</li>
                <li>Cliquez sur "Copier le Script SQL" ci-dessous</li>
                <li>Collez dans l'éditeur SQL et cliquez "Run"</li>
                <li>Rechargez cette page</li>
              </ol>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                size="default"
                className="bg-white text-destructive hover:bg-white/90 font-semibold"
                onClick={openSupabase}
              >
                1️⃣ Ouvrir Supabase
                <ArrowRight size={18} className="ml-2" weight="bold" />
              </Button>
              <Button
                size="default"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/30 font-semibold"
                onClick={copySQL}
              >
                2️⃣ Copier le Script SQL
                <FileText size={18} className="ml-2" weight="bold" />
              </Button>
            </div>

            <div className="text-xs opacity-90 border-t border-white/10 pt-3 mt-3">
              📖 Instructions détaillées : Voir <code className="bg-black/30 px-2 py-1 rounded font-mono">START_HERE.md</code> ou <code className="bg-black/30 px-2 py-1 rounded font-mono">DATABASE_SETUP_INSTRUCTIONS.md</code> dans les fichiers du projet
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  )
}
