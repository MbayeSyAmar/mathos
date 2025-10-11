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
import { Search, Plus, Edit2, Trash2, Loader2, ClipboardList, Users, TrendingUp, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  Quiz,
  QuizQuestion,
  getQuizzesByTeacher,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  LEVELS,
  SUBJECTS,
  STATUSES,
  DIFFICULTIES,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function QuizPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "",
    subject: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
    timeLimit: "30",
    passingScore: "60",
    status: "draft" as "draft" | "published" | "archived",
  })

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    type: "multiple_choice" as "multiple_choice" | "true_false" | "short_answer",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
    points: "1",
  })

  useEffect(() => {
    if (user?.uid) {
      loadQuizzes()
    }
  }, [user])

  const loadQuizzes = async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      const data = await getQuizzesByTeacher(user.uid)
      setQuizzes(data)
    } catch (error) {
      console.error("Error loading quizzes:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les quiz",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz)
    setFormData({
      title: quiz.title,
      description: quiz.description,
      level: quiz.level,
      subject: quiz.subject,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit.toString(),
      passingScore: quiz.passingScore.toString(),
      status: quiz.status,
    })
    setQuestions(quiz.questions)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      level: "",
      subject: "",
      difficulty: "medium",
      timeLimit: "30",
      passingScore: "60",
      status: "draft",
    })
    setQuestions([])
    setCurrentQuestion({
      question: "",
      type: "multiple_choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
      points: "1",
    })
    setEditingQuiz(null)
  }

  const addQuestion = () => {
    if (!currentQuestion.question || !currentQuestion.correctAnswer) {
      toast({
        title: "Question incomplète",
        description: "Veuillez remplir la question et la réponse correcte",
        variant: "destructive",
      })
      return
    }

    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: currentQuestion.question,
      type: currentQuestion.type,
      options: currentQuestion.type === "multiple_choice" ? currentQuestion.options.filter(o => o.trim() !== "") : undefined,
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation,
      points: parseInt(currentQuestion.points),
    }

    setQuestions([...questions, newQuestion])
    setCurrentQuestion({
      question: "",
      type: "multiple_choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
      points: "1",
    })

    toast({
      title: "Question ajoutée",
      description: "La question a été ajoutée au quiz",
    })
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
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

    if (!formData.title || !formData.level || !formData.subject) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    if (questions.length === 0) {
      toast({
        title: "Aucune question",
        description: "Ajoutez au moins une question au quiz",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const quizData = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        subject: formData.subject,
        difficulty: formData.difficulty,
        timeLimit: parseInt(formData.timeLimit),
        passingScore: parseInt(formData.passingScore),
        questions: questions,
        status: formData.status,
      }

      if (editingQuiz) {
        await updateQuiz(editingQuiz.id, quizData)
        toast({
          title: "Quiz mis à jour",
          description: "Le quiz a été modifié avec succès",
        })
      } else {
        await createQuiz(user.uid, user.displayName, quizData)
        toast({
          title: "Quiz créé",
          description: "Le quiz a été créé avec succès",
        })
      }

      setIsDialogOpen(false)
      resetForm()
      loadQuizzes()
    } catch (error) {
      console.error("Error saving quiz:", error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le quiz",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!quizToDelete) return
    try {
      await deleteQuiz(quizToDelete)
      toast({
        title: "Quiz supprimé",
        description: "Le quiz a été supprimé avec succès",
      })
      setQuizToDelete(null)
      setIsDeleteDialogOpen(false)
      loadQuizzes()
    } catch (error) {
      console.error("Error deleting quiz:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le quiz",
        variant: "destructive",
      })
    }
  }

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || quiz.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: quizzes.length,
    published: quizzes.filter((q) => q.status === "published").length,
    draft: quizzes.filter((q) => q.status === "draft").length,
    totalTaken: quizzes.reduce((sum, q) => sum + q.studentsTaken, 0),
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mes Quiz</h2>
          <p className="text-muted-foreground">
            Créez et gérez vos quiz d'évaluation
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau quiz
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publiés</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Tentatives</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTaken}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un quiz..."
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
          <CardTitle>Liste des quiz</CardTitle>
          <CardDescription>
            {filteredQuizzes.length} quiz trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">Aucun quiz trouvé</p>
              <p className="text-sm text-muted-foreground mb-4">
                Créez votre premier quiz
              </p>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
                <Plus className="mr-2 h-4 w-4" />
                Créer un quiz
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Matière</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Tentatives</TableHead>
                  <TableHead>Moy.</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.level}</TableCell>
                    <TableCell>{quiz.subject}</TableCell>
                    <TableCell>{quiz.questions.length}</TableCell>
                    <TableCell>{quiz.timeLimit} min</TableCell>
                    <TableCell>{quiz.studentsTaken}</TableCell>
                    <TableCell>{quiz.averageScore.toFixed(0)}%</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          quiz.status === "published"
                            ? "default"
                            : quiz.status === "draft"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {STATUSES.find((s) => s.value === quiz.status)?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(quiz)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setQuizToDelete(quiz.id)
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuiz ? "Modifier le quiz" : "Créer un nouveau quiz"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations et ajoutez des questions
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Informations</TabsTrigger>
              <TabsTrigger value="questions">
                Questions ({questions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Évaluation sur le théorème de Pythagore"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez le quiz..."
                  rows={2}
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

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulté</Label>
                  <Select value={formData.difficulty} onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map((diff) => (
                        <SelectItem key={diff.value} value={diff.value}>{diff.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Durée (min)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passingScore">Seuil réussite (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                  />
                </div>
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
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              {/* Liste des questions */}
              {questions.length > 0 && (
                <div className="space-y-2 mb-4">
                  <Label>Questions ajoutées</Label>
                  <div className="space-y-2">
                    {questions.map((q, index) => (
                      <div key={q.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">
                            {index + 1}. {q.question}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {q.type === "multiple_choice" ? "QCM" : q.type === "true_false" ? "Vrai/Faux" : "Réponse courte"} - {q.points} pts
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeQuestion(q.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulaire nouvelle question */}
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter une question</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="questionText">Question</Label>
                    <Textarea
                      id="questionText"
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                      placeholder="Écrivez votre question..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="questionType">Type</Label>
                      <Select
                        value={currentQuestion.type}
                        onValueChange={(value: any) => setCurrentQuestion({ ...currentQuestion, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple_choice">QCM</SelectItem>
                          <SelectItem value="true_false">Vrai/Faux</SelectItem>
                          <SelectItem value="short_answer">Réponse courte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="questionPoints">Points</Label>
                      <Input
                        id="questionPoints"
                        type="number"
                        value={currentQuestion.points}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: e.target.value })}
                      />
                    </div>
                  </div>

                  {currentQuestion.type === "multiple_choice" && (
                    <div className="space-y-2">
                      <Label>Options (réponses possibles)</Label>
                      {currentQuestion.options.map((option, index) => (
                        <Input
                          key={index}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options]
                            newOptions[index] = e.target.value
                            setCurrentQuestion({ ...currentQuestion, options: newOptions })
                          }}
                          placeholder={`Option ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer">Réponse correcte</Label>
                    {currentQuestion.type === "multiple_choice" ? (
                      <Select
                        value={currentQuestion.correctAnswer}
                        onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentQuestion.options.map((option, index) => (
                            option.trim() !== "" && (
                              <SelectItem key={index} value={option}>
                                {option}
                              </SelectItem>
                            )
                          ))}
                        </SelectContent>
                      </Select>
                    ) : currentQuestion.type === "true_false" ? (
                      <RadioGroup
                        value={currentQuestion.correctAnswer}
                        onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="true" />
                          <Label htmlFor="true">Vrai</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="false" />
                          <Label htmlFor="false">Faux</Label>
                        </div>
                      </RadioGroup>
                    ) : (
                      <Input
                        id="correctAnswer"
                        value={currentQuestion.correctAnswer}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                        placeholder="Réponse attendue"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="explanation">Explication (optionnel)</Label>
                    <Textarea
                      id="explanation"
                      value={currentQuestion.explanation}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                      placeholder="Expliquez la réponse..."
                      rows={2}
                    />
                  </div>

                  <Button onClick={addQuestion} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter cette question
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm() }}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingQuiz ? "Mettre à jour" : "Créer"}
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
              Cette action est irréversible. Le quiz sera définitivement supprimé.
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
