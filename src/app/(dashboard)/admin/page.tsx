"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Code2, FolderKanban, Activity, Shield, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="p-5 rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-secondary">{label}</span>
        <Icon size={18} className="text-text-muted" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 403) throw new Error(data.error || "ACCESS_DENIED");
        throw new Error(data.error || "Failed to load");
      }
      return res.json() as Promise<{
        totalUsers: number;
        usersToday: number;
        usersThisWeek: number;
        usersThisMonth: number;
        totalSkills: number;
        totalProjects: number;
        totalActivityLogs: number;
        recentUsers: {
          id: string;
          name: string;
          email: string;
          avatarUrl: string | null;
          createdAt: string;
          _count: { skills: number; projects: number; activityLogs: number };
        }[];
      }>;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl border border-border bg-surface animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error?.message?.includes("Access denied") || error?.message === "ACCESS_DENIED") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Shield size={48} className="text-danger mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-text-secondary mt-2">{error.message}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-xl border border-danger/20 bg-danger/5 text-danger">
        Failed to load admin data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-text-secondary mt-1">Platform overview and user management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={data.totalUsers} icon={Users} />
        <StatCard label="Signed Up Today" value={data.usersToday} icon={Clock} />
        <StatCard label="This Week" value={data.usersThisWeek} icon={Users} />
        <StatCard label="This Month" value={data.usersThisMonth} icon={Users} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Skills Created" value={data.totalSkills} icon={Code2} />
        <StatCard label="Total Projects" value={data.totalProjects} icon={FolderKanban} />
        <StatCard label="Total Activity Logs" value={data.totalActivityLogs} icon={Activity} />
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold">All Users ({data.totalUsers})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs text-text-muted">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Skills</th>
                <th className="px-5 py-3 font-medium">Projects</th>
                <th className="px-5 py-3 font-medium">Logs</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-medium text-accent">
                          {user.name?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-text-secondary">{user.email}</td>
                  <td className="px-5 py-3 text-sm text-text-secondary">{user._count.skills}</td>
                  <td className="px-5 py-3 text-sm text-text-secondary">{user._count.projects}</td>
                  <td className="px-5 py-3 text-sm text-text-secondary">{user._count.activityLogs}</td>
                  <td className="px-5 py-3 text-sm text-text-muted">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
