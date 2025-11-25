# Tester vos Webhooks Gratuitement

Vous voulez tester vos webhooks avant de les connecter à un vrai service? Voici des outils gratuits pour inspecter et debugger vos webhooks.

## 🧪 Services de Test Webhook

### 1. Webhook.site (Le plus simple)

**URL**: [https://webhook.site](https://webhook.site)

**Utilisation**:
1. Visitez webhook.site
2. Une URL unique vous sera générée automatiquement (ex: `https://webhook.site/12345678-abcd-...`)
3. Copiez cette URL
4. Ajoutez-la dans FinancePro comme webhook
5. Cliquez sur "Tester" ou soumettez le formulaire
6. Retournez sur webhook.site pour voir les données reçues

**Avantages**:
- ✅ Gratuit et sans inscription
- ✅ Interface en temps réel
- ✅ Affiche le payload JSON complet
- ✅ Montre tous les en-têtes HTTP
- ✅ Permet de personnaliser la réponse

---

### 2. RequestBin (Inspect)

**URL**: [https://requestbin.com](https://requestbin.com)

**Utilisation**:
1. Visitez requestbin.com
2. Cliquez "Create a RequestBin"
3. Copiez l'URL générée
4. Ajoutez-la comme webhook dans FinancePro
5. Testez et visualisez les requêtes

**Avantages**:
- ✅ Historique des requêtes
- ✅ Formatage JSON clair
- ✅ Partage d'URL pour collaboration

---

### 3. Pipedream (Avancé)

**URL**: [https://pipedream.com](https://pipedream.com)

**Utilisation**:
1. Créez un compte gratuit sur Pipedream
2. Créez un nouveau workflow
3. Ajoutez un trigger "HTTP / Webhook"
4. Copiez l'URL générée
5. Ajoutez-la dans FinancePro
6. Testez et voyez les données dans Pipedream

**Avantages**:
- ✅ Peut exécuter du code Node.js
- ✅ Connexion à des milliers de services
- ✅ Stockage des données
- ✅ Workflows automatisés

---

## 🧪 Exemple de Test Complet

### Scénario: Tester avant production

1. **Créez un webhook de test sur webhook.site**
   ```
   URL: https://webhook.site/abc123...
   ```

2. **Ajoutez dans FinancePro**
   - Nom: `Test - Webhook.site`
   - URL: L'URL copiée
   - Activé: ✅

3. **Cliquez sur "Tester"**
   - Vérifiez que webhook.site reçoit les données
   - Inspectez le payload JSON
   - Vérifiez tous les champs

4. **Testez avec une vraie soumission**
   - Remplissez le formulaire complètement
   - Ajoutez des fichiers
   - Soumettez
   - Vérifiez que `attachmentCount` est correct

5. **Vérifiez les logs**
   - Ouvrez "Webhooks" → onglet "Historique"
   - Vérifiez le statut "Succès"
   - Notez le code HTTP 200

6. **Remplacez par votre webhook réel**
   - Une fois validé, modifiez le webhook
   - Changez l'URL pour votre service réel (Zapier, Make, etc.)
   - Testez à nouveau

---

## 📝 Payload d'Exemple

Voici exactement ce que votre webhook recevra:

```json
{
  "formData": {
    "name": "Test Utilisateur",
    "email": "test@example.com",
    "countryCode": "+221",
    "phone": "764644290",
    "interests": [
      "Consulting",
      "Formation"
    ],
    "services": [
      "Audit financier"
    ],
    "modules": [
      "Comptabilité fondamentale"
    ],
    "message": "Ceci est un message de test"
  },
  "submittedAt": "2024-01-27T14:30:45.123Z",
  "attachmentCount": 0
}
```

**En-têtes HTTP reçus**:
```
Content-Type: application/json
[Vos en-têtes personnalisés]
```

---

## ⚠️ Points Importants

### Ce qui est Envoyé
- ✅ Toutes les données du formulaire
- ✅ Horodatage de soumission
- ✅ Nombre de fichiers joints

### Ce qui N'est PAS Envoyé
- ❌ Les fichiers eux-mêmes (stockés dans Supabase uniquement)
- ❌ L'ID de la soumission Supabase

### Sécurité
- 🔒 Utilisez HTTPS uniquement
- 🔒 Ajoutez un token dans les en-têtes pour vos APIs
- 🔒 Ne partagez jamais vos URLs webhook publiquement

---

## 🔍 Déboguer un Webhook qui Échoue

### 1. Vérifiez l'URL
```
✅ Bon: https://hooks.zapier.com/hooks/catch/123/abc/
❌ Mauvais: http://hooks.zapier.com/... (pas de HTTPS)
❌ Mauvais: hooks.zapier.com/... (manque https://)
```

### 2. Vérifiez les En-têtes
```json
✅ Bon: {"Authorization": "Bearer abc123"}
❌ Mauvais: {Authorization: Bearer abc123} (manque guillemets)
❌ Mauvais: {"Authorization": "Bearer abc123",} (virgule finale)
```

### 3. Consultez l'Historique
- Ouvrez "Webhooks" → "Historique"
- Regardez le code d'erreur:
  - `200-299`: Succès ✅
  - `400`: Mauvaise requête (vérifiez le format)
  - `401/403`: Problème d'authentification
  - `404`: URL incorrecte
  - `500`: Erreur serveur

### 4. Utilisez le Bouton "Tester"
- Plus rapide que de remplir tout le formulaire
- Envoie un payload de test
- Affiche le résultat immédiatement

---

## 💡 Conseils Pro

1. **Testez d'abord sur webhook.site** avant d'utiliser votre service réel
2. **Gardez un webhook de test actif** pour diagnostiquer les problèmes
3. **Utilisez des noms clairs** pour vos webhooks (ex: "Zapier CRM Prod", "Slack Test")
4. **Désactivez plutôt que supprimer** pour garder la configuration
5. **Consultez les logs régulièrement** pour détecter les pannes

---

## 📞 Besoin d'Aide?

Si vous rencontrez des problèmes:

1. Consultez [WEBHOOK_GUIDE.md](./WEBHOOK_GUIDE.md) pour le guide complet
2. Vérifiez [WEBHOOK_QUICK_START.md](./WEBHOOK_QUICK_START.md) pour votre service
3. Contactez le support:
   - 📧 financeprofirst@gmail.com
   - 📱 +221 76 464 42 90 (WhatsApp)
