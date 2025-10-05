import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "../firebase"

export interface Exercice {
  id: string
  titre: string
  description: string
  niveau: string
  categorie: string
  questions: {
    id: string
    texte: string
    type: "qcm" | "texte" | "equation"
    options?: string[]
    reponse: string
    explication?: string
  }[]
  dateCreation: string
  auteur: string
  duree: number
}

export const getAllExercices = async (): Promise<Exercice[]> => {
  try {
    const exercicesRef = collection(db, "exercices")
    const exercicesQuery = query(exercicesRef, orderBy("dateCreation", "desc"))
    const snapshot = await getDocs(exercicesQuery)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Exercice[]
  } catch (error) {
    console.error("Erreur lors de la récupération des exercices:", error)
    throw error
  }
}

export const getExercicesByNiveau = async (niveau: string): Promise<Exercice[]> => {
  try {
    const exercicesRef = collection(db, "exercices")
    const exercicesQuery = query(exercicesRef, where("niveau", "==", niveau), orderBy("dateCreation", "desc"))
    const snapshot = await getDocs(exercicesQuery)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Exercice[]
  } catch (error) {
    console.error("Erreur lors de la récupération des exercices par niveau:", error)
    throw error
  }
}

export const getExercicesByCategorie = async (categorie: string): Promise<Exercice[]> => {
  try {
    const exercicesRef = collection(db, "exercices")
    const exercicesQuery = query(exercicesRef, where("categorie", "==", categorie), orderBy("dateCreation", "desc"))
    const snapshot = await getDocs(exercicesQuery)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Exercice[]
  } catch (error) {
    console.error("Erreur lors de la récupération des exercices par catégorie:", error)
    throw error
  }
}
