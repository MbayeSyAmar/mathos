/**
 * Service de messagerie entre élèves et professeurs
 * Basé sur l'encadrement
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

// ============================================================================
// TYPES
// ============================================================================

export interface Conversation {
  id: string
  studentId: string
  studentName: string
  teacherId: string
  teacherName: string
  encadrementId?: string
  lastMessage?: string
  lastMessageAt?: Timestamp
  unreadCountStudent: number
  unreadCountTeacher: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: "student" | "teacher" | "super_admin"
  content: string
  read: boolean
  readAt?: Timestamp
  createdAt: Timestamp
}

// ============================================================================
// CONVERSATIONS
// ============================================================================

export async function createConversation(
  studentId: string,
  studentName: string,
  teacherId: string,
  teacherName: string,
  encadrementId?: string
): Promise<string> {
  try {
    // Vérifier si une conversation existe déjà
    const q = query(
      collection(db, "conversations"),
      where("studentId", "==", studentId),
      where("teacherId", "==", teacherId)
    )
    
    const snapshot = await getDocs(q)
    
    if (!snapshot.empty) {
      return snapshot.docs[0].id
    }
    
    // Créer une nouvelle conversation
    const conversationRef = doc(collection(db, "conversations"))
    const conversationData: Omit<Conversation, "id"> = {
      studentId,
      studentName,
      teacherId,
      teacherName,
      encadrementId,
      unreadCountStudent: 0,
      unreadCountTeacher: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    
    await setDoc(conversationRef, conversationData)
    return conversationRef.id
  } catch (error) {
    console.error("Error creating conversation:", error)
    throw error
  }
}

export async function getConversation(conversationId: string): Promise<Conversation | null> {
  try {
    const docRef = doc(db, "conversations", conversationId)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return null
    }
    
    return { id: docSnap.id, ...docSnap.data() } as Conversation
  } catch (error) {
    console.error("Error getting conversation:", error)
    return null
  }
}

export async function getStudentConversations(studentId: string): Promise<Conversation[]> {
  try {
    const q = query(
      collection(db, "conversations"),
      where("studentId", "==", studentId),
      orderBy("updatedAt", "desc")
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Conversation[]
  } catch (error) {
    console.error("Error getting student conversations:", error)
    return []
  }
}

export async function getTeacherConversations(teacherId: string): Promise<Conversation[]> {
  try {
    const q = query(
      collection(db, "conversations"),
      where("teacherId", "==", teacherId),
      orderBy("updatedAt", "desc")
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Conversation[]
  } catch (error) {
    console.error("Error getting teacher conversations:", error)
    return []
  }
}

export async function getConversationByParticipants(
  studentId: string,
  teacherId: string
): Promise<Conversation | null> {
  try {
    const q = query(
      collection(db, "conversations"),
      where("studentId", "==", studentId),
      where("teacherId", "==", teacherId)
    )
    
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      return null
    }
    
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Conversation
  } catch (error) {
    console.error("Error getting conversation by participants:", error)
    return null
  }
}

/**
 * Récupérer toutes les conversations d'un utilisateur (tous rôles)
 */
export async function getConversationsByUserId(userId: string): Promise<Conversation[]> {
  try {
    // Chercher dans studentId
    const q1 = query(
      collection(db, "conversations"),
      where("studentId", "==", userId),
      orderBy("updatedAt", "desc")
    )
    
    const snapshot1 = await getDocs(q1)
    const conversations1 = snapshot1.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Conversation[]
    
    // Chercher dans teacherId
    const q2 = query(
      collection(db, "conversations"),
      where("teacherId", "==", userId),
      orderBy("updatedAt", "desc")
    )
    
    const snapshot2 = await getDocs(q2)
    const conversations2 = snapshot2.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Conversation[]
    
    // Combiner et dédupliquer
    const allConversations = [...conversations1, ...conversations2]
    const uniqueConversations = Array.from(
      new Map(allConversations.map((conv) => [conv.id, conv])).values()
    )
    
    return uniqueConversations.sort((a, b) => {
      const timeA = a.updatedAt?.toMillis() || 0
      const timeB = b.updatedAt?.toMillis() || 0
      return timeB - timeA
    })
  } catch (error) {
    console.error("Error getting conversations by user id:", error)
    return []
  }
}

// ============================================================================
// MESSAGES
// ============================================================================

export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  senderRole: "student" | "teacher" | "super_admin",
  content: string
): Promise<void> {
  try {
    // Créer le message
    const messageRef = doc(collection(db, "messages"))
    const messageData: Omit<Message, "id"> = {
      conversationId,
      senderId,
      senderName,
      senderRole,
      content,
      read: false,
      createdAt: Timestamp.now(),
    }

    await setDoc(messageRef, messageData)

    // Mettre à jour la conversation
    const conversationRef = doc(db, "conversations", conversationId)
    const conversationSnapshot = await getDoc(conversationRef)
    const conversationData = conversationSnapshot.data() || {}

    const updateData: any = {
      lastMessage: content.length > 100 ? content.substring(0, 100) + "..." : content,
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const isStudentSideSender = senderRole === "student" || senderRole === "super_admin"

    if (isStudentSideSender) {
      const currentUnread = typeof conversationData.unreadCountTeacher === "number" ? conversationData.unreadCountTeacher : 0
      updateData.unreadCountTeacher = currentUnread + 1
    } else {
      const currentUnread = typeof conversationData.unreadCountStudent === "number" ? conversationData.unreadCountStudent : 0
      updateData.unreadCountStudent = currentUnread + 1
    }

    await updateDoc(conversationRef, updateData)
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

export async function getMessages(
  conversationId: string,
  limitCount: number = 50
): Promise<Message[]> {
  try {
    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("createdAt", "asc"),
      limit(limitCount)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[]
  } catch (error) {
    console.error("Error getting messages:", error)
    return []
  }
}

export async function markMessagesAsRead(
  conversationId: string,
  userId: string,
  userRole: "student" | "teacher" | "super_admin"
): Promise<void> {
  try {
    const messagesSnapshot = await getDocs(
      query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId),
        where("read", "==", false)
      )
    )

    const shouldMark = (senderRole: string) => {
      if (userRole === "teacher") {
        return senderRole === "student" || senderRole === "super_admin"
      }
      // Étudiants et super admins lisent les messages des professeurs
      return senderRole === "teacher"
    }

    const updates = messagesSnapshot.docs
      .filter((doc) => {
        const data = doc.data()
        return shouldMark(data.senderRole)
      })
      .map((doc) =>
        updateDoc(doc.ref, {
          read: true,
          readAt: serverTimestamp(),
        })
      )

    await Promise.all(updates)

    // Réinitialiser le compteur de non-lus
    const conversationRef = doc(db, "conversations", conversationId)
    if (userRole === "teacher") {
      await updateDoc(conversationRef, { unreadCountTeacher: 0 })
    } else {
      await updateDoc(conversationRef, { unreadCountStudent: 0 })
    }
  } catch (error) {
    console.error("Error marking messages as read:", error)
    throw error
  }
}

// ============================================================================
// TEMPS RÉEL
// ============================================================================

export function subscribeToMessages(
  conversationId: string,
  callback: (messages: Message[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "messages"),
    where("conversationId", "==", conversationId),
    orderBy("createdAt", "asc"),
    limit(100)
  )
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[]
    callback(messages)
  })
}

export function subscribeToConversations(
  userId: string,
  userRole: "student" | "teacher" | "super_admin",
  callback: (conversations: Conversation[]) => void
): Unsubscribe {
  const field = userRole === "teacher" ? "teacherId" : "studentId"

  const q = query(
    collection(db, "conversations"),
    where(field, "==", userId),
    orderBy("updatedAt", "desc")
  )

  return onSnapshot(q, (snapshot) => {
    const conversations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Conversation[]
    callback(conversations)
  })
}

// ============================================================================
// UTILITAIRES
// ============================================================================

export async function getUnreadMessageCount(
  userId: string,
  userRole: "student" | "teacher" | "super_admin"
): Promise<number> {
  try {
    const isStudentSide = userRole === "student" || userRole === "super_admin"
    const conversations = isStudentSide
      ? await getStudentConversations(userId)
      : await getTeacherConversations(userId)

    return conversations.reduce((total, conv) => {
      return total + (isStudentSide ? conv.unreadCountStudent : conv.unreadCountTeacher)
    }, 0)
  } catch (error) {
    console.error("Error getting unread message count:", error)
    return 0
  }
}
