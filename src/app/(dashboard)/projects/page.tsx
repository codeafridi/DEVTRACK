"use client";

import { useState } from "react";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useAddProjectNote,
} from "@/hooks/use-api";
import {
  Plus,
  Trash2,
  ExternalLink,
  MessageSquare,
  X,
  Loader2,
  FolderKanban,
  Send,
} from "lucide-react";
import { cn, formatDate, getStatusColor } from "@/lib/utils";

const STATUSES = ["PLANNING", "BUILDING", "COMPLETED"] as const;

function AddProjectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>("PLANNING");
  const [githubUrl, setGithubUrl] = useState("");
  const createProject = useCreateProject();

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createProject.mutate(
      {
        name,
        description: description || undefined,
        status,
        githubRepoUrl: githubUrl || undefined,
      },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          setStatus("PLANNING");
          setGithubUrl("");
          onClose();
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Add Project</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Project Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., DevTrack, AI Chatbot"
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Status</label>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium border transition-colors",
                    status === s
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-text-secondary hover:border-border-light"
                  )}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">GitHub Repo URL (optional)</label>
            <input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="w-full px-3 py-2.5 rounded-lg text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={createProject.isPending}
            className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {createProject.isPending && <Loader2 size={16} className="animate-spin" />}
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    githubRepoUrl: string | null;
    completedAt: string | null;
    createdAt: string;
    notes: { id: string; content: string; createdAt: string }[];
  };
}) {
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState("");
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const addNote = useAddProjectNote();

  function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNote.mutate(
      { projectId: project.id, content: noteText },
      { onSuccess: () => setNoteText("") }
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{project.name}</h3>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full border",
                  getStatusColor(project.status)
                )}
              >
                {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
              </span>
            </div>
            {project.description && (
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2">
            {project.githubRepoUrl && (
              <a
                href={project.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            )}
            <button
              onClick={() => deleteProject.mutate(project.id)}
              className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
          <span>Created {formatDate(project.createdAt)}</span>
          {project.completedAt && (
            <span>Completed {formatDate(project.completedAt)}</span>
          )}
        </div>

        <div className="flex gap-1 mt-3">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => updateProject.mutate({ id: project.id, status: s })}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                project.status === s
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-muted hover:text-text-secondary"
              )}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          <MessageSquare size={14} />
          Notes ({project.notes.length})
        </button>

        {showNotes && (
          <div className="px-5 pb-5 border-t border-border pt-4">
            <form onSubmit={handleAddNote} className="flex gap-2 mb-3">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a progress note..."
                className="flex-1 px-3 py-2 rounded-lg text-sm"
              />
              <button
                type="submit"
                disabled={addNote.isPending || !noteText.trim()}
                className="p-2 rounded-lg bg-accent hover:bg-accent-hover text-white transition-colors disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
            {project.notes.length > 0 ? (
              <div className="space-y-2">
                {project.notes.map((note) => (
                  <div key={note.id} className="text-sm">
                    <p className="text-text-primary">{note.content}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No notes yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<string>("ALL");

  const filtered =
    filter === "ALL"
      ? projects
      : projects?.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-text-secondary mt-1">Track what you&apos;re building</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      <div className="flex gap-2">
        {["ALL", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              filter === s
                ? "bg-accent/10 text-accent"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
            )}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-xl border border-border bg-surface animate-pulse"
            />
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <FolderKanban size={32} className="mx-auto text-text-muted mb-3" />
          <h3 className="font-medium">No projects yet</h3>
          <p className="text-sm text-text-muted mt-1">
            Start tracking your first project.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
          >
            Add Your First Project
          </button>
        </div>
      )}

      <AddProjectModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}
