# 🏗️ Architecture des Rôles - Mathosphère

## 📊 Vue d'ensemble

```
┌─────────────────────────────────────────────────┐
│              SYSTÈME DE RÔLES                    │
├─────────────────────────────────────────────────┤
│                                                  │
│  👤 Student (student)                            │
│  └─ Accès : /dashboard, /cours, /exercices      │
│                                                  │
│  👨‍🏫 Professeur (teacher)                        │
│  └─ Accès : /admin/professeur/*                  │
│     + Toutes les fonctions étudiant             │
│                                                  │
│  👨‍🎓 Tuteur (tutor)                              │
│  └─ Accès : /admin/tuteur/*                      │
│     + Suivi personnalisé des étudiants          │
│                                                  │
│  ✍️ Rédacteur (editor)                           │
│  └─ Accès : /admin/redacteur/*                   │
│     + Création/édition de contenu               │
│                                                  │
│  👑 Super Admin (super_admin)                    │
│  └─ Accès : /admin/super/*                       │
│     + TOUS les accès et permissions             │
│                                                  │
└─────────────────────────────────────────────────┘
```

## 🔐 Matrice des Permissions

| Fonctionnalité | Student | Teacher | Tutor | Editor | Super Admin |
|----------------|---------|---------|-------|--------|-------------|
| Voir les cours | ✅ | ✅ | ✅ | ✅ | ✅ |
| Faire des exercices | ✅ | ✅ | ✅ | ✅ | ✅ |
| Participer au forum | ✅ | ✅ | ✅ | ✅ | ✅ |
| Créer du contenu | ❌ | ✅ | ❌ | ✅ | ✅ |
| Gérer les étudiants | ❌ | ✅ | ✅ | ❌ | ✅ |
| Voir les statistiques | ❌ | ✅ | ✅ | ❌ | ✅ |
| Gérer les professeurs | ❌ | ❌ | ❌ | ❌ | ✅ |
| Accès boutique admin | ❌ | ✅ | ❌ | ❌ | ✅ |
| Configuration système | ❌ | ❌ | ❌ | ❌ | ✅ |

## 🗺️ Routes et Redirections

### Routes Publiques
- `/` - Page d'accueil
- `/connexion` - Connexion utilisateur
- `/inscription` - Inscription
- `/blog` - Blog public
- `/boutique` - Boutique
- `/contact` - Contact

### Routes Étudiants (Authentification requise)
- `/dashboard` - Tableau de bord étudiant
- `/cours` - Liste des cours
- `/exercices` - Exercices
- `/quiz` - Quiz
- `/videos` - Vidéos
- `/forum` - Forum de discussion
- `/encadrement` - Demande d'encadrement

### Routes Admin
#### Connexion
- `/admin/login` - Page de connexion admin

#### Super Admin
- `/admin/super/dashboard` - Tableau de bord principal
- `/admin/super/users` - Gestion des utilisateurs
- `/admin/super/settings` - Paramètres système

#### Professeur
- `/admin/professeur/dashboard` - Tableau de bord professeur
- `/admin/professeur/cours` - Gestion des cours
- `/admin/professeur/etudiants` - Liste des étudiants
- `/admin/professeur/boutique` - Gestion boutique

#### Tuteur
- `/admin/tuteur/dashboard` - Tableau de bord tuteur
- `/admin/tuteur/sessions` - Sessions de tutorat
- `/admin/tuteur/etudiants` - Étudiants suivis

#### Rédacteur
- `/admin/redacteur/dashboard` - Tableau de bord rédacteur
- `/admin/redacteur/articles` - Gestion des articles
- `/admin/redacteur/contenu` - Création de contenu

## 🔄 Flux d'Authentification

### Connexion Utilisateur Standard
```
1. Utilisateur → /connexion
2. Saisie email/password
3. Vérification Firebase Auth
4. Récupération userData depuis Firestore
5. Création cookie session
6. Redirection → /dashboard
```

### Connexion Admin
```
1. Admin → /admin/login
2. Saisie email/password
3. Vérification Firebase Auth
4. Récupération userData depuis Firestore
5. Vérification role in ['super_admin', 'teacher', 'tutor', 'editor']
6. Création cookie session
7. Redirection selon rôle:
   - super_admin → /admin/super/dashboard
   - teacher → /admin/professeur/dashboard
   - tutor → /admin/tuteur/dashboard
   - editor → /admin/redacteur/dashboard
```

### Middleware Protection
```javascript
/dashboard/*  → Si pas de session → /connexion
/admin/*      → Si pas de session → /admin/login
              → Si session mais pas admin → Erreur 403
```

## 💾 Structure Firestore

### Collection: `users/{userId}`
```typescript
{
  uid: string                    // ID unique Firebase
  displayName: string            // Nom complet
  email: string                  // Email
  photoURL: string | null        // Photo de profil
  role: string                   // ⭐ RÔLE IMPORTANT
  createdAt: Timestamp           // Date de création
  lastLogin: Timestamp           // Dernière connexion
  bio: string                    // Biographie
  level: string                  // Niveau d'études
  school: string                 // École/Université
  interests: string[]            // Centres d'intérêt
  notifications: {               // Préférences notifications
    email: boolean
    newCourses: boolean
    newExercises: boolean
    newQuizzes: boolean
    forum: boolean
  }
  stats: {                       // Statistiques
    coursesCompleted: number
    exercisesCompleted: number
    quizzesCompleted: number
    discussionsCreated: number
    repliesPosted: number
  }
}
```

## 🛡️ Règles de Sécurité Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function pour vérifier si un utilisateur est admin
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role 
             in ['super_admin', 'teacher', 'tutor', 'editor'];
    }
    
    // Helper function pour vérifier si un utilisateur est super admin
    function isSuperAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';
    }
    
    // Collection users
    match /users/{userId} {
      // Lecture : l'utilisateur peut lire son propre document
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Les admins peuvent lire tous les documents
      allow read: if request.auth != null && isAdmin();
      
      // Création : uniquement lors de l'inscription (role = student)
      allow create: if request.auth != null 
                    && request.auth.uid == userId
                    && request.resource.data.role == 'student';
      
      // Mise à jour : l'utilisateur peut modifier son document SAUF le rôle
      allow update: if request.auth != null 
                    && request.auth.uid == userId
                    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'uid']);
      
      // Seul le super admin peut modifier les rôles
      allow update: if request.auth != null && isSuperAdmin();
      
      // Suppression : seul le super admin
      allow delete: if request.auth != null && isSuperAdmin();
    }
    
    // Autres collections (exemple : cours, exercices, etc.)
    match /courses/{courseId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && isAdmin();
    }
  }
}
```

## 🔧 Fonctions Utilitaires

### Vérification de rôle (Frontend)
```typescript
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { userData } = useAuth();
  
  // Vérifier si admin
  const isAdmin = ['super_admin', 'teacher', 'tutor', 'editor'].includes(userData?.role);
  
  // Vérifier un rôle spécifique
  const isSuperAdmin = userData?.role === 'super_admin';
  const isTeacher = userData?.role === 'teacher';
  
  return (
    <>
      {isAdmin && <AdminPanel />}
      {isSuperAdmin && <SuperAdminPanel />}
    </>
  );
}
```

### API Route Protection
```typescript
// app/api/admin/route.ts
import { cookies } from 'next/headers';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: Request) {
  // Vérifier la session
  const session = cookies().get('session');
  if (!session) {
    return Response.json({ error: 'Non authentifié' }, { status: 401 });
  }
  
  // Récupérer l'UID depuis le token (implémentation dépend de votre système)
  const uid = await verifySession(session.value);
  
  // Vérifier le rôle
  const userDoc = await getDoc(doc(db, 'users', uid));
  const userData = userDoc.data();
  
  const adminRoles = ['super_admin', 'teacher', 'tutor', 'editor'];
  if (!adminRoles.includes(userData?.role)) {
    return Response.json({ error: 'Accès refusé' }, { status: 403 });
  }
  
  // Traitement...
  return Response.json({ success: true });
}
```

## 📝 Checklist de Déploiement

Avant de déployer en production :

- [ ] Configurer les règles de sécurité Firestore
- [ ] Activer l'authentification par email/password dans Firebase
- [ ] Créer au moins un compte super admin
- [ ] Tester tous les rôles et leurs permissions
- [ ] Configurer les variables d'environnement
- [ ] Ajouter `serviceAccountKey.json` au `.gitignore`
- [ ] Sécuriser les API routes
- [ ] Activer HTTPS en production (pour les cookies sécurisés)
- [ ] Configurer les quotas et limites Firebase
- [ ] Mettre en place la surveillance et les logs

## 🆘 Support

Pour toute question sur les rôles et permissions :
1. Consultez `FIREBASE_ADMIN_SETUP.md`
2. Vérifiez `QUICK_START_ADMIN.md`
3. Utilisez les scripts dans `/scripts`
