"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Request failed");
  }
  return res.json();
}

async function mutator<T>(
  url: string,
  options: { method: string; body?: unknown }
): Promise<T> {
  const res = await fetch(url, {
    method: options.method,
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Request failed");
  }
  return res.json();
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () =>
      fetcher<{
        totalLearningHours: number;
        activeSkills: number;
        activeProjects: number;
        completedProjects: number;
        currentStreak: number;
        longestStreak: number;
        weeklyHours: number;
        weeklyGoal: number;
        weeklyProgress: number;
        dailyHours: { date: string; hours: number }[];
        recentActivity: {
          id: string;
          date: string;
          description: string;
          hours: number;
          tags: string;
        }[];
      }>("/api/dashboard"),
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: () =>
      fetcher<
        {
          id: string;
          name: string;
          category: string;
          targetLevel: string;
          currentLevel: string;
          totalHours: number;
          createdAt: string;
          logs: {
            id: string;
            hours: number;
            notes: string | null;
            loggedAt: string;
          }[];
        }[]
      >("/api/skills"),
  });
}

export function useSkill(id: string) {
  return useQuery({
    queryKey: ["skills", id],
    queryFn: () =>
      fetcher<{
        id: string;
        name: string;
        category: string;
        targetLevel: string;
        currentLevel: string;
        totalHours: number;
        logs: {
          id: string;
          hours: number;
          notes: string | null;
          loggedAt: string;
        }[];
      }>(`/api/skills/${id}`),
    enabled: !!id,
  });
}

export function useCreateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; category: string; targetLevel: string }) =>
      mutator("/api/skills", { method: "POST", body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["skills"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Skill added");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      mutator(`/api/skills/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["skills"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Skill deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: unknown }) =>
      mutator(`/api/skills/${id}`, { method: "PUT", body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useLogSkillHours() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      skillId,
      hours,
      notes,
    }: {
      skillId: string;
      hours: number;
      notes?: string;
    }) =>
      mutator(`/api/skills/${skillId}/log`, {
        method: "POST",
        body: { hours, notes },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["skills"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Hours logged");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () =>
      fetcher<
        {
          id: string;
          name: string;
          description: string | null;
          status: string;
          githubRepoUrl: string | null;
          completedAt: string | null;
          createdAt: string;
          notes: { id: string; content: string; createdAt: string }[];
        }[]
      >("/api/projects"),
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      status: string;
      githubRepoUrl?: string;
    }) => mutator("/api/projects", { method: "POST", body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Project added");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: unknown }) =>
      mutator(`/api/projects/${id}`, { method: "PUT", body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Project updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      mutator(`/api/projects/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Project deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useAddProjectNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, content }: { projectId: string; content: string }) =>
      mutator(`/api/projects/${projectId}/notes`, {
        method: "POST",
        body: { content },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Note added");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useActivityLogs(page = 1) {
  return useQuery({
    queryKey: ["activity", page],
    queryFn: () =>
      fetcher<{
        logs: {
          id: string;
          date: string;
          description: string;
          hours: number;
          tags: string;
        }[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/api/activity?page=${page}`),
  });
}

export function useCreateActivityLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      date: string;
      description: string;
      hours: number;
      tags: string[];
    }) => mutator("/api/activity", { method: "POST", body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activity"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Activity logged");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useStreakData() {
  return useQuery({
    queryKey: ["streak"],
    queryFn: () =>
      fetcher<{
        streak: {
          currentStreak: number;
          longestStreak: number;
          lastActiveDate: string | null;
        };
        badges: { id: string; type: string; earnedAt: string }[];
      }>("/api/streak"),
  });
}

export function useGitHubData() {
  return useQuery({
    queryKey: ["github"],
    queryFn: () =>
      fetcher<{
        repos: {
          name: string;
          description: string | null;
          url: string;
          language: string | null;
          stars: number;
          forks: number;
          updatedAt: string | null;
        }[];
        activity: {
          totalCommits: number;
          weeklyCommits: Record<string, number>;
          recentCommits: {
            message: string;
            date: string | undefined;
            repo: string | undefined;
            url: string;
          }[];
        };
      }>("/api/github"),
    retry: false,
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      fetcher<{
        id: string;
        name: string;
        email: string;
        githubUsername: string | null;
        createdAt: string;
      }>("/api/settings/profile"),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; githubUsername?: string }) =>
      mutator("/api/settings/profile", { method: "PUT", body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["github"] });
      toast.success("Profile updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
