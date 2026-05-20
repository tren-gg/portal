import { apiFetch } from "./client";

export async function createCheckout(plan: string): Promise<{ url: string }> {
  return apiFetch<{ url: string }>("/v1/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
}

export async function createPortalSession(): Promise<{ url: string }> {
  return apiFetch<{ url: string }>("/v1/billing/portal", {
    method: "POST",
    body: JSON.stringify({}),
  });
}
