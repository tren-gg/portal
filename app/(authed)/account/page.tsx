import { ScreenHead } from "@/components/screen-head";
import { TwoFactorToggle } from "@/components/security-form";
import { getMe } from "@/lib/api/me";

export default async function AccountPage() {
  const me = await getMe();

  return (
    <>
      <ScreenHead
        eyebrow="security"
        title="Sign-in and<br/>recovery."
        lede="Authentication is opened in your system browser from the loader. The browser session is short-lived; the loader holds a refresh token instead."
      />

      <div className="screen-body">
        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Email & password</h2>
            <p className="group__caption">
              Password is verified only in the system browser, never inside the
              game client.
            </p>
          </div>
          <div className="group__r">
            <div className="rowlist">
              <div className="form-row">
                <span className="form-row__label">email</span>
                <input
                  className="portal-input portal-input--readonly"
                  value={me.user.email}
                  readOnly
                />
                <button className="linkbtn linkbtn--muted" type="button">
                  change
                </button>
              </div>
              <div className="form-row">
                <span className="form-row__label">password</span>
                <span className="form-row__val form-row__val--muted">
                  set at account creation
                </span>
                <button className="linkbtn linkbtn--muted" type="button">
                  change
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Two-factor</h2>
            <p className="group__caption">
              A six-digit code from your authenticator. Required for new device
              authorization.
            </p>
          </div>
          <div className="group__r">
            <TwoFactorToggle />
          </div>
        </div>

        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Active sessions</h2>
            <p className="group__caption">
              Browser sessions only. The loader refresh-token is managed under
              devices.
            </p>
          </div>
          <div className="group__r">
            <div className="rowlist">
              <div className="row">
                <div className="row__main">
                  <div className="row__title">
                    current browser session
                    <span className="tag tag--active">
                      <span className="dot" />
                      this session
                    </span>
                  </div>
                  <div className="row__meta">
                    <span>started just now</span>
                  </div>
                </div>
                <div className="row__right">
                  <span className="row__meta">—</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
