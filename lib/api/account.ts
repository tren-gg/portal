import { env } from "@/lib/env";
import { getDevAccount } from "@/lib/dev-data";
import { getSession } from "@/lib/session";
import { apiFetch } from "./client";
import type {
  Device,
  DeviceResponse,
  DevicesResponse,
  DownloadUrlResponse,
  Subscription,
  SubscriptionResponse,
} from "./types";

async function getDevAccountForSession() {
  if (!env.DEV_MODE) return null;

  const session = await getSession();
  return getDevAccount(session.userId) ?? null;
}

export async function getSubscription(): Promise<Subscription | null> {
  const devAccount = await getDevAccountForSession();
  if (devAccount) return devAccount.subscription;

  const data = await apiFetch<SubscriptionResponse>("/v1/billing/subscription");
  return data.subscription;
}

export async function getDevices(): Promise<Device[]> {
  const devAccount = await getDevAccountForSession();
  if (devAccount) return devAccount.devices;

  const data = await apiFetch<DevicesResponse>("/v1/me/devices");
  return data.devices;
}

export async function renameDevice(id: string, deviceName: string): Promise<Device> {
  const data = await apiFetch<DeviceResponse>(`/v1/me/devices/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ deviceName }),
  });

  return data.device;
}

export async function revokeDevice(id: string): Promise<Device> {
  const data = await apiFetch<DeviceResponse>(`/v1/me/devices/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  return data.device;
}

export async function createDownloadUrl(): Promise<DownloadUrlResponse> {
  return apiFetch<DownloadUrlResponse>("/v1/download/url", {
    method: "POST",
    body: JSON.stringify({}),
  });
}
