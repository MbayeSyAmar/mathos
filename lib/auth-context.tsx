"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./firebase"

type UserData = {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
  role: string
  createdAt: any
  bio?: string
  level?: string
  school?: string
  interests?: string[]
  notifications?: {
    email: boolean
    newCourses: boolean
    newExercises: boolean
    newQuizzes: boolean
    forum: boolean
  }
  stats?: {
    coursesCompleted: number
    exercisesCompleted: number
    quizzesCompleted: number
    discussionsCreated: number
    repliesPosted: number
  }
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  updateUserData: (data: Partial<UserData>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // Update last login timestamp
      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          lastLogin: serverTimestamp(),
        },
        { merge: true },
      )

      return userCredential.user
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile
      await updateProfile(userCredential.user, {
        displayName: name,
      })

      // Create user document
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName: name,
        email: email,
        photoURL: null,
        role: "student",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
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
        stats: {
          coursesCompleted: 0,
          exercisesCompleted: 0,
          quizzesCompleted: 0,
          discussionsCreated: 0,
          repliesPosted: 0,
        },
      })

      return userCredential.user
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return

    try {
      await setDoc(doc(db, "users", user.uid), data, { merge: true })

      // Update local state
      if (userData) {
        setUserData({ ...userData, ...data })
      }

      // Update profile if needed
      if (data.displayName || data.photoURL) {
        await updateProfile(user, {
          displayName: data.displayName || user.displayName,
          photoURL: data.photoURL || user.photoURL,
        })
      }
    } catch (error) {
      console.error("Error updating user data:", error)
      throw error
    }
  }

  const value = {
    user,
    userData,
    loading,
    login,
    register,
    logout,
    updateUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
