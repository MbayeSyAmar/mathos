# 📁 Scripts d'Administration

Ce dossier contient des scripts utilitaires pour gérer les utilisateurs admin de Mathosphère.

## 📜 Scripts Disponibles

### `create-admin.js`
Script pour créer et gérer les utilisateurs administrateurs dans Firebase.

**Fonctionnalités :**
- ✅ Créer un nouvel utilisateur admin
- ✅ Mettre à jour le rôle d'un utilisateur existant
- ✅ Lister tous les administrateurs

**Prérequis :**
```bash
npm install firebase-admin
```

**Configuration :**
1. Téléchargez `serviceAccountKey.json` depuis Firebase Console
2. Placez-le à la racine du projet
3. Le fichier est déjà dans `.gitignore` pour la sécurité

**Utilisation :**
```bash
# 1. Ouvrir le fichier
code scripts/create-admin.js

# 2. Décommenter la fonction souhaitée
# 3. Modifier les paramètres
# 4. Exécuter
node scripts/create-admin.js
```

**Exemples :**

Créer un super admin :
```javascript
createAdmin(
  'admin@mathosphere.fr',
  'SecurePassword123!',
  'Super Admin',
  'super_admin'
);
```

Promouvoir un utilisateur existant :
```javascript
updateUserRole('user@example.com', 'teacher');
```

Lister tous les admins :
```javascript
listAdmins();
```

### `fix-existing-approvals.js`
Script pour créer automatiquement les encadrements manquants pour les demandes déjà approuvées.

**Utilisation :**
```bash
node scripts/fix-existing-approvals.js
```

**Fonctionnalité :**
- ✅ Recherche toutes les demandes approuvées
- ✅ Vérifie si un encadrement existe déjà
- ✅ Crée les encadrements manquants avec les bonnes formules
- ✅ Affiche un rapport détaillé

**Note :** À exécuter une seule fois après la mise à jour du système d'encadrement.

### Autres Scripts

- `check-firebase-config.js` - Vérifier la configuration Firebase
- `init-encadrement-data.js` - Initialiser les données d'encadrement
- `init-teachers.js` - Initialiser les professeurs
- `init-test-data.js` - Créer des données de test

## 🔒 Sécurité

- ⚠️ Ne JAMAIS commiter `serviceAccountKey.json`
- ⚠️ Gardez vos mots de passe admin sécurisés
- ⚠️ N'utilisez ces scripts que dans un environnement sécurisé
- ⚠️ Les rôles sont protégés par les règles Firestore

## 📚 Documentation

Pour plus d'informations, consultez :
- `FIREBASE_ADMIN_SETUP.md` - Documentation complète
- `QUICK_START_ADMIN.md` - Guide de démarrage rapide
