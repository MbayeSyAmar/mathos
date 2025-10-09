/**
 * Service de suivi du parcours étudiant
 * Gère la progression, les activités, les statistiques
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

// ============================================================================
// TYPES
// ============================================================================

export interface StudentProgress {
  userId: string
  
  // Statistiques globales
  totalCourses: number
  completedCourses: number
  inProgressCourses: number
  
  totalExercises: number
  completedExercises: number
  
  totalQuizzes: number
  completedQuizzes: number
  averageQuizScore: number
  
  totalVideos: number
  watchedVideos: number
  
  // Temps d'étude
  totalStudyTimeMinutes: number
  weeklyStudyTimeMinutes: number
  monthlyStudyTimeMinutes: number
  
  // Réussite
  successRate: number
  badges: string[]
  level: number
  xp: number
  
  // Objectifs
  weeklyGoals: Goal[]
  achievements: Achievement[]
  
  // Dernière activité
  lastActivityAt: Timestamp
  updatedAt: Timestamp
}

export interface Goal {
  id: string
  title: string
  description: string
  type: "course" | "exercise" | "quiz" | "custom"
  targetId?: string
  deadline: Timestamp
  completed: boolean
  completedAt?: Timestamp
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Timestamp
}

export interface Activity {
  id: string
  userId: string
  type: "course_started" | "course_completed" | "exercise_completed" | "quiz_completed" | "video_watched" | "badge_earned"
  title: string
  description: string
  metadata?: any
  createdAt: Timestamp
}

export interface CourseProgress {
  id?: string
  userId: string
  courseId: string
  courseTitle: string
  progress: number // 0-100
  completedLessons: number
  totalLessons: number
  lastAccessedAt: Timestamp
  completedAt?: Timestamp
  startedAt: Timestamp
}

export interface ExerciseProgress {
  id?: string
  userId: string
  exerciseId: string
  exerciseTitle: string
  completed: boolean
  score?: number
  attempts: number
  lastAttemptAt: Timestamp
  completedAt?: Timestamp
}

export interface QuizProgress {
  id?: string
  userId: string
  quizId: string
  quizTitle: string
  bestScore: number
  attempts: number
  lastAttemptAt: Timestamp
  completedAt?: Timestamp
}

// ============================================================================
// PROGRESSION GLOBALE
// ============================================================================

export async function getStudentProgress(userId: string): Promise<StudentProgress | null> {
  try {
    const docRef = doc(db, "student_progress", userId)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      // Créer un document de progression initial
      const initialProgress: StudentProgress = {
        userId,
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        totalExercises: 0,
        completedExercises: 0,
        totalQuizzes: 0,
        completedQuizzes: 0,
        averageQuizScore: 0,
        totalVideos: 0,
        watchedVideos: 0,
        totalStudyTimeMinutes: 0,
        weeklyStudyTimeMinutes: 0,
        monthlyStudyTimeMinutes: 0,
        successRate: 0,
        badges: [],
        level: 1,
        xp: 0,
        weeklyGoals: [],
        achievements: [],
        lastActivityAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }
      
      await setDoc(docRef, initialProgress)
      return initialProgress
    }
    
    const data = docSnap.data()
    return { ...data, userId } as StudentProgress
  } catch (error) {
    console.error("Error getting student progress:", error)
    throw error
  }
}

export async function updateStudentStats(
  userId: string,
  updates: Partial<StudentProgress>
): Promise<void> {
  try {
    const docRef = doc(db, "student_progress", userId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
      lastActivityAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating student stats:", error)
    throw error
  }
}

// ============================================================================
// ACTIVITÉS
// ============================================================================

export async function logActivity(
  userId: string,
  type: Activity["type"],
  title: string,
  description: string,
  metadata?: any
): Promise<void> {
  try {
    const activityRef = collection(db, "student_activities")
    await setDoc(doc(activityRef), {
      userId,
      type,
      title,
      description,
      metadata,
      createdAt: serverTimestamp(),
    })
    
    // Mettre à jour la dernière activité
    await updateStudentStats(userId, {
      lastActivityAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error logging activity:", error)
    throw error
  }
}

export async function getRecentActivities(
  userId: string,
  limitCount: number = 10
): Promise<Activity[]> {
  try {
    const q = query(
      collection(db, "student_activities"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Activity[]
  } catch (error) {
    console.error("Error getting recent activities:", error)
    return []
  }
}

// ============================================================================
// COURS
// ============================================================================

export async function getCourseProgress(
  userId: string,
  courseId?: string
): Promise<CourseProgress[]> {
  try {
    let q
    if (courseId) {
      q = query(
        collection(db, "course_progress"),
        where("userId", "==", userId),
        where("courseId", "==", courseId)
      )
    } else {
      q = query(
        collection(db, "course_progress"),
        where("userId", "==", userId),
        orderBy("lastAccessedAt", "desc")
      )
    }
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CourseProgress[]
  } catch (error) {
    console.error("Error getting course progress:", error)
    return []
  }
}

export async function updateCourseProgress(
  userId: string,
  courseId: string,
  courseTitle: string,
  progress: number,
  completedLessons: number,
  totalLessons: number
): Promise<void> {
  try {
    const q = query(
      collection(db, "course_progress"),
      where("userId", "==", userId),
      where("courseId", "==", courseId)
    )
    
    const snapshot = await getDocs(q)
    const isCompleted = progress >= 100
    
    if (snapshot.empty) {
      // Créer une nouvelle progression
      await setDoc(doc(collection(db, "course_progress")), {
        userId,
        courseId,
        courseTitle,
        progress,
        completedLessons,
        totalLessons,
        lastAccessedAt: serverTimestamp(),
        startedAt: serverTimestamp(),
        ...(isCompleted && { completedAt: serverTimestamp() }),
      })
      
      // Logger l'activité
      await logActivity(userId, "course_started", courseTitle, `A commencé le cours ${courseTitle}`)
    } else {
      // Mettre à jour la progression existante
      const docRef = snapshot.docs[0].ref
      const wasCompleted = snapshot.docs[0].data().completedAt
      
      await updateDoc(docRef, {
        progress,
        completedLessons,
        totalLessons,
        lastAccessedAt: serverTimestamp(),
        ...(isCompleted && !wasCompleted && { completedAt: serverTimestamp() }),
      })
      
      // Logger si terminé
      if (isCompleted && !wasCompleted) {
        await logActivity(userId, "course_completed", courseTitle, `A terminé le cours ${courseTitle}`)
      }
    }
    
    // Mettre à jour les statistiques globales
    await recalculateGlobalStats(userId)
  } catch (error) {
    console.error("Error updating course progress:", error)
    throw error
  }
}

// ============================================================================
// EXERCICES
// ============================================================================

export async function getExerciseProgress(userId: string): Promise<ExerciseProgress[]> {
  try {
    const q = query(
      collection(db, "exercise_progress"),
      where("userId", "==", userId),
      orderBy("lastAttemptAt", "desc")
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ExerciseProgress[]
  } catch (error) {
    console.error("Error getting exercise progress:", error)
    return []
  }
}

export async function updateExerciseProgress(
  userId: string,
  exerciseId: string,
  exerciseTitle: string,
  score?: number
): Promise<void> {
  try {
    const q = query(
      collection(db, "exercise_progress"),
      where("userId", "==", userId),
      where("exerciseId", "==", exerciseId)
    )
    
    const snapshot = await getDocs(q)
    const isCompleted = score !== undefined && score >= 70
    
    if (snapshot.empty) {
      await setDoc(doc(collection(db, "exercise_progress")), {
        userId,
        exerciseId,
        exerciseTitle,
        completed: isCompleted,
        score,
        attempts: 1,
        lastAttemptAt: serverTimestamp(),
        ...(isCompleted && { completedAt: serverTimestamp() }),
      })
    } else {
      const docRef = snapshot.docs[0].ref
      const currentData = snapshot.docs[0].data()
      
      await updateDoc(docRef, {
        completed: isCompleted || currentData.completed,
        score: score !== undefined ? Math.max(score, currentData.score || 0) : currentData.score,
        attempts: increment(1),
        lastAttemptAt: serverTimestamp(),
        ...(isCompleted && !currentData.completedAt && { completedAt: serverTimestamp() }),
      })
    }
    
    if (isCompleted) {
      await logActivity(userId, "exercise_completed", exerciseTitle, `A complété l'exercice ${exerciseTitle}`)
    }
    
    await recalculateGlobalStats(userId)
  } catch (error) {
    console.error("Error updating exercise progress:", error)
    throw error
  }
}

// ============================================================================
// QUIZ
// ============================================================================

export async function getQuizProgress(userId: string): Promise<QuizProgress[]> {
  try {
    const q = query(
      collection(db, "quiz_progress"),
      where("userId", "==", userId),
      orderBy("lastAttemptAt", "desc")
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as QuizProgress[]
  } catch (error) {
    console.error("Error getting quiz progress:", error)
    return []
  }
}

export async function updateQuizProgress(
  userId: string,
  quizId: string,
  quizTitle: string,
  score: number
): Promise<void> {
  try {
    const q = query(
      collection(db, "quiz_progress"),
      where("userId", "==", userId),
      where("quizId", "==", quizId)
    )
    
    const snapshot = await getDocs(q)
    const isCompleted = score >= 50
    
    if (snapshot.empty) {
      await setDoc(doc(collection(db, "quiz_progress")), {
        userId,
        quizId,
        quizTitle,
        bestScore: score,
        attempts: 1,
        lastAttemptAt: serverTimestamp(),
        ...(isCompleted && { completedAt: serverTimestamp() }),
      })
    } else {
      const docRef = snapshot.docs[0].ref
      const currentData = snapshot.docs[0].data()
      
      await updateDoc(docRef, {
        bestScore: Math.max(score, currentData.bestScore || 0),
        attempts: increment(1),
        lastAttemptAt: serverTimestamp(),
        ...(isCompleted && !currentData.completedAt && { completedAt: serverTimestamp() }),
      })
    }
    
    if (isCompleted) {
      await logActivity(userId, "quiz_completed", quizTitle, `A terminé le quiz ${quizTitle} avec un score de ${score}%`)
    }
    
    await recalculateGlobalStats(userId)
  } catch (error) {
    console.error("Error updating quiz progress:", error)
    throw error
  }
}

// ============================================================================
// RECALCUL DES STATISTIQUES
// ============================================================================

async function recalculateGlobalStats(userId: string): Promise<void> {
  try {
    // Récupérer toutes les progressions
    const [courses, exercises, quizzes] = await Promise.all([
      getCourseProgress(userId),
      getExerciseProgress(userId),
      getQuizProgress(userId),
    ])
    
    // Calculer les statistiques
    const completedCourses = courses.filter((c) => c.progress >= 100).length
    const inProgressCourses = courses.filter((c) => c.progress > 0 && c.progress < 100).length
    const completedExercises = exercises.filter((e) => e.completed).length
    const completedQuizzes = quizzes.filter((q) => q.bestScore >= 50).length
    
    const averageQuizScore = quizzes.length > 0
      ? quizzes.reduce((sum, q) => sum + q.bestScore, 0) / quizzes.length
      : 0
    
    const totalAttempts = exercises.length + quizzes.length
    const successfulAttempts = completedExercises + completedQuizzes
    const successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0
    
    // Mettre à jour
    await updateStudentStats(userId, {
      totalCourses: courses.length,
      completedCourses,
      inProgressCourses,
      totalExercises: exercises.length,
      completedExercises,
      totalQuizzes: quizzes.length,
      completedQuizzes,
      averageQuizScore: Math.round(averageQuizScore),
      successRate: Math.round(successRate),
    })
  } catch (error) {
    console.error("Error recalculating global stats:", error)
  }
}
