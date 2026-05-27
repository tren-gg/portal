import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth-shell";
import { SignInForm } from "@/components/sign-in-form";
import { DevAccountPicker } from "@/components/dev-account-picker";
import {
  exchangeCode,
  registerWithPassword,
  signInWithPassword,
  startEmailFlow,
} from "@/lib/api/auth";
import { env } from "@/lib/env";
import { generateVerifier, deriveChallenge, generateState } from "@/lib/pkce";
import { getSafeNextPath, getSafePlan } from "@/lib/redirects";
import { getPkceSession, getSession, hasCompleteSession, type SessionData } from "@/lib/session";
import { DEV_ACCOUNTS } from "@/lib/dev-data";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = getSafeNextPath(params.next);
  const plan = getSafePlan(params.plan);
  const session = await getSession();
  const sessionData: Partial<SessionData> = session;

  if (hasCompleteSession(sessionData)) {
    if (next === "/subscribe" && plan) {
      redirect(`/subscribe?plan=${encodeURIComponent(plan)}`);
    }

    redirect(next ?? "/dashboard");
  }

  if (sessionData.accessToken) {
    redirect("/auth/reset");
  }

  async function handleSignIn(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const intent = (formData.get("intent") as string | null) ?? "magic";
    if (!email) {
      redirect(`/auth/sign-in?error=${encodeURIComponent("Email is required.")}`);
    }

    const verifier = generateVerifier();
    const challenge = deriveChallenge(verifier);
    const state = generateState();

    const pkce = await getPkceSession();
    pkce.verifier = verifier;
    pkce.state = state;
    pkce.next = next;
    pkce.plan = plan;
    await pkce.save();

    if (intent === "password" || intent === "register") {
      if (!password || password.length < 8) {
        redirect(`/auth/sign-in?error=${encodeURIComponent("Password must be at least 8 characters.")}`);
      }

      if (intent === "register") {
        try {
          await registerWithPassword(email, password, { codeChallenge: challenge, state });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Something went wrong.";
          redirect(`/auth/sign-in?error=${encodeURIComponent(message)}`);
        }

        redirect(`/auth/check-email?email=${encodeURIComponent(email)}`);
      }

      try {
        const authorized = await signInWithPassword(email, password, { codeChallenge: challenge, state });
        const tokens = await exchangeCode(authorized.code, verifier);
        const session = await getSession();
        session.accessToken = tokens.access_token;
        session.refreshToken = tokens.refresh_token;
        session.accessExpiresAt = tokens.access_expires_at;
        session.refreshExpiresAt = tokens.refresh_expires_at;
        await session.save();
      } catch (e) {
        const message = e instanceof Error ? e.message : "Something went wrong.";
        redirect(`/auth/sign-in?error=${encodeURIComponent(message)}`);
      }

      if (next === "/subscribe" && plan) {
        redirect(`/subscribe?plan=${encodeURIComponent(plan)}`);
      }
      redirect(next ?? "/dashboard");
    }

    let devConfirmUrl: string | undefined;
    try {
      const result = await startEmailFlow(email, { codeChallenge: challenge, state });
      devConfirmUrl = result.devConfirmUrl;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong.";
      redirect(`/auth/sign-in?error=${encodeURIComponent(message)}`);
    }

    const params = new URLSearchParams({ email });
    if (devConfirmUrl) params.set("devConfirmUrl", devConfirmUrl);
    redirect(`/auth/check-email?${params.toString()}`);
  }

  async function handleDevSignIn(formData: FormData) {
    "use server";

    const accountId = formData.get("accountId") as string;
    const account = DEV_ACCOUNTS.find((a) => a.id === accountId);
    if (!account) {
      redirect("/auth/sign-in?error=Invalid+dev+account");
    }

    const session = await getSession();
    session.accessToken = `dev_at_${account.id}`;
    session.refreshToken = `dev_rt_${account.id}`;
    session.accessExpiresAt = new Date(Date.now() + 86400000).toISOString();
    session.refreshExpiresAt = new Date(Date.now() + 30 * 86400000).toISOString();
    session.userId = account.id;
    session.email = account.email;
    await session.save();

    redirect("/dashboard");
  }

  return (
    <AuthShell>
      {env.DEV_MODE ? (
        <div className="grid w-full max-w-[520px] gap-5">
          <SignInForm action={handleSignIn} error={params.error} />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#070708] px-3 text-[#8a8a92]">
                or use real auth
              </span>
            </div>
          </div>
          <section className="border border-white/10 bg-[#070708]/95 text-white shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between gap-5 border-b border-white/10 px-6 py-4">
              <h2 className="text-xl font-medium tracking-[0]">Developer Mode</h2>
              <span className="text-[10px] font-medium uppercase tracking-[0] text-[#8a8a92]">
                Instant
              </span>
            </div>
            <div className="grid gap-5 px-6 py-6">
              <p className="text-sm leading-relaxed text-[#b8b8be]">
                Pick a test account to sign in instantly.
              </p>
              <DevAccountPicker action={handleDevSignIn} />
            </div>
          </section>
        </div>
      ) : (
        <SignInForm action={handleSignIn} error={params.error} />
      )}
    </AuthShell>
  );
}
