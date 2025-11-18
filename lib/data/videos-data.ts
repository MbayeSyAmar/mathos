/**
 * Données partagées pour les vidéos
 * Cette structure peut être remplacée par une base de données en production
 */

export interface Video {
  id: number
  title: string
  description: string
  youtubeId: string
  thumbnail: string
  duration: string
  views: number
  likes: number
  level: string
  classe?: string
  subject?: string
  category?: "cours" | "exercices" | "methodes"
  author?: string
  authorAvatar?: string
  authorBio?: string
  content?: string
  tags?: string[]
}

type ClasseKey = "6ème" | "5ème" | "4ème" | "3ème" | "2nde" | "1ère" | "Terminale" | "Brevet" | "Bac" | "Prépa"

// Cette fonction récupère toutes les vidéos
// En production, cela devrait venir d'une base de données
export function getAllVideos(): Video[] {
  // Pour l'instant, on retourne un tableau vide
  // Les données sont dans app/videos/page.tsx
  // En production, on ferait une requête à la base de données
  return []
}

// Cette fonction récupère une vidéo par son ID
export function getVideoById(id: number): Video | null {
  // Pour l'instant, on retourne null
  // En production, on ferait une requête à la base de données
  // Pour le moment, les données sont dans app/videos/page.tsx
  return null
}

