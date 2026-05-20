"use client";

import { useState } from "react";

type Config = {
  name: string;
  mc: string;
  modules: string;
  size: string;
  updated: string;
  active?: boolean;
};

const MOCK_CONFIGS: Config[] = [
  { name: "pvp-1.21.cfg", mc: "1.21.4", modules: "Combat, Visuals, Blink", size: "4.2 kb", updated: "2 hours ago", active: true },
  { name: "anchor-rush.cfg", mc: "1.20.6", modules: "Combat, Movement", size: "3.8 kb", updated: "1 day ago" },
  { name: "long-range.cfg", mc: "1.21.4", modules: "Combat, Visuals", size: "4.0 kb", updated: "3 days ago" },
  { name: "potpvp.cfg", mc: "1.8.9", modules: "Combat", size: "2.9 kb", updated: "12 days ago" },
  { name: "smp-passive.cfg", mc: "1.21.1", modules: "Visuals, Blink", size: "3.1 kb", updated: "21 days ago" },
  { name: "test-killaura.cfg", mc: "1.21.4", modules: "Combat", size: "4.4 kb", updated: "1 month ago" },
  { name: "default.cfg", mc: "1.21.4", modules: "all", size: "5.0 kb", updated: "3 months ago" },
];

const PREVIEW = `# pvp-1.21.cfg
# saved from tren 2.4.1 · minecraft 1.21.4

[combat.killaura]
  range            = 4.2
  fov              = 180
  speed.horizontal = 11.5
  speed.vertical   = 4.0
  target           = multipoint
  smoothing        = 0.18

[combat.criticals]
  mode    = packet
  jitter  = false

[visuals.tracers]
  enabled = true
  alpha   = 0.6
  color   = white

[blink]
  hold.max.ms = 3500
  release.on  = key

[loader]
  inject.delay.ms = 250
  hide.injection  = true`;

export function ConfigsList() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <div className="group">
        <div className="group__l">
          <h2 className="group__title">Saved configs</h2>
          <p className="group__caption">
            {MOCK_CONFIGS.length.toString().padStart(2, "0")} configs · 26.4 kb
            total · last write 2 hours ago.
          </p>
        </div>
        <div className="group__r">
          <div className="rowlist">
            {MOCK_CONFIGS.map((c) => (
              <div
                className="row"
                key={c.name}
                style={{
                  cursor: "pointer",
                  background:
                    selected === c.name ? "var(--ink-50)" : "transparent",
                  padding:
                    selected === c.name ? "18px 16px" : "18px 0",
                  margin: selected === c.name ? "0 -16px" : "0",
                }}
                onClick={() =>
                  setSelected(selected === c.name ? null : c.name)
                }
              >
                <div className="row__main">
                  <div className="row__title">
                    {c.name}
                    {c.active ? (
                      <span className="tag tag--active">
                        <span className="dot" />
                        loaded
                      </span>
                    ) : null}
                  </div>
                  <div className="row__meta">
                    <span>minecraft {c.mc}</span>
                    <span>{c.modules}</span>
                    <span>{c.size}</span>
                    <span>{c.updated}</span>
                  </div>
                </div>
                <div className="row__right">
                  <button
                    className="linkbtn linkbtn--muted"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                  >
                    download
                  </button>
                  <button
                    className="linkbtn linkbtn--muted"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Preview</h2>
            <p className="group__caption">
              Read-only here — edit values inside the loader, not from the
              browser.
            </p>
          </div>
          <div className="group__r">
            <div className="cfg-preview">{PREVIEW}</div>
          </div>
        </div>
      )}
    </>
  );
}
