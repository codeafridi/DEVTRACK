"use client";

import { useState } from "react";
import {
  useActivityLogs,
  useCreateActivityLog,
  useStreakData,
} from "@/hooks/use-api";
import {
  Plus,
  X,
  Loader2,
  Activity,
  Flame,
  Trophy,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn, formatHours, formatDate, getStreakEmoji } from "@/lib/utils";

const BADGE_LABELS: Record<string, string> = {
  STREAK_3: "3-Day Streak",
  STREAK_7: "1-Week Streak",
  STREAK_14: "2-Week Streak",
  STREAK_30: "30-Day Streak",
  STREAK_60: "60-Day Streak",
  STREAK_100: "100-Day Streak",
};

const COMMON_TAGS = [
  "coding",
  "reading",
  "tutorial",
  "project",
  "practice",
  "debugging",
  "design",
  "review",
];

function AddActivityModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("1");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const createLog = useCreateActivityLog();

  if (!open) return null;

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function addCustomTag() {
    const tag = customTag.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setCustomTag("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createLog.mutate(
      { date, description, hours: parseFloat(hours), tags },
      {
        onSuccess: () => {
          setDescription("");
          setHours("1");
          setDate(new Date().toISOString().split("T")[0]);
          setTags([]);
          onClose();
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Log Activity</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">What did you work on?</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your work..."
              rows={3}
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Hours</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="8"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                    tags.includes(tag)
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-text-muted hover:text-text-secondary"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
                placeholder="Add custom tag"
                className="flex-1 px-3 py-2 rounded-lg text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={createLog.isPending}
            className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {createLog.isPending && <Loader2 size={16} className="animate-spin" />}
            Log Activity
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ActivityPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useActivityLogs(page);
  const { data: streakData } = useStreakData();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Activity</h1>
          <p className="text-text-secondary mt-1">Log your daily work and track streaks</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Log Activity
        </button>
      </div>

      {streakData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-border bg-surface">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={18} className="text-orange-400" />
              <span className="text-sm text-text-secondary">Current Streak</span>
            </div>
            <p className="text-2xl font-bold">
              {streakData.streak.currentStreak}d{" "}
              {getStreakEmoji(streakData.streak.currentStreak)}
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-surface">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={18} className="text-yellow-400" />
              <span className="text-sm text-text-secondary">Longest Streak</span>
            </div>
            <p className="text-2xl font-bold">{streakData.streak.longestStreak}d</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-surface">
            <div className="flex items-center gap-2 mb-2">
              <Award size={18} className="text-accent" />
              <span className="text-sm text-text-secondary">Badges Earned</span>
            </div>
            <p className="text-2xl font-bold">{streakData.badges.length}</p>
          </div>
        </div>
      )}

      {streakData && streakData.badges.length > 0 && (
        <div className="p-5 rounded-xl border border-border bg-surface">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {streakData.badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm"
              >
                <Award size={14} />
                {BADGE_LABELS[badge.type] || badge.type}
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl border border-border bg-surface animate-pulse"
            />
          ))}
        </div>
      ) : data && data.logs.length > 0 ? (
        <>
          <div className="space-y-3">
            {data.logs.map((log) => {
              let tags: string[] = [];
              try {
                tags = JSON.parse(log.tags);
              } catch {
                /* empty */
              }
              return (
                <div
                  key={log.id}
                  className="p-4 rounded-xl border border-border bg-surface flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{log.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-text-muted">
                        {formatDate(log.date)}
                      </span>
                      {tags.length > 0 && (
                        <div className="flex gap-1">
                          {tags.map((tag) => (
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
                  <span className="text-sm font-medium text-text-secondary whitespace-nowrap">
                    {formatHours(log.hours)}
                  </span>
                </div>
              );
            })}
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-text-secondary">
                Page {page} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                }
                disabled={page >= data.pagination.totalPages}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Activity size={32} className="mx-auto text-text-muted mb-3" />
          <h3 className="font-medium">No activity logged yet</h3>
          <p className="text-sm text-text-muted mt-1">
            Start logging your daily work to build streaks.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
          >
            Log Your First Activity
          </button>
        </div>
      )}

      <AddActivityModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}
