/**
 * Hook personnalisé pour gérer l'encadrement
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  getEncadrementByUserId,
  getUpcomingSessions,
  getPastSessions,
  getMessagesByEncadrement,
  getProgressionByEncadrement,
  getResourcesByEncadrement,
  sendMessage,
  type Encadrement,
  type Session,
  type Message,
  type Progression,
  type Resource,
} from '@/lib/services/encadrement-service';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TeacherInfo {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  role: string;
  bio?: string;
  speciality?: string;
  rating?: number;
}

export const useEncadrement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [encadrement, setEncadrement] = useState<Encadrement | null>(null);
  const [teacher, setTeacher] = useState<TeacherInfo | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [pastSessions, setPastSessions] = useState<Session[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [progression, setProgression] = useState<Progression[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  const fetchTeacherInfo = async (teacherId: string) => {
    try {
      const teacherDoc = await getDoc(doc(db, 'users', teacherId));
      if (teacherDoc.exists()) {
        const data = teacherDoc.data();
        setTeacher({
          uid: teacherDoc.id,
          displayName: data.displayName || 'Professeur',
          email: data.email || '',
          photoURL: data.photoURL || null,
          role: data.role || 'teacher',
          bio: data.bio,
          speciality: data.speciality,
          rating: data.rating || 4.8,
        });
      }
    } catch (error) {
      console.error('Error fetching teacher info:', error);
    }
  };

  const fetchEncadrementData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer l'encadrement actif
      const encadrementData = await getEncadrementByUserId(user.uid);
      
      if (!encadrementData) {
        setEncadrement(null);
        setLoading(false);
        return;
      }

      setEncadrement(encadrementData);

      // Récupérer les informations du professeur
      await fetchTeacherInfo(encadrementData.teacherId);

      // Récupérer toutes les données en parallèle
      const [
        upcomingSessionsData,
        pastSessionsData,
        messagesData,
        progressionData,
        resourcesData,
      ] = await Promise.all([
        getUpcomingSessions(encadrementData.id),
        getPastSessions(encadrementData.id, 10),
        getMessagesByEncadrement(encadrementData.id, 50),
        getProgressionByEncadrement(encadrementData.id),
        getResourcesByEncadrement(encadrementData.id),
      ]);

      setUpcomingSessions(upcomingSessionsData);
      setPastSessions(pastSessionsData);
      setMessages(messagesData.reverse()); // Inverser pour afficher du plus ancien au plus récent
      setProgression(progressionData);
      setResources(resourcesData);

    } catch (err) {
      console.error('Error fetching encadrement data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncadrementData();
  }, [user]);

  const sendNewMessage = async (content: string) => {
    if (!encadrement || !user) return;

    try {
      await sendMessage({
        encadrementId: encadrement.id,
        senderId: user.uid,
        recipientId: encadrement.teacherId,
        content,
        read: false,
      });

      // Recharger les messages
      const messagesData = await getMessagesByEncadrement(encadrement.id, 50);
      setMessages(messagesData.reverse());
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const refreshData = () => {
    fetchEncadrementData();
  };

  return {
    loading,
    error,
    encadrement,
    teacher,
    upcomingSessions,
    pastSessions,
    messages,
    progression,
    resources,
    sendNewMessage,
    refreshData,
  };
};
