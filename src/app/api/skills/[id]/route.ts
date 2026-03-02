import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const skill = await prisma.skill.findFirst({
    where: { id, userId: session.user.id },
    include: {
      logs: { orderBy: { loggedAt: "desc" } },
    },
  });

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...skill,
    totalHours: skill.logs.reduce((sum, log) => sum + log.hours, 0),
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const skill = await prisma.skill.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await prisma.skill.update({
    where: { id },
    data: {
      name: body.name ?? skill.name,
      category: body.category ?? skill.category,
      targetLevel: body.targetLevel ?? skill.targetLevel,
      currentLevel: body.currentLevel ?? skill.currentLevel,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const skill = await prisma.skill.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ message: "Skill deleted" });
}
