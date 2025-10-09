/**
 * Service de gestion des badges et achievements
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { logActivity } from "./student-progress-service"

// ============================================================================
// TYPES DE BADGES
// ============================================================================

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
  category: "course" | "exercise" | "quiz" | "streak" | "achievement"
  condition: {
    type: "course_completed" | "exercises_completed" | "quiz_score" | "study_time" | "streak_days" | "success_rate"
    target: number
  }
  xpReward: number
  unlockedAt?: Timestamp
}

// Badges disponibles
export const AVAILABLE_BADGES: Badge[] = [
  // Badges de cours
  {
    id: "first_course",
    title: "Premier pas",
    description: "Terminez votre premier cours",
    icon: "🎓",
    category: "course",
    condition: { type: "course_completed", target: 1 },
    xpReward: 50,
  },
  {
    id: "course_master_5",
    title: "Apprenti studieux",
    description: "Terminez 5 cours",
    icon: "📚",
    category: "course",
    condition: { type: "course_completed", target: 5 },
    xpReward: 100,
  },
  {
    id: "course_master_10",
    title: "Expert en cours",
    description: "Terminez 10 cours",
    icon: "🏆",
    category: "course",
    condition: { type: "course_completed", target: 10 },
    xpReward: 200,
  },
  
  // Badges d'exercices
  {
    id: "exercise_beginner",
    title: "Débutant assidu",
    description: "Complétez 10 exercices",
    icon: "✍️",
    category: "exercise",
    condition: { type: "exercises_completed", target: 10 },
    xpReward: 75,
  },
  {
    id: "exercise_expert",
    title: "Maître des exercices",
    description: "Complétez 50 exercices",
    icon: "💪",
    category: "exercise",
    condition: { type: "exercises_completed", target: 50 },
    xpReward: 150,
  },
  
  // Badges de quiz
  {
    id: "quiz_ace",
    title: "As des quiz",
    description: "Obtenez 100% à un quiz",
    icon: "🌟",
    category: "quiz",
    condition: { type: "quiz_score", target: 100 },
    xpReward: 100,
  },
  {
    id: "quiz_master",
    title: "Génie du quiz",
    description: "Obtenez plus de 90% à 5 quiz",
    icon: "🧠",
    category: "quiz",
    condition: { type: "quiz_score", target: 90 },
    xpReward: 150,
  },
  
  // Badges de temps d'étude
  {
    id: "study_10h",
    title: "Studieux",
    description: "Étudiez pendant 10 heures",
    icon: "⏰",
    category: "achievement",
    condition: { type: "study_time", target: 600 }, // en minutes
    xpReward: 100,
  },
  {
    id: "study_50h",
    title: "Acharné",
    description: "Étudiez pendant 50 heures",
    icon: "🔥",
    category: "achievement",
    condition: { type: "study_time", target: 3000 },
    xpReward: 300,
  },
  
  // Badges de régularité
  {
    id: "streak_7",
    title: "Semaine parfaite",
    description: "Étudiez 7 jours d'affilée",
    icon: "📅",
    category: "streak",
    condition: { type: "streak_days", target: 7 },
    xpReward: 150,
  },
  {
    id: "streak_30",
    title: "Mois légendaire",
    description: "Étudiez 30 jours d'affilée",
    icon: "👑",
    category: "streak",
    condition: { type: "streak_days", target: 30 },
    xpReward: 500,
  },
  
  // Badges de réussite
  {
    id: "success_80",
    title: "Excellent élève",
    description: "Maintenez un taux de réussite de 80%",
    icon: "⭐",
    category: "achievement",
    condition: { type: "success_rate", target: 80 },
    xpReward: 200,
  },
  {
    id: "success_95",
    title: "Élève parfait",
    description: "Maintenez un taux de réussite de 95%",
    icon: "💎",
    category: "achievement",
    condition: { type: "success_rate", target: 95 },
    xpReward: 500,
  },
]

// ============================================================================
// FONCTIONS DE VÉRIFICATION DES BADGES
// ============================================================================

export async function checkAndUnlockBadges(userId: string): Promise<Badge[]> {
  try {
    // Récupérer la progression de l'utilisateur
    const progressRef = doc(db, "student_progress", userId)
    const progressSnap = await getDoc(progressRef)
    
    if (!progressSnap.exists()) {
      return []
    }
    
    const progress = progressSnap.data()
    const currentBadges = progress.badges || []
    const newlyUnlockedBadges: Badge[] = []
    
    // Vérifier chaque badge
    for (const badge of AVAILABLE_BADGES) {
      // Si déjà débloqué, passer
      if (currentBadges.includes(badge.id)) {
        continue
      }
      
      let shouldUnlock = false
      
      // Vérifier les conditions
      switch (badge.condition.type) {
        case "course_completed":
          shouldUnlock = progress.completedCourses >= badge.condition.target
          break
        case "exercises_completed":
          shouldUnlock = progress.completedExercises >= badge.condition.target
          break
        case "quiz_score":
          // Vérifie si l'utilisateur a obtenu le score requis
          shouldUnlock = progress.averageQuizScore >= badge.condition.target
          break
        case "study_time":
          shouldUnlock = progress.totalStudyTimeMinutes >= badge.condition.target
          break
        case "streak_days":
          // TODO: Implémenter le suivi des streaks
          shouldUnlock = false
          break
        case "success_rate":
          shouldUnlock = progress.successRate >= badge.condition.target
          break
      }
      
      if (shouldUnlock) {
        // Débloquer le badge
        await unlockBadge(userId, badge)
        newlyUnlockedBadges.push(badge)
      }
    }
    
    return newlyUnlockedBadges
  } catch (error) {
    console.error("Error checking badges:", error)
    return []
  }
}

async function unlockBadge(userId: string, badge: Badge): Promise<void> {
  try {
    const progressRef = doc(db, "student_progress", userId)
    
    // Ajouter le badge
    await updateDoc(progressRef, {
      badges: arrayUnion(badge.id),
      xp: (await getDoc(progressRef)).data()?.xp + badge.xpReward || badge.xpReward,
      updatedAt: serverTimestamp(),
    })
    
    // Logger l'activité
    await logActivity(
      userId,
      "badge_earned",
      `Badge débloqué: ${badge.title}`,
      badge.description
    )
  } catch (error) {
    console.error("Error unlocking badge:", error)
    throw error
  }
}

export function getBadgeById(badgeId: string): Badge | undefined {
  return AVAILABLE_BADGES.find((b) => b.id === badgeId)
}

export function getUserBadges(badgeIds: string[]): Badge[] {
  return badgeIds
    .map((id) => getBadgeById(id))
    .filter((badge): badge is Badge => badge !== undefined)
}

export function getAvailableBadges(): Badge[] {
  return AVAILABLE_BADGES
}

export function getBadgesByCategory(category: Badge["category"]): Badge[] {
  return AVAILABLE_BADGES.filter((b) => b.category === category)
}
