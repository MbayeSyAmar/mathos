/**
 * Service pour gérer les demandes d'encadrement
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { grantStudentAccess } from './student-access-service';

export interface EncadrementRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentClass: string;
  studentLevel: string;
  studentSchool: string;
  teacherId: string;
  teacherName: string;
  formule: string;
  subject: string;
  objectives: string;
  availability: string[];
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  message: string;
  adminNotes?: string;
  rejectionReason?: string;
  processedBy?: string;
  processedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ==================== CRÉER UNE DEMANDE ====================

export const createEncadrementRequest = async (
  data: Omit<EncadrementRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'encadrement_requests'), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating encadrement request:', error);
    throw error;
  }
};

// ==================== RÉCUPÉRER LES DEMANDES ====================

// Demandes d'un étudiant
export const getStudentRequests = async (studentId: string): Promise<EncadrementRequest[]> => {
  try {
    const q = query(
      collection(db, 'encadrement_requests'),
      where('studentId', '==', studentId)
    );
    
    const snapshot = await getDocs(q);
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EncadrementRequest));
    
    // Tri manuel par date décroissante
    requests.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
    
    return requests;
  } catch (error) {
    console.error('Error fetching student requests:', error);
    throw error;
  }
};

// Demandes pour un professeur
export const getTeacherRequests = async (teacherId: string): Promise<EncadrementRequest[]> => {
  try {
    console.log('🔍 getTeacherRequests called with teacherId:', teacherId);
    
    const q = query(
      collection(db, 'encadrement_requests'),
      where('teacherId', '==', teacherId)
    );
    
    const snapshot = await getDocs(q);
    console.log('📦 Found', snapshot.size, 'documents');
    
    // Trier manuellement par date au lieu d'utiliser orderBy (évite le besoin d'index composite)
    const requests = snapshot.docs.map(doc => {
      console.log('📄 Document:', doc.id, doc.data());
      return { id: doc.id, ...doc.data() } as EncadrementRequest;
    });
    
    // Tri manuel par date décroissante
    requests.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
    
    console.log('✅ Returning', requests.length, 'sorted requests');
    return requests;
  } catch (error) {
    console.error('❌ Error fetching teacher requests:', error);
    throw error;
  }
};

// Toutes les demandes (pour super admin)
export const getAllRequests = async (): Promise<EncadrementRequest[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'encadrement_requests'));
    
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EncadrementRequest));
    
    // Tri manuel par date décroissante
    requests.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
    
    return requests;
  } catch (error) {
    console.error('Error fetching all requests:', error);
    throw error;
  }
};;

// Demandes en attente pour un professeur
export const getPendingTeacherRequests = async (teacherId: string): Promise<EncadrementRequest[]> => {
  try {
    const q = query(
      collection(db, 'encadrement_requests'),
      where('teacherId', '==', teacherId),
      where('status', '==', 'pending')
    );
    
    const snapshot = await getDocs(q);
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EncadrementRequest));
    
    // Tri manuel par date décroissante
    requests.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
    
    return requests;
  } catch (error) {
    console.error('Error fetching pending teacher requests:', error);
    throw error;
  }
};

// Toutes les demandes en attente (pour super admin)
export const getAllPendingRequests = async (): Promise<EncadrementRequest[]> => {
  try {
    const q = query(
      collection(db, 'encadrement_requests'),
      where('status', '==', 'pending')
    );
    
    const snapshot = await getDocs(q);
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EncadrementRequest));
    
    // Tri manuel par date décroissante
    requests.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
    
    return requests;
  } catch (error) {
    console.error('Error fetching all pending requests:', error);
    throw error;
  }
};

// ==================== METTRE À JOUR UNE DEMANDE ====================

// Approuver une demande
export const approveRequest = async (
  requestId: string,
  processedBy: string,
  adminNotes?: string
): Promise<void> => {
  try {
    // Récupérer d'abord les détails de la demande
    const requestDoc = await getDocs(
      query(collection(db, 'encadrement_requests'), where('__name__', '==', requestId))
    );
    
    if (requestDoc.empty) {
      throw new Error('Request not found');
    }
    
    const requestData = { id: requestDoc.docs[0].id, ...requestDoc.docs[0].data() } as EncadrementRequest;
    
    // Mettre à jour le statut de la demande
    const updateData: any = {
      status: 'approved',
      processedBy,
      processedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    // N'inclure adminNotes que s'il est défini
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    
    await updateDoc(doc(db, 'encadrement_requests', requestId), updateData);
    
    // Créer automatiquement l'accès pour l'étudiant au contenu du professeur
    await grantStudentAccess(
      requestData.studentId,
      requestData.studentName,
      requestData.studentEmail,
      requestData.teacherId,
      requestData.teacherName,
      requestData.formule,
      requestData.subject,
      requestId
    );
    
    // Créer l'encadrement actif pour l'étudiant
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    // Déterminer le nombre de sessions et le montant selon la formule
    let sessionsPerMonth = 4;
    let monthlyAmount = 20000;
    
    if (requestData.formule.toLowerCase().includes('intensive')) {
      sessionsPerMonth = 8;
      monthlyAmount = 35000;
    } else if (requestData.formule.toLowerCase().includes('premium')) {
      sessionsPerMonth = 12;
      monthlyAmount = 50000;
    }
    
    await addDoc(collection(db, 'encadrements'), {
      userId: requestData.studentId,
      teacherId: requestData.teacherId,
      formule: requestData.formule,
      status: 'active',
      startDate: Timestamp.fromDate(now),
      nextBillingDate: Timestamp.fromDate(nextMonth),
      monthlyAmount: monthlyAmount,
      sessionsPerMonth: sessionsPerMonth,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    console.log('✅ Request approved, student access granted, and encadrement created');
  } catch (error) {
    console.error('Error approving request:', error);
    throw error;
  }
};

// Rejeter une demande
export const rejectRequest = async (
  requestId: string,
  processedBy: string,
  rejectionReason: string,
  adminNotes?: string
): Promise<void> => {
  try {
    const updateData: any = {
      status: 'rejected',
      processedBy,
      processedAt: serverTimestamp(),
      rejectionReason,
      updatedAt: serverTimestamp(),
    };
    
    // N'inclure adminNotes que s'il est défini
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    
    await updateDoc(doc(db, 'encadrement_requests', requestId), updateData);
  } catch (error) {
    console.error('Error rejecting request:', error);
    throw error;
  }
};

// Annuler une demande (par l'étudiant)
export const cancelRequest = async (requestId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'encadrement_requests', requestId), {
      status: 'cancelled',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error cancelling request:', error);
    throw error;
  }
};

// Mettre à jour les notes admin
export const updateRequestNotes = async (
  requestId: string,
  adminNotes: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'encadrement_requests', requestId), {
      adminNotes,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating request notes:', error);
    throw error;
  }
};

// Réassigner à un autre professeur
export const reassignRequest = async (
  requestId: string,
  newTeacherId: string,
  newTeacherName: string,
  processedBy: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'encadrement_requests', requestId), {
      teacherId: newTeacherId,
      teacherName: newTeacherName,
      processedBy,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error reassigning request:', error);
    throw error;
  }
};

// ==================== SUPPRIMER UNE DEMANDE ====================

export const deleteRequest = async (requestId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'encadrement_requests', requestId));
  } catch (error) {
    console.error('Error deleting request:', error);
    throw error;
  }
};

// ==================== STATISTIQUES ====================

export const getRequestsStats = async (): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
}> => {
  try {
    const snapshot = await getDocs(collection(db, 'encadrement_requests'));
    const requests = snapshot.docs.map(doc => doc.data() as EncadrementRequest);
    
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      cancelled: requests.filter(r => r.status === 'cancelled').length,
    };
  } catch (error) {
    console.error('Error fetching requests stats:', error);
    throw error;
  }
};
