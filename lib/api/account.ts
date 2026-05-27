import { env } from "@/lib/env";
import { getDevAccount } from "@/lib/dev-data";
import { getSession } from "@/lib/session";
import { ApiError, apiFetch } from "./client";
import type {
  Device,
  DeviceResponse,
  DevicesResponse,
  DownloadUrlResponse,
  MeResponse,
  SavedConfigDetails,
  SavedConfigResponse,
  SavedConfigsResponse,
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

  try {
    const data = await apiFetch<SubscriptionResponse>("/v1/billing/subscription");
    return data.subscription;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      const me = await apiFetch<MeResponse>("/v1/me");
      return me.subscription ?? null;
    }
    throw error;
  }
}

export async function getDevices(): Promise<Device[]> {
  const devAccount = await getDevAccountForSession();
  if (devAccount) return devAccount.devices;

  const data = await apiFetch<DevicesResponse>("/v1/me/devices");
  return data.devices;
}

export async function getSavedConfigs() {
  const devAccount = await getDevAccountForSession();
  if (env.DEV_MODE) return devAccount?.configs ?? [];

  const data = await apiFetch<SavedConfigsResponse>("/v1/me/configs");
  return data.configs;
}

export async function getSavedConfig(id: string): Promise<SavedConfigDetails> {
  const devAccount = await getDevAccountForSession();
  if (env.DEV_MODE) {
    const config = devAccount?.configs.find((c) => c.id === id);
    if (config) return { ...config, payload: "" };
    throw new ApiError(404, {
      error: {
        code: "not_found",
        message: "Saved config not found.",
      },
    });
  }

  const data = await apiFetch<SavedConfigResponse>(`/v1/me/configs/${encodeURIComponent(id)}`);
  return data.config;
}

export async function deleteSavedConfig(id: string): Promise<void> {
  if (env.DEV_MODE) return;

  await apiFetch<void>(`/v1/me/configs/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
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

export async function updatePassword(input: {
  currentPassword?: string;
  newPassword: string;
}) {
  return apiFetch<{ hasPassword: true }>("/v1/me/password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
