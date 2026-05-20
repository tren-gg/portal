import Link from "next/link";

import { ScreenHead } from "@/components/screen-head";
import { getMe } from "@/lib/api/me";
import { getSubscription, getDevices } from "@/lib/api/dev-helpers";

export default async function DashboardPage() {
  const [me, subscription, devices] = await Promise.all([
    getMe(),
    getSubscription(),
    getDevices(),
  ]);

  const handle = me.user.email.split("@")[0];
  const subStatus = subscription?.status ?? "none";
  const deviceCount = devices.length;
  const deviceLimit = subscription?.deviceLimit ?? 0;

  const renewDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })
    : null;

  return (
    <>
      <ScreenHead
        eyebrow="overview"
        title={`Signed in as<br/>${handle}.`}
        lede={
          subscription
            ? `Tren is active on ${deviceCount} device${deviceCount !== 1 ? "s" : ""}. ${renewDate ? `Your subscription renews on ${renewDate}.` : ""} Configs sync automatically from the loader when you save them.`
            : "No active subscription. Subscribe to get started with Tren."
        }
        cta={
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <Link href="/configs" className="btn btn--primary-dark">
              Download loader
            </Link>
            <Link href="/devices" className="btn btn--ghost-dark">
              Manage devices
            </Link>
          </div>
        }
      />

      <div className="screen-body">
        <div className="stat-grid">
          <div className="stat">
            <span className="stat__label">subscription</span>
            <span className="stat__value">{subStatus === "none" ? "none" : subStatus}</span>
            <span className="stat__sub">
              {renewDate ? `renews ${renewDate} · ${subscription!.plan} access` : "no plan"}
            </span>
          </div>
          <div className="stat">
            <span className="stat__label">devices</span>
            <span className="stat__value">
              {subscription ? `${deviceCount} / ${deviceLimit}` : "—"}
            </span>
            <span className="stat__sub">
              {devices[0]?.lastSeenAt
                ? `last seen ${timeAgo(new Date(devices[0].lastSeenAt))}`
                : "no devices"}
            </span>
          </div>
          <div className="stat">
            <span className="stat__label">member since</span>
            <span className="stat__value">
              {new Date(me.user.createdAt).toLocaleDateString("en-GB", {
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="stat__sub">{me.user.email}</span>
          </div>
        </div>

        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Devices</h2>
            <p className="group__caption">
              Machines authorized to run the Tren loader.
            </p>
          </div>
          <div className="group__r">
            <div className="rowlist">
              {devices.length > 0 ? (
                devices.map((d) => (
                  <div className="row" key={d.id}>
                    <div className="row__main">
                      <div className="row__title">
                        {d.deviceName ?? d.deviceId}
                        <span className="tag tag--active">
                          <span className="dot" />
                          active
                        </span>
                      </div>
                      <div className="row__meta">
                        <span>{d.deviceId}</span>
                        <span>
                          activated{" "}
                          {new Date(d.activatedAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span>last seen {timeAgo(new Date(d.lastSeenAt))}</span>
                      </div>
                    </div>
                    <div className="row__right">
                      <Link href="/devices" className="linkbtn linkbtn--muted">
                        manage
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="row">
                  <div className="row__main">
                    <div className="row__title" style={{ color: "var(--ink-500)" }}>
                      No devices authorized
                    </div>
                    <div className="row__meta">
                      <span>assign from inside the loader on next launch</span>
                    </div>
                  </div>
                  <div className="row__right">
                    <span className="tag tag--off">
                      <span className="dot" />
                      idle
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dark-block">
          <div className="group__l">
            <h2 className="group__title">Quick links</h2>
            <p className="group__caption">
              Manage your account from the portal or the loader.
            </p>
          </div>
          <div className="group__r" style={{ gap: 18 }}>
            <div className="rowlist">
              <div className="row">
                <div className="row__main">
                  <div className="row__title">Subscription & billing</div>
                  <div className="row__meta">
                    <span>plan details, payment method, invoices</span>
                  </div>
                </div>
                <div className="row__right">
                  <Link href="/billing" className="linkbtn">
                    open
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="row__main">
                  <div className="row__title">Security settings</div>
                  <div className="row__meta">
                    <span>email, password, two-factor, sessions</span>
                  </div>
                </div>
                <div className="row__right">
                  <Link href="/account" className="linkbtn linkbtn--muted" style={{ borderColor: "var(--ink-700)", color: "var(--ink-300)" }}>
                    open
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="row__main">
                  <div className="row__title">Profile</div>
                  <div className="row__meta">
                    <span>display name, email preferences</span>
                  </div>
                </div>
                <div className="row__right">
                  <Link href="/profile" className="linkbtn linkbtn--muted" style={{ borderColor: "var(--ink-700)", color: "var(--ink-300)" }}>
                    open
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
