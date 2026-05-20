import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const params = await searchParams;
  const plan = params.plan;

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Subscribe to Tren</h1>
          {plan && (
            <p className="mt-2 text-muted-foreground">
              Selected plan: <strong className="text-foreground">{plan}</strong>
            </p>
          )}
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Stripe Checkout is not configured yet. Once billing is live, you&apos;ll be
            redirected to a secure checkout page to complete your subscription.
          </p>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
          >
            Back to dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
