import { redirect } from "next/navigation";

import { getSession, hasCompleteSession, type SessionData } from "@/lib/session";

export default async function RootPage() {
  const session = await getSession();
  const sessionData: Partial<SessionData> = session;

  if (hasCompleteSession(sessionData)) {
    redirect("/dashboard");
  }

  if (sessionData.accessToken) {
    redirect("/auth/reset");
  }

  redirect("/auth/sign-in");
}
