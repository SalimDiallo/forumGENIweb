-- CreateTable
CREATE TABLE "blog_post_images" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_post_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_offer_images" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_offer_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "blog_post_images_postId_idx" ON "blog_post_images"("postId");

-- CreateIndex
CREATE INDEX "job_offer_images_jobId_idx" ON "job_offer_images"("jobId");

-- AddForeignKey
ALTER TABLE "blog_post_images" ADD CONSTRAINT "blog_post_images_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_offer_images" ADD CONSTRAINT "job_offer_images_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
