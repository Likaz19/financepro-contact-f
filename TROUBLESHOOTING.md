# Guide de dépannage - Formulaire FinancePro

## ⚠️ Erreur: "Proxy error: Connection refused (localhost:8000)"

### Cause
Cette erreur se produit lorsque vous avez configuré un webhook avec une URL localhost (comme `http://localhost:8000` ou `http://127.0.0.1:8000`).

### Pourquoi cela ne fonctionne pas ?
Les URLs localhost pointent vers **votre propre machine**. Cette application web fonctionne dans le navigateur et ne peut pas accéder à des serveurs locaux sur votre ordinateur pour des raisons de sécurité.

### ✅ Solutions recommandées

#### Option 1: Utiliser webhook.site (Gratuit et immédiat)
1. Ouvrez [webhook.site](https://webhook.site)
2. Copiez l'URL unique générée (ex: `https://webhook.site/abc123...`)
3. Dans Paramètres → Webhooks, ajoutez cette URL
4. Testez le formulaire - vous verrez les données arriver sur webhook.site en temps réel

#### Option 2: Utiliser Zapier
1. Créez un compte gratuit sur [Zapier](https://zapier.com)
2. Créez un nouveau Zap avec "Webhooks by Zapier" comme déclencheur
3. Copiez l'URL du webhook fournie
4. Utilisez cette URL dans les paramètres du formulaire

#### Option 3: Utiliser Make.com (anciennement Integromat)
1. Créez un compte sur [Make.com](https://www.make.com)
2. Créez un nouveau scénario avec un webhook
3. Copiez l'URL du webhook
4. Utilisez cette URL dans les paramètres

#### Option 4: Exposer votre serveur local (Pour développeurs)
Si vous développez une API locale et souhaitez la tester:
1. Utilisez [ngrok](https://ngrok.com): `ngrok http 8000`
2. Ngrok vous donnera une URL publique temporaire (ex: `https://abc123.ngrok.io`)
3. Utilisez cette URL publique dans les paramètres du webhook

### 🔧 Comment désactiver les webhooks localhost

1. Ouvrez **Paramètres** (icône ⚙️ en haut à droite)
2. Allez dans l'onglet **Webhooks**
3. Trouvez le webhook avec l'URL localhost
4. Désactivez-le avec le switch **OU** supprimez-le avec l'icône 🗑️

### 📊 Le formulaire fonctionne-t-il quand même ?

**OUI !** Le formulaire continue de fonctionner normalement même si un webhook échoue. Les données sont:
- ✅ Sauvegardées localement dans l'application
- ✅ Consultables dans Paramètres → Soumissions
- ✅ Disponibles pour les autres webhooks configurés (s'ils ont des URLs publiques)
- ✅ Envoyées par email (si configuré)

Seul le webhook avec l'URL localhost sera ignoré.

---

## 🔍 Autres erreurs courantes

### "Erreur Supabase: TypeError: Failed to fetch"
**Cause**: Problème de connexion avec la base de données Supabase

**Solution**: 
- Vérifiez votre connexion internet
- Vérifiez que les identifiants Supabase sont corrects dans les variables d'environnement
- Cette erreur n'empêche pas le formulaire de fonctionner - les données sont sauvegardées localement

### Autocomplétion d'adresse ne fonctionne pas
**Cause**: Clé API Google Places manquante ou invalide

**Solution**:
1. Allez dans Paramètres → Adresses
2. Suivez les instructions pour obtenir une clé API Google Places
3. Collez la clé dans le champ prévu

---

## 💡 Besoin d'aide supplémentaire ?

Pour toute question ou problème persistant, consultez:
- La documentation dans le dossier du projet
- Les logs de la console du navigateur (F12 → Console)
- Les messages d'erreur détaillés qui apparaissent dans l'interface
