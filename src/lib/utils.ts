import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  return `${hours.toFixed(1)}h`;
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return "🔥";
  if (streak >= 14) return "⚡";
  if (streak >= 7) return "✨";
  if (streak >= 3) return "💪";
  return "🌱";
}

export function getLevelColor(level: string): string {
  switch (level) {
    case "BEGINNER":
      return "text-blue-400";
    case "INTERMEDIATE":
      return "text-yellow-400";
    case "ADVANCED":
      return "text-emerald-400";
    default:
      return "text-neutral-400";
  }
}

export function getLevelProgress(level: string): number {
  switch (level) {
    case "BEGINNER":
      return 33;
    case "INTERMEDIATE":
      return 66;
    case "ADVANCED":
      return 100;
    default:
      return 0;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "PLANNING":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "BUILDING":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "COMPLETED":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    default:
      return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
  }
}
