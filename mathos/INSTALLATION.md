# Guide d'Installation - Mathosphère

## 🚀 Démarrage Rapide

### Option 1 : Utilisation Simple (Sans Firebase)

1. Ouvrez simplement `index.html` dans votre navigateur
2. Toutes les fonctionnalités fonctionnent en mode simulation avec localStorage
3. Utilisez les identifiants de démo :
   - Email: `demo@mathosphere.fr`
   - Mot de passe: `mathosphere123`

### Option 2 : Avec Firebase (Recommandé)

#### Étape 1 : Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Suivez les étapes de création

#### Étape 2 : Configurer l'authentification

1. Dans Firebase Console, allez dans **Authentication**
2. Cliquez sur **Commencer**
3. Activez **Email/Password** dans l'onglet "Sign-in method"

#### Étape 3 : Créer Firestore Database

1. Allez dans **Firestore Database**
2. Cliquez sur **Créer une base de données**
3. Choisissez le mode **Production** ou **Test**
4. Sélectionnez une région

#### Étape 4 : Créer les collections

Créez les collections suivantes dans Firestore :

- `users` - Utilisateurs
- `courses` - Cours
- `exercises` - Exercices
- `quizzes` - Quiz
- `products` - Produits boutique
- `forum_discussions` - Discussions forum

Voir `CONFIGURATION.md` pour les structures détaillées.

#### Étape 5 : Obtenir les clés de configuration

1. Allez dans **Paramètres du projet** (icône ⚙️)
2. Faites défiler jusqu'à **Vos applications**
3. Cliquez sur **</>** (Web)
4. Donnez un nom à votre app
5. Copiez les valeurs de configuration

#### Étape 6 : Configurer l'application

1. Ouvrez `mathos/js/firebase-config.js`
2. Remplacez les valeurs par vos propres clés :

```javascript
window.firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop",
  measurementId: "G-XXXXXXXXXX"
};
```

#### Étape 7 : Configurer les règles Firestore

Allez dans **Firestore Database** > **Règles** et collez les règles depuis `CONFIGURATION.md`

#### Étape 8 : Tester

1. Ouvrez `index.html` dans votre navigateur
2. Créez un compte ou connectez-vous
3. Les données seront sauvegardées dans Firebase !

## 📦 Structure des Collections Firestore

### Collection `users`
```javascript
{
  displayName: "Nom de l'utilisateur",
  email: "email@exemple.com",
  role: "student", // ou "teacher", "admin"
  createdAt: Timestamp,
  xp: 0,
  level: 1,
  photoURL: "url_de_l_image" // optionnel
}
```

### Collection `courses`
```javascript
{
  title: "Titre du cours",
  description: "Description",
  level: "6ème",
  duration: "2h30",
  image: "url_image",
  published: true,
  createdAt: Timestamp,
  content: "Contenu HTML du cours"
}
```

### Collection `exercises`
```javascript
{
  title: "Titre de l'exercice",
  description: "Description",
  difficulty: "Facile", // ou "Moyen", "Difficile"
  level: "6ème",
  published: true,
  createdAt: Timestamp
}
```

### Collection `quizzes`
```javascript
{
  title: "Titre du quiz",
  description: "Description",
  difficulty: "Moyen",
  level: "Collège",
  questions: 20,
  published: true,
  createdAt: Timestamp
}
```

### Collection `products`
```javascript
{
  nom: "Nom du produit",
  description: "Description",
  prix: 15000,
  categorie: "livres", // ou "calculatrices", "fournitures"
  stock: 50,
  published: true,
  imageUrl: "url_image",
  createdAt: Timestamp
}
```

### Collection `forum_discussions`
```javascript
{
  titre: "Titre de la discussion",
  contenu: "Contenu de la discussion",
  categorie: "analyse", // ou "algebre", "geometrie", etc.
  auteur: {
    id: "user_id",
    nom: "Nom de l'auteur",
    avatar: "url_avatar"
  },
  dateCreation: Timestamp,
  reponses: 0,
  vues: 0,
  derniereReponse: Timestamp
}
```

## 🎨 Personnalisation

### Modifier les couleurs

Éditez `css/style.css` et modifiez les variables CSS dans `:root` :

```css
:root {
  --primary: #000000;
  --secondary: #6366f1;
  --accent: #8b5cf6;
  /* ... */
}
```

### Modifier les images

Remplacez les URLs Unsplash dans les fichiers HTML par vos propres images.

## 🐛 Dépannage

### Les images ne s'affichent pas
- Vérifiez votre connexion internet (images depuis Unsplash)
- Ou remplacez par des images locales dans le dossier `images/`

### Firebase ne fonctionne pas
- Vérifiez que vous avez bien configuré `firebase-config.js`
- Vérifiez la console du navigateur pour les erreurs
- L'application fonctionne en mode simulation si Firebase n'est pas configuré

### Les animations ne fonctionnent pas
- Utilisez un navigateur moderne (Chrome, Firefox, Edge récents)
- Vérifiez que JavaScript est activé

## 📝 Notes

- L'application fonctionne parfaitement sans Firebase en mode simulation
- Toutes les données sont stockées dans localStorage si Firebase n'est pas configuré
- Les images sont chargées depuis Unsplash (nécessite une connexion internet)


