import type { Database } from "./database.types";

export type CartItem = Database["public"]["Tables"]["cart_items"]["Row"];
export type CartItemInsert =
  Database["public"]["Tables"]["cart_items"]["Insert"];
export type CartItemUpdate =
  Database["public"]["Tables"]["cart_items"]["Update"];

export interface GuestCartItem {
  variantId: number;
  quantity: number;
  addedAt: string;
}

export interface CartItemWithDetails extends CartItem {
  variant: {
    id: number;
    size: string;
    color: string;
    price: number;
    stock_quantity: number;
    product: {
      id: number;
      name: string;
      slug: string;
      brand: {
        name: string;
      };
      images: Array<{
        url: string;
        alt_text: string | null;
      }>;
    };
  };
}

export interface CartSummary {
  items: CartItemWithDetails[];
  totalItems: number;
  subtotal: number;
  total: number;
}

export interface RawCartItemResponse {
  id: number;
  cart_id: string;
  variant_id: number;
  quantity: number;
  added_at: string | null;
  product_variants?: {
    id: number;
    size: string;
    color_name: string | null;
    price_offset: number | null;
    stock_quantity: number;
    sku: string;
    products?: {
      id: number;
      name: string;
      slug: string;
      base_price: number;
      brands?: {
        name: string;
      };
      product_images?: Array<{
        image_url: string;
        alt_text: string | null;
      }>;
    };
  };
}

export interface RawProductImage {
  image_url: string;
  alt_text: string | null;
}
