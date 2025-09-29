import { i } from '@instantdb/react';

// Portfolio-focused schema for Diary of a Vibe Coder
const _schema = i.schema({
  entities: {
    // Main projects entity - showcases vibe coded projects
    projects: i.entity({
      slug: i.string().indexed().unique(), // URL-friendly identifier
      title: i.string(),
      subtitle: i.string().optional(),
      description: i.string(),
      thumbnail: i.string().optional(), // Card thumbnail image
      coverImage: i.string().optional(), // Hero/cover image
      technologies: i.any().optional(), // JSON array of tech stack
      githubUrl: i.string().optional(),
      liveUrl: i.string().optional(),
      status: i.string(), // 'completed' | 'in-progress' | 'planned'
      featured: i.boolean().indexed(),
      sortOrder: i.number().indexed(),
      color: i.string().optional(), // For card background color
      createdAt: i.number().indexed(),
      publishedAt: i.number().optional(),
      updatedAt: i.number(),
    }),

    // Essays about vibe coding experiences and learnings
    essays: i.entity({
      slug: i.string().indexed().unique(),
      title: i.string(),
      subtitle: i.string().optional(),
      excerpt: i.string(), // Short description for cards
      content: i.string(), // Markdown content as string
      sections: i.any().optional(), // Structured content sections with images
      editorMode: i.string().optional(), // 'simple' or 'advanced'
      thumbnail: i.string().optional(), // Card thumbnail image for homepage
      heroImage: i.string().optional(), // Hero image for essay page
      heroTitle: i.string().optional(), // Custom title for hero section
      heroSubtitle: i.string().optional(), // Custom subtitle for hero section
      coverImage: i.string().optional(), // Legacy field, keeping for compatibility
      images: i.any().optional(), // JSON array of image references used in essay
      tags: i.any().optional(), // JSON array of tags
      featured: i.boolean().indexed(),
      published: i.boolean().indexed(),
      readTime: i.number().optional(), // Reading time in minutes
      createdAt: i.number().indexed(),
      publishedAt: i.number().indexed().optional(),
      updatedAt: i.number(),
    }),

    // Detailed content for each project
    projectContent: i.entity({
      projectId: i.string().indexed().unique(), // Links to project slug
      overview: i.string(),
      challenges: i.any().optional(), // JSON array of challenges
      solutions: i.any().optional(), // JSON array of solutions
      learnings: i.any().optional(), // JSON array of key learnings
      techDetails: i.any().optional(), // JSON object with technical details
      gallery: i.any().optional(), // JSON array of image URLs
      createdAt: i.number(),
      updatedAt: i.number(),
    }),

    // About page content
    aboutContent: i.entity({
      pageId: i.string().indexed().unique(), // Should be 'about'
      bio: i.string(),
      journey: i.any().optional(), // JSON array of milestones
      skills: i.any().optional(), // JSON array of skills/tools
      currentFocus: i.string().optional(),
      contact: i.any().optional(), // JSON object with contact info
      isActive: i.boolean(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),

    // Global site settings
    siteSettings: i.entity({
      key: i.string().indexed().unique(),
      value: i.any(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
  },
  links: {},
});

// TypeScript helpers for better intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;