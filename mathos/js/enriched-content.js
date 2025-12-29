// ============================================
// CONTENU ENRICHI POUR COURS ET EXERCICES
// Contenu HTML détaillé pour les cours/exercices sans PDF
// ============================================

window.enrichedCourseContent = {
  // Collège - 6ème
  1: {
    content: `
      <div class="course-content">
        <h2>Introduction aux nombres décimaux</h2>
        <p>Les nombres décimaux sont une extension des nombres entiers qui permettent de représenter des quantités plus précises. Ils sont composés d'une partie entière et d'une partie décimale, séparées par une virgule.</p>
        
        <h3>1. Structure des nombres décimaux</h3>
        <p>Un nombre décimal s'écrit sous la forme : <strong>partie entière, partie décimale</strong></p>
        <p>Exemple : 12,45</p>
        <ul>
          <li>12 est la partie entière</li>
          <li>45 est la partie décimale</li>
          <li>Le chiffre 4 représente les dixièmes</li>
          <li>Le chiffre 5 représente les centièmes</li>
        </ul>
        
        <h3>2. Opérations sur les nombres décimaux</h3>
        <h4>Addition et soustraction</h4>
        <p>Pour additionner ou soustraire des nombres décimaux, il faut aligner les virgules et compléter avec des zéros si nécessaire.</p>
        <p><strong>Exemple :</strong> 12,5 + 3,47 = 15,97</p>
        
        <h4>Multiplication</h4>
        <p>Pour multiplier des nombres décimaux, on effectue la multiplication comme avec des nombres entiers, puis on place la virgule en comptant le nombre total de décimales.</p>
        <p><strong>Exemple :</strong> 2,5 × 3,2 = 8,00</p>
        
        <h4>Division</h4>
        <p>Pour diviser des nombres décimaux, on déplace la virgule pour obtenir un diviseur entier.</p>
        <p><strong>Exemple :</strong> 12,5 ÷ 2,5 = 125 ÷ 25 = 5</p>
        
        <h3>3. Comparaison des nombres décimaux</h3>
        <p>Pour comparer deux nombres décimaux, on compare d'abord les parties entières. Si elles sont égales, on compare les parties décimales chiffre par chiffre.</p>
        <p><strong>Exemple :</strong> 12,45 &lt; 12,5 car 45 &lt; 50 (en centièmes)</p>
        
        <h3>4. Applications pratiques</h3>
        <p>Les nombres décimaux sont utilisés dans de nombreuses situations quotidiennes :</p>
        <ul>
          <li>Mesures de longueur (mètres, centimètres)</li>
          <li>Mesures de masse (kilogrammes, grammes)</li>
          <li>Prix en euros</li>
          <li>Températures</li>
        </ul>
      </div>
    `
  },
  
  2: {
    content: `
      <div class="course-content">
        <h2>Introduction aux fractions</h2>
        <p>Une fraction représente une partie d'un tout. Elle s'écrit sous la forme <strong>a/b</strong> où a est le numérateur et b est le dénominateur.</p>
        
        <h3>1. Notion de fraction</h3>
        <p>La fraction a/b signifie que l'on prend a parts d'un tout divisé en b parts égales.</p>
        <p><strong>Exemple :</strong> 3/4 signifie 3 parts sur 4 parts égales.</p>
        
        <h3>2. Simplification de fractions</h3>
        <p>Pour simplifier une fraction, on divise le numérateur et le dénominateur par leur PGCD.</p>
        <p><strong>Exemple :</strong> 12/18 = 2/3 (en divisant par 6)</p>
        
        <h3>3. Opérations sur les fractions</h3>
        <h4>Addition et soustraction</h4>
        <p>Pour additionner ou soustraire des fractions, il faut d'abord les mettre au même dénominateur.</p>
        <p><strong>Exemple :</strong> 1/3 + 1/4 = 4/12 + 3/12 = 7/12</p>
        
        <h4>Multiplication</h4>
        <p>Pour multiplier des fractions, on multiplie les numérateurs entre eux et les dénominateurs entre eux.</p>
        <p><strong>Exemple :</strong> 2/3 × 3/4 = 6/12 = 1/2</p>
        
        <h4>Division</h4>
        <p>Pour diviser des fractions, on multiplie par l'inverse de la fraction diviseur.</p>
        <p><strong>Exemple :</strong> 2/3 ÷ 3/4 = 2/3 × 4/3 = 8/9</p>
        
        <h3>4. Fractions et nombres décimaux</h3>
        <p>Une fraction peut être convertie en nombre décimal en effectuant la division.</p>
        <p><strong>Exemple :</strong> 1/2 = 0,5 et 1/3 = 0,333...</p>
      </div>
    `
  },
  
  3: {
    content: `
      <div class="course-content">
        <h2>Géométrie plane</h2>
        <p>La géométrie plane étudie les figures dans un plan. Nous allons découvrir les principales figures géométriques et leurs propriétés.</p>
        
        <h3>1. Les polygones</h3>
        <p>Un polygone est une figure fermée formée de segments de droites appelés côtés.</p>
        <ul>
          <li><strong>Triangle :</strong> 3 côtés</li>
          <li><strong>Quadrilatère :</strong> 4 côtés</li>
          <li><strong>Pentagone :</strong> 5 côtés</li>
          <li><strong>Hexagone :</strong> 6 côtés</li>
        </ul>
        
        <h3>2. Périmètres</h3>
        <p>Le périmètre d'une figure est la longueur de son contour.</p>
        <ul>
          <li><strong>Carré :</strong> P = 4 × côté</li>
          <li><strong>Rectangle :</strong> P = 2 × (longueur + largeur)</li>
          <li><strong>Cercle :</strong> P = 2 × π × rayon</li>
        </ul>
        
        <h3>3. Aires</h3>
        <p>L'aire d'une figure est la mesure de sa surface.</p>
        <ul>
          <li><strong>Carré :</strong> A = côté²</li>
          <li><strong>Rectangle :</strong> A = longueur × largeur</li>
          <li><strong>Triangle :</strong> A = (base × hauteur) / 2</li>
          <li><strong>Cercle :</strong> A = π × rayon²</li>
        </ul>
        
        <h3>4. Constructions géométriques</h3>
        <p>Nous apprendrons à construire des figures géométriques à l'aide de la règle et du compas.</p>
      </div>
    `
  }
  
  // Ajouter plus de contenu pour les autres cours...
};

window.enrichedExerciseContent = {
  // Exercices Collège
  1: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 1 : Opérations sur les décimaux</h4>
        <p><strong>Calculer les opérations suivantes :</strong></p>
        <ol>
          <li>12,5 + 7,35 = ?</li>
          <li>45,8 - 23,47 = ?</li>
          <li>3,2 × 4,5 = ?</li>
          <li>18,6 ÷ 3 = ?</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>Pour l'addition et la soustraction, alignez bien les virgules</li>
          <li>Pour la multiplication, comptez le nombre total de décimales</li>
          <li>Pour la division, déplacez la virgule pour obtenir un diviseur entier</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <ol>
          <li>12,5 + 7,35 = 19,85</li>
          <li>45,8 - 23,47 = 22,33</li>
          <li>3,2 × 4,5 = 14,4</li>
          <li>18,6 ÷ 3 = 6,2</li>
        </ol>
      </div>
    `
  },
  
  2: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 2 : Fractions simples</h4>
        <p><strong>Simplifier les fractions suivantes :</strong></p>
        <ol>
          <li>12/18</li>
          <li>15/25</li>
          <li>8/12</li>
        </ol>
        <p><strong>Calculer :</strong></p>
        <ol start="4">
          <li>1/3 + 1/4</li>
          <li>2/5 × 3/4</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>Pour simplifier, trouvez le PGCD du numérateur et du dénominateur</li>
          <li>Pour additionner, mettez au même dénominateur</li>
          <li>Pour multiplier, multipliez numérateurs et dénominateurs</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <ol>
          <li>12/18 = 2/3</li>
          <li>15/25 = 3/5</li>
          <li>8/12 = 2/3</li>
          <li>1/3 + 1/4 = 4/12 + 3/12 = 7/12</li>
          <li>2/5 × 3/4 = 6/20 = 3/10</li>
        </ol>
      </div>
    `
  }
  
  // Ajouter plus de contenu pour les autres exercices...
};

// Fonction pour obtenir le contenu enrichi d'un cours
window.getEnrichedCourseContent = function(courseId) {
  return window.enrichedCourseContent[courseId]?.content || null;
};

// Fonction pour obtenir le contenu enrichi d'un exercice
window.getEnrichedExerciseContent = function(exerciseId) {
  return window.enrichedExerciseContent[exerciseId] || null;
};


