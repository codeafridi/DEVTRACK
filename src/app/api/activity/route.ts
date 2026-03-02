import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { activityLogSchema } from "@/lib/validations";
import { updateStreak } from "@/lib/streak";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
  const offset = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.activityLog.count({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json({
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = activityLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const logDate = new Date(parsed.data.date);
    logDate.setHours(0, 0, 0, 0);

    const existing = await prisma.activityLog.findUnique({
      where: {
        userId_date: { userId: session.user.id, date: logDate },
      },
    });

    if (existing) {
      const updated = await prisma.activityLog.update({
        where: { id: existing.id },
        data: {
          description: parsed.data.description,
          hours: parsed.data.hours,
          tags: JSON.stringify(parsed.data.tags),
        },
      });
      await updateStreak(session.user.id);
      return NextResponse.json(updated);
    }

    const log = await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        date: logDate,
        description: parsed.data.description,
        hours: parsed.data.hours,
        tags: JSON.stringify(parsed.data.tags),
      },
    });

    await updateStreak(session.user.id);
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Create activity log error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
