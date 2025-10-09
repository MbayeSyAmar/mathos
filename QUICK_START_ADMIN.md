# 🚀 Guide Rapide : Créer un Admin Firebase

## 📦 Méthode Rapide (Console Firebase)

### Étape 1 : Créer l'utilisateur
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. **Authentication** → **Users** → **Add user**
   - Email : `admin@mathosphere.fr`
   - Password : `VotreMotDePasse123!`
   - Cliquez sur **Add user**
   - ⚠️ **Notez l'UID** de l'utilisateur créé

### Étape 2 : Créer le document Firestore
1. **Firestore Database** → **users** (collection)
2. **Add document** :
   - Document ID : `[L'UID copié à l'étape 1]`
   - Ajoutez les champs suivants :

```
uid: [L'UID de l'utilisateur]
displayName: "Super Admin"
email: "admin@mathosphere.fr"
photoURL: null
role: "super_admin"          ← ⭐ IMPORTANT
createdAt: [timestamp]
lastLogin: [timestamp]
bio: ""
level: ""
school: ""
interests: []
notifications: {
  email: true
  newCourses: true
  newExercises: false
  newQuizzes: true
  forum: true
}
stats: {
  coursesCompleted: 0
  exercisesCompleted: 0
  quizzesCompleted: 0
  discussionsCreated: 0
  repliesPosted: 0
}
```

### Étape 3 : Tester
1. Allez sur `/admin/login`
2. Email : `admin@mathosphere.fr`
3. Password : `VotreMotDePasse123!`
4. ✅ Vous devriez être redirigé vers le dashboard admin !

---

## 🛠️ Méthode Avancée (Script Node.js)

### Installation
```bash
npm install firebase-admin
```

### Configuration
1. **Firebase Console** → **Project Settings** → **Service Accounts**
2. Cliquez sur **Generate new private key**
3. Téléchargez le fichier JSON
4. Renommez-le en `serviceAccountKey.json`
5. Placez-le à la racine du projet

### Utilisation
```bash
# Ouvrir le fichier
code scripts/create-admin.js

# Décommenter et modifier la fonction souhaitée
# Puis exécuter :
node scripts/create-admin.js
```

---

## 👥 Rôles Disponibles

| Rôle | Valeur Firestore | Dashboard |
|------|------------------|-----------|
| Super Admin | `super_admin` | `/admin/super/dashboard` |
| Professeur | `teacher` | `/admin/professeur/dashboard` |
| Tuteur | `tutor` | `/admin/tuteur/dashboard` |
| Rédacteur | `editor` | `/admin/redacteur/dashboard` |
| Étudiant | `student` | `/dashboard` |

---

## 🔐 Sécurité

### ⚠️ Important
- Ne JAMAIS commiter `serviceAccountKey.json`
- Déjà ajouté dans `.gitignore`
- Les utilisateurs ne peuvent pas modifier leur propre rôle
- Les règles Firestore empêchent l'escalade de privilèges

### Règles Firestore Recommandées
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // L'utilisateur peut lire son propre document
      allow read: if request.auth.uid == userId;
      
      // L'utilisateur peut modifier son document SAUF le champ role
      allow update: if request.auth.uid == userId
                    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']);
    }
  }
}
```

---

## 🐛 Dépannage

### Erreur : "Accès refusé"
✅ Vérifiez que le champ `role` existe dans Firestore  
✅ Vérifiez l'orthographe du rôle (`super_admin`, pas `superadmin`)

### Erreur : "Utilisateur non trouvé"
✅ Créez le document Firestore avec le bon UID  
✅ Le document doit être dans la collection `users`

### Redirection échoue
✅ Vérifiez que le cookie de session est créé  
✅ Ouvrez la console du navigateur pour voir les erreurs

---

## 📚 Documentation Complète

Consultez `FIREBASE_ADMIN_SETUP.md` pour plus de détails.
