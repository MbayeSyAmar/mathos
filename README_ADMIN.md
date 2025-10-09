# 🎓 Mathosphère - Plateforme d'Apprentissage Mathématique

## 🚀 Guide Rapide de Configuration Admin

### ⚡ Configuration en 5 minutes

**Vous voulez créer un administrateur rapidement ?**

👉 **[Consultez le Guide de Démarrage Rapide](./QUICK_START_ADMIN.md)**

### 📚 Documentation Complète

- 📖 **[Index de la Documentation](./DOCS_INDEX.md)** - Point de départ
- 🔐 **[Configuration Firebase Admin](./FIREBASE_ADMIN_SETUP.md)** - Guide détaillé
- 🏗️ **[Architecture des Rôles](./ROLES_ARCHITECTURE.md)** - Système de permissions
- 🛠️ **[Scripts d'Administration](./scripts/README.md)** - Automatisation

---

## 🔑 Connexion

### Utilisateurs Standard
- **Page de connexion** : `/connexion`
- **Compte démo** : `demo@mathosphere.fr` / `mathosphere123`

### Administrateurs
- **Page de connexion** : `/admin/login`
- **Comptes démo** :
  - Super Admin : `demo-superadmin@mathosphere.com` / `admin123`
  - Professeur : `demo-admin@mathosphere.com` / `admin123`
  - Tuteur : `demo-tutor@mathosphere.com` / `admin123`
  - Rédacteur : `demo-editor@mathosphere.com` / `admin123`

---

## 👥 Rôles et Permissions

| Rôle | Accès | Dashboard |
|------|-------|-----------|
| 👤 **Étudiant** | Cours, exercices, forum | `/dashboard` |
| 👨‍🏫 **Professeur** | Gestion cours + étudiants | `/admin/professeur/dashboard` |
| 👨‍🎓 **Tuteur** | Suivi personnalisé | `/admin/tuteur/dashboard` |
| ✍️ **Rédacteur** | Création contenu | `/admin/redacteur/dashboard` |
| 👑 **Super Admin** | Tous les accès | `/admin/super/dashboard` |

---

## 🔧 Créer un Admin Firebase

### Option 1 : Console Firebase (Recommandé)
```
1. Firebase Console → Authentication → Add user
2. Firestore → users → Add document (avec l'UID)
3. Ajouter le champ role: "super_admin"
4. Tester sur /admin/login
```
📚 **Guide détaillé** : [QUICK_START_ADMIN.md](./QUICK_START_ADMIN.md)

### Option 2 : Script Node.js
```bash
npm install firebase-admin
node scripts/create-admin.js
```
📚 **Guide détaillé** : [scripts/README.md](./scripts/README.md)

---

## 🛡️ Sécurité

### Points Importants
✅ Cookie de session créé à la connexion  
✅ Middleware protège les routes admin  
✅ Rôles stockés dans Firestore (champ `role`)  
✅ `serviceAccountKey.json` dans `.gitignore`  
⚠️ Les utilisateurs ne peuvent pas modifier leur propre rôle  

### Règles Firestore
Voir [FIREBASE_ADMIN_SETUP.md](./FIREBASE_ADMIN_SETUP.md#-sécurité-règles-firestore)

---

## 📁 Structure du Projet

```
mathosphere/
├── app/
│   ├── connexion/              # Connexion utilisateur
│   ├── admin/
│   │   ├── login/              # Connexion admin ⭐
│   │   ├── super/              # Dashboard super admin
│   │   ├── professeur/         # Dashboard professeur
│   │   ├── tuteur/             # Dashboard tuteur
│   │   └── redacteur/          # Dashboard rédacteur
│   ├── dashboard/              # Dashboard étudiant
│   └── ...
├── lib/
│   ├── auth-context.tsx        # Context d'authentification
│   ├── firebase.ts             # Configuration Firebase
│   └── ...
├── scripts/
│   └── create-admin.js         # Script de création admin
├── middleware.ts               # Protection des routes
└── Documentation/
    ├── QUICK_START_ADMIN.md    # ⭐ Commencer ici
    ├── FIREBASE_ADMIN_SETUP.md # Documentation complète
    ├── ROLES_ARCHITECTURE.md   # Architecture
    └── DOCS_INDEX.md            # Index
```

---

## 🔄 Flux d'Authentification

### Connexion Admin
```
1. /admin/login
2. Email + Password
3. Vérification Firebase Auth
4. Récupération userData (Firestore)
5. Vérification du rôle admin
6. Création cookie session
7. Redirection vers dashboard approprié
```

---

## 🎯 Configuration Firebase

### Structure Document Utilisateur
```javascript
{
  uid: "user_id",
  displayName: "Nom",
  email: "email@example.com",
  role: "super_admin",  // ⭐ IMPORTANT
  createdAt: timestamp,
  lastLogin: timestamp,
  // ... autres champs
}
```

### Rôles Valides
- `student` - Étudiant (par défaut)
- `teacher` - Professeur
- `tutor` - Tuteur
- `editor` - Rédacteur
- `super_admin` - Super Administrateur

---

## 🛠️ Commandes Utiles

### Installation
```bash
npm install
# ou
pnpm install
```

### Développement
```bash
npm run dev
# ou
pnpm dev
```

### Scripts Admin
```bash
# Installer Firebase Admin SDK
npm install firebase-admin

# Exécuter le script de création admin
node scripts/create-admin.js
```

---

## 📚 Ressources

### Documentation
- **[Guide de Démarrage Rapide](./QUICK_START_ADMIN.md)** ⭐
- **[Index de la Documentation](./DOCS_INDEX.md)**
- **[Configuration Firebase](./FIREBASE_ADMIN_SETUP.md)**
- **[Architecture des Rôles](./ROLES_ARCHITECTURE.md)**

### Liens Externes
- [Firebase Console](https://console.firebase.google.com/)
- [Documentation Firebase](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 🐛 Dépannage

### Problème : Redirection échoue après connexion
**Solution** : Vérifiez que le cookie de session est créé
```javascript
// Dans la console du navigateur
document.cookie
// Devrait contenir: session=...
```

### Problème : "Accès refusé" pour un admin
**Solution** : Vérifiez le champ `role` dans Firestore
```
1. Firebase Console → Firestore Database
2. Collection users → Document de l'utilisateur
3. Vérifier : role = "super_admin" (ou autre rôle admin)
```

### Problème : Script create-admin.js ne fonctionne pas
**Solution** : Vérifiez la configuration Firebase Admin SDK
```
1. Téléchargez serviceAccountKey.json depuis Firebase Console
2. Placez-le à la racine du projet
3. Vérifiez qu'il est dans .gitignore
```

---

## 📞 Support

Pour toute question :
1. **Consultez d'abord** : [DOCS_INDEX.md](./DOCS_INDEX.md)
2. **Guide rapide** : [QUICK_START_ADMIN.md](./QUICK_START_ADMIN.md)
3. **Dépannage** : Chaque guide a une section dédiée

---

## ✅ Checklist de Déploiement

Avant de déployer en production :

- [ ] Configurer Firebase (Auth + Firestore)
- [ ] Créer au moins un super admin
- [ ] Configurer les règles de sécurité Firestore
- [ ] Tester tous les rôles et permissions
- [ ] Vérifier que `serviceAccountKey.json` est dans `.gitignore`
- [ ] Configurer les variables d'environnement
- [ ] Activer HTTPS (cookies sécurisés)
- [ ] Tester les redirections après connexion
- [ ] Vérifier le middleware de protection des routes

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2025-01-09  
**Équipe** : Mathosphère

🚀 **Bon développement !**
