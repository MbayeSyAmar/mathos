import { storage, db } from '@/lib/firebase';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll 
} from 'firebase/storage';
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
  url?: string;
  storagePath: string;
  type: 'cours' | 'exercice' | 'quiz';
  level: 'college' | 'lycee';
  classe?: string;
  courseId?: number;
  exerciseId?: number;
  quizId?: number;
  subject?: string;
  uploadedAt: Date;
  uploadedBy: string;
  size?: number;
}

/**
 * Upload un PDF vers Firebase Storage
 */
export const uploadPDF = async (
  file: File,
  type: 'cours' | 'exercice' | 'quiz',
  level: 'college' | 'lycee',
  classe: string,
  contentId: number,
  userId: string,
  subject?: string
): Promise<PDFDocument> => {
  try {
    console.log('[uploadPDF] Starting upload with params:', {
      fileName: file.name,
      type,
      level,
      classe,
      contentId,
      userId,
      fileSize: file.size,
    });

    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storagePath = `pdfs/${level}/${type}/${classe}/${fileName}`;
    
    console.log('[uploadPDF] Storage path:', storagePath);
    
    const storageRef = ref(storage, storagePath);
    
    console.log('[uploadPDF] Uploading to Firebase Storage...');
    const snapshot = await uploadBytes(storageRef, file);
    
    console.log('[uploadPDF] Getting download URL...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('[uploadPDF] Download URL:', downloadURL);
    
    // Créer l'objet avec les bons champs selon le type
    const pdfDoc: Partial<PDFDocument> = {
      fileName: file.name,
      url: downloadURL,
      storagePath,
      type,
      level,
      classe,
      subject: subject || '',
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
    
    console.log('[uploadPDF] Saving to Firestore...', pdfDoc);
    const docRef = await addDoc(collection(db, 'pdfs'), pdfDoc);
    
    console.log('[uploadPDF] Upload complete! Doc ID:', docRef.id);
    
    return {
      ...pdfDoc,
      id: docRef.id,
    } as PDFDocument;
  } catch (error: any) {
    console.error('[uploadPDF] Error details:', {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      stack: error?.stack,
      error
    });
    
    // Retourner l'erreur Firebase originale avec plus de détails
    if (error?.code) {
      throw error; // Retourner l'erreur Firebase directement
    }
    
    throw new Error(`Échec de l'upload du PDF: ${error?.message || 'Erreur inconnue'}`);
  }
};

/**
 * Récupère le PDF pour un cours spécifique
 */
export const getPDFForCourse = async (
  courseId: number,
  type: 'cours' | 'exercice' | 'quiz'
): Promise<PDFDocument | null> => {
  try {
    const q = query(
      collection(db, 'pdfs'),
      where('courseId', '==', courseId),
      where('type', '==', type),
      orderBy('uploadedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate() || new Date(),
    } as PDFDocument;
  } catch (error) {
    console.error('Erreur lors de la récupération du PDF:', error);
    return null;
  }
};

/**
 * Supprime un PDF
 */
export const deletePDF = async (pdfId: string, storagePath: string): Promise<void> => {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    await deleteDoc(doc(db, 'pdfs', pdfId));
  } catch (error) {
    console.error('Erreur lors de la suppression du PDF:', error);
    throw new Error('Échec de la suppression du PDF');
  }
};
