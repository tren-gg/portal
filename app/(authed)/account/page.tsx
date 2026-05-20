import { ScreenHead } from "@/components/screen-head";
import { SecurityForm } from "@/components/security-form";
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
            <h2 className="group__title">Email sign-in</h2>
            <p className="group__caption">
              Tren sends one-time links to your email. There is no account
              password to create, store, or change.
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
                <span className="row__meta">magic links</span>
              </div>
              <div className="form-row">
                <span className="form-row__label">password</span>
                <span className="form-row__val form-row__val--muted">
                  {me.account.auth.hasPassword ? "enabled" : "not used"}
                </span>
                <span className="row__meta">-</span>
              </div>
            </div>
          </div>
        </div>

        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Two-factor</h2>
            <p className="group__caption">
              Additional verification status for this account.
            </p>
          </div>
          <div className="group__r">
            <SecurityForm auth={me.account.auth} />
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
                  <span className="row__meta">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
