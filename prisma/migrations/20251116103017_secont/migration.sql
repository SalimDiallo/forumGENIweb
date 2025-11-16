/*
  Warnings:

  - You are about to drop the `event_registrations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job_applications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `newsletter_subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `site_analytics` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN "registrationLink" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "event_registrations";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "job_applications";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "newsletter_subscriptions";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "site_analytics";
PRAGMA foreign_keys=on;
