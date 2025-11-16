#!/usr/bin/env node

/**
 * Script de test pour vérifier la connexion Google Drive
 * Usage: node scripts/test-drive-connection.mjs
 */

import { google } from 'googleapis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '../.env') });

console.log('\n🔍 Test de connexion Google Drive API\n');
console.log('=====================================\n');

// Étape 1: Vérifier les variables d'environnement
console.log('📋 Étape 1: Vérification des variables d\'environnement...\n');

const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
const folderId = process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID;

if (!serviceAccountKey) {
  console.error('❌ ERREUR: GOOGLE_SERVICE_ACCOUNT_KEY n\'est pas défini dans .env');
  console.log('\n💡 Solution: Ajoutez GOOGLE_SERVICE_ACCOUNT_KEY dans votre fichier .env');
  process.exit(1);
}

if (!folderId) {
  console.error('❌ ERREUR: GOOGLE_DRIVE_GALLERY_FOLDER_ID n\'est pas défini dans .env');
  console.log('\n💡 Solution: Ajoutez GOOGLE_DRIVE_GALLERY_FOLDER_ID dans votre fichier .env');
  process.exit(1);
}

console.log('✅ GOOGLE_SERVICE_ACCOUNT_KEY: Défini');
console.log('✅ GOOGLE_DRIVE_GALLERY_FOLDER_ID:', folderId);
console.log('');

// Étape 2: Parser les credentials
console.log('📋 Étape 2: Parsing des credentials JSON...\n');

let credentials;
try {
  credentials = JSON.parse(serviceAccountKey);
  console.log('✅ JSON valide');
  console.log('✅ Project ID:', credentials.project_id);
  console.log('✅ Client Email:', credentials.client_email);
  console.log('');
} catch (error) {
  console.error('❌ ERREUR: Le JSON des credentials est invalide');
  console.error('Erreur:', error.message);
  console.log('\n💡 Solution: Vérifiez que vous avez copié TOUT le contenu du fichier JSON');
  process.exit(1);
}

// Étape 3: Initialiser le client Google Drive
console.log('📋 Étape 3: Initialisation du client Google Drive...\n');

let drive;
try {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  drive = google.drive({ version: 'v3', auth });
  console.log('✅ Client Google Drive initialisé avec succès');
  console.log('');
} catch (error) {
  console.error('❌ ERREUR: Impossible d\'initialiser le client Google Drive');
  console.error('Erreur:', error.message);
  process.exit(1);
}

// Étape 4: Tester l'accès au dossier
console.log('📋 Étape 4: Test d\'accès au dossier racine...\n');

try {
  const response = await drive.files.get({
    fileId: folderId,
    fields: 'id, name, mimeType',
  });

  console.log('✅ Dossier trouvé!');
  console.log('   - ID:', response.data.id);
  console.log('   - Nom:', response.data.name);
  console.log('   - Type:', response.data.mimeType);
  console.log('');
} catch (error) {
  console.error('❌ ERREUR: Impossible d\'accéder au dossier');

  if (error.code === 404) {
    console.error('\n💡 Le dossier n\'existe pas ou n\'est pas partagé avec le Service Account');
    console.error('   Solutions:');
    console.error('   1. Vérifiez que l\'ID du dossier est correct');
    console.error('   2. Partagez le dossier avec:', credentials.client_email);
    console.error('   3. Donnez les droits "Lecteur" au Service Account');
  } else {
    console.error('\nErreur:', error.message);
  }

  process.exit(1);
}

// Étape 5: Lister les sous-dossiers (années)
console.log('📋 Étape 5: Liste des sous-dossiers (années)...\n');

try {
  const response = await drive.files.list({
    q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    orderBy: 'name desc',
  });

  const yearFolders = response.data.files || [];

  if (yearFolders.length === 0) {
    console.warn('⚠️  Aucun sous-dossier trouvé!');
    console.log('\n💡 Créez des dossiers pour les années (ex: 2025, 2024) dans le dossier racine');
  } else {
    console.log(`✅ ${yearFolders.length} dossier(s) année(s) trouvé(s):\n`);

    for (const folder of yearFolders) {
      console.log(`   📁 ${folder.name} (ID: ${folder.id})`);

      // Lister les catégories dans ce dossier année
      const categoriesResponse = await drive.files.list({
        q: `'${folder.id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
      });

      const categories = categoriesResponse.data.files || [];

      if (categories.length > 0) {
        for (const category of categories) {
          console.log(`      └─ 📂 ${category.name}`);

          // Lister les événements
          const eventsResponse = await drive.files.list({
            q: `'${category.id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(id, name)',
          });

          const events = eventsResponse.data.files || [];

          if (events.length > 0) {
            for (const event of events) {
              // Compter les fichiers dans l'événement
              const filesResponse = await drive.files.list({
                q: `'${event.id}' in parents and trashed=false`,
                fields: 'files(id)',
              });

              const fileCount = filesResponse.data.files?.length || 0;
              console.log(`         └─ 📄 ${event.name} (${fileCount} fichier${fileCount > 1 ? 's' : ''})`);
            }
          } else {
            console.log(`         └─ (aucun événement)`);
          }
        }
      } else {
        console.log(`      └─ (aucune catégorie)`);
      }
    }
  }
  console.log('');
} catch (error) {
  console.error('❌ ERREUR lors de la récupération des sous-dossiers');
  console.error('Erreur:', error.message);
  process.exit(1);
}

// Résumé final
console.log('=====================================\n');
console.log('✅ TOUS LES TESTS SONT PASSÉS!\n');
console.log('🎉 Votre configuration Google Drive est correcte!');
console.log('');
console.log('Prochaines étapes:');
console.log('1. Organisez vos fichiers dans la structure: Année > Catégorie > Événement');
console.log('2. Démarrez votre serveur: npm run dev');
console.log('3. Visitez: http://localhost:3000/gallery');
console.log('');
