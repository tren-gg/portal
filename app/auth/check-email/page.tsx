import Link from "next/link";

import { AuthShell } from "@/components/auth-shell";
import { SyringeMark } from "@/components/syringe-mark";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; devConfirmUrl?: string }>;
}) {
  const params = await searchParams;
  const email = params.email ?? "your email";
  const devConfirmUrl = params.devConfirmUrl;

  return (
    <AuthShell>
      <section className="w-full max-w-[520px] border border-white/10 bg-[#070708]/95 text-white shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between gap-5 border-b border-white/10 px-6 py-4">
          <div className="inline-flex items-center gap-3">
            <SyringeMark className="h-5 w-5 text-white" />
            <span className="text-xl font-medium leading-none tracking-[0]">tren.</span>
          </div>
          <div className="inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0] text-[#b8b8be]">
            <span className="text-[#8a8a92]">01b</span>
            <span className="h-3 w-px bg-white/20" aria-hidden="true" />
            <span className="text-white">Sent</span>
          </div>
        </div>

        <div className="flex flex-col gap-8 px-6 py-9 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-[clamp(3rem,10vw,3.75rem)] font-medium leading-[0.95] tracking-[0]">
              Link sent.
            </h1>
            <p className="max-w-sm text-base leading-relaxed text-[#b8b8be]">
              Check your inbox. Open it on this device to finish signing in.
            </p>
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="text-[10px] font-medium uppercase tracking-[0] text-[#8a8a92]">
              Sent to
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white">{email}</p>
          </div>

          {devConfirmUrl ? (
            <div className="grid gap-3 border border-white/15 bg-white/[0.04] p-4">
              <p className="text-[10px] font-medium uppercase tracking-[0] text-[#8a8a92]">
                Examination environment
              </p>
              <p className="text-sm leading-relaxed text-[#b8b8be]">
                Email delivery is disabled in this environment. Use the dev link below to sign in.
              </p>
              <a
                href={devConfirmUrl}
                className="inline-flex min-h-12 items-center justify-between gap-5 bg-white px-5 text-[14px] font-medium text-[#070708] transition-colors hover:bg-[#dadadd]"
              >
                <span>Sign in (examination)</span>
                <span aria-hidden="true">-&gt;</span>
              </a>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-5 border-t border-white/10 pt-5">
            <p className="text-[10px] font-medium uppercase tracking-[0] text-[#8a8a92]">
              Didn&apos;t receive it?
            </p>
            <Link
              href="/auth/sign-in"
              className="text-sm font-medium text-white transition-colors hover:text-[#b8b8be]"
            >
              Try again -&gt;
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-4 text-[10px] font-medium uppercase tracking-[0] text-[#8a8a92] sm:flex-row sm:items-center sm:justify-between">
          <span>Secured / TLS 1.3</span>
          <span>portal.tren.gg</span>
        </div>
      </section>
    </AuthShell>
  );
}
