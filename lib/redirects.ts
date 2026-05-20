const allowedNextPaths = new Set([
  "/account",
  "/billing",
  "/configs",
  "/dashboard",
  "/devices",
  "/download",
  "/profile",
  "/subscribe",
]);

export function getSafeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return null;
  }

  try {
    const url = new URL(value, "https://portal.tren.gg");
    if (!allowedNextPaths.has(url.pathname)) return null;
    return url.pathname;
  } catch {
    return null;
  }
}

export function getSafePlan(value: string | null | undefined) {
  return value === "monthly" || value === "yearly" ? value : null;
}
