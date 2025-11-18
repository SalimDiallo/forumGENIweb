/**
 * Script pour créer un utilisateur admin avec Better Auth
 * Usage: npx tsx scripts/create-admin.ts
 */

import { prisma } from "../lib/db";
import { auth } from "../lib/auth";

async function createAdmin() {
  try {
    console.log("🔐 Création d'un utilisateur administrateur...\n");

    // Données par défaut de l'admin
    const adminData = {
      email: "admin@forumgenie.com",
      name: "Administrateur",
      fullName: "Administrateur",
      password: "Admin123!",
      role: "super_admin",
    };

    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      console.log("⚠️  Un administrateur avec cet email existe déjà.");
      console.log(`📧 Email: ${adminData.email}`);
      console.log("\n📋 Vous pouvez vous connecter avec:");
      console.log(`   📧 Email: ${adminData.email}`);
      console.log(`   🔑 Mot de passe: ${adminData.password}`);
      console.log(`   🎭 Rôle: ${existingAdmin.role}\n`);
      return;
    }

    // Créer l'administrateur avec Better Auth
    // Better Auth gère automatiquement le hashing du mot de passe et crée l'utilisateur + compte
    const response = await auth.api.signUpEmail({
      body: {
        ...adminData,
        email: adminData.email,
        password: adminData.password,
        name: adminData.name,
      },
    });

    // Mettre à jour les champs additionnels (role, fullName, etc.)
    await prisma.user.update({
      where: { email: adminData.email },
      data: {
        fullName: adminData.fullName,
        role: adminData.role,
        isActive: true,
        emailVerified: true,
      },
    });

    console.log("✅ Administrateur créé avec succès !\n");
    console.log("📋 Informations de connexion:");
    console.log(`   📧 Email: ${adminData.email}`);
    console.log(`   🔑 Mot de passe: ${adminData.password}`);
    console.log(`   👤 Nom: ${adminData.fullName}`);
    console.log(`   🎭 Rôle: ${adminData.role}\n`);
    console.log("⚠️  IMPORTANT: Changez ce mot de passe après la première connexion !\n");
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'administrateur:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
