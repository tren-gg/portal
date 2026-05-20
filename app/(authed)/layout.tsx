import { Nav } from "@/components/nav";
import { requireSession } from "@/lib/auth-guards";

export default async function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { me } = await requireSession();

  const handle = me.user.email;
  const initials = me.user.email.charAt(0).toUpperCase();

  return (
    <div className="portal">
      <Nav handle={handle} initials={initials} />
      <main className="main">{children}</main>
    </div>
  );
}
