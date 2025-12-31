/**
 * Service pour gérer les vidéos YouTube
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
  relatedVideos?: Video[]
  comments?: Comment[]
}

// Cette fonction récupère une vidéo par son ID
// En production, cela devrait venir d'une base de données
export function getVideoById(id: number): Video | null {
  // Pour l'instant, on retourne null car les données sont dans la page
  // En production, on ferait une requête à la base de données
  return null
}

// Fonction pour obtenir l'URL d'embed YouTube
export function getYouTubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube.com/embed/${youtubeId}`
}

// Fonction pour obtenir l'URL de la vidéo YouTube
export function getYouTubeUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`
}

// Fonction pour obtenir la thumbnail YouTube
export function getYouTubeThumbnail(youtubeId: string, quality: "default" | "medium" | "high" | "maxres" = "maxres"): string {
  const qualityMap = {
    default: "default",
    medium: "mqdefault",
    high: "hqdefault",
    maxres: "maxresdefault",
  }
  return `https://img.youtube.com/vi/${youtubeId}/${qualityMap[quality]}.jpg`
}

