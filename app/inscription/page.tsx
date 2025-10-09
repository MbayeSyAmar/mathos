"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"

export default function InscriptionPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setError("Vous devez accepter les conditions d'utilisation")
      setIsLoading(false)
      return
    }

    try {
      // Essayer d'abord Firebase Authentication
      try {
        await register(name, email, password)
        router.push("/dashboard")
      } catch (firebaseError) {
        console.warn("Firebase indisponible, simulation d'inscription:", firebaseError)
        
        // Simuler une inscription réussie
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        // Stocker les informations utilisateur en localStorage pour simulation
        localStorage.setItem('mockUser', JSON.stringify({
          id: `user_${Date.now()}`,
          email: email,
          name: name,
          role: 'student'
        }))
        
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("Erreur lors de l'inscription. Veuillez réessayer.")
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
        <h1 className="text-3xl font-bold tracking-tighter">Rejoignez Mathosphère</h1>
        <p className="text-muted-foreground">Créez votre compte pour accéder à toutes nos ressources mathématiques.</p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Tabs defaultValue="inscription" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inscription">Inscription</TabsTrigger>
            <TabsTrigger value="connexion">Connexion</TabsTrigger>
          </TabsList>

          <TabsContent value="inscription">
            <Card>
              <CardHeader>
                <CardTitle>Créer un compte</CardTitle>
                <CardDescription>Remplissez le formulaire ci-dessous pour vous inscrire</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Votre nom"
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
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
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">
                          {showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        </span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(!!checked)}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      J'accepte les{" "}
                      <Link href="/conditions" className="text-primary hover:underline">
                        conditions d'utilisation
                      </Link>{" "}
                      et la{" "}
                      <Link href="/confidentialite" className="text-primary hover:underline">
                        politique de confidentialité
                      </Link>
                    </label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      "Création en cours..."
                    ) : (
                      <>
                        Créer un compte <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="connexion">
            <Card>
              <CardHeader>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>Connectez-vous à votre compte Mathosphère</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="loginEmail" type="email" placeholder="votre.email@exemple.com" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="loginPassword">Mot de passe</Label>
                    <Link href="/mot-de-passe-oublie" className="text-sm text-primary hover:underline">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="loginPassword" type="password" placeholder="••••••••" className="pl-10" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => router.push("/connexion")}>
                  Se connecter <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
