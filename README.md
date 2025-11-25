# FinancePro - Formulaire de Contact Multi-étapes

Un formulaire de contact professionnel pour FinancePro avec intégration Supabase et webhooks pour l'automatisation.

## 🌟 Fonctionnalités

- ✅ Formulaire multi-étapes avec validation
- ✅ Téléchargement de fichiers (jusqu'à 5 fichiers, 10 Mo chacun)
- ✅ Sélection intelligente du code pays (70+ pays)
- ✅ Validation en temps réel des champs
- ✅ Écran de confirmation avant envoi
- ✅ Intégration Supabase (base de données + stockage)
- ✅ **Webhooks pour services externes (Zapier, Make.com, APIs personnalisées)**
- ✅ Logs des envois webhook
- ✅ Animations fluides et professionnelles
- ✅ Responsive (mobile et desktop)

## 🔗 Intégration Webhook

Le formulaire supporte l'envoi automatique des données vers des services externes via webhooks.

### Configuration Rapide

1. Cliquez sur le bouton **"Webhooks"** dans le formulaire
2. Ajoutez un ou plusieurs webhooks avec:
   - Nom descriptif
   - URL du webhook
   - En-têtes personnalisés (optionnel)
3. Activez/désactivez les webhooks selon vos besoins
4. Testez avec le bouton "Tester"
5. Consultez l'historique des envois

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

- **Zapier** - Automatisation no-code
- **Make.com** - Workflows complexes
- **n8n** - Solution self-hosted
- **Slack/Discord** - Notifications d'équipe
- **API personnalisée** - Votre propre backend

## 🚀 Démarrage Rapide

### Prérequis

1. Compte Supabase configuré (voir [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
2. (Optionnel) Compte Zapier/Make.com pour les webhooks

### Installation

```bash
npm install
npm run dev
```

### Configuration Supabase

Voir [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) pour les instructions complètes.

### Configuration Webhook (Optionnel)

1. Accédez au formulaire
2. Cliquez sur "Webhooks"
3. Ajoutez vos intégrations
4. Testez avec le bouton "Tester"

## 📞 Contact FinancePro

- 📱 Téléphone: +221 76 464 42 90
- 💬 WhatsApp: +221 76 464 42 90
- 📧 Email: financeprofirst@gmail.com
- 📍 Adresse: Touba Khayra, Sénégal

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
