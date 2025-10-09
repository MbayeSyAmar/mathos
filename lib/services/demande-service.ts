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
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface DemandeEncadrement {
  id: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  level: string; // "Collège", "Lycée", "Supérieur"
  subject: string; // "Mathématiques", "Physique", etc.
  formule: string; // "Standard", "Intensive", "Premium"
  objectifs: string;
  disponibilites: string;
  status: 'pending' | 'approved' | 'rejected' | 'contacted';
  teacherId?: string; // Assigné après approbation
  adminNotes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  processedBy?: string; // UID de l'admin qui a traité
  processedAt?: Timestamp;
}

// ==================== CRÉER UNE DEMANDE ====================

export const createDemandeEncadrement = async (
  data: Omit<DemandeEncadrement, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'demandes_encadrement'), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating demande:', error);
    throw error;
  }
};

// ==================== RÉCUPÉRER LES DEMANDES ====================

export const getDemandesByStatus = async (
  status?: 'pending' | 'approved' | 'rejected' | 'contacted'
): Promise<DemandeEncadrement[]> => {
  try {
    let q;
    
    if (status) {
      q = query(
        collection(db, 'demandes_encadrement'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'demandes_encadrement'),
        orderBy('createdAt', 'desc')
      );
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DemandeEncadrement));
  } catch (error) {
    console.error('Error fetching demandes:', error);
    throw error;
  }
};

export const getPendingDemandes = async (): Promise<DemandeEncadrement[]> => {
  return getDemandesByStatus('pending');
};

export const getDemandeById = async (id: string): Promise<DemandeEncadrement | null> => {
  try {
    const docRef = doc(db, 'demandes_encadrement', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return { id: docSnap.id, ...docSnap.data() } as DemandeEncadrement;
  } catch (error) {
    console.error('Error fetching demande:', error);
    throw error;
  }
};

export const getDemandesByUserId = async (userId: string): Promise<DemandeEncadrement[]> => {
  try {
    const q = query(
      collection(db, 'demandes_encadrement'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DemandeEncadrement));
  } catch (error) {
    console.error('Error fetching user demandes:', error);
    throw error;
  }
};

// ==================== METTRE À JOUR UNE DEMANDE ====================

export const updateDemandeStatus = async (
  id: string,
  status: 'approved' | 'rejected' | 'contacted',
  adminId: string,
  adminNotes?: string,
  teacherId?: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'demandes_encadrement', id), {
      status,
      adminNotes,
      teacherId,
      processedBy: adminId,
      processedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating demande:', error);
    throw error;
  }
};

export const assignTeacher = async (
  demandeId: string,
  teacherId: string,
  adminId: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'demandes_encadrement', demandeId), {
      teacherId,
      status: 'approved',
      processedBy: adminId,
      processedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error assigning teacher:', error);
    throw error;
  }
};

// ==================== STATISTIQUES ====================

export const getDemandesStats = async (): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  contacted: number;
}> => {
  try {
    const allDemandes = await getDocs(collection(db, 'demandes_encadrement'));
    
    const stats = {
      total: allDemandes.size,
      pending: 0,
      approved: 0,
      rejected: 0,
      contacted: 0,
    };
    
    allDemandes.forEach(doc => {
      const data = doc.data() as DemandeEncadrement;
      stats[data.status]++;
    });
    
    return stats;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};
