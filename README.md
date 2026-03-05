# DevTrack

**Your personal developer operating system.**

Track your skills, projects, coding hours, GitHub activity, and streaks — all in one dashboard.

[**Start using DevTrack →**](https://www.devtrack.site)

---

## Features

- **Dashboard** — Total hours, active skills, projects, streak count, and a 30-day activity chart
- **Skills Tracker** — Add skills, set target levels, log practice hours, watch progress over time
- **Project Board** — Track projects from planning to completion with notes and GitHub links
- **Daily Logs** — Record what you worked on, how long, and tag it
- **GitHub Integration** — See your repos, commit chart, and recent activity
- **Streaks & Badges** — Stay consistent, hit milestones, build momentum
- **Email Verification** — Secure sign-up with 6-digit email verification
- **Google OAuth** — One-click sign in with Google

## Install as an App

DevTrack works as an installable app on any device — no app store needed.

**Desktop (Chrome / Edge):**
1. Go to [devtrack.site](https://www.devtrack.site)
2. Click the install icon in the address bar (or Menu → "Install DevTrack")
3. DevTrack opens as a standalone desktop app

**Android:**
1. Open [devtrack.site](https://www.devtrack.site) in Chrome
2. Tap Menu (⋮) → "Add to Home screen" → Install
3. DevTrack appears on your home screen

**iPhone / iPad:**
1. Open [devtrack.site](https://www.devtrack.site) in Safari
2. Tap Share (↑) → "Add to Home Screen"
3. DevTrack appears on your home screen

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15, TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | NextAuth.js v5 (Google OAuth + Credentials) |
| Email | Resend |
| Charts | Recharts |
| State | TanStack Query |
| Deployment | Vercel |

## Contributing

Got ideas? Found a bug? Feel free to open an issue or submit a PR.

```bash
git clone https://github.com/codeafridi/DEVTRACK.git
cd DEVTRACK
npm install
cp .env.example .env
# Fill in your environment variables
npx prisma db push
npm run dev
```

## License

MIT

---

Built by [@codeafridi](https://github.com/codeafridi)
