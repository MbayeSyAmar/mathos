// ============================================
// MATHOSPHÈRE - FIREBASE CONFIGURATION
// ============================================

// Configuration Firebase
// Charge la config depuis firebase-config.js si disponible, sinon utilise les valeurs par défaut
let firebaseConfig = window.firebaseConfig || {
  apiKey: "AIzaSyDummyKeyReplaceWithYourOwn",
  authDomain: "mathosphere-demo.firebaseapp.com",
  projectId: "mathosphere-demo",
  storageBucket: "mathosphere-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop",
  measurementId: "G-XXXXXXXXXX"
};

// Vérifier si la configuration Firebase est valide
function isFirebaseConfigValid(config) {
  return config && 
         config.apiKey && 
         config.apiKey !== "VOTRE_API_KEY" && 
         config.apiKey !== "AIzaSyDummyKeyReplaceWithYourOwn" &&
         config.projectId && 
         config.projectId !== "votre-projet-id" &&
         config.authDomain && 
         config.authDomain !== "votre-projet.firebaseapp.com";
}

// Initialiser Firebase (si disponible)
let firebaseApp = null;
let auth = null;
let db = null;
let storage = null;

// Vérifier si Firebase est disponible et configuré correctement
const isFirebaseAvailable = typeof firebase !== 'undefined';
const isConfigValid = isFirebaseConfigValid(firebaseConfig);

if (isFirebaseAvailable && isConfigValid) {
  try {
    // Vérifier si Firebase n'est pas déjà initialisé
    if (!firebase.apps || firebase.apps.length === 0) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
    } else {
      firebaseApp = firebase.app();
    }
    
    auth = firebase.auth();
    db = firebase.firestore();
    
    // Initialiser Storage seulement si disponible
    if (typeof firebase.storage === 'function') {
      storage = firebase.storage();
    } else {
      console.warn('⚠️ Firebase Storage non disponible');
    }
    
    // Configurer la persistance de l'authentification
    if (auth) {
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(err => {
        console.warn('Erreur lors de la configuration de la persistance:', err);
      });
    }
    
    console.log('✅ Firebase initialisé avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de Firebase:', error);
    console.warn('Mode simulation activé');
    auth = null;
    db = null;
    storage = null;
  }
} else {
  if (!isFirebaseAvailable) {
    console.warn('⚠️ Firebase SDK non chargé. Utilisation du mode simulation.');
  } else if (!isConfigValid) {
    console.warn('⚠️ Configuration Firebase invalide ou non configurée. Utilisation du mode simulation.');
    console.info('💡 Pour activer Firebase, configurez firebase-config.js avec vos clés Firebase.');
  }
  auth = null;
  db = null;
  storage = null;
}

// ============================================
// AUTHENTIFICATION
// ============================================

const AuthService = {
  // Connexion avec email/password
  async login(email, password) {
    // Vérifier si Firebase est disponible et configuré
    if (!auth || !isFirebaseConfigValid(firebaseConfig)) {
      // Mode simulation - toujours autoriser les identifiants de démo
      if (email === 'demo@mathosphere.fr' && password === 'mathosphere123') {
        return new Promise((resolve) => {
          setTimeout(() => {
            const userInfo = {
              uid: 'demo_' + Date.now(),
              email: email,
              displayName: email.split('@')[0],
              photoURL: null,
              role: 'student',
              emailVerified: true
            };
            localStorage.setItem('mathosUser', JSON.stringify(userInfo));
            resolve(userInfo);
          }, 500);
        });
      } else {
        throw new Error('Firebase n\'est pas configuré. Utilisez les identifiants de démo : demo@mathosphere.fr / mathosphere123');
      }
    }
    
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Récupérer les données utilisateur depuis Firestore
      let userData = null;
      if (db) {
        try {
          const userDoc = await db.collection('users').doc(user.uid).get();
          userData = userDoc.exists ? userDoc.data() : null;
        } catch (dbError) {
          console.warn('Impossible de récupérer les données Firestore:', dbError);
        }
      }
      
      const userInfo = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || userData?.displayName || email.split('@')[0],
        photoURL: user.photoURL || userData?.photoURL || null,
        role: userData?.role || 'student',
        emailVerified: user.emailVerified
      };
      
      // Sauvegarder dans localStorage
      localStorage.setItem('mathosUser', JSON.stringify(userInfo));
      
      return userInfo;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      // Traduire les erreurs Firebase en français
      const errorMessage = this.translateFirebaseError(error.code) || error.message;
      throw new Error(errorMessage);
    }
  },
  
  // Traduire les erreurs Firebase en français
  translateFirebaseError(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'Aucun compte trouvé avec cet email.',
      'auth/wrong-password': 'Mot de passe incorrect.',
      'auth/invalid-email': 'Adresse email invalide.',
      'auth/user-disabled': 'Ce compte a été désactivé.',
      'auth/email-already-in-use': 'Cet email est déjà utilisé.',
      'auth/weak-password': 'Le mot de passe est trop faible. Utilisez au moins 6 caractères.',
      'auth/operation-not-allowed': 'Cette opération n\'est pas autorisée.',
      'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard.',
      'auth/network-request-failed': 'Erreur de connexion réseau. Vérifiez votre connexion internet.',
      'auth/invalid-credential': 'Identifiants incorrects.'
    };
    
    return errorMessages[errorCode] || 'Une erreur est survenue. Veuillez réessayer.';
  },

  // Inscription
  async register(name, email, password) {
    // Vérifier si Firebase est disponible et configuré
    if (!auth || !isFirebaseConfigValid(firebaseConfig)) {
      throw new Error('Firebase n\'est pas configuré. Veuillez configurer firebase-config.js avec vos clés Firebase pour créer un compte.');
    }
    
    if (auth) {
      try {
        // Validation du mot de passe
        if (password.length < 6) {
          throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
        }
        
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Mettre à jour le profil
        try {
          await user.updateProfile({ displayName: name });
        } catch (profileError) {
          console.warn('Erreur lors de la mise à jour du profil:', profileError);
        }
        
        // Créer le document utilisateur dans Firestore
        if (db) {
          try {
            await db.collection('users').doc(user.uid).set({
              displayName: name,
              email: email,
              role: 'student',
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              xp: 0,
              level: 1,
              emailVerified: false
            });
          } catch (dbError) {
            console.warn('Erreur lors de la création du document Firestore:', dbError);
            // Continuer même si Firestore échoue
          }
        }
        
        const userInfo = {
          uid: user.uid,
          email: user.email,
          displayName: name,
          photoURL: null,
          role: 'student',
          emailVerified: user.emailVerified
        };
        
        // Sauvegarder dans localStorage
        localStorage.setItem('mathosUser', JSON.stringify(userInfo));
        
        return userInfo;
      } catch (error) {
        console.error('Erreur d\'inscription:', error);
        const errorMessage = this.translateFirebaseError(error.code) || error.message;
        throw new Error(errorMessage);
      }
    } else {
      // Mode simulation
      return new Promise((resolve) => {
        setTimeout(() => {
          const userInfo = {
            uid: 'user_' + Date.now(),
            email: email,
            displayName: name,
            photoURL: null,
            role: 'student',
            emailVerified: true
          };
          localStorage.setItem('mathosUser', JSON.stringify(userInfo));
          resolve(userInfo);
        }, 500);
      });
    }
  },

  // Déconnexion
  async logout() {
    if (auth) {
      await auth.signOut();
    }
    localStorage.removeItem('mathosUser');
  },

  // Écouter les changements d'authentification
  onAuthStateChanged(callback) {
    if (auth && isFirebaseConfigValid(firebaseConfig)) {
      return auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          // Récupérer les données Firestore
          let userData = null;
          if (db) {
            try {
              const userDoc = await db.collection('users').doc(firebaseUser.uid).get();
              userData = userDoc.exists ? userDoc.data() : null;
            } catch (error) {
              console.warn('Erreur lors de la récupération des données utilisateur:', error);
            }
          }
          
          const userInfo = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData?.displayName || firebaseUser.email.split('@')[0],
            photoURL: firebaseUser.photoURL || userData?.photoURL || null,
            role: userData?.role || 'student',
            emailVerified: firebaseUser.emailVerified
          };
          
          localStorage.setItem('mathosUser', JSON.stringify(userInfo));
          callback(userInfo);
        } else {
          localStorage.removeItem('mathosUser');
          callback(null);
        }
      });
    } else {
      // Mode simulation
      const userStr = localStorage.getItem('mathosUser');
      const user = userStr ? JSON.parse(userStr) : null;
      callback(user);
      return () => {};
    }
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    if (auth && auth.currentUser) {
      const userStr = localStorage.getItem('mathosUser');
      return userStr ? JSON.parse(userStr) : null;
    } else {
      const userStr = localStorage.getItem('mathosUser');
      return userStr ? JSON.parse(userStr) : null;
    }
  },
  
  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
};

// ============================================
// FIRESTORE - COURS
// ============================================

const CourseService = {
  async getAllCourses() {
    if (db) {
      try {
        const snapshot = await db.collection('courses')
          .where('published', '==', true)
          .orderBy('createdAt', 'desc')
          .get();
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des cours:', error);
        return [];
      }
    } else {
      // Données de simulation
      return [
        {
          id: '1',
          title: 'Nombres décimaux',
          description: 'Découvrez le monde fascinant des nombres décimaux',
          level: '6ème',
          duration: '2h30',
          image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop'
        }
      ];
    }
  },

  async getCourseById(id) {
    if (db) {
      try {
        const doc = await db.collection('courses').doc(id).get();
        if (doc.exists) {
          return { id: doc.id, ...doc.data() };
        }
        return null;
      } catch (error) {
        console.error('Erreur lors du chargement du cours:', error);
        return null;
      }
    } else {
      return {
        id: id,
        title: 'Cours de mathématiques',
        description: 'Description du cours',
        content: 'Contenu du cours...'
      };
    }
  }
};

// ============================================
// FIRESTORE - EXERCICES
// ============================================

const ExerciseService = {
  async getAllExercises() {
    if (db) {
      try {
        const snapshot = await db.collection('exercises')
          .where('published', '==', true)
          .orderBy('createdAt', 'desc')
          .get();
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des exercices:', error);
        return [];
      }
    } else {
      return [];
    }
  }
};

// ============================================
// FIRESTORE - QUIZ
// ============================================

const QuizService = {
  async getAllQuizzes() {
    if (db) {
      try {
        const snapshot = await db.collection('quizzes')
          .where('published', '==', true)
          .orderBy('createdAt', 'desc')
          .get();
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des quiz:', error);
        return [];
      }
    } else {
      return [];
    }
  }
};

// ============================================
// FIRESTORE - PRODUITS (BOUTIQUE)
// ============================================

const ProductService = {
  async getAllProducts() {
    if (db) {
      try {
        const snapshot = await db.collection('products')
          .where('published', '==', true)
          .orderBy('createdAt', 'desc')
          .get();
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        return [];
      }
    } else {
      return [];
    }
  }
};

// ============================================
// FIRESTORE - FORUM
// ============================================

const ForumService = {
  async getAllDiscussions() {
    if (db) {
      try {
        const snapshot = await db.collection('forum_discussions')
          .orderBy('createdAt', 'desc')
          .limit(50)
          .get();
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des discussions:', error);
        return [];
      }
    } else {
      return [];
    }
  },

  async createDiscussion(data) {
    if (db) {
      try {
        const user = AuthService.getCurrentUser();
        const docRef = await db.collection('forum_discussions').add({
          ...data,
          authorId: user?.uid || 'anonymous',
          authorName: user?.displayName || 'Anonyme',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          replies: 0,
          views: 0
        });
        return docRef.id;
      } catch (error) {
        console.error('Erreur lors de la création de la discussion:', error);
        throw error;
      }
    } else {
      return 'demo_' + Date.now();
    }
  }
};

// ============================================
// STORAGE - UPLOAD D'IMAGES
// ============================================

const StorageService = {
  async uploadImage(file, path) {
    if (storage) {
      try {
        const storageRef = storage.ref(path);
        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        return downloadURL;
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        throw error;
      }
    } else {
      // Mode simulation - retourner une URL placeholder
      return `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=800&h=600&fit=crop`;
    }
  }
};

// Exporter les services
window.AuthService = AuthService;
window.CourseService = CourseService;
window.ExerciseService = ExerciseService;
window.QuizService = QuizService;
window.ProductService = ProductService;
window.ForumService = ForumService;
window.StorageService = StorageService;

