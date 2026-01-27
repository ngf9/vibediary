# Plan: Add InstantDB Storage for Image Uploads in Admin CMS

## Summary

Replace the current manual image workflow (adding files to `/public/`) with InstantDB Storage uploads directly from the admin CMS. All image fields across essays, projects, about, site settings, and the markdown editor will support drag-and-drop file uploads. Existing `/public/` images remain untouched.

**Approach**: Upload files via `db.storage.uploadFile()`, get back the S3 URL, and store that URL string in existing fields. No changes to public-facing rendering — image fields stay as strings.

---

## Step 1: Add `$files` entity to schema

**File**: `instant.schema.portfolio.ts`

Add to the `entities` block:
```ts
$files: i.entity({
  path: i.string().unique().indexed(),
  url: i.string(),
}),
```

Then push schema via Instant MCP `push-schema` tool.

---

## Step 2: Create permissions file

**File**: `instant.perms.ts` (new file)

```ts
export default {
  "$files": {
    "allow": {
      "view": "true",           // Anyone can view (needed for public site)
      "create": "isLoggedIn",   // Only admin can upload
      "delete": "isLoggedIn",   // Only admin can delete
    },
    "bind": ["isLoggedIn", "auth.id != null"]
  }
};
```

Then push via Instant MCP `push-perms` tool.

---

## Step 3: Rewrite `ImageUploader` component (core change)

**File**: `components/admin/ImageUploader.tsx`

Changes:
1. Import `db` from `@/lib/instant`
2. Add `storagePath?: string` prop (folder prefix, e.g. `'essays/thumbnails'`)
3. Replace `handleFile` — swap base64 `FileReader` logic with:
   - Generate unique path: `${storagePath}/${timestamp}-${sanitizedFilename}`
   - Call `db.storage.uploadFile(path, file)`
   - Use `db.queryOnce({ $files: { $: { where: { path } } } })` to get the URL
   - Call `onChange(url)` with the S3 URL
4. Enhance `handleClear` — if value is an InstantDB URL (`includes('instant-storage')`), delete the file via `db.storage.delete(path)`

The URL mode stays unchanged — users can still paste external URLs.

---

## Step 4: Replace text inputs with `ImageUploader` in admin forms

### 4A. Essay admin
**File**: `app/admin/essays/[slug]/page.tsx`
- Replace `<input type="text">` for **thumbnail** with `<ImageUploader storagePath="essays/thumbnails" aspectRatio="16:9" />`
- Replace `<input type="text">` for **heroImage** with `<ImageUploader storagePath="essays/heroes" aspectRatio="16:9" />`

### 4B. Project admin
**File**: `app/admin/projects/[slug]/page.tsx`
- Replace **thumbnail** text input with `<ImageUploader storagePath="projects/thumbnails" aspectRatio="16:9" />`
- Replace **coverImage** text input with `<ImageUploader storagePath="projects/covers" aspectRatio="16:9" />`

### 4C. Project Content admin (gallery)
**File**: `app/admin/project-content/page.tsx`
- Replace the gallery URL text input with `<ImageUploader storagePath="projects/gallery" />` that appends the URL to the gallery array on change

### 4D. About admin
**File**: `app/admin/about/page.tsx`
- Replace **profileImage** text input + manual preview with `<ImageUploader storagePath="about/profile" aspectRatio="square" />`
- Replace **timelineImage** text input + manual preview with `<ImageUploader storagePath="about/timeline" aspectRatio="16:9" />`

### 4E. Site Settings admin
**File**: `app/admin/site-settings/page.tsx`
- Replace **OG Image** text input with `<ImageUploader storagePath="site/og" aspectRatio="16:9" />`

---

## Step 5: Add upload to markdown editor's image helper

**File**: `components/admin/SimpleMarkdownEditor.tsx`

Changes:
1. Import `db` from `@/lib/instant` and `Upload`, `Loader2` from lucide-react
2. Add upload state (`isUploading`) and a hidden file input ref
3. Add `handleImageUpload(file)` function:
   - Upload to `markdown-images/${timestamp}-${filename}`
   - Get URL via `db.queryOnce`
   - Prompt for alt text, then call `insertImage(url, altText)`
4. Add an upload area in the image helper panel (above the existing "Available Images" gallery)
5. Add a "Recently Uploaded" grid below the hardcoded gallery, queried via `db.useQuery({ $files: { $: { order: { serverCreatedAt: 'desc' }, limit: 12 } } })`

---

## Step 6: SectionEditor (free upgrade)

**File**: `components/admin/SectionEditor.tsx`

Already imports and uses `ImageUploader`. After Step 3, it gets upload capability automatically. Only optional change: pass `storagePath` props to ImageUploader instances.

---

## Files to modify (in order)

| # | File | Change |
|---|------|--------|
| 1 | `instant.schema.portfolio.ts` | Add `$files` entity |
| 2 | `instant.perms.ts` (new) | Create permissions for `$files` |
| 3 | `components/admin/ImageUploader.tsx` | Wire up `db.storage.uploadFile` |
| 4 | `app/admin/essays/[slug]/page.tsx` | Replace text inputs with ImageUploader |
| 5 | `app/admin/projects/[slug]/page.tsx` | Replace text inputs with ImageUploader |
| 6 | `app/admin/project-content/page.tsx` | Replace gallery input with ImageUploader |
| 7 | `app/admin/about/page.tsx` | Replace text inputs with ImageUploader |
| 8 | `app/admin/site-settings/page.tsx` | Replace OG image input with ImageUploader |
| 9 | `components/admin/SimpleMarkdownEditor.tsx` | Add upload + recently uploaded gallery |
| 10 | `components/admin/SectionEditor.tsx` | Add storagePath props (optional) |

---

## Verification

1. **Schema push**: Confirm `$files` entity accepted by InstantDB
2. **Permissions push**: Confirm perms applied
3. **Upload test**: In essay admin, upload a thumbnail image → verify S3 URL saved to database
4. **Public display test**: View the essay on the public site (unauthenticated) → verify image loads from S3 URL
5. **Backward compat**: Existing essays with `/public/` image paths still render correctly
6. **Markdown upload**: In essay editor, use image toolbar to upload → verify markdown syntax inserted with S3 URL and image renders in preview
7. **Delete test**: Clear an uploaded image → verify file removed from InstantDB storage
