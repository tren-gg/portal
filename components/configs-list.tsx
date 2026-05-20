"use client";

import { useState } from "react";
import type { SavedConfig } from "@/lib/api/types";

type ConfigsListProps = {
  configs: SavedConfig[];
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} b`;
  return `${(bytes / 1024).toFixed(1)} kb`;
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ConfigsList({ configs }: ConfigsListProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedConfig = configs.find((config) => config.id === selected);
  const totalBytes = configs.reduce((total, config) => total + config.sizeBytes, 0);
  const lastUpdated = configs
    .map((config) => new Date(config.updatedAt))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return (
    <>
      <div className="group">
        <div className="group__l">
          <h2 className="group__title">Saved configs</h2>
          <p className="group__caption">
            {configs.length.toString().padStart(2, "0")} configs · {formatBytes(totalBytes)}
            total
            {lastUpdated ? ` · last write ${formatUpdatedAt(lastUpdated.toISOString())}.` : "."}
          </p>
        </div>
        <div className="group__r">
          {configs.length === 0 ? (
            <div className="rowlist">
              <div className="row">
                <div className="row__main">
                  <div className="row__title">No saved configs</div>
                  <div className="row__meta">
                    <span>Configs will appear here after the loader uploads one.</span>
                  </div>
                </div>
                <div className="row__right">
                  <span className="tag tag--off">
                    <span className="dot" />
                    empty
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rowlist">
              {configs.map((c) => (
                <div
                  className="row"
                  key={c.id}
                  style={{
                    cursor: "pointer",
                    background:
                      selected === c.id ? "var(--ink-50)" : "transparent",
                    padding:
                      selected === c.id ? "18px 16px" : "18px 0",
                    margin: selected === c.id ? "0 -16px" : "0",
                  }}
                  onClick={() =>
                    setSelected(selected === c.id ? null : c.id)
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
                      <span>minecraft {c.minecraftVersion}</span>
                      <span>{c.modules.join(", ") || "no modules"}</span>
                      <span>{formatBytes(c.sizeBytes)}</span>
                      <span>{formatUpdatedAt(c.updatedAt)}</span>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedConfig && (
        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Preview</h2>
            <p className="group__caption">
              Read-only here — edit values inside the loader, not from the
              browser.
            </p>
          </div>
          <div className="group__r">
            <div className="cfg-preview">
              {`${selectedConfig.name}
minecraft = ${selectedConfig.minecraftVersion}
modules = ${selectedConfig.modules.join(", ") || "none"}
size = ${formatBytes(selectedConfig.sizeBytes)}`}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
