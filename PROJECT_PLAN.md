# GSPro Community App - Project Plan

## Project Overview
A modern, full-stack Next.js application for the GSPro golf simulator community to discover courses, find resources, and connect with fellow golf simulation enthusiasts.

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (built on Radix UI)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Clerk
- **File Storage**: Cloudinary or similar (for user-uploaded images)

### Infrastructure
- **Hosting**: Netlify
- **Database Hosting**: Supabase/Neon/Railway
- **Cron Jobs**: Netlify Functions (scheduled)
- **Environment**: Node.js 18+

### External APIs
- **Course Data**: Pakman Studios (web scraping)
- **Videos**: YouTube Data API v3

---

## Database Schema

### Core Tables

```prisma
model Course {
  id            String   @id @default(cuid())
  name          String
  designer      String?
  dateAdded     DateTime
  lastUpdated   DateTime
  downloadUrl   String
  sourceUrl     String?  // Original Pakman Studios URL

  // Optional fields (can be added by users/admin)
  description   String?  @db.Text
  imageUrl      String?
  location      String?  // Real-world location
  courseType    String?  // links, parkland, desert, etc.
  holes         Int?     // 9 or 18
  difficulty    Int?     // 1-5 rating
  fileSize      String?
  version       String?

  // Relationships
  favorites     Favorite[]
  reviews       Review[]

  // Metadata
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([dateAdded])
  @@index([designer])
  @@index([name])
}

model YouTubeVideo {
  id            String   @id @default(cuid())
  videoId       String   @unique // YouTube video ID
  title         String
  description   String?  @db.Text
  thumbnailUrl  String
  publishedAt   DateTime
  channelTitle  String
  playlistType  String   // 'flyovers' or 'golf'
  duration      String?
  viewCount     Int?

  // Metadata
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([playlistType])
  @@index([publishedAt])
}

model Resource {
  id            String   @id @default(cuid())
  name          String
  description   String?  @db.Text
  url           String
  affiliateUrl  String?
  imageUrl      String?
  category      ResourceCategory
  subcategory   String?

  // Additional fields
  price         String?
  brand         String?
  featured      Boolean  @default(false)

  // Metadata
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([category])
}

enum ResourceCategory {
  LAUNCH_MONITOR
  RETAILER
  EQUIPMENT
  SOFTWARE
  COMMUNITY
}

model User {
  id            String   @id // Clerk user ID
  email         String   @unique
  username      String?  @unique
  firstName     String?
  lastName      String?
  avatarUrl     String?

  // Relationships
  favorites     Favorite[]
  reviews       Review[]

  // Metadata
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Favorite {
  id            String   @id @default(cuid())
  userId        String
  courseId      String

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course        Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  createdAt     DateTime @default(now())

  @@unique([userId, courseId])
  @@index([userId])
}

model Review {
  id            String   @id @default(cuid())
  userId        String
  courseId      String
  rating        Int      // 1-5
  comment       String?  @db.Text

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course        Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([userId, courseId])
  @@index([courseId])
}

model SyncLog {
  id            String   @id @default(cuid())
  type          SyncType
  status        SyncStatus
  startedAt     DateTime @default(now())
  completedAt   DateTime?
  itemsProcessed Int?
  errorMessage  String?  @db.Text

  @@index([type, startedAt])
}

enum SyncType {
  COURSES
  YOUTUBE_FLYOVERS
  YOUTUBE_GOLF
}

enum SyncStatus {
  RUNNING
  SUCCESS
  FAILED
}
```

---

## Project Structure

```
the-perfect-lie/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx                 # Homepage
│   │   │   └── layout.tsx
│   │   ├── courses/
│   │   │   ├── page.tsx                 # Course directory
│   │   │   └── [id]/
│   │   │       └── page.tsx             # Course detail
│   │   ├── flyovers/
│   │   │   └── page.tsx                 # YouTube flyovers
│   │   ├── golf-videos/
│   │   │   └── page.tsx                 # Golf videos
│   │   ├── resources/
│   │   │   ├── page.tsx                 # Resource hub
│   │   │   └── [category]/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx                 # User dashboard
│   │   │   └── favorites/
│   │   │       └── page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx                 # Admin dashboard
│   │   │   ├── sync/
│   │   │   │   └── page.tsx             # Sync management
│   │   │   └── resources/
│   │   │       └── page.tsx             # Resource management
│   │   ├── api/
│   │   │   ├── courses/
│   │   │   │   ├── route.ts             # GET courses (paginated, filtered)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts         # GET course by ID
│   │   │   ├── videos/
│   │   │   │   └── route.ts             # GET videos
│   │   │   ├── resources/
│   │   │   │   └── route.ts             # GET resources
│   │   │   ├── favorites/
│   │   │   │   └── route.ts             # POST/DELETE favorites
│   │   │   ├── sync/
│   │   │   │   ├── courses/
│   │   │   │   │   └── route.ts         # POST trigger course sync
│   │   │   │   └── videos/
│   │   │   │       └── route.ts         # POST trigger video sync
│   │   │   └── webhooks/
│   │   │       └── clerk/
│   │   │           └── route.ts         # Clerk webhook
│   │   ├── layout.tsx                   # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components
│   │   ├── courses/
│   │   │   ├── course-card.tsx
│   │   │   ├── course-grid.tsx
│   │   │   ├── course-filters.tsx
│   │   │   └── course-search.tsx
│   │   ├── videos/
│   │   │   ├── video-card.tsx
│   │   │   └── video-grid.tsx
│   │   ├── resources/
│   │   │   ├── resource-card.tsx
│   │   │   └── resource-grid.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── navigation.tsx
│   │   └── shared/
│   │       ├── pagination.tsx
│   │       └── loading-spinner.tsx
│   ├── lib/
│   │   ├── db.ts                        # Prisma client
│   │   ├── clerk.ts                     # Clerk config
│   │   ├── utils.ts                     # Utility functions
│   │   ├── scrapers/
│   │   │   └── pakman.ts                # Pakman Studios scraper
│   │   └── youtube/
│   │       └── api.ts                   # YouTube API client
│   ├── services/
│   │   ├── course.service.ts
│   │   ├── video.service.ts
│   │   ├── resource.service.ts
│   │   └── sync.service.ts
│   └── types/
│       └── index.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── netlify/
│   └── functions/
│       ├── sync-courses.ts              # Scheduled function
│       └── sync-videos.ts               # Scheduled function
├── public/
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Features Breakdown

### Phase 1: MVP (Weeks 1-2)

#### Core Features
1. **Course Directory**
   - Display courses in grid/list view
   - Search by name
   - Filter by designer, date
   - Sort by date added (newest first)
   - Pagination
   - Course detail page with download link

2. **YouTube Flyovers**
   - Display Eagles & Birdies videos
   - Grid view with thumbnails
   - Click to watch (embedded player or link to YouTube)
   - Sort by date published

3. **Resource Hub**
   - Display resources by category
   - Simple grid layout
   - External links

4. **Basic Auth**
   - Clerk authentication
   - User registration/login
   - Protected routes

5. **Favorites**
   - Save favorite courses
   - View favorites in dashboard

#### Technical Setup
- Next.js project initialization
- Tailwind CSS + shadcn/ui setup
- Prisma + PostgreSQL setup
- Clerk authentication
- Basic layouts and navigation

### Phase 2: Enhanced Features (Weeks 3-4)

1. **Advanced Filtering**
   - Multiple filter combinations
   - Course type filter
   - Location filter
   - Difficulty filter

2. **Reviews & Ratings**
   - Users can rate courses (1-5 stars)
   - Write reviews
   - Display average rating on course cards

3. **User Profiles**
   - Public profile pages
   - Show user's reviews
   - Show favorite courses count

4. **Golf Videos Section**
   - Additional YouTube playlist
   - Separate section from flyovers

5. **Admin Panel**
   - Manual sync triggers
   - View sync logs
   - Manage resources (CRUD)

### Phase 3: Community Features (Weeks 5-6)

1. **Course Collections**
   - Users create custom course lists
   - "My Bucket List", "Played Courses", etc.
   - Share collections

2. **User Submissions**
   - Submit new courses
   - Submit course images
   - Submit resources
   - Admin approval workflow

3. **Social Features**
   - Share courses on social media
   - Comment on courses
   - Like/upvote reviews

4. **Enhanced Search**
   - Full-text search
   - Search across courses and resources
   - Search suggestions

---

## API Routes

### Public Routes

#### GET /api/courses
Query params:
- `page`: number (default: 1)
- `limit`: number (default: 24)
- `search`: string
- `designer`: string
- `courseType`: string
- `sortBy`: 'dateAdded' | 'name' | 'rating' (default: 'dateAdded')
- `sortOrder`: 'asc' | 'desc' (default: 'desc')

Response:
```json
{
  "courses": [...],
  "pagination": {
    "page": 1,
    "limit": 24,
    "total": 1234,
    "totalPages": 52
  }
}
```

#### GET /api/courses/[id]
Response:
```json
{
  "course": {...},
  "averageRating": 4.5,
  "reviewCount": 10
}
```

#### GET /api/videos
Query params:
- `type`: 'flyovers' | 'golf'
- `page`: number
- `limit`: number

#### GET /api/resources
Query params:
- `category`: ResourceCategory
- `featured`: boolean

### Protected Routes (Require Auth)

#### POST /api/favorites
Body:
```json
{
  "courseId": "abc123"
}
```

#### DELETE /api/favorites/[courseId]

#### GET /api/favorites
Returns user's favorite courses

#### POST /api/reviews
Body:
```json
{
  "courseId": "abc123",
  "rating": 5,
  "comment": "Great course!"
}
```

### Admin Routes (Require Admin Role)

#### POST /api/sync/courses
Triggers manual course sync

#### POST /api/sync/videos
Body:
```json
{
  "type": "flyovers" | "golf"
}
```

#### GET /api/admin/sync-logs
Returns sync history

#### POST /api/admin/resources
Create new resource

---

## Data Sync Architecture

### Course Sync (Pakman Studios)

**Source**: https://pakmanstudios.com/gspro-course-list/

**Process**:
1. Fetch HTML from Pakman Studios
2. Parse table data using Cheerio/JSDOM
3. Extract: Course name, designer, date updated, download link
4. For each course:
   - Check if exists in DB (match by name + designer)
   - If new: INSERT
   - If exists and date different: UPDATE
   - If exists and date same: SKIP
5. Log sync results in SyncLog table

**Schedule**: Daily at 3 AM UTC
**Trigger**: Netlify scheduled function + manual admin trigger

**Code Location**: `src/lib/scrapers/pakman.ts`

### YouTube Sync

**Source**: YouTube Data API v3

**Required Playlist IDs**:
- Eagles & Birdies Flyovers: `[TO BE PROVIDED]`
- Golf Videos: `[TO BE PROVIDED]`

**Process**:
1. Fetch playlist items using YouTube API
2. For each video:
   - Extract: videoId, title, description, thumbnail, publishedAt
   - Check if exists in DB (match by videoId)
   - If new: INSERT
   - If exists: UPDATE metadata
3. Log sync results

**Schedule**: Daily at 4 AM UTC
**Trigger**: Netlify scheduled function + manual admin trigger

**Code Location**: `src/lib/youtube/api.ts`

### Environment Variables Needed
```
YOUTUBE_API_KEY=
YOUTUBE_FLYOVERS_PLAYLIST_ID=
YOUTUBE_GOLF_PLAYLIST_ID=
```

---

## Development Phases

### Week 1: Foundation
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Setup Tailwind CSS + shadcn/ui
- [ ] Configure Prisma + PostgreSQL
- [ ] Create database schema
- [ ] Run initial migration
- [ ] Setup Clerk authentication
- [ ] Create basic layouts (header, footer, navigation)
- [ ] Setup environment variables

### Week 2: Core Features
- [ ] Build course scraper for Pakman Studios
- [ ] Create course sync service
- [ ] Build Course Directory page
  - [ ] Course grid/list view
  - [ ] Pagination
  - [ ] Basic search
  - [ ] Basic filters
- [ ] Build Course Detail page
- [ ] Setup YouTube API integration
- [ ] Build YouTube Flyovers page
- [ ] Implement favorites functionality
- [ ] Create user dashboard

### Week 3: Resource Hub & Enhancement
- [ ] Create Resource Hub pages
- [ ] Build resource management (admin)
- [ ] Add advanced course filters
- [ ] Implement reviews & ratings
- [ ] Create Golf Videos section
- [ ] Build admin panel basics

### Week 4: Polish & Deploy
- [ ] Setup Netlify scheduled functions
- [ ] Create admin sync interface
- [ ] Add loading states and error handling
- [ ] Implement SEO (meta tags, sitemap)
- [ ] Add analytics (optional)
- [ ] Testing
- [ ] Deploy to Netlify
- [ ] Setup production database

---

## Key Technical Decisions

### Why Store Data in Database?
1. **Performance**: Fast queries with indexing
2. **Offline Capability**: No dependency on external sources being available
3. **Custom Fields**: Add ratings, reviews, favorites
4. **Search**: Better full-text search capabilities
5. **Analytics**: Track popular courses, trends

### Scraping Strategy
- Use ethical scraping practices
- Cache responses
- Respect robots.txt
- Don't hammer the server (rate limiting)
- Store source URL for attribution

### YouTube API Limits
- Free tier: 10,000 units/day
- PlaylistItems.list costs 1 unit
- Playlist with 100 videos = ~2 API calls
- Daily sync is well within limits

---

## Nice-to-Have Features (Future)

- [ ] Progressive Web App (PWA)
- [ ] Course recommendations based on favorites
- [ ] Email notifications for new courses
- [ ] Course comparison tool
- [ ] Integration with GSPro API (if available)
- [ ] Mobile app (React Native/Expo)
- [ ] Course statistics dashboard
- [ ] User achievement badges
- [ ] Discussion forums
- [ ] Live chat for community
- [ ] Course upload tool for designers
- [ ] API for third-party integrations

---

## Success Metrics

### Phase 1 Goals
- Launch live site
- 100+ courses in database
- 50+ flyover videos
- 10+ resources in hub
- 50 registered users
- Basic functionality working

### Phase 2 Goals
- 500+ registered users
- 100+ course reviews
- Advanced filtering in use
- Low bounce rate (<40%)

### Phase 3 Goals
- 1000+ registered users
- Active community engagement
- User-generated content
- Regular weekly active users

---

## Questions to Answer

1. **YouTube Playlist URLs**: Need specific playlist IDs for:
   - Eagles & Birdies GSPro Flyovers
   - General Golf Videos

2. **Admin Users**: Who should have admin access initially?

3. **Branding**:
   - App name: "GSPro Community Hub"? Or different name?
   - Logo/colors preferences?

4. **Domain**: Do you have a domain name in mind?

5. **Analytics**: Should we add Google Analytics or similar?

6. **Social Auth**: Just email/password or also Google/Discord OAuth?

---

## Next Steps

1. **Review this plan** - Any changes or additions?
2. **Provide YouTube playlist URLs**
3. **Choose app branding** (name, colors)
4. **Setup infrastructure accounts**:
   - Clerk (auth)
   - Database hosting (Supabase/Neon)
   - YouTube API credentials
5. **Start development** - Begin with Week 1 tasks

Ready to build! 🏌️‍♂️
