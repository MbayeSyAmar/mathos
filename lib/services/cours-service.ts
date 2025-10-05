import { db } from "../firebase"
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore"

export interface Cours {
  id: string
  titre: string
  description: string
  contenu: string
  niveau: string
  categorie: string
  auteurId: string
  auteurNom: string
  dateCreation: Date
  dateModification: Date
  estPublie: boolean
  imageUrl?: string
  duree?: number // en minutes
  tags?: string[]
  prerequis?: string[]
  chapitres?: {
    titre: string
    contenu: string
    ordre: number
  }[]
}

export interface Exercice {
  id: string
  titre: string
  enonce: string
  niveau: string
  categorie: string
  coursId?: string
  auteurId: string
  auteurNom: string
  dateCreation: Date
  estPublie: boolean
  solution?: string
  indice?: string
  difficulte: "facile" | "moyen" | "difficile"
  tags?: string[]
}

export interface Quiz {
  id: string
  titre: string
  description: string
  niveau: string
  categorie: string
  coursId?: string
  auteurId: string
  auteurNom: string
  dateCreation: Date
  estPublie: boolean
  duree?: number // en minutes
  questions: {
    id: string
    texte: string
    type: "qcm" | "vrai_faux" | "texte"
    options?: string[]
    reponseCorrecte: string | string[]
    explication?: string
    points: number
  }[]
}

// Convertir un document Firestore en objet Cours
const coursConverter = {
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Cours {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      titre: data.titre,
      description: data.description,
      contenu: data.contenu,
      niveau: data.niveau,
      categorie: data.categorie,
      auteurId: data.auteurId,
      auteurNom: data.auteurNom,
      dateCreation: data.dateCreation?.toDate() || new Date(),
      dateModification: data.dateModification?.toDate() || new Date(),
      estPublie: data.estPublie || false,
      imageUrl: data.imageUrl,
      duree: data.duree,
      tags: data.tags || [],
      prerequis: data.prerequis || [],
      chapitres: data.chapitres || [],
    }
  },
}

// Convertir un document Firestore en objet Exercice
const exerciceConverter = {
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Exercice {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      titre: data.titre,
      enonce: data.enonce,
      niveau: data.niveau,
      categorie: data.categorie,
      coursId: data.coursId,
      auteurId: data.auteurId,
      auteurNom: data.auteurNom,
      dateCreation: data.dateCreation?.toDate() || new Date(),
      estPublie: data.estPublie || false,
      solution: data.solution,
      indice: data.indice,
      difficulte: data.difficulte || "moyen",
      tags: data.tags || [],
    }
  },
}

// Convertir un document Firestore en objet Quiz
const quizConverter = {
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Quiz {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      titre: data.titre,
      description: data.description,
      niveau: data.niveau,
      categorie: data.categorie,
      coursId: data.coursId,
      auteurId: data.auteurId,
      auteurNom: data.auteurNom,
      dateCreation: data.dateCreation?.toDate() || new Date(),
      estPublie: data.estPublie || false,
      duree: data.duree,
      questions: data.questions || [],
    }
  },
}

// Récupérer tous les cours
export async function getAllCours(limitCount = 50): Promise<Cours[]> {
  try {
    const coursQuery = query(collection(db, "cours"), orderBy("dateCreation", "desc"), limit(limitCount))

    const coursSnapshot = await getDocs(coursQuery)
    return coursSnapshot.docs.map((doc) => coursConverter.fromFirestore(doc))
  } catch (error) {
    console.error("Erreur lors de la récupération des cours:", error)
    return []
  }
}

// Récupérer les cours publiés
export async function getPublishedCours(limitCount = 50): Promise<Cours[]> {
  try {
    const coursQuery = query(
      collection(db, "cours"),
      where("estPublie", "==", true),
      orderBy("dateCreation", "desc"),
      limit(limitCount),
    )

    const coursSnapshot = await getDocs(coursQuery)
    return coursSnapshot.docs.map((doc) => coursConverter.fromFirestore(doc))
  } catch (error) {
    console.error("Erreur lors de la récupération des cours publiés:", error)
    return []
  }
}

// Récupérer un cours par ID
export async function getCoursById(id: string): Promise<Cours | null> {
  try {
    const coursDoc = await getDoc(doc(db, "cours", id))
    if (coursDoc.exists()) {
      return coursConverter.fromFirestore(coursDoc)
    }
    return null
  } catch (error) {
    console.error("Erreur lors de la récupération du cours:", error)
    return null
  }
}

// Récupérer les cours par catégorie
export async function getCoursByCategorie(categorie: string, limitCount = 20): Promise<Cours[]> {
  try {
    const coursQuery = query(
      collection(db, "cours"),
      where("categorie", "==", categorie),
      where("estPublie", "==", true),
      orderBy("dateCreation", "desc"),
      limit(limitCount),
    )

    const coursSnapshot = await getDocs(coursQuery)
    return coursSnapshot.docs.map((doc) => coursConverter.fromFirestore(doc))
  } catch (error) {
    console.error("Erreur lors de la récupération des cours par catégorie:", error)
    return []
  }
}

// Récupérer les cours par niveau
export async function getCoursByNiveau(niveau: string, limitCount = 20): Promise<Cours[]> {
  try {
    const coursQuery = query(
      collection(db, "cours"),
      where("niveau", "==", niveau),
      where("estPublie", "==", true),
      orderBy("dateCreation", "desc"),
      limit(limitCount),
    )

    const coursSnapshot = await getDocs(coursQuery)
    return coursSnapshot.docs.map((doc) => coursConverter.fromFirestore(doc))
  } catch (error) {
    console.error("Erreur lors de la récupération des cours par niveau:", error)
    return []
  }
}

// Ajouter un nouveau cours
export async function addCours(cours: Omit<Cours, "id" | "dateCreation" | "dateModification">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "cours"), {
      ...cours,
      dateCreation: serverTimestamp(),
      dateModification: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Erreur lors de l'ajout du cours:", error)
    throw error
  }
}

// Mettre à jour un cours
export async function updateCours(id: string, cours: Partial<Cours>): Promise<void> {
  try {
    const coursRef = doc(db, "cours", id)
    await updateDoc(coursRef, {
      ...cours,
      dateModification: serverTimestamp(),
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du cours:", error)
    throw error
  }
}

// Supprimer un cours
export async function deleteCours(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "cours", id))
  } catch (error) {
    console.error("Erreur lors de la suppression du cours:", error)
    throw error
  }
}

// Récupérer tous les exercices
export async function getAllExercices(limitCount = 50): Promise<Exercice[]> {
  try {
    const exerciceQuery = query(collection(db, "exercices"), orderBy("dateCreation", "desc"), limit(limitCount))

    const exerciceSnapshot = await getDocs(exerciceQuery)
    return exerciceSnapshot.docs.map((doc) => exerciceConverter.fromFirestore(doc))
  } catch (error) {
    console.error("Erreur lors de la récupération des exercices:", error)
    return []
  }
}

// Récupérer les exercices publiés
export async function getPublishedExercices(limitCount = 50): Promise<Exercice[]> {
  try {
    const exerciceQuery = query(
      collection(db, "exercices"),
      where("estPublie", "==", true),
      orderBy("dateCreation", "desc"),
      limit(limitCount),
    )

    const exerciceSnapshot = await getDocs(exerciceQuery)
    return exerciceSnapshot.docs.map((doc) => exerciceConverter.fromFirestore(doc))
  } catch (error) {
    console.error("Erreur lors de la récupération des exercices publiés:", error)
    return []
  }
}

// Récupérer un exercice par ID
export async function getExerciceById(id: string): Promise<Exercice | null> {
  try {
    const exerciceDoc = await getDoc(doc(db, "exercices", id))
    if (exerciceDoc.exists()) {
      return exerciceConverter.fromFirestore(exerciceDoc)
    }
    return null
  } catch (error) {
    console.error("Erreur lors de la récupération de l'exercice:", error)
    return null
  }
}

// Récupérer tous les quiz
export async function getAllQuiz(limitCount = 50): Promise<Quiz[]> {
  try {
    const quizQuery = query(collection(db, "quiz"), orderBy("dateCreation", "desc"), limit(limitCount))

    const quizSnapshot = await getDocs(quizQuery)
    return quizSnapshot.docs.map((doc) => quizConverter.fromFirestore(doc))
  } catch (error) {
    console.error("Erreur lors de la récupération des quiz:", error)
    return []
  }
}

// Récupérer les quiz publiés
export async function getPublishedQuiz(limitCount = 50): Promise<Quiz[]> {
  try {
    const quizQuery = query(
      collection(db, "quiz"),
      where("estPublie", "==", true),
      orderBy("dateCreation", "desc"),
      limit(limitCount),
    )

    const quizSnapshot = await getDocs(quizQuery)
    return quizSnapshot.docs.map((doc) => quizConverter.fromFirestore(doc))
  } catch (error) {
    console.error("Erreur lors de la récupération des quiz publiés:", error)
    return []
  }
}

// Récupérer un quiz par ID
export async function getQuizById(id: string): Promise<Quiz | null> {
  try {
    const quizDoc = await getDoc(doc(db, "quiz", id))
    if (quizDoc.exists()) {
      return quizConverter.fromFirestore(quizDoc)
    }
    return null
  } catch (error) {
    console.error("Erreur lors de la récupération du quiz:", error)
    return null
  }
}
