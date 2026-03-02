import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStreak } from "@/lib/streak";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const streak = await getStreak(session.user.id);
  const badges = await prisma.badge.findMany({
    where: { userId: session.user.id },
    orderBy: { earnedAt: "desc" },
  });

  return NextResponse.json({ streak, badges });
}
