"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { app } from "@/lib/firebase-init"
import { Loader2, BookOpen, FileText, HelpCircle, Video } from "lucide-react"

export default function ProgressionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [progressData, setProgressData] = useState({
    cours: [] as Array<any>,
    exercices: [] as Array<any>,
    quiz: [] as Array<any>,
    videos: [] as Array<any>,
  })
  const [stats, setStats] = useState({
    coursCompleted: 0,
    exercicesCompleted: 0,
    quizScore: 0,
    videosWatched: 0,
  })

  useEffect(() => {
    if (!user) {
      return
    }

    const fetchProgressData = async () => {
      try {
        const db = getFirestore(app)

        // Récupérer les données de progression de l'utilisateur
        const userProgressRef = doc(db, "utilisateurs", user.uid)
        const userProgressDoc = await getDoc(userProgressRef)

        if (userProgressDoc.exists()) {
          const userData = userProgressDoc.data()

          // Récupérer les cours suivis
          const coursQuery = query(collection(db, "progression_cours"), where("userId", "==", user.uid))
          const coursSnapshot = await getDocs(coursQuery)
          const coursData: Array<any> = []
          let coursCompleted = 0

          coursSnapshot.forEach((doc) => {
            const data = doc.data()
            coursData.push({
              id: doc.id,
              ...data,
            })
            if (data.completed) coursCompleted++
          })

          // Récupérer les exercices complétés
          const exercicesQuery = query(collection(db, "progression_exercices"), where("userId", "==", user.uid))
          const exercicesSnapshot = await getDocs(exercicesQuery)
          const exercicesData: Array<any> = []
          let exercicesCompleted = 0

          exercicesSnapshot.forEach((doc) => {
            const data = doc.data()
            exercicesData.push({
              id: doc.id,
              ...data,
            })
            if (data.completed) exercicesCompleted++
          })

          // Récupérer les résultats des quiz
          const quizQuery = query(collection(db, "resultats_quiz"), where("userId", "==", user.uid))
          const quizSnapshot = await getDocs(quizQuery)
          const quizData: Array<any> = []
          let totalScore = 0
          let quizCount = 0

          quizSnapshot.forEach((doc) => {
            const data = doc.data()
            quizData.push({
              id: doc.id,
              ...data,
            })
            totalScore += data.score || 0
            quizCount++
          })

          // Récupérer les vidéos visionnées
          const videosQuery = query(collection(db, "progression_videos"), where("userId", "==", user.uid))
          const videosSnapshot = await getDocs(videosQuery)
          const videosData: Array<any> = []
          let videosWatched = 0

          videosSnapshot.forEach((doc) => {
            const data = doc.data()
            videosData.push({
              id: doc.id,
              ...data,
            })
            if (data.completed) videosWatched++
          })

          setProgressData({
            cours: coursData,
            exercices: exercicesData,
            quiz: quizData,
            videos: videosData,
          })

          setStats({
            coursCompleted,
            exercicesCompleted,
            quizScore: quizCount > 0 ? Math.round(totalScore / quizCount) : 0,
            videosWatched,
          })
        }

        setLoading(false)
      } catch (error) {
        console.error("Erreur lors de la récupération des données de progression:", error)
        setLoading(false)
      }
    }

    fetchProgressData()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement de votre progression...</span>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Suivi de progression</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Cours complétés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coursCompleted}</div>
            <Progress
              value={progressData.cours.length > 0 ? (stats.coursCompleted / progressData.cours.length) * 100 : 0}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Exercices résolus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.exercicesCompleted}</div>
            <Progress
              value={
                progressData.exercices.length > 0 ? (stats.exercicesCompleted / progressData.exercices.length) * 100 : 0
              }
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <HelpCircle className="h-4 w-4 mr-2" />
              Score moyen aux quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.quizScore}%</div>
            <Progress value={stats.quizScore} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Video className="h-4 w-4 mr-2" />
              Vidéos visionnées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.videosWatched}</div>
            <Progress
              value={progressData.videos.length > 0 ? (stats.videosWatched / progressData.videos.length) * 100 : 0}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cours">
        <TabsList className="mb-4">
          <TabsTrigger value="cours">Cours</TabsTrigger>
          <TabsTrigger value="exercices">Exercices</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="videos">Vidéos</TabsTrigger>
        </TabsList>

        <TabsContent value="cours">
          <div className="grid gap-4">
            {progressData.cours.length > 0 ? (
              progressData.cours.map((cours) => (
                <Card key={cours.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{cours.titre}</h3>
                      <p className="text-sm text-muted-foreground">{cours.categorie}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 text-sm">
                        <span className="font-medium">{Math.round(cours.progression || 0)}%</span> complété
                      </div>
                      <Progress value={cours.progression || 0} className="w-24 h-2" />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  Vous n&apos;avez pas encore commencé de cours.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="exercices">
          <div className="grid gap-4">
            {progressData.exercices.length > 0 ? (
              progressData.exercices.map((exercice) => (
                <Card key={exercice.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{exercice.titre}</h3>
                      <p className="text-sm text-muted-foreground">{exercice.difficulte}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 text-sm">
                        {exercice.completed ? (
                          <span className="text-green-600 font-medium">Complété</span>
                        ) : (
                          <span className="text-amber-600 font-medium">En cours</span>
                        )}
                      </div>
                      <Progress value={exercice.completed ? 100 : exercice.progression || 0} className="w-24 h-2" />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  Vous n&apos;avez pas encore résolu d&apos;exercices.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="quiz">
          <div className="grid gap-4">
            {progressData.quiz.length > 0 ? (
              progressData.quiz.map((quiz) => (
                <Card key={quiz.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{quiz.titre}</h3>
                      <p className="text-sm text-muted-foreground">
                        {quiz.questionsRepondues} / {quiz.totalQuestions} questions
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 text-sm">
                        <span className="font-medium">{quiz.score || 0}%</span> score
                      </div>
                      <Progress value={quiz.score || 0} className="w-24 h-2" />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  Vous n&apos;avez pas encore participé à des quiz.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid gap-4">
            {progressData.videos.length > 0 ? (
              progressData.videos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{video.titre}</h3>
                      <p className="text-sm text-muted-foreground">{video.duree}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 text-sm">
                        {video.completed ? (
                          <span className="text-green-600 font-medium">Visionnée</span>
                        ) : (
                          <span className="text-amber-600 font-medium">
                            {Math.round(video.progression || 0)}% visionnée
                          </span>
                        )}
                      </div>
                      <Progress value={video.completed ? 100 : video.progression || 0} className="w-24 h-2" />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  Vous n&apos;avez pas encore visionné de vidéos.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
