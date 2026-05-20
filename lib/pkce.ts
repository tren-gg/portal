import { randomBytes, createHash } from "node:crypto";

export function generateVerifier(length = 64): string {
  const bytes = randomBytes(length);
  return bytes
    .toString("base64url")
    .slice(0, Math.max(43, Math.min(length, 128)));
}

export function deriveChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

export function generateState(): string {
  return randomBytes(16).toString("base64url");
}
