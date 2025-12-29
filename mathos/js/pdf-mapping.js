// ============================================
// MAPPING DES PDFs DISPONIBLES
// Association des PDFs du dossier RESSOURCES MATHOSPHERE aux exercices/cours
// ============================================

window.pdfMapping = {
  // Exercices 2nde (Exercice 2nd S)
  exercises: {
    13: { // Fonctions de référence (2nde)
      pdfPath: '../pdfs/exercices/2nde/fonctions.pdf',
      title: 'Fonctions'
    },
    14: { // Vecteurs (2nde)
      pdfPath: '../pdfs/exercices/2nde/calcul-vectoriel.pdf',
      title: 'Calcul vectoriel'
    },
    // Ajouter un exercice pour Angles (2nde)
    '2nde-angles': {
      pdfPath: '../pdfs/exercices/2nde/angles.pdf',
      title: 'Angles'
    },
    '2nde-barycentre': {
      pdfPath: '../pdfs/exercices/2nde/barycentre.pdf',
      title: 'Barycentre'
    },
    '2nde-calcul-r': {
      pdfPath: '../pdfs/exercices/2nde/calcul-dans-r.pdf',
      title: 'Calcul dans R'
    },
    '2nde-polynomes': {
      pdfPath: '../pdfs/exercices/2nde/polynomes.pdf',
      title: 'Polynomes'
    },
    '2nde-second-degre': {
      pdfPath: '../pdfs/exercices/2nde/second-degre.pdf',
      title: 'Second degrés'
    },
    '2nde-systemes': {
      pdfPath: '../pdfs/exercices/2nde/systemes.pdf',
      title: 'Systèmes'
    },
    
    // Exercices 1ère (Exercice 1S1)
    16: { // Dérivation (1ère)
      pdfPath: '../pdfs/exercices/1ere/derivees.pdf',
      title: 'Dérivées'
    },
    17: { // Suites numériques (1ère)
      pdfPath: '../pdfs/exercices/1ere/suites-numeriques.pdf',
      title: 'Suites numériques'
    },
    '1ere-angles-oriente': {
      pdfPath: '../pdfs/exercices/1ere/angles-orientes.pdf',
      title: 'Angles orientés'
    },
    '1ere-denombrement': {
      pdfPath: '../pdfs/exercices/1ere/denombrement.pdf',
      title: 'Dénombrement'
    },
    '1ere-equations': {
      pdfPath: '../pdfs/exercices/1ere/equations-inequations-systemes.pdf',
      title: 'Équations, inéquations et systèmes'
    },
    '1ere-fonctions': {
      pdfPath: '../pdfs/exercices/1ere/fonctions.pdf',
      title: 'Fonctions'
    },
    '1ere-trigonometrie': {
      pdfPath: '../pdfs/exercices/1ere/identites-trigonometriques.pdf',
      title: 'Identités et relations trigonométriques'
    },
    '1ere-limites': {
      pdfPath: '../pdfs/exercices/1ere/limites-continuite.pdf',
      title: 'Limites et Continuité'
    },
    '1ere-primitives': {
      pdfPath: '../pdfs/exercices/1ere/primitives.pdf',
      title: 'Primitives'
    },
    '1ere-transformations': {
      pdfPath: '../pdfs/exercices/1ere/transformations-plan.pdf',
      title: 'Transformations du plan'
    },
    
    // Exercices Terminale S1 (Exercice TS1)
    19: { // Intégration (Terminale)
      pdfPath: '../pdfs/exercices/terminale/calcul-integral.pdf',
      title: 'Calcul intégral'
    },
    20: { // Nombres complexes (Terminale)
      pdfPath: '../pdfs/exercices/terminale/nombres-complexes.pdf',
      title: 'Nombres complexes'
    },
    18: { // Probabilités (Terminale)
      pdfPath: '../pdfs/exercices/terminale/probabilites.pdf',
      title: 'Probabilités'
    },
    'terminale-arithmetique': {
      pdfPath: '../pdfs/exercices/terminale/arithmetique.pdf',
      title: 'Arithmétique'
    },
    'terminale-derivation': {
      pdfPath: '../pdfs/exercices/terminale/derivation.pdf',
      title: 'Dérivation'
    },
    'terminale-equations-diff': {
      pdfPath: '../pdfs/exercices/terminale/equations-differentielles.pdf',
      title: 'Équations différentielles'
    },
    'terminale-expo-ln': {
      pdfPath: '../pdfs/exercices/terminale/fonctions-expo-ln.pdf',
      title: 'Fonctions exponentielles et logarithmes'
    },
    'terminale-limites': {
      pdfPath: '../pdfs/exercices/terminale/limites-continuite.pdf',
      title: 'Limites et continuité'
    },
    'terminale-suites': {
      pdfPath: '../pdfs/exercices/terminale/suites-numeriques.pdf',
      title: 'Suites numériques'
    },
    
    // Exercices Terminale S2 (Exercice TS2)
    'terminale-s2-calcul-integral': {
      pdfPath: '../pdfs/exercices/terminale/calcul-integral-s2.pdf',
      title: 'Calcul intégral'
    },
    'terminale-s2-equations-diff': {
      pdfPath: '../pdfs/exercices/terminale/equations-differentielles-s2.pdf',
      title: 'Équations différentielles'
    },
    'terminale-s2-fonctions': {
      pdfPath: '../pdfs/exercices/terminale/fonctions-numeriques.pdf',
      title: 'Fonctions numériques'
    },
    'terminale-s2-complexes': {
      pdfPath: '../pdfs/exercices/terminale/nombres-complexes-similitudes.pdf',
      title: 'Nombres complexes et similitudes'
    },
    'terminale-s2-probabilites': {
      pdfPath: '../pdfs/exercices/terminale/probabilites-s2.pdf',
      title: 'Probabilités'
    },
    'terminale-s2-synthese': {
      pdfPath: '../pdfs/exercices/terminale/probleme-synthese.pdf',
      title: 'Problème de synthèse'
    },
    'terminale-s2-statistiques': {
      pdfPath: '../pdfs/exercices/terminale/statistiques.pdf',
      title: 'Statistiques'
    },
    'terminale-s2-suites': {
      pdfPath: '../pdfs/exercices/terminale/suites-numeriques-s2.pdf',
      title: 'Suites numériques'
    }
  },
  
  // Cours avec PDFs (si disponibles)
  courses: {
    // Les cours peuvent aussi avoir des PDFs si disponibles
  }
};

// Fonction pour obtenir le chemin PDF d'un exercice
window.getExercisePDF = function(exerciseId) {
  return window.pdfMapping?.exercises?.[exerciseId] || null;
};

// Fonction pour obtenir le chemin PDF d'un cours
window.getCoursePDF = function(courseId) {
  return window.pdfMapping?.courses?.[courseId] || null;
};

