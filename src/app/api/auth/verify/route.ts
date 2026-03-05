import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Already verified" }, { status: 400 });
    }

    if (!user.verificationCode || !user.verificationExpiry) {
      return NextResponse.json({ error: "No verification pending" }, { status: 400 });
    }

    if (new Date() > user.verificationExpiry) {
      return NextResponse.json({ error: "Code expired. Register again." }, { status: 400 });
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({ error: "Wrong code" }, { status: 400 });
    }

    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationExpiry: null,
      },
    });

    const existingStreak = await prisma.streak.findUnique({ where: { userId: user.id } });
    if (!existingStreak) {
      await prisma.streak.create({ data: { userId: user.id } });
    }

    return NextResponse.json({ message: "Email verified" });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
