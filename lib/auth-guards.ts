import { redirect } from "next/navigation";

import { isUnauthorizedApiError } from "./api/client";
import { getMe } from "./api/me";
import { getSession, hasCompleteSession } from "./session";

export async function requireSession() {
  const session = await getSession();
  if (!session.accessToken) {
    redirect("/auth/sign-in");
  }

  if (!hasCompleteSession(session)) {
    redirect("/auth/reset");
  }

  try {
    const me = await getMe();
    return { session, me };
  } catch (error) {
    if (isUnauthorizedApiError(error)) {
      redirect("/auth/reset");
    }

    throw error;
  }
}
