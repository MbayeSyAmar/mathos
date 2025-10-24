// Données statiques pour les 9 quiz de la plateforme
export interface StaticQuiz {
  id: number
  title: string
  description: string
  image: string
  level: string
  difficulty: "Facile" | "Moyen" | "Difficile" | "Très difficile"
  time: string
  questions: number
  popularity: number
  category: string
}

export const staticQuizData: { [key: number]: StaticQuiz } = {
  1: {
    id: 1,
    title: "Nombres et calculs",
    description: "Testez vos connaissances sur les opérations de base",
    image: "/placeholder.svg?height=200&width=400",
    level: "Collège",
    difficulty: "Facile",
    time: "15 min",
    questions: 10,
    popularity: 4.8,
    category: "college",
  },
  2: {
    id: 2,
    title: "Géométrie plane",
    description: "Quiz sur les figures géométriques et leurs propriétés",
    image: "/placeholder.svg?height=200&width=400",
    level: "Collège",
    difficulty: "Moyen",
    time: "20 min",
    questions: 15,
    popularity: 4.5,
    category: "college",
  },
  3: {
    id: 3,
    title: "Fonctions et dérivées",
    description: "Évaluez votre maîtrise du calcul différentiel",
    image: "/placeholder.svg?height=200&width=400",
    level: "Lycée",
    difficulty: "Difficile",
    time: "25 min",
    questions: 12,
    popularity: 4.7,
    category: "lycee",
  },
  4: {
    id: 4,
    title: "Suites numériques",
    description: "Quiz sur les suites arithmétiques et géométriques",
    image: "/placeholder.svg?height=200&width=400",
    level: "Lycée",
    difficulty: "Moyen",
    time: "20 min",
    questions: 15,
    popularity: 4.3,
    category: "lycee",
  },
  5: {
    id: 5,
    title: "Probabilités",
    description: "Testez vos connaissances en probabilités",
    image: "/placeholder.svg?height=200&width=400",
    level: "Lycée",
    difficulty: "Difficile",
    time: "30 min",
    questions: 15,
    popularity: 4.6,
    category: "lycee",
  },
  6: {
    id: 6,
    title: "Préparation Brevet",
    description: "Quiz complet pour préparer l'épreuve de mathématiques du Brevet",
    image: "/placeholder.svg?height=200&width=400",
    level: "Collège",
    difficulty: "Moyen",
    time: "45 min",
    questions: 25,
    popularity: 4.9,
    category: "concours",
  },
  7: {
    id: 7,
    title: "Préparation Bac",
    description: "Entraînement complet pour le Baccalauréat",
    image: "/placeholder.svg?height=200&width=400",
    level: "Lycée",
    difficulty: "Difficile",
    time: "60 min",
    questions: 30,
    popularity: 4.8,
    category: "concours",
  },
  8: {
    id: 8,
    title: "Prépa Grandes Écoles",
    description: "Quiz de niveau prépa pour les concours d'ingénieurs",
    image: "/placeholder.svg?height=200&width=400",
    level: "Supérieur",
    difficulty: "Très difficile",
    time: "90 min",
    questions: 20,
    popularity: 4.7,
    category: "concours",
  },
  9: {
    id: 9,
    title: "Algèbre linéaire",
    description: "Quiz sur les espaces vectoriels et applications linéaires",
    image: "/placeholder.svg?height=200&width=400",
    level: "Supérieur",
    difficulty: "Difficile",
    time: "40 min",
    questions: 15,
    popularity: 4.4,
    category: "concours",
  },
}

/**
 * Récupère un quiz statique par son ID
 */
export function getStaticQuizById(quizId: number): StaticQuiz | null {
  return staticQuizData[quizId] || null
}

/**
 * Récupère tous les quiz statiques
 */
export function getAllStaticQuiz(): StaticQuiz[] {
  return Object.values(staticQuizData)
}

/**
 * Récupère les quiz statiques par catégorie
 */
export function getStaticQuizByCategory(category: string): StaticQuiz[] {
  if (category === "tous") {
    return getAllStaticQuiz()
  }
  return Object.values(staticQuizData).filter(
    (quiz) => quiz.category === category
  )
}
