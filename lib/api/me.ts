import { env } from "@/lib/env";
import { getDevAccount, devMeResponse } from "@/lib/dev-data";
import { getSession } from "@/lib/session";
import { apiFetch } from "./client";
import type { MeResponse } from "./types";

export async function getMe(): Promise<MeResponse> {
  if (env.DEV_MODE) {
    const session = await getSession();
    const account = getDevAccount(session.userId);
    if (account) return devMeResponse(account);
  }

  return apiFetch<MeResponse>("/v1/me");
}
