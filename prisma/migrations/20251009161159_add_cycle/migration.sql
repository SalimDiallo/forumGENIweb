/*
  Warnings:

  - You are about to drop the column `dietaryRestrictions` on the `event_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `expectations` on the `event_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `experienceLevel` on the `event_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `event_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `organization` on the `event_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `event_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `specialNeeds` on the `event_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `event_registrations` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_event_registrations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "school" TEXT,
    "cne" TEXT,
    "cycle" TEXT,
    "level" TEXT,
    "schoolYear" TEXT,
    "newsletterConsent" BOOLEAN NOT NULL DEFAULT false,
    "registrationStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT,
    "paymentReference" TEXT,
    "qrCode" TEXT,
    "registeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" DATETIME,
    "attendedAt" DATETIME,
    CONSTRAINT "event_registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_event_registrations" ("attendedAt", "cne", "confirmedAt", "email", "eventId", "firstName", "id", "lastName", "newsletterConsent", "paymentMethod", "paymentReference", "paymentStatus", "phone", "qrCode", "registeredAt", "registrationStatus", "school", "schoolYear") SELECT "attendedAt", "cne", "confirmedAt", "email", "eventId", "firstName", "id", "lastName", "newsletterConsent", "paymentMethod", "paymentReference", "paymentStatus", "phone", "qrCode", "registeredAt", "registrationStatus", "school", "schoolYear" FROM "event_registrations";
DROP TABLE "event_registrations";
ALTER TABLE "new_event_registrations" RENAME TO "event_registrations";
CREATE INDEX "event_registrations_eventId_idx" ON "event_registrations"("eventId");
CREATE INDEX "event_registrations_email_idx" ON "event_registrations"("email");
CREATE INDEX "event_registrations_registrationStatus_idx" ON "event_registrations"("registrationStatus");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
