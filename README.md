# The Perfect Lie

> Discover. Play. Connect.

A modern, full-stack Next.js application for the GSPro golf simulator community. Discover courses, find resources, and connect with fellow golf simulation enthusiasts.

## Features

### 🏌️ Course Discovery
- **Course Directory**: Browse thousands of GSPro courses with advanced search and filtering
- **Column Customization**: Show/hide table columns to personalize your view
- **Server Filtering**: Filter courses by server (Pakman, RunPuddRun, TekBud, TheGolfBoy)
- **Beta Toggle**: Show/hide beta courses with a single click
- **Smart Search**: Search by name, designer, location, server, and version
- **Course Details**: Comprehensive course information with related videos

### 🎥 Video Integration
- **YouTube Flyovers**: Watch course preview videos from the Eagles & Birdies playlist
- **Smart Matching**: Automatic course-to-video matching using AI-powered name and designer parsing
- **Full Playlist Sync**: Syncs ALL videos from playlists (not just first page)
- **Embedded Player**: Watch videos directly on course pages

### ⭐ Reviews & Ratings
- **5-Star Ratings**: Rate courses from 1-5 stars with optional review text
- **Review Statistics**: Average ratings and rating distribution charts
- **Edit/Delete**: Manage your own reviews
- **@Mentions**: Mention other users and courses in your reviews

### 💬 Community Engagement
- **Threaded Comments**: Discussion threads on every course (up to 5 levels deep)
- **@Mention System**:
  - Mention users with `@username` (autocomplete)
  - Mention courses with `@[Course Name]` (autocomplete)
  - Clickable mentions that link to profiles/courses
- **Notifications**:
  - In-app notification bell with unread count
  - Email notifications for replies and mentions
  - Customizable notification preferences
- **Comment Editing**: Edit your comments with edit indicator
- **Reply Threading**: Reply to any comment with visual thread structure

### 📰 News & Articles
- **Article-Focused Homepage**: Featured articles with hero section
- **Content Categories**: Guides, Reviews, Interviews, Updates
- **Clean Typography**: Optimized reading experience with prose styling
- **Article Detail Pages**: Full articles with related content sidebar
- **Minimal Design**: Text-focused cards with category badges

### 🛠️ Resource Hub
- **12 Categories**:
  - Launch Monitors
  - Retailers
  - Equipment
  - Software
  - Communities
  - Online Play
  - Tournaments
  - Simulator Building
  - Best Practices
  - Training Aids
  - Course Design
  - Streaming Tools
- **Featured Resources**: Highlight top recommendations
- **Affiliate Support**: Optional affiliate URLs for creators
- **Rich Metadata**: Price, brand, subcategory, descriptions, images

### 👤 User Features
- **Clerk Authentication**: Secure authentication with email/social login
- **User Profiles**: Avatars, usernames, and profile information
- **Favorites**: Save your favorite courses
- **Activity Tracking**: View your reviews and comments
- **Notification Preferences**: Control email notifications

### 🔐 Admin Panel
- **Resource Management**:
  - Add/edit/delete resources
  - Category management
  - Featured resource highlighting
- **User Management**:
  - View all registered users
  - See user activity (reviews, comments, join date)
  - "No Bozos" moderation system
- **Server Patreon Links**: Direct links to support course creators
- **Dashboard**: Overview of resources and users

### 🎭 Moderation
- **"No Bozos" Shadowban**:
  - Mark problematic users as "bozo"
  - Bozo users see their content normally (unaware)
  - Other users don't see bozo content
  - Maintains community quality without confrontation
  - Affects reviews, comments, and rating statistics

### 🎨 Design & UX
- **Fixed-Width Centered Layout**: Consistent 1280px max-width across all pages
- **Minimal Clean Aesthetic**: Lots of whitespace, light background (98% white)
- **Green Accent Color**: HSL(142, 76%, 36%) for buttons and highlights
- **Responsive Design**: Mobile-first with breakpoints for tablet and desktop
- **Ad Integration**: Non-intrusive ad placements (970x250, 300x600, 728x90, 300x250, 320x50)
- **Sticky Navigation**: Header remains accessible on scroll

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS + shadcn/ui
- **Email**: Resend
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)
- **Date Formatting**: date-fns
- **Deployment**: Netlify
- **CI/CD**: GitHub Actions for automated PR creation and merging

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account (for authentication)
- YouTube Data API key
- Resend account (for email notifications)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/culturata/the-perfect-lie.git
cd the-perfect-lie
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then fill in the required environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/the-perfect-lie?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# YouTube Data API
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_FLYOVERS_PLAYLIST_ID=PLEKTcA5lfrkyDvi4zRCO1CKDFzXIL8xd0
YOUTUBE_GOLF_PLAYLIST_ID=your_golf_playlist_id

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

4. **Setup the database**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Or push schema directly (development)
npx prisma db push
```

5. **Sync course data**

The app supports both remote and local CSV files for course data.

**Option A: Use Remote CSV (Default)**
```bash
# Start the development server
npm run dev

# In a separate terminal or browser, trigger the course sync
curl http://localhost:3000/api/sync/courses-csv

# Or visit in your browser:
# http://localhost:3000/api/sync/courses-csv
```

**Option B: Use Local CSV File (Recommended)**

If the remote CSV URL is unavailable:

1. Download the CSV from [PakGolf Studios](https://pakgolfstudios.com/gspro-course-list/)
2. Save it as `/public/data/gspro-course-list.csv`
3. Add to `.env.local`:
   ```bash
   COURSE_CSV_URL=/data/gspro-course-list.csv
   ```
4. Run the sync as shown above

6. **Sync YouTube videos**

```bash
# Visit in browser or curl:
http://localhost:3000/api/sync/youtube
```

7. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Admin Setup

To access admin features:

1. Sign up/sign in with Clerk
2. Go to your Clerk Dashboard → Users → Select your user
3. Add to Public Metadata:
   ```json
   {
     "role": "admin"
   }
   ```
4. Access admin panel at `/admin`

## Project Structure

```
the-perfect-lie/
├── .github/
│   └── workflows/
│       └── claude-auto-pr.yml  # Auto PR creation/merge
├── app/
│   ├── actions/              # Server actions
│   │   ├── comments.ts       # Comment CRUD + filtering
│   │   ├── reviews.ts        # Review CRUD + filtering
│   │   ├── notifications.ts  # Notification management
│   │   ├── resources.ts      # Resource CRUD
│   │   └── users.ts          # User management + bozo system
│   ├── admin/                # Admin panel
│   │   ├── resources/        # Resource management
│   │   └── users/            # User management
│   ├── api/                  # API routes
│   │   ├── search/           # Search endpoints
│   │   │   └── mentions/     # @mention autocomplete
│   │   └── sync/             # Data synchronization
│   ├── courses/              # Course pages
│   ├── flyovers/             # Video flyovers
│   ├── news/                 # News and articles
│   │   └── [id]/             # Article detail pages
│   ├── resources/            # Resource hub
│   └── settings/             # User settings
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── ads/                  # Ad placeholder components
│   ├── admin/                # Admin components
│   ├── courses/              # Course components
│   ├── reviews/              # Review components
│   ├── comments/             # Comment components
│   ├── notifications/        # Notification components
│   └── layout/               # Layout components
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── email.ts              # Email utilities (Resend)
│   ├── mentions.ts           # @mention parsing
│   ├── resources.ts          # Resource utilities
│   ├── user.ts               # User sync utilities
│   ├── scrapers/             # Web scrapers
│   ├── services/             # Video matching logic
│   └── youtube/              # YouTube API integration
├── prisma/
│   └── schema.prisma         # Database schema
└── types/                    # TypeScript types
```

## Database Schema

The application uses the following main models:

### Core Models
- **Course**: GSPro courses with metadata
  - Fields: `server`, `location`, `version`, `designer`, `tourStop`, `majorVenue`, `historic`
  - Indexed for fast filtering and search

- **YouTubeVideo**: Synced YouTube videos
  - Auto-matched to courses using name and designer
  - Supports multiple playlist types

- **Resource**: Community resources and equipment
  - 12 categories with metadata (price, brand, featured)

### User & Social Models
- **User**: User accounts (synced with Clerk)
  - Fields: `email`, `username`, `firstName`, `lastName`, `avatarUrl`, `isBozo`

- **Review**: Course reviews and ratings
  - 5-star rating system with optional text
  - Supports @mentions
  - Filtered based on bozo status

- **Comment**: Threaded comments (up to 5 levels)
  - Supports @mentions
  - Self-referential for threading
  - Filtered based on bozo status

- **Notification**: In-app notifications
  - Types: `COMMENT_REPLY`, `REVIEW_REPLY`, `MENTION`, `COURSE_UPDATE`
  - Read/unread status tracking

- **UserPreferences**: Notification settings
  - Email on reply, mention, digest options

- **Favorite**: User's favorite courses

See `prisma/schema.prisma` for the complete schema.

## Key Features Explained

### @Mention System

Users can mention others in reviews and comments:

**User Mentions:**
- Type `@username` to trigger autocomplete
- Searches users by username, first name, last name
- Renders as clickable link to user profile
- Creates notification for mentioned user

**Course Mentions:**
- Type `@[Course Name]` to search courses
- Autocomplete shows course names and designers
- Renders as clickable link to course page
- Format: `@[Course Name](course:id)`

### "No Bozos" Moderation

Shadowban system for handling problematic users:

1. Admin marks user as "bozo" from `/admin/users`
2. Bozo user sees their content normally (unaware of ban)
3. Other users don't see bozo's reviews or comments
4. Rating statistics exclude bozo reviews
5. No notification sent to bozo user
6. Can be reversed anytime by admin

### Video-Course Matching

Intelligent matching algorithm:

1. Parses video titles for course name and designer
   - Format: `"GSPro Course Flyover - [Course Name] - Designed by [Designer]"`
2. Calculates similarity scores using multiple factors:
   - Course name match (fuzzy)
   - Designer name match (exact/fuzzy)
   - Location hints
3. Confidence boosting:
   - +30% for exact designer match
   - +15% for close designer match
4. Threshold: 60% confidence required for auto-match

### Email Notifications

Powered by Resend:

- **Reply Notifications**: When someone replies to your comment
- **Mention Notifications**: When you're mentioned in a review/comment
- **User Control**: Enable/disable per notification type in settings
- **Default**: Enabled for replies and mentions, disabled for digest

## API Routes

### Public Endpoints
- `GET /api/courses` - List courses with filters and pagination
- `GET /api/courses/[slug]` - Get course details by slug
- `GET /api/videos` - List YouTube videos
- `GET /api/resources` - List resources
- `GET /api/search/mentions` - Search users/courses for @mentions

### Authenticated Endpoints
- `POST /api/favorites` - Add course to favorites
- `DELETE /api/favorites/[id]` - Remove from favorites

### Admin Endpoints
- `GET|POST /api/sync/courses-csv` - Trigger CSV course sync
- `POST /api/sync/youtube` - Trigger full YouTube playlist sync

## Development

### Database Commands

```bash
# Push schema changes to database
npx prisma db push

# Create and run migration
npx prisma migrate dev --name migration_name

# Open Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma Client (after schema changes)
npx prisma generate
```

### GitHub Automation

The repository includes automated PR creation and merging for Claude Code branches:

**How it works:**
1. Push to any `claude/**` branch
2. GitHub Action automatically creates a PR
3. PR is set to auto-merge (squash) to `main`
4. Once checks pass, PR merges automatically

**Configuration:**
- Workflow: `.github/workflows/claude-auto-pr.yml`
- Triggers on: `push` to `claude/**` branches
- Merge strategy: Squash merge

**GitHub Settings Required:**
1. Go to **Settings** → **General** → Pull Requests
2. Enable "Allow auto-merge"
3. Enable "Allow squash merging"

### Building for Production

```bash
npm run build
npm run start
```

## Data Synchronization

### Course Sync
- **Source**: [PakGolf Studios CSV](https://pakgolfstudios.com/wp-content/uploads/gspro-course-list.csv)
- **Fields**: Server, Name, Location, Designer, Version, Updated, TourStop, Major Venue, Historic
- **Smart Sync**: Only updates changed courses
- **Schedule**: Daily recommended

### Video Sync
- **Source**: YouTube Data API (Eagles & Birdies playlists)
- **Features**:
  - Full playlist pagination (fetches ALL videos)
  - Auto-matches to courses
  - 50 videos per API request
- **Schedule**: Daily or weekly recommended

### Sync Schedule

For Netlify deployment, set up scheduled functions:

```javascript
// netlify/functions/scheduled-course-sync.js
export async function handler(event, context) {
  const response = await fetch(`${process.env.URL}/api/sync/courses-csv`, {
    method: 'POST'
  });
  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}
```

Configure in `netlify.toml`:
```toml
[[functions]]
  name = "scheduled-course-sync"
  schedule = "0 3 * * *"  # Daily at 3 AM UTC

[[functions]]
  name = "scheduled-video-sync"
  schedule = "0 4 * * 0"  # Weekly on Sunday at 4 AM UTC
```

## Server Patreon Links

Course server badges link directly to creator Patreon pages:

- **Pakman Tier 1** → [Pak Golf Studios Patreon](https://www.patreon.com/cw/pakgolfstudios)
- **RunPuddRun (Birdie/Eagle)** → [RunPuddRun Patreon](https://www.patreon.com/c/runpuddrun/home?vanity=runpuddrun)
- **TekBud** → [TekBud Patreon](https://www.patreon.com/c/tekbud/home)
- **TheGolfBoy** → [TheGolfBoy Patreon](https://www.patreon.com/thegolfboy)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Pak Golf Studios](https://pakgolfstudios.com/) (formerly Pakman Studios) for the GSPro course list
- [Eagles & Birdies](https://www.youtube.com/@EaglesAndBirdies) for the amazing flyover videos
- [RunPuddRun](https://www.patreon.com/c/runpuddrun), [TekBud](https://www.patreon.com/c/tekbud), and [TheGolfBoy](https://www.patreon.com/thegolfboy) for creating incredible courses
- The GSPro community for inspiration and support
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library

---

Built with ⛳ for the GSPro community
