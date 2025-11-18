/**
 * Service de mapping entre les exercices et les PDFs disponibles
 * dans le dossier "RESSOURCES MATHOSPHERE"
 */

export interface PDFMapping {
  exerciseId: number
  pdfPath: string
  pdfName: string
}

// Mapping des exercices du lycée vers les PDFs
// Note: Les noms de classe peuvent varier (1ère vs 1ere), donc on gère les deux
export const lyceePDFMappings: Record<string, PDFMapping[]> = {
  "2nde": [
    {
      exerciseId: 13,
      pdfPath: "/pdfs/lycee/exercices/2nde/Calcul dans R.pdf",
      pdfName: "Calcul dans R.pdf",
    },
    {
      exerciseId: 22,
      pdfPath: "/pdfs/lycee/exercices/2nde/Calcul vectoriel.pdf",
      pdfName: "Calcul vectoriel.pdf",
    },
    {
      exerciseId: 23,
      pdfPath: "/pdfs/lycee/exercices/2nde/Second degrés.pdf",
      pdfName: "Second degrés.pdf",
    },
    {
      exerciseId: 24,
      pdfPath: "/pdfs/lycee/exercices/2nde/Barycentre.pdf",
      pdfName: "Barycentre.pdf",
    },
    {
      exerciseId: 25,
      pdfPath: "/pdfs/lycee/exercices/2nde/systemes.pdf",
      pdfName: "systemes.pdf",
    },
    {
      exerciseId: 26,
      pdfPath: "/pdfs/lycee/exercices/2nde/Angles.pdf",
      pdfName: "Angles.pdf",
    },
    {
      exerciseId: 27,
      pdfPath: "/pdfs/lycee/exercices/2nde/Fonctions.pdf",
      pdfName: "Fonctions.pdf",
    },
    {
      exerciseId: 28,
      pdfPath: "/pdfs/lycee/exercices/2nde/Polynomes.pdf",
      pdfName: "Polynomes.pdf",
    },
  ],
  "1ère": [
    {
      exerciseId: 29,
      pdfPath: "/pdfs/lycee/exercices/1ere/Angles orienté.pdf",
      pdfName: "Angles orienté.pdf",
    },
    {
      exerciseId: 30,
      pdfPath: "/pdfs/lycee/exercices/1ere/Dénombrement.pdf",
      pdfName: "Dénombrement.pdf",
    },
    {
      exerciseId: 31,
      pdfPath: "/pdfs/lycee/exercices/1ere/Dérivées.pdf",
      pdfName: "Dérivées.pdf",
    },
    {
      exerciseId: 32,
      pdfPath: "/pdfs/lycee/exercices/1ere/Equations, inéquations et systèmes.pdf",
      pdfName: "Equations, inéquations et systèmes.pdf",
    },
    {
      exerciseId: 33,
      pdfPath: "/pdfs/lycee/exercices/1ere/Fonctions.pdf",
      pdfName: "Fonctions.pdf",
    },
    {
      exerciseId: 34,
      pdfPath: "/pdfs/lycee/exercices/1ere/Identités et relations trigonométriques.pdf",
      pdfName: "Identités et relations trigonométriques.pdf",
    },
    {
      exerciseId: 35,
      pdfPath: "/pdfs/lycee/exercices/1ere/Limites et Continuité.pdf",
      pdfName: "Limites et Continuité.pdf",
    },
    {
      exerciseId: 36,
      pdfPath: "/pdfs/lycee/exercices/1ere/Primitives.pdf",
      pdfName: "Primitives.pdf",
    },
    {
      exerciseId: 37,
      pdfPath: "/pdfs/lycee/exercices/1ere/Suites numériques.pdf",
      pdfName: "Suites numériques.pdf",
    },
    {
      exerciseId: 38,
      pdfPath: "/pdfs/lycee/exercices/1ere/Transformations du plan.pdf",
      pdfName: "Transformations du plan.pdf",
    },
  ],
  "1ere": [
    {
      exerciseId: 29,
      pdfPath: "/pdfs/lycee/exercices/1ere/Angles orienté.pdf",
      pdfName: "Angles orienté.pdf",
    },
    {
      exerciseId: 30,
      pdfPath: "/pdfs/lycee/exercices/1ere/Dénombrement.pdf",
      pdfName: "Dénombrement.pdf",
    },
    {
      exerciseId: 31,
      pdfPath: "/pdfs/lycee/exercices/1ere/Dérivées.pdf",
      pdfName: "Dérivées.pdf",
    },
    {
      exerciseId: 32,
      pdfPath: "/pdfs/lycee/exercices/1ere/Equations, inéquations et systèmes.pdf",
      pdfName: "Equations, inéquations et systèmes.pdf",
    },
    {
      exerciseId: 33,
      pdfPath: "/pdfs/lycee/exercices/1ere/Fonctions.pdf",
      pdfName: "Fonctions.pdf",
    },
    {
      exerciseId: 34,
      pdfPath: "/pdfs/lycee/exercices/1ere/Identités et relations trigonométriques.pdf",
      pdfName: "Identités et relations trigonométriques.pdf",
    },
    {
      exerciseId: 35,
      pdfPath: "/pdfs/lycee/exercices/1ere/Limites et Continuité.pdf",
      pdfName: "Limites et Continuité.pdf",
    },
    {
      exerciseId: 36,
      pdfPath: "/pdfs/lycee/exercices/1ere/Primitives.pdf",
      pdfName: "Primitives.pdf",
    },
    {
      exerciseId: 37,
      pdfPath: "/pdfs/lycee/exercices/1ere/Suites numériques.pdf",
      pdfName: "Suites numériques.pdf",
    },
    {
      exerciseId: 38,
      pdfPath: "/pdfs/lycee/exercices/1ere/Transformations du plan.pdf",
      pdfName: "Transformations du plan.pdf",
    },
  ],
  Terminale: [
    // TS1
    {
      exerciseId: 39,
      pdfPath: "/pdfs/lycee/exercices/terminale/Arithmetique.pdf",
      pdfName: "Arithmetique.pdf",
    },
    {
      exerciseId: 40,
      pdfPath: "/pdfs/lycee/exercices/terminale/calcul_integral.pdf",
      pdfName: "calcul_integral.pdf",
    },
    {
      exerciseId: 41,
      pdfPath: "/pdfs/lycee/exercices/terminale/DERIVATION_TS1.pdf",
      pdfName: "DERIVATION_TS1.pdf",
    },
    {
      exerciseId: 42,
      pdfPath: "/pdfs/lycee/exercices/terminale/equations_differentielles.pdf",
      pdfName: "equations_differentielles.pdf",
    },
    {
      exerciseId: 43,
      pdfPath: "/pdfs/lycee/exercices/terminale/FONCTIONS_EXPO_LN_TS1.pdf",
      pdfName: "FONCTIONS_EXPO_LN_TS1.pdf",
    },
    {
      exerciseId: 44,
      pdfPath: "/pdfs/lycee/exercices/terminale/Limites_et_continuité.pdf",
      pdfName: "Limites_et_continuité.pdf",
    },
    {
      exerciseId: 45,
      pdfPath: "/pdfs/lycee/exercices/terminale/Nombre_complexe.pdf",
      pdfName: "Nombre_complexe.pdf",
    },
    {
      exerciseId: 46,
      pdfPath: "/pdfs/lycee/exercices/terminale/Probabilités.pdf",
      pdfName: "Probabilités.pdf",
    },
    {
      exerciseId: 47,
      pdfPath: "/pdfs/lycee/exercices/terminale/Suites_ts1.pdf",
      pdfName: "Suites_ts1.pdf",
    },
    // TS2
    {
      exerciseId: 48,
      pdfPath: "/pdfs/lycee/exercices/terminale/CALCUL INTEGRAL.pdf",
      pdfName: "CALCUL INTEGRAL.pdf",
    },
    {
      exerciseId: 49,
      pdfPath: "/pdfs/lycee/exercices/terminale/EQUATIONS DIFFERENTIELLES.pdf",
      pdfName: "EQUATIONS DIFFERENTIELLES.pdf",
    },
    {
      exerciseId: 50,
      pdfPath: "/pdfs/lycee/exercices/terminale/FONCTIONS NUMERIQUES.pdf",
      pdfName: "FONCTIONS NUMERIQUES.pdf",
    },
    {
      exerciseId: 51,
      pdfPath: "/pdfs/lycee/exercices/terminale/NOMBRES COMPLEXES ET SIMILITUDES.pdf",
      pdfName: "NOMBRES COMPLEXES ET SIMILITUDES.pdf",
    },
    {
      exerciseId: 52,
      pdfPath: "/pdfs/lycee/exercices/terminale/PROBABLITES.pdf",
      pdfName: "PROBABLITES.pdf",
    },
    {
      exerciseId: 53,
      pdfPath: "/pdfs/lycee/exercices/terminale/STATISTIQUES.pdf",
      pdfName: "STATISTIQUES.pdf",
    },
    {
      exerciseId: 54,
      pdfPath: "/pdfs/lycee/exercices/terminale/SUITES NUMERIQUES.pdf",
      pdfName: "SUITES NUMERIQUES.pdf",
    },
  ],
}

/**
 * Récupère le chemin du PDF pour un exercice donné
 */
export function getPDFForExercise(exerciseId: number, classe: string): string | null {
  // Normaliser le nom de la classe (1ère et 1ere sont équivalents)
  const normalizedClasse = classe === "1ère" || classe === "1ere" ? "1ère" : classe
  
  // Essayer avec le nom normalisé, puis avec le nom original
  const mappings = lyceePDFMappings[normalizedClasse] || lyceePDFMappings[classe] || []
  const mapping = mappings.find((m) => m.exerciseId === exerciseId)
  return mapping ? mapping.pdfPath : null
}

/**
 * Récupère tous les exercices avec PDFs pour une classe donnée
 */
export function getExercisesWithPDFs(classe: string): PDFMapping[] {
  return lyceePDFMappings[classe] || []
}

