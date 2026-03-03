# DevTrack

**Your personal developer operating system.** Track skills, ship projects, log hours, monitor GitHub activity, and build momentum — all in one place.

[**Try DevTrack Live →**](https://devtrack-codeafridis-projects.vercel.app)

---

## What is DevTrack?

DevTrack is a free dashboard built for developers who want to take their growth seriously. Instead of scattered notes and forgotten goals, DevTrack gives you one clean place to track everything that matters.

## Features

**Dashboard** — See your total hours, active skills, projects, current streak, and a 30-day activity chart at a glance.

**Skills Tracker** — Add skills you're learning, set a target level, log practice hours, and watch your progress graph grow.

**Project Board** — Track projects from Planning → Building → Completed. Add notes, link GitHub repos, and never lose context.

**Activity Logs** — Log what you worked on each day with hours, descriptions, and tags. Paginated and searchable.

**GitHub Integration** — Connect your GitHub username to see your repos, weekly commit chart, and recent commit feed.

**Streak System** — Consecutive day tracking that keeps you accountable, with badges for hitting milestones.

## Tech Stack

- **Framework** — Next.js 15, TypeScript, App Router
- **Styling** — Tailwind CSS v4
- **Database** — PostgreSQL via Prisma
- **Auth** — NextAuth.js v5 (Google OAuth)
- **Charts** — Recharts
- **State** — TanStack Query
- **Deployment** — Vercel + Supabase

## Self-Host

```bash
git clone https://github.com/codeafridi/DEVTRACK.git
cd DEVTRACK
npm install
cp .env.example .env
# Fill in your DATABASE_URL, AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
npx prisma db push
npm run dev
```

Open [localhost:3000](http://localhost:3000) and sign in.

## Roadmap

- Public shareable developer profile
- Weekly/monthly analytics comparisons
- AI-powered growth insights
- Gamification (XP, levels, achievements)
- Exportable performance reports

## License

MIT
