"use client";

import { useEffect, useState } from "react";
import { useProfile, useUpdateProfile } from "@/hooks/use-api";
import { Loader2, User, Github, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function SettingsPage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState("");
  const [githubUsername, setGithubUsername] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setGithubUsername(profile.githubUsername || "");
    }
  }, [profile]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateProfile.mutate({
      name,
      githubUsername: githubUsername || undefined,
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="h-64 rounded-xl border border-border bg-surface animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your profile and preferences</p>
      </div>

      <div className="p-6 rounded-xl border border-border bg-surface">
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
          <User size={20} />
          Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Email</label>
            <input
              value={profile?.email || ""}
              disabled
              className="w-full px-3 py-2.5 rounded-lg text-sm opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-text-muted mt-1">Email cannot be changed.</p>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5 flex items-center gap-1.5">
              <Github size={14} />
              GitHub Username
            </label>
            <input
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="your-github-username"
              className="w-full px-3 py-2.5 rounded-lg text-sm"
            />
            <p className="text-xs text-text-muted mt-1">
              Used to fetch your public GitHub activity and repos.
            </p>
          </div>
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {updateProfile.isPending && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>

      {profile && (
        <div className="p-6 rounded-xl border border-border bg-surface">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Calendar size={20} />
            Account
          </h2>
          <div className="text-sm text-text-secondary">
            <p>
              Member since{" "}
              <span className="text-text-primary font-medium">
                {formatDate(profile.createdAt)}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
