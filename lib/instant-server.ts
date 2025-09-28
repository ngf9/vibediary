import { adminDb } from '@/lib/instant-admin';

// Fetch page content for a specific course
export async function getPageContent(pageId: string) {
  const data = await adminDb.query({
    coursePageContent: {
      $: {
        where: {
          pageId: pageId,
          isActive: true
        }
      }
    }
  });

  return data.coursePageContent?.[0] || null;
}

// Fetch syllabus for a specific course  
export async function getSyllabus(courseId: string) {
  const data = await adminDb.query({
    syllabus: {
      $: {
        where: {
          courseId: courseId,
          isActive: true
        },
        order: {
          weekNumber: 'asc'
        }
      }
    }
  });

  return data.syllabus || [];
}

// Fetch all active cohort dates
export async function getAllCohortDates() {
  const data = await adminDb.query({
    cohortDates: {
      $: {
        where: {
          isActive: true
        },
        order: {
          createdAt: 'desc'
        }
      }
    }
  });

  return data.cohortDates || [];
}

// Fetch cohort dates for a specific course
export async function getCohortDates(courseId: string) {
  const data = await adminDb.query({
    cohortDates: {
      $: {
        where: {
          courseId: courseId,
          isActive: true
        },
        order: {
          createdAt: 'desc'
        }
      }
    }
  });

  return data.cohortDates?.[0] || null;
}

// Fetch testimonials for a specific course
export async function getTestimonials(course?: string) {
  const whereClause = course ? { course } : {};

  const data = await adminDb.query({
    testimonials: {
      $: {
        where: whereClause,
        order: {
          createdAt: 'desc'
        }
      }
    }
  });

  return data.testimonials || [];
}

// Fetch about page content
export async function getAboutPageContent() {
  const data = await adminDb.query({
    aboutPageContent: {
      $: {
        where: {
          pageId: 'about',
          isActive: true
        }
      }
    }
  });

  return data.aboutPageContent?.[0] || null;
}

// Fetch Our Story statistics
export async function getOurStoryStats() {
  const data = await adminDb.query({
    ourStoryStats: {
      $: {
        where: {
          isActive: true
        },
        order: {
          sortOrder: 'asc'
        }
      }
    }
  });

  return data.ourStoryStats || [];
}

// Fetch Why It Works features
export async function getWhyItWorksFeatures() {
  const data = await adminDb.query({
    whyItWorks: {
      $: {
        where: {
          isActive: true
        },
        order: {
          sortOrder: 'asc'
        }
      }
    }
  });

  return data.whyItWorks || [];
}