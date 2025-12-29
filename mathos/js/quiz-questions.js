// ============================================
// QUESTIONS DE QUIZ STATIQUES
// Toutes les questions des 9 quiz du projet Next.js
// ============================================

window.quizQuestionBank = {
  // Quiz 1: Nombres et calculs (10 questions)
  1: [
    {
      id: 1,
      text: "Combien font 12,5 + 7,35 ?",
      options: [
        { id: "a", text: "19,15" },
        { id: "b", text: "19,85" },
        { id: "c", text: "20,05" },
        { id: "d", text: "20,15" }
      ],
      correctAnswer: "b",
      explanation: "On additionne séparément unités et centièmes : 12,5 + 7,35 = 19,85."
    },
    {
      id: 2,
      text: "Réduire la fraction 18/24.",
      options: [
        { id: "a", text: "2/3" },
        { id: "b", text: "3/4" },
        { id: "c", text: "4/5" },
        { id: "d", text: "5/6" }
      ],
      correctAnswer: "b",
      explanation: "Le PGCD de 18 et 24 vaut 6, donc 18/24 = (18÷6)/(24÷6) = 3/4."
    },
    {
      id: 3,
      text: "Effectuer 3,2 × 0,5.",
      options: [
        { id: "a", text: "1,2" },
        { id: "b", text: "1,4" },
        { id: "c", text: "1,6" },
        { id: "d", text: "2" }
      ],
      correctAnswer: "c",
      explanation: "3,2 × 0,5 revient à diviser 3,2 par 2, soit 1,6."
    },
    {
      id: 4,
      text: "Quelle écriture correspond à 125 % d'une quantité ?",
      options: [
        { id: "a", text: "0,125 × quantité" },
        { id: "b", text: "1,125 × quantité" },
        { id: "c", text: "1,25 × quantité" },
        { id: "d", text: "12,5 × quantité" }
      ],
      correctAnswer: "c",
      explanation: "125 % = 125/100 = 1,25. On multiplie donc par 1,25."
    },
    {
      id: 5,
      text: "Quel est le résultat de 4² − 3² ?",
      options: [
        { id: "a", text: "1" },
        { id: "b", text: "7" },
        { id: "c", text: "13" },
        { id: "d", text: "25" }
      ],
      correctAnswer: "b",
      explanation: "4² = 16 et 3² = 9, donc 16 − 9 = 7."
    },
    {
      id: 6,
      text: "Quel est le PGCD de 24 et 36 ?",
      options: [
        { id: "a", text: "6" },
        { id: "b", text: "12" },
        { id: "c", text: "18" },
        { id: "d", text: "24" }
      ],
      correctAnswer: "b",
      explanation: "Les diviseurs de 24 sont 1,2,3,4,6,8,12,24. Ceux de 36 sont 1,2,3,4,6,9,12,18,36. Le PGCD est 12."
    },
    {
      id: 7,
      text: "Quel est le résultat de 0,75 × 8 ?",
      options: [
        { id: "a", text: "5" },
        { id: "b", text: "6" },
        { id: "c", text: "7" },
        { id: "d", text: "8" }
      ],
      correctAnswer: "b",
      explanation: "0,75 = 3/4, donc 0,75 × 8 = 3/4 × 8 = 3 × 2 = 6."
    },
    {
      id: 8,
      text: "Simplifier : 15/20",
      options: [
        { id: "a", text: "1/2" },
        { id: "b", text: "2/3" },
        { id: "c", text: "3/4" },
        { id: "d", text: "4/5" }
      ],
      correctAnswer: "c",
      explanation: "15/20 = (15÷5)/(20÷5) = 3/4."
    },
    {
      id: 9,
      text: "Quel est le résultat de 2,5 + 3,7 ?",
      options: [
        { id: "a", text: "5,2" },
        { id: "b", text: "6,2" },
        { id: "c", text: "6,12" },
        { id: "d", text: "7,2" }
      ],
      correctAnswer: "b",
      explanation: "2,5 + 3,7 = 6,2."
    },
    {
      id: 10,
      text: "Quel est le résultat de 100 ÷ 0,25 ?",
      options: [
        { id: "a", text: "25" },
        { id: "b", text: "250" },
        { id: "c", text: "400" },
        { id: "d", text: "2500" }
      ],
      correctAnswer: "c",
      explanation: "100 ÷ 0,25 = 100 ÷ (1/4) = 100 × 4 = 400."
    }
  ],
  // Quiz 2: Géométrie plane (15 questions)
  2: [
    {
      id: 1,
      text: "La somme des angles d'un triangle vaut toujours :",
      options: [
        { id: "a", text: "90°" },
        { id: "b", text: "120°" },
        { id: "c", text: "180°" },
        { id: "d", text: "360°" }
      ],
      correctAnswer: "c",
      explanation: "Dans un plan euclidien, la somme des angles d'un triangle est toujours 180°."
    },
    {
      id: 2,
      text: "Quelle formule donne l'aire d'un disque de rayon r ?",
      options: [
        { id: "a", text: "πr" },
        { id: "b", text: "πr²" },
        { id: "c", text: "2πr" },
        { id: "d", text: "πd²" }
      ],
      correctAnswer: "b",
      explanation: "L'aire d'un disque est A = πr²."
    },
    {
      id: 3,
      text: "Dans un triangle rectangle ABC (∠C = 90°), si AC = 8 et BC = 15, alors AB = ?",
      options: [
        { id: "a", text: "15" },
        { id: "b", text: "17" },
        { id: "c", text: "19" },
        { id: "d", text: "23" }
      ],
      correctAnswer: "b",
      explanation: "AB² = AC² + BC² = 8² + 15² = 64 + 225 = 289 ⇒ AB = 17."
    },
    {
      id: 4,
      text: "Un quadrilatère qui a ses côtés opposés parallèles est :",
      options: [
        { id: "a", text: "Un cerf-volant" },
        { id: "b", text: "Un trapèze" },
        { id: "c", text: "Un parallélogramme" },
        { id: "d", text: "Un losange nécessairement" }
      ],
      correctAnswer: "c",
      explanation: "Par définition, un parallélogramme possède ses deux paires de côtés opposés parallèles."
    },
    {
      id: 5,
      text: "La médiane d'un triangle partage :",
      options: [
        { id: "a", text: "L'aire en deux parties égales" },
        { id: "b", text: "La base en deux segments égaux" },
        { id: "c", text: "Les deux côtés adjacents" },
        { id: "d", text: "Les hauteurs du triangle" }
      ],
      correctAnswer: "b",
      explanation: "Une médiane joint un sommet au milieu du côté opposé."
    },
    {
      id: 6,
      text: "Combien de côtés a un hexagone ?",
      options: [
        { id: "a", text: "5" },
        { id: "b", text: "6" },
        { id: "c", text: "7" },
        { id: "d", text: "8" }
      ],
      correctAnswer: "b",
      explanation: "Un hexagone a 6 côtés. Le préfixe 'hexa' signifie 6."
    },
    {
      id: 7,
      text: "Quel est le périmètre d'un carré de côté 8 cm ?",
      options: [
        { id: "a", text: "24 cm" },
        { id: "b", text: "28 cm" },
        { id: "c", text: "32 cm" },
        { id: "d", text: "36 cm" }
      ],
      correctAnswer: "c",
      explanation: "Périmètre = 4 × côté = 4 × 8 = 32 cm"
    },
    {
      id: 8,
      text: "Quelle est l'aire d'un rectangle de 12 cm × 5 cm ?",
      options: [
        { id: "a", text: "50 cm²" },
        { id: "b", text: "55 cm²" },
        { id: "c", text: "60 cm²" },
        { id: "d", text: "65 cm²" }
      ],
      correctAnswer: "c",
      explanation: "Aire = Longueur × largeur = 12 × 5 = 60 cm²"
    },
    {
      id: 9,
      text: "Quel est le nom d'un triangle avec 3 côtés égaux ?",
      options: [
        { id: "a", text: "Isocèle" },
        { id: "b", text: "Équilatéral" },
        { id: "c", text: "Rectangle" },
        { id: "d", text: "Scalène" }
      ],
      correctAnswer: "b",
      explanation: "Un triangle équilatéral a ses 3 côtés de même longueur."
    },
    {
      id: 10,
      text: "Quelle est la formule du périmètre d'un cercle ?",
      options: [
        { id: "a", text: "πr" },
        { id: "b", text: "2πr" },
        { id: "c", text: "πr²" },
        { id: "d", text: "2πr²" }
      ],
      correctAnswer: "b",
      explanation: "Le périmètre (circonférence) d'un cercle est 2πr."
    },
    {
      id: 11,
      text: "Dans un triangle rectangle, le côté opposé à l'angle droit s'appelle :",
      options: [
        { id: "a", text: "La base" },
        { id: "b", text: "L'hypoténuse" },
        { id: "c", text: "La hauteur" },
        { id: "d", text: "La médiane" }
      ],
      correctAnswer: "b",
      explanation: "L'hypoténuse est le côté opposé à l'angle droit dans un triangle rectangle."
    },
    {
      id: 12,
      text: "Quelle est l'aire d'un triangle de base 10 cm et hauteur 6 cm ?",
      options: [
        { id: "a", text: "30 cm²" },
        { id: "b", text: "40 cm²" },
        { id: "c", text: "50 cm²" },
        { id: "d", text: "60 cm²" }
      ],
      correctAnswer: "a",
      explanation: "Aire = (base × hauteur) / 2 = (10 × 6) / 2 = 30 cm²"
    },
    {
      id: 13,
      text: "Un losange a :",
      options: [
        { id: "a", text: "4 côtés égaux et 4 angles droits" },
        { id: "b", text: "4 côtés égaux et angles opposés égaux" },
        { id: "c", text: "2 paires de côtés parallèles" },
        { id: "d", text: "Un seul angle droit" }
      ],
      correctAnswer: "b",
      explanation: "Un losange a 4 côtés égaux et ses angles opposés sont égaux."
    },
    {
      id: 14,
      text: "Quelle est la formule de l'aire d'un trapèze ?",
      options: [
        { id: "a", text: "(B + b) × h" },
        { id: "b", text: "(B + b) × h / 2" },
        { id: "c", text: "B × b × h" },
        { id: "d", text: "(B + b) / 2" }
      ],
      correctAnswer: "b",
      explanation: "Aire d'un trapèze = (grande base + petite base) × hauteur / 2"
    },
    {
      id: 15,
      text: "Dans un triangle, la hauteur est :",
      options: [
        { id: "a", text: "Toujours égale à la base" },
        { id: "b", text: "La droite perpendiculaire à un côté passant par le sommet opposé" },
        { id: "c", text: "Toujours la médiane" },
        { id: "d", text: "Toujours la bissectrice" }
      ],
      correctAnswer: "b",
      explanation: "La hauteur d'un triangle est la droite perpendiculaire à un côté passant par le sommet opposé."
    }
  ],
  // Quiz 3: Fonctions et dérivées (12 questions)
  3: [
    {
      id: 1,
      text: "Quelle est la dérivée de f(x) = x³ ?",
      options: [
        { id: "a", text: "x²" },
        { id: "b", text: "3x²" },
        { id: "c", text: "3x" },
        { id: "d", text: "x³" }
      ],
      correctAnswer: "b",
      explanation: "La dérivée de x³ est 3x²."
    },
    {
      id: 2,
      text: "La dérivée de ln(x) pour x > 0 est :",
      options: [
        { id: "a", text: "ln(x)" },
        { id: "b", text: "1/x" },
        { id: "c", text: "x" },
        { id: "d", text: "x ln(x)" }
      ],
      correctAnswer: "b",
      explanation: "d/dx [ln(x)] = 1/x."
    },
    {
      id: 3,
      text: "Quelle est la dérivée de e^{2x} ?",
      options: [
        { id: "a", text: "2e^{2x}" },
        { id: "b", text: "e^{2x}" },
        { id: "c", text: "2e^{x}" },
        { id: "d", text: "e^{x}" }
      ],
      correctAnswer: "a",
      explanation: "On applique la dérivation de composée : (e^{u})' = u' e^{u} avec u=2x."
    },
    {
      id: 4,
      text: "Si f(x) = x² et g(x) = sin(x), alors (f·g)'(x) vaut :",
      options: [
        { id: "a", text: "2x sin(x)" },
        { id: "b", text: "2x sin(x) + x² cos(x)" },
        { id: "c", text: "2x cos(x) + x² sin(x)" },
        { id: "d", text: "sin(x) + cos(x)" }
      ],
      correctAnswer: "b",
      explanation: "Dérivée d'un produit : (fg)' = f'g + fg'."
    },
    {
      id: 5,
      text: "Quel est le signe de la dérivée si f est croissante ?",
      options: [
        { id: "a", text: "Toujours négatif" },
        { id: "b", text: "Toujours positif" },
        { id: "c", text: "Toujours nul" },
        { id: "d", text: "Non déterminé sans plus d'information" }
      ],
      correctAnswer: "d",
      explanation: "Une fonction croissante admet une dérivée positive ou nulle mais peut être non dérivable en certains points."
    },
    {
      id: 6,
      text: "Quelle est la dérivée de f(x) = 1/x ?",
      options: [
        { id: "a", text: "1/x²" },
        { id: "b", text: "-1/x²" },
        { id: "c", text: "1/x" },
        { id: "d", text: "-1/x" }
      ],
      correctAnswer: "b",
      explanation: "La dérivée de 1/x = x^{-1} est -x^{-2} = -1/x²."
    },
    {
      id: 7,
      text: "Quelle est la dérivée de f(x) = √x ?",
      options: [
        { id: "a", text: "1/√x" },
        { id: "b", text: "1/(2√x)" },
        { id: "c", text: "√x" },
        { id: "d", text: "2√x" }
      ],
      correctAnswer: "b",
      explanation: "La dérivée de √x = x^{1/2} est (1/2)x^{-1/2} = 1/(2√x)."
    },
    {
      id: 8,
      text: "Quelle est la dérivée de f(x) = cos(x) ?",
      options: [
        { id: "a", text: "sin(x)" },
        { id: "b", text: "-sin(x)" },
        { id: "c", text: "cos(x)" },
        { id: "d", text: "-cos(x)" }
      ],
      correctAnswer: "b",
      explanation: "La dérivée de cos(x) est -sin(x)."
    },
    {
      id: 9,
      text: "Si f(x) = x² et g(x) = x³, quelle est la dérivée de f(g(x)) ?",
      options: [
        { id: "a", text: "2x³" },
        { id: "b", text: "3x²" },
        { id: "c", text: "6x⁵" },
        { id: "d", text: "2x⁶" }
      ],
      correctAnswer: "c",
      explanation: "Dérivée de composée : f'(g(x)) × g'(x) = 2x³ × 3x² = 6x⁵."
    },
    {
      id: 10,
      text: "Quelle est la dérivée seconde de f(x) = x³ ?",
      options: [
        { id: "a", text: "3x²" },
        { id: "b", text: "6x" },
        { id: "c", text: "6" },
        { id: "d", text: "0" }
      ],
      correctAnswer: "b",
      explanation: "f'(x) = 3x², donc f''(x) = 6x."
    },
    {
      id: 11,
      text: "Si f'(x) > 0 sur un intervalle, alors f est :",
      options: [
        { id: "a", text: "Décroissante" },
        { id: "b", text: "Croissante" },
        { id: "c", text: "Constante" },
        { id: "d", text: "Concave" }
      ],
      correctAnswer: "b",
      explanation: "Si la dérivée est positive, la fonction est croissante."
    },
    {
      id: 12,
      text: "Quelle est la dérivée de f(x) = x × ln(x) ?",
      options: [
        { id: "a", text: "ln(x)" },
        { id: "b", text: "1 + ln(x)" },
        { id: "c", text: "x + ln(x)" },
        { id: "d", text: "x/ln(x)" }
      ],
      correctAnswer: "b",
      explanation: "Dérivée d'un produit : (x)' × ln(x) + x × (ln(x))' = 1 × ln(x) + x × (1/x) = ln(x) + 1."
    }
  ],
  // Quiz 4: Suites numériques (15 questions)
  4: [
    {
      id: 1,
      text: "Une suite arithmétique de premier terme a₁ et raison r vérifie :",
      options: [
        { id: "a", text: "uₙ = a₁ + nr" },
        { id: "b", text: "uₙ = a₁ + (n-1)r" },
        { id: "c", text: "uₙ = a₁ × rⁿ" },
        { id: "d", text: "uₙ = a₁ × r^{n-1}" }
      ],
      correctAnswer: "b",
      explanation: "Formule explicite d'une suite arithmétique : uₙ = a₁ + (n-1)r."
    },
    {
      id: 2,
      text: "Une suite géométrique de raison q et premier terme u₀ vérifie :",
      options: [
        { id: "a", text: "uₙ = u₀ + nq" },
        { id: "b", text: "uₙ = u₀ × qⁿ" },
        { id: "c", text: "uₙ = u₀ × q^{n-1}" },
        { id: "d", text: "uₙ = nq" }
      ],
      correctAnswer: "b",
      explanation: "uₙ = u₀ × qⁿ (avec u₀ au rang 0)."
    },
    {
      id: 3,
      text: "La somme des n premiers termes d'une suite arithmétique vaut :",
      options: [
        { id: "a", text: "n × (u₁ + uₙ)/2" },
        { id: "b", text: "n × (u₀ + uₙ)" },
        { id: "c", text: "(u₁ + uₙ)/n" },
        { id: "d", text: "uₙ / n" }
      ],
      correctAnswer: "a",
      explanation: "Formule de Gauss : Sₙ = n(u₁ + uₙ)/2."
    },
    {
      id: 4,
      text: "Si une suite géométrique est de raison q avec |q| < 1, alors uₙ :",
      options: [
        { id: "a", text: "diverge vers +∞" },
        { id: "b", text: "oscille sans limite" },
        { id: "c", text: "converge vers 0" },
        { id: "d", text: "converge vers 1" }
      ],
      correctAnswer: "c",
      explanation: "Lorsque |q|<1, qⁿ → 0 lorsque n → +∞."
    },
    {
      id: 5,
      text: "Quelle condition garantit qu'une suite arithmétique est croissante ?",
      options: [
        { id: "a", text: "u₀ > 0" },
        { id: "b", text: "r > 0" },
        { id: "c", text: "r ≥ 0" },
        { id: "d", text: "u₀ < r" }
      ],
      correctAnswer: "c",
      explanation: "Une suite arithmétique est croissante si sa raison r est positive, stable si r = 0."
    },
    {
      id: 6,
      text: "Quelle est la somme des 10 premiers termes d'une suite arithmétique de premier terme 5 et raison 3 ?",
      options: [
        { id: "a", text: "185" },
        { id: "b", text: "200" },
        { id: "c", text: "215" },
        { id: "d", text: "230" }
      ],
      correctAnswer: "a",
      explanation: "u₁₀ = 5 + 9×3 = 32. S₁₀ = 10 × (5 + 32) / 2 = 10 × 37 / 2 = 185."
    },
    {
      id: 7,
      text: "Une suite géométrique de premier terme 2 et raison 3. Quel est u₄ ?",
      options: [
        { id: "a", text: "18" },
        { id: "b", text: "24" },
        { id: "c", text: "54" },
        { id: "d", text: "162" }
      ],
      correctAnswer: "c",
      explanation: "u₄ = 2 × 3³ = 2 × 27 = 54."
    },
    {
      id: 8,
      text: "La somme des n premiers termes d'une suite géométrique de raison q ≠ 1 vaut :",
      options: [
        { id: "a", text: "u₀ × (1-qⁿ)/(1-q)" },
        { id: "b", text: "u₀ × qⁿ" },
        { id: "c", text: "n × u₀" },
        { id: "d", text: "u₀ × q" }
      ],
      correctAnswer: "a",
      explanation: "Formule de la somme d'une suite géométrique : Sₙ = u₀ × (1-qⁿ)/(1-q)."
    },
    {
      id: 9,
      text: "Si une suite géométrique a pour raison q = 0,5, alors elle :",
      options: [
        { id: "a", text: "Diverge" },
        { id: "b", text: "Converge vers 0" },
        { id: "c", text: "Oscille" },
        { id: "d", text: "Est constante" }
      ],
      correctAnswer: "b",
      explanation: "Avec |q| < 1, la suite géométrique converge vers 0."
    },
    {
      id: 10,
      text: "Une suite arithmétique a u₀ = 10 et u₅ = 30. Quelle est sa raison ?",
      options: [
        { id: "a", text: "2" },
        { id: "b", text: "3" },
        { id: "c", text: "4" },
        { id: "d", text: "5" }
      ],
      correctAnswer: "c",
      explanation: "u₅ = u₀ + 5r = 10 + 5r = 30, donc 5r = 20, r = 4."
    },
    {
      id: 11,
      text: "Quelle est la limite de uₙ = 1/n quand n → +∞ ?",
      options: [
        { id: "a", text: "0" },
        { id: "b", text: "1" },
        { id: "c", text: "+∞" },
        { id: "d", text: "N'existe pas" }
      ],
      correctAnswer: "a",
      explanation: "1/n tend vers 0 quand n tend vers l'infini."
    },
    {
      id: 12,
      text: "Une suite est dite majorée si :",
      options: [
        { id: "a", text: "Elle est croissante" },
        { id: "b", text: "Il existe M tel que uₙ ≤ M pour tout n" },
        { id: "c", text: "Elle converge" },
        { id: "d", text: "Elle est périodique" }
      ],
      correctAnswer: "b",
      explanation: "Une suite est majorée s'il existe un réel M tel que tous les termes sont inférieurs ou égaux à M."
    },
    {
      id: 13,
      text: "Quelle est la raison d'une suite géométrique si u₁ = 4 et u₃ = 16 ?",
      options: [
        { id: "a", text: "2" },
        { id: "b", text: "3" },
        { id: "c", text: "4" },
        { id: "d", text: "8" }
      ],
      correctAnswer: "a",
      explanation: "u₃ = u₁ × q² = 4 × q² = 16, donc q² = 4, q = 2 (q > 0)."
    },
    {
      id: 14,
      text: "La suite définie par uₙ = n² est :",
      options: [
        { id: "a", text: "Arithmétique" },
        { id: "b", text: "Géométrique" },
        { id: "c", text: "Ni arithmétique ni géométrique" },
        { id: "d", text: "Constante" }
      ],
      correctAnswer: "c",
      explanation: "Cette suite n'est ni arithmétique (uₙ₊₁ - uₙ n'est pas constant) ni géométrique (uₙ₊₁/uₙ n'est pas constant)."
    },
    {
      id: 15,
      text: "Si une suite arithmétique a u₀ = 5 et raison r = -2, alors u₃ = ?",
      options: [
        { id: "a", text: "-1" },
        { id: "b", text: "1" },
        { id: "c", text: "-3" },
        { id: "d", text: "3" }
      ],
      correctAnswer: "a",
      explanation: "u₃ = u₀ + 3r = 5 + 3×(-2) = 5 - 6 = -1."
    }
  ],
  // Quiz 5: Probabilités (15 questions)
  5: [
    {
      id: 1,
      text: "On lance un dé équilibré. Quelle est la probabilité d'obtenir un nombre pair ?",
      options: [
        { id: "a", text: "1/2" },
        { id: "b", text: "1/3" },
        { id: "c", text: "2/3" },
        { id: "d", text: "3/4" }
      ],
      correctAnswer: "a",
      explanation: "Il y a trois issues paires sur six (2,4,6) donc 3/6 = 1/2."
    },
    {
      id: 2,
      text: "La variance d'une série statistique mesure :",
      options: [
        { id: "a", text: "La tendance centrale" },
        { id: "b", text: "La dispersion" },
        { id: "c", text: "La médiane" },
        { id: "d", text: "La corrélation" }
      ],
      correctAnswer: "b",
      explanation: "La variance quantifie l'écart des valeurs autour de la moyenne."
    },
    {
      id: 3,
      text: "Si deux événements A et B sont indépendants, alors P(A ∩ B) = ?",
      options: [
        { id: "a", text: "0" },
        { id: "b", text: "P(A) + P(B)" },
        { id: "c", text: "P(A) × P(B)" },
        { id: "d", text: "P(A|B)" }
      ],
      correctAnswer: "c",
      explanation: "Par définition de l'indépendance, P(A ∩ B) = P(A)P(B)."
    },
    {
      id: 4,
      text: "La moyenne de 10, 12, 18 vaut :",
      options: [
        { id: "a", text: "12" },
        { id: "b", text: "13,33" },
        { id: "c", text: "14" },
        { id: "d", text: "15" }
      ],
      correctAnswer: "b",
      explanation: "On calcule (10+12+18)/3 = 40/3 ≈ 13,33."
    },
    {
      id: 5,
      text: "Une loi binomiale B(n, p) porte sur :",
      options: [
        { id: "a", text: "Le nombre d'essais avant le premier succès" },
        { id: "b", text: "Le nombre de succès sur n essais indépendants" },
        { id: "c", text: "Des tirages sans remise" },
        { id: "d", text: "Une variable continue" }
      ],
      correctAnswer: "b",
      explanation: "La loi binomiale dénombre les succès sur n essais indépendants de probabilité p."
    },
    {
      id: 6,
      text: "On lance deux dés. Quelle est la probabilité d'obtenir une somme de 7 ?",
      options: [
        { id: "a", text: "1/6" },
        { id: "b", text: "1/12" },
        { id: "c", text: "1/18" },
        { id: "d", text: "1/36" }
      ],
      correctAnswer: "a",
      explanation: "Il y a 6 façons d'obtenir 7 : (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) sur 36 issues possibles. P = 6/36 = 1/6."
    },
    {
      id: 7,
      text: "Si P(A) = 0,3 et P(B) = 0,5 et A et B sont indépendants, alors P(A ∪ B) = ?",
      options: [
        { id: "a", text: "0,8" },
        { id: "b", text: "0,65" },
        { id: "c", text: "0,5" },
        { id: "d", text: "0,15" }
      ],
      correctAnswer: "b",
      explanation: "P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0,3 + 0,5 - (0,3×0,5) = 0,8 - 0,15 = 0,65."
    },
    {
      id: 8,
      text: "L'espérance d'une variable aléatoire X vaut :",
      options: [
        { id: "a", text: "La moyenne des valeurs" },
        { id: "b", text: "Σ xᵢ × P(X = xᵢ)" },
        { id: "c", text: "La variance" },
        { id: "d", text: "L'écart-type" }
      ],
      correctAnswer: "b",
      explanation: "Par définition, E(X) = Σ xᵢ × P(X = xᵢ)."
    },
    {
      id: 9,
      text: "Dans une loi binomiale B(10, 0,3), l'espérance vaut :",
      options: [
        { id: "a", text: "3" },
        { id: "b", text: "2,1" },
        { id: "c", text: "7" },
        { id: "d", text: "10" }
      ],
      correctAnswer: "a",
      explanation: "Pour B(n, p), E(X) = np = 10 × 0,3 = 3."
    },
    {
      id: 10,
      text: "La probabilité conditionnelle P(A|B) se lit :",
      options: [
        { id: "a", text: "Probabilité de A ou B" },
        { id: "b", text: "Probabilité de A sachant B" },
        { id: "c", text: "Probabilité de A et B" },
        { id: "d", text: "Probabilité de A multipliée par B" }
      ],
      correctAnswer: "b",
      explanation: "P(A|B) est la probabilité de A sachant que B est réalisé."
    },
    {
      id: 11,
      text: "Si deux événements sont mutuellement exclusifs, alors :",
      options: [
        { id: "a", text: "Ils sont indépendants" },
        { id: "b", text: "P(A ∩ B) = 0" },
        { id: "c", text: "P(A ∪ B) = P(A) × P(B)" },
        { id: "d", text: "P(A|B) = P(A)" }
      ],
      correctAnswer: "b",
      explanation: "Des événements mutuellement exclusifs ne peuvent pas se produire simultanément, donc P(A ∩ B) = 0."
    },
    {
      id: 12,
      text: "Dans une loi normale N(μ, σ²), μ représente :",
      options: [
        { id: "a", text: "La variance" },
        { id: "b", text: "L'écart-type" },
        { id: "c", text: "La moyenne" },
        { id: "d", text: "La médiane" }
      ],
      correctAnswer: "c",
      explanation: "Dans N(μ, σ²), μ est la moyenne et σ² est la variance."
    },
    {
      id: 13,
      text: "Quelle est la probabilité qu'une variable normale soit dans l'intervalle [μ-σ, μ+σ] ?",
      options: [
        { id: "a", text: "50%" },
        { id: "b", text: "68%" },
        { id: "c", text: "95%" },
        { id: "d", text: "99%" }
      ],
      correctAnswer: "b",
      explanation: "Environ 68% des valeurs d'une loi normale sont dans l'intervalle [μ-σ, μ+σ]."
    },
    {
      id: 14,
      text: "La variance d'une variable aléatoire mesure :",
      options: [
        { id: "a", text: "La valeur moyenne" },
        { id: "b", text: "La dispersion autour de la moyenne" },
        { id: "c", text: "La probabilité" },
        { id: "d", text: "L'espérance" }
      ],
      correctAnswer: "b",
      explanation: "La variance mesure la dispersion des valeurs autour de l'espérance."
    },
    {
      id: 15,
      text: "Si X suit une loi binomiale B(n, p), alors Var(X) = ?",
      options: [
        { id: "a", text: "np" },
        { id: "b", text: "np(1-p)" },
        { id: "c", text: "n(1-p)" },
        { id: "d", text: "p(1-p)" }
      ],
      correctAnswer: "b",
      explanation: "Pour une loi binomiale B(n, p), Var(X) = np(1-p)."
    }
  ],
  // Quiz 6: Préparation Brevet (25 questions)
  6: [
    {
      id: 1,
      text: "Convertir 4,5 h en minutes.",
      options: [
        { id: "a", text: "240 min" },
        { id: "b", text: "260 min" },
        { id: "c", text: "270 min" },
        { id: "d", text: "300 min" }
      ],
      correctAnswer: "c",
      explanation: "4,5 h = 4 h + 0,5 h = 240 min + 30 min = 270 min."
    },
    {
      id: 2,
      text: "Le volume d'un pavé droit est :",
      options: [
        { id: "a", text: "L × l" },
        { id: "b", text: "L × l × h" },
        { id: "c", text: "L + l + h" },
        { id: "d", text: "2(L + l)" }
      ],
      correctAnswer: "b",
      explanation: "Volume = longueur × largeur × hauteur."
    },
    {
      id: 3,
      text: "Dans un triangle isocèle, les angles à la base sont :",
      options: [
        { id: "a", text: "Différents" },
        { id: "b", text: "Également obtus" },
        { id: "c", text: "Égaux" },
        { id: "d", text: "Toujours droits" }
      ],
      correctAnswer: "c",
      explanation: "Propriété fondamentale du triangle isocèle."
    },
    {
      id: 4,
      text: "Résoudre l'équation 2x + 5 = 17.",
      options: [
        { id: "a", text: "x = 5" },
        { id: "b", text: "x = 6" },
        { id: "c", text: "x = 7" },
        { id: "d", text: "x = 8" }
      ],
      correctAnswer: "b",
      explanation: "2x = 12 donc x = 6."
    },
    {
      id: 5,
      text: "Le pourcentage de TVA à appliquer à 80 € pour obtenir 96 € est :",
      options: [
        { id: "a", text: "16 %" },
        { id: "b", text: "18 %" },
        { id: "c", text: "20 %" },
        { id: "d", text: "25 %" }
      ],
      correctAnswer: "c",
      explanation: "96 = 80 × 1,20 donc TVA = 20 %."
    },
    {
      id: 6,
      text: "Calculer : 2/3 + 1/3",
      options: [
        { id: "a", text: "1" },
        { id: "b", text: "2/3" },
        { id: "c", text: "3/6" },
        { id: "d", text: "1/3" }
      ],
      correctAnswer: "a",
      explanation: "2/3 + 1/3 = (2+1)/3 = 3/3 = 1"
    },
    {
      id: 7,
      text: "Résoudre : 2x + 5 = 13",
      options: [
        { id: "a", text: "x = 3" },
        { id: "b", text: "x = 4" },
        { id: "c", text: "x = 5" },
        { id: "d", text: "x = 6" }
      ],
      correctAnswer: "b",
      explanation: "2x = 13 - 5 = 8, donc x = 8/2 = 4"
    },
    {
      id: 8,
      text: "Dans un triangle rectangle, si les côtés de l'angle droit mesurent 3 cm et 4 cm, quelle est l'hypoténuse ?",
      options: [
        { id: "a", text: "5 cm" },
        { id: "b", text: "6 cm" },
        { id: "c", text: "7 cm" },
        { id: "d", text: "8 cm" }
      ],
      correctAnswer: "a",
      explanation: "D'après Pythagore : c² = 3² + 4² = 9 + 16 = 25, donc c = 5 cm"
    },
    {
      id: 9,
      text: "Calculer 20% de 150",
      options: [
        { id: "a", text: "20" },
        { id: "b", text: "25" },
        { id: "c", text: "30" },
        { id: "d", text: "35" }
      ],
      correctAnswer: "c",
      explanation: "20% de 150 = 0,20 × 150 = 30"
    },
    {
      id: 10,
      text: "Quelle est l'image de 3 par la fonction f(x) = 2x - 1 ?",
      options: [
        { id: "a", text: "4" },
        { id: "b", text: "5" },
        { id: "c", text: "6" },
        { id: "d", text: "7" }
      ],
      correctAnswer: "b",
      explanation: "f(3) = 2×3 - 1 = 6 - 1 = 5"
    },
    {
      id: 11,
      text: "Quel est le résultat de 15 × 4 ?",
      options: [
        { id: "a", text: "50" },
        { id: "b", text: "55" },
        { id: "c", text: "60" },
        { id: "d", text: "65" }
      ],
      correctAnswer: "c",
      explanation: "15 × 4 = 60"
    },
    {
      id: 12,
      text: "Quelle est la valeur de 144 ÷ 12 ?",
      options: [
        { id: "a", text: "10" },
        { id: "b", text: "11" },
        { id: "c", text: "12" },
        { id: "d", text: "13" }
      ],
      correctAnswer: "c",
      explanation: "144 ÷ 12 = 12. En effet, 12 × 12 = 144"
    },
    {
      id: 13,
      text: "Quelle est la valeur de 9² ?",
      options: [
        { id: "a", text: "18" },
        { id: "b", text: "72" },
        { id: "c", text: "81" },
        { id: "d", text: "90" }
      ],
      correctAnswer: "c",
      explanation: "9² = 9 × 9 = 81. C'est un carré parfait à connaître."
    },
    {
      id: 14,
      text: "Combien fait 200 - 156 ?",
      options: [
        { id: "a", text: "42" },
        { id: "b", text: "44" },
        { id: "c", text: "46" },
        { id: "d", text: "48" }
      ],
      correctAnswer: "b",
      explanation: "200 - 156 = 44. On peut faire : 200 - 150 = 50, puis 50 - 6 = 44"
    },
    {
      id: 15,
      text: "Quelle est la valeur de 17 × 3 ?",
      options: [
        { id: "a", text: "48" },
        { id: "b", text: "51" },
        { id: "c", text: "54" },
        { id: "d", text: "57" }
      ],
      correctAnswer: "b",
      explanation: "17 × 3 = 51. On peut calculer : (10 + 7) × 3 = 30 + 21 = 51"
    },
    {
      id: 16,
      text: "Réduire la fraction 18/24.",
      options: [
        { id: "a", text: "2/3" },
        { id: "b", text: "3/4" },
        { id: "c", text: "4/5" },
        { id: "d", text: "5/6" }
      ],
      correctAnswer: "b",
      explanation: "Le PGCD de 18 et 24 vaut 6, donc 18/24 = (18÷6)/(24÷6) = 3/4."
    },
    {
      id: 17,
      text: "Effectuer 3,2 × 0,5.",
      options: [
        { id: "a", text: "1,2" },
        { id: "b", text: "1,4" },
        { id: "c", text: "1,6" },
        { id: "d", text: "2" }
      ],
      correctAnswer: "c",
      explanation: "3,2 × 0,5 revient à diviser 3,2 par 2, soit 1,6."
    },
    {
      id: 18,
      text: "Quelle écriture correspond à 125 % d'une quantité ?",
      options: [
        { id: "a", text: "0,125 × quantité" },
        { id: "b", text: "1,125 × quantité" },
        { id: "c", text: "1,25 × quantité" },
        { id: "d", text: "12,5 × quantité" }
      ],
      correctAnswer: "c",
      explanation: "125 % = 125/100 = 1,25. On multiplie donc par 1,25."
    },
    {
      id: 19,
      text: "Quel est le résultat de 4² − 3² ?",
      options: [
        { id: "a", text: "1" },
        { id: "b", text: "7" },
        { id: "c", text: "13" },
        { id: "d", text: "25" }
      ],
      correctAnswer: "b",
      explanation: "4² = 16 et 3² = 9, donc 16 − 9 = 7. Attention : 4² − 3² = (4−3)(4+3) = 1×7 = 7."
    },
    {
      id: 20,
      text: "Quel est le PGCD de 24 et 36 ?",
      options: [
        { id: "a", text: "6" },
        { id: "b", text: "12" },
        { id: "c", text: "18" },
        { id: "d", text: "24" }
      ],
      correctAnswer: "b",
      explanation: "Les diviseurs de 24 sont 1,2,3,4,6,8,12,24. Ceux de 36 sont 1,2,3,4,6,9,12,18,36. Le PGCD est 12."
    },
    {
      id: 21,
      text: "Quel est le résultat de 0,75 × 8 ?",
      options: [
        { id: "a", text: "5" },
        { id: "b", text: "6" },
        { id: "c", text: "7" },
        { id: "d", text: "8" }
      ],
      correctAnswer: "b",
      explanation: "0,75 = 3/4, donc 0,75 × 8 = 3/4 × 8 = 3 × 2 = 6."
    },
    {
      id: 22,
      text: "Simplifier : 15/20",
      options: [
        { id: "a", text: "1/2" },
        { id: "b", text: "2/3" },
        { id: "c", text: "3/4" },
        { id: "d", text: "4/5" }
      ],
      correctAnswer: "c",
      explanation: "15/20 = (15÷5)/(20÷5) = 3/4."
    },
    {
      id: 23,
      text: "Quel est le résultat de 2,5 + 3,7 ?",
      options: [
        { id: "a", text: "5,2" },
        { id: "b", text: "6,2" },
        { id: "c", text: "6,12" },
        { id: "d", text: "7,2" }
      ],
      correctAnswer: "b",
      explanation: "2,5 + 3,7 = 6,2."
    },
    {
      id: 24,
      text: "Quel est le résultat de 100 ÷ 0,25 ?",
      options: [
        { id: "a", text: "25" },
        { id: "b", text: "250" },
        { id: "c", text: "400" },
        { id: "d", text: "2500" }
      ],
      correctAnswer: "c",
      explanation: "100 ÷ 0,25 = 100 ÷ (1/4) = 100 × 4 = 400."
    },
    {
      id: 25,
      text: "Combien fait 12 + 18 ?",
      options: [
        { id: "a", text: "28" },
        { id: "b", text: "30" },
        { id: "c", text: "32" },
        { id: "d", text: "26" }
      ],
      correctAnswer: "b",
      explanation: "12 + 18 = 30. On peut décomposer : 12 + 18 = 10 + 20 = 30"
    }
  ],
  // Quiz 7: Préparation Bac (30 questions)
  7: [
    {
      id: 1,
      text: "Soit f(x) = x³ − 6x² + 9x. Combien de solutions possède f'(x) ?",
      options: [
        { id: "a", text: "0" },
        { id: "b", text: "1" },
        { id: "c", text: "2" },
        { id: "d", text: "3" }
      ],
      correctAnswer: "c",
      explanation: "f'(x) = 3x² − 12x + 9 = 3(x² − 4x + 3) = 3(x-1)(x-3) ⇒ deux racines."
    },
    {
      id: 2,
      text: "La primitive de 3x² est :",
      options: [
        { id: "a", text: "x³" },
        { id: "b", text: "x²" },
        { id: "c", text: "x³ + C" },
        { id: "d", text: "x² + C" }
      ],
      correctAnswer: "c",
      explanation: "∫3x² dx = x³ + C."
    },
    {
      id: 3,
      text: "Soit la fonction exponentielle g(x) = e^{-x}. Sa limite en +∞ vaut :",
      options: [
        { id: "a", text: "+∞" },
        { id: "b", text: "−∞" },
        { id: "c", text: "0" },
        { id: "d", text: "1" }
      ],
      correctAnswer: "c",
      explanation: "e^{-x} décroît vers 0 lorsque x → +∞."
    },
    {
      id: 4,
      text: "L'équation x² − 5x + 6 = 0 possède :",
      options: [
        { id: "a", text: "Pas de solution réelle" },
        { id: "b", text: "Une unique solution" },
        { id: "c", text: "Deux solutions réelles" },
        { id: "d", text: "Une infinité" }
      ],
      correctAnswer: "c",
      explanation: "Discriminant Δ = 25 − 24 = 1 > 0 ⇒ deux solutions."
    },
    {
      id: 5,
      text: "Dans une suite géométrique de raison 2, u₄ = 16. Alors u₀ = ?",
      options: [
        { id: "a", text: "1" },
        { id: "b", text: "2" },
        { id: "c", text: "4" },
        { id: "d", text: "8" }
      ],
      correctAnswer: "a",
      explanation: "u₄ = u₀ × 2⁴ = u₀ × 16. Donc u₀ = 1."
    },
    {
      id: 6,
      text: "Quelle est la limite de (1/n) quand n tend vers +∞ ?",
      options: [
        { id: "a", text: "0" },
        { id: "b", text: "1" },
        { id: "c", text: "+∞" },
        { id: "d", text: "Pas de limite" }
      ],
      correctAnswer: "a",
      explanation: "Quand n tend vers +∞, 1/n tend vers 0"
    },
    {
      id: 7,
      text: "Quelle est la dérivée de ln(x) ?",
      options: [
        { id: "a", text: "1/x" },
        { id: "b", text: "ln(x)" },
        { id: "c", text: "x" },
        { id: "d", text: "e^x" }
      ],
      correctAnswer: "a",
      explanation: "La dérivée de ln(x) est 1/x"
    },
    {
      id: 8,
      text: "Quelle est la primitive de e^x ?",
      options: [
        { id: "a", text: "e^x" },
        { id: "b", text: "e^x + C" },
        { id: "c", text: "xe^x" },
        { id: "d", text: "ln(x)" }
      ],
      correctAnswer: "b",
      explanation: "La primitive de e^x est e^x + C (où C est une constante)"
    },
    {
      id: 9,
      text: "Pour z = 1 + i, quel est le module |z| ?",
      options: [
        { id: "a", text: "1" },
        { id: "b", text: "√2" },
        { id: "c", text: "2" },
        { id: "d", text: "√3" }
      ],
      correctAnswer: "b",
      explanation: "|z| = √(1² + 1²) = √2"
    },
    {
      id: 10,
      text: "Quelle est la valeur de ln(e) ?",
      options: [
        { id: "a", text: "0" },
        { id: "b", text: "1" },
        { id: "c", text: "e" },
        { id: "d", text: "2" }
      ],
      correctAnswer: "b",
      explanation: "Par définition, ln(e) = 1"
    },
    {
      id: 11,
      text: "Quelle est la dérivée de f(x) = x⁴ ?",
      options: [
        { id: "a", text: "3x³" },
        { id: "b", text: "4x³" },
        { id: "c", text: "x³" },
        { id: "d", text: "4x⁴" }
      ],
      correctAnswer: "b",
      explanation: "f'(x) = 4x³. On applique la formule : (xⁿ)' = n·xⁿ⁻¹"
    },
    {
      id: 12,
      text: "Quelle est la dérivée de f(x) = 3x³ ?",
      options: [
        { id: "a", text: "3x²" },
        { id: "b", text: "6x²" },
        { id: "c", text: "9x²" },
        { id: "d", text: "x³" }
      ],
      correctAnswer: "c",
      explanation: "f'(x) = 3 × 3 × x² = 9x². On multiplie le coefficient par l'exposant."
    },
    {
      id: 13,
      text: "Quelle est la dérivée d'une constante k ?",
      options: [
        { id: "a", text: "k" },
        { id: "b", text: "1" },
        { id: "c", text: "0" },
        { id: "d", text: "k-1" }
      ],
      correctAnswer: "c",
      explanation: "La dérivée d'une constante est toujours 0."
    },
    {
      id: 14,
      text: "Si f(x) = 2x + 5, quelle est f'(x) ?",
      options: [
        { id: "a", text: "2" },
        { id: "b", text: "2x" },
        { id: "c", text: "5" },
        { id: "d", text: "0" }
      ],
      correctAnswer: "a",
      explanation: "La dérivée d'une fonction affine ax + b est a. Donc f'(x) = 2"
    },
    {
      id: 15,
      text: "Quelle est la primitive de 1/x pour x > 0 ?",
      options: [
        { id: "a", text: "x" },
        { id: "b", text: "ln(x)" },
        { id: "c", text: "ln(x) + C" },
        { id: "d", text: "1/x²" }
      ],
      correctAnswer: "c",
      explanation: "La primitive de 1/x est ln(x) + C"
    },
    {
      id: 16,
      text: "Quelle est la limite de x² quand x → +∞ ?",
      options: [
        { id: "a", text: "0" },
        { id: "b", text: "1" },
        { id: "c", text: "+∞" },
        { id: "d", text: "-∞" }
      ],
      correctAnswer: "c",
      explanation: "Quand x tend vers +∞, x² tend vers +∞"
    },
    {
      id: 17,
      text: "Quelle est la dérivée de f(x) = cos(x) ?",
      options: [
        { id: "a", text: "sin(x)" },
        { id: "b", text: "-sin(x)" },
        { id: "c", text: "cos(x)" },
        { id: "d", text: "-cos(x)" }
      ],
      correctAnswer: "b",
      explanation: "La dérivée de cos(x) est -sin(x)"
    },
    {
      id: 18,
      text: "Quelle est la primitive de x² ?",
      options: [
        { id: "a", text: "x" },
        { id: "b", text: "x³" },
        { id: "c", text: "x³/3 + C" },
        { id: "d", text: "2x" }
      ],
      correctAnswer: "c",
      explanation: "La primitive de x² est x³/3 + C"
    },
    {
      id: 19,
      text: "Si f'(x) = 0 pour tout x, alors f est :",
      options: [
        { id: "a", text: "Croissante" },
        { id: "b", text: "Décroissante" },
        { id: "c", text: "Constante" },
        { id: "d", text: "Non définie" }
      ],
      correctAnswer: "c",
      explanation: "Si la dérivée est nulle partout, la fonction est constante."
    },
    {
      id: 20,
      text: "Quelle est la dérivée de f(x) = x × e^x ?",
      options: [
        { id: "a", text: "e^x" },
        { id: "b", text: "xe^x" },
        { id: "c", text: "e^x + xe^x" },
        { id: "d", text: "2xe^x" }
      ],
      correctAnswer: "c",
      explanation: "Dérivée d'un produit : (x)' × e^x + x × (e^x)' = 1 × e^x + x × e^x = e^x + xe^x"
    },
    {
      id: 21,
      text: "Quelle est la limite de sin(x)/x quand x → 0 ?",
      options: [
        { id: "a", text: "0" },
        { id: "b", text: "1" },
        { id: "c", text: "+∞" },
        { id: "d", text: "N'existe pas" }
      ],
      correctAnswer: "b",
      explanation: "C'est une limite classique : lim(x→0) sin(x)/x = 1"
    },
    {
      id: 22,
      text: "Quelle est la dérivée de f(x) = √x ?",
      options: [
        { id: "a", text: "1/√x" },
        { id: "b", text: "1/(2√x)" },
        { id: "c", text: "√x" },
        { id: "d", text: "2√x" }
      ],
      correctAnswer: "b",
      explanation: "La dérivée de √x = x^{1/2} est (1/2)x^{-1/2} = 1/(2√x)"
    },
    {
      id: 23,
      text: "Quelle est la primitive de 1/(1+x²) ?",
      options: [
        { id: "a", text: "ln(1+x²)" },
        { id: "b", text: "arctan(x) + C" },
        { id: "c", text: "arctan(x)" },
        { id: "d", text: "1/(1+x²)" }
      ],
      correctAnswer: "b",
      explanation: "La primitive de 1/(1+x²) est arctan(x) + C"
    },
    {
      id: 24,
      text: "Si f(x) = x³ - 6x² + 9x, combien de points critiques possède f ?",
      options: [
        { id: "a", text: "0" },
        { id: "b", text: "1" },
        { id: "c", text: "2" },
        { id: "d", text: "3" }
      ],
      correctAnswer: "c",
      explanation: "f'(x) = 3x² - 12x + 9 = 3(x² - 4x + 3) = 3(x-1)(x-3) ⇒ deux racines, donc deux points critiques"
    },
    {
      id: 25,
      text: "Quelle est la dérivée de f(x) = x × ln(x) ?",
      options: [
        { id: "a", text: "ln(x)" },
        { id: "b", text: "1 + ln(x)" },
        { id: "c", text: "x + ln(x)" },
        { id: "d", text: "x/ln(x)" }
      ],
      correctAnswer: "b",
      explanation: "Dérivée d'un produit : (x)' × ln(x) + x × (ln(x))' = 1 × ln(x) + x × (1/x) = ln(x) + 1"
    },
    {
      id: 26,
      text: "Quelle est la primitive de 2x ?",
      options: [
        { id: "a", text: "x" },
        { id: "b", text: "x²" },
        { id: "c", text: "x² + C" },
        { id: "d", text: "2x²" }
      ],
      correctAnswer: "c",
      explanation: "La primitive de 2x est x² + C"
    },
    {
      id: 27,
      text: "Quelle est la limite de (x² - 1)/(x - 1) quand x → 1 ?",
      options: [
        { id: "a", text: "0" },
        { id: "b", text: "1" },
        { id: "c", text: "2" },
        { id: "d", text: "N'existe pas" }
      ],
      correctAnswer: "c",
      explanation: "On factorise : (x²-1)/(x-1) = (x-1)(x+1)/(x-1) = x+1 → 2 quand x → 1"
    },
    {
      id: 28,
      text: "Quelle est la dérivée de f(x) = (x² + 1)³ ?",
      options: [
        { id: "a", text: "3(x² + 1)²" },
        { id: "b", text: "6x(x² + 1)²" },
        { id: "c", text: "3x²(x² + 1)²" },
        { id: "d", text: "2x(x² + 1)²" }
      ],
      correctAnswer: "b",
      explanation: "Dérivée de composée : 3(x²+1)² × 2x = 6x(x²+1)²"
    },
    {
      id: 29,
      text: "Quelle est la primitive de sin(x) ?",
      options: [
        { id: "a", text: "cos(x)" },
        { id: "b", text: "-cos(x)" },
        { id: "c", text: "-cos(x) + C" },
        { id: "d", text: "sin(x) + C" }
      ],
      correctAnswer: "c",
      explanation: "La primitive de sin(x) est -cos(x) + C"
    },
    {
      id: 30,
      text: "Quelle est la dérivée de f(x) = 1/(x² + 1) ?",
      options: [
        { id: "a", text: "1/(x² + 1)²" },
        { id: "b", text: "-2x/(x² + 1)²" },
        { id: "c", text: "2x/(x² + 1)²" },
        { id: "d", text: "-1/(x² + 1)²" }
      ],
      correctAnswer: "b",
      explanation: "Dérivée d'un quotient : f'(x) = -2x/(x²+1)²"
    }
  ],
  // Quiz 8: Prépa Grandes Écoles (20 questions)
  8: [
    {
      id: 1,
      text: "La convergence de la série ∑ 1/n² est :",
      options: [
        { id: "a", text: "Divergente" },
        { id: "b", text: "Conditionnelle" },
        { id: "c", text: "Absolue" },
        { id: "d", text: "Impossible à déterminer" }
      ],
      correctAnswer: "c",
      explanation: "Série de Riemann de paramètre p = 2 > 1, donc convergence absolue."
    },
    {
      id: 2,
      text: "Pour des vecteurs u et v, quel est le critère de colinéarité dans ℝ² ?",
      options: [
        { id: "a", text: "u × v = 0 (produit vectoriel)" },
        { id: "b", text: "u · v = 0" },
        { id: "c", text: "Les coordonnées sont proportionnelles" },
        { id: "d", text: "‖u‖ = ‖v‖" }
      ],
      correctAnswer: "c",
      explanation: "En dimension 2, u et v sont colinéaires si leurs coordonnées sont proportionnelles."
    },
    {
      id: 3,
      text: "La matrice \\begin{pmatrix}1 & 2\\\\0 & 1\\end{pmatrix} est :",
      options: [
        { id: "a", text: "Diagonalisable sur ℝ" },
        { id: "b", text: "Non diagonalisable" },
        { id: "c", text: "Orthogonale" },
        { id: "d", text: "Symétrique" }
      ],
      correctAnswer: "b",
      explanation: "Cette matrice possède une seule valeur propre (λ=1) avec un seul vecteur propre indépendant ⇒ non diagonalisable."
    },
    {
      id: 4,
      text: "Le théorème de Cauchy-Schwarz affirme que |u·v| ≤ ... ?",
      options: [
        { id: "a", text: "‖u‖ + ‖v‖" },
        { id: "b", text: "‖u‖ ‖v‖" },
        { id: "c", text: "‖u‖² + ‖v‖²" },
        { id: "d", text: "‖u‖²‖v‖²" }
      ],
      correctAnswer: "b",
      explanation: "C'est l'inégalité fondamentale pour le produit scalaire."
    },
    {
      id: 5,
      text: "La dérivée de tan(x) vaut :",
      options: [
        { id: "a", text: "sin(x)" },
        { id: "b", text: "cos(x)" },
        { id: "c", text: "1/ cos²(x)" },
        { id: "d", text: "−1/ sin²(x)" }
      ],
      correctAnswer: "c",
      explanation: "(tan x)' = 1/ cos² x."
    },
    {
      id: 6,
      text: "Quelle est la dimension du noyau d'une application linéaire f : ℝ³ → ℝ² de rang 2 ?",
      options: [
        { id: "a", text: "0" },
        { id: "b", text: "1" },
        { id: "c", text: "2" },
        { id: "d", text: "3" }
      ],
      correctAnswer: "b",
      explanation: "D'après le théorème du rang : dim(Ker f) = dim(ℝ³) - rg(f) = 3 - 2 = 1"
    },
    {
      id: 7,
      text: "Si une matrice A est diagonalisable avec valeurs propres 1, 2, 3, quelle est trace(A) ?",
      options: [
        { id: "a", text: "3" },
        { id: "b", text: "4" },
        { id: "c", text: "5" },
        { id: "d", text: "6" }
      ],
      correctAnswer: "d",
      explanation: "La trace est la somme des valeurs propres : 1 + 2 + 3 = 6"
    },
    {
      id: 8,
      text: "Quelle est la convergence de la série Σ(1/n²) ?",
      options: [
        { id: "a", text: "Converge" },
        { id: "b", text: "Diverge" },
        { id: "c", text: "Semi-converge" },
        { id: "d", text: "Indéterminé" }
      ],
      correctAnswer: "a",
      explanation: "La série Σ(1/n²) converge (série de Riemann avec α = 2 > 1)"
    },
    {
      id: 9,
      text: "Dans ℝ³, combien de vecteurs linéairement indépendants au maximum ?",
      options: [
        { id: "a", text: "1" },
        { id: "b", text: "2" },
        { id: "c", text: "3" },
        { id: "d", text: "4" }
      ],
      correctAnswer: "c",
      explanation: "La dimension de ℝ³ est 3, donc maximum 3 vecteurs linéairement indépendants"
    },
    {
      id: 10,
      text: "Quelle est la dérivée de arctan(x) ?",
      options: [
        { id: "a", text: "1/(1+x²)" },
        { id: "b", text: "1/(1-x²)" },
        { id: "c", text: "-1/(1+x²)" },
        { id: "d", text: "1/√(1-x²)" }
      ],
      correctAnswer: "a",
      explanation: "La dérivée de arctan(x) est 1/(1+x²)"
    },
    {
      id: 11,
      text: "Le théorème de Rouché-Frobenius concerne :",
      options: [
        { id: "a", text: "Les séries numériques" },
        { id: "b", text: "Les systèmes d'équations linéaires" },
        { id: "c", text: "Les intégrales" },
        { id: "d", text: "Les limites" }
      ],
      correctAnswer: "b",
      explanation: "Le théorème de Rouché-Frobenius donne des conditions d'existence de solutions pour les systèmes linéaires."
    },
    {
      id: 12,
      text: "Une matrice carrée est inversible si et seulement si :",
      options: [
        { id: "a", text: "Son déterminant est nul" },
        { id: "b", text: "Son déterminant est non nul" },
        { id: "c", text: "Elle est symétrique" },
        { id: "d", text: "Elle est diagonale" }
      ],
      correctAnswer: "b",
      explanation: "Une matrice carrée est inversible si et seulement si son déterminant est non nul."
    },
    {
      id: 13,
      text: "Le rang d'une matrice est :",
      options: [
        { id: "a", text: "Le nombre de lignes" },
        { id: "b", text: "Le nombre de colonnes" },
        { id: "c", text: "La dimension de l'image" },
        { id: "d", text: "La trace" }
      ],
      correctAnswer: "c",
      explanation: "Le rang d'une matrice est la dimension de l'espace vectoriel engendré par ses colonnes (ou lignes)."
    },
    {
      id: 14,
      text: "Quelle est la convergence de la série Σ(1/n) ?",
      options: [
        { id: "a", text: "Converge" },
        { id: "b", text: "Diverge" },
        { id: "c", text: "Converge conditionnellement" },
        { id: "d", text: "Oscille" }
      ],
      correctAnswer: "b",
      explanation: "La série harmonique Σ(1/n) diverge (série de Riemann avec α = 1 ≤ 1)."
    },
    {
      id: 15,
      text: "Deux matrices A et B sont semblables si :",
      options: [
        { id: "a", text: "A = B" },
        { id: "b", text: "Il existe P inversible telle que B = P⁻¹AP" },
        { id: "c", text: "A + B = 0" },
        { id: "d", text: "A × B = I" }
      ],
      correctAnswer: "b",
      explanation: "Deux matrices sont semblables s'il existe une matrice inversible P telle que B = P⁻¹AP."
    },
    {
      id: 16,
      text: "Le polynôme caractéristique d'une matrice A est :",
      options: [
        { id: "a", text: "det(A)" },
        { id: "b", text: "det(A - λI)" },
        { id: "c", text: "trace(A)" },
        { id: "d", text: "A²" }
      ],
      correctAnswer: "b",
      explanation: "Le polynôme caractéristique de A est det(A - λI)."
    },
    {
      id: 17,
      text: "Une série Σaₙ converge absolument si :",
      options: [
        { id: "a", text: "Σaₙ converge" },
        { id: "b", text: "Σ|aₙ| converge" },
        { id: "c", text: "aₙ → 0" },
        { id: "d", text: "aₙ > 0" }
      ],
      correctAnswer: "b",
      explanation: "Une série converge absolument si la série des valeurs absolues converge."
    },
    {
      id: 18,
      text: "Le produit scalaire de deux vecteurs orthogonaux vaut :",
      options: [
        { id: "a", text: "1" },
        { id: "b", text: "0" },
        { id: "c", text: "-1" },
        { id: "d", text: "‖u‖ × ‖v‖" }
      ],
      correctAnswer: "b",
      explanation: "Par définition, deux vecteurs orthogonaux ont un produit scalaire nul."
    },
    {
      id: 19,
      text: "Une base orthonormée est une base où :",
      options: [
        { id: "a", text: "Les vecteurs sont orthogonaux" },
        { id: "b", text: "Les vecteurs sont de norme 1" },
        { id: "c", text: "Les vecteurs sont orthogonaux et de norme 1" },
        { id: "d", text: "Les vecteurs sont colinéaires" }
      ],
      correctAnswer: "c",
      explanation: "Une base orthonormée est une base où les vecteurs sont orthogonaux deux à deux et de norme 1."
    },
    {
      id: 20,
      text: "Le théorème de la base incomplète affirme que :",
      options: [
        { id: "a", text: "Toute famille libre peut être complétée en base" },
        { id: "b", text: "Toute famille génératrice contient une base" },
        { id: "c", text: "Les deux réponses précédentes" },
        { id: "d", text: "Aucune des réponses" }
      ],
      correctAnswer: "c",
      explanation: "Le théorème de la base incomplète affirme qu'on peut compléter une famille libre en base et extraire une base d'une famille génératrice."
    }
  ],
  // Quiz 9: Algèbre linéaire (15 questions)
  9: [
    {
      id: 1,
      text: "Un sous-espace vectoriel de ℝ³ engendré par deux vecteurs indépendants est :",
      options: [
        { id: "a", text: "Une droite" },
        { id: "b", text: "Un plan" },
        { id: "c", text: "ℝ³ entier" },
        { id: "d", text: "Le vecteur nul" }
      ],
      correctAnswer: "b",
      explanation: "Deux vecteurs indépendants dans ℝ³ engendrent un plan vectoriel."
    },
    {
      id: 2,
      text: "Le déterminant d'une matrice 2×2 \\begin{pmatrix}a & b\\\\c & d\\end{pmatrix} est :",
      options: [
        { id: "a", text: "a + d" },
        { id: "b", text: "ad − bc" },
        { id: "c", text: "ab + cd" },
        { id: "d", text: "ac + bd" }
      ],
      correctAnswer: "b",
      explanation: "Déterminant classique : ad − bc."
    },
    {
      id: 3,
      text: "Une application linéaire est entièrement déterminée par :",
      options: [
        { id: "a", text: "Son noyau uniquement" },
        { id: "b", text: "Son image uniquement" },
        { id: "c", text: "Ses valeurs sur une base" },
        { id: "d", text: "Sa trace" }
      ],
      correctAnswer: "c",
      explanation: "Connaître l'image d'une base suffit pour connaître l'application sur tout l'espace."
    },
    {
      id: 4,
      text: "La trace d'une matrice est :",
      options: [
        { id: "a", text: "La somme des éléments de la première ligne" },
        { id: "b", text: "La somme des éléments diagonaux" },
        { id: "c", text: "Le produit des éléments diagonaux" },
        { id: "d", text: "Toujours nulle" }
      ],
      correctAnswer: "b",
      explanation: "Par définition, tr(A) = Σ a_{ii}."
    },
    {
      id: 5,
      text: "Deux vecteurs sont orthogonaux si et seulement si :",
      options: [
        { id: "a", text: "Leur norme est identique" },
        { id: "b", text: "Leur produit scalaire vaut 0" },
        { id: "c", text: "Ils ont même direction" },
        { id: "d", text: "Ils sont colinéaires" }
      ],
      correctAnswer: "b",
      explanation: "u·v = 0 est la condition d'orthogonalité."
    },
    {
      id: 6,
      text: "Quelle est la dimension de l'espace vectoriel des polynômes de degré ≤ 3 ?",
      options: [
        { id: "a", text: "2" },
        { id: "b", text: "3" },
        { id: "c", text: "4" },
        { id: "d", text: "5" }
      ],
      correctAnswer: "c",
      explanation: "Une base est {1, X, X², X³}, donc dim = 4"
    },
    {
      id: 7,
      text: "Si det(A) = 5, quelle est det(2A) pour A matrice 3×3 ?",
      options: [
        { id: "a", text: "10" },
        { id: "b", text: "20" },
        { id: "c", text: "40" },
        { id: "d", text: "125" }
      ],
      correctAnswer: "c",
      explanation: "det(kA) = k^n × det(A) = 2³ × 5 = 8 × 5 = 40"
    },
    {
      id: 8,
      text: "Une matrice orthogonale A vérifie :",
      options: [
        { id: "a", text: "A² = I" },
        { id: "b", text: "A^T × A = I" },
        { id: "c", text: "det(A) = 1" },
        { id: "d", text: "A + A^T = 0" }
      ],
      correctAnswer: "b",
      explanation: "Par définition, une matrice orthogonale vérifie A^T × A = I"
    },
    {
      id: 9,
      text: "Si E et F sont des sous-espaces vectoriels avec dim(E) = 3, dim(F) = 2 et dim(E ∩ F) = 1, quelle est dim(E + F) ?",
      options: [
        { id: "a", text: "3" },
        { id: "b", text: "4" },
        { id: "c", text: "5" },
        { id: "d", text: "6" }
      ],
      correctAnswer: "b",
      explanation: "Formule de Grassmann : dim(E + F) = dim(E) + dim(F) - dim(E ∩ F) = 3 + 2 - 1 = 4"
    },
    {
      id: 10,
      text: "Le rang d'une matrice 4×5 est au maximum :",
      options: [
        { id: "a", text: "3" },
        { id: "b", text: "4" },
        { id: "c", text: "5" },
        { id: "d", text: "9" }
      ],
      correctAnswer: "b",
      explanation: "Le rang est au plus min(4, 5) = 4"
    },
    {
      id: 11,
      text: "Un endomorphisme est diagonalisable si :",
      options: [
        { id: "a", text: "Il est injectif" },
        { id: "b", text: "Il existe une base de vecteurs propres" },
        { id: "c", text: "Il est surjectif" },
        { id: "d", text: "Son déterminant est non nul" }
      ],
      correctAnswer: "b",
      explanation: "Un endomorphisme est diagonalisable s'il existe une base de l'espace formée de vecteurs propres."
    },
    {
      id: 12,
      text: "La somme de deux sous-espaces vectoriels E et F est :",
      options: [
        { id: "a", text: "E ∪ F" },
        { id: "b", text: "{u + v | u ∈ E, v ∈ F}" },
        { id: "c", text: "E ∩ F" },
        { id: "d", text: "E \\ F" }
      ],
      correctAnswer: "b",
      explanation: "E + F = {u + v | u ∈ E, v ∈ F}"
    },
    {
      id: 13,
      text: "Le noyau d'une application linéaire est :",
      options: [
        { id: "a", text: "Un sous-espace vectoriel" },
        { id: "b", text: "Toujours réduit à {0}" },
        { id: "c", text: "L'image" },
        { id: "d", text: "Le complémentaire de l'image" }
      ],
      correctAnswer: "a",
      explanation: "Le noyau d'une application linéaire est toujours un sous-espace vectoriel."
    },
    {
      id: 14,
      text: "Deux matrices représentent le même endomorphisme dans des bases différentes si elles sont :",
      options: [
        { id: "a", text: "Égales" },
        { id: "b", text: "Semblables" },
        { id: "c", text: "Transposées" },
        { id: "d", text: "Inverses" }
      ],
      correctAnswer: "b",
      explanation: "Deux matrices représentent le même endomorphisme dans des bases différentes si et seulement si elles sont semblables."
    },
    {
      id: 15,
      text: "Le polynôme minimal d'un endomorphisme est :",
      options: [
        { id: "a", text: "Le polynôme caractéristique" },
        { id: "b", text: "Le polynôme unitaire de plus petit degré qui annule l'endomorphisme" },
        { id: "c", text: "Toujours de degré 1" },
        { id: "d", text: "Le déterminant" }
      ],
      correctAnswer: "b",
      explanation: "Le polynôme minimal est le polynôme unitaire de plus petit degré qui annule l'endomorphisme."
    }
  ]
};

