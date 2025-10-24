// Données statiques pour les 21 exercices de la plateforme
export interface StaticExercise {
  id: number
  title: string
  description: string
  image: string
  difficulty: "Facile" | "Moyen" | "Difficile"
  time: string
  exercises: number
  hasCorrection: boolean
  level: "Collège" | "Lycée"
  classe: string
}

export const staticExercisesData: { [key: number]: StaticExercise } = {
  1: {
    id: 1,
    title: "Opérations sur les décimaux",
    description: "Exercices d'addition, soustraction, multiplication et division",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Facile",
    time: "30 min",
    exercises: 15,
    hasCorrection: true,
    level: "Collège",
    classe: "6ème",
  },
  2: {
    id: 2,
    title: "Fractions simples",
    description: "Comparaison et opérations sur les fractions",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Moyen",
    time: "45 min",
    exercises: 12,
    hasCorrection: true,
    level: "Collège",
    classe: "6ème",
  },
  3: {
    id: 3,
    title: "Périmètres et aires",
    description: "Calcul de périmètres et d'aires de figures simples",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Moyen",
    time: "40 min",
    exercises: 10,
    hasCorrection: true,
    level: "Collège",
    classe: "6ème",
  },
  4: {
    id: 4,
    title: "Nombres relatifs",
    description: "Addition et soustraction de nombres relatifs",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Facile",
    time: "35 min",
    exercises: 14,
    hasCorrection: true,
    level: "Collège",
    classe: "5ème",
  },
  5: {
    id: 5,
    title: "Expressions littérales",
    description: "Calcul et simplification d'expressions",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Difficile",
    time: "50 min",
    exercises: 8,
    hasCorrection: true,
    level: "Collège",
    classe: "5ème",
  },
  6: {
    id: 6,
    title: "Symétries",
    description: "Constructions de figures symétriques",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Moyen",
    time: "40 min",
    exercises: 12,
    hasCorrection: false,
    level: "Collège",
    classe: "5ème",
  },
  7: {
    id: 7,
    title: "Calcul littéral",
    description: "Développement et factorisation d'expressions",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Moyen",
    time: "45 min",
    exercises: 10,
    hasCorrection: true,
    level: "Collège",
    classe: "4ème",
  },
  8: {
    id: 8,
    title: "Théorème de Pythagore",
    description: "Applications du théorème de Pythagore",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Difficile",
    time: "55 min",
    exercises: 8,
    hasCorrection: true,
    level: "Collège",
    classe: "4ème",
  },
  9: {
    id: 9,
    title: "Proportionnalité",
    description: "Problèmes de proportionnalité et pourcentages",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Moyen",
    time: "40 min",
    exercises: 12,
    hasCorrection: true,
    level: "Collège",
    classe: "4ème",
  },
  10: {
    id: 10,
    title: "Équations",
    description: "Résolution d'équations du premier degré",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Moyen",
    time: "50 min",
    exercises: 15,
    hasCorrection: true,
    level: "Collège",
    classe: "3ème",
  },
  11: {
    id: 11,
    title: "Fonctions linéaires",
    description: "Représentation graphique et calculs",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Difficile",
    time: "60 min",
    exercises: 10,
    hasCorrection: true,
    level: "Collège",
    classe: "3ème",
  },
  12: {
    id: 12,
    title: "Trigonométrie",
    description: "Calculs trigonométriques dans le triangle rectangle",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Difficile",
    time: "55 min",
    exercises: 12,
    hasCorrection: true,
    level: "Collège",
    classe: "3ème",
  },
  13: {
    id: 13,
    title: "Fonctions de référence",
    description: "Étude des fonctions carré, inverse et racine carrée",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Moyen",
    time: "45 min",
    exercises: 10,
    hasCorrection: true,
    level: "Lycée",
    classe: "2nde",
  },
  14: {
    id: 14,
    title: "Vecteurs",
    description: "Opérations vectorielles dans le plan",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Difficile",
    time: "60 min",
    exercises: 8,
    hasCorrection: true,
    level: "Lycée",
    classe: "2nde",
  },
  15: {
    id: 15,
    title: "Statistiques",
    description: "Indicateurs de position et de dispersion",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Moyen",
    time: "50 min",
    exercises: 12,
    hasCorrection: false,
    level: "Lycée",
    classe: "2nde",
  },
  16: {
    id: 16,
    title: "Dérivation",
    description: "Calcul de dérivées et applications",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Difficile",
    time: "65 min",
    exercises: 15,
    hasCorrection: true,
    level: "Lycée",
    classe: "1ère",
  },
  17: {
    id: 17,
    title: "Suites numériques",
    description: "Suites arithmétiques et géométriques",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Moyen",
    time: "55 min",
    exercises: 12,
    hasCorrection: true,
    level: "Lycée",
    classe: "1ère",
  },
  18: {
    id: 18,
    title: "Probabilités",
    description: "Variables aléatoires et lois de probabilité",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Difficile",
    time: "70 min",
    exercises: 10,
    hasCorrection: true,
    level: "Lycée",
    classe: "1ère",
  },
  19: {
    id: 19,
    title: "Intégration",
    description: "Calcul d'intégrales et applications",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Difficile",
    time: "75 min",
    exercises: 12,
    hasCorrection: true,
    level: "Lycée",
    classe: "Terminale",
  },
  20: {
    id: 20,
    title: "Nombres complexes",
    description: "Opérations et applications géométriques",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Difficile",
    time: "65 min",
    exercises: 10,
    hasCorrection: true,
    level: "Lycée",
    classe: "Terminale",
  },
  21: {
    id: 21,
    title: "Logarithmes",
    description: "Fonctions logarithmiques et exponentielles",
    image: "/placeholder.svg?height=200&width=400",
    difficulty: "Moyen",
    time: "60 min",
    exercises: 15,
    hasCorrection: true,
    level: "Lycée",
    classe: "Terminale",
  },
}

/**
 * Récupère un exercice statique par son ID
 */
export function getStaticExerciseById(exerciseId: number): StaticExercise | null {
  return staticExercisesData[exerciseId] || null
}

/**
 * Récupère tous les exercices statiques
 */
export function getAllStaticExercises(): StaticExercise[] {
  return Object.values(staticExercisesData)
}

/**
 * Récupère les exercices statiques par classe
 */
export function getStaticExercisesByClasse(classe: string): StaticExercise[] {
  return Object.values(staticExercisesData).filter(
    (exercise) => exercise.classe === classe
  )
}
