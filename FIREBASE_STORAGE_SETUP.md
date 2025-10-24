# Configuration Firebase Storage

## Problème : "Upload tourne sans arrêt" ou "Échec de l'upload du PDF"

Si l'upload de PDF ne fonctionne pas, suivez ces étapes dans l'ordre :

## ✅ Étape 1 : Vérifier la configuration

Exécutez ce script pour vérifier votre configuration :

```bash
node scripts/check-firebase-storage.js
```

Si des variables manquent, ajoutez-les dans `.env.local`

## ✅ Étape 2 : Activer Firebase Storage

### 1. Accéder à Firebase Console

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **mathosphere** (ou votre nom de projet)
3. Cliquez sur **Storage** dans le menu latéral gauche
4. Si vous voyez "Commencer", cliquez dessus
5. Choisissez **"Commencer en mode test"** (ou production selon vos besoins)
6. Sélectionnez une région proche de vos utilisateurs (ex: europe-west1)
7. Cliquez sur **"Terminé"**

✅ Vous devriez maintenant voir l'interface Storage avec un dossier vide

## ✅ Étape 3 : Configurer les règles de sécurité

1. Cliquez sur l'onglet **"Règles" (Rules)**
2. Remplacez les règles existantes par celles-ci :

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Règle pour les PDFs uploadés par les super admins
    match /pdfs/{level}/{type}/{classe}/{fileName} {
      // Lecture : tous les utilisateurs authentifiés
      allow read: if request.auth != null;
      
      // Écriture : seulement les super admins
      allow write: if request.auth != null && 
                      request.auth.token.role == 'super_admin';
      
      // Suppression : seulement les super admins
      allow delete: if request.auth != null && 
                       request.auth.token.role == 'super_admin';
    }
    
    // Pour les images et autres fichiers
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

3. Cliquez sur **"Publier"**

### 3. Vérifier que le Storage Bucket est bien configuré

Dans `.env.local`, vérifiez que vous avez :

```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
```

### 4. Règles de sécurité alternatives (pour le développement)

Si vous voulez tester rapidement, vous pouvez utiliser ces règles **temporaires** :

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **Attention** : Ces règles permettent à tous les utilisateurs authentifiés de tout faire. À utiliser **UNIQUEMENT pour le développement**.

## Test de l'upload

1. Connectez-vous en tant que super admin
2. Allez sur `/admin/super/gestion-contenus`
3. Sélectionnez un cours (ID 1-30), exercice (ID 1-21) ou quiz (ID 1-9)
4. Sélectionnez le niveau et la classe
5. Uploadez un PDF
6. Vérifiez dans la console du navigateur (F12) s'il y a des erreurs

## Erreurs communes

### `storage/unauthorized`
➜ Les règles de sécurité bloquent l'upload. Vérifiez les règles ci-dessus.

### `storage/canceled`
➜ L'upload a été annulé. Réessayez.

### `storage/unknown`
➜ Erreur de configuration. Vérifiez :
- Que Storage est activé dans Firebase Console
- Que `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` est correct dans `.env.local`
- Que vous êtes bien connecté en tant que super_admin

### Vérifier le rôle de l'utilisateur

Ouvrez la console du navigateur et tapez :

```javascript
firebase.auth().currentUser.getIdTokenResult().then(token => {
  console.log("Role:", token.claims.role)
})
```

Le rôle doit être `"super_admin"`.

## Structure des PDFs dans Storage

```
pdfs/
├── college/
│   ├── cours/
│   │   ├── 6ème/
│   │   ├── 5ème/
│   │   ├── 4ème/
│   │   └── 3ème/
│   ├── exercice/
│   │   └── ...
│   └── quiz/
│       └── ...
└── lycee/
    ├── cours/
    │   ├── 2nde/
    │   ├── 1ère/
    │   └── Terminale/
    ├── exercice/
    │   └── ...
    └── quiz/
        └── ...
```

## Firestore Structure

Collection `pdfs` :
```json
{
  "fileName": "mon_cours.pdf",
  "url": "https://...",
  "storagePath": "pdfs/college/cours/6ème/123456_mon_cours.pdf",
  "type": "cours",
  "level": "college",
  "classe": "6ème",
  "courseId": 1,
  "uploadedAt": "2025-10-24T...",
  "uploadedBy": "uid_du_super_admin",
  "size": 1024000
}
```

## Logs de débogage

Le code affiche maintenant des logs dans la console :
- `"Starting upload..."` : Upload démarré
- `"Upload successful:"` : Upload réussi
- `"Error uploading PDF:"` : Erreur détaillée

Ouvrez la console du navigateur (F12) pour voir ces messages.
