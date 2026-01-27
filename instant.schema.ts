import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),
    aboutContent: i.entity({
      bio: i.string().optional(),
      bioJson: i.json().optional(),
      contact: i.json().optional(),
      createdAt: i.number().optional(),
      currentFocus: i.string().optional(),
      currentFocusJson: i.json().optional(),
      isActive: i.boolean().optional(),
      journey: i.json().optional(),
      pageId: i.string().unique().indexed().optional(),
      profileImage: i.string().optional(),
      skills: i.json().optional(),
      timelineImage: i.string().optional(),
      updatedAt: i.number().optional(),
    }),
    enrollments: i.entity({
      cohort: i.string().optional(),
      course: i.string().optional(),
      createdAt: i.number().optional(),
      email: i.string().optional(),
      message: i.string().optional(),
      name: i.string().optional(),
    }),
    essays: i.entity({
      content: i.string().optional(),
      contentJson: i.json().optional(),
      coverImage: i.string().optional(),
      createdAt: i.number().indexed().optional(),
      editorMode: i.string().optional(),
      excerpt: i.string().optional(),
      featured: i.boolean().indexed().optional(),
      heroImage: i.string().optional(),
      heroSubtitle: i.string().optional(),
      heroTitle: i.string().optional(),
      images: i.any().optional(),
      published: i.boolean().indexed().optional(),
      publishedAt: i.number().indexed().optional(),
      readTime: i.number().optional(),
      sections: i.json().optional(),
      slug: i.string().unique().indexed().optional(),
      subtitle: i.string().optional(),
      tags: i.json().optional(),
      thumbnail: i.string().optional(),
      title: i.string().optional(),
      updatedAt: i.number().optional(),
    }),
    projectContent: i.entity({
      challenges: i.json().optional(),
      createdAt: i.number().optional(),
      gallery: i.json().optional(),
      learnings: i.json().optional(),
      overview: i.string().optional(),
      projectId: i.string().unique().indexed().optional(),
      solutions: i.json().optional(),
      techDetails: i.json().optional(),
      updatedAt: i.number().optional(),
    }),
    projects: i.entity({
      color: i.string().optional(),
      coverImage: i.string().optional(),
      createdAt: i.number().indexed().optional(),
      description: i.string().optional(),
      featured: i.boolean().indexed().optional(),
      githubUrl: i.string().optional(),
      liveUrl: i.string().optional(),
      publishedAt: i.number().optional(),
      slug: i.string().unique().indexed().optional(),
      sortOrder: i.number().indexed().optional(),
      status: i.string().optional(),
      subtitle: i.string().optional(),
      technologies: i.any().optional(),
      thumbnail: i.string().optional(),
      title: i.string().optional(),
      updatedAt: i.number().optional(),
    }),
    siteSettings: i.entity({
      createdAt: i.number().optional(),
      key: i.string().unique().indexed().optional(),
      updatedAt: i.number().optional(),
      value: i.any().optional(),
    }),
  },
  links: {
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
  },
  rooms: {
    sitePresence: {
      presence: i.entity({
        joinedAt: i.number(),
        name: i.string().optional(),
      }),
    },
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
