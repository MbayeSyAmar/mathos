"use client"

import { useAuth } from "@/lib/auth-context"

export default function MonProfilPage() {
  const { user, userData, loading } = useAuth()

  if (loading) return <p>Chargement...</p>
  if (!user) return <p>Vous devez être connecté</p>

  return (
    <div>
      <h1>Profil de {userData?.displayName}</h1>
      <p>Email : {userData?.email}</p>
      <p>Rôle : {userData?.role}</p>
    </div>
  )
}
