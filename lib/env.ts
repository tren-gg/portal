function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
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
    return process.env.TREN_API_URL ?? "http://localhost:3001";
  },
  get CLIENT_ID() {
    return process.env.TREN_API_CLIENT_ID ?? "tren-portal";
  },
  get SESSION_PASSWORD() {
    return requireEnv("IRON_SESSION_PASSWORD");
  },
  get SESSION_COOKIE_NAME() {
    return process.env.IRON_SESSION_COOKIE_NAME ?? "tren_portal_session";
  },
  get DEV_MODE() {
    return process.env.DEV_MODE === "true";
  },
};
