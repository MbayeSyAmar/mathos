# 🎓 Structure Firestore - Encadrement Personnalisé

## 📊 Collections Firestore

### 1. Collection: `encadrements`
Documents représentant un abonnement d'encadrement

```typescript
{
  id: string                           // ID auto-généré
  userId: string                       // UID de l'étudiant
  teacherId: string                    // UID du professeur
  formule: string                      // "Formule Standard" | "Formule Intensive" | "Formule Premium"
  status: string                       // "active" | "paused" | "cancelled"
  startDate: Timestamp                 // Date de début
  nextBillingDate: Timestamp           // Prochaine facturation
  monthlyAmount: number                // Montant mensuel en euros
  sessionsPerMonth: number             // Nombre de séances par mois
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 2. Collection: `sessions`
Documents représentant une séance d'encadrement

```typescript
{
  id: string                           // ID auto-généré
  encadrementId: string                // ID de l'encadrement
  userId: string                       // UID de l'étudiant
  teacherId: string                    // UID du professeur
  date: Timestamp                      // Date et heure de la session
  duration: number                     // Durée en minutes
  subject: string                      // Sujet de la séance
  status: string                       // "scheduled" | "confirmed" | "completed" | "cancelled"
  notes?: string                       // Notes du professeur après la séance
  resources?: string[]                 // URLs ou noms des ressources
  meetingUrl?: string                  // URL de la visio si applicable
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 3. Collection: `messages`
Messages entre étudiant et professeur

```typescript
{
  id: string                           // ID auto-généré
  encadrementId: string                // ID de l'encadrement
  senderId: string                     // UID de l'expéditeur
  recipientId: string                  // UID du destinataire
  content: string                      // Contenu du message
  read: boolean                        // Lu ou non
  createdAt: Timestamp
}
```

### 4. Collection: `progression`
Progression de l'étudiant par chapitre

```typescript
{
  id: string                           // ID auto-généré
  encadrementId: string                // ID de l'encadrement
  userId: string                       // UID de l'étudiant
  chapter: string                      // Nom du chapitre
  progress: number                     // Progression en pourcentage (0-100)
  lastUpdated: Timestamp
  notes?: string                       // Notes sur la progression
}
```

### 5. Collection: `resources`
Ressources recommandées

```typescript
{
  id: string                           // ID auto-généré
  encadrementId: string                // ID de l'encadrement
  title: string                        // Titre de la ressource
  type: string                         // "pdf" | "video" | "link" | "document"
  url: string                          // URL de la ressource
  uploadedBy: string                   // UID de celui qui a ajouté
  createdAt: Timestamp
}
```

## 🔐 Règles de Sécurité Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isTeacherOrStudent(teacherId, studentId) {
      return request.auth.uid == teacherId || request.auth.uid == studentId;
    }
    
    // Encadrements
    match /encadrements/{encadrementId} {
      allow read: if isAuthenticated() && 
                     (isOwner(resource.data.userId) || isOwner(resource.data.teacherId));
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      allow update: if isAuthenticated() && 
                       (isOwner(resource.data.userId) || isOwner(resource.data.teacherId));
      allow delete: if isAuthenticated() && isOwner(resource.data.userId);
    }
    
    // Sessions
    match /sessions/{sessionId} {
      allow read: if isAuthenticated() && 
                     (isOwner(resource.data.userId) || isOwner(resource.data.teacherId));
      allow create: if isAuthenticated() && 
                       (isOwner(request.resource.data.userId) || 
                        isOwner(request.resource.data.teacherId));
      allow update: if isAuthenticated() && 
                       (isOwner(resource.data.userId) || isOwner(resource.data.teacherId));
      allow delete: if isAuthenticated() && 
                       (isOwner(resource.data.userId) || isOwner(resource.data.teacherId));
    }
    
    // Messages
    match /messages/{messageId} {
      allow read: if isAuthenticated() && 
                     (isOwner(resource.data.senderId) || isOwner(resource.data.recipientId));
      allow create: if isAuthenticated() && isOwner(request.resource.data.senderId);
      allow update: if isAuthenticated() && isOwner(resource.data.recipientId);
      allow delete: if isAuthenticated() && isOwner(resource.data.senderId);
    }
    
    // Progression
    match /progression/{progressionId} {
      allow read: if isAuthenticated() && 
                     (isOwner(resource.data.userId) || 
                      exists(/databases/$(database)/documents/encadrements/$(resource.data.encadrementId)) &&
                      get(/databases/$(database)/documents/encadrements/$(resource.data.encadrementId)).data.teacherId == request.auth.uid);
      allow write: if isAuthenticated();
    }
    
    // Resources
    match /resources/{resourceId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
  }
}
```

## 📝 Exemples de Données

### Exemple d'Encadrement
```json
{
  "id": "enc_123456",
  "userId": "user_student_1",
  "teacherId": "user_teacher_1",
  "formule": "Formule Intensive",
  "status": "active",
  "startDate": "2024-04-01T00:00:00Z",
  "nextBillingDate": "2024-05-01T00:00:00Z",
  "monthlyAmount": 89,
  "sessionsPerMonth": 4,
  "createdAt": "2024-04-01T10:00:00Z",
  "updatedAt": "2024-04-10T15:30:00Z"
}
```

### Exemple de Session
```json
{
  "id": "session_123456",
  "encadrementId": "enc_123456",
  "userId": "user_student_1",
  "teacherId": "user_teacher_1",
  "date": "2024-04-15T16:00:00Z",
  "duration": 60,
  "subject": "Révision des nombres complexes",
  "status": "confirmed",
  "notes": "Revoir la forme trigonométrique",
  "resources": ["Fiche de cours", "Exercices corrigés"],
  "meetingUrl": "https://meet.google.com/abc-defg-hij",
  "createdAt": "2024-04-10T10:00:00Z",
  "updatedAt": "2024-04-10T10:00:00Z"
}
```

### Exemple de Message
```json
{
  "id": "msg_123456",
  "encadrementId": "enc_123456",
  "senderId": "user_teacher_1",
  "recipientId": "user_student_1",
  "content": "Bonjour, j'ai préparé des exercices supplémentaires...",
  "read": false,
  "createdAt": "2024-04-10T14:30:00Z"
}
```

### Exemple de Progression
```json
{
  "id": "prog_123456",
  "encadrementId": "enc_123456",
  "userId": "user_student_1",
  "chapter": "Nombres complexes",
  "progress": 40,
  "lastUpdated": "2024-04-10T16:00:00Z",
  "notes": "Bon départ, à consolider"
}
```
