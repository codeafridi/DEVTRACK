import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Code2,
  Target,
  Github,
  Flame,
  Clock,
  FolderKanban,
  Activity,
  GitCommit,
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 flex items-center justify-between px-6 h-16 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="DevTrack" width={32} height={32} className="rounded-lg" />
          <span className="text-lg font-semibold tracking-tight">DevTrack</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="flex flex-col items-center px-4 pt-20 pb-12">
          <h1 className="text-4xl sm:text-6xl font-bold text-center max-w-3xl leading-tight">
            Your Personal
            <br />
            <span className="text-accent">Developer OS</span>
          </h1>

          <p className="text-lg text-text-secondary text-center max-w-xl mt-6">
            Track skills, ship projects, log hours, monitor GitHub activity, and
            build unstoppable momentum. All in one dashboard.
          </p>

          <div className="flex items-center gap-4 mt-8">
            <Link
              href="/register"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
            >
              Start Tracking — It&apos;s Free
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="px-4 pb-20">
          <div className="max-w-5xl mx-auto rounded-xl border border-border bg-surface overflow-hidden shadow-2xl shadow-accent/5">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
              <span className="w-3 h-3 rounded-full bg-danger/60" />
              <span className="w-3 h-3 rounded-full bg-warning/60" />
              <span className="w-3 h-3 rounded-full bg-success/60" />
              <span className="text-xs text-text-muted ml-2">devtrack.app/dashboard</span>
            </div>
            <div className="p-6">
              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={Clock} label="Total Hours" value="127.5" color="text-accent" />
                <StatCard icon={Code2} label="Active Skills" value="8" color="text-success" />
                <StatCard icon={FolderKanban} label="Projects" value="5" color="text-warning" />
                <StatCard icon={Flame} label="Day Streak" value="14" color="text-danger" />
              </div>

              {/* Chart + recent */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 rounded-lg border border-border p-4">
                  <p className="text-sm font-medium mb-4">Last 30 Days</p>
                  <div className="flex items-end gap-1 h-32">
                    {sampleChartData.map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end">
                        <div
                          className="rounded-sm bg-accent/70 hover:bg-accent transition-colors min-h-[2px]"
                          style={{ height: `${(h / 6) * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-text-muted">30 days ago</span>
                    <span className="text-[10px] text-text-muted">Today</span>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium mb-3">Recent Activity</p>
                  <div className="space-y-3">
                    {[
                      { text: "Practiced React hooks", hours: "2h", tag: "coding" },
                      { text: "Built auth for side project", hours: "3h", tag: "project" },
                      { text: "Read system design chapter", hours: "1h", tag: "reading" },
                      { text: "LeetCode medium problems", hours: "1.5h", tag: "practice" },
                    ].map((a, i) => (
                      <div key={i} className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs truncate">{a.text}</p>
                          <span className="text-[10px] text-text-muted">{a.tag}</span>
                        </div>
                        <span className="text-xs text-accent font-medium shrink-0">{a.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Previews */}
        <section className="px-4 pb-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
              Everything you need to grow
            </h2>
            <p className="text-text-secondary text-center mb-14 max-w-lg mx-auto">
              No more scattered notes, forgotten goals, or lost hours. See it all in one place.
            </p>

            {/* Skills Preview */}
            <FeatureRow
              title="Skills Tracker"
              description="Add skills you're learning, log practice hours, set target levels, and watch your progress graph grow over time."
              icon={Code2}
              reverse={false}
            >
              <div className="space-y-3">
                <SkillPreview name="React" level="Advanced" progress={78} hours={45} color="bg-blue-500" />
                <SkillPreview name="TypeScript" level="Intermediate" progress={55} hours={32} color="bg-sky-500" />
                <SkillPreview name="System Design" level="Beginner" progress={25} hours={12} color="bg-purple-500" />
                <SkillPreview name="PostgreSQL" level="Intermediate" progress={48} hours={20} color="bg-emerald-500" />
              </div>
            </FeatureRow>

            {/* Projects Preview */}
            <FeatureRow
              title="Project Board"
              description="Track projects from planning to completion. Add notes, link GitHub repos, and never lose context on what you're building."
              icon={Target}
              reverse={true}
            >
              <div className="space-y-3">
                <ProjectPreview name="DevTrack Dashboard" status="Building" statusColor="bg-accent" notes={3} />
                <ProjectPreview name="Portfolio Website" status="Completed" statusColor="bg-success" notes={5} />
                <ProjectPreview name="CLI Task Manager" status="Planning" statusColor="bg-warning" notes={1} />
              </div>
            </FeatureRow>

            {/* Activity Preview */}
            <FeatureRow
              title="Daily Activity Logs"
              description="Record what you worked on each day — hours, descriptions, tags. Build a permanent history of your developer journey."
              icon={Activity}
              reverse={false}
            >
              <div className="space-y-2">
                {[
                  { date: "Today", desc: "Built authentication flow with NextAuth", hours: "3h", tags: ["coding", "project"] },
                  { date: "Yesterday", desc: "Read Clean Code chapters 5-7", hours: "1.5h", tags: ["reading"] },
                  { date: "2 days ago", desc: "Solved 4 LeetCode mediums", hours: "2h", tags: ["practice", "coding"] },
                  { date: "3 days ago", desc: "Designed database schema for new app", hours: "2.5h", tags: ["project"] },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium truncate">{log.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-text-muted">{log.date}</span>
                        {log.tags.map((t) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent">{t}</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-accent font-medium ml-3">{log.hours}</span>
                  </div>
                ))}
              </div>
            </FeatureRow>

            {/* GitHub Preview */}
            <FeatureRow
              title="GitHub Integration"
              description="Connect your GitHub username and see your repos, weekly commit chart, and recent commit feed — all inside DevTrack."
              icon={Github}
              reverse={true}
            >
              <div>
                <div className="flex items-end gap-1.5 h-20 mb-3 px-1">
                  {sampleCommitData.map((c, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div
                        className="rounded-sm bg-success/70 min-h-[2px]"
                        style={{ height: `${(c / 8) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-text-muted mb-3 px-1">Weekly commits</p>
                <div className="space-y-2">
                  {[
                    { msg: "feat: add user authentication", repo: "devtrack", time: "2h ago" },
                    { msg: "fix: resolve hydration error", repo: "devtrack", time: "5h ago" },
                    { msg: "refactor: clean up API routes", repo: "portfolio", time: "1d ago" },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <GitCommit size={12} className="text-success shrink-0" />
                      <span className="truncate flex-1">{c.msg}</span>
                      <span className="text-text-muted shrink-0">{c.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FeatureRow>

            {/* Streaks Preview */}
            <FeatureRow
              title="Streaks & Badges"
              description="Stay consistent and get rewarded. Track consecutive active days and unlock badges as you hit milestones."
              icon={Flame}
              reverse={false}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-danger/10 border border-danger/20">
                    <Flame size={28} className="text-danger" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">14 Days</p>
                    <p className="text-xs text-text-muted">Current Streak</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: "🔥", label: "3-Day", unlocked: true },
                    { icon: "⚡", label: "7-Day", unlocked: true },
                    { icon: "🏆", label: "14-Day", unlocked: true },
                    { icon: "💎", label: "30-Day", unlocked: false },
                  ].map((b) => (
                    <div
                      key={b.label}
                      className={`flex flex-col items-center p-2 rounded-lg border text-center ${
                        b.unlocked
                          ? "border-accent/30 bg-accent/5"
                          : "border-border bg-surface opacity-40"
                      }`}
                    >
                      <span className="text-lg">{b.icon}</span>
                      <span className="text-[10px] mt-1 text-text-secondary">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FeatureRow>
          </div>
        </section>

        {/* Social proof numbers */}
        <section className="px-4 pb-20">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-accent">100%</p>
              <p className="text-xs text-text-muted mt-1">Free Forever</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-accent">&lt;2s</p>
              <p className="text-xs text-text-muted mt-1">Sign Up Time</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-accent">0</p>
              <p className="text-xs text-text-muted mt-1">Config Needed</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 pb-20">
          <div className="max-w-2xl mx-auto text-center rounded-2xl border border-border bg-surface p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Ready to track your growth?
            </h2>
            <p className="text-text-secondary mb-6">
              Sign in with Google and start logging your progress.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="text-center py-6 text-sm text-text-muted border-t border-border">
        <a href="https://github.com/codeafridi/DEVTRACK" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-text-secondary transition-colors">
          <Github size={14} />
          Open source on GitHub
        </a>
      </footer>
    </div>
  );
}

const sampleChartData = [
  1, 2, 0, 3, 2, 4, 1, 0, 3, 5, 2, 1, 4, 3, 0, 2, 6, 3, 1, 4, 2, 5, 3, 1, 0, 4, 3, 2, 5, 3,
];

const sampleCommitData = [3, 5, 2, 7, 4, 1, 6];

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="p-4 rounded-lg border border-border bg-background/50">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className={color} />
        <span className="text-[11px] text-text-muted">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function SkillPreview({
  name,
  level,
  progress,
  hours,
  color,
}: {
  name: string;
  level: string;
  progress: number;
  hours: number;
  color: string;
}) {
  return (
    <div className="p-3 rounded-lg border border-border bg-background/50">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs font-medium">{name}</p>
          <p className="text-[10px] text-text-muted">{level} &middot; {hours}h logged</p>
        </div>
        <span className="text-xs text-accent font-medium">{progress}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function ProjectPreview({
  name,
  status,
  statusColor,
  notes,
}: {
  name: string;
  status: string;
  statusColor: string;
  notes: number;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50">
      <div className="flex items-center gap-2">
        <FolderKanban size={14} className="text-text-muted" />
        <p className="text-xs font-medium">{name}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-text-muted">{notes} notes</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${statusColor}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function FeatureRow({
  title,
  description,
  icon: Icon,
  reverse,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  reverse: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-14 items-center mb-20`}>
      <div className="flex-1 max-w-md">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 mb-4">
          <Icon size={20} className="text-accent" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
      </div>
      <div className="flex-1 w-full max-w-md rounded-xl border border-border bg-surface p-5">
        {children}
      </div>
    </div>
  );
}
