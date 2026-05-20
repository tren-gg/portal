import { ScreenHead } from "@/components/screen-head";
import { getApiErrorMessage } from "@/lib/api/client";
import { getDevices, getSubscription, renameDevice, revokeDevice } from "@/lib/api/account";
import { redirect } from "next/navigation";

async function renameDeviceAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  const deviceName = String(formData.get("deviceName") ?? "").trim();

  if (!id || !deviceName) {
    redirect("/devices?error=Device+name+is+required.");
  }

  try {
    await renameDevice(id, deviceName);
  } catch (error) {
    redirect(`/devices?error=${encodeURIComponent(getApiErrorMessage(error))}`);
  }

  redirect("/devices?status=Device+renamed.");
}

async function revokeDeviceAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/devices?error=Device+is+required.");
  }

  try {
    await revokeDevice(id);
  } catch (error) {
    redirect(`/devices?error=${encodeURIComponent(getApiErrorMessage(error))}`);
  }

  redirect("/devices?status=Device+released.");
}

export default async function DevicesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string }>;
}) {
  const params = await searchParams;
  const [devices, subscription] = await Promise.all([
    getDevices(),
    getSubscription(),
  ]);

  const activeDevices = devices.filter((d) => !d.revokedAt);
  const revokedDevices = devices.filter((d) => d.revokedAt);
  const limit = subscription?.deviceLimit ?? 0;

  return (
    <>
      <ScreenHead
        eyebrow="devices"
        title="Where Tren is<br/>signed in."
        lede="Each device is bound to a hardware ID at first launch. You can release a seat once every 24 hours from here."
      />

      <div className="screen-body">
        {(params.error || params.status) && (
          <div className="group">
            <div className="group__l">
              <h2 className="group__title">
                {params.error ? "Action failed" : "Updated"}
              </h2>
            </div>
            <div className="group__r">
              <div className="rowlist">
                <div className="row">
                  <div className="row__main">
                    <div className="row__title">
                      {params.error ?? params.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Authorized machines</h2>
            <p className="group__caption">
              Seats included in your plan: {limit}.{" "}
              {limit - activeDevices.length > 0
                ? `${limit - activeDevices.length} free to assign.`
                : "All seats in use."}
            </p>
          </div>
          <div className="group__r">
            <div className="rowlist">
              {activeDevices.map((d) => (
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
                        authorized{" "}
                        {new Date(d.activatedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="row__meta" style={{ marginTop: 4 }}>
                      <span>last seen {timeAgo(new Date(d.lastSeenAt))}</span>
                    </div>
                  </div>
                  <div className="row__right">
                    <form action={renameDeviceAction} style={{ display: "flex", gap: 10 }}>
                      <input type="hidden" name="id" value={d.id} />
                      <input
                        className="portal-input"
                        name="deviceName"
                        placeholder="nickname"
                        defaultValue={d.deviceName ?? ""}
                        aria-label={`Rename ${d.deviceId}`}
                        style={{ width: 150 }}
                      />
                      <button className="linkbtn linkbtn--muted" type="submit">
                        rename
                      </button>
                    </form>
                    <form action={revokeDeviceAction}>
                      <input type="hidden" name="id" value={d.id} />
                      <button className="linkbtn linkbtn--muted" type="submit">
                        release seat
                      </button>
                    </form>
                  </div>
                </div>
              ))}

              {Array.from({ length: Math.max(0, limit - activeDevices.length) }).map(
                (_, i) => (
                  <div className="row" key={`open-${i}`}>
                    <div className="row__main">
                      <div
                        className="row__title"
                        style={{ color: "var(--ink-500)" }}
                      >
                        Seat {activeDevices.length + i + 1} — open
                      </div>
                      <div className="row__meta">
                        <span>no device bound</span>
                        <span>
                          assign from inside the loader on next launch
                        </span>
                      </div>
                    </div>
                    <div className="row__right">
                      <span className="tag tag--off">
                        <span className="dot" />
                        idle
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {revokedDevices.length > 0 && (
          <div className="group">
            <div className="group__l">
              <h2 className="group__title">Released history</h2>
              <p className="group__caption">
                Old HWIDs you&apos;ve rotated out. Re-auth requires email
                confirmation.
              </p>
            </div>
            <div className="group__r">
              <div className="rowlist">
                {revokedDevices.map((d) => (
                  <div className="row" key={d.id}>
                    <div className="row__main">
                      <div
                        className="row__title"
                        style={{ color: "var(--ink-500)" }}
                      >
                        {d.deviceName ?? d.deviceId}
                      </div>
                      <div className="row__meta">
                        <span>{d.deviceId}</span>
                        <span>
                          released{" "}
                          {new Date(d.revokedAt!).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="row__right">
                      <span className="tag tag--off">
                        <span className="dot" />
                        revoked
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--ink-500)",
                  marginTop: 18,
                  lineHeight: 1.6,
                  maxWidth: "56ch",
                }}
              >
                Tren refuses to run on a HWID you released within 24 hours. This
                stops a hijacked seat from being recycled mid-session.
              </p>
            </div>
          </div>
        )}
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
