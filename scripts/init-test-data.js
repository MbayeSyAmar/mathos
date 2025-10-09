/**
 * Script d'initialisation pour créer des données de test
 * pour le système de badges et de progression
 * 
 * Usage: node scripts/init-test-data.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialiser Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// IDs de test (à remplacer par de vrais IDs)
const TEST_STUDENT_ID = 'test_student_123'; // Remplacer par un vrai UID
const TEST_TEACHER_ID = 'test_teacher_456'; // Remplacer par un vrai UID

/**
 * Créer la progression initiale pour un étudiant de test
 */
async function createStudentProgress(userId) {
  console.log(`Creating student progress for ${userId}...`);
  
  const progressData = {
    userId,
    totalCourses: 10,
    completedCourses: 3,
    inProgressCourses: 2,
    totalExercises: 50,
    completedExercises: 15,
    totalQuizzes: 8,
    completedQuizzes: 5,
    averageQuizScore: 85,
    totalVideos: 20,
    watchedVideos: 10,
    totalStudyTimeMinutes: 720, // 12 heures
    weeklyStudyTimeMinutes: 180,
    monthlyStudyTimeMinutes: 720,
    successRate: 82,
    badges: ['premier_pas', 'apprenti_studieux'], // Déjà 2 badges
    level: 3,
    xp: 150, // 50 + 100 des badges déjà débloqués
    weeklyGoals: [],
    achievements: [],
    lastActivityAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  };
  
  await db.collection('student_progress').doc(userId).set(progressData);
  console.log('✅ Student progress created');
}

/**
 * Créer des progressions de cours
 */
async function createCourseProgress(userId) {
  console.log('Creating course progress...');
  
  const courses = [
    { id: 'math_101', name: 'Introduction aux nombres complexes', progress: 100, timeSpent: 120, completed: true },
    { id: 'math_102', name: 'Fonctions et dérivées', progress: 100, timeSpent: 150, completed: true },
    { id: 'math_103', name: 'Intégrales', progress: 100, timeSpent: 180, completed: true },
    { id: 'math_104', name: 'Probabilités', progress: 60, timeSpent: 80, completed: false },
    { id: 'math_105', name: 'Géométrie dans l\'espace', progress: 30, timeSpent: 45, completed: false },
  ];
  
  const batch = db.batch();
  
  for (const course of courses) {
    const ref = db.collection('course_progress').doc();
    batch.set(ref, {
      userId,
      courseId: course.id,
      courseName: course.name,
      progress: course.progress,
      timeSpent: course.timeSpent,
      completed: course.completed,
      startedAt: admin.firestore.Timestamp.now(),
      lastAccessedAt: admin.firestore.Timestamp.now(),
    });
  }
  
  await batch.commit();
  console.log(`✅ Created ${courses.length} course progress entries`);
}

/**
 * Créer des progressions d'exercices
 */
async function createExerciseProgress(userId) {
  console.log('Creating exercise progress...');
  
  const exercises = [
    { id: 'ex_001', name: 'Résolution équations 2nd degré', attempts: 2, completed: true, score: 95, timeSpent: 15 },
    { id: 'ex_002', name: 'Calcul de limites', attempts: 3, completed: true, score: 88, timeSpent: 20 },
    { id: 'ex_003', name: 'Étude de fonctions', attempts: 1, completed: true, score: 92, timeSpent: 25 },
    { id: 'ex_004', name: 'Nombres complexes - forme algébrique', attempts: 2, completed: true, score: 90, timeSpent: 18 },
    { id: 'ex_005', name: 'Nombres complexes - forme exponentielle', attempts: 1, completed: true, score: 85, timeSpent: 22 },
  ];
  
  const batch = db.batch();
  
  for (const exercise of exercises) {
    const ref = db.collection('exercise_progress').doc();
    batch.set(ref, {
      userId,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      attempts: exercise.attempts,
      completed: exercise.completed,
      score: exercise.score,
      timeSpent: exercise.timeSpent,
      startedAt: admin.firestore.Timestamp.now(),
      lastAttemptAt: admin.firestore.Timestamp.now(),
    });
  }
  
  await batch.commit();
  console.log(`✅ Created ${exercises.length} exercise progress entries`);
}

/**
 * Créer des progressions de quiz
 */
async function createQuizProgress(userId) {
  console.log('Creating quiz progress...');
  
  const quizzes = [
    { id: 'quiz_001', name: 'QCM Nombres complexes', score: 90, attempts: 1, bestScore: 90 },
    { id: 'quiz_002', name: 'QCM Fonctions', score: 85, attempts: 2, bestScore: 85 },
    { id: 'quiz_003', name: 'QCM Dérivées', score: 92, attempts: 1, bestScore: 92 },
    { id: 'quiz_004', name: 'QCM Intégrales', score: 78, attempts: 2, bestScore: 78 },
    { id: 'quiz_005', name: 'QCM Probabilités', score: 88, attempts: 1, bestScore: 88 },
  ];
  
  const batch = db.batch();
  
  for (const quiz of quizzes) {
    const ref = db.collection('quiz_progress').doc();
    batch.set(ref, {
      userId,
      quizId: quiz.id,
      quizName: quiz.name,
      score: quiz.score,
      attempts: quiz.attempts,
      completed: true,
      bestScore: quiz.bestScore,
      startedAt: admin.firestore.Timestamp.now(),
      lastAttemptAt: admin.firestore.Timestamp.now(),
    });
  }
  
  await batch.commit();
  console.log(`✅ Created ${quizzes.length} quiz progress entries`);
}

/**
 * Créer des activités récentes
 */
async function createStudentActivities(userId) {
  console.log('Creating student activities...');
  
  const now = admin.firestore.Timestamp.now();
  const oneHourAgo = new admin.firestore.Timestamp(now.seconds - 3600, now.nanoseconds);
  const twoDaysAgo = new admin.firestore.Timestamp(now.seconds - 172800, now.nanoseconds);
  const threeDaysAgo = new admin.firestore.Timestamp(now.seconds - 259200, now.nanoseconds);
  
  const activities = [
    {
      userId,
      type: 'badge',
      title: 'Badge débloqué',
      description: 'Vous avez débloqué le badge "Apprenti studieux"',
      timestamp: oneHourAgo,
    },
    {
      userId,
      type: 'course',
      title: 'Cours complété',
      description: 'Intégrales - 100%',
      timestamp: twoDaysAgo,
    },
    {
      userId,
      type: 'quiz',
      title: 'Quiz terminé',
      description: 'QCM Dérivées - Score: 92%',
      timestamp: twoDaysAgo,
    },
    {
      userId,
      type: 'exercise',
      title: 'Exercice réussi',
      description: 'Nombres complexes - forme exponentielle',
      timestamp: threeDaysAgo,
    },
  ];
  
  const batch = db.batch();
  
  for (const activity of activities) {
    const ref = db.collection('student_activities').doc();
    batch.set(ref, activity);
  }
  
  await batch.commit();
  console.log(`✅ Created ${activities.length} student activities`);
}

/**
 * Créer une conversation de test entre étudiant et professeur
 */
async function createTestConversation(studentId, teacherId) {
  console.log('Creating test conversation...');
  
  const conversationRef = db.collection('conversations').doc();
  const conversationData = {
    studentId,
    studentName: 'Étudiant Test',
    teacherId,
    teacherName: 'Professeur Test',
    encadrementId: 'test_encadrement_123',
    lastMessage: 'Bonjour, j\'ai une question sur les intégrales',
    lastMessageAt: admin.firestore.Timestamp.now(),
    unreadCountStudent: 0,
    unreadCountTeacher: 1,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  };
  
  await conversationRef.set(conversationData);
  console.log('✅ Test conversation created');
  
  // Créer quelques messages de test
  console.log('Creating test messages...');
  
  const messages = [
    {
      conversationId: conversationRef.id,
      senderId: teacherId,
      senderName: 'Professeur Test',
      senderRole: 'teacher',
      content: 'Bonjour ! Je suis là pour vous aider. Quelle est votre question ?',
      read: true,
      readAt: admin.firestore.Timestamp.now(),
      createdAt: admin.firestore.Timestamp.now(),
    },
    {
      conversationId: conversationRef.id,
      senderId: studentId,
      senderName: 'Étudiant Test',
      senderRole: 'student',
      content: 'Bonjour, j\'ai une question sur les intégrales',
      read: true,
      readAt: admin.firestore.Timestamp.now(),
      createdAt: admin.firestore.Timestamp.now(),
    },
    {
      conversationId: conversationRef.id,
      senderId: studentId,
      senderName: 'Étudiant Test',
      senderRole: 'student',
      content: 'Comment calculer l\'intégrale de x²dx ?',
      read: false,
      createdAt: admin.firestore.Timestamp.now(),
    },
  ];
  
  const batch = db.batch();
  
  for (const message of messages) {
    const ref = db.collection('messages').doc();
    batch.set(ref, message);
  }
  
  await batch.commit();
  console.log(`✅ Created ${messages.length} test messages`);
}

/**
 * Fonction principale
 */
async function main() {
  try {
    console.log('🚀 Starting test data initialization...\n');
    
    // Demander confirmation
    console.log('⚠️  This will create test data in your Firestore database.');
    console.log(`   Student ID: ${TEST_STUDENT_ID}`);
    console.log(`   Teacher ID: ${TEST_TEACHER_ID}\n`);
    
    // Créer les données
    await createStudentProgress(TEST_STUDENT_ID);
    await createCourseProgress(TEST_STUDENT_ID);
    await createExerciseProgress(TEST_STUDENT_ID);
    await createQuizProgress(TEST_STUDENT_ID);
    await createStudentActivities(TEST_STUDENT_ID);
    await createTestConversation(TEST_STUDENT_ID, TEST_TEACHER_ID);
    
    console.log('\n✅ All test data created successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Student progress initialized');
    console.log('   - 5 course progress entries');
    console.log('   - 5 exercise progress entries');
    console.log('   - 5 quiz progress entries');
    console.log('   - 4 student activities');
    console.log('   - 1 conversation with 3 messages');
    console.log('\n🎯 Next steps:');
    console.log('   1. Replace TEST_STUDENT_ID and TEST_TEACHER_ID with real UIDs');
    console.log('   2. Run: node scripts/init-test-data.js');
    console.log('   3. Login as the test student');
    console.log('   4. Visit /dashboard to see the data');
    console.log('   5. Visit /dashboard/encadrement to see chat and badges');
    console.log('   6. Complete more courses/exercises to unlock more badges!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Exécuter
main();
