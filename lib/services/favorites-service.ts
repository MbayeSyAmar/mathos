/**
 * Service de gestion des favoris étudiants
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface Favorite {
  id: string
  userId: string
  type: "course" | "exercise" | "quiz" | "video" | "article"
  itemId: string
  title: string
  description?: string
  imageUrl?: string
  addedAt: Timestamp
}

/**
 * Ajouter un élément aux favoris
 */
export async function addFavorite(
  userId: string,
  type: Favorite["type"],
  itemId: string,
  title: string,
  description?: string,
  imageUrl?: string
): Promise<void> {
  try {
    // Vérifier si déjà en favoris
    const existingQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("type", "==", type),
      where("itemId", "==", itemId)
    )
    const existing = await getDocs(existingQuery)
    
    if (!existing.empty) {
      return // Déjà en favoris
    }

    // Ajouter aux favoris
    const favoriteRef = doc(collection(db, "favorites"))
    await setDoc(favoriteRef, {
      userId,
      type,
      itemId,
      title,
      description,
      imageUrl,
      addedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error adding favorite:", error)
    throw error
  }
}

/**
 * Retirer un élément des favoris
 */
export async function removeFavorite(userId: string, type: Favorite["type"], itemId: string): Promise<void> {
  try {
    const favoritesQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("type", "==", type),
      where("itemId", "==", itemId)
    )
    const snapshot = await getDocs(favoritesQuery)
    
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref))
    await Promise.all(deletePromises)
  } catch (error) {
    console.error("Error removing favorite:", error)
    throw error
  }
}

/**
 * Récupérer tous les favoris d'un utilisateur
 */
export async function getUserFavorites(userId: string, limitCount: number = 50): Promise<Favorite[]> {
  try {
    const favoritesQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      orderBy("addedAt", "desc"),
      firestoreLimit(limitCount)
    )
    const snapshot = await getDocs(favoritesQuery)
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Favorite[]
  } catch (error) {
    console.error("Error getting favorites:", error)
    return []
  }
}

/**
 * Vérifier si un élément est en favoris
 */
export async function isFavorite(
  userId: string,
  type: Favorite["type"],
  itemId: string
): Promise<boolean> {
  try {
    const favoritesQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("type", "==", type),
      where("itemId", "==", itemId)
    )
    const snapshot = await getDocs(favoritesQuery)
    return !snapshot.empty
  } catch (error) {
    console.error("Error checking favorite:", error)
    return false
  }
}

