"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { key: "dashboard", label: "Overview", href: "/dashboard" },
  { key: "billing", label: "Subscription", href: "/billing" },
  { key: "devices", label: "Devices", href: "/devices" },
  { key: "configs", label: "Configs", href: "/configs" },
  { key: "account", label: "Security", href: "/account" },
];

type NavProps = {
  handle: string;
  initials: string;
};

export function Nav({ handle, initials }: NavProps) {
  const pathname = usePathname();
  const activeKey =
    tabs.find((t) => pathname.startsWith(t.href))?.key ?? "dashboard";

  return (
    <header className="topbar">
      <div className="topbar__row">
        <Link href="/dashboard" className="topbar__wordmark">
          tren.
        </Link>
        <div className="topbar__right">
          <div className="topbar__user">
            <span className="topbar__user-handle">{handle}</span>
          </div>
          <a href="/auth/logout" className="topbar__signout">
            sign out
          </a>
          <span className="topbar__avatar">{initials}</span>
        </div>
      </div>
      <nav className="tabbar">
        {tabs.map((tab, i) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`tab ${activeKey === tab.key ? "tab--active" : ""}`}
          >
            <span className="tab__num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="tab__label">{tab.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
