import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
        {children && <div className="mt-4">{children}</div>}
      </CardContent>
    </Card>
  );
}
