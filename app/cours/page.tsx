"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowRight, Clock, GraduationCap, Sparkles, TrendingUp, Award, Star, Search } from "lucide-react"
import { getCourseImage } from "@/lib/utils/course-images"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

const levels = [
  { id: "college", name: "Collège", classes: ["6ème", "5ème", "4ème", "3ème"], icon: "📚", color: "from-blue-500 to-cyan-500" },
  { id: "lycee", name: "Lycée", classes: ["2nde", "1ère", "Terminale"], icon: "🎓", color: "from-purple-500 to-pink-500" },
  { id: "superieur", name: "Supérieur", classes: ["Licence", "Master", "Prépa"], icon: "🏆", color: "from-orange-500 to-red-500" },
]

interface Course {
  id: number
  title: string
  description: string
  image: string
  duration: string
}

type ClasseKey = "6ème" | "5ème" | "4ème" | "3ème" | "2nde" | "1ère" | "Terminale" | "Licence" | "Master" | "Prépa"

const coursesData: Record<ClasseKey, Course[]> = {
  "6ème": [
    {
      id: 1,
      title: "Nombres décimaux",
      description: "Découvrez le monde fascinant des nombres décimaux ! Maîtrisez les opérations avec des exemples concrets de la vie quotidienne. Un cours interactif qui transforme les mathématiques en jeu passionnant.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 2,
      title: "Fractions",
      description: "Plongez dans l'univers des fractions ! Apprenez à les manipuler avec aisance grâce à des méthodes visuelles et des exercices progressifs. Transformez ce qui semble complexe en jeu d'enfant.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 3,
      title: "Géométrie plane",
      description: "Explorez les formes géométriques qui nous entourent ! De la construction à la mesure, découvrez les secrets des figures planes avec des activités pratiques et créatives.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h",
    },
    {
      id: 70,
      title: "Périmètres et aires",
      description: "Calculez comme un architecte ! Apprenez à mesurer périmètres et aires avec des projets concrets. Transformez votre compréhension de l'espace avec des exemples fascinants.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 71,
      title: "Symétrie et transformations",
      description: "Découvrez la beauté cachée des symétries ! Apprenez à créer des motifs fascinants et à comprendre les transformations géométriques qui nous entourent dans la nature et l'art.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h45",
    },
    {
      id: 72,
      title: "Proportionnalité",
      description: "Maîtrisez les proportions comme un chef cuisinier ! Découvrez comment les mathématiques régissent les recettes, les échelles, les cartes et bien plus encore dans votre quotidien.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h15",
    },
    {
      id: 73,
      title: "Pourcentages",
      description: "Les pourcentages n'auront plus de secrets pour vous ! Apprenez à calculer réductions, augmentations et statistiques avec des exemples de la vie réelle. Devenez un expert en calculs commerciaux !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 74,
      title: "Angles et mesures",
      description: "Mesurez le monde qui vous entoure ! Découvrez les angles sous un nouveau jour avec des activités pratiques, des outils interactifs et des applications concrètes dans la vie quotidienne.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 75,
      title: "Nombres entiers et opérations",
      description: "Maîtrisez les opérations fondamentales ! Addition, soustraction, multiplication et division n'auront plus de secrets. Des méthodes simples et efficaces pour calculer rapidement et avec précision.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h30",
    },
    {
      id: 76,
      title: "Problèmes mathématiques",
      description: "Résolvez des problèmes passionnants ! Apprenez à analyser, comprendre et résoudre des situations complexes avec des méthodes structurées. Développez votre raisonnement logique !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h",
    },
  ],
  "5ème": [
    {
      id: 4,
      title: "Nombres relatifs",
      description: "Voyagez dans le monde des nombres négatifs ! Comprenez comment fonctionnent les températures, les altitudes et les dettes. Un cours qui donne du sens aux nombres relatifs avec des exemples concrets et passionnants.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h",
    },
    {
      id: 5,
      title: "Calcul littéral",
      description: "Entrez dans l'univers de l'algèbre ! Découvrez comment les lettres remplacent les nombres et ouvrez la porte à la résolution de problèmes complexes. Une introduction fascinante au langage mathématique.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h30",
    },
    {
      id: 6,
      title: "Triangles",
      description: "Explorez les propriétés fascinantes des triangles ! De la construction à la démonstration, découvrez pourquoi les triangles sont partout autour de nous. Géométrie pratique et théorique combinées.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h45",
    },
    {
      id: 77,
      title: "Parallélogrammes et quadrilatères",
      description: "Découvrez la famille des quadrilatères ! Apprenez à reconnaître et construire ces figures géométriques avec des méthodes simples et efficaces. Explorez leurs propriétés remarquables.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 78,
      title: "Statistiques descriptives",
      description: "Devenez un expert en données ! Apprenez à lire, analyser et présenter des statistiques avec des exemples concrets et des graphiques interactifs. Découvrez le pouvoir des données !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 79,
      title: "Probabilités simples",
      description: "Calculez vos chances de gagner ! Découvrez les probabilités à travers des jeux, des expériences et des situations amusantes. Transformez le hasard en science passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h15",
    },
    {
      id: 80,
      title: "Volumes et capacités",
      description: "Mesurez l'espace en 3D ! Apprenez à calculer les volumes de solides avec des méthodes visuelles et des applications pratiques. Explorez le monde tridimensionnel !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h30",
    },
    {
      id: 81,
      title: "Proportionnalité avancée",
      description: "Maîtrisez les relations proportionnelles complexes ! Découvrez comment identifier et utiliser la proportionnalité dans des situations variées et passionnantes de la vie quotidienne.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
  ],
  "4ème": [
    {
      id: 7,
      title: "Puissances",
      description: "Maîtrisez la puissance des nombres ! Découvrez comment les puissances simplifient les calculs et ouvrent la porte aux sciences modernes. Explorez l'univers des très grands et très petits nombres !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h15",
    },
    {
      id: 8,
      title: "Théorème de Pythagore",
      description: "Découvrez l'un des théorèmes les plus célèbres de l'histoire ! Apprenez à l'appliquer dans des situations concrètes et à résoudre des problèmes fascinants. Géométrie et histoire combinées !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h20",
    },
    {
      id: 9,
      title: "Proportionnalité",
      description: "Maîtrisez les relations proportionnelles ! Découvrez comment identifier et utiliser la proportionnalité dans des situations variées. Tableaux, graphiques et applications multiples vous attendent !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h50",
    },
    {
      id: 82,
      title: "Théorème de Thalès",
      description: "Explorez un autre théorème fondamental ! Apprenez à utiliser Thalès pour calculer des distances inaccessibles et résoudre des problèmes géométriques fascinants. Applications pratiques garanties !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 83,
      title: "Fonctions linéaires et affines",
      description: "Entrez dans le monde des fonctions ! Découvrez comment représenter graphiquement des relations mathématiques et prédire des résultats. Modélisation et prédiction au programme !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h30",
    },
    {
      id: 84,
      title: "Calcul littéral avancé",
      description: "Perfectionnez votre maîtrise de l'algèbre ! Développez, factorisez et simplifiez des expressions complexes avec aisance. Techniques avancées pour devenir un expert !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h",
    },
    {
      id: 85,
      title: "Sphères et boules",
      description: "Explorez les formes rondes en 3D ! Apprenez à calculer les volumes et aires de sphères avec des applications fascinantes. Géométrie spatiale passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 86,
      title: "Statistiques et probabilités",
      description: "Devenez expert en analyse de données ! Apprenez à calculer des indicateurs statistiques et à évaluer des probabilités. Découvrez le monde fascinant des données !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h45",
    },
  ],
  "3ème": [
    {
      id: 10,
      title: "Équations",
      description: "Résolvez des équations comme un détective ! Découvrez les méthodes pour trouver l'inconnue et résoudre des problèmes passionnants. Devenez un expert en résolution d'équations !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h10",
    },
    {
      id: 11,
      title: "Fonctions linéaires",
      description: "Maîtrisez les fonctions linéaires ! Apprenez à les représenter, les analyser et les utiliser pour modéliser des situations réelles. Graphiques et applications concrètes au rendez-vous !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h40",
    },
    {
      id: 12,
      title: "Trigonométrie",
      description: "Découvrez la trigonométrie ! Apprenez à utiliser sinus, cosinus et tangente pour résoudre des problèmes géométriques fascinants. Applications pratiques et calculs passionnants !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h15",
    },
    {
      id: 87,
      title: "Systèmes d'équations",
      description: "Résolvez plusieurs équations simultanément ! Découvrez des méthodes efficaces pour trouver des solutions à des problèmes complexes. Substitution et élimination n'auront plus de secrets !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h30",
    },
    {
      id: 88,
      title: "Inéquations",
      description: "Explorez le monde des inégalités ! Apprenez à résoudre des inéquations et à représenter leurs solutions graphiquement. Intervalles et représentations visuelles au programme !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 89,
      title: "Statistiques et probabilités avancées",
      description: "Devenez expert en analyse de données ! Apprenez à calculer des indicateurs statistiques et à évaluer des probabilités complexes. Analyse approfondie et applications passionnantes !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h",
    },
    {
      id: 90,
      title: "Géométrie dans l'espace",
      description: "Explorez la géométrie en 3 dimensions ! Découvrez les solides, leurs propriétés et leurs volumes avec des visualisations interactives. Géométrie spatiale fascinante !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h30",
    },
    {
      id: 91,
      title: "Arithmétique et nombres",
      description: "Plongez dans l'univers des nombres ! Découvrez les nombres premiers, les diviseurs et les multiples avec des applications fascinantes. Arithmétique passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h15",
    },
  ],
  "2nde": [
    {
      id: 13,
      title: "Calcul dans ℝ",
      description: "Explorez l'univers des nombres réels ! Maîtrisez les opérations fondamentales et découvrez les propriétés fascinantes des nombres réels. Un cours essentiel pour comprendre les mathématiques modernes !",
      image: "/images/exo.jpg",
      duration: "2h",
    },
    {
      id: 14,
      title: "Calcul Vectoriel",
      description: "Plongez dans le monde des vecteurs ! Découvrez comment les vecteurs modélisent les forces, les déplacements et bien plus. Géométrie et physique combinées de manière passionnante !",
      image: "/images/exo.jpg",
      duration: "2h",
    },
    {
      id: 15,
      title: "Les équations du second degré",
      description: "Maîtrisez la résolution des équations du second degré ! Découvrez le discriminant, la factorisation et la formule quadratique. Résolvez des problèmes fascinants avec élégance !",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
    {
      id: 16,
      title: "Le Barycentre",
      description: "Découvrez le concept fascinant du barycentre ! Apprenez à calculer le centre de gravité de systèmes de points et explorez ses applications en géométrie et physique. Un outil puissant !",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
    {
      id: 17,
      title: "Les systèmes d'équations",
      description: "Résolvez des systèmes complexes avec aisance ! Découvrez des méthodes élégantes pour trouver des solutions simultanées. Applications pratiques et problèmes passionnants vous attendent !",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
    {
      id: 18,
      title: "Angles orientés et Trigonométrie",
      description: "Explorez la trigonométrie avancée ! Découvrez les angles orientés et leurs applications fascinantes. Maîtrisez les relations trigonométriques complexes avec des méthodes claires !",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
    {
      id: 19,
      title: "Fonctions numériques",
      description: "Plongez dans l'analyse des fonctions ! Découvrez comment étudier les variations, les limites et les propriétés des fonctions. Graphiques interactifs et applications passionnantes !",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
    {
      id: 92,
      title: "Statistiques descriptives",
      description: "Devenez un expert en analyse de données ! Apprenez à calculer moyennes, médianes, écarts-types et à créer des graphiques informatifs. Découvrez le pouvoir des statistiques !",
      image: "/images/exo.jpg",
      duration: "2h45",
    },
    {
      id: 93,
      title: "Probabilités conditionnelles",
      description: "Calculez des probabilités complexes ! Découvrez les probabilités conditionnelles et leurs applications fascinantes. Transformez l'incertitude en science précise !",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 94,
      title: "Géométrie analytique",
      description: "Combinez algèbre et géométrie ! Découvrez comment les équations décrivent des figures géométriques. Un cours qui révolutionne votre compréhension de la géométrie !",
      image: "/images/exo.jpg",
      duration: "3h15",
    },
  ],
  "1ère": [
    {
      id: 20,
      title: "Les Polynomes (1s1)",
      description: "Explorez l'univers des polynômes ! Découvrez leurs propriétés fascinantes, apprenez à les factoriser et à résoudre des équations polynomiales. Algèbre passionnante qui ouvre de nombreuses portes !",
      image: "/images/exo.jpg",
      duration: "2h",
    },
    {
      id: 21,
      title: "Angles orientés et Trigonométrie (1s1)",
      description: "Maîtrisez la trigonométrie avancée ! Découvrez les angles orientés et leurs applications fascinantes. Explorez les fonctions trigonométriques sous tous leurs aspects avec des méthodes claires !",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
    {
      id: 22,
      title: "Denombrement (1s1)",
      description: "Devenez un expert en combinatoire ! Apprenez à compter efficacement avec les méthodes de dénombrement. Applications fascinantes en probabilités, cryptographie et bien plus !",
      image: "/images/exo.jpg",
      duration: "3h15",
    },
    {
      id: 23,
      title: "Derivation (1s1)",
      description: "Découvrez la puissance des dérivées ! Apprenez à étudier les variations des fonctions et à résoudre des problèmes d'optimisation. Calcul différentiel passionnant avec applications concrètes !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 24,
      title: "Equations, inéquations et systèmes (1s1)",
      description: "Résolvez des problèmes complexes avec élégance ! Maîtrisez les équations, inéquations et systèmes avec des méthodes efficaces. Applications pratiques et problèmes passionnants !",
      image: "/images/exo.jpg",
      duration: "3h15",
    },
    {
      id: 25,
      title: "Fonctions numériques (1s1)",
      description: "Plongez dans l'analyse des fonctions ! Découvrez comment étudier les variations, les limites et les propriétés des fonctions. Graphiques interactifs et applications passionnantes !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 26,
      title: "Identités et relations trigonométriques (1s1)",
      description: "Maîtrisez les identités trigonométriques ! Découvrez ces formules magiques qui simplifient les calculs complexes. Applications géométriques fascinantes et résolution de problèmes élégante !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 27,
      title: "Limites et Continuité (1s1)",
      description: "Explorez les concepts fondamentaux de l'analyse ! Découvrez comment les limites révèlent le comportement des fonctions. Continuité et discontinuité n'auront plus de secrets !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 28,
      title: "Primitives (1s1)",
      description: "Découvrez l'art de trouver des primitives ! Apprenez les techniques pour intégrer des fonctions et ouvrez la porte au calcul intégral. Méthodes élégantes et applications fascinantes !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 29,
      title: "Produit scalaire (1s1)",
      description: "Explorez le produit scalaire, un outil puissant ! Découvrez comment calculer des angles, des distances et des projections. Applications fascinantes en géométrie et physique !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 30,
      title: "Suites numériques (1s1)",
      description: "Plongez dans l'univers des suites ! Découvrez les suites arithmétiques, géométriques et leurs propriétés fascinantes. Convergence et limites n'auront plus de secrets !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 31,
      title: "Transformations du Plan (1s1)",
      description: "Explorez les transformations géométriques ! Découvrez les translations, rotations, homothéties et leurs propriétés fascinantes. Géométrie dynamique passionnante !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 32,
      title: "Polynômes (1s2)",
      description: "Explorez l'univers des polynômes ! Découvrez leurs propriétés fascinantes, apprenez à les factoriser et à résoudre des équations polynomiales. Algèbre passionnante qui ouvre de nombreuses portes !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 33,
      title: "Angles orientés et trigonométrie (1s2)",
      description: "Maîtrisez la trigonométrie avancée ! Découvrez les angles orientés et leurs applications fascinantes. Explorez les fonctions trigonométriques sous tous leurs aspects avec des méthodes claires !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 34,
      title: "Statistique descriptive (1s2)",
      description: "Devenez un expert en analyse de données ! Apprenez à décrire et synthétiser des données avec des méthodes statistiques efficaces. Découvrez le pouvoir des statistiques !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 35,
      title: "Produit scalaire (1s2)",
      description: "Explorez le produit scalaire, un outil puissant ! Découvrez comment calculer des angles, des distances et des projections. Applications fascinantes en géométrie et physique !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 36,
      title: "Applications (1s1/s2)",
      description: "Découvrez le concept fondamental des applications ! Explorez comment les fonctions établissent des correspondances précises entre ensembles. Mathématiques pures passionnantes !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 37,
      title: "Suites numériques (1s2)",
      description: "Plongez dans l'univers des suites ! Découvrez les suites arithmétiques, géométriques et leurs propriétés fascinantes. Convergence et limites n'auront plus de secrets !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 38,
      title: "Dénombrement (1s2)",
      description: "Devenez un expert en combinatoire ! Apprenez à compter efficacement avec les méthodes de dénombrement. Applications fascinantes en probabilités, cryptographie et bien plus !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 39,
      title: "Equations, inéquations et systèmes (1s2)",
      description: "Résolvez des problèmes complexes avec élégance ! Maîtrisez les équations, inéquations et systèmes avec des méthodes efficaces. Applications pratiques et problèmes passionnants !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 40,
      title: "Fonctions numériques (1s2)",
      description: "Plongez dans l'analyse des fonctions ! Découvrez comment étudier les variations, les limites et les propriétés des fonctions. Graphiques interactifs et applications passionnantes !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
    {
      id: 41,
      title: "Limites (1s2)",
      description: "Explorez les concepts fondamentaux de l'analyse ! Découvrez comment les limites révèlent le comportement des fonctions. Continuité et discontinuité n'auront plus de secrets !",
      image: "/images/exo.jpg",
      duration: "2h15",
    },
  ],
  Terminale: [
    {
      id: 42,
      title: "Arithmétique I(TS1)",
      description: "Explorez les mystères des nombres entiers ! Découvrez la divisibilité, les nombres premiers et les congruences. Arithmétique moderne passionnante avec applications en cryptographie !",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 43,
      title: "Arithmétique II(TS1)",
      description: "Approfondissez votre maîtrise de l'arithmétique ! Explorez les théorèmes avancés, les équations diophantiennes et leurs applications fascinantes. Mathématiques pures passionnantes !",
      image: "/images/exo.jpg",
      duration: "4h45",
    },
    {
      id: 44,
      title: "Calcul intégral(TS1)",
      description: "Découvrez la puissance du calcul intégral ! Apprenez à calculer des aires, des volumes et des valeurs moyennes. Applications fascinantes en physique, économie et bien plus !",
      image: "/images/exo.jpg",
      duration: "3h50",
    },
    {
      id: 45,
      title: "Derivations (TS1)",
      description: "Maîtrisez l'art de la dérivation ! Découvrez comment les dérivées révèlent les variations des fonctions. Applications passionnantes en optimisation et modélisation !",
      image: "/images/exo.jpg",
      duration: "3h50",
    },
    {
      id: 46,
      title: "Equations différentielles (TS1)",
      description: "Résolvez les équations qui modélisent le monde ! Découvrez comment modéliser des phénomènes variés avec des équations différentielles. Applications fascinantes en sciences !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 47,
      title: "Fonctions exponentielles et Logarithmiques (TS1)",
      description: "Explorez les fonctions qui modélisent la croissance ! Découvrez les exponentielles et logarithmes, leurs propriétés fascinantes et leurs applications en sciences naturelles et économie !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 48,
      title: "Limites et continuité I(TS1)",
      description: "Plongez dans les fondements de l'analyse ! Découvrez comment les limites révèlent le comportement des fonctions. Concepts fondamentaux passionnants !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 49,
      title: "Limites et continuité II (TS1)",
      description: "Approfondissez votre compréhension des limites ! Explorez les formes indéterminées et les techniques avancées. Analyse approfondie passionnante !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 50,
      title: "Nombres complexes (TS1)",
      description: "Découvrez les nombres qui révolutionnent les mathématiques ! Explorez les nombres complexes et leurs applications fascinantes en géométrie, physique et ingénierie !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 51,
      title: "Probabilités (TS1)",
      description: "Maîtrisez l'art de quantifier l'incertitude ! Découvrez les probabilités avancées et leurs applications fascinantes. Modélisation et prédiction au programme !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 52,
      title: "Transformations (TS1)",
      description: "Explorez les transformations de fonctions ! Découvrez comment modifier des fonctions tout en préservant leurs propriétés. Applications fascinantes en analyse !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 53,
      title: "Suites numériques (TS1)",
      description: "Plongez dans l'univers des suites ! Découvrez les suites convergentes, divergentes et leurs propriétés fascinantes. Analyse approfondie passionnante !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 54,
      title: "Calcul Intégral (TS2)",
      description: "Perfectionnez votre maîtrise du calcul intégral ! Explorez les techniques avancées d'intégration et leurs applications fascinantes. Calculs élégants et applications pratiques !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 55,
      title: "Equations différentielles (TS2)",
      description: "Résolvez des équations différentielles complexes ! Découvrez les méthodes avancées de résolution et leurs applications fascinantes en modélisation scientifique. Sciences et mathématiques combinées !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 56,
      title: "Fonctions numériques (TS2)",
      description: "Analysez les fonctions sous tous leurs aspects ! Découvrez les techniques avancées d'étude des fonctions et leurs applications fascinantes. Analyse approfondie passionnante !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 57,
      title: "Nombres complexes et similitudes (TS2)",
      description: "Combinez nombres complexes et géométrie ! Découvrez comment les similitudes utilisent les nombres complexes pour décrire des transformations fascinantes. Géométrie moderne passionnante !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 58,
      title: "Probabilités (TS2)",
      description: "Maîtrisez les probabilités avancées ! Découvrez les lois complexes et leurs applications fascinantes. Modélisation précise et prédiction au programme !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 59,
      title: "Statistiques (TS2)",
      description: "Devenez expert en statistiques ! Apprenez les méthodes avancées d'analyse de données et d'inférence statistique. Applications fascinantes en recherche et industrie !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
    {
      id: 60,
      title: "Suites numériques (TS2)",
      description: "Explorez les suites dans toute leur complexité ! Découvrez les suites récurrentes, les séries et leurs propriétés fascinantes. Analyse approfondie passionnante !",
      image: "/images/exo.jpg",
      duration: "2h50",
    },
  ],
  Licence: [
    {
      id: 61,
      title: "Analyse réelle",
      description: "Plongez dans l'analyse mathématique avancée ! Explorez les suites et séries de fonctions avec rigueur. Découvrez les théorèmes fondamentaux qui régissent l'analyse moderne. Un cours passionnant pour les esprits curieux !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "6h",
    },
    {
      id: 62,
      title: "Algèbre linéaire",
      description: "Maîtrisez l'algèbre linéaire moderne ! Découvrez les espaces vectoriels, les applications linéaires et leurs propriétés fascinantes. Un outil puissant utilisé dans toutes les sciences !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "7h",
    },
    {
      id: 63,
      title: "Probabilités",
      description: "Explorez les probabilités avancées ! Découvrez les lois continues et les théorèmes limites qui régissent les phénomènes aléatoires. Applications fascinantes en statistiques et sciences !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "5h15",
    },
    {
      id: 95,
      title: "Topologie générale",
      description: "Découvrez la topologie, la science des formes ! Explorez les espaces topologiques, la continuité et les propriétés fascinantes des espaces. Géométrie moderne passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "6h30",
    },
    {
      id: 96,
      title: "Théorie des groupes",
      description: "Plongez dans l'univers des groupes ! Découvrez cette structure fondamentale des mathématiques modernes. Applications fascinantes en cryptographie et physique !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "7h30",
    },
    {
      id: 97,
      title: "Calcul différentiel et intégral",
      description: "Perfectionnez votre maîtrise du calcul ! Explorez les dérivées partielles, les intégrales multiples et leurs applications fascinantes. Analyse avancée passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "8h",
    },
    {
      id: 98,
      title: "Statistiques mathématiques",
      description: "Devenez expert en statistiques théoriques ! Découvrez les estimateurs, les tests d'hypothèses et les méthodes d'inférence. Applications pratiques et théorie rigoureuse !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "6h45",
    },
    {
      id: 99,
      title: "Équations différentielles",
      description: "Résolvez des équations qui modélisent le monde ! Découvrez les méthodes de résolution et les applications fascinantes en physique, biologie et économie. Modélisation passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "7h15",
    },
  ],
  Master: [
    {
      id: 64,
      title: "Analyse fonctionnelle",
      description: "Explorez les espaces de Hilbert et les opérateurs ! Découvrez cette branche fondamentale des mathématiques modernes utilisée en mécanique quantique et traitement du signal. Mathématiques pures passionnantes !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "8h",
    },
    {
      id: 65,
      title: "Géométrie différentielle",
      description: "Plongez dans la géométrie des variétés ! Découvrez les variétés différentielles et les formes différentielles. Applications fascinantes en physique théorique et relativité !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "7h30",
    },
    {
      id: 66,
      title: "Équations aux dérivées partielles",
      description: "Résolvez les équations qui modélisent la physique ! Découvrez les méthodes de résolution et les applications fascinantes en mécanique des fluides, thermodynamique et bien plus !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "9h",
    },
    {
      id: 100,
      title: "Théorie de la mesure et intégration",
      description: "Explorez l'intégration moderne ! Découvrez la théorie de la mesure de Lebesgue et ses applications fascinantes. Analyse avancée passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "8h30",
    },
    {
      id: 101,
      title: "Théorie des représentations",
      description: "Découvrez comment les groupes agissent sur les espaces ! Explorez cette théorie fascinante qui connecte algèbre et géométrie. Applications en physique et cryptographie !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "9h15",
    },
    {
      id: 102,
      title: "Topologie algébrique",
      description: "Combinez topologie et algèbre ! Découvrez les groupes d'homologie et de cohomologie. Une branche fascinante qui révèle la structure profonde des espaces !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "10h",
    },
  ],
  Prépa: [
    {
      id: 67,
      title: "Topologie",
      description: "Explorez les espaces métriques et topologiques ! Découvrez les concepts fondamentaux de continuité, compacité et connexité. Géométrie moderne passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "6h45",
    },
    {
      id: 68,
      title: "Réduction des endomorphismes",
      description: "Maîtrisez la diagonalisation et la trigonalisation ! Découvrez comment simplifier les matrices et résoudre des problèmes complexes. Algèbre linéaire avancée fascinante !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "7h15",
    },
    {
      id: 69,
      title: "Intégrales multiples",
      description: "Calculez des intégrales doubles et triples avec aisance ! Découvrez les changements de variables et les applications fascinantes en physique et géométrie. Calcul intégral avancé !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "5h45",
    },
    {
      id: 103,
      title: "Séries et intégrales",
      description: "Explorez les séries numériques et fonctionnelles ! Découvrez les critères de convergence et les développements en séries. Analyse approfondie passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "7h",
    },
    {
      id: 104,
      title: "Géométrie affine et euclidienne",
      description: "Plongez dans la géométrie moderne ! Découvrez les espaces affines, les transformations et leurs propriétés fascinantes. Géométrie classique et moderne combinées !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "6h30",
    },
    {
      id: 105,
      title: "Arithmétique et théorie des nombres",
      description: "Explorez les mystères des nombres ! Découvrez les nombres premiers, les congruences et les applications fascinantes en cryptographie. Arithmétique moderne passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "8h",
    },
  ],
}

export default function CoursPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("college")

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const getTotalCourses = () => {
    return Object.values(coursesData).reduce((total, courses) => total + courses.length, 0)
  }

  const filteredCourses = (classe: ClasseKey) => {
    const courses = coursesData[classe] || []
    if (!searchQuery) return courses
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const currentLevel = levels.find((l) => l.id === selectedLevel) || levels[0]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 bg-gradient-to-br from-primary/10 via-purple-500/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative z-10">
          <motion.div
            className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary to-purple-600 p-4 rounded-2xl">
                <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-white" />
              </div>
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Nos Cours de Mathématiques
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Des cours structurés par niveau pour un apprentissage progressif et adapté à vos besoins.
                Explorez plus de {getTotalCourses()} cours couvrant tous les niveaux.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{getTotalCourses()}+ cours</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Tous niveaux</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Star className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Contenu premium</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Barre de recherche */}
      <div className="container -mt-8 relative z-20 mb-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-2 shadow-xl">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un cours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="container pb-10 space-y-8">
        {/* Tabs pour les niveaux */}
        <Tabs value={selectedLevel} onValueChange={setSelectedLevel} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-2 bg-muted/50">
            {levels.map((level) => (
              <TabsTrigger
                key={level.id}
                value={level.id}
                className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <span className="text-2xl">{level.icon}</span>
                <span className="font-semibold">{level.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {level.classes.length} classes
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {levels.map((level) => (
            <TabsContent key={level.id} value={level.id} className="mt-6 space-y-8">
              {/* Navigation rapide des classes */}
              <motion.div
                className="flex flex-wrap gap-3 justify-center"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {level.classes.map((classe) => (
                  <motion.a
                    key={classe}
                    href={`#${classe}`}
                    variants={fadeIn}
                    className="group relative"
                  >
                    <Button
                      variant="outline"
                      className="h-auto py-3 px-6 rounded-full border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm hover:shadow-md"
                    >
                      <GraduationCap className="h-4 w-4 mr-2" />
                      <span className="font-semibold">{classe}</span>
                      <Badge variant="secondary" className="ml-2">
                        {coursesData[classe as ClasseKey]?.length || 0}
                      </Badge>
                    </Button>
                  </motion.a>
                ))}
              </motion.div>

              {/* Liste des cours par classe */}
              {level.classes.map((classe) => {
                const courses = filteredCourses(classe as ClasseKey)
                if (courses.length === 0 && searchQuery) return null

                return (
                  <motion.div
                    key={classe}
                    id={classe}
                    className="space-y-6 scroll-mt-20"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${level.color} shadow-lg`}>
                          <GraduationCap className="h-6 w-6 md:h-7 md:w-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Classe de {classe}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            {courses.length} cours disponible{courses.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {courses.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium mb-2">Aucun cours trouvé</p>
                          <p className="text-muted-foreground">
                            Aucun cours ne correspond à votre recherche "{searchQuery}"
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {courses.map((course) => {
                          const subject =
                            course.title.toLowerCase().includes("géométrie") ||
                            course.title.toLowerCase().includes("geometrie")
                              ? "géométrie"
                              : course.title.toLowerCase().includes("algèbre") ||
                                  course.title.toLowerCase().includes("algebre") ||
                                  course.title.toLowerCase().includes("polynome")
                                ? "algèbre"
                                : course.title.toLowerCase().includes("calcul") ||
                                    course.title.toLowerCase().includes("dériv") ||
                                    course.title.toLowerCase().includes("intégral")
                                  ? "calcul"
                                  : course.title.toLowerCase().includes("statistique") ||
                                      course.title.toLowerCase().includes("probabilité")
                                    ? "statistique"
                                    : undefined

                          const courseImage =
                            course.image && !course.image.includes("placeholder")
                              ? course.image
                              : getCourseImage(subject, classe)

                          return (
                            <motion.div key={course.id} variants={fadeIn}>
                              <Card className="overflow-hidden group h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-b from-card to-card/50">
                                <div className="relative h-64 overflow-hidden">
                                  <Image
                                    src={courseImage}
                                    alt={course.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  
                                  {/* Badge de classe */}
                                  <div className="absolute top-4 right-4">
                                    <Badge className="bg-background/95 backdrop-blur-md text-foreground shadow-lg border-2 border-primary/20">
                                      {classe}
                                    </Badge>
                                  </div>

                                  {/* Contenu overlay */}
                                  <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="font-bold text-foreground text-xl md:text-2xl mb-3 drop-shadow-2xl line-clamp-2">
                                      {course.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-foreground/90">
                                      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-semibold">{course.duration}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Effet de brillance au survol */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>

                                <CardContent className="pt-6 flex-grow">
                                  <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                                    {course.description}
                                  </p>
                                </CardContent>

                                <CardFooter className="pt-4 pb-6">
                                  <Button
                                    className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg"
                                    variant="outline"
                                    asChild
                                  >
                                    <Link href={`/cours/${course.id}`}>
                                      <span>Commencer le cours</span>
                                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                  </Button>
                                </CardFooter>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
