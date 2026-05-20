import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";

export default function BillingCanceledPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Checkout canceled</h1>
          <p className="mt-2 text-muted-foreground">
            Your checkout session was canceled. No charges were made.
          </p>
          <a
            href={`${env.MARKETING_URL}/pricing`}
            className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
          >
            View plans
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
