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
import { useAuth } from "@/lib/auth-context"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const setSession = () => {
      document.cookie = "session=admin_session_" + Date.now() + "; Path=/; Max-Age=86400; SameSite=Lax"
    }

    try {
      const emailLower = email.toLowerCase()

      // Comptes de démonstration (mock)
      if (emailLower === "demo-superadmin@mathosphere.com" && password === "admin123") {
        setSession()
        localStorage.setItem('mockAdmin', JSON.stringify({
          uid: 'admin1',
          email: emailLower,
          displayName: 'Super Admin Démo',
          role: 'super_admin'
        }))
        router.push("/admin/super/dashboard")
        return
      } else if (emailLower === "demo-admin@mathosphere.com" && password === "admin123") {
        setSession()
        localStorage.setItem('mockAdmin', JSON.stringify({
          uid: 'admin2',
          email: emailLower,
          displayName: 'Professeur Démo',
          role: 'teacher'
        }))
        router.push("/admin/professeur/dashboard")
        return
      } else if (emailLower === "demo-tutor@mathosphere.com" && password === "admin123") {
        setSession()
        localStorage.setItem('mockAdmin', JSON.stringify({
          uid: 'admin3',
          email: emailLower,
          displayName: 'Tuteur Démo',
          role: 'tutor'
        }))
        router.push("/admin/tuteur/dashboard")
        return
      } else if (emailLower === "demo-editor@mathosphere.com" && password === "admin123") {
        setSession()
        localStorage.setItem('mockAdmin', JSON.stringify({
          uid: 'admin4',
          email: emailLower,
          displayName: 'Rédacteur Démo',
          role: 'editor'
        }))
        router.push("/admin/redacteur/dashboard")
        return
      }

      // Connexion Firebase pour les vrais comptes
      try {
        const user = await login(email, password)
        
        // Récupérer les données utilisateur depuis Firestore pour vérifier le rôle
        const { getDoc, doc } = await import("firebase/firestore")
        const { db } = await import("@/lib/firebase")
        
        const userDoc = await getDoc(doc(db, "users", user.uid))
        
        if (!userDoc.exists()) {
          setError("Utilisateur non trouvé dans la base de données")
          return
        }

        const userData = userDoc.data()
        const userRole = userData.role

        // Vérifier que l'utilisateur a un rôle admin
        const adminRoles = ['super_admin', 'teacher', 'tutor', 'editor']
        if (!adminRoles.includes(userRole)) {
          setError("Accès refusé. Vous n'avez pas les permissions d'administrateur.")
          return
        }

        // Créer la session
        setSession()

        // Rediriger vers le bon dashboard selon le rôle
        if (userRole === 'super_admin') {
          router.push("/admin/super/dashboard")
        } else if (userRole === 'teacher') {
          router.push("/admin/professeur/dashboard")
        } else if (userRole === 'tutor') {
          router.push("/admin/tuteur/dashboard")
        } else if (userRole === 'editor') {
          router.push("/admin/redacteur/dashboard")
        }

      } catch (firebaseError) {
        console.error("Firebase login error:", firebaseError)
        setError("Email ou mot de passe incorrect. Utilisez un compte de démonstration ou vérifiez vos identifiants.")
      }

    } catch (error) {
      console.error("Login error:", error)
      setError("Erreur de connexion. Veuillez réessayer.")
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
                  <div className="text-xs text-center text-muted-foreground border-t pt-4 mt-2 space-y-2">
                    <p className="font-medium mb-3">Identifiants de démonstration :</p>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEmail("demo-superadmin@mathosphere.com")
                          setPassword("admin123")
                        }}
                      >
                        Super Admin
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEmail("demo-admin@mathosphere.com")
                          setPassword("admin123")
                        }}
                      >
                        Professeur
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEmail("demo-tutor@mathosphere.com")
                          setPassword("admin123")
                        }}
                      >
                        Tuteur
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEmail("demo-editor@mathosphere.com")
                          setPassword("admin123")
                        }}
                      >
                        Rédacteur
                      </Button>
                    </div>
                    <div className="text-[10px] mt-3 space-y-1 text-left">
                      <p>• Super Admin : demo-superadmin@mathosphere.com</p>
                      <p>• Professeur : demo-admin@mathosphere.com</p>
                      <p>• Tuteur : demo-tutor@mathosphere.com</p>
                      <p>• Rédacteur : demo-editor@mathosphere.com</p>
                      <p className="mt-2">Mot de passe : admin123</p>
                    </div>
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
