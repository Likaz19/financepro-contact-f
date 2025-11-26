# FinancePro - Formulaire de Contact Multi-étapes

Un formulaire de contact professionnel pour FinancePro avec intégration Supabase et webhooks pour l'automatisation.

---

## 🚨 ERREUR: "Could not find the table"? 

## 👉 **[CLIQUEZ ICI - START_HERE.md](./START_HERE.md)** 👈

**Setup en 3 minutes** - Instructions complètes et simples

---

## ⚠️ CONFIGURATION REQUISE - IMPORTANT!

**Avant d'utiliser ce formulaire, vous DEVEZ configurer la base de données Supabase.**

### 📋 Étapes Rapides:

1. **Ouvrez** [votre dashboard Supabase](https://rzudotbbfoklxcebghan.supabase.co)
2. **Allez à** SQL Editor → New Query
3. **Copiez/Collez** le code du fichier `supabase-setup.sql`
4. **Cliquez sur** Run

**📖 Instructions détaillées:** 
- **Simple:** [START_HERE.md](./START_HERE.md) ⭐ **COMMENCEZ ICI**
- **Détaillées:** [DATABASE_SETUP_INSTRUCTIONS.md](./DATABASE_SETUP_INSTRUCTIONS.md)
- **Checklist:** [SETUP_STATUS.md](./SETUP_STATUS.md)

**⏱️ Temps estimé:** 2-3 minutes

---

## 🌟 Fonctionnalités

- ✅ Formulaire multi-étapes avec validation
- ✅ Téléchargement de fichiers (jusqu'à 5 fichiers, 10 Mo chacun)
- ✅ Sélection intelligente du code pays (70+ pays)
- ✅ Validation en temps réel des champs
- ✅ Écran de confirmation avant envoi
- ✅ Intégration Supabase (base de données + stockage)
- ✅ **Notifications email automatiques pour chaque soumission**
- ✅ **Webhooks pour services externes (Zapier, Make.com, APIs personnalisées)**
- ✅ Logs des envois (email + webhook)
- ✅ Animations fluides et professionnelles
- ✅ Responsive (mobile et desktop)

## 🔔 Notifications

Le formulaire supporte deux types de notifications:

### 📧 Email Notifications

Recevez un email pré-formaté dans votre client email pour chaque soumission.

**Configuration Rapide:**
1. Cliquez sur **"Notifications"** → onglet **"Emails"**
2. Ajoutez votre adresse email
3. Testez avec le bouton "Test"
4. ✅ Prêt! Votre client email s'ouvrira avec les détails du formulaire

**Idéal pour:** Alertes personnelles, suivi manuel, notifications mobiles

**Documentation:**
- **[EMAIL_QUICK_START.md](./EMAIL_QUICK_START.md)** - Configuration en 2 minutes
- **[EMAIL_NOTIFICATIONS.md](./EMAIL_NOTIFICATIONS.md)** - Guide complet

### 🔗 Webhooks

Envoyez automatiquement les données vers des services externes.

**Configuration Rapide:**
1. Cliquez sur **"Notifications"** → onglet **"Webhooks"**
2. Ajoutez l'URL de votre webhook
3. Configurez les en-têtes (optionnel)
4. Testez et activez

**Idéal pour:** Intégrations automatiques, CRM, bases de données, Slack

**Documentation:**
- **[WEBHOOK_QUICK_START.md](./WEBHOOK_QUICK_START.md)** - Configuration rapide
- **[WEBHOOK_GUIDE.md](./WEBHOOK_GUIDE.md)** - Guide complet

### Format du Payload

Les webhooks reçoivent un POST JSON:

```json
{
  "formData": {
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "countryCode": "+221",
    "phone": "764644290",
    "interests": ["Consulting", "Formation"],
    "services": ["Audit financier"],
    "modules": ["Comptabilité fondamentale"],
    "message": "Message du client"
  },
  "submittedAt": "2024-01-15T10:30:00.000Z",
  "attachmentCount": 2
}
```

### Documentation Complète

- **[WEBHOOK_GUIDE.md](./WEBHOOK_GUIDE.md)** - Guide complet des webhooks
- **[WEBHOOK_QUICK_START.md](./WEBHOOK_QUICK_START.md)** - Configuration rapide pour Zapier, Make.com, Slack, etc.

## 📋 Services Intégrables

### Via Email
- Gmail, Outlook, Apple Mail
- Tout client email desktop ou mobile
- Notifications instantanées

### Via Webhooks
- **Zapier** - Automatisation no-code
- **Make.com** - Workflows complexes
- **n8n** - Solution self-hosted
- **Slack/Discord** - Notifications d'équipe
- **API personnalisée** - Votre propre backend
- **CRM** - Salesforce, HubSpot, etc.

## 🚀 Démarrage Rapide

### Prérequis

1. Compte Supabase configuré (voir [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
2. (Optionnel) Adresse email pour notifications
3. (Optionnel) Compte Zapier/Make.com pour webhooks

### Installation

```bash
npm install
npm run dev
```

### Configuration Supabase

Voir [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) pour les instructions complètes.

### Configuration Notifications (Optionnel)

1. Accédez au formulaire
2. Cliquez sur "Notifications"
3. **Pour emails:** Onglet "Emails" → Ajoutez votre adresse → Testez
4. **Pour webhooks:** Onglet "Webhooks" → Ajoutez l'URL → Testez
5. Consultez l'historique dans l'onglet "Historique"

## 📞 Contact FinancePro

- 📱 Téléphone: +221 76 464 42 90
- 💬 WhatsApp: +221 76 464 42 90
- 📧 Email: financeprofirst@gmail.com
- 📍 Adresse: Touba Khayra, Sénégal

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
