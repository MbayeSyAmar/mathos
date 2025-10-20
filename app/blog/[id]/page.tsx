"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  User as UserIcon,
  ThumbsUp,
  MessageSquare,
  Share,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react"
import { motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import {
  collection,
  doc as firestoreDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

type CommentItem = {
  id: number
  author: string
  authorAvatar: string
  date: string
  content: string
  likes: number
}

type Article = {
  slug: string
  title: string
  description: string
  image: string
  category: "methodes" | "concours" | "college" | "lycee" | "programmation" | "algebre" | "geometrie" | "probas" | "statistiques" | "general"
  date: string
  author: string
  authorAvatar: string
  authorBio: string
  readTime: string
  content: string // HTML
  tags: string[]
  related: string[] // slugs
  comments: CommentItem[]
}

const todayYear = new Date().getFullYear()

const ARTICLES: Record<string, Article> = {
  "brevet-maths-guide": {
    slug: "brevet-maths-guide",
    title: "Préparer le Brevet des collèges en mathématiques",
    description: "Guide complet pour réviser et réussir l'épreuve de mathématiques du Brevet",
    image: "/images/brevet.jpg",
    category: "concours",
    date: `22 septembre ${todayYear}`,
    author: "Pape Baba Sylla",
    authorAvatar: "/images/authors/thomas.jpg",
    authorBio: "Passionné par la pédagogie et l'accompagnement des élèves.",
    readTime: "12 min",
    content: `
      <p>Le Brevet est la première grande étape de votre parcours. Une préparation régulière et structurée suffit pour faire la différence.</p>

      <h2>Structure de l'épreuve</h2>
      <ul>
        <li>Nombres et calculs</li>
        <li>Organisation et gestion de données, fonctions</li>
        <li>Grandeurs et mesures</li>
        <li>Espace et géométrie</li>
        
      </ul>

      <h2>Méthodologie en 5 étapes</h2>
      <ol>
        <li>Faire un bilan de vos connaissances</li>
        <li>Établir un planning de révision</li>
        <li>Réviser les notions théoriques avec des fiches</li>
        <li>S'entraîner progressivement puis en conditions réelles</li>
        <li>Analyser ses erreurs et consolider</li>
      </ol>

      <h2>Notions clés à maîtriser</h2>
      <ul>
        <li><strong>Calculs</strong> : fractions, puissances, calcul littéral</li>
        <li><strong>Fonctions</strong> : proportionnalité, affine</li>
        <li><strong>Statistiques</strong> : moyenne, médiane, expériences simples</li>
        <li><strong>Géométrie</strong> : Thalès, Pythagore, trigonométrie</li>
      </ul>

      <h2>Jour J</h2>
      <p>Lisez tout le sujet, gérez le temps, commencez par vos points forts et soignez la rédaction.</p>
    `,
    tags: ["Brevet", "Collège", "Révisions", "Examens", "Méthodologie"],
    related: ["reussir-en-maths", "olympiades-maths", "bac-maths-guide"],
    comments: [
      {
        id: 1,
        author: "Aba Lo",
        authorAvatar: "/images/avatars/sophie.jpg",
        date: `22 septembre ${todayYear}`,
        content: "Merci pour cet article très clair, ça rassure mon fils !",
        likes: 8,
      },
      {
        id: 2,
        author: "Pape Sidy Seye",
        authorAvatar: "/images/avatars/lucas.jpg",
        date: `23 sepembre ${todayYear}`,
        content: "Un récap des formules de géométrie serait top.",
        likes: 3,
      },
    ],
  },

  "reussir-en-maths": {
    slug: "reussir-en-maths",
    title: "Comment réussir en mathématiques ? 10 habitudes qui marchent",
    description: "Organisation, mémorisation active et entraînement ciblé: le trio gagnant.",
    image: "/images/reussirenmaths.jpg",
    category: "methodes",
    date: `15 septembre ${todayYear}`,
    author: "Mamadou Ndao",
    authorAvatar: "/images/claire.jpg",
    authorBio: "Passionné par les méthodes de travail et de l'apprentissage.",
    readTime: "9 min",
    content: `
      <h2>Les 10 habitudes</h2>
      <ol>
        <li><strong>Planifier court mais souvent</strong> (25–40 min).</li>
        <li><strong>Active recall</strong> : réciter sans support et vérifier.</li>
        <li><strong>Fiches ultra-courtes</strong> (formules + 1 exemple).</li>
        <li><strong>Exercices progressifs</strong> : facile → moyen → sujet complet.</li>
        <li><strong>Correction active</strong> : refaire après avoir compris.</li>
        <li><strong>Méthode des erreurs</strong> : carnet d’erreurs personnel.</li>
        <li><strong>Enseigner</strong> à voix haute (effet Protégé).</li>
        <li><strong>Rituels</strong> : 5 min de calcul mental par jour.</li>
        <li><strong>Hygiène de vie</strong> : sommeil, pauses, hydratation.</li>
        <li><strong>Feedback</strong> régulier d’un prof/mentor.</li>
      </ol>

      <h2>Outils</h2>
      <ul>
        <li>Tableur de suivi (chapitres, score, relecture J+2 / J+7).</li>
        <li>Banque d’exercices classés par compétence.</li>
        <li>Quiz minute pour vérifier la mémorisation.</li>
      </ul>
    `,
    tags: ["Méthodes", "Organisation", "Révisions"],
    related: ["brevet-maths-guide", "bac-maths-guide", "calcul-mental-techniques"],
    comments: [],
  },

  "olympiades-maths": {
    slug: "olympiades-maths",
    title: "Préparer les Olympiades de mathématiques",
    description: "Curiosité, rigueur et créativité: votre boîte à outils pour les problèmes ouverts.",
    image: "/images/olymp.jpg",
    category: "concours",
    date: `13 septembre ${todayYear}`,
    author: "Mame Goumba Amar",
    authorAvatar: "/images/authors/yanis.jpg",
    authorBio: "Encadrant d’ateliers d’olympiades, amateur de combinatoire et de géométrie.",
    readTime: "11 min",
    content: `
     <h2>Esprit des Olympiades</h2>
<p>
  Plus qu’une simple compétition, les Olympiades incarnent une <em>philosophie de pensée</em> : 
  la recherche de la clarté, de la rigueur et de la créativité. 
  Ici, ce n’est pas seulement le résultat qui compte, mais la <strong>démarche intellectuelle</strong>, 
  la capacité à explorer, à douter, à rebondir. 
  Les solutions les plus simples, élégantes et universelles sont celles qui témoignent d’un 
  véritable <em>génie mathématique</em>.
</p>

<h2>Thèmes récurrents</h2>
<ul>
  <li><strong>Invariants, extremums, parité :</strong> au cœur de la logique mathématique, ces concepts révèlent la structure cachée des problèmes.</li>
  <li><strong>Combinatoire :</strong> l’art de compter sans énumérer, de modéliser la complexité à travers des schémas et du double comptage ingénieux.</li>
  <li><strong>Géométrie :</strong> un langage universel où barycentres, angles remarquables et symétries s’unissent pour construire la beauté des figures.</li>
  <li><strong>Arithmétique :</strong> la science des nombres, des diviseurs et des congruences, où chaque calcul devient une démonstration d’élégance.</li>
</ul>

<h2>Routine d'entraînement</h2>
<ol>
  <li>Commence par une lecture attentive de 10 minutes, puis <strong>pose des cas concrets</strong> et explore-les pendant 15 minutes supplémentaires.</li>
  <li>Note chaque piste, chaque intuition, même celles qui semblent mener à une impasse : elles forgent ton raisonnement.</li>
  <li>Analyse ensuite une correction, comprends la <em>logique profonde</em> derrière chaque étape, 
      puis <strong>refais l’exercice à blanc</strong> une semaine plus tard pour ancrer les réflexes.</li>
  <li>Enfin, partage tes réflexions : apprendre à <em>communiquer sa pensée</em> est aussi une forme d’art mathématique.</li>
</ol>

    `,
    tags: ["Olympiades", "Problèmes", "Raisonnement"],
    related: ["reussir-en-maths", "geometrie-analytique", "probabilites-intro"],
    comments: [],
  },

  "bac-maths-guide": {
    slug: "bac-maths-guide",
    title: "Réussir l'épreuve de mathématiques du Baccalauréat",
    description: "Stratégies par type d'exercice et gestion du temps pour le jour J.",
    image: "/images/bac.jpeg",
    category: "concours",
    date: `25 septembre ${todayYear}`,
    author: "Serigne Lo",
    authorAvatar: "/images/authors/serigne.jpg",
    authorBio: "Passionné par la pédagogie et l'accompagnement des élèves.",
    readTime: "13 min",
    content: `
     <h2>Réussir l’épreuve de mathématiques du Baccalauréat</h2>
<p>
  Réussir l’épreuve de mathématiques, c’est bien plus que maîtriser des formules : 
  c’est comprendre la <em>logique du raisonnement</em> et savoir l’exprimer avec clarté. 
  Cette épreuve évalue à la fois la précision, la rigueur et la capacité à relier 
  les notions entre elles. Chaque question devient une opportunité de démontrer 
  non seulement ce que vous savez, mais aussi <strong>comment vous pensez</strong>.
</p>

<h2>Compétences essentielles</h2>
<ul>
  <li><strong>Analyse et logique :</strong> décoder un énoncé, identifier les hypothèses implicites, et construire un raisonnement cohérent.</li>
  <li><strong>Maîtrise des outils :</strong> équations, dérivées, probabilités, suites ou vecteurs : chaque concept est une clé d’accès à la solution.</li>
  <li><strong>Clarté de la rédaction :</strong> une démonstration rigoureuse et structurée témoigne d’une vraie intelligence mathématique.</li>
  <li><strong>Gestion du temps :</strong> distinguer les questions stratégiques et optimiser son effort pour maximiser les points.</li>
</ul>

<h2>Méthode de préparation</h2>
<ol>
  <li>Révisez chaque chapitre en comprenant les <strong>idées fondamentales</strong> avant de vous concentrer sur les techniques.</li>
  <li>Entraînez-vous régulièrement avec des sujets types : analysez vos erreurs, notez les pièges récurrents, et mesurez vos progrès.</li>
  <li>Apprenez à <em>rédiger proprement</em> : une solution bien présentée vaut autant qu’un calcul juste.</li>
  <li>Le jour de l’épreuve, restez calme : l’esprit clair et méthodique surpasse toujours la précipitation.</li>
</ol>

<p>
  En définitive, réussir l’épreuve de mathématiques du Baccalauréat, 
  c’est allier <strong>logique, créativité et rigueur</strong>. 
  C’est prouver que la réflexion dépasse le calcul — et que la beauté des mathématiques 
  réside dans la cohérence de la pensée.
</p>

    `,
    tags: ["Bac", "Lycée", "Examen"],
    related: ["reussir-en-maths", "fonctions-lycee", "probabilites-intro"],
    comments: [],
  },

  "calcul-mental-techniques": {
    slug: "calcul-mental-techniques",
    title: "Calcul mental: techniques rapides et entraînement quotidien",
    description: "Trucs et astuces pour gagner en vitesse et en précision.",
    image: "/images/mental.jpg",
    category: "college",
    date: `10 Septembre ${todayYear}`,
    author: "Algassimou Bah",
    authorAvatar: "/images/authors/nadia.jpg",
    authorBio: "Coach en calcul mental, interventions en collèges et lycées.",
    readTime: "8 min",
    content: `
      <h2>Techniques clés</h2>
<p>
  Maîtriser les calculs mentaux repose sur une combinaison de <em>logique</em> et de <em>stratégie numérique</em>. 
  Ces techniques, simples en apparence, permettent d’aborder n’importe quel calcul avec assurance, 
  rapidité et précision. Elles développent la souplesse d’esprit nécessaire pour passer du raisonnement 
  concret à l’abstraction mathématique.
</p>
<ul>
  <li><strong>Décomposition :</strong> transformer un calcul en une forme plus simple, par exemple 
      48×25 = 48×(100/4) = 1200. Cette approche met en évidence les relations entre les nombres 
      et favorise la vision structurelle du calcul.</li>
  <li><strong>Compensation :</strong> ajuster un calcul pour le rendre plus fluide : 
      1001×n = 1000n + n. Une méthode idéale pour renforcer l’intuition numérique 
      et la maîtrise des ordres de grandeur.</li>
  <li><strong>Carrés rapides :</strong> (a±b)<sup>2</sup> = a<sup>2</sup> ± 2ab + b<sup>2</sup>. 
      Une identité fondamentale à connaître par cœur, utilisée dans de nombreux développements 
      algébriques et démonstrations.</li>
</ul>

<h2>Plan d'entraînement (5 min/jour)</h2>
<p>
  La régularité prime sur la durée : cinq minutes quotidiennes suffisent pour entretenir 
  et renforcer les automatismes. Ce rituel d’entraînement aiguise la concentration 
  et améliore la réactivité face aux calculs complexes.
</p>
<ol>
  <li><strong>Tables ciblées (×, ÷) – 2 min :</strong> concentrez-vous chaque jour sur une famille de nombres. 
      Variez les ordres et les enchaînements pour développer la mémoire réflexe.</li>
  <li><strong>Additions et soustractions avec paliers – 2 min :</strong> travaillez les passages de dizaine, 
      de centaine et les calculs en cascade. Cela solidifie la base du calcul mental rapide.</li>
  <li><strong>Défi hebdomadaire – 1 min :</strong> testez votre vitesse tout en maintenant 
      une <em>exactitude parfaite</em>. Le but : conjuguer rapidité, précision et confiance.</li>
</ol>

<p>
  En pratiquant ces exercices régulièrement, on forge une <strong>pensée mathématique agile</strong>, 
  capable de s’adapter à toute situation de calcul. Le calcul mental devient alors une 
  véritable <em>gymnastique de l’esprit</em>, indispensable à la réussite scolaire et au raisonnement logique.
</p>
    `,
    tags: ["Calcul mental", "Automatismes", "Rituels"],
    related: ["reussir-en-maths", "brevet-maths-guide", "fonctions-lycee"],
    comments: [],
  },

  "probabilites-intro": {
    slug: "probabilites-intro",
    title: "Comprendre les probabilités: de l’intuition aux calculs",
    description: "Expériences aléatoires, arbres, lois usuelles: les bases solides.",
    image: "/images/prob.jpg",
    category: "probas",
    date: `12 Septembre ${todayYear}`,
    author: "Ibrahima Sow",
    authorAvatar: "/images/authors/marc.jpg",
    authorBio: "Vulgarisateur des probabilités.",
    readTime: "10 min",
    content: `
<p>
  Les probabilités ne se résument pas à des chiffres : elles traduisent la manière dont nous 
  <em>appréhendons l’incertitude</em>. Comprendre ce domaine, c’est apprendre à raisonner dans un monde 
  où rien n’est certain, à distinguer le hasard du déterminisme, et à évaluer le degré de confiance 
  que l’on accorde à un événement. Des jeux de dés aux prévisions scientifiques, 
  les probabilités sont au cœur de la <strong>pensée logique et critique</strong>.
</p>

<h2>Concepts fondamentaux</h2>
<ul>
  <li><strong>Événements, union, intersection, complémentaire :</strong> la base du langage des probabilités. 
      Ces opérations permettent de décrire précisément les situations possibles et de raisonner avec rigueur.</li>
  <li><strong>Probabilités conditionnelles et arbres :</strong> comprendre qu’un événement peut influencer 
      la probabilité d’un autre. Les arbres de probabilité offrent une visualisation claire 
      des enchaînements logiques et des dépendances.</li>
  <li><strong>Loi binomiale :</strong> une distribution essentielle pour modéliser la répétition d’expériences 
      identiques et indépendantes. Ses paramètres <em>n</em> et <em>p</em> décrivent la structure du hasard, 
      tandis que l’espérance <em>np</em> et la variance <em>np(1−p)</em> en mesurent la régularité.</li>
</ul>

<h2>Pièges classiques</h2>
<p>
  Certains pièges reviennent souvent, même chez les plus avertis : 
  confondre « <strong>au moins une fois</strong> » et « <strong>exactement une fois</strong> », 
  ou négliger la <em>notion d’indépendance</em> entre deux événements. 
  Ces erreurs rappellent que la prudence et la rigueur sont indispensables 
  pour interpréter correctement les situations aléatoires.
</p>

<p>
  En développant son intuition probabiliste, on apprend à penser 
  en termes de <strong>risque, de stratégie et de prévision</strong>. 
  C’est une compétence universelle, autant utile dans les sciences que dans les décisions du quotidien.
</p>

    `,
    tags: ["Probabilités", "Arbres", "Binomiale"],
    related: ["bac-maths-guide", "statistiques-lycee", "olympiades-maths"],
    comments: [],
  },

  "geometrie-analytique": {
    slug: "geometrie-analytique",
    title: "Géométrie analytique: droites, cercles et stratégies",
    description: "Tout pour maîtriser les équations de droites et de cercles en repère.",
    image: "/images/geometrie.png",
    category: "geometrie",
    date: `06 septembre ${todayYear}`,
    author: "Moustapha Diagne",
    authorAvatar: "/images/authors/anais.jpg",
    authorBio: "Passionné de géométrie et de visualisation.",
    readTime: "9 min",
    content: `
<p>
  La géométrie analytique unit la rigueur de l’algèbre à l’intuition de la géométrie. 
  Elle permet de traduire une figure en équations, et inversement, 
  de donner une signification visuelle à des expressions symboliques. 
  C’est un langage universel où chaque point, chaque droite, chaque cercle 
  devient une équation révélant l’harmonie cachée des formes.
</p>

<h2>Droites</h2>
<p>
  Une droite est décrite par l’équation <em>y = mx + p</em>, 
  où <em>m</em> représente la <strong>pente</strong> (ou coefficient directeur) 
  et <em>p</em> l’<strong>ordonnée à l’origine</strong>.  
  Le coefficient <em>m</em> se calcule à partir de deux points connus selon la formule :
  <code>m = (y₂ − y₁) / (x₂ − x₁)</code>.  
  Graphiquement, il exprime la <em>variation de y</em> par rapport à celle de <em>x</em> — 
  autrement dit, l’<strong>inclinaison</strong> de la droite dans le plan.
</p>

<h2>Cercles</h2>
<p>
  L’équation du cercle <em>(x − a)² + (y − b)² = r²</em> traduit 
  la position du centre <em>(a, b)</em> et le rayon <em>r</em>.  
  Identifier ces paramètres à partir d’une équation développée 
  exige méthode et précision : il faut souvent compléter les carrés.  
  La <strong>tangence</strong> entre un cercle et une droite ou entre deux cercles 
  repose sur l’analyse de leurs distances relatives — un excellent exercice 
  de synthèse entre géométrie et algèbre.
</p>

<h2>Stratégies</h2>
<ul>
  <li><strong>Traduire la géométrie en équations :</strong> représenter une situation géométrique par un système algébrique clarifie les relations entre les objets.</li>
  <li><strong>Isoler les inconnues et vérifier les conditions :</strong> résoudre pas à pas tout en interprétant géométriquement les résultats. 
      Une équation ne prend tout son sens que lorsqu’on en comprend la portée graphique.</li>
  <li><strong>Utiliser les symétries et les coordonnées particulières :</strong> un bon choix de repère simplifie considérablement les calculs et met en évidence la structure du problème.</li>
</ul>

<p>
  Maîtriser la géométrie analytique, c’est apprendre à <strong>raisonner dans deux langages à la fois</strong> : 
  celui de la figure et celui de l’équation. C’est l’une des disciplines les plus formatrices 
  pour développer la rigueur, la vision spatiale et la puissance du raisonnement mathématique.
</p>

    `,
    tags: ["Géométrie", "Repère", "Droites", "Cercles"],
    related: ["fonctions-lycee", "bac-maths-guide", "olympiades-maths"],
    comments: [],
  },

  "algorithmique-python-college": {
    slug: "algorithmique-python-college",
    title: "Initiation à l’algorithmique et à Python (Pour les curieux)",
    description: "Variables, boucles, conditions et premiers programmes utiles.",
    image: "/images/python.jpg",
    category: "programmation",
    date: `10 septembre ${todayYear}`,
    author: "Jonas John Athnase Senghor",
    authorAvatar: "/images/authors/julie.jpg",
    authorBio: "Eleve-ingenieur en Genie Informatique.",
    readTime: "10 min",
    content: `
<p>
  L’algorithmique, c’est l’art de <em>penser avec rigueur</em> et de <em>résoudre efficacement</em> des problèmes.  
  En associant la logique des mathématiques à la puissance de l’informatique, 
  elle développe une méthode de pensée claire, structurée et universelle.  
  Python, par sa simplicité et sa lisibilité, est aujourd’hui le langage idéal pour 
  découvrir cet univers et traduire les idées en actions concrètes.
</p>

<h2>Notions essentielles</h2>
<ul>
  <li><strong>Variables et types :</strong> les fondations du langage.  
      Une variable permet de stocker une information (nombre, texte, valeur décimale).  
      Les types principaux sont <code>int</code> (entier), <code>float</code> (réel) et <code>str</code> (chaîne de caractères).</li>
  <li><strong>Conditions (<code>if / elif / else</code>) :</strong> elles permettent à un programme 
      de <em>prendre des décisions</em> selon la situation.  
      C’est le cœur de la logique algorithmique.</li>
  <li><strong>Boucles (<code>for</code>, <code>while</code>) :</strong> elles automatisent les répétitions.  
      Un bon usage des boucles transforme un raisonnement manuel en une procédure efficace.</li>
  <li><strong>Fonctions :</strong> définir une fonction, c’est <em>organiser sa pensée</em>.  
      Une fonction encapsule une idée pour pouvoir la réutiliser et la combiner à d’autres.  
      On la définit avec <code>def</code> et on l’appelle ensuite par son nom.</li>
</ul>

<h2>Exemple</h2>
<p>
  Voici un exemple simple illustrant la notion de <strong>boucle et de fonction</strong> en Python.  
  Ce programme calcule la somme des entiers de 1 à <em>n</em> :
</p>

<pre><code>def somme_n(n):
    s = 0
    for k in range(1, n+1):
        s += k
    return s

print(somme_n(100))
</code></pre>

<p>
  Cet algorithme montre comment une idée mathématique, ici la somme des premiers nombres entiers 
  se traduit en instructions précises.  
  En expérimentant avec Python, on apprend à <strong>penser en étapes logiques</strong>, 
  à anticiper les résultats, et à comprendre la mécanique invisible des calculs.  
  C’est une porte d’entrée fascinante vers la <em>pensée algorithmique</em> et la 
  <strong>création numérique intelligente</strong>.
</p>

    `,
    tags: ["Python", "Algorithmique", "Collège"],
    related: ["brevet-maths-guide", "reussir-en-maths", "calcul-mental-techniques"],
    comments: [],
  },

  "fonctions-lycee": {
    slug: "fonctions-lycee",
    title: "Fonctions au lycée : ln, exp",
    description: "Les réflexes pour analyser, calculer et justifier rapidement.",
    image: "/images/ln.png",
    category: "algebre",
    date: `18 septembre ${todayYear}`,
    author: "Boubacar Sidibe",
    authorAvatar: "/images/authors/olivier.jpg",
    authorBio: "Passionné par l’analyse.",
    readTime: "12 min",
    content: `
<p>
  Les fonctions <em>exponentielle</em> et <em>logarithme népérien</em> occupent une place centrale au lycée.  
  Elles lient le calcul, la modélisation et la compréhension du changement.  
  Ce duo, noté <code>exp(x)</code> et <code>ln(x)</code>, forme un couple fondamental en analyse : 
  l’une « défait » l’autre, et ensemble, elles permettent d’explorer des phénomènes 
  de croissance, de décroissance et d’équilibre dans tous les domaines scientifiques.
</p>

<h2>Fonction exponentielle <code>exp(x)</code></h2>
<p>
  La fonction exponentielle, notée <code>exp(x)</code> ou <code>e<sup>x</sup></code>, 
  est définie comme la fonction dérivant sur elle-même :  
  <code>(exp(x))' = exp(x)</code>.  
  Elle est toujours positive, croissante sur ℝ et satisfait <code>exp(0) = 1</code>.  
  Son comportement traduit une <strong>croissance continue et rapide</strong>, 
  caractéristique des phénomènes naturels comme les intérêts composés, la démographie ou la radioactivité.
</p>

<h2>Fonction logarithme népérien <code>ln(x)</code></h2>
<p>
  La fonction logarithme népérien, inverse de l’exponentielle, est définie pour tout <em>x &gt; 0</em>.  
  Elle vérifie <code>exp(ln(x)) = x</code> et <code>ln(exp(x)) = x</code>.  
  Son dérivé, <code>(ln(x))' = 1/x</code>, exprime la <strong>croissance lente</strong> des grandeurs proportionnelles 
  et son rôle dans les calculs d’aires et d’intégrales.  
  Graphiquement, <em>ln(x)</em> est une courbe douce, s’élevant lentement mais sans jamais s’arrêter.
</p>

<h2>Relations fondamentales</h2>
<ul>
  <li><code>ln(ab) = ln(a) + ln(b)</code> et <code>ln(a<sup>n</sup>) = n × ln(a)</code> : propriétés de linéarité du logarithme.</li>
  <li><code>exp(a + b) = exp(a) × exp(b)</code> : image miroir de la précédente, 
      traduisant la cohérence entre addition et multiplication.</li>
  <li>Les deux fonctions sont <strong>réciproques</strong> : elles se “défont” mutuellement, 
      un concept essentiel pour les équations et les changements de variable.</li>
</ul>

<h2>Applications et interprétations</h2>
<p>
  L’étude des fonctions <em>ln</em> et <em>exp</em> permet de modéliser des processus naturels et économiques, 
  d’explorer les limites, les dérivées et les équations différentielles.  
  Ces fonctions sont les <strong>piliers du raisonnement analytique</strong> : 
  elles introduisent la continuité, la transformation et la croissance dans le langage des nombres réels.
</p>

<p>
  Maîtriser <code>ln(x)</code> et <code>exp(x)</code>, c’est comprendre une part essentielle 
  du lien entre les mathématiques et le monde réel : 
  <strong>le passage du discret au continu, du calcul à la compréhension du changement</strong>.
</p>

    `,
    tags: ["Fonctions", "Analyse", "Lycée"],
    related: ["bac-maths-guide", "geometrie-analytique", "probabilites-intro"],
    comments: [],
  },

  "statistiques-lycee": {
    slug: "statistiques-lycee",
    title: "Statistiques: moyenne, médiane, écart-type et interprétation",
    description: "De la lecture d’un tableau à l’analyse critique de données.",
    image: "/images/stat.png",
    category: "statistiques",
    date: `09 septembre ${todayYear}`,
    author: "Mary Sadio Toure",
    authorAvatar: "/images/authors/rania.jpg",
    authorBio: "Data analyst et intervenante en lycée.",
    readTime: "9 min",
    content: `
<p>
  Les statistiques permettent de <em>donner du sens aux données</em>.  
  Elles ne se limitent pas à des calculs : elles traduisent une réalité, 
  résument une tendance et révèlent la dispersion d’un ensemble de valeurs.  
  Comprendre ces indicateurs, c’est apprendre à observer le monde avec rigueur, 
  à mesurer l’équilibre et la variabilité dans les phénomènes réels.
</p>

<h2>Moyenne</h2>
<p>
  La <strong>moyenne</strong> est le centre de gravité d’une série de données :  
  elle rassemble en un seul nombre l’équilibre entre toutes les valeurs observées.  
  Elle se calcule en additionnant les valeurs puis en divisant par leur nombre :  
  <code>moyenne = (x₁ + x₂ + … + xₙ) / n</code>.  
  La moyenne est sensible aux valeurs extrêmes, ce qui en fait un indicateur précis, mais parfois fragile.
</p>

<h2>Médiane</h2>
<p>
  La <strong>médiane</strong> est la valeur qui partage la série en deux parties égales :  
  50 % des données sont en dessous, 50 % au-dessus.  
  Elle mesure la <em>position centrale réelle</em> et reste stable même en présence de valeurs aberrantes.  
  Elle est particulièrement utile pour représenter les revenus, les notes ou les temps de réponse.
</p>

<h2>Écart-type</h2>
<p>
  L’<strong>écart-type</strong> mesure la <em>dispersion</em> des données autour de la moyenne.  
  Il indique si les valeurs sont regroupées (petit écart-type) ou éparpillées (grand écart-type).  
  Sa formule s’exprime par :  
  <code>σ = √((Σ(xᵢ − moyenne)²) / n)</code>.  
  C’est un outil essentiel pour évaluer la <strong>variabilité</strong> et la fiabilité d’une mesure.
</p>

<h2>Interprétation et analyse</h2>
<ul>
  <li><strong>Moyenne</strong> : décrit la tendance générale.</li>
  <li><strong>Médiane</strong> : décrit la position centrale réelle.</li>
  <li><strong>Écart-type</strong> : décrit la régularité et la dispersion.</li>
</ul>

<p>
  L’interprétation statistique ne consiste pas seulement à « lire » des nombres, 
  mais à <strong>comprendre ce qu’ils racontent</strong>.  
  Une moyenne sans écart-type est muette ; un écart-type sans contexte est vide de sens.  
  Ensemble, ces indicateurs forment une image équilibrée d’une réalité complexe, 
  entre stabilité et variabilité.
</p>

<p>
  Apprendre les statistiques, c’est apprendre à <em>raisonner sur des ensembles</em>, 
  à prendre du recul, et à voir dans les données non pas un amas de chiffres, 
  mais une histoire à interpréter avec esprit critique et méthode.
</p>

    `,
    tags: ["Statistiques", "Données", "Analyse"],
    related: ["probabilites-intro", "bac-maths-guide", "reussir-en-maths"],
    comments: [],
  },
}

function getRelated(slug: string) {
  const a = ARTICLES[slug]
  if (!a) return []
  return a.related
    .map(s => ARTICLES[s])
    .filter(Boolean)
    .map(ar => ({
      slug: ar.slug,
      title: ar.title,
      image: ar.image,
      category: ar.category,
      date: ar.date,
    }))
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const slug = decodeURIComponent(params.id)
  const article = ARTICLES[slug]

  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState<CommentItem[]>(article?.comments || [])
  const [likedComments, setLikedComments] = useState(new Set<number>())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [articleLikesCount, setArticleLikesCount] = useState(0)
  const relatedArticles = getRelated(slug)

  // Charger les états des likes et bookmarks
  useEffect(() => {
    const loadUserInteractions = async () => {
      try {
        // Likes article (total)
        const allLikesQuery = query(
          collection(db, "blog_likes"),
          where("articleId", "==", slug),
          where("type", "==", "article")
        )
        const allLikesSnap = await getDocs(allLikesQuery)
        const activeLikes = allLikesSnap.docs.filter(doc => !doc.data().deleted)
        setArticleLikesCount(activeLikes.length)

        if (!user) return

        // Like de l'utilisateur
        const articleLikesQuery = query(
          collection(db, "blog_likes"),
          where("userId", "==", user.uid),
          where("articleId", "==", slug),
          where("type", "==", "article")
        )
        const articleLikesSnap = await getDocs(articleLikesQuery)
        setIsLiked(articleLikesSnap.docs.some(doc => !doc.data().deleted))

        // Bookmark de l'utilisateur
        const bookmarksQuery = query(
          collection(db, "blog_bookmarks"),
          where("userId", "==", user.uid),
          where("articleId", "==", slug)
        )
        const bookmarksSnap = await getDocs(bookmarksQuery)
        setIsBookmarked(bookmarksSnap.docs.some(doc => !doc.data().deleted))

        // Likes des commentaires
        const commentLikesQuery = query(
          collection(db, "blog_likes"),
          where("userId", "==", user.uid),
          where("articleId", "==", slug),
          where("type", "==", "comment")
        )
        const commentLikesSnap = await getDocs(commentLikesQuery)
        const likedCommentIds = new Set<number>()
        commentLikesSnap.docs.forEach(doc => {
          const data = doc.data()
          if (data.commentId && !data.deleted) likedCommentIds.add(data.commentId)
        })
        setLikedComments(likedCommentIds)
      } catch (error) {
        console.error("Erreur interactions:", error)
      }
    }
    if (article) {
      setComments(article.comments || [])
      loadUserInteractions()
    }
  }, [user, slug, article])

  if (!article) {
    return (
      <div className="container py-10">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/blog")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Badge variant="secondary">Article</Badge>
        </div>
        <h1 className="text-2xl font-bold mb-2">Article introuvable</h1>
        <p className="text-muted-foreground mb-6">Le sujet demandé n’existe pas. Essayez l’un de ces articles:</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(ARTICLES).slice(0, 6).map(a => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="p-4 border rounded-md hover:bg-muted/30">
              <div className="relative w-full h-32 rounded mb-2 overflow-hidden">
                <Image src={a.image || "/placeholder.svg"} alt={a.title} fill className="object-cover" />
              </div>
              <div className="text-sm text-muted-foreground">{a.date}</div>
              <div className="font-medium">{a.title}</div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour aimer cet article",
        variant: "destructive",
      })
      return
    }
    try {
      if (isLiked) {
        const likesQueryRef = query(
          collection(db, "blog_likes"),
          where("userId", "==", user.uid),
          where("articleId", "==", slug),
          where("type", "==", "article")
        )
        const likesSnap = await getDocs(likesQueryRef)
        await Promise.all(likesSnap.docs.map(d => updateDoc(firestoreDoc(db, "blog_likes", d.id), { deleted: true })))
        setIsLiked(false)
        setArticleLikesCount(prev => Math.max(0, prev - 1))
        toast({ title: "J'aime retiré", description: "Vous avez retiré votre like" })
      } else {
        await addDoc(collection(db, "blog_likes"), {
          userId: user.uid,
          articleId: slug,
          type: "article",
          date: serverTimestamp(),
        })
        setIsLiked(true)
        setArticleLikesCount(prev => prev + 1)
        toast({ title: "J'aime ajouté", description: "Vous avez aimé cet article" })
      }
    } catch (error) {
      console.error("Erreur like:", error)
      toast({ title: "Erreur", description: "Impossible de modifier le like", variant: "destructive" })
    }
  }

  const handleBookmark = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour enregistrer cet article",
        variant: "destructive",
      })
      return
    }
    try {
      if (isBookmarked) {
        const bookmarksQueryRef = query(
          collection(db, "blog_bookmarks"),
          where("userId", "==", user.uid),
          where("articleId", "==", slug)
        )
        const bookmarksSnap = await getDocs(bookmarksQueryRef)
        await Promise.all(bookmarksSnap.docs.map(d => updateDoc(firestoreDoc(db, "blog_bookmarks", d.id), { deleted: true })))
        setIsBookmarked(false)
        toast({ title: "Enregistrement retiré", description: "Article retiré de vos favoris" })
      } else {
        await addDoc(collection(db, "blog_bookmarks"), {
          userId: user.uid,
          articleId: slug,
          date: serverTimestamp(),
        })
        setIsBookmarked(true)
        toast({ title: "Article enregistré", description: "Article ajouté à vos favoris" })
      }
    } catch (error) {
      console.error("Erreur bookmark:", error)
      toast({ title: "Erreur", description: "Impossible d'enregistrer l'article", variant: "destructive" })
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShowShareOptions(!showShareOptions)
      toast({ title: "Lien copié", description: "Le lien de l'article a été copié dans le presse-papiers" })
    } catch {
      setShowShareOptions(!showShareOptions)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({ title: "Connexion requise", description: "Connectez-vous pour commenter", variant: "destructive" })
      router.push(`/connexion?redirect=/blog/${slug}`)
      return
    }
    if (!commentText.trim()) return

    setIsSubmitting(true)
    try {
      let userName = user.displayName || "Utilisateur"
      let userAvatar = user.photoURL || ""

      try {
        const userDocRef = firestoreDoc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          const ud = userDoc.data() as any
          if (ud.nom) userName = ud.nom
          if (ud.avatar) userAvatar = ud.avatar
        }
      } catch {}

      const newComment: CommentItem = {
        id: (comments.at(-1)?.id || 0) + 1,
        author: userName,
        authorAvatar: userAvatar,
        date: "À l'instant",
        content: commentText.trim(),
        likes: 0,
      }

      await addDoc(collection(db, "blog_comments"), {
        articleId: slug,
        auteur: { id: user.uid, nom: userName, avatar: userAvatar },
        contenu: commentText.trim(),
        dateCreation: serverTimestamp(),
        likes: 0,
      })

      setComments(prev => [...prev, newComment])
      setCommentText("")
      toast({ title: "Commentaire publié", description: "Votre commentaire a été ajouté" })
    } catch (error) {
      console.error("Erreur commentaire:", error)
      toast({ title: "Erreur", description: "Impossible de publier le commentaire", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: number) => {
    if (!user) {
      toast({ title: "Connexion requise", description: "Connectez-vous pour aimer un commentaire", variant: "destructive" })
      return
    }
    try {
      if (likedComments.has(commentId)) {
        const likesQueryRef = query(
          collection(db, "blog_likes"),
          where("userId", "==", user.uid),
          where("commentId", "==", commentId),
          where("type", "==", "comment")
        )
        const likesSnap = await getDocs(likesQueryRef)
        await Promise.all(likesSnap.docs.map(d => updateDoc(firestoreDoc(db, "blog_likes", d.id), { deleted: true })))

        setComments(prev => prev.map(c => (c.id === commentId ? { ...c, likes: Math.max(0, c.likes - 1) } : c)))
        const next = new Set(likedComments); next.delete(commentId); setLikedComments(next)
        toast({ title: "J'aime retiré", description: "Vous avez retiré votre like" })
      } else {
        await addDoc(collection(db, "blog_likes"), {
          userId: user.uid,
          articleId: slug,
          commentId,
          type: "comment",
          date: serverTimestamp(),
        })
        setComments(prev => prev.map(c => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c)))
        setLikedComments(new Set([...likedComments, commentId]))
        toast({ title: "J'aime ajouté", description: "Vous avez aimé ce commentaire" })
      }
    } catch (error) {
      console.error("Erreur like commentaire:", error)
      toast({ title: "Erreur", description: "Impossible de modifier le like", variant: "destructive" })
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  return (
    <div className="container py-10">
      <motion.div className="flex items-center gap-2 mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <Button variant="ghost" size="icon" onClick={() => router.push("/blog")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Badge className="bg-green-500/10 text-green-500">
          {article.category === "concours" ? "Concours" : article.category}
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-8">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {article.date}
              </div>
              <div className="flex items-center">
                <UserIcon className="mr-1 h-4 w-4" />
                {article.author}
              </div>
              <div>Lecture: {article.readTime}</div>
            </div>

            <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />

            {!!(article.tags && article.tags.length) && (
              <div className="flex flex-wrap gap-2 mt-8">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-4 border-t">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={isLiked ? "text-primary" : "text-muted-foreground"}
                  onClick={handleLike}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" /> {isLiked ? "Ne plus aimer" : "J'aime"} ({articleLikesCount})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => {
                    const commentsSection = document.getElementById("comments")
                    if (commentsSection) commentsSection.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-1" /> Commenter
                </Button>
                <div className="relative">
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleShare}>
                    <Share className="h-4 w-4 mr-1" /> Partager
                  </Button>
                  {showShareOptions && (
                    <div className="absolute top-full left-0 mt-2 p-2 bg-background border rounded-md shadow-md flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Facebook className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Twitter className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Linkedin className="h-4 w-4 text-blue-700" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className={isBookmarked ? "text-primary" : "text-muted-foreground"}
                onClick={handleBookmark}
              >
                <Bookmark className="h-4 w-4 mr-1" /> Enregistrer
              </Button>
            </div>
          </motion.div>

          <Separator />

          <motion.div initial="hidden" animate="visible" variants={fadeIn} id="comments">
            <h2 className="text-2xl font-bold mb-6">Commentaires ({comments.length})</h2>

            <form onSubmit={handleSubmitComment} className="mb-8">
              <Textarea
                placeholder="Ajouter un commentaire..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mb-2"
                rows={3}
              />
              <Button type="submit" className="bg-gray-900 hover:bg-gray-800 ml-auto" disabled={!commentText.trim() || isSubmitting}>
                {isSubmitting ? "Publication..." : "Publier"}
              </Button>
            </form>

            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
              {comments.map((comment) => (
                <motion.div key={comment.id} variants={fadeIn}>
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} alt={comment.author} />
                      <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.date}</span>
                      </div>
                      <p className="text-sm mb-2">{comment.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs ${likedComments.has(comment.id) ? "text-primary" : "text-muted-foreground"}`}
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" /> {likedComments.has(comment.id) ? "Ne plus aimer" : "J'aime"} ({comment.likes})
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">À propos de l'auteur</h3>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={article.authorAvatar || "/placeholder.svg"} alt={article.author} />
                  <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{article.author}</div>
                  <div className="text-xs text-muted-foreground">Auteur</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{article.authorBio}</p>
              <Button variant="outline" size="sm" className="w-full">
                Voir tous ses articles
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Articles similaires</h3>
              <div className="space-y-4">
                {relatedArticles.map((ra) => (
                  <Link key={ra.slug} href={`/blog/${ra.slug}`} className="flex gap-3 group">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={ra.image || "/placeholder.svg"} alt={ra.title} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {ra.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">{ra.date}</p>
                    </div>
                  </Link>
                ))}
                {relatedArticles.length === 0 && <div className="text-sm text-muted-foreground">Aucun article similaire.</div>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Tags populaires</h3>
              <div className="flex flex-wrap gap-2">
                {(article.tags && article.tags.length ? article.tags : ["Maths", "Révisions", "Concours"]).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}