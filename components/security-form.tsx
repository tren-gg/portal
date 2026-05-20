"use client";

import { useState } from "react";

export function TwoFactorToggle() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="rowlist">
      <div className="form-row">
        <span className="form-row__label">authenticator</span>
        <span className="form-row__val">
          {enabled ? "enabled · added 04 Jan 2026" : "not enabled"}
        </span>
        <button
          className={`toggle ${enabled ? "toggle--on" : ""}`}
          onClick={() => setEnabled(!enabled)}
          aria-label="toggle 2fa"
          type="button"
        />
      </div>
      <div className="form-row">
        <span className="form-row__label">recovery codes</span>
        <span className="form-row__val form-row__val--muted">
          10 unused · generated 04 Jan 2026
        </span>
        <button className="linkbtn linkbtn--muted" type="button">
          regenerate
        </button>
      </div>
    </div>
  );
}
