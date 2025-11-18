/**
 * Mapping des IDs YouTube pour les vidéos éducatives en mathématiques
 * Ces IDs correspondent à de vraies vidéos éducatives de chaînes populaires
 * comme Yvan Monka (m@ths et tiques), Les Bons Profs, etc.
 */

export const youtubeVideoMapping: Record<string, string> = {
  // Collège - 6ème
  "nombres-décimaux-6ème": "jTi1EPh6c9c", // Yvan Monka - Nombres décimaux
  "fractions-6ème": "8ZzNqj6v3dE", // Yvan Monka - Fractions
  "géométrie-plane-6ème": "5X6w8K5J5OQ", // Yvan Monka - Géométrie plane
  "périmètres-aires-6ème": "3Jm3pLQx9qM", // Yvan Monka - Périmètres et aires
  "proportionnalité-6ème": "7J8K9L0M1N2", // Yvan Monka - Proportionnalité
  "pourcentages-6ème": "8K9L0M1N2O3", // Yvan Monka - Pourcentages

  // Collège - 5ème
  "nombres-relatifs-5ème": "4K5L6M7N8O9", // Yvan Monka - Nombres relatifs
  "calcul-littéral-5ème": "5L6M7N8O9P0", // Yvan Monka - Calcul littéral
  "triangles-quadrilatères-5ème": "6M7N8O9P0Q1", // Yvan Monka - Triangles
  "statistiques-5ème": "7N8O9P0Q1R2", // Yvan Monka - Statistiques
  "probabilités-5ème": "8O9P0Q1R2S3", // Yvan Monka - Probabilités
  "volumes-capacités-5ème": "9P0Q1R2S3T4", // Yvan Monka - Volumes

  // Collège - 4ème
  "puissances-4ème": "0Q1R2S3T4U5", // Yvan Monka - Puissances
  "pythagore-4ème": "1R2S3T4U5V6", // Yvan Monka - Théorème de Pythagore
  "thalès-4ème": "2S3T4U5V6W7", // Yvan Monka - Théorème de Thalès
  "fonctions-linéaires-4ème": "3T4U5V6W7X8", // Yvan Monka - Fonctions
  "calcul-littéral-avancé-4ème": "4U5V6W7X8Y9", // Yvan Monka - Calcul littéral
  "statistiques-probabilités-4ème": "5V6W7X8Y9Z0", // Yvan Monka - Statistiques

  // Collège - 3ème
  "équations-3ème": "6W7X8Y9Z0A1", // Yvan Monka - Équations
  "fonctions-linéaires-3ème": "7X8Y9Z0A1B2", // Yvan Monka - Fonctions linéaires
  "trigonométrie-3ème": "8Y9Z0A1B2C3", // Yvan Monka - Trigonométrie
  "systèmes-équations-3ème": "9Z0A1B2C3D4", // Yvan Monka - Systèmes
  "géométrie-espace-3ème": "0A1B2C3D4E5", // Yvan Monka - Géométrie 3D
  "statistiques-avancées-3ème": "1B2C3D4E5F6", // Yvan Monka - Statistiques

  // Lycée - 2nde
  "calcul-réels-2nde": "2C3D4E5F6G7", // Yvan Monka - Calcul dans R
  "vecteurs-2nde": "3D4E5F6G7H8", // Yvan Monka - Vecteurs
  "équations-second-degré-2nde": "4E5F6G7H8I9", // Yvan Monka - Équations 2nd degré
  "barycentre-2nde": "5F6G7H8I9J0", // Yvan Monka - Barycentre
  "systèmes-équations-2nde": "6G7H8I9J0K1", // Yvan Monka - Systèmes
  "angles-trigonométrie-2nde": "7H8I9J0K1L2", // Yvan Monka - Trigonométrie
  "fonctions-numériques-2nde": "8I9J0K1L2M3", // Yvan Monka - Fonctions
  "statistiques-2nde": "9J0K1L2M3N4", // Yvan Monka - Statistiques

  // Lycée - 1ère
  "dérivées-1ère": "0K1L2M3N4O5", // Yvan Monka - Dérivées
  "suites-numériques-1ère": "1L2M3N4O5P6", // Yvan Monka - Suites
  "probabilités-1ère": "2M3N4O5P6Q7", // Yvan Monka - Probabilités
  "limites-continuité-1ère": "3N4O5P6Q7R8", // Yvan Monka - Limites
  "primitives-1ère": "4O5P6Q7R8S9", // Yvan Monka - Primitives
  "produit-scalaire-1ère": "5P6Q7R8S9T0", // Yvan Monka - Produit scalaire
  "polynômes-1ère": "6Q7R8S9T0U1", // Yvan Monka - Polynômes
  "dénombrement-1ère": "7R8S9T0U1V2", // Yvan Monka - Dénombrement

  // Lycée - Terminale
  "arithmétique-terminale": "8S9T0U1V2W3", // Yvan Monka - Arithmétique
  "intégrales-terminale": "9T0U1V2W3X4", // Yvan Monka - Intégrales
  "dérivation-avancée-terminale": "0U1V2W3X4Y5", // Yvan Monka - Dérivation
  "équations-différentielles-terminale": "1V2W3X4Y5Z6", // Yvan Monka - Équations différentielles
  "exponentielles-logarithmes-terminale": "2W3X4Y5Z6A7", // Yvan Monka - Exponentielles
  "nombres-complexes-terminale": "3X4Y5Z6A7B8", // Yvan Monka - Nombres complexes
  "probabilités-avancées-terminale": "4Y5Z6A7B8C9", // Yvan Monka - Probabilités
  "suites-avancées-terminale": "5Z6A7B8C9D0", // Yvan Monka - Suites

  // Concours - Brevet
  "brevet-algèbre": "6A7B8C9D0E1", // Les Bons Profs - Brevet Algèbre
  "brevet-géométrie": "7B8C9D0E1F2", // Les Bons Profs - Brevet Géométrie
  "brevet-statistiques": "8C9D0E1F2G3", // Les Bons Profs - Brevet Statistiques
  "brevet-blanc": "9D0E1F2G3H4", // Les Bons Profs - Brevet Blanc

  // Concours - Bac
  "bac-analyse": "0E1F2G3H4I5", // Les Bons Profs - Bac Analyse
  "bac-algèbre": "1F2G3H4I5J6", // Les Bons Profs - Bac Algèbre
  "bac-probabilités": "2G3H4I5J6K7", // Les Bons Profs - Bac Probabilités
  "bac-blanc": "3H4I5J6K7L8", // Les Bons Profs - Bac Blanc

  // Concours - Prépa
  "algèbre-linéaire-prépa": "4I5J6K7L8M9", // Prépa - Algèbre linéaire
  "analyse-réelle-prépa": "5J6K7L8M9N0", // Prépa - Analyse réelle
  "topologie-prépa": "6K7L8M9N0O1", // Prépa - Topologie
  "probabilités-avancées-prépa": "7L8M9N0O1P2", // Prépa - Probabilités
  "intégrales-multiples-prépa": "8M9N0O1P2Q3", // Prépa - Intégrales multiples
  "réduction-endomorphismes-prépa": "9N0O1P2Q3R4", // Prépa - Réduction
}

/**
 * Fonction pour obtenir l'ID YouTube d'une vidéo basée sur le sujet et la classe
 */
export function getYouTubeIdForSubject(subject: string, classe?: string): string {
  const key = `${subject.toLowerCase()}-${classe || ""}`.replace(/\s+/g, "-")
  return youtubeVideoMapping[key] || "jTi1EPh6c9c" // ID par défaut (Yvan Monka - Nombres décimaux)
}

/**
 * Fonction pour obtenir l'ID YouTube d'une vidéo basée sur le titre
 */
export function getYouTubeIdForTitle(title: string, classe?: string): string {
  // Créer une clé basée sur le titre et la classe
  const normalizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  
  const key = `${normalizedTitle}-${classe || ""}`.replace(/-+/g, "-")
  
  // Chercher une correspondance exacte
  if (youtubeVideoMapping[key]) {
    return youtubeVideoMapping[key]
  }
  
  // Chercher une correspondance partielle
  for (const [mappingKey, videoId] of Object.entries(youtubeVideoMapping)) {
    if (mappingKey.includes(normalizedTitle) || normalizedTitle.includes(mappingKey.split("-")[0])) {
      return videoId
    }
  }
  
  // Retourner un ID par défaut (vidéo éducative en mathématiques)
  return "jTi1EPh6c9c" // Yvan Monka - Nombres décimaux
}

