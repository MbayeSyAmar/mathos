# 🔐 Configuration des Rôles Admin dans Firebase

## 📋 Structure des Rôles

Les rôles disponibles dans Mathosphère :
- `student` - Étudiant (par défaut)
- `teacher` - Professeur
- `tutor` - Tuteur
- `editor` - Rédacteur
- `super_admin` - Super Administrateur

## 🗄️ Structure Firestore

### Collection: `users`
Chaque document utilisateur doit avoir cette structure :

```json
{
  "uid": "user_unique_id",
  "displayName": "Nom de l'utilisateur",
  "email": "email@exemple.com",
  "photoURL": null,
  "role": "super_admin",  // ← Champ important pour les rôles
  "createdAt": "timestamp",
  "lastLogin": "timestamp",
  "bio": "",
  "level": "",
  "school": "",
  "interests": [],
  "notifications": {
    "email": true,
    "newCourses": true,
    "newExercises": false,
    "newQuizzes": true,
    "forum": true
  },
  "stats": {
    "coursesCompleted": 0,
    "exercisesCompleted": 0,
    "quizzesCompleted": 0,
    "discussionsCreated": 0,
    "repliesPosted": 0
  }
}
```

## 🛠️ Comment créer un utilisateur Admin dans Firebase

### Option 1 : Via la Console Firebase (Recommandé)

1. **Allez dans Firebase Console** : https://console.firebase.google.com/
2. **Sélectionnez votre projet**
3. **Firestore Database** → Cliquez sur votre collection `users`
4. **Trouvez l'utilisateur** que vous voulez promouvoir admin
5. **Modifiez le champ `role`** :
   - Cliquez sur le document
   - Trouvez le champ `role`
   - Changez la valeur de `student` à `super_admin`, `teacher`, `tutor`, ou `editor`
   - Sauvegardez

### Option 2 : Via Firebase Authentication + Firestore

1. **Créez d'abord l'utilisateur dans Authentication** :
   - Firebase Console → Authentication → Users
   - Cliquez sur "Add user"
   - Entrez email et mot de passe
   - Notez l'UID de l'utilisateur créé

2. **Créez/Modifiez le document Firestore** :
   - Firestore Database → `users` collection
   - Créez un nouveau document avec l'UID de l'utilisateur
   - Ajoutez tous les champs comme dans la structure ci-dessus
   - **Important** : Mettez `"role": "super_admin"` (ou autre rôle)

### Option 3 : Via un Script d'Administration

Créez un fichier `scripts/create-admin.js` :

```javascript
// Nécessite Firebase Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createAdmin(email, password, displayName, role = 'super_admin') {
  try {
    // Créer l'utilisateur dans Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    console.log('✅ Utilisateur créé:', userRecord.uid);

    // Créer le document Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      displayName: displayName,
      email: email,
      photoURL: null,
      role: role,  // ← Rôle admin
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      bio: '',
      level: '',
      school: '',
      interests: [],
      notifications: {
        email: true,
        newCourses: true,
        newExercises: false,
        newQuizzes: true,
        forum: true,
      },
      stats: {
        coursesCompleted: 0,
        exercisesCompleted: 0,
        quizzesCompleted: 0,
        discussionsCreated: 0,
        repliesPosted: 0,
      },
    });

    console.log('✅ Document Firestore créé avec le rôle:', role);
    console.log('📧 Email:', email);
    console.log('🔑 UID:', userRecord.uid);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exemples d'utilisation :
createAdmin('admin@mathosphere.fr', 'SecurePassword123!', 'Super Admin', 'super_admin');
// createAdmin('prof@mathosphere.fr', 'ProfPass123!', 'Professeur Démo', 'teacher');
// createAdmin('tutor@mathosphere.fr', 'TutorPass123!', 'Tuteur Démo', 'tutor');
```

## 🔒 Sécurité : Règles Firestore

Ajoutez ces règles dans Firestore pour protéger les rôles :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Collection users
    match /users/{userId} {
      // Lecture : l'utilisateur peut lire son propre document
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Écriture : l'utilisateur peut modifier son document SAUF le champ role
      allow update: if request.auth != null 
                    && request.auth.uid == userId
                    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'uid']);
      
      // Création : lors de l'inscription (le rôle par défaut est 'student')
      allow create: if request.auth != null 
                    && request.auth.uid == userId
                    && request.resource.data.role == 'student';
    }
    
    // Seuls les admins peuvent lire tous les utilisateurs
    match /users/{userId} {
      allow read: if request.auth != null 
                  && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'teacher'];
    }
  }
}
```

## 🎯 Utilisation dans le Code

Le rôle est automatiquement chargé via `auth-context.tsx` :

```typescript
const { userData } = useAuth();

// Vérifier le rôle
if (userData?.role === 'super_admin') {
  // Afficher interface super admin
}

if (['super_admin', 'teacher', 'tutor', 'editor'].includes(userData?.role)) {
  // Accès admin
}
```

## ✅ Checklist de Configuration

- [ ] Créer un utilisateur dans Firebase Authentication
- [ ] Créer/Modifier le document dans Firestore `users/{uid}`
- [ ] Définir le champ `role` avec la valeur appropriée
- [ ] Configurer les règles de sécurité Firestore
- [ ] Tester la connexion avec l'email/mot de passe
- [ ] Vérifier que l'utilisateur est redirigé vers le bon dashboard

## 📱 Exemple Complet

Pour créer rapidement un super admin de test :

1. **Firebase Console** → **Authentication** → **Add user**
   - Email: `admin@mathosphere.fr`
   - Password: `AdminTest123!`

2. **Firestore Database** → **users** → **Add document**
   - Document ID: (l'UID de l'utilisateur créé ci-dessus)
   - Copiez la structure JSON ci-dessus
   - Changez `"role": "super_admin"`

3. **Testez** :
   - Allez sur `/admin/login`
   - Email: `admin@mathosphere.fr`
   - Password: `AdminTest123!`
   - Devrait rediriger vers `/admin/super/dashboard`

## 🚨 Important

- **Ne jamais** permettre aux utilisateurs de modifier leur propre rôle
- **Toujours** vérifier les rôles côté serveur (via Firebase Functions ou API routes)
- **Utiliser** Firebase Admin SDK pour les opérations sensibles
- **Sécuriser** les règles Firestore pour empêcher l'escalade de privilèges
