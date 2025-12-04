# Résolution de l'erreur "Proxy error: Connection refused (localhost:8000)"

## 🎯 Problème résolu

L'erreur "Proxy error: Connection refused (localhost:8000)" apparaissait lorsque des webhooks étaient configurés avec des URLs localhost (comme `http://localhost:8000` ou `http://127.0.0.1:8000`).

## ✅ Corrections appliquées

### 1. **Détection automatique des URLs localhost**
- Les webhooks avec des URLs localhost sont maintenant automatiquement détectés
- Ils sont ignorés lors de la soumission du formulaire (pas de tentative de connexion)
- Un message clair indique qu'ils ont été ignorés

### 2. **Alertes visuelles améliorées**
- Nouveau composant `LocalhostWebhookWarning` qui apparaît en haut des paramètres webhook
- Alertes rouges distinctes pour chaque webhook localhost dans la liste
- Messages explicatifs sur pourquoi localhost ne fonctionne pas

### 3. **Messages d'erreur plus clairs**
- Lors de la soumission: "Webhook ignoré - URL localhost"
- Dans les paramètres: Explications détaillées et solutions recommandées
- Toast notifications avec suggestions d'alternatives

### 4. **Bouton de désactivation rapide**
- Un bouton "Désactiver tous les webhooks localhost" pour résoudre rapidement le problème
- Possibilité de désactiver ou supprimer individuellement les webhooks problématiques

### 5. **Guide de dépannage**
- Nouveau fichier `TROUBLESHOOTING.md` avec:
  - Explication de l'erreur
  - Solutions recommandées (webhook.site, Zapier, Make.com, ngrok)
  - Instructions pas à pas

## 🔧 Comment utiliser les webhooks correctement

### ✅ URLs qui fonctionnent:
- `https://webhook.site/abc-123-def` (gratuit, instantané)
- `https://hooks.zapier.com/hooks/catch/...` (Zapier)
- `https://hook.eu1.make.com/...` (Make.com)
- Toute URL publique accessible sur internet

### ❌ URLs qui ne fonctionnent PAS:
- `http://localhost:8000`
- `http://127.0.0.1:3000`
- Toute URL localhost ou 127.0.0.1

## 📝 Modifications des fichiers

1. **`src/lib/webhooks.ts`**
   - Détection automatique des URLs localhost
   - Messages d'erreur plus clairs
   - Pas de tentative de connexion pour les URLs localhost

2. **`src/App.tsx`**
   - Gestion améliorée des erreurs webhook
   - Messages différenciés pour localhost vs autres erreurs
   - Toast success quand des webhooks réussissent

3. **`src/components/WebhookSettings.tsx`**
   - Nouveau composant d'alerte en haut de page
   - Bouton de désactivation en masse
   - Alertes plus visibles sur les webhooks individuels

4. **`src/components/LocalhostWebhookWarning.tsx`** (nouveau)
   - Composant d'alerte réutilisable
   - Solutions recommandées
   - Bouton de désactivation

5. **`TROUBLESHOOTING.md`** (nouveau)
   - Guide complet de résolution de problèmes
   - Instructions détaillées
   - Liens vers les solutions

## 🚀 Le formulaire fonctionne toujours !

**Important**: Même si un webhook localhost est configuré, le formulaire continue de fonctionner normalement:
- ✅ Les données sont sauvegardées localement
- ✅ Les autres webhooks (avec URLs publiques) fonctionnent
- ✅ Les notifications email fonctionnent
- ✅ Les soumissions sont consultables dans Paramètres → Soumissions

Seuls les webhooks localhost sont ignorés, sans bloquer le reste de l'application.
