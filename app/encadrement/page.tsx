"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Star } from "lucide-react"
import { motion } from "framer-motion"

export default function EncadrementPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true)
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="container py-10">
      <motion.div className="space-y-4 text-center mb-10" initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Encadrement personnalisé</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Bénéficiez d'un suivi individuel pour progresser plus rapidement et atteindre vos objectifs en mathématiques.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Pourquoi choisir un encadrement personnalisé ?</h2>
            <ul className="space-y-3">
              {[
                "Progressez à votre rythme avec un programme adapté à vos besoins",
                "Bénéficiez de l'expertise de nos enseignants qualifiés",
                "Surmontez vos difficultés grâce à un suivi régulier",
                "Préparez efficacement vos examens et concours",
                "Développez votre confiance et votre autonomie en mathématiques",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Nos formules d'encadrement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-primary">
                <CardHeader className="pb-2">
                  <CardTitle>Formule Standard</CardTitle>
                  <CardDescription>Pour un soutien régulier</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    49€<span className="text-sm font-normal text-muted-foreground">/mois</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>2 séances de 1h par mois</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Suivi personnalisé</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Accès aux ressources premium</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Support par email</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Choisir cette formule</Button>
                </CardFooter>
              </Card>

              <Card className="border-primary">
                <CardHeader className="pb-2">
                  <CardTitle>Formule Intensive</CardTitle>
                  <CardDescription>Pour une progression rapide</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    89€<span className="text-sm font-normal text-muted-foreground">/mois</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>4 séances de 1h par mois</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Programme sur mesure</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Accès illimité aux ressources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Support prioritaire 7j/7</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Choisir cette formule</Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Nos enseignants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: "Thomas Martin",
                  role: "Professeur agrégé de mathématiques",
                  image: "/placeholder.svg?height=100&width=100",
                  rating: 4.9,
                  speciality: "Préparation aux concours",
                },
                {
                  name: "Sophie Leclerc",
                  role: "Docteure en mathématiques",
                  image: "/placeholder.svg?height=100&width=100",
                  rating: 4.8,
                  speciality: "Analyse et algèbre",
                },
              ].map((teacher, index) => (
                <Card key={index} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image src={teacher.image || "/placeholder.svg"} alt={teacher.name} fill className="object-cover" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-bold">{teacher.name}</h3>
                    <p className="text-sm text-muted-foreground">{teacher.role}</p>
                    <div className="flex items-center justify-center sm:justify-start mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm ml-1">{teacher.rating}/5</span>
                    </div>
                    <p className="text-xs mt-1">Spécialité: {teacher.speciality}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Demande d'encadrement personnalisé</CardTitle>
              <CardDescription>Remplissez ce formulaire pour nous faire part de vos besoins</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium">Demande envoyée !</h3>
                  <p className="text-muted-foreground">
                    Merci pour votre demande d'encadrement personnalisé. Un membre de notre équipe vous contactera dans
                    les 24 heures pour discuter de vos besoins.
                  </p>
                  <Button onClick={() => setSubmitted(false)}>Faire une nouvelle demande</Button>
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
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" placeholder="Votre numéro de téléphone" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Niveau scolaire</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="college">Collège</SelectItem>
                        <SelectItem value="lycee">Lycée</SelectItem>
                        <SelectItem value="superieur">Enseignement supérieur</SelectItem>
                        <SelectItem value="adulte">Formation adulte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formula">Formule souhaitée</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une formule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Formule Standard (2h/mois)</SelectItem>
                        <SelectItem value="intensive">Formule Intensive (4h/mois)</SelectItem>
                        <SelectItem value="custom">Formule sur mesure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="needs">Vos besoins spécifiques</Label>
                    <Textarea
                      id="needs"
                      placeholder="Décrivez vos objectifs, difficultés ou attentes..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Envoyer ma demande
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div className="mt-16 space-y-8" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold">Témoignages d'élèves</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground">
            Découvrez ce que nos élèves disent de leur expérience avec notre encadrement personnalisé.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Léa Dubois",
              level: "Terminale",
              image: "/placeholder.svg?height=100&width=100",
              text: "Grâce à l'encadrement personnalisé, j'ai pu surmonter mes difficultés en mathématiques et obtenir 18/20 au baccalauréat. Mon professeur a su adapter ses explications à mon rythme d'apprentissage.",
              rating: 5,
            },
            {
              name: "Lucas Martin",
              level: "Licence 1",
              image: "/placeholder.svg?height=100&width=100",
              text: "J'avais des lacunes en analyse qui me bloquaient dans mes études supérieures. L'encadrement m'a permis de combler ces lacunes et de reprendre confiance en moi. Je recommande vivement !",
              rating: 4.5,
            },
            {
              name: "Emma Petit",
              level: "3ème",
              image: "/placeholder.svg?height=100&width=100",
              text: "Les mathématiques étaient ma bête noire jusqu'à ce que je commence l'encadrement personnalisé. Mon professeur a su me faire aimer cette matière et j'ai progressé de façon spectaculaire.",
              rating: 5,
            },
          ].map((testimonial, index) => (
            <Card key={index} className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.level}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(testimonial.rating) ? "text-yellow-500 fill-yellow-500" : i < testimonial.rating ? "text-yellow-500 fill-yellow-500 opacity-50" : "text-muted-foreground"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm">{testimonial.rating}/5</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.div>

      <motion.div className="mt-16 text-center" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Prêt à progresser en mathématiques ?</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground">
            Ne laissez plus les difficultés en mathématiques vous freiner. Commencez dès aujourd'hui avec notre
            encadrement personnalisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button size="lg">Demander un encadrement</Button>
            <Button size="lg" variant="outline">
              En savoir plus
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
