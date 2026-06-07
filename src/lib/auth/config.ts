export const AUTH_CONFIG = {
  CLIENT_ID: process.env.SHOPIFY_CLIENT_ID || "fd8a8a93-9df3-4d7c-b6e1-90b9318f4462",
  SHOP_ID: "91882586410",
  AUTHORIZATION_ENDPOINT: "https://shopify.com/authentication/91882586410/oauth/authorize",
  TOKEN_ENDPOINT: "https://shopify.com/authentication/91882586410/oauth/token",
  LOGOUT_ENDPOINT: "https://shopify.com/authentication/91882586410/logout",
  GRAPHQL_ENDPOINT: "https://shopify.com/91882586410/account/customer/api/2026-04/graphql",
  REDIRECT_URI: process.env.NEXT_PUBLIC_SHOPIFY_REDIRECT_URI || "https://thefehucode.vercel.app/api/auth/callback",
  SCOPES: "openid email customer-account-api:full",
};
