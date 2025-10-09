/**
 * Service pour gérer les encadrements personnalisés
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
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Encadrement {
  id: string;
  userId: string;
  teacherId: string;
  formule: string;
  status: 'active' | 'paused' | 'cancelled';
  startDate: Timestamp;
  nextBillingDate: Timestamp;
  monthlyAmount: number;
  sessionsPerMonth: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Session {
  id: string;
  encadrementId: string;
  userId: string;
  teacherId: string;
  date: Timestamp;
  duration: number;
  subject: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  resources?: string[];
  meetingUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Message {
  id: string;
  encadrementId: string;
  senderId: string;
  recipientId: string;
  content: string;
  read: boolean;
  createdAt: Timestamp;
}

export interface Progression {
  id: string;
  encadrementId: string;
  userId: string;
  chapter: string;
  progress: number;
  lastUpdated: Timestamp;
  notes?: string;
}

export interface Resource {
  id: string;
  encadrementId: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  uploadedBy: string;
  createdAt: Timestamp;
}

// ==================== ENCADREMENTS ====================

export const getEncadrementByUserId = async (userId: string): Promise<Encadrement | null> => {
  try {
    const q = query(
      collection(db, 'encadrements'),
      where('userId', '==', userId),
      where('status', '==', 'active'),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Encadrement;
  } catch (error) {
    console.error('Error fetching encadrement:', error);
    throw error;
  }
};

export const createEncadrement = async (data: Omit<Encadrement, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'encadrements'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating encadrement:', error);
    throw error;
  }
};

export const updateEncadrement = async (id: string, data: Partial<Encadrement>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'encadrements', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating encadrement:', error);
    throw error;
  }
};

// ==================== SESSIONS ====================

export const getSessionsByEncadrement = async (encadrementId: string): Promise<Session[]> => {
  try {
    const q = query(
      collection(db, 'sessions'),
      where('encadrementId', '==', encadrementId),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

export const getUpcomingSessions = async (encadrementId: string): Promise<Session[]> => {
  try {
    const now = Timestamp.now();
    const q = query(
      collection(db, 'sessions'),
      where('encadrementId', '==', encadrementId),
      where('date', '>=', now),
      where('status', 'in', ['scheduled', 'confirmed']),
      orderBy('date', 'asc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    throw error;
  }
};

export const getPastSessions = async (encadrementId: string, limitCount: number = 10): Promise<Session[]> => {
  try {
    const now = Timestamp.now();
    const q = query(
      collection(db, 'sessions'),
      where('encadrementId', '==', encadrementId),
      where('date', '<', now),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
  } catch (error) {
    console.error('Error fetching past sessions:', error);
    throw error;
  }
};

export const createSession = async (data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'sessions'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const updateSession = async (id: string, data: Partial<Session>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'sessions', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
};

// ==================== MESSAGES ====================

export const getMessagesByEncadrement = async (encadrementId: string, limitCount: number = 50): Promise<Message[]> => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('encadrementId', '==', encadrementId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (data: Omit<Message, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const markMessageAsRead = async (id: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'messages', id), {
      read: true,
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

// ==================== PROGRESSION ====================

export const getProgressionByEncadrement = async (encadrementId: string): Promise<Progression[]> => {
  try {
    const q = query(
      collection(db, 'progression'),
      where('encadrementId', '==', encadrementId),
      orderBy('lastUpdated', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Progression));
  } catch (error) {
    console.error('Error fetching progression:', error);
    throw error;
  }
};

export const updateProgression = async (id: string, progress: number, notes?: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'progression', id), {
      progress,
      notes,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating progression:', error);
    throw error;
  }
};

export const createProgression = async (data: Omit<Progression, 'id' | 'lastUpdated'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'progression'), {
      ...data,
      lastUpdated: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating progression:', error);
    throw error;
  }
};

// ==================== RESOURCES ====================

export const getResourcesByEncadrement = async (encadrementId: string): Promise<Resource[]> => {
  try {
    const q = query(
      collection(db, 'resources'),
      where('encadrementId', '==', encadrementId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

export const createResource = async (data: Omit<Resource, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'resources'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};

export const deleteResource = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'resources', id));
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
};
