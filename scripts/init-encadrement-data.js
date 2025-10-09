/**
 * Script pour initialiser des données de test pour l'encadrement
 * 
 * IMPORTANT: Ce script nécessite Firebase Admin SDK
 * 
 * Installation:
 * npm install firebase-admin date-fns
 * 
 * Utilisation:
 * node scripts/init-encadrement-data.js
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
  process.exit(1);
}

const db = admin.firestore();

/**
 * Créer des données de test pour l'encadrement
 */
async function initEncadrementData() {
  try {
    console.log('\n🔄 Initialisation des données de test...\n');

    // 1. Créer un étudiant de test
    console.log('📝 Création de l\'étudiant de test...');
    const studentEmail = 'demo@mathosphere.fr';
    let studentUid;

    try {
      const studentRecord = await admin.auth().getUserByEmail(studentEmail);
      studentUid = studentRecord.uid;
      console.log(`✅ Étudiant existant trouvé: ${studentUid}`);
    } catch (error) {
      const studentRecord = await admin.auth().createUser({
        email: studentEmail,
        password: 'mathosphere123',
        displayName: 'Utilisateur Démo',
      });
      studentUid = studentRecord.uid;
      console.log(`✅ Étudiant créé: ${studentUid}`);

      // Créer le document utilisateur
      await db.collection('users').doc(studentUid).set({
        uid: studentUid,
        displayName: 'Utilisateur Démo',
        email: studentEmail,
        photoURL: null,
        role: 'student',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // 2. Créer un professeur de test
    console.log('📝 Création du professeur de test...');
    const teacherEmail = 'prof@mathosphere.fr';
    let teacherUid;

    try {
      const teacherRecord = await admin.auth().getUserByEmail(teacherEmail);
      teacherUid = teacherRecord.uid;
      console.log(`✅ Professeur existant trouvé: ${teacherUid}`);
    } catch (error) {
      const teacherRecord = await admin.auth().createUser({
        email: teacherEmail,
        password: 'prof123',
        displayName: 'Thomas Martin',
      });
      teacherUid = teacherRecord.uid;
      console.log(`✅ Professeur créé: ${teacherUid}`);

      // Créer le document utilisateur
      await db.collection('users').doc(teacherUid).set({
        uid: teacherUid,
        displayName: 'Thomas Martin',
        email: teacherEmail,
        photoURL: null,
        role: 'teacher',
        bio: 'Professeur agrégé de mathématiques avec 10 ans d\'expérience',
        speciality: 'Préparation aux concours',
        rating: 4.9,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // 3. Créer un encadrement
    console.log('📝 Création de l\'encadrement...');
    const encadrementRef = await db.collection('encadrements').add({
      userId: studentUid,
      teacherId: teacherUid,
      formule: 'Formule Intensive',
      status: 'active',
      startDate: admin.firestore.Timestamp.fromDate(new Date('2024-04-01')),
      nextBillingDate: admin.firestore.Timestamp.fromDate(new Date('2024-05-01')),
      monthlyAmount: 89,
      sessionsPerMonth: 4,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`✅ Encadrement créé: ${encadrementRef.id}`);

    // 4. Créer des sessions à venir
    console.log('📝 Création des sessions à venir...');
    const upcomingSessions = [
      {
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Dans 5 jours
        subject: 'Révision des nombres complexes',
        status: 'confirmed',
      },
      {
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // Dans 8 jours
        subject: 'Exercices sur les intégrales',
        status: 'scheduled',
      },
    ];

    for (const session of upcomingSessions) {
      await db.collection('sessions').add({
        encadrementId: encadrementRef.id,
        userId: studentUid,
        teacherId: teacherUid,
        date: admin.firestore.Timestamp.fromDate(session.date),
        duration: 60,
        subject: session.subject,
        status: session.status,
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${upcomingSessions.length} sessions à venir créées`);

    // 5. Créer des sessions passées
    console.log('📝 Création des sessions passées...');
    const pastSessions = [
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        subject: 'Introduction aux nombres complexes',
        notes: 'Revoir la forme trigonométrique et les applications',
        resources: ['Fiche de cours', 'Exercices corrigés'],
      },
      {
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        subject: 'Préparation au contrôle sur les suites',
        notes: 'Bien maîtriser les suites arithmético-géométriques',
        resources: ['Annales corrigées', 'Fiche méthode'],
      },
      {
        date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        subject: 'Exercices sur les suites',
        notes: 'Revoir la démonstration par récurrence',
        resources: ['Exercices supplémentaires'],
      },
    ];

    for (const session of pastSessions) {
      await db.collection('sessions').add({
        encadrementId: encadrementRef.id,
        userId: studentUid,
        teacherId: teacherUid,
        date: admin.firestore.Timestamp.fromDate(session.date),
        duration: 60,
        subject: session.subject,
        status: 'completed',
        notes: session.notes,
        resources: session.resources,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${pastSessions.length} sessions passées créées`);

    // 6. Créer des messages
    console.log('📝 Création des messages...');
    const messages = [
      {
        senderId: teacherUid,
        content: 'Bonjour, j\'ai préparé des exercices supplémentaires sur les nombres complexes pour notre prochaine séance. N\'hésitez pas à les consulter avant lundi.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        senderId: studentUid,
        content: 'Merci beaucoup ! Je vais les regarder ce week-end et préparer mes questions.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      },
      {
        senderId: teacherUid,
        content: 'Excellent travail aujourd\'hui sur les suites. Continuez comme ça, vous faites de bons progrès !',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const message of messages) {
      await db.collection('messages').add({
        encadrementId: encadrementRef.id,
        senderId: message.senderId,
        recipientId: message.senderId === studentUid ? teacherUid : studentUid,
        content: message.content,
        read: true,
        createdAt: admin.firestore.Timestamp.fromDate(message.createdAt),
      });
    }
    console.log(`✅ ${messages.length} messages créés`);

    // 7. Créer la progression
    console.log('📝 Création de la progression...');
    const chapitres = [
      { chapter: 'Suites numériques', progress: 90, notes: 'Très bon niveau' },
      { chapter: 'Fonctions exponentielles', progress: 75, notes: 'En progression' },
      { chapter: 'Nombres complexes', progress: 40, notes: 'Bon départ, à consolider' },
      { chapter: 'Intégrales', progress: 20, notes: 'Début de l\'apprentissage' },
      { chapter: 'Probabilités', progress: 60, notes: 'Bonne compréhension' },
    ];

    for (const chapitre of chapitres) {
      await db.collection('progression').add({
        encadrementId: encadrementRef.id,
        userId: studentUid,
        chapter: chapitre.chapter,
        progress: chapitre.progress,
        notes: chapitre.notes,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${chapitres.length} progressions créées`);

    // 8. Créer des ressources
    console.log('📝 Création des ressources...');
    const resources = [
      {
        title: 'Fiche de cours - Nombres complexes',
        type: 'pdf',
        url: '#',
      },
      {
        title: 'Exercices corrigés - Intégrales',
        type: 'pdf',
        url: '#',
      },
      {
        title: 'Vidéo - Méthode de résolution des équations différentielles',
        type: 'video',
        url: '#',
      },
    ];

    for (const resource of resources) {
      await db.collection('resources').add({
        encadrementId: encadrementRef.id,
        title: resource.title,
        type: resource.type,
        url: resource.url,
        uploadedBy: teacherUid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${resources.length} ressources créées`);

    console.log('\n🎉 Données de test initialisées avec succès!');
    console.log('\n📋 Résumé:');
    console.log(`   Étudiant: ${studentEmail} / mathosphere123`);
    console.log(`   Professeur: ${teacherEmail} / prof123`);
    console.log(`   Encadrement ID: ${encadrementRef.id}`);
    console.log('\n✅ Vous pouvez maintenant tester la page: /dashboard/encadrement\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécuter l'initialisation
initEncadrementData();
