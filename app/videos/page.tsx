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
  Play,
  ArrowRight,
  Clock,
  Eye,
  Search,
  Target,
  Zap,
  Award,
  TrendingUp,
  GraduationCap,
  Youtube,
  ThumbsUp,
} from "lucide-react"
import { getCourseImage } from "@/lib/utils/course-images"
import { getYouTubeIdForSubject } from "@/lib/data/youtube-videos-mapping"
import { getYouTubeThumbnail, getYouTubeUrl } from "@/lib/services/videos-service"
import { motion } from "framer-motion"

const levels = [
  { id: "college", name: "Collège", classes: ["6ème", "5ème", "4ème", "3ème"], icon: "📚", color: "from-blue-500 to-cyan-500" },
  { id: "lycee", name: "Lycée", classes: ["2nde", "1ère", "Terminale"], icon: "🎓", color: "from-purple-500 to-pink-500" },
  { id: "concours", name: "Concours", classes: ["Brevet", "Bac", "Prépa"], icon: "🏆", color: "from-orange-500 to-red-500" },
]

export interface Video {
  id: number
  title: string
  description: string
  youtubeId: string
  thumbnail: string
  duration: string
  views: number
  likes: number
  level: string
  classe?: string
  subject?: string
  category?: "cours" | "exercices" | "methodes"
}

export type ClasseKey = "6ème" | "5ème" | "4ème" | "3ème" | "2nde" | "1ère" | "Terminale" | "Brevet" | "Bac" | "Prépa"

// Fonction pour créer une vidéo avec un ID YouTube unique
function createVideo(data: Omit<Video, "youtubeId" | "thumbnail"> & { youtubeId?: string; thumbnail?: string }): Video {
  const youtubeId = data.youtubeId || getYouTubeIdForSubject(data.subject || data.title, data.classe)
  return {
    ...data,
    youtubeId,
    thumbnail: data.thumbnail && data.thumbnail.length > 0 ? data.thumbnail : getYouTubeThumbnail(youtubeId, "high"),
  }
}

export const videosData: Record<ClasseKey, Video[]> = {
  "6ème": [
    createVideo({
      id: 1,
      title: "Les nombres décimaux - Cours complet",
      description: "Découvrez le monde fascinant des nombres décimaux ! Un cours interactif qui transforme les mathématiques en jeu passionnant. Maîtrisez les opérations avec des exemples concrets de la vie quotidienne.",
      thumbnail: "",
      duration: "18:30",
      views: 45230,
      likes: 1250,
      level: "Collège",
      classe: "6ème",
      subject: "nombres",
      category: "cours",
    }),
    createVideo({
      id: 2,
      title: "Les fractions - Explications détaillées",
      description: "Plongez dans l'univers des fractions ! Apprenez à les manipuler avec aisance grâce à des méthodes visuelles. Transformez ce qui semble complexe en jeu d'enfant avec des exemples progressifs.",
      thumbnail: "",
      duration: "22:15",
      views: 38920,
      likes: 980,
      level: "Collège",
      classe: "6ème",
      subject: "fractions",
      category: "cours",
    }),
    createVideo({
      id: 3,
      title: "Géométrie plane - Figures et propriétés",
      description: "Explorez les formes géométriques qui nous entourent ! De la construction à la mesure, découvrez les secrets des figures planes avec des activités pratiques et créatives.",
      thumbnail: "",
      duration: "25:40",
      views: 32150,
      likes: 850,
      level: "Collège",
      classe: "6ème",
      subject: "géométrie",
      category: "cours",
    }),
    createVideo({
      id: 4,
      title: "Périmètres et aires - Exercices résolus",
      description: "Calculez comme un architecte ! Apprenez à mesurer périmètres et aires avec des projets concrets. Transformez votre compréhension de l'espace avec des exemples fascinants.",
      thumbnail: "",
      duration: "20:25",
      views: 28760,
      likes: 720,
      level: "Collège",
      classe: "6ème",
      subject: "géométrie",
      category: "exercices",
    }),
    createVideo({
      id: 5,
      title: "Proportionnalité - Applications pratiques",
      description: "Maîtrisez les proportions comme un chef cuisinier ! Découvrez comment les mathématiques régissent les recettes, les échelles, les cartes et bien plus encore dans votre quotidien.",
      thumbnail: "",
      duration: "19:10",
      views: 25640,
      likes: 650,
      level: "Collège",
      classe: "6ème",
      subject: "proportionnalité",
      category: "cours",
    }),
    createVideo({
      id: 6,
      title: "Pourcentages - Calculs commerciaux",
      description: "Les pourcentages n'auront plus de secrets pour vous ! Apprenez à calculer réductions, augmentations et statistiques avec des exemples de la vie réelle. Devenez un expert en calculs commerciaux !",
      thumbnail: "",
      duration: "16:45",
      views: 23410,
      likes: 580,
      level: "Collège",
      classe: "6ème",
      subject: "pourcentages",
      category: "cours",
    }),
  ],
  "5ème": [
    createVideo({
      id: 7,
      title: "Nombres relatifs - Cours complet",
      description: "Voyagez dans le monde des nombres négatifs ! Comprenez comment fonctionnent les températures, les altitudes et les dettes. Un cours qui donne du sens aux nombres relatifs avec des exemples concrets et passionnants.",
      thumbnail: "",
      duration: "24:20",
      views: 41230,
      likes: 1100,
      level: "Collège",
      classe: "5ème",
      subject: "nombres",
      category: "cours",
    }),
    createVideo({
      id: 8,
      title: "Calcul littéral - Introduction à l'algèbre",
      description: "Entrez dans l'univers de l'algèbre ! Découvrez comment les lettres remplacent les nombres et ouvrez la porte à la résolution de problèmes complexes. Une introduction fascinante au langage mathématique.",
      thumbnail: "",
      duration: "28:15",
      views: 36520,
      likes: 950,
      level: "Collège",
      classe: "5ème",
      subject: "algèbre",
      category: "cours",
    }),
    createVideo({
      id: 9,
      title: "Triangles et quadrilatères - Propriétés",
      description: "Explorez les propriétés fascinantes des triangles ! De la construction à la démonstration, découvrez pourquoi les triangles sont partout autour de nous. Géométrie pratique et théorique combinées.",
      thumbnail: "",
      duration: "26:30",
      views: 32890,
      likes: 820,
      level: "Collège",
      classe: "5ème",
      subject: "géométrie",
      category: "cours",
    }),
    createVideo({
      id: 10,
      title: "Statistiques descriptives - Analyse de données",
      description: "Devenez un expert en données ! Apprenez à lire, analyser et présenter des statistiques avec des exemples concrets et des graphiques interactifs. Découvrez le pouvoir des données !",
      thumbnail: "",
      duration: "21:45",
      views: 29450,
      likes: 680,
      level: "Collège",
      classe: "5ème",
      subject: "statistiques",
      category: "cours",
    }),
    createVideo({
      id: 11,
      title: "Probabilités simples - Jeux et expériences",
      description: "Calculez vos chances de gagner ! Découvrez les probabilités à travers des jeux, des expériences et des situations amusantes. Transformez le hasard en science passionnante !",
      thumbnail: "",
      duration: "18:20",
      views: 27180,
      likes: 610,
      level: "Collège",
      classe: "5ème",
      subject: "probabilités",
      category: "cours",
    }),
    createVideo({
      id: 12,
      title: "Volumes et capacités - Géométrie 3D",
      description: "Mesurez l'espace en 3D ! Apprenez à calculer les volumes de solides avec des méthodes visuelles et des applications pratiques. Explorez le monde tridimensionnel !",
      thumbnail: "",
      duration: "23:50",
      views: 25320,
      likes: 570,
      level: "Collège",
      classe: "5ème",
      subject: "géométrie",
      category: "cours",
    }),
  ],
  "4ème": [
    createVideo({
      id: 13,
      title: "Puissances et notation scientifique",
      description: "Maîtrisez la puissance des nombres ! Découvrez comment les puissances simplifient les calculs et ouvrent la porte aux sciences modernes. Explorez l'univers des très grands et très petits nombres !",
      thumbnail: "",
      duration: "27:15",
      views: 38920,
      likes: 1050,
      level: "Collège",
      classe: "4ème",
      subject: "nombres",
      category: "cours",
    }),
    createVideo({
      id: 14,
      title: "Théorème de Pythagore - Applications",
      description: "Découvrez l'un des théorèmes les plus célèbres de l'histoire ! Apprenez à l'appliquer dans des situations concrètes et à résoudre des problèmes fascinants. Géométrie et histoire combinées !",
      thumbnail: "",
      duration: "30:25",
      views: 45210,
      likes: 1280,
      level: "Collège",
      classe: "4ème",
      subject: "géométrie",
      category: "cours",
    }),
    createVideo({
      id: 15,
      title: "Théorème de Thalès - Calculs de distances",
      description: "Explorez un autre théorème fondamental ! Apprenez à utiliser Thalès pour calculer des distances inaccessibles et résoudre des problèmes géométriques fascinants. Applications pratiques garanties !",
      thumbnail: "",
      duration: "28:40",
      views: 41560,
      likes: 1120,
      level: "Collège",
      classe: "4ème",
      subject: "géométrie",
      category: "cours",
    }),
    createVideo({
      id: 16,
      title: "Fonctions linéaires et affines - Graphiques",
      description: "Entrez dans le monde des fonctions ! Découvrez comment représenter graphiquement des relations mathématiques et prédire des résultats. Modélisation et prédiction au programme !",
      thumbnail: "",
      duration: "32:10",
      views: 37890,
      likes: 980,
      level: "Collège",
      classe: "4ème",
      subject: "fonctions",
      category: "cours",
    }),
    createVideo({
      id: 17,
      title: "Calcul littéral avancé - Factorisation",
      description: "Perfectionnez votre maîtrise de l'algèbre ! Développez, factorisez et simplifiez des expressions complexes avec aisance. Techniques avancées pour devenir un expert !",
      thumbnail: "",
      duration: "29:35",
      views: 34210,
      likes: 890,
      level: "Collège",
      classe: "4ème",
      subject: "algèbre",
      category: "cours",
    }),
    createVideo({
      id: 18,
      title: "Statistiques et probabilités - Analyse",
      description: "Devenez expert en analyse de données ! Apprenez à calculer des indicateurs statistiques et à évaluer des probabilités. Découvrez le monde fascinant des données !",
      thumbnail: "",
      duration: "26:20",
      views: 31580,
      likes: 750,
      level: "Collège",
      classe: "4ème",
      subject: "statistiques",
      category: "cours",
    }),
  ],
  "3ème": [
    createVideo({
      id: 19,
      title: "Équations - Résolution complète",
      description: "Résolvez des équations comme un détective ! Découvrez les méthodes pour trouver l'inconnue et résoudre des problèmes passionnants. Devenez un expert en résolution d'équations !",
      thumbnail: "",
      duration: "35:15",
      views: 52140,
      likes: 1450,
      level: "Collège",
      classe: "3ème",
      subject: "algèbre",
      category: "cours",
    }),
    createVideo({
      id: 20,
      title: "Fonctions linéaires - Analyse graphique",
      description: "Maîtrisez les fonctions linéaires ! Apprenez à les représenter, les analyser et les utiliser pour modéliser des situations réelles. Graphiques et applications concrètes au rendez-vous !",
      thumbnail: "",
      duration: "31:25",
      views: 47820,
      likes: 1200,
      level: "Collège",
      classe: "3ème",
      subject: "fonctions",
      category: "cours",
    }),
    createVideo({
      id: 21,
      title: "Trigonométrie - Sinus, cosinus, tangente",
      description: "Découvrez la trigonométrie ! Apprenez à utiliser sinus, cosinus et tangente pour résoudre des problèmes géométriques fascinants. Applications pratiques et calculs passionnants !",
      thumbnail: "",
      duration: "38:50",
      views: 44560,
      likes: 1150,
      level: "Collège",
      classe: "3ème",
      subject: "trigonométrie",
      category: "cours",
    }),
    createVideo({
      id: 22,
      title: "Systèmes d'équations - Méthodes de résolution",
      description: "Résolvez plusieurs équations simultanément ! Découvrez des méthodes efficaces pour trouver des solutions à des problèmes complexes. Substitution et élimination n'auront plus de secrets !",
      thumbnail: "",
      duration: "33:40",
      views: 41230,
      likes: 1080,
      level: "Collège",
      classe: "3ème",
      subject: "algèbre",
      category: "cours",
    }),
    createVideo({
      id: 23,
      title: "Géométrie dans l'espace - Solides",
      description: "Explorez la géométrie en 3 dimensions ! Découvrez les solides, leurs propriétés et leurs volumes avec des visualisations interactives. Géométrie spatiale fascinante !",
      thumbnail: "",
      duration: "29:15",
      views: 38950,
      likes: 950,
      level: "Collège",
      classe: "3ème",
      subject: "géométrie",
      category: "cours",
    }),
    createVideo({
      id: 24,
      title: "Statistiques avancées - Indicateurs",
      description: "Devenez expert en analyse de données ! Apprenez à calculer des indicateurs statistiques et à évaluer des probabilités complexes. Analyse approfondie et applications passionnantes !",
      thumbnail: "",
      duration: "27:30",
      views: 35680,
      likes: 850,
      level: "Collège",
      classe: "3ème",
      subject: "statistiques",
      category: "cours",
    }),
  ],
  "2nde": [
    createVideo({
      id: 25,
      title: "Calcul dans ℝ - Nombres réels",
      description: "Explorez l'univers des nombres réels ! Maîtrisez les opérations fondamentales et découvrez les propriétés fascinantes des nombres réels. Un cours essentiel pour comprendre les mathématiques modernes !",
      thumbnail: "",
      duration: "32:20",
      views: 58920,
      likes: 1680,
      level: "Lycée",
      classe: "2nde",
      subject: "nombres",
      category: "cours",
    }),
    createVideo({
      id: 26,
      title: "Calcul vectoriel - Opérations",
      description: "Plongez dans le monde des vecteurs ! Découvrez comment les vecteurs modélisent les forces, les déplacements et bien plus. Géométrie et physique combinées de manière passionnante !",
      thumbnail: "",
      duration: "36:45",
      views: 54210,
      likes: 1520,
      level: "Lycée",
      classe: "2nde",
      subject: "géométrie",
      category: "cours",
    }),
    createVideo({
      id: 27,
      title: "Équations du second degré - Discriminant",
      description: "Maîtrisez la résolution des équations du second degré ! Découvrez le discriminant, la factorisation et la formule quadratique. Résolvez des problèmes fascinants avec élégance !",
      thumbnail: "",
      duration: "34:10",
      views: 51560,
      likes: 1420,
      level: "Lycée",
      classe: "2nde",
      subject: "algèbre",
      category: "cours",
    }),
    createVideo({
      id: 28,
      title: "Le Barycentre - Centre de gravité",
      description: "Découvrez le concept fascinant du barycentre ! Apprenez à calculer le centre de gravité de systèmes de points et explorez ses applications en géométrie et physique. Un outil puissant !",
      thumbnail: "",
      duration: "31:25",
      views: 48230,
      likes: 1280,
      level: "Lycée",
      classe: "2nde",
      subject: "géométrie",
      category: "cours",
    }),
    createVideo({
      id: 29,
      title: "Systèmes d'équations - Méthodes élégantes",
      description: "Résolvez des systèmes complexes avec aisance ! Découvrez des méthodes élégantes pour trouver des solutions simultanées. Applications pratiques et problèmes passionnants vous attendent !",
      thumbnail: "",
      duration: "38:50",
      views: 45670,
      likes: 1200,
      level: "Lycée",
      classe: "2nde",
      subject: "algèbre",
      category: "cours",
    }),
    createVideo({
      id: 30,
      title: "Angles orientés et Trigonométrie avancée",
      description: "Explorez la trigonométrie avancée ! Découvrez les angles orientés et leurs applications fascinantes. Maîtrisez les relations trigonométriques complexes avec des méthodes claires !",
      thumbnail: "",
      duration: "35:30",
      views: 43210,
      likes: 1150,
      level: "Lycée",
      classe: "2nde",
      subject: "trigonométrie",
      category: "cours",
    }),
    createVideo({
      id: 31,
      title: "Fonctions numériques - Analyse complète",
      description: "Plongez dans l'analyse des fonctions ! Découvrez comment étudier les variations, les limites et les propriétés des fonctions. Graphiques interactifs et applications passionnantes !",
      thumbnail: "",
      duration: "40:15",
      views: 49850,
      likes: 1380,
      level: "Lycée",
      classe: "2nde",
      subject: "fonctions",
      category: "cours",
    }),
    createVideo({
      id: 32,
      title: "Statistiques descriptives - Graphiques",
      description: "Devenez un expert en analyse de données ! Apprenez à calculer moyennes, médianes, écarts-types et à créer des graphiques informatifs. Découvrez le pouvoir des statistiques !",
      thumbnail: "",
      duration: "33:20",
      views: 41580,
      likes: 1100,
      level: "Lycée",
      classe: "2nde",
      subject: "statistiques",
      category: "cours",
    }),
  ],
  "1ère": [
    createVideo({
      id: 33,
      title: "Dérivées - Calcul différentiel",
      description: "Découvrez la puissance des dérivées ! Apprenez à étudier les variations des fonctions et à résoudre des problèmes d'optimisation. Calcul différentiel passionnant avec applications concrètes !",
      thumbnail: "",
      duration: "42:30",
      views: 67890,
      likes: 2150,
      level: "Lycée",
      classe: "1ère",
      subject: "calcul",
      category: "cours",
    }),
    createVideo({
      id: 34,
      title: "Suites numériques - Convergence",
      description: "Plongez dans l'univers des suites ! Découvrez les suites arithmétiques, géométriques et leurs propriétés fascinantes. Convergence et limites n'auront plus de secrets !",
      thumbnail: "",
      duration: "38:15",
      views: 62540,
      likes: 1850,
      level: "Lycée",
      classe: "1ère",
      subject: "suites",
      category: "cours",
    }),
    createVideo({
      id: 35,
      title: "Probabilités - Lois de probabilité",
      description: "Maîtrisez l'art de quantifier l'incertitude ! Découvrez les probabilités avancées et leurs applications fascinantes. Modélisation et prédiction au programme !",
      thumbnail: "",
      duration: "45:20",
      views: 59210,
      likes: 1720,
      level: "Lycée",
      classe: "1ère",
      subject: "probabilités",
      category: "cours",
    }),
    createVideo({
      id: 36,
      title: "Limites et continuité - Fondements",
      description: "Explorez les concepts fondamentaux de l'analyse ! Découvrez comment les limites révèlent le comportement des fonctions. Continuité et discontinuité n'auront plus de secrets !",
      thumbnail: "",
      duration: "48:10",
      views: 56890,
      likes: 1680,
      level: "Lycée",
      classe: "1ère",
      subject: "analyse",
      category: "cours",
    }),
    createVideo({
      id: 37,
      title: "Primitives - Calcul intégral",
      description: "Découvrez l'art de trouver des primitives ! Apprenez les techniques pour intégrer des fonctions et ouvrez la porte au calcul intégral. Méthodes élégantes et applications fascinantes !",
      thumbnail: "",
      duration: "44:25",
      views: 54560,
      likes: 1580,
      level: "Lycée",
      classe: "1ère",
      subject: "calcul",
      category: "cours",
    }),
    createVideo({
      id: 38,
      title: "Produit scalaire - Applications géométriques",
      description: "Explorez le produit scalaire, un outil puissant ! Découvrez comment calculer des angles, des distances et des projections. Applications fascinantes en géométrie et physique !",
      thumbnail: "",
      duration: "39:50",
      views: 51230,
      likes: 1450,
      level: "Lycée",
      classe: "1ère",
      subject: "géométrie",
      category: "cours",
    }),
    createVideo({
      id: 39,
      title: "Polynômes - Factorisation avancée",
      description: "Explorez l'univers des polynômes ! Découvrez leurs propriétés fascinantes, apprenez à les factoriser et à résoudre des équations polynomiales. Algèbre passionnante qui ouvre de nombreuses portes !",
      thumbnail: "",
      duration: "41:15",
      views: 48970,
      likes: 1380,
      level: "Lycée",
      classe: "1ère",
      subject: "algèbre",
      category: "cours",
    }),
    createVideo({
      id: 40,
      title: "Dénombrement - Combinatoire",
      description: "Devenez un expert en combinatoire ! Apprenez à compter efficacement avec les méthodes de dénombrement. Applications fascinantes en probabilités, cryptographie et bien plus !",
      thumbnail: "",
      duration: "36:40",
      views: 46520,
      likes: 1280,
      level: "Lycée",
      classe: "1ère",
      subject: "combinatoire",
      category: "cours",
    }),
  ],
  Terminale: [
    createVideo({
      id: 41,
      title: "Arithmétique - Nombres premiers",
      description: "Explorez les mystères des nombres entiers ! Découvrez la divisibilité, les nombres premiers et les congruences. Arithmétique moderne passionnante avec applications en cryptographie !",
      thumbnail: "",
      duration: "50:25",
      views: 72150,
      likes: 2280,
      level: "Lycée",
      classe: "Terminale",
      subject: "arithmétique",
      category: "cours",
    }),
    createVideo({
      id: 42,
      title: "Calcul intégral - Aires et volumes",
      description: "Découvrez la puissance du calcul intégral ! Apprenez à calculer des aires, des volumes et des valeurs moyennes. Applications fascinantes en physique, économie et bien plus !",
      thumbnail: "",
      duration: "52:40",
      views: 68920,
      likes: 2150,
      level: "Lycée",
      classe: "Terminale",
      subject: "calcul",
      category: "cours",
    }),
    createVideo({
      id: 43,
      title: "Dérivation avancée - Optimisation",
      description: "Maîtrisez l'art de la dérivation ! Découvrez comment les dérivées révèlent les variations des fonctions. Applications passionnantes en optimisation et modélisation !",
      thumbnail: "",
      duration: "48:15",
      views: 65230,
      likes: 1980,
      level: "Lycée",
      classe: "Terminale",
      subject: "calcul",
      category: "cours",
    }),
    createVideo({
      id: 44,
      title: "Équations différentielles - Modélisation",
      description: "Résolvez les équations qui modélisent le monde ! Découvrez comment modéliser des phénomènes variés avec des équations différentielles. Applications fascinantes en sciences !",
      thumbnail: "",
      duration: "46:30",
      views: 61580,
      likes: 1850,
      level: "Lycée",
      classe: "Terminale",
      subject: "calcul",
      category: "cours",
    }),
    createVideo({
      id: 45,
      title: "Fonctions exponentielles et logarithmiques",
      description: "Explorez les fonctions qui modélisent la croissance ! Découvrez les exponentielles et logarithmes, leurs propriétés fascinantes et leurs applications en sciences naturelles et économie !",
      thumbnail: "",
      duration: "49:20",
      views: 58340,
      likes: 1780,
      level: "Lycée",
      classe: "Terminale",
      subject: "fonctions",
      category: "cours",
    }),
    createVideo({
      id: 46,
      title: "Nombres complexes - Applications",
      description: "Découvrez les nombres qui révolutionnent les mathématiques ! Explorez les nombres complexes et leurs applications fascinantes en géométrie, physique et ingénierie !",
      thumbnail: "",
      duration: "44:50",
      views: 55620,
      likes: 1680,
      level: "Lycée",
      classe: "Terminale",
      subject: "nombres",
      category: "cours",
    }),
    createVideo({
      id: 47,
      title: "Probabilités avancées - Lois complexes",
      description: "Maîtrisez l'art de quantifier l'incertitude ! Découvrez les probabilités avancées et leurs applications fascinantes. Modélisation précise et prédiction au programme !",
      thumbnail: "",
      duration: "51:15",
      views: 52890,
      likes: 1620,
      level: "Lycée",
      classe: "Terminale",
      subject: "probabilités",
      category: "cours",
    }),
    createVideo({
      id: 48,
      title: "Suites numériques avancées - Séries",
      description: "Plongez dans l'univers des suites ! Découvrez les suites convergentes, divergentes et leurs propriétés fascinantes. Analyse approfondie passionnante !",
      thumbnail: "",
      duration: "47:40",
      views: 50150,
      likes: 1520,
      level: "Lycée",
      classe: "Terminale",
      subject: "suites",
      category: "cours",
    }),
  ],
  Brevet: [
    createVideo({
      id: 49,
      title: "Préparation Brevet - Révisions complètes",
      description: "Préparez-vous au Brevet avec ce cours complet ! Révisions de tous les chapitres pour maîtriser l'examen. Réussissez votre Brevet avec confiance grâce à des explications claires !",
      thumbnail: "",
      duration: "58:30",
      views: 89240,
      likes: 2850,
      level: "Concours",
      classe: "Brevet",
      subject: "général",
      category: "cours",
    }),
    createVideo({
      id: 50,
      title: "Brevet Blanc - Simulation complète",
      description: "Simulez l'épreuve complète du Brevet ! 30 questions couvrant tous les chapitres du programme. Testez-vous dans les conditions réelles de l'examen avec des corrections détaillées !",
      thumbnail: "",
      duration: "65:20",
      views: 85670,
      likes: 2720,
      level: "Concours",
      classe: "Brevet",
      subject: "général",
      category: "exercices",
    }),
    createVideo({
      id: 51,
      title: "Méthodes pour réussir le Brevet",
      description: "Découvrez les meilleures méthodes pour réussir le Brevet ! Conseils pratiques, astuces et stratégies pour optimiser votre score. Techniques éprouvées pour exceller à l'examen !",
      thumbnail: "",
      duration: "42:15",
      views: 82450,
      likes: 2580,
      level: "Concours",
      classe: "Brevet",
      subject: "général",
      category: "methodes",
    }),
    createVideo({
      id: 52,
      title: "Brevet - Géométrie complète",
      description: "Maîtrisez la géométrie du Brevet ! Tous les théorèmes de Pythagore, Thalès et la trigonométrie expliqués en détail. Géométrie complète pour exceller à l'examen !",
      thumbnail: "",
      duration: "55:40",
      views: 78920,
      likes: 2450,
      level: "Concours",
      classe: "Brevet",
      subject: "géométrie",
      category: "cours",
    }),
  ],
  Bac: [
    createVideo({
      id: 53,
      title: "Préparation Bac - Analyse complète",
      description: "Maîtrisez l'analyse pour le Bac ! Tous les chapitres sur les limites, dérivées et intégrales expliqués en détail. Analyse complète pour réussir votre examen !",
      thumbnail: "",
      duration: "72:15",
      views: 125680,
      likes: 4250,
      level: "Concours",
      classe: "Bac",
      subject: "analyse",
      category: "cours",
    }),
    createVideo({
      id: 54,
      title: "Préparation Bac - Algèbre complète",
      description: "Excellez en algèbre au Bac ! Tous les chapitres sur les nombres complexes, polynômes et équations expliqués en détail. Algèbre complète pour l'examen !",
      thumbnail: "",
      duration: "68:30",
      views: 118920,
      likes: 3980,
      level: "Concours",
      classe: "Bac",
      subject: "algèbre",
      category: "cours",
    }),
    createVideo({
      id: 55,
      title: "Bac Blanc - Simulation complète",
      description: "Simulez l'épreuve complète du Bac ! 35 questions couvrant tous les chapitres du programme. Testez-vous dans les conditions réelles de l'examen avec des corrections détaillées !",
      thumbnail: "",
      duration: "85:40",
      views: 112450,
      likes: 3750,
      level: "Concours",
      classe: "Bac",
      subject: "général",
      category: "exercices",
    }),
    createVideo({
      id: 56,
      title: "Méthodes pour réussir le Bac",
      description: "Découvrez les meilleures méthodes pour réussir le Bac ! Conseils pratiques, astuces et stratégies pour optimiser votre score. Techniques éprouvées pour exceller à l'examen !",
      thumbnail: "",
      duration: "48:25",
      views: 108230,
      likes: 3520,
      level: "Concours",
      classe: "Bac",
      subject: "général",
      category: "methodes",
    }),
  ],
  Prépa: [
    createVideo({
      id: 57,
      title: "Algèbre linéaire - Espaces vectoriels",
      description: "Maîtrisez l'algèbre linéaire moderne ! Découvrez les espaces vectoriels, les applications linéaires et leurs propriétés fascinantes. Un outil puissant utilisé dans toutes les sciences !",
      thumbnail: "",
      duration: "62:40",
      views: 95620,
      likes: 3120,
      level: "Supérieur",
      classe: "Prépa",
      subject: "algèbre",
      category: "cours",
    }),
    createVideo({
      id: 58,
      title: "Analyse réelle - Suites et séries",
      description: "Plongez dans l'analyse mathématique avancée ! Explorez les suites et séries de fonctions avec rigueur. Découvrez les théorèmes fondamentaux qui régissent l'analyse moderne !",
      thumbnail: "",
      duration: "68:15",
      views: 91240,
      likes: 2980,
      level: "Supérieur",
      classe: "Prépa",
      subject: "analyse",
      category: "cours",
    }),
    createVideo({
      id: 59,
      title: "Topologie - Espaces métriques",
      description: "Explorez les espaces métriques et topologiques ! Découvrez les concepts fondamentaux de continuité, compacité et connexité. Géométrie moderne passionnante !",
      thumbnail: "",
      duration: "59:30",
      views: 87560,
      likes: 2850,
      level: "Supérieur",
      classe: "Prépa",
      subject: "topologie",
      category: "cours",
    }),
    createVideo({
      id: 60,
      title: "Probabilités avancées - Théorèmes limites",
      description: "Explorez les probabilités avancées ! Découvrez les lois continues et les théorèmes limites qui régissent les phénomènes aléatoires. Applications fascinantes en statistiques et sciences !",
      thumbnail: "",
      duration: "64:20",
      views: 84230,
      likes: 2720,
      level: "Supérieur",
      classe: "Prépa",
      subject: "probabilités",
      category: "cours",
    }),
    createVideo({
      id: 61,
      title: "Intégrales multiples - Calcul avancé",
      description: "Calculez des intégrales doubles et triples avec aisance ! Découvrez les changements de variables et les applications fascinantes en physique et géométrie. Calcul intégral avancé !",
      thumbnail: "",
      duration: "61:45",
      views: 81590,
      likes: 2650,
      level: "Supérieur",
      classe: "Prépa",
      subject: "calcul",
      category: "cours",
    }),
    createVideo({
      id: 62,
      title: "Réduction des endomorphismes",
      description: "Maîtrisez la diagonalisation et la trigonalisation ! Découvrez comment simplifier les matrices et résoudre des problèmes complexes. Algèbre linéaire avancée fascinante !",
      thumbnail: "",
      duration: "66:10",
      views: 78940,
      likes: 2580,
      level: "Supérieur",
      classe: "Prépa",
      subject: "algèbre",
      category: "cours",
    }),
  ],
}

const getCategoryColor = (category?: string) => {
  switch (category) {
    case "cours":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "exercices":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "methodes":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    default:
      return "bg-purple-500/10 text-purple-500 border-purple-500/20"
  }
}

const formatViews = (views: number) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k`
  }
  return views.toString()
}

export default function VideosPage() {
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

  const getTotalVideos = () => {
    return Object.values(videosData).reduce((total, videos) => total + videos.length, 0)
  }

  const getTotalDuration = () => {
    return Object.values(videosData).reduce((total, videos) => {
      return total + videos.reduce((sum, video) => {
        const [minutes, seconds] = video.duration.split(":").map(Number)
        return sum + minutes * 60 + seconds
      }, 0)
    }, 0)
  }

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }
    return `${minutes}min`
  }

  const filteredVideos = (classe: ClasseKey) => {
    const videos = videosData[classe] || []
    if (!searchQuery) return videos
    return videos.filter(
      (video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (video.subject && video.subject.toLowerCase().includes(searchQuery.toLowerCase()))
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
                <Play className="h-12 w-12 md:h-16 md:w-16 text-white" />
              </div>
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Vidéos Mathosphère
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos vidéos explicatives pour comprendre les concepts mathématiques.
                Plus de {getTotalVideos()} vidéos et {formatTotalDuration(getTotalDuration())} de contenu pour tous les niveaux.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{getTotalVideos()}+ vidéos</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{formatTotalDuration(getTotalDuration())} de contenu</span>
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
                  placeholder="Rechercher une vidéo..."
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
                        {videosData[classe as ClasseKey]?.length || 0}
                      </Badge>
                    </Button>
                  </motion.a>
                ))}
              </motion.div>

              {/* Liste des vidéos par classe */}
              {level.classes.map((classe) => {
                const videos = filteredVideos(classe as ClasseKey)
                if (videos.length === 0 && searchQuery) return null

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
                          <Play className="h-6 w-6 md:h-7 md:w-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Vidéos {classe}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            {videos.length} vidéo{videos.length > 1 ? "s" : ""} disponible{videos.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {videos.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium mb-2">Aucune vidéo trouvée</p>
                          <p className="text-muted-foreground">
                            Aucune vidéo ne correspond à votre recherche "{searchQuery}"
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
                        {videos.map((video) => {
                          // Utiliser l'image de cours comme image principale, avec fallback vers thumbnail YouTube si disponible
                          const courseImage = video.subject ? getCourseImage(video.subject, video.classe) : getCourseImage("mathématiques", video.classe)
                          const videoImage = video.thumbnail || courseImage || "/images/math-blackboard.png"

                          return (
                            <motion.div key={video.id} variants={fadeIn}>
                              <Card className="overflow-hidden group h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-b from-card to-card/50">
                                <div className="relative h-64 overflow-hidden">
                                  <Image
                                    src={videoImage}
                                    alt={video.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    onError={(e) => {
                                      e.currentTarget.src = "/images/math-blackboard.png"
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                  {/* Badge de catégorie */}
                                  {video.category && (
                                    <div className="absolute top-4 left-4">
                                      <Badge
                                        className={`${getCategoryColor(video.category)} backdrop-blur-md shadow-lg border-2`}
                                      >
                                        {video.category === "cours" ? "Cours" : video.category === "exercices" ? "Exercices" : "Méthodes"}
                                      </Badge>
                                    </div>
                                  )}

                                  {/* Badge de classe */}
                                  <div className="absolute top-4 right-4">
                                    <Badge className="bg-background/95 backdrop-blur-md text-foreground shadow-lg border-2 border-primary/20">
                                      {video.classe || video.level}
                                    </Badge>
                                  </div>

                                  {/* Bouton play au centre */}
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-primary/90 text-primary-foreground rounded-full p-4 shadow-2xl">
                                      <Play className="h-8 w-8 fill-current" />
                                    </div>
                                  </div>

                                  {/* Contenu overlay */}
                                  <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="font-bold text-foreground text-xl md:text-2xl mb-3 drop-shadow-2xl line-clamp-2">
                                      {video.title}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-semibold text-sm">{video.duration}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <Eye className="h-4 w-4" />
                                        <span className="font-semibold text-sm">{formatViews(video.views)}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 bg-yellow-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">
                                        <ThumbsUp className="h-4 w-4 fill-white" />
                                        <span className="font-semibold text-sm">{formatViews(video.likes)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Effet de brillance au survol */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>

                                <CardContent className="pt-6 flex-grow">
                                  <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                                    {video.description}
                                  </p>
                                </CardContent>

                                <CardFooter className="pt-4 pb-6 flex flex-col gap-3">
                                  <Button
                                    className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg"
                                    variant="outline"
                                    asChild
                                  >
                                    <Link href={`/videos/${video.id}`}>
                                      <Play className="mr-2 h-4 w-4" />
                                      <span>Regarder la vidéo</span>
                                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                  </Button>
                                  <Button variant="secondary" className="w-full" asChild>
                                    <Link href={getYouTubeUrl(video.youtubeId)} target="_blank" rel="noreferrer">
                                      <Youtube className="mr-2 h-4 w-4" />
                                      Voir sur YouTube
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
