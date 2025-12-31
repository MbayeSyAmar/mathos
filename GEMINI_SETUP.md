# Configuration du Chatbot MathBot avec Gemini

## 📋 Prérequis

1. **Obtenir une clé API Gemini gratuite** :
   - Allez sur https://aistudio.google.com/app/apikey
   - Connectez-vous avec votre compte Google
   - Cliquez sur "Créer une clé API"
   - Copiez la clé générée

## 🔧 Configuration

### 1. Ajouter la clé API dans `.env.local`

Créez ou modifiez le fichier `.env.local` à la racine du projet et ajoutez :

```env
GEMINI_API_KEY=votre_cle_api_ici
```

**Important** : Remplacez `votre_cle_api_ici` par votre vraie clé API.

### 2. Redémarrer le serveur de développement

Après avoir ajouté la clé API, **redémarrez** le serveur :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez-le
npm run dev
```

Les variables d'environnement ne sont chargées qu'au démarrage du serveur.

## 🤖 Modèle utilisé

Le chatbot utilise le modèle **`gemini-2.5-flash`** via l'API REST Gemini v1.

**Modèles disponibles selon la documentation officielle** :
- `gemini-2.5-flash` - ✅ Modèle rapide et efficace (recommandé)
- `gemini-2.5-pro` - Plus puissant, meilleure qualité
- `gemini-3-pro` - Le plus récent et performant
- Variantes : Flash Lite, etc.

**⚠️ Important** : 
- Le SDK `@google/generative-ai` utilise l'API v1beta qui n'est plus accessible pour les modèles texte
- **Solution** : Utilisation de l'API REST Gemini v1 directement avec `fetch` (stable, gratuite, compatible)
- Les modèles Gemini 2.5+ sont disponibles via l'API REST v1

Pour changer de modèle, modifiez `MODEL_NAME` dans `app/api/gemini/route.ts`.

## 🐛 Dépannage

### Erreur : "API Gemini non configurée"

- Vérifiez que le fichier `.env.local` existe à la racine du projet
- Vérifiez que `GEMINI_API_KEY` est bien défini dans ce fichier
- **Redémarrez le serveur** après avoir ajouté/modifié la variable

### Erreur : "Clé API invalide"

- Vérifiez que votre clé API est correcte
- Assurez-vous qu'il n'y a pas d'espaces avant/après la clé
- Vérifiez que votre clé API est active sur Google AI Studio

### Erreur : "Modèle non trouvé"

- Le modèle `gemini-2.5-flash` n'existe pas
- Utilisez `gemini-2.0-flash-exp` ou `gemini-1.5-flash`
- Vérifiez la documentation Google pour les modèles disponibles

## 📝 Notes

- La clé API est utilisée uniquement côté serveur (dans `app/api/gemini/route.ts`)
- Ne commitez jamais votre fichier `.env.local` (il est déjà dans `.gitignore`)
- La clé API gratuite a des limites de taux, mais suffisante pour le développement

