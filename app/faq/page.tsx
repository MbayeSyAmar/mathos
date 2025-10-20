"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

const faqData = [
  {
    category: "Général",
    questions: [
      {
        question: "Qu'est-ce que Mathosphère ?",
        answer: "Mathosphère est une plateforme éducative gratuite qui propose des cours de mathématiques, des exercices interactifs et un accompagnement personnalisé pour les élèves du collège au lycée."
      },
      {
        question: "Comment créer un compte ?",
        answer: "Cliquez sur le bouton 'Inscription' en haut à droite, remplissez le formulaire avec vos informations et validez votre adresse email. Votre compte sera créé instantanément."
      },
      {
        question: "La plateforme est-elle vraiment gratuite ?",
        answer: "Oui, l'accès aux cours, exercices et quiz est 100% gratuit. Seuls certains services premium comme l'encadrement personnalisé individuel sont payants."
      }
    ]
  },
  {
    category: "Cours et Ressources",
    questions: [
      {
        question: "Comment accéder aux cours ?",
        answer: "Après connexion, rendez-vous dans la section 'Cours' du menu. Vous y trouverez tous les chapitres organisés par niveau (Collège, Lycée) et par matière."
      },
      {
        question: "Puis-je télécharger les cours ?",
        answer: "Oui, chaque cours dispose d'un bouton de téléchargement au format PDF pour vous permettre de réviser hors ligne."
      },
      {
        question: "Les cours sont-ils conformes aux programmes scolaires ?",
        answer: "Absolument. Tous nos contenus sont élaborés par des enseignants certifiés et respectent les programmes officiels de l'Éducation Nationale."
      },
      {
        question: "Y a-t-il des vidéos explicatives ?",
        answer: "Oui, de nombreux cours incluent des vidéos explicatives pour faciliter la compréhension des concepts complexes."
      }
    ]
  },
  {
    category: "Exercices et Quiz",
    questions: [
      {
        question: "Comment fonctionnent les quiz ?",
        answer: "Les quiz sont des séries de questions à choix multiples ou à réponse courte. Vous recevez votre score immédiatement avec les corrections détaillées."
      },
      {
        question: "Puis-je refaire un quiz plusieurs fois ?",
        answer: "Oui, vous pouvez refaire chaque quiz autant de fois que vous le souhaitez pour améliorer votre score et consolider vos connaissances."
      },
      {
        question: "Les exercices sont-ils corrigés ?",
        answer: "Tous les exercices disposent de corrections détaillées étape par étape pour vous aider à comprendre la méthode de résolution."
      }
    ]
  },
  {
    category: "Encadrement Personnalisé",
    questions: [
      {
        question: "Qu'est-ce que l'encadrement personnalisé ?",
        answer: "C'est un service premium qui vous permet d'être suivi individuellement par un enseignant qualifié. Vous bénéficiez de séances en visio, d'un programme adapté à vos besoins et d'un suivi régulier."
      },
      {
        question: "Comment réserver une séance d'encadrement ?",
        answer: "Rendez-vous dans la section 'Encadrement', choisissez votre formule et sélectionnez un créneau horaire qui vous convient. Le paiement se fait en ligne de manière sécurisée."
      },
      {
        question: "Quels sont les tarifs ?",
        answer: "Les tarifs varient selon la formule choisie (séance unique, forfait mensuel, trimestre). Consultez la page 'Encadrement' pour plus de détails."
      },
      {
        question: "Puis-je changer d'enseignant ?",
        answer: "Oui, si le premier contact ne vous convient pas, vous pouvez demander à changer d'enseignant gratuitement."
      }
    ]
  },
  {
    category: "Groupe Mathosphère",
    questions: [
      {
        question: "C'est quoi le Groupe Mathosphère ?",
        answer: "C'est une communauté d'élèves et d'enseignants passionnés de mathématiques. Vous pouvez échanger, poser des questions et participer à des défis mathématiques."
      },
      {
        question: "Comment rejoindre le groupe ?",
        answer: "Une fois inscrit sur la plateforme, vous avez automatiquement accès au forum et aux groupes de discussion. Présentez-vous et commencez à échanger !"
      },
      {
        question: "Y a-t-il des événements organisés ?",
        answer: "Oui, nous organisons régulièrement des webinaires, des concours de mathématiques et des sessions de révision collectives avant les examens."
      }
    ]
  },
  {
    category: "Technique",
    questions: [
      {
        question: "Sur quels appareils puis-je utiliser Mathosphère ?",
        answer: "Mathosphère est accessible depuis n'importe quel appareil : ordinateur, tablette ou smartphone, via un navigateur web moderne."
      },
      {
        question: "Que faire si je rencontre un problème technique ?",
        answer: "Contactez-nous via le formulaire de contact ou envoyez un email à mathosphere.contact@gmail.com. Notre équipe technique vous répondra rapidement."
      },
      {
        question: "Mes données sont-elles sécurisées ?",
        answer: "Oui, toutes vos données personnelles sont chiffrées et stockées de manière sécurisée. Nous ne partageons jamais vos informations avec des tiers."
      }
    ]
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="container py-10">
      <motion.div
        className="space-y-4 text-center mb-10"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Foire Aux Questions
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Trouvez rapidement des réponses à vos questions sur Mathosphère
        </p>
      </motion.div>

      <motion.div
        className="max-w-3xl mx-auto mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher une question..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div
        className="max-w-3xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {filteredFAQ.length > 0 ? (
          filteredFAQ.map((category, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
                <CardDescription>
                  {category.questions.length} question{category.questions.length > 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, qIdx) => (
                    <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">
                Aucune question ne correspond à votre recherche.
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}