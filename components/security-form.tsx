import type { AccountDetails } from "@/lib/api/types";

type SecurityFormProps = {
  auth: AccountDetails["auth"];
};

export function SecurityForm({ auth }: SecurityFormProps) {
  return (
    <div className="rowlist">
      <div className="form-row">
        <span className="form-row__label">sign-in method</span>
        <span className="form-row__val">
          {auth.method === "magic_link" ? "magic email link" : auth.method}
        </span>
        <span className="row__meta">no password</span>
      </div>
      <div className="form-row">
        <span className="form-row__label">authenticator</span>
        <span className="form-row__val">
          {auth.twoFactorEnabled ? "enabled" : "not enabled"}
        </span>
        <span className={`tag ${auth.twoFactorEnabled ? "tag--active" : "tag--off"}`}>
          <span className="dot" />
          {auth.twoFactorEnabled ? "on" : "off"}
        </span>
      </div>
      <div className="form-row">
        <span className="form-row__label">recovery codes</span>
        <span className="form-row__val form-row__val--muted">
          {auth.recoveryCodesAvailable
            ? `${auth.recoveryCodesRemaining} unused`
            : "none generated"}
        </span>
        <span className="row__meta">-</span>
      </div>
    </div>
  );
}
