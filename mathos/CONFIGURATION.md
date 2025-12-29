# Configuration Firebase - Mathosphère

## Étapes de configuration

### 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Suivez les étapes de création

### 2. Configurer l'authentification

1. Dans Firebase Console, allez dans **Authentication**
2. Cliquez sur **Commencer**
3. Activez **Email/Password** dans l'onglet "Sign-in method"

### 3. Créer les collections Firestore

Créez les collections suivantes dans **Firestore Database** :

#### Collection `users`
- `displayName` (string)
- `email` (string)
- `role` (string) - valeurs: student, teacher, admin
- `createdAt` (timestamp)
- `xp` (number)
- `level` (number)
- `photoURL` (string, optionnel)

#### Collection `courses`
- `title` (string)
- `description` (string)
- `level` (string)
- `duration` (string)
- `image` (string)
- `published` (boolean)
- `createdAt` (timestamp)
- `content` (string, HTML)

#### Collection `exercises`
- `title` (string)
- `description` (string)
- `difficulty` (string)
- `level` (string)
- `published` (boolean)
- `createdAt` (timestamp)

#### Collection `quizzes`
- `title` (string)
- `description` (string)
- `difficulty` (string)
- `level` (string)
- `questions` (number)
- `published` (boolean)
- `createdAt` (timestamp)

#### Collection `products`
- `nom` (string)
- `description` (string)
- `prix` (number)
- `categorie` (string)
- `stock` (number)
- `published` (boolean)
- `imageUrl` (string)
- `createdAt` (timestamp)

#### Collection `forum_discussions`
- `titre` (string)
- `contenu` (string)
- `categorie` (string)
- `auteur` (object) - {id, nom, avatar}
- `dateCreation` (timestamp)
- `reponses` (number)
- `vues` (number)
- `derniereReponse` (timestamp)

### 4. Configurer les règles Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - lecture publique, écriture authentifiée
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Courses - lecture publique, écriture admin
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Exercices - lecture publique, écriture admin
    match /exercises/{exerciseId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Quiz - lecture publique, écriture admin
    match /quizzes/{quizId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Produits - lecture publique, écriture admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Forum - lecture publique, écriture authentifiée
    match /forum_discussions/{discussionId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.resource.data.auteur.id == request.auth.uid;
    }
  }
}
```

### 5. Mettre à jour la configuration

1. Ouvrez `mathos/js/firebase-config.js`
2. Remplacez les valeurs par vos propres clés Firebase
3. Les clés se trouvent dans Firebase Console > Paramètres du projet > Vos applications

### 6. Activer Storage (optionnel)

1. Allez dans **Storage**
2. Cliquez sur **Commencer**
3. Choisissez les règles de sécurité
4. Les images seront stockées dans Firebase Storage

## Mode simulation

Si Firebase n'est pas configuré, l'application fonctionne en mode simulation avec localStorage. Les données sont stockées localement dans le navigateur.

## Test

1. Ouvrez `mathos/index.html` dans un navigateur
2. Testez la connexion avec les identifiants de démo
3. Les données seront sauvegardées dans localStorage si Firebase n'est pas configuré


