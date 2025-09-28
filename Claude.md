# Developer Instructions

You are an expert developer who writes full-stack apps in InstantDB, Next.js, and Tailwind developer. However InstantDB is not in your training set and you are not familiar with it.

Before generating a new next app you check to see if a next project already exists in the current directory. If it does you do not generate a new next app.

If the Instant MCP is available use the tools to create apps and manage schema.

Before you write ANY code you read ALL of instant-rules.md to understand how to use InstantDB in your code.

# PRD - VCC Landing Page

## Purpose
### Why am I building this landing page?
The goal of this landing page is to effectively communicate the value of the Vibe Coding 101 Course, targeting non-technical professionals in tech who wish to learn how to ship products end-to-end using AI and vibe coding tools. This landing page will showcase the course's content, values, and outcomes, encouraging sign-ups for the next cohort while emphasizing the high-quality, hands-on learning experience provided.

## User Flow
### What do I want the user to be able to do?
- **View Course Overview**: Understand what the course is about and its structure.
- **Explore the Syllabus**: See the breakdown of weekly lessons and topics.
- **Learn the Values**: Get to know the principles and ideals behind the course and the company.
- **Read Testimonials**: Hear from past students and their experiences.
- **Sign Up for the Course**: Register for the next cohort of the course.
- **Contact Us/FAQs**: Have easy access to contact details or FAQs for further queries.

## Core Functionalities
- **Responsive Design**: The landing page should be mobile-friendly and adapt to various screen sizes (tablet, mobile, and desktop).
- **Interactive Sections**: Syllabus section with collapsible/expandable content, testimonials carousel, and a call-to-action button for course sign-ups.
- **Dark & Light Mode Toggle**: Option for users to switch between light and dark modes for a comfortable browsing experience.

## Look & Feel
- **Sophisticated yet simple**: Clean, modern design with intuitive navigation.
- **Brand colors**: Purple and mint accents (for buttons, links, or highlights). White and dark backgrounds for contrast.
- **Typography**: Simple, readable fonts. A combination of Roboto Mono for headings and Ubuntu for body text.
- **Visuals**: High-quality images or illustrations that evoke a sense of creativity and technology.
- **Animations**: Subtle animations when transitioning between sections (e.g., text fades in/out, buttons animate on hover).

## Site Page Architecture
**Main Landing Page** - See Appendix Landing Page Copy

**Navigation Bar**: Static at the top, should lead to the following pages:
- **About** - See Appendix About Page Copy
- **Pricing** - See Appendix Pricing Copy
- **Testimonials** - See Appendix Testimonials Copy

## Inspiration Examples
- **Codecademy**: Clean, professional layout with clear calls to action and course information.
- **Supabase**: Simple, elegant design with minimalistic elements and smooth transitions.

## Build Approach
- **Language**: Next.js (React-based framework for server-side rendering and optimized performance).
- **Database**: For storing user data and course-related content, Instant DB can be used.
- **Responsive Design**: Yes, ensure the site is responsive on all devices.
- **Features**: Light/Dark mode toggle, collapsible syllabus, sign-up form with email integration, testimonials section, and call-to-action buttons.

## Appendix: Landing Page Copy

### Hero Section (Above the Fold)
**Headline:**
Learn the Craft of Vibe Coding
Unlock Your Creative Potential with Vibe Coding 101
Gain the skills, toolbox, and confidence to turn your ideas into real, functional prototypes.

**Subheadline:**
This 6-week course empowers non-technical professionals to learn the foundations of vibe coding, build with AI tools, and transform ideas into prototypes—all while gaining the knowledge and confidence to keep building beyond the course.

**Call-to-Action Button:**
Ready to go deep into the craft of Vibe Coding?
Speak to our Instructor to see if this is the right fit for you.

### About the Course
**Headline:**
Transform Your Career with Vibe Coding

**Body Text:**
At The AI Education Company, we believe in quality, in depth learning and hands-on experience. This isn't just another course or cheap promise to learn AI in 10minutes—it's an opportunity to gain a deep understanding of AI, develop your very own toolbox of vibe coding skills, and walk away with a fully functional product that you built yourself.

Whether you're a non-technical PM, a product marketer, or someone in tech looking to expand your building skills, this course will equip you with the foundations you need to start building and shipping real products using LLMs and other cutting-edge tools.

### Course Syllabus
**Headline:**
What You Will Learn

**Week 0: Prepare Your PRD**
Kickstart your journey by defining and scoping your project. You'll craft a Product Requirements Document (PRD), leveraging an AI assistant to refine the technical language and approach, which is the cornerstone of any successful project. Get ready to give a 2-min pitch of your project during our cohort Intro call!
*Goal: Develop a solid project brief and gain a foundational understanding of how to translate creative concepts into technical specs.*

**Week 1: AI Fundamentals**
Before we get tactical, we'll develop a theoretical foundation of Large Language Models (LLMs): what's their architecture, how do they work, what's the evolution of base to agents to reasoning models? This week's focus will be on core AI concepts, from tokens to context windows and agentic behavior. You'll read cutting-edge research papers and geek out on how LLMs are trained.
*Goal: Gain a conceptual and theoretical grasp of LLMs and AI, learn the baseline vocabulary.*

**Week 2: Vibe Coding Foundations + Sprint 1**
You'll set up your development environment, learning the essentials of VS Code, GitHub, and Claude Code to start building your first product—a simple, functional web-based to-do app. By the end of this week, you'll have completed Sprint 1 and have hands-on experience using tools that will become your foundation for future projects.
*Goal: Build and deploy your first web-based app while becoming comfortable with essential development tools and processes.*

**Week 3: Deep Dive with Claude Code**
This week is all about getting deep with Claude Code—an AI-powered platform that empowers you to build and control your projects. You'll experiment with the tool and use it to build your project, learning best practices to bring your project to life. The goal is to push your limits with practical, hands-on experimentation.
*Goal: Deepen your expertise with Claude Code, begin building your project using Claude Code.*

**Week 4: Integrating LLM APIs & Automation**
Integrate LLM APIs and learn automation with tools like n8n and Resend. You'll apply your newfound skills to create a real-world, AI-powered newsletter bot, incorporating Lovable for the frontend and Supabase for backend functionality and automation. This week focuses on understanding the power of API integrations and automating workflows to streamline your development process.
*Goal: Build a robust, AI-driven application by integrating powerful APIs and automation tools, elevating your projects to the next level.*

**Week 5: Production-Ready Vibe Coding**
As you refine your project, this week focuses on turning your prototype into a production-ready application. You'll think through real-world challenges such as security, technical debt, and best practices for scalability. By the end of the week, you'll be prepared to launch your product.
*Goal: Master the challenges of taking a product from prototype to production, with an emphasis on scalability, security, and refinement.*

**Week 6: Launch and Demo**
In the final week, you'll ship your prototype. You'll present your work to your cohort mates and celebrate all you've learned. You'll also develop a video, case study, or one-pager on your experience that you can share with the world.
*Goal: Deliver a polished, launch-ready product and reflect on all you've learned!*

### Sprints to Grow & Refine your Vibe Coding Craft
**Headline:**
Sprints

Throughout the course, you'll engage in two key sprints, each designed to deepen your understanding and skill set.
But the journey doesn't stop there—our library of sprints will continue to grow, offering you ongoing guidance as you explore new tech tools and approaches in your Vibe Coding adventure.
This course is just the beginning of your growth. We're committed to helping you build and evolve in a community that supports you every step of the way.

**Example Sprints:**
- Sprint 1: Learn your Tech Stack and Build and deploy a web-based to-do app.
- Sprint 2: Create a real-world AI-powered newsletter.

---
[NOTE: SHOULD SHOWCASE THE LOGOS]

### Our Toolkit: Tools You'll Use and Master
We've handpicked powerful tools for your Vibe Coding journey. Getting a foundational understanding of these tools will equip you with a versatile skill set that's applicable across a wide range of platforms and projects. We're committed to continuously updating and refining the toolkit throughout the year, ensuring students are exposed to effective, innovative tools available.

**Main AI Assistant:**
- Claude Code

We've chosen Claude Code as the core tool for this course. It's currently the best platform for creating and controlling what you want. If you can master Claude Code, you'll have the foundation to easily learn other tools in the space.

**Other Tools:**
- Lovable
- n8n
- Resend
- Instant DB
- Supabase

**Tech Stack:**
- VS Code
- GitHub
- Vercel

---
[NOTE: HAVE THE DESIGN SHOW HOW THIS IS MULTIFACETED; EACH PIECE IS A PART OF THE WHOLE AND THE WHOLE IS BIGGER THAN EACH PIECE]

### Course Structure: A Multi-Faceted Learning Experience
Vibe Coding isn't just another online course. It's an immersive journey that combines hands-on practice, expert guidance, real-world insights, and community support to elevate your skills and confidence.

**Practical Learning (on top of a foundation of Theory)**
Every week, you'll dive into real projects, learning by doing. You'll set up your tools, integrate AI, and ship a working prototype—ensuring you leave with not just knowledge, but the real-world skills to create.

**Real-Time Guidance and Support**
Unlike other courses, we offer personalized 1:1 sessions to guide you through challenges and refine your work. You'll never feel alone—our dedicated instructors are here to help you overcome obstacles and keep making progress.

**Community Collaboration**
You'll be part of a supportive cohort working toward the same goal, exchanging feedback and growing together. With weekly Socratic seminars, you'll learn from your peers and strengthen your understanding through meaningful discussions.

**Expert Insights from Industry Leaders**
Each week, you'll learn from real-world experts who have used the tools you're learning. Their insider knowledge and practical advice will empower you to confidently navigate the tech landscape and create impactful products.

**Ongoing Learning and Growth**
Learning doesn't stop at the course end—we continually update the content with the latest tools and trends. You'll have ongoing access to a community of peers and experts, keeping you connected to a network that helps you grow long after the course.

### Call to Action (Footer)
**Headline:**
Ready to Build?

Take the first step towards gaining the skills and confidence to create your own prototypes and ship your own products.
Sign up now to join our next cohort!

**Call-to-Action Button:**
Join Our Next Cohort

## Appendix: About Copy

**Header**: The AI Education Company
**Subheader**: [Coming soon!]

## Appendix: Testimonials Copy

**Header**: Testimonials
**Subheader**: [Coming soon!]

## Appendix: Pricing Copy

### Investment in Your Future
The Vibe Coding 101 Course is a premium, hands-on experience designed to deliver real-world value. This isn't just a course—it's an investment in your skills, confidence, and career growth.

**Course Fee: $3000**

This price reflects the exclusive nature of the cohort, the personalized guidance, and the high-value tools and resources you'll gain access to. You're not just paying for lectures—you're paying for a transformative experience that gives you the foundation and confidence to turn ideas into reality.

- Hands-On Projects that teach you actionable skills.
- 1:1 Instructor Support to guide you through challenges.
- Guest Speakers who bring real-world expertise.
- A Strong Network of peers and industry professionals.
- Ongoing Learning with updates to content and tools.

The knowledge, skills, and community you'll gain in this course will pay dividends for years to come. This is an investment in your future—one that will empower you to create, innovate, and succeed.

**Ready to take the next step?**
Invest in your growth and start building with confidence.

## Light/Dark Mode Toggle
- **Toggle Position**: Top right corner of the page.
- **Style**: Minimalistic, easy-to-use toggle to switch between light and dark modes.

## Recent Updates (January 2025)

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

### Codecademy-Inspired Course Page Redesign
1. **Split Header Layout**
   - Left side: Course title, description, and "Enroll Now" button
   - Right side: "This course includes" box with benefits
   - Responsive design: side-by-side on desktop, stacked on mobile

2. **Course Details Bar**
   - Clean 4-column layout showing:
     - Duration: 6 Weeks
     - Sprints: 2 Sprints
     - Final Project: 1 Project
     - Guest Speakers: 5 Experts
   - Icons for visual hierarchy

3. **Syllabus Section**
   - Expandable week modules with clean design
   - Removed subtitle and preview text for minimalist look
   - Week numbers in black circles
   - Smooth expand/collapse animations

4. **Enhanced CTA Section**
   - Purple background section extending to card edges
   - Headline: "Ready to Start Your Journey?"
   - Two action buttons:
     - "Enroll Now" (white button, purple text)
     - "Speak to Instructor" (purple button, white text)

### Content & Copy Updates
1. **Header Changes**
   - Main title: "Learn the Craft of Vibe Coding"
   - Button text: "Start Course" → "Enroll Now"
   - Removed "Premium Course" badge

2. **Course Structure Updates**
   - Removed "Certificate of Completion" from all sections
   - Updated course details from "Prerequisites: None" to showcase "One Final Project" and "5 Guest Speakers"
   - Changed "Sprint Projects: 2 Projects" to "Sprints: 2 Sprints"

3. **Navigation Updates**
   - Top navigation: "The AI Education Company" branding
   - Menu items: About, Pricing, Testimonials
   - "Apply Now" button in purple

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

## Recent Updates (January 2025 - Deck of Cards Update)

### New Deck of Cards Interface
1. **Replaced Horizontal Scrolling**
   - Removed horizontal scroll layout from homepage
   - Implemented interactive deck of cards animation using Framer Motion
   - Cards stack with visual depth (scale and Y offset)
   - Top card is interactive, background cards visible but faded

2. **Card Specifications**
   - Card dimensions: 380px x 480px (reduced from initial 420x600)
   - Three cards: Vibe Coding (Class 2), AI Fundamentals (Class 1), About
   - Each card has unique color matching brand palette
   - Rounded corners (32px radius) with shadows

3. **Interactive Features**
   - Click navigation: Click top card to navigate to page, click background cards to bring to front
   - Arrow controls: Left/right buttons to cycle through deck
   - Keyboard support: Arrow keys for navigation, Enter to visit current card's page
   - Progress indicators: Purple dots showing current card position
   - Hover effects: Semi-transparent images appear on hover (opacity 0.15)

4. **Hover Images**
   - Vibe Coding: Uses VibeCoderColors.png
   - AI Fundamentals: Uses NeuralNet.png
   - About: Uses TeamPic.png

5. **Layout Updates**
   - Homepage split: Welcome text on left, card deck on right
   - Proper spacing to prevent overlap with navigation controls
   - Responsive design maintained

6. **Technical Implementation**
   - New component: DeckOfCards.tsx
   - Uses Framer Motion for smooth animations
   - Spring animations for card transitions
   - AnimatePresence for exit animations

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

4. **Timeline Components (Syllabus)**
   - Horizontal scroll on mobile for timeline navigation
   - Desktop: Full-width timeline with all weeks visible
   - Mobile-optimized features:
     - Minimum width containers (500px for AI, 600px for Vibe Coding)
     - Custom scrollbar styling for elegant mobile scrolling
     - Responsive padding: px-8 md:px-20 for timeline
     - Content cards: px-6 md:px-12 padding

5. **Enrollment Popup Positioning**
   - Mobile: Centered horizontally at bottom of screen
     - Uses: `left-1/2 -translate-x-1/2`
     - Width: `w-[calc(100%-2rem)]` for proper margins
   - Desktop: Bottom-right corner positioning
     - Uses: `sm:left-auto sm:right-8 sm:translate-x-0`

6. **Homepage Link Updates**
   - Changed from `<a>` tags to Next.js `Link` components for proper routing
   - Updated course link colors from purple to black for consistency
   - Maintained bold styling with hover effects

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

- **Client-Side (`/lib/instant.ts`)**: Uses the React SDK for client-side interactions (form submissions)
  ```typescript
  import { init } from '@instantdb/react';
  export const db = init({ appId, schema });
  ```

#### 2. **Server-Side Data Fetching Pattern**

All pages use **async Server Components** to fetch data before rendering:

```typescript
// Example: app/page.tsx
export default async function Home() {
  const cohortDates = await getCohortDates(); // Server-side fetch
  return <VanGoghLayout cohortDates={cohortDates} />; // Pass to client
}
```

Key helper functions in `/lib/instant-server.ts`:
- `getPageContent()` - Fetches CMS content for pages
- `getSyllabus()` - Retrieves course syllabus data
- `getCohortDates()` - Gets specific cohort information
- `getAllCohortDates()` - Fetches all active cohorts for dropdowns

#### 3. **Data Flow: Server to Client**

The data flows through the component hierarchy via props:

```
Server Component (page.tsx)
  ↓ Fetches data with adminDb
  ↓ Passes as props
Client Component (Layout/Container)
  ↓ Receives data as props
  ↓ Passes to children
Interactive Components (Forms, etc.)
  ↓ Uses data for display
  ↓ Submits new data via client db
```

#### 4. **SEO Benefits**

1. **Full HTML on First Load**: Search engines receive complete HTML with all content, not empty shells waiting for JavaScript
2. **Faster Time to First Byte (TTFB)**: Data is fetched during server rendering, not after page load
3. **No JavaScript Required**: Content is accessible even with JavaScript disabled
4. **Meta Tags with Real Data**: Dynamic meta tags can use actual database content
5. **Improved Core Web Vitals**: No layout shift from loading states, better LCP scores

#### 5. **Implementation Example: Dynamic Form Dropdowns**

Recent implementation of dynamic cohort dropdowns demonstrates the pattern:

1. **Server fetches all cohorts**: `getAllCohortDates()` in page.tsx
2. **Props passed down**: Through VanGoghLayout → CTASection/Navigation → FormModal
3. **Dynamic rendering**: FormModal receives cohortDates and renders options
4. **No client fetching**: Dropdown is populated on initial render

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
  ├── instant.ts          # Client-side InstantDB setup
  ├── instant-admin.ts    # Server-side admin setup
  └── instant-server.ts   # Server-side query functions
/app
  └── [route]/page.tsx    # Async server components with data fetching
/components
  └── *.tsx              # Client components receive data via props
```

### Key Advantages Over Client-Side Fetching

1. **SEO**: Full content indexing by search engines
2. **Performance**: No waterfall loading, reduced client-side JavaScript
3. **Security**: Admin token never exposed to client
4. **Consistency**: All users see the same initial data
5. **Progressive Enhancement**: Works without JavaScript

This architecture ensures your AI Study Camp website is fully optimized for search engines while maintaining the real-time capabilities of InstantDB where needed (like form submissions).