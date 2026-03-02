# DevTrack — Personal Developer OS

A structured growth dashboard for developers. Track skills, ship projects, log hours, monitor GitHub activity, and build unstoppable momentum.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Database | SQLite (dev) / PostgreSQL (prod) via Prisma |
| Auth | NextAuth.js v5 (JWT, Credentials) |
| State | TanStack Query |
| Charts | Recharts |
| Validation | Zod + React Hook Form |
| GitHub API | Octokit |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Generate a secure AUTH_SECRET
# On Linux/Mac: openssl rand -base64 32
# Paste the output into .env as AUTH_SECRET

# 4. Set up the database
npx prisma db push

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and create your account.

### GitHub Integration

1. Go to **Settings** in the app
2. Enter your GitHub username
3. Visit the **GitHub** tab to see your repos and commit activity

No OAuth token required for public data. For higher rate limits, add a personal access token to `GITHUB_TOKEN` in `.env`.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Register pages
│   ├── (dashboard)/     # Dashboard, Skills, Projects, Activity, GitHub, Settings
│   ├── api/             # REST API routes
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/
│   ├── layout/          # Sidebar
│   └── providers.tsx    # Query + Session + Toast providers
├── hooks/
│   └── use-api.ts       # All data fetching hooks
├── lib/
│   ├── auth.ts          # NextAuth config
│   ├── github.ts        # GitHub API helpers
│   ├── prisma.ts        # Prisma client singleton
│   ├── streak.ts        # Streak calculation + badges
│   ├── utils.ts         # Formatting helpers
│   └── validations.ts   # Zod schemas
└── types/               # TypeScript declarations
```

## Features (MVP)

- **Authentication** — Email/password, JWT sessions, bcrypt hashing
- **Dashboard** — Total hours, active skills/projects, streak, weekly progress bar, 30-day chart
- **Skills** — Add skills, set target level, log practice hours, view progress graph
- **Projects** — Track projects (Planning → Building → Completed), add notes, link GitHub repos
- **Activity Logs** — Daily log with description, hours, tags, pagination
- **Streaks** — Consecutive day tracking with automatic reset, badge system
- **GitHub** — Public repo listing, weekly commit chart, recent commits feed

## Database Commands

```bash
npx prisma studio    # Visual database browser
npx prisma db push   # Push schema changes
npx prisma generate  # Regenerate client
```

## Deployment

### Vercel + Neon PostgreSQL (Recommended)

1. Create a [Neon](https://neon.tech) PostgreSQL database
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Run `npx prisma generate && npx prisma db push`
4. Deploy to [Vercel](https://vercel.com) and set environment variables

## V2 Roadmap

- Public shareable developer profile
- Analytics trends (weekly/monthly comparisons)
- AI-powered growth insights
- Habit prediction based on patterns
- Gamification expansion (XP, levels, achievements)
- Peer comparison (opt-in)
- Exportable performance report (PDF)

## License

MIT
