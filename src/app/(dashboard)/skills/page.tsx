"use client";

import { useState } from "react";
import {
  useSkills,
  useCreateSkill,
  useDeleteSkill,
  useLogSkillHours,
  useUpdateSkill,
} from "@/hooks/use-api";
import {
  Plus,
  Trash2,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
} from "lucide-react";
import { cn, formatHours, getLevelColor, getLevelProgress } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CATEGORIES = [
  "Frontend",
  "Backend",
  "DevOps",
  "Mobile",
  "Data Science",
  "Machine Learning",
  "Database",
  "Security",
  "System Design",
  "DSA",
  "Other",
];

const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

function AddSkillModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [targetLevel, setTargetLevel] = useState<string>("INTERMEDIATE");
  const createSkill = useCreateSkill();

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createSkill.mutate(
      { name, category, targetLevel },
      {
        onSuccess: () => {
          setName("");
          setCategory("Frontend");
          setTargetLevel("INTERMEDIATE");
          onClose();
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Add Skill</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Skill Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., React, Go, System Design"
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Target Level</label>
            <div className="flex gap-2">
              {LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setTargetLevel(level)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium border transition-colors",
                    targetLevel === level
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-text-secondary hover:border-border-light"
                  )}
                >
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={createSkill.isPending}
            className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {createSkill.isPending && <Loader2 size={16} className="animate-spin" />}
            Add Skill
          </button>
        </form>
      </div>
    </div>
  );
}

function LogHoursModal({
  open,
  onClose,
  skillId,
  skillName,
}: {
  open: boolean;
  onClose: () => void;
  skillId: string;
  skillName: string;
}) {
  const [hours, setHours] = useState("1");
  const [notes, setNotes] = useState("");
  const logHours = useLogSkillHours();

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    logHours.mutate(
      { skillId, hours: parseFloat(hours), notes: notes || undefined },
      {
        onSuccess: () => {
          setHours("1");
          setNotes("");
          onClose();
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Log Hours — {skillName}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm text-text-secondary mb-1.5">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you practice?"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={logHours.isPending}
            className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {logHours.isPending && <Loader2 size={16} className="animate-spin" />}
            Log Hours
          </button>
        </form>
      </div>
    </div>
  );
}

function SkillCard({
  skill,
  onLogHours,
}: {
  skill: {
    id: string;
    name: string;
    category: string;
    targetLevel: string;
    currentLevel: string;
    totalHours: number;
    logs: { id: string; hours: number; notes: string | null; loggedAt: string }[];
  };
  onLogHours: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const deleteSkill = useDeleteSkill();
  const updateSkill = useUpdateSkill();

  const progress = getLevelProgress(skill.currentLevel);
  const targetProgress = getLevelProgress(skill.targetLevel);

  const last7DaysLogs: { day: string; hours: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayHours = skill.logs
      .filter((l) => new Date(l.loggedAt).toISOString().split("T")[0] === dateStr)
      .reduce((sum, l) => sum + l.hours, 0);
    last7DaysLogs.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      hours: dayHours,
    });
  }

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{skill.name}</h3>
            <p className="text-xs text-text-muted mt-0.5">{skill.category}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onLogHours}
              className="p-1.5 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-colors"
              title="Log hours"
            >
              <Clock size={16} />
            </button>
            <button
              onClick={() => deleteSkill.mutate(skill.id)}
              className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
              title="Delete skill"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div>
            <p className="text-xs text-text-muted">Total Hours</p>
            <p className="text-sm font-medium">{formatHours(skill.totalHours)}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Level</p>
            <p className={cn("text-sm font-medium", getLevelColor(skill.currentLevel))}>
              {skill.currentLevel.charAt(0) + skill.currentLevel.slice(1).toLowerCase()}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Target</p>
            <p className="text-sm font-medium text-text-secondary">
              {skill.targetLevel.charAt(0) + skill.targetLevel.slice(1).toLowerCase()}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
            <span>Progress</span>
            <span>{Math.round((progress / targetProgress) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${(progress / targetProgress) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-3 flex gap-1">
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => updateSkill.mutate({ id: skill.id, currentLevel: level })}
              className={cn(
                "flex-1 py-1 rounded text-xs font-medium border transition-colors",
                skill.currentLevel === level
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-muted hover:text-text-secondary"
              )}
            >
              {level.charAt(0) + level.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1 py-2 text-xs text-text-muted hover:text-text-secondary border-t border-border transition-colors"
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {expanded ? "Hide" : "Show"} Activity
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-border pt-4">
          <div className="h-24 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysLogs}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 10 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#fafafa",
                    fontSize: "12px",
                  }}
                  formatter={(v) => [`${v}h`, "Hours"]}
                />
                <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {skill.logs.length > 0 ? (
            <div className="space-y-2">
              {skill.logs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <span className="text-text-secondary">
                      {new Date(log.loggedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {log.notes && (
                      <span className="text-text-muted ml-2 truncate">
                        — {log.notes}
                      </span>
                    )}
                  </div>
                  <span className="text-text-secondary font-medium ml-3">
                    {formatHours(log.hours)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">No logs yet. Start practicing!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function SkillsPage() {
  const { data: skills, isLoading } = useSkills();
  const [showAdd, setShowAdd] = useState(false);
  const [logTarget, setLogTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Skills</h1>
          <p className="text-text-secondary mt-1">Track what you&apos;re learning</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Skill
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-xl border border-border bg-surface animate-pulse"
            />
          ))}
        </div>
      ) : skills && skills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onLogHours={() => setLogTarget({ id: skill.id, name: skill.name })}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Target size={32} className="mx-auto text-text-muted mb-3" />
          <h3 className="font-medium">No skills yet</h3>
          <p className="text-sm text-text-muted mt-1">
            Add your first skill to start tracking progress.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
          >
            Add Your First Skill
          </button>
        </div>
      )}

      <AddSkillModal open={showAdd} onClose={() => setShowAdd(false)} />
      {logTarget && (
        <LogHoursModal
          open={true}
          onClose={() => setLogTarget(null)}
          skillId={logTarget.id}
          skillName={logTarget.name}
        />
      )}
    </div>
  );
}
