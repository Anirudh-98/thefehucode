import { Product, Collection } from "../../types/shopify";

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "col_1",
    handle: "women",
    title: "Women",
    description: "Handcrafted heritage sarees, elegant kurtas, contemporary dresses, and artisanal co-ords.",
    image: {
      url: "/images/saree.png",
      altText: "Women's Collection",
      width: 800,
      height: 1200,
    },
  },
  {
    id: "col_2",
    handle: "men",
    title: "Men",
    description: "Tailored handloom shirts, traditional silk kurtas, and premium heritage jackets.",
    image: {
      url: "/images/men_kurta.png",
      altText: "Men's Collection",
      width: 800,
      height: 1200,
    },
  },
  {
    id: "col_3",
    handle: "jewelry",
    title: "Jewelry",
    description: "Finely crafted heritage jewelry featuring kundan, polki diamonds, and raw emeralds.",
    image: {
      url: "/images/jewelry.png",
      altText: "Fine Jewelry Collection",
      width: 800,
      height: 1200,
    },
  },
];

export const MOCK_PRODUCTS: Product[] = [
  // WOMEN - SAREES
  {
    id: "prod_saree_1",
    handle: "royal-banarasi-silk-saree",
    title: "Royal Banarasi Silk Saree",
    description: "Woven in the ancient city of Varanasi, this handloom saree is crafted from pure mulberry silk and features intricate zari gold work. Combining rich heritage with royal elegance, it represents the pinnacle of Indian artisanal weaving.",
    descriptionHtml: "<p>Woven in the ancient city of Varanasi, this handloom saree is crafted from pure mulberry silk and features intricate zari gold work.</p><p>Combining rich heritage with royal elegance, it represents the pinnacle of Indian artisanal weaving.</p>",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "18500", currencyCode: "INR" }
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: "24500", currencyCode: "INR" }
    },
    images: [
      { url: "/images/saree.png", altText: "Royal Banarasi Silk Saree", width: 800, height: 1200 },
      { url: "/images/contemporary.png", altText: "Royal Banarasi Silk Saree Detail", width: 800, height: 1200 }
    ],
    options: [
      { id: "opt_saree_color", name: "Color", values: ["Forest Green", "Royal Crimson"] }
    ],
    variants: [
      {
        id: "var_saree_1",
        title: "Forest Green",
        price: "18500",
        compareAtPrice: "24500",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Forest Green" }]
      },
      {
        id: "var_saree_2",
        title: "Royal Crimson",
        price: "19500",
        compareAtPrice: "26000",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Royal Crimson" }]
      }
    ],
    productType: "Saree",
    tags: ["women", "sarees", "featured", "new-arrivals"],
    subcategory: "sarees",
    details: {
      materials: "100% Pure Banarasi Katan Silk, Gold and Silver Zari threads.",
      shipping: "Complimentary worldwide shipping. Standard delivery takes 5–7 business days.",
      care: "Dry clean only. Store wrapped in a soft muslin cloth to protect the gold zari."
    }
  },
  // WOMEN - DRESSES
  {
    id: "prod_dress_1",
    handle: "indigo-handblock-print-dress",
    title: "Indigo Handblock Print Dress",
    description: "An elegant, contemporary maxi dress made from organic cotton, hand-dyed in natural indigo. Features artisanal wooden-block printed floral details, a tiered silhouette, and a delicate tie-up neck. Perfect for casual luxury and afternoon gatherings.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "6500", currencyCode: "INR" }
    },
    images: [
      { url: "/images/contemporary.png", altText: "Indigo Handblock Print Dress", width: 800, height: 1200 },
      { url: "/images/saree.png", altText: "Indigo Handblock Print Dress Alternate", width: 800, height: 1200 }
    ],
    options: [
      { id: "opt_dress_size", name: "Size", values: ["S", "M", "L"] }
    ],
    variants: [
      {
        id: "var_dress_1",
        title: "S",
        price: "6500",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "S" }]
      },
      {
        id: "var_dress_2",
        title: "M",
        price: "6500",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "M" }]
      },
      {
        id: "var_dress_3",
        title: "L",
        price: "6500",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "L" }]
      }
    ],
    productType: "Dress",
    tags: ["women", "dresses", "new-arrivals"],
    subcategory: "dresses",
    details: {
      materials: "100% Certified Organic Cotton, Natural Indigo Dye.",
      shipping: "Dispatched in 2-3 business days. Delivery in 4-6 business days.",
      care: "Hand wash separately in cold water using a mild organic detergent. Dry in shade."
    }
  },
  // WOMEN - KURTAS
  {
    id: "prod_kurta_w",
    handle: "chanderi-silk-kurta-set",
    title: "Chanderi Silk Kurta Set",
    description: "A timeless Chanderi silk kurta paired with straight-cut trousers and a matching sheer dupatta. Adorned with subtle hand-embroidered borders, this lightweight and breathable set represents quiet Indian luxury.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "8900", currencyCode: "INR" }
    },
    images: [
      { url: "/images/contemporary.png", altText: "Chanderi Silk Kurta Set", width: 800, height: 1200 }
    ],
    options: [
      { id: "opt_kurta_w_size", name: "Size", values: ["S", "M", "L", "XL"] }
    ],
    variants: [
      {
        id: "var_kurta_w_1",
        title: "S",
        price: "8900",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "S" }]
      },
      {
        id: "var_kurta_w_2",
        title: "M",
        price: "8900",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "M" }]
      },
      {
        id: "var_kurta_w_3",
        title: "L",
        price: "8900",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "L" }]
      },
      {
        id: "var_kurta_w_4",
        title: "XL",
        price: "8900",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "XL" }]
      }
    ],
    productType: "Kurta Set",
    tags: ["women", "kurtas"],
    subcategory: "kurtas",
    details: {
      materials: "60% Chanderi Silk, 40% Organic Cotton. Inner lining: 100% Soft Cotton.",
      shipping: "Dispatched in 2-3 business days. Delivery in 4-6 business days.",
      care: "Dry clean recommended. Low-heat iron on reverse side."
    }
  },
  // WOMEN - CO-ORDS
  {
    id: "prod_coord_1",
    handle: "embroidered-silk-co-ords",
    title: "Embroidered Silk Co-ords",
    description: "A premium modern silhouette featuring an embroidered silk button-up tunic and relaxed, matching wide-leg trousers. Fuses clean contemporary resort cuts with traditional detailed thread-work.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "11200", currencyCode: "INR" }
    },
    images: [
      { url: "/images/contemporary.png", altText: "Embroidered Silk Co-ords", width: 800, height: 1200 }
    ],
    options: [
      { id: "opt_coord_size", name: "Size", values: ["S", "M", "L"] }
    ],
    variants: [
      {
        id: "var_coord_1",
        title: "S",
        price: "11200",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "S" }]
      },
      {
        id: "var_coord_2",
        title: "M",
        price: "11200",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "M" }]
      },
      {
        id: "var_coord_3",
        title: "L",
        price: "11200",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "L" }]
      }
    ],
    productType: "Co-ords",
    tags: ["women", "co-ords"],
    subcategory: "co-ords",
    details: {
      materials: "Raw Crepe Silk, Handwoven Cotton threads.",
      shipping: "Ships in 3 business days. Worldwide express delivery.",
      care: "Dry clean only."
    }
  },
  // WOMEN - DUPATTAS
  {
    id: "prod_dupatta_1",
    handle: "silk-organza-dupatta",
    title: "Silk Organza Dupatta",
    description: "A lightweight, translucent silk organza dupatta adorned with hand-painted gold floral motifs and detailed scalloped borders. An exquisite layering piece to complete any traditional ensemble.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "3200", currencyCode: "INR" }
    },
    images: [
      { url: "/images/saree.png", altText: "Silk Organza Dupatta", width: 800, height: 1200 }
    ],
    options: [
      { id: "opt_dupatta_size", name: "Size", values: ["One Size"] }
    ],
    variants: [
      {
        id: "var_dupatta_1",
        title: "One Size",
        price: "3200",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "One Size" }]
      }
    ],
    productType: "Dupatta",
    tags: ["women", "dupattas"],
    subcategory: "dupattas",
    details: {
      materials: "100% Pure Silk Organza, Metallic Gold pigment.",
      shipping: "Ships in 24 hours. Standard domestic shipping applies.",
      care: "Dry clean only. Iron lightly with a protective cloth cover."
    }
  },
  // MEN - KURTAS
  {
    id: "prod_kurta_m",
    handle: "ivory-silk-cotton-kurta",
    title: "Ivory Silk Cotton Kurta",
    description: "A tailored luxury kurta for men, cut from a premium blend of raw silk and organic handspun cotton. Featuring a high band collar, concealed button placket, and subtle tone-on-tone embroidery details around the neck.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "7500", currencyCode: "INR" }
    },
    images: [
      { url: "/images/men_kurta.png", altText: "Ivory Silk Cotton Kurta", width: 800, height: 1200 },
      { url: "/images/contemporary.png", altText: "Ivory Silk Cotton Kurta Detail", width: 800, height: 1200 }
    ],
    options: [
      { id: "opt_kurta_m_size", name: "Size", values: ["M", "L", "XL", "XXL"] }
    ],
    variants: [
      {
        id: "var_kurta_m_1",
        title: "M",
        price: "7500",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "M" }]
      },
      {
        id: "var_kurta_m_2",
        title: "L",
        price: "7500",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "L" }]
      },
      {
        id: "var_kurta_m_3",
        title: "XL",
        price: "7500",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "XL" }]
      },
      {
        id: "var_kurta_m_4",
        title: "XXL",
        price: "7800",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "XXL" }]
      }
    ],
    productType: "Kurta",
    tags: ["men", "kurtas", "featured", "new-arrivals"],
    subcategory: "kurtas",
    details: {
      materials: "50% Mulberry Silk, 50% Organic Handloom Cotton.",
      shipping: "Ships in 2-4 business days. Standard delivery applies.",
      care: "Dry clean only. Warm iron on reverse."
    }
  },
  // MEN - SHIRTS
  {
    id: "prod_shirt_m",
    handle: "classic-khadi-cotton-shirt",
    title: "Classic Khadi Cotton Shirt",
    description: "Made from premium hand-spun khadi cotton, this light shirt features a band collar and coconut-shell buttons. Breathable, comfortable, and tailored for a modern, relaxed fit. Fuses heritage weave with contemporary daily wear.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "4200", currencyCode: "INR" }
    },
    images: [
      { url: "/images/men_kurta.png", altText: "Classic Khadi Cotton Shirt", width: 800, height: 1200 }
    ],
    options: [
      { id: "opt_shirt_m_size", name: "Size", values: ["S", "M", "L", "XL"] }
    ],
    variants: [
      {
        id: "var_shirt_m_1",
        title: "S",
        price: "4200",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "S" }]
      },
      {
        id: "var_shirt_m_2",
        title: "M",
        price: "4200",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "M" }]
      },
      {
        id: "var_shirt_m_3",
        title: "L",
        price: "4200",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "L" }]
      },
      {
        id: "var_shirt_m_4",
        title: "XL",
        price: "4200",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "XL" }]
      }
    ],
    productType: "Shirt",
    tags: ["men", "shirts"],
    subcategory: "shirts",
    details: {
      materials: "100% Hand-spun Organic Khadi Cotton.",
      shipping: "Dispatched in 2 business days. Free domestic shipping.",
      care: "Machine wash cold with like colors. Tumble dry low."
    }
  },
  // MEN - JACKETS
  {
    id: "prod_jacket_m",
    handle: "handloom-nehru-jacket",
    title: "Handloom Nehru Jacket",
    description: "A structured, premium Nehru jacket woven from pure raw silk and linen threads. Featuring a classic band collar, breast pocket, and detailed wood-engraved buttons. An essential layering piece for formal and festive Indian styling.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "9500", currencyCode: "INR" }
    },
    images: [
      { url: "/images/men_kurta.png", altText: "Handloom Nehru Jacket", width: 800, height: 1200 }
    ],
    options: [
      { id: "opt_jacket_m_size", name: "Size", values: ["M", "L", "XL"] }
    ],
    variants: [
      {
        id: "var_jacket_m_1",
        title: "M",
        price: "9500",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "M" }]
      },
      {
        id: "var_jacket_m_2",
        title: "L",
        price: "9500",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "L" }]
      },
      {
        id: "var_jacket_m_3",
        title: "XL",
        price: "9500",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "XL" }]
      }
    ],
    productType: "Jacket",
    tags: ["men", "jackets"],
    subcategory: "jackets",
    details: {
      materials: "70% Raw Silk, 30% Fine Linen. Lining: Satin polyester.",
      shipping: "Ships in 3 business days. Worldwide premium delivery.",
      care: "Dry clean only."
    }
  },
  // JEWELRY - EARRINGS
  {
    id: "prod_earrings_1",
    handle: "temple-gold-jhumka-earrings",
    title: "Temple Gold Jhumka Earrings",
    description: "Handcrafted in 22-carat gold plating, these heritage temple-style jhumka earrings feature intricate hand-chiseled depictions of deities, flanked by dangling tiny pearls and natural ruby highlights. A masterpiece of traditional Southern Indian metalcraft.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "14200", currencyCode: "INR" }
    },
    images: [
      { url: "/images/jewelry.png", altText: "Temple Gold Jhumka Earrings", width: 800, height: 1200 }
    ],
    options: [
      { id: "opt_earrings_size", name: "Size", values: ["One Size"] }
    ],
    variants: [
      {
        id: "var_earrings_1",
        title: "One Size",
        price: "14200",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "One Size" }]
      }
    ],
    productType: "Earrings",
    tags: ["jewelry", "earrings", "featured", "new-arrivals"],
    subcategory: "earrings",
    details: {
      materials: "925 Sterling Silver base, 22-karat Gold plating, Semi-precious Ruby, Freshwater Pearls.",
      shipping: "Insured express shipping in 2-3 business days.",
      care: "Avoid contact with perfume, water, and hairsprays. Store in a zip-lock pouch with cotton cotton wool."
    }
  },
  // JEWELRY - NECKLACES
  {
    id: "prod_necklace_1",
    handle: "kundan-polki-choker-necklace",
    title: "Kundan Polki Choker Necklace",
    description: "An extraordinary bridal and festive choker necklace crafted with fine uncut Polki diamonds and set in traditional Kundan gold foil. Accented with raw tumble-cut Zambian emerald drops and pearls, with an adjustable silk thread cord.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "29500", currencyCode: "INR" }
    },
    images: [
      { url: "/images/jewelry.png", altText: "Kundan Polki Choker Necklace", width: 800, height: 1200 },
      { url: "/images/saree.png", altText: "Kundan Polki Choker Necklace Detail", width: 800, height: 1200 }
    ],
    options: [
      { id: "opt_necklace_size", name: "Size", values: ["Adjustable"] }
    ],
    variants: [
      {
        id: "var_necklace_1",
        title: "Adjustable",
        price: "29500",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "Adjustable" }]
      }
    ],
    productType: "Necklace",
    tags: ["jewelry", "necklaces", "featured"],
    subcategory: "necklaces",
    details: {
      materials: "Silver-alloy base, 24k Kundan gold foil setting, Raw Emerald drops, Polki uncut crystals, adjustable gold thread dori.",
      shipping: "Insured express delivery within 4-7 business days.",
      care: "Do not expose to moisture or direct sunlight. Store in the velvet-lined hard box provided."
    }
  },
  // JEWELRY - RINGS
  {
    id: "prod_ring_1",
    handle: "emerald-cut-gold-ring",
    title: "Emerald Cut Gold Ring",
    description: "A minimalist luxury statement ring featuring a striking emerald-cut green onyx set in a chunky, hand-textured 18k gold-plated brass band. Seamlessly blends modern design with heritage raw mineral aesthetics.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "8500", currencyCode: "INR" }
    },
    images: [
      { url: "/images/jewelry.png", altText: "Emerald Cut Gold Ring", width: 800, height: 1200 }
    ],
    options: [
      { id: "opt_ring_size", name: "Size", values: ["US 6", "US 7", "US 8"] }
    ],
    variants: [
      {
        id: "var_ring_1",
        title: "US 6",
        price: "8500",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "US 6" }]
      },
      {
        id: "var_ring_2",
        title: "US 7",
        price: "8500",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "US 7" }]
      },
      {
        id: "var_ring_3",
        title: "US 8",
        price: "8500",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "US 8" }]
      }
    ],
    productType: "Ring",
    tags: ["jewelry", "rings"],
    subcategory: "rings",
    details: {
      materials: "Brass base, 18-karat micro Gold plating, Natural Emerald-cut Green Onyx.",
      shipping: "Ships in 2 business days. Free domestic shipping.",
      care: "Wipe with a clean dry cloth after use. Avoid chemicals, lotion and perfume."
    }
  }
];
