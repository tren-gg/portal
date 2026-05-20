import Link from "next/link";
import { redirect } from "next/navigation";

import { ScreenHead } from "@/components/screen-head";
import { createCheckout } from "@/lib/api/billing";
import { getApiErrorMessage } from "@/lib/api/client";

async function startCheckout(formData: FormData) {
  "use server";

  const plan = String(formData.get("plan") ?? "monthly");
  const safePlan = plan === "yearly" ? "yearly" : "monthly";

  let url: string;
  try {
    ({ url } = await createCheckout(safePlan));
  } catch (error) {
    redirect(
      `/subscribe?plan=${encodeURIComponent(safePlan)}&error=${encodeURIComponent(
        getApiErrorMessage(error),
      )}`,
    );
  }

  redirect(url);
}

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; error?: string }>;
}) {
  const params = await searchParams;
  const plan = params.plan === "yearly" ? "yearly" : "monthly";

  return (
    <>
      <ScreenHead
        eyebrow="subscribe"
        title="Start access<br/>from Stripe."
        lede="Checkout is wired to the API. Until Stripe keys and price IDs are configured, the API will return a clear not-configured response."
      />

      <div className="screen-body">
        {params.error && (
          <div className="group">
            <div className="group__l">
              <h2 className="group__title">Checkout unavailable</h2>
            </div>
            <div className="group__r">
              <div className="rowlist">
                <div className="row">
                  <div className="row__main">
                    <div className="row__title">{params.error}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Selected plan</h2>
            <p className="group__caption">
              Stripe is not set up yet, so this page is ready to open Checkout
              once Render has the Stripe env vars.
            </p>
          </div>
          <div className="group__r">
            <div className="rowlist">
              <div className="form-row">
                <span className="form-row__label">plan</span>
                <span className="form-row__val">Tren {plan}</span>
                <span className="tag tag--off">
                  <span className="dot" />
                  pending Stripe
                </span>
              </div>
              <div className="form-row">
                <span className="form-row__label">checkout</span>
                <span className="form-row__val form-row__val--muted">
                  Calls POST /v1/billing/checkout through the API.
                </span>
                <form action={startCheckout}>
                  <input type="hidden" name="plan" value={plan} />
                  <button className="linkbtn" type="submit">
                    open checkout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="dark-block">
          <div className="group__l">
            <h2 className="group__title">Testing without Stripe</h2>
            <p className="group__caption">
              Manual subscriptions still come from the API. Use those for early
              testing until Stripe is configured.
            </p>
          </div>
          <div className="group__r">
            <Link href="/billing" className="btn btn--ghost-dark">
              Back to billing
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
