import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_CONFIG } from "../../../../lib/auth/config";

const CUSTOMER_QUERY = `
  query GetCustomerData {
    customer {
      id
      firstName
      lastName
      phoneNumber
      emailAddress {
        emailAddress
      }
      orders(first: 10) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variantTitle
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customer_access_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const formattedToken = token.startsWith("shcat_") ? token : `shcat_${token}`;

    const response = await fetch(AUTH_CONFIG.GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": formattedToken, // Direct access token with shcat_ prefix, without Bearer prefix
      },
      body: JSON.stringify({ query: CUSTOMER_QUERY }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Shopify Customer Account GraphQL request failed:", errorText);
      return NextResponse.json({ 
        authenticated: true, 
        error: `Failed to fetch profile from Shopify (Status: ${response.status})`,
        details: errorText
      });
    }

    const { data, errors } = await response.json();

    if (errors && errors.length > 0) {
      console.warn("Shopify GraphQL returned errors:", errors);
      return NextResponse.json({ authenticated: true, errors });
    }

    return NextResponse.json({
      authenticated: true,
      customer: data?.customer || null
    });

  } catch (error: any) {
    console.error("Failed to fetch customer session:", error);
    return NextResponse.json({ 
      authenticated: true, 
      error: error.message || error 
    }, { status: 500 });
  }
}
