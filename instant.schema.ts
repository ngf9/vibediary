import { i } from '@instantdb/react';

// Define the schema using InstantDB's schema builder
const _schema = i.schema({
  entities: {
    enrollments: i.entity({
      email: i.string().indexed(),
      name: i.string(),
      course: i.string(), // 'ai-fundamentals' | 'vibe-coding'
      cohort: i.string(),
      message: i.string().optional(),
      createdAt: i.number().indexed(),
    }),
    testimonials: i.entity({
      name: i.string(),
      role: i.string(),
      company: i.string().optional(),
      testimonial: i.string(),
      course: i.string(), // 'ai-fundamentals' | 'vibe-coding'
      cohort: i.string(),
      rating: i.number(),
      createdAt: i.number().indexed(),
    }),
    waitlist: i.entity({
      email: i.string().indexed().unique(),
      name: i.string().optional(),
      course: i.string().optional(), // 'ai-fundamentals' | 'vibe-coding' | 'both'
      source: i.string().optional(),
      createdAt: i.number().indexed(),
    }),
    cohortDates: i.entity({
      courseId: i.string().indexed(), // 'ai-fundamentals' | 'vibe-coding'
      startDate: i.string(),
      title: i.string().optional(),
      subtitle: i.string().optional(),
      description: i.string().optional(),
      isActive: i.boolean().indexed(),
      updatedAt: i.number(),
      createdAt: i.number().indexed(),
    }),
    coursePageContent: i.entity({
      pageId: i.string().indexed().unique(), // 'vibe-coding' | 'ai-fundamentals'
      heroTitle: i.string().optional(),
      heroSubtitle: i.string().optional(),
      letterContent: i.any().optional(), // JSON object for structured content
      isActive: i.boolean().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number(),
    }),
    syllabus: i.entity({
      courseId: i.string().indexed(), // 'vibe-coding' | 'ai-fundamentals'
      weekNumber: i.number().indexed(), // 0, 1, 2, 3, 4, 5, 6
      weekName: i.string(), // e.g., "Week 0"
      title: i.string(), // e.g., "Prepare Your PRD"
      description: i.string(),
      learningOutcome: i.string(),
      tools: i.any().optional(), // JSON array of tool names
      color: i.string(), // e.g., "bg-yellow-orange"
      sortOrder: i.number(),
      isActive: i.boolean().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number(),
    }),
    formSubmissions: i.entity({
      fullName: i.string(),
      email: i.string().indexed(),
      role: i.string(),
      timezone: i.string(),
      classInterest: i.string(),
      whatYouWantToBuild: i.string(),
      submittedAt: i.number().indexed(),
    }),
    aboutPageContent: i.entity({
      pageId: i.string().indexed().unique(), // 'about'
      philosophyTitle: i.string().optional(),
      philosophyContent: i.any().optional(), // JSON array of paragraph strings
      milestones: i.any().optional(), // JSON array of milestone objects
      teamMembers: i.any().optional(), // JSON array of team member objects
      isActive: i.boolean().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number(),
    }),
    ourStoryStats: i.entity({
      label: i.string(), // "Years", "Cohorts", "Students", "Completion Rate"
      value: i.string(), // "3", "11", "170+", "100%"
      description: i.string(), // Full description text
      iconName: i.string(), // "Calendar", "GraduationCap", "Users", "Trophy"
      color: i.string(), // Hex color like "#FFB343"
      sortOrder: i.number().indexed(), // For ordering the stats
      isActive: i.boolean().indexed(),
      createdAt: i.number().indexed(),
      updatedAt: i.number(),
    }),
    whyItWorks: i.entity({
      iconName: i.string(), // Lucide icon name: 'FlaskConical', 'Users', etc.
      title: i.string(), // Feature title
      description: i.string(), // Feature description text
      highlightWords: i.any().optional(), // JSON array of words/phrases to highlight
      color: i.string().optional(), // Optional color field for compatibility
      sortOrder: i.number().indexed(), // Display order
      isActive: i.boolean().indexed(), // Active status
      createdAt: i.number().indexed(),
      updatedAt: i.number(),
    }),
  },
  links: {},
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;