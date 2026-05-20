"use client";

import { useState } from "react";
import type { EmailPreferences } from "@/lib/api/types";

type ProfileFormProps = {
  email: string;
  initialHandle: string;
  userId: string;
  createdAt: string;
  initialEmailPreferences: EmailPreferences;
};

const PREF_ITEMS: { key: keyof EmailPreferences; label: string; sub: string }[] = [
  { key: "releases", label: "build releases", sub: "when a new loader version ships" },
  { key: "security", label: "security alerts", sub: "new sign-ins and device changes" },
  { key: "changes", label: "mapping changes", sub: "when a new minecraft version is supported" },
  { key: "promo", label: "product news", sub: "occasional, never more than once a month" },
];

export function ProfileForm({
  email,
  initialHandle,
  userId,
  createdAt,
  initialEmailPreferences,
}: ProfileFormProps) {
  const [handle, setHandle] = useState(initialHandle);
  const [emailPrefs, setEmailPrefs] = useState<EmailPreferences>(initialEmailPreferences);

  const created = new Date(createdAt);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.replace("_", " ");
  const offset = -created.getTimezoneOffset() / 60;
  const tzLabel = `${tz} · UTC${offset >= 0 ? "+" : ""}${offset}`;

  return (
    <>
      <div className="group">
        <div className="group__l">
          <h2 className="group__title">Identity</h2>
          <p className="group__caption">
            Visible only inside the loader. Tren has no social surface.
          </p>
        </div>
        <div className="group__r">
          <div className="rowlist">
            <div className="form-row">
              <span className="form-row__label">display name</span>
              <input
                className="portal-input"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
              />
              <span />
            </div>
            <div className="form-row">
              <span className="form-row__label">email</span>
              <input
                className="portal-input portal-input--readonly"
                value={email}
                readOnly
              />
              <button className="linkbtn linkbtn--muted" type="button">
                verify
              </button>
            </div>
            <div className="form-row">
              <span className="form-row__label">account id</span>
              <span className="form-row__val">{userId}</span>
              <button className="linkbtn linkbtn--muted" type="button">
                copy
              </button>
            </div>
            <div className="form-row">
              <span className="form-row__label">timezone</span>
              <span className="form-row__val">{tzLabel}</span>
              <button className="linkbtn linkbtn--muted" type="button">
                edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="group">
        <div className="group__l">
          <h2 className="group__title">Email preferences</h2>
          <p className="group__caption">
            Transactional mail (receipts, auth) is always sent.
          </p>
        </div>
        <div className="group__r">
          <div className="rowlist">
            {PREF_ITEMS.map((item) => (
              <div className="form-row" key={item.key}>
                <span className="form-row__label">{item.label}</span>
                <span className="form-row__val form-row__val--muted">
                  {item.sub}
                </span>
                <button
                  className={`toggle ${emailPrefs[item.key] ? "toggle--on" : ""}`}
                  onClick={() =>
                    setEmailPrefs((p) => ({ ...p, [item.key]: !p[item.key] }))
                  }
                  aria-label={`toggle ${item.label}`}
                  type="button"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
