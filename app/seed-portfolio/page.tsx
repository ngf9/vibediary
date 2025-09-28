'use client';

import React, { useState } from 'react';
import { db } from '@/lib/instant';
import { id } from '@instantdb/react';

export default function SeedPortfolioPage() {
  const [status, setStatus] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  const seedData = async () => {
    setIsSeeding(true);
    setStatus('Starting seed process...');

    try {
      // Create sample projects
      const projectIds = {
        vibeDiary: id(),
        aiChatbot: id(),
        portfolioSite: id(),
        weatherApp: id()
      };

      setStatus('Creating projects...');
      await db.transact([
        db.tx.projects[projectIds.vibeDiary].update({
          slug: 'vibe-diary',
          title: 'Vibe Diary',
          subtitle: 'A portfolio built with vibe coding',
          description: 'Created this portfolio site using Claude Code and Next.js to showcase my journey into vibe coding. Features a custom CMS and dynamic content management.',
          thumbnail: '/vibefront2.png',
          coverImage: '/vibefront2.png',
          technologies: ['Next.js', 'TypeScript', 'InstantDB', 'Tailwind CSS', 'Claude Code'],
          githubUrl: 'https://github.com/yourusername/vibediary',
          liveUrl: 'https://vibediary.com',
          status: 'completed',
          featured: true,
          sortOrder: 1,
          color: '#8B5CF6',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }),
        db.tx.projects[projectIds.aiChatbot].update({
          slug: 'ai-chatbot',
          title: 'AI Customer Support Bot',
          subtitle: 'Intelligent chat assistant',
          description: 'Built an AI-powered customer support chatbot using OpenAI APIs and Vercel AI SDK. Handles common queries and escalates complex issues.',
          thumbnail: '/NeuralNet.png',
          coverImage: '/NeuralNet.png',
          technologies: ['React', 'OpenAI API', 'Vercel AI SDK', 'PostgreSQL'],
          githubUrl: 'https://github.com/yourusername/ai-chatbot',
          liveUrl: 'https://chatbot-demo.vercel.app',
          status: 'completed',
          featured: true,
          sortOrder: 2,
          color: '#10B981',
          createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
          updatedAt: Date.now()
        }),
        db.tx.projects[projectIds.portfolioSite].update({
          slug: 'portfolio-v1',
          title: 'Portfolio Site V1',
          subtitle: 'My first portfolio',
          description: 'My first attempt at building a portfolio website. Simple, clean design with a focus on showcasing projects effectively.',
          technologies: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
          githubUrl: 'https://github.com/yourusername/portfolio-v1',
          liveUrl: 'https://old-portfolio.com',
          status: 'completed',
          featured: false,
          sortOrder: 3,
          color: '#FFB343',
          createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
          updatedAt: Date.now()
        }),
        db.tx.projects[projectIds.weatherApp].update({
          slug: 'weather-dashboard',
          title: 'Weather Dashboard',
          subtitle: 'Real-time weather tracking',
          description: 'A weather dashboard that shows current conditions and forecasts. Currently adding AI-powered weather insights.',
          technologies: ['Vue.js', 'Weather API', 'Chart.js'],
          status: 'in-progress',
          featured: false,
          sortOrder: 4,
          color: '#FD5E53',
          createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
          updatedAt: Date.now()
        })
      ]);

      // Create project content for featured projects
      setStatus('Creating project content...');
      await db.transact([
        db.tx.projectContent[id()].update({
          projectId: 'vibe-diary',
          overview: 'This portfolio site represents my journey into vibe coding - using AI tools to build functional, beautiful applications without traditional coding expertise. Built entirely with Claude Code, this project showcases how AI can democratize software development.',
          challenges: [
            'Learning to effectively communicate with AI to get desired outputs',
            'Understanding the limitations and capabilities of AI coding tools',
            'Structuring a project for maintainability when using AI',
            'Integrating multiple AI tools into a cohesive workflow'
          ],
          solutions: [
            'Developed a systematic approach to prompting for consistent results',
            'Created templates and patterns for common tasks',
            'Established clear project structure and documentation',
            'Built a toolkit combining Claude Code, Cursor, and other AI tools'
          ],
          learnings: [
            'AI coding is about understanding concepts, not syntax',
            'Clear communication and problem decomposition are key skills',
            'The importance of iterative development and testing',
            'How to leverage AI strengths while working around limitations'
          ],
          techDetails: {
            architecture: 'Server-side rendered Next.js application with InstantDB for real-time data',
            stack: 'Next.js 14, TypeScript, InstantDB, Tailwind CSS, Framer Motion',
            deployment: 'Deployed on Vercel with automatic CI/CD from GitHub',
            performance: 'Optimized with ISR, image optimization, and code splitting'
          },
          gallery: ['/vibefront2.png', '/NeuralNet.png'],
          createdAt: Date.now(),
          updatedAt: Date.now()
        }),
        db.tx.projectContent[id()].update({
          projectId: 'ai-chatbot',
          overview: 'An intelligent customer support chatbot that understands context, maintains conversation history, and can handle complex multi-turn conversations. Built to reduce support ticket volume by 40%.',
          challenges: [
            'Managing conversation context across multiple turns',
            'Handling edge cases and unexpected user inputs',
            'Balancing response quality with API costs',
            'Ensuring appropriate escalation to human agents'
          ],
          solutions: [
            'Implemented conversation memory using vector databases',
            'Created comprehensive prompt engineering guidelines',
            'Developed token optimization strategies',
            'Built escalation rules based on sentiment and complexity'
          ],
          learnings: [
            'The importance of prompt engineering in AI applications',
            'How to effectively manage API costs at scale',
            'User experience considerations for AI interactions',
            'The value of continuous monitoring and improvement'
          ],
          techDetails: {
            architecture: 'Microservices architecture with separate services for chat, memory, and analytics',
            stack: 'React frontend, Node.js backend, OpenAI GPT-4, Pinecone vector DB',
            deployment: 'Containerized with Docker, deployed on AWS ECS',
            performance: 'Average response time under 2 seconds, 99.9% uptime'
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        })
      ]);

      // Create sample essays
      setStatus('Creating essays...');
      const essayIds = {
        vibeCodingJourney: id(),
        aiToolsGuide: id(),
        buildingWithoutCoding: id()
      };

      await db.transact([
        db.tx.essays[essayIds.vibeCodingJourney].update({
          slug: 'my-vibe-coding-journey',
          title: 'My Journey into Vibe Coding',
          subtitle: 'How I went from idea to implementation without traditional coding',
          excerpt: 'Six months ago, I couldn\'t write a line of code. Today, I\'m shipping full-stack applications. This is the story of how vibe coding changed everything.',
          content: `# My Journey into Vibe Coding

Six months ago, I was stuck. I had ideas—lots of them—but no way to bring them to life. Traditional coding bootcamps felt overwhelming, and hiring developers was expensive. Then I discovered vibe coding.

## What is Vibe Coding?

Vibe coding is the art of building software through AI collaboration. Instead of memorizing syntax and debugging semicolons, you focus on:

- **Clear communication** of your vision
- **Problem decomposition** into manageable pieces
- **Iterative refinement** through AI interaction
- **Understanding concepts** over implementation details

## My First Project

My first project was simple: a to-do app. But even this taught me fundamental lessons:

1. **Start small**: Don't try to build Facebook on day one
2. **Be specific**: Vague prompts lead to vague results
3. **Iterate quickly**: Each attempt teaches you something
4. **Document everything**: Your future self will thank you

## The Learning Curve

The learning curve wasn't about syntax—it was about mindset. I had to learn:

- How to think systematically about problems
- How to communicate technical requirements clearly
- How to debug by understanding logic, not code
- How to leverage AI strengths while working around limitations

## Where I Am Now

Six months later, I've built:
- This portfolio site
- An AI chatbot for customer support
- Multiple client projects
- A growing toolkit of AI-powered workflows

But more importantly, I've gained confidence. I'm no longer limited by my technical skills—I'm empowered by AI collaboration.

## Advice for Beginners

If you're starting your vibe coding journey:

1. **Embrace the mindset shift**: You're a director, not an actor
2. **Start with tutorials**: Follow along to understand the process
3. **Build something personal**: Motivation matters
4. **Join the community**: Learn from others' experiences
5. **Ship early and often**: Perfect is the enemy of good

## The Future

Vibe coding isn't just a trend—it's the future of software development. As AI tools improve, the barrier between idea and implementation continues to shrink. The question isn't whether you can build something, but what you'll build next.

*Ready to start your journey? The tools are waiting. Your ideas deserve to exist.*`,
          coverImage: '/vibefront2.png',
          tags: ['vibe-coding', 'ai-tools', 'no-code', 'personal-journey'],
          featured: true,
          published: true,
          readTime: 5,
          createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
          publishedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
          updatedAt: Date.now()
        }),
        db.tx.essays[essayIds.aiToolsGuide].update({
          slug: 'essential-ai-tools-2024',
          title: 'Essential AI Tools for Builders in 2024',
          subtitle: 'My toolkit for shipping products with AI',
          excerpt: 'A comprehensive guide to the AI tools I use daily to build and ship products. From code generation to design, these tools form my development stack.',
          content: `# Essential AI Tools for Builders in 2024

After months of vibe coding, I've developed a toolkit that lets me ship products faster than ever. Here are the essential tools every AI builder needs in 2024.

## Code Generation

### Claude Code
My primary coding companion. Best for:
- Complex logic implementation
- Debugging and problem-solving
- Code explanation and refactoring

### Cursor
The IDE that understands context. Perfect for:
- In-line code completion
- Multi-file refactoring
- Quick iterations

## Design & UI

### Midjourney
For creating stunning visuals:
- Hero images
- Illustrations
- Brand assets

### Claude
Yes, Claude again—but for design systems:
- Color palette generation
- Component architecture
- CSS implementation

## Backend & Data

### Supabase
Database and auth made simple:
- Real-time subscriptions
- Built-in authentication
- Auto-generated APIs

### InstantDB
For when you need speed:
- Zero-config setup
- Real-time sync
- Perfect for prototypes

## Deployment

### Vercel
Deploy in seconds:
- Automatic CI/CD
- Edge functions
- Analytics included

## My Daily Workflow

1. **Morning**: Review and plan in Claude
2. **Building**: Cursor for implementation
3. **Testing**: Manual + AI-assisted testing
4. **Deployment**: Push to GitHub → Vercel

The key isn't using all tools—it's knowing which tool for which job.`,
          tags: ['ai-tools', 'productivity', 'development', 'guide'],
          featured: false,
          published: true,
          readTime: 4,
          createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
          publishedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
          updatedAt: Date.now()
        }),
        db.tx.essays[essayIds.buildingWithoutCoding].update({
          slug: 'building-without-coding',
          title: 'Yes, You Can Build Without Coding',
          subtitle: 'Debunking the myths about AI-assisted development',
          excerpt: 'Many developers are skeptical about vibe coding. Here\'s why they\'re wrong, and why AI-assisted development is not just valid—it\'s the future.',
          content: `# Yes, You Can Build Without Coding

"But you're not really coding." I've heard this countless times. Let's address the elephant in the room: is vibe coding "real" development?

## The Myth of "Real" Coding

What makes coding "real"? Is it:
- Knowing syntax by heart?
- Debugging semicolons at 2 AM?
- Understanding memory management?

Or is it:
- Solving problems
- Creating value
- Shipping products

## What Vibe Coding Actually Is

Vibe coding is software development through AI collaboration. You're still:
- Designing systems
- Making architectural decisions
- Debugging logic
- Optimizing performance

You're just doing it at a higher level of abstraction.

## The Skills That Matter

In vibe coding, these skills become paramount:
- **System thinking**: Understanding how pieces fit together
- **Clear communication**: Articulating requirements precisely
- **Problem decomposition**: Breaking complex problems into manageable parts
- **Quality assessment**: Knowing what good looks like

## Real Results

In the last 6 months, I've:
- Built and shipped 5 production applications
- Served thousands of users
- Generated real revenue
- Solved real problems

If that's not "real" development, what is?

## The Future is Collaborative

The future isn't humans vs. AI—it's humans with AI. Vibe coding is just the beginning of this collaboration.

Stop gatekeeping. Start building.`,
          tags: ['opinion', 'vibe-coding', 'ai-development'],
          featured: true,
          published: false, // Draft
          readTime: 3,
          createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
          updatedAt: Date.now()
        })
      ]);

      // Create about content
      setStatus('Creating about content...');
      await db.transact(
        db.tx.aboutContent[id()].update({
          pageId: 'about',
          bio: `I'm a vibe coder, AI enthusiast, and product builder. Six months ago, I couldn't write a line of traditional code. Today, I ship full-stack applications using AI tools and the power of clear communication.

My journey started with curiosity: Could AI really help me build the ideas in my head? The answer was a resounding yes. Through vibe coding—the art of building software through AI collaboration—I've discovered that the barrier between idea and implementation is thinner than ever.

I believe the future of software development isn't about memorizing syntax or debugging semicolons. It's about understanding problems, designing solutions, and leveraging AI to handle the implementation details. This portfolio showcases projects built entirely through this approach.

When I'm not building, I'm writing about the intersection of AI and creativity, sharing what I've learned, and helping others start their own vibe coding journey.`,
          currentFocus: 'Currently exploring how to build more complex, production-ready applications with AI tools, and documenting the process to help others learn faster.',
          journey: [
            {
              title: 'The Spark',
              date: '2024',
              description: 'Discovered vibe coding and realized I could finally build my ideas'
            },
            {
              title: 'First Project',
              date: 'Month 1',
              description: 'Built my first to-do app with Claude Code - ugly but functional!'
            },
            {
              title: 'Going Deeper',
              date: 'Month 3',
              description: 'Completed the Vibe Coding course and learned systematic approaches'
            },
            {
              title: 'Client Work',
              date: 'Month 4',
              description: 'Landed first paying client for a custom web application'
            },
            {
              title: 'Teaching Others',
              date: 'Month 6',
              description: 'Started sharing knowledge through essays and tutorials'
            }
          ],
          skills: [
            'Claude Code',
            'Cursor',
            'Next.js',
            'React',
            'TypeScript',
            'Tailwind CSS',
            'InstantDB',
            'Supabase',
            'Vercel',
            'Git/GitHub',
            'Prompt Engineering',
            'AI Workflow Design'
          ],
          contact: {
            email: 'hello@vibediary.com',
            github: 'https://github.com/vibecoder',
            linkedin: 'https://linkedin.com/in/vibecoder',
            twitter: 'https://twitter.com/vibecoder',
            website: 'https://vibediary.com'
          },
          isActive: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        })
      );

      setStatus('✅ Portfolio data seeded successfully!');

      // Refresh the page after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (error) {
      console.error('Seeding error:', error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Seed Portfolio Data</h1>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>⚠️ Warning:</strong> This will create sample data in your database.
              Make sure you want to proceed.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">This will create:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>4 sample projects (2 featured)</li>
              <li>Detailed content for featured projects</li>
              <li>3 sample essays (2 published, 1 draft)</li>
              <li>Complete about page content</li>
              <li>Bio, journey milestones, and skills</li>
            </ul>
          </div>

          <div className="mt-8">
            <button
              onClick={seedData}
              disabled={isSeeding}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSeeding ? 'Seeding Data...' : 'Seed Portfolio Data'}
            </button>
          </div>

          {status && (
            <div className={`mt-6 p-4 rounded-lg ${
              status.includes('✅') ? 'bg-green-50 text-green-800' :
              status.includes('❌') ? 'bg-red-50 text-red-800' :
              'bg-blue-50 text-blue-800'
            }`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}