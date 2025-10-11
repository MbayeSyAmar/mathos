"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit2, Trash2, Loader2, Video, Eye, ThumbsUp, Clock, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  Video as VideoType,
  VideoChapter,
  getVideosByTeacher,
  createVideo,
  updateVideo,
  deleteVideo,
  LEVELS,
  SUBJECTS,
  STATUSES,
} from "@/lib/services/content-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function VideosPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [videos, setVideos] = useState<VideoType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null)
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "",
    subject: "",
    duration: "",
    url: "",
    thumbnail: "",
    transcript: "",
    status: "draft" as "draft" | "published" | "archived",
  })

  const [chapters, setChapters] = useState<VideoChapter[]>([])
  const [currentChapter, setCurrentChapter] = useState({
    timestamp: "",
    title: "",
    description: "",
  })

  useEffect(() => {
    if (user?.uid) {
      loadVideos()
    }
  }, [user])

  const loadVideos = async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      const data = await getVideosByTeacher(user.uid)
      setVideos(data)
    } catch (error) {
      console.error("Error loading videos:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les vidéos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (video: VideoType) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      description: video.description,
      level: video.level,
      subject: video.subject,
      duration: video.duration.toString(),
      url: video.url,
      thumbnail: video.thumbnail || "",
      transcript: video.transcript || "",
      status: video.status,
    })
    setChapters(video.chapters)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      level: "",
      subject: "",
      duration: "",
      url: "",
      thumbnail: "",
      transcript: "",
      status: "draft",
    })
    setChapters([])
    setCurrentChapter({
      timestamp: "",
      title: "",
      description: "",
    })
    setEditingVideo(null)
  }

  const addChapter = () => {
    if (!currentChapter.title || !currentChapter.timestamp) {
      toast({
        title: "Chapitre incomplet",
        description: "Veuillez remplir le titre et le timestamp",
        variant: "destructive",
      })
      return
    }

    const newChapter: VideoChapter = {
      timestamp: parseInt(currentChapter.timestamp),
      title: currentChapter.title,
      description: currentChapter.description,
    }

    setChapters([...chapters, newChapter].sort((a, b) => a.timestamp - b.timestamp))
    setCurrentChapter({
      timestamp: "",
      title: "",
      description: "",
    })

    toast({
      title: "Chapitre ajouté",
      description: "Le chapitre a été ajouté à la vidéo",
    })
  }

  const removeChapter = (timestamp: number) => {
    setChapters(chapters.filter(c => c.timestamp !== timestamp))
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = async () => {
    if (!user?.uid || !user?.displayName) {
      toast({
        title: "Erreur",
        description: "Utilisateur non connecté",
        variant: "destructive",
      })
      return
    }

    if (!formData.title || !formData.level || !formData.subject || !formData.url || !formData.duration) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const videoData = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        subject: formData.subject,
        duration: parseInt(formData.duration),
        url: formData.url,
        thumbnail: formData.thumbnail,
        transcript: formData.transcript,
        chapters: chapters,
        status: formData.status,
      }

      if (editingVideo) {
        await updateVideo(editingVideo.id, videoData)
        toast({
          title: "Vidéo mise à jour",
          description: "La vidéo a été modifiée avec succès",
        })
      } else {
        await createVideo(user.uid, user.displayName, videoData)
        toast({
          title: "Vidéo créée",
          description: "La vidéo a été créée avec succès",
        })
      }

      setIsDialogOpen(false)
      resetForm()
      loadVideos()
    } catch (error) {
      console.error("Error saving video:", error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la vidéo",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!videoToDelete) return
    try {
      await deleteVideo(videoToDelete)
      toast({
        title: "Vidéo supprimée",
        description: "La vidéo a été supprimée avec succès",
      })
      setVideoToDelete(null)
      setIsDeleteDialogOpen(false)
      loadVideos()
    } catch (error) {
      console.error("Error deleting video:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la vidéo",
        variant: "destructive",
      })
    }
  }

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || video.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: videos.length,
    published: videos.filter((v) => v.status === "published").length,
    draft: videos.filter((v) => v.status === "draft").length,
    totalViews: videos.reduce((sum, v) => sum + v.views, 0),
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mes Vidéos</h2>
          <p className="text-muted-foreground">
            Gérez vos vidéos pédagogiques
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle vidéo
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publiées</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brouillons</CardTitle>
            <Edit2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une vidéo..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des vidéos</CardTitle>
          <CardDescription>
            {filteredVideos.length} vidéo(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Video className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">Aucune vidéo trouvée</p>
              <p className="text-sm text-muted-foreground mb-4">
                Ajoutez votre première vidéo
              </p>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une vidéo
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Matière</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Vues</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVideos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">{video.title}</TableCell>
                    <TableCell>{video.level}</TableCell>
                    <TableCell>{video.subject}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {video.duration} min
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        {video.views}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3 text-muted-foreground" />
                        {video.likes}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          video.status === "published"
                            ? "default"
                            : video.status === "draft"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {STATUSES.find((s) => s.value === video.status)?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(video)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setVideoToDelete(video.id)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVideo ? "Modifier la vidéo" : "Ajouter une nouvelle vidéo"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations de la vidéo
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="chapters">
                Chapitres ({chapters.length})
              </TabsTrigger>
              <TabsTrigger value="transcript">Transcription</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Le théorème de Pythagore expliqué"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez la vidéo..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Niveau *</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Matière *</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL de la vidéo *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground">
                  YouTube, Vimeo ou lien direct
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">URL de la miniature</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="15"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chapters" className="space-y-4">
              {/* Liste des chapitres */}
              {chapters.length > 0 && (
                <div className="space-y-2 mb-4">
                  <Label>Chapitres ajoutés</Label>
                  <div className="space-y-2">
                    {chapters.map((chapter) => (
                      <div key={chapter.timestamp} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">
                            {formatTime(chapter.timestamp)} - {chapter.title}
                          </p>
                          {chapter.description && (
                            <p className="text-sm text-muted-foreground">{chapter.description}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeChapter(chapter.timestamp)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulaire nouveau chapitre */}
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter un chapitre</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="chapterTimestamp">Timestamp (secondes)</Label>
                    <Input
                      id="chapterTimestamp"
                      type="number"
                      value={currentChapter.timestamp}
                      onChange={(e) => setCurrentChapter({ ...currentChapter, timestamp: e.target.value })}
                      placeholder="120"
                    />
                    <p className="text-xs text-muted-foreground">
                      Ex: 120 pour 2:00
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chapterTitle">Titre du chapitre</Label>
                    <Input
                      id="chapterTitle"
                      value={currentChapter.title}
                      onChange={(e) => setCurrentChapter({ ...currentChapter, title: e.target.value })}
                      placeholder="Introduction"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chapterDescription">Description (optionnel)</Label>
                    <Textarea
                      id="chapterDescription"
                      value={currentChapter.description}
                      onChange={(e) => setCurrentChapter({ ...currentChapter, description: e.target.value })}
                      placeholder="Description du chapitre..."
                      rows={2}
                    />
                  </div>

                  <Button onClick={addChapter} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter ce chapitre
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transcript" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transcript">Transcription de la vidéo</Label>
                <Textarea
                  id="transcript"
                  value={formData.transcript}
                  onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
                  placeholder="Transcrivez le contenu de la vidéo..."
                  rows={15}
                />
                <p className="text-xs text-muted-foreground">
                  La transcription aide à l'accessibilité et au référencement
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm() }}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingVideo ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La vidéo sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
