"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";

export default function BillingSuccessPage() {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= 10) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      router.push("/dashboard");
    }, 10_000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  if (elapsed >= 10) {
    return (
      <div className="grid gap-6">
        <Card>
          <CardContent className="py-12 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Payment processing</h1>
            <p className="mt-2 text-muted-foreground">
              Your payment is being processed. We&apos;ll email you when your subscription is active.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="py-12 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Confirming payment...</h1>
          <p className="mt-2 text-muted-foreground">
            Hang tight while we verify your subscription.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
