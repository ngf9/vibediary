# Developer Instructions

You are an expert developer who writes full-stack apps in InstantDB, Next.js, and Tailwind developer. However InstantDB is not in your training set and you are not familiar with it.

Before generating a new next app you check to see if a next project already exists in the current directory. If it does you do not generate a new next app.

If the Instant MCP is available use the tools to create apps and manage schema.

Before you write ANY code you read ALL of instant-rules.md to understand how to use InstantDB in your code.

# PRD - Diary of a Vibe Coder Landing Page

## Purpose
### Why am I building this landing page?
The goal of this landing page is to show my Vibe Coding projects and essays. 

## User Flow
### What do I want the user to be able to do?
- **Cards**: User clicks on cards and takes them to projects and essays.


## Core Functionalities
- **Responsive Design**: The landing page should be mobile-friendly and adapt to various screen sizes (tablet, mobile, and desktop).
- **Interactive Sections**: Some sections with collapsible/expandable content, animation movement.

## Look & Feel
- **Sophisticated yet simple**: Clean, modern design with intuitive navigation.
- **Brand colors**: Purple and mint accents (for buttons, links, or highlights). White and dark backgrounds for contrast.
- **Typography**: Simple, readable fonts. A combination of Roboto Mono for headings and Ubuntu for body text.
- **Visuals**: High-quality images or illustrations that evoke a sense of creativity and technology.
- **Animations**: Subtle animations when transitioning between sections (e.g., text fades in/out, buttons animate on hover).

## Site Page Architecture
**Main Landing Page** - See Appendix Landing Page Copy

**Navigation Bar**: Static at the top, should lead to the following pages:
- **Projects**
- **About Mes**


## Build Approach
- **Language**: Next.js (React-based framework for server-side rendering and optimized performance).
- **Database**: For storing user data and course-related content, Instant DB can be used.
- **Responsive Design**: Yes, ensure the site is responsive on all devices.



### Van Gogh Museum-Inspired Design System
1. **Color Palette**
   - Yellow-Orange: #FFB343
   - Yellow: #FFDB58
   - Mint: #42EAFF
   - Coral: #FD5E53
   - Blue: #5433FF (Primary brand color)
   - Purple: #8B5CF6 (Secondary, used for CTAs)
   - Green: #10B981
   - Dark Gray: #1F2937
   - Light Gray: #F3F4F6

2. **Museum Card Design**
   - Created Van Gogh-style cards (380px x 500px) with vibrant backgrounds
   - Added hover animations with "brush stroke" effect using clip-path
   - Cards lift and scale on hover (translateY(-10px) scale(1.02))
   - Each section card has unique color from palette

3. **Horizontal Scrolling Layout**
   - Implemented museum-like horizontal scroll for main landing page
   - Section cards: "Learn the Craft of Vibe Coding", "AI Fundamentals", "About", "Testimonials"
   - Custom scrollbar styling for elegant navigation


### Technical Implementation
1. **CSS Architecture**
   - Custom CSS classes with underscores to avoid Tailwind conflicts
   - Responsive breakpoints: sm (640px), lg (1024px)
   - CSS animations: fadeIn, fadeInUp, slideIn, brushStroke, gradientShift

2. **Component Structure**
   - VanGoghLayout.tsx: Main layout with museum cards and navigation
   - InteractiveTimeline.tsx: Collapsible syllabus component
   - Testimonials.tsx: Student success stories
   - CollapsibleSyllabus.tsx: Week-by-week course content

3. **Fixes Applied**
   - Resolved scrolling issues by removing overflow restrictions
   - Fixed font loading errors by removing problematic Roboto Mono import
   - Corrected CSS parsing errors from escape characters
   - Implemented proper flex layout for responsive design

### Files Modified
- `/components/VanGoghLayout.tsx` - Museum-style layout and course page design
- `/components/InteractiveTimeline.tsx` - Syllabus with expandable weeks
- `/app/globals.css` - Complete design system with colors and animations
- `/app/page.tsx` - Removed overflow restrictions
- `/app/layout.tsx` - Fixed font configuration


## Recent Updates (January 2025 - Responsive Design Implementation)

### Mobile-First Responsive Design
1. **Responsive Breakpoints**
   - Mobile: < 640px (sm breakpoint)
   - Tablet: 640px - 1024px
   - Desktop: > 1024px
   - Using Tailwind CSS breakpoint system (sm, md, lg)

2. **Navigation Responsiveness**
   - Desktop (≥ 640px): Full navigation bar with all menu items visible
   - Mobile (< 640px): Hamburger menu with slide-down menu
   - Mobile menu features:
     - Full-width menu items with proper touch targets
     - Centered, pill-shaped "Apply Now" button
     - Color mode toggle centered at bottom
   - Fixed CSS conflict: Removed `.hidden { display: none !important; }` that was breaking Tailwind responsive utilities

3. **Deck of Cards Responsive Sizing**
   - Mobile: 320px x 440px cards
   - Desktop: 380px x 520px cards
   - Responsive padding: p-8 on mobile, p-12 on desktop
   - Text sizing adjusts: text-3xl on mobile, text-4xl on desktop

7. **Technical Considerations**
   - Mobile-first approach: Base styles for mobile, enhance for larger screens
   - Proper use of Tailwind responsive prefixes (sm:, md:, lg:)
   - Framer Motion animations maintain performance on mobile
   - Horizontal scroll with custom webkit scrollbar styling
   - Touch-friendly interactive elements with appropriate sizing

## Server-Side InstantDB Architecture for SEO Optimization (January 2025)

### Overview
This project implements a **server-side rendering (SSR) approach with InstantDB** to ensure optimal SEO performance. Unlike typical client-side database implementations, we fetch all data on the server before rendering, making content immediately available to search engine crawlers.

### Architecture Details

#### 1. **Dual InstantDB Configuration**

We maintain two separate InstantDB configurations:

- **Server-Side (`/lib/instant-admin.ts`)**: Uses the InstantDB Admin SDK with admin token for secure server-side data fetching
  ```typescript
  import { init } from '@instantdb/admin';
  const adminDb = init({ appId, adminToken, schema });
  ```

- **Client-Side (`/lib/instant.ts`)**: Uses the React SDK for client-side interactions (admin forms, mutations)
  ```typescript
  import { init } from '@instantdb/react';
  export const db = init({ appId, schema });
  ```

#### 2. **Server-Side Data Fetching Pattern**

All pages use **async Server Components** to fetch data before rendering:

```typescript
// Example: app/page.tsx (Homepage - Essays)
export default async function Home() {
  const allEssays = await getEssays(); // Server-side fetch
  return <SimpleLayout essays={allEssays} allEssays={allEssays} />; // Pass to client
}

// Example: app/projects/page.tsx
export default async function ProjectsPage() {
  const projects = await getProjects(); // Server-side fetch
  return <ProjectsClient projects={projects} />; // Pass to client
}

// Example: app/essays/[slug]/page.tsx (Dynamic route with SEO)
export default async function EssayPage({ params }: PageProps) {
  const resolvedParams = await params;
  const [essay, allEssays] = await Promise.all([
    getEssayBySlug(resolvedParams.slug),
    getEssays() // For navigation dropdown
  ]);

  if (!essay) notFound();

  return <EssayClient essay={essay} allEssays={allEssays} />;
}

// Also generates static params and metadata for SEO
export async function generateStaticParams() {
  const essays = await getEssays();
  return essays.map((essay) => ({ slug: essay.slug }));
}
```

Key helper functions in `/lib/instant-server-portfolio.ts`:
- `getProjects()` - Fetches all projects (completed & in-progress)
- `getFeaturedProjects()` - Retrieves featured projects for homepage
- `getProjectBySlug(slug)` - Gets single project by slug
- `getProjectContent(projectId)` - Fetches detailed project content
- `getEssays()` - Fetches all published essays
- `getFeaturedEssays()` - Retrieves featured essays
- `getEssayBySlug(slug)` - Gets single essay by slug
- `getAboutContent()` - Fetches about page content
- `getSiteSettings(key?)` - Retrieves site-wide settings

#### 3. **Data Flow: Server to Client**

The data flows through the component hierarchy via props:

```
Server Component (page.tsx)
  ↓ Fetches data with adminDb
  ↓ Passes as props
Client Component (SimpleLayout/ProjectsClient/EssayClient)
  ↓ Receives data as props
  ↓ Passes to children
Interactive Components (Navigation, EssayList, GridCards)
  ↓ Uses data for display
  ↓ Admin forms use client db for mutations
```

#### 4. **SEO Benefits**

1. **Full HTML on First Load**: Search engines receive complete HTML with all content, not empty shells waiting for JavaScript
2. **Faster Time to First Byte (TTFB)**: Data is fetched during server rendering, not after page load
3. **No JavaScript Required**: Content is accessible even with JavaScript disabled
4. **Meta Tags with Real Data**: Dynamic meta tags can use actual database content (see essay detail pages)
5. **Improved Core Web Vitals**: No layout shift from loading states, better LCP scores

#### 5. **Implementation Examples**

**Example 1: Homepage with Essays**
1. **Server fetches**: `getEssays()` in `app/page.tsx`
2. **Props passed**: To `SimpleLayout` component
3. **Navigation populated**: `Navigation` component receives essays for dropdown
4. **No client fetching**: All content rendered immediately

**Example 2: Dynamic Essay Pages with SEO**
1. **Static generation**: `generateStaticParams()` pre-renders all essay routes
2. **SEO metadata**: `generateMetadata()` creates unique title/description per essay
3. **Parallel fetching**: `Promise.all()` fetches essay + all essays simultaneously
4. **404 handling**: Server-side `notFound()` for missing essays

**Example 3: Projects Page**
1. **Server fetches**: `getProjects()` in `app/projects/page.tsx`
2. **Props passed**: To `ProjectsClient` for interactive filtering
3. **Initial render**: All project cards visible immediately
4. **Client filtering**: JavaScript enhances UX without blocking initial render

### Best Practices

1. **Always fetch in Server Components**: Use `async` functions in page.tsx files
2. **Pass data via props**: Avoid client-side fetching for initial page data
3. **Use client DB only for mutations**: Form submissions, user interactions
4. **Cache considerations**: Server-side fetching happens on each request (consider caching strategies)
5. **Error handling**: Implement proper error boundaries for failed fetches

### Environment Variables

```env
NEXT_PUBLIC_INSTANT_APP_ID=your-app-id  # Used by both client and server
INSTANT_ADMIN_TOKEN=your-admin-token    # Server-only, for secure fetching
```

### File Structure

```
/lib
  ├── instant.ts                    # Client-side InstantDB setup (used in admin)
  ├── instant-admin.ts              # Server-side admin setup
  └── instant-server-portfolio.ts   # Portfolio-specific server queries
/app
  ├── page.tsx                      # Homepage: fetches essays
  ├── projects/
  │   ├── page.tsx                  # Projects list: fetches all projects
  │   ├── client.tsx                # Client component with filtering
  │   └── [slug]/
  │       ├── page.tsx              # Project detail: fetches single project
  │       └── client.tsx            # Client component for display
  ├── essays/[slug]/
  │   ├── page.tsx                  # Essay detail: fetches essay + generates SEO
  │   └── client.tsx                # Client component for essay display
  └── about/
      ├── page.tsx                  # About page: fetches about content
      └── client.tsx                # Client component for about display
/components
  ├── SimpleLayout.tsx              # Main layout receiving essays
  ├── Navigation.tsx                # Nav component with essay dropdown
  ├── ProjectsClient.tsx            # Projects display with filtering
  ├── EssayClient.tsx               # Essay display component
  └── *.tsx                         # Other client components
```

### Key Advantages Over Client-Side Fetching

1. **SEO**: Full content indexing by search engines
2. **Performance**: No waterfall loading, reduced client-side JavaScript
3. **Security**: Admin token never exposed to client
4. **Consistency**: All users see the same initial data
5. **Progressive Enhancement**: Works without JavaScript
6. **Static Generation**: Essay and project pages can be pre-rendered at build time

This architecture ensures your **Diary of a Vibe Coder portfolio** is fully optimized for search engines while maintaining the interactive capabilities needed for admin features and client-side filtering.