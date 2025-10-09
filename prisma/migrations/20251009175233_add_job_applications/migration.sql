-- CreateTable
CREATE TABLE "job_applications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobOfferId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "resumeUrl" TEXT,
    "coverLetter" TEXT,
    "experience" TEXT,
    "education" TEXT,
    "skills" TEXT,
    "portfolioUrl" TEXT,
    "linkedinUrl" TEXT,
    "availability" TEXT,
    "expectedSalary" TEXT,
    "additionalInfo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" DATETIME,
    "notes" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    CONSTRAINT "job_applications_jobOfferId_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "job_offers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "job_applications_jobOfferId_idx" ON "job_applications"("jobOfferId");

-- CreateIndex
CREATE INDEX "job_applications_email_idx" ON "job_applications"("email");

-- CreateIndex
CREATE INDEX "job_applications_status_idx" ON "job_applications"("status");

-- CreateIndex
CREATE INDEX "job_applications_appliedAt_idx" ON "job_applications"("appliedAt");
