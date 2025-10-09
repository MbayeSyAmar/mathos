# 🏆 Système de Badges Mathosphere

## Vue d'ensemble

Le système de badges gamifie l'expérience d'apprentissage en récompensant les étudiants pour leurs accomplissements. Les badges sont débloqués automatiquement lorsque les conditions sont remplies.

## 🎖️ Liste des badges (12 au total)

### 📚 Catégorie : Cours (3 badges)

| Badge | Icon | Condition | XP | Description |
|-------|------|-----------|-----|-------------|
| **Premier pas** | 🎓 | 1 cours complété | 50 | Compléter votre premier cours |
| **Apprenti studieux** | 📚 | 5 cours complétés | 100 | Compléter 5 cours |
| **Expert en cours** | 🏆 | 10 cours complétés | 200 | Compléter 10 cours |

### ✍️ Catégorie : Exercices (2 badges)

| Badge | Icon | Condition | XP | Description |
|-------|------|-----------|-----|-------------|
| **Débutant assidu** | ✍️ | 10 exercices complétés | 100 | Compléter 10 exercices |
| **Maître des exercices** | 💪 | 50 exercices complétés | 250 | Compléter 50 exercices |

### 🧠 Catégorie : Quiz (2 badges)

| Badge | Icon | Condition | XP | Description |
|-------|------|-----------|-----|-------------|
| **As des quiz** | 🌟 | Score ≥ 90% à un quiz | 150 | Obtenir au moins 90% à un quiz |
| **Génie du quiz** | 🧠 | Score = 100% à un quiz | 300 | Obtenir un score parfait à un quiz |

### ⏰ Catégorie : Temps d'étude (3 badges)

| Badge | Icon | Condition | XP | Description |
|-------|------|-----------|-----|-------------|
| **Studieux** | ⏰ | 600 minutes d'étude | 100 | Accumuler 10 heures d'étude |
| **Acharné** | 🔥 | 3000 minutes d'étude | 300 | Accumuler 50 heures d'étude |
| **Semaine parfaite** | 📅 | 7 jours consécutifs | 200 | Étudier 7 jours d'affilée |
| **Mois légendaire** | 👑 | 30 jours consécutifs | 500 | Étudier 30 jours d'affilée |

### ⭐ Catégorie : Réussite (2 badges)

| Badge | Icon | Condition | XP | Description |
|-------|------|-----------|-----|-------------|
| **Excellent élève** | ⭐ | Taux de réussite ≥ 80% | 200 | Maintenir un taux de réussite de 80% |
| **Élève parfait** | 💎 | Taux de réussite ≥ 95% | 400 | Maintenir un taux de réussite de 95% |

## 📁 Structure des fichiers

### Service principal

#### `lib/services/badges-service.ts`

**Fonctions principales :**

```typescript
// Vérifier et débloquer nouveaux badges
checkAndUnlockBadges(userId: string): Promise<Badge[]>

// Débloquer un badge spécifique
unlockBadge(userId: string, badgeId: string): Promise<void>

// Obtenir un badge par ID
getBadgeById(badgeId: string): Badge | undefined

// Obtenir les badges d'un utilisateur
getUserBadges(badgeIds: string[]): Badge[]

// Obtenir tous les badges disponibles
getAvailableBadges(): Badge[]
```

**Types :**

```typescript
interface Badge {
  id: string
  title: string
  description: string
  icon: string
  category: "course" | "exercise" | "quiz" | "streak" | "achievement"
  condition: {
    type: "course_completed" | "exercises_completed" | "quiz_score" 
        | "study_time" | "streak_days" | "success_rate"
    value: number
  }
  xpReward: number
}
```

## 🔄 Flux de déverrouillage

### 1. Déclenchement automatique

Le système vérifie automatiquement les nouveaux badges dans plusieurs situations :

**A. Lors du chargement du dashboard :**
```typescript
// app/dashboard/page.tsx
useEffect(() => {
  const loadProgress = async () => {
    const progress = await getStudentProgress(user.uid)
    const newBadges = await checkAndUnlockBadges(user.uid)
    
    if (newBadges.length > 0) {
      newBadges.forEach(badge => {
        toast.success(`🎉 Nouveau badge : ${badge.title}!`)
      })
    }
  }
  loadProgress()
}, [user])
```

**B. Lors du chargement de l'encadrement :**
```typescript
// app/dashboard/encadrement/page.tsx
const loadStudentProgress = async () => {
  const progress = await getStudentProgress(user.uid)
  const newBadges = await checkAndUnlockBadges(user.uid)
  
  if (newBadges.length > 0) {
    newBadges.forEach((badge) => {
      toast.success(`🎉 Nouveau badge débloqué : ${badge.title}!`, {
        description: badge.description,
      })
    })
  }
}
```

### 2. Vérification des conditions

```typescript
export async function checkAndUnlockBadges(userId: string): Promise<Badge[]> {
  const progress = await getStudentProgress(userId)
  if (!progress) return []

  const unlockedBadges: Badge[] = []

  for (const badge of AVAILABLE_BADGES) {
    // Si déjà débloqué, passer
    if (progress.badges.includes(badge.id)) continue

    // Vérifier la condition
    let shouldUnlock = false
    
    switch (badge.condition.type) {
      case "course_completed":
        shouldUnlock = progress.completedCourses >= badge.condition.value
        break
      case "exercises_completed":
        shouldUnlock = progress.completedExercises >= badge.condition.value
        break
      case "quiz_score":
        shouldUnlock = progress.averageQuizScore >= badge.condition.value
        break
      case "study_time":
        shouldUnlock = progress.totalStudyTimeMinutes >= badge.condition.value
        break
      case "streak_days":
        shouldUnlock = calculateStreak(progress) >= badge.condition.value
        break
      case "success_rate":
        shouldUnlock = progress.successRate >= badge.condition.value
        break
    }

    if (shouldUnlock) {
      await unlockBadge(userId, badge.id)
      unlockedBadges.push(badge)
    }
  }

  return unlockedBadges
}
```

### 3. Enregistrement dans Firestore

```typescript
export async function unlockBadge(userId: string, badgeId: string): Promise<void> {
  const progressRef = doc(db, "student_progress", userId)
  const badge = getBadgeById(badgeId)
  
  if (!badge) return

  await updateDoc(progressRef, {
    badges: arrayUnion(badgeId),
    xp: increment(badge.xpReward),
    updatedAt: serverTimestamp(),
  })
}
```

## 🎨 Affichage des badges

### Dans le dashboard

```typescript
// app/dashboard/page.tsx
const userBadges = getUserBadges(studentProgress.badges)

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {userBadges.map((badge) => (
    <div key={badge.id} className="p-4 border rounded-lg">
      <div className="text-4xl mb-2">{badge.icon}</div>
      <div className="text-sm font-medium">{badge.title}</div>
      <div className="text-xs text-muted-foreground">{badge.description}</div>
      <div className="text-xs text-primary mt-1">+{badge.xpReward} XP</div>
    </div>
  ))}
</div>
```

### Dans la page d'encadrement

```typescript
// app/dashboard/encadrement/page.tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Trophy className="h-5 w-5 text-yellow-500" />
      Badges et Récompenses
    </CardTitle>
    <CardDescription>
      {userBadges.length} badge{userBadges.length > 1 ? "s" : ""} débloqué{userBadges.length > 1 ? "s" : ""}
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* XP Total */}
    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
      <span className="font-medium">Total XP</span>
      <span className="text-2xl font-bold text-primary">{studentProgress.xp}</span>
    </div>

    {/* Badges débloqués */}
    <div className="grid grid-cols-2 gap-2">
      {userBadges.map((badge) => (
        <div key={badge.id} className="p-3 border rounded-lg">
          <div className="text-2xl mb-1">{badge.icon}</div>
          <div className="text-xs font-medium mb-1">{badge.title}</div>
          <div className="text-xs text-muted-foreground">{badge.description}</div>
          <div className="text-xs text-primary mt-1">+{badge.xpReward} XP</div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

## 🔔 Notifications

### Toast lors du déverrouillage

```typescript
toast.success(`🎉 Nouveau badge débloqué : ${badge.title}!`, {
  description: badge.description,
})
```

### Badge dans la navigation (futur)

```typescript
const totalBadges = userBadges.length
<Badge variant="secondary">{totalBadges}</Badge>
```

## 📊 Intégration avec le progrès étudiant

### Lien avec student_progress

Les badges utilisent les données de `student_progress` :

```typescript
interface StudentProgress {
  // Utilisé pour badges de cours
  completedCourses: number
  
  // Utilisé pour badges d'exercices
  completedExercises: number
  
  // Utilisé pour badges de quiz
  averageQuizScore: number
  
  // Utilisé pour badges de temps
  totalStudyTimeMinutes: number
  
  // Utilisé pour badges de réussite
  successRate: number
  
  // Liste des badges débloqués
  badges: string[]
  
  // XP total accumulé
  xp: number
}
```

### Mise à jour automatique

Chaque fois qu'une action est effectuée, les badges sont recalculés :

```typescript
// Après compléter un cours
await updateCourseProgress(userId, courseId, { completed: true })
await checkAndUnlockBadges(userId) // Vérifie les badges de cours

// Après un quiz
await updateQuizProgress(userId, quizId, { score: 95 })
await checkAndUnlockBadges(userId) // Vérifie les badges de quiz

// Après un exercice
await updateExerciseProgress(userId, exerciseId, { completed: true })
await checkAndUnlockBadges(userId) // Vérifie les badges d'exercices
```

## 🎯 Conditions de déverrouillage détaillées

### Course Badges (Cours)

```typescript
// Premier pas - 🎓
completedCourses >= 1  // Au moins 1 cours terminé

// Apprenti studieux - 📚
completedCourses >= 5  // Au moins 5 cours terminés

// Expert en cours - 🏆
completedCourses >= 10 // Au moins 10 cours terminés
```

### Exercise Badges (Exercices)

```typescript
// Débutant assidu - ✍️
completedExercises >= 10  // Au moins 10 exercices terminés

// Maître des exercices - 💪
completedExercises >= 50  // Au moins 50 exercices terminés
```

### Quiz Badges (Quiz)

```typescript
// As des quiz - 🌟
averageQuizScore >= 90  // Moyenne ≥ 90% sur tous les quiz

// Génie du quiz - 🧠
averageQuizScore >= 100 // Moyenne = 100% (tous parfaits)
```

### Streak Badges (Séries)

```typescript
// Studieux - ⏰
totalStudyTimeMinutes >= 600  // 10 heures d'étude cumulées

// Acharné - 🔥
totalStudyTimeMinutes >= 3000 // 50 heures d'étude cumulées

// Semaine parfaite - 📅
consecutiveDays >= 7  // 7 jours consécutifs d'étude

// Mois légendaire - 👑
consecutiveDays >= 30 // 30 jours consécutifs d'étude
```

### Achievement Badges (Réussite)

```typescript
// Excellent élève - ⭐
successRate >= 80  // Taux de réussite ≥ 80%

// Élève parfait - 💎
successRate >= 95  // Taux de réussite ≥ 95%
```

## 🚀 Utilisation dans le code

### Charger les badges d'un étudiant

```typescript
import { getUserBadges, checkAndUnlockBadges } from "@/lib/services/badges-service"
import { getStudentProgress } from "@/lib/services/student-progress-service"

const progress = await getStudentProgress(userId)
const userBadges = getUserBadges(progress.badges)

// Afficher
userBadges.forEach(badge => {
  console.log(`${badge.icon} ${badge.title} (+${badge.xpReward} XP)`)
})
```

### Vérifier les nouveaux badges

```typescript
const newBadges = await checkAndUnlockBadges(userId)

if (newBadges.length > 0) {
  console.log(`🎉 ${newBadges.length} nouveau(x) badge(s) débloqué(s) !`)
  
  newBadges.forEach(badge => {
    toast.success(`Nouveau badge : ${badge.title}!`, {
      description: badge.description
    })
  })
}
```

### Obtenir tous les badges disponibles

```typescript
import { getAvailableBadges } from "@/lib/services/badges-service"

const allBadges = getAvailableBadges()

// Afficher la liste complète avec verrous
allBadges.forEach(badge => {
  const isUnlocked = progress.badges.includes(badge.id)
  console.log(`${isUnlocked ? '✅' : '🔒'} ${badge.icon} ${badge.title}`)
})
```

## 🎨 Personnalisation

### Ajouter un nouveau badge

```typescript
// Dans badges-service.ts
const AVAILABLE_BADGES: Badge[] = [
  // ...existing badges...
  {
    id: "super_champion",
    title: "Super Champion",
    description: "Obtenir tous les autres badges",
    icon: "🏅",
    category: "achievement",
    condition: {
      type: "badges_unlocked",
      value: 12, // Tous les autres badges
    },
    xpReward: 1000,
  },
]
```

### Modifier les récompenses XP

```typescript
// Changer dans AVAILABLE_BADGES
{
  id: "premier_pas",
  // ...
  xpReward: 100, // Au lieu de 50
}
```

### Changer les conditions

```typescript
{
  id: "expert_en_cours",
  title: "Expert en cours",
  // ...
  condition: {
    type: "course_completed",
    value: 20, // Au lieu de 10
  },
}
```

## 🔮 Améliorations futures

- [ ] Niveaux d'étudiant basés sur XP (Bronze, Argent, Or, Platine)
- [ ] Classement global des étudiants par XP
- [ ] Badges secrets à découvrir
- [ ] Badges temporaires (challenges hebdomadaires)
- [ ] Partage de badges sur les réseaux sociaux
- [ ] Animation lors du déverrouillage
- [ ] Page dédiée "Mes badges" avec progression
- [ ] Badges d'équipe (groupes d'étude)
- [ ] Récompenses tangibles (réductions, certifications)
- [ ] Badges personnalisés par professeur

## 🛡️ Sécurité

### Validation côté serveur (à implémenter)

```typescript
// Cloud Function à créer
export const unlockBadge = functions.https.onCall(async (data, context) => {
  // Vérifier l'authentification
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in')
  }
  
  // Vérifier les conditions côté serveur
  const progress = await getStudentProgress(context.auth.uid)
  const badge = getBadgeById(data.badgeId)
  
  // Valider que la condition est vraiment remplie
  // ...
  
  // Puis débloquer
  await unlockBadge(context.auth.uid, data.badgeId)
})
```

## 📝 Notes importantes

- Les badges sont vérifiés automatiquement au chargement des pages
- L'XP est incrémenté automatiquement lors du déverrouillage
- Les badges ne peuvent être débloqués qu'une seule fois
- Les conditions sont vérifiées en temps réel
- Les notifications apparaissent immédiatement lors du déverrouillage
- Le système est complètement automatique, aucune action manuelle nécessaire

## 🚦 Statut

✅ **Service de badges** : Complet avec 12 badges
✅ **Intégration dashboard** : Badges affichés
✅ **Intégration encadrement** : Badges affichés avec XP
✅ **Vérification automatique** : Implémentée
✅ **Notifications toast** : Fonctionnelles
✅ **Tests** : À faire
