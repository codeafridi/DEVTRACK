import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { skillLogSchema } from "@/lib/validations";
import { updateStreak } from "@/lib/streak";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const skill = await prisma.skill.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = skillLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const log = await prisma.skillLog.create({
      data: {
        skillId: id,
        hours: parsed.data.hours,
        notes: parsed.data.notes,
      },
    });

    await updateStreak(session.user.id);

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Log skill error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
