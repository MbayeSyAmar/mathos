/**
 * Script pour créer un utilisateur administrateur dans Firebase
 * 
 * IMPORTANT: Ce script nécessite Firebase Admin SDK
 * 
 * Installation:
 * npm install firebase-admin
 * 
 * Configuration:
 * 1. Téléchargez votre fichier serviceAccountKey.json depuis Firebase Console
 * 2. Placez-le dans le dossier racine du projet
 * 3. Ajoutez serviceAccountKey.json à .gitignore
 * 
 * Utilisation:
 * node scripts/create-admin.js
 */

const admin = require('firebase-admin');

// Charger le fichier de configuration
try {
  const serviceAccount = require('../serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('✅ Firebase Admin initialisé');
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation de Firebase Admin:');
  console.error('   Assurez-vous que serviceAccountKey.json existe dans le dossier racine');
  console.error('   Téléchargez-le depuis: Firebase Console > Project Settings > Service Accounts');
  process.exit(1);
}

const db = admin.firestore();

/**
 * Créer un utilisateur admin
 */
async function createAdmin(email, password, displayName, role = 'super_admin') {
  const validRoles = ['super_admin', 'teacher', 'tutor', 'editor'];
  
  if (!validRoles.includes(role)) {
    console.error(`❌ Rôle invalide: ${role}`);
    console.error(`   Rôles valides: ${validRoles.join(', ')}`);
    return;
  }

  try {
    console.log('\n🔄 Création de l\'utilisateur...');
    
    // Créer l'utilisateur dans Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    console.log('✅ Utilisateur créé dans Authentication');
    console.log(`   UID: ${userRecord.uid}`);

    // Créer le document Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      displayName: displayName,
      email: email,
      photoURL: null,
      role: role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      bio: '',
      level: '',
      school: '',
      interests: [],
      notifications: {
        email: true,
        newCourses: true,
        newExercises: false,
        newQuizzes: true,
        forum: true,
      },
      stats: {
        coursesCompleted: 0,
        exercisesCompleted: 0,
        quizzesCompleted: 0,
        discussionsCreated: 0,
        repliesPosted: 0,
      },
    });

    console.log('✅ Document Firestore créé');
    console.log('\n📋 Résumé:');
    console.log(`   Email: ${email}`);
    console.log(`   Rôle: ${role}`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log('\n🎉 Admin créé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
    
    if (error.code === 'auth/email-already-exists') {
      console.error('   Cet email existe déjà. Utilisez updateUserRole() pour changer le rôle.');
    }
  }
}

/**
 * Mettre à jour le rôle d'un utilisateur existant
 */
async function updateUserRole(email, newRole) {
  const validRoles = ['student', 'super_admin', 'teacher', 'tutor', 'editor'];
  
  if (!validRoles.includes(newRole)) {
    console.error(`❌ Rôle invalide: ${newRole}`);
    console.error(`   Rôles valides: ${validRoles.join(', ')}`);
    return;
  }

  try {
    console.log('\n🔄 Recherche de l\'utilisateur...');
    
    // Trouver l'utilisateur par email
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`✅ Utilisateur trouvé: ${userRecord.uid}`);

    // Mettre à jour le rôle dans Firestore
    await db.collection('users').doc(userRecord.uid).update({
      role: newRole,
    });

    console.log('✅ Rôle mis à jour avec succès');
    console.log(`   Email: ${email}`);
    console.log(`   Nouveau rôle: ${newRole}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error.message);
  }
}

/**
 * Lister tous les admins
 */
async function listAdmins() {
  try {
    console.log('\n🔄 Recherche des administrateurs...\n');
    
    const snapshot = await db.collection('users')
      .where('role', 'in', ['super_admin', 'teacher', 'tutor', 'editor'])
      .get();

    if (snapshot.empty) {
      console.log('Aucun administrateur trouvé.');
      return;
    }

    console.log(`📋 ${snapshot.size} administrateur(s) trouvé(s):\n`);
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`👤 ${data.displayName || 'Sans nom'}`);
      console.log(`   Email: ${data.email}`);
      console.log(`   Rôle: ${data.role}`);
      console.log(`   UID: ${data.uid}\n`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error.message);
  }
}

// ===========================================
// EXEMPLES D'UTILISATION
// ===========================================

// Décommentez la fonction que vous voulez exécuter :

// 1. Créer un super administrateur
// createAdmin(
//   'admin@mathosphere.fr',
//   'SecurePassword123!',
//   'Super Admin',
//   'super_admin'
// );

// 2. Créer un professeur
// createAdmin(
//   'prof@mathosphere.fr',
//   'ProfPass123!',
//   'Professeur Principal',
//   'teacher'
// );

// 3. Créer un tuteur
// createAdmin(
//   'tutor@mathosphere.fr',
//   'TutorPass123!',
//   'Tuteur Principal',
//   'tutor'
// );

// 4. Créer un rédacteur
// createAdmin(
//   'editor@mathosphere.fr',
//   'EditorPass123!',
//   'Rédacteur Principal',
//   'editor'
// );

// 5. Mettre à jour le rôle d'un utilisateur existant
// updateUserRole('user@example.com', 'teacher');

// 6. Lister tous les admins
// listAdmins();

// Message d'aide si aucune fonction n'est appelée
console.log('\n📖 Guide d\'utilisation:');
console.log('\n1. Ouvrez ce fichier (scripts/create-admin.js)');
console.log('2. Décommentez la fonction que vous voulez exécuter');
console.log('3. Modifiez les paramètres (email, mot de passe, etc.)');
console.log('4. Exécutez: node scripts/create-admin.js');
console.log('\nFonctions disponibles:');
console.log('  - createAdmin()        : Créer un nouvel admin');
console.log('  - updateUserRole()     : Changer le rôle d\'un utilisateur');
console.log('  - listAdmins()         : Lister tous les admins\n');

// Garder le script en vie si une fonction async est en cours
// setTimeout(() => {
//   console.log('Script terminé.');
//   process.exit(0);
// }, 3000);
