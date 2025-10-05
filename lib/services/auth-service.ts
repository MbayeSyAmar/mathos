import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "../firebase"

export interface UserData {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role?: string
  niveau?: string
  dateInscription?: string
  abonnement?: string
  progres?: {
    cours: Record<string, number>
    exercices: Record<string, number>
    quiz: Record<string, number>
  }
}

export const signUp = async (email: string, password: string, displayName: string): Promise<UserData> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Mettre à jour le profil avec le nom d'affichage
    await updateProfile(user, { displayName })

    // Créer un document utilisateur dans Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email || email,
      displayName,
      role: "etudiant",
      niveau: "débutant",
      dateInscription: new Date().toISOString(),
      abonnement: "gratuit",
      progres: {
        cours: {},
        exercices: {},
        quiz: {},
      },
    }

    await setDoc(doc(db, "utilisateurs", user.uid), userData)

    return userData
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    throw error
  }
}

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    throw error
  }
}

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error)
    throw error
  }
}

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error)
    throw error
  }
}

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, "utilisateurs", uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserData
    }
    return null
  } catch (error) {
    console.error("Erreur lors de la récupération des données utilisateur:", error)
    throw error
  }
}

export const updateUserData = async (uid: string, data: Partial<UserData>): Promise<void> => {
  try {
    await updateDoc(doc(db, "utilisateurs", uid), data)
  } catch (error) {
    console.error("Erreur lors de la mise à jour des données utilisateur:", error)
    throw error
  }
}

export const updateUserProgress = async (
  uid: string,
  type: "cours" | "exercices" | "quiz",
  itemId: string,
  progress: number,
): Promise<void> => {
  try {
    const userRef = doc(db, "utilisateurs", uid)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData
      const progres = userData.progres || { cours: {}, exercices: {}, quiz: {} }

      progres[type] = { ...progres[type], [itemId]: progress }

      await updateDoc(userRef, { progres })
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la progression:", error)
    throw error
  }
}
