import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchUserRepos, fetchCommitActivity } from "@/lib/github";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { githubUsername: true, githubToken: true },
  });

  if (!user?.githubUsername) {
    return NextResponse.json(
      { error: "GitHub username not configured. Set it in Settings." },
      { status: 400 }
    );
  }

  try {
    const [repos, activity] = await Promise.all([
      fetchUserRepos(user.githubUsername, user.githubToken),
      fetchCommitActivity(user.githubUsername, user.githubToken),
    ]);

    return NextResponse.json({ repos, activity });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data. Please try again later." },
      { status: 502 }
    );
  }
}
