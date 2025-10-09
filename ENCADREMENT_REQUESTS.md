# 📋 Système de Demandes d'Encadrement

## 🗄️ Structure Firestore

### Collection: `encadrement_requests`

```typescript
{
  id: string                           // ID auto-généré
  studentId: string                    // UID de l'étudiant
  studentName: string                  // Nom de l'étudiant
  studentEmail: string                 // Email de l'étudiant
  studentClass: string                 // Classe (ex: "Terminale S", "1ère", "Licence 1")
  studentLevel: string                 // Niveau (ex: "Lycée", "Université")
  studentSchool: string                // École/Établissement
  teacherId: string                    // UID du professeur demandé
  teacherName: string                  // Nom du professeur
  formule: string                      // "Standard" | "Intensive" | "Premium"
  subject: string                      // Matière principale (ex: "Mathématiques")
  objectives: string                   // Objectifs de l'étudiant
  availability: string[]               // Disponibilités (ex: ["Lundi 16h", "Mercredi 18h"])
  status: string                       // "pending" | "approved" | "rejected" | "cancelled"
  message: string                      // Message de l'étudiant
  adminNotes?: string                  // Notes de l'admin
  rejectionReason?: string             // Raison du rejet si applicable
  processedBy?: string                 // UID de l'admin qui a traité
  processedAt?: Timestamp              // Date de traitement
  createdAt: Timestamp                 // Date de création
  updatedAt: Timestamp                 // Date de mise à jour
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
    
    function isStudent() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'student';
    }
    
    function isTeacherOrAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in 
             ['teacher', 'tutor', 'super_admin'];
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';
    }
    
    // Demandes d'encadrement
    match /encadrement_requests/{requestId} {
      // Lecture : étudiant peut voir sa demande, profs/admins peuvent voir leurs demandes
      allow read: if isAuthenticated() && 
                     (request.auth.uid == resource.data.studentId || 
                      request.auth.uid == resource.data.teacherId ||
                      isSuperAdmin());
      
      // Création : seuls les étudiants peuvent créer
      allow create: if isStudent() && 
                       request.auth.uid == request.resource.data.studentId;
      
      // Mise à jour : étudiant peut annuler, profs/admins peuvent traiter
      allow update: if (isAuthenticated() && request.auth.uid == resource.data.studentId) ||
                       (isTeacherOrAdmin() && 
                        (request.auth.uid == resource.data.teacherId || isSuperAdmin()));
      
      // Suppression : seul le super admin
      allow delete: if isSuperAdmin();
    }
  }
}
```

## 📊 Statuts des Demandes

| Statut | Description | Qui peut changer |
|--------|-------------|------------------|
| `pending` | En attente de traitement | Auto (création) |
| `approved` | Approuvée par le professeur/admin | Professeur, Super Admin |
| `rejected` | Rejetée | Professeur, Super Admin |
| `cancelled` | Annulée par l'étudiant | Étudiant |

## 🎯 Flux de Traitement

```
1. Étudiant fait une demande
   ↓
   Status: "pending"
   ↓
2. Visible par :
   - Le professeur demandé
   - Le super admin
   ↓
3. Traitement :
   - Professeur/Admin approuve → Status: "approved" → Création d'un encadrement
   - Professeur/Admin rejette → Status: "rejected"
   - Étudiant annule → Status: "cancelled"
```

## 📝 Exemple de Données

```json
{
  "id": "req_123456",
  "studentId": "user_student_1",
  "studentName": "Marie Dupont",
  "studentEmail": "marie.dupont@example.com",
  "studentClass": "Terminale S",
  "studentLevel": "Lycée",
  "studentSchool": "Lycée Victor Hugo",
  "teacherId": "user_teacher_1",
  "teacherName": "Thomas Martin",
  "formule": "Formule Intensive",
  "subject": "Mathématiques",
  "objectives": "Préparer le bac avec mention très bien",
  "availability": ["Lundi 16h-18h", "Mercredi 17h-19h", "Samedi 10h-12h"],
  "status": "pending",
  "message": "Bonjour, je souhaite améliorer mes résultats en mathématiques...",
  "createdAt": "2024-04-10T10:00:00Z",
  "updatedAt": "2024-04-10T10:00:00Z"
}
```

## 🔄 Actions Disponibles

### Pour l'Étudiant
- ✅ Créer une demande
- ✅ Voir ses demandes
- ✅ Annuler une demande (si pending)
- ✅ Modifier une demande (si pending)

### Pour le Professeur
- ✅ Voir les demandes qui le concernent
- ✅ Approuver une demande
- ✅ Rejeter une demande (avec raison)
- ✅ Ajouter des notes

### Pour le Super Admin
- ✅ Voir TOUTES les demandes
- ✅ Approuver n'importe quelle demande
- ✅ Rejeter n'importe quelle demande
- ✅ Assigner à un autre professeur
- ✅ Gérer les demandes en masse
- ✅ Voir les statistiques
