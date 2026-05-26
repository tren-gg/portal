function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function requireSessionPassword() {
  const value = requireEnv("IRON_SESSION_PASSWORD");
  if (value.length < 32) {
    throw new Error("IRON_SESSION_PASSWORD must be at least 32 characters.");
  }
  return value;
}

export const env = {
  get APP_URL() {
    return requireEnv("NEXT_PUBLIC_APP_URL");
  },
  get MARKETING_URL() {
    return process.env.MARKETING_URL ?? "https://tren.gg";
  },
  get API_URL() {
    if (process.env.NODE_ENV === "production") {
      return requireEnv("TREN_API_URL");
    }
    return process.env.TREN_API_URL ?? "http://localhost:3001";
  },
  get JANUS_URL() {
    if (process.env.NODE_ENV === "production") {
      return requireEnv("TREN_JANUS_URL");
    }
    return process.env.TREN_JANUS_URL ?? "http://localhost:3002";
  },
  get CLIENT_ID() {
    return process.env.TREN_API_CLIENT_ID ?? "tren-portal";
  },
  get SESSION_PASSWORD() {
    return requireSessionPassword();
  },
  get SESSION_COOKIE_NAME() {
    return process.env.IRON_SESSION_COOKIE_NAME ?? "tren_portal_session";
  },
  get DEV_MODE() {
    return process.env.NODE_ENV !== "production" && process.env.DEV_MODE === "true";
  },
};
