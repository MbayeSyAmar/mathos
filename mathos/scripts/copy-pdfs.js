// ============================================
// SCRIPT POUR COPIER LES PDFs VERS LE DOSSIER PUBLIC
// ============================================

const fs = require('fs');
const path = require('path');

// Chemins source et destination
const sourceDir = path.join(__dirname, '../../RESSOURCES MATHOSPHERE');
const destDir = path.join(__dirname, '../pdf');

// Mapping des dossiers source vers les dossiers destination
const folderMapping = {
  'Exercice 1S1': 'lycee/exercices/1ere',
  'Exercice 2nd S': 'lycee/exercices/2nde',
  'Exercice TS1': 'lycee/exercices/terminale',
  'Exercice TS2': 'lycee/exercices/terminale'
};

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Créé le dossier: ${dirPath}`);
  }
}

function copyFile(sourcePath, destPath) {
  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ Copié: ${path.basename(sourcePath)}`);
    return true;
  } catch (error) {
    console.error(`✗ Erreur lors de la copie de ${sourcePath}:`, error.message);
    return false;
  }
}

function copyPDFs() {
  console.log('📁 Copie des PDFs depuis RESSOURCES MATHOSPHERE...\n');
  
  if (!fs.existsSync(sourceDir)) {
    console.error(`✗ Le dossier source n'existe pas: ${sourceDir}`);
    console.log('💡 Assurez-vous que le dossier "RESSOURCES MATHOSPHERE" existe à la racine du projet.');
    return;
  }

  let totalCopied = 0;
  let totalErrors = 0;

  // Parcourir chaque dossier source
  Object.keys(folderMapping).forEach(sourceFolder => {
    const sourceFolderPath = path.join(sourceDir, sourceFolder);
    const destFolderPath = path.join(destDir, folderMapping[sourceFolder]);

    if (!fs.existsSync(sourceFolderPath)) {
      console.log(`⚠ Dossier source non trouvé: ${sourceFolder}`);
      return;
    }

    // Créer le dossier de destination
    ensureDirectoryExists(destFolderPath);

    // Lire les fichiers du dossier source
    const files = fs.readdirSync(sourceFolderPath);

    files.forEach(file => {
      // Ne copier que les fichiers PDF
      if (path.extname(file).toLowerCase() === '.pdf') {
        const sourceFilePath = path.join(sourceFolderPath, file);
        const destFilePath = path.join(destFolderPath, file);

        if (copyFile(sourceFilePath, destFilePath)) {
          totalCopied++;
        } else {
          totalErrors++;
        }
      }
    });
  });

  console.log(`\n✅ Copie terminée !`);
  console.log(`   - ${totalCopied} fichiers PDF copiés`);
  if (totalErrors > 0) {
    console.log(`   - ${totalErrors} erreurs`);
  }
  console.log(`\n📂 Les PDFs sont maintenant dans: ${destDir}`);
}

// Exécuter le script
copyPDFs();
