import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      notes: { orderBy: { createdAt: "desc" }, take: 5 },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.project.findUnique({
      where: {
        userId_name: { userId: session.user.id, name: parsed.data.name },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already have a project with this name" },
        { status: 409 }
      );
    }

    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        name: parsed.data.name,
        description: parsed.data.description || null,
        status: parsed.data.status,
        githubRepoUrl: parsed.data.githubRepoUrl || null,
        completedAt: parsed.data.status === "COMPLETED" ? new Date() : null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
