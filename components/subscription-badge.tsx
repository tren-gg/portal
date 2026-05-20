import { Badge } from "@/components/ui/badge";
import type { SubscriptionStatus } from "@/lib/api/types";

const statusConfig: Record<SubscriptionStatus | "unknown", { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
  trialing: { label: "Trial", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
  past_due: { label: "Past Due", className: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
  canceled: { label: "Canceled", className: "bg-red-500/15 text-red-400 border-red-500/25" },
  unknown: { label: "Unknown", className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25" },
};

export function SubscriptionBadge({ status }: { status: SubscriptionStatus | "unknown" }) {
  const config = statusConfig[status] ?? statusConfig.unknown;
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
