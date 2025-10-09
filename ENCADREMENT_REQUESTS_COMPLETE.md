# Système de Demandes d'Encadrement - Guide Complet

## 📋 Vue d'ensemble

Le système de demandes d'encadrement permet aux étudiants de faire des demandes d'accompagnement personnalisé en choisissant leur professeur. Les professeurs et super administrateurs peuvent ensuite gérer ces demandes.

## 🔄 Flux de travail

### 1. Étudiant fait une demande
- Va sur `/encadrement`
- Remplit le formulaire avec :
  - Nom complet
  - Email
  - Classe (ex: Terminale S, 3ème, Licence 1)
  - Niveau scolaire
  - École/Établissement
  - **Sélectionne un professeur** parmi la liste
  - Choisit une formule (Standard, Intensive, Sur mesure)
  - Matière
  - Objectifs
  - Disponibilités (plusieurs créneaux possibles)
  - Message optionnel

### 2. Professeur reçoit la demande
- Va sur `/admin/professeur/demandes`
- Voit toutes ses demandes avec les informations complètes de l'étudiant :
  - Nom et email
  - **Classe et niveau**
  - École
  - Formule choisie
  - Matière
  - Objectifs
  - Disponibilités
- Peut **approuver** ou **rejeter** la demande
- Si rejet: doit indiquer une raison
- Si approbation: peut ajouter des notes

### 3. Super Admin supervise tout
- Va sur `/admin/super/demandes`
- Voit **TOUTES** les demandes (tous les professeurs)
- Statistiques globales :
  - Total des demandes
  - En attente
  - Approuvées
  - Rejetées
  - Annulées
- Peut également approuver/rejeter n'importe quelle demande
- Peut ajouter des notes administratives

## 📁 Structure Firestore

### Collection: `encadrement_requests`

```javascript
{
  studentId: "userId",              // ID Firebase de l'étudiant (ou vide si pas connecté)
  studentName: "Jean Dupont",       // Nom complet
  studentEmail: "jean@email.com",   // Email
  studentClass: "Terminale S",      // ⭐ Classe de l'étudiant
  studentLevel: "Lycée",            // Niveau scolaire
  studentSchool: "Lycée Victor Hugo", // École
  
  teacherId: "teacherUserId",       // ID du professeur choisi
  teacherName: "Thomas Martin",     // Nom du professeur
  
  formule: "Formule Standard (2h/mois - 49€)", // Formule choisie
  subject: "Mathématiques",         // Matière
  objectives: "Améliorer mes notes...", // Objectifs
  availability: [                   // Disponibilités
    "Lundi après-midi",
    "Mercredi matin"
  ],
  message: "Message optionnel",     // Message de l'étudiant
  
  status: "pending",                // "pending" | "approved" | "rejected" | "cancelled"
  
  adminNotes: "",                   // Notes de l'admin/prof
  rejectionReason: "",              // Raison du rejet (si rejeté)
  
  approvedBy: "adminUserId",        // Qui a approuvé
  approvedAt: timestamp,            // Quand
  
  rejectedBy: "adminUserId",        // Qui a rejeté
  rejectedAt: timestamp,            // Quand
  
  createdAt: timestamp,             // Date de création
  updatedAt: timestamp              // Dernière modification
}
```

## 🚀 Initialisation

### 1. Créer des professeurs de test

```bash
node scripts/init-teachers.js
```

Cela créera 4 professeurs :
- thomas.martin@mathosphere.com
- sophie.leclerc@mathosphere.com
- pierre.dubois@mathosphere.com
- marie.bernard@mathosphere.com

**Mot de passe pour tous:** `Teacher2024!`

### 2. Rules Firestore

Ajoutez ces règles dans Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Demandes d'encadrement
    match /encadrement_requests/{requestId} {
      // Lecture: étudiant qui a créé la demande, prof assigné, ou admin
      allow read: if request.auth != null && (
        resource.data.studentId == request.auth.uid ||
        resource.data.teacherId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'tutor']
      );
      
      // Création: n'importe qui (même non connecté)
      allow create: if true;
      
      // Mise à jour: prof assigné ou admin
      allow update: if request.auth != null && (
        resource.data.teacherId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'tutor', 'teacher']
      );
      
      // Suppression: super admin uniquement
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';
    }
  }
}
```

## 📊 Pages créées

### Page publique (étudiants)
- **URL:** `/encadrement`
- **Fichier:** `app/encadrement/page.tsx`
- **Fonctionnalités:**
  - Présentation des formules
  - Liste dynamique des professeurs (chargés depuis Firebase)
  - Sélection du professeur
  - Formulaire complet de demande
  - Envoi de la demande dans Firestore

### Page professeur
- **URL:** `/admin/professeur/demandes`
- **Fichier:** `app/admin/professeur/demandes/page.tsx`
- **Fonctionnalités:**
  - Voir toutes ses demandes
  - Statistiques personnelles
  - Détails complets de chaque étudiant (avec classe)
  - Approuver/rejeter les demandes
  - Ajouter des notes

### Page super admin
- **URL:** `/admin/super/demandes`
- **Fichier:** `app/admin/super/demandes/page.tsx`
- **Fonctionnalités:**
  - Voir TOUTES les demandes (tous professeurs)
  - Statistiques globales
  - Filtrage par statut (onglets)
  - Détails complets (avec classe)
  - Approuver/rejeter n'importe quelle demande
  - Notes administratives

## 🔌 Service créé

**Fichier:** `lib/services/encadrement-requests-service.ts`

### Fonctions disponibles:

```typescript
// Créer une demande
createEncadrementRequest(data)

// Récupérer les demandes d'un étudiant
getStudentRequests(studentId)

// Récupérer les demandes d'un professeur (toutes)
getTeacherRequests(teacherId)

// Récupérer les demandes en attente d'un professeur
getPendingTeacherRequests(teacherId)

// Récupérer toutes les demandes (admin)
getAllRequests()

// Récupérer toutes les demandes en attente (admin)
getAllPendingRequests()

// Approuver une demande
approveRequest(requestId, approvedBy, adminNotes?)

// Rejeter une demande
rejectRequest(requestId, rejectedBy, rejectionReason, adminNotes?)

// Annuler une demande (étudiant)
cancelRequest(requestId)

// Mettre à jour les notes
updateRequestNotes(requestId, notes)

// Réassigner à un autre prof
reassignRequest(requestId, newTeacherId, newTeacherName)

// Supprimer une demande
deleteRequest(requestId)

// Statistiques
getRequestsStats()
```

## ✨ Fonctionnalités clés

### ✅ Informations complètes de l'étudiant
Chaque demande contient:
- ✅ Nom complet
- ✅ Email
- ✅ **Classe** (ex: Terminale S, 3ème, Licence 1)
- ✅ Niveau scolaire (Collège, Lycée, Supérieur)
- ✅ École/Établissement

### ✅ Choix du professeur
- Liste dynamique chargée depuis Firebase
- Affichage de: nom, rôle, spécialité, note
- Sélection visuelle (bordure et check)
- Impossible d'envoyer sans sélectionner un prof

### ✅ Gestion des demandes
- **Professeurs:** voient uniquement leurs demandes
- **Super Admin:** voit toutes les demandes
- Filtrage par statut (en attente / toutes)
- Statistiques en temps réel
- Actions: approuver, rejeter, voir détails

### ✅ Workflow complet
1. Étudiant fait la demande → `status: "pending"`
2. Prof/Admin approuve → `status: "approved"` + timestamps
3. Prof/Admin rejette → `status: "rejected"` + raison
4. Étudiant peut annuler → `status: "cancelled"`

## 🎨 UI/UX

- Design moderne avec shadcn/ui
- Animations avec Framer Motion
- États de chargement (spinners)
- Messages de confirmation (toasts)
- Dialogs modaux pour les actions
- Responsive (mobile-friendly)
- Badges colorés pour les statuts
- Tableaux avec toutes les infos

## 🔐 Sécurité

- ✅ Routes protégées par middleware
- ✅ Vérification des rôles côté serveur
- ✅ Rules Firestore strictes
- ✅ Validation des données
- ✅ Impossibilité de modifier les demandes des autres

## 📝 Prochaines étapes possibles

1. **Notifications par email**
   - Étudiant : confirmation de demande
   - Professeur : nouvelle demande
   - Étudiant : décision du prof

2. **Tableau de bord étudiant**
   - Voir ses demandes
   - Statuts en temps réel
   - Historique

3. **Conversion en encadrement**
   - Quand approuvé : créer automatiquement un encadrement dans la collection `encadrement`
   - Planifier les premières séances

4. **Messagerie intégrée**
   - Discussion prof/étudiant avant approbation
   - Clarifier les besoins

5. **Système de paiement**
   - Paiement en ligne de la formule choisie
   - Intégration Stripe

## 🐛 Debugging

### Vérifier si un utilisateur est professeur:
```javascript
// Dans Firestore Console, collection users
role: "teacher"
```

### Vérifier les demandes:
```javascript
// Collection encadrement_requests
// Doit avoir: studentClass, studentLevel, teacherId, status
```

### Tester le flux:
1. Aller sur `/encadrement`
2. Sélectionner un professeur (il doit apparaître en surbrillance)
3. Remplir tous les champs obligatoires (*)
4. Cocher au moins une disponibilité
5. Cliquer "Envoyer ma demande"
6. Se connecter comme professeur
7. Aller sur `/admin/professeur/demandes`
8. Voir la demande avec toutes les infos

## 🎉 Conclusion

Vous avez maintenant un système complet de gestion des demandes d'encadrement avec:
- ✅ Toutes les informations des étudiants (y compris la classe)
- ✅ Sélection du professeur
- ✅ Pages dédiées pour profs et admins
- ✅ Workflow d'approbation/rejet
- ✅ Stockage sécurisé dans Firestore
- ✅ UI moderne et responsive

Les demandes apparaissent bien sur la page du professeur choisi ET sur la page du super admin avec toutes les infos de l'élève incluant sa classe ! 🚀
