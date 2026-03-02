import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStreak } from "@/lib/streak";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const [
    skills,
    projects,
    activityLogs,
    weeklyLogs,
    streak,
    recentActivity,
  ] = await Promise.all([
    prisma.skill.findMany({
      where: { userId },
      include: { logs: true },
    }),
    prisma.project.findMany({ where: { userId } }),
    prisma.activityLog.findMany({ where: { userId } }),
    prisma.activityLog.findMany({
      where: {
        userId,
        date: { gte: weekStart },
      },
    }),
    getStreak(userId),
    prisma.activityLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 7,
    }),
  ]);

  const totalLearningHours = activityLogs.reduce(
    (sum, log) => sum + log.hours,
    0
  );

  const skillHours = skills.reduce(
    (sum, skill) => sum + skill.logs.reduce((s, l) => s + l.hours, 0),
    0
  );

  const weeklyHours = weeklyLogs.reduce((sum, log) => sum + log.hours, 0);
  const weeklyGoal = 20;

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const dailyHours: { date: string; hours: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const log = activityLogs.find(
      (l) => new Date(l.date).toISOString().split("T")[0] === dateStr
    );
    dailyHours.push({ date: dateStr, hours: log?.hours || 0 });
  }

  return NextResponse.json({
    totalLearningHours: totalLearningHours + skillHours,
    activeSkills: skills.length,
    activeProjects: projects.filter((p) => p.status !== "COMPLETED").length,
    completedProjects: projects.filter((p) => p.status === "COMPLETED").length,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    weeklyHours,
    weeklyGoal,
    weeklyProgress: Math.min((weeklyHours / weeklyGoal) * 100, 100),
    dailyHours,
    recentActivity,
  });
}
