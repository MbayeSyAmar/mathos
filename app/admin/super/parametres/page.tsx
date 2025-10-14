"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { 
  Settings, 
  Bell, 
  Shield, 
  Mail, 
  Globe, 
  Database,
  Save,
  Loader2 
} from "lucide-react"
import { toast } from "sonner"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface PlatformSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  supportEmail: string
  notificationsEnabled: boolean
  emailNotifications: boolean
  maintenanceMode: boolean
  registrationOpen: boolean
  maxUploadSize: number
}

export default function ParametresPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<PlatformSettings>({
    siteName: "Mathosphère",
    siteDescription: "Plateforme d'apprentissage des mathématiques",
    contactEmail: "contact@mathosphere.com",
    supportEmail: "support@mathosphere.com",
    notificationsEnabled: true,
    emailNotifications: true,
    maintenanceMode: false,
    registrationOpen: true,
    maxUploadSize: 10,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const settingsRef = doc(db, "platform_settings", "general")
      const settingsDoc = await getDoc(settingsRef)
      
      if (settingsDoc.exists()) {
        setSettings({ ...settings, ...settingsDoc.data() })
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error)
      toast.error("Erreur lors du chargement des paramètres")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      const settingsRef = doc(db, "platform_settings", "general")
      await setDoc(settingsRef, settings, { merge: true })
      toast.success("Paramètres enregistrés avec succès")
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error)
      toast.error("Erreur lors de l'enregistrement des paramètres")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof PlatformSettings, value: any) => {
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
          <p className="text-muted-foreground">Configuration de la plateforme</p>
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

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            Général
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Paramètres de base de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nom du site</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  placeholder="Mathosphère"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleChange("siteDescription", e.target.value)}
                  placeholder="Description de la plateforme"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de contact</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  placeholder="contact@mathosphere.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportEmail">Email de support</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange("supportEmail", e.target.value)}
                  placeholder="support@mathosphere.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Options de la plateforme</CardTitle>
              <CardDescription>Contrôlez l'accès et les fonctionnalités</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Inscriptions ouvertes</Label>
                  <p className="text-sm text-muted-foreground">
                    Autoriser les nouvelles inscriptions
                  </p>
                </div>
                <Switch
                  checked={settings.registrationOpen}
                  onCheckedChange={(checked) => handleChange("registrationOpen", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode maintenance</Label>
                  <p className="text-sm text-muted-foreground">
                    Mettre le site en maintenance
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUploadSize">Taille max des fichiers (Mo)</Label>
                <Input
                  id="maxUploadSize"
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={(e) => handleChange("maxUploadSize", parseInt(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notifications</CardTitle>
              <CardDescription>Gérez les notifications système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications activées</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer les notifications globales
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
                    Envoyer des notifications par email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Types de notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Nouvelles commandes</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Nouvelles inscriptions</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Demandes d'encadrement</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Messages des professeurs</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
              <CardDescription>Configuration de la sécurité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer 2FA pour les admins
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Connexions multiples</Label>
                  <p className="text-sm text-muted-foreground">
                    Autoriser plusieurs sessions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  defaultValue="60"
                  min="15"
                  max="480"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  defaultValue="5"
                  min="3"
                  max="10"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration email</CardTitle>
              <CardDescription>Paramètres du serveur email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">Serveur SMTP</Label>
                <Input
                  id="smtpHost"
                  placeholder="smtp.exemple.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    placeholder="587"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpEncryption">Encryption</Label>
                  <Input
                    id="smtpEncryption"
                    placeholder="TLS"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpUsername">Nom d'utilisateur</Label>
                <Input
                  id="smtpUsername"
                  placeholder="email@exemple.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPassword">Mot de passe</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Tester la configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
