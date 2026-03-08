import { adminDb } from '@/lib/instant-admin';

// --- Storage Path Resolution Utilities ---

/**
 * Returns true if a string is an InstantDB storage path (not an external URL or local /public/ path).
 * Storage paths don't start with 'http' or '/'.
 */
export function isStoragePath(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return !value.startsWith('http') && !value.startsWith('/');
}

/**
 * Returns true if a string is an expired/active InstantDB S3 URL.
 */
function isInstantStorageUrl(value: string): boolean {
  return typeof value === 'string' && value.includes('instant-storage');
}

/**
 * Returns true if a value needs resolution (storage path or instant-storage URL).
 */
function needsResolution(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return isStoragePath(value) || isInstantStorageUrl(value);
}

// Cached $files lookup — fetched once per request cycle
let _allFilesCache: Array<{ path: string; url: string }> | null = null;

async function getAllFiles(): Promise<Array<{ path: string; url: string }>> {
  if (_allFilesCache) return _allFilesCache;
  const data = await adminDb.query({ $files: {} });
  _allFilesCache = (data.$files || []) as Array<{ path: string; url: string }>;
  // Clear cache after 5 seconds so subsequent requests get fresh data
  setTimeout(() => { _allFilesCache = null; }, 5000);
  return _allFilesCache;
}

/**
 * Resolves a mix of storage paths and expired S3 URLs to fresh URLs.
 * For paths: queries $files by path.
 * For S3 URLs: matches by extracting the pathname from the URL.
 */
async function resolveImageValues(values: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(values.filter(needsResolution))];
  if (unique.length === 0) return {};

  const allFiles = await getAllFiles();
  const map: Record<string, string> = {};

  for (const val of unique) {
    if (isStoragePath(val)) {
      // Match by path directly
      const file = allFiles.find(f => f.path === val);
      if (file?.url) map[val] = file.url;
    } else if (isInstantStorageUrl(val)) {
      // Match by comparing URL pathnames (query params differ between signed URLs)
      try {
        const valPathname = new URL(val).pathname;
        const file = allFiles.find(f => {
          try { return new URL(f.url).pathname === valPathname; } catch { return false; }
        });
        if (file?.url) map[val] = file.url;
      } catch {
        // If URL parsing fails, try exact match
        const file = allFiles.find(f => f.url === val);
        if (file?.url) map[val] = file.url;
      }
    }
  }

  return map;
}

/**
 * Takes an entity object and a list of field names,
 * resolves any storage paths or expired S3 URLs in those fields to fresh URLs.
 */
async function resolveEntityImages<T extends Record<string, any>>(
  entity: T,
  imageFields: string[]
): Promise<T> {
  const valuesToResolve: string[] = [];

  for (const field of imageFields) {
    const val = entity[field];
    if (typeof val === 'string' && needsResolution(val)) {
      valuesToResolve.push(val);
    }
  }

  if (valuesToResolve.length === 0) return entity;

  const urlMap = await resolveImageValues(valuesToResolve);
  const resolved = { ...entity };

  for (const field of imageFields) {
    const val = resolved[field];
    if (typeof val === 'string' && needsResolution(val) && urlMap[val]) {
      (resolved as any)[field] = urlMap[val];
    }
  }

  return resolved;
}

/**
 * Batch resolve images for an array of entities.
 */
async function resolveEntitiesImages<T extends Record<string, any>>(
  entities: T[],
  imageFields: string[]
): Promise<T[]> {
  if (entities.length === 0) return entities;

  const valuesToResolve: string[] = [];

  for (const entity of entities) {
    for (const field of imageFields) {
      const val = entity[field];
      if (typeof val === 'string' && needsResolution(val)) {
        valuesToResolve.push(val);
      }
    }
  }

  if (valuesToResolve.length === 0) return entities;

  const urlMap = await resolveImageValues(valuesToResolve);

  return entities.map(entity => {
    const resolved = { ...entity };
    for (const field of imageFields) {
      const val = resolved[field];
      if (typeof val === 'string' && needsResolution(val) && urlMap[val]) {
        (resolved as any)[field] = urlMap[val];
      }
    }
    return resolved;
  });
}

/**
 * Scans markdown content for image references and replaces
 * storage paths or expired S3 URLs with fresh URLs.
 */
function resolveMarkdownImages(content: string, urlMap: Record<string, string>): string {
  if (!content) return content;

  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    if (needsResolution(src) && urlMap[src]) {
      return `![${alt}](${urlMap[src]})`;
    }
    return match;
  });
}

/**
 * Extract values from markdown content that need resolution.
 */
function extractMarkdownResolvableValues(content: string): string[] {
  if (!content) return [];
  const values: string[] = [];
  const regex = /!\[[^\]]*\]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (needsResolution(match[1])) {
      values.push(match[1]);
    }
  }
  return values;
}

// --- Data Fetching Functions ---

const PROJECT_IMAGE_FIELDS = ['thumbnail', 'coverImage'];
const ESSAY_IMAGE_FIELDS = ['thumbnail', 'heroImage', 'coverImage'];
const ABOUT_IMAGE_FIELDS = ['profileImage', 'timelineImage'];

// Fetch all projects
export async function getProjects() {
  const data = await adminDb.query({
    projects: {
      $: {
        where: {
          status: { $in: ['completed', 'in-progress'] }
        },
        order: {
          sortOrder: 'asc'
        }
      }
    }
  });

  return resolveEntitiesImages(data.projects || [], PROJECT_IMAGE_FIELDS);
}

// Fetch featured projects for homepage
export async function getFeaturedProjects() {
  const data = await adminDb.query({
    projects: {
      $: {
        where: {
          featured: true,
          status: { $in: ['completed', 'in-progress'] }
        },
        order: {
          sortOrder: 'asc'
        },
        limit: 2
      }
    }
  });

  return resolveEntitiesImages(data.projects || [], PROJECT_IMAGE_FIELDS);
}

// Fetch a single project by slug
export async function getProjectBySlug(slug: string) {
  const data = await adminDb.query({
    projects: {
      $: {
        where: {
          slug: slug
        }
      }
    }
  });

  const project = data.projects?.[0] || null;
  if (!project) return null;
  return resolveEntityImages(project, PROJECT_IMAGE_FIELDS);
}

// Fetch project content
export async function getProjectContent(projectId: string) {
  const data = await adminDb.query({
    projectContent: {
      $: {
        where: {
          projectId: projectId
        }
      }
    }
  });

  const content = data.projectContent?.[0] || null;
  if (!content) return null;

  // Resolve gallery array if it contains storage paths or expired URLs
  if (Array.isArray(content.gallery)) {
    const galleryValues = content.gallery.filter((url: string) => needsResolution(url));
    if (galleryValues.length > 0) {
      const urlMap = await resolveImageValues(galleryValues);
      content.gallery = content.gallery.map((url: string) =>
        needsResolution(url) && urlMap[url] ? urlMap[url] : url
      );
    }
  }

  return content;
}

// Fetch all essays
export async function getEssays() {
  const data = await adminDb.query({
    essays: {
      $: {
        where: {
          published: true
        },
        order: {
          publishedAt: 'desc'
        }
      }
    }
  });

  return resolveEntitiesImages(data.essays || [], ESSAY_IMAGE_FIELDS);
}

// Fetch featured essays
export async function getFeaturedEssays() {
  const data = await adminDb.query({
    essays: {
      $: {
        where: {
          featured: true,
          published: true
        },
        order: {
          publishedAt: 'desc'
        },
        limit: 3
      }
    }
  });

  return resolveEntitiesImages(data.essays || [], ESSAY_IMAGE_FIELDS);
}

// Fetch essay by slug
export async function getEssayBySlug(slug: string) {
  const data = await adminDb.query({
    essays: {
      $: {
        where: {
          slug: slug,
          published: true
        }
      }
    }
  });

  const essay = data.essays?.[0] || null;
  if (!essay) return null;

  // Resolve image fields
  const resolved = await resolveEntityImages(essay, ESSAY_IMAGE_FIELDS);

  // Resolve markdown content images (both storage paths and expired S3 URLs)
  if (resolved.content) {
    const markdownValues = extractMarkdownResolvableValues(resolved.content);
    if (markdownValues.length > 0) {
      const urlMap = await resolveImageValues(markdownValues);
      resolved.content = resolveMarkdownImages(resolved.content, urlMap);
    }
  }

  return resolved;
}

// Fetch about page content
export async function getAboutContent() {
  const data = await adminDb.query({
    aboutContent: {
      $: {
        where: {
          pageId: 'about',
          isActive: true
        }
      }
    }
  });

  const content = data.aboutContent?.[0] || null;
  if (!content) return null;
  return resolveEntityImages(content, ABOUT_IMAGE_FIELDS);
}

// Fetch site settings
export async function getSiteSettings(key?: string) {
  if (key) {
    const data = await adminDb.query({
      siteSettings: {
        $: {
          where: {
            key: key
          }
        }
      }
    });
    return data.siteSettings?.[0] || null;
  }

  const data = await adminDb.query({
    siteSettings: {}
  });

  return data.siteSettings || [];
}
