# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for "Forum Génie Entreprise" - an engineering forum website with event management, blog, job postings, and CRM functionality. Built with the App Router, React 19, TypeScript, Prisma ORM with SQLite, and styled with Tailwind CSS 4.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Database operations
npx prisma generate        # Generate Prisma Client (outputs to lib/generated/prisma)
npx prisma migrate dev     # Create and apply migrations
npx prisma studio          # Open Prisma Studio GUI
npx prisma db push         # Push schema changes without migrations
```

## Architecture Overview

### Directory Structure

- **`/app`** - Next.js 15 App Router
  - **`/admin`** - Protected admin dashboard with sub-routes for each module
    - Each admin module has its own `actions.ts` for server actions
    - Events module uses the pattern: `/admin/events/event/[eventId]/edit` with co-located actions and schemas
  - **`/(sections)`** - Public-facing pages grouped by route group (about, blog, careers, contact, events, gallery)
  - **`layout.tsx`** - Root layout with Providers
  - **`Providers.tsx`** - Client-side providers (QueryClient, ThemeProvider)

- **`/components`** - React components
  - **`/ui`** - shadcn/ui components
  - **`/admin`** - Admin-specific components
  - Root level contains feature components (Hero, EventsList, JobOffers, etc.)

- **`/lib`** - Core utilities
  - **`db.ts`** - Prisma client singleton
  - **`safe-action.ts`** - next-safe-action clients with middleware (action, actionClient, authActionClient, adminAction, superAdminAction)
  - **`env.ts`** - Environment validation with @t3-oss/env-nextjs
  - **`utils.ts`** - General utilities
  - **`/generated/prisma`** - Generated Prisma Client (custom output path)
  - **`/validations`** - Zod schemas

- **`/utils`** - Additional utilities
  - **`mardown.tsx`** - Markdown utilities
  - **`useGoBack.tsx`** - Navigation hook

- **`/prisma`** - Database
  - **`schema.prisma`** - Database schema (SQLite, custom output path)
  - Migrations directory

## Key Technical Patterns

### Server Actions with next-safe-action

All server actions use the centralized client from `lib/safe-action.ts`:

- **`action`** - Base client with error handling and metadata schema
- **`actionClient`** - Adds logging middleware
- **`authActionClient`** - Requires authentication
- **`adminAction`** - For admin operations
- **`superAdminAction`** - For super admin operations

Every action requires metadata with an `actionName`:
```typescript
export const myAction = actionClient
  .metadata({ actionName: "my-action" })
  .schema(mySchema)
  .action(async ({ parsedInput }) => {
    // Implementation
  });
```

### Event Management Pattern

Events module demonstrates the recommended pattern:
- Co-located schemas: `event.create.sheme.ts`, `event.edit.sheme.ts`
- Co-located actions: `event.create.action.ts`, `event.edit.action.ts`
- Form components: `CreateEventForm.tsx`, `EditEventForm.tsx`
- Dynamic routes: `[eventId]/edit`

### Database Access

- Prisma Client is imported from `@/lib/db`
- Custom output path: `lib/generated/prisma`
- Always regenerate client after schema changes: `npx prisma generate`

### Environment Variables

Environment variables are validated in `lib/env.ts` using @t3-oss/env-nextjs:
- `DATABASE_URL` - SQLite database URL
- `NEXT_PUBLIC_PUBLISHABLE_KEY` - Public key

## Data Model Overview

The database schema includes 13 main entities:

**Content Management:**
- BlogPost, BlogCategory, BlogTag (with many-to-many BlogPostTag)
- Event with EventRegistration
- JobOffer with JobApplication

**CRM:**
- ContactMessage
- PartnershipRequest

**Media:**
- MediaGallery (linked to Events)
- VideoTestimonial

**System:**
- NewsletterSubscription
- SiteAnalytics
- AdminUser with AdminSession

Key enums: EventType, EventStatus, BlogPostStatus, JobType, JobStatus, RegistrationStatus, PaymentStatus, ContactCategory, MessageStatus, Priority, PartnershipType, PartnershipStatus, etc.

## Styling

- **Tailwind CSS 4** with custom configuration in `talwind.config.js` (note the typo in filename)
- **shadcn/ui** components in `/components/ui`
- **Framer Motion** for animations
- **Lucide React** for icons
- Dark mode support via `next-themes`

## Forms and Validation

- **react-hook-form** with **@hookform/resolvers**
- **Zod** for schema validation (v4.1.11)
- **next-safe-action** for type-safe server actions

## Important Notes

1. **Prisma Client Location**: The Prisma Client is generated to `lib/generated/prisma`, not the default location. Always import from `@/lib/db`.

2. **Path Aliases**: Use `@/*` for imports (maps to root directory).

3. **TypeScript**: Strict mode enabled, target ES2017.

4. **Admin Routes**: The admin section is at `/admin` with role-based access patterns already established in `safe-action.ts`.

5. **Metadata Pattern**: All server actions must include `actionName` in metadata for logging and error tracking.

6. **Database**: SQLite database. Run `npx prisma generate` after any schema changes.

7. **JSON Fields**: Several fields store JSON strings (e.g., `Event.agenda`, `Event.speakers`, `JobOffer.requirements`). Parse before use.

8. **Forms**: Major forms include event registration, job application, partnership request, and contact forms. They use modals and server actions.

9. **Turbopack**: Development server uses `--turbopack` flag for faster builds.

10. **Next.js Features**:
    - Image optimization configured for webp/avif
    - Security headers configured in `next.config.ts`
    - CSS optimization enabled
    - Package imports optimized for lucide-react and framer-motion
