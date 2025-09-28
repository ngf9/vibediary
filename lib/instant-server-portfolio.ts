import { adminDb } from '@/lib/instant-admin';

// Fetch all projects
export async function getProjects() {
  const data = await adminDb.query({
    projects: {
      $: {
        where: {
          status: { $in: ['completed', 'in-progress'] }
        },
        order: {
          sortOrder: 'asc',
          createdAt: 'desc'
        }
      }
    }
  });

  return data.projects || [];
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

  return data.projects || [];
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

  return data.projects?.[0] || null;
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

  return data.projectContent?.[0] || null;
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
          publishedAt: 'desc',
          createdAt: 'desc'
        }
      }
    }
  });

  return data.essays || [];
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

  return data.essays || [];
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

  return data.essays?.[0] || null;
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

  return data.aboutContent?.[0] || null;
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