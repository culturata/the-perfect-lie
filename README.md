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
# Push the Prisma schema to your database
npm run db:push

# Generate Prisma Client
npm run db:generate
```

5. **Run the development server**

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
- **YouTubeVideo**: Synced YouTube videos
- **Resource**: Community resources and equipment
- **User**: User accounts (synced with Clerk)
- **Favorite**: User's favorite courses
- **Review**: Course reviews and ratings
- **SyncLog**: Data synchronization logs

See `prisma/schema.prisma` for the complete schema.

## API Routes

- `GET /api/courses` - List courses with filters and pagination
- `GET /api/courses/[id]` - Get course details
- `GET /api/videos` - List YouTube videos
- `GET /api/resources` - List resources
- `POST /api/favorites` - Add course to favorites
- `DELETE /api/favorites/[id]` - Remove from favorites
- `POST /api/sync/courses` - Trigger course sync (admin)
- `POST /api/sync/videos` - Trigger video sync (admin)

## Data Synchronization

The app syncs data from external sources:

- **Courses**: Scraped from [Pakman Studios](https://pakmanstudios.com/gspro-course-list/)
- **Videos**: Fetched from YouTube Data API

Sync jobs run:
- Daily at 3 AM UTC (courses)
- Daily at 4 AM UTC (videos)
- Manual trigger via admin panel

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