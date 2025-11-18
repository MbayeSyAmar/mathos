const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/videos/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remplacer toutes les occurrences de { suivi de id: par createVideo({
content = content.replace(/(\s+)\{\s*\n\s+id:/g, '$1createVideo({\n      id:');

// Remplacer toutes les occurrences de }, qui terminent une vidéo (suivies de }, ou ],) par }),
content = content.replace(/(\s+)\},\s*\n(\s+)(\},|\],)/g, '$1}),\n$2$3');

fs.writeFileSync(filePath, content);
console.log('✅ Toutes les vidéos utilisent maintenant createVideo()');

