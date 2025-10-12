"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

export default function TestDemandesPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAllRequests = async () => {
    try {
      setLoading(true)
      const snapshot = await getDocs(collection(db, "encadrement_requests"))
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log("📦 All requests in Firestore:", data)
      setRequests(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllRequests()
  }, [])

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Test Demandes - Debug</CardTitle>
          <p className="text-sm text-muted-foreground">
            User ID actuel: <code className="bg-muted px-2 py-1 rounded">{user?.uid || "Non connecté"}</code>
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchAllRequests} disabled={loading}>
            {loading ? "Chargement..." : "Rafraîchir"}
          </Button>
          
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold">
              Total: {requests.length} demande(s) dans Firestore
            </h3>
            
            {requests.map((req) => (
              <Card key={req.id} className="p-4">
                <div className="space-y-2 text-sm">
                  <div><strong>ID:</strong> {req.id}</div>
                  <div><strong>Student:</strong> {req.studentName} ({req.studentEmail})</div>
                  <div><strong>Teacher ID:</strong> <code className="bg-yellow-100 px-2 py-1">{req.teacherId}</code></div>
                  <div><strong>Teacher Name:</strong> {req.teacherName}</div>
                  <div><strong>Status:</strong> {req.status}</div>
                  <div><strong>Formule:</strong> {req.formule}</div>
                  <div><strong>Created:</strong> {req.createdAt?.toDate?.()?.toLocaleString() || "N/A"}</div>
                  
                  {user?.uid === req.teacherId ? (
                    <div className="text-green-600 font-semibold">✅ Cette demande devrait être visible</div>
                  ) : (
                    <div className="text-red-600">❌ Teacher ID ne correspond pas à votre user ID</div>
                  )}
                </div>
              </Card>
            ))}
            
            {requests.length === 0 && !loading && (
              <p className="text-muted-foreground">Aucune demande trouvée dans la collection encadrement_requests</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
