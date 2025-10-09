# 🚀 Démarrage Rapide - Système de Demandes d'Encadrement

## ✅ Ce qui a été créé

### 📄 Pages

1. **Page publique pour les étudiants**
   - Chemin: `app/encadrement/page.tsx`
   - URL: `/encadrement`
   - Permet de faire une demande d'encadrement avec choix du professeur

2. **Page des demandes pour les professeurs**
   - Chemin: `app/admin/professeur/demandes/page.tsx`
   - URL: `/admin/professeur/demandes`
   - Permet de voir et gérer leurs demandes

3. **Page des demandes pour le super admin**
   - Chemin: `app/admin/super/demandes/page.tsx`
   - URL: `/admin/super/demandes`
   - Permet de voir et gérer TOUTES les demandes

### 🔧 Services

- Chemin: `lib/services/encadrement-requests-service.ts`
- Contient toutes les fonctions pour gérer les demandes dans Firestore

### 📜 Scripts

- Chemin: `scripts/init-teachers.js`
- Permet d'initialiser des professeurs de test dans Firebase

### 📚 Documentation

- `ENCADREMENT_REQUESTS.md` - Structure Firestore
- `ENCADREMENT_REQUESTS_COMPLETE.md` - Guide complet d'utilisation

## 🏃‍♂️ Pour commencer maintenant

### 1️⃣ Créer des professeurs de test

```powershell
node scripts/init-teachers.js
```

Cela créera 4 professeurs avec le mot de passe: `Teacher2024!`

### 2️⃣ Configurer les règles Firestore

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. Allez dans **Firestore Database** > **Rules**
4. Ajoutez cette règle pour la collection `encadrement_requests`:

```javascript
match /encadrement_requests/{requestId} {
  // Lecture: étudiant, prof assigné, ou admin
  allow read: if request.auth != null && (
    resource.data.studentId == request.auth.uid ||
    resource.data.teacherId == request.auth.uid ||
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'tutor']
  );
  
  // Création: tout le monde (même non connecté)
  allow create: if true;
  
  // Mise à jour: prof ou admin
  allow update: if request.auth != null && (
    resource.data.teacherId == request.auth.uid ||
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'tutor', 'teacher']
  );
  
  // Suppression: super admin uniquement
  allow delete: if request.auth != null &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';
}
```

5. Cliquez sur **Publier**

### 3️⃣ Tester le système

#### En tant qu'étudiant:
1. Allez sur `http://localhost:3000/encadrement`
2. Sélectionnez un professeur dans la liste
3. Remplissez le formulaire (tous les champs avec *)
4. **N'oubliez pas de sélectionner au moins une disponibilité**
5. Cliquez sur "Envoyer ma demande"

#### En tant que professeur:
1. Connectez-vous avec: `thomas.martin@mathosphere.com` / `Teacher2024!`
2. Allez sur `http://localhost:3000/admin/professeur/demandes`
3. Vous verrez la demande avec toutes les infos de l'étudiant
4. Cliquez sur l'icône 👁️ pour voir les détails
5. Cliquez sur ✓ pour approuver ou ✗ pour rejeter

#### En tant que super admin:
1. Connectez-vous avec votre compte super admin
2. Allez sur `http://localhost:3000/admin/super/demandes`
3. Vous verrez TOUTES les demandes de tous les professeurs
4. Statistiques en haut: Total, En attente, Approuvées, Rejetées, Annulées
5. Gérez les demandes comme un professeur

## 📊 Données stockées

Chaque demande contient (dans Firestore):

```javascript
{
  studentId: "",                    // ID utilisateur (si connecté)
  studentName: "Jean Dupont",       // Nom complet ✅
  studentEmail: "jean@email.com",   // Email ✅
  studentClass: "Terminale S",      // Classe ✅ ⭐
  studentLevel: "Lycée",            // Niveau ✅
  studentSchool: "Lycée Hugo",      // École ✅
  
  teacherId: "prof123",             // ID du prof choisi ✅
  teacherName: "Thomas Martin",     // Nom du prof ✅
  
  formule: "Standard (2h/mois)",    // Formule choisie ✅
  subject: "Mathématiques",         // Matière ✅
  objectives: "Améliorer...",       // Objectifs ✅
  availability: ["Lundi AM", ...],  // Disponibilités ✅
  message: "Message optionnel",     // Message ✅
  
  status: "pending",                // pending | approved | rejected | cancelled
  adminNotes: "",                   // Notes du prof/admin
  rejectionReason: "",              // Raison si rejet
  
  createdAt: timestamp,             // Date de création
  updatedAt: timestamp,             // Dernière modif
  approvedBy: "",                   // Qui a approuvé
  approvedAt: null,                 // Quand
}
```

## ✨ Fonctionnalités principales

### ✅ Page étudiant (`/encadrement`)
- 📋 Formulaire complet avec validation
- 👨‍🏫 Sélection du professeur (liste dynamique depuis Firebase)
- ⏰ Choix des disponibilités (checkboxes multiples)
- 💰 Choix de la formule (Standard, Intensive, Sur mesure)
- ✉️ Envoi direct dans Firestore
- ✔️ Message de confirmation

### ✅ Page professeur (`/admin/professeur/demandes`)
- 📊 Statistiques personnelles (Total, En attente, Approuvées, Rejetées)
- 📑 Onglets: "En attente" et "Toutes"
- 👀 Voir les détails complets de chaque demande
- ✅ Approuver avec notes optionnelles
- ❌ Rejeter avec raison obligatoire
- 🔔 Toasts de confirmation

### ✅ Page super admin (`/admin/super/demandes`)
- 📊 Statistiques globales (toutes les demandes, tous les profs)
- 📑 Onglets: "En attente" et "Toutes"
- 🔍 Voir TOUTES les demandes de TOUS les professeurs
- 👨‍🎓 Informations complètes des étudiants (nom, email, **classe**, niveau, école)
- ✅ Approuver/Rejeter n'importe quelle demande
- 📝 Ajouter des notes administratives

## 🎯 Points importants

1. **La classe est bien stockée et affichée** ✅
   - Champ `studentClass` dans Firestore
   - Visible sur les pages prof et admin
   - Exemple: "Terminale S", "3ème", "Licence 1"

2. **Les demandes apparaissent sur la page du prof choisi** ✅
   - Filtrage automatique par `teacherId`
   - Le prof ne voit que ses demandes

3. **Les demandes apparaissent sur la page du super admin** ✅
   - Aucun filtrage
   - Toutes les demandes de tous les profs

4. **Statuts des demandes** ✅
   - 🟠 Pending (en attente)
   - 🟢 Approved (approuvée)
   - 🔴 Rejected (rejetée)
   - ⚫ Cancelled (annulée)

## 🔍 Vérification rapide

### Vérifier que tout fonctionne:

1. ✅ Les professeurs sont dans Firebase Auth + Firestore users (role: "teacher")
2. ✅ Le formulaire `/encadrement` charge la liste des professeurs
3. ✅ On peut sélectionner un professeur (bordure bleue + check)
4. ✅ Le formulaire s'envoie et crée un document dans `encadrement_requests`
5. ✅ Le professeur voit la demande sur `/admin/professeur/demandes`
6. ✅ Le super admin voit la demande sur `/admin/super/demandes`
7. ✅ On peut voir tous les détails (y compris la classe)
8. ✅ On peut approuver ou rejeter

### Si un élément ne fonctionne pas:

**Professeurs ne s'affichent pas:**
- Exécuter `node scripts/init-teachers.js`
- Vérifier dans Firestore > users > chercher `role: "teacher"`

**Impossible d'envoyer la demande:**
- Vérifier que tous les champs obligatoires (*) sont remplis
- Vérifier qu'un professeur est sélectionné
- Vérifier qu'au moins une disponibilité est cochée
- Ouvrir la console (F12) pour voir les erreurs

**Demandes n'apparaissent pas côté prof/admin:**
- Vérifier les règles Firestore
- Vérifier que l'utilisateur a bien le rôle teacher ou super_admin
- Vérifier dans Firestore > encadrement_requests

## 🎉 C'est prêt !

Vous avez maintenant un système complet et fonctionnel de gestion des demandes d'encadrement !

- ✅ Les étudiants peuvent faire des demandes
- ✅ Les professeurs reçoivent et gèrent leurs demandes
- ✅ Les admins supervisent tout
- ✅ Toutes les informations sont stockées (y compris la classe ⭐)

Pour plus de détails, consultez `ENCADREMENT_REQUESTS_COMPLETE.md` 📚
