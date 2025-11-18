const fs = require('fs');
const path = require('path');

// Mapping des PDFs à copier
const pdfMappings = {
  '2nde': [
    { source: 'RESSOURCES MATHOSPHERE/Exercice 2nd S/Calcul dans R.pdf', dest: 'public/pdfs/lycee/exercices/2nde/Calcul dans R.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 2nd S/Calcul vectoriel.pdf', dest: 'public/pdfs/lycee/exercices/2nde/Calcul vectoriel.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 2nd S/Second degrés.pdf', dest: 'public/pdfs/lycee/exercices/2nde/Second degrés.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 2nd S/Barycentre.pdf', dest: 'public/pdfs/lycee/exercices/2nde/Barycentre.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 2nd S/systemes.pdf', dest: 'public/pdfs/lycee/exercices/2nde/systemes.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 2nd S/Angles.pdf', dest: 'public/pdfs/lycee/exercices/2nde/Angles.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 2nd S/Fonctions.pdf', dest: 'public/pdfs/lycee/exercices/2nde/Fonctions.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 2nd S/Polynomes.pdf', dest: 'public/pdfs/lycee/exercices/2nde/Polynomes.pdf' },
  ],
  '1ere': [
    { source: 'RESSOURCES MATHOSPHERE/Exercice 1S1/Angles orienté.pdf', dest: 'public/pdfs/lycee/exercices/1ere/Angles orienté.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 1S1/Dénombrement.pdf', dest: 'public/pdfs/lycee/exercices/1ere/Dénombrement.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 1S1/Dérivées.pdf', dest: 'public/pdfs/lycee/exercices/1ere/Dérivées.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 1S1/Equations, inéquations et systèmes.pdf', dest: 'public/pdfs/lycee/exercices/1ere/Equations, inéquations et systèmes.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 1S1/Fonctions.pdf', dest: 'public/pdfs/lycee/exercices/1ere/Fonctions.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 1S1/Identités et relations trigonométriques.pdf', dest: 'public/pdfs/lycee/exercices/1ere/Identités et relations trigonométriques.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 1S1/Limites et Continuité.pdf', dest: 'public/pdfs/lycee/exercices/1ere/Limites et Continuité.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 1S1/Primitives.pdf', dest: 'public/pdfs/lycee/exercices/1ere/Primitives.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 1S1/Suites numériques.pdf', dest: 'public/pdfs/lycee/exercices/1ere/Suites numériques.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice 1S1/Transformations du plan.pdf', dest: 'public/pdfs/lycee/exercices/1ere/Transformations du plan.pdf' },
  ],
  'terminale': [
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS1/Arithmetique.pdf', dest: 'public/pdfs/lycee/exercices/terminale/Arithmetique.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS1/calcul_integral.pdf', dest: 'public/pdfs/lycee/exercices/terminale/calcul_integral.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS1/DERIVATION_TS1.pdf', dest: 'public/pdfs/lycee/exercices/terminale/DERIVATION_TS1.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS1/equations_differentielles.pdf', dest: 'public/pdfs/lycee/exercices/terminale/equations_differentielles.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS1/FONCTIONS_EXPO_LN_TS1.pdf', dest: 'public/pdfs/lycee/exercices/terminale/FONCTIONS_EXPO_LN_TS1.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS1/Limites_et_continuité.pdf', dest: 'public/pdfs/lycee/exercices/terminale/Limites_et_continuité.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS1/Nombre_complexe.pdf', dest: 'public/pdfs/lycee/exercices/terminale/Nombre_complexe.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS1/Probabilités.pdf', dest: 'public/pdfs/lycee/exercices/terminale/Probabilités.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS1/Suites_ts1.pdf', dest: 'public/pdfs/lycee/exercices/terminale/Suites_ts1.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS2/CALCUL INTEGRAL.pdf', dest: 'public/pdfs/lycee/exercices/terminale/CALCUL INTEGRAL.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS2/EQUATIONS DIFFERENTIELLES.pdf', dest: 'public/pdfs/lycee/exercices/terminale/EQUATIONS DIFFERENTIELLES.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS2/FONCTIONS NUMERIQUES.pdf', dest: 'public/pdfs/lycee/exercices/terminale/FONCTIONS NUMERIQUES.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS2/NOMBRES COMPLEXES ET SIMILITUDES.pdf', dest: 'public/pdfs/lycee/exercices/terminale/NOMBRES COMPLEXES ET SIMILITUDES.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS2/PROBABLITES.pdf', dest: 'public/pdfs/lycee/exercices/terminale/PROBABLITES.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS2/STATISTIQUES.pdf', dest: 'public/pdfs/lycee/exercices/terminale/STATISTIQUES.pdf' },
    { source: 'RESSOURCES MATHOSPHERE/Exercice TS2/SUITES NUMERIQUES.pdf', dest: 'public/pdfs/lycee/exercices/terminale/SUITES NUMERIQUES.pdf' },
  ],
};

function copyPDFs() {
  const rootDir = process.cwd();
  let copied = 0;
  let errors = 0;

  Object.entries(pdfMappings).forEach(([classe, mappings]) => {
    mappings.forEach(({ source, dest }) => {
      const sourcePath = path.join(rootDir, source);
      const destPath = path.join(rootDir, dest);
      const destDir = path.dirname(destPath);

      try {
        // Créer le dossier de destination s'il n'existe pas
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        // Copier le fichier
        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, destPath);
          console.log(`✓ Copié: ${source} → ${dest}`);
          copied++;
        } else {
          console.error(`✗ Fichier introuvable: ${sourcePath}`);
          errors++;
        }
      } catch (error) {
        console.error(`✗ Erreur lors de la copie de ${source}:`, error.message);
        errors++;
      }
    });
  });

  console.log(`\n✅ Copie terminée: ${copied} fichiers copiés, ${errors} erreurs`);
}

copyPDFs();

