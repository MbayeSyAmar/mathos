"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"

export default function ConnexionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("demo@mathosphere.fr")
  const [password, setPassword] = useState("mathosphere123")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Pour les identifiants de démonstration, simuler une connexion réussie
      if (email === "demo@mathosphere.fr" && password === "mathosphere123") {
        // Attendre un peu pour simuler une connexion
        await new Promise((resolve) => setTimeout(resolve, 800))
        
        // Stocker les informations utilisateur en localStorage pour simulation
        localStorage.setItem('mockUser', JSON.stringify({
          id: 'user1',
          email: email,
          name: 'Utilisateur Démo',
          role: 'student'
        }))
        
        // Créer un cookie de session
        document.cookie = `session=demo_user_${Date.now()}; path=/; max-age=86400`
        
        router.push(redirect)
        return
      }

      // Autres comptes de test
      if (email === "etudiant@test.fr" && password === "test123") {
        await new Promise((resolve) => setTimeout(resolve, 800))
        localStorage.setItem('mockUser', JSON.stringify({
          id: 'user2',
          email: email,
          name: 'Étudiant Test',
          role: 'student'
        }))
        // Créer un cookie de session
        document.cookie = `session=student_user_${Date.now()}; path=/; max-age=86400`
        router.push(redirect)
        return
      }

      if (email === "prof@mathosphere.fr" && password === "prof123") {
        await new Promise((resolve) => setTimeout(resolve, 800))
        localStorage.setItem('mockUser', JSON.stringify({
          id: 'user3',
          email: email,
          name: 'Professeur Démo',
          role: 'teacher'
        }))
        // Créer un cookie de session
        document.cookie = `session=teacher_user_${Date.now()}; path=/; max-age=86400`
        router.push(redirect)
        return
      }

      // Pour les autres identifiants, essayer Firebase Authentication
      try {
        await login(email, password)
        // Créer un cookie de session pour Firebase auth
        document.cookie = `session=firebase_user_${Date.now()}; path=/; max-age=86400`
        router.push(redirect)
      } catch (firebaseError) {
        console.error("Firebase login error:", firebaseError)
        setError("Identifiants incorrects. Utilisez un compte de démo : demo@mathosphere.fr / mathosphere123")
        return
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Erreur de connexion. Identifiants de démo : demo@mathosphere.fr / mathosphere123")
    } finally {
      setIsLoading(false)
    }
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
    <div className="container py-10 max-w-md">
      <motion.div className="space-y-4 text-center mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-3xl font-bold tracking-tighter">Connexion à Mathosphère</h1>
        <p className="text-muted-foreground">Connectez-vous pour accéder à votre espace personnel</p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Card className="border-gray-800">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>Entrez vos identifiants pour vous connecter</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link href="/mot-de-passe-oublie" className="text-sm text-primary hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    </span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Se souvenir de moi
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800" disabled={isLoading}>
                {isLoading ? (
                  "Connexion en cours..."
                ) : (
                  <>
                    Se connecter <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <div className="space-y-2">
                <p className="text-sm text-center text-muted-foreground">
                  Vous n'avez pas de compte ?{" "}
                  <Link href="/inscription" className="text-primary hover:underline">
                    Inscrivez-vous
                  </Link>
                </p>
                <p className="text-sm text-center text-muted-foreground">
                  Vous êtes administrateur ?{" "}
                  <Link href="/admin/login" className="text-primary hover:underline font-medium">
                    Connexion admin
                  </Link>
                </p>
              </div>
              <div className="text-xs text-center text-muted-foreground border-t pt-4 mt-2">
                <p className="mb-2">Identifiants de démonstration :</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mb-2"
                  onClick={() => {
                    setEmail("demo@mathosphere.fr")
                    setPassword("mathosphere123")
                  }}
                >
                  Remplir les identifiants de démo
                </Button>
                <p className="text-xs mt-2">Email : demo@mathosphere.fr</p>
                <p className="text-xs">Mot de passe : mathosphere123</p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
