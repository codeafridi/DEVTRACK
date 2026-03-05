import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, code: string) {
  await resend.emails.send({
    from: "DevTrack <onboarding@resend.dev>",
    to: email,
    subject: "Verify your DevTrack account",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #fafafa; margin-bottom: 8px;">Verify your email</h2>
        <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">
          Enter this code in DevTrack to verify your account:
        </p>
        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #6366f1;">
            ${code}
          </span>
        </div>
        <p style="color: #71717a; font-size: 12px;">
          This code expires in 10 minutes. If you didn't sign up for DevTrack, ignore this email.
        </p>
      </div>
    `,
  });
}
