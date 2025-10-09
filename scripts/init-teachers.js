/**
 * Script pour initialiser des professeurs dans Firebase
 * Exécuter avec: node scripts/init-teachers.js
 */

const admin = require("firebase-admin")
const serviceAccount = require("../firebase-admin-key.json")

// Initialiser Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const db = admin.firestore()

const teachers = [
  {
    email: "thomas.martin@mathosphere.com",
    name: "Thomas Martin",
    role: "teacher",
    title: "Professeur agrégé de mathématiques",
    speciality: "Préparation aux concours",
    rating: 4.9,
    bio: "15 ans d'expérience dans l'enseignement des mathématiques. Spécialisé dans la préparation aux concours des grandes écoles.",
    subjects: ["Mathématiques", "Algèbre", "Analyse", "Probabilités"],
    levels: ["Lycée", "Enseignement supérieur"],
  },
  {
    email: "sophie.leclerc@mathosphere.com",
    name: "Sophie Leclerc",
    role: "teacher",
    title: "Docteure en mathématiques",
    speciality: "Analyse et algèbre",
    rating: 4.8,
    bio: "Docteure en mathématiques appliquées, passionnée par la transmission des savoirs.",
    subjects: ["Mathématiques", "Analyse", "Algèbre linéaire", "Géométrie"],
    levels: ["Collège", "Lycée", "Enseignement supérieur"],
  },
  {
    email: "pierre.dubois@mathosphere.com",
    name: "Pierre Dubois",
    role: "teacher",
    title: "Professeur certifié",
    speciality: "Mathématiques lycée",
    rating: 4.7,
    bio: "10 ans d'expérience en lycée. Expert en préparation au baccalauréat.",
    subjects: ["Mathématiques", "Physique-Chimie"],
    levels: ["Lycée"],
  },
  {
    email: "marie.bernard@mathosphere.com",
    name: "Marie Bernard",
    role: "teacher",
    title: "Professeure de mathématiques",
    speciality: "Collège et remise à niveau",
    rating: 4.9,
    bio: "Spécialisée dans l'accompagnement des élèves en difficulté. Approche pédagogique bienveillante.",
    subjects: ["Mathématiques", "Sciences"],
    levels: ["Collège", "Lycée"],
  },
]

async function initTeachers() {
  console.log("🚀 Initialisation des professeurs...")

  try {
    for (const teacher of teachers) {
      // Créer l'utilisateur dans Firebase Auth
      let userRecord
      try {
        userRecord = await admin.auth().getUserByEmail(teacher.email)
        console.log(`✅ Utilisateur existe déjà: ${teacher.email}`)
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          // Créer l'utilisateur
          userRecord = await admin.auth().createUser({
            email: teacher.email,
            password: "Teacher2024!",
            displayName: teacher.name,
            emailVerified: true,
          })
          console.log(`✅ Utilisateur créé: ${teacher.email}`)
        } else {
          throw error
        }
      }

      // Créer ou mettre à jour le document dans Firestore
      const userData = {
        email: teacher.email,
        displayName: teacher.name,
        name: teacher.name,
        role: teacher.role,
        title: teacher.title,
        speciality: teacher.speciality,
        rating: teacher.rating,
        bio: teacher.bio,
        subjects: teacher.subjects,
        levels: teacher.levels,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }

      await db.collection("users").doc(userRecord.uid).set(userData, { merge: true })
      console.log(`✅ Document Firestore créé/mis à jour pour: ${teacher.name}`)

      // Définir le custom claim
      await admin.auth().setCustomUserClaims(userRecord.uid, { role: "teacher" })
      console.log(`✅ Custom claim défini pour: ${teacher.name}`)
    }

    console.log("\n✨ Tous les professeurs ont été initialisés avec succès!")
    console.log("\nInformations de connexion:")
    console.log("Email: [email d'un professeur ci-dessus]")
    console.log("Mot de passe: Teacher2024!")
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error)
  } finally {
    process.exit()
  }
}

initTeachers()
