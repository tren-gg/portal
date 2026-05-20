import { redirect } from "next/navigation";

import { getSession } from "./session";

export async function requireSession() {
  const session = await getSession();
  if (!session.accessToken) {
    redirect("/auth/sign-in");
  }
  return session;
}
