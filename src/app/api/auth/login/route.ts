import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_CONFIG } from "../../../../lib/auth/config";
import { generateState, generateCodeVerifier, generateCodeChallenge } from "../../../../lib/auth/pkce";

export async function GET() {
  const state = generateState();
  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);

  const cookieStore = await cookies();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 300, // 5 minutes validity
  };

  cookieStore.set("auth_state", state, cookieOptions);
  cookieStore.set("auth_verifier", verifier, cookieOptions);

  const authUrl = new URL(AUTH_CONFIG.AUTHORIZATION_ENDPOINT);
  authUrl.searchParams.set("client_id", AUTH_CONFIG.CLIENT_ID);
  authUrl.searchParams.set("scope", AUTH_CONFIG.SCOPES);
  authUrl.searchParams.set("redirect_uri", AUTH_CONFIG.REDIRECT_URI);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  return NextResponse.redirect(authUrl.toString());
}
