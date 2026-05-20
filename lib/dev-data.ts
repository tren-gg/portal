import type { MeResponse, Device, Subscription } from "@/lib/api/types";

export type DevAccount = {
  id: string;
  label: string;
  description: string;
  email: string;
  createdAt: string;
  subscription: Subscription | null;
  devices: Device[];
  isAdmin: boolean;
};

export const DEV_ACCOUNTS: DevAccount[] = [
  {
    id: "dev-user-1",
    label: "Default User",
    description: "Active subscription, 2 devices",
    email: "user@tren.gg",
    createdAt: "2025-01-15T00:00:00.000Z",
    isAdmin: false,
    subscription: {
      id: "sub-1",
      userId: "dev-user-1",
      status: "active",
      plan: "monthly",
      currentPeriodEnd: new Date(Date.now() + 25 * 86400000).toISOString(),
      deviceLimit: 3,
      source: "stripe",
      updatedAt: new Date().toISOString(),
    },
    devices: [
      {
        id: "dev-1",
        userId: "dev-user-1",
        deviceId: "DESKTOP-A1B2C3",
        deviceName: "Main PC",
        activatedAt: "2025-02-01T00:00:00.000Z",
        lastSeenAt: new Date(Date.now() - 3600000).toISOString(),
        revokedAt: null,
      },
      {
        id: "dev-2",
        userId: "dev-user-1",
        deviceId: "LAPTOP-X9Y8Z7",
        deviceName: "Laptop",
        activatedAt: "2025-03-10T00:00:00.000Z",
        lastSeenAt: new Date(Date.now() - 86400000).toISOString(),
        revokedAt: null,
      },
    ],
  },
  {
    id: "dev-admin-1",
    label: "Admin",
    description: "Active subscription, 3 devices, admin access",
    email: "admin@tren.gg",
    createdAt: "2024-10-01T00:00:00.000Z",
    isAdmin: true,
    subscription: {
      id: "sub-2",
      userId: "dev-admin-1",
      status: "active",
      plan: "yearly",
      currentPeriodEnd: new Date(Date.now() + 300 * 86400000).toISOString(),
      deviceLimit: 5,
      source: "manual",
      updatedAt: new Date().toISOString(),
    },
    devices: [
      {
        id: "dev-3",
        userId: "dev-admin-1",
        deviceId: "TOWER-Q1W2E3",
        deviceName: "Dev Rig",
        activatedAt: "2024-11-01T00:00:00.000Z",
        lastSeenAt: new Date(Date.now() - 600000).toISOString(),
        revokedAt: null,
      },
      {
        id: "dev-4",
        userId: "dev-admin-1",
        deviceId: "LAPTOP-R4T5Y6",
        deviceName: "Work Laptop",
        activatedAt: "2024-12-15T00:00:00.000Z",
        lastSeenAt: new Date(Date.now() - 7200000).toISOString(),
        revokedAt: null,
      },
      {
        id: "dev-5",
        userId: "dev-admin-1",
        deviceId: "MINI-U7I8O9",
        deviceName: "Living Room PC",
        activatedAt: "2025-01-20T00:00:00.000Z",
        lastSeenAt: new Date(Date.now() - 172800000).toISOString(),
        revokedAt: null,
      },
    ],
  },
  {
    id: "dev-user-2",
    label: "Free User",
    description: "No subscription, no devices",
    email: "free@tren.gg",
    createdAt: "2025-04-01T00:00:00.000Z",
    isAdmin: false,
    subscription: null,
    devices: [],
  },
  {
    id: "dev-user-3",
    label: "Past Due",
    description: "Past due subscription",
    email: "pastdue@tren.gg",
    createdAt: "2025-01-01T00:00:00.000Z",
    isAdmin: false,
    subscription: {
      id: "sub-3",
      userId: "dev-user-3",
      status: "past_due",
      plan: "monthly",
      currentPeriodEnd: new Date(Date.now() - 5 * 86400000).toISOString(),
      deviceLimit: 3,
      source: "stripe",
      updatedAt: new Date().toISOString(),
    },
    devices: [
      {
        id: "dev-6",
        userId: "dev-user-3",
        deviceId: "PC-P1O2I3",
        deviceName: "Gaming PC",
        activatedAt: "2025-01-15T00:00:00.000Z",
        lastSeenAt: new Date(Date.now() - 432000000).toISOString(),
        revokedAt: null,
      },
    ],
  },
];

export function getDevAccount(userId: string): DevAccount | undefined {
  return DEV_ACCOUNTS.find((a) => a.id === userId);
}

export function devMeResponse(account: DevAccount): MeResponse {
  return {
    user: {
      id: account.id,
      email: account.email,
      createdAt: account.createdAt,
    },
    clientId: "tren-portal",
    scope: "openid profile email",
    accessExpiresAt: new Date(Date.now() + 900000).toISOString(),
    account: {
      auth: {
        method: "magic_link",
        hasPassword: false,
        twoFactorEnabled: false,
        recoveryCodesAvailable: false,
        recoveryCodesRemaining: 0,
      },
      emailPreferences: {
        releases: false,
        security: false,
        changes: false,
        promo: false,
      },
      savedConfigs: [],
    },
  };
}
