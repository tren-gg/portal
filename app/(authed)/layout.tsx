import { Nav } from "@/components/nav";
import { requireSession } from "@/lib/auth-guards";

export default async function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  const handle = session.email;
  const initials = session.email.charAt(0).toUpperCase();

  return (
    <div className="portal">
      <Nav handle={handle} initials={initials} />
      <main className="main">{children}</main>
    </div>
  );
}
