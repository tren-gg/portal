"use client";

import { useFormStatus } from "react-dom";

import { DEV_ACCOUNTS } from "@/lib/dev-data";

function AccountButton({ accountId }: { accountId: string }) {
  const { pending } = useFormStatus();
  const account = DEV_ACCOUNTS.find((a) => a.id === accountId)!;

  return (
    <button
      type="submit"
      name="accountId"
      value={account.id}
      disabled={pending}
      className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex items-center justify-between gap-4">
        <span>
          <span className="block font-medium text-white">{account.label}</span>
          <span className="mt-1 block text-sm text-[#b8b8be]">{account.email}</span>
        </span>
        <span className="text-right text-xs text-[#8a8a92]">
          {account.description}
        </span>
      </span>
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
