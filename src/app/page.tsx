import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code2, BarChart3, Target, Github } from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 h-16 border-b border-border">
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

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-sm text-text-secondary mb-6">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Built for ambitious developers
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold text-center max-w-3xl leading-tight">
          Your Personal
          <br />
          <span className="text-accent">Developer OS</span>
        </h1>

        <p className="text-lg text-text-secondary text-center max-w-xl mt-6">
          Track skills, ship projects, log hours, monitor GitHub activity, and
          build unstoppable momentum. All in one place.
        </p>

        <div className="flex items-center gap-4 mt-8">
          <Link
            href="/register"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
          >
            Start Tracking
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 max-w-4xl w-full">
          {[
            {
              icon: Code2,
              title: "Skill Tracking",
              desc: "Log practice hours. Watch yourself level up.",
            },
            {
              icon: Target,
              title: "Project Management",
              desc: "Track what you're building from plan to launch.",
            },
            {
              icon: BarChart3,
              title: "Growth Analytics",
              desc: "See your learning hours and activity trends.",
            },
            {
              icon: Github,
              title: "GitHub Integration",
              desc: "Pull your commit activity automatically.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-5 rounded-xl border border-border bg-surface"
            >
              <feature.icon size={20} className="text-accent mb-3" />
              <h3 className="font-medium mb-1">{feature.title}</h3>
              <p className="text-sm text-text-secondary">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-text-muted border-t border-border">
        DevTrack &mdash; Built for developers who build.
      </footer>
    </div>
  );
}
