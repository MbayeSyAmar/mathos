"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldAlert } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const setSession = () => {
      // pas de "Secure" en local; ajoutez-le en prod (https)
      document.cookie = "session=1; Path=/; Max-Age=86400; SameSite=Lax"
    }

    setTimeout(() => {
      const emailLower = email.toLowerCase()

      if (emailLower === "demo-superadmin@mathosphere.com" && password === "admin123") {
        setSession()
        router.push("/admin/super/dashboard")
      } else if (emailLower === "demo-admin@mathosphere.com" && password === "admin123") {
        setSession()
        router.push("/admin/professeur/dashboard")
      } else if (emailLower === "demo-tutor@mathosphere.com" && password === "admin123") {
        setSession()
        router.push("/admin/tuteur/dashboard")
      } else if (emailLower === "demo-editor@mathosphere.com" && password === "admin123") {
        setSession()
        router.push("/admin/redacteur/dashboard")
      } else {
        setError("Email ou mot de passe incorrect")
      }
      setIsLoading(false)
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
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/placeholder.svg?height=40&width=40" alt="Mathosphère Logo" width={40} height={40} />
            <span className="font-bold text-xl">Mathosphère</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div className="space-y-4 text-center mb-6" initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-3xl font-bold tracking-tighter">Espace administrateur</h1>
            <p className="text-muted-foreground">Connectez-vous pour accéder à votre espace d'administration</p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  <span>Connexion administrateur</span>
                </CardTitle>
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
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Link href="/admin/mot-de-passe-oublie" className="text-sm text-primary hover:underline">
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
                  <Link href="/" className="text-sm text-center text-primary hover:underline">
                    Retour au site principal
                  </Link>
                  <div className="text-xs text-center text-muted-foreground border-t pt-4 mt-2">
                    <p>Identifiants de démonstration :</p>
                    <p>Super Admin : demo-superadmin@mathosphere.com / admin123</p>
                    <p>Professeur : demo-admin@mathosphere.com / admin123</p>
                    <p>Tuteur : demo-tutor@mathosphere.com / admin123</p>
                    <p>Rédacteur : demo-editor@mathosphere.com / admin123</p>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
