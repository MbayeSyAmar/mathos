# Index Firestore pour les Soumissions d'Exercices

## Collection: `exercise_submissions`

### Index Composite Requis

1. **Pour le professeur - Liste des soumissions**
   - Champs :
     - `teacherId` (Ascending)
     - `submittedAt` (Descending)
   - Portée : Collection

2. **Pour l'élève - Vérifier sa soumission**
   - Champs :
     - `userId` (Ascending)
     - `exerciseId` (Ascending)
   - Portée : Collection

3. **Pour le professeur - Filtrer par statut**
   - Champs :
     - `teacherId` (Ascending)
     - `status` (Ascending)
     - `submittedAt` (Descending)
   - Portée : Collection

## Comment créer ces index

### Option 1: Via la console Firebase
1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet
3. Dans le menu, allez dans "Firestore Database"
4. Cliquez sur l'onglet "Indexes"
5. Cliquez sur "Create Index"
6. Remplissez les champs comme spécifié ci-dessus

### Option 2: Via Firebase CLI
Créez un fichier `firestore.indexes.json` à la racine du projet :

```json
{
  "indexes": [
    {
      "collectionGroup": "exercise_submissions",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "teacherId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "submittedAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "exercise_submissions",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "exerciseId",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "exercise_submissions",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "teacherId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "submittedAt",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Ensuite, déployez avec :
```bash
firebase deploy --only firestore:indexes
```

## Structure des Données

### Document dans `exercise_submissions`
```javascript
{
  exerciseId: "exercise_123",
  exerciseTitle: "Les équations du second degré",
  userId: "student_uid",
  userName: "Prénom Nom",
  teacherId: "teacher_uid",
  teacherName: "Nom du Professeur",
  answer: "Ma réponse détaillée...",
  submittedAt: Timestamp,
  status: "pending", // ou "reviewed"
  feedback: "Très bien, mais attention à...", // null si pas encore corrigé
  score: 15.5, // null si pas de note
  reviewedAt: Timestamp // ajouté lors de la correction
}
```

## Règles de Sécurité Firestore

Ajoutez ces règles dans votre `firestore.rules` :

```javascript
// Soumissions d'exercices
match /exercise_submissions/{submissionId} {
  // Un élève peut créer une soumission et lire ses propres soumissions
  allow create: if request.auth != null 
    && request.resource.data.userId == request.auth.uid;
  
  allow read: if request.auth != null 
    && (resource.data.userId == request.auth.uid 
        || resource.data.teacherId == request.auth.uid);
  
  // Seul le professeur peut mettre à jour (corriger)
  allow update: if request.auth != null 
    && resource.data.teacherId == request.auth.uid;
  
  // Personne ne peut supprimer
  allow delete: if false;
}
```
