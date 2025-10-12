/**
 * Service de gestion des accès étudiants au contenu des professeurs
 * Permet de gérer les relations étudiant-professeur et les accès au contenu
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface StudentAccess {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  teacherId: string
  teacherName: string
  formule: string // "Cours particuliers", "Groupe", etc.
  subject: string
  grantedAt: Timestamp
  expiresAt?: Timestamp // Optionnel : pour limiter l'accès dans le temps
  status: "active" | "expired" | "revoked"
  encadrementRequestId: string // Référence à la demande d'origine
}

/**
 * Créer un accès pour un étudiant au contenu d'un professeur
 */
export async function grantStudentAccess(
  studentId: string,
  studentName: string,
  studentEmail: string,
  teacherId: string,
  teacherName: string,
  formule: string,
  subject: string,
  encadrementRequestId: string
): Promise<string> {
  try {
    const accessRef = doc(collection(db, "student_access"))
    const access: Omit<StudentAccess, "id"> = {
      studentId,
      studentName,
      studentEmail,
      teacherId,
      teacherName,
      formule,
      subject,
      status: "active",
      grantedAt: serverTimestamp() as Timestamp,
      encadrementRequestId,
    }
    
    await setDoc(accessRef, access)
    console.log("✅ Student access granted:", accessRef.id)
    return accessRef.id
  } catch (error) {
    console.error("Error granting student access:", error)
    throw error
  }
}

/**
 * Obtenir tous les accès d'un étudiant
 */
export async function getStudentAccesses(studentId: string): Promise<StudentAccess[]> {
  try {
    const q = query(
      collection(db, "student_access"),
      where("studentId", "==", studentId),
      where("status", "==", "active")
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as StudentAccess))
  } catch (error) {
    console.error("Error fetching student accesses:", error)
    return []
  }
}

/**
 * Obtenir tous les étudiants ayant accès au contenu d'un professeur
 */
export async function getTeacherStudents(teacherId: string): Promise<StudentAccess[]> {
  try {
    const q = query(
      collection(db, "student_access"),
      where("teacherId", "==", teacherId),
      where("status", "==", "active")
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as StudentAccess))
  } catch (error) {
    console.error("Error fetching teacher students:", error)
    return []
  }
}

/**
 * Vérifier si un étudiant a accès au contenu d'un professeur
 */
export async function hasAccessToTeacher(
  studentId: string,
  teacherId: string
): Promise<boolean> {
  try {
    const q = query(
      collection(db, "student_access"),
      where("studentId", "==", studentId),
      where("teacherId", "==", teacherId),
      where("status", "==", "active")
    )
    
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch (error) {
    console.error("Error checking access:", error)
    return false
  }
}

/**
 * Révoquer l'accès d'un étudiant
 */
export async function revokeStudentAccess(accessId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "student_access", accessId))
    console.log("✅ Student access revoked:", accessId)
  } catch (error) {
    console.error("Error revoking student access:", error)
    throw error
  }
}

/**
 * Obtenir les IDs de tous les professeurs auxquels un étudiant a accès
 */
export async function getStudentTeacherIds(studentId: string): Promise<string[]> {
  try {
    const accesses = await getStudentAccesses(studentId)
    return accesses.map(access => access.teacherId)
  } catch (error) {
    console.error("Error fetching student teacher IDs:", error)
    return []
  }
}
