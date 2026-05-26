import { janusFetch } from "./client";

export async function createCheckout(plan: string): Promise<{ url: string }> {
  return janusFetch<{ url: string }>("/v1/checkout/session", {
    method: "POST",
    body: JSON.stringify({ product_sku: plan, provider: "stripe" }),
  });
}

export async function createPortalSession(): Promise<{ url: string }> {
  return janusFetch<{ url: string }>("/v1/portal/session", {
    method: "POST",
    body: JSON.stringify({}),
  });
}
