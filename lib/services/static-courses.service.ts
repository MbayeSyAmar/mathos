/**
 * Service pour les cours statiques (IDs 1-30)
 * Ces cours sont affichés dans la page /cours
 * et ont du contenu enrichi par défaut
 */

import { enrichedCourses, type EnrichedCourse } from "@/lib/data/enriched-content"

export interface StaticCourse {
  id: number
  title: string
  description: string
  level: string
  classe: string
  subject: string
  duration: string
  image: string
  objectives: string[]
  prerequisites: string[]
}

// Données des cours statiques (correspond à coursesData dans app/cours/page.tsx)
export const staticCoursesData: Record<number, StaticCourse> = {
  // 6ème
  1: {
    id: 1,
    title: "Nombres décimaux",
    description: "Opérations et propriétés des nombres décimaux",
    level: "Collège",
    classe: "6ème",
    subject: "Arithmétique",
    duration: "2h30",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre la structure des nombres décimaux",
      "Maîtriser les opérations sur les nombres décimaux",
      "Comparer et ranger des nombres décimaux",
    ],
    prerequisites: [
      "Connaître les nombres entiers",
      "Savoir compter et calculer",
    ],
  },
  2: {
    id: 2,
    title: "Fractions",
    description: "Introduction aux fractions et opérations de base",
    level: "Collège",
    classe: "6ème",
    subject: "Arithmétique",
    duration: "3h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre le concept de fraction",
      "Simplifier des fractions",
      "Effectuer des additions et soustractions de fractions",
      "Multiplier des fractions",
    ],
    prerequisites: [
      "Connaître les nombres décimaux",
      "Maîtriser la division",
    ],
  },
  3: {
    id: 3,
    title: "Géométrie plane",
    description: "Figures géométriques et leurs propriétés",
    level: "Collège",
    classe: "6ème",
    subject: "Géométrie",
    duration: "4h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Identifier les figures géométriques de base",
      "Calculer des périmètres",
      "Calculer des aires",
      "Construire des figures géométriques",
    ],
    prerequisites: [
      "Savoir utiliser une règle et un compas",
      "Connaître les unités de mesure",
    ],
  },

  // 5ème
  4: {
    id: 4,
    title: "Nombres relatifs",
    description: "Opérations sur les nombres positifs et négatifs",
    level: "Collège",
    classe: "5ème",
    subject: "Arithmétique",
    duration: "2h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre la notion de nombre relatif",
      "Placer des nombres relatifs sur une droite graduée",
      "Additionner et soustraire des nombres relatifs",
    ],
    prerequisites: [
      "Connaître les nombres décimaux",
      "Savoir utiliser une droite graduée",
    ],
  },
  5: {
    id: 5,
    title: "Calcul littéral",
    description: "Introduction aux expressions algébriques",
    level: "Collège",
    classe: "5ème",
    subject: "Algèbre",
    duration: "3h30",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre les expressions algébriques",
      "Réduire des expressions",
      "Développer des expressions simples",
      "Factoriser des expressions simples",
    ],
    prerequisites: [
      "Maîtriser les opérations de base",
      "Connaître les priorités opératoires",
    ],
  },
  6: {
    id: 6,
    title: "Triangles",
    description: "Propriétés des triangles et constructions",
    level: "Collège",
    classe: "5ème",
    subject: "Géométrie",
    duration: "2h45",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Connaître les propriétés des triangles",
      "Appliquer l'inégalité triangulaire",
      "Construire des triangles",
      "Identifier les triangles particuliers",
    ],
    prerequisites: [
      "Connaître les figures géométriques de base",
      "Savoir utiliser le compas",
    ],
  },

  // 4ème
  7: {
    id: 7,
    title: "Puissances",
    description: "Calculs avec les puissances de 10",
    level: "Collège",
    classe: "4ème",
    subject: "Arithmétique",
    duration: "2h15",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre la notation puissance",
      "Calculer avec les puissances de 10",
      "Utiliser la notation scientifique",
      "Appliquer les règles sur les puissances",
    ],
    prerequisites: [
      "Maîtriser les opérations de base",
      "Connaître les nombres décimaux",
    ],
  },
  8: {
    id: 8,
    title: "Théorème de Pythagore",
    description: "Applications et démonstrations",
    level: "Collège",
    classe: "4ème",
    subject: "Géométrie",
    duration: "3h20",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Connaître le théorème de Pythagore",
      "Calculer la longueur de l'hypoténuse",
      "Calculer un côté de l'angle droit",
      "Utiliser la réciproque du théorème",
    ],
    prerequisites: [
      "Connaître les triangles rectangles",
      "Savoir calculer des racines carrées",
    ],
  },
  9: {
    id: 9,
    title: "Proportionnalité",
    description: "Tableaux de proportionnalité et applications",
    level: "Collège",
    classe: "4ème",
    subject: "Arithmétique",
    duration: "2h50",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Reconnaître une situation de proportionnalité",
      "Compléter un tableau de proportionnalité",
      "Calculer des pourcentages",
      "Résoudre des problèmes de proportionnalité",
    ],
    prerequisites: [
      "Maîtriser les fractions",
      "Savoir effectuer des multiplications",
    ],
  },

  // 3ème
  10: {
    id: 10,
    title: "Équations",
    description: "Résolution d'équations du premier degré",
    level: "Collège",
    classe: "3ème",
    subject: "Algèbre",
    duration: "3h10",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre le concept d'équation",
      "Résoudre des équations du premier degré",
      "Vérifier une solution",
      "Mettre en équation un problème",
    ],
    prerequisites: [
      "Maîtriser le calcul littéral",
      "Connaître les règles de transformation",
    ],
  },
  11: {
    id: 11,
    title: "Fonctions linéaires",
    description: "Représentation graphique et propriétés",
    level: "Collège",
    classe: "3ème",
    subject: "Fonctions",
    duration: "2h40",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre la notion de fonction",
      "Reconnaître une fonction linéaire",
      "Déterminer l'expression d'une fonction",
      "Représenter graphiquement une fonction",
    ],
    prerequisites: [
      "Savoir utiliser un repère",
      "Connaître les équations",
    ],
  },
  12: {
    id: 12,
    title: "Trigonométrie",
    description: "Introduction au sinus, cosinus et tangente",
    level: "Collège",
    classe: "3ème",
    subject: "Géométrie",
    duration: "4h15",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Connaître les rapports trigonométriques",
      "Calculer des longueurs avec la trigonométrie",
      "Calculer des angles",
      "Utiliser les valeurs remarquables",
    ],
    prerequisites: [
      "Connaître le théorème de Pythagore",
      "Maîtriser les triangles rectangles",
    ],
  },

  // 2nde
  13: {
    id: 13,
    title: "Calcul dans R",
    description: "Opérations et propriétés dans l'ensemble des réels",
    level: "Lycée",
    classe: "2nde",
    subject: "Algèbre",
    duration: "3h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Maîtriser les opérations dans R",
      "Utiliser les propriétés des réels",
      "Résoudre des équations et inéquations",
      "Manipuler les valeurs absolues",
    ],
    prerequisites: [
      "Connaître les nombres entiers et décimaux",
      "Maîtriser les opérations de base",
    ],
  },
  14: {
    id: 14,
    title: "Vecteurs",
    description: "Opérations vectorielles dans le plan",
    level: "Lycée",
    classe: "2nde",
    subject: "Géométrie",
    duration: "4h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre la notion de vecteur",
      "Effectuer des opérations sur les vecteurs",
      "Utiliser les coordonnées de vecteurs",
      "Appliquer la colinéarité",
    ],
    prerequisites: [
      "Connaître les repères du plan",
      "Maîtriser les coordonnées de points",
    ],
  },
  15: {
    id: 15,
    title: "Statistiques",
    description: "Indicateurs de position et de dispersion",
    level: "Lycée",
    classe: "2nde",
    subject: "Statistiques",
    duration: "2h30",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Calculer des indicateurs de position",
      "Calculer des indicateurs de dispersion",
      "Interpréter des diagrammes",
      "Construire des diagrammes en boîte",
    ],
    prerequisites: [
      "Connaître la moyenne",
      "Savoir organiser des données",
    ],
  },
  31: {
    id: 31,
    title: "Angles",
    description: "Mesure et propriétés des angles",
    level: "Lycée",
    classe: "2nde",
    subject: "Géométrie",
    duration: "2h30",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Mesurer des angles",
      "Utiliser les angles orientés",
      "Appliquer les propriétés des angles",
      "Résoudre des problèmes géométriques",
    ],
    prerequisites: [
      "Connaître les bases de la géométrie",
      "Savoir utiliser un rapporteur",
    ],
  },
  32: {
    id: 32,
    title: "Barycentre",
    description: "Notion de barycentre et applications",
    level: "Lycée",
    classe: "2nde",
    subject: "Géométrie",
    duration: "3h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre la notion de barycentre",
      "Calculer les coordonnées d'un barycentre",
      "Utiliser les propriétés du barycentre",
      "Résoudre des problèmes géométriques",
    ],
    prerequisites: [
      "Maîtriser les vecteurs",
      "Connaître les coordonnées",
    ],
  },
  33: {
    id: 33,
    title: "Calcul vectoriel",
    description: "Opérations sur les vecteurs dans le plan",
    level: "Lycée",
    classe: "2nde",
    subject: "Géométrie",
    duration: "4h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Effectuer des opérations vectorielles",
      "Utiliser la colinéarité",
      "Déterminer des coordonnées",
      "Résoudre des problèmes géométriques",
    ],
    prerequisites: [
      "Connaître les vecteurs",
      "Maîtriser les coordonnées",
    ],
  },
  34: {
    id: 34,
    title: "Fonctions",
    description: "Introduction aux fonctions numériques",
    level: "Lycée",
    classe: "2nde",
    subject: "Fonctions",
    duration: "4h30",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre la notion de fonction",
      "Déterminer l'image et l'antécédent",
      "Représenter graphiquement une fonction",
      "Étudier les variations",
    ],
    prerequisites: [
      "Connaître les fonctions linéaires",
      "Savoir utiliser un repère",
    ],
  },
  35: {
    id: 35,
    title: "Polynomes",
    description: "Opérations sur les polynômes",
    level: "Lycée",
    classe: "2nde",
    subject: "Algèbre",
    duration: "3h30",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre la structure d'un polynôme",
      "Effectuer des opérations sur les polynômes",
      "Factoriser des polynômes",
      "Résoudre des équations polynomiales",
    ],
    prerequisites: [
      "Maîtriser les expressions algébriques",
      "Connaître la distributivité",
    ],
  },
  36: {
    id: 36,
    title: "Second degré",
    description: "Équations et fonctions du second degré",
    level: "Lycée",
    classe: "2nde",
    subject: "Algèbre",
    duration: "4h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Résoudre des équations du second degré",
      "Étudier la fonction carré",
      "Factoriser des trinômes",
      "Utiliser le discriminant",
    ],
    prerequisites: [
      "Maîtriser les équations du premier degré",
      "Connaître les identités remarquables",
    ],
  },
  37: {
    id: 37,
    title: "Systèmes",
    description: "Résolution de systèmes d'équations",
    level: "Lycée",
    classe: "2nde",
    subject: "Algèbre",
    duration: "3h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Résoudre des systèmes linéaires",
      "Utiliser la méthode de substitution",
      "Utiliser la méthode de combinaison",
      "Interpréter géométriquement",
    ],
    prerequisites: [
      "Maîtriser les équations",
      "Connaître les coordonnées",
    ],
  },

  // 1ère
  16: {
    id: 16,
    title: "Dérivées",
    description: "Calcul de dérivées et applications",
    level: "Lycée",
    classe: "1ère",
    subject: "Analyse",
    duration: "5h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre le concept de dérivée",
      "Calculer des dérivées",
      "Étudier les variations d'une fonction",
      "Déterminer une équation de tangente",
    ],
    prerequisites: [
      "Maîtriser les fonctions de référence",
      "Connaître les limites",
    ],
  },
  17: {
    id: 17,
    title: "Suites numériques",
    description: "Suites arithmétiques et géométriques",
    level: "Lycée",
    classe: "1ère",
    subject: "Analyse",
    duration: "4h30",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre la notion de suite",
      "Étudier les suites arithmétiques",
      "Étudier les suites géométriques",
      "Déterminer le sens de variation",
    ],
    prerequisites: [
      "Maîtriser les fonctions",
      "Connaître le raisonnement par récurrence",
    ],
  },
  18: {
    id: 18,
    title: "Probabilités",
    description: "Variables aléatoires et lois de probabilité",
    level: "Lycée",
    classe: "1ère",
    subject: "Probabilités",
    duration: "3h15",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Calculer des probabilités",
      "Utiliser les probabilités conditionnelles",
      "Étudier des variables aléatoires",
      "Calculer espérance et variance",
    ],
    prerequisites: [
      "Connaître les bases des probabilités",
      "Maîtriser les ensembles",
    ],
  },
  38: {
    id: 38,
    title: "Angles orientés",
    description: "Mesure et propriétés des angles orientés",
    level: "Lycée",
    classe: "1ère",
    subject: "Géométrie",
    duration: "3h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre la notion d'angle orienté",
      "Mesurer des angles orientés",
      "Utiliser les propriétés des angles",
      "Appliquer en trigonométrie",
    ],
    prerequisites: [
      "Connaître les angles",
      "Maîtriser le cercle trigonométrique",
    ],
  },
  39: {
    id: 39,
    title: "Dénombrement",
    description: "Techniques de dénombrement et combinatoire",
    level: "Lycée",
    classe: "1ère",
    subject: "Probabilités",
    duration: "3h30",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Utiliser les arrangements",
      "Utiliser les combinaisons",
      "Appliquer le principe multiplicatif",
      "Résoudre des problèmes de dénombrement",
    ],
    prerequisites: [
      "Maîtriser les opérations",
      "Connaître les factorielles",
    ],
  },
  40: {
    id: 40,
    title: "Équations, inéquations et systèmes",
    description: "Résolution d'équations, inéquations et systèmes",
    level: "Lycée",
    classe: "1ère",
    subject: "Algèbre",
    duration: "4h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Résoudre des équations complexes",
      "Résoudre des inéquations",
      "Résoudre des systèmes",
      "Interpréter les solutions",
    ],
    prerequisites: [
      "Maîtriser les équations du second degré",
      "Connaître les systèmes linéaires",
    ],
  },
  41: {
    id: 41,
    title: "Fonctions",
    description: "Étude approfondie des fonctions",
    level: "Lycée",
    classe: "1ère",
    subject: "Fonctions",
    duration: "5h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Étudier les variations",
      "Déterminer les extremums",
      "Étudier la parité",
      "Résoudre des problèmes",
    ],
    prerequisites: [
      "Maîtriser les fonctions de base",
      "Connaître la dérivation",
    ],
  },
  42: {
    id: 42,
    title: "Identités et relations trigonométriques",
    description: "Formules trigonométriques et applications",
    level: "Lycée",
    classe: "1ère",
    subject: "Trigonométrie",
    duration: "4h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Maîtriser les formules trigonométriques",
      "Utiliser les identités remarquables",
      "Résoudre des équations trigonométriques",
      "Simplifier des expressions",
    ],
    prerequisites: [
      "Connaître le cercle trigonométrique",
      "Maîtriser les angles",
    ],
  },
  43: {
    id: 43,
    title: "Limites et Continuité",
    description: "Notions de limite et continuité",
    level: "Lycée",
    classe: "1ère",
    subject: "Analyse",
    duration: "4h30",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre la notion de limite",
      "Calculer des limites",
      "Étudier la continuité",
      "Utiliser les théorèmes",
    ],
    prerequisites: [
      "Maîtriser les fonctions",
      "Connaître les asymptotes",
    ],
  },
  44: {
    id: 44,
    title: "Primitives",
    description: "Calcul de primitives et applications",
    level: "Lycée",
    classe: "1ère",
    subject: "Analyse",
    duration: "4h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre la notion de primitive",
      "Calculer des primitives usuelles",
      "Utiliser les techniques d'intégration",
      "Résoudre des problèmes",
    ],
    prerequisites: [
      "Maîtriser la dérivation",
      "Connaître les fonctions usuelles",
    ],
  },
  45: {
    id: 45,
    title: "Transformations du plan",
    description: "Translations, rotations, homothéties et symétries",
    level: "Lycée",
    classe: "1ère",
    subject: "Géométrie",
    duration: "4h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre les transformations",
      "Construire des images",
      "Utiliser les propriétés",
      "Résoudre des problèmes géométriques",
    ],
    prerequisites: [
      "Maîtriser la géométrie plane",
      "Connaître les vecteurs",
    ],
  },

  // Terminale
  19: {
    id: 19,
    title: "Calcul intégral",
    description: "Calcul d'intégrales et applications",
    level: "Lycée",
    classe: "Terminale",
    subject: "Analyse",
    duration: "5h30",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre le concept d'intégrale",
      "Calculer des primitives",
      "Calculer des intégrales définies",
      "Calculer des aires",
    ],
    prerequisites: [
      "Maîtriser la dérivation",
      "Connaître les fonctions usuelles",
    ],
  },
  20: {
    id: 20,
    title: "Nombres complexes",
    description: "Opérations et applications géométriques",
    level: "Lycée",
    classe: "Terminale",
    subject: "Algèbre",
    duration: "4h45",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre les nombres complexes",
      "Effectuer des opérations sur les complexes",
      "Utiliser la forme exponentielle",
      "Résoudre des équations",
    ],
    prerequisites: [
      "Connaître les nombres réels",
      "Maîtriser la trigonométrie",
    ],
  },
  21: {
    id: 21,
    title: "Logarithmes",
    description: "Fonctions logarithmiques et exponentielles",
    level: "Lycée",
    classe: "Terminale",
    subject: "Analyse",
    duration: "3h50",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre la fonction logarithme",
      "Utiliser les propriétés algébriques",
      "Résoudre des équations logarithmiques",
      "Étudier la fonction exponentielle",
    ],
    prerequisites: [
      "Maîtriser les fonctions",
      "Connaître les exponentielles",
    ],
  },
  46: {
    id: 46,
    title: "Arithmétique",
    description: "Divisibilité, nombres premiers et congruences",
    level: "Lycée",
    classe: "Terminale",
    subject: "Arithmétique",
    duration: "4h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre la divisibilité",
      "Utiliser les nombres premiers",
      "Maîtriser les congruences",
      "Résoudre des problèmes arithmétiques",
    ],
    prerequisites: [
      "Maîtriser les opérations",
      "Connaître les nombres entiers",
    ],
  },
  47: {
    id: 47,
    title: "Dérivation TS1",
    description: "Dérivation approfondie pour Terminale S1",
    level: "Lycée",
    classe: "Terminale",
    subject: "Analyse",
    duration: "5h30",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Maîtriser les techniques de dérivation",
      "Étudier les fonctions composées",
      "Utiliser les dérivées successives",
      "Résoudre des problèmes d'optimisation",
    ],
    prerequisites: [
      "Maîtriser la dérivation de base",
      "Connaître les fonctions usuelles",
    ],
  },
  48: {
    id: 48,
    title: "Équations différentielles",
    description: "Résolution d'équations différentielles",
    level: "Lycée",
    classe: "Terminale",
    subject: "Analyse",
    duration: "5h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre les équations différentielles",
      "Résoudre des équations du premier ordre",
      "Résoudre des équations linéaires",
      "Appliquer aux problèmes physiques",
    ],
    prerequisites: [
      "Maîtriser l'intégration",
      "Connaître les exponentielles",
    ],
  },
  49: {
    id: 49,
    title: "Fonctions exponentielles et logarithmes (TS1)",
    description: "Étude approfondie des fonctions exponentielles et logarithmes",
    level: "Lycée",
    classe: "Terminale",
    subject: "Analyse",
    duration: "4h30",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Étudier les fonctions exponentielles",
      "Étudier les fonctions logarithmes",
      "Résoudre des équations",
      "Appliquer aux problèmes",
    ],
    prerequisites: [
      "Connaître les fonctions exponentielles de base",
      "Maîtriser la dérivation",
    ],
  },
  50: {
    id: 50,
    title: "Limites et continuité",
    description: "Notions avancées de limite et continuité",
    level: "Lycée",
    classe: "Terminale",
    subject: "Analyse",
    duration: "4h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Maîtriser le calcul de limites",
      "Étudier la continuité",
      "Utiliser les théorèmes",
      "Résoudre des problèmes",
    ],
    prerequisites: [
      "Connaître les limites de base",
      "Maîtriser les fonctions",
    ],
  },
  51: {
    id: 51,
    title: "Suites TS1",
    description: "Suites numériques pour Terminale S1",
    level: "Lycée",
    classe: "Terminale",
    subject: "Analyse",
    duration: "5h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Étudier les suites récurrentes",
      "Déterminer la convergence",
      "Calculer des limites de suites",
      "Résoudre des problèmes",
    ],
    prerequisites: [
      "Maîtriser les suites de base",
      "Connaître les limites",
    ],
  },
  52: {
    id: 52,
    title: "Fonctions numériques",
    description: "Étude approfondie des fonctions numériques",
    level: "Lycée",
    classe: "Terminale",
    subject: "Analyse",
    duration: "5h30",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Étudier les fonctions complexes",
      "Utiliser les dérivées",
      "Déterminer les asymptotes",
      "Résoudre des problèmes",
    ],
    prerequisites: [
      "Maîtriser la dérivation",
      "Connaître les limites",
    ],
  },
  53: {
    id: 53,
    title: "Nombres complexes et similitudes",
    description: "Nombres complexes et transformations géométriques",
    level: "Lycée",
    classe: "Terminale",
    subject: "Géométrie",
    duration: "5h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Utiliser les complexes en géométrie",
      "Comprendre les similitudes",
      "Appliquer les transformations",
      "Résoudre des problèmes",
    ],
    prerequisites: [
      "Maîtriser les nombres complexes",
      "Connaître les transformations",
    ],
  },
  54: {
    id: 54,
    title: "Statistiques",
    description: "Statistiques et probabilités avancées",
    level: "Lycée",
    classe: "Terminale",
    subject: "Statistiques",
    duration: "4h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Calculer des indicateurs statistiques",
      "Utiliser les lois de probabilité",
      "Interpréter des données",
      "Résoudre des problèmes",
    ],
    prerequisites: [
      "Connaître les bases des statistiques",
      "Maîtriser les probabilités",
    ],
  },

  // Licence
  22: {
    id: 22,
    title: "Analyse réelle",
    description: "Suites et séries de fonctions",
    level: "Supérieur",
    classe: "Licence",
    subject: "Analyse",
    duration: "6h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Étudier la convergence de suites",
      "Étudier les séries numériques",
      "Appliquer les critères de convergence",
      "Étudier les suites de fonctions",
    ],
    prerequisites: [
      "Maîtriser l'analyse de Terminale",
      "Connaître les limites et la continuité",
    ],
  },
  23: {
    id: 23,
    title: "Algèbre linéaire",
    description: "Espaces vectoriels et applications linéaires",
    level: "Supérieur",
    classe: "Licence",
    subject: "Algèbre",
    duration: "7h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre les espaces vectoriels",
      "Étudier les applications linéaires",
      "Manipuler les matrices",
      "Diagonaliser des matrices",
    ],
    prerequisites: [
      "Maîtriser les vecteurs",
      "Connaître les systèmes linéaires",
    ],
  },
  24: {
    id: 24,
    title: "Probabilités",
    description: "Lois continues et théorèmes limites",
    level: "Supérieur",
    classe: "Licence",
    subject: "Probabilités",
    duration: "5h15",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Étudier les lois continues",
      "Comprendre la loi normale",
      "Appliquer le théorème central limite",
      "Construire des intervalles de confiance",
    ],
    prerequisites: [
      "Maîtriser les probabilités de Terminale",
      "Connaître les intégrales",
    ],
  },

  // Master
  25: {
    id: 25,
    title: "Analyse fonctionnelle",
    description: "Espaces de Hilbert et opérateurs",
    level: "Supérieur",
    classe: "Master",
    subject: "Analyse",
    duration: "8h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre les espaces de Banach",
      "Étudier les espaces de Hilbert",
      "Analyser les opérateurs linéaires",
      "Appliquer les théorèmes fondamentaux",
    ],
    prerequisites: [
      "Maîtriser l'analyse réelle",
      "Connaître la topologie",
    ],
  },
  26: {
    id: 26,
    title: "Géométrie différentielle",
    description: "Variétés différentielles et formes différentielles",
    level: "Supérieur",
    classe: "Master",
    subject: "Géométrie",
    duration: "7h30",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre les variétés différentielles",
      "Manipuler les formes différentielles",
      "Étudier les connexions",
      "Calculer la courbure",
    ],
    prerequisites: [
      "Maîtriser l'algèbre linéaire avancée",
      "Connaître la topologie",
    ],
  },
  27: {
    id: 27,
    title: "Équations aux dérivées partielles",
    description: "Méthodes de résolution et applications",
    level: "Supérieur",
    classe: "Master",
    subject: "Analyse",
    duration: "9h",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Classifier les EDP",
      "Résoudre l'équation de la chaleur",
      "Résoudre l'équation des ondes",
      "Étudier l'équation de Laplace",
    ],
    prerequisites: [
      "Maîtriser l'analyse fonctionnelle",
      "Connaître les distributions",
    ],
  },

  // Prépa
  28: {
    id: 28,
    title: "Topologie",
    description: "Espaces métriques et topologiques",
    level: "Supérieur",
    classe: "Prépa",
    subject: "Topologie",
    duration: "6h45",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Comprendre les espaces métriques",
      "Étudier les ouverts et fermés",
      "Analyser la compacité",
      "Étudier la connexité",
    ],
    prerequisites: [
      "Maîtriser l'analyse réelle",
      "Connaître les suites et séries",
    ],
  },
  29: {
    id: 29,
    title: "Réduction des endomorphismes",
    description: "Diagonalisation et trigonalisation",
    level: "Supérieur",
    classe: "Prépa",
    subject: "Algèbre",
    duration: "7h15",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Calculer valeurs et vecteurs propres",
      "Diagonaliser des matrices",
      "Trigonaliser des endomorphismes",
      "Utiliser le polynôme minimal",
    ],
    prerequisites: [
      "Maîtriser l'algèbre linéaire",
      "Connaître les polynômes",
    ],
  },
  30: {
    id: 30,
    title: "Intégrales multiples",
    description: "Calcul d'intégrales doubles et triples",
    level: "Supérieur",
    classe: "Prépa",
    subject: "Analyse",
    duration: "5h45",
    image: "/placeholder.svg?height=200&width=400",
    objectives: [
      "Calculer des intégrales doubles",
      "Calculer des intégrales triples",
      "Effectuer des changements de variables",
      "Utiliser les coordonnées polaires et sphériques",
    ],
    prerequisites: [
      "Maîtriser l'intégration",
      "Connaître les fonctions de plusieurs variables",
    ],
  },
}

const determineLevelFromClasse = (classe: string): string => {
  if (["6ème", "5ème", "4ème", "3ème"].includes(classe)) {
    return "Collège"
  }
  if (["2nde", "1ère", "Terminale"].includes(classe)) {
    return "Lycée"
  }
  return "Supérieur"
}

const inferSubjectFromTitle = (title: string): string => {
  const lower = title.toLowerCase()
  if (lower.includes("algèbre") || lower.includes("algebre") || lower.includes("polyn")) {
    return "Algèbre"
  }
  if (lower.includes("géométrie") || lower.includes("geometrie") || lower.includes("triangle") || lower.includes("cercle")) {
    return "Géométrie"
  }
  if (lower.includes("probabil") || lower.includes("statist")) {
    return "Probabilités"
  }
  if (lower.includes("fonction") || lower.includes("analyse") || lower.includes("dériv")) {
    return "Analyse"
  }
  if (lower.includes("topologie")) {
    return "Topologie"
  }
  if (lower.includes("trigonom")) {
    return "Trigonométrie"
  }
  return "Mathématiques"
}

const buildObjectivesFromEnriched = (course: EnrichedCourse): string[] => {
  if (course.highlights && course.highlights.length > 0) {
    return course.highlights
  }
  return [
    `Comprendre les notions essentielles de ${course.title.toLowerCase()}`,
    "S'entraîner avec des exemples progressifs",
    "Relier les concepts à des situations concrètes",
  ]
}

const buildPrerequisitesFromClasse = (classe: string): string[] => {
  if (["2nde", "1ère", "Terminale"].includes(classe)) {
    return ["Bases solides du collège", "Maîtrise des opérations algébriques"]
  }
  if (["Licence", "Master", "Prépa"].includes(classe)) {
    return ["Connaissances avancées du lycée", "À l'aise avec les démonstrations"]
  }
  return ["Savoir manipuler les nombres", "Avoir suivi le début du programme de la classe"]
}

for (const [classe, courses] of Object.entries(enrichedCourses)) {
  courses.forEach((course) => {
    if (staticCoursesData[course.id]) {
      return
    }

    staticCoursesData[course.id] = {
      id: course.id,
      title: course.title,
      description: course.description,
      level: determineLevelFromClasse(classe),
      classe,
      subject: inferSubjectFromTitle(course.title),
      duration: course.duration || "2h",
      image: "/images/math-blackboard.png",
      objectives: buildObjectivesFromEnriched(course),
      prerequisites: buildPrerequisitesFromClasse(classe),
    }
  })
}

/**
 * Récupère un cours statique par son ID
 */
export function getStaticCourseById(courseId: number): StaticCourse | null {
  return staticCoursesData[courseId] || null
}

/**
 * Récupère tous les cours statiques
 */
export function getAllStaticCourses(): StaticCourse[] {
  return Object.values(staticCoursesData)
}

/**
 * Récupère les cours statiques par classe
 */
export function getStaticCoursesByClasse(classe: string): StaticCourse[] {
  return Object.values(staticCoursesData).filter(course => course.classe === classe)
}
