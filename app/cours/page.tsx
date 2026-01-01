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
  summary?: string // Résumé avec concepts fondamentaux
  content?: string // Contenu détaillé du cours
  objectives?: string[] // Objectifs d'apprentissage
  prerequisites?: string[] // Prérequis pour suivre le cours
  inProgress?: boolean // Indique si le cours est en cours de préparation
}

type ClasseKey = "6ème" | "5ème" | "4ème" | "3ème" | "2nde" | "1ère" | "Terminale" | "Licence" | "Master" | "Prépa"

export const coursesData: Record<ClasseKey, Course[]> = {
  "6ème": [
    {
      id: 1,
      title: "Introduction à la géométrie",
      description: "Découvrez les bases de la géométrie ! Apprenez à reconnaître et construire les figures géométriques fondamentales. Un cours interactif qui vous initie au monde fascinant des formes et des espaces.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 2,
      title: "Symétrie orthogonale par rapport à une droite donnée",
      description: "Explorez la beauté de la symétrie ! Apprenez à construire des figures symétriques par rapport à une droite. Découvrez comment cette transformation géométrique crée des motifs harmonieux.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 3,
      title: "Le Cercle",
      description: "Plongez dans l'univers du cercle ! Découvrez ses propriétés fascinantes, apprenez à le construire et à calculer son périmètre et son aire. Une figure géométrique aux applications infinies.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h45",
    },
    {
      id: 4,
      title: "Addition de deux nombres décimaux arithmétiques",
      description: "Maîtrisez l'addition des nombres décimaux ! Apprenez les techniques pour additionner correctement des nombres avec des décimales. Des méthodes simples et efficaces pour calculer avec précision.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h",
    },
    {
      id: 5,
      title: "Les nombres décimaux relatifs",
      description: "Explorez les nombres décimaux positifs et négatifs ! Comprenez comment fonctionnent les températures, les altitudes et les dettes. Un cours qui donne du sens aux nombres relatifs.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 6,
      title: "Organisation d'un calcul",
      description: "Apprenez à organiser vos calculs efficacement ! Découvrez les priorités opératoires et les règles de calcul. Des méthodes structurées pour éviter les erreurs et calculer rapidement.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h15",
    },
    {
      id: 7,
      title: "Division des nombres décimaux arithmétiques",
      description: "Maîtrisez la division des nombres décimaux ! Apprenez les techniques pour diviser correctement des nombres avec des décimales. Des méthodes claires pour obtenir des résultats précis.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 8,
      title: "Multiplication des nombres décimaux arithmétiques",
      description: "Perfectionnez votre maîtrise de la multiplication des nombres décimaux ! Découvrez les techniques pour multiplier efficacement. Des méthodes simples pour calculer avec aisance.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h",
    },
    {
      id: 9,
      title: "Rangement des nombres décimaux arithmétiques",
      description: "Apprenez à comparer et ranger les nombres décimaux ! Découvrez comment ordonner des nombres avec des décimales du plus petit au plus grand. Des méthodes visuelles et pratiques.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "1h45",
    },
    {
      id: 10,
      title: "Soustraction de deux nombres décimaux arithmétiques",
      description: "Maîtrisez la soustraction des nombres décimaux ! Apprenez les techniques pour soustraire correctement des nombres avec des décimales. Des méthodes claires pour éviter les erreurs.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h",
    },
    {
      id: 11,
      title: "Les angles",
      description: "Explorez le monde des angles ! Apprenez à les mesurer, les construire et les comparer. Découvrez les différents types d'angles et leurs propriétés fascinantes.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 12,
      title: "Droites perpendiculaires et droites parallèles",
      description: "Découvrez les relations entre les droites ! Apprenez à reconnaître et construire des droites perpendiculaires et parallèles. Géométrie pratique avec applications concrètes.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h15",
    },
    {
      id: 13,
      title: "Les nombres décimaux arithmétiques",
      description: "Plongez dans l'univers des nombres décimaux ! Découvrez leur structure, leur écriture et leurs propriétés. Un cours fondamental pour maîtriser les calculs avec les décimales.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
  ],
  "5ème": [
    {
      id: 14,
      title: "Géométrie dans l'espace",
      description: "Explorez la géométrie en trois dimensions ! Découvrez les solides, leurs propriétés et leurs volumes. Un cours qui vous fait passer du plan à l'espace avec des visualisations fascinantes.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h30",
    },
    {
      id: 15,
      title: "Le quadrilatère",
      description: "Découvrez la famille des quadrilatères ! Apprenez à reconnaître et construire ces figures géométriques avec leurs propriétés remarquables. Géométrie pratique et théorique combinées.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 16,
      title: "Proportionnalité",
      description: "Maîtrisez les relations proportionnelles ! Découvrez comment identifier et utiliser la proportionnalité dans des situations variées. Tableaux, graphiques et applications multiples vous attendent.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h15",
    },
    {
      id: 17,
      title: "Équations et Inéquations",
      description: "Résolvez des équations et inéquations comme un détective ! Découvrez les méthodes pour trouver l'inconnue et résoudre des problèmes passionnants. Devenez un expert en résolution.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h30",
    },
    {
      id: 18,
      title: "Le repérage",
      description: "Apprenez à vous repérer dans le plan ! Découvrez le système de coordonnées et comment localiser des points précisément. Géométrie analytique accessible et pratique.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 19,
      title: "La puissance dans D",
      description: "Maîtrisez la puissance des nombres décimaux ! Découvrez comment les puissances simplifient les calculs et ouvrent la porte aux sciences modernes. Explorez l'univers des très grands et très petits nombres.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h45",
    },
    {
      id: 20,
      title: "Les triangles",
      description: "Explorez les propriétés fascinantes des triangles ! De la construction à la démonstration, découvrez pourquoi les triangles sont partout autour de nous. Géométrie pratique et théorique combinées.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h45",
    },
    {
      id: 21,
      title: "Les fractions",
      description: "Plongez dans l'univers des fractions ! Apprenez à les manipuler avec aisance grâce à des méthodes visuelles et des exercices progressifs. Transformez ce qui semble complexe en jeu d'enfant.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 22,
      title: "Les angles",
      description: "Explorez le monde des angles ! Apprenez à les mesurer, les construire et les comparer. Découvrez les différents types d'angles et leurs propriétés fascinantes.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 23,
      title: "La symétrie centrale",
      description: "Découvrez la symétrie centrale ! Apprenez à construire des figures symétriques par rapport à un point. Une transformation géométrique fascinante avec des applications pratiques.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 24,
      title: "Multiples et diviseurs",
      description: "Plongez dans l'univers des nombres ! Découvrez les multiples et diviseurs, leurs propriétés et leurs applications. Arithmétique passionnante avec des méthodes claires.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h45",
    },
    {
      id: 25,
      title: "Calcul dans D",
      description: "Maîtrisez les calculs avec les nombres décimaux ! Apprenez les techniques pour effectuer toutes les opérations avec précision. Des méthodes structurées pour éviter les erreurs.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 26,
      title: "Les nombres décimaux relatifs",
      description: "Explorez les nombres décimaux positifs et négatifs ! Comprenez comment fonctionnent les températures, les altitudes et les dettes. Un cours qui donne du sens aux nombres relatifs.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
  ],
  "4ème": [
    {
      id: 27,
      title: "Triangle rectangle : Théorème de Pythagore",
      description: "Découvrez l'un des théorèmes les plus célèbres de l'histoire ! Apprenez à l'appliquer dans des situations concrètes et à résoudre des problèmes fascinants. Géométrie et histoire combinées !",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h20",
    },
    {
      id: 28,
      title: "Théorèmes de la droite des milieux",
      description: "Explorez les propriétés fascinantes des milieux dans les triangles ! Découvrez comment les droites des milieux révèlent des relations géométriques importantes. Géométrie pratique et théorique.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 29,
      title: "Distance",
      description: "Apprenez à calculer des distances dans le plan ! Découvrez la formule de la distance entre deux points et ses applications pratiques. Géométrie analytique accessible.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h",
    },
    {
      id: 30,
      title: "Calcul Algébrique",
      description: "Perfectionnez votre maîtrise de l'algèbre ! Développez, factorisez et simplifiez des expressions complexes avec aisance. Techniques avancées pour devenir un expert.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h",
    },
    {
      id: 31,
      title: "Inéquations et système d'inéquations à une inconnue",
      description: "Explorez le monde des inégalités ! Apprenez à résoudre des inéquations et systèmes d'inéquations et à représenter leurs solutions graphiquement. Intervalles et représentations visuelles.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h30",
    },
    {
      id: 32,
      title: "Translation et vecteur",
      description: "Découvrez les transformations géométriques ! Apprenez à utiliser les translations et les vecteurs pour déplacer des figures. Géométrie dynamique passionnante.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 33,
      title: "Application linéaire",
      description: "Entrez dans le monde des applications linéaires ! Découvrez comment ces transformations préservent les structures géométriques. Algèbre et géométrie combinées.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h15",
    },
    {
      id: 34,
      title: "Ensemble des nombres rationnels : Présentation et Opérations",
      description: "Plongez dans l'univers des nombres rationnels ! Découvrez leur structure, leurs propriétés et apprenez à effectuer toutes les opérations. Arithmétique passionnante.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h30",
    },
    {
      id: 35,
      title: "Le cosinus d'un angle aigu",
      description: "Découvrez la trigonométrie ! Apprenez à utiliser le cosinus d'un angle aigu pour résoudre des problèmes géométriques fascinants. Applications pratiques et calculs passionnants.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h45",
    },
    {
      id: 36,
      title: "Les pyramides",
      description: "Explorez les pyramides en géométrie dans l'espace ! Découvrez leurs propriétés, apprenez à calculer leurs volumes et leurs aires. Géométrie spatiale fascinante.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 37,
      title: "Équations à une inconnue dans Q",
      description: "Résolvez des équations avec les nombres rationnels ! Découvrez les méthodes pour trouver l'inconnue dans Q. Devenez un expert en résolution d'équations.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 38,
      title: "Nombres rationnels",
      description: "Plongez dans l'univers des nombres rationnels ! Découvrez leur structure, leurs propriétés et leurs applications. Arithmétique passionnante avec des méthodes claires.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 39,
      title: "Révision",
      description: "Consolidez vos connaissances ! Révision complète des concepts fondamentaux de la classe de 4ème avec des exercices variés et des méthodes de révision efficaces.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h",
    },
    {
      id: 40,
      title: "Statistique",
      description: "Devenez expert en analyse de données ! Apprenez à calculer des indicateurs statistiques, créer des graphiques et interpréter des données. Découvrez le monde fascinant des statistiques.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
  ],
  "3ème": [
    {
      id: 41,
      title: "Racine carrée",
      description: "Découvrez la racine carrée ! Apprenez à calculer et simplifier les racines carrées avec des méthodes claires. Un concept fondamental pour l'algèbre et la géométrie.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 42,
      title: "Calcul algébrique",
      description: "Perfectionnez votre maîtrise de l'algèbre ! Développez, factorisez et simplifiez des expressions complexes avec aisance. Techniques avancées pour devenir un expert.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h",
    },
    {
      id: 43,
      title: "Équation et Inéquation à une seule inconnue",
      description: "Résolvez des équations et inéquations comme un détective ! Découvrez les méthodes pour trouver l'inconnue et résoudre des problèmes passionnants. Devenez un expert en résolution.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h30",
    },
    {
      id: 44,
      title: "Statistique",
      description: "Devenez expert en analyse de données ! Apprenez à calculer des indicateurs statistiques, créer des graphiques et interpréter des données. Découvrez le monde fascinant des statistiques.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 45,
      title: "Application affine - Application affine par intervalle",
      description: "Explorez les applications affines ! Découvrez comment ces fonctions modélisent des situations réelles avec des méthodes graphiques et algébriques. Modélisation passionnante.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h15",
    },
    {
      id: 46,
      title: "Équations et inéquations du 1er degré à deux inconnues",
      description: "Résolvez des systèmes d'équations et d'inéquations ! Découvrez des méthodes efficaces pour trouver des solutions simultanées. Substitution et élimination n'auront plus de secrets.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h30",
    },
    {
      id: 47,
      title: "Vecteurs",
      description: "Plongez dans le monde des vecteurs ! Découvrez comment les vecteurs modélisent les déplacements et les forces. Géométrie et physique combinées de manière passionnante.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 48,
      title: "Repérage dans le plan",
      description: "Apprenez à vous repérer dans le plan ! Découvrez le système de coordonnées et comment localiser des points précisément. Géométrie analytique accessible et pratique.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 49,
      title: "Relations trigonométriques dans un triangle rectangle",
      description: "Découvrez la trigonométrie ! Apprenez à utiliser sinus, cosinus et tangente pour résoudre des problèmes géométriques fascinants. Applications pratiques et calculs passionnants.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h30",
    },
    {
      id: 50,
      title: "Théorème de Thalès",
      description: "Explorez un autre théorème fondamental ! Apprenez à utiliser Thalès pour calculer des distances inaccessibles et résoudre des problèmes géométriques fascinants. Applications pratiques garanties.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "3h",
    },
    {
      id: 51,
      title: "Angle inscrit - Angle au centre",
      description: "Découvrez les propriétés fascinantes des angles dans un cercle ! Apprenez à utiliser les angles inscrits et au centre pour résoudre des problèmes géométriques. Géométrie du cercle passionnante.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h45",
    },
    {
      id: 52,
      title: "Géométrie dans l'espace",
      description: "Explorez la géométrie en 3 dimensions ! Découvrez les solides, leurs propriétés et leurs volumes avec des visualisations interactives. Géométrie spatiale fascinante.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "4h30",
    },
    {
      id: 53,
      title: "Construction de triangles",
      description: "Apprenez à construire des triangles avec précision ! Découvrez les différentes méthodes de construction selon les données disponibles. Géométrie pratique et théorique.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 54,
      title: "Partage d'un segment en trois parties égales",
      description: "Maîtrisez le partage précis d'un segment ! Apprenez les techniques pour diviser un segment en trois parties égales. Géométrie constructive passionnante.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "1h45",
    },
    {
      id: 55,
      title: "Comment montrer qu'un quadrilatère est un parallélogramme ?",
      description: "Découvrez les propriétés des parallélogrammes ! Apprenez à démontrer qu'un quadrilatère est un parallélogramme avec différentes méthodes. Géométrie démonstrative passionnante.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 56,
      title: "Vidéo Equation à une inconnue",
      description: "Résolvez des équations avec des vidéos explicatives ! Découvrez les méthodes pour trouver l'inconnue avec des explications visuelles et des exemples concrets.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "1h30",
    },
    {
      id: 57,
      title: "Inéquation à une inconnue - 3eme",
      description: "Explorez le monde des inégalités ! Apprenez à résoudre des inéquations et à représenter leurs solutions graphiquement. Intervalles et représentations visuelles.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 58,
      title: "Vidéo Théorème de Pythagore et Relation trigonométrique dans un triangle rectangle",
      description: "Découvrez le théorème de Pythagore et la trigonométrie avec des vidéos explicatives ! Apprenez à appliquer ces concepts dans des situations concrètes avec des explications visuelles.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h",
    },
    {
      id: 59,
      title: "Vidéo Exercices Théorème de Pythagore et Relation trigonométrique dans un triangle rectangle",
      description: "Pratiquez le théorème de Pythagore et la trigonométrie ! Résolvez des exercices variés avec des vidéos de correction détaillées. Renforcez vos compétences avec des problèmes progressifs.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h30",
    },
    {
      id: 60,
      title: "Vidéo Angle inscrit - Angle au centre dans un cercle",
      description: "Découvrez les angles dans un cercle avec des vidéos explicatives ! Apprenez à utiliser les angles inscrits et au centre pour résoudre des problèmes géométriques avec des explications visuelles.",
      image: "/placeholder.svg?height=200&width=400",
      duration: "2h",
    },
  ],
  "2nde": [
    {
      id: 61,
      title: "Calcul Vectoriel - 2nd S",
      description: "Plongez dans le monde des vecteurs ! Découvrez comment les vecteurs modélisent les forces, les déplacements et bien plus. Géométrie et physique combinées de manière passionnante.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 62,
      title: "Barycentre - 2nd S",
      description: "Découvrez le concept fascinant du barycentre ! Apprenez à calculer le centre de gravité de systèmes de points et explorez ses applications en géométrie et physique. Un outil puissant.",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
    {
      id: 63,
      title: "Repère cartésien - 2nd S",
      description: "Maîtrisez le repérage dans le plan ! Découvrez le système de coordonnées cartésiennes et comment localiser des points précisément. Géométrie analytique accessible et pratique.",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
    {
      id: 64,
      title: "Angles - Trigonométrie - 2nd S",
      description: "Explorez la trigonométrie avancée ! Découvrez les angles orientés et leurs applications fascinantes. Maîtrisez les relations trigonométriques complexes avec des méthodes claires.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 65,
      title: "Produit scalaire - 2nd S",
      description: "Explorez le produit scalaire, un outil puissant ! Découvrez comment calculer des angles, des distances et des projections. Applications fascinantes en géométrie et physique.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 66,
      title: "Calcul dans R - 2nd S",
      description: "Explorez l'univers des nombres réels ! Maîtrisez les opérations fondamentales et découvrez les propriétés fascinantes des nombres réels. Un cours essentiel pour comprendre les mathématiques modernes.",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
    {
      id: 67,
      title: "Équation du second degré - 2nd S",
      description: "Maîtrisez la résolution des équations du second degré ! Découvrez le discriminant, la factorisation et la formule quadratique. Résolvez des problèmes fascinants avec élégance.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 68,
      title: "Les systèmes d'équations et d'inéquations - 2nd S",
      description: "Résolvez des systèmes complexes avec aisance ! Découvrez des méthodes élégantes pour trouver des solutions simultanées. Applications pratiques et problèmes passionnants vous attendent.",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 69,
      title: "Polynômes - 2nd S",
      description: "Explorez l'univers des polynômes ! Découvrez leurs propriétés fascinantes, apprenez à les factoriser et à résoudre des équations polynomiales. Algèbre passionnante qui ouvre de nombreuses portes.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 70,
      title: "Généralités sur les fonctions - 2nd S",
      description: "Plongez dans l'analyse des fonctions ! Découvrez comment étudier les variations, les limites et les propriétés des fonctions. Graphiques interactifs et applications passionnantes.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 71,
      title: "Calcul vectoriel 2nd : Savoir-faire S",
      description: "Perfectionnez votre maîtrise du calcul vectoriel ! Pratiquez avec des exercices variés et des méthodes avancées. Renforcez vos compétences avec des problèmes progressifs.",
      image: "/images/exo.jpg",
      duration: "2h30",
    },
  ],
  "1ère": [
    {
      id: 72,
      title: "Dénombrement - 1er S",
      description: "Devenez un expert en combinatoire ! Apprenez à compter efficacement avec les méthodes de dénombrement. Applications fascinantes en probabilités, cryptographie et bien plus.",
      image: "/images/exo.jpg",
      duration: "3h15",
    },
    {
      id: 73,
      title: "Orthogonalité et produit scalaire dans l'espace - 1er S",
      description: "Explorez le produit scalaire dans l'espace ! Découvrez comment calculer des angles, des distances et des projections en 3D. Applications fascinantes en géométrie et physique.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 74,
      title: "Les transformations du plan - 1er S",
      description: "Explorez les transformations géométriques ! Découvrez les translations, rotations, homothéties et leurs propriétés fascinantes. Géométrie dynamique passionnante.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 75,
      title: "La statistique descriptive - 1er S",
      description: "Devenez un expert en analyse de données ! Apprenez à décrire et synthétiser des données avec des méthodes statistiques efficaces. Découvrez le pouvoir des statistiques.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 76,
      title: "Calcul vectoriel, barycentres et repères (rappels et compléments) - 1er S",
      description: "Consolidez vos connaissances en calcul vectoriel ! Révision et approfondissement des vecteurs, barycentres et repères avec des applications pratiques.",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 77,
      title: "Géométrie dans l'espace - 1er S",
      description: "Explorez la géométrie en 3 dimensions ! Découvrez les solides, leurs propriétés et leurs volumes avec des visualisations interactives. Géométrie spatiale fascinante.",
      image: "/images/exo.jpg",
      duration: "4h",
    },
    {
      id: 78,
      title: "Suites numériques - 1er S",
      description: "Plongez dans l'univers des suites ! Découvrez les suites arithmétiques, géométriques et leurs propriétés fascinantes. Convergence et limites n'auront plus de secrets.",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 79,
      title: "Primitives - 1er S",
      description: "Découvrez l'art de trouver des primitives ! Apprenez les techniques pour intégrer des fonctions et ouvrez la porte au calcul intégral. Méthodes élégantes et applications fascinantes.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 80,
      title: "Étude de fonctions - 1er S",
      description: "Plongez dans l'analyse des fonctions ! Découvrez comment étudier les variations, les limites et les propriétés des fonctions. Graphiques interactifs et applications passionnantes.",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 81,
      title: "Dérivées et applications - 1er S",
      description: "Découvrez la puissance des dérivées ! Apprenez à étudier les variations des fonctions et à résoudre des problèmes d'optimisation. Calcul différentiel passionnant avec applications concrètes.",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 82,
      title: "Limites et Continuité - 1er S",
      description: "Explorez les concepts fondamentaux de l'analyse ! Découvrez comment les limites révèlent le comportement des fonctions. Continuité et discontinuité n'auront plus de secrets.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 83,
      title: "Les Polynômes - 1er S",
      description: "Explorez l'univers des polynômes ! Découvrez leurs propriétés fascinantes, apprenez à les factoriser et à résoudre des équations polynomiales. Algèbre passionnante qui ouvre de nombreuses portes.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 84,
      title: "Angles - Trigonométrie - 1er S",
      description: "Maîtrisez la trigonométrie avancée ! Découvrez les angles orientés et leurs applications fascinantes. Explorez les fonctions trigonométriques sous tous leurs aspects avec des méthodes claires.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 85,
      title: "Équations - Inéquations - Systèmes - 1er S",
      description: "Résolvez des problèmes complexes avec élégance ! Maîtrisez les équations, inéquations et systèmes avec des méthodes efficaces. Applications pratiques et problèmes passionnants.",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 86,
      title: "Produit scalaire et lignes de niveau - 1er S",
      description: "Explorez le produit scalaire et les lignes de niveau ! Découvrez comment ces concepts révèlent des propriétés géométriques fascinantes. Applications pratiques et théoriques.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 87,
      title: "Généralités sur les fonctions - 1er S",
      description: "Plongez dans l'analyse des fonctions ! Découvrez comment étudier les variations, les limites et les propriétés des fonctions. Graphiques interactifs et applications passionnantes.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
  ],
  Terminale: [
    {
      id: 88,
      title: "Révisions de trigonométrie -T S",
      description: "Consolidez vos connaissances en trigonométrie ! Révision complète des concepts fondamentaux avec des exercices variés et des méthodes de révision efficaces.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 89,
      title: "Dérivabilité -T S",
      description: "Maîtrisez l'art de la dérivation ! Découvrez comment les dérivées révèlent les variations des fonctions. Applications passionnantes en optimisation et modélisation.",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 90,
      title: "Limites et continuité : rappels et compléments - T S",
      description: "Approfondissez votre compréhension des limites et de la continuité ! Explorez les formes indéterminées et les techniques avancées. Analyse approfondie passionnante.",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 91,
      title: "Fonctions exponentielles - Fonctions puissances - Croissances comparées - T S",
      description: "Explorez les fonctions qui modélisent la croissance ! Découvrez les exponentielles et puissances, leurs propriétés fascinantes et leurs applications en sciences naturelles et économie.",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 92,
      title: "Fonctions logarithmes - T S",
      description: "Découvrez les fonctions logarithmes ! Apprenez leurs propriétés fascinantes et leurs applications en sciences naturelles et économie. Modélisation et résolution de problèmes.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 93,
      title: "Calcul intégral - T S",
      description: "Découvrez la puissance du calcul intégral ! Apprenez à calculer des aires, des volumes et des valeurs moyennes. Applications fascinantes en physique, économie et bien plus.",
      image: "/images/exo.jpg",
      duration: "4h",
    },
    {
      id: 94,
      title: "Suites numériques - T S",
      description: "Plongez dans l'univers des suites ! Découvrez les suites convergentes, divergentes et leurs propriétés fascinantes. Analyse approfondie passionnante.",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 95,
      title: "Les nombres complexes - T S",
      description: "Découvrez les nombres qui révolutionnent les mathématiques ! Explorez les nombres complexes et leurs applications fascinantes en géométrie, physique et ingénierie.",
      image: "/images/exo.jpg",
      duration: "4h",
    },
    {
      id: 96,
      title: "Fonctions numériques - T S2 : Savoir-faire",
      description: "Perfectionnez votre maîtrise de l'analyse des fonctions ! Pratiquez avec des exercices variés et des méthodes avancées. Renforcez vos compétences avec des problèmes progressifs.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 97,
      title: "Similitudes planes directes - T S",
      description: "Explorez les similitudes planes directes ! Découvrez comment ces transformations géométriques préservent les angles et modifient les distances. Géométrie moderne passionnante.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 98,
      title: "Probabilités - T S",
      description: "Maîtrisez l'art de quantifier l'incertitude ! Découvrez les probabilités avancées et leurs applications fascinantes. Modélisation et prédiction au programme.",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 99,
      title: "Dénombrement - T S",
      description: "Devenez un expert en combinatoire ! Apprenez à compter efficacement avec les méthodes de dénombrement. Applications fascinantes en probabilités, cryptographie et bien plus.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 100,
      title: "Courbes paramétrées - T S1",
      description: "Explorez les courbes paramétrées ! Découvrez comment décrire des courbes complexes avec des équations paramétriques. Géométrie analytique avancée passionnante.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 101,
      title: "Arithmétique - T S1",
      description: "Explorez les mystères des nombres entiers ! Découvrez la divisibilité, les nombres premiers et les congruences. Arithmétique moderne passionnante avec applications en cryptographie.",
      image: "/images/exo.jpg",
      duration: "4h",
    },
    {
      id: 102,
      title: "Équations différentielles - T S",
      description: "Résolvez les équations qui modélisent le monde ! Découvrez comment modéliser des phénomènes variés avec des équations différentielles. Applications fascinantes en sciences.",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 103,
      title: "Géométrie dans l'espace - T S1",
      description: "Explorez la géométrie en 3 dimensions ! Découvrez les solides, leurs propriétés et leurs volumes avec des visualisations interactives. Géométrie spatiale fascinante.",
      image: "/images/exo.jpg",
      duration: "4h",
    },
    {
      id: 104,
      title: "Transformations - Isométries du plan - T S1",
      description: "Explorez les transformations géométriques ! Découvrez les isométries du plan et leurs propriétés fascinantes. Géométrie dynamique passionnante.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 105,
      title: "Les angles - T S1",
      description: "Maîtrisez la trigonométrie avancée ! Découvrez les angles orientés et leurs applications fascinantes. Explorez les fonctions trigonométriques sous tous leurs aspects.",
      image: "/images/exo.jpg",
      duration: "3h",
    },
    {
      id: 106,
      title: "Fonctions scalaires et vectorielles de Leibniz - T S1",
      description: "Découvrez les fonctions scalaires et vectorielles ! Explorez ce concept fondamental qui connecte algèbre et géométrie. Applications fascinantes en analyse et physique.",
      image: "/images/exo.jpg",
      duration: "3h30",
    },
    {
      id: 107,
      title: "Coniques - T S1",
      description: "Explorez les coniques ! Découvrez les ellipses, paraboles et hyperboles, leurs propriétés fascinantes et leurs applications en géométrie et physique.",
      image: "/images/exo.jpg",
      duration: "3h30",
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

// Fonction helper pour générer automatiquement les informations manquantes d'un cours
function generateCourseMetadata(title: string, description: string, classe: ClasseKey): {
  summary: string
  content: string
  objectives: string[]
  prerequisites: string[]
} {
  const isCollege = ["6ème", "5ème", "4ème", "3ème"].includes(classe)
  const isLycee = ["2nde", "1ère", "Terminale"].includes(classe)
  
  // Générer le résumé basé sur le titre et la description
  const summary = `Ce cours couvre les concepts fondamentaux de ${title.toLowerCase()}. ${description} Ce contenu est adapté au programme du Sénégal et vous permettra de maîtriser cette partie importante des mathématiques.`
  
  // Générer le contenu détaillé
  const content = `
    <h2>Introduction</h2>
    <p>${description}</p>
    <p>Ce cours fait partie du programme officiel du Sénégal et vous permettra d'acquérir les compétences nécessaires pour réussir.</p>
    
    <h2>Concepts principaux</h2>
    <p>Dans ce cours, nous aborderons les notions fondamentales de ${title.toLowerCase()}. Vous découvrirez les définitions importantes, les propriétés essentielles et les méthodes de résolution.</p>
    
    <h2>Applications pratiques</h2>
    <p>Nous verrons comment appliquer ces concepts dans des situations concrètes et résoudre des problèmes variés adaptés à votre niveau.</p>
    
    <h2>Exercices et pratique</h2>
    <p>Des exercices progressifs vous permettront de consolider vos connaissances et de vérifier votre compréhension.</p>
  `
  
  // Générer les objectifs selon le niveau
  const objectives = isCollege
    ? [
        `Comprendre les notions de base de ${title.toLowerCase()}`,
        "Maîtriser les techniques fondamentales",
        "Résoudre des exercices adaptés au niveau",
        "Appliquer les concepts dans des situations concrètes",
      ]
    : isLycee
    ? [
        `Maîtriser les concepts avancés de ${title.toLowerCase()}`,
        "Développer des méthodes de résolution efficaces",
        "Résoudre des problèmes complexes",
        "Préparer les épreuves du baccalauréat",
      ]
    : [
        `Approfondir les connaissances en ${title.toLowerCase()}`,
        "Développer une approche rigoureuse",
        "Résoudre des problèmes de niveau supérieur",
        "Préparer les concours et examens",
      ]
  
  // Générer les prérequis selon le niveau
  const prerequisites = isCollege
    ? [
        "Avoir suivi les cours précédents de la classe",
        "Maîtriser les opérations de base",
        "Savoir manipuler les nombres",
      ]
    : isLycee
    ? [
        "Avoir de solides bases du collège",
        "Maîtriser les concepts fondamentaux",
        "Être à l'aise avec le calcul algébrique",
      ]
    : [
        "Avoir complété le programme du lycée",
        "Maîtriser les concepts avancés",
        "Être à l'aise avec les démonstrations",
      ]
  
  return { summary, content, objectives, prerequisites }
}

// Fonction pour enrichir un cours avec les métadonnées manquantes
function enrichCourse(course: Course, classe: ClasseKey): Course {
  if (course.summary && course.content && course.objectives && course.prerequisites) {
    return course // Le cours a déjà toutes les sections
  }
  
  const metadata = generateCourseMetadata(course.title, course.description, classe)
  
  return {
    ...course,
    summary: course.summary || metadata.summary,
    content: course.content || metadata.content,
    objectives: course.objectives || metadata.objectives,
    prerequisites: course.prerequisites || metadata.prerequisites,
  }
}

// Enrichir tous les cours avec les sections manquantes
for (const [classe, courses] of Object.entries(coursesData) as [ClasseKey, Course[]][]) {
  coursesData[classe] = courses.map(course => enrichCourse(course, classe))
}

// Fonction pour récupérer un cours complet par son ID
export function getCourseById(courseId: number): Course | undefined {
  for (const courses of Object.values(coursesData)) {
    const course = courses.find(c => c.id === courseId)
    if (course) {
      // Générer les métadonnées manquantes
      const classe = Object.keys(coursesData).find(key => 
        coursesData[key as ClasseKey].some(c => c.id === courseId)
      ) as ClasseKey
      
      const metadata = generateCourseMetadata(course.title, course.description, classe)
      
      return {
        ...course,
        summary: course.summary || metadata.summary,
        content: course.content || metadata.content,
        objectives: course.objectives || metadata.objectives,
        prerequisites: course.prerequisites || metadata.prerequisites,
      }
    }
  }
  return undefined
}

// Fonction pour récupérer le résumé d'un cours par son ID
export function getCourseSummary(courseId: number): string | undefined {
  const course = getCourseById(courseId)
  return course?.summary
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
