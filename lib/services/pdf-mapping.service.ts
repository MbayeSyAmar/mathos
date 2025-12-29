/**
 * Service de mapping entre les exercices et les PDFs disponibles
 * dans le dossier "RESSOURCES MATHOSPHERE"
 */

export interface PDFMapping {
  exerciseId?: number
  exerciseTitle?: string
  pdfPath: string
  pdfName: string
}

// Mapping des exercices du lycée vers les PDFs
// Note: Les noms de classe peuvent varier (1ère vs 1ere), donc on gère les deux
export const lyceePDFMappings: Record<string, PDFMapping[]> = {
  "2nde": [
    {
      exerciseId: 13,
      exerciseTitle: "Calcul dans R",
      pdfPath: "/pdfs/lycee/exercices/2nde/Calcul dans R.pdf",
      pdfName: "Calcul dans R.pdf",
    },
    {
      exerciseId: 22,
      exerciseTitle: "Calcul vectoriel",
      pdfPath: "/pdfs/lycee/exercices/2nde/Calcul vectoriel.pdf",
      pdfName: "Calcul vectoriel.pdf",
    },
    {
      exerciseId: 23,
      exerciseTitle: "Second degrés",
      pdfPath: "/pdfs/lycee/exercices/2nde/Second degrés.pdf",
      pdfName: "Second degrés.pdf",
    },
    {
      exerciseId: 24,
      exerciseTitle: "Barycentre",
      pdfPath: "/pdfs/lycee/exercices/2nde/Barycentre.pdf",
      pdfName: "Barycentre.pdf",
    },
    {
      exerciseId: 25,
      exerciseTitle: "Systemes",
      pdfPath: "/pdfs/lycee/exercices/2nde/systemes.pdf",
      pdfName: "systemes.pdf",
    },
    {
      exerciseId: 26,
      exerciseTitle: "Angles",
      pdfPath: "/pdfs/lycee/exercices/2nde/Angles.pdf",
      pdfName: "Angles.pdf",
    },
    {
      exerciseId: 27,
      exerciseTitle: "Fonctions",
      pdfPath: "/pdfs/lycee/exercices/2nde/Fonctions.pdf",
      pdfName: "Fonctions.pdf",
    },
    {
      exerciseId: 28,
      exerciseTitle: "Polynomes",
      pdfPath: "/pdfs/lycee/exercices/2nde/Polynomes.pdf",
      pdfName: "Polynomes.pdf",
    },
  ],
  "1ère": [
    {
      exerciseId: 16,
      exerciseTitle: "Dérivées",
      pdfPath: "/pdfs/lycee/exercices/1ere/Dérivées.pdf",
      pdfName: "Dérivées.pdf",
    },
    {
      exerciseId: 17,
      exerciseTitle: "Suites numériques",
      pdfPath: "/pdfs/lycee/exercices/1ere/Suites numériques.pdf",
      pdfName: "Suites numériques.pdf",
    },
    {
      exerciseId: 29,
      exerciseTitle: "Angles orienté",
      pdfPath: "/pdfs/lycee/exercices/1ere/Angles orienté.pdf",
      pdfName: "Angles orienté.pdf",
    },
    {
      exerciseId: 30,
      exerciseTitle: "Dénombrement",
      pdfPath: "/pdfs/lycee/exercices/1ere/Dénombrement.pdf",
      pdfName: "Dénombrement.pdf",
    },
    {
      exerciseId: 32,
      exerciseTitle: "Équations, inéquations et systèmes",
      pdfPath: "/pdfs/lycee/exercices/1ere/Equations, inéquations et systèmes.pdf",
      pdfName: "Equations, inéquations et systèmes.pdf",
    },
    {
      exerciseId: 33,
      exerciseTitle: "Fonctions",
      pdfPath: "/pdfs/lycee/exercices/1ere/Fonctions.pdf",
      pdfName: "Fonctions.pdf",
    },
    {
      exerciseId: 34,
      exerciseTitle: "Identités et relations trigonométriques",
      pdfPath: "/pdfs/lycee/exercices/1ere/Identités et relations trigonométriques.pdf",
      pdfName: "Identités et relations trigonométriques.pdf",
    },
    {
      exerciseId: 35,
      exerciseTitle: "Limites et Continuité",
      pdfPath: "/pdfs/lycee/exercices/1ere/Limites et Continuité.pdf",
      pdfName: "Limites et Continuité.pdf",
    },
    {
      exerciseId: 36,
      exerciseTitle: "Primitives",
      pdfPath: "/pdfs/lycee/exercices/1ere/Primitives.pdf",
      pdfName: "Primitives.pdf",
    },
    {
      exerciseId: 38,
      exerciseTitle: "Transformations du plan",
      pdfPath: "/pdfs/lycee/exercices/1ere/Transformations du plan.pdf",
      pdfName: "Transformations du plan.pdf",
    },
  ],
  "1ere": [
    {
      exerciseId: 16,
      exerciseTitle: "Dérivées",
      pdfPath: "/pdfs/lycee/exercices/1ere/Dérivées.pdf",
      pdfName: "Dérivées.pdf",
    },
    {
      exerciseId: 17,
      exerciseTitle: "Suites numériques",
      pdfPath: "/pdfs/lycee/exercices/1ere/Suites numériques.pdf",
      pdfName: "Suites numériques.pdf",
    },
    {
      exerciseId: 29,
      exerciseTitle: "Angles orienté",
      pdfPath: "/pdfs/lycee/exercices/1ere/Angles orienté.pdf",
      pdfName: "Angles orienté.pdf",
    },
    {
      exerciseId: 30,
      exerciseTitle: "Dénombrement",
      pdfPath: "/pdfs/lycee/exercices/1ere/Dénombrement.pdf",
      pdfName: "Dénombrement.pdf",
    },
    {
      exerciseId: 32,
      exerciseTitle: "Équations, inéquations et systèmes",
      pdfPath: "/pdfs/lycee/exercices/1ere/Equations, inéquations et systèmes.pdf",
      pdfName: "Equations, inéquations et systèmes.pdf",
    },
    {
      exerciseId: 33,
      exerciseTitle: "Fonctions",
      pdfPath: "/pdfs/lycee/exercices/1ere/Fonctions.pdf",
      pdfName: "Fonctions.pdf",
    },
    {
      exerciseId: 34,
      exerciseTitle: "Identités et relations trigonométriques",
      pdfPath: "/pdfs/lycee/exercices/1ere/Identités et relations trigonométriques.pdf",
      pdfName: "Identités et relations trigonométriques.pdf",
    },
    {
      exerciseId: 35,
      exerciseTitle: "Limites et Continuité",
      pdfPath: "/pdfs/lycee/exercices/1ere/Limites et Continuité.pdf",
      pdfName: "Limites et Continuité.pdf",
    },
    {
      exerciseId: 36,
      exerciseTitle: "Primitives",
      pdfPath: "/pdfs/lycee/exercices/1ere/Primitives.pdf",
      pdfName: "Primitives.pdf",
    },
    {
      exerciseId: 38,
      exerciseTitle: "Transformations du plan",
      pdfPath: "/pdfs/lycee/exercices/1ere/Transformations du plan.pdf",
      pdfName: "Transformations du plan.pdf",
    },
  ],
  Terminale: [
    // TS1
    {
      exerciseId: 19,
      exerciseTitle: "Calcul intégral",
      pdfPath: "/pdfs/lycee/exercices/terminale/calcul_integral.pdf",
      pdfName: "calcul_integral.pdf",
    },
    {
      exerciseId: 20,
      exerciseTitle: "Nombres complexes",
      pdfPath: "/pdfs/lycee/exercices/terminale/Nombre_complexe.pdf",
      pdfName: "Nombre_complexe.pdf",
    },
    {
      exerciseId: 18,
      exerciseTitle: "Probabilités",
      pdfPath: "/pdfs/lycee/exercices/terminale/Probabilités.pdf",
      pdfName: "Probabilités.pdf",
    },
    {
      exerciseId: 39,
      exerciseTitle: "Arithmétique",
      pdfPath: "/pdfs/lycee/exercices/terminale/Arithmetique.pdf",
      pdfName: "Arithmetique.pdf",
    },
    {
      exerciseId: 40,
      exerciseTitle: "Calcul intégral",
      pdfPath: "/pdfs/lycee/exercices/terminale/calcul_integral.pdf",
      pdfName: "calcul_integral.pdf",
    },
    {
      exerciseId: 41,
      exerciseTitle: "Dérivation TS1",
      pdfPath: "/pdfs/lycee/exercices/terminale/DERIVATION_TS1.pdf",
      pdfName: "DERIVATION_TS1.pdf",
    },
    {
      exerciseId: 42,
      exerciseTitle: "Équations différentielles",
      pdfPath: "/pdfs/lycee/exercices/terminale/equations_differentielles.pdf",
      pdfName: "equations_differentielles.pdf",
    },
    {
      exerciseId: 43,
      exerciseTitle: "Fonctions exponentielles et logarithmes (TS1)",
      pdfPath: "/pdfs/lycee/exercices/terminale/FONCTIONS_EXPO_LN_TS1.pdf",
      pdfName: "FONCTIONS_EXPO_LN_TS1.pdf",
    },
    {
      exerciseId: 44,
      exerciseTitle: "Limites et continuité",
      pdfPath: "/pdfs/lycee/exercices/terminale/Limites_et_continuité.pdf",
      pdfName: "Limites_et_continuité.pdf",
    },
    {
      exerciseId: 45,
      exerciseTitle: "Nombres complexes",
      pdfPath: "/pdfs/lycee/exercices/terminale/Nombre_complexe.pdf",
      pdfName: "Nombre_complexe.pdf",
    },
    {
      exerciseId: 46,
      exerciseTitle: "Probabilités",
      pdfPath: "/pdfs/lycee/exercices/terminale/Probabilités.pdf",
      pdfName: "Probabilités.pdf",
    },
    {
      exerciseId: 47,
      exerciseTitle: "Suites TS1",
      pdfPath: "/pdfs/lycee/exercices/terminale/Suites_ts1.pdf",
      pdfName: "Suites_ts1.pdf",
    },
    // TS2
    {
      exerciseId: 48,
      exerciseTitle: "Calcul intégral",
      pdfPath: "/pdfs/lycee/exercices/terminale/CALCUL INTEGRAL.pdf",
      pdfName: "CALCUL INTEGRAL.pdf",
    },
    {
      exerciseId: 49,
      exerciseTitle: "Équations différentielles",
      pdfPath: "/pdfs/lycee/exercices/terminale/EQUATIONS DIFFERENTIELLES.pdf",
      pdfName: "EQUATIONS DIFFERENTIELLES.pdf",
    },
    {
      exerciseId: 50,
      exerciseTitle: "Fonctions numériques",
      pdfPath: "/pdfs/lycee/exercices/terminale/FONCTIONS NUMERIQUES.pdf",
      pdfName: "FONCTIONS NUMERIQUES.pdf",
    },
    {
      exerciseId: 51,
      exerciseTitle: "Nombres complexes et similitudes",
      pdfPath: "/pdfs/lycee/exercices/terminale/NOMBRES COMPLEXES ET SIMILITUDES.pdf",
      pdfName: "NOMBRES COMPLEXES ET SIMILITUDES.pdf",
    },
    {
      exerciseId: 52,
      exerciseTitle: "Probabilités",
      pdfPath: "/pdfs/lycee/exercices/terminale/PROBABLITES.pdf",
      pdfName: "PROBABLITES.pdf",
    },
    {
      exerciseId: 53,
      exerciseTitle: "Statistiques",
      pdfPath: "/pdfs/lycee/exercices/terminale/STATISTIQUES.pdf",
      pdfName: "STATISTIQUES.pdf",
    },
    {
      exerciseId: 54,
      exerciseTitle: "Suites numériques",
      pdfPath: "/pdfs/lycee/exercices/terminale/SUITES NUMERIQUES.pdf",
      pdfName: "SUITES NUMERIQUES.pdf",
    },
    // Note: "Problème de synthèse" - PDF à vérifier/ajouter dans RESSOURCES MATHOSPHERE/Exercice TS2/
    // {
    //   exerciseTitle: "Problème de synthèse",
    //   pdfPath: "/pdfs/lycee/exercices/terminale/PROBLEME_SYNTHESE.pdf",
    //   pdfName: "PROBLEME_SYNTHESE.pdf",
    // },
  ],
  "Terminale S1": [
    {
      exerciseId: 19,
      exerciseTitle: "Calcul intégral",
      pdfPath: "/pdfs/lycee/exercices/terminale/calcul_integral.pdf",
      pdfName: "calcul_integral.pdf",
    },
    {
      exerciseId: 20,
      exerciseTitle: "Nombres complexes",
      pdfPath: "/pdfs/lycee/exercices/terminale/Nombre_complexe.pdf",
      pdfName: "Nombre_complexe.pdf",
    },
    {
      exerciseId: 18,
      exerciseTitle: "Probabilités",
      pdfPath: "/pdfs/lycee/exercices/terminale/Probabilités.pdf",
      pdfName: "Probabilités.pdf",
    },
    {
      exerciseId: 39,
      exerciseTitle: "Arithmétique",
      pdfPath: "/pdfs/lycee/exercices/terminale/Arithmetique.pdf",
      pdfName: "Arithmetique.pdf",
    },
    {
      exerciseId: 41,
      exerciseTitle: "Dérivation TS1",
      pdfPath: "/pdfs/lycee/exercices/terminale/DERIVATION_TS1.pdf",
      pdfName: "DERIVATION_TS1.pdf",
    },
    {
      exerciseId: 42,
      exerciseTitle: "Équations différentielles",
      pdfPath: "/pdfs/lycee/exercices/terminale/equations_differentielles.pdf",
      pdfName: "equations_differentielles.pdf",
    },
    {
      exerciseId: 43,
      exerciseTitle: "Fonctions exponentielles et logarithmes (TS1)",
      pdfPath: "/pdfs/lycee/exercices/terminale/FONCTIONS_EXPO_LN_TS1.pdf",
      pdfName: "FONCTIONS_EXPO_LN_TS1.pdf",
    },
    {
      exerciseId: 44,
      exerciseTitle: "Limites et continuité",
      pdfPath: "/pdfs/lycee/exercices/terminale/Limites_et_continuité.pdf",
      pdfName: "Limites_et_continuité.pdf",
    },
    {
      exerciseId: 47,
      exerciseTitle: "Suites TS1",
      pdfPath: "/pdfs/lycee/exercices/terminale/Suites_ts1.pdf",
      pdfName: "Suites_ts1.pdf",
    },
  ],
  "Terminale S2": [
    {
      exerciseId: 48,
      exerciseTitle: "Calcul intégral",
      pdfPath: "/pdfs/lycee/exercices/terminale/CALCUL INTEGRAL.pdf",
      pdfName: "CALCUL INTEGRAL.pdf",
    },
    {
      exerciseId: 49,
      exerciseTitle: "Équations différentielles",
      pdfPath: "/pdfs/lycee/exercices/terminale/EQUATIONS DIFFERENTIELLES.pdf",
      pdfName: "EQUATIONS DIFFERENTIELLES.pdf",
    },
    {
      exerciseId: 50,
      exerciseTitle: "Fonctions numériques",
      pdfPath: "/pdfs/lycee/exercices/terminale/FONCTIONS NUMERIQUES.pdf",
      pdfName: "FONCTIONS NUMERIQUES.pdf",
    },
    {
      exerciseId: 51,
      exerciseTitle: "Nombres complexes et similitudes",
      pdfPath: "/pdfs/lycee/exercices/terminale/NOMBRES COMPLEXES ET SIMILITUDES.pdf",
      pdfName: "NOMBRES COMPLEXES ET SIMILITUDES.pdf",
    },
    {
      exerciseId: 52,
      exerciseTitle: "Probabilités",
      pdfPath: "/pdfs/lycee/exercices/terminale/PROBABLITES.pdf",
      pdfName: "PROBABLITES.pdf",
    },
    {
      exerciseId: 53,
      exerciseTitle: "Statistiques",
      pdfPath: "/pdfs/lycee/exercices/terminale/STATISTIQUES.pdf",
      pdfName: "STATISTIQUES.pdf",
    },
    {
      exerciseId: 54,
      exerciseTitle: "Suites numériques",
      pdfPath: "/pdfs/lycee/exercices/terminale/SUITES NUMERIQUES.pdf",
      pdfName: "SUITES NUMERIQUES.pdf",
    },
    // Note: "Problème de synthèse" - PDF à vérifier/ajouter dans RESSOURCES MATHOSPHERE/Exercice TS2/
    // {
    //   exerciseTitle: "Problème de synthèse",
    //   pdfPath: "/pdfs/lycee/exercices/terminale/PROBLEME_SYNTHESE.pdf",
    //   pdfName: "PROBLEME_SYNTHESE.pdf",
    // },
  ],
}

/**
 * Récupère le chemin du PDF pour un exercice donné
 */
export function getPDFForExercise(exerciseId: number, classe: string, exerciseTitle?: string): string | null {
  console.log(`[getPDFForExercise] Searching for exercise: ID=${exerciseId}, classe="${classe}", title="${exerciseTitle}"`)
  
  // Normaliser le nom de la classe (1ère et 1ere sont équivalents)
  let normalizedClasse = classe === "1ère" || classe === "1ere" ? "1ère" : classe
  
  // Gérer les variantes de Terminale
  if (classe.includes("Terminale") || classe.includes("Term")) {
    if (classe.includes("S1") || classe.includes("s1")) {
      normalizedClasse = "Terminale S1"
    } else if (classe.includes("S2") || classe.includes("s2")) {
      normalizedClasse = "Terminale S2"
    } else {
      normalizedClasse = "Terminale"
    }
  }
  
  console.log(`[getPDFForExercise] Normalized classe: "${normalizedClasse}"`)
  
  // Essayer avec le nom normalisé, puis avec le nom original
  let mappings = lyceePDFMappings[normalizedClasse] || lyceePDFMappings[classe] || []
  
  // Si c'est Terminale, combiner les mappings de Terminale, Terminale S1 et Terminale S2
  if (classe.includes("Terminale") || classe.includes("Term") || normalizedClasse.includes("Terminale")) {
    const allTerminaleMappings = [
      ...(lyceePDFMappings["Terminale"] || []),
      ...(lyceePDFMappings["Terminale S1"] || []),
      ...(lyceePDFMappings["Terminale S2"] || [])
    ]
    console.log(`[getPDFForExercise] Found ${allTerminaleMappings.length} Terminale mappings total`)
    // Si on a des mappings spécifiques (S1 ou S2), les utiliser, sinon utiliser tous les mappings Terminale
    if (mappings.length === 0 || normalizedClasse === "Terminale") {
      mappings = allTerminaleMappings
    } else {
      // Combiner les mappings spécifiques avec tous les mappings Terminale pour une recherche plus large
      mappings = [...mappings, ...allTerminaleMappings]
    }
  }
  
  console.log(`[getPDFForExercise] Total mappings to search: ${mappings.length}`)
  
  // D'abord essayer de trouver par ID
  if (exerciseId) {
    const mappingById = mappings.find((m) => m.exerciseId === exerciseId)
    if (mappingById) {
      console.log(`[getPDFForExercise] Found PDF by ID: ${mappingById.pdfPath}`)
      return mappingById.pdfPath
    } else {
      console.log(`[getPDFForExercise] No PDF found by ID ${exerciseId}`)
    }
  }
  
  // Ensuite essayer de trouver par titre si fourni
  if (exerciseTitle) {
    const normalizedTitle = exerciseTitle.trim().toLowerCase()
    // Nettoyer les accents et caractères spéciaux pour la comparaison
    const normalizeString = (str: string) => {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
        .replace(/[^a-z0-9]/g, "") // Garder seulement lettres et chiffres
    }
    
    const mappingByTitle = mappings.find((m) => {
      if (!m.exerciseTitle) return false
      const mappingTitle = m.exerciseTitle.trim()
      const mappingTitleNormalized = normalizeString(mappingTitle)
      const searchTitleNormalized = normalizeString(normalizedTitle)
      
      // Comparaison exacte après normalisation
      if (mappingTitleNormalized === searchTitleNormalized) {
        return true
      }
      
      // Comparaison avec includes (plus flexible)
      if (mappingTitleNormalized.includes(searchTitleNormalized) || 
          searchTitleNormalized.includes(mappingTitleNormalized)) {
        return true
      }
      
      // Comparaison directe insensible à la casse
      if (mappingTitle.toLowerCase() === normalizedTitle) {
        return true
      }
      
      return false
    })
    if (mappingByTitle) {
      console.log(`[getPDFForExercise] Found PDF by title: "${exerciseTitle}" -> "${mappingByTitle.exerciseTitle}"`)
      return mappingByTitle.pdfPath
    }
  }
  
  return null
}

/**
 * Récupère tous les exercices avec PDFs pour une classe donnée
 */
export function getExercisesWithPDFs(classe: string): PDFMapping[] {
  return lyceePDFMappings[classe] || []
}

