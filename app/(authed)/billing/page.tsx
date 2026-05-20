import Link from "next/link";
import { redirect } from "next/navigation";

import { ScreenHead } from "@/components/screen-head";
import { createPortalSession } from "@/lib/api/billing";
import { getApiErrorMessage } from "@/lib/api/client";
import { getSubscription } from "@/lib/api/account";

async function openBillingPortal() {
  "use server";

  let url: string;
  try {
    ({ url } = await createPortalSession());
  } catch (error) {
    redirect(`/billing?error=${encodeURIComponent(getApiErrorMessage(error))}`);
  }

  redirect(url);
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; checkout?: string }>;
}) {
  const params = await searchParams;
  const subscription = await getSubscription();

  const status = subscription?.status ?? "none";
  const renewLabel = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  return (
    <>
      <ScreenHead
        eyebrow="subscription"
        title="Monthly access,<br/>billed plainly."
      />

      <div className="screen-body">
        {(params.error || params.checkout) && (
          <div className="group">
            <div className="group__l">
              <h2 className="group__title">
                {params.error ? "Billing unavailable" : "Checkout returned"}
              </h2>
            </div>
            <div className="group__r">
              <div className="rowlist">
                <div className="row">
                  <div className="row__main">
                    <div className="row__title">
                      {params.error ??
                        (params.checkout === "success"
                          ? "Checkout completed. Your subscription will update after Stripe confirms it."
                          : "Checkout was canceled.")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Current plan</h2>
            <p className="group__caption">
              Billing is backed by the API. Stripe controls are shown only when
              the account has a Stripe-backed subscription.
            </p>
          </div>
          <div className="group__r">
            <div className="rowlist">
              <div className="form-row">
                <span className="form-row__label">plan</span>
                <span className="form-row__val">
                  {subscription ? `Tren ${subscription.plan}` : "No plan"}
                </span>
                <span
                  className={`tag ${status === "active" || status === "trialing" ? "tag--active" : status === "past_due" ? "tag--warn" : "tag--off"}`}
                >
                  <span className="dot" />
                  {status === "none" ? "inactive" : status}
                </span>
              </div>

              {subscription ? (
                <>
                  <div className="form-row">
                    <span className="form-row__label">renews</span>
                    <span className="form-row__val">{renewLabel}</span>
                    <span className="form-row__val form-row__val--muted">
                      {subscription.source}
                    </span>
                  </div>
                  <div className="form-row">
                    <span className="form-row__label">devices</span>
                    <span className="form-row__val">
                      {subscription.deviceLimit} devices included
                    </span>
                    <Link href="/devices" className="linkbtn linkbtn--muted">
                      manage
                    </Link>
                  </div>
                </>
              ) : (
                <div className="form-row">
                  <span className="form-row__label">access</span>
                  <span className="form-row__val form-row__val--muted">
                    Subscribe when Checkout is configured, or activate manually
                    during testing.
                  </span>
                  <Link href="/subscribe?plan=monthly" className="linkbtn">
                    subscribe
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Stripe portal</h2>
            <p className="group__caption">
              No payment details are stored in the portal. Stripe owns cards,
              invoices, tax details, and cancellation once billing is enabled.
            </p>
          </div>
          <div className="group__r">
            <div className="rowlist">
              <div className="row">
                <div className="row__main">
                  <div className="row__title">
                    {subscription?.source === "stripe"
                      ? "Manage billing in Stripe"
                      : subscription?.source === "manual"
                        ? "Manual subscription"
                        : "Stripe not connected to this account"}
                  </div>
                  <div className="row__meta">
                    <span>
                      {subscription?.source === "stripe"
                        ? "opens Stripe Customer Portal"
                        : "no Stripe customer is available yet"}
                    </span>
                  </div>
                </div>
                <div className="row__right">
                  {subscription?.source === "stripe" ? (
                    <form action={openBillingPortal}>
                      <button className="linkbtn" type="submit">
                        open portal
                      </button>
                    </form>
                  ) : (
                    <span className="tag tag--off">
                      <span className="dot" />
                      unavailable
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
