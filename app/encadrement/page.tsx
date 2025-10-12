"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Star, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { createEncadrementRequest } from "@/lib/services/encadrement-requests-service"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"

interface Teacher {
  id: string
  name: string
  role: string
  speciality: string
  rating: number
}

export default function EncadrementPage() {
  const { user } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loadingTeachers, setLoadingTeachers] = useState(true)
  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    studentClass: "",
    studentLevel: "",
    studentSchool: "",
    teacherId: "",
    teacherName: "",
    formule: "",
    subject: "Mathématiques",
    objectives: "",
    availability: [] as string[],
    message: "",
  })

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      setLoadingTeachers(true)
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("role", "==", "teacher"))
      const snapshot = await getDocs(q)
      
      const teachersList: Teacher[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        teachersList.push({
          id: doc.id,
          name: data.name || data.displayName || data.email,
          role: data.title || "Professeur de mathématiques",
          speciality: data.speciality || "Mathématiques",
          rating: data.rating || 4.8,
        })
      })
      
      setTeachers(teachersList)
    } catch (error) {
      console.error("Error fetching teachers:", error)
      toast.error("Erreur lors du chargement des professeurs")
    } finally {
      setLoadingTeachers(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.teacherId) {
      toast.error("Veuillez sélectionner un professeur")
      return
    }

    if (!formData.formule) {
      toast.error("Veuillez sélectionner une formule")
      return
    }

    if (formData.availability.length === 0) {
      toast.error("Veuillez sélectionner au moins une disponibilité")
      return
    }

    try {
      setLoading(true)
      
      console.log("📤 Submitting request with teacherId:", formData.teacherId)
      
      // Si l'utilisateur est connecté, on prend ses infos, sinon on utilise le formulaire
      const requestData = {
        studentId: user?.uid || "",
        studentName: formData.studentName,
        studentEmail: formData.studentEmail,
        studentClass: formData.studentClass,
        studentLevel: formData.studentLevel,
        studentSchool: formData.studentSchool,
        teacherId: formData.teacherId,
        teacherName: formData.teacherName,
        formule: formData.formule,
        subject: formData.subject,
        objectives: formData.objectives,
        availability: formData.availability,
        message: formData.message,
      }

      console.log("📝 Full request data:", requestData)

      await createEncadrementRequest(requestData)
      
      toast.success("Votre demande a été envoyée avec succès !")
      setSubmitted(true)
      
      // Reset form
      setFormData({
        studentName: "",
        studentEmail: "",
        studentClass: "",
        studentLevel: "",
        studentSchool: "",
        teacherId: "",
        teacherName: "",
        formule: "",
        subject: "Mathématiques",
        objectives: "",
        availability: [],
        message: "",
      })
    } catch (error) {
      console.error("Error submitting request:", error)
      toast.error("Erreur lors de l'envoi de la demande")
    } finally {
      setLoading(false)
    }
  }

  const handleTeacherSelect = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId)
    if (teacher) {
      setFormData({
        ...formData,
        teacherId: teacher.id,
        teacherName: teacher.name,
      })
    }
  }

  const handleAvailabilityToggle = (slot: string) => {
    setFormData({
      ...formData,
      availability: formData.availability.includes(slot)
        ? formData.availability.filter((s) => s !== slot)
        : [...formData.availability, slot],
    })
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
            {loadingTeachers ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : teachers.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                Aucun professeur disponible pour le moment
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teachers.map((teacher) => (
                  <Card
                    key={teacher.id}
                    className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 cursor-pointer transition-all ${
                      formData.teacherId === teacher.id
                        ? "border-primary border-2 bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => handleTeacherSelect(teacher.id)}
                  >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{teacher.name.charAt(0)}</span>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h3 className="font-bold">{teacher.name}</h3>
                      <p className="text-sm text-muted-foreground">{teacher.role}</p>
                      <div className="flex items-center justify-center sm:justify-start mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm ml-1">{teacher.rating}/5</span>
                      </div>
                      <p className="text-xs mt-1">Spécialité: {teacher.speciality}</p>
                    </div>
                    {formData.teacherId === teacher.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
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
                    Merci pour votre demande d'encadrement personnalisé. Le professeur sélectionné sera notifié et vous
                    recevrez une réponse dans les 24-48 heures.
                  </p>
                  <Button onClick={() => setSubmitted(false)}>Faire une nouvelle demande</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Nom complet *</Label>
                      <Input
                        id="studentName"
                        placeholder="Prénom et nom"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentEmail">Email *</Label>
                      <Input
                        id="studentEmail"
                        type="email"
                        placeholder="votre.email@exemple.com"
                        value={formData.studentEmail}
                        onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentClass">Classe *</Label>
                      <Input
                        id="studentClass"
                        placeholder="Ex: Terminale S, 3ème, Licence 1..."
                        value={formData.studentClass}
                        onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentLevel">Niveau scolaire *</Label>
                      <Select value={formData.studentLevel} onValueChange={(value) => setFormData({ ...formData, studentLevel: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Collège">Collège</SelectItem>
                          <SelectItem value="Lycée">Lycée</SelectItem>
                          <SelectItem value="Enseignement supérieur">Enseignement supérieur</SelectItem>
                          <SelectItem value="Formation adulte">Formation adulte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentSchool">École/Établissement</Label>
                    <Input
                      id="studentSchool"
                      placeholder="Nom de votre école ou établissement"
                      value={formData.studentSchool}
                      onChange={(e) => setFormData({ ...formData, studentSchool: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="formule">Formule souhaitée *</Label>
                    <Select value={formData.formule} onValueChange={(value) => setFormData({ ...formData, formule: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une formule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Formule Standard (2h/mois - 49€)">Formule Standard (2h/mois - 49€)</SelectItem>
                        <SelectItem value="Formule Intensive (4h/mois - 89€)">Formule Intensive (4h/mois - 89€)</SelectItem>
                        <SelectItem value="Formule sur mesure">Formule sur mesure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Matière *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Ex: Mathématiques, Algèbre, Analyse..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objectives">Vos objectifs *</Label>
                    <Textarea
                      id="objectives"
                      placeholder="Décrivez vos objectifs, difficultés ou attentes..."
                      rows={4}
                      value={formData.objectives}
                      onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Disponibilités * (sélectionnez au moins une)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        "Lundi matin",
                        "Lundi après-midi",
                        "Mardi matin",
                        "Mardi après-midi",
                        "Mercredi matin",
                        "Mercredi après-midi",
                        "Jeudi matin",
                        "Jeudi après-midi",
                        "Vendredi matin",
                        "Vendredi après-midi",
                        "Samedi matin",
                        "Samedi après-midi",
                      ].map((slot) => (
                        <div key={slot} className="flex items-center space-x-2">
                          <Checkbox
                            id={slot}
                            checked={formData.availability.includes(slot)}
                            onCheckedChange={() => handleAvailabilityToggle(slot)}
                          />
                          <Label htmlFor={slot} className="text-sm font-normal cursor-pointer">
                            {slot}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message (optionnel)</Label>
                    <Textarea
                      id="message"
                      placeholder="Informations complémentaires..."
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  {!formData.teacherId && (
                    <div className="bg-orange-50 border border-orange-200 rounded-md p-4 text-sm text-orange-800">
                      ⚠️ Veuillez sélectionner un professeur ci-dessus avant d'envoyer votre demande.
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading || !formData.teacherId}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      "Envoyer ma demande"
                    )}
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
