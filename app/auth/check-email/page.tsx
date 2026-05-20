import Link from "next/link";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params.email ?? "your email";

  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <section className="grid w-full max-w-[420px] gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-muted-foreground leading-relaxed">
          We sent a one-time sign-in link to{" "}
          <strong className="text-foreground">{email}</strong>.
          Click the link in that email to continue.
        </p>
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive it?{" "}
          <Link
            href="/auth/sign-in"
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
          >
            Try again
          </Link>
        </p>
      </section>
    </main>
  );
}
