import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { skillSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skills = await prisma.skill.findMany({
    where: { userId: session.user.id },
    include: {
      logs: {
        orderBy: { loggedAt: "desc" },
        take: 30,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const skillsWithHours = skills.map((skill) => ({
    ...skill,
    totalHours: skill.logs.reduce((sum, log) => sum + log.hours, 0),
  }));

  return NextResponse.json(skillsWithHours);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = skillSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.skill.findUnique({
      where: {
        userId_name: { userId: session.user.id, name: parsed.data.name },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already have a skill with this name" },
        { status: 409 }
      );
    }

    const skill = await prisma.skill.create({
      data: {
        userId: session.user.id,
        ...parsed.data,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Create skill error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
