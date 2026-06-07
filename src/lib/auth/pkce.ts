import crypto from "crypto";

export function generateState(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generateCodeVerifier(): string {
  // Generates high-entropy base64url verifier compatible with PKCE specification
  return crypto.randomBytes(32).toString("base64url");
}

export function generateCodeChallenge(verifier: string): string {
  // Generates SHA-256 challenge base64url representation
  return crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");
}
