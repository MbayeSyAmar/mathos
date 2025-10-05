"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, User, Mail, School, Calendar, Edit, Save, X, Upload } from "lucide-react"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const router = useRouter()
  const { user, userData, updateUserData, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    level: "",
    school: "",
    interests: [],
    notifications: {
      email: true,
      newCourses: true,
      newExercises: false,
      newQuizzes: true,
      forum: true,
    },
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/connexion?redirect=/dashboard/mon-profil")
      return
    }

    if (userData) {
      setFormData({
        displayName: userData.displayName || "",
        bio: userData.bio || "",
        level: userData.level || "",
        school: userData.school || "",
        interests: userData.interests || [],
        notifications: userData.notifications || {
          email: true,
          newCourses: true,
          newExercises: false,
          newQuizzes: true,
          forum: true,
        },
      })
    }
  }, [user, userData, router])

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      let photoURL = userData?.photoURL || null

      if (avatarFile) {
        const storageRef = ref(storage, `users/${user.uid}/avatar`)
        await uploadBytes(storageRef, avatarFile)
        photoURL = await getDownloadURL(storageRef)
      }

      await updateUserData({
        displayName: formData.displayName,
        bio: formData.bio,
        level: formData.level,
        school: formData.school,
        interests: formData.interests,
        notifications: formData.notifications,
        photoURL,
      })

      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (userData) {
      setFormData({
        displayName: userData.displayName || "",
        bio: userData.bio || "",
        level: userData.level || "",
        school: userData.school || "",
        interests: userData.interests || [],
        notifications: userData.notifications || {
          email: true,
          newCourses: true,
          newExercises: false,
          newQuizzes: true,
          forum: true,
        },
      })
    }
    setAvatarFile(null)
  }

  const handleNotificationChange = (key, value) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [key]: value,
      },
    })
  }

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
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

  if (!userData) {
    return <div className="container py-10">Chargement...</div>
  }

  return (
    <div className="container py-10">
      <motion.div className="flex items-center gap-2 mb-6" initial="hidden" animate="visible" variants={fadeIn}>
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tighter">Mon Profil</h1>
        {!isEditing ? (
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" /> Modifier
          </Button>
        ) : (
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isLoading}>
              <X className="h-4 w-4 mr-2" /> Annuler
            </Button>
            <Button
              className="bg-gray-900 hover:bg-gray-800"
              size="sm"
              onClick={handleSaveProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                "Enregistrement..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Enregistrer
                </>
              )}
            </Button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Gérez vos informations personnelles et vos préférences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" value={user.email} disabled className="pl-10 opacity-70" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Niveau scolaire</Label>
                      <Select
                        value={formData.level}
                        onValueChange={(value) => setFormData({ ...formData, level: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Collège">Collège</SelectItem>
                          <SelectItem value="Lycée">Lycée</SelectItem>
                          <SelectItem value="Terminale">Terminale</SelectItem>
                          <SelectItem value="Supérieur">Enseignement supérieur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="school">Établissement</Label>
                      <Input
                        id="school"
                        value={formData.school}
                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Nom</div>
                        <div className="font-medium">{userData.displayName || "Non défini"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div className="font-medium">{user.email}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Biographie</div>
                    <p>{userData.bio || "Aucune biographie renseignée"}</p>
                  </div>

                  <Separator />

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <School className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Niveau</div>
                        <div className="font-medium">{userData.level || "Non défini"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Membre depuis</div>
                        <div className="font-medium">
                          {userData.createdAt
                            ? new Date(userData.createdAt.toDate()).toLocaleDateString("fr-FR", {
                                month: "long",
                                year: "numeric",
                              })
                            : "Date inconnue"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="preferences">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preferences">Préférences</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>
            <TabsContent value="preferences" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Centres d'intérêt</CardTitle>
                  <CardDescription>Personnalisez votre expérience en fonction de vos intérêts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest) => (
                      <div key={interest} className="bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {interest}
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 p-0 hover:bg-transparent"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                interests: formData.interests.filter((i) => i !== interest),
                              })
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <Button variant="outline" size="sm" className="rounded-full">
                        + Ajouter
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Gérez vos préférences de notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Notifications par email</div>
                      <div className="text-sm text-muted-foreground">
                        Recevoir des emails pour les mises à jour importantes
                      </div>
                    </div>
                    <Switch
                      checked={formData.notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                      disabled={!isEditing}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Nouveaux cours</div>
                      <div className="text-sm text-muted-foreground">
                        Être notifié lorsque de nouveaux cours sont disponibles
                      </div>
                    </div>
                    <Switch
                      checked={formData.notifications.newCourses}
                      onCheckedChange={(checked) => handleNotificationChange("newCourses", checked)}
                      disabled={!isEditing}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Nouveaux exercices</div>
                      <div className="text-sm text-muted-foreground">
                        Être notifié lorsque de nouveaux exercices sont disponibles
                      </div>
                    </div>
                    <Switch
                      checked={formData.notifications.newExercises}
                      onCheckedChange={(checked) => handleNotificationChange("newExercises", checked)}
                      disabled={!isEditing}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Nouveaux quiz</div>
                      <div className="text-sm text-muted-foreground">
                        Être notifié lorsque de nouveaux quiz sont disponibles
                      </div>
                    </div>
                    <Switch
                      checked={formData.notifications.newQuizzes}
                      onCheckedChange={(checked) => handleNotificationChange("newQuizzes", checked)}
                      disabled={!isEditing}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Activité du forum</div>
                      <div className="text-sm text-muted-foreground">Être notifié des réponses à vos discussions</div>
                    </div>
                    <Switch
                      checked={formData.notifications.forum}
                      onCheckedChange={(checked) => handleNotificationChange("forum", checked)}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mot de passe</CardTitle>
                  <CardDescription>Modifiez votre mot de passe pour sécuriser votre compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-gray-900 hover:bg-gray-800">Mettre à jour le mot de passe</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sessions actives</CardTitle>
                  <CardDescription>Gérez les appareils connectés à votre compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Cet appareil</div>
                        <div className="text-sm text-muted-foreground">Windows • Chrome • Paris, France</div>
                      </div>
                      <Badge>Actif</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">iPhone 13</div>
                        <div className="text-sm text-muted-foreground">iOS • Safari • Paris, France</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Déconnecter
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full text-red-500 hover:text-red-600">
                    Déconnecter tous les appareils
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    {avatarFile ? (
                      <AvatarImage
                        src={URL.createObjectURL(avatarFile) || "/placeholder.svg"}
                        alt={userData.displayName || "User"}
                      />
                    ) : (
                      <AvatarImage
                        src={userData.photoURL || "/placeholder.svg?height=200&width=200"}
                        alt={userData.displayName || "User"}
                      />
                    )}
                    <AvatarFallback>{(userData.displayName || "U").charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2">
                      <label htmlFor="avatar-upload">
                        <Button variant="outline" size="icon" className="rounded-full h-8 w-8 cursor-pointer">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold">{userData.displayName || user.email}</h2>
                <p className="text-sm text-muted-foreground">{userData.level || "Niveau non défini"}</p>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cours suivis</span>
                  <span>{userData.stats?.coursesCompleted || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exercices complétés</span>
                  <span>{userData.stats?.exercisesCompleted || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quiz réussis</span>
                  <span>{userData.stats?.quizzesCompleted || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discussions créées</span>
                  <span>{userData.stats?.discussionsCreated || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Réponses postées</span>
                  <span>{userData?.stats?.responsesCreated || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
