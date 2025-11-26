# 🔄 Ajout du Champ Adresse - Migration

## Pour les Utilisateurs Existants

Si vous avez déjà configuré votre base de données Supabase avant cette mise à jour, vous devez ajouter le champ "adresse" à votre table existante.

### ⚡ Solution Rapide (30 secondes)

1. **Ouvrez Supabase SQL Editor**
   - Allez à https://rzudotbbfoklxcebghan.supabase.co
   - Cliquez sur **"SQL Editor"** dans le menu de gauche
   - Cliquez sur **"New Query"**

2. **Copiez et exécutez ce script SQL:**

```sql
-- Ajouter la colonne address
ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS address TEXT;
```

3. **Cliquez sur "Run"** (ou `Ctrl+Enter`)

4. **Terminé!** Votre formulaire peut maintenant accepter les adresses.

---

## ✅ Vérification

Pour vérifier que la colonne a été ajoutée:

1. Allez dans **Table Editor** → **contact_submissions**
2. Vous devriez voir une nouvelle colonne **"address"** dans la liste

---

## 📋 Script Complet (Optionnel)

Si vous voulez utiliser le script complet avec vérification, utilisez le fichier `add-address-field.sql`:

```sql
-- Add the address column if it doesn't exist
ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Optional: Add a comment to document the column
COMMENT ON COLUMN contact_submissions.address IS 'Physical address (city, country) of the contact';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contact_submissions'
ORDER BY ordinal_position;
```

---

## 🆕 Nouveaux Utilisateurs

Si vous n'avez **pas encore créé** la table, utilisez simplement le script principal:
- `supabase-setup.sql` (contient déjà le champ address)
- Ou suivez `SUPABASE_SETUP.md`

---

## 📝 Ce qui a changé

**Avant:**
- Nom, Email, Téléphone (avec code pays)
- Intérêts, Services, Modules, Message, Fichiers

**Après (avec cette mise à jour):**
- ✅ **Nouveau:** Champ Adresse (ville, pays)
- Tous les anciens champs fonctionnent toujours

---

## ❓ Questions Fréquentes

**Q: Est-ce que le champ adresse est obligatoire?**
R: Non, c'est un champ optionnel. Les utilisateurs peuvent le laisser vide.

**Q: Que se passe-t-il avec mes anciennes soumissions?**
R: Elles restent intactes. Le champ address sera simplement `NULL` pour les anciennes entrées.

**Q: Dois-je faire quelque chose pour les webhooks/emails?**
R: Non, ils sont déjà mis à jour pour inclure l'adresse quand elle est fournie.

---
