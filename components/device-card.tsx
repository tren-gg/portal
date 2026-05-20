import { Card, CardContent } from "@/components/ui/card";
import type { Device } from "@/lib/api/types";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function DeviceCard({ device }: { device: Device }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4">
        <div className="grid gap-0.5">
          <p className="font-medium">{device.deviceName ?? device.deviceId}</p>
          <p className="text-xs font-mono text-muted-foreground">{device.deviceId}</p>
        </div>
        <div className="text-right grid gap-0.5">
          <p className="text-sm text-muted-foreground">Last seen {timeAgo(device.lastSeenAt)}</p>
          <p className="text-xs text-muted-foreground">
            Activated {new Date(device.activatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
