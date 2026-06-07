import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_CONFIG } from "../../../../lib/auth/config";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("customer_access_token");

  const logoutUrl = new URL(AUTH_CONFIG.LOGOUT_ENDPOINT);
  const baseUrl = process.env.NEXT_PUBLIC_SHOPIFY_REDIRECT_URI
    ? new URL(process.env.NEXT_PUBLIC_SHOPIFY_REDIRECT_URI).origin
    : "https://thefehucode.vercel.app";
    
  logoutUrl.searchParams.set("post_logout_redirect_uri", baseUrl);

  return NextResponse.redirect(logoutUrl.toString());
}
