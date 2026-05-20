import { redirect } from "next/navigation";

import { SignInForm } from "@/components/sign-in-form";
import { DevAccountPicker } from "@/components/dev-account-picker";
import { startEmailFlow } from "@/lib/api/auth";
import { env } from "@/lib/env";
import { generateVerifier, deriveChallenge, generateState } from "@/lib/pkce";
import { getPkceSession, getSession } from "@/lib/session";
import { DEV_ACCOUNTS } from "@/lib/dev-data";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; next?: string; error?: string }>;
}) {
  const session = await getSession();
  if (session.accessToken) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  async function handleSignIn(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    if (!email) {
      redirect(`/auth/sign-in?error=${encodeURIComponent("Email is required.")}`);
    }

    const verifier = generateVerifier();
    const challenge = deriveChallenge(verifier);
    const state = generateState();

    const pkce = await getPkceSession();
    pkce.verifier = verifier;
    pkce.state = state;
    pkce.next = params.next ?? null;
    pkce.plan = params.plan ?? null;
    await pkce.save();

    try {
      await startEmailFlow(email, { codeChallenge: challenge, state });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong.";
      redirect(`/auth/sign-in?error=${encodeURIComponent(message)}`);
    }

    redirect(`/auth/check-email?email=${encodeURIComponent(email)}`);
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
    <main className="grid min-h-dvh place-items-center p-6">
      {env.DEV_MODE ? (
        <div className="grid w-full max-w-[420px] gap-6">
          <div className="grid gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">Developer Mode</h1>
            <p className="text-muted-foreground leading-relaxed">
              Pick a test account to sign in instantly.
            </p>
          </div>
          <DevAccountPicker action={handleDevSignIn} />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or use real auth</span>
            </div>
          </div>
          <SignInForm action={handleSignIn} error={params.error} />
        </div>
      ) : (
        <SignInForm action={handleSignIn} error={params.error} />
      )}
      <footer className="fixed bottom-6 text-sm text-muted-foreground">
        <a href={env.MARKETING_URL} className="hover:text-foreground transition-colors">
          &larr; Back to tren.gg
        </a>
      </footer>
    </main>
  );
}
