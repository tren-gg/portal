"use client";

import { useFormStatus } from "react-dom";

import { DEV_ACCOUNTS } from "@/lib/dev-data";
import { Card, CardContent } from "@/components/ui/card";

function AccountButton({ accountId }: { accountId: string }) {
  const { pending } = useFormStatus();
  const account = DEV_ACCOUNTS.find((a) => a.id === accountId)!;

  return (
    <button
      type="submit"
      name="accountId"
      value={account.id}
      disabled={pending}
      className="w-full text-left"
    >
      <Card className="transition-colors hover:bg-accent/50 cursor-pointer">
        <CardContent className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium">{account.label}</p>
            <p className="text-sm text-muted-foreground">{account.email}</p>
          </div>
          <span className="text-xs text-muted-foreground">{account.description}</span>
        </CardContent>
      </Card>
    </button>
  );
}

export function DevAccountPicker({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="grid gap-2">
      {DEV_ACCOUNTS.map((account) => (
        <AccountButton key={account.id} accountId={account.id} />
      ))}
    </form>
  );
}
