# Guide d'Intégration Webhook

Ce guide explique comment configurer et utiliser les webhooks pour envoyer automatiquement les données du formulaire vers des services externes comme Zapier, Make.com, n8n, ou votre propre API.

## Qu'est-ce qu'un Webhook?

Un webhook est une URL qui reçoit automatiquement les données du formulaire lorsqu'un utilisateur soumet sa demande. Cela vous permet d'intégrer le formulaire avec d'autres outils et services sans programmation.

## Configuration des Webhooks

### Accéder aux Paramètres

1. Cliquez sur le bouton **"Webhooks"** en haut à droite du formulaire
2. Vous verrez deux onglets: **Configuration** et **Historique**

### Ajouter un Webhook

1. Dans l'onglet Configuration, cliquez sur **"Ajouter"**
2. Remplissez les informations:
   - **Nom**: Un nom descriptif (ex: "Zapier CRM", "Slack Notifications")
   - **URL**: L'URL du webhook fournie par votre service
   - **En-têtes** (optionnel): Headers HTTP personnalisés au format JSON

3. Cliquez sur **"Ajouter le webhook"**

### Format des En-têtes Personnalisés

Les en-têtes doivent être au format JSON valide:

```json
{
  "Authorization": "Bearer YOUR_API_TOKEN",
  "X-Custom-Header": "valeur"
}
```

## Format du Payload

Chaque webhook reçoit un POST avec ce format JSON:

```json
{
  "formData": {
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "countryCode": "+221",
    "phone": "764644290",
    "interests": ["Consulting", "Formation"],
    "services": ["Audit financier", "Conseil stratégique"],
    "modules": ["Comptabilité fondamentale"],
    "message": "Je souhaite en savoir plus sur vos services"
  },
  "submittedAt": "2024-01-15T10:30:00.000Z",
  "attachmentCount": 2
}
```

**Note**: Les fichiers joints ne sont pas envoyés aux webhooks. Seul le nombre de fichiers (`attachmentCount`) est inclus. Les fichiers sont stockés dans Supabase Storage.

## Intégrations Courantes

### Zapier

1. Créez un nouveau Zap dans Zapier
2. Choisissez "Webhooks by Zapier" comme déclencheur
3. Sélectionnez "Catch Hook"
4. Copiez l'URL du webhook fournie
5. Ajoutez cette URL dans le formulaire FinancePro
6. Testez en soumettant le formulaire
7. Configurez les actions Zapier (créer un contact, envoyer un email, etc.)

### Make.com (anciennement Integromat)

1. Créez un nouveau scénario dans Make
2. Ajoutez un module "Webhooks" → "Custom webhook"
3. Créez un nouveau webhook et copiez l'URL
4. Ajoutez l'URL dans le formulaire FinancePro
5. Testez la soumission pour capturer la structure des données
6. Ajoutez les modules Make pour traiter les données

### n8n (Self-hosted)

1. Créez un nouveau workflow dans n8n
2. Ajoutez un nœud "Webhook"
3. Configurez le nœud en mode "POST"
4. Copiez l'URL de production du webhook
5. Ajoutez l'URL dans le formulaire FinancePro
6. Configurez vos nœuds de traitement

### Slack

Pour envoyer des notifications Slack:

1. Créez une Slack App dans votre workspace
2. Activez "Incoming Webhooks"
3. Ajoutez le webhook à un canal
4. Copiez l'URL du webhook
5. Ajoutez l'URL dans le formulaire

Le message sera envoyé tel quel. Pour formater, utilisez Zapier ou Make comme intermédiaire.

### API Personnalisée

Votre endpoint doit:
- Accepter les requêtes POST
- Accepter le Content-Type: application/json
- Retourner un code HTTP 2xx en cas de succès
- Avoir CORS configuré si nécessaire

Exemple d'endpoint Node.js/Express:

```javascript
app.post('/api/webhook/financepro', async (req, res) => {
  try {
    const { formData, submittedAt, attachmentCount } = req.body
    
    // Traitez les données
    console.log('Nouveau contact:', formData.name)
    
    // Envoyez à votre CRM, base de données, etc.
    await saveToCRM(formData)
    
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Processing failed' })
  }
})
```

## Gestion des Webhooks

### Activer/Désactiver

Utilisez le switch à côté de chaque webhook pour l'activer ou le désactiver temporairement sans le supprimer.

### Modifier

Cliquez sur l'icône crayon pour modifier le nom, l'URL ou les en-têtes d'un webhook existant.

### Supprimer

Cliquez sur l'icône corbeille pour supprimer définitivement un webhook.

## Historique des Envois

L'onglet **"Historique"** affiche les 100 derniers envois de webhooks avec:
- Le statut (succès/échec)
- Le code HTTP de réponse
- L'horodatage
- Les messages d'erreur éventuels

Cela vous permet de diagnostiquer les problèmes d'intégration.

## Sécurité

### Bonnes Pratiques

- ✅ Utilisez HTTPS pour toutes les URLs de webhook
- ✅ Ajoutez un token d'authentification dans les en-têtes si possible
- ✅ Vérifiez régulièrement l'historique pour détecter les échecs
- ✅ Désactivez les webhooks inutilisés
- ❌ Ne partagez jamais vos URLs de webhook publiquement
- ❌ N'incluez pas de secrets dans l'URL (utilisez les en-têtes)

### Validation côté Serveur

Si vous utilisez votre propre API, vérifiez toujours:
- La provenance des données
- Le format du payload
- Les valeurs attendues
- Ajoutez un token secret dans les en-têtes pour vérifier l'authenticité

## Dépannage

### Le webhook ne reçoit rien

- Vérifiez que le webhook est activé (switch en position ON)
- Vérifiez l'URL (doit commencer par https://)
- Consultez l'historique pour voir les erreurs
- Testez l'URL avec un outil comme Postman

### Erreur "Connection refused" ou "Network request failed"

- Le serveur webhook est inaccessible ou éteint
- **URLs localhost (http://localhost:8000)** : Ces webhooks ne fonctionnent que si vous exécutez un serveur local sur votre machine. Si vous voyez cette erreur :
  - Vérifiez que votre serveur de développement est démarré
  - Ou désactivez/supprimez le webhook localhost si vous ne testez pas en local
  - Les webhooks localhost ne fonctionneront jamais en production - utilisez des services publics comme Zapier, Make.com ou ngrok pour les tests
- Vérifiez votre connexion Internet
- Vérifiez que l'URL est correcte et accessible publiquement

### Erreur 401/403

- Problème d'authentification
- Vérifiez les en-têtes d'autorisation
- Vérifiez que le token API est valide

### Erreur 500

- Le serveur webhook a rencontré une erreur
- Vérifiez les logs de votre serveur
- Contactez le support du service (Zapier, Make, etc.)

### Timeout

- Le webhook prend plus de 10 secondes à répondre
- Optimisez le traitement côté serveur
- Envisagez un traitement asynchrone

## Limitations

- **Timeout**: Les webhooks ont un délai d'attente de 10 secondes
- **Tentatives**: Aucune nouvelle tentative automatique en cas d'échec
- **Fichiers**: Les fichiers ne sont pas envoyés aux webhooks (stockés uniquement dans Supabase)
- **Logs**: Seuls les 100 derniers envois sont conservés

## Support

Pour obtenir de l'aide sur les intégrations webhook:

- 📧 Email: financeprofirst@gmail.com
- 📱 WhatsApp: +221 76 464 42 90
- 📍 Localisation: Touba Khayra, Sénégal
