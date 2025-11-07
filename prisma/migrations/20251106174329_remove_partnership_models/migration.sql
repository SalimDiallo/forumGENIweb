/*
  Warnings:

  - You are about to drop the `partnership_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `partnershipRequests` on the `site_analytics` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "partnership_requests_submittedAt_idx";

-- DropIndex
DROP INDEX "partnership_requests_companyName_idx";

-- DropIndex
DROP INDEX "partnership_requests_partnershipType_idx";

-- DropIndex
DROP INDEX "partnership_requests_status_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "partnership_requests";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_site_analytics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "newsletterSignups" INTEGER NOT NULL DEFAULT 0,
    "eventRegistrations" INTEGER NOT NULL DEFAULT 0,
    "contactMessages" INTEGER NOT NULL DEFAULT 0,
    "jobViews" INTEGER NOT NULL DEFAULT 0,
    "blogViews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_site_analytics" ("blogViews", "contactMessages", "createdAt", "date", "eventRegistrations", "id", "jobViews", "newsletterSignups", "pageViews", "uniqueVisitors") SELECT "blogViews", "contactMessages", "createdAt", "date", "eventRegistrations", "id", "jobViews", "newsletterSignups", "pageViews", "uniqueVisitors" FROM "site_analytics";
DROP TABLE "site_analytics";
ALTER TABLE "new_site_analytics" RENAME TO "site_analytics";
CREATE UNIQUE INDEX "site_analytics_date_key" ON "site_analytics"("date");
CREATE INDEX "site_analytics_date_idx" ON "site_analytics"("date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
