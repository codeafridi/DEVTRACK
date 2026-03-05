import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { sendVerificationEmail } from "@/lib/email";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const code = generateCode();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    if (existingUser && !existingUser.emailVerified) {
      await prisma.user.update({
        where: { email },
        data: {
          name,
          passwordHash,
          verificationCode: code,
          verificationExpiry: expiry,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          verificationCode: code,
          verificationExpiry: expiry,
        },
      });
    }

    await sendVerificationEmail(email, code);

    return NextResponse.json(
      { message: "Verification code sent", requiresVerification: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
