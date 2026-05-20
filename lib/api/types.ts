export type EmailStartRequest = {
  response_type: "code";
  client_id: string;
  redirect_uri: string;
  code_challenge: string;
  code_challenge_method: "S256";
  state?: string;
  scope: string;
  email: string;
};

export type EmailStartResponse = {
  status: "pending_email_confirmation";
  email: string;
  expiresAt: string;
  devConfirmUrl?: string;
};

export type PasswordAuthorizeResponse = {
  code: string;
};

export type TokenRequest =
  | {
      grant_type: "authorization_code";
      code: string;
      client_id: string;
      redirect_uri: string;
      code_verifier: string;
    }
  | {
      grant_type: "refresh_token";
      refresh_token: string;
    };

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: number;
  access_expires_at: string;
  refresh_expires_at: string;
};

export type User = {
  id: string;
  email: string;
  createdAt: string;
};

export type MeResponse = {
  user: User;
  clientId: string;
  scope: string;
  accessExpiresAt: string;
  account: {
    auth: {
      method: "magic_link" | "password_or_magic_link";
      hasPassword: boolean;
      twoFactorEnabled: boolean;
      recoveryCodesAvailable: boolean;
      recoveryCodesRemaining: number;
    };
  };
  subscription: Subscription | null;
};

export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled";

export type Subscription = {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  plan: string;
  currentPeriodEnd: string | null;
  deviceLimit: number;
  source: "manual" | "stripe";
  updatedAt: string;
};

export type Device = {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string | null;
  activatedAt: string;
  lastSeenAt: string;
  revokedAt: string | null;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
};

export type DevicesResponse = {
  devices: Device[];
};

export type DeviceResponse = {
  device: Device;
};

export type SubscriptionResponse = {
  subscription: Subscription | null;
};

export type DownloadUrlResponse = {
  url: string;
  expiresAt: string;
};
