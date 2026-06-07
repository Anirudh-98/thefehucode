export interface ProductVariant {
  id: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: ProductImage;
}

export interface ProductImage {
  url: string;
  altText: string;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice?: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: ProductImage[];
  variants: ProductVariant[];
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  productType: string;
  tags: string[];
  // Extended details for editorial layout tabs
  details?: {
    materials: string;
    shipping: string;
    care: string;
  };
  subcategory?: string;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: ProductImage;
}

export interface CartItem {
  id: string; // Cart line id
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

export interface Cart {
  id: string;
  checkoutUrl?: string;
  lines: CartItem[];
  subtotalAmount: {
    amount: string;
    currencyCode: string;
  };
  totalTaxAmount?: {
    amount: string;
    currencyCode: string;
  };
  totalAmount: {
    amount: string;
    currencyCode: string;
  };
  totalQuantity: number;
}
