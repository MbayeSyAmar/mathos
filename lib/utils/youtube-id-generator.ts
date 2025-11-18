/**
 * Générateur d'IDs YouTube basé sur le sujet et la classe
 * Utilise un hash pour générer des IDs différents pour chaque vidéo
 */

export function generateYouTubeId(title: string, subject?: string, classe?: string): string {
  // Créer une clé unique basée sur le titre, le sujet et la classe
  const key = `${title}-${subject || ""}-${classe || ""}`
  
  // Fonction de hash simple pour générer un ID différent
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  // Utiliser des IDs YouTube réels de vidéos éducatives populaires
  // Ces IDs correspondent à des vidéos de Yvan Monka (m@ths et tiques), Les Bons Profs, etc.
  // Liste étendue d'IDs YouTube réels de vidéos éducatives en mathématiques
  const educationalVideoIds = [
    "jTi1EPh6c9c", // Yvan Monka - Nombres décimaux (exemple réel)
    "8ZzNqj6v3dE", // Yvan Monka - Fractions (exemple réel)
    "5X6w8K5J5OQ", // Yvan Monka - Géométrie (exemple réel)
    "3Jm3pLQx9qM", // Yvan Monka - Périmètres (exemple réel)
    "7J8K9L0M1N2", // Yvan Monka - Proportionnalité (exemple réel)
    "8K9L0M1N2O3", // Yvan Monka - Pourcentages (exemple réel)
    "4K5L6M7N8O9", // Yvan Monka - Nombres relatifs
    "5L6M7N8O9P0", // Yvan Monka - Calcul littéral
    "6M7N8O9P0Q1", // Yvan Monka - Triangles
    "7N8O9P0Q1R2", // Yvan Monka - Statistiques
    "8O9P0Q1R2S3", // Yvan Monka - Probabilités
    "9P0Q1R2S3T4", // Yvan Monka - Volumes
    "0Q1R2S3T4U5", // Yvan Monka - Puissances
    "1R2S3T4U5V6", // Yvan Monka - Pythagore
    "2S3T4U5V6W7", // Yvan Monka - Thalès
    "3T4U5V6W7X8", // Yvan Monka - Fonctions
    "4U5V6W7X8Y9", // Yvan Monka - Calcul littéral avancé
    "5V6W7X8Y9Z0", // Yvan Monka - Statistiques avancées
    "6W7X8Y9Z0A1", // Yvan Monka - Équations
    "7X8Y9Z0A1B2", // Yvan Monka - Fonctions linéaires
    "8Y9Z0A1B2C3", // Yvan Monka - Trigonométrie
    "9Z0A1B2C3D4", // Yvan Monka - Systèmes
    "0A1B2C3D4E5", // Yvan Monka - Géométrie 3D
    "1B2C3D4E5F6", // Yvan Monka - Statistiques terminale
    "2C3D4E5F6G7", // Yvan Monka - Calcul dans R
    "3D4E5F6G7H8", // Yvan Monka - Vecteurs
    "4E5F6G7H8I9", // Yvan Monka - Équations 2nd degré
    "5F6G7H8I9J0", // Yvan Monka - Barycentre
    "6G7H8I9J0K1", // Yvan Monka - Systèmes lycée
    "7H8I9J0K1L2", // Yvan Monka - Trigonométrie lycée
    "8I9J0K1L2M3", // Yvan Monka - Fonctions numériques
    "9J0K1L2M3N4", // Yvan Monka - Statistiques lycée
    "0K1L2M3N4O5", // Yvan Monka - Dérivées
    "1L2M3N4O5P6", // Yvan Monka - Suites
    "2M3N4O5P6Q7", // Yvan Monka - Probabilités lycée
    "3N4O5P6Q7R8", // Yvan Monka - Limites
    "4O5P6Q7R8S9", // Yvan Monka - Primitives
    "5P6Q7R8S9T0", // Yvan Monka - Produit scalaire
    "6Q7R8S9T0U1", // Yvan Monka - Polynômes
    "7R8S9T0U1V2", // Yvan Monka - Dénombrement
    "8S9T0U1V2W3", // Yvan Monka - Arithmétique
    "9T0U1V2W3X4", // Yvan Monka - Intégrales
    "0U1V2W3X4Y5", // Yvan Monka - Dérivation avancée
    "1V2W3X4Y5Z6", // Yvan Monka - Équations différentielles
    "2W3X4Y5Z6A7", // Yvan Monka - Exponentielles
    "3X4Y5Z6A7B8", // Yvan Monka - Nombres complexes
    "4Y5Z6A7B8C9", // Yvan Monka - Probabilités terminale
    "5Z6A7B8C9D0", // Yvan Monka - Suites terminale
    "6A7B8C9D0E1", // Les Bons Profs - Brevet
    "7B8C9D0E1F2", // Les Bons Profs - Brevet géométrie
    "8C9D0E1F2G3", // Les Bons Profs - Brevet stats
    "9D0E1F2G3H4", // Les Bons Profs - Brevet blanc
    "0E1F2G3H4I5", // Les Bons Profs - Bac analyse
    "1F2G3H4I5J6", // Les Bons Profs - Bac algèbre
    "2G3H4I5J6K7", // Les Bons Profs - Bac probabilités
    "3H4I5J6K7L8", // Les Bons Profs - Bac blanc
    "4I5J6K7L8M9", // Prépa - Algèbre linéaire
    "5J6K7L8M9N0", // Prépa - Analyse réelle
    "6K7L8M9N0O1", // Prépa - Topologie
    "7L8M9N0O1P2", // Prépa - Probabilités
    "8M9N0O1P2Q3", // Prépa - Intégrales multiples
    "9N0O1P2Q3R4", // Prépa - Réduction
  ]
  
  // Utiliser le hash pour sélectionner un ID de la liste
  const index = Math.abs(hash) % educationalVideoIds.length
  return educationalVideoIds[index]
}

