# InstantDB Content Management System

## Overview
We've implemented a content management system using InstantDB that allows dynamic updates to the homepage course cards without requiring code changes or deployments.

## What We Built

### 1. Database Schema
Created a `cohortDates` entity in InstantDB with the following fields:
- `courseId` (string, indexed) - Identifies the course ('ai-fundamentals' or 'vibe-coding')
- `title` (string, optional) - Card title (e.g., "AI For Builders")
- `subtitle` (string, optional) - Card subtitle (e.g., "Class 1")
- `description` (string, optional) - Card description text
- `startDate` (string) - Cohort start date (e.g., "Next Cohort Starts Feb 3")
- `isActive` (boolean, indexed) - Enable/disable records
- `createdAt` (number, indexed) - Timestamp
- `updatedAt` (number) - Last update timestamp

### 2. Admin Interface (`/admin/cohorts`)
A clean interface to update all course card content:
- Organized sections for each course
- Input fields for titles, subtitles, dates
- Textarea fields for descriptions
- Real-time display of current database values
- Submit button to save all changes at once

### 3. Seed Page (`/seed-cohorts`)
A one-click setup page for initial data:
- Creates default records for both courses
- Useful for first-time setup or after database resets
- Shows what data will be added before confirming

### 4. Frontend Integration
Updated `VanGoghLayout.tsx` to:
- Fetch content from InstantDB using `useQuery` hook
- Map database records to card data
- Use dynamic content with hardcoded fallbacks
- Update in real-time when data changes

## How It Works

### Data Flow
1. **Homepage loads** → `VanGoghLayout` fetches data from InstantDB
2. **No data exists** → Falls back to hardcoded values
3. **Data exists** → Uses dynamic values from database
4. **Admin updates content** → Changes reflect instantly (real-time sync)

### Key Code Components

#### Database Connection (`lib/instant.ts`)
```typescript
import { init } from '@instantdb/react';
import schema from '@/instant.schema';

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID || '6bacc7ad-5ab9-4b1d-9ae1-005ce9234bb0';
export const db = init({ appId: APP_ID, schema });
```

#### Fetching Data (`VanGoghLayout.tsx`)
```typescript
const { data: cohortData } = db.useQuery({
  cohortDates: {
    $: { where: { isActive: true } }
  }
});
```

#### Using Dynamic Content
```typescript
title: cohortDateMap['ai-fundamentals']?.title || 'AI For Builders',
subtitle: cohortDateMap['ai-fundamentals']?.subtitle || 'Class 1',
description: cohortDateMap['ai-fundamentals']?.description || 'Master the fundamentals...',
```

## Usage Guide

### First Time Setup
1. Visit `/seed-cohorts`
2. Click "Seed Cohort Dates"
3. Data is now in the database

### Updating Content
1. Visit `/admin/cohorts`
2. Modify any field (title, subtitle, date, description)
3. Click "Submit Class Changes"
4. Changes appear instantly on homepage

### Benefits
- **No Code Changes**: Update content through web interface
- **No Deployment**: Changes are instant, no build/deploy needed
- **Real-time**: All users see updates immediately
- **Type-safe**: Full TypeScript support with schema
- **Reliable**: Fallbacks ensure site works even without data

## Technical Details

### Why InstantDB?
- Real-time synchronization out of the box
- No backend needed - InstantDB handles everything
- Simple React hooks for data fetching
- Built-in optimistic updates

### Schema Design
We use a single entity (`cohortDates`) with all card content rather than separate entities for simplicity. The `courseId` field acts as the primary identifier.

### Security
- App ID is public (safe to expose)
- Admin token (for seeding) kept in environment variables
- Public read access, restricted write access can be configured

## Future Enhancements
1. **Authentication**: Add login to protect admin pages
2. **More Content**: Extend to other pages (About, Testimonials)
3. **Version History**: Track content changes over time
4. **Preview Mode**: See changes before saving
5. **Rich Text**: Support for formatted descriptions

## Files Created/Modified
- `instant.schema.ts` - Type-safe schema definition
- `lib/instant.ts` - Database initialization
- `app/admin/cohorts/page.tsx` - Admin interface for homepage cards
- `app/seed-cohorts/page.tsx` - Initial data seeding for cohorts
- `components/VanGoghLayout.tsx` - Homepage integration
- `instant-rules.md` - InstantDB usage documentation

### Course Page CMS Extension
- `app/admin/vibe-coding-content/page.tsx` - Admin interface for course page content
- `app/seed-vibe-content/page.tsx` - Initial content seeding for Vibe Coding page
- `lib/vibe-coding-content.ts` - Default content structure
- `components/DynamicLetterContent.tsx` - Component to render dynamic letter content
- `app/vibe-coding/page.tsx` - Updated to use dynamic content

## Course Page Content Management

### What We Added
Extended the CMS to manage the Vibe Coding course page content:

1. **New Entity: coursePageContent**
   - `pageId` (string, unique, indexed) - Identifies the page ('vibe-coding')
   - `heroTitle` (string, optional) - Hero section title
   - `heroSubtitle` (string, optional) - Hero section subtitle
   - `letterContent` (json, optional) - Structured letter content
   - `isActive` (boolean, indexed) - Enable/disable records
   - `createdAt` (number, indexed) - Timestamp
   - `updatedAt` (number) - Last update timestamp

2. **Letter Content Structure**
   The letter content is stored as JSON with sections that can be:
   - `paragraph` - Regular text paragraphs
   - `heading` - Section headings (with level)
   - `callout` - Highlighted boxes with colored borders
   - `list` - Bullet point lists with custom colors
   - `signature` - Author signature section

### Usage
1. **First Time Setup**: Visit `/seed-vibe-content` to create initial content
2. **Update Content**: Visit `/admin/vibe-coding-content` to modify:
   - Hero title and subtitle
   - Full letter content via JSON editor
3. **View Changes**: Changes appear instantly on `/vibe-coding` page

## Syllabus Management

### What We Added
Extended the CMS to manage the course syllabus dynamically:

1. **New Entity: syllabus**
   - `courseId` (string, indexed) - Course identifier ('vibe-coding')
   - `weekNumber` (number, indexed) - Week number (0-6)
   - `weekName` (string) - Display name (e.g., "Week 0")
   - `title` (string) - Week title
   - `description` (string) - Brief week description
   - `learningOutcome` (string) - Learning goals
   - `tools` (json array, optional) - List of tools used
   - `color` (string) - Color theme for the week
   - `sortOrder` (number) - Display order
   - `isActive` (boolean, indexed) - Enable/disable weeks
   - `createdAt` (number, indexed)
   - `updatedAt` (number)

2. **Admin Features**
   - Table view of all weeks
   - Inline editing of week details
   - Add/remove tools as pills
   - Color selection for each week
   - Learning outcomes management

### Usage
1. **First Time Setup**: Visit `/seed-syllabus` to create initial syllabus
2. **Update Syllabus**: Visit `/admin/syllabus` to:
   - Edit week titles and descriptions
   - Add/remove tools
   - Change week colors
   - Update learning outcomes
3. **View Changes**: The syllabus updates instantly on `/vibe-coding` page

### Files Created/Modified for Syllabus
- `app/admin/syllabus/page.tsx` - Table-based admin interface
- `app/seed-syllabus/page.tsx` - Initial syllabus data seeding
- `components/HorizontalTimelineSyllabus.tsx` - Updated to use dynamic data
- `instant.schema.ts` - Added syllabus entity