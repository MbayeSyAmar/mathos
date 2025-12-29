# 📄 Guide d'utilisation des PDFs

## Installation

Pour copier les PDFs du dossier "RESSOURCES MATHOSPHERE" vers le dossier `mathos/pdfs/`, exécutez le script PowerShell :

```powershell
cd mathos/scripts
.\copy-pdfs.ps1
```

Le script va :
1. Créer la structure de dossiers `pdfs/exercices/2nde`, `pdfs/exercices/1ere`, `pdfs/exercices/terminale`
2. Copier tous les PDFs disponibles depuis "RESSOURCES MATHOSPHERE"
3. Les renommer avec des noms compatibles pour le web (sans espaces ni caractères spéciaux)

## Structure des PDFs

Les PDFs sont organisés comme suit :

```
mathos/pdfs/
├── exercices/
│   ├── 2nde/
│   │   ├── fonctions.pdf
│   │   ├── calcul-vectoriel.pdf
│   │   ├── angles.pdf
│   │   └── ...
│   ├── 1ere/
│   │   ├── derivees.pdf
│   │   ├── suites-numeriques.pdf
│   │   └── ...
│   └── terminale/
│       ├── calcul-integral.pdf
│       ├── nombres-complexes.pdf
│       └── ...
```

## Mapping des exercices

Les PDFs sont automatiquement associés aux exercices dans `js/pdf-mapping.js` :

- **Exercices 2nde** : IDs 13-15 et exercices supplémentaires
- **Exercices 1ère** : IDs 16-18 et exercices supplémentaires  
- **Exercices Terminale** : IDs 19-21 et exercices supplémentaires

## Affichage dans l'application

Quand un étudiant consulte un exercice :
1. Le système vérifie si un PDF existe pour cet exercice dans `pdf-mapping.js`
2. Si oui : le PDF est affiché dans un iframe avec un lien pour l'ouvrir dans un nouvel onglet
3. Si non : le contenu enrichi HTML est affiché (depuis `enriched-content.js`)

## Contenu enrichi

Pour les cours et exercices sans PDF, du contenu HTML enrichi a été créé dans :
- `js/enriched-content.js` : Contenu de base pour quelques cours/exercices
- `js/enriched-content-extended.js` : Contenu étendu pour tous les cours/exercices restants

## Notes importantes

- Les chemins des PDFs dans `pdf-mapping.js` sont relatifs depuis les pages HTML
- Assurez-vous que les PDFs sont bien copiés avant de tester l'application
- Les noms de fichiers PDF sont normalisés (sans espaces, caractères spéciaux remplacés)

