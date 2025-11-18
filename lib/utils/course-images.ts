/**
 * Helper pour générer des images appropriées pour les cours et exercices
 * Utilise Picsum Photos (Lorem Picsum) pour des images fiables
 */

export function getCourseImage(subject?: string, level?: string): string {
  // Utiliser Picsum Photos avec des IDs fixes pour chaque type d'image
  // Cela garantit des images différentes mais cohérentes pour chaque sujet
  const mathImages = [
    "https://picsum.photos/seed/math1/800/600", // Formules mathématiques
    "https://picsum.photos/seed/math2/800/600", // Géométrie
    "https://picsum.photos/seed/math3/800/600", // Calcul
    "https://picsum.photos/seed/math4/800/600", // Algèbre
    "https://picsum.photos/seed/math5/800/600", // Tableau noir
  ]

  // Images par sujet avec des seeds différents pour chaque sujet
  if (subject) {
    const subjectLower = subject.toLowerCase()
    if (subjectLower.includes("géométrie") || subjectLower.includes("geometrie")) {
      return "https://picsum.photos/seed/geometry/800/600"
    }
    if (subjectLower.includes("algèbre") || subjectLower.includes("algebre")) {
      return "https://picsum.photos/seed/algebra/800/600"
    }
    if (subjectLower.includes("calcul") || subjectLower.includes("analyse")) {
      return "https://picsum.photos/seed/calculus/800/600"
    }
    if (subjectLower.includes("statistique") || subjectLower.includes("probabilité")) {
      return "https://picsum.photos/seed/statistics/800/600"
    }
    if (subjectLower.includes("nombres") || subjectLower.includes("fractions")) {
      return "https://picsum.photos/seed/numbers/800/600"
    }
    if (subjectLower.includes("trigonométrie") || subjectLower.includes("trigonometrie")) {
      return "https://picsum.photos/seed/trigonometry/800/600"
    }
    if (subjectLower.includes("dérivée") || subjectLower.includes("derivee") || subjectLower.includes("dérivation")) {
      return "https://picsum.photos/seed/derivative/800/600"
    }
    if (subjectLower.includes("intégrale") || subjectLower.includes("integrale")) {
      return "https://picsum.photos/seed/integral/800/600"
    }
    if (subjectLower.includes("suites") || subjectLower.includes("série")) {
      return "https://picsum.photos/seed/sequence/800/600"
    }
  }

  // Retourner une image aléatoire basée sur le hash du sujet
  if (subject) {
    const hash = subject.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return mathImages[hash % mathImages.length]
  }

  return mathImages[0]
}

export function getExerciseImage(difficulty?: string, subject?: string): string {
  const exerciseImages = [
    "https://picsum.photos/seed/exercise1/800/600", // Exercices
    "https://picsum.photos/seed/exercise2/800/600", // Géométrie
    "https://picsum.photos/seed/exercise3/800/600", // Algèbre
    "https://picsum.photos/seed/exercise4/800/600", // Calcul
  ]

  if (subject) {
    return getCourseImage(subject)
  }

  return exerciseImages[0]
}

export function getQuizImage(level?: string): string {
  const quizImages = [
    "https://picsum.photos/seed/quiz1/800/600", // Quiz
    "https://picsum.photos/seed/quiz2/800/600", // Graphiques
    "https://picsum.photos/seed/quiz3/800/600", // Géométrie
  ]

  return quizImages[0]
}

