# Script PowerShell pour copier les PDFs vers mathos/pdfs/

$sourceDir = Join-Path $PSScriptRoot "..\..\RESSOURCES MATHOSPHERE"
$targetDir = Join-Path $PSScriptRoot "..\pdfs"

Write-Host "📁 Création de la structure de dossiers..." -ForegroundColor Cyan

# Créer les dossiers nécessaires
$folders = @(
    "exercices\2nde",
    "exercices\1ere",
    "exercices\terminale"
)

foreach ($folder in $folders) {
    $fullPath = Join-Path $targetDir $folder
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "✅ Dossier créé: $folder" -ForegroundColor Green
    }
}

Write-Host "`n📄 Copie des fichiers PDF..." -ForegroundColor Cyan

# Mapping des fichiers
$pdfMapping = @{
    "Exercice 2nd S\Fonctions.pdf" = "exercices\2nde\fonctions.pdf"
    "Exercice 2nd S\Calcul vectoriel.pdf" = "exercices\2nde\calcul-vectoriel.pdf"
    "Exercice 2nd S\Angles.pdf" = "exercices\2nde\angles.pdf"
    "Exercice 2nd S\Barycentre.pdf" = "exercices\2nde\barycentre.pdf"
    "Exercice 2nd S\Calcul dans R.pdf" = "exercices\2nde\calcul-dans-r.pdf"
    "Exercice 2nd S\Polynomes.pdf" = "exercices\2nde\polynomes.pdf"
    "Exercice 2nd S\Second degrés.pdf" = "exercices\2nde\second-degre.pdf"
    "Exercice 2nd S\systemes.pdf" = "exercices\2nde\systemes.pdf"
    
    "Exercice 1S1\Dérivées.pdf" = "exercices\1ere\derivees.pdf"
    "Exercice 1S1\Suites numériques.pdf" = "exercices\1ere\suites-numeriques.pdf"
    "Exercice 1S1\Angles orienté.pdf" = "exercices\1ere\angles-orientes.pdf"
    "Exercice 1S1\Dénombrement.pdf" = "exercices\1ere\denombrement.pdf"
    "Exercice 1S1\Equations, inéquations et systèmes.pdf" = "exercices\1ere\equations-inequations-systemes.pdf"
    "Exercice 1S1\Fonctions.pdf" = "exercices\1ere\fonctions.pdf"
    "Exercice 1S1\Identités et relations trigonométriques.pdf" = "exercices\1ere\identites-trigonometriques.pdf"
    "Exercice 1S1\Limites et Continuité.pdf" = "exercices\1ere\limites-continuite.pdf"
    "Exercice 1S1\Primitives.pdf" = "exercices\1ere\primitives.pdf"
    "Exercice 1S1\Transformations du plan.pdf" = "exercices\1ere\transformations-plan.pdf"
    
    "Exercice TS1\calcul_integral.pdf" = "exercices\terminale\calcul-integral.pdf"
    "Exercice TS1\Nombre_complexe.pdf" = "exercices\terminale\nombres-complexes.pdf"
    "Exercice TS1\Probabilités.pdf" = "exercices\terminale\probabilites.pdf"
    "Exercice TS1\Arithmetique.pdf" = "exercices\terminale\arithmetique.pdf"
    "Exercice TS1\DERIVATION_TS1.pdf" = "exercices\terminale\derivation.pdf"
    "Exercice TS1\equations_differentielles.pdf" = "exercices\terminale\equations-differentielles.pdf"
    "Exercice TS1\FONCTIONS_EXPO_LN_TS1.pdf" = "exercices\terminale\fonctions-expo-ln.pdf"
    "Exercice TS1\Limites_et_continuité.pdf" = "exercices\terminale\limites-continuite.pdf"
    "Exercice TS1\Suites_ts1.pdf" = "exercices\terminale\suites-numeriques.pdf"
    
    "Exercice TS2\CALCUL INTEGRAL.pdf" = "exercices\terminale\calcul-integral-s2.pdf"
    "Exercice TS2\EQUATIONS DIFFERENTIELLES.pdf" = "exercices\terminale\equations-differentielles-s2.pdf"
    "Exercice TS2\FONCTIONS NUMERIQUES.pdf" = "exercices\terminale\fonctions-numeriques.pdf"
    "Exercice TS2\NOMBRES COMPLEXES ET SIMILITUDES.pdf" = "exercices\terminale\nombres-complexes-similitudes.pdf"
    "Exercice TS2\PROBABLITES.pdf" = "exercices\terminale\probabilites-s2.pdf"
    "Exercice TS2\PROBLEME DE SYNTHESE.pdf" = "exercices\terminale\probleme-synthese.pdf"
    "Exercice TS2\STATISTIQUES.pdf" = "exercices\terminale\statistiques.pdf"
    "Exercice TS2\SUITES NUMERIQUES.pdf" = "exercices\terminale\suites-numeriques-s2.pdf"
}

$copied = 0
$errors = 0

foreach ($entry in $pdfMapping.GetEnumerator()) {
    $sourcePath = Join-Path $sourceDir $entry.Key
    $targetPath = Join-Path $targetDir $entry.Value
    
    try {
        if (Test-Path $sourcePath) {
            # Créer le dossier parent si nécessaire
            $targetParent = Split-Path $targetPath -Parent
            if (-not (Test-Path $targetParent)) {
                New-Item -ItemType Directory -Path $targetParent -Force | Out-Null
            }
            
            Copy-Item -Path $sourcePath -Destination $targetPath -Force
            Write-Host "✅ $($entry.Key) → $($entry.Value)" -ForegroundColor Green
            $copied++
        } else {
            Write-Host "⚠️  Fichier non trouvé: $($entry.Key)" -ForegroundColor Yellow
            $errors++
        }
    } catch {
        Write-Host "❌ Erreur lors de la copie de $($entry.Key): $($_.Exception.Message)" -ForegroundColor Red
        $errors++
    }
}

Write-Host "`n✨ Terminé ! $copied fichiers copiés, $errors erreurs" -ForegroundColor Cyan

