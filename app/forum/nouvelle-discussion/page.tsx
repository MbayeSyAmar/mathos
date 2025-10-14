"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send } from "lucide-react"

// AJOUTS
import { useRouter } from "next/navigation"
import { collection, addDoc, serverTimestamp, updateDoc, doc as firestoreDoc, increment, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function NouvelleDiscussionPage() {
  const [titre, setTitre] = useState("")
  const [contenu, setContenu] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // AJOUTS
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titre.trim() || !contenu.trim()) return
    if (!user) {
      router.push("/connexion?redirect=/forum/nouvelle-discussion")
      return
    }

    setIsSubmitting(true)
    try {
      // Récupérer les informations complètes de l'utilisateur depuis Firestore
      let userDateInscription = null
      let userStats = { discussions: 0, reponses: 0 }
      
      try {
        const userDocRef = firestoreDoc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          userDateInscription = userData.dateInscription || null
          userStats = userData.stats || { discussions: 0, reponses: 0 }
        }
      } catch (userError) {
        console.warn("Impossible de récupérer les infos utilisateur:", userError)
      }

      // Écrit dans la même collection que lister/afficher: "forum_discussions"
      const docRef = await addDoc(collection(db, "forum_discussions"), {
        titre: titre.trim(),
        contenu: contenu.trim(),
        auteur: {
          id: user.uid,
          nom: user.displayName || "Utilisateur anonyme",
          avatar: user.photoURL || "",
          dateInscription: userDateInscription,
          stats: userStats,
        },
        categorie: "general", // ajustez si vous ajoutez un champ de sélection
        dateCreation: serverTimestamp(),
        derniereReponse: serverTimestamp(),
        reponses: 0,
        vues: 0,
        likes: 0,
      })

      // Optionnel: maj stats utilisateur (ignorer erreurs)
      try {
        await updateDoc(firestoreDoc(db, "users", user.uid), {
          "stats.discussions": increment(1),
        })
      } catch {}

      toast({ title: "Succès", description: "Discussion créée avec succès" })
      router.push(`/forum/${docRef.id}`)
    } catch (error) {
      console.error("Erreur lors de la création de la discussion:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer la discussion. Réessayez.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  return (
    <div className="container py-10">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5 text-black" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tighter text-black">Nouvelle discussion</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-xl text-black">Créer une nouvelle discussion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="titre" className="text-sm font-medium text-black">
                Titre de la discussion
              </label>
              <Input
                id="titre"
                placeholder="Saisissez un titre clair et concis"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                className="text-black"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contenu" className="text-sm font-medium text-black">
                Contenu de la discussion
              </label>
              <Textarea
                id="contenu"
                placeholder="Rédigez votre discussion..."
                rows={12}
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                className="text-black"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={handleBack} className="text-black">
              Annuler
            </Button>
            <Button type="submit" className="bg-gray-900 hover:bg-gray-800" disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : (<><Send className="mr-2 h-4 w-4" /> Publier la discussion</>)}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
