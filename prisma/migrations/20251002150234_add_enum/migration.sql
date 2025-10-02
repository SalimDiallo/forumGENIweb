-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_job_offers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyLogo" TEXT,
    "companyWebsite" TEXT,
    "industry" TEXT,
    "jobType" TEXT NOT NULL,
    "location" TEXT,
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "salaryMin" REAL,
    "salaryMax" REAL,
    "salaryCurrency" TEXT NOT NULL DEFAULT 'MAD',
    "salaryPeriod" TEXT NOT NULL DEFAULT 'month',
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "benefits" TEXT,
    "applicationEmail" TEXT,
    "applicationUrl" TEXT,
    "applicationPhone" TEXT,
    "applicationDeadline" DATETIME,
    "experienceRequired" TEXT NOT NULL DEFAULT 'none',
    "educationLevel" TEXT NOT NULL DEFAULT 'bac_plus_3',
    "contractDuration" TEXT,
    "startDate" DATETIME,
    "skillsRequired" TEXT,
    "languagesRequired" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_job_offers" ("applicationDeadline", "applicationEmail", "applicationPhone", "applicationUrl", "benefits", "companyLogo", "companyName", "companyWebsite", "contractDuration", "createdAt", "description", "educationLevel", "experienceRequired", "expiresAt", "id", "industry", "isFeatured", "isRemote", "jobType", "languagesRequired", "location", "publishedAt", "requirements", "salaryCurrency", "salaryMax", "salaryMin", "salaryPeriod", "skillsRequired", "slug", "startDate", "status", "title", "updatedAt", "viewsCount") SELECT "applicationDeadline", "applicationEmail", "applicationPhone", "applicationUrl", "benefits", "companyLogo", "companyName", "companyWebsite", "contractDuration", "createdAt", "description", "educationLevel", "experienceRequired", "expiresAt", "id", "industry", "isFeatured", "isRemote", "jobType", "languagesRequired", "location", "publishedAt", "requirements", "salaryCurrency", "salaryMax", "salaryMin", "salaryPeriod", "skillsRequired", "slug", "startDate", "status", "title", "updatedAt", "viewsCount" FROM "job_offers";
DROP TABLE "job_offers";
ALTER TABLE "new_job_offers" RENAME TO "job_offers";
CREATE UNIQUE INDEX "job_offers_slug_key" ON "job_offers"("slug");
CREATE INDEX "job_offers_slug_idx" ON "job_offers"("slug");
CREATE INDEX "job_offers_jobType_idx" ON "job_offers"("jobType");
CREATE INDEX "job_offers_location_idx" ON "job_offers"("location");
CREATE INDEX "job_offers_status_idx" ON "job_offers"("status");
CREATE INDEX "job_offers_companyName_idx" ON "job_offers"("companyName");
CREATE INDEX "job_offers_publishedAt_idx" ON "job_offers"("publishedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
