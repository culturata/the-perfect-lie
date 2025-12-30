# The Perfect Lie

> Discover. Play. Connect.

A modern, full-stack Next.js application for the GSPro golf simulator community. Discover courses, find resources, and connect with fellow golf simulation enthusiasts.

## Features

- **Course Directory**: Browse thousands of GSPro courses with search, filtering, and pagination
- **YouTube Flyovers**: Watch course preview videos from the Eagles & Birdies playlist
- **Resource Hub**: Curated collection of launch monitors, retailers, equipment, and community resources
- **User Accounts**: Save favorites, write reviews, and track your progress
- **Admin Panel**: Manage resources and sync data from external sources

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account (for authentication)
- YouTube Data API key

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

# YouTube Data API
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_FLYOVERS_PLAYLIST_ID=PLEKTcA5lfrkyDvi4zRCO1CKDFzXIL8xd0
YOUTUBE_GOLF_PLAYLIST_ID=your_golf_playlist_id
```

4. **Setup the database**

```bash
# Generate Prisma Client
npx prisma generate

# Push the Prisma schema to your database
npx prisma db push
```

5. **Sync course data**

Perform an initial sync to populate the course database:

```bash
# Start the development server
npm run dev

# In a separate terminal or browser, trigger the course sync
curl http://localhost:3000/api/sync/courses-csv

# Or visit in your browser:
# http://localhost:3000/api/sync/courses-csv
```

6. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
the-perfect-lie/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   ├── courses/             # Course pages
│   ├── flyovers/            # YouTube flyovers page
│   ├── golf-videos/         # Golf videos page
│   ├── resources/           # Resource hub
│   └── dashboard/           # User dashboard
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── courses/             # Course-related components
│   ├── videos/              # Video-related components
│   ├── resources/           # Resource components
│   └── layout/              # Layout components
├── lib/                     # Utility functions
│   ├── scrapers/            # Web scrapers
│   └── youtube/             # YouTube API integration
├── prisma/                  # Prisma schema and migrations
├── services/                # Business logic services
└── types/                   # TypeScript type definitions
```

## Development

### Database Commands

```bash
# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Generate Prisma Client
npm run db:generate

# Create and run migrations
npm run db:migrate
```

### Building for Production

```bash
npm run build
npm run start
```

## Database Schema

The application uses the following main models:

- **Course**: GSPro courses with metadata
  - CSV fields: `server`, `location`, `version`, `tourStop`, `majorVenue`, `historic`
  - Indexed fields for fast filtering: designer, tourStop, majorVenue, historic
- **YouTubeVideo**: Synced YouTube videos
- **Resource**: Community resources and equipment
- **User**: User accounts (synced with Clerk)
- **Favorite**: User's favorite courses
- **Review**: Course reviews and ratings
- **SyncLog**: Data synchronization logs

See `prisma/schema.prisma` for the complete schema.

## API Routes

- `GET /api/courses` - List courses with filters and pagination
  - Query params: `search`, `designer`, `tourStop`, `majorVenue`, `historic`, `page`, `limit`
- `GET /api/courses/[slug]` - Get course details by slug
- `GET /api/videos` - List YouTube videos
- `GET /api/resources` - List resources
- `POST /api/favorites` - Add course to favorites
- `DELETE /api/favorites/[id]` - Remove from favorites
- `GET|POST /api/sync/courses-csv` - Trigger CSV course sync (manual/scheduled)
- `POST /api/sync/videos` - Trigger video sync (admin)

## Data Synchronization

The app syncs data from external sources:

- **Courses**: Downloaded from [Pakman Studios CSV](https://pakmanstudios.com/wp-content/uploads/gspro-course-list.csv)
  - Fields: Server, Name, Location, Designer, Version, Updated, TourStop, Major Venue, Historic
  - Smart sync: Only updates courses with actual changes (version, dates, or flags)
  - Stores all data in PostgreSQL for fast queries and filtering
- **Videos**: Fetched from YouTube Data API (Eagles & Birdies playlist)

### Course Sync Process

The course sync system (`lib/scrapers/csv-sync.ts`):
1. Downloads the latest CSV from Pakman Studios
2. Parses the CSV data
3. Compares with existing database records
4. Only updates courses that have changed
5. Returns statistics: added, updated, unchanged counts

### Sync Schedule

Recommended sync schedule:
- **Courses**: Daily (via scheduled function or cron job)
- **Videos**: Daily or weekly
- **Manual**: Trigger anytime via `/api/sync/courses-csv`

For Netlify deployment, set up a scheduled function:

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
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Pakman Studios](https://pakmanstudios.com/) for the GSPro course list
- [Eagles & Birdies](https://www.youtube.com/@EaglesAndBirdies) for the amazing flyover videos
- The GSPro community for inspiration and support

---

Built with ⛳ for the GSPro community