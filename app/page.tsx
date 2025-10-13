"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { BookOpen, PenTool, BrainCircuit, BookText, Youtube, Mail, ArrowRight, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Grande image de fond */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/math-blackboard.png"
            alt="Tableau de formules mathématiques"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/70" />
        </div>

        <div className="container relative z-10">
          <motion.div
            className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 max-w-3xl mx-auto md:mx-0"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Découvrez les mathématiques autrement
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <p className="text-lg md:text-xl text-muted-foreground">
                  Cours, exercices, quiz et vidéos pour tous les niveaux. Apprenez à votre rythme et développez vos
                  compétences mathématiques avec une approche moderne et interactive.
                </p>
              </motion.div>
            </div>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 min-w-[200px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button 
                size="lg" 
                className="gap-1"
                onClick={() => router.push(user ? "/dashboard" : "/inscription")}
              >
                Commencer maintenant <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push("/cours")}
              >
                Découvrir nos cours
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Éléments décoratifs flottants */}
        <motion.div
          className="absolute right-[10%] top-1/4 w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md"
          animate={{
            y: [0, 15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute left-[15%] bottom-1/3 w-16 h-16 rounded-full bg-purple-500/20 backdrop-blur-md"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute right-[20%] bottom-1/4 w-12 h-12 rounded-full bg-blue-500/20 backdrop-blur-md"
          animate={{
            y: [0, 10, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </section>

      {/* Sections Preview */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Explorez nos sections</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Découvrez toutes les ressources disponibles pour votre apprentissage des mathématiques
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Cours",
                description: "Des cours complets pour tous les niveaux, de la 6ème à la terminale",
                icon: BookOpen,
                href: "/cours",
                image: "/placeholder.svg?height=200&width=400",
              },
              {
                title: "Exercices",
                description: "Des exercices variés avec corrections détaillées",
                icon: PenTool,
                href: "/exercices",
                image: "/placeholder.svg?height=200&width=400",
              },
              {
                title: "Quiz",
                description: "Testez vos connaissances avec nos quiz interactifs",
                icon: BrainCircuit,
                href: "/quiz",
                image: "/placeholder.svg?height=200&width=400",
              },
              {
                title: "Blog",
                description: "Articles sur les mathématiques, concours et méthodes d'apprentissage",
                icon: BookText,
                href: "/blog",
                image: "/placeholder.svg?height=200&width=400",
              },
              {
                title: "Vidéos YouTube",
                description: "Vidéos explicatives sur divers sujets mathématiques",
                icon: Youtube,
                href: "/videos",
                image: "/placeholder.svg?height=200&width=400",
              },
              {
                title: "Contact",
                description: "Besoin d'aide ? Contactez-nous pour toute question",
                icon: Mail,
                href: "/contact",
                image: "/placeholder.svg?height=200&width=400",
              },
            ].map((section, index) => {
              const Icon = section.icon
              return (
                <Card key={index} className="overflow-hidden group">
                  <div className="relative h-48">
                    <Image
                      src={section.image || "/placeholder.svg"}
                      alt={section.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <div className="bg-background/80 p-2 rounded-full">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground text-xl">{section.title}</h3>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground">{section.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={section.href} className="w-full">
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        Explorer <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Encadrement personnalisé */}
      <section className="w-full py-12 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground">
                Nouveau
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Encadrement personnalisé</h2>
              <p className="text-muted-foreground md:text-xl">
                Bénéficiez d'un suivi individuel pour progresser plus rapidement et atteindre vos objectifs en
                mathématiques.
              </p>
              <ul className="space-y-2">
                {[
                  "Cours particuliers adaptés à votre niveau",
                  "Suivi régulier de votre progression",
                  "Préparation aux examens et concours",
                  "Méthodes personnalisées pour surmonter vos difficultés",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg"
                  onClick={() => router.push(user ? "/dashboard/encadrement" : "/connexion?redirect=/dashboard/encadrement")}
                >
                  Demander un encadrement
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => router.push("/encadrement")}
                >
                  En savoir plus
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Encadrement personnalisé"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Groupe Mathosphère */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-xl overflow-hidden order-2 lg:order-1">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Groupe Mathosphère"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4 order-1 lg:order-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Rejoignez le groupe Mathosphère
              </h2>
              <p className="text-muted-foreground md:text-xl">
                Intégrez notre communauté d'apprenants et d'enseignants passionnés par les mathématiques.
              </p>
              <ul className="space-y-2">
                {[
                  "Échangez avec d'autres étudiants et professeurs",
                  "Participez à des sessions d'étude collectives",
                  "Accédez à des ressources exclusives",
                  "Restez informé des dernières actualités mathématiques",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg"
                  onClick={() => router.push("/forum")}
                >
                  Rejoindre le groupe
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => router.push("/forum")}
                >
                  En savoir plus
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Prêt à commencer votre voyage mathématique ?
              </h2>
              <p className="mx-auto max-w-[700px] md:text-xl">
                Inscrivez-vous gratuitement et accédez à toutes nos ressources pour progresser en mathématiques.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => router.push("/inscription")}
              >
                S'inscrire gratuitement
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent"
                onClick={() => router.push("/contact")}
              >
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
