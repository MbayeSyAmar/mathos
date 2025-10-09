# 🎓 Mathosphere - Plateforme d'apprentissage des mathématiques

## 📋 Vue d'ensemble

Mathosphere est une plateforme complète d'apprentissage des mathématiques avec encadrement personnalisé, système de progression dynamique, badges de récompense et messagerie en temps réel.

## ✨ Fonctionnalités principales

### 🔐 Authentification & Rôles
- **5 rôles utilisateurs** : Super Admin, Professeur, Tuteur, Rédacteur, Étudiant
- Authentification Firebase avec session cookies
- Protection des routes par middleware
- Custom claims pour gestion des rôles

### 🎯 Encadrement personnalisé
- **Page publique** pour demander un encadrement (`/encadrement`)
- Sélection du professeur souhaité
- Formulaire complet (nom, email, classe, niveau, école, formule, matière, objectifs, disponibilités)
- **Page professeur** pour gérer les demandes (`/admin/professeur/demandes`)
- **Page super admin** pour voir toutes les demandes (`/admin/super/demandes`)
- Statistiques en temps réel (total, en attente, approuvées, rejetées)

### 📊 Suivi de progression (100% dynamique)
- **Dashboard étudiant** (`/dashboard`) entièrement connecté à Firebase
- Progression des cours, exercices, quiz
- Statistiques détaillées (temps d'étude, taux de réussite, niveau, XP)
- Activités récentes en temps réel
- Badges débloqués
- Messages non lus avec notification

### 🏆 Système de badges
- **12 badges** répartis en 5 catégories
- Déverrouillage automatique selon les conditions
- Récompenses XP (50 à 500 XP par badge)
- Notifications toast lors du déverrouillage
- Affichage dans dashboard et page encadrement

### 💬 Messagerie en temps réel
- **Chat étudiant ↔ professeur** dans l'encadrement
- **Chat professeur ↔ super admin** pour questions administratives
- Interface temps réel avec Firestore onSnapshot
- Indicateurs de messages lus/non lus
- Compteurs de messages non lus
- Composant réutilisable `ChatInterface`

### 📚 Gestion des contenus
- Cours avec progression
- Exercices avec suivi
- Quiz avec scores
- Vidéos éducatives
- Blog et forum
- Boutique de matériel

## 🗂️ Structure du projet

```
mathosphere/
├── app/
│   ├── page.tsx                      # Page d'accueil
│   ├── connexion/                    # Connexion
│   ├── inscription/                  # Inscription
│   ├── dashboard/                    # Dashboard étudiant (dynamique)
│   │   ├── page.tsx                  # Vue principale (100% Firebase)
│   │   ├── encadrement/              # Espace encadrement avec chat
│   │   ├── progression/              # Détails progression
│   │   └── mon-profil/               # Profil utilisateur
│   ├── encadrement/
│   │   └── page.tsx                  # Formulaire public demande encadrement
│   ├── admin/
│   │   ├── professeur/
│   │   │   ├── demandes/             # Demandes d'encadrement du prof
│   │   │   └── messages/             # Chat avec super admin
│   │   └── super/
│   │       ├── demandes/             # Toutes les demandes (admin)
│   │       └── messages/             # Tous les chats professeurs
│   ├── cours/                        # Catalogue de cours
│   ├── exercices/                    # Exercices
│   ├── quiz/                         # Quiz
│   ├── videos/                       # Vidéos
│   ├── blog/                         # Blog articles
│   ├── forum/                        # Forum discussions
│   ├── boutique/                     # Boutique matériel
│   └── contact/                      # Page contact
├── components/
│   ├── header.tsx                    # En-tête navigation
│   ├── footer.tsx                    # Pied de page
│   ├── cart.tsx                      # Panier boutique
│   ├── math-chatbot.tsx              # Chatbot mathématique
│   ├── chat-interface.tsx            # Composant chat réutilisable
│   ├── admin/                        # Composants admin
│   └── ui/                           # shadcn/ui components
├── lib/
│   ├── firebase.ts                   # Configuration Firebase
│   ├── firebase-init.ts              # Initialisation admin
│   ├── auth-context.tsx              # Context d'authentification
│   └── services/
│       ├── encadrement-requests-service.ts    # Gestion demandes
│       ├── student-progress-service.ts        # Progression étudiant
│       ├── messaging-service.ts               # Messagerie temps réel
│       └── badges-service.ts                  # Système de badges
├── hooks/
│   ├── use-toast.ts                  # Hook toast notifications
│   └── use-encadrement.tsx           # Hook encadrement
├── middleware.ts                     # Protection routes
└── Documentation/
    ├── MESSAGING_SYSTEM.md           # Doc messagerie
    ├── BADGES_SYSTEM.md              # Doc badges
    ├── ENCADREMENT_REQUESTS.md       # Doc encadrement
    └── QUICK_START.md                # Guide démarrage
```

## 🔧 Technologies utilisées

### Frontend
- **Next.js 14** - App Router, Server/Client Components
- **TypeScript** - Typage strict complet
- **Tailwind CSS** - Styling utilitaire
- **shadcn/ui** - Composants UI modernes
- **Framer Motion** - Animations fluides
- **date-fns** - Formatage dates (locale française)
- **Sonner** - Toast notifications

### Backend & Base de données
- **Firebase Authentication** - Gestion utilisateurs
- **Firestore** - Base de données NoSQL temps réel
- **Custom Claims** - Gestion des rôles
- **Session Cookies** - Authentification serveur

### Services créés
- ✅ `encadrement-requests-service` - CRUD complet demandes
- ✅ `student-progress-service` - Suivi progression complète
- ✅ `messaging-service` - Chat temps réel multi-rôles
- ✅ `badges-service` - Système de récompenses

## 📊 Collections Firestore

### `users`
```typescript
{
  uid: string
  email: string
  displayName: string
  role: "super_admin" | "teacher" | "tutor" | "editor" | "student"
  photoURL?: string
  bio?: string
  speciality?: string
  createdAt: Timestamp
}
```

### `encadrement_requests`
```typescript
{
  id: string
  studentName: string
  studentEmail: string
  studentClass: string      // Nouvelle : classe de l'élève
  level: string
  school: string
  teacherId: string
  teacherName: string
  formule: string
  subject: string
  objectives: string
  availability: string[]
  message?: string
  status: "pending" | "approved" | "rejected" | "cancelled"
  createdAt: Timestamp
  updatedAt: Timestamp
  reviewedAt?: Timestamp
  reviewedBy?: string
}
```

### `student_progress`
```typescript
{
  userId: string
  totalCourses: number
  completedCourses: number
  totalExercises: number
  completedExercises: number
  totalQuizzes: number
  averageQuizScore: number
  totalStudyTimeMinutes: number
  successRate: number
  badges: string[]           // IDs des badges débloqués
  xp: number                // XP total
  level: number
  lastActivityAt: Timestamp
  updatedAt: Timestamp
}
```

### `course_progress`
```typescript
{
  id: string
  userId: string
  courseId: string
  courseName: string
  progress: number          // 0-100
  timeSpent: number         // minutes
  completed: boolean
  lastAccessedAt: Timestamp
}
```

### `exercise_progress`
```typescript
{
  id: string
  userId: string
  exerciseId: string
  exerciseName: string
  attempts: number
  completed: boolean
  score?: number
  timeSpent: number
  lastAttemptAt: Timestamp
}
```

### `quiz_progress`
```typescript
{
  id: string
  userId: string
  quizId: string
  quizName: string
  score: number             // 0-100
  attempts: number
  completed: boolean
  bestScore: number
  lastAttemptAt: Timestamp
}
```

### `conversations`
```typescript
{
  id: string
  studentId: string
  studentName: string
  teacherId: string         // Peut être super_admin
  teacherName: string
  encadrementId?: string
  lastMessage?: string
  lastMessageAt?: Timestamp
  unreadCountStudent: number
  unreadCountTeacher: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### `messages`
```typescript
{
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: "student" | "teacher" | "super_admin"
  content: string
  read: boolean
  readAt?: Timestamp
  createdAt: Timestamp
}
```

### `student_activities`
```typescript
{
  id: string
  userId: string
  type: "course" | "exercise" | "quiz" | "video" | "forum" | "badge"
  title: string
  description: string
  timestamp: Timestamp
}
```

## 🎯 Pages principales et leurs fonctionnalités

### `/` - Page d'accueil
- Présentation de la plateforme
- Appels à l'action (inscription, découvrir)
- Témoignages et statistiques

### `/dashboard` - Dashboard étudiant (100% dynamique)
- ✅ Progression réelle depuis Firestore
- ✅ Statistiques en temps réel
- ✅ Activités récentes
- ✅ Badges débloqués
- ✅ Messages non lus
- ✅ Onglets : Cours / Exercices / Quiz / Favoris

### `/dashboard/encadrement` - Espace encadrement
- ✅ Informations du professeur assigné
- ✅ Sessions à venir et passées
- ✅ Chat en temps réel avec le professeur
- ✅ Progression personnalisée
- ✅ Badges et XP
- ✅ Ressources partagées

### `/encadrement` - Formulaire public
- ✅ Liste des professeurs depuis Firebase
- ✅ Sélection visuelle du professeur
- ✅ Formulaire complet avec validation
- ✅ Envoi vers Firestore

### `/admin/professeur/demandes` - Gestion demandes (Professeur)
- ✅ Voir les demandes qui lui sont adressées
- ✅ Informations complètes élève + classe
- ✅ Approuver/Rejeter
- ✅ Statistiques

### `/admin/professeur/messages` - Messages (Professeur)
- ✅ Chat unique avec super admin
- ✅ Création automatique de la conversation
- ✅ Temps réel
- ✅ Conseils de communication

### `/admin/super/demandes` - Toutes les demandes (Super Admin)
- ✅ Vue globale de toutes les demandes
- ✅ Filtres par statut
- ✅ Statistiques complètes
- ✅ Actions (approuver/rejeter)

### `/admin/super/messages` - Centre de messages (Super Admin)
- ✅ Liste de tous les professeurs
- ✅ Indicateurs de messages non lus
- ✅ Sélection de conversation
- ✅ Chat multi-professeurs
- ✅ Interface 2 colonnes

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+
- pnpm (recommandé) ou npm
- Compte Firebase

### Installation

```bash
# Cloner le projet
cd mathosphere

# Installer les dépendances
pnpm install

# Configurer Firebase
# Créer .env.local avec vos credentials Firebase
```

### Variables d'environnement

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Lancer le serveur de développement

```bash
pnpm dev
```

Le site sera accessible sur `http://localhost:3000`

## 🎨 Design & UX

### Thème
- Mode clair/sombre (toggle dans header)
- Couleurs principales : Orange/Bleu
- Typographie moderne et lisible
- Animations Framer Motion

### Composants UI
- shadcn/ui pour cohérence visuelle
- Cartes avec hover effects
- Badges colorés pour statuts
- Progress bars animées
- Toast notifications élégantes

### Responsive
- ✅ Mobile-first approach
- ✅ Breakpoints : sm, md, lg, xl
- ✅ Grids adaptatives
- ✅ Navigation mobile optimisée

## 🔐 Sécurité

### Authentification
- Firebase Auth avec session cookies
- Middleware Next.js pour protection routes
- Custom claims pour rôles
- Vérification côté serveur

### Rôles et permissions
```typescript
super_admin:  Accès total, gestion utilisateurs, toutes les demandes
teacher:      Demandes assignées, messages avec admin, gestion élèves
tutor:        Support élèves, pas d'approbation demandes
editor:       Gestion contenus (cours, exercices, blog)
student:      Accès cours, dashboard, encadrement
```

### Protection des données
- Rules Firestore à définir (à faire)
- Validation des entrées
- Sanitization des messages
- HTTPS obligatoire en production

## 📈 Métriques & Analytics

### Dashboard admin (à développer)
- Nombre d'étudiants actifs
- Demandes d'encadrement par mois
- Temps d'étude moyen
- Badges les plus débloqués
- Messages échangés
- Taux de complétion des cours

### Objectifs futurs
- Google Analytics
- Heatmaps (Hotjar)
- A/B Testing
- Feedback utilisateurs

## 🧪 Tests (à implémenter)

### Tests unitaires
```bash
# À créer
pnpm test
```

### Tests E2E
```bash
# À créer avec Playwright
pnpm test:e2e
```

## 📚 Documentation détaillée

- [📖 Système de messagerie](./MESSAGING_SYSTEM.md)
- [🏆 Système de badges](./BADGES_SYSTEM.md)
- [📝 Demandes d'encadrement](./ENCADREMENT_REQUESTS.md)
- [📊 Suivi de progression](./STUDENT_PROGRESS.md)
- [🚀 Guide de démarrage rapide](./QUICK_START.md)

## 🔮 Roadmap

### Court terme (1-2 mois)
- [ ] Tests unitaires et E2E
- [ ] Règles Firestore Security
- [ ] Cloud Functions pour validation
- [ ] Notifications push
- [ ] Export de données élèves (PDF)

### Moyen terme (3-6 mois)
- [ ] Application mobile (React Native)
- [ ] Système de paiement (Stripe)
- [ ] Visioconférence intégrée
- [ ] Tableau blanc collaboratif
- [ ] Générateur d'exercices IA
- [ ] Correcteur automatique

### Long terme (6-12 mois)
- [ ] IA personnalisée par élève
- [ ] Parcours d'apprentissage adaptatifs
- [ ] Marketplace de contenus
- [ ] Gamification avancée
- [ ] Intégration avec plateformes LMS
- [ ] Certification officielle

## 🤝 Contribution

### Guidelines
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de code
- TypeScript strict mode
- ESLint + Prettier
- Commits conventionnels
- Tests obligatoires pour nouvelles features

## 📧 Support

- Email : support@mathosphere.com
- Discord : [Serveur Mathosphere]
- Documentation : [docs.mathosphere.com]

## 📄 Licence

Propriétaire - Tous droits réservés

## 🎉 Remerciements

- Next.js team
- Firebase team
- shadcn pour les composants UI
- Communauté open source

---

**Mathosphere** - L'excellence en mathématiques à portée de tous 🎓✨
