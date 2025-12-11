# 📚 Migration Guide: next-safe-action v8

## ✅ Completed Updates in `lib/safe-action.ts`

### 1. Improved Error Handling
- ✅ Enhanced `handleServerError` with detailed logging
- ✅ Proper error masking for security
- ✅ Custom error classes (ActionError, AuthError)

### 2. Better Documentation
- ✅ Comprehensive JSDoc comments for all clients
- ✅ Middleware chain order documentation
- ✅ TypeScript types for contexts

### 3. Middleware Improvements
- ✅ Proper context passing patterns
- ✅ Clear middleware execution order
- ✅ Rate limiting with detailed error messages
- ✅ Automatic cache invalidation

### 4. TypeScript Types
- ✅ `AuthContext` - For authenticated actions
- ✅ `EditorContext` - For editor-specific actions

---

## ⚠️ TODO: Migrate Action Definitions

### Files Using Deprecated `.schema()` Method

The following files still use `.schema()` which is deprecated in v8:

1. `app/admin/jobs/actions.ts`
2. `app/admin/blog/posts-actions.ts`
3. `app/admin/gallery/actions.ts`
4. `app/actions/gallery.ts`
5. `app/admin/profile/actions.ts`
6. `app/admin/jobs/job/create/job.create.action.ts`
7. `app/admin/events/event.delete.action.ts`
8. `app/admin/crm/actions.ts`
9. `app/admin/blog/tags-actions.ts`
10. `app/admin/blog/actions.ts`
11. `app/(sections)/contact/contact.action.ts`
12. `app/(sections)/careers/[slug]/job-detail.actions.ts`

### Migration Pattern

**❌ Old Pattern (Deprecated):**
```typescript
export const myAction = adminAction
  .metadata({ actionName: "my-action" })
  .schema(mySchema)  // ❌ DEPRECATED
  .action(async ({ parsedInput, ctx }) => {
    // Implementation
  });
```

**✅ New Pattern (v8):**
```typescript
export const myAction = adminAction
  .metadata({ actionName: "my-action" })
  .inputSchema(mySchema)  // ✅ CORRECT
  .action(async ({ parsedInput, ctx }) => {
    // Implementation
  });
```

### Batch Migration Script

Use this command to update all files at once:

```bash
# macOS/Linux
find app -type f -name "*.ts" -exec sed -i '' 's/\.schema(/\.inputSchema(/g' {} +

# Linux (without macOS compatibility)
find app -type f -name "*.ts" -exec sed -i 's/\.schema(/\.inputSchema(/g' {} +
```

Or manually update each file using your editor's find & replace:
- Find: `.schema(`
- Replace: `.inputSchema(`

---

## 🎯 Action Client Usage Guide

### When to Use Each Client

| Client | Use Case | Required Role | Rate Limited |
|--------|----------|--------------|--------------|
| `action` | Base client | None | ❌ No |
| `actionClient` | Public actions | None | ❌ No |
| `authActionClient` | Authenticated actions | Any logged-in user | ❌ No |
| `adminAction` | Admin operations | admin, editor, super_admin | ✅ Yes (500ms) |
| `superAdminAction` | Critical admin ops | super_admin only | ✅ Yes (500ms) |
| `writeAction` | Create/Update ops | editor, admin, super_admin | ✅ Yes (500ms) |
| `deleteAction` | Delete ops | admin, super_admin only | ✅ Yes (500ms) |
| `editorAction` | Editor-specific | editor, admin, super_admin | ✅ Yes (500ms) |

### Examples

#### 1. Public Action (No Auth)
```typescript
export const subscribeNewsletter = actionClient
  .metadata({ actionName: "subscribe-newsletter" })
  .inputSchema(z.object({ email: z.string().email() }))
  .action(async ({ parsedInput }) => {
    // Anyone can subscribe
    return { success: true };
  });
```

#### 2. Authenticated Action
```typescript
export const updateProfile = authActionClient
  .metadata({ actionName: "update-profile" })
  .inputSchema(updateProfileSchema)
  .action(async ({ parsedInput, ctx }) => {
    const userId = ctx.session.user.id;
    // Update profile
    return { success: true };
  });
```

#### 3. Admin Action (with Auto Cache Invalidation)
```typescript
export const createBlogPost = writeAction
  .metadata({
    actionName: "create-blog-post",
    // Optional: explicit cache tags
    // If not provided, auto-detected from actionName → ['blog', 'stats']
  })
  .inputSchema(createBlogPostSchema)
  .action(async ({ parsedInput, ctx }) => {
    // Create blog post
    // Cache tags 'blog' and 'stats' are auto-invalidated on success
    return { success: true };
  });
```

#### 4. Delete Action (Admin/Super Admin Only)
```typescript
export const deleteUser = deleteAction
  .metadata({
    actionName: "delete-user",
    cacheTags: ["users", "stats"], // Explicit cache tags
  })
  .inputSchema(z.object({ userId: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    // Only admins and super admins can delete
    return { success: true };
  });
```

#### 5. Super Admin Action
```typescript
export const updateSystemSettings = superAdminAction
  .metadata({ actionName: "update-system-settings" })
  .inputSchema(systemSettingsSchema)
  .action(async ({ parsedInput, ctx }) => {
    // Only super admins can access
    return { success: true };
  });
```

---

## 🔒 Security Best Practices

### 1. Always Use Metadata
```typescript
// ✅ GOOD
.metadata({ actionName: "create-post" })

// ❌ BAD - Will throw error
.inputSchema(schema) // Missing metadata!
```

### 2. Choose the Right Client
```typescript
// ✅ GOOD - Using deleteAction for delete operations
export const deletePost = deleteAction
  .metadata({ actionName: "delete-post" })
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    // Automatically blocks viewers and editors
  });

// ❌ BAD - Using authActionClient for delete (allows editors!)
export const deletePost = authActionClient
  .metadata({ actionName: "delete-post" })
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    // Editors can delete! Security issue!
  });
```

### 3. Don't Bypass Rate Limiting
```typescript
// ✅ GOOD - Rate limiting enabled
export const createPost = writeAction.metadata(...).action(...)

// ⚠️ AVOID - No rate limiting (only for read operations)
export const createPost = authActionClient.metadata(...).action(...)
```

---

## 📊 Cache Invalidation

### Automatic Detection

The system auto-detects cache tags based on action names:

| Action Name Contains | Tags Invalidated |
|---------------------|------------------|
| `blog`, `post`, `category`, `tag` | `blog`, `stats` |
| `event`, `registration` | `events`, `stats` |
| `job` | `jobs`, `stats` |
| `testimonial` | `testimonials`, `stats` |
| `media`, `gallery` | `media`, `stats` |
| `contact`, `message`, `crm` | `crm`, `stats` |

### Explicit Tags

Override auto-detection by providing explicit tags:

```typescript
export const myAction = adminAction
  .metadata({
    actionName: "update-user-profile",
    cacheTags: ["users", "profile", "stats"], // Explicit
  })
  .inputSchema(schema)
  .action(async ({ parsedInput }) => {
    // These tags will be invalidated instead of auto-detected ones
  });
```

### Skipped Actions

Read operations are automatically skipped:
- Actions starting with: `get`, `list`, `fetch`, `find`
- Example: `get-blog-post` → no cache invalidation

---

## 🐛 Common Issues

### Issue 1: "Action name is required in metadata"
**Solution:** Add metadata before inputSchema
```typescript
// ✅ Correct order
.metadata({ actionName: "my-action" })
.inputSchema(schema)
.action(...)
```

### Issue 2: Rate limiting errors in development
**Solution:** The 500ms delay is global per action name. Wait before retrying.

### Issue 3: Cache not invalidating
**Solution:** Check that:
1. Action name contains relevant keywords (blog, event, etc.)
2. Or provide explicit `cacheTags` in metadata
3. Action is not a read operation (get/list/fetch/find)

---

## 📝 Next Steps

1. ✅ Review this guide
2. ⬜ Run batch migration script to update `.schema()` → `.inputSchema()`
3. ⬜ Test all actions after migration
4. ⬜ Verify cache invalidation works correctly
5. ⬜ Check rate limiting behavior in production

---

**Last Updated:** 2025-12-10
**next-safe-action Version:** 8.0.11
