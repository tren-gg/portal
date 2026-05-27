import Link from "next/link";

import type { SavedConfig, SavedConfigDetails } from "@/lib/api/types";

type ConfigsListProps = {
  configs: SavedConfig[];
  selectedConfig: SavedConfigDetails | null;
  deleteAction: (formData: FormData) => void | Promise<void>;
  error?: string;
  status?: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} b`;
  return `${(bytes / 1024).toFixed(1)} kb`;
}

function timeAgo(date: Date): string {
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function modulesLabel(config: SavedConfig) {
  return config.modules.length > 0 ? config.modules.join(", ") : "no module metadata";
}

export function ConfigsList({
  configs,
  selectedConfig,
  deleteAction,
  error,
  status,
}: ConfigsListProps) {
  const totalBytes = configs.reduce((sum, config) => sum + config.sizeBytes, 0);
  const lastWrite = configs[0]?.updatedAt ? timeAgo(new Date(configs[0].updatedAt)) : null;

  return (
    <>
      {(error || status) && (
        <div className="group">
          <div className="group__l">
            <h2 className="group__title">{error ? "Action failed" : "Updated"}</h2>
          </div>
          <div className="group__r">
            <div className="rowlist">
              <div className="row">
                <div className="row__main">
                  <div className="row__title">{error ?? status}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="group">
        <div className="group__l">
          <h2 className="group__title">Saved configs</h2>
          <p className="group__caption">
            {configs.length.toString().padStart(2, "0")} configs
            {configs.length > 0 ? ` · ${formatBytes(totalBytes)} total` : ""}
            {lastWrite ? ` · last write ${lastWrite}.` : "."}
          </p>
        </div>
        <div className="group__r">
          <div className="rowlist">
            {configs.map((config) => {
              const selected = selectedConfig?.id === config.id;

              return (
                <div
                  className="row"
                  key={config.id}
                  style={{
                    background: selected ? "var(--ink-50)" : "transparent",
                    padding: selected ? "18px 16px" : "18px 0",
                    margin: selected ? "0 -16px" : "0",
                  }}
                >
                  <div className="row__main">
                    <div className="row__title">
                      <Link href={`/configs?selected=${encodeURIComponent(config.id)}`} className="row__link">
                        {config.name}
                      </Link>
                    </div>
                    <div className="row__meta">
                      <span>minecraft {config.minecraftVersion ?? "unknown"}</span>
                      <span>{modulesLabel(config)}</span>
                      <span>{formatBytes(config.sizeBytes)}</span>
                      <span>{timeAgo(new Date(config.updatedAt))}</span>
                    </div>
                  </div>
                  <div className="row__right">
                    <Link
                      href={`/configs/${encodeURIComponent(config.id)}/download`}
                      className="linkbtn linkbtn--muted"
                    >
                      download
                    </Link>
                    <details className="confirm-action">
                      <summary className="linkbtn linkbtn--muted">delete</summary>
                      <form action={deleteAction} className="confirm-action__body">
                        <input type="hidden" name="id" value={config.id} />
                        <p>Delete this saved config from your account?</p>
                        <button className="linkbtn" type="submit">
                          confirm delete
                        </button>
                      </form>
                    </details>
                  </div>
                </div>
              );
            })}

            {configs.length === 0 && (
              <div className="row">
                <div className="row__main">
                  <div className="row__title" style={{ color: "var(--ink-500)" }}>
                    No saved configs
                  </div>
                  <div className="row__meta">
                    <span>save a config in the loader and it will sync here</span>
                  </div>
                </div>
                <div className="row__right">
                  <span className="tag tag--off">
                    <span className="dot" />
                    empty
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedConfig && (
        <div className="group">
          <div className="group__l">
            <h2 className="group__title">Preview</h2>
            <p className="group__caption">
              This is the payload returned by the API for the selected config.
            </p>
          </div>
          <div className="group__r">
            <div className="cfg-preview">{selectedConfig.payload}</div>
          </div>
        </div>
      )}
    </>
  );
}
