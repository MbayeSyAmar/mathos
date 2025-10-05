import { db } from "../firebase"
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
  deleteDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  serverTimestamp,
} from "firebase/firestore"
import type { User } from "firebase/auth"

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: string
  createdAt: Date
  lastLogin: Date
  niveau?: string
  bio?: string
  interets?: string[]
  coursInscrits?: string[]
  progression?: {
    [courseId: string]: number
  }
}

// Convertir un document Firestore en objet UserProfile
const userConverter = {
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): UserProfile {
    const data = snapshot.data()
    return {
      uid: snapshot.id,
      email: data.email || "",
      displayName: data.displayName || "Utilisateur",
      photoURL: data.photoURL,
      role: data.role || "etudiant",
      createdAt: data.createdAt?.toDate() || new Date(),
      lastLogin: data.lastLogin?.toDate() || new Date(),
      niveau: data.niveau,
      bio: data.bio,
      interets: data.interets || [],
      coursInscrits: data.coursInscrits || [],
      progression: data.progression || {},
    }
  },
}

// Créer ou mettre à jour un profil utilisateur
export async function createOrUpdateUserProfile(user: User, additionalData?: Partial<UserProfile>): Promise<boolean> {
  try {
    const userRef = doc(db, "users", user.uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      // Créer un nouveau profil
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || "Utilisateur",
        photoURL: user.photoURL,
        role: "etudiant", // Rôle par défaut
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        ...additionalData,
      })
    } else {
      // Mettre à jour le profil existant
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
        ...additionalData,
      })
    }

    return true
  } catch (error) {
    console.error("Erreur lors de la création/mise à jour du profil utilisateur:", error)
    return false
  }
}

// Récupérer un profil utilisateur par son ID
export async function getUserProfileById(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))

    if (!userDoc.exists()) {
      return null
    }

    return userConverter.fromFirestore(userDoc as QueryDocumentSnapshot<DocumentData>)
  } catch (error) {
    console.error("Erreur lors de la récupération du profil utilisateur:", error)
    return null
  }
}

// Récupérer tous les utilisateurs
export async function getAllUsers(limitCount = 100): Promise<UserProfile[]> {
  try {
    const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(limitCount))

    const usersSnapshot = await getDocs(usersQuery)
    return usersSnapshot.docs.map((doc) => userConverter.fromFirestore(doc))
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error)
    return []
  }
}

// Récupérer les utilisateurs par rôle
export async function getUsersByRole(role: string, limitCount = 50): Promise<UserProfile[]> {
  try {
    const usersQuery = query(
      collection(db, "users"),
      where("role", "==", role),
      orderBy("createdAt", "desc"),
      limit(limitCount),
    )

    const usersSnapshot = await getDocs(usersQuery)
    return usersSnapshot.docs.map((doc) => userConverter.fromFirestore(doc))
  } catch (error) {
    console.error(`Erreur lors de la récupération des utilisateurs avec le rôle ${role}:`, error)
    return []
  }
}

// Mettre à jour le rôle d'un utilisateur
export async function updateUserRole(uid: string, newRole: string): Promise<boolean> {
  try {
    await updateDoc(doc(db, "users", uid), {
      role: newRole,
    })
    return true
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle utilisateur:", error)
    return false
  }
}

// Supprimer un utilisateur (uniquement de Firestore, pas de l'authentification)
export async function deleteUserProfile(uid: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "users", uid))
    return true
  } catch (error) {
    console.error("Erreur lors de la suppression du profil utilisateur:", error)
    return false
  }
}

// Mettre à jour la progression d'un cours pour un utilisateur
export async function updateCourseProgress(
  uid: string,
  courseId: string,
  progressPercentage: number,
): Promise<boolean> {
  try {
    const userRef = doc(db, "users", uid)
    await updateDoc(userRef, {
      [`progression.${courseId}`]: progressPercentage,
    })
    return true
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la progression du cours:", error)
    return false
  }
}

// Inscrire un utilisateur à un cours
export async function enrollUserInCourse(uid: string, courseId: string): Promise<boolean> {
  try {
    const userRef = doc(db, "users", uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      return false
    }

    const userData = userDoc.data()
    const coursInscrits = userData.coursInscrits || []

    // Vérifier si l'utilisateur est déjà inscrit
    if (!coursInscrits.includes(courseId)) {
      await updateDoc(userRef, {
        coursInscrits: [...coursInscrits, courseId],
        [`progression.${courseId}`]: 0, // Initialiser la progression à 0%
      })
    }

    return true
  } catch (error) {
    console.error("Erreur lors de l'inscription au cours:", error)
    return false
  }
}
