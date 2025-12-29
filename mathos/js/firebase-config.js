// ============================================
// CONFIGURATION FIREBASE - À COMPLÉTER
// ============================================

// Remplacez ces valeurs par vos propres clés Firebase
// Obtenez-les depuis la console Firebase : https://console.firebase.google.com/

// Configuration Firebase par défaut (mode simulation)
// Remplacez ces valeurs par vos propres clés Firebase pour activer Firebase
window.firebaseConfig = {
  apiKey: "VOTRE_API_KEY", // Remplacez par votre vraie clé API
  authDomain: "votre-projet.firebaseapp.com", // Remplacez par votre domaine
  projectId: "votre-projet-id", // Remplacez par votre ID de projet
  storageBucket: "votre-projet.appspot.com", // Remplacez par votre bucket
  messagingSenderId: "123456789012", // Remplacez par votre sender ID
  appId: "1:123456789012:web:abcdefghijklmnop", // Remplacez par votre app ID
  measurementId: "G-XXXXXXXXXX" // Optionnel
};

// Si vous ne configurez pas Firebase, l'application fonctionnera en mode simulation
// avec les identifiants de démo : demo@mathosphere.fr / mathosphere123

// Instructions pour configurer Firebase :
// 1. Allez sur https://console.firebase.google.com/
// 2. Créez un nouveau projet ou sélectionnez un projet existant
// 3. Allez dans Paramètres du projet > Vos applications
// 4. Ajoutez une application Web
// 5. Copiez les valeurs de configuration dans ce fichier
// 6. Activez Authentication > Email/Password
// 7. Créez les collections Firestore : users, courses, exercises, quizzes, products, forum_discussions


