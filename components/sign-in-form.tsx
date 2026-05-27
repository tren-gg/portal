"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { SyringeMark } from "@/components/syringe-mark";

function IntentButton({
  children,
  intent,
  variant = "primary",
}: {
  children: string;
  intent: "password" | "register" | "magic";
  variant?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();
  const className =
    variant === "primary"
      ? "inline-flex min-h-12 w-full items-center justify-between gap-5 bg-white px-5 text-[14px] font-medium text-[#070708] transition-colors hover:bg-[#dadadd] disabled:cursor-not-allowed disabled:opacity-60"
      : "inline-flex min-h-12 w-full items-center justify-between gap-5 border border-white/15 bg-transparent px-5 text-[14px] font-medium text-white transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <button
      type="submit"
      name="intent"
      value={intent}
      className={className}
      disabled={pending}
    >
      <span>{pending ? "Working..." : children}</span>
      <span aria-hidden="true">-&gt;</span>
    </button>
  );
}

export function SignInForm({
  action,
  error,
}: {
  action: (formData: FormData) => Promise<void>;
  error?: string;
}) {
  const [clientError, setClientError] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    setClientError(null);
    const email = formData.get("email") as string;
    const intent = formData.get("intent") as string;
    const password = formData.get("password") as string;
    if (!email || !email.includes("@")) {
      setClientError("Please enter a valid email address.");
      return;
    }
    if (intent !== "magic" && (!password || password.length < 8)) {
      setClientError("Password must be at least 8 characters.");
      return;
    }
    await action(formData);
  }

  return (
    <form
      action={handleAction}
      className="w-full max-w-[520px] border border-white/10 bg-[#070708]/95 text-white shadow-[0_24px_90px_rgba(0,0,0,0.55)]"
    >
      <div className="flex items-center justify-between gap-5 border-b border-white/10 px-6 py-4">
        <div className="inline-flex items-center gap-3">
          <SyringeMark className="h-5 w-5 text-white" />
          <span className="text-xl font-medium leading-none tracking-[0]">tren.</span>
        </div>
        <div className="inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0] text-[#b8b8be]">
          <span className="text-[#8a8a92]">01</span>
          <span className="h-3 w-px bg-white/20" aria-hidden="true" />
          <span className="text-white">Identify</span>
        </div>
      </div>

      <div className="flex flex-col gap-8 px-6 py-9 sm:px-10 sm:py-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-[clamp(3rem,10vw,3.75rem)] font-medium leading-[0.95] tracking-[0]">
            Sign in.
          </h1>
          <p className="max-w-sm text-base leading-relaxed text-[#b8b8be]">
            Use your password or request a one-time email link.
          </p>
        </div>

        {(error || clientError) && (
          <p
            role="alert"
            className="border border-white/20 bg-white/[0.06] px-4 py-3 text-sm leading-relaxed text-white"
          >
            {error || clientError}
          </p>
        )}

        <label className="flex flex-col gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0] text-[#8a8a92]">
            Email
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            autoFocus
            className="h-14 w-full min-w-0 border-0 border-b border-white/10 bg-transparent px-0 pb-3 text-xl font-medium tracking-[0] text-white outline-none transition-colors placeholder:text-[#5b5b64] focus:border-white"
            placeholder="you@domain.com"
          />
        </label>

        <label className="flex flex-col gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0] text-[#8a8a92]">
            Password
          </span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            minLength={8}
            className="h-14 w-full min-w-0 border-0 border-b border-white/10 bg-transparent px-0 pb-3 text-xl font-medium tracking-[0] text-white outline-none transition-colors placeholder:text-[#5b5b64] focus:border-white"
            placeholder="8+ characters"
          />
        </label>

        <div className="grid gap-3">
          <IntentButton intent="password">Sign in</IntentButton>
          <div className="grid gap-3 sm:grid-cols-2">
            <IntentButton intent="register" variant="secondary">
              Create account
            </IntentButton>
            <IntentButton intent="magic" variant="secondary">
              One-time link
            </IntentButton>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-4 text-[10px] font-medium uppercase tracking-[0] text-[#8a8a92] sm:flex-row sm:items-center sm:justify-between">
        <span>Secured / TLS 1.3</span>
        <span>portal.tren.gg</span>
      </div>
    </form>
  );
}
