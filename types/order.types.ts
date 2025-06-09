import type { Database } from "./database.types";

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type OrderItemInsert =
  Database["public"]["Tables"]["order_items"]["Insert"];
export type OrderItemUpdate =
  Database["public"]["Tables"]["order_items"]["Update"];

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export interface OrderWithDetails extends Order {
  items: OrderItemWithDetails[];
}

export interface OrderItemWithDetails extends OrderItem {
  variant: {
    id: number;
    size: string;
    color_name: string | null;
    price_offset: number | null;
    sku: string;
    stock_quantity: number;
    product: {
      id: number;
      name: string;
      slug: string;
      base_price: number;
      brand?: { name: string };
      images?: Array<{ image_url: string; alt_text: string | null }>;
    };
  };
}

export interface VariantDetails {
  size: string;
  color_name?: string;
  color_hex?: string;
  sku: string;
  price_offset?: number;
}

export interface OrderCreate {
  items: Array<{
    variant_id: number;
    quantity: number;
    price_at_purchase: number;
    product_name_at_purchase?: string;
    variant_details_at_purchase?: VariantDetails;
  }>;
  shipping_address: ShippingAddress;
  billing_address?: BillingAddress;
  notes?: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface BillingAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface OrderStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  average_order_value: number;
}
