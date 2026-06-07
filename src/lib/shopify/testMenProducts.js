const SHOPIFY_STORE_DOMAIN = "c1vssj-sz.myshopify.com";
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = "de98eea08cf671a6734e9b4e69f40341";
const API_VERSION = "2024-01";

const url = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

function getProductCategory(p) {
  const typeLower = (p.productType || "").toLowerCase();
  const titleLower = (p.title || "").toLowerCase();
  const tagsLower = (p.tags || []).map((t) => t.toLowerCase());

  if (typeLower.includes("saree") || titleLower.includes("saree") || tagsLower.includes("sarees") || tagsLower.includes("saree") || tagsLower.includes("women")) {
    return "women";
  }
  if (typeLower.includes("shirt") || titleLower.includes("shirt") || typeLower.includes("kurta") || titleLower.includes("kurta") || tagsLower.includes("men")) {
    return "men";
  }
  if (typeLower.includes("jewelry") || typeLower.includes("earring") || typeLower.includes("necklace") || titleLower.includes("jhumka") || tagsLower.includes("jewelry")) {
    return "jewelry";
  }
  return "women";
}

async function testMenProducts() {
  const query = `
    query GetProducts {
      products(first: 250) {
        edges {
          node {
            id
            title
            handle
            productType
            tags
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();
    const allProducts = json.data?.products?.edges?.map(e => e.node) || [];
    
    // Apply the exact filtering logic from getCollectionProducts("men")
    const menProducts = allProducts.filter(p => 
      p.productType.toLowerCase().includes("t-shirt") ||
      p.productType.toLowerCase().includes("kurta") ||
      p.title.toLowerCase().includes("t-shirt") ||
      p.title.toLowerCase().includes("kurta") ||
      p.tags.some(t => t.toLowerCase() === "men" || t.toLowerCase().includes("shirt"))
    );

    console.log(`Found ${menProducts.length} men's products.`);
    menProducts.forEach(p => {
      const category = getProductCategory(p);
      console.log(`Title: "${p.title}" | Category Evaluated: "${category}"`);
    });

  } catch (error) {
    console.error("Error:", error);
  }
}

testMenProducts();
