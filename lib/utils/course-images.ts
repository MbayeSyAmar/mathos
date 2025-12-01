/**
 * Helper pour générer des images appropriées pour les cours et exercices
 * Utilise Picsum Photos (Lorem Picsum) pour des images fiables
 */

export function getCourseImage(subject?: string, level?: string): string {
  const mathImages = [
    "/images/math-blackboard.png",
    "/images/geometrie.png",
    "/images/prob.jpg",
    "/images/exercice.jpg",
    "/images/reussirenmaths.jpg",
  ]

  if (subject) {
    const subjectLower = subject.toLowerCase()
    if (subjectLower.includes("géométrie") || subjectLower.includes("geometrie")) {
      return "/images/geometrie.png"
    }
    if (subjectLower.includes("algèbre") || subjectLower.includes("algebre") || subjectLower.includes("polyn")) {
      return "/images/ln.png"
    }
    if (subjectLower.includes("calcul") || subjectLower.includes("analyse") || subjectLower.includes("fonction")) {
      return "/images/math-blackboard.png"
    }
    if (subjectLower.includes("statistique") || subjectLower.includes("probabilité")) {
      return "/images/prob.jpg"
    }
    if (subjectLower.includes("trigonométrie") || subjectLower.includes("trigonometrie")) {
      return "/images/olymp.jpg"
    }
    if (subjectLower.includes("nombres") || subjectLower.includes("fractions")) {
      return "/images/exercice.jpg"
    }
  }

  if (level) {
    const levelLower = level.toLowerCase()
    if (levelLower.includes("collège")) {
      return "/images/reussirenmaths.jpg"
    }
    if (levelLower.includes("lycée")) {
      return "/images/math-blackboard.png"
    }
    if (levelLower.includes("sup")) {
      return "/images/ln.png"
    }
  }

  if (subject) {
    const hash = subject.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return mathImages[hash % mathImages.length]
  }

  return mathImages[0]
}

export function getExerciseImage(difficulty?: string, subject?: string): string {
  const exerciseImages = ["/images/exercice.jpg", "/images/exo.jpg", "/images/reussirenmaths.jpg", "/images/prob.jpg"]

  if (subject) {
    return getCourseImage(subject)
  }

  if (difficulty) {
    const hash = difficulty.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return exerciseImages[hash % exerciseImages.length]
  }

  return exerciseImages[0]
}

export function getQuizImage(level?: string): string {
  const quizImages = ["/images/math-blackboard.png", "/images/prob.jpg", "/images/olymp.jpg"]
  if (level) {
    if (level.toLowerCase().includes("collège")) {
      return quizImages[0]
    }
    if (level.toLowerCase().includes("lycée")) {
      return quizImages[1]
    }
    if (level.toLowerCase().includes("supérieur") || level.toLowerCase().includes("concours")) {
      return quizImages[2]
    }
  }
  return quizImages[0]
}

