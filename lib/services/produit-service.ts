import { db } from "../firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
  type QueryDocumentSnapshot,
  serverTimestamp,
} from "firebase/firestore"

export interface Produit {
  id: string
  nom: string
  description: string
  prix: number
  categorie: string
  imageUrl: string
  stock: number
  dateCreation: Date
  estPublie: boolean
  tags?: string[]
  niveau?: string | null
  duree?: number | null
  auteur?: string | null
  prerequis?: string[]
  bestseller?: boolean
  oldPrice?: number | null
  longDescription?: string | null
  details?: Record<string, string>
  rating?: number
}

export interface Commande {
  id: string
  utilisateurId: string
  utilisateurEmail: string
  produits: {
    produitId: string
    nom: string
    prix: number
    quantite: number
  }[]
  total: number
  dateCommande: Date
  statut: "en attente" | "traitée" | "expédiée" | "livrée" | "annulée"
  adresseLivraison?: string
  methodePaiement: string
  reference: string
}

// Convertir un document Firestore en objet Produit
const produitConverter = {
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Produit {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      nom: data.nom || "",
      description: data.description || "",
      prix: data.prix || 0,
      categorie: data.categorie || "",
      imageUrl: data.imageUrl || "/placeholder.svg?height=200&width=200",
      stock: data.stock || 0,
      dateCreation: data.dateCreation?.toDate() || new Date(),
      estPublie: data.estPublie || false,
      tags: data.tags || [],
      niveau: data.niveau || null,
      duree: data.duree || null,
      auteur: data.auteur || null,
      prerequis: data.prerequis || [],
      bestseller: data.bestseller || false,
      oldPrice: data.oldPrice || null,
      longDescription: data.longDescription || null,
      details: data.details || {},
      rating: data.rating || 4,
    }
  },
}

// Convertir un document Firestore en objet Commande
const commandeConverter = {
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Commande {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      utilisateurId: data.utilisateurId,
      utilisateurEmail: data.utilisateurEmail,
      produits: data.produits || [],
      total: data.total || 0,
      dateCommande: data.dateCommande?.toDate() || new Date(),
      statut: data.statut || "en attente",
      adresseLivraison: data.adresseLivraison,
      methodePaiement: data.methodePaiement || "carte",
      reference: data.reference || snapshot.id.substring(0, 8).toUpperCase(),
    }
  },
}

// Récupérer tous les produits
export async function getAllProduits(limitCount = 50): Promise<Produit[]> {
  try {
    const produitsQuery = query(collection(db, "produits"), orderBy("dateCreation", "desc"), limit(limitCount))

    const produitsSnapshot = await getDocs(produitsQuery)
    return produitsSnapshot.docs.map((doc) => produitConverter.fromFirestore(doc))
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    return []
  }
}

// Récupérer les produits publiés - Solution temporaire sans index composite
export async function getPublishedProduits(limitCount = 50): Promise<Produit[]> {
  try {
    // Solution temporaire: récupérer tous les produits puis filtrer côté client
    const produitsQuery = query(collection(db, "produits"), limit(limitCount))
    const produitsSnapshot = await getDocs(produitsQuery)

    // Filtrer côté client
    const allProduits = produitsSnapshot.docs.map((doc) => produitConverter.fromFirestore(doc))
    const publishedProduits = allProduits.filter((produit) => produit.estPublie)

    // Trier par date de création (décroissant)
    return publishedProduits.sort((a, b) => b.dateCreation.getTime() - a.dateCreation.getTime())
  } catch (error) {
    console.error("Erreur lors de la récupération des produits publiés:", error)
    return []
  }
}

// Récupérer les produits par catégorie - Solution temporaire sans index composite
export async function getProduitsByCategorie(categorie: string, limitCount = 50): Promise<Produit[]> {
  try {
    // Solution temporaire: récupérer tous les produits puis filtrer côté client
    const produitsQuery = query(collection(db, "produits"), limit(limitCount))
    const produitsSnapshot = await getDocs(produitsQuery)

    // Filtrer côté client
    const allProduits = produitsSnapshot.docs.map((doc) => produitConverter.fromFirestore(doc))
    const filteredProduits = allProduits.filter((produit) => produit.estPublie && produit.categorie === categorie)

    // Trier par date de création (décroissant)
    return filteredProduits.sort((a, b) => b.dateCreation.getTime() - a.dateCreation.getTime())
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits de catégorie ${categorie}:`, error)
    return []
  }
}

// Ajoutez cette fonction si elle n'existe pas déjà
export async function getProduitById(id: string): Promise<Produit | null> {
  try {
    const docRef = doc(db, "produits", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
      } as Produit
    }
    return null
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error)
    return null
  }
}

// Fonction utilitaire pour nettoyer les valeurs undefined
function cleanUndefinedValues(obj: Record<string, any>): Record<string, any> {
  const cleanedObj: Record<string, any> = {}

  Object.entries(obj).forEach(([key, value]) => {
    // Si la valeur est undefined, on la remplace par null
    if (value === undefined) {
      cleanedObj[key] = null
    }
    // Si c'est un objet (mais pas null, Date ou Array), on nettoie récursivement
    else if (value !== null && typeof value === "object" && !(value instanceof Date) && !Array.isArray(value)) {
      cleanedObj[key] = cleanUndefinedValues(value)
    }
    // Sinon on garde la valeur telle quelle
    else {
      cleanedObj[key] = value
    }
  })

  return cleanedObj
}

// Créer un nouveau produit
export async function createProduit(produitData: Omit<Produit, "id" | "dateCreation">): Promise<string | null> {
  try {
    // Nettoyer les valeurs undefined
    const cleanedData = cleanUndefinedValues(produitData as Record<string, any>)

    // Ajouter le timestamp
    const produitToCreate = {
      ...cleanedData,
      dateCreation: serverTimestamp(),
    }

    const produitRef = await addDoc(collection(db, "produits"), produitToCreate)
    return produitRef.id
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error)
    throw error
  }
}

// Mettre à jour un produit
export async function updateProduit(id: string, produitData: Partial<Produit>): Promise<boolean> {
  try {
    // Supprimer l'ID et dateCreation des données à mettre à jour
    const { id: _, dateCreation, ...dataToUpdate } = produitData as any

    // Nettoyer les valeurs undefined
    const cleanedData = cleanUndefinedValues(dataToUpdate)

    console.log("Données nettoyées pour mise à jour:", cleanedData)

    await updateDoc(doc(db, "produits", id), cleanedData)
    return true
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error)
    throw error // Propager l'erreur pour pouvoir l'afficher dans l'UI
  }
}

// Supprimer un produit
export async function deleteProduit(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "produits", id))
    return true
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error)
    return false
  }
}

// Créer une nouvelle commande
export async function createCommande(
  commandeData: Omit<Commande, "id" | "dateCommande" | "reference">,
): Promise<string | null> {
  try {
    const commandeRef = await addDoc(collection(db, "commandes"), {
      ...commandeData,
      dateCommande: serverTimestamp(),
      reference: `CMD-${Date.now().toString(36).toUpperCase()}`,
    })

    return commandeRef.id
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error)
    return null
  }
}

// Récupérer les commandes d'un utilisateur
export async function getCommandesByUser(utilisateurId: string): Promise<Commande[]> {
  try {
    const commandesQuery = query(
      collection(db, "commandes"),
      where("utilisateurId", "==", utilisateurId),
      orderBy("dateCommande", "desc"),
    )

    const commandesSnapshot = await getDocs(commandesQuery)
    return commandesSnapshot.docs.map((doc) => commandeConverter.fromFirestore(doc))
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes de l'utilisateur:", error)
    return []
  }
}

// Récupérer toutes les commandes (pour l'administration)
export async function getAllCommandes(limitCount = 100): Promise<Commande[]> {
  try {
    const commandesQuery = query(collection(db, "commandes"), orderBy("dateCommande", "desc"), limit(limitCount))

    const commandesSnapshot = await getDocs(commandesQuery)
    return commandesSnapshot.docs.map((doc) => commandeConverter.fromFirestore(doc))
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error)
    return []
  }
}

// Mettre à jour le statut d'une commande
export async function updateCommandeStatus(id: string, statut: Commande["statut"]): Promise<boolean> {
  try {
    await updateDoc(doc(db, "commandes", id), { statut })
    return true
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de la commande:", error)
    return false
  }
}
