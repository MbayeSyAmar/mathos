import { getPDFForContent } from './local-storage.service';

/**
 * Contenu enrichi pour les cours (utilisé quand aucun PDF n'est uploadé)
 */
export const enrichedCoursesData: Record<number, { title: string; content: string }> = {
  // ===== COLLÈGE - 6ème =====
  1: {
    title: "Nombres décimaux",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Introduction aux nombres décimaux</h2>
          <p class="mb-4">Les nombres décimaux sont une extension des nombres entiers qui permettent de représenter des valeurs non entières en utilisant une virgule.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Définition</h3>
          <p class="mb-4">Un nombre décimal est composé de deux parties :</p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li><strong>La partie entière</strong> : avant la virgule</li>
            <li><strong>La partie décimale</strong> : après la virgule</li>
          </ul>
          <p class="mb-4"><strong>Exemple :</strong> Dans 12,345 → 12 est la partie entière, 345 est la partie décimale</p>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Opérations sur les nombres décimaux</h3>
          
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <h4 class="font-semibold mb-2">Addition et Soustraction</h4>
            <p class="mb-2">On aligne les virgules et on effectue l'opération comme avec les entiers.</p>
            <div class="font-mono bg-white dark:bg-gray-900 p-3 rounded">
              <pre>  12,5
+  3,75
-------
  16,25</pre>
            </div>
          </div>

          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <h4 class="font-semibold mb-2">Multiplication</h4>
            <p class="mb-2">On multiplie sans tenir compte des virgules, puis on place la virgule dans le résultat.</p>
            <p><strong>Règle :</strong> Le nombre de chiffres après la virgule dans le résultat = somme des chiffres après la virgule des facteurs</p>
            <div class="font-mono bg-white dark:bg-gray-900 p-3 rounded mt-2">
              <pre>2,5 × 1,2 = 3,00 (2 chiffres après virgule)</pre>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Comparaison de nombres décimaux</h3>
          <p class="mb-4">Pour comparer deux nombres décimaux :</p>
          <ol class="list-decimal pl-6 space-y-2 mb-4">
            <li>On compare d'abord les parties entières</li>
            <li>Si elles sont égales, on compare les parties décimales chiffre par chiffre</li>
          </ol>
          <p><strong>Exemple :</strong> 12,456 &lt; 12,5 car 456 &lt; 500</p>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Exercices d'application</h3>
          <div class="space-y-4">
            <div class="border-l-4 border-blue-500 pl-4">
              <p class="font-semibold">Exercice 1 :</p>
              <p>Calculer : 15,6 + 3,84 + 7,2</p>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <p class="font-semibold">Exercice 2 :</p>
              <p>Ranger par ordre croissant : 3,45 ; 3,5 ; 3,405 ; 3,54</p>
            </div>
          </div>
        </section>
      </div>
    `
  },
  
  2: {
    title: "Fractions",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Les fractions</h2>
          <p class="mb-4">Une fraction représente une partie d'un tout ou le quotient de deux nombres.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Définition et vocabulaire</h3>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
            <p class="mb-2">Une fraction s'écrit sous la forme <strong>a/b</strong> où :</p>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>a</strong> est le numérateur</li>
              <li><strong>b</strong> est le dénominateur (b ≠ 0)</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Simplification de fractions</h3>
          <p class="mb-4">Pour simplifier une fraction, on divise le numérateur et le dénominateur par leur PGCD.</p>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p class="font-semibold mb-2">Exemple :</p>
            <p>12/18 = (12÷6)/(18÷6) = 2/3</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Addition et soustraction</h3>
          <p class="mb-4">Pour additionner ou soustraire des fractions, elles doivent avoir le même dénominateur.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Même dénominateur :</p>
              <p>3/5 + 1/5 = (3+1)/5 = 4/5</p>
            </div>
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Dénominateurs différents :</p>
              <p>1/2 + 1/3 = 3/6 + 2/6 = 5/6</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Multiplication de fractions</h3>
          <p class="mb-4">On multiplie les numérateurs entre eux et les dénominateurs entre eux.</p>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
            <p class="font-mono text-lg">(a/b) × (c/d) = (a×c)/(b×d)</p>
            <p class="mt-2"><strong>Exemple :</strong> 2/3 × 4/5 = 8/15</p>
          </div>
        </section>
      </div>
    `
  },

  3: {
    title: "Géométrie plane",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Géométrie plane - Figures fondamentales</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Les triangles</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="font-semibold mb-3">Propriétés du triangle :</p>
            <ul class="list-disc pl-6 space-y-2">
              <li>La somme des angles = 180°</li>
              <li>Chaque côté est inférieur à la somme des deux autres</li>
            </ul>
          </div>

          <h4 class="font-semibold mb-2 mt-4">Types de triangles :</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="border p-4 rounded-lg">
              <h5 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">Équilatéral</h5>
              <p class="text-sm">3 côtés égaux, 3 angles de 60°</p>
            </div>
            <div class="border p-4 rounded-lg">
              <h5 class="font-semibold text-green-600 dark:text-green-400 mb-2">Isocèle</h5>
              <p class="text-sm">2 côtés égaux, 2 angles égaux</p>
            </div>
            <div class="border p-4 rounded-lg">
              <h5 class="font-semibold text-purple-600 dark:text-purple-400 mb-2">Rectangle</h5>
              <p class="text-sm">Un angle droit (90°)</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3 mt-6">2. Les quadrilatères</h3>
          <div class="space-y-4">
            <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Le carré</h4>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li>4 côtés égaux</li>
                <li>4 angles droits</li>
                <li>Diagonales égales et perpendiculaires</li>
              </ul>
            </div>
            <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Le rectangle</h4>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li>Côtés opposés égaux</li>
                <li>4 angles droits</li>
                <li>Diagonales égales</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3 mt-6">3. Périmètres et aires</h3>
          <table class="w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-800">
                <th class="border border-gray-300 dark:border-gray-700 p-2">Figure</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2">Périmètre</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2">Aire</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Carré (côté c)</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">P = 4 × c</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">A = c²</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Rectangle (L×l)</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">P = 2(L + l)</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">A = L × l</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Triangle (base b, hauteur h)</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">P = somme des côtés</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">A = (b × h) / 2</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    `
  },

  // ===== COLLÈGE - 5ème =====
  4: {
    title: "Nombres relatifs",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Les nombres relatifs</h2>
          <p class="mb-4">Les nombres relatifs incluent les nombres positifs, négatifs et zéro.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Définition et notation</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Nombres positifs :</strong> +5, +12,3 (ou simplement 5, 12,3)</li>
              <li><strong>Nombres négatifs :</strong> -3, -7,8</li>
              <li><strong>Zéro :</strong> ni positif, ni négatif</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Repérage sur une droite graduée</h3>
          <p class="mb-4">Les nombres relatifs se placent sur une droite orientée :</p>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4 text-center">
            <p class="font-mono text-lg">... -3 -2 -1 0 +1 +2 +3 ...</p>
            <p class="text-sm mt-2 text-muted-foreground">← négatifs | zéro | positifs →</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Addition de nombres relatifs</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Même signe</h4>
              <p class="text-sm mb-2">On additionne les distances à zéro et on garde le signe commun</p>
              <p class="font-mono">(+5) + (+3) = +8</p>
              <p class="font-mono">(-5) + (-3) = -8</p>
            </div>
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Signes différents</h4>
              <p class="text-sm mb-2">On soustrait les distances et on garde le signe du plus grand</p>
              <p class="font-mono">(+5) + (-3) = +2</p>
              <p class="font-mono">(-5) + (+3) = -2</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Soustraction</h3>
          <p class="mb-4">Soustraire un nombre = Ajouter son opposé</p>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
            <p class="font-mono mb-2">(+7) - (+3) = (+7) + (-3) = +4</p>
            <p class="font-mono">(+5) - (-2) = (+5) + (+2) = +7</p>
          </div>
        </section>
      </div>
    `
  },

  5: {
    title: "Calcul littéral",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Introduction au calcul littéral</h2>
          <p class="mb-4">Le calcul littéral consiste à effectuer des calculs avec des lettres représentant des nombres.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Expressions algébriques</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Vocabulaire :</strong></p>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Variable :</strong> Une lettre représentant un nombre (x, y, a, b...)</li>
              <li><strong>Expression :</strong> 3x + 5, 2a - 7b</li>
              <li><strong>Terme :</strong> Partie séparée par + ou -</li>
              <li><strong>Coefficient :</strong> Le nombre devant la lettre (dans 3x, le coefficient est 3)</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Réduction d'expressions</h3>
          <p class="mb-4">On peut additionner ou soustraire uniquement les termes de même nature.</p>
          
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <h4 class="font-semibold mb-2">Exemples de réduction :</h4>
            <p class="font-mono mb-1">3x + 5x = 8x</p>
            <p class="font-mono mb-1">7a - 2a + 4a = 9a</p>
            <p class="font-mono mb-1">5x + 2y - 3x + y = 2x + 3y</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Suppression de parenthèses</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Signe + devant</h4>
              <p class="text-sm mb-2">On garde les signes</p>
              <p class="font-mono">+(3x - 2) = 3x - 2</p>
            </div>
            <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Signe - devant</h4>
              <p class="text-sm mb-2">On change tous les signes</p>
              <p class="font-mono">-(3x - 2) = -3x + 2</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Distributivité simple</h3>
          <p class="mb-4">Pour développer k(a + b), on multiplie k par chaque terme :</p>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
            <p class="font-mono mb-2">k(a + b) = ka + kb</p>
            <p class="font-mono mb-2">3(x + 5) = 3x + 15</p>
            <p class="font-mono">-2(4x - 3) = -8x + 6</p>
          </div>
        </section>
      </div>
    `
  },

  // ===== COLLÈGE - 4ème =====
  7: {
    title: "Puissances",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Les puissances</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Définition</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Pour n entier positif :</p>
            <p class="font-mono text-lg mb-2">aⁿ = a × a × a × ... × a (n facteurs)</p>
            <p class="text-sm"><strong>Exemples :</strong></p>
            <p class="font-mono">2³ = 2 × 2 × 2 = 8</p>
            <p class="font-mono">10⁴ = 10 × 10 × 10 × 10 = 10 000</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Règles de calcul</h3>
          
          <table class="w-full border-collapse border border-gray-300 dark:border-gray-700 mb-4">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-800">
                <th class="border border-gray-300 dark:border-gray-700 p-3">Opération</th>
                <th class="border border-gray-300 dark:border-gray-700 p-3">Règle</th>
                <th class="border border-gray-300 dark:border-gray-700 p-3">Exemple</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3">Produit</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3">aⁿ × aᵐ = aⁿ⁺ᵐ</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3">2³ × 2⁴ = 2⁷</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3">Quotient</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3">aⁿ ÷ aᵐ = aⁿ⁻ᵐ</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3">5⁶ ÷ 5² = 5⁴</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3">Puissance de puissance</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3">(aⁿ)ᵐ = aⁿˣᵐ</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3">(3²)³ = 3⁶</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Puissances de 10</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Puissances positives :</strong></p>
            <p class="font-mono mb-1">10¹ = 10</p>
            <p class="font-mono mb-1">10² = 100</p>
            <p class="font-mono mb-1">10³ = 1 000</p>
            <p class="font-mono mb-3">10ⁿ = 1 suivi de n zéros</p>
            
            <p class="mb-3 mt-4"><strong>Puissances négatives :</strong></p>
            <p class="font-mono mb-1">10⁻¹ = 0,1</p>
            <p class="font-mono mb-1">10⁻² = 0,01</p>
            <p class="font-mono">10⁻³ = 0,001</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Notation scientifique</h3>
          <p class="mb-4">Un nombre est en notation scientifique s'il s'écrit : a × 10ⁿ avec 1 ≤ a < 10</p>
          <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
            <p class="font-mono mb-1">45 000 = 4,5 × 10⁴</p>
            <p class="font-mono mb-1">0,000 32 = 3,2 × 10⁻⁴</p>
            <p class="font-mono">123 456 = 1,234 56 × 10⁵</p>
          </div>
        </section>
      </div>
    `
  },

  8: {
    title: "Théorème de Pythagore",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Le théorème de Pythagore</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Énoncé du théorème</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Dans un triangle rectangle :</strong></p>
            <p class="mb-3">Le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.</p>
            <div class="bg-white dark:bg-gray-900 p-4 rounded-lg text-center">
              <p class="font-mono text-xl mb-2">BC² = AB² + AC²</p>
              <p class="text-sm text-muted-foreground">où BC est l'hypoténuse</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Application : Calculer l'hypoténuse</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="font-semibold mb-2">Exemple :</p>
            <p class="mb-2">Triangle ABC rectangle en A, avec AB = 3 cm et AC = 4 cm</p>
            <p class="mb-1">BC² = AB² + AC²</p>
            <p class="mb-1">BC² = 3² + 4²</p>
            <p class="mb-1">BC² = 9 + 16 = 25</p>
            <p class="font-semibold">BC = √25 = 5 cm</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Application : Calculer un côté de l'angle droit</h3>
          <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg mb-4">
            <p class="font-semibold mb-2">Exemple :</p>
            <p class="mb-2">Triangle rectangle avec hypoténuse = 13 cm et un côté = 5 cm</p>
            <p class="mb-1">13² = 5² + autre²</p>
            <p class="mb-1">169 = 25 + autre²</p>
            <p class="mb-1">autre² = 169 - 25 = 144</p>
            <p class="font-semibold">autre = √144 = 12 cm</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Réciproque du théorème de Pythagore</h3>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
            <p class="mb-3"><strong>Si dans un triangle ABC :</strong></p>
            <p class="mb-3">BC² = AB² + AC²</p>
            <p class="font-semibold">Alors le triangle est rectangle en A</p>
            <p class="text-sm mt-3">Cette propriété permet de vérifier qu'un triangle est rectangle.</p>
          </div>
        </section>
      </div>
    `
  },

  // ===== LYCÉE - 2nde =====
  13: {
    title: "Fonctions de référence",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Fonctions de référence</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Fonction carré : f(x) = x²</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Propriétés :</strong></p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Domaine de définition : ℝ</li>
              <li>Ensemble image : [0 ; +∞[</li>
              <li>Parité : fonction paire (symétrie par rapport à l'axe des ordonnées)</li>
              <li>Variations : décroissante sur ]-∞ ; 0] et croissante sur [0 ; +∞[</li>
              <li>Minimum en x = 0 : f(0) = 0</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Fonction inverse : f(x) = 1/x</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Propriétés :</strong></p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Domaine de définition : ℝ* = ℝ \ {0}</li>
              <li>Parité : fonction impaire (symétrie par rapport à l'origine)</li>
              <li>Variations : décroissante sur ]-∞ ; 0[ et sur ]0 ; +∞[</li>
              <li>Asymptotes : x = 0 (verticale) et y = 0 (horizontale)</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Fonction racine carrée : f(x) = √x</h3>
          <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Propriétés :</strong></p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Domaine de définition : [0 ; +∞[</li>
              <li>Ensemble image : [0 ; +∞[</li>
              <li>Variations : croissante sur [0 ; +∞[</li>
              <li>Point remarquable : f(0) = 0 et f(1) = 1</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Tableau comparatif</h3>
          <table class="w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-800">
                <th class="border border-gray-300 dark:border-gray-700 p-2">Fonction</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2">Domaine</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2">Parité</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2">Variations</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">x²</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">ℝ</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Paire</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">↘ puis ↗</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">1/x</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">ℝ*</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Impaire</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">↘ sur chaque intervalle</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">√x</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">[0;+∞[</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Ni paire ni impaire</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">↗</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    `
  },

  // ===== LYCÉE - 1ère =====
  16: {
    title: "Dérivation",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">La dérivation</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Nombre dérivé</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Définition :</strong></p>
            <p class="mb-3">Le nombre dérivé de f en a est la limite (si elle existe) :</p>
            <p class="font-mono text-lg text-center mb-3">f'(a) = lim[h→0] [f(a+h) - f(a)] / h</p>
            <p class="text-sm"><strong>Interprétation :</strong> f'(a) est le coefficient directeur de la tangente à la courbe au point d'abscisse a.</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Dérivées usuelles</h3>
          <table class="w-full border-collapse border border-gray-300 dark:border-gray-700 mb-4">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-800">
                <th class="border border-gray-300 dark:border-gray-700 p-3">Fonction f(x)</th>
                <th class="border border-gray-300 dark:border-gray-700 p-3">Dérivée f'(x)</th>
                <th class="border border-gray-300 dark:border-gray-700 p-3">Domaine</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">k (constante)</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">0</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">ℝ</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">x</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">1</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">ℝ</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">xⁿ</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">n·xⁿ⁻¹</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">ℝ</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">√x</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">1/(2√x)</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">]0;+∞[</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">1/x</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">-1/x²</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">ℝ*</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Opérations sur les dérivées</h3>
          <div class="space-y-4">
            <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Somme :</p>
              <p class="font-mono">(u + v)' = u' + v'</p>
            </div>
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Produit par une constante :</p>
              <p class="font-mono">(k·u)' = k·u'</p>
            </div>
            <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Produit :</p>
              <p class="font-mono">(u·v)' = u'·v + u·v'</p>
            </div>
            <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Quotient :</p>
              <p class="font-mono">(u/v)' = (u'·v - u·v') / v²</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Applications</h3>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Étude de variations :</strong> f'(x) > 0 ⟹ f croissante, f'(x) < 0 ⟹ f décroissante</li>
              <li><strong>Extremums :</strong> Si f'(a) = 0 et f' change de signe en a, alors f admet un extremum local en a</li>
              <li><strong>Équation de tangente :</strong> y = f'(a)(x - a) + f(a)</li>
            </ul>
          </div>
        </section>
      </div>
    `
  },

  14: {
    title: "Vecteurs",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Les vecteurs du plan</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Définition</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Un vecteur est caractérisé par :</p>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Une direction</strong> (la droite sur laquelle il se trouve)</li>
              <li><strong>Un sens</strong> (indiqué par une flèche)</li>
              <li><strong>Une norme</strong> (sa longueur, notée ||→u||)</li>
            </ul>
            <p class="mt-3 font-mono text-center">→AB désigne le vecteur d'origine A et d'extrémité B</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Égalité de vecteurs</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Deux vecteurs sont égaux s'ils ont :</strong></p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Même direction</li>
              <li>Même sens</li>
              <li>Même norme</li>
            </ul>
            <p class="mt-3 text-sm">Conséquence : →AB = →CD ⟺ ABDC est un parallélogramme</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Opérations sur les vecteurs</h3>
          <div class="space-y-4">
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Addition (Relation de Chasles)</h4>
              <p class="font-mono mb-2">→AB + →BC = →AC</p>
              <p class="text-sm">Pour additionner deux vecteurs, on met le bout du premier au début du second</p>
            </div>
            
            <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Multiplication par un scalaire</h4>
              <p class="font-mono mb-2">k·→u a même direction que →u</p>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li>Si k > 0 : même sens</li>
                <li>Si k < 0 : sens opposé</li>
                <li>Norme : ||k·→u|| = |k| × ||→u||</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Coordonnées d'un vecteur</h3>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Dans un repère (O; →i, →j), si A(xₐ; yₐ) et B(xᵦ; yᵦ) :</p>
            <p class="font-mono text-center text-lg mb-3">→AB = (xᵦ - xₐ; yᵦ - yₐ)</p>
            <p class="mb-2"><strong>Norme :</strong></p>
            <p class="font-mono text-center">||→AB|| = √[(xᵦ - xₐ)² + (yᵦ - yₐ)²]</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Colinéarité</h3>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p class="mb-3">Deux vecteurs →u(x; y) et →v(x'; y') sont colinéaires si :</p>
            <p class="font-mono text-center text-lg mb-3">xy' - yx' = 0</p>
            <p class="text-sm"><strong>Conséquence :</strong> Les points A, B, C sont alignés ⟺ →AB et →AC sont colinéaires</p>
          </div>
        </section>
      </div>
    `
  },

  15: {
    title: "Statistiques",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Statistiques descriptives</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Indicateurs de position</h3>
          <div class="space-y-4">
            <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Moyenne</h4>
              <p class="font-mono mb-2">x̄ = (x₁ + x₂ + ... + xₙ) / n</p>
              <p class="text-sm">Ou avec effectifs : x̄ = Σ(nᵢ × xᵢ) / N</p>
            </div>
            
            <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Médiane</h4>
              <p class="text-sm mb-2">Valeur qui partage la série en deux parties égales</p>
              <p class="text-sm">50% des valeurs sont inférieures, 50% sont supérieures</p>
            </div>
            
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Quartiles</h4>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li><strong>Q₁</strong> : 25% des valeurs sont inférieures</li>
                <li><strong>Q₂</strong> : la médiane (50%)</li>
                <li><strong>Q₃</strong> : 75% des valeurs sont inférieures</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Indicateurs de dispersion</h3>
          <div class="space-y-4">
            <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Étendue</h4>
              <p class="font-mono mb-2">E = max - min</p>
              <p class="text-sm">Différence entre la plus grande et la plus petite valeur</p>
            </div>
            
            <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Écart interquartile</h4>
              <p class="font-mono mb-2">EI = Q₃ - Q₁</p>
              <p class="text-sm">Mesure la dispersion des 50% de valeurs centrales</p>
            </div>
            
            <div class="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Écart-type</h4>
              <p class="font-mono text-sm mb-2">σ = √[Σ(xᵢ - x̄)² / n]</p>
              <p class="text-sm">Mesure la dispersion moyenne autour de la moyenne</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Diagramme en boîte</h3>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Le diagramme en boîte (ou box plot) représente :</strong></p>
            <ul class="list-disc pl-6 space-y-2">
              <li>La valeur minimale</li>
              <li>Le premier quartile Q₁</li>
              <li>La médiane</li>
              <li>Le troisième quartile Q₃</li>
              <li>La valeur maximale</li>
            </ul>
            <p class="mt-3 text-sm text-center text-muted-foreground">[min]——[Q₁|Med|Q₃]——[max]</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Exemple complet</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p class="mb-3"><strong>Série :</strong> 12, 15, 15, 18, 20, 22, 25, 28, 30</p>
            <table class="w-full border-collapse border border-gray-300 dark:border-gray-700 mt-3">
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Moyenne</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">x̄ = 20,6</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Médiane</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">20</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Q₁</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">15</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Q₃</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">26,5</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Étendue</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">30 - 12 = 18</td>
              </tr>
            </table>
          </div>
        </section>
      </div>
    `
  },

  17: {
    title: "Suites numériques",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Les suites numériques</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Définition</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Une suite numérique est une fonction de ℕ dans ℝ qui associe à chaque entier n un nombre réel uₙ.</p>
            <p class="mb-2"><strong>Notations :</strong></p>
            <ul class="list-disc pl-6 space-y-1">
              <li>(uₙ) désigne la suite</li>
              <li>uₙ désigne le terme de rang n</li>
              <li>u₀ est le premier terme</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Suites arithmétiques</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Définition :</strong> Suite où chaque terme s'obtient en ajoutant une constante r (raison)</p>
            <div class="space-y-2">
              <p class="font-mono">uₙ₊₁ = uₙ + r</p>
              <p class="font-mono">uₙ = u₀ + n×r</p>
              <p class="font-mono">Somme : Sₙ = (n+1)×(u₀ + uₙ)/2</p>
            </div>
            <p class="mt-3 text-sm"><strong>Exemple :</strong> u₀ = 5, r = 3 ⟹ 5, 8, 11, 14, 17, ...</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Suites géométriques</h3>
          <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Définition :</strong> Suite où chaque terme s'obtient en multipliant par une constante q (raison)</p>
            <div class="space-y-2">
              <p class="font-mono">uₙ₊₁ = uₙ × q</p>
              <p class="font-mono">uₙ = u₀ × qⁿ</p>
              <p class="font-mono">Somme (q≠1) : Sₙ = u₀ × (1 - qⁿ⁺¹)/(1 - q)</p>
            </div>
            <p class="mt-3 text-sm"><strong>Exemple :</strong> u₀ = 2, q = 3 ⟹ 2, 6, 18, 54, 162, ...</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Sens de variation</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Suite croissante</h4>
              <p class="font-mono text-sm mb-2">uₙ₊₁ ≥ uₙ pour tout n</p>
              <p class="text-sm">ou uₙ₊₁ - uₙ ≥ 0</p>
            </div>
            <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Suite décroissante</h4>
              <p class="font-mono text-sm mb-2">uₙ₊₁ ≤ uₙ pour tout n</p>
              <p class="text-sm">ou uₙ₊₁ - uₙ ≤ 0</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Limite d'une suite</h3>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Suite convergente :</strong> lim(uₙ) = L (un nombre fini)</li>
              <li><strong>Suite divergente :</strong> lim(uₙ) = +∞ ou -∞</li>
              <li><strong>Suite géométrique :</strong>
                <ul class="list-circle pl-6 mt-1 space-y-1 text-sm">
                  <li>Si |q| < 1 : lim(qⁿ) = 0</li>
                  <li>Si q > 1 : lim(qⁿ) = +∞</li>
                  <li>Si q ≤ -1 : pas de limite</li>
                </ul>
              </li>
            </ul>
          </div>
        </section>
      </div>
    `
  },

  18: {
    title: "Probabilités",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Probabilités et variables aléatoires</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Vocabulaire de base</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Expérience aléatoire :</strong> Expérience dont on ne peut pas prévoir le résultat</li>
              <li><strong>Univers (Ω) :</strong> Ensemble de tous les résultats possibles</li>
              <li><strong>Événement :</strong> Sous-ensemble de l'univers</li>
              <li><strong>Probabilité :</strong> Nombre entre 0 et 1 mesurant la chance qu'un événement se réalise</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Propriétés des probabilités</h3>
          <div class="space-y-3">
            <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <p class="font-mono mb-2">0 ≤ P(A) ≤ 1</p>
              <p class="font-mono mb-2">P(Ω) = 1</p>
              <p class="font-mono">P(∅) = 0</p>
            </div>
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Événement contraire :</p>
              <p class="font-mono">P(Ā) = 1 - P(A)</p>
            </div>
            <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Événements incompatibles :</p>
              <p class="font-mono">P(A ∪ B) = P(A) + P(B)</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Probabilités conditionnelles</h3>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Définition :</strong> Probabilité de A sachant que B est réalisé</p>
            <p class="font-mono text-lg text-center mb-3">P_B(A) = P(A ∩ B) / P(B)</p>
            <p class="text-sm"><strong>Formule des probabilités composées :</strong></p>
            <p class="font-mono text-center">P(A ∩ B) = P(A) × P_A(B)</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Variables aléatoires</h3>
          <div class="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Variable aléatoire discrète X :</strong> fonction qui associe un nombre à chaque issue</p>
            <p class="mb-2"><strong>Loi de probabilité :</strong> Tableau donnant P(X = xᵢ) pour chaque valeur</p>
            <table class="w-full border-collapse border border-gray-300 dark:border-gray-700 mt-3">
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">xᵢ</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">x₁</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">x₂</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">...</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">xₙ</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">P(X=xᵢ)</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">p₁</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">p₂</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">...</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">pₙ</td>
              </tr>
            </table>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Espérance et variance</h3>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div class="space-y-3">
              <div>
                <p class="font-semibold mb-1">Espérance :</p>
                <p class="font-mono">E(X) = Σ xᵢ × P(X = xᵢ)</p>
                <p class="text-sm text-muted-foreground">Valeur moyenne de X</p>
              </div>
              <div>
                <p class="font-semibold mb-1">Variance :</p>
                <p class="font-mono">V(X) = E(X²) - [E(X)]²</p>
                <p class="text-sm text-muted-foreground">Mesure de dispersion</p>
              </div>
              <div>
                <p class="font-semibold mb-1">Écart-type :</p>
                <p class="font-mono">σ(X) = √V(X)</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    `
  },

  // ===== LYCÉE - Terminale =====
  19: {
    title: "Intégration",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Calcul intégral</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Primitive d'une fonction</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Définition :</strong> F est une primitive de f sur I si F'(x) = f(x) pour tout x ∈ I</p>
            <p class="text-sm"><strong>Remarque :</strong> Si F est une primitive de f, alors F + C (où C est une constante) est aussi une primitive de f.</p>
          </div>

          <h4 class="font-semibold mb-3 mt-4">Primitives usuelles :</h4>
          <table class="w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-800">
                <th class="border border-gray-300 dark:border-gray-700 p-3">f(x)</th>
                <th class="border border-gray-300 dark:border-gray-700 p-3">F(x)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3">k (constante)</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3">kx + C</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3">xⁿ (n ≠ -1)</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3">xⁿ⁺¹/(n+1) + C</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3">1/x</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3">ln|x| + C</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3">eˣ</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3">eˣ + C</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3">cos(x)</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3">sin(x) + C</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3">sin(x)</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3">-cos(x) + C</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3 mt-6">2. Intégrale définie</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Notation :</strong> ∫ₐᵇ f(x)dx représente l'aire algébrique sous la courbe de f entre a et b</p>
            <p class="mb-3"><strong>Calcul :</strong> ∫ₐᵇ f(x)dx = [F(x)]ₐᵇ = F(b) - F(a)</p>
          </div>

          <h4 class="font-semibold mb-3">Propriétés importantes :</h4>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li>Linéarité : ∫ₐᵇ [k·f(x) + g(x)]dx = k·∫ₐᵇ f(x)dx + ∫ₐᵇ g(x)dx</li>
            <li>Relation de Chasles : ∫ₐᵇ f(x)dx + ∫ᵇᶜ f(x)dx = ∫ₐᶜ f(x)dx</li>
            <li>Inversion des bornes : ∫ₐᵇ f(x)dx = -∫ᵇₐ f(x)dx</li>
          </ul>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Méthodes d'intégration</h3>
          
          <div class="space-y-4">
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Intégration par parties</h4>
              <p class="font-mono mb-2">∫ u(x)v'(x)dx = u(x)v(x) - ∫ u'(x)v(x)dx</p>
              <p class="text-sm"><strong>Exemple :</strong> ∫ x·eˣdx avec u=x et v'=eˣ</p>
            </div>

            <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Changement de variable</h4>
              <p class="mb-2">Si x = φ(t), alors dx = φ'(t)dt</p>
              <p class="font-mono text-sm">∫ₐᵇ f(x)dx = ∫ᵩ⁻¹⁽ᵃ⁾ᵩ⁻¹⁽ᵇ⁾ f(φ(t))·φ'(t)dt</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3 mt-6">4. Applications</h3>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Calcul d'aires :</strong> Aire entre f et l'axe des abscisses = ∫ₐᵇ |f(x)|dx</li>
              <li><strong>Valeur moyenne :</strong> μ = (1/(b-a))·∫ₐᵇ f(x)dx</li>
              <li><strong>Volume de révolution :</strong> V = π·∫ₐᵇ [f(x)]²dx</li>
            </ul>
          </div>
        </section>
      </div>
    `
  },

  6: {
    title: "Triangles",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Les triangles - Propriétés et constructions</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Inégalité triangulaire</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Propriété fondamentale :</strong></p>
            <p class="mb-3">Dans un triangle, la longueur de chaque côté est inférieure à la somme des longueurs des deux autres côtés.</p>
            <p class="font-mono text-center">AB < AC + BC</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Triangles particuliers</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2 text-green-700 dark:text-green-400">Triangle équilatéral</h4>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li>3 côtés égaux</li>
                <li>3 angles de 60°</li>
                <li>3 axes de symétrie</li>
              </ul>
            </div>
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2 text-yellow-700 dark:text-yellow-400">Triangle isocèle</h4>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li>2 côtés égaux</li>
                <li>2 angles égaux (angles à la base)</li>
                <li>1 axe de symétrie</li>
              </ul>
            </div>
            <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2 text-purple-700 dark:text-purple-400">Triangle rectangle</h4>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li>1 angle droit (90°)</li>
                <li>Hypoténuse = côté le plus long</li>
                <li>Somme des 2 autres angles = 90°</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Somme des angles</h3>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg mb-4">
            <p class="font-semibold mb-2">Théorème fondamental :</p>
            <p class="text-lg text-center font-mono mb-2">α + β + γ = 180°</p>
            <p class="text-sm">La somme des mesures des angles d'un triangle vaut toujours 180°</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Construction de triangles</h3>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p class="font-semibold mb-3">Méthodes de construction :</p>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>3 côtés donnés :</strong> Utiliser le compas pour tracer les arcs</li>
              <li><strong>2 côtés et 1 angle :</strong> Tracer l'angle puis les côtés</li>
              <li><strong>1 côté et 2 angles :</strong> Tracer le côté puis les angles</li>
            </ul>
          </div>
        </section>
      </div>
    `
  },

  // ===== COLLÈGE - 3ème =====
  9: {
    title: "Proportionnalité",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Proportionnalité</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Définition</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Deux grandeurs sont proportionnelles si on peut passer de l'une à l'autre en multipliant toujours par le même nombre (appelé <strong>coefficient de proportionnalité</strong>).</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Tableau de proportionnalité</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Exemple :</strong> Prix des pommes à 2,50 € le kg</p>
            <table class="w-full border-collapse border border-gray-300 dark:border-gray-700 mb-3">
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Masse (kg)</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">1</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">2</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">3</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">5</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Prix (€)</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">2,50</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">5,00</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">7,50</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">12,50</td>
              </tr>
            </table>
            <p class="text-sm">Coefficient de proportionnalité = 2,50</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Propriétés</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Additivité</h4>
              <p class="text-sm mb-2">On peut additionner les colonnes</p>
              <p class="font-mono text-xs">Si 2kg → 5€ et 3kg → 7,50€</p>
              <p class="font-mono text-xs">Alors 5kg → 12,50€</p>
            </div>
            <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Multiplicativité</h4>
              <p class="text-sm mb-2">On peut multiplier une colonne</p>
              <p class="font-mono text-xs">Si 2kg → 5€</p>
              <p class="font-mono text-xs">Alors 6kg (×3) → 15€ (×3)</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Pourcentages</h3>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <p class="mb-3">Un pourcentage est un cas particulier de proportionnalité où le coefficient est exprimé sur 100.</p>
            <p class="mb-2"><strong>Exemple :</strong> 25% = 25/100 = 0,25</p>
            <p class="font-mono">Calculer 25% de 80 € = 80 × 0,25 = 20 €</p>
          </div>
        </section>
      </div>
    `
  },

  10: {
    title: "Équations",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Résolution d'équations du premier degré</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Qu'est-ce qu'une équation ?</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Une équation est une égalité comportant une ou plusieurs inconnues.</p>
            <p class="font-mono text-center mb-2">2x + 5 = 13</p>
            <p class="text-sm"><strong>Résoudre une équation :</strong> c'est trouver la (ou les) valeur(s) de l'inconnue qui rend l'égalité vraie.</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Règles de transformation</h3>
          <div class="space-y-4">
            <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Règle 1 : Addition/Soustraction</h4>
              <p class="text-sm mb-2">On peut ajouter ou soustraire le même nombre aux deux membres</p>
              <p class="font-mono text-sm">Si x + 3 = 7</p>
              <p class="font-mono text-sm">Alors x + 3 - 3 = 7 - 3</p>
              <p class="font-mono text-sm font-semibold">x = 4</p>
            </div>
            
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Règle 2 : Multiplication/Division</h4>
              <p class="text-sm mb-2">On peut multiplier ou diviser les deux membres par un même nombre non nul</p>
              <p class="font-mono text-sm">Si 3x = 12</p>
              <p class="font-mono text-sm">Alors 3x ÷ 3 = 12 ÷ 3</p>
              <p class="font-mono text-sm font-semibold">x = 4</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Méthode de résolution</h3>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg mb-4">
            <p class="font-semibold mb-3">Exemple complet : Résoudre 5x - 7 = 2x + 8</p>
            <div class="space-y-2 font-mono text-sm">
              <p>5x - 7 = 2x + 8</p>
              <p>5x - 2x = 8 + 7 <span class="text-muted-foreground">(regrouper les x d'un côté)</span></p>
              <p>3x = 15 <span class="text-muted-foreground">(simplifier)</span></p>
              <p>x = 15 ÷ 3 <span class="text-muted-foreground">(diviser par 3)</span></p>
              <p class="font-semibold text-lg">x = 5</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Vérification</h3>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p class="mb-2"><strong>Toujours vérifier la solution !</strong></p>
            <p class="mb-2">Pour x = 5 dans 5x - 7 = 2x + 8 :</p>
            <p class="font-mono text-sm">Membre gauche : 5×5 - 7 = 25 - 7 = 18</p>
            <p class="font-mono text-sm">Membre droit : 2×5 + 8 = 10 + 8 = 18</p>
            <p class="font-semibold text-green-600 dark:text-green-400 mt-2">✓ L'égalité est vérifiée</p>
          </div>
        </section>
      </div>
    `
  },

  11: {
    title: "Fonctions linéaires",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Fonctions linéaires et affines</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Fonction linéaire</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Définition :</strong> Une fonction linéaire est une fonction de la forme :</p>
            <p class="font-mono text-xl text-center mb-3">f(x) = ax</p>
            <p class="text-sm">où <strong>a</strong> est un nombre appelé <strong>coefficient directeur</strong></p>
            <p class="mt-3"><strong>Propriété :</strong> La représentation graphique est une droite qui passe par l'origine</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Fonction affine</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Définition :</strong> Une fonction affine est une fonction de la forme :</p>
            <p class="font-mono text-xl text-center mb-3">f(x) = ax + b</p>
            <ul class="list-disc pl-6 space-y-1 text-sm">
              <li><strong>a</strong> : coefficient directeur (pente de la droite)</li>
              <li><strong>b</strong> : ordonnée à l'origine (où la droite coupe l'axe des y)</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Représentation graphique</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Si a > 0</h4>
              <p class="text-sm">La fonction est <strong>croissante</strong></p>
              <p class="text-sm">La droite "monte"</p>
            </div>
            <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Si a < 0</h4>
              <p class="text-sm">La fonction est <strong>décroissante</strong></p>
              <p class="text-sm">La droite "descend"</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Déterminer une fonction affine</h3>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
            <p class="font-semibold mb-3">Exemple : Trouver f(x) = ax + b sachant que f(2) = 5 et f(4) = 11</p>
            <div class="space-y-2 font-mono text-sm">
              <p>f(2) = 2a + b = 5</p>
              <p>f(4) = 4a + b = 11</p>
              <p class="mt-2">Par soustraction : 2a = 6 donc a = 3</p>
              <p>Puis : 2×3 + b = 5 donc b = -1</p>
              <p class="font-semibold text-lg mt-3">f(x) = 3x - 1</p>
            </div>
          </div>
        </section>
      </div>
    `
  },

  12: {
    title: "Trigonométrie",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Trigonométrie dans le triangle rectangle</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Les trois rapports trigonométriques</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Dans un triangle rectangle, pour un angle aigu α :</p>
            <table class="w-full border-collapse border border-gray-300 dark:border-gray-700">
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3 font-semibold">Sinus</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3 font-mono">sin(α) = côté opposé / hypoténuse</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3 font-semibold">Cosinus</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3 font-mono">cos(α) = côté adjacent / hypoténuse</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3 font-semibold">Tangente</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3 font-mono">tan(α) = côté opposé / côté adjacent</td>
              </tr>
            </table>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Mnémotechnique : SOHCAHTOA</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="text-center">
                <p class="font-bold text-lg mb-1">SOH</p>
                <p class="text-sm"><strong>S</strong>in = <strong>O</strong>pposé / <strong>H</strong>ypoténuse</p>
              </div>
              <div class="text-center">
                <p class="font-bold text-lg mb-1">CAH</p>
                <p class="text-sm"><strong>C</strong>os = <strong>A</strong>djacent / <strong>H</strong>ypoténuse</p>
              </div>
              <div class="text-center">
                <p class="font-bold text-lg mb-1">TOA</p>
                <p class="text-sm"><strong>T</strong>an = <strong>O</strong>pposé / <strong>A</strong>djacent</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Calculer une longueur</h3>
          <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg mb-4">
            <p class="font-semibold mb-2">Exemple :</p>
            <p class="text-sm mb-3">Triangle rectangle en A, angle B = 30°, BC = 10 cm. Calculer AC.</p>
            <div class="font-mono text-sm space-y-1">
              <p>AC est le côté opposé à l'angle B</p>
              <p>sin(30°) = AC / BC</p>
              <p>AC = BC × sin(30°)</p>
              <p>AC = 10 × 0,5</p>
              <p class="font-semibold text-base">AC = 5 cm</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Calculer un angle</h3>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
            <p class="font-semibold mb-2">Exemple :</p>
            <p class="text-sm mb-3">Triangle rectangle, côté opposé = 6 cm, hypoténuse = 10 cm. Calculer l'angle.</p>
            <div class="font-mono text-sm space-y-1">
              <p>sin(α) = 6 / 10 = 0,6</p>
              <p>α = sin⁻¹(0,6)</p>
              <p class="font-semibold text-base">α ≈ 36,87°</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Valeurs remarquables</h3>
          <table class="w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-800">
                <th class="border border-gray-300 dark:border-gray-700 p-2">Angle</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2">sin</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2">cos</th>
                <th class="border border-gray-300 dark:border-gray-700 p-2">tan</th>
              </tr>
            </thead>
            <tbody class="text-center">
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">30°</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">1/2</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">√3/2</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">√3/3</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">45°</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">√2/2</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">√2/2</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">1</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">60°</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">√3/2</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">1/2</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">√3</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    `
  },

  20: {
    title: "Nombres complexes",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Les nombres complexes</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Définition</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Un nombre complexe z s'écrit sous la forme :</p>
            <p class="font-mono text-xl text-center mb-3">z = a + ib</p>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>a</strong> : partie réelle Re(z)</li>
              <li><strong>b</strong> : partie imaginaire Im(z)</li>
              <li><strong>i</strong> : unité imaginaire telle que i² = -1</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Opérations</h3>
          <div class="space-y-3">
            <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Addition :</p>
              <p class="font-mono">(a+ib) + (c+id) = (a+c) + i(b+d)</p>
            </div>
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Multiplication :</p>
              <p class="font-mono">(a+ib)(c+id) = (ac-bd) + i(ad+bc)</p>
            </div>
            <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Conjugué :</p>
              <p class="font-mono">z̄ = a - ib</p>
              <p class="text-sm mt-2">Propriété : z × z̄ = a² + b²</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Module et argument</h3>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Module :</strong></p>
            <p class="font-mono text-center mb-3">|z| = √(a² + b²)</p>
            <p class="mb-3"><strong>Argument :</strong></p>
            <p class="text-sm">θ tel que z = |z|(cos θ + i sin θ)</p>
            <p class="font-mono text-center mt-2">tan θ = b/a</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Forme exponentielle</h3>
          <div class="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg mb-4">
            <p class="font-mono text-xl text-center mb-3">z = r e^(iθ)</p>
            <p class="mb-3">où r = |z| et θ = arg(z)</p>
            <p class="font-semibold mb-2">Formule d'Euler :</p>
            <p class="font-mono text-center">e^(iθ) = cos θ + i sin θ</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Formules de Moivre</h3>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p class="font-mono text-center text-lg mb-3">(cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ)</p>
            <p class="text-sm"><strong>Application :</strong> Linéarisation de cos³(x), sin⁴(x), etc.</p>
          </div>
        </section>
      </div>
    `
  },

  21: {
    title: "Logarithmes",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Fonction logarithme népérien</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Définition</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3">La fonction logarithme népérien ln est la fonction réciproque de la fonction exponentielle.</p>
            <p class="font-mono text-center text-lg mb-3">y = ln(x) ⟺ x = e^y</p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Domaine : ]0 ; +∞[</li>
              <li>Image : ℝ</li>
              <li>ln(1) = 0</li>
              <li>ln(e) = 1</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Propriétés algébriques</h3>
          <table class="w-full border-collapse border border-gray-300 dark:border-gray-700 mb-4">
            <tbody>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3">Produit</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3 font-mono">ln(ab) = ln(a) + ln(b)</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3">Quotient</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3 font-mono">ln(a/b) = ln(a) - ln(b)</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3">Puissance</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3 font-mono">ln(aⁿ) = n×ln(a)</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3">Racine</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3 font-mono">ln(√a) = ln(a)/2</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-3">Inverse</td>
                <td class="border border-gray-300 dark:border-gray-700 p-3 font-mono">ln(1/a) = -ln(a)</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Étude de la fonction</h3>
          <div class="space-y-3">
            <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Dérivée :</p>
              <p class="font-mono">ln'(x) = 1/x</p>
            </div>
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Variations :</p>
              <p>Strictement croissante sur ]0 ; +∞[</p>
            </div>
            <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Limites :</p>
              <p class="font-mono">lim[x→0⁺] ln(x) = -∞</p>
              <p class="font-mono">lim[x→+∞] ln(x) = +∞</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Équations et inéquations</h3>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Équations :</strong></p>
            <p class="font-mono mb-2">ln(x) = a ⟺ x = e^a</p>
            <p class="font-mono mb-3">ln(x) = ln(y) ⟺ x = y (si x, y > 0)</p>
            <p class="mb-3 mt-4"><strong>Inéquations :</strong></p>
            <p class="font-mono">ln(x) < ln(y) ⟺ x < y (car ln croissante)</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Applications</h3>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Croissance exponentielle/logarithmique</strong> : Démographie, finance</li>
              <li><strong>Échelle logarithmique</strong> : Décibels, pH, magnitude</li>
              <li><strong>Résolution d'équations</strong> : 2^x = 5 ⟹ x = ln(5)/ln(2)</li>
              <li><strong>Intégration</strong> : ∫ 1/x dx = ln|x| + C</li>
            </ul>
          </div>
        </section>
      </div>
    `
  },

  // ===== SUPÉRIEUR - Licence =====
  22: {
    title: "Analyse réelle",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Analyse réelle - Suites et séries</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Convergence de suites</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Suite de Cauchy :</strong></p>
            <p class="font-mono text-sm mb-3">∀ε > 0, ∃N : ∀m,n ≥ N, |uₙ - uₘ| < ε</p>
            <p class="font-semibold">Théorème : ℝ est complet (toute suite de Cauchy converge)</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Séries numériques</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Une série Σuₙ converge si la suite des sommes partielles Sₙ = Σᵏ₌₀ⁿ uₖ converge</p>
            <p class="font-semibold mb-2">Condition nécessaire :</p>
            <p class="font-mono">Si Σuₙ converge alors lim(uₙ) = 0</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Critères de convergence</h3>
          <div class="space-y-3">
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Critère de d'Alembert :</p>
              <p class="font-mono text-sm">Si lim |uₙ₊₁/uₙ| = ℓ < 1 → converge</p>
            </div>
            <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Critère de Cauchy :</p>
              <p class="font-mono text-sm">Si lim ⁿ√|uₙ| = ℓ < 1 → converge</p>
            </div>
            <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Séries alternées (Leibniz) :</p>
              <p class="text-sm">Si |uₙ| décroît vers 0 → Σ(-1)ⁿuₙ converge</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Suites de fonctions</h3>
          <div class="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg mb-4">
            <p class="mb-2"><strong>Convergence simple :</strong> ∀x, fₙ(x) → f(x)</p>
            <p class="mb-2"><strong>Convergence uniforme :</strong></p>
            <p class="font-mono text-sm">∀ε > 0, ∃N : ∀n ≥ N, ∀x, |fₙ(x) - f(x)| < ε</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Séries entières</h3>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p class="mb-3">Série de la forme Σaₙxⁿ</p>
            <p class="font-semibold mb-2">Rayon de convergence R :</p>
            <p class="font-mono text-sm mb-2">1/R = lim sup ⁿ√|aₙ|</p>
            <p class="text-sm">La série converge absolument pour |x| < R</p>
          </div>
        </section>
      </div>
    `
  },

  23: {
    title: "Algèbre linéaire",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Algèbre linéaire</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Espaces vectoriels</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Définition :</strong> Un espace vectoriel E sur 𝕂 vérifie :</p>
            <ul class="list-disc pl-6 space-y-1 text-sm">
              <li>(E, +) est un groupe commutatif</li>
              <li>Multiplication par scalaire : 𝕂 × E → E</li>
              <li>Associativité : λ(μv) = (λμ)v</li>
              <li>Distributivité : (λ+μ)v = λv + μv</li>
              <li>1·v = v</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Bases et dimension</h3>
          <div class="space-y-3">
            <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Base :</p>
              <p class="text-sm">Famille libre et génératrice</p>
              <p class="text-sm">Tout vecteur s'écrit de manière unique comme combinaison linéaire</p>
            </div>
            <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <p class="font-semibold mb-2">Dimension :</p>
              <p class="text-sm">Nombre d'éléments d'une base</p>
              <p class="text-sm">Toutes les bases ont le même cardinal</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Applications linéaires</h3>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Définition :</strong> f : E → F est linéaire si :</p>
            <p class="font-mono text-sm mb-2">f(u + v) = f(u) + f(v)</p>
            <p class="font-mono text-sm">f(λu) = λf(u)</p>
            <p class="mt-3"><strong>Propriétés :</strong></p>
            <ul class="list-disc pl-6 space-y-1 text-sm mt-2">
              <li>Ker(f) = {x ∈ E : f(x) = 0} est un s.e.v de E</li>
              <li>Im(f) = {f(x) : x ∈ E} est un s.e.v de F</li>
              <li>dim(Ker f) + dim(Im f) = dim(E)</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Matrices</h3>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Matrice associée à une application linéaire dans des bases données</p>
            <table class="w-full border-collapse border border-gray-300 dark:border-gray-700 mt-3">
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Rang</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">rg(A) = dim(Im A)</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Trace</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Tr(A) = Σaᵢᵢ</td>
              </tr>
              <tr>
                <td class="border border-gray-300 dark:border-gray-700 p-2">Déterminant</td>
                <td class="border border-gray-300 dark:border-gray-700 p-2">det(AB) = det(A)det(B)</td>
              </tr>
            </table>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Diagonalisation</h3>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p class="mb-3"><strong>Valeur propre λ :</strong> ∃v ≠ 0, Av = λv</p>
            <p class="mb-3"><strong>Vecteur propre :</strong> v ≠ 0 associé à λ</p>
            <p class="font-semibold mb-2">A diagonalisable ⟺</p>
            <p class="text-sm">∃ base de vecteurs propres</p>
            <p class="font-mono text-sm mt-2">A = PDP⁻¹ où D diagonale</p>
          </div>
        </section>
      </div>
    `
  },

  24: {
    title: "Probabilités avancées",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Probabilités - Lois continues</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Variables aléatoires continues</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3">X variable aléatoire continue avec densité f(x) :</p>
            <p class="font-mono text-sm mb-2">P(a ≤ X ≤ b) = ∫ₐᵇ f(x)dx</p>
            <p class="font-mono text-sm mb-2">∫₋∞⁺∞ f(x)dx = 1</p>
            <p class="font-mono text-sm">f(x) ≥ 0</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Loi uniforme</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="mb-3">X suit U([a,b]) si sa densité est :</p>
            <p class="font-mono text-center mb-3">f(x) = 1/(b-a) si x ∈ [a,b], 0 sinon</p>
            <p class="font-mono text-sm">E(X) = (a+b)/2</p>
            <p class="font-mono text-sm">V(X) = (b-a)²/12</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Loi normale (Gaussienne)</h3>
          <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg mb-4">
            <p class="mb-3">X suit N(μ, σ²) avec densité :</p>
            <p class="font-mono text-sm text-center mb-3">f(x) = (1/(σ√(2π))) e^(-(x-μ)²/(2σ²))</p>
            <ul class="list-disc pl-6 space-y-1 text-sm">
              <li>E(X) = μ (moyenne)</li>
              <li>V(X) = σ² (variance)</li>
              <li>σ = écart-type</li>
            </ul>
            <p class="mt-3 font-semibold">Loi normale centrée réduite : N(0,1)</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Loi exponentielle</h3>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg mb-4">
            <p class="mb-3">X suit E(λ) avec densité :</p>
            <p class="font-mono text-sm text-center mb-3">f(x) = λe^(-λx) si x ≥ 0, 0 sinon</p>
            <p class="font-mono text-sm">E(X) = 1/λ</p>
            <p class="font-mono text-sm">V(X) = 1/λ²</p>
            <p class="mt-3 text-sm"><strong>Propriété :</strong> Loi sans mémoire</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Théorèmes limites</h3>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg mb-4">
            <p class="font-semibold mb-2">Loi des grands nombres :</p>
            <p class="text-sm mb-3">La moyenne empirique converge vers l'espérance</p>
            <p class="font-semibold mb-2">Théorème central limite :</p>
            <p class="text-sm mb-2">Si Xᵢ i.i.d. avec E(X) = μ et V(X) = σ² :</p>
            <p class="font-mono text-sm">√n(X̄ₙ - μ)/σ →ᴸ N(0,1)</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">6. Intervalle de confiance</h3>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p class="mb-3">Pour μ avec X̄ moyenne observée et σ connu :</p>
            <p class="font-mono text-sm text-center">IC₉₅% = [X̄ - 1.96σ/√n, X̄ + 1.96σ/√n]</p>
          </div>
        </section>
      </div>
    `
  },

  // ===== SUPÉRIEUR - Master =====
  25: {
    title: "Analyse fonctionnelle",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Analyse fonctionnelle</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Espaces de Banach</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Définition :</strong> Espace vectoriel normé complet</p>
            <ul class="list-disc pl-6 space-y-2 text-sm">
              <li>Norme : ||·|| : E → ℝ₊</li>
              <li>Complet : toute suite de Cauchy converge</li>
              <li>Exemples : ℝⁿ, C([a,b]), Lᵖ</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Espaces de Hilbert</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Définition :</strong> Espace préhilbertien complet</p>
            <p class="font-mono text-sm mb-3">⟨·,·⟩ : H × H → 𝕂 (produit scalaire)</p>
            <p class="text-sm mb-2"><strong>Propriétés :</strong></p>
            <ul class="list-disc pl-6 space-y-1 text-sm">
              <li>Inégalité de Cauchy-Schwarz : |⟨x,y⟩| ≤ ||x|| ||y||</li>
              <li>Identité du parallélogramme</li>
              <li>Théorème de projection</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Opérateurs linéaires</h3>
          <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Opérateur borné :</strong> T : E → F linéaire</p>
            <p class="font-mono text-sm mb-2">||T|| = sup{||Tx|| : ||x|| ≤ 1}</p>
            <p class="text-sm mb-2"><strong>Théorème de Banach-Steinhaus :</strong></p>
            <p class="text-sm">Convergence simple + bornitude → convergence uniforme</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Théorème de Hahn-Banach</h3>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Prolongement de formes linéaires continues</p>
            <p class="text-sm">Toute forme linéaire continue sur un s.e.v peut être prolongée à l'espace entier en conservant sa norme</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Théorème du graphe fermé</h3>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <p class="mb-3">Si T : X → Y linéaire entre Banach</p>
            <p class="text-sm">T continue ⟺ Graph(T) fermé dans X × Y</p>
          </div>
        </section>
      </div>
    `
  },

  26: {
    title: "Géométrie différentielle",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Géométrie différentielle</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Variétés différentielles</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Définition :</strong> Espace qui localement ressemble à ℝⁿ</p>
            <p class="text-sm mb-2">Atlas : collection de cartes (U, φ)</p>
            <p class="text-sm">Transition C^∞ entre cartes</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Espace tangent</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="mb-3">TₚM : espace vectoriel des vecteurs tangents en p</p>
            <p class="text-sm mb-2">dim(TₚM) = dim(M)</p>
            <p class="font-mono text-sm">TM = ⋃ₚ∈M TₚM (fibré tangent)</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Formes différentielles</h3>
          <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>k-forme :</strong> Application antisymétrique sur (TₚM)^k</p>
            <p class="text-sm mb-2"><strong>Dérivée extérieure :</strong> d : Ω^k → Ω^(k+1)</p>
            <p class="font-mono text-sm">d ∘ d = 0</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Connexions</h3>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Dérivée covariante :</strong> ∇ : Γ(TM) × Γ(TM) → Γ(TM)</p>
            <p class="text-sm mb-2">Propriétés :</p>
            <ul class="list-disc pl-6 space-y-1 text-sm">
              <li>Linéarité en X</li>
              <li>Règle de Leibniz</li>
              <li>ℂ-linéarité en Y</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Courbure</h3>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <p class="mb-3"><strong>Tenseur de courbure :</strong></p>
            <p class="font-mono text-sm">R(X,Y)Z = ∇ₓ∇ᵧZ - ∇ᵧ∇ₓZ - ∇[X,Y]Z</p>
            <p class="text-sm mt-3">Mesure la non-commutativité de ∇</p>
          </div>
        </section>
      </div>
    `
  },

  27: {
    title: "Équations aux dérivées partielles",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Équations aux dérivées partielles (EDP)</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Classification des EDP</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Pour une EDP du second ordre : Au_xx + 2Bu_xy + Cu_yy = F</p>
            <ul class="list-disc pl-6 space-y-2 text-sm">
              <li><strong>Elliptique :</strong> B² - AC < 0 (Laplace, Poisson)</li>
              <li><strong>Parabolique :</strong> B² - AC = 0 (Chaleur)</li>
              <li><strong>Hyperbolique :</strong> B² - AC > 0 (Ondes)</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Équation de la chaleur</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="font-mono text-center mb-3">∂u/∂t = α Δu</p>
            <p class="text-sm mb-2"><strong>Solution fondamentale :</strong></p>
            <p class="font-mono text-sm">G(x,t) = (1/(4παt)^(n/2)) e^(-|x|²/(4αt))</p>
            <p class="text-sm mt-2">Régularisation instantanée</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Équation des ondes</h3>
          <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg mb-4">
            <p class="font-mono text-center mb-3">∂²u/∂t² = c² Δu</p>
            <p class="text-sm mb-2"><strong>Solution de d'Alembert (1D) :</strong></p>
            <p class="font-mono text-sm">u(x,t) = f(x-ct) + g(x+ct)</p>
            <p class="text-sm mt-2">Propagation à vitesse c</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Équation de Laplace</h3>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg mb-4">
            <p class="font-mono text-center mb-3">Δu = 0</p>
            <p class="text-sm mb-2"><strong>Propriétés des fonctions harmoniques :</strong></p>
            <ul class="list-disc pl-6 space-y-1 text-sm">
              <li>Principe du maximum</li>
              <li>Propriété de la moyenne</li>
              <li>Analyticité</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Méthodes de résolution</h3>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <ul class="list-disc pl-6 space-y-2 text-sm">
              <li><strong>Séparation de variables</strong></li>
              <li><strong>Transformée de Fourier</strong></li>
              <li><strong>Méthode des caractéristiques</strong></li>
              <li><strong>Méthode variationnelle</strong></li>
              <li><strong>Méthode de Galerkin</strong></li>
            </ul>
          </div>
        </section>
      </div>
    `
  },

  // ===== SUPÉRIEUR - Prépa =====
  28: {
    title: "Topologie",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Topologie générale</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Espaces métriques</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Métrique d :</strong> X × X → ℝ₊</p>
            <ul class="list-disc pl-6 space-y-2 text-sm">
              <li>d(x,y) = 0 ⟺ x = y</li>
              <li>Symétrie : d(x,y) = d(y,x)</li>
              <li>Inégalité triangulaire : d(x,z) ≤ d(x,y) + d(y,z)</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Ouverts et fermés</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Ouvert :</strong> U ouvert ⟺ ∀x∈U, ∃ε>0 : B(x,ε)⊂U</p>
            <p class="mb-3"><strong>Fermé :</strong> F fermé ⟺ Fᶜ ouvert</p>
            <p class="text-sm"><strong>Propriétés :</strong></p>
            <ul class="list-disc pl-6 space-y-1 text-sm mt-2">
              <li>Union d'ouverts = ouvert</li>
              <li>Intersection finie d'ouverts = ouvert</li>
              <li>∅ et X sont ouverts et fermés</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Continuité</h3>
          <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg mb-4">
            <p class="mb-3">f : X → Y continue en x :</p>
            <p class="font-mono text-sm mb-2">∀ε>0, ∃δ>0 : d(x,y)<δ ⟹ d(f(x),f(y))<ε</p>
            <p class="text-sm mt-3"><strong>Équivalent :</strong> f⁻¹(ouvert) = ouvert</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Compacité</h3>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Définitions équivalentes :</strong></p>
            <ul class="list-disc pl-6 space-y-2 text-sm">
              <li>Tout recouvrement ouvert admet un sous-recouvrement fini</li>
              <li>Toute suite admet une sous-suite convergente</li>
              <li>Fermé borné (dans ℝⁿ - Bolzano-Weierstrass)</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Connexité</h3>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <p class="mb-3">X connexe : pas d'écriture X = A ∪ B avec A,B ouverts disjoints non vides</p>
            <p class="text-sm"><strong>Connexe par arcs :</strong> ∀x,y ∃γ : [0,1] → X continue, γ(0)=x, γ(1)=y</p>
          </div>
        </section>
      </div>
    `
  },

  29: {
    title: "Réduction des endomorphismes",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Réduction des endomorphismes</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Valeurs et vecteurs propres</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3">λ valeur propre de u : E → E :</p>
            <p class="font-mono text-center mb-3">∃v≠0, u(v) = λv</p>
            <p class="text-sm mb-2"><strong>Polynôme caractéristique :</strong></p>
            <p class="font-mono text-sm">χ_A(λ) = det(A - λI)</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Diagonalisation</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>u diagonalisable ⟺</strong></p>
            <ul class="list-disc pl-6 space-y-2 text-sm">
              <li>∃ base de vecteurs propres</li>
              <li>Σ dim(Eλ) = dim(E)</li>
              <li>A = PDP⁻¹ avec D diagonale</li>
            </ul>
            <p class="text-sm mt-3"><strong>Critère :</strong> Si χ_A scindé et racines simples → diagonalisable</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Trigonalisation</h3>
          <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg mb-4">
            <p class="mb-3">u trigonalisable : ∃ base où Mat(u) triangulaire</p>
            <p class="text-sm mb-2"><strong>Théorème :</strong></p>
            <p class="text-sm">Sur ℂ, tout endomorphisme est trigonalisable</p>
            <p class="text-sm mt-2">(polynôme caractéristique scindé sur ℂ)</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Polynôme minimal</h3>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg mb-4">
            <p class="mb-3"><strong>Définition :</strong> Plus petit polynôme non nul P tel que P(u) = 0</p>
            <p class="text-sm mb-2"><strong>Propriétés :</strong></p>
            <ul class="list-disc pl-6 space-y-1 text-sm">
              <li>μ_A divise χ_A (Cayley-Hamilton)</li>
              <li>u diagonalisable ⟺ μ_A scindé à racines simples</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Décomposition de Dunford</h3>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <p class="mb-3">Sur ℂ, tout endomorphisme u s'écrit :</p>
            <p class="font-mono text-center mb-2">u = D + N</p>
            <p class="text-sm">où D diagonalisable, N nilpotent, DN = ND</p>
          </div>
        </section>
      </div>
    `
  },

  30: {
    title: "Intégrales multiples",
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">Intégrales multiples</h2>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">1. Intégrale double</h3>
          <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Sur un domaine D ⊂ ℝ² :</p>
            <p class="font-mono text-center mb-3">∬_D f(x,y) dxdy</p>
            <p class="text-sm mb-2"><strong>Théorème de Fubini :</strong></p>
            <p class="font-mono text-sm">∬_D f = ∫_a^b [∫_c^d f(x,y)dy] dx</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">2. Changement de variables</h3>
          <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Transformation φ : (u,v) ↦ (x,y)</p>
            <p class="font-mono text-sm mb-3">∬_D f(x,y)dxdy = ∬_D' f(φ(u,v)) |J| dudv</p>
            <p class="text-sm">où J = det(∂(x,y)/∂(u,v)) est le jacobien</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">3. Coordonnées polaires</h3>
          <div class="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg mb-4">
            <p class="mb-2"><strong>Transformation :</strong></p>
            <p class="font-mono text-sm mb-2">x = r cos θ</p>
            <p class="font-mono text-sm mb-3">y = r sin θ</p>
            <p class="font-mono text-sm">dxdy = r dr dθ</p>
            <p class="text-sm mt-3"><strong>Usage :</strong> Domaines circulaires, fonctions f(r)</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">4. Intégrale triple</h3>
          <div class="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg mb-4">
            <p class="mb-3">Sur un domaine Ω ⊂ ℝ³ :</p>
            <p class="font-mono text-center mb-3">∭_Ω f(x,y,z) dxdydz</p>
            <p class="text-sm mb-2"><strong>Coordonnées sphériques :</strong></p>
            <p class="font-mono text-sm">x = ρ sin φ cos θ</p>
            <p class="font-mono text-sm">y = ρ sin φ sin θ</p>
            <p class="font-mono text-sm">z = ρ cos φ</p>
            <p class="font-mono text-sm mt-2">dV = ρ² sin φ dρ dφ dθ</p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">5. Applications</h3>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <ul class="list-disc pl-6 space-y-2 text-sm">
              <li><strong>Aire :</strong> A = ∬_D dxdy</li>
              <li><strong>Volume :</strong> V = ∭_Ω dxdydz</li>
              <li><strong>Masse :</strong> M = ∭_Ω ρ(x,y,z) dV</li>
              <li><strong>Centre de gravité :</strong> x̄ = (1/M) ∭_Ω x ρ dV</li>
            </ul>
          </div>
        </section>
      </div>
    `
  },
};

/**
 * Récupère le contenu enrichi pour un cours
 * Vérifie d'abord s'il y a un PDF, sinon retourne le contenu enrichi
 */
export async function getCourseContent(courseId: number, level?: string, classe?: string): Promise<{
  hasPDF: boolean;
  pdfUrl?: string;
  content?: string;
}> {
  try {
    // Convertir level en format attendu
    const levelFormatted = level?.toLowerCase().includes('lycée') || level?.toLowerCase().includes('lycee') 
      ? 'lycee' as const
      : 'college' as const;

    // Vérifier s'il y a un PDF uploadé pour ce cours avec level et classe
    const pdf = await getPDFForContent(courseId, 'cours', levelFormatted, classe);
    
    if (pdf) {
      return {
        hasPDF: true,
        pdfUrl: pdf.publicPath,
      };
    }

    // Pas de PDF, retourner le contenu enrichi
    const enrichedContent = enrichedCoursesData[courseId];
    if (enrichedContent) {
      return {
        hasPDF: false,
        content: enrichedContent.content,
      };
    }

    // Aucun contenu disponible
    return {
      hasPDF: false,
      content: '<p class="text-muted-foreground">Contenu en cours de préparation...</p>',
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu:', error);
    return {
      hasPDF: false,
      content: '<p class="text-red-500">Erreur lors du chargement du contenu</p>',
    };
  }
}
