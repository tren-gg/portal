import { Card, CardContent } from "@/components/ui/card";

export default function DownloadPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Download</h1>
        <p className="mt-1 text-muted-foreground">Get the Tren loader.</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <h3 className="text-lg font-medium">Loader download is coming soon</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            We&apos;ll email you when the loader is ready to download from the portal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
