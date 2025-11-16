#!/usr/bin/env node

/**
 * Script utilitaire pour extraire l'ID d'un dossier Google Drive depuis une URL
 * Usage: node scripts/extract-folder-id.mjs
 */

import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n📁 Extraction d\'ID de dossier Google Drive\n');
console.log('============================================\n');
console.log('Collez l\'URL de votre dossier Google Drive ci-dessous:');
console.log('(Exemple: https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz)\n');

rl.question('URL: ', (url) => {
  const trimmedUrl = url.trim();

  // Regex pour extraire l'ID du dossier
  const patterns = [
    /\/folders\/([a-zA-Z0-9_-]+)/,  // Format standard
    /id=([a-zA-Z0-9_-]+)/,           // Format alternatif
  ];

  let folderId = null;

  for (const pattern of patterns) {
    const match = trimmedUrl.match(pattern);
    if (match && match[1]) {
      folderId = match[1];
      break;
    }
  }

  console.log('');

  if (folderId) {
    console.log('✅ ID du dossier extrait avec succès!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(folderId);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 Copiez cette ligne dans votre fichier .env:\n');
    console.log(`GOOGLE_DRIVE_GALLERY_FOLDER_ID="${folderId}"`);
    console.log('');
  } else {
    console.log('❌ Impossible d\'extraire l\'ID du dossier\n');
    console.log('💡 Assurez-vous que l\'URL est correcte:');
    console.log('   - Format attendu: https://drive.google.com/drive/folders/...');
    console.log('   - Ou: https://drive.google.com/drive/u/0/folders/...');
    console.log('');
  }

  rl.close();
});
