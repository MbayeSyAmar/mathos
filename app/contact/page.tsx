"use client"

import Link from "next/link"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true)
    }, 1000)
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="container py-10">
      <div className="space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contactez-nous</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Vous avez des questions ? N'hésitez pas à nous contacter, nous vous répondrons dans les plus brefs délais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Formulaire de contact</CardTitle>
              <CardDescription>Remplissez ce formulaire pour nous envoyer un message</CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium">Message envoyé !</h3>
                  <p className="text-muted-foreground">
                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)}>Envoyer un autre message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" placeholder="Votre prénom" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" placeholder="Votre nom" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="votre.email@exemple.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un sujet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="question">Question générale</SelectItem>
                        <SelectItem value="cours">Question sur un cours</SelectItem>
                        <SelectItem value="encadrement">Encadrement personnalisé</SelectItem>
                        <SelectItem value="groupe">Groupe Mathosphère</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Votre message..." rows={5} required />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" /> Envoyer le message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
              <CardDescription>Vous pouvez également nous contacter directement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">contact@mathosphere.fr</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Téléphone</h3>
                  <p className="text-muted-foreground">+33 1 23 45 67 89</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Adresse</h3>
                  <p className="text-muted-foreground">
                    123 Avenue des Mathématiques
                    <br />
                    75001 Paris, France
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horaires d'ouverture</CardTitle>
              <CardDescription>Notre équipe est disponible aux horaires suivants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span>9h00 - 18h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span>10h00 - 16h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span>Fermé</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>Questions fréquemment posées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Comment accéder aux cours ?</h3>
                <p className="text-muted-foreground">
                  Tous nos cours sont accessibles gratuitement après inscription sur notre plateforme.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Comment fonctionne l'encadrement personnalisé ?</h3>
                <p className="text-muted-foreground">
                  L'encadrement personnalisé est un service sur mesure qui vous permet de bénéficier d'un suivi
                  individuel par un de nos enseignants.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Les ressources sont-elles gratuites ?</h3>
                <p className="text-muted-foreground">
                  La majorité de nos ressources sont gratuites. Certains services premium comme l'encadrement
                  personnalisé sont payants.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/faq">Voir toutes les FAQ</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
