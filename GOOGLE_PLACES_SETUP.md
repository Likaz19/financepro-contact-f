# Configuration Google Places API

## Vue d'ensemble

L'autocomplétion d'adresse utilise Google Places API pour suggérer des adresses en temps réel pendant que l'utilisateur tape. Cette fonctionnalité est optionnelle et améliore l'expérience utilisateur lors de la saisie d'adresses.

## Pourquoi utiliser Google Places API ?

- ✅ **Précision** : Adresses validées et standardisées
- ✅ **Expérience utilisateur** : Saisie rapide avec suggestions automatiques
- ✅ **International** : Support de millions d'adresses dans le monde entier
- ✅ **Géolocalisation** : Coordonnées GPS incluses (pour futures fonctionnalités)

## Prérequis

- Compte Google Cloud Platform
- Carte de crédit (pour activer la facturation, mais **200$ de crédit gratuit/mois**)

## Guide de configuration (5 minutes)

### Étape 1: Créer un projet Google Cloud

1. Accédez à [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquez sur **"Sélectionner un projet"** en haut
3. Cliquez sur **"Nouveau projet"**
4. Nommez votre projet (ex: "FinancePro Forms")
5. Cliquez sur **"Créer"**

### Étape 2: Activer la facturation

1. Dans le menu ☰, allez dans **"Facturation"**
2. Cliquez sur **"Associer un compte de facturation"**
3. Suivez les étapes pour ajouter votre carte de crédit
4. **Note**: Vous recevez 200$ de crédit gratuit par mois. L'autocomplétion coûte environ 0.017$ par session (session = utilisateur remplissant le formulaire), soit ~11,000 sessions gratuites/mois.

### Étape 3: Activer Places API

1. Dans le menu ☰, allez dans **"API et services" → "Bibliothèque"**
2. Recherchez **"Places API"**
3. Cliquez sur **"Places API"**
4. Cliquez sur **"Activer"**

### Étape 4: Créer une clé API

1. Dans le menu ☰, allez dans **"API et services" → "Identifiants"**
2. Cliquez sur **"+ Créer des identifiants"**
3. Sélectionnez **"Clé API"**
4. Une clé sera générée (ex: `AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXX`)
5. **Important**: Cliquez sur **"Restreindre la clé"**

### Étape 5: Sécuriser votre clé API (IMPORTANT)

Pour éviter une utilisation non autorisée:

1. Dans les paramètres de la clé:
2. Sous **"Restrictions relatives à l'application"**:
   - Sélectionnez **"Référents HTTP (sites web)"**
   - Ajoutez votre domaine:
     - `https://votredomaine.com/*`
     - `https://*.github.dev/*` (si vous utilisez GitHub Codespaces)
     - `http://localhost:*` (pour développement local)
3. Sous **"Restrictions relatives à l'API"**:
   - Sélectionnez **"Restreindre la clé"**
   - Choisissez **"Places API"**
4. Cliquez sur **"Enregistrer"**

### Étape 6: Copier et configurer dans l'application

1. Copiez votre clé API
2. Dans le formulaire FinancePro, cliquez sur **"Paramètres" (⚙️)**
3. Allez dans l'onglet **"Adresses"**
4. Cliquez sur **"Configurer"**
5. Collez votre clé API
6. Cliquez sur **"Enregistrer"**

✅ **C'est tout !** L'autocomplétion d'adresse est maintenant active.

## Test de l'intégration

1. Revenez au formulaire de contact
2. Dans le champ **"Adresse"**, vous devriez voir:
   - Une icône de localisation 📍
   - Un badge "Auto"
   - Le placeholder "Commencez à taper une adresse..."
3. Tapez quelques lettres d'une adresse
4. Des suggestions devraient apparaître
5. Sélectionnez une suggestion pour remplir automatiquement

## Tarification

### Gratuit
- **200$ de crédit gratuit/mois** (offre Google Cloud permanente)
- Équivaut à ~11,000 sessions d'autocomplétion/mois

### Au-delà du gratuit
- **Autocomplete - Per Session**: 0.017$ USD par session
- **Une session** = un utilisateur utilisant l'autocomplétion une fois pendant le remplissage du formulaire
- Les 200$ de crédit couvrent environ 11,700 sessions/mois

**Exemple de coût réel:**
- 100 soumissions de formulaire/mois = ~1.70$ → **Couvert par le crédit gratuit**
- 1,000 soumissions/mois = ~17$ → **Couvert par le crédit gratuit**
- 10,000 soumissions/mois = ~170$ → **Couvert par le crédit gratuit**

## Désactivation

Pour désactiver l'autocomplétion:

1. Allez dans **"Paramètres" → "Adresses"**
2. Cliquez sur **"Supprimer"**
3. Le champ d'adresse redeviendra un champ de texte standard

## Sécurité

### ✅ Bonnes pratiques appliquées

- ✅ La clé API est stockée côté client (dans le navigateur de l'utilisateur)
- ✅ Les restrictions de domaine empêchent l'utilisation depuis d'autres sites
- ✅ Les restrictions d'API limitent l'utilisation à Places API uniquement
- ✅ Aucune clé API n'est partagée publiquement dans le code

### ⚠️ Important

- Ne partagez jamais votre clé API publiquement
- Configurez toujours les restrictions de domaine
- Surveillez votre utilisation dans Google Cloud Console

## Surveillance de l'utilisation

1. Accédez à [Google Cloud Console](https://console.cloud.google.com/)
2. Menu ☰ → **"API et services" → "Tableau de bord"**
3. Cliquez sur **"Places API"**
4. Consultez les graphiques d'utilisation
5. Configurez des alertes de budget si nécessaire

## Support

### Problèmes courants

**"Erreur lors du chargement de Google Places API"**
- Vérifiez que la clé API est correcte
- Vérifiez que Places API est activée
- Vérifiez les restrictions de domaine

**"Aucune suggestion n'apparaît"**
- Vérifiez votre connexion internet
- Vérifiez que vous avez tapé au moins 3 caractères
- Vérifiez la console du navigateur pour des erreurs

**"This API project is not authorized to use this API"**
- Places API n'est pas activée pour votre projet
- Retournez à l'étape 3 ci-dessus

### Ressources

- [Documentation Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Tarification détaillée](https://developers.google.com/maps/billing-and-pricing/pricing)
- [Support Google Cloud](https://cloud.google.com/support)

## Alternative sans Google Places API

Si vous ne souhaitez pas utiliser Google Places API, le formulaire fonctionne parfaitement avec un champ d'adresse standard. Les utilisateurs pourront taper leur adresse manuellement sans autocomplétion.
