// ============================================
// CONTENU ENRICHI ÉTENDU POUR TOUS LES COURS ET EXERCICES
// Ce fichier complète enriched-content.js avec le contenu pour tous les cours/exercices
// ============================================

// Étendre le contenu enrichi des cours
Object.assign(window.enrichedCourseContent, {
  // Collège - 5ème
  4: {
    content: `
      <div class="course-content">
        <h2>Nombres relatifs</h2>
        <p>Les nombres relatifs permettent de représenter des quantités positives ou négatives. Ils sont essentiels pour résoudre de nombreux problèmes mathématiques.</p>
        
        <h3>1. Représentation sur une droite graduée</h3>
        <p>Sur une droite graduée, les nombres positifs sont à droite de zéro et les nombres négatifs à gauche.</p>
        <p><strong>Exemple :</strong> -3, -2, -1, 0, 1, 2, 3</p>
        
        <h3>2. Addition de nombres relatifs</h3>
        <ul>
          <li>Si les deux nombres ont le même signe : on additionne les valeurs absolues et on garde le signe commun</li>
          <li>Si les deux nombres ont des signes différents : on soustrait la plus petite valeur absolue de la plus grande et on garde le signe du nombre ayant la plus grande valeur absolue</li>
        </ul>
        <p><strong>Exemples :</strong> (+5) + (+3) = +8 ; (-5) + (-3) = -8 ; (+5) + (-3) = +2</p>
        
        <h3>3. Soustraction de nombres relatifs</h3>
        <p>Soustraire un nombre relatif revient à additionner son opposé.</p>
        <p><strong>Exemple :</strong> (+5) - (+3) = (+5) + (-3) = +2</p>
        
        <h3>4. Multiplication et division</h3>
        <p>Le signe du résultat dépend des signes des nombres multipliés ou divisés :</p>
        <ul>
          <li>Même signe → résultat positif</li>
          <li>Signes différents → résultat négatif</li>
        </ul>
      </div>
    `
  },
  
  5: {
    content: `
      <div class="course-content">
        <h2>Calcul littéral</h2>
        <p>Le calcul littéral permet de manipuler des expressions contenant des lettres (variables) au lieu de nombres.</p>
        
        <h3>1. Notion de variable</h3>
        <p>Une variable est une lettre qui représente un nombre. On utilise souvent x, y, a, b, etc.</p>
        <p><strong>Exemple :</strong> Dans l'expression 3x + 2, x est la variable.</p>
        
        <h3>2. Réduction d'expressions</h3>
        <p>Pour réduire une expression, on regroupe les termes semblables.</p>
        <p><strong>Exemple :</strong> 3x + 2x - 5 = 5x - 5</p>
        
        <h3>3. Développement</h3>
        <p>Développer signifie transformer un produit en somme.</p>
        <p><strong>Exemple :</strong> 3(x + 2) = 3x + 6</p>
        
        <h3>4. Factorisation</h3>
        <p>Factoriser signifie transformer une somme en produit.</p>
        <p><strong>Exemple :</strong> 3x + 6 = 3(x + 2)</p>
        
        <h3>5. Identités remarquables</h3>
        <ul>
          <li>(a + b)² = a² + 2ab + b²</li>
          <li>(a - b)² = a² - 2ab + b²</li>
          <li>(a + b)(a - b) = a² - b²</li>
        </ul>
      </div>
    `
  },
  
  // Collège - 4ème
  7: {
    content: `
      <div class="course-content">
        <h2>Calcul littéral avancé</h2>
        <p>Approfondissement du calcul littéral avec des techniques plus avancées.</p>
        
        <h3>1. Développement double</h3>
        <p>Pour développer (a + b)(c + d), on multiplie chaque terme de la première parenthèse par chaque terme de la seconde.</p>
        <p><strong>Exemple :</strong> (x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6</p>
        
        <h3>2. Factorisation par facteur commun</h3>
        <p>On cherche le facteur commun à tous les termes.</p>
        <p><strong>Exemple :</strong> 3x² + 6x = 3x(x + 2)</p>
        
        <h3>3. Factorisation avec identités remarquables</h3>
        <p>Reconnaître les formes d'identités remarquables pour factoriser.</p>
        <p><strong>Exemple :</strong> x² + 6x + 9 = (x + 3)²</p>
      </div>
    `
  },
  
  8: {
    content: `
      <div class="course-content">
        <h2>Théorème de Pythagore</h2>
        <p>Le théorème de Pythagore est l'un des théorèmes les plus importants en géométrie.</p>
        
        <h3>1. Énoncé du théorème</h3>
        <p>Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.</p>
        <p><strong>Formule :</strong> a² + b² = c² (où c est l'hypoténuse)</p>
        
        <h3>2. Calcul de l'hypoténuse</h3>
        <p>Si on connaît les deux côtés de l'angle droit, on peut calculer l'hypoténuse.</p>
        <p><strong>Exemple :</strong> Si a = 3 et b = 4, alors c = √(3² + 4²) = √25 = 5</p>
        
        <h3>3. Calcul d'un côté de l'angle droit</h3>
        <p>Si on connaît l'hypoténuse et un côté, on peut calculer l'autre côté.</p>
        <p><strong>Exemple :</strong> Si c = 5 et a = 3, alors b = √(5² - 3²) = √16 = 4</p>
        
        <h3>4. Réciproque du théorème de Pythagore</h3>
        <p>Si dans un triangle, le carré du plus grand côté est égal à la somme des carrés des deux autres côtés, alors ce triangle est rectangle.</p>
        
        <h3>5. Applications pratiques</h3>
        <p>Le théorème de Pythagore est utilisé dans de nombreux domaines : construction, navigation, architecture, etc.</p>
      </div>
    `
  },
  
  9: {
    content: `
      <div class="course-content">
        <h2>Proportionnalité</h2>
        <p>La proportionnalité est une relation entre deux grandeurs qui varient dans le même rapport.</p>
        
        <h3>1. Tableau de proportionnalité</h3>
        <p>Dans un tableau de proportionnalité, on multiplie (ou divise) tous les nombres d'une ligne par le même nombre pour obtenir l'autre ligne.</p>
        
        <h3>2. Coefficient de proportionnalité</h3>
        <p>C'est le nombre par lequel on multiplie les valeurs de la première ligne pour obtenir celles de la seconde.</p>
        <p><strong>Exemple :</strong> Si 2 kg coûtent 10€, le coefficient est 10/2 = 5€/kg</p>
        
        <h3>3. Pourcentages</h3>
        <p>Un pourcentage est une fraction dont le dénominateur est 100.</p>
        <p><strong>Exemple :</strong> 25% = 25/100 = 0,25</p>
        
        <h3>4. Calcul de pourcentages</h3>
        <ul>
          <li>Calculer p% d'un nombre : nombre × (p/100)</li>
          <li>Calculer quel pourcentage représente un nombre : (nombre/total) × 100</li>
        </ul>
        
        <h3>5. Augmentation et diminution</h3>
        <p>Pour augmenter de p% : multiplier par (1 + p/100)</p>
        <p>Pour diminuer de p% : multiplier par (1 - p/100)</p>
      </div>
    `
  },
  
  // Collège - 3ème
  10: {
    content: `
      <div class="course-content">
        <h2>Équations</h2>
        <p>Une équation est une égalité contenant une inconnue. Résoudre une équation signifie trouver la valeur de l'inconnue.</p>
        
        <h3>1. Équations du premier degré</h3>
        <p>Une équation du type ax + b = 0 où a ≠ 0.</p>
        <p><strong>Exemple :</strong> 3x + 5 = 0</p>
        
        <h3>2. Méthode de résolution</h3>
        <ol>
          <li>Isoler le terme en x d'un côté</li>
          <li>Simplifier</li>
          <li>Diviser par le coefficient de x</li>
        </ol>
        <p><strong>Exemple :</strong> 3x + 5 = 0 → 3x = -5 → x = -5/3</p>
        
        <h3>3. Vérification</h3>
        <p>Après avoir trouvé la solution, on vérifie en remplaçant x par sa valeur dans l'équation initiale.</p>
        
        <h3>4. Équations avec fractions</h3>
        <p>On met au même dénominateur puis on simplifie.</p>
        
        <h3>5. Problèmes menant à une équation</h3>
        <p>De nombreux problèmes peuvent être résolus en les traduisant sous forme d'équation.</p>
      </div>
    `
  },
  
  11: {
    content: `
      <div class="course-content">
        <h2>Fonctions linéaires</h2>
        <p>Une fonction linéaire est une fonction de la forme f(x) = ax où a est un nombre réel appelé coefficient directeur.</p>
        
        <h3>1. Représentation graphique</h3>
        <p>La représentation graphique d'une fonction linéaire est une droite passant par l'origine du repère.</p>
        
        <h3>2. Coefficient directeur</h3>
        <p>Le coefficient directeur a détermine la pente de la droite :</p>
        <ul>
          <li>Si a > 0, la droite monte</li>
          <li>Si a < 0, la droite descend</li>
          <li>Plus |a| est grand, plus la droite est pentue</li>
        </ul>
        
        <h3>3. Calcul d'images</h3>
        <p>Pour calculer l'image d'un nombre par une fonction linéaire, on remplace x par ce nombre.</p>
        <p><strong>Exemple :</strong> Si f(x) = 3x, alors f(2) = 3 × 2 = 6</p>
        
        <h3>4. Calcul d'antécédents</h3>
        <p>Pour trouver l'antécédent d'un nombre, on résout l'équation f(x) = nombre.</p>
        <p><strong>Exemple :</strong> Si f(x) = 3x et f(x) = 6, alors 3x = 6, donc x = 2</p>
        
        <h3>5. Applications</h3>
        <p>Les fonctions linéaires modélisent des situations de proportionnalité.</p>
      </div>
    `
  },
  
  12: {
    content: `
      <div class="course-content">
        <h2>Trigonométrie</h2>
        <p>La trigonométrie permet de calculer des longueurs et des angles dans un triangle rectangle.</p>
        
        <h3>1. Définitions</h3>
        <p>Dans un triangle rectangle :</p>
        <ul>
          <li><strong>Sinus :</strong> sin(angle) = côté opposé / hypoténuse</li>
          <li><strong>Cosinus :</strong> cos(angle) = côté adjacent / hypoténuse</li>
          <li><strong>Tangente :</strong> tan(angle) = côté opposé / côté adjacent</li>
        </ul>
        
        <h3>2. Valeurs remarquables</h3>
        <p>Certains angles ont des valeurs trigonométriques exactes :</p>
        <ul>
          <li>sin(30°) = 1/2 ; cos(30°) = √3/2</li>
          <li>sin(45°) = cos(45°) = √2/2</li>
          <li>sin(60°) = √3/2 ; cos(60°) = 1/2</li>
        </ul>
        
        <h3>3. Calcul de longueurs</h3>
        <p>On utilise les formules trigonométriques pour calculer des longueurs inconnues.</p>
        
        <h3>4. Calcul d'angles</h3>
        <p>On utilise les fonctions inverses (arcsin, arccos, arctan) pour calculer des angles.</p>
        
        <h3>5. Applications pratiques</h3>
        <p>La trigonométrie est utilisée en navigation, architecture, physique, etc.</p>
      </div>
    `
  },
  
  // Lycée - 2nde
  13: {
    content: `
      <div class="course-content">
        <h2>Fonctions de référence</h2>
        <p>Les fonctions de référence sont des fonctions fondamentales qu'il faut connaître parfaitement.</p>
        
        <h3>1. Fonction carré</h3>
        <p>f(x) = x²</p>
        <ul>
          <li>Définie sur ℝ</li>
          <li>Paire : f(-x) = f(x)</li>
          <li>Décroissante sur ]-∞, 0] et croissante sur [0, +∞[</li>
          <li>Minimum en 0 : f(0) = 0</li>
        </ul>
        
        <h3>2. Fonction inverse</h3>
        <p>f(x) = 1/x</p>
        <ul>
          <li>Définie sur ℝ*</li>
          <li>Impaire : f(-x) = -f(x)</li>
          <li>Décroissante sur ]-∞, 0[ et sur ]0, +∞[</li>
          <li>Asymptotes : x = 0 et y = 0</li>
        </ul>
        
        <h3>3. Fonction racine carrée</h3>
        <p>f(x) = √x</p>
        <ul>
          <li>Définie sur [0, +∞[</li>
          <li>Croissante</li>
          <li>f(0) = 0</li>
        </ul>
        
        <h3>4. Variations et courbes représentatives</h3>
        <p>Chaque fonction a une courbe caractéristique qu'il faut savoir tracer.</p>
        
        <h3>5. Opérations sur les fonctions</h3>
        <p>On peut additionner, multiplier, composer des fonctions de référence.</p>
      </div>
    `
  },
  
  14: {
    content: `
      <div class="course-content">
        <h2>Vecteurs</h2>
        <p>Les vecteurs permettent de représenter des déplacements, des forces, etc.</p>
        
        <h3>1. Définition</h3>
        <p>Un vecteur est caractérisé par :</p>
        <ul>
          <li>Sa direction</li>
          <li>Son sens</li>
          <li>Sa norme (longueur)</li>
        </ul>
        
        <h3>2. Coordonnées d'un vecteur</h3>
        <p>Dans un repère, un vecteur a des coordonnées (x, y).</p>
        <p><strong>Exemple :</strong> Si A(1, 2) et B(4, 5), alors AB⃗ a pour coordonnées (3, 3)</p>
        
        <h3>3. Opérations sur les vecteurs</h3>
        <ul>
          <li><strong>Addition :</strong> u⃗ + v⃗ = (x₁ + x₂, y₁ + y₂)</li>
          <li><strong>Multiplication par un réel :</strong> k × u⃗ = (kx, ky)</li>
        </ul>
        
        <h3>4. Vecteurs colinéaires</h3>
        <p>Deux vecteurs sont colinéaires s'il existe un réel k tel que u⃗ = k × v⃗</p>
        
        <h3>5. Applications géométriques</h3>
        <p>Les vecteurs permettent de démontrer des propriétés géométriques (parallélisme, alignement, etc.)</p>
      </div>
    `
  },
  
  15: {
    content: `
      <div class="course-content">
        <h2>Statistiques</h2>
        <p>Les statistiques permettent d'analyser et d'interpréter des données.</p>
        
        <h3>1. Indicateurs de position</h3>
        <ul>
          <li><strong>Moyenne :</strong> somme des valeurs / nombre de valeurs</li>
          <li><strong>Médiane :</strong> valeur qui partage la série en deux parties égales</li>
          <li><strong>Mode :</strong> valeur la plus fréquente</li>
        </ul>
        
        <h3>2. Indicateurs de dispersion</h3>
        <ul>
          <li><strong>Étendue :</strong> différence entre la plus grande et la plus petite valeur</li>
          <li><strong>Écart-type :</strong> mesure de la dispersion autour de la moyenne</li>
        </ul>
        
        <h3>3. Représentations graphiques</h3>
        <p>On peut représenter des données avec :</p>
        <ul>
          <li>Diagrammes en bâtons</li>
          <li>Histogrammes</li>
          <li>Diagrammes circulaires</li>
          <li>Boîtes à moustaches</li>
        </ul>
        
        <h3>4. Série statistique</h3>
        <p>Une série statistique est un ensemble de données organisées.</p>
        
        <h3>5. Interprétation</h3>
        <p>Il faut savoir interpréter les résultats statistiques et éviter les pièges.</p>
      </div>
    `
  },
  
  // Lycée - 1ère
  16: {
    content: `
      <div class="course-content">
        <h2>Dérivation</h2>
        <p>La dérivation permet d'étudier les variations d'une fonction et de déterminer ses extremums.</p>
        
        <h3>1. Nombre dérivé</h3>
        <p>Le nombre dérivé de f en a est la limite du taux d'accroissement quand h tend vers 0.</p>
        <p>f'(a) = lim(h→0) [f(a+h) - f(a)] / h</p>
        
        <h3>2. Fonction dérivée</h3>
        <p>La fonction dérivée f' associe à chaque x le nombre dérivé f'(x).</p>
        
        <h3>3. Dérivées usuelles</h3>
        <ul>
          <li>(xⁿ)' = nxⁿ⁻¹</li>
          <li>(1/x)' = -1/x²</li>
          <li>(√x)' = 1/(2√x)</li>
          <li>(sin x)' = cos x</li>
          <li>(cos x)' = -sin x</li>
        </ul>
        
        <h3>4. Opérations sur les dérivées</h3>
        <ul>
          <li>(u + v)' = u' + v'</li>
          <li>(uv)' = u'v + uv'</li>
          <li>(u/v)' = (u'v - uv')/v²</li>
          <li>(u ∘ v)' = (u' ∘ v) × v'</li>
        </ul>
        
        <h3>5. Applications</h3>
        <p>La dérivée permet de :</p>
        <ul>
          <li>Déterminer les variations d'une fonction</li>
          <li>Trouver les extremums</li>
          <li>Déterminer les tangentes</li>
        </ul>
      </div>
    `
  },
  
  17: {
    content: `
      <div class="course-content">
        <h2>Suites numériques</h2>
        <p>Une suite numérique est une fonction définie sur ℕ (ou une partie de ℕ) à valeurs dans ℝ.</p>
        
        <h3>1. Suites arithmétiques</h3>
        <p>Une suite arithmétique est définie par : uₙ = u₀ + nr</p>
        <p>où r est la raison de la suite.</p>
        <p><strong>Exemple :</strong> 2, 5, 8, 11, ... (raison r = 3)</p>
        
        <h3>2. Suites géométriques</h3>
        <p>Une suite géométrique est définie par : uₙ = u₀ × qⁿ</p>
        <p>où q est la raison de la suite.</p>
        <p><strong>Exemple :</strong> 2, 6, 18, 54, ... (raison q = 3)</p>
        
        <h3>3. Sens de variation</h3>
        <ul>
          <li>Suite arithmétique : croissante si r > 0, décroissante si r < 0</li>
          <li>Suite géométrique : croissante si q > 1 et u₀ > 0</li>
        </ul>
        
        <h3>4. Somme des termes</h3>
        <ul>
          <li>Suite arithmétique : Sₙ = n × (u₀ + uₙ) / 2</li>
          <li>Suite géométrique : Sₙ = u₀ × (1 - qⁿ⁺¹) / (1 - q) si q ≠ 1</li>
        </ul>
        
        <h3>5. Limites</h3>
        <p>On étudie le comportement des suites quand n tend vers +∞.</p>
      </div>
    `
  },
  
  18: {
    content: `
      <div class="course-content">
        <h2>Probabilités</h2>
        <p>Les probabilités permettent de quantifier l'incertitude et de faire des prévisions.</p>
        
        <h3>1. Expérience aléatoire</h3>
        <p>Une expérience aléatoire est une expérience dont on ne peut pas prévoir le résultat à l'avance.</p>
        
        <h3>2. Probabilité d'un événement</h3>
        <p>La probabilité d'un événement A est : P(A) = nombre de cas favorables / nombre de cas possibles</p>
        
        <h3>3. Variables aléatoires</h3>
        <p>Une variable aléatoire associe un nombre à chaque issue d'une expérience.</p>
        
        <h3>4. Loi de probabilité</h3>
        <p>La loi de probabilité d'une variable aléatoire donne la probabilité de chaque valeur possible.</p>
        
        <h3>5. Espérance et variance</h3>
        <ul>
          <li><strong>Espérance :</strong> E(X) = Σ xᵢ × P(X = xᵢ)</li>
          <li><strong>Variance :</strong> V(X) = E(X²) - [E(X)]²</li>
        </ul>
      </div>
    `
  },
  
  // Lycée - Terminale
  19: {
    content: `
      <div class="course-content">
        <h2>Intégration</h2>
        <p>L'intégration est l'opération inverse de la dérivation. Elle permet de calculer des aires et des volumes.</p>
        
        <h3>1. Primitive</h3>
        <p>Une primitive de f est une fonction F telle que F' = f.</p>
        <p>Si F est une primitive de f, alors F + C (où C est une constante) est aussi une primitive.</p>
        
        <h3>2. Intégrale définie</h3>
        <p>L'intégrale de a à b de f(x)dx est notée ∫[a à b] f(x)dx</p>
        <p>Elle représente l'aire sous la courbe de f entre a et b.</p>
        
        <h3>3. Primitives usuelles</h3>
        <ul>
          <li>∫ xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ -1)</li>
          <li>∫ 1/x dx = ln|x| + C</li>
          <li>∫ eˣ dx = eˣ + C</li>
          <li>∫ sin x dx = -cos x + C</li>
          <li>∫ cos x dx = sin x + C</li>
        </ul>
        
        <h3>4. Propriétés</h3>
        <ul>
          <li>∫[a à b] f(x)dx = -∫[b à a] f(x)dx</li>
          <li>∫[a à b] [f(x) + g(x)]dx = ∫[a à b] f(x)dx + ∫[a à b] g(x)dx</li>
          <li>∫[a à b] kf(x)dx = k∫[a à b] f(x)dx</li>
        </ul>
        
        <h3>5. Applications</h3>
        <p>L'intégration permet de calculer des aires, des volumes, des centres de gravité, etc.</p>
      </div>
    `
  },
  
  20: {
    content: `
      <div class="course-content">
        <h2>Nombres complexes</h2>
        <p>Les nombres complexes étendent les nombres réels et permettent de résoudre des équations qui n'ont pas de solution réelle.</p>
        
        <h3>1. Forme algébrique</h3>
        <p>Un nombre complexe s'écrit z = a + ib où a et b sont des réels et i² = -1.</p>
        <p>a est la partie réelle, b est la partie imaginaire.</p>
        
        <h3>2. Opérations</h3>
        <ul>
          <li><strong>Addition :</strong> (a + ib) + (c + id) = (a + c) + i(b + d)</li>
          <li><strong>Multiplication :</strong> (a + ib)(c + id) = (ac - bd) + i(ad + bc)</li>
        </ul>
        
        <h3>3. Conjugué</h3>
        <p>Le conjugué de z = a + ib est z̄ = a - ib.</p>
        
        <h3>4. Module et argument</h3>
        <ul>
          <li><strong>Module :</strong> |z| = √(a² + b²)</li>
          <li><strong>Argument :</strong> arg(z) = angle entre le vecteur et l'axe réel</li>
        </ul>
        
        <h3>5. Forme exponentielle</h3>
        <p>z = |z| × e^(iθ) où θ = arg(z)</p>
        <p>Cette forme facilite les multiplications et divisions.</p>
      </div>
    `
  },
  
  21: {
    content: `
      <div class="course-content">
        <h2>Logarithmes</h2>
        <p>Les logarithmes sont les fonctions réciproques des exponentielles.</p>
        
        <h3>1. Fonction logarithme népérien</h3>
        <p>La fonction ln est définie sur ]0, +∞[ et vérifie ln(eˣ) = x.</p>
        <p>C'est la primitive de 1/x qui s'annule en 1.</p>
        
        <h3>2. Propriétés algébriques</h3>
        <ul>
          <li>ln(ab) = ln(a) + ln(b)</li>
          <li>ln(a/b) = ln(a) - ln(b)</li>
          <li>ln(aⁿ) = n × ln(a)</li>
          <li>ln(1) = 0 et ln(e) = 1</li>
        </ul>
        
        <h3>3. Dérivée</h3>
        <p>La dérivée de ln(x) est 1/x.</p>
        
        <h3>4. Fonction exponentielle</h3>
        <p>La fonction exp est la réciproque de ln : exp(x) = eˣ</p>
        <p>Sa dérivée est elle-même : (eˣ)' = eˣ</p>
        
        <h3>5. Équations et inéquations</h3>
        <p>Les logarithmes permettent de résoudre des équations exponentielles.</p>
        <p><strong>Exemple :</strong> eˣ = 5 → x = ln(5)</p>
      </div>
    `
  }
  
  // Les cours supérieurs (22-30) peuvent avoir du contenu plus avancé si nécessaire
});

// Étendre le contenu enrichi des exercices
Object.assign(window.enrichedExerciseContent, {
  // Exercices Collège
  3: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 3 : Périmètres et aires</h4>
        <p><strong>Calculer le périmètre et l'aire des figures suivantes :</strong></p>
        <ol>
          <li>Un carré de côté 5 cm</li>
          <li>Un rectangle de longueur 8 cm et largeur 4 cm</li>
          <li>Un triangle rectangle avec les côtés de l'angle droit mesurant 3 cm et 4 cm</li>
          <li>Un cercle de rayon 6 cm</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>Périmètre du carré : P = 4 × côté</li>
          <li>Aire du rectangle : A = longueur × largeur</li>
          <li>Aire du triangle : A = (base × hauteur) / 2</li>
          <li>Périmètre du cercle : P = 2πr</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <ol>
          <li>Carré : P = 4 × 5 = 20 cm ; A = 5² = 25 cm²</li>
          <li>Rectangle : P = 2 × (8 + 4) = 24 cm ; A = 8 × 4 = 32 cm²</li>
          <li>Triangle : A = (3 × 4) / 2 = 6 cm²</li>
          <li>Cercle : P = 2 × π × 6 ≈ 37,7 cm ; A = π × 6² ≈ 113,1 cm²</li>
        </ol>
      </div>
    `
  },
  
  4: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 4 : Nombres relatifs</h4>
        <p><strong>Calculer :</strong></p>
        <ol>
          <li>(+5) + (-3)</li>
          <li>(-7) + (-4)</li>
          <li>(+8) - (+2)</li>
          <li>(-5) × (+3)</li>
          <li>(-12) ÷ (-4)</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>Pour additionner : même signe → additionner et garder le signe ; signes différents → soustraire et garder le signe du plus grand</li>
          <li>Pour multiplier/diviser : même signe → positif ; signes différents → négatif</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <ol>
          <li>(+5) + (-3) = +2</li>
          <li>(-7) + (-4) = -11</li>
          <li>(+8) - (+2) = (+8) + (-2) = +6</li>
          <li>(-5) × (+3) = -15</li>
          <li>(-12) ÷ (-4) = +3</li>
        </ol>
      </div>
    `
  },
  
  5: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 5 : Expressions littérales</h4>
        <p><strong>Simplifier les expressions suivantes :</strong></p>
        <ol>
          <li>3x + 5x - 2x</li>
          <li>2(x + 3) - 4x</li>
          <li>(x + 2)(x + 3)</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>Regrouper les termes semblables</li>
          <li>Développer les parenthèses</li>
          <li>Utiliser la double distributivité pour (a+b)(c+d)</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <ol>
          <li>3x + 5x - 2x = 6x</li>
          <li>2(x + 3) - 4x = 2x + 6 - 4x = -2x + 6</li>
          <li>(x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6</li>
        </ol>
      </div>
    `
  },
  
  6: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 6 : Symétries</h4>
        <p><strong>Construire les figures symétriques :</strong></p>
        <ol>
          <li>Le symétrique d'un triangle par rapport à une droite</li>
          <li>Le symétrique d'un quadrilatère par rapport à un point</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>Pour une symétrie axiale : chaque point et son symétrique sont équidistants de l'axe</li>
          <li>Pour une symétrie centrale : le centre est le milieu du segment joignant un point et son symétrique</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <p>Les constructions doivent être réalisées avec une règle et un compas. Vérifiez que les distances et angles sont conservés.</p>
      </div>
    `
  },
  
  7: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 7 : Calcul littéral</h4>
        <p><strong>Développer et réduire :</strong></p>
        <ol>
          <li>3(x + 2) - 2(x - 1)</li>
          <li>(x + 3)²</li>
          <li>(2x - 1)(2x + 1)</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>Utiliser la distributivité</li>
          <li>Reconnaître les identités remarquables : (a+b)² = a² + 2ab + b² et (a-b)(a+b) = a² - b²</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <ol>
          <li>3(x + 2) - 2(x - 1) = 3x + 6 - 2x + 2 = x + 8</li>
          <li>(x + 3)² = x² + 6x + 9</li>
          <li>(2x - 1)(2x + 1) = (2x)² - 1² = 4x² - 1</li>
        </ol>
      </div>
    `
  },
  
  8: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 8 : Théorème de Pythagore</h4>
        <p><strong>Dans chaque cas, déterminer la longueur manquante :</strong></p>
        <ol>
          <li>Triangle rectangle avec côtés de l'angle droit : 6 cm et 8 cm</li>
          <li>Triangle rectangle avec hypoténuse : 10 cm et un côté : 6 cm</li>
          <li>Vérifier si un triangle de côtés 5 cm, 12 cm et 13 cm est rectangle</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>Pour l'hypoténuse : c = √(a² + b²)</li>
          <li>Pour un côté : a = √(c² - b²)</li>
          <li>Pour vérifier : calculer c² et a² + b²</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <ol>
          <li>Hypoténuse = √(6² + 8²) = √(36 + 64) = √100 = 10 cm</li>
          <li>Côté = √(10² - 6²) = √(100 - 36) = √64 = 8 cm</li>
          <li>13² = 169 et 5² + 12² = 25 + 144 = 169. Donc le triangle est rectangle.</li>
        </ol>
      </div>
    `
  },
  
  9: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 9 : Proportionnalité</h4>
        <p><strong>Résoudre les problèmes suivants :</strong></p>
        <ol>
          <li>Si 3 kg de pommes coûtent 7,50€, combien coûtent 5 kg ?</li>
          <li>Un article coûte 80€. Il est soldé à -20%. Quel est le nouveau prix ?</li>
          <li>Dans une classe de 30 élèves, 60% sont des filles. Combien y a-t-il de filles ?</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>Utiliser un tableau de proportionnalité</li>
          <li>Pour un pourcentage, multiplier par le coefficient</li>
          <li>Pour une réduction, multiplier par (1 - pourcentage/100)</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <ol>
          <li>Prix de 5 kg = (7,50 × 5) / 3 = 37,50 / 3 = 12,50€</li>
          <li>Nouveau prix = 80 × (1 - 20/100) = 80 × 0,8 = 64€</li>
          <li>Nombre de filles = 30 × 60/100 = 18 filles</li>
        </ol>
      </div>
    `
  },
  
  10: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 10 : Équations</h4>
        <p><strong>Résoudre les équations suivantes :</strong></p>
        <ol>
          <li>3x + 5 = 14</li>
          <li>2x - 7 = x + 3</li>
          <li>4(x + 2) = 20</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>Isoler le terme en x</li>
          <li>Simplifier chaque membre</li>
          <li>Diviser par le coefficient de x</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <ol>
          <li>3x = 14 - 5 = 9, donc x = 3</li>
          <li>2x - x = 3 + 7, donc x = 10</li>
          <li>4x + 8 = 20, donc 4x = 12, donc x = 3</li>
        </ol>
      </div>
    `
  },
  
  11: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 11 : Fonctions linéaires</h4>
        <p><strong>Soit f(x) = 3x</strong></p>
        <ol>
          <li>Calculer f(2), f(-1), f(0)</li>
          <li>Déterminer l'antécédent de 9</li>
          <li>Tracer la représentation graphique de f</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>Remplacer x par la valeur donnée</li>
          <li>Pour l'antécédent, résoudre f(x) = 9</li>
          <li>La représentation graphique est une droite passant par l'origine</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <ol>
          <li>f(2) = 6 ; f(-1) = -3 ; f(0) = 0</li>
          <li>3x = 9, donc x = 3</li>
          <li>Droite passant par (0,0) et (1,3)</li>
        </ol>
      </div>
    `
  },
  
  12: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 12 : Trigonométrie</h4>
        <p><strong>Dans un triangle rectangle ABC rectangle en A, avec AB = 5 cm et AC = 12 cm :</strong></p>
        <ol>
          <li>Calculer BC</li>
          <li>Calculer sin(B), cos(B), tan(B)</li>
          <li>Calculer la mesure de l'angle B</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>Utiliser le théorème de Pythagore pour BC</li>
          <li>sin(B) = côté opposé / hypoténuse</li>
          <li>Utiliser la calculatrice pour l'angle</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <ol>
          <li>BC = √(5² + 12²) = √169 = 13 cm</li>
          <li>sin(B) = 12/13 ; cos(B) = 5/13 ; tan(B) = 12/5</li>
          <li>B ≈ 67,4°</li>
        </ol>
      </div>
    `
  },
  
  // Exercices Lycée - 2nde
  13: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 13 : Fonctions de référence</h4>
        <p><strong>Étudier les fonctions suivantes :</strong></p>
        <ol>
          <li>f(x) = x² : déterminer f(3), f(-2), les variations</li>
          <li>g(x) = 1/x : déterminer g(2), g(-1), le domaine de définition</li>
          <li>h(x) = √x : déterminer h(4), h(9), le domaine de définition</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>La fonction carré est paire et décroissante sur ]-∞, 0]</li>
          <li>La fonction inverse n'est pas définie en 0</li>
          <li>La fonction racine carrée n'est définie que sur [0, +∞[</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <ol>
          <li>f(3) = 9 ; f(-2) = 4 ; décroissante sur ]-∞, 0], croissante sur [0, +∞[</li>
          <li>g(2) = 1/2 ; g(-1) = -1 ; domaine : ℝ*</li>
          <li>h(4) = 2 ; h(9) = 3 ; domaine : [0, +∞[</li>
        </ol>
      </div>
    `
  },
  
  14: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 14 : Vecteurs</h4>
        <p><strong>Dans un repère orthonormé, on donne A(1, 2), B(4, 5), C(2, 3) :</strong></p>
        <ol>
          <li>Calculer les coordonnées de AB⃗</li>
          <li>Calculer les coordonnées de AC⃗</li>
          <li>Les vecteurs AB⃗ et AC⃗ sont-ils colinéaires ?</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>Coordonnées de AB⃗ = (xB - xA, yB - yA)</li>
          <li>Deux vecteurs sont colinéaires si leurs coordonnées sont proportionnelles</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <ol>
          <li>AB⃗(3, 3)</li>
          <li>AC⃗(1, 1)</li>
          <li>Oui, car AB⃗ = 3 × AC⃗</li>
        </ol>
      </div>
    `
  },
  
  15: {
    statement: `
      <div class="exercise-statement">
        <h4>Exercice 15 : Statistiques</h4>
        <p><strong>Pour la série statistique : 12, 15, 18, 20, 22, 25, 28 :</strong></p>
        <ol>
          <li>Calculer la moyenne</li>
          <li>Déterminer la médiane</li>
          <li>Calculer l'étendue</li>
        </ol>
      </div>
    `,
    hints: `
      <div class="exercise-hints">
        <h4>Indices</h4>
        <ul>
          <li>Moyenne = somme des valeurs / nombre de valeurs</li>
          <li>Médiane = valeur centrale quand la série est ordonnée</li>
          <li>Étendue = valeur max - valeur min</li>
        </ul>
      </div>
    `,
    solution: `
      <div class="exercise-solution">
        <h4>Solutions</h4>
        <ol>
          <li>Moyenne = (12+15+18+20+22+25+28)/7 = 140/7 = 20</li>
          <li>Médiane = 20</li>
          <li>Étendue = 28 - 12 = 16</li>
        </ol>
      </div>
    `
  }
  
  // Les exercices 16-21 ont des PDFs disponibles, donc pas besoin de contenu enrichi
});

