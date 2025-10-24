"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Upload, FileText, Trash2, Download, Eye, Loader2, CheckCircle } from "lucide-react"
import { uploadPDFToServer, deletePDFFromServer } from "@/lib/services/local-storage.service"
import { useAuth } from "@/lib/auth-context"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
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

interface PDFDocument {
  id: string
  fileName: string
  publicPath: string
  uploadedAt: Date
  size: number
  courseId?: number
  exerciseId?: number
  quizId?: number
  type: string
  level: string
  classe: string
}

export default function GestionContenusPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("cours")
  
  // Upload states
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [contentId, setContentId] = useState("")
  const [level, setLevel] = useState("")
  const [classe, setClasse] = useState("")
  const [type, setType] = useState("cours")
  
  // PDFs lists
  const [coursPDFs, setCoursPDFs] = useState<PDFDocument[]>([])
  const [exercicesPDFs, setExercicesPDFs] = useState<PDFDocument[]>([])
  const [quizPDFs, setQuizPDFs] = useState<PDFDocument[]>([])
  const [loading, setLoading] = useState(false)
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pdfToDelete, setPdfToDelete] = useState<PDFDocument | null>(null)

  // Refs pour réinitialiser les inputs
  const coursFileInputRef = useState<HTMLInputElement | null>(null)
  const exerciceFileInputRef = useState<HTMLInputElement | null>(null)
  const quizFileInputRef = useState<HTMLInputElement | null>(null)

  useEffect(() => {
    loadPDFs()
  }, [])

  const loadPDFs = async () => {
    setLoading(true)
    try {
      // Charger tous les PDFs depuis Firestore
      const pdfsRef = collection(db, "pdfs")
      const snapshot = await getDocs(pdfsRef)
      
      const cours: PDFDocument[] = []
      const exercices: PDFDocument[] = []
      const quiz: PDFDocument[] = []
      
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        const pdf: PDFDocument = {
          id: doc.id,
          fileName: data.fileName,
          publicPath: data.publicPath,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          size: data.size,
          type: data.type,
          level: data.level,
          classe: data.classe,
          courseId: data.courseId,
          exerciseId: data.exerciseId,
          quizId: data.quizId,
        }
        
        if (data.type === "cours") cours.push(pdf)
        else if (data.type === "exercice") exercices.push(pdf)
        else if (data.type === "quiz") quiz.push(pdf)
      })
      
      setCoursPDFs(cours.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()))
      setExercicesPDFs(exercices.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()))
      setQuizPDFs(quiz.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()))
    } catch (error) {
      console.error("Error loading PDFs:", error)
      toast.error("Erreur lors du chargement des PDFs")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast.error("Veuillez sélectionner un fichier PDF")
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB max
        toast.error("Le fichier ne doit pas dépasser 10MB")
        return
      }
      setFile(selectedFile)
      toast.success(`Fichier "${selectedFile.name}" sélectionné`)
    }
  }

  const handleUpload = async () => {
    if (!file || !contentId || !level || !classe || !user) {
      toast.error("Veuillez remplir tous les champs et sélectionner un fichier")
      return
    }

    const numericId = parseInt(contentId)
    if (isNaN(numericId)) {
      toast.error("L'ID doit être un nombre")
      return
    }

    setUploading(true)
    try {
      console.log("Starting upload...", { file: file.name, type, level, classe, numericId })
      
      const result = await uploadPDFToServer(
        file,
        type as "cours" | "exercice" | "quiz",
        level as "college" | "lycee",
        classe,
        numericId,
        user.uid
      )
      
      console.log("Upload successful:", result)
      toast.success("PDF uploadé avec succès !")
      
      // Réinitialiser le formulaire
      setFile(null)
      setContentId("")
      setLevel("")
      setClasse("")
      
      // Réinitialiser l'input file
      const fileInput = document.querySelector(`input[type="file"]#${type}-file`) as HTMLInputElement
      if (fileInput) fileInput.value = ""
      
      // Recharger la liste
      await loadPDFs()
    } catch (error: any) {
      console.error("Error uploading PDF:", error)
      const errorMessage = error?.message || "Erreur lors de l'upload du PDF"
      toast.error(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!pdfToDelete) return

    try {
      await deletePDFFromServer(pdfToDelete.id, pdfToDelete.publicPath)
      toast.success("PDF supprimé avec succès")
      await loadPDFs()
    } catch (error: any) {
      console.error("Error deleting PDF:", error)
      toast.error(error.message || "Erreur lors de la suppression")
    } finally {
      setDeleteDialogOpen(false)
      setPdfToDelete(null)
    }
  }

  const openDeleteDialog = (pdf: PDFDocument) => {
    setPdfToDelete(pdf)
    setDeleteDialogOpen(true)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getLevelOptions = () => {
    return ["college", "lycee"]
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "college": return "Collège"
      case "lycee": return "Lycée"
      default: return level
    }
  }

  const getClasseOptions = (selectedLevel: string) => {
    switch (selectedLevel) {
      case "college":
        return ["6ème", "5ème", "4ème", "3ème"]
      case "lycee":
        return ["2nde", "1ère", "Terminale"]
      default:
        return []
    }
  }

  const renderPDFList = (pdfs: PDFDocument[], contentType: string) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    }

    if (pdfs.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun PDF uploadé pour le moment</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {pdfs.map((pdf) => (
          <Card key={pdf.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{pdf.fileName}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">
                      {contentType === "cours" && `Cours #${pdf.courseId}`}
                      {contentType === "exercice" && `Exercice #${pdf.exerciseId}`}
                      {contentType === "quiz" && `Quiz #${pdf.quizId}`}
                    </Badge>
                    <Badge variant="outline">{getLevelLabel(pdf.level)}</Badge>
                    <Badge variant="outline">{pdf.classe}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Taille : {formatFileSize(pdf.size)}</p>
                    <p>Uploadé le : {formatDate(pdf.uploadedAt)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const url = `/cours/${pdf.courseId || pdf.exerciseId || pdf.quizId}`
                      window.open(url, "_blank")
                    }}
                    title="Prévisualiser"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openDeleteDialog(pdf)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestion des Contenus</h1>
        <p className="text-muted-foreground">
          Uploadez des PDFs pour remplacer le contenu enrichi par défaut
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cours">Cours ({coursPDFs.length})</TabsTrigger>
          <TabsTrigger value="exercices">Exercices ({exercicesPDFs.length})</TabsTrigger>
          <TabsTrigger value="quiz">Quiz ({quizPDFs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="cours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Uploader un PDF de cours</CardTitle>
              <CardDescription>
                Le PDF remplacera automatiquement le contenu enrichi par défaut pour ce cours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cours-id">ID du Cours (1-30)</Label>
                  <Input
                    id="cours-id"
                    type="number"
                    placeholder="Ex: 15"
                    value={contentId}
                    onChange={(e) => setContentId(e.target.value)}
                    min="1"
                    max="30"
                  />
                </div>
                <div>
                  <Label htmlFor="cours-level">Niveau</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger id="cours-level">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {getLevelOptions().map((l) => (
                        <SelectItem key={l} value={l}>
                          {getLevelLabel(l)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cours-classe">Classe</Label>
                  <Select value={classe} onValueChange={setClasse} disabled={!level}>
                    <SelectTrigger id="cours-classe">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {getClasseOptions(level).map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="cours-file">Fichier PDF</Label>
                <div className="flex gap-2">
                  <Input
                    id="cours-file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      setType("cours")
                      handleFileChange(e)
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !file || !contentId || !level || !classe}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Upload...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Uploader
                      </>
                    )}
                  </Button>
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Fichier sélectionné : {file.name} ({formatFileSize(file.size)})
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PDFs de cours uploadés</CardTitle>
              <CardDescription>Liste des PDFs remplaçant le contenu par défaut</CardDescription>
            </CardHeader>
            <CardContent>{renderPDFList(coursPDFs, "cours")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Uploader un PDF d'exercices</CardTitle>
              <CardDescription>
                Le PDF remplacera automatiquement le contenu enrichi par défaut pour cet exercice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="exercice-id">ID de l'Exercice (1-21)</Label>
                  <Input
                    id="exercice-id"
                    type="number"
                    placeholder="Ex: 8"
                    value={contentId}
                    onChange={(e) => setContentId(e.target.value)}
                    min="1"
                    max="21"
                  />
                </div>
                <div>
                  <Label htmlFor="exercice-level">Niveau</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger id="exercice-level">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {getLevelOptions().map((l) => (
                        <SelectItem key={l} value={l}>
                          {getLevelLabel(l)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="exercice-classe">Classe</Label>
                  <Select value={classe} onValueChange={setClasse} disabled={!level}>
                    <SelectTrigger id="exercice-classe">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {getClasseOptions(level).map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="exercice-file">Fichier PDF</Label>
                <div className="flex gap-2">
                  <Input
                    id="exercice-file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      setType("exercice")
                      handleFileChange(e)
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !file || !contentId || !level || !classe}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Upload...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Uploader
                      </>
                    )}
                  </Button>
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Fichier sélectionné : {file.name} ({formatFileSize(file.size)})
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PDFs d'exercices uploadés</CardTitle>
              <CardDescription>Liste des PDFs remplaçant le contenu par défaut</CardDescription>
            </CardHeader>
            <CardContent>{renderPDFList(exercicesPDFs, "exercice")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Uploader un PDF de quiz</CardTitle>
              <CardDescription>
                Le PDF remplacera automatiquement le quiz interactif par défaut
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quiz-id">ID du Quiz (1-9)</Label>
                  <Input
                    id="quiz-id"
                    type="number"
                    placeholder="Ex: 3"
                    value={contentId}
                    onChange={(e) => setContentId(e.target.value)}
                    min="1"
                    max="9"
                  />
                </div>
                <div>
                  <Label htmlFor="quiz-level">Niveau</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger id="quiz-level">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {getLevelOptions().map((l) => (
                        <SelectItem key={l} value={l}>
                          {getLevelLabel(l)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quiz-classe">Classe</Label>
                  <Select value={classe} onValueChange={setClasse} disabled={!level}>
                    <SelectTrigger id="quiz-classe">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {getClasseOptions(level).map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="quiz-file">Fichier PDF</Label>
                <div className="flex gap-2">
                  <Input
                    id="quiz-file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      setType("quiz")
                      handleFileChange(e)
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !file || !contentId || !level || !classe}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Upload...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Uploader
                      </>
                    )}
                  </Button>
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Fichier sélectionné : {file.name} ({formatFileSize(file.size)})
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PDFs de quiz uploadés</CardTitle>
              <CardDescription>Liste des PDFs remplaçant le contenu par défaut</CardDescription>
            </CardHeader>
            <CardContent>{renderPDFList(quizPDFs, "quiz")}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce PDF ? Le contenu enrichi par défaut sera
              automatiquement réaffiché à sa place.
              <br />
              <br />
              <strong>Fichier :</strong> {pdfToDelete?.fileName}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
