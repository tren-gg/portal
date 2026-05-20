"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="h-[46px] w-full font-semibold" disabled={pending}>
      {pending ? "Sending link..." : "Continue"}
    </Button>
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
    if (!email || !email.includes("@")) {
      setClientError("Please enter a valid email address.");
      return;
    }
    await action(formData);
  }

  return (
    <form action={handleAction} className="grid w-full max-w-[420px] gap-4">
      <h1 className="text-3xl font-semibold tracking-tight">Sign in to Tren</h1>
      <p className="text-muted-foreground leading-relaxed">
        Enter your email. We&apos;ll send a one-time sign-in link.
      </p>

      {(error || clientError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || clientError}</AlertDescription>
        </Alert>
      )}

      <Label className="grid gap-2 text-sm text-[#d9d9df]">
        Email
        <Input
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          className="h-[46px] border-border bg-card"
          placeholder="you@example.com"
        />
      </Label>

      <SubmitButton />
    </form>
  );
}
