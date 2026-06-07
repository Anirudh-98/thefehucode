import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_CONFIG } from "../../../../lib/auth/config";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("auth_state")?.value;
  const savedVerifier = cookieStore.get("auth_verifier")?.value;

  // 1. Validation
  if (!code || !state) {
    return new NextResponse("Missing authorization code or state query parameter", { status: 400 });
  }

  if (!savedState || state !== savedState) {
    return new NextResponse("Authorization state mismatch or session expired", { status: 400 });
  }

  if (!savedVerifier) {
    return new NextResponse("Code verifier not found in session", { status: 400 });
  }

  try {
    // 2. Exchange authorization code for token
    const tokenRequestBody = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: AUTH_CONFIG.CLIENT_ID,
      redirect_uri: AUTH_CONFIG.REDIRECT_URI,
      code: code,
      code_verifier: savedVerifier,
    });

    const response = await fetch(AUTH_CONFIG.TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenRequestBody.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Shopify OAuth token exchange failed:", errorText);
      return new NextResponse(`Token exchange failed: ${errorText}`, { status: response.status });
    }

    const tokenData = await response.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return new NextResponse("No access token returned from Shopify token endpoint", { status: 500 });
    }

    // 3. Save session token
    const sessionCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: tokenData.expires_in || 3600, // session duration
    };

    cookieStore.set("customer_access_token", accessToken, sessionCookieOptions);

    // 4. Clean up auth flow temporary cookies
    cookieStore.delete("auth_state");
    cookieStore.delete("auth_verifier");

    // 5. Redirect to customer dashboard
    const baseUrl = new URL(request.url).origin;
    return NextResponse.redirect(`${baseUrl}/account`);

  } catch (error: any) {
    console.error("OAuth Callback route error:", error);
    return new NextResponse(`Authentication error: ${error.message || error}`, { status: 500 });
  }
}
