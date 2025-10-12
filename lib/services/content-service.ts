/**
 * Service de gestion du contenu pédagogique
 * Permet aux professeurs de créer et gérer leurs cours, exercices, quiz et vidéos
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

// ============================================================================
// TYPES
// ============================================================================

export interface Course {
  id: string
  teacherId: string
  teacherName: string
  title: string
  description: string
  level: string // "6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale", "Licence", "Master", "Prépa"
  subject: string // "Algèbre", "Géométrie", "Analyse", "Probabilités", etc.
  duration: number // en minutes
  image?: string
  content: string // Contenu du cours (HTML ou Markdown)
  objectives: string[]
  prerequisites: string[]
  status: "draft" | "published" | "archived"
  studentsEnrolled: number
  rating: number
  totalRatings: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Exercise {
  id: string
  teacherId: string
  teacherName: string
  title: string
  description: string
  level: string
  subject: string
  difficulty: "easy" | "medium" | "hard"
  type: "practice" | "application" | "challenge"
  statement: string // Énoncé (HTML ou Markdown)
  solution?: string // Solution détaillée
  hints: string[] // Indices
  points: number
  timeLimit?: number // en minutes
  status: "draft" | "published" | "archived"
  studentsCompleted: number
  successRate: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Quiz {
  id: string
  teacherId: string
  teacherName: string
  title: string
  description: string
  level: string
  subject: string
  difficulty: "easy" | "medium" | "hard"
  timeLimit: number // en minutes
  passingScore: number // pourcentage
  questions: QuizQuestion[]
  status: "draft" | "published" | "archived"
  studentsTaken: number
  averageScore: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface QuizQuestion {
  id: string
  question: string
  type: "multiple_choice" | "true_false" | "short_answer"
  options?: string[] // Pour les QCM
  correctAnswer: string | number
  explanation?: string
  points: number
}

export interface Video {
  id: string
  teacherId: string
  teacherName: string
  title: string
  description: string
  level: string
  subject: string
  duration: number // en minutes
  url: string // URL YouTube, Vimeo, ou lien direct
  thumbnail?: string
  transcript?: string // Transcription
  chapters: VideoChapter[]
  status: "draft" | "published" | "archived"
  views: number
  likes: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface VideoChapter {
  timestamp: number // en secondes
  title: string
  description?: string
}

// ============================================================================
// COURS
// ============================================================================

export async function createCourse(
  teacherId: string,
  teacherName: string,
  courseData: Omit<Course, "id" | "teacherId" | "teacherName" | "studentsEnrolled" | "rating" | "totalRatings" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const courseRef = doc(collection(db, "courses"))
    const course: Omit<Course, "id"> = {
      teacherId,
      teacherName,
      ...courseData,
      studentsEnrolled: 0,
      rating: 0,
      totalRatings: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    
    await setDoc(courseRef, course)
    return courseRef.id
  } catch (error) {
    console.error("Error creating course:", error)
    throw error
  }
}

export async function getCourseById(courseId: string): Promise<Course | null> {
  try {
    const courseDoc = await getDoc(doc(db, "courses", courseId))
    if (!courseDoc.exists()) {
      return null
    }
    return { id: courseDoc.id, ...courseDoc.data() } as Course
  } catch (error) {
    console.error("Error getting course:", error)
    return null
  }
}

export async function getCoursesByTeacher(teacherId: string): Promise<Course[]> {
  try {
    const q = query(
      collection(db, "courses"),
      where("teacherId", "==", teacherId)
    )
    
    const snapshot = await getDocs(q)
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Course[]
    
    // Tri manuel par date décroissante
    courses.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0
      const bTime = b.createdAt?.seconds || 0
      return bTime - aTime
    })
    
    return courses
  } catch (error) {
    console.error("Error getting courses by teacher:", error)
    return []
  }
}

export async function getAllCourses(): Promise<Course[]> {
  try {
    const q = query(
      collection(db, "courses"),
      where("status", "==", "published")
    )
    
    const snapshot = await getDocs(q)
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Course[]
    
    // Tri manuel par date décroissante
    courses.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0
      const bTime = b.createdAt?.seconds || 0
      return bTime - aTime
    })
    
    return courses
  } catch (error) {
    console.error("Error getting all courses:", error)
    return []
  }
}

export async function updateCourse(
  courseId: string,
  updates: Partial<Omit<Course, "id" | "teacherId" | "createdAt">>
): Promise<void> {
  try {
    await updateDoc(doc(db, "courses", courseId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating course:", error)
    throw error
  }
}

export async function deleteCourse(courseId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "courses", courseId))
  } catch (error) {
    console.error("Error deleting course:", error)
    throw error
  }
}

// ============================================================================
// EXERCICES
// ============================================================================

export async function createExercise(
  teacherId: string,
  teacherName: string,
  exerciseData: Omit<Exercise, "id" | "teacherId" | "teacherName" | "studentsCompleted" | "successRate" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const exerciseRef = doc(collection(db, "exercises"))
    const exercise: Omit<Exercise, "id"> = {
      teacherId,
      teacherName,
      ...exerciseData,
      studentsCompleted: 0,
      successRate: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    
    await setDoc(exerciseRef, exercise)
    return exerciseRef.id
  } catch (error) {
    console.error("Error creating exercise:", error)
    throw error
  }
}

export async function getExercisesByTeacher(teacherId: string): Promise<Exercise[]> {
  try {
    const q = query(
      collection(db, "exercises"),
      where("teacherId", "==", teacherId)
    )
    
    const snapshot = await getDocs(q)
    const exercises = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Exercise[]
    
    // Tri manuel par date décroissante
    exercises.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0
      const bTime = b.createdAt?.seconds || 0
      return bTime - aTime
    })
    
    return exercises
  } catch (error) {
    console.error("Error getting exercises by teacher:", error)
    return []
  }
}

export async function getExerciseById(exerciseId: string): Promise<Exercise | null> {
  try {
    const exerciseDoc = await getDoc(doc(db, "exercises", exerciseId))
    if (!exerciseDoc.exists()) {
      return null
    }
    return { id: exerciseDoc.id, ...exerciseDoc.data() } as Exercise
  } catch (error) {
    console.error("Error getting exercise:", error)
    return null
  }
}

export async function updateExercise(
  exerciseId: string,
  updates: Partial<Omit<Exercise, "id" | "teacherId" | "createdAt">>
): Promise<void> {
  try {
    await updateDoc(doc(db, "exercises", exerciseId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating exercise:", error)
    throw error
  }
}

export async function deleteExercise(exerciseId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "exercises", exerciseId))
  } catch (error) {
    console.error("Error deleting exercise:", error)
    throw error
  }
}

// ============================================================================
// QUIZ
// ============================================================================

export async function createQuiz(
  teacherId: string,
  teacherName: string,
  quizData: Omit<Quiz, "id" | "teacherId" | "teacherName" | "studentsTaken" | "averageScore" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const quizRef = doc(collection(db, "quizzes"))
    const quiz: Omit<Quiz, "id"> = {
      teacherId,
      teacherName,
      ...quizData,
      studentsTaken: 0,
      averageScore: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    
    await setDoc(quizRef, quiz)
    return quizRef.id
  } catch (error) {
    console.error("Error creating quiz:", error)
    throw error
  }
}

export async function getQuizzesByTeacher(teacherId: string): Promise<Quiz[]> {
  try {
    const q = query(
      collection(db, "quizzes"),
      where("teacherId", "==", teacherId)
    )
    
    const snapshot = await getDocs(q)
    const quizzes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Quiz[]
    
    // Tri manuel par date décroissante
    quizzes.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0
      const bTime = b.createdAt?.seconds || 0
      return bTime - aTime
    })
    
    return quizzes
  } catch (error) {
    console.error("Error getting quizzes by teacher:", error)
    return []
  }
}

export async function getQuizById(quizId: string): Promise<Quiz | null> {
  try {
    const quizDoc = await getDoc(doc(db, "quizzes", quizId))
    if (!quizDoc.exists()) {
      return null
    }
    return { id: quizDoc.id, ...quizDoc.data() } as Quiz
  } catch (error) {
    console.error("Error getting quiz:", error)
    return null
  }
}

export async function updateQuiz(
  quizId: string,
  updates: Partial<Omit<Quiz, "id" | "teacherId" | "createdAt">>
): Promise<void> {
  try {
    await updateDoc(doc(db, "quizzes", quizId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating quiz:", error)
    throw error
  }
}

export async function deleteQuiz(quizId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "quizzes", quizId))
  } catch (error) {
    console.error("Error deleting quiz:", error)
    throw error
  }
}

// ============================================================================
// VIDÉOS
// ============================================================================

export async function createVideo(
  teacherId: string,
  teacherName: string,
  videoData: Omit<Video, "id" | "teacherId" | "teacherName" | "views" | "likes" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const videoRef = doc(collection(db, "videos"))
    const video: Omit<Video, "id"> = {
      teacherId,
      teacherName,
      ...videoData,
      views: 0,
      likes: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    
    await setDoc(videoRef, video)
    return videoRef.id
  } catch (error) {
    console.error("Error creating video:", error)
    throw error
  }
}

export async function getVideosByTeacher(teacherId: string): Promise<Video[]> {
  try {
    const q = query(
      collection(db, "videos"),
      where("teacherId", "==", teacherId)
    )
    
    const snapshot = await getDocs(q)
    const videos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Video[]
    
    // Tri manuel par date décroissante
    videos.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0
      const bTime = b.createdAt?.seconds || 0
      return bTime - aTime
    })
    
    return videos
  } catch (error) {
    console.error("Error getting videos by teacher:", error)
    return []
  }
}

export async function getVideoById(videoId: string): Promise<Video | null> {
  try {
    const videoDoc = await getDoc(doc(db, "videos", videoId))
    if (!videoDoc.exists()) {
      return null
    }
    return { id: videoDoc.id, ...videoDoc.data() } as Video
  } catch (error) {
    console.error("Error getting video:", error)
    return null
  }
}

export async function updateVideo(
  videoId: string,
  updates: Partial<Omit<Video, "id" | "teacherId" | "createdAt">>
): Promise<void> {
  try {
    await updateDoc(doc(db, "videos", videoId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating video:", error)
    throw error
  }
}

export async function deleteVideo(videoId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "videos", videoId))
  } catch (error) {
    console.error("Error deleting video:", error)
    throw error
  }
}

// ============================================================================
// UTILITAIRES
// ============================================================================

export const LEVELS = [
  "6ème",
  "5ème",
  "4ème",
  "3ème",
  "2nde",
  "1ère",
  "Terminale",
  "Licence",
  "Master",
  "Prépa",
]

export const SUBJECTS = [
  "Algèbre",
  "Analyse",
  "Géométrie",
  "Probabilités",
  "Statistiques",
  "Trigonométrie",
  "Arithmétique",
  "Logique",
  "Autre",
]

export const DIFFICULTIES = [
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Moyen" },
  { value: "hard", label: "Difficile" },
]

export const STATUSES = [
  { value: "draft", label: "Brouillon" },
  { value: "published", label: "Publié" },
  { value: "archived", label: "Archivé" },
]

// ============================================================================
// ACCÈS ÉTUDIANT AU CONTENU DU PROFESSEUR
// ============================================================================

/**
 * Obtenir tous les cours publiés d'un professeur spécifique
 * Pour les étudiants qui ont accès au contenu de ce professeur
 */
export async function getPublishedCoursesByTeacher(teacherId: string): Promise<Course[]> {
  try {
    const q = query(
      collection(db, "courses"),
      where("teacherId", "==", teacherId),
      where("status", "==", "published")
    )
    
    const snapshot = await getDocs(q)
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Course[]
    
    courses.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0
      const bTime = b.createdAt?.seconds || 0
      return bTime - aTime
    })
    
    return courses
  } catch (error) {
    console.error("Error getting published courses by teacher:", error)
    return []
  }
}

/**
 * Obtenir tous les exercices publiés d'un professeur spécifique
 */
export async function getPublishedExercisesByTeacher(teacherId: string): Promise<Exercise[]> {
  try {
    const q = query(
      collection(db, "exercises"),
      where("teacherId", "==", teacherId),
      where("status", "==", "published")
    )
    
    const snapshot = await getDocs(q)
    const exercises = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Exercise[]
    
    exercises.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0
      const bTime = b.createdAt?.seconds || 0
      return bTime - aTime
    })
    
    return exercises
  } catch (error) {
    console.error("Error getting published exercises by teacher:", error)
    return []
  }
}

/**
 * Obtenir tous les quiz publiés d'un professeur spécifique
 */
export async function getPublishedQuizzesByTeacher(teacherId: string): Promise<Quiz[]> {
  try {
    const q = query(
      collection(db, "quizzes"),
      where("teacherId", "==", teacherId),
      where("status", "==", "published")
    )
    
    const snapshot = await getDocs(q)
    const quizzes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Quiz[]
    
    quizzes.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0
      const bTime = b.createdAt?.seconds || 0
      return bTime - aTime
    })
    
    return quizzes
  } catch (error) {
    console.error("Error getting published quizzes by teacher:", error)
    return []
  }
}

/**
 * Obtenir toutes les vidéos publiées d'un professeur spécifique
 */
export async function getPublishedVideosByTeacher(teacherId: string): Promise<Video[]> {
  try {
    const q = query(
      collection(db, "videos"),
      where("teacherId", "==", teacherId),
      where("status", "==", "published")
    )
    
    const snapshot = await getDocs(q)
    const videos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Video[]
    
    videos.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0
      const bTime = b.createdAt?.seconds || 0
      return bTime - aTime
    })
    
    return videos
  } catch (error) {
    console.error("Error getting published videos by teacher:", error)
    return []
  }
}
