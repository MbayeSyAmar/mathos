"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  User, 
  Bell, 
  Lock,
  Save,
  Loader2,
  Upload
} from "lucide-react"
import { toast } from "sonner"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

interface UserSettings {
  displayName: string
  email: string
  phone: string
  bio: string
  speciality: string
  title: string
  notificationsEnabled: boolean
  emailNotifications: boolean
  newRequestNotifications: boolean
  newMessageNotifications: boolean
}

export default function ProfesseurParametresPage() {
  const { user, userData } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    displayName: "",
    email: "",
    phone: "",
    bio: "",
    speciality: "Mathématiques",
    title: "Professeur de mathématiques",
    notificationsEnabled: true,
    emailNotifications: true,
    newRequestNotifications: true,
    newMessageNotifications: true,
  })

  useEffect(() => {
    fetchSettings()
  }, [user])

  const fetchSettings = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const userRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        setSettings({
          displayName: data.displayName || data.name || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          speciality: data.speciality || "Mathématiques",
          title: data.title || "Professeur de mathématiques",
          notificationsEnabled: data.notificationsEnabled !== false,
          emailNotifications: data.emailNotifications !== false,
          newRequestNotifications: data.newRequestNotifications !== false,
          newMessageNotifications: data.newMessageNotifications !== false,
        })
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error)
      toast.error("Erreur lors du chargement des paramètres")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!user) return
    
    try {
      setSaving(true)
      const userRef = doc(db, "users", user.uid)
      await setDoc(userRef, {
        ...settings,
        updatedAt: new Date(),
      }, { merge: true })
      
      toast.success("Paramètres enregistrés avec succès")
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error)
      toast.error("Erreur lors de l'enregistrement des paramètres")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Chargement des paramètres...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos préférences et informations personnelles</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Mettez à jour vos informations de profil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">
                    {settings.displayName.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Changer la photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG ou GIF (max. 2MB)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Nom complet *</Label>
                <Input
                  id="displayName"
                  value={settings.displayName}
                  onChange={(e) => handleChange("displayName", e.target.value)}
                  placeholder="Votre nom complet"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="votre.email@exemple.com"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  L'email ne peut pas être modifié ici
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+221 XX XXX XX XX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Titre/Fonction</Label>
                <Input
                  id="title"
                  value={settings.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Ex: Professeur de mathématiques"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="speciality">Spécialité</Label>
                <Input
                  id="speciality"
                  value={settings.speciality}
                  onChange={(e) => handleChange("speciality", e.target.value)}
                  placeholder="Ex: Algèbre, Analyse, Géométrie"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  value={settings.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Parlez de votre expérience, vos compétences..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notifications</CardTitle>
              <CardDescription>Gérez comment vous souhaitez être notifié</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications activées</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer toutes les notifications
                  </p>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => handleChange("notificationsEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications par email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Types de notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Nouvelles demandes d'encadrement</Label>
                    <Switch
                      checked={settings.newRequestNotifications}
                      onCheckedChange={(checked) => handleChange("newRequestNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Nouveaux messages</Label>
                    <Switch
                      checked={settings.newMessageNotifications}
                      onCheckedChange={(checked) => handleChange("newMessageNotifications", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
              <CardDescription>Gérez la sécurité de votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <p className="text-sm text-muted-foreground">
                  Pour modifier votre mot de passe, utilisez la fonction "Mot de passe oublié" sur la page de connexion.
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Sessions actives</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Session actuelle</p>
                      <p className="text-sm text-muted-foreground">Windows • Chrome</p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Button variant="destructive" className="w-full">
                  Déconnecter de toutes les sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
