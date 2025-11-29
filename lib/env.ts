import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    // Google Drive API Configuration (for gallery images)
    GOOGLE_SERVICE_ACCOUNT_KEY: z.string().min(1),
    GOOGLE_DRIVE_GALLERY_FOLDER_ID: z.string().min(1),
    // YouTube API Configuration (for gallery videos)
    YOUTUBE_API_KEY: z.string().min(1),
    YOUTUBE_CHANNEL_ID: z.string().min(1),
    // Cache Revalidation Token
    REVALIDATE_TOKEN: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
    GOOGLE_SERVICE_ACCOUNT_KEY: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
    GOOGLE_DRIVE_GALLERY_FOLDER_ID: process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID,
    REVALIDATE_TOKEN: process.env.REVALIDATE_TOKEN,
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});