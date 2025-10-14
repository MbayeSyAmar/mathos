"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Trophy,
  Target,
  Edit,
  Camera,
  Save,
  X,
  Loader2,
  Shield,
  GraduationCap,
  Star,
} from "lucide-react"
import { motion } from "framer-motion"
import { doc as firestoreDoc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import { BackButton } from "@/components/back-button"

export default function MonProfilPage() {
  const { user, userData, loading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: "",
    prenom: "",
    nom: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    dateNaissance: "",
    niveau: "",
    bio: "",
  })

  useEffect(() => {
    if (userData) {
      const data = userData as any
      setProfileData({
        displayName: userData.displayName || "",
        prenom: data.prenom || "",
        nom: data.nom || "",
        telephone: data.telephone || "",
        adresse: data.adresse || "",
        ville: data.ville || "",
        codePostal: data.codePostal || "",
        dateNaissance: data.dateNaissance || "",
        niveau: data.niveau || "",
        bio: data.bio || "",
      })
    }
  }, [userData])

  const handleSave = async () => {
    if (!user) return

    try {
      setSaving(true)
      const userRef = firestoreDoc(db, "users", user.uid)
      await updateDoc(userRef, {
        ...profileData,
        displayName: `${profileData.prenom} ${profileData.nom}`,
      })

      toast.success("Profil mis à jour avec succès !")
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Erreur lors de la mise à jour du profil")
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Non renseigné"
    
    try {
      let date: Date
      
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        date = timestamp.toDate()
      } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000)
      } else {
        date = new Date(timestamp)
      }
      
      return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date)
    } catch (error) {
      return "Date invalide"
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "?"
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Vous devez être connecté pour voir votre profil</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      {/* Bouton retour */}
      <div className="mb-6">
        <BackButton href="/dashboard" label="Retour au dashboard" />
      </div>

      {/* En-tête avec avatar et bannière */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Card className="mb-6 overflow-hidden">
          {/* Bannière de fond */}
          <div className="h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          
          <CardContent className="relative">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 sm:-mt-12">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={userData?.photoURL || ""} alt={profileData.displayName} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {getInitials(profileData.displayName)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                      {profileData.prenom} {profileData.nom}
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        {userData?.role === "student" ? "Étudiant" : userData?.role}
                      </Badge>
                      {profileData.niveau && (
                        <Badge variant="outline">Niveau: {profileData.niveau}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} className="gap-2">
                        <Edit className="h-4 w-4" />
                        Modifier le profil
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false)
                            if (userData) {
                              const data = userData as any
                              setProfileData({
                                displayName: userData.displayName || "",
                                prenom: data.prenom || "",
                                nom: data.nom || "",
                                telephone: data.telephone || "",
                                adresse: data.adresse || "",
                                ville: data.ville || "",
                                codePostal: data.codePostal || "",
                                dateNaissance: data.dateNaissance || "",
                                niveau: data.niveau || "",
                                bio: data.bio || "",
                              })
                            }
                          }}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Annuler
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="gap-2">
                          {saving ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Enregistrer
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contenu principal avec onglets */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info" className="gap-2">
              <User className="h-4 w-4" />
              Informations
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <Trophy className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Sécurité
            </TabsTrigger>
          </TabsList>

          {/* Onglet Informations */}
          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles et votre biographie
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input
                      id="prenom"
                      value={profileData.prenom}
                      onChange={(e) =>
                        setProfileData({ ...profileData, prenom: e.target.value })
                      }
                      disabled={!isEditing}
                      className="transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      value={profileData.nom}
                      onChange={(e) =>
                        setProfileData({ ...profileData, nom: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="telephone"
                        value={profileData.telephone}
                        onChange={(e) =>
                          setProfileData({ ...profileData, telephone: e.target.value })
                        }
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder="+221 XX XXX XX XX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateNaissance">Date de naissance</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dateNaissance"
                        type="date"
                        value={profileData.dateNaissance}
                        onChange={(e) =>
                          setProfileData({ ...profileData, dateNaissance: e.target.value })
                        }
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="niveau">Niveau d'études</Label>
                    <Input
                      id="niveau"
                      value={profileData.niveau}
                      onChange={(e) =>
                        setProfileData({ ...profileData, niveau: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="Ex: Terminale S, Licence 1..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={user.email || ""}
                        disabled
                        className="pl-10 bg-muted"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      L'email ne peut pas être modifié
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Parlez-nous un peu de vous, vos objectifs, vos passions..."
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Adresse
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3 space-y-2">
                      <Label htmlFor="adresse">Adresse complète</Label>
                      <Input
                        id="adresse"
                        value={profileData.adresse}
                        onChange={(e) =>
                          setProfileData({ ...profileData, adresse: e.target.value })
                        }
                        disabled={!isEditing}
                        placeholder="Rue, numéro..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="codePostal">Code postal</Label>
                      <Input
                        id="codePostal"
                        value={profileData.codePostal}
                        onChange={(e) =>
                          setProfileData({ ...profileData, codePostal: e.target.value })
                        }
                        disabled={!isEditing}
                        placeholder="12345"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="ville">Ville</Label>
                      <Input
                        id="ville"
                        value={profileData.ville}
                        onChange={(e) =>
                          setProfileData({ ...profileData, ville: e.target.value })
                        }
                        disabled={!isEditing}
                        placeholder="Dakar"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations du compte */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informations du compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Membre depuis</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate((userData as any)?.dateInscription)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3" />
                    Actif
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Statut du compte</p>
                    <p className="text-sm text-muted-foreground">Compte vérifié</p>
                  </div>
                  <Badge variant="default" className="bg-green-500">Vérifié</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Statistiques */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Cours suivis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">12</p>
                        <p className="text-xs text-muted-foreground">cours actifs</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Exercices complétés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                        <Target className="h-6 w-6 text-green-600 dark:text-green-300" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">87</p>
                        <p className="text-xs text-muted-foreground">exercices</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Badges obtenus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                        <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">5</p>
                        <p className="text-xs text-muted-foreground">badges</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Badges et récompenses
                </CardTitle>
                <CardDescription>Vos accomplissements sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Premier cours", icon: "🎓", earned: true },
                    { name: "10 exercices", icon: "📝", earned: true },
                    { name: "Quiz master", icon: "🏆", earned: true },
                    { name: "Assidu", icon: "⭐", earned: true },
                    { name: "Expert", icon: "🔥", earned: false },
                    { name: "Matheux", icon: "🧮", earned: false },
                    { name: "Perfectionniste", icon: "💯", earned: false },
                    { name: "Champion", icon: "👑", earned: false },
                  ].map((badge, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border ${
                        badge.earned
                          ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200"
                          : "bg-muted opacity-50"
                      }`}
                    >
                      <span className="text-4xl">{badge.icon}</span>
                      <p className="text-sm font-medium text-center">{badge.name}</p>
                      {badge.earned && (
                        <Badge variant="secondary" className="text-xs">
                          Obtenu
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Sécurité */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sécurité et confidentialité
                </CardTitle>
                <CardDescription>
                  Gérez vos paramètres de sécurité et de confidentialité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Mot de passe</p>
                      <p className="text-sm text-muted-foreground">
                        Dernière modification il y a 30 jours
                      </p>
                    </div>
                    <Button variant="outline">Modifier</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Authentification à deux facteurs</p>
                      <p className="text-sm text-muted-foreground">
                        Ajoutez une couche de sécurité supplémentaire
                      </p>
                    </div>
                    <Button variant="outline">Activer</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Sessions actives</p>
                      <p className="text-sm text-muted-foreground">
                        Gérez vos appareils connectés
                      </p>
                    </div>
                    <Button variant="outline">Voir</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-950 border-red-200">
                    <div>
                      <p className="font-medium text-red-600 dark:text-red-400">
                        Supprimer le compte
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cette action est irréversible
                      </p>
                    </div>
                    <Button variant="destructive">Supprimer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
