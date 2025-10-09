# 🔧 Configuration des Index Firestore

## 🎯 Problème

Lorsque vous utilisez les fonctionnalités de progression étudiant ou de messagerie, vous pouvez rencontrer cette erreur :

```
FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/...
```

## 📋 Index requis

### 1. Collection `student_activities`

**Champs indexés** :
- `userId` (Ascending)
- `createdAt` (Descending)

**Utilisation** : Récupérer les activités récentes d'un étudiant triées par date.

### 2. Collection `conversations`

**Champs indexés** :
- `studentId` (Ascending)
- `updatedAt` (Descending)

**Utilisation** : Conversations d'un étudiant triées par dernière activité.

### 3. Collection `conversations` (Teacher)

**Champs indexés** :
- `teacherId` (Ascending)
- `updatedAt` (Descending)

**Utilisation** : Conversations d'un professeur triées par dernière activité.

### 4. Collection `messages`

**Champs indexés** :
- `conversationId` (Ascending)
- `createdAt` (Ascending)

**Utilisation** : Messages d'une conversation triés chronologiquement.

## 🚀 Méthode 1 : Cliquer sur le lien d'erreur (RECOMMANDÉ)

### Étape 1 : Copier le lien
Lorsque l'erreur apparaît dans la console, elle contient un lien direct :
```
https://console.firebase.google.com/v1/r/project/mathosphere-fe4c0/firestore/indexes?create_composite=...
```

### Étape 2 : Ouvrir le lien
- Cliquez sur le lien ou copiez-le dans votre navigateur
- Vous serez redirigé vers la console Firebase
- L'index sera pré-configuré automatiquement

### Étape 3 : Créer l'index
- Cliquez sur **"Créer l'index"**
- Attendez quelques minutes (l'index doit être construit)
- Un message de confirmation apparaîtra

### Étape 4 : Vérifier
- Rafraîchissez votre application
- L'erreur devrait avoir disparu

## 🔧 Méthode 2 : Créer manuellement via la console

### Accéder à Firestore

1. Ouvrez [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **"mathosphere-fe4c0"** (ou votre projet)
3. Dans le menu de gauche, cliquez sur **"Firestore Database"**
4. Cliquez sur l'onglet **"Indexes"** (en haut)

### Créer l'index pour `student_activities`

1. Cliquez sur **"Create Index"** ou **"Créer un index composite"**
2. Remplissez les champs :
   ```
   Collection ID: student_activities
   
   Fields to index:
   - Field path: userId
     Query scope: Collection
     Order: Ascending
   
   - Field path: createdAt
     Query scope: Collection
     Order: Descending
   ```
3. Cliquez sur **"Create"**

### Créer l'index pour `conversations` (Student)

1. Cliquez sur **"Create Index"**
2. Remplissez :
   ```
   Collection ID: conversations
   
   Fields to index:
   - Field path: studentId
     Query scope: Collection
     Order: Ascending
   
   - Field path: updatedAt
     Query scope: Collection
     Order: Descending
   ```
3. Cliquez sur **"Create"**

### Créer l'index pour `conversations` (Teacher)

1. Cliquez sur **"Create Index"**
2. Remplissez :
   ```
   Collection ID: conversations
   
   Fields to index:
   - Field path: teacherId
     Query scope: Collection
     Order: Ascending
   
   - Field path: updatedAt
     Query scope: Collection
     Order: Descending
   ```
3. Cliquez sur **"Create"**

### Créer l'index pour `messages`

1. Cliquez sur **"Create Index"**
2. Remplissez :
   ```
   Collection ID: messages
   
   Fields to index:
   - Field path: conversationId
     Query scope: Collection
     Order: Ascending
   
   - Field path: createdAt
     Query scope: Collection
     Order: Ascending
   ```
3. Cliquez sur **"Create"**

## 📄 Méthode 3 : Utiliser firestore.indexes.json

Créez un fichier `firestore.indexes.json` à la racine de votre projet :

```json
{
  "indexes": [
    {
      "collectionGroup": "student_activities",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "conversations",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "studentId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updatedAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "conversations",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "teacherId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updatedAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "conversationId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Puis déployez avec :
```bash
firebase deploy --only firestore:indexes
```

## ⏱️ Temps de construction

- **Petits projets** (< 1000 documents) : 1-5 minutes
- **Projets moyens** (1000-10000 documents) : 5-15 minutes
- **Grands projets** (> 10000 documents) : 15-60 minutes

Vous pouvez suivre la progression dans Firebase Console → Indexes.

## 🔍 Vérifier les index existants

### Via Console
1. Firebase Console → Firestore Database → Indexes
2. Vous verrez tous les index avec leur statut :
   - 🟢 **Building** : En cours de construction
   - ✅ **Enabled** : Actif et fonctionnel
   - ❌ **Error** : Erreur lors de la création

### Via CLI
```bash
firebase firestore:indexes
```

## 🐛 Dépannage

### L'index ne se crée pas
**Solutions** :
1. Vérifiez que vous avez les permissions admin sur le projet
2. Essayez de créer l'index via le lien direct dans l'erreur
3. Attendez quelques minutes et réessayez
4. Vérifiez qu'il n'y a pas d'index en conflit

### L'erreur persiste après création
**Solutions** :
1. Attendez que l'index soit "Enabled" (pas "Building")
2. Videz le cache de votre navigateur
3. Redémarrez votre serveur de dev
4. Vérifiez que l'index correspond exactement à la requête

### Plusieurs erreurs d'index
**Solution** : Créez les index un par un en cliquant sur chaque lien d'erreur.

## 📊 Index recommandés pour Mathosphere

Voici la liste complète des index dont vous aurez besoin :

### Collection : `student_activities`
```
userId (ASC) + createdAt (DESC)
```

### Collection : `conversations`
```
studentId (ASC) + updatedAt (DESC)
teacherId (ASC) + updatedAt (DESC)
```

### Collection : `messages`
```
conversationId (ASC) + createdAt (ASC)
conversationId (ASC) + read (ASC) + senderRole (ASC)
```

### Collection : `course_progress`
```
userId (ASC) + lastAccessedAt (DESC)
```

### Collection : `exercise_progress`
```
userId (ASC) + completedAt (DESC)
```

### Collection : `quiz_progress`
```
userId (ASC) + completedAt (DESC)
```

### Collection : `encadrement_requests`
```
teacherId (ASC) + status (ASC) + createdAt (DESC)
status (ASC) + createdAt (DESC)
```

## ✅ Checklist de déploiement

Avant de déployer en production :

- [ ] Tous les index sont créés
- [ ] Tous les index sont "Enabled"
- [ ] Les requêtes fonctionnent sans erreur
- [ ] Le temps de réponse est acceptable
- [ ] Les règles de sécurité sont configurées

## 🔗 Liens utiles

- [Documentation Firestore Indexes](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Limites Firestore](https://firebase.google.com/docs/firestore/quotas)
- [Meilleures pratiques](https://firebase.google.com/docs/firestore/best-practices)

---

**Note** : La méthode 1 (cliquer sur le lien d'erreur) est la plus rapide et la plus fiable !
