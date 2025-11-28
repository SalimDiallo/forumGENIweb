/**
 * Script de migration pour convertir les sponsors au format JSON
 *
 * Usage:
 * npx tsx scripts/migrate-sponsors.ts
 */

import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

interface Sponsor {
  name: string;
  logo: string;
  website?: string;
  tier?: 'platinum' | 'gold' | 'silver' | 'bronze';
}

async function migrateSponsorData() {
  console.log('🚀 Début de la migration des sponsors...\n');

  try {
    // Récupérer tous les événements
    const events = await prisma.event.findMany({
      where: {
        sponsors: {
          not: null
        }
      }
    });

    console.log(`📊 Nombre d'événements avec sponsors: ${events.length}\n`);

    let migrated = 0;
    let alreadyJson = 0;
    let errors = 0;

    for (const event of events) {
      if (!event.sponsors) continue;

      try {
        // Vérifier si c'est déjà du JSON valide
        const parsed = JSON.parse(event.sponsors);
        if (Array.isArray(parsed)) {
          console.log(`✅ ${event.title}: Déjà au format JSON`);
          alreadyJson++;
          continue;
        }
      } catch {
        // Pas du JSON, on va le convertir
        console.log(`🔄 ${event.title}: Conversion en cours...`);

        // Exemple de conversion (à adapter selon votre format actuel)
        // Si vos sponsors sont au format markdown liste, par exemple:
        // - Sponsor 1
        // - Sponsor 2

        const lines = event.sponsors.split('\n').filter(line => line.trim());
        const sponsors: Sponsor[] = [];

        for (const line of lines) {
          const name = line.replace(/^[-*]\s*/, '').trim();
          if (name) {
            sponsors.push({
              name: name,
              logo: `/uploads/sponsors/placeholder.png`, // À remplacer manuellement
              website: undefined,
              tier: undefined
            });
          }
        }

        // Mettre à jour l'événement avec le nouveau format
        if (sponsors.length > 0) {
          await prisma.event.update({
            where: { id: event.id },
            data: {
              sponsors: JSON.stringify(sponsors)
            }
          });

          console.log(`   ✓ ${sponsors.length} sponsor(s) converti(s)`);
          migrated++;
        }
      }
    }

    console.log('\n📈 Résumé de la migration:');
    console.log(`   - Événements migrés: ${migrated}`);
    console.log(`   - Déjà au bon format: ${alreadyJson}`);
    console.log(`   - Erreurs: ${errors}`);

    console.log('\n⚠️  IMPORTANT: N\'oubliez pas de:');
    console.log('   1. Uploader les logos dans /public/uploads/sponsors/');
    console.log('   2. Mettre à jour les chemins des logos dans la base de données');
    console.log('   3. Ajouter les sites web et tiers si nécessaire');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction pour afficher un exemple de sponsor JSON
function showExample() {
  const example: Sponsor[] = [
    {
      name: "Entreprise Platine",
      logo: "/uploads/sponsors/entreprise-platine.png",
      website: "https://entreprise-platine.com",
      tier: "platinum"
    },
    {
      name: "Sponsor Or",
      logo: "/uploads/sponsors/sponsor-or.png",
      website: "https://sponsor-or.com",
      tier: "gold"
    },
    {
      name: "Partenaire",
      logo: "/uploads/sponsors/partenaire.png",
      website: "https://partenaire.com"
    }
  ];

  console.log('\n📝 Exemple de format JSON pour les sponsors:');
  console.log(JSON.stringify(example, null, 2));
}

// Exécuter le script
if (process.argv.includes('--example')) {
  showExample();
} else {
  migrateSponsorData();
}
