"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createBlogPostSchema, updateBlogPostSchema } from "@/lib/validations/blog";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const listBlogPosts = actionClient
  .metadata({ actionName: "list-blog-posts" })
  .schema(z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20)
  }).optional().default({ page: 1, limit: 20 }))
  .action(async ({ parsedInput }) => {
    const { page, limit } = parsedInput || { page: 1, limit: 20 };
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      prisma.blogPost.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    return { posts, total, totalPages, currentPage: page };
  });

export const getBlogPost = actionClient
  .metadata({ actionName: "get-blog-post" })
  .schema(z.object({ id: z.number().int().positive() }))
  .action(async ({ parsedInput }) => {
    const post = await prisma.blogPost.findUnique({
      where: { id: parsedInput.id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return { post };
  });

export const createBlogPost = actionClient
  .metadata({ actionName: "create-blog-post" })
  .schema(createBlogPostSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.blogPost.create({
      data: {
        title: parsedInput.title,
        slug: parsedInput.slug,
        excerpt: parsedInput.excerpt,
        content: parsedInput.content,
        featuredImage: parsedInput.featuredImage,
        authorName: parsedInput.authorName,
        authorPosition: parsedInput.authorPosition,
        categoryId: parsedInput.categoryId,
        status: parsedInput.status,
        isFeatured: parsedInput.isFeatured,
        readTimeMinutes: parsedInput.readTimeMinutes,
        metaTitle: parsedInput.metaTitle,
        metaDescription: parsedInput.metaDescription,
        publishedAt: parsedInput.status === "published" ? new Date() : null,
      },
    });

    // Revalidate cache tag for blog
    revalidateTag('blog');

    return { id: created.id };
  });

export const updateBlogPost = actionClient
  .metadata({ actionName: "update-blog-post" })
  .schema(updateBlogPostSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;

    // If status is being changed to published and wasn't published before, set publishedAt
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    const updateData: any = { ...data };

    if (data.status === "published" && existing?.status !== "published" && !existing?.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    // Revalidate cache tag for blog
    revalidateTag('blog');

    return { id: updated.id };
  });

export const deleteBlogPost = actionClient
  .metadata({ actionName: "delete-blog-post" })
  .schema(z.object({ id: z.number().int().positive() }))
  .action(async ({ parsedInput }) => {
    await prisma.blogPost.delete({ where: { id: parsedInput.id } });

    // Revalidate cache tag for blog
    revalidateTag('blog');

    return { ok: true };
  });

export const toggleFeatured = actionClient
  .metadata({ actionName: "toggle-featured-blog-post" })
  .schema(z.object({ id: z.number().int().positive(), isFeatured: z.boolean() }))
  .action(async ({ parsedInput }) => {
    const updated = await prisma.blogPost.update({
      where: { id: parsedInput.id },
      data: { isFeatured: parsedInput.isFeatured },
    });

    // Revalidate cache tag for blog
    revalidateTag('blog');

    return { id: updated.id };
  });
