/**
 * Script pour créer les encadrements manquants pour les demandes déjà approuvées
 * À exécuter une seule fois pour corriger les données existantes
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

async function fixExistingApprovals() {
  try {
    console.log('🔍 Recherche des demandes approuvées sans encadrement...\n');

    // Récupérer toutes les demandes approuvées
    const requestsSnapshot = await db.collection('encadrement_requests')
      .where('status', '==', 'approved')
      .get();

    if (requestsSnapshot.empty) {
      console.log('✅ Aucune demande approuvée trouvée');
      return;
    }

    console.log(`📊 ${requestsSnapshot.size} demandes approuvées trouvées\n`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const requestDoc of requestsSnapshot.docs) {
      const requestData = requestDoc.data();
      const requestId = requestDoc.id;

      console.log(`\n📋 Traitement de la demande: ${requestId}`);
      console.log(`   Étudiant: ${requestData.studentName} (${requestData.studentId})`);
      console.log(`   Professeur: ${requestData.teacherName} (${requestData.teacherId})`);
      console.log(`   Formule: ${requestData.formule}`);

      // Vérifier si un encadrement existe déjà
      const existingEncadrement = await db.collection('encadrements')
        .where('userId', '==', requestData.studentId)
        .where('teacherId', '==', requestData.teacherId)
        .where('status', '==', 'active')
        .get();

      if (!existingEncadrement.empty) {
        console.log('   ⏭️  Encadrement déjà existant, passage au suivant');
        skippedCount++;
        continue;
      }

      // Créer l'encadrement manquant
      const now = new Date();
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      // Déterminer le nombre de sessions et le montant selon la formule
      let sessionsPerMonth = 4;
      let monthlyAmount = 20000;

      if (requestData.formule.toLowerCase().includes('intensive')) {
        sessionsPerMonth = 8;
        monthlyAmount = 35000;
      } else if (requestData.formule.toLowerCase().includes('premium')) {
        sessionsPerMonth = 12;
        monthlyAmount = 50000;
      }

      const encadrementData = {
        userId: requestData.studentId,
        teacherId: requestData.teacherId,
        formule: requestData.formule,
        status: 'active',
        startDate: admin.firestore.Timestamp.fromDate(now),
        nextBillingDate: admin.firestore.Timestamp.fromDate(nextMonth),
        monthlyAmount: monthlyAmount,
        sessionsPerMonth: sessionsPerMonth,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection('encadrements').add(encadrementData);
      
      console.log('   ✅ Encadrement créé avec succès');
      console.log(`      Sessions/mois: ${sessionsPerMonth}`);
      console.log(`      Montant: ${monthlyAmount} FCFA`);
      
      fixedCount++;
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ');
    console.log('='.repeat(60));
    console.log(`✅ Encadrements créés: ${fixedCount}`);
    console.log(`⏭️  Déjà existants: ${skippedCount}`);
    console.log(`📋 Total traité: ${requestsSnapshot.size}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécuter le script
fixExistingApprovals()
  .then(() => {
    console.log('\n✅ Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  });
