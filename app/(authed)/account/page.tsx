import { redirect } from "next/navigation";

import { ScreenHead } from "@/components/screen-head";
import { TwoFactorToggle } from "@/components/security-form";
import { updatePassword } from "@/lib/api/account";
import { getMe } from "@/lib/api/me";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ passwordStatus?: string; passwordError?: string }>;
}) {
  const params = await searchParams;
  const me = await getMe();
  const hasPassword = me.account.auth.hasPassword;

  async function handlePasswordUpdate(formData: FormData) {
    "use server";

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!newPassword || newPassword.length < 8) {
      redirect("/account?passwordError=Password+must+be+at+least+8+characters.");
    }

    if (newPassword !== confirmPassword) {
      redirect("/account?passwordError=Password+confirmation+does+not+match.");
    }

    try {
      await updatePassword({
        currentPassword: currentPassword || undefined,
        newPassword,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update password.";
      redirect(`/account?passwordError=${encodeURIComponent(message)}`);
    }

    redirect("/account?passwordStatus=Password+updated.");
  }

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
                  {hasPassword ? "enabled" : "not set"}
                </span>
              </div>
              {(params.passwordStatus || params.passwordError) && (
                <div className="form-row">
                  <span className="form-row__label">status</span>
                  <span
                    className={
                      params.passwordError
                        ? "form-row__val form-row__val--danger"
                        : "form-row__val"
                    }
                  >
                    {params.passwordError ?? params.passwordStatus}
                  </span>
                </div>
              )}
              <form action={handlePasswordUpdate} className="rowlist rowlist--nested">
                {hasPassword && (
                  <label className="form-row">
                    <span className="form-row__label">current</span>
                    <input
                      className="portal-input"
                      name="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      minLength={8}
                      required
                    />
                  </label>
                )}
                <label className="form-row">
                  <span className="form-row__label">new</span>
                  <input
                    className="portal-input"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </label>
                <label className="form-row">
                  <span className="form-row__label">confirm</span>
                  <input
                    className="portal-input"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </label>
                <div className="form-row form-row--actions">
                  <span className="form-row__label" />
                  <button className="linkbtn" type="submit">
                    {hasPassword ? "change password" : "set password"}
                  </button>
                </div>
              </form>
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
