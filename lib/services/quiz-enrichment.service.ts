import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"

// Structure d'une question de quiz
export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number // Index de la bonne réponse (0-3)
  explanation: string
  points: number
}

// Contenu enrichi pour tous les quiz (IDs 1-9)
const enrichedQuizData: { [key: number]: QuizQuestion[] } = {
  // Quiz 1: Nombres et calculs (Collège - Facile)
  1: [
    {
      id: 1,
      question: "Combien fait 12 + 18 ?",
      options: ["28", "30", "32", "26"],
      correctAnswer: 1,
      explanation: "12 + 18 = 30. On peut décomposer : 12 + 18 = 10 + 20 = 30",
      points: 1
    },
    {
      id: 2,
      question: "Quelle est la valeur de 7 × 8 ?",
      options: ["54", "56", "58", "52"],
      correctAnswer: 1,
      explanation: "7 × 8 = 56. C'est une table de multiplication classique à mémoriser.",
      points: 1
    },
    {
      id: 3,
      question: "Combien fait 100 - 37 ?",
      options: ["63", "73", "67", "57"],
      correctAnswer: 0,
      explanation: "100 - 37 = 63. On peut faire : 100 - 30 - 7 = 70 - 7 = 63",
      points: 1
    },
    {
      id: 4,
      question: "Quelle est la moitié de 84 ?",
      options: ["40", "42", "44", "46"],
      correctAnswer: 1,
      explanation: "84 ÷ 2 = 42. On peut décomposer : 80 ÷ 2 + 4 ÷ 2 = 40 + 2 = 42",
      points: 1
    },
    {
      id: 5,
      question: "Combien fait 15 × 4 ?",
      options: ["50", "55", "60", "65"],
      correctAnswer: 2,
      explanation: "15 × 4 = 60. On peut calculer : 15 × 4 = (10 + 5) × 4 = 40 + 20 = 60",
      points: 1
    },
    {
      id: 6,
      question: "Quelle est la valeur de 144 ÷ 12 ?",
      options: ["10", "11", "12", "13"],
      correctAnswer: 2,
      explanation: "144 ÷ 12 = 12. En effet, 12 × 12 = 144",
      points: 1
    },
    {
      id: 7,
      question: "Combien fait 25 + 36 + 15 ?",
      options: ["74", "76", "78", "80"],
      correctAnswer: 1,
      explanation: "25 + 36 + 15 = 76. On peut regrouper : 25 + 15 = 40, puis 40 + 36 = 76",
      points: 1
    },
    {
      id: 8,
      question: "Quelle est la valeur de 9² ?",
      options: ["18", "72", "81", "90"],
      correctAnswer: 2,
      explanation: "9² = 9 × 9 = 81. C'est un carré parfait à connaître.",
      points: 1
    },
    {
      id: 9,
      question: "Combien fait 200 - 156 ?",
      options: ["42", "44", "46", "48"],
      correctAnswer: 1,
      explanation: "200 - 156 = 44. On peut faire : 200 - 150 = 50, puis 50 - 6 = 44",
      points: 1
    },
    {
      id: 10,
      question: "Quelle est la valeur de 17 × 3 ?",
      options: ["48", "51", "54", "57"],
      correctAnswer: 1,
      explanation: "17 × 3 = 51. On peut calculer : (10 + 7) × 3 = 30 + 21 = 51",
      points: 1
    }
  ],

  // Quiz 2: Géométrie plane (Collège - Moyen)
  2: [
    {
      id: 1,
      question: "Combien de côtés a un hexagone ?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 1,
      explanation: "Un hexagone a 6 côtés. Le préfixe 'hexa' signifie 6.",
      points: 1
    },
    {
      id: 2,
      question: "Quel est le périmètre d'un carré de côté 8 cm ?",
      options: ["24 cm", "28 cm", "32 cm", "36 cm"],
      correctAnswer: 2,
      explanation: "Périmètre = 4 × côté = 4 × 8 = 32 cm",
      points: 1
    },
    {
      id: 3,
      question: "Quelle est l'aire d'un rectangle de 12 cm × 5 cm ?",
      options: ["50 cm²", "55 cm²", "60 cm²", "65 cm²"],
      correctAnswer: 2,
      explanation: "Aire = Longueur × largeur = 12 × 5 = 60 cm²",
      points: 1
    },
    {
      id: 4,
      question: "Combien vaut la somme des angles d'un triangle ?",
      options: ["90°", "120°", "180°", "360°"],
      correctAnswer: 2,
      explanation: "La somme des angles d'un triangle est toujours égale à 180°.",
      points: 1
    },
    {
      id: 5,
      question: "Quel est le nom d'un triangle avec 3 côtés égaux ?",
      options: ["Isocèle", "Équilatéral", "Rectangle", "Scalène"],
      correctAnswer: 1,
      explanation: "Un triangle équilatéral a ses 3 côtés de même longueur.",
      points: 1
    }
  ],

  // Quiz 3: Fonctions et dérivées (Lycée - Difficile)
  3: [
    {
      id: 1,
      question: "Quelle est la dérivée de f(x) = x² ?",
      options: ["x", "2x", "x²", "2"],
      correctAnswer: 1,
      explanation: "La dérivée de x² est 2x. C'est une formule de base à connaître.",
      points: 1
    },
    {
      id: 2,
      question: "Quelle est la dérivée de f(x) = 3x³ ?",
      options: ["3x²", "6x²", "9x²", "x³"],
      correctAnswer: 2,
      explanation: "f'(x) = 3 × 3 × x² = 9x². On multiplie le coefficient par l'exposant.",
      points: 1
    },
    {
      id: 3,
      question: "Quelle est la dérivée d'une constante k ?",
      options: ["k", "1", "0", "k-1"],
      correctAnswer: 2,
      explanation: "La dérivée d'une constante est toujours 0.",
      points: 1
    },
    {
      id: 4,
      question: "Si f(x) = 2x + 5, quelle est f'(x) ?",
      options: ["2", "2x", "5", "0"],
      correctAnswer: 0,
      explanation: "La dérivée d'une fonction affine ax + b est a. Donc f'(x) = 2",
      points: 1
    },
    {
      id: 5,
      question: "Quelle est la dérivée de f(x) = x⁴ ?",
      options: ["3x³", "4x³", "x³", "4x⁴"],
      correctAnswer: 1,
      explanation: "f'(x) = 4x³. On applique la formule : (xⁿ)' = n·xⁿ⁻¹",
      points: 1
    }
  ],

  // Quiz 4: Suites numériques (Lycée - Moyen)
  4: [
    {
      id: 1,
      question: "Une suite arithmétique a pour premier terme u₀ = 3 et raison r = 5. Quelle est u₁ ?",
      options: ["5", "8", "15", "3"],
      correctAnswer: 1,
      explanation: "u₁ = u₀ + r = 3 + 5 = 8",
      points: 1
    },
    {
      id: 2,
      question: "Pour la même suite, quelle est u₂ ?",
      options: ["10", "11", "13", "15"],
      correctAnswer: 2,
      explanation: "u₂ = u₁ + r = 8 + 5 = 13",
      points: 1
    },
    {
      id: 3,
      question: "Une suite géométrique a pour premier terme v₀ = 2 et raison q = 3. Quelle est v₁ ?",
      options: ["5", "6", "8", "9"],
      correctAnswer: 1,
      explanation: "v₁ = v₀ × q = 2 × 3 = 6",
      points: 1
    },
    {
      id: 4,
      question: "Pour la même suite géométrique, quelle est v₂ ?",
      options: ["12", "15", "18", "20"],
      correctAnswer: 2,
      explanation: "v₂ = v₁ × q = 6 × 3 = 18",
      points: 1
    },
    {
      id: 5,
      question: "Quelle est la formule du terme général d'une suite arithmétique ?",
      options: ["uₙ = u₀ + n·r", "uₙ = u₀·qⁿ", "uₙ = u₀ + (n-1)·r", "uₙ = u₀·rⁿ"],
      correctAnswer: 0,
      explanation: "Pour une suite arithmétique : uₙ = u₀ + n·r",
      points: 1
    }
  ],

  // Quiz 5: Probabilités (Lycée - Difficile)
  5: [
    {
      id: 1,
      question: "On lance un dé. Quelle est la probabilité d'obtenir un 6 ?",
      options: ["1/2", "1/3", "1/6", "1/12"],
      correctAnswer: 2,
      explanation: "Il y a 6 faces et 1 seule face porte le 6. Donc P = 1/6",
      points: 1
    },
    {
      id: 2,
      question: "On lance une pièce 2 fois. Quelle est la probabilité d'obtenir 2 fois pile ?",
      options: ["1/2", "1/4", "1/8", "1/3"],
      correctAnswer: 1,
      explanation: "P(pile, pile) = 1/2 × 1/2 = 1/4",
      points: 1
    },
    {
      id: 3,
      question: "Dans un sac, il y a 3 boules rouges et 2 boules bleues. Quelle est P(rouge) ?",
      options: ["2/5", "3/5", "1/2", "2/3"],
      correctAnswer: 1,
      explanation: "Il y a 5 boules au total et 3 rouges. Donc P(rouge) = 3/5",
      points: 1
    },
    {
      id: 4,
      question: "Si A et B sont deux événements indépendants avec P(A) = 0,5 et P(B) = 0,4, quelle est P(A ∩ B) ?",
      options: ["0,1", "0,2", "0,3", "0,9"],
      correctAnswer: 1,
      explanation: "Pour des événements indépendants : P(A ∩ B) = P(A) × P(B) = 0,5 × 0,4 = 0,2",
      points: 1
    },
    {
      id: 5,
      question: "Quelle est la somme de toutes les probabilités dans un espace probabilisé ?",
      options: ["0", "0,5", "1", "∞"],
      correctAnswer: 2,
      explanation: "La somme de toutes les probabilités est toujours égale à 1.",
      points: 1
    }
  ],

  // Quiz 6: Préparation Brevet (Collège - Moyen)
  6: [
    {
      id: 1,
      question: "Calculer : 2/3 + 1/3",
      options: ["1", "2/3", "3/6", "1/3"],
      correctAnswer: 0,
      explanation: "2/3 + 1/3 = (2+1)/3 = 3/3 = 1",
      points: 1
    },
    {
      id: 2,
      question: "Résoudre : 2x + 5 = 13",
      options: ["x = 3", "x = 4", "x = 5", "x = 6"],
      correctAnswer: 1,
      explanation: "2x = 13 - 5 = 8, donc x = 8/2 = 4",
      points: 1
    },
    {
      id: 3,
      question: "Dans un triangle rectangle, si les côtés de l'angle droit mesurent 3 cm et 4 cm, quelle est l'hypoténuse ?",
      options: ["5 cm", "6 cm", "7 cm", "8 cm"],
      correctAnswer: 0,
      explanation: "D'après Pythagore : c² = 3² + 4² = 9 + 16 = 25, donc c = 5 cm",
      points: 1
    },
    {
      id: 4,
      question: "Calculer 20% de 150",
      options: ["20", "25", "30", "35"],
      correctAnswer: 2,
      explanation: "20% de 150 = 0,20 × 150 = 30",
      points: 1
    },
    {
      id: 5,
      question: "Quelle est l'image de 3 par la fonction f(x) = 2x - 1 ?",
      options: ["4", "5", "6", "7"],
      correctAnswer: 1,
      explanation: "f(3) = 2×3 - 1 = 6 - 1 = 5",
      points: 1
    }
  ],

  // Quiz 7: Préparation Bac (Lycée - Difficile)
  7: [
    {
      id: 1,
      question: "Quelle est la limite de (1/n) quand n tend vers +∞ ?",
      options: ["0", "1", "+∞", "Pas de limite"],
      correctAnswer: 0,
      explanation: "Quand n tend vers +∞, 1/n tend vers 0",
      points: 1
    },
    {
      id: 2,
      question: "Quelle est la dérivée de ln(x) ?",
      options: ["1/x", "ln(x)", "x", "e^x"],
      correctAnswer: 0,
      explanation: "La dérivée de ln(x) est 1/x",
      points: 1
    },
    {
      id: 3,
      question: "Quelle est la primitive de e^x ?",
      options: ["e^x", "e^x + C", "xe^x", "ln(x)"],
      correctAnswer: 1,
      explanation: "La primitive de e^x est e^x + C (où C est une constante)",
      points: 1
    },
    {
      id: 4,
      question: "Pour z = 1 + i, quel est le module |z| ?",
      options: ["1", "√2", "2", "√3"],
      correctAnswer: 1,
      explanation: "|z| = √(1² + 1²) = √2",
      points: 1
    },
    {
      id: 5,
      question: "Quelle est la valeur de ln(e) ?",
      options: ["0", "1", "e", "2"],
      correctAnswer: 1,
      explanation: "Par définition, ln(e) = 1",
      points: 1
    }
  ],

  // Quiz 8: Prépa Grandes Écoles (Supérieur - Très difficile)
  8: [
    {
      id: 1,
      question: "Quelle est la dimension du noyau d'une application linéaire f : ℝ³ → ℝ² de rang 2 ?",
      options: ["0", "1", "2", "3"],
      correctAnswer: 1,
      explanation: "D'après le théorème du rang : dim(Ker f) = dim(ℝ³) - rg(f) = 3 - 2 = 1",
      points: 1
    },
    {
      id: 2,
      question: "Si une matrice A est diagonalisable avec valeurs propres 1, 2, 3, quelle est trace(A) ?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 3,
      explanation: "La trace est la somme des valeurs propres : 1 + 2 + 3 = 6",
      points: 1
    },
    {
      id: 3,
      question: "Quelle est la convergence de la série Σ(1/n²) ?",
      options: ["Converge", "Diverge", "Semi-converge", "Indéterminé"],
      correctAnswer: 0,
      explanation: "La série Σ(1/n²) converge (série de Riemann avec α = 2 > 1)",
      points: 1
    },
    {
      id: 4,
      question: "Dans ℝ³, combien de vecteurs linéairement indépendants au maximum ?",
      options: ["1", "2", "3", "4"],
      correctAnswer: 2,
      explanation: "La dimension de ℝ³ est 3, donc maximum 3 vecteurs linéairement indépendants",
      points: 1
    },
    {
      id: 5,
      question: "Quelle est la dérivée de arctan(x) ?",
      options: ["1/(1+x²)", "1/(1-x²)", "-1/(1+x²)", "1/√(1-x²)"],
      correctAnswer: 0,
      explanation: "La dérivée de arctan(x) est 1/(1+x²)",
      points: 1
    }
  ],

  // Quiz 9: Algèbre linéaire (Supérieur - Difficile)
  9: [
    {
      id: 1,
      question: "Quelle est la dimension de l'espace vectoriel des polynômes de degré ≤ 3 ?",
      options: ["2", "3", "4", "5"],
      correctAnswer: 2,
      explanation: "Une base est {1, X, X², X³}, donc dim = 4",
      points: 1
    },
    {
      id: 2,
      question: "Si det(A) = 5, quelle est det(2A) pour A matrice 3×3 ?",
      options: ["10", "20", "40", "125"],
      correctAnswer: 2,
      explanation: "det(kA) = k^n × det(A) = 2³ × 5 = 8 × 5 = 40",
      points: 1
    },
    {
      id: 3,
      question: "Une matrice orthogonale A vérifie :",
      options: ["A² = I", "A^T × A = I", "det(A) = 1", "A + A^T = 0"],
      correctAnswer: 1,
      explanation: "Par définition, une matrice orthogonale vérifie A^T × A = I",
      points: 1
    },
    {
      id: 4,
      question: "Si E et F sont des sous-espaces vectoriels avec dim(E) = 3, dim(F) = 2 et dim(E ∩ F) = 1, quelle est dim(E + F) ?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1,
      explanation: "Formule de Grassmann : dim(E + F) = dim(E) + dim(F) - dim(E ∩ F) = 3 + 2 - 1 = 4",
      points: 1
    },
    {
      id: 5,
      question: "Le rang d'une matrice 4×5 est au maximum :",
      options: ["3", "4", "5", "9"],
      correctAnswer: 1,
      explanation: "Le rang est au plus min(4, 5) = 4",
      points: 1
    }
  ]
}

/**
 * Récupère le contenu d'un quiz (PDF ou questions enrichies)
 * @param quizId - ID du quiz (1-9)
 * @param level - Niveau (Collège/Lycée)
 * @param classe - Classe (6ème, 2nde, etc.)
 * @returns Objet contenant hasPDF, pdfUrl (si PDF), et questions (questions enrichies)
 */
export async function getQuizContent(quizId: number, level?: string, classe?: string): Promise<{
  hasPDF: boolean
  pdfUrl?: string
  questions?: QuizQuestion[]
}> {
  try {
    // Convertir level en format attendu
    const levelFormatted = level?.toLowerCase().includes('lycée') || level?.toLowerCase().includes('lycee') 
      ? 'lycee' as const
      : 'college' as const;

    // Construire la requête avec filtres
    let q = query(
      collection(db, "pdfs"),
      where("quizId", "==", quizId),
      where("type", "==", "quiz")
    )

    // Ajouter les filtres level et classe si fournis
    if (level) {
      q = query(q, where("level", "==", levelFormatted))
    }
    if (classe) {
      q = query(q, where("classe", "==", classe))
    }

    q = query(q, orderBy("uploadedAt", "desc"), limit(1))

    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      // PDF trouvé
      const pdfDoc = querySnapshot.docs[0]
      const pdfData = pdfDoc.data()
      
      // Utiliser le chemin public au lieu de Firebase Storage
      const publicPath = pdfData.publicPath

      return {
        hasPDF: true,
        pdfUrl: publicPath, // Ex: /pdfs/college/quiz/6eme/123_quiz.pdf
      }
    }

    // Pas de PDF, retourner les questions enrichies
    const enrichedQuestions = enrichedQuizData[quizId]
    
    return {
      hasPDF: false,
      questions: enrichedQuestions || [],
    }
  } catch (error) {
    console.error("Error fetching quiz content:", error)
    
    // En cas d'erreur, retourner les questions enrichies comme fallback
    const enrichedQuestions = enrichedQuizData[quizId]
    return {
      hasPDF: false,
      questions: enrichedQuestions || [],
    }
  }
}

export { enrichedQuizData }
