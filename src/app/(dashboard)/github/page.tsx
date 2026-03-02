"use client";

import { useGitHubData } from "@/hooks/use-api";
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  AlertCircle,
  GitCommit,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

function CommitChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, commits]) => ({
      week: new Date(week).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      commits,
    }));

  if (chartData.length === 0) return null;

  return (
    <div className="p-5 rounded-xl border border-border bg-surface">
      <h3 className="text-sm font-medium text-text-secondary mb-4">
        Weekly Commits — Last 12 Weeks
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 11 }}
              width={30}
            />
            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                color: "#fafafa",
                fontSize: "13px",
              }}
              formatter={(v) => [v, "Commits"]}
            />
            <Bar dataKey="commits" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function GitHubPage() {
  const { data, isLoading, error } = useGitHubData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">GitHub</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-xl border border-border bg-surface animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">GitHub</h1>
          <p className="text-text-secondary mt-1">Your GitHub activity and repos</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface text-center">
          <AlertCircle size={32} className="mx-auto text-text-muted mb-3" />
          <h3 className="font-medium">GitHub not connected</h3>
          <p className="text-sm text-text-muted mt-1 mb-4">
            Set your GitHub username in Settings to see your activity here.
          </p>
          <Link
            href="/settings"
            className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">GitHub</h1>
        <p className="text-text-secondary mt-1">Your GitHub activity and repos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-border bg-surface">
          <div className="flex items-center gap-2 mb-2">
            <GitCommit size={18} className="text-accent" />
            <span className="text-sm text-text-secondary">Total Commits (12 weeks)</span>
          </div>
          <p className="text-2xl font-bold">{data.activity.totalCommits}</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-surface">
          <div className="flex items-center gap-2 mb-2">
            <Github size={18} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">Repositories</span>
          </div>
          <p className="text-2xl font-bold">{data.repos.length}</p>
        </div>
      </div>

      <CommitChart data={data.activity.weeklyCommits} />

      {data.activity.recentCommits.length > 0 && (
        <div className="p-5 rounded-xl border border-border bg-surface">
          <h3 className="text-sm font-medium text-text-secondary mb-4">
            Recent Commits
          </h3>
          <div className="space-y-3">
            {data.activity.recentCommits.map((commit, i) => (
              <a
                key={i}
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate group-hover:text-accent transition-colors">
                    {commit.message}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {commit.repo} &middot;{" "}
                    {commit.date && formatDate(commit.date)}
                  </p>
                </div>
                <ExternalLink
                  size={14}
                  className="text-text-muted group-hover:text-accent transition-colors mt-0.5"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {data.repos.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-3">
            Repositories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.repos.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-border bg-surface hover:border-border-light transition-colors group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Github size={16} className="text-text-muted" />
                  <h4 className="text-sm font-medium group-hover:text-accent transition-colors truncate">
                    {repo.name}
                  </h4>
                </div>
                {repo.description && (
                  <p className="text-xs text-text-muted line-clamp-2 mb-2">
                    {repo.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      {repo.language}
                    </span>
                  )}
                  {(repo.stars ?? 0) > 0 && (
                    <span className="flex items-center gap-1">
                      <Star size={12} />
                      {repo.stars}
                    </span>
                  )}
                  {(repo.forks ?? 0) > 0 && (
                    <span className="flex items-center gap-1">
                      <GitFork size={12} />
                      {repo.forks}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
