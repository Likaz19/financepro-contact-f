# Configuration Rapide des Webhooks

Ce document fournit des instructions étape par étape pour configurer les webhooks avec les services les plus populaires.

## 🔷 Zapier (Recommandé pour les débutants)

### Étape 1: Créer un Zap
1. Connectez-vous à [Zapier](https://zapier.com)
2. Cliquez sur "Create Zap"
3. Recherchez et sélectionnez "Webhooks by Zapier" comme déclencheur (Trigger)

### Étape 2: Configurer le Webhook
1. Choisissez l'événement "Catch Hook"
2. Zapier vous donnera une URL comme: `https://hooks.zapier.com/hooks/catch/123456/abcdef/`
3. **Copiez cette URL**

### Étape 3: Ajouter dans FinancePro
1. Dans le formulaire FinancePro, cliquez sur "Webhooks"
2. Cliquez sur "Ajouter"
3. Nom: `Zapier CRM`
4. URL: Collez l'URL copiée
5. Cliquez "Ajouter le webhook"

### Étape 4: Tester
1. Cliquez sur "Tester" à côté du webhook
2. Retournez dans Zapier et cliquez sur "Test trigger"
3. Zapier devrait recevoir les données de test

### Étape 5: Configurer les Actions
Maintenant vous pouvez ajouter des actions comme:
- Créer un contact dans votre CRM (Salesforce, HubSpot, etc.)
- Envoyer un email de notification
- Ajouter une ligne dans Google Sheets
- Créer une tâche dans Asana/Trello

---

## 🔶 Make.com (anciennement Integromat)

### Étape 1: Créer un Scénario
1. Connectez-vous à [Make.com](https://make.com)
2. Créez un nouveau scénario
3. Ajoutez un module "Webhooks"

### Étape 2: Configurer le Webhook
1. Cliquez sur "Create a webhook"
2. Donnez-lui un nom: `FinancePro Form`
3. Make générera une URL
4. **Copiez cette URL**

### Étape 3: Ajouter dans FinancePro
1. Dans le formulaire FinancePro, cliquez sur "Webhooks"
2. Cliquez sur "Ajouter"
3. Nom: `Make.com Automation`
4. URL: Collez l'URL copiée
5. Cliquez "Ajouter le webhook"

### Étape 4: Capturer la Structure
1. Cliquez sur "Tester" dans FinancePro
2. Dans Make, cliquez sur "Run once" pour détecter les données
3. Make capturera la structure JSON

### Étape 5: Ajouter des Modules
Ajoutez des modules pour:
- Créer des contacts dans votre CRM
- Envoyer des notifications Slack/Teams
- Synchroniser avec Airtable/Notion
- Déclencher des workflows complexes

---

## 🔵 Slack (Notifications directes)

### Étape 1: Créer une App Slack
1. Allez sur [api.slack.com/apps](https://api.slack.com/apps)
2. Cliquez "Create New App" → "From scratch"
3. Nommez votre app: `FinancePro Notifications`
4. Sélectionnez votre workspace

### Étape 2: Activer les Webhooks Entrants
1. Dans les paramètres de l'app, cliquez "Incoming Webhooks"
2. Activez "Activate Incoming Webhooks"
3. Cliquez "Add New Webhook to Workspace"
4. Sélectionnez le canal qui recevra les notifications
5. **Copiez l'URL du webhook**

### Étape 3: Ajouter dans FinancePro
1. Dans le formulaire FinancePro, cliquez sur "Webhooks"
2. Cliquez sur "Ajouter"
3. Nom: `Slack #ventes`
4. URL: Collez l'URL copiée
5. Cliquez "Ajouter le webhook"

**Note**: Le payload JSON sera affiché brut dans Slack. Pour un formatage personnalisé, utilisez Zapier ou Make comme intermédiaire.

---

## 🟢 Discord (Notifications)

### Étape 1: Créer un Webhook Discord
1. Ouvrez les paramètres de votre serveur Discord
2. Allez dans "Intégrations" → "Webhooks"
3. Cliquez "Nouveau webhook"
4. Nommez-le: `FinancePro Form`
5. Sélectionnez le canal de destination
6. **Copiez l'URL du webhook**

### Étape 2: Ajouter dans FinancePro
1. Dans le formulaire FinancePro, cliquez sur "Webhooks"
2. Cliquez sur "Ajouter"
3. Nom: `Discord #leads`
4. URL: Collez l'URL copiée
5. Cliquez "Ajouter le webhook"

**Note**: Comme pour Slack, le JSON sera affiché brut. Utilisez un service intermédiaire pour le formatage.

---

## 🟣 n8n (Self-hosted)

### Étape 1: Créer un Workflow
1. Ouvrez votre instance n8n
2. Créez un nouveau workflow
3. Ajoutez un nœud "Webhook"

### Étape 2: Configurer le Nœud
1. Méthode HTTP: `POST`
2. Path: `/financepro` (ou autre chemin)
3. Mode de réponse: `Immediately`
4. Copiez l'URL de production (pas l'URL de test)

### Étape 3: Ajouter dans FinancePro
1. Dans le formulaire FinancePro, cliquez sur "Webhooks"
2. Cliquez sur "Ajouter"
3. Nom: `n8n Workflow`
4. URL: Collez l'URL copiée
5. Cliquez "Ajouter le webhook"

### Étape 4: Activer le Workflow
1. Activez votre workflow n8n
2. Testez le webhook depuis FinancePro
3. Les données apparaîtront dans n8n

---

## 🔴 API Personnalisée

### Exemple avec Node.js/Express

```javascript
const express = require('express')
const app = express()

app.use(express.json())

app.post('/api/webhook/financepro', (req, res) => {
  const { formData, submittedAt, attachmentCount } = req.body
  
  console.log('Nouveau contact:', formData.name)
  console.log('Email:', formData.email)
  console.log('Intérêts:', formData.interests)
  
  // Traitez les données (enregistrez en DB, envoyez un email, etc.)
  
  res.status(200).json({ 
    success: true,
    message: 'Données reçues'
  })
})

app.listen(3000)
```

### Exemple avec Python/Flask

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/webhook/financepro', methods=['POST'])
def webhook():
    data = request.json
    form_data = data['formData']
    
    print(f"Nouveau contact: {form_data['name']}")
    print(f"Email: {form_data['email']}")
    
    # Traitez les données
    
    return jsonify({
        'success': True,
        'message': 'Données reçues'
    }), 200

if __name__ == '__main__':
    app.run(port=3000)
```

### Ajouter dans FinancePro
1. Déployez votre API
2. Dans le formulaire FinancePro, cliquez sur "Webhooks"
3. Nom: `Mon API CRM`
4. URL: `https://votredomaine.com/api/webhook/financepro`
5. En-têtes (si nécessaire):
   ```json
   {"Authorization": "Bearer VOTRE_TOKEN_SECRET"}
   ```

---

## 🔧 Dépannage Rapide

### Le webhook ne reçoit rien
- ✅ Vérifiez que le webhook est **activé** (switch ON)
- ✅ Utilisez le bouton **"Tester"** pour vérifier
- ✅ Consultez l'onglet **"Historique"** pour voir les erreurs

### Erreur "Invalid URL"
- L'URL doit commencer par `https://`
- Vérifiez qu'il n'y a pas d'espaces

### Erreur "Timeout"
- Votre serveur met plus de 10 secondes à répondre
- Optimisez le traitement ou répondez immédiatement (200 OK) puis traitez en arrière-plan

### En-têtes invalides
- Les en-têtes doivent être au format JSON strict
- Utilisez des guillemets doubles: `{"key": "value"}`
- Pas de virgule après le dernier élément

---

## 📊 Cas d'Usage Courants

### 1. Ajouter les leads dans un CRM
**Zapier/Make** → Salesforce/HubSpot/Pipedrive
- Créez automatiquement un contact ou lead
- Assignez à un commercial
- Déclenchez un email de bienvenue

### 2. Notification d'équipe
**Webhook** → Slack/Discord/Microsoft Teams
- Alertez votre équipe commerciale
- Incluez les détails du contact
- Ajoutez un lien vers le CRM

### 3. Synchronisation avec Google Sheets
**Zapier/Make** → Google Sheets
- Ajoutez chaque soumission comme nouvelle ligne
- Créez des rapports et tableaux de bord
- Partagez avec l'équipe

### 4. Automatisation Email
**Webhook** → SendGrid/Mailchimp
- Envoyez un email de confirmation au client
- Ajoutez à une liste de newsletter
- Déclenchez une séquence d'emails

### 5. Workflow Personnalisé
**n8n/Make** → Plusieurs services
- Créez des workflows complexes
- Conditions basées sur les intérêts
- Routage intelligent vers différentes équipes

---

## 💡 Conseils

1. **Testez toujours**: Utilisez le bouton "Tester" avant de mettre en production
2. **Surveillez les logs**: Consultez régulièrement l'historique
3. **Redondance**: Configurez plusieurs webhooks pour la fiabilité
4. **Sécurité**: Utilisez des tokens dans les en-têtes pour les APIs personnalisées
5. **Performance**: Les webhooks s'exécutent en parallèle - pas d'impact sur l'utilisateur

---

## 📞 Support

Besoin d'aide avec la configuration?
- 📧 Email: financeprofirst@gmail.com
- 📱 WhatsApp: +221 76 464 42 90
