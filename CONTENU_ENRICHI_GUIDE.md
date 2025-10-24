# Guide du système de contenu enrichi

## Vue d'ensemble

Le système de contenu enrichi permet aux étudiants de visualiser des cours de haute qualité même lorsque le super administrateur n'a pas encore uploadé de PDFs personnalisés. Le système intègre de manière **transparente** les PDFs et le contenu par défaut **sans aucune indication visuelle** de la source.

## Architecture

### 1. Fichiers principaux

- **`lib/services/storage.service.ts`** : Gestion des PDFs dans Firebase Storage
- **`lib/services/content-enrichment.service.ts`** : Contenu enrichi par défaut en HTML
- **`app/cours/[id]/page.tsx`** : Page de détail du cours (modifiée pour intégrer le système)

### 2. Flux de fonctionnement

```
Étudiant clique sur un cours
    ↓
Le système vérifie s'il existe un PDF pour ce cours (courseId)
    ↓
┌─────────────────┬─────────────────┐
│  PDF trouvé     │  Pas de PDF     │
│                 │                 │
│  Affiche PDF    │  Affiche le     │
│  dans iframe    │  contenu HTML   │
│                 │  enrichi        │
└─────────────────┴─────────────────┘
    ↓
Design identique dans les deux cas
Aucune mention de "généré" ou "uploadé"
```

## Fonctionnement technique

### Upload de PDF par le super admin

1. Le super admin accède à `/admin/super/gestion-contenus`
2. Sélectionne le type (cours/exercice/quiz), niveau, classe, et **courseId**
3. Upload le PDF
4. Le PDF est stocké dans Firebase Storage à : `/pdfs/{level}/{type}/{classe}/{filename}`
5. Les métadonnées sont enregistrées dans Firestore collection `pdfs` avec le `courseId`

### Affichage côté étudiant

1. Lorsque l'étudiant ouvre `/cours/{id}`, le système appelle :
   ```typescript
   const content = await getCourseContent(courseId)
   ```

2. Cette fonction vérifie d'abord s'il existe un PDF :
   ```typescript
   const pdf = await getPDFForCourse(courseId, 'cours')
   ```

3. Si PDF trouvé :
   ```typescript
   return { hasPDF: true, pdfUrl: pdf.url }
   ```

4. Si pas de PDF :
   ```typescript
   return { hasPDF: false, content: enrichedCoursesData[courseId].content }
   ```

5. La page de cours affiche ensuite :
   - **Avec PDF** : iframe avec le PDF
   - **Sans PDF** : div avec HTML enrichi
   - **Design identique** : même structure de tabs (Contenu / Objectifs / Prérequis)

## Contenu enrichi disponible

### Collège - 6ème
- **Cours 1** : Nombres décimaux (opérations, comparaison)
- **Cours 2** : Fractions (simplification, addition, multiplication)
- **Cours 3** : Géométrie plane (triangles, quadrilatères, périmètres/aires)

### Collège - 5ème
- **Cours 4** : Nombres relatifs (addition, soustraction)
- **Cours 5** : Calcul littéral (expressions, réduction, distributivité)

### Collège - 4ème
- **Cours 7** : Puissances (règles de calcul, notation scientifique)
- **Cours 8** : Théorème de Pythagore (énoncé, applications, réciproque)

### Lycée - 2nde
- **Cours 13** : Fonctions de référence (carré, inverse, racine carrée)

### Lycée - 1ère
- **Cours 16** : Dérivation (nombre dérivé, dérivées usuelles, opérations)

### Lycée - Terminale
- **Cours 19** : Intégration (primitives, intégrales définies, méthodes d'intégration)

## Styles du contenu enrichi

Le contenu utilise les classes Tailwind CSS :
- `prose` : Formatage de texte riche
- `bg-{color}-50 dark:bg-{color}-950` : Blocs colorés adaptés au mode sombre
- Tables avec bordures pour les formules
- Cards pour les exemples et exercices
- Grids responsive pour les comparaisons

## Ajout de nouveaux cours enrichis

Pour ajouter un nouveau cours enrichi, modifiez `lib/services/content-enrichment.service.ts` :

```typescript
export const enrichedCoursesData: Record<number, { title: string; content: string }> = {
  // Cours existants...
  
  // Nouveau cours
  99: {
    title: "Titre du cours",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Titre de section</h2>
          <p class="mb-4">Contenu...</p>
          
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <!-- Bloc d'information -->
          </div>
        </section>
      </div>
    `
  }
}
```

## Points importants

✅ **Design préservé** : La structure visuelle reste identique avec ou sans PDF
✅ **Aucune indication** : L'étudiant ne sait pas si c'est un PDF uploadé ou du contenu par défaut
✅ **Qualité élevée** : Le contenu enrichi est de niveau professionnel avec formules, tableaux, exemples
✅ **Responsive** : Fonctionne sur mobile, tablette et desktop
✅ **Mode sombre** : Tous les styles s'adaptent automatiquement

## Extension aux exercices et quiz

Le même système peut être étendu à `/exercices` et `/quiz` :

1. Créer `enrichedExercicesData` et `enrichedQuizData` dans le service
2. Modifier les pages `/exercices/[id]/page.tsx` et `/quiz/[id]/page.tsx`
3. Utiliser le même pattern : vérifier PDF → sinon afficher contenu enrichi

## Firestore Collection `pdfs`

Structure d'un document :
```json
{
  "name": "cours_pythagore.pdf",
  "url": "https://storage.googleapis.com/...",
  "type": "cours",
  "level": "college",
  "classe": "4ème",
  "courseId": 8,
  "subject": "Mathématiques",
  "uploadedAt": "2024-01-15T10:30:00Z",
  "uploadedBy": "admin_uid",
  "size": 2048576
}
```

## Firebase Storage Structure

```
/pdfs
  /college
    /cours
      /3ème
        /1234567890_theoreme_pythagore.pdf
      /4ème
        /1234567891_puissances.pdf
    /exercice
      /...
  /lycee
    /cours
      /Terminale
        /1234567892_integration.pdf
```

## Sécurité

- Les PDFs sont accessibles via des URLs signées de Firebase Storage
- Seul le super admin peut uploader des PDFs
- Les étudiants ont accès en lecture seule aux contenus

## Performance

- Le contenu enrichi est chargé de manière asynchrone
- Les PDFs sont mis en cache par le navigateur
- Pas de rechargement inutile grâce à React state management
