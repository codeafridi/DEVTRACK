"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2, Mail } from "lucide-react";
import { Suspense } from "react";

function VerifyForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed");
        setLoading(false);
        return;
      }

      setSuccess(true);

      const result = await signIn("credentials", {
        email,
        password: sessionStorage.getItem("_reg_pw") || "",
        redirect: false,
      });

      sessionStorage.removeItem("_reg_pw");

      if (result?.error) {
        window.location.href = "/login";
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-sm text-center">
        <Image src="/logo.png" alt="DevTrack" width={48} height={48} className="rounded-xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Verified!</h1>
        <p className="text-text-secondary">Signing you in...</p>
        <Loader2 size={20} className="animate-spin mx-auto mt-4 text-accent" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-4">
          <Mail size={24} className="text-accent" />
        </div>
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-text-secondary mt-1">
          We sent a 6-digit code to
        </p>
        <p className="text-sm font-medium mt-1">{email}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Verification Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            required
            placeholder="000000"
            maxLength={6}
            className="w-full px-3 py-3 rounded-lg text-center text-lg tracking-[0.5em] font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Verify Email
        </button>
      </form>

      <p className="text-center text-xs text-text-muted mt-6">
        Code expires in 10 minutes
      </p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-sm text-center">
        <Loader2 size={24} className="animate-spin mx-auto text-accent" />
      </div>
    }>
      <VerifyForm />
    </Suspense>
  );
}
