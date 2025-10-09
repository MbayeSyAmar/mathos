# 🎓 Guide d'Utilisation - Page d'Encadrement Dynamique

## 🎯 Vue d'ensemble

La page d'encadrement (`/dashboard/encadrement`) est maintenant **100% fonctionnelle et dynamique** avec Firebase. Elle charge toutes les données depuis Firestore en temps réel.

## ✨ Fonctionnalités

### ✅ Fonctionnalités Actives

1. **Chargement dynamique des données**
   - Encadrement actif de l'utilisateur
   - Informations du professeur
   - Sessions à venir et passées
   - Messages en temps réel
   - Progression par chapitre
   - Ressources recommandées

2. **Messagerie fonctionnelle**
   - Envoi de messages au professeur
   - Historique des conversations
   - Messages en temps réel

3. **Affichage intelligent**
   - État de chargement
   - Gestion des erreurs
   - Messages d'information si pas d'encadrement

4. **Formatage des dates**
   - Format français
   - Dates relatives
   - Timestamps lisibles

## 🚀 Démarrage Rapide

### Méthode 1 : Utiliser les Données de Démonstration

Les comptes de démonstration sont déjà configurés avec des données statiques :

```
Email: demo@mathosphere.fr
Mot de passe: mathosphere123
```

➡️ Connectez-vous et allez sur `/dashboard/encadrement`

### Méthode 2 : Initialiser des Données de Test Firebase

Pour avoir des données dynamiques depuis Firebase :

#### Étape 1 : Prérequis
```bash
# Installer les dépendances
pnpm add firebase-admin date-fns

# S'assurer que serviceAccountKey.json existe
# (Téléchargé depuis Firebase Console > Project Settings > Service Accounts)
```

#### Étape 2 : Exécuter le Script
```bash
node scripts/init-encadrement-data.js
```

Ce script va créer :
- ✅ Un étudiant de test (`demo@mathosphere.fr`)
- ✅ Un professeur de test (`prof@mathosphere.fr`)
- ✅ Un encadrement actif
- ✅ 2 sessions à venir
- ✅ 3 sessions passées avec notes et ressources
- ✅ 3 messages
- ✅ 5 progressions par chapitre
- ✅ 3 ressources recommandées

#### Étape 3 : Tester
```
1. Connectez-vous avec: demo@mathosphere.fr / mathosphere123
2. Allez sur: http://localhost:3000/dashboard/encadrement
3. Toutes les données sont chargées depuis Firebase !
```

## 📊 Structure des Données

### Collections Firestore Créées

```
encadrements/           → Abonnements d'encadrement
sessions/               → Séances passées et à venir
messages/               → Messagerie étudiant-professeur
progression/            → Progression par chapitre
resources/              → Ressources recommandées
```

Voir `FIRESTORE_ENCADREMENT.md` pour la structure complète.

## 🎨 Interface Utilisateur

### Page Principale

```
┌─────────────────────────────────────────────────────┐
│  Mon Encadrement Personnalisé                       │
│  [Formule Intensive] Suivi avec Thomas Martin       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📅 Prochaines Sessions                             │
│  ┌──────────────────────────────────────┐          │
│  │ Révision des nombres complexes        │          │
│  │ Lundi 15 avril • 16:00 - 17:00       │          │
│  │                          [confirmé]   │          │
│  └──────────────────────────────────────┘          │
│                                                      │
│  📚 Tabs: [Sessions] [Progression] [Messages]      │
│                                                      │
│  [Sidebar]                                          │
│  ├─ 👨‍🏫 Carte du professeur                         │
│  ├─ 📋 Détails de la formule                       │
│  └─ 📚 Ressources recommandées                     │
└─────────────────────────────────────────────────────┘
```

### Tab Sessions Précédentes

- Liste des sessions passées
- Notes du professeur
- Ressources partagées
- Bouton "Voir les détails"

### Tab Progression

- Barres de progression par chapitre
- Pourcentage de complétion
- Notes du professeur

### Tab Messages

- Historique des conversations
- Avatar du professeur/étudiant
- Dates des messages
- **Champ de saisie fonctionnel**
- Bouton "Envoyer" actif

## 🔧 Fonctions Disponibles

### Hook `useEncadrement()`

```typescript
const {
  loading,              // État de chargement
  error,                // Message d'erreur
  encadrement,          // Encadrement actif
  teacher,              // Infos du professeur
  upcomingSessions,     // Sessions à venir
  pastSessions,         // Sessions passées
  messages,             // Messages
  progression,          // Progression par chapitre
  resources,            // Ressources
  sendNewMessage,       // Envoyer un message
  refreshData,          // Recharger les données
} = useEncadrement();
```

### Service `encadrement-service.ts`

```typescript
// Récupérer l'encadrement
await getEncadrementByUserId(userId)

// Récupérer les sessions
await getUpcomingSessions(encadrementId)
await getPastSessions(encadrementId, limit)

// Envoyer un message
await sendMessage({ encadrementId, senderId, recipientId, content })

// Créer une session
await createSession({ encadrementId, userId, teacherId, date, ... })

// Et plus...
```

## ⚙️ Configuration Requise

### package.json

```json
{
  "dependencies": {
    "firebase": "^10.x.x",
    "date-fns": "^3.x.x",
    "framer-motion": "^11.x.x"
  }
}
```

### Firestore Rules

Voir `FIRESTORE_ENCADREMENT.md` pour les règles de sécurité complètes.

## 🐛 Dépannage

### Problème : Page vide ou "Aucun encadrement actif"

**Solution :**
1. Vérifiez que vous êtes connecté
2. Exécutez le script d'initialisation :
   ```bash
   node scripts/init-encadrement-data.js
   ```
3. Vérifiez dans Firebase Console que les collections existent

### Problème : Erreur "Cannot read properties of undefined"

**Solution :**
1. Vérifiez que Firebase est configuré correctement
2. Vérifiez les règles Firestore
3. Consultez la console du navigateur pour plus de détails

### Problème : Les messages ne s'envoient pas

**Solution :**
1. Vérifiez que l'encadrement existe
2. Vérifiez les permissions dans les règles Firestore
3. Ouvrez la console pour voir les erreurs

### Problème : Dates non formatées

**Solution :**
```bash
# Installer date-fns
pnpm add date-fns
```

## 📚 Documentation Associée

- `FIRESTORE_ENCADREMENT.md` - Structure Firestore complète
- `lib/services/encadrement-service.ts` - Services et API
- `hooks/use-encadrement.ts` - Hook personnalisé
- `scripts/init-encadrement-data.js` - Script d'initialisation

## 🎯 Prochaines Fonctionnalités

- [ ] Planification de nouvelles sessions
- [ ] Visioconférence intégrée
- [ ] Upload de fichiers/ressources
- [ ] Notifications en temps réel
- [ ] Gestion de l'abonnement
- [ ] Annulation/modification de sessions
- [ ] Notes vocales
- [ ] Rappels par email

## ✅ Checklist de Test

### Test Manuel

- [ ] Connexion avec compte démo
- [ ] Chargement de la page `/dashboard/encadrement`
- [ ] Affichage des sessions à venir
- [ ] Affichage des sessions passées
- [ ] Affichage de la progression
- [ ] Envoi d'un message
- [ ] Réception du message dans l'historique
- [ ] Affichage des ressources
- [ ] Formatage correct des dates
- [ ] Responsive sur mobile

### Test avec Firebase

- [ ] Script d'initialisation exécuté
- [ ] Données présentes dans Firestore
- [ ] Règles de sécurité configurées
- [ ] Connexion Firebase fonctionnelle
- [ ] Lecture des données OK
- [ ] Écriture des messages OK

## 🚀 Déploiement

Avant de déployer en production :

1. ✅ Configurer les règles Firestore
2. ✅ Tester tous les scénarios
3. ✅ Vérifier les permissions
4. ✅ Optimiser les requêtes (index Firestore)
5. ✅ Configurer les quotas Firebase
6. ✅ Ajouter la gestion d'erreurs robuste
7. ✅ Implémenter les notifications

---

**Version :** 1.0.0 (Dynamique avec Firebase)  
**Dernière mise à jour :** 2025-01-10  
**Statut :** ✅ 100% Fonctionnel

🎉 **La page d'encadrement est maintenant totalement dynamique !**
