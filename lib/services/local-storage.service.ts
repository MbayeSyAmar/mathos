/**
 * Service de stockage local des PDFs (sans Firebase Storage)
 * Les PDFs sont stockés dans /public/pdfs/ et les métadonnées dans Firestore
 */

import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc,
  orderBy 
} from 'firebase/firestore';

export interface PDFDocument {
  id?: string;
  fileName: string;
  publicPath: string; // Chemin public: /pdfs/...
  type: 'cours' | 'exercice' | 'quiz';
  level: 'college' | 'lycee';
  classe?: string;
  courseId?: number;
  exerciseId?: number;
  quizId?: number;
  uploadedAt: Date;
  uploadedBy: string;
  size?: number;
}

/**
 * Upload un PDF vers le serveur Next.js
 * Le fichier sera stocké dans /public/pdfs/
 */
export const uploadPDFToServer = async (
  file: File,
  type: 'cours' | 'exercice' | 'quiz',
  level: 'college' | 'lycee',
  classe: string,
  contentId: number,
  userId: string
): Promise<PDFDocument> => {
  try {
    console.log('[uploadPDFToServer] Starting upload with params:', {
      fileName: file.name,
      type,
      level,
      classe,
      contentId,
      userId,
      fileSize: file.size,
    });

    // Créer FormData pour l'upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('level', level);
    formData.append('classe', classe);
    formData.append('contentId', contentId.toString());

    // Envoyer le fichier à l'API Next.js
    console.log('[uploadPDFToServer] Uploading to API...');
    const response = await fetch('/api/upload-pdf', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'upload');
    }

    const { publicPath } = await response.json();
    console.log('[uploadPDFToServer] File uploaded to:', publicPath);

    // Créer l'objet avec les bons champs selon le type
    const pdfDoc: Partial<PDFDocument> = {
      fileName: file.name,
      publicPath, // Ex: /pdfs/college/cours/6eme/1234_fichier.pdf
      type,
      level,
      classe,
      uploadedAt: new Date(),
      uploadedBy: userId,
      size: file.size,
    };

    // Ajouter le bon champ ID selon le type
    if (type === 'cours') {
      pdfDoc.courseId = contentId;
    } else if (type === 'exercice') {
      pdfDoc.exerciseId = contentId;
    } else if (type === 'quiz') {
      pdfDoc.quizId = contentId;
    }

    console.log('[uploadPDFToServer] Saving metadata to Firestore...');
    const docRef = await addDoc(collection(db, 'pdfs'), pdfDoc);

    console.log('[uploadPDFToServer] Upload complete! Doc ID:', docRef.id);

    return {
      ...pdfDoc,
      id: docRef.id,
    } as PDFDocument;
  } catch (error: any) {
    console.error('[uploadPDFToServer] Error details:', {
      message: error?.message,
      error
    });

    throw new Error(`Échec de l'upload du PDF: ${error?.message || 'Erreur inconnue'}`);
  }
};

/**
 * Récupère le PDF pour un contenu spécifique
 * Filtre par contentId, type, level et classe pour éviter les conflits d'ID entre niveaux
 */
export const getPDFForContent = async (
  contentId: number,
  type: 'cours' | 'exercice' | 'quiz',
  level?: 'college' | 'lycee',
  classe?: string
): Promise<PDFDocument | null> => {
  try {
    const fieldName = type === 'cours' ? 'courseId' : type === 'exercice' ? 'exerciseId' : 'quizId';
    
    // Construire la requête avec filtres
    let q = query(
      collection(db, 'pdfs'),
      where(fieldName, '==', contentId),
      where('type', '==', type)
    );

    // Ajouter les filtres level et classe si fournis pour éviter les conflits d'ID
    if (level) {
      q = query(q, where('level', '==', level));
    }
    if (classe) {
      q = query(q, where('classe', '==', classe));
    }

    q = query(q, orderBy('uploadedAt', 'desc'));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docData = querySnapshot.docs[0];
    return {
      id: docData.id,
      ...docData.data(),
      uploadedAt: docData.data().uploadedAt?.toDate() || new Date(),
    } as PDFDocument;
  } catch (error) {
    console.error('Erreur lors de la récupération du PDF:', error);
    return null;
  }
};

/**
 * Supprime un PDF
 */
export const deletePDFFromServer = async (pdfId: string, publicPath: string): Promise<void> => {
  try {
    console.log('[deletePDFFromServer] Deleting:', { pdfId, publicPath });

    // Supprimer le fichier via l'API
    const response = await fetch('/api/delete-pdf', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicPath }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la suppression');
    }

    // Supprimer les métadonnées de Firestore
    await deleteDoc(doc(db, 'pdfs', pdfId));

    console.log('[deletePDFFromServer] Delete complete!');
  } catch (error: any) {
    console.error('[deletePDFFromServer] Error:', error);
    throw new Error(`Échec de la suppression du PDF: ${error?.message || 'Erreur inconnue'}`);
  }
};
