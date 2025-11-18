"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PenTool, ArrowRight, CheckCircle, Clock, GraduationCap, TrendingUp, Award, Star, Search, Target, Zap } from "lucide-react"
import { getExerciseImage } from "@/lib/utils/course-images"
import { motion } from "framer-motion"

const levels = [
  { id: "college", name: "Collège", classes: ["6ème", "5ème", "4ème", "3ème"], icon: "📚", color: "from-blue-500 to-cyan-500" },
  { id: "lycee", name: "Lycée", classes: ["2nde", "1ère", "Terminale"], icon: "🎓", color: "from-purple-500 to-pink-500" },
]

const exercisesData = {
  "6ème": [
    {
      id: 1,
      title: "Opérations sur les décimaux",
      description: "15 exercices progressifs pour maîtriser les opérations sur les nombres décimaux. Des situations concrètes qui rendent les mathématiques vivantes et amusantes ! Devenez un expert en calculs décimaux !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Facile",
      time: "30 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 2,
      title: "Fractions simples",
      description: "12 exercices interactifs pour comprendre et manipuler les fractions. Transformez ce concept abstrait en jeu passionnant avec des exemples visuels et des méthodes ludiques !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "45 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 3,
      title: "Périmètres et aires",
      description: "10 exercices pratiques pour calculer périmètres et aires. Projetez-vous dans des situations réelles et devenez un expert en mesure ! Applications concrètes garanties !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "40 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 100,
      title: "Jeux avec les nombres",
      description: "20 exercices ludiques pour s'amuser avec les nombres ! Des énigmes, des défis et des jeux qui rendent l'apprentissage passionnant. Mathématiques amusantes garanties !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Facile",
      time: "35 min",
      exercises: 20,
      hasCorrection: true,
    },
    {
      id: 101,
      title: "Problèmes de la vie quotidienne",
      description: "15 problèmes concrets tirés de situations réelles. Apprenez à utiliser les mathématiques dans votre vie de tous les jours ! Résolution de problèmes passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "45 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 102,
      title: "Symétrie et motifs",
      description: "18 exercices créatifs sur les symétries ! Créez des motifs fascinants tout en apprenant les propriétés géométriques. Art et mathématiques combinés de manière passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Facile",
      time: "40 min",
      exercises: 18,
      hasCorrection: true,
    },
    {
      id: 103,
      title: "Pourcentages pratiques",
      description: "12 exercices sur les pourcentages avec des situations réelles ! Calculs de réductions, augmentations et statistiques. Devenez un expert en calculs commerciaux !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "35 min",
      exercises: 12,
      hasCorrection: true,
    },
  ],
  "5ème": [
    {
      id: 4,
      title: "Nombres relatifs",
      description: "14 exercices pour maîtriser les nombres positifs et négatifs. Découvrez comment les utiliser dans des contextes variés et passionnants ! Températures, altitudes et bien plus !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Facile",
      time: "35 min",
      exercises: 14,
      hasCorrection: true,
    },
    {
      id: 5,
      title: "Expressions littérales",
      description: "8 exercices progressifs pour manipuler les expressions algébriques. Transformez l'abstraction en compréhension concrète ! Algèbre passionnante qui ouvre des portes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "50 min",
      exercises: 8,
      hasCorrection: true,
    },
    {
      id: 6,
      title: "Symétries",
      description: "12 exercices créatifs sur les symétries ! Créez des motifs fascinants tout en apprenant les propriétés géométriques. Art et géométrie combinés de manière passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "40 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 104,
      title: "Défis géométriques",
      description: "18 exercices stimulants pour explorer la géométrie. Des constructions, des démonstrations et des problèmes fascinants ! Géométrie passionnante qui développe votre raisonnement !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "50 min",
      exercises: 18,
      hasCorrection: true,
    },
    {
      id: 105,
      title: "Statistiques et graphiques",
      description: "15 exercices pour analyser des données ! Apprenez à lire et créer des graphiques informatifs. Découvrez le pouvoir des statistiques avec des exemples concrets !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "45 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 106,
      title: "Volumes et solides",
      description: "12 exercices pratiques sur les volumes ! Calculez les volumes de solides avec des méthodes visuelles. Géométrie 3D passionnante avec applications concrètes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "55 min",
      exercises: 12,
      hasCorrection: true,
    },
  ],
  "4ème": [
    {
      id: 7,
      title: "Calcul littéral",
      description: "10 exercices pour développer et factoriser des expressions. Maîtrisez ces techniques essentielles avec des méthodes claires ! Algèbre passionnante qui développe votre logique !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "45 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 8,
      title: "Théorème de Pythagore",
      description: "8 exercices d'application du théorème de Pythagore. Résolvez des problèmes fascinants avec ce théorème célèbre ! Géométrie et histoire combinées de manière passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "55 min",
      exercises: 8,
      hasCorrection: true,
    },
    {
      id: 9,
      title: "Proportionnalité",
      description: "12 exercices sur la proportionnalité et les pourcentages. Découvrez comment ces concepts régissent notre quotidien ! Applications pratiques garanties !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "40 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 107,
      title: "Thalès en action",
      description: "15 exercices pratiques utilisant le théorème de Thalès. Calculez des distances inaccessibles et résolvez des problèmes réels ! Applications fascinantes garanties !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "60 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 108,
      title: "Fonctions et graphiques",
      description: "20 exercices pour maîtriser les fonctions ! Représentez graphiquement des relations mathématiques et prédisez des résultats. Modélisation passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "50 min",
      exercises: 20,
      hasCorrection: true,
    },
    {
      id: 109,
      title: "Puissances et notation scientifique",
      description: "12 exercices sur les puissances et la notation scientifique. Découvrez comment simplifier les calculs avec des nombres très grands ou très petits ! Sciences passionnantes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "45 min",
      exercises: 12,
      hasCorrection: true,
    },
  ],
  "3ème": [
    {
      id: 10,
      title: "Équations",
      description: "15 exercices de résolution d'équations. Devenez un expert en trouvant l'inconnue avec des méthodes efficaces ! Résolution de problèmes passionnante qui développe votre logique !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "50 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 11,
      title: "Fonctions linéaires",
      description: "10 exercices sur les fonctions linéaires. Représentez, analysez et utilisez ces fonctions pour modéliser des situations ! Graphiques interactifs et applications concrètes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "60 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 12,
      title: "Trigonométrie",
      description: "12 exercices de trigonométrie dans le triangle rectangle. Maîtrisez sinus, cosinus et tangente avec des applications concrètes ! Calculs pratiques et problèmes fascinants !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "55 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 110,
      title: "Systèmes d'équations",
      description: "18 exercices pour résoudre des systèmes d'équations. Maîtrisez les méthodes de substitution et d'élimination ! Résolution élégante de problèmes complexes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "65 min",
      exercises: 18,
      hasCorrection: true,
    },
    {
      id: 111,
      title: "Inéquations et intervalles",
      description: "15 exercices sur les inéquations ! Apprenez à résoudre et représenter graphiquement les solutions. Intervalles et représentations visuelles passionnantes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "55 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 112,
      title: "Statistiques et probabilités",
      description: "20 exercices pour analyser des données et calculer des probabilités ! Devenez expert en statistiques avec des exemples concrets et des applications fascinantes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "60 min",
      exercises: 20,
      hasCorrection: true,
    },
    {
      id: 113,
      title: "Géométrie dans l'espace",
      description: "16 exercices sur la géométrie 3D ! Découvrez les solides, leurs propriétés et leurs volumes. Visualisations interactives et calculs passionnants !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "70 min",
      exercises: 16,
      hasCorrection: true,
    },
  ],
  "2nde": [
    {
      id: 13,
      title: "Calcul dans ℝ",
      description: "10 exercices passionnants sur les fonctions de référence ! Explorez les fonctions carré, inverse et racine carrée avec des applications concrètes. Analyse fascinante !",
      image: "/images/exercice.jpg",
      difficulty: "Moyen",
      time: "45 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 22,
      title: "Calcul vectoriel",
      description: "8 exercices sur les opérations vectorielles ! Découvrez comment les vecteurs modélisent les forces et les déplacements. Géométrie et physique combinées de manière passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "60 min",
      exercises: 8,
      hasCorrection: true,
    },
    {
      id: 23,
      title: "Les équations du second degré",
      description: "12 exercices pour maîtriser la résolution des équations du second degré ! Découvrez le discriminant, la factorisation et la formule quadratique. Résolvez des problèmes fascinants avec élégance !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "50 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 24,
      title: "Le Barycentre",
      description: "10 exercices sur le concept fascinant du barycentre ! Apprenez à calculer le centre de gravité de systèmes de points. Applications passionnantes en géométrie et physique !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "55 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 25,
      title: "Les systèmes d'équations",
      description: "12 exercices pour résoudre des systèmes complexes ! Découvrez des méthodes élégantes pour trouver des solutions simultanées. Applications pratiques et problèmes passionnants !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "50 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 26,
      title: "Angles orientés et Trigonométrie",
      description: "10 exercices sur la trigonométrie avancée ! Découvrez les angles orientés et leurs applications fascinantes. Maîtrisez les relations trigonométriques complexes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "55 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 27,
      title: "Fonctions numériques",
      description: "12 exercices pour analyser les fonctions ! Découvrez comment étudier les variations, les limites et les propriétés. Graphiques interactifs et applications passionnantes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "50 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 28,
      title: "Polynômes",
      description: "10 exercices sur les polynômes ! Découvrez leurs propriétés fascinantes, apprenez à les factoriser. Algèbre passionnante qui ouvre de nombreuses portes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "45 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 114,
      title: "Statistiques descriptives",
      description: "18 exercices pour devenir expert en analyse de données ! Calculez moyennes, médianes, écarts-types et créez des graphiques informatifs. Découvrez le pouvoir des statistiques !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "55 min",
      exercises: 18,
      hasCorrection: true,
    },
    {
      id: 115,
      title: "Probabilités conditionnelles",
      description: "15 exercices sur les probabilités complexes ! Découvrez les probabilités conditionnelles et leurs applications fascinantes. Transformez l'incertitude en science précise !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "60 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 116,
      title: "Géométrie analytique",
      description: "20 exercices combinant algèbre et géométrie ! Découvrez comment les équations décrivent des figures géométriques. Un cours qui révolutionne votre compréhension !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "65 min",
      exercises: 20,
      hasCorrection: true,
    },
  ],
  "1ère": [
    {
      id: 29,
      title: "Angles orientés et Trigonométrie (1s1)",
      description: "12 exercices sur la trigonométrie avancée ! Découvrez les angles orientés et leurs applications fascinantes. Maîtrisez les fonctions trigonométriques avec des méthodes claires !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "55 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 30,
      title: "Dénombrement (1s1)",
      description: "10 exercices pour devenir expert en combinatoire ! Apprenez à compter efficacement avec les méthodes de dénombrement. Applications fascinantes en probabilités et cryptographie !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "50 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 31,
      title: "Dérivées (1s1)",
      description: "15 exercices sur la puissance des dérivées ! Apprenez à étudier les variations des fonctions et à résoudre des problèmes d'optimisation. Calcul différentiel passionnant !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "65 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 32,
      title: "Equations, inéquations et systèmes (1s1)",
      description: "12 exercices pour résoudre des problèmes complexes avec élégance ! Maîtrisez les équations, inéquations et systèmes avec des méthodes efficaces. Applications pratiques passionnantes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "60 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 33,
      title: "Fonctions numériques (1s1)",
      description: "12 exercices pour analyser les fonctions ! Découvrez comment étudier les variations, les limites et les propriétés. Graphiques interactifs et applications passionnantes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "55 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 34,
      title: "Identités et relations trigonométriques (1s1)",
      description: "10 exercices pour maîtriser les identités trigonométriques ! Découvrez ces formules magiques qui simplifient les calculs complexes. Applications géométriques fascinantes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "50 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 35,
      title: "Limites et Continuité (1s1)",
      description: "15 exercices sur les concepts fondamentaux de l'analyse ! Découvrez comment les limites révèlent le comportement des fonctions. Continuité et discontinuité n'auront plus de secrets !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "70 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 36,
      title: "Primitives (1s1)",
      description: "12 exercices pour découvrir l'art de trouver des primitives ! Apprenez les techniques pour intégrer des fonctions. Méthodes élégantes et applications fascinantes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "65 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 37,
      title: "Suites numériques (1s1)",
      description: "12 exercices pour explorer l'univers des suites ! Découvrez les suites arithmétiques, géométriques et leurs propriétés fascinantes. Convergence et limites passionnantes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "55 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 38,
      title: "Transformations du Plan (1s1)",
      description: "10 exercices sur les transformations géométriques ! Découvrez les translations, rotations, homothéties et leurs propriétés fascinantes. Géométrie dynamique passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "50 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 117,
      title: "Produit scalaire et applications",
      description: "18 exercices sur le produit scalaire ! Découvrez comment calculer des angles, des distances et des projections. Applications fascinantes en géométrie et physique !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "70 min",
      exercises: 18,
      hasCorrection: true,
    },
    {
      id: 118,
      title: "Polynômes et factorisation",
      description: "15 exercices sur les polynômes ! Découvrez leurs propriétés fascinantes et apprenez à les factoriser. Algèbre passionnante qui ouvre de nombreuses portes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "60 min",
      exercises: 15,
      hasCorrection: true,
    },
  ],
  Terminale: [
    // TS1
    {
      id: 39,
      title: "Arithmétique (TS1)",
      description: "15 exercices pour explorer les mystères des nombres entiers ! Découvrez la divisibilité, les nombres premiers et les congruences. Arithmétique moderne passionnante avec applications en cryptographie !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "80 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 40,
      title: "Calcul intégral (TS1)",
      description: "12 exercices pour découvrir la puissance du calcul intégral ! Apprenez à calculer des aires, des volumes et des valeurs moyennes. Applications fascinantes en physique et économie !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "75 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 41,
      title: "Dérivation (TS1)",
      description: "15 exercices pour maîtriser l'art de la dérivation ! Découvrez comment les dérivées révèlent les variations des fonctions. Applications passionnantes en optimisation et modélisation !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "70 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 42,
      title: "Equations différentielles (TS1)",
      description: "10 exercices pour résoudre les équations qui modélisent le monde ! Découvrez comment modéliser des phénomènes variés avec des équations différentielles. Applications fascinantes en sciences !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "65 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 43,
      title: "Fonctions exponentielles et Logarithmiques (TS1)",
      description: "12 exercices sur les fonctions qui modélisent la croissance ! Découvrez les exponentielles et logarithmes, leurs propriétés fascinantes et leurs applications en sciences naturelles et économie !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "70 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 44,
      title: "Limites et continuité (TS1)",
      description: "15 exercices pour plonger dans les fondements de l'analyse ! Découvrez comment les limites révèlent le comportement des fonctions. Concepts fondamentaux passionnants !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "75 min",
      exercises: 15,
      hasCorrection: true,
    },
    {
      id: 45,
      title: "Nombres complexes (TS1)",
      description: "12 exercices pour découvrir les nombres qui révolutionnent les mathématiques ! Explorez les nombres complexes et leurs applications fascinantes en géométrie, physique et ingénierie !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "65 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 46,
      title: "Probabilités (TS1)",
      description: "12 exercices pour maîtriser l'art de quantifier l'incertitude ! Découvrez les probabilités avancées et leurs applications fascinantes. Modélisation et prédiction au programme !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "70 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 47,
      title: "Suites numériques (TS1)",
      description: "12 exercices pour plonger dans l'univers des suites ! Découvrez les suites convergentes, divergentes et leurs propriétés fascinantes. Analyse approfondie passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "70 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 119,
      title: "Arithmétique avancée",
      description: "20 exercices pour approfondir votre maîtrise de l'arithmétique ! Explorez les théorèmes avancés, les équations diophantiennes. Mathématiques pures passionnantes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "85 min",
      exercises: 20,
      hasCorrection: true,
    },
    {
      id: 120,
      title: "Intégrales généralisées",
      description: "18 exercices sur les intégrales généralisées ! Découvrez les techniques avancées d'intégration et leurs applications fascinantes. Calcul intégral approfondi passionnant !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "80 min",
      exercises: 18,
      hasCorrection: true,
    },
    // TS2
    {
      id: 48,
      title: "Calcul Intégral (TS2)",
      description: "12 exercices pour perfectionner votre maîtrise du calcul intégral ! Explorez les techniques avancées d'intégration et leurs applications fascinantes. Calculs élégants et applications pratiques !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "75 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 49,
      title: "Equations différentielles (TS2)",
      description: "10 exercices pour résoudre des équations différentielles complexes ! Découvrez les méthodes avancées de résolution et leurs applications fascinantes en modélisation scientifique !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "65 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 50,
      title: "Fonctions numériques (TS2)",
      description: "12 exercices pour analyser les fonctions sous tous leurs aspects ! Découvrez les techniques avancées d'étude des fonctions et leurs applications fascinantes. Analyse approfondie passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "70 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 51,
      title: "Nombres complexes et similitudes (TS2)",
      description: "12 exercices combinant nombres complexes et géométrie ! Découvrez comment les similitudes utilisent les nombres complexes pour décrire des transformations fascinantes. Géométrie moderne passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "70 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 52,
      title: "Probabilités (TS2)",
      description: "12 exercices pour maîtriser les probabilités avancées ! Découvrez les lois complexes et leurs applications fascinantes. Modélisation précise et prédiction au programme !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "70 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 53,
      title: "Statistiques (TS2)",
      description: "10 exercices pour devenir expert en statistiques ! Apprenez les méthodes avancées d'analyse de données et d'inférence statistique. Applications fascinantes en recherche et industrie !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "60 min",
      exercises: 10,
      hasCorrection: true,
    },
    {
      id: 54,
      title: "Suites numériques (TS2)",
      description: "12 exercices pour explorer les suites dans toute leur complexité ! Découvrez les suites récurrentes, les séries et leurs propriétés fascinantes. Analyse approfondie passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "70 min",
      exercises: 12,
      hasCorrection: true,
    },
    {
      id: 121,
      title: "Séries numériques",
      description: "18 exercices sur les séries numériques ! Découvrez les critères de convergence et les applications fascinantes. Analyse approfondie passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "80 min",
      exercises: 18,
      hasCorrection: true,
    },
    {
      id: 122,
      title: "Fonctions de plusieurs variables",
      description: "15 exercices sur les fonctions de plusieurs variables ! Découvrez les dérivées partielles et leurs applications fascinantes. Analyse multivariée passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "75 min",
      exercises: 15,
      hasCorrection: true,
    },
  ],
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Facile":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "Moyen":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    case "Difficile":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    default:
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
  }
}

type ClasseKey = "6ème" | "5ème" | "4ème" | "3ème" | "2nde" | "1ère" | "Terminale"

export default function ExercicesPage() {
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

  const getTotalExercises = () => {
    return Object.values(exercisesData).reduce((total, exercises) => total + exercises.length, 0)
  }

  const getTotalExerciseCount = () => {
    return Object.values(exercisesData).reduce(
      (total, exercises) => total + exercises.reduce((sum, ex) => sum + ex.exercises, 0),
      0
    )
  }

  const filteredExercises = (classe: ClasseKey) => {
    const exercises = exercisesData[classe] || []
    if (!searchQuery) return exercises
    return exercises.filter(
      (exercise) =>
        exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
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
                <PenTool className="h-12 w-12 md:h-16 md:w-16 text-white" />
              </div>
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Exercices de Mathématiques
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Pratiquez avec nos exercices interactifs et téléchargeables pour renforcer vos connaissances.
                Plus de {getTotalExercises()} séries d'exercices et {getTotalExerciseCount()}+ exercices individuels.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{getTotalExercises()}+ séries</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{getTotalExerciseCount()}+ exercices</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Corrections incluses</span>
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
                  placeholder="Rechercher un exercice..."
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
          <TabsList className="grid w-full grid-cols-2 mb-8 h-auto p-2 bg-muted/50">
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
                        {exercisesData[classe as ClasseKey]?.length || 0}
                      </Badge>
                    </Button>
                  </motion.a>
                ))}
              </motion.div>

              {/* Liste des exercices par classe */}
              {level.classes.map((classe) => {
                const exercises = filteredExercises(classe as ClasseKey)
                if (exercises.length === 0 && searchQuery) return null

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
                          <PenTool className="h-6 w-6 md:h-7 md:w-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Exercices de {classe}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            {exercises.length} série{exercises.length > 1 ? "s" : ""} d'exercices disponible{exercises.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {exercises.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium mb-2">Aucun exercice trouvé</p>
                          <p className="text-muted-foreground">
                            Aucun exercice ne correspond à votre recherche "{searchQuery}"
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
                        {exercises.map((exercise) => {
                          const subject =
                            exercise.title.toLowerCase().includes("géométrie") ||
                            exercise.title.toLowerCase().includes("geometrie") ||
                            exercise.title.toLowerCase().includes("symétrie")
                              ? "géométrie"
                              : exercise.title.toLowerCase().includes("algèbre") ||
                                  exercise.title.toLowerCase().includes("algebre") ||
                                  exercise.title.toLowerCase().includes("littéral")
                                ? "algèbre"
                                : exercise.title.toLowerCase().includes("calcul") ||
                                    exercise.title.toLowerCase().includes("dériv") ||
                                    exercise.title.toLowerCase().includes("intégral")
                                  ? "calcul"
                                  : exercise.title.toLowerCase().includes("statistique") ||
                                      exercise.title.toLowerCase().includes("probabilité")
                                    ? "statistique"
                                    : undefined

                          const exerciseImage =
                            exercise.image && !exercise.image.includes("placeholder")
                              ? exercise.image
                              : getExerciseImage(exercise.difficulty, subject || "mathématiques")

                          return (
                            <motion.div key={exercise.id} variants={fadeIn}>
                              <Card className="overflow-hidden group h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-b from-card to-card/50">
                                <div className="relative h-64 overflow-hidden">
                                  <Image
                                    src={exerciseImage}
                                    alt={exercise.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                  {/* Badge de difficulté */}
                                  <div className="absolute top-4 right-4">
                                    <Badge
                                      className={`${getDifficultyColor(exercise.difficulty)} backdrop-blur-md shadow-lg border-2`}
                                    >
                                      {exercise.difficulty}
                                    </Badge>
                                  </div>

                                  {/* Badge de classe */}
                                  <div className="absolute top-4 left-4">
                                    <Badge className="bg-background/95 backdrop-blur-md text-foreground shadow-lg border-2 border-primary/20">
                                      {classe}
                                    </Badge>
                                  </div>

                                  {/* Contenu overlay */}
                                  <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="font-bold text-foreground text-xl md:text-2xl mb-3 drop-shadow-2xl line-clamp-2">
                                      {exercise.title}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-semibold text-sm">{exercise.time}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <PenTool className="h-4 w-4" />
                                        <span className="font-semibold text-sm">{exercise.exercises} ex.</span>
                                      </div>
                                      {exercise.hasCorrection && (
                                        <div className="flex items-center gap-1.5 bg-green-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">
                                          <CheckCircle className="h-4 w-4" />
                                          <span className="font-semibold text-sm">Corrigé</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Effet de brillance au survol */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>

                                <CardContent className="pt-6 flex-grow">
                                  <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                                    {exercise.description}
                                  </p>
                                </CardContent>

                                <CardFooter className="pt-4 pb-6">
                                  <Button
                                    className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg"
                                    variant="outline"
                                    asChild
                                  >
                                    <Link href={`/exercices/${exercise.id}`}>
                                      <span>Commencer les exercices</span>
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
