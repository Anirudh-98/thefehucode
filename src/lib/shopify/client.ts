import { Product, Collection, Cart, CartItem, ProductVariant } from "../../types/shopify";
import { MOCK_PRODUCTS, MOCK_COLLECTIONS } from "./mockData";

// Environment variables configuration (optional, for live Shopify connection)
const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "";
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const API_VERSION = "2024-01";

const isLiveShopifyConfigured = () => {
  return SHOPIFY_STORE_DOMAIN !== "" && SHOPIFY_STOREFRONT_ACCESS_TOKEN !== "";
};

// Shopify GraphQL fetch helper
async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<{ data: T } | never> {
  const url = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      throw new Error(`Shopify API error: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Shopify GraphQL Fetch error:", error);
    throw error;
  }
}

// Transform Shopify API product node to internal Product model
function transformShopifyProduct(p: any): Product {
  // Infer subcategory based on product type, title, and tags
  let subcategory = "";
  const typeLower = (p.productType || "").toLowerCase();
  const titleLower = (p.title || "").toLowerCase();
  const tagsLower = (p.tags || []).map((t: string) => t.toLowerCase());

  if (typeLower.includes("saree") || titleLower.includes("saree") || tagsLower.includes("sarees") || tagsLower.includes("saree")) {
    subcategory = "Sarees";
  } else if (typeLower.includes("kurta") || titleLower.includes("kurta") || tagsLower.includes("kurtas") || tagsLower.includes("kurta")) {
    subcategory = "Kurtas";
  } else if (typeLower.includes("dress") || titleLower.includes("dress") || tagsLower.includes("dresses") || tagsLower.includes("dress")) {
    subcategory = "Dresses";
  } else if (typeLower.includes("co-ord") || titleLower.includes("co-ord") || tagsLower.includes("co-ords") || tagsLower.includes("co-ord")) {
    subcategory = "Co-ords";
  } else if (typeLower.includes("dupatta") || titleLower.includes("dupatta") || tagsLower.includes("dupattas") || tagsLower.includes("dupatta")) {
    subcategory = "Dupattas";
  } else if (typeLower.includes("t-shirt") || titleLower.includes("t-shirt") || tagsLower.includes("t-shirts") || tagsLower.includes("t-shirt")) {
    subcategory = "T-Shirts";
  } else if (typeLower.includes("shirt") || titleLower.includes("shirt") || tagsLower.includes("shirts") || tagsLower.includes("shirt")) {
    subcategory = "Shirts";
  } else if (typeLower.includes("jacket") || titleLower.includes("jacket") || tagsLower.includes("jackets") || tagsLower.includes("jacket")) {
    subcategory = "Jackets";
  } else if (typeLower.includes("earring") || titleLower.includes("earring") || tagsLower.includes("earrings") || tagsLower.includes("earring") || titleLower.includes("jhumka") || tagsLower.includes("jhumka")) {
    subcategory = "Earrings";
  } else if (typeLower.includes("necklace") || titleLower.includes("necklace") || tagsLower.includes("necklaces") || tagsLower.includes("necklace") || titleLower.includes("choker") || tagsLower.includes("choker")) {
    subcategory = "Necklaces";
  } else if (typeLower.includes("bracelet") || titleLower.includes("bracelet") || tagsLower.includes("bracelets") || tagsLower.includes("bracelet") || typeLower.includes("bangle") || titleLower.includes("bangle") || tagsLower.includes("bangles") || tagsLower.includes("bangle")) {
    subcategory = "Bracelets";
  } else if (typeLower.includes("ring") || titleLower.includes("ring") || tagsLower.includes("rings") || tagsLower.includes("ring")) {
    subcategory = "Rings";
  }

  const details = p.details || {
    materials: "Pure handloom fabrics and natural materials.",
    shipping: "Ships in 3-5 business days. Worldwide shipping available.",
    care: "Dry clean only. Store in a cool, dry place.",
  };

  return {
    ...p,
    subcategory,
    details,
    images: p.images?.edges ? p.images.edges.map((e: any) => e.node) : (p.images || []),
    variants: p.variants?.edges ? p.variants.edges.map((v: any) => ({
      ...v.node,
      price: v.node.price?.amount || v.node.price || "0",
      compareAtPrice: v.node.compareAtPrice?.amount || v.node.compareAtPrice,
    })) : (p.variants || []),
  };
}

// Client API operations
export async function getCollections(): Promise<Collection[]> {
  if (isLiveShopifyConfigured()) {
    const query = `
      query GetCollections {
        collections(first: 10) {
          edges {
            node {
              id
              handle
              title
              description
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    `;
    try {
      const response = await shopifyFetch<any>({ query });
      return response.data.collections.edges.map((edge: any) => edge.node);
    } catch (e) {
      console.warn("Failed to fetch live collections, falling back to mock data.", e);
      return MOCK_COLLECTIONS;
    }
  }

  return MOCK_COLLECTIONS;
}

export async function getProducts(options?: {
  query?: string;
  sortKey?: "PRICE" | "BEST_SELLING" | "CREATED_AT" | "ID";
  reverse?: boolean;
}): Promise<Product[]> {
  if (isLiveShopifyConfigured()) {
    const query = `
      query GetProducts($query: String, $sortKey: ProductSortKeys, $reverse: Boolean, $cursor: String) {
        products(first: 250, query: $query, sortKey: $sortKey, reverse: $reverse, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              handle
              title
              description
              availableForSale
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                    width
                    height
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                    image {
                      url
                      altText
                      width
                      height
                    }
                  }
                }
              }
              options {
                id
                name
                values
              }
              productType
              tags
            }
          }
        }
      }
    `;
    try {
      let allProducts: Product[] = [];
      let hasNextPage = true;
      let cursor: string | null = null;

      while (hasNextPage) {
        const queryVariables: Record<string, any> = {
          query: options?.query,
          sortKey: options?.sortKey,
          reverse: options?.reverse,
          cursor: cursor,
        };

        const response = await shopifyFetch<any>({ query, variables: queryVariables });
        const productsConnection = response.data?.products;

        if (!productsConnection) break;

        const pageProducts = productsConnection.edges.map((edge: any) => {
          return transformShopifyProduct(edge.node);
        });

        allProducts = [...allProducts, ...pageProducts];
        
        hasNextPage = productsConnection.pageInfo.hasNextPage;
        cursor = productsConnection.pageInfo.endCursor;
      }

      return allProducts;
    } catch (e) {
      console.warn("Failed to fetch live products, falling back to mock data.", e);
    }
  }

  // Local Mock Logic
  let products = [...MOCK_PRODUCTS];

  if (options?.query) {
    const q = options.query.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (options?.sortKey === "PRICE") {
    products.sort((a, b) => {
      const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
      const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
      return options.reverse ? priceB - priceA : priceA - priceB;
    });
  }

  return products;
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (isLiveShopifyConfigured()) {
    const query = `
      query GetProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          handle
          title
          description
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          options {
            id
            name
            values
          }
          productType
          tags
        }
      }
    `;
    try {
      const response = await shopifyFetch<any>({ query, variables: { handle } });
      if (response.data.product) {
        return transformShopifyProduct(response.data.product);
      }
      return null;
    } catch (e) {
      console.warn("Failed to fetch live product handle, falling back to mock data.", e);
    }
  }

  return MOCK_PRODUCTS.find((p) => p.handle === handle) || null;
}

export async function getCollectionProducts(
  collectionHandle: string,
  options?: {
    sortKey?: "PRICE" | "BEST_SELLING" | "CREATED_AT" | "ID";
    reverse?: boolean;
  }
): Promise<Product[]> {
  if (isLiveShopifyConfigured()) {
    const handleLower = collectionHandle.toLowerCase();

    // If querying custom categories, retrieve all products and partition dynamically
    if (["women", "men", "jewelry", "jewellery"].includes(handleLower)) {
      try {
        const allProducts = await getProducts();
        let filtered: Product[] = [];

        if (handleLower === "women") {
          filtered = allProducts.filter(p => 
            p.productType.toLowerCase().includes("saree") ||
            p.title.toLowerCase().includes("saree") ||
            p.tags.some(t => t.toLowerCase().includes("saree") || t.toLowerCase() === "women")
          );
        } else if (handleLower === "men") {
          filtered = allProducts.filter(p => 
            p.productType.toLowerCase().includes("t-shirt") ||
            p.productType.toLowerCase().includes("kurta") ||
            p.title.toLowerCase().includes("t-shirt") ||
            p.title.toLowerCase().includes("kurta") ||
            p.tags.some(t => t.toLowerCase() === "men" || t.toLowerCase().includes("shirt"))
          );
        } else if (handleLower === "jewelry" || handleLower === "jewellery") {
          filtered = allProducts.filter(p => 
            p.productType.toLowerCase().includes("jewelry") ||
            p.productType.toLowerCase().includes("jewellery") ||
            p.productType.toLowerCase().includes("earring") ||
            p.productType.toLowerCase().includes("necklace") ||
            p.productType.toLowerCase().includes("bracelet") ||
            p.productType.toLowerCase().includes("bangle") ||
            p.productType.toLowerCase().includes("ring") ||
            p.title.toLowerCase().includes("necklace") ||
            p.title.toLowerCase().includes("earring") ||
            p.title.toLowerCase().includes("jhumka") ||
            p.title.toLowerCase().includes("bracelet") ||
            p.title.toLowerCase().includes("bangle") ||
            p.tags.some(t => t.toLowerCase().includes("jewelry") || t.toLowerCase().includes("jewellery") || t.toLowerCase().includes("jewel"))
          );
        }

        if (options?.sortKey === "PRICE") {
          filtered.sort((a, b) => {
            const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
            const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
            return options.reverse ? priceB - priceA : priceA - priceB;
          });
        }

        return filtered;
      } catch (e) {
        console.warn("Failed to fetch custom partitioned products:", e);
      }
    }

    const query = `
      query GetCollectionProducts($handle: String!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
        collection(handle: $handle) {
          products(first: 24, sortKey: $sortKey, reverse: $reverse) {
            edges {
              node {
                id
                handle
                title
                description
                availableForSale
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 5) {
                  edges {
                    node {
                      url
                      altText
                      width
                      height
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      availableForSale
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                }
                options {
                  id
                  name
                  values
                }
                productType
                tags
              }
            }
          }
        }
      }
    `;
    try {
      const response = await shopifyFetch<any>({
        query,
        variables: {
          handle: collectionHandle,
          sortKey: options?.sortKey,
          reverse: options?.reverse,
        },
      });
      if (response.data?.collection?.products) {
        return response.data.collection.products.edges.map((edge: any) => {
          return transformShopifyProduct(edge.node);
        });
      }
    } catch (e) {
      console.warn("Failed to fetch live collection products, falling back to mock data.", e);
    }
  }

  // Local Mock logic: filter products by collection tag (e.g. tag 'women', 'men', 'jewelry')
  let products = MOCK_PRODUCTS.filter((p) =>
    p.tags.some((tag) => tag.toLowerCase() === collectionHandle.toLowerCase())
  );

  if (options?.sortKey === "PRICE") {
    products.sort((a, b) => {
      const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
      const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
      return options.reverse ? priceB - priceA : priceA - priceB;
    });
  }

  return products;
}

export async function createCheckout(
  lineItems: { variantId: string; quantity: number }[]
): Promise<string> {
  if (isLiveShopifyConfigured()) {
    const mutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const variables = {
        input: {
          lines: lineItems.map((item) => ({
            merchandiseId: item.variantId,
            quantity: item.quantity,
          })),
        },
      };

      const response = await shopifyFetch<any>({ query: mutation, variables });
      const cartCreate = response.data?.cartCreate;

      if (cartCreate?.userErrors && cartCreate.userErrors.length > 0) {
        console.error("Shopify cartCreate user errors:", cartCreate.userErrors);
        throw new Error(cartCreate.userErrors[0].message);
      }

      if (cartCreate?.cart?.checkoutUrl) {
        return cartCreate.cart.checkoutUrl;
      }
      throw new Error("No checkout URL returned from Shopify.");
    } catch (e) {
      console.error("Failed to create live Shopify checkout:", e);
      throw e;
    }
  }

  // Fallback/Mock checkout URL
  return "https://checkout.shopify.com/mock-checkout";
}
