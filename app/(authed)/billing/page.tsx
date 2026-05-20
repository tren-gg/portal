import { ScreenHead } from "@/components/screen-head";
import { getSubscription } from "@/lib/api/dev-helpers";

export default async function BillingPage() {
  const subscription = await getSubscription();

  const status = subscription?.status ?? "none";
  const renewDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd)
    : null;

  const renewLabel = renewDate
    ? renewDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  return (
    <>
      <ScreenHead
        eyebrow="subscription"
        title="Monthly access,<br/>billed plainly."
      />

      <div className="screen-body">
        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Current plan</h2>
            <p className="group__caption">
              Modules, both seats, and config sync.
            </p>
          </div>
          <div className="group__r">
            <div className="rowlist">
              <div className="form-row">
                <span className="form-row__label">plan</span>
                <span className="form-row__val">
                  {subscription ? `Tren ${subscription.plan}` : "No plan"}
                </span>
                {subscription ? (
                  <span
                    className={`tag ${status === "active" || status === "trialing" ? "tag--active" : status === "past_due" ? "tag--warn" : "tag--off"}`}
                  >
                    <span className="dot" />
                    {status}
                  </span>
                ) : (
                  <span className="tag tag--off">
                    <span className="dot" />
                    inactive
                  </span>
                )}
              </div>
              {subscription && (
                <>
                  <div className="form-row">
                    <span className="form-row__label">price</span>
                    <span className="form-row__val">$8.00 / month USD</span>
                    <span />
                  </div>
                  <div className="form-row">
                    <span className="form-row__label">renews</span>
                    <span className="form-row__val">{renewLabel}</span>
                    <button className="linkbtn linkbtn--muted" type="button">
                      cancel
                    </button>
                  </div>
                  <div className="form-row">
                    <span className="form-row__label">seats</span>
                    <span className="form-row__val">
                      {subscription.deviceLimit} devices included
                    </span>
                    <span className="form-row__val form-row__val--muted">
                      usage managed under devices
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Payment method</h2>
            <p className="group__caption">
              Tren only stores the last 4 digits and the brand.
            </p>
          </div>
          <div className="group__r">
            <div className="rowlist">
              <div className="row">
                <div className="row__main">
                  <div className="row__title">
                    {subscription?.source === "stripe" ? (
                      <>
                        visa ending 4242{" "}
                        <span className="tag tag--active">
                          <span className="dot" />
                          default
                        </span>
                      </>
                    ) : subscription?.source === "manual" ? (
                      "Manually managed"
                    ) : (
                      "No payment method"
                    )}
                  </div>
                  {subscription?.source === "stripe" && (
                    <div className="row__meta">
                      <span>expires 09 / 2028</span>
                    </div>
                  )}
                </div>
                <div className="row__right">
                  <button className="linkbtn linkbtn--muted" type="button">
                    replace
                  </button>
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--ink-500)",
                marginTop: 14,
                lineHeight: 1.6,
              }}
            >
              Stripe handles payment storage and 3-D Secure. The card cannot be
              charged outside the monthly cadence.
            </p>
          </div>
        </div>

        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Invoices</h2>
            <p className="group__caption">
              Receipts are also emailed within an hour of each charge.
            </p>
          </div>
          <div className="group__r">
            <div className="rowlist">
              {subscription ? (
                [
                  ["TR-2026-0093", "04 May 2026", "$8.00", "paid"],
                  ["TR-2026-0072", "04 Apr 2026", "$8.00", "paid"],
                  ["TR-2026-0048", "04 Mar 2026", "$8.00", "paid"],
                ].map(([id, date, amt, invoiceStatus]) => (
                  <div className="row" key={id}>
                    <div className="row__main">
                      <div className="row__title">{id}</div>
                      <div className="row__meta">
                        <span>{date}</span>
                        <span>visa · 4242</span>
                        <span>{subscription.plan} access</span>
                      </div>
                    </div>
                    <div className="row__right">
                      <span
                        className="row__meta"
                        style={{
                          color: "var(--ink-950)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {amt}
                      </span>
                      <span className="tag tag--active">
                        <span className="dot" />
                        {invoiceStatus}
                      </span>
                      <button className="linkbtn linkbtn--muted" type="button">
                        pdf
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="row">
                  <div className="row__main">
                    <div
                      className="row__title"
                      style={{ color: "var(--ink-500)" }}
                    >
                      No invoices
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
