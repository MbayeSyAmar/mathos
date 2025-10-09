# 📚 Documentation Mathosphère - Index

Bienvenue dans la documentation de Mathosphère ! Voici un guide rapide pour naviguer dans la documentation.

## 🚀 Démarrage Rapide

### Pour les Administrateurs
1. **[Guide de démarrage rapide](./QUICK_START_ADMIN.md)** ⭐ Commencez ici !
   - Créer un admin en 3 minutes
   - Configuration Firebase rapide
   - Premiers pas

### Pour les Développeurs
1. **[Architecture des rôles](./ROLES_ARCHITECTURE.md)**
   - Comprendre le système de rôles
   - Matrice des permissions
   - Flux d'authentification

## 📖 Documentation Complète

### Configuration Firebase
- **[Configuration Admin Firebase](./FIREBASE_ADMIN_SETUP.md)**
  - Structure Firestore détaillée
  - Règles de sécurité
  - Scripts d'administration
  - Sécurité et bonnes pratiques

### Scripts Utilitaires
- **[Scripts d'administration](./scripts/README.md)**
  - Créer des utilisateurs admin
  - Gérer les rôles
  - Lister les administrateurs

## 🎯 Guides Spécifiques

### Créer un Utilisateur Admin

#### Méthode 1 : Console Firebase (Recommandé pour les débutants)
```
📍 Voir : QUICK_START_ADMIN.md > Méthode Rapide
Temps : ~3 minutes
Difficulté : ⭐ Facile
```

#### Méthode 2 : Script Node.js (Pour les développeurs)
```
📍 Voir : FIREBASE_ADMIN_SETUP.md > Option 3 : Via un Script
Temps : ~10 minutes (avec configuration)
Difficulté : ⭐⭐ Moyen
```

### Gérer les Permissions

#### Comprendre les Rôles
```
📍 Voir : ROLES_ARCHITECTURE.md > Vue d'ensemble
```

#### Modifier un Rôle Existant
```
📍 Voir : scripts/README.md > updateUserRole()
```

#### Sécuriser l'Application
```
📍 Voir : ROLES_ARCHITECTURE.md > Règles de Sécurité
```

## 🔑 Identifiants de Démonstration

### Utilisateurs Standard
- **Étudiant** : `demo@mathosphere.fr` / `mathosphere123`
- **Test** : `etudiant@test.fr` / `test123`

### Administrateurs (Mock)
- **Super Admin** : `demo-superadmin@mathosphere.com` / `admin123`
- **Professeur** : `demo-admin@mathosphere.com` / `admin123`
- **Tuteur** : `demo-tutor@mathosphere.com` / `admin123`
- **Rédacteur** : `demo-editor@mathosphere.com` / `admin123`

## 🗂️ Structure des Fichiers

```
mathosphere/
├── 📄 QUICK_START_ADMIN.md          # ⭐ Commencer ici
├── 📄 FIREBASE_ADMIN_SETUP.md       # Documentation complète
├── 📄 ROLES_ARCHITECTURE.md         # Architecture du système
├── 📄 DOCS_INDEX.md                 # Ce fichier
│
├── 📁 app/
│   ├── connexion/                   # Connexion utilisateur
│   ├── admin/
│   │   └── login/                   # Connexion admin
│   ├── dashboard/                   # Dashboard étudiant
│   └── ...
│
├── 📁 lib/
│   ├── auth-context.tsx             # Context d'authentification
│   ├── firebase.ts                  # Configuration Firebase
│   └── ...
│
├── 📁 scripts/
│   ├── create-admin.js              # Script de création admin
│   └── README.md                    # Documentation scripts
│
└── 📁 components/
    ├── admin/                       # Composants admin
    └── ...
```

## 🎓 Tutoriels Pas à Pas

### 1️⃣ Premier Admin Firebase
1. Lisez [QUICK_START_ADMIN.md](./QUICK_START_ADMIN.md)
2. Suivez la "Méthode Rapide"
3. Testez la connexion sur `/admin/login`

### 2️⃣ Comprendre les Rôles
1. Lisez [ROLES_ARCHITECTURE.md](./ROLES_ARCHITECTURE.md) section "Vue d'ensemble"
2. Consultez la "Matrice des Permissions"
3. Testez chaque rôle avec les comptes de démo

### 3️⃣ Sécuriser l'Application
1. Lisez [FIREBASE_ADMIN_SETUP.md](./FIREBASE_ADMIN_SETUP.md) section "Sécurité"
2. Implémentez les règles Firestore
3. Testez les permissions

### 4️⃣ Automatiser avec les Scripts
1. Lisez [scripts/README.md](./scripts/README.md)
2. Configurez Firebase Admin SDK
3. Créez vos admins via script

## 🆘 Résolution de Problèmes

### Erreur : "Accès refusé"
```
📍 Solution : QUICK_START_ADMIN.md > Dépannage
```

### Erreur : "Utilisateur non trouvé"
```
📍 Solution : FIREBASE_ADMIN_SETUP.md > Important
```

### Redirection échoue après connexion
```
📍 Solution : ROLES_ARCHITECTURE.md > Flux d'Authentification
```

### Script create-admin.js ne fonctionne pas
```
📍 Solution : scripts/README.md > Configuration
```

## 🔗 Liens Utiles

- [Firebase Console](https://console.firebase.google.com/)
- [Documentation Firebase Auth](https://firebase.google.com/docs/auth)
- [Documentation Firestore](https://firebase.google.com/docs/firestore)
- [Next.js Documentation](https://nextjs.org/docs)

## 📞 Support

Pour toute question :
1. Consultez d'abord la documentation appropriée (voir index ci-dessus)
2. Vérifiez la section "Dépannage" des guides
3. Consultez les scripts d'exemple dans `/scripts`

## 🗺️ Feuille de Route

### Fonctionnalités à venir
- [ ] API Routes protégées
- [ ] Système de permissions granulaire
- [ ] Audit logs pour les actions admin
- [ ] Interface de gestion des rôles
- [ ] Tests automatisés des permissions

---

**Dernière mise à jour** : 2025-01-09  
**Version** : 1.0.0  
**Auteur** : Équipe Mathosphère
