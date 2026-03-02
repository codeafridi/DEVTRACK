"use client";

import { useDashboard } from "@/hooks/use-api";
import {
  Clock,
  Code2,
  FolderKanban,
  Flame,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { formatHours, getStreakEmoji } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="p-5 rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-secondary">{label}</span>
        <Icon size={18} className="text-text-muted" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
    </div>
  );
}

function WeeklyProgressBar({ progress, hours, goal }: { progress: number; hours: number; goal: number }) {
  return (
    <div className="p-5 rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-secondary">Weekly Goal</span>
        <span className="text-sm text-text-muted">
          {formatHours(hours)} / {formatHours(goal)}
        </span>
      </div>
      <div className="w-full h-3 bg-background rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-xs text-text-muted mt-2">
        {progress >= 100
          ? "Goal reached! Keep pushing."
          : `${Math.round(progress)}% complete this week`}
      </p>
    </div>
  );
}

function ActivityChart({
  data,
}: {
  data: { date: string; hours: number }[];
}) {
  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    hours: d.hours,
  }));

  return (
    <div className="p-5 rounded-xl border border-border bg-surface">
      <h3 className="text-sm font-medium text-text-secondary mb-4">
        Activity — Last 30 Days
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 11 }}
              interval={6}
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
              formatter={(value) => [`${value}h`, "Hours"]}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#hoursGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RecentActivity({
  logs,
}: {
  logs: { id: string; date: string; description: string; hours: number; tags: string }[];
}) {
  if (logs.length === 0) {
    return (
      <div className="p-5 rounded-xl border border-border bg-surface">
        <h3 className="text-sm font-medium text-text-secondary mb-4">
          Recent Activity
        </h3>
        <p className="text-sm text-text-muted">
          No activity yet. Start logging your work!
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl border border-border bg-surface">
      <h3 className="text-sm font-medium text-text-secondary mb-4">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {logs.map((log) => {
          let tags: string[] = [];
          try {
            tags = JSON.parse(log.tags);
          } catch {
            /* empty */
          }
          return (
            <div key={log.id} className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{log.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-text-muted">
                    {new Date(log.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {tags.length > 0 && (
                    <div className="flex gap-1">
                      {tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-sm text-text-secondary whitespace-nowrap">
                {formatHours(log.hours)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl border border-border bg-surface animate-pulse"
            />
          ))}
        </div>
        <div className="h-64 rounded-xl border border-border bg-surface animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl border border-danger/20 bg-danger/5 text-danger">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-text-secondary mt-1">Your developer growth at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Hours"
          value={formatHours(data.totalLearningHours)}
          sub="All learning + activity"
          icon={Clock}
        />
        <StatCard
          label="Active Skills"
          value={data.activeSkills}
          sub="Skills being tracked"
          icon={Code2}
        />
        <StatCard
          label="Active Projects"
          value={data.activeProjects}
          sub={`${data.completedProjects} completed`}
          icon={FolderKanban}
        />
        <StatCard
          label="Current Streak"
          value={`${data.currentStreak}d ${getStreakEmoji(data.currentStreak)}`}
          sub={`Longest: ${data.longestStreak}d`}
          icon={data.currentStreak >= 7 ? Flame : Trophy}
        />
      </div>

      <WeeklyProgressBar
        progress={data.weeklyProgress}
        hours={data.weeklyHours}
        goal={data.weeklyGoal}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityChart data={data.dailyHours} />
        <RecentActivity logs={data.recentActivity} />
      </div>

      <div className="p-4 rounded-xl border border-border bg-surface flex items-center gap-3">
        <TrendingUp size={18} className="text-accent" />
        <p className="text-sm text-text-secondary">
          {data.totalLearningHours === 0
            ? "Start by adding a skill or logging your first activity!"
            : data.currentStreak >= 7
            ? "Incredible consistency. You're building real momentum."
            : data.currentStreak >= 3
            ? "Great streak going! Keep showing up."
            : "Log activity every day to build your streak."}
        </p>
      </div>
    </div>
  );
}
