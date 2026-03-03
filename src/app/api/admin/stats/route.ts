import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = [
  "shadowscripter2006@gmail.com",
  "code.afridi@gmail.com",
  "cloudworkspace2006@gmail.com",
  "ohyeahi@gmail.com",
];

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  if (!ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json(
      { error: `Access denied for ${session.user.email}` },
      { status: 403 }
    );
  }

  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      usersToday,
      usersThisWeek,
      usersThisMonth,
      totalSkills,
      totalProjects,
      totalActivityLogs,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
      prisma.skill.count(),
      prisma.project.count(),
      prisma.activityLog.count(),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          createdAt: true,
          _count: {
            select: {
              skills: true,
              projects: true,
              activityLogs: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      usersToday,
      usersThisWeek,
      usersThisMonth,
      totalSkills,
      totalProjects,
      totalActivityLogs,
      recentUsers,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 }
    );
  }
}
