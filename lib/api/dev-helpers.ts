import { env } from "@/lib/env";
import { getDevAccount, type DevAccount } from "@/lib/dev-data";
import { getSession } from "@/lib/session";
import type { Subscription, Device } from "./types";

export async function getDevAccountForSession(): Promise<DevAccount | null> {
  if (!env.DEV_MODE) return null;
  const session = await getSession();
  return getDevAccount(session.userId) ?? null;
}

export async function getSubscription(): Promise<Subscription | null> {
  const devAccount = await getDevAccountForSession();
  if (devAccount) return devAccount.subscription;
  return null;
}

export async function getDevices(): Promise<Device[]> {
  const devAccount = await getDevAccountForSession();
  if (devAccount) return devAccount.devices;
  return [];
}
