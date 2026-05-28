import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;
const tracesSampleRate = Number(
  process.env.SENTRY_TRACES_SAMPLE_RATE ??
    process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ??
    (process.env.NODE_ENV === "production" ? "0.1" : "1")
);

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  release: process.env.SENTRY_RELEASE || process.env.NEXT_PUBLIC_SENTRY_RELEASE || process.env.RAILWAY_GIT_COMMIT_SHA,
  sendDefaultPii: false,
  enableLogs: true,
  tracesSampleRate: Number.isFinite(tracesSampleRate) ? tracesSampleRate : 0.1,
});
