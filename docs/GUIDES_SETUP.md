# Golf Simulator Build Guides System

This document explains the new golf simulator build guides feature and how to set it up.

## Overview

The guides system provides a comprehensive knowledge base for building golf simulators, with a focus on GSPro. It includes:

- 38+ planned articles across 10 categories
- Filterable content by budget, room type, ceiling height, and build style
- Related articles and navigation between guides
- Newsletter integration and ad placements
- SEO-optimized content structure

## Database Setup

### 1. Run the Prisma Migration

First, apply the database schema changes:

```bash
npm run db:push
```

Or to create a proper migration:

```bash
npm run db:migrate
```

### 2. Seed Initial Articles

Load the first 3 articles into the database:

```bash
npm run db:seed:articles
```

This will create:
1. Golf Simulator Basics: The Components and How They Work Together
2. How Much Space You Really Need (Room Size, Ceiling Height, Offsets)
3. Projector 101 for Golf Sims: Throw Ratio, Brightness, and Resolution

## File Structure

```
app/
├── guides/
│   ├── page.tsx              # Hub page listing all guides
│   └── [slug]/
│       └── page.tsx          # Individual article page
├── actions/
│   └── articles.ts           # Server actions for articles
lib/
├── articles.ts               # Utility functions and labels
prisma/
├── schema.prisma             # Database schema (includes Article model)
└── seed-articles.ts          # Seed script for initial articles
components/
└── layout/
    └── header.tsx            # Updated with Guides nav link
```

## Article Model

Each article has:
- **Title & Slug**: SEO-friendly URL
- **Content**: HTML content stored in database
- **Category**: One of 10 categories (START_HERE, LAUNCH_MONITORS, etc.)
- **Filters**: Budget tier, room type, ceiling height, build style
- **Metadata**: Read time, featured status, publication date

## Adding More Articles

To add additional articles, edit `prisma/seed-articles.ts` and add new entries following this pattern:

```typescript
await prisma.article.upsert({
  where: { slug: "your-article-slug" },
  update: {},
  create: {
    title: "Your Article Title",
    slug: "your-article-slug",
    excerpt: "Brief description for cards and SEO",
    category: "START_HERE", // or other category
    readTime: "10 min read",
    published: true,
    featured: false,
    order: 4, // Order within category
    publishedAt: new Date(),
    budgetTier: "MID", // Optional
    roomType: "GARAGE", // Optional
    ceilingHeight: "NINE_TO_TEN", // Optional
    buildStyle: "DIY", // Optional
    content: `
      <h2>Section Title</h2>
      <p>Your content here in HTML format...</p>
    `,
  },
});
```

Then run the seed script again:

```bash
npm run db:seed:articles
```

## Categories

- **START_HERE**: Essential foundation knowledge
- **LAUNCH_MONITORS**: Launch monitor tech and setup
- **PROJECTORS**: Projector selection and configuration
- **PC_SOFTWARE**: Computer specs and software
- **SCREENS_ENCLOSURES**: Impact screens and safety
- **FLOORING_TURF**: Mats and flooring solutions
- **LIGHTING_POWER**: Lighting and electrical
- **DIY_BUILDS**: Step-by-step build guides
- **TUNING_MAINTENANCE**: Optimization and troubleshooting
- **EXAMPLE_BUILDS**: Complete build examples

## Navigation

The Guides link has been added to the main navigation between "Courses" and "Flyovers".

## Article Layout

Individual article pages include:
- Banner ad (leaderboard/mobile)
- Article header with breadcrumb
- Full article content with proper typography
- Previous/Next navigation within category
- Sidebar with:
  - Related articles from same category
  - Newsletter widget
  - 300x250 ad (desktop only)
  - Quick links to other resources

## Content Strategy

The guides are GSPro-focused and include:
- Practical, actionable advice
- Real-world examples
- Specific product recommendations
- Decision frameworks
- Checklists and templates

## Remaining Articles to Create

Currently, 3 articles are seeded. The blueprint includes 35 more articles to create across all categories. See the original knowledge base document for full outlines of all 38 articles.

## Admin Access

Articles can be managed programmatically through Prisma Studio:

```bash
npm run db:studio
```

Or create an admin interface for article management (future enhancement).
