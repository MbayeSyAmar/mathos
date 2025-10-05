import { db } from "../firebase"
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  limit,
  where,
  updateDoc,
  increment,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import type { User } from "firebase/auth"

export interface Discussion {
  id: string
  titre: string
  contenu: string
  auteurId: string
  auteurNom: string
  dateCreation: Date
  vues: number
  reponses: number
  categorie: string
  tags: string[]
}

export interface Reponse {
  id: string
  contenu: string
  auteurId: string
  auteurNom: string
  dateCreation: Date
  discussionId: string
  estSolution?: boolean
}

// Convertir un document Firestore en objet Discussion
const discussionConverter = {
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Discussion {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      titre: data.titre,
      contenu: data.contenu,
      auteurId: data.auteurId,
      auteurNom: data.auteurNom,
      dateCreation: data.dateCreation?.toDate() || new Date(),
      vues: data.vues || 0,
      reponses: data.reponses || 0,
      categorie: data.categorie || "Général",
      tags: data.tags || [],
    }
  },
}

// Convertir un document Firestore en objet Reponse
const reponseConverter = {
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Reponse {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      contenu: data.contenu,
      auteurId: data.auteurId,
      auteurNom: data.auteurNom,
      dateCreation: data.dateCreation?.toDate() || new Date(),
      discussionId: data.discussionId,
      estSolution: data.estSolution || false,
    }
  },
}

// Récupérer toutes les discussions
export async function getDiscussions(categorieFilter?: string, limitCount = 10): Promise<Discussion[]> {
  try {
    let discussionsQuery

    if (categorieFilter) {
      discussionsQuery = query(
        collection(db, "discussions"),
        where("categorie", "==", categorieFilter),
        orderBy("dateCreation", "desc"),
        limit(limitCount),
      )
    } else {
      discussionsQuery = query(collection(db, "discussions"), orderBy("dateCreation", "desc"), limit(limitCount))
    }

    const discussionsSnapshot = await getDocs(discussionsQuery)
    return discussionsSnapshot.docs.map((doc) => discussionConverter.fromFirestore(doc))
  } catch (error) {
    console.error("Erreur lors de la récupération des discussions:", error)
    return []
  }
}

// Récupérer une discussion par son ID
export async function getDiscussionById(id: string): Promise<Discussion | null> {
  try {
    const discussionDoc = await getDoc(doc(db, "discussions", id))

    if (!discussionDoc.exists()) {
      return null
    }

    // Incrémenter le compteur de vues
    await updateDoc(doc(db, "discussions", id), {
      vues: increment(1),
    })

    return discussionConverter.fromFirestore(discussionDoc as QueryDocumentSnapshot<DocumentData>)
  } catch (error) {
    console.error("Erreur lors de la récupération de la discussion:", error)
    return null
  }
}

// Récupérer les réponses d'une discussion
export async function getReponsesByDiscussionId(discussionId: string): Promise<Reponse[]> {
  try {
    const reponsesQuery = query(
      collection(db, "reponses"),
      where("discussionId", "==", discussionId),
      orderBy("dateCreation", "asc"),
    )

    const reponsesSnapshot = await getDocs(reponsesQuery)
    return reponsesSnapshot.docs.map((doc) => reponseConverter.fromFirestore(doc))
  } catch (error) {
    console.error("Erreur lors de la récupération des réponses:", error)
    return []
  }
}

// Créer une nouvelle discussion
export async function createDiscussion(
  titre: string,
  contenu: string,
  categorie: string,
  tags: string[],
  user: User,
): Promise<string | null> {
  try {
    const discussionRef = await addDoc(collection(db, "discussions"), {
      titre,
      contenu,
      auteurId: user.uid,
      auteurNom: user.displayName || "Utilisateur anonyme",
      dateCreation: serverTimestamp(),
      vues: 0,
      reponses: 0,
      categorie,
      tags,
    })

    return discussionRef.id
  } catch (error) {
    console.error("Erreur lors de la création de la discussion:", error)
    return null
  }
}

// Ajouter une réponse à une discussion
export async function addReponse(discussionId: string, contenu: string, user: User): Promise<string | null> {
  try {
    // Ajouter la réponse
    const reponseRef = await addDoc(collection(db, "reponses"), {
      contenu,
      auteurId: user.uid,
      auteurNom: user.displayName || "Utilisateur anonyme",
      dateCreation: serverTimestamp(),
      discussionId,
      estSolution: false,
    })

    // Mettre à jour le compteur de réponses de la discussion
    await updateDoc(doc(db, "discussions", discussionId), {
      reponses: increment(1),
    })

    return reponseRef.id
  } catch (error) {
    console.error("Erreur lors de l'ajout de la réponse:", error)
    return null
  }
}

// Marquer une réponse comme solution
export async function marquerCommeSolution(reponseId: string): Promise<boolean> {
  try {
    await updateDoc(doc(db, "reponses", reponseId), {
      estSolution: true,
    })
    return true
  } catch (error) {
    console.error("Erreur lors du marquage de la solution:", error)
    return false
  }
}

// Récupérer les catégories de discussion
export async function getCategories(): Promise<string[]> {
  try {
    const categoriesSnapshot = await getDocs(collection(db, "categories"))
    return categoriesSnapshot.docs.map((doc) => doc.data().nom)
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error)
    return ["Général", "Algèbre", "Géométrie", "Analyse", "Probabilités", "Autre"]
  }
}
