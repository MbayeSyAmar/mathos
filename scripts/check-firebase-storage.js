// Script pour vérifier la configuration Firebase Storage
const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration Firebase Storage...\n');

// Vérifier le fichier .env.local
const envPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ Fichier .env.local introuvable !');
  console.log('\nCréez un fichier .env.local à la racine du projet avec :');
  console.log(`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
  `);
  process.exit(1);
}

// Lire le fichier .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

console.log('✅ Fichier .env.local trouvé\n');

// Vérifier les variables requises
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

let allPresent = true;
requiredVars.forEach(varName => {
  if (envVars[varName]) {
    if (varName === 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET') {
      console.log(`✅ ${varName}: ${envVars[varName]}`);
    } else {
      console.log(`✅ ${varName}: ${envVars[varName].substring(0, 20)}...`);
    }
  } else {
    console.log(`❌ ${varName}: MANQUANT`);
    allPresent = false;
  }
});

if (!allPresent) {
  console.log('\n❌ Certaines variables sont manquantes !');
  process.exit(1);
}

// Vérifier le format du Storage Bucket
const storageBucket = envVars['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'];
if (storageBucket && !storageBucket.includes('.appspot.com')) {
  console.log('\n⚠️  ATTENTION: Le Storage Bucket devrait se terminer par .appspot.com');
  console.log(`   Actuel: ${storageBucket}`);
  console.log(`   Attendu: votre-projet.appspot.com`);
}

console.log('\n✅ Configuration Firebase complète !');
console.log('\n📋 Prochaines étapes :');
console.log('1. Allez sur https://console.firebase.google.com/');
console.log('2. Sélectionnez votre projet');
console.log('3. Allez dans Storage dans le menu latéral');
console.log('4. Si pas encore activé, cliquez sur "Commencer"');
console.log('5. Configurez les règles de sécurité (voir FIREBASE_STORAGE_SETUP.md)');
console.log('\n🔧 Pour tester l\'upload :');
console.log('1. Connectez-vous en tant que super_admin');
console.log('2. Allez sur /admin/super/gestion-contenus');
console.log('3. Ouvrez la console du navigateur (F12)');
console.log('4. Essayez d\'uploader un PDF');
console.log('5. Regardez les logs [uploadPDF] et [Firebase] dans la console');
