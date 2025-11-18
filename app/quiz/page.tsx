"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  BrainCircuit,
  ArrowRight,
  Clock,
  Star,
  Search,
  Target,
  Zap,
  Award,
  TrendingUp,
  GraduationCap,
  Trophy,
  CheckCircle,
} from "lucide-react"
import { getQuizImage, getCourseImage } from "@/lib/utils/course-images"
import { motion } from "framer-motion"

const levels = [
  { id: "college", name: "Collège", classes: ["6ème", "5ème", "4ème", "3ème"], icon: "📚", color: "from-blue-500 to-cyan-500" },
  { id: "lycee", name: "Lycée", classes: ["2nde", "1ère", "Terminale"], icon: "🎓", color: "from-purple-500 to-pink-500" },
  { id: "concours", name: "Concours", classes: ["Brevet", "Bac", "Prépa"], icon: "🏆", color: "from-orange-500 to-red-500" },
]

interface Quiz {
  id: number
  title: string
  description: string
  image: string
  difficulty: "Facile" | "Moyen" | "Difficile" | "Très difficile"
  time: string
  questions: number
  popularity: number
  level: string
  classe?: string
  subject?: string
}

type ClasseKey = "6ème" | "5ème" | "4ème" | "3ème" | "2nde" | "1ère" | "Terminale" | "Brevet" | "Bac" | "Prépa"

const quizData: Record<ClasseKey, Quiz[]> = {
  "6ème": [
    {
      id: 1,
      title: "Nombres décimaux",
      description: "Testez vos connaissances sur les nombres décimaux ! 15 questions progressives pour maîtriser les opérations avec des exemples concrets. Un quiz interactif qui transforme les mathématiques en jeu passionnant !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Facile",
      time: "15 min",
      questions: 15,
      popularity: 4.8,
      level: "Collège",
      classe: "6ème",
      subject: "nombres",
    },
    {
      id: 2,
      title: "Fractions simples",
      description: "Plongez dans l'univers des fractions ! 12 questions interactives pour comprendre et manipuler les fractions. Transformez ce concept abstrait en jeu passionnant avec des exemples visuels !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Facile",
      time: "20 min",
      questions: 12,
      popularity: 4.6,
      level: "Collège",
      classe: "6ème",
      subject: "fractions",
    },
    {
      id: 3,
      title: "Géométrie plane",
      description: "Explorez les formes géométriques ! 18 questions sur les figures planes et leurs propriétés. Découvrez les secrets de la géométrie avec des activités pratiques et créatives !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "25 min",
      questions: 18,
      popularity: 4.7,
      level: "Collège",
      classe: "6ème",
      subject: "géométrie",
    },
    {
      id: 4,
      title: "Périmètres et aires",
      description: "Calculez comme un architecte ! 15 questions pour mesurer périmètres et aires avec des projets concrets. Transformez votre compréhension de l'espace avec des exemples fascinants !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "20 min",
      questions: 15,
      popularity: 4.5,
      level: "Collège",
      classe: "6ème",
      subject: "géométrie",
    },
    {
      id: 5,
      title: "Proportionnalité",
      description: "Maîtrisez les proportions ! 12 questions sur la proportionnalité avec des situations réelles. Découvrez comment les mathématiques régissent les recettes, les échelles et bien plus !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "18 min",
      questions: 12,
      popularity: 4.4,
      level: "Collège",
      classe: "6ème",
      subject: "proportionnalité",
    },
    {
      id: 6,
      title: "Pourcentages",
      description: "Les pourcentages n'auront plus de secrets ! 10 questions sur les calculs commerciaux et statistiques. Devenez un expert en calculs de réductions et augmentations !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "15 min",
      questions: 10,
      popularity: 4.6,
      level: "Collège",
      classe: "6ème",
      subject: "pourcentages",
    },
  ],
  "5ème": [
    {
      id: 7,
      title: "Nombres relatifs",
      description: "Voyagez dans le monde des nombres négatifs ! 14 questions pour comprendre comment fonctionnent les températures, les altitudes et les dettes. Un quiz qui donne du sens aux nombres relatifs !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Facile",
      time: "20 min",
      questions: 14,
      popularity: 4.7,
      level: "Collège",
      classe: "5ème",
      subject: "nombres",
    },
    {
      id: 8,
      title: "Calcul littéral",
      description: "Entrez dans l'univers de l'algèbre ! 12 questions pour découvrir comment les lettres remplacent les nombres. Une introduction fascinante au langage mathématique !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "25 min",
      questions: 12,
      popularity: 4.5,
      level: "Collège",
      classe: "5ème",
      subject: "algèbre",
    },
    {
      id: 9,
      title: "Triangles et quadrilatères",
      description: "Explorez les propriétés fascinantes des triangles ! 16 questions sur les constructions et démonstrations. Découvrez pourquoi les triangles sont partout autour de nous !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "22 min",
      questions: 16,
      popularity: 4.6,
      level: "Collège",
      classe: "5ème",
      subject: "géométrie",
    },
    {
      id: 10,
      title: "Statistiques descriptives",
      description: "Devenez un expert en données ! 15 questions pour lire, analyser et présenter des statistiques. Découvrez le pouvoir des données avec des exemples concrets !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "20 min",
      questions: 15,
      popularity: 4.4,
      level: "Collège",
      classe: "5ème",
      subject: "statistiques",
    },
    {
      id: 11,
      title: "Probabilités simples",
      description: "Calculez vos chances de gagner ! 12 questions sur les probabilités à travers des jeux et des expériences. Transformez le hasard en science passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "18 min",
      questions: 12,
      popularity: 4.5,
      level: "Collège",
      classe: "5ème",
      subject: "probabilités",
    },
    {
      id: 12,
      title: "Volumes et capacités",
      description: "Mesurez l'espace en 3D ! 14 questions pour calculer les volumes de solides. Explorez le monde tridimensionnel avec des méthodes visuelles !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "25 min",
      questions: 14,
      popularity: 4.6,
      level: "Collège",
      classe: "5ème",
      subject: "géométrie",
    },
  ],
  "4ème": [
    {
      id: 13,
      title: "Puissances",
      description: "Maîtrisez la puissance des nombres ! 12 questions sur les puissances et la notation scientifique. Explorez l'univers des très grands et très petits nombres !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "20 min",
      questions: 12,
      popularity: 4.6,
      level: "Collège",
      classe: "4ème",
      subject: "nombres",
    },
    {
      id: 14,
      title: "Théorème de Pythagore",
      description: "Découvrez l'un des théorèmes les plus célèbres ! 15 questions pour l'appliquer dans des situations concrètes. Géométrie et histoire combinées de manière passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "25 min",
      questions: 15,
      popularity: 4.8,
      level: "Collège",
      classe: "4ème",
      subject: "géométrie",
    },
    {
      id: 15,
      title: "Théorème de Thalès",
      description: "Explorez un autre théorème fondamental ! 14 questions pour calculer des distances inaccessibles. Applications pratiques garanties !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "22 min",
      questions: 14,
      popularity: 4.7,
      level: "Collège",
      classe: "4ème",
      subject: "géométrie",
    },
    {
      id: 16,
      title: "Fonctions linéaires et affines",
      description: "Entrez dans le monde des fonctions ! 16 questions pour représenter graphiquement des relations mathématiques. Modélisation et prédiction au programme !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "24 min",
      questions: 16,
      popularity: 4.5,
      level: "Collège",
      classe: "4ème",
      subject: "fonctions",
    },
    {
      id: 17,
      title: "Calcul littéral avancé",
      description: "Perfectionnez votre maîtrise de l'algèbre ! 12 questions pour développer, factoriser et simplifier. Techniques avancées pour devenir un expert !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "28 min",
      questions: 12,
      popularity: 4.6,
      level: "Collège",
      classe: "4ème",
      subject: "algèbre",
    },
    {
      id: 18,
      title: "Statistiques et probabilités",
      description: "Devenez expert en analyse de données ! 18 questions pour calculer des indicateurs statistiques et évaluer des probabilités. Découvrez le monde fascinant des données !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "26 min",
      questions: 18,
      popularity: 4.7,
      level: "Collège",
      classe: "4ème",
      subject: "statistiques",
    },
  ],
  "3ème": [
    {
      id: 19,
      title: "Équations",
      description: "Résolvez des équations comme un détective ! 20 questions pour trouver l'inconnue avec des méthodes efficaces. Devenez un expert en résolution d'équations !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "30 min",
      questions: 20,
      popularity: 4.8,
      level: "Collège",
      classe: "3ème",
      subject: "algèbre",
    },
    {
      id: 20,
      title: "Fonctions linéaires",
      description: "Maîtrisez les fonctions linéaires ! 15 questions pour les représenter, les analyser et les utiliser. Graphiques et applications concrètes au rendez-vous !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "25 min",
      questions: 15,
      popularity: 4.6,
      level: "Collège",
      classe: "3ème",
      subject: "fonctions",
    },
    {
      id: 21,
      title: "Trigonométrie",
      description: "Découvrez la trigonométrie ! 18 questions pour utiliser sinus, cosinus et tangente. Applications pratiques et calculs passionnants !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "28 min",
      questions: 18,
      popularity: 4.7,
      level: "Collège",
      classe: "3ème",
      subject: "trigonométrie",
    },
    {
      id: 22,
      title: "Systèmes d'équations",
      description: "Résolvez plusieurs équations simultanément ! 16 questions pour trouver des solutions à des problèmes complexes. Substitution et élimination n'auront plus de secrets !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "30 min",
      questions: 16,
      popularity: 4.8,
      level: "Collège",
      classe: "3ème",
      subject: "algèbre",
    },
    {
      id: 23,
      title: "Géométrie dans l'espace",
      description: "Explorez la géométrie en 3 dimensions ! 14 questions sur les solides, leurs propriétés et leurs volumes. Géométrie spatiale fascinante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "32 min",
      questions: 14,
      popularity: 4.6,
      level: "Collège",
      classe: "3ème",
      subject: "géométrie",
    },
    {
      id: 24,
      title: "Statistiques avancées",
      description: "Devenez expert en analyse de données ! 20 questions pour calculer des indicateurs statistiques et évaluer des probabilités complexes. Analyse approfondie passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "35 min",
      questions: 20,
      popularity: 4.7,
      level: "Collège",
      classe: "3ème",
      subject: "statistiques",
    },
  ],
  "2nde": [
    {
      id: 25,
      title: "Calcul dans ℝ",
      description: "Explorez l'univers des nombres réels ! 15 questions pour maîtriser les opérations fondamentales. Un quiz essentiel pour comprendre les mathématiques modernes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "25 min",
      questions: 15,
      popularity: 4.7,
      level: "Lycée",
      classe: "2nde",
      subject: "nombres",
    },
    {
      id: 26,
      title: "Calcul vectoriel",
      description: "Plongez dans le monde des vecteurs ! 12 questions pour découvrir comment les vecteurs modélisent les forces. Géométrie et physique combinées de manière passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "30 min",
      questions: 12,
      popularity: 4.6,
      level: "Lycée",
      classe: "2nde",
      subject: "géométrie",
    },
    {
      id: 27,
      title: "Équations du second degré",
      description: "Maîtrisez la résolution des équations du second degré ! 14 questions pour découvrir le discriminant et la formule quadratique. Résolvez des problèmes fascinants avec élégance !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "28 min",
      questions: 14,
      popularity: 4.8,
      level: "Lycée",
      classe: "2nde",
      subject: "algèbre",
    },
    {
      id: 28,
      title: "Le Barycentre",
      description: "Découvrez le concept fascinant du barycentre ! 12 questions pour calculer le centre de gravité de systèmes de points. Applications passionnantes en géométrie et physique !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "26 min",
      questions: 12,
      popularity: 4.5,
      level: "Lycée",
      classe: "2nde",
      subject: "géométrie",
    },
    {
      id: 29,
      title: "Systèmes d'équations",
      description: "Résolvez des systèmes complexes avec aisance ! 16 questions pour trouver des solutions simultanées. Applications pratiques et problèmes passionnants !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "30 min",
      questions: 16,
      popularity: 4.7,
      level: "Lycée",
      classe: "2nde",
      subject: "algèbre",
    },
    {
      id: 30,
      title: "Angles orientés et Trigonométrie",
      description: "Explorez la trigonométrie avancée ! 15 questions sur les angles orientés et leurs applications. Maîtrisez les relations trigonométriques complexes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "28 min",
      questions: 15,
      popularity: 4.6,
      level: "Lycée",
      classe: "2nde",
      subject: "trigonométrie",
    },
    {
      id: 31,
      title: "Fonctions numériques",
      description: "Plongez dans l'analyse des fonctions ! 18 questions pour étudier les variations, les limites et les propriétés. Graphiques interactifs et applications passionnantes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "32 min",
      questions: 18,
      popularity: 4.8,
      level: "Lycée",
      classe: "2nde",
      subject: "fonctions",
    },
    {
      id: 32,
      title: "Statistiques descriptives",
      description: "Devenez un expert en analyse de données ! 16 questions pour calculer moyennes, médianes et écarts-types. Découvrez le pouvoir des statistiques !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "30 min",
      questions: 16,
      popularity: 4.7,
      level: "Lycée",
      classe: "2nde",
      subject: "statistiques",
    },
  ],
  "1ère": [
    {
      id: 33,
      title: "Dérivées",
      description: "Découvrez la puissance des dérivées ! 20 questions pour étudier les variations des fonctions et résoudre des problèmes d'optimisation. Calcul différentiel passionnant !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "35 min",
      questions: 20,
      popularity: 4.8,
      level: "Lycée",
      classe: "1ère",
      subject: "calcul",
    },
    {
      id: 34,
      title: "Suites numériques",
      description: "Plongez dans l'univers des suites ! 18 questions sur les suites arithmétiques, géométriques et leurs propriétés. Convergence et limites n'auront plus de secrets !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "30 min",
      questions: 18,
      popularity: 4.7,
      level: "Lycée",
      classe: "1ère",
      subject: "suites",
    },
    {
      id: 35,
      title: "Probabilités",
      description: "Maîtrisez l'art de quantifier l'incertitude ! 16 questions sur les probabilités avancées et leurs applications. Modélisation et prédiction au programme !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "32 min",
      questions: 16,
      popularity: 4.6,
      level: "Lycée",
      classe: "1ère",
      subject: "probabilités",
    },
    {
      id: 36,
      title: "Limites et continuité",
      description: "Explorez les concepts fondamentaux de l'analyse ! 20 questions pour découvrir comment les limites révèlent le comportement des fonctions. Concepts fondamentaux passionnants !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "38 min",
      questions: 20,
      popularity: 4.8,
      level: "Lycée",
      classe: "1ère",
      subject: "analyse",
    },
    {
      id: 37,
      title: "Primitives",
      description: "Découvrez l'art de trouver des primitives ! 15 questions pour intégrer des fonctions. Méthodes élégantes et applications fascinantes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "33 min",
      questions: 15,
      popularity: 4.7,
      level: "Lycée",
      classe: "1ère",
      subject: "calcul",
    },
    {
      id: 38,
      title: "Produit scalaire",
      description: "Explorez le produit scalaire, un outil puissant ! 14 questions pour calculer des angles, des distances et des projections. Applications fascinantes en géométrie et physique !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "28 min",
      questions: 14,
      popularity: 4.6,
      level: "Lycée",
      classe: "1ère",
      subject: "géométrie",
    },
    {
      id: 39,
      title: "Polynômes",
      description: "Explorez l'univers des polynômes ! 16 questions sur leurs propriétés fascinantes et leur factorisation. Algèbre passionnante qui ouvre de nombreuses portes !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "30 min",
      questions: 16,
      popularity: 4.7,
      level: "Lycée",
      classe: "1ère",
      subject: "algèbre",
    },
    {
      id: 40,
      title: "Dénombrement",
      description: "Devenez un expert en combinatoire ! 12 questions pour compter efficacement avec les méthodes de dénombrement. Applications fascinantes en probabilités et cryptographie !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "25 min",
      questions: 12,
      popularity: 4.5,
      level: "Lycée",
      classe: "1ère",
      subject: "combinatoire",
    },
  ],
  Terminale: [
    {
      id: 41,
      title: "Arithmétique",
      description: "Explorez les mystères des nombres entiers ! 18 questions sur la divisibilité, les nombres premiers et les congruences. Arithmétique moderne passionnante avec applications en cryptographie !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "40 min",
      questions: 18,
      popularity: 4.8,
      level: "Lycée",
      classe: "Terminale",
      subject: "arithmétique",
    },
    {
      id: 42,
      title: "Calcul intégral",
      description: "Découvrez la puissance du calcul intégral ! 20 questions pour calculer des aires, des volumes et des valeurs moyennes. Applications fascinantes en physique et économie !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "45 min",
      questions: 20,
      popularity: 4.9,
      level: "Lycée",
      classe: "Terminale",
      subject: "calcul",
    },
    {
      id: 43,
      title: "Dérivation avancée",
      description: "Maîtrisez l'art de la dérivation ! 22 questions pour découvrir comment les dérivées révèlent les variations des fonctions. Applications passionnantes en optimisation !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "42 min",
      questions: 22,
      popularity: 4.8,
      level: "Lycée",
      classe: "Terminale",
      subject: "calcul",
    },
    {
      id: 44,
      title: "Équations différentielles",
      description: "Résolvez les équations qui modélisent le monde ! 15 questions pour modéliser des phénomènes variés avec des équations différentielles. Applications fascinantes en sciences !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Très difficile",
      time: "38 min",
      questions: 15,
      popularity: 4.7,
      level: "Lycée",
      classe: "Terminale",
      subject: "calcul",
    },
    {
      id: 45,
      title: "Fonctions exponentielles et logarithmiques",
      description: "Explorez les fonctions qui modélisent la croissance ! 18 questions sur les exponentielles et logarithmes. Applications en sciences naturelles et économie !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "40 min",
      questions: 18,
      popularity: 4.8,
      level: "Lycée",
      classe: "Terminale",
      subject: "fonctions",
    },
    {
      id: 46,
      title: "Nombres complexes",
      description: "Découvrez les nombres qui révolutionnent les mathématiques ! 16 questions sur les nombres complexes et leurs applications. Géométrie, physique et ingénierie !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "35 min",
      questions: 16,
      popularity: 4.7,
      level: "Lycée",
      classe: "Terminale",
      subject: "nombres",
    },
    {
      id: 47,
      title: "Probabilités avancées",
      description: "Maîtrisez l'art de quantifier l'incertitude ! 20 questions sur les probabilités avancées et leurs applications. Modélisation précise et prédiction au programme !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "45 min",
      questions: 20,
      popularity: 4.9,
      level: "Lycée",
      classe: "Terminale",
      subject: "probabilités",
    },
    {
      id: 48,
      title: "Suites numériques avancées",
      description: "Plongez dans l'univers des suites ! 18 questions sur les suites convergentes, divergentes et leurs propriétés. Analyse approfondie passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "40 min",
      questions: 18,
      popularity: 4.8,
      level: "Lycée",
      classe: "Terminale",
      subject: "suites",
    },
  ],
  Brevet: [
    {
      id: 49,
      title: "Préparation Brevet - Algèbre",
      description: "Préparez-vous au Brevet avec ce quiz complet ! 25 questions sur l'algèbre pour maîtriser équations, systèmes et fonctions. Réussissez votre examen avec confiance !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "45 min",
      questions: 25,
      popularity: 4.9,
      level: "Concours",
      classe: "Brevet",
      subject: "algèbre",
    },
    {
      id: 50,
      title: "Préparation Brevet - Géométrie",
      description: "Maîtrisez la géométrie du Brevet ! 22 questions sur les théorèmes de Pythagore, Thalès et la trigonométrie. Géométrie complète pour exceller à l'examen !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "40 min",
      questions: 22,
      popularity: 4.8,
      level: "Concours",
      classe: "Brevet",
      subject: "géométrie",
    },
    {
      id: 51,
      title: "Préparation Brevet - Statistiques",
      description: "Excellez en statistiques au Brevet ! 18 questions sur les moyennes, médianes et graphiques. Analyse de données complète pour l'examen !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Moyen",
      time: "35 min",
      questions: 18,
      popularity: 4.7,
      level: "Concours",
      classe: "Brevet",
      subject: "statistiques",
    },
    {
      id: 52,
      title: "Brevet Blanc Complet",
      description: "Simulez l'épreuve complète du Brevet ! 30 questions couvrant tous les chapitres du programme. Testez-vous dans les conditions réelles de l'examen !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "90 min",
      questions: 30,
      popularity: 4.9,
      level: "Concours",
      classe: "Brevet",
      subject: "général",
    },
  ],
  Bac: [
    {
      id: 53,
      title: "Préparation Bac - Analyse",
      description: "Maîtrisez l'analyse pour le Bac ! 25 questions sur les limites, dérivées et intégrales. Analyse complète pour réussir votre examen !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "60 min",
      questions: 25,
      popularity: 4.9,
      level: "Concours",
      classe: "Bac",
      subject: "analyse",
    },
    {
      id: 54,
      title: "Préparation Bac - Algèbre",
      description: "Excellez en algèbre au Bac ! 22 questions sur les nombres complexes, polynômes et équations. Algèbre complète pour l'examen !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "55 min",
      questions: 22,
      popularity: 4.8,
      level: "Concours",
      classe: "Bac",
      subject: "algèbre",
    },
    {
      id: 55,
      title: "Préparation Bac - Probabilités",
      description: "Maîtrisez les probabilités pour le Bac ! 20 questions sur les lois de probabilité et les statistiques. Probabilités complètes pour réussir !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Difficile",
      time: "50 min",
      questions: 20,
      popularity: 4.8,
      level: "Concours",
      classe: "Bac",
      subject: "probabilités",
    },
    {
      id: 56,
      title: "Bac Blanc Complet",
      description: "Simulez l'épreuve complète du Bac ! 35 questions couvrant tous les chapitres du programme. Testez-vous dans les conditions réelles de l'examen !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Très difficile",
      time: "120 min",
      questions: 35,
      popularity: 4.9,
      level: "Concours",
      classe: "Bac",
      subject: "général",
    },
  ],
  Prépa: [
    {
      id: 57,
      title: "Algèbre linéaire",
      description: "Maîtrisez l'algèbre linéaire moderne ! 20 questions sur les espaces vectoriels et applications linéaires. Un outil puissant utilisé dans toutes les sciences !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Très difficile",
      time: "50 min",
      questions: 20,
      popularity: 4.7,
      level: "Supérieur",
      classe: "Prépa",
      subject: "algèbre",
    },
    {
      id: 58,
      title: "Analyse réelle",
      description: "Plongez dans l'analyse mathématique avancée ! 22 questions sur les suites et séries de fonctions. Découvrez les théorèmes fondamentaux de l'analyse moderne !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Très difficile",
      time: "55 min",
      questions: 22,
      popularity: 4.8,
      level: "Supérieur",
      classe: "Prépa",
      subject: "analyse",
    },
    {
      id: 59,
      title: "Topologie",
      description: "Explorez les espaces métriques et topologiques ! 18 questions sur la continuité, compacité et connexité. Géométrie moderne passionnante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Très difficile",
      time: "48 min",
      questions: 18,
      popularity: 4.6,
      level: "Supérieur",
      classe: "Prépa",
      subject: "topologie",
    },
    {
      id: 60,
      title: "Probabilités avancées",
      description: "Explorez les probabilités avancées ! 20 questions sur les lois continues et théorèmes limites. Applications fascinantes en statistiques et sciences !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Très difficile",
      time: "52 min",
      questions: 20,
      popularity: 4.7,
      level: "Supérieur",
      classe: "Prépa",
      subject: "probabilités",
    },
    {
      id: 61,
      title: "Intégrales multiples",
      description: "Calculez des intégrales doubles et triples ! 16 questions sur les changements de variables et applications. Calcul intégral avancé passionnant !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Très difficile",
      time: "50 min",
      questions: 16,
      popularity: 4.6,
      level: "Supérieur",
      classe: "Prépa",
      subject: "calcul",
    },
    {
      id: 62,
      title: "Réduction des endomorphismes",
      description: "Maîtrisez la diagonalisation et trigonalisation ! 18 questions pour simplifier les matrices. Algèbre linéaire avancée fascinante !",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Très difficile",
      time: "54 min",
      questions: 18,
      popularity: 4.7,
      level: "Supérieur",
      classe: "Prépa",
      subject: "algèbre",
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
    case "Très difficile":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20"
    default:
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
  }
}

export default function QuizPage() {
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

  const getTotalQuizzes = () => {
    return Object.values(quizData).reduce((total, quizzes) => total + quizzes.length, 0)
  }

  const getTotalQuestions = () => {
    return Object.values(quizData).reduce(
      (total, quizzes) => total + quizzes.reduce((sum, quiz) => sum + quiz.questions, 0),
      0
    )
  }

  const filteredQuizzes = (classe: ClasseKey) => {
    const quizzes = quizData[classe] || []
    if (!searchQuery) return quizzes
    return quizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.difficulty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (quiz.subject && quiz.subject.toLowerCase().includes(searchQuery.toLowerCase()))
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
                <BrainCircuit className="h-12 w-12 md:h-16 md:w-16 text-white" />
              </div>
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Quiz de Mathématiques
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Testez vos connaissances avec nos quiz interactifs et mesurez votre progression.
                Plus de {getTotalQuizzes()} quiz et {getTotalQuestions()}+ questions pour tous les niveaux.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{getTotalQuizzes()}+ quiz</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{getTotalQuestions()}+ questions</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Award className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Tous niveaux</span>
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
                  placeholder="Rechercher un quiz..."
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
                        {quizData[classe as ClasseKey]?.length || 0}
                      </Badge>
                    </Button>
                  </motion.a>
                ))}
              </motion.div>

              {/* Liste des quiz par classe */}
              {level.classes.map((classe) => {
                const quizzes = filteredQuizzes(classe as ClasseKey)
                if (quizzes.length === 0 && searchQuery) return null

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
                          <BrainCircuit className="h-6 w-6 md:h-7 md:w-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Quiz {classe}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            {quizzes.length} quiz{quizzes.length > 1 ? " disponibles" : " disponible"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {quizzes.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium mb-2">Aucun quiz trouvé</p>
                          <p className="text-muted-foreground">
                            Aucun quiz ne correspond à votre recherche "{searchQuery}"
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
                        {quizzes.map((quiz) => {
                          const quizImage =
                            quiz.image && !quiz.image.includes("placeholder")
                              ? quiz.image
                              : quiz.subject
                                ? getCourseImage(quiz.subject, quiz.classe)
                                : getQuizImage(quiz.classe)

                          return (
                            <motion.div key={quiz.id} variants={fadeIn}>
                              <Card className="overflow-hidden group h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-b from-card to-card/50">
                                <div className="relative h-64 overflow-hidden">
                                  <Image
                                    src={quizImage}
                                    alt={quiz.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                  {/* Badge de difficulté */}
                                  <div className="absolute top-4 right-4">
                                    <Badge
                                      className={`${getDifficultyColor(quiz.difficulty)} backdrop-blur-md shadow-lg border-2`}
                                    >
                                      {quiz.difficulty}
                                    </Badge>
                                  </div>

                                  {/* Badge de classe */}
                                  <div className="absolute top-4 left-4">
                                    <Badge className="bg-background/95 backdrop-blur-md text-foreground shadow-lg border-2 border-primary/20">
                                      {quiz.classe || quiz.level}
                                    </Badge>
                                  </div>

                                  {/* Contenu overlay */}
                                  <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="font-bold text-foreground text-xl md:text-2xl mb-3 drop-shadow-2xl line-clamp-2">
                                      {quiz.title}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-semibold text-sm">{quiz.time}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <BrainCircuit className="h-4 w-4" />
                                        <span className="font-semibold text-sm">{quiz.questions} Q</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 bg-yellow-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">
                                        <Star className="h-4 w-4 fill-white" />
                                        <span className="font-semibold text-sm">{quiz.popularity}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Effet de brillance au survol */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>

                                <CardContent className="pt-6 flex-grow">
                                  <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                                    {quiz.description}
                                  </p>
                                </CardContent>

                                <CardFooter className="pt-4 pb-6">
                                  <Button
                                    className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg"
                                    variant="outline"
                                    asChild
                                  >
                                    <Link href={`/quiz/${quiz.id}`}>
                                      <span>Commencer le quiz</span>
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
