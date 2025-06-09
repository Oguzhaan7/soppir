import { createClient } from "@/utils/supabase/client";
import {
  Order,
  OrderInsert,
  OrderWithDetails,
  OrderCreate,
} from "@/types/order.types";
import { AdminOrderFilters, OrderFilters } from "@/types/filter.types";
import type { Json } from "@/types/database.types";

export const ordersApi = {
  create: async (
    orderData: OrderCreate,
    userId: string
  ): Promise<OrderWithDetails> => {
    const supabase = createClient();

    const totalAmount = orderData.items.reduce(
      (sum, item) => sum + item.price_at_purchase * item.quantity,
      0
    );

    const orderInsert: OrderInsert = {
      user_id: userId,
      status: "pending",
      total_amount: totalAmount,
      shipping_address: orderData.shipping_address as unknown as Json,
      billing_address: (orderData.billing_address ||
        orderData.shipping_address) as unknown as Json,
      notes: orderData.notes,
    };

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderInsert)
      .select("*")
      .single();

    if (orderError) throw orderError;

    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
      product_name_at_purchase: item.product_name_at_purchase || null,
      variant_details_at_purchase:
        item.variant_details_at_purchase as unknown as Json,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return ordersApi.getOrderById(order.id);
  },

  getMyOrders: async (
    userId: string,
    filters?: OrderFilters
  ): Promise<Order[]> => {
    const supabase = createClient();
    let query = supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.date_from) {
      query = query.gte("created_at", filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte("created_at", filters.date_to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  getOrderById: async (orderId: string): Promise<OrderWithDetails> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          product_variants:variant_id (
            id,
            size,
            color_name,
            price_offset,
            sku,
            stock_quantity,
            products:product_id (
              id,
              name,
              slug,
              base_price,
              brands:brand_id (name),
              product_images (
                image_url,
                alt_text
              )
            )
          )
        )
      `
      )
      .eq("id", orderId)
      .single();

    if (error) throw error;

    interface RawOrderItem {
      id: number;
      order_id: string;
      variant_id: number;
      quantity: number;
      price_at_purchase: number;
      product_name_at_purchase: string | null;
      variant_details_at_purchase: Json;
      created_at: string | null;
      product_variants: {
        id: number;
        size: string;
        color_name: string | null;
        price_offset: number | null;
        sku: string;
        stock_quantity: number;
        products: {
          id: number;
          name: string;
          slug: string;
          base_price: number;
          brands: { name: string } | null;
          product_images: Array<{ image_url: string; alt_text: string | null }>;
        };
      };
    }

    return {
      ...data,
      items: ((data.order_items as unknown as RawOrderItem[]) || []).map(
        (item) => ({
          id: item.id,
          order_id: item.order_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price_at_purchase: item.price_at_purchase,
          product_name_at_purchase: item.product_name_at_purchase,
          variant_details_at_purchase: item.variant_details_at_purchase,
          created_at: item.created_at,
          updated_at: null,
          variant: {
            id: item.product_variants.id,
            size: item.product_variants.size,
            color_name: item.product_variants.color_name,
            price_offset: item.product_variants.price_offset,
            sku: item.product_variants.sku,
            stock_quantity: item.product_variants.stock_quantity,
            product: {
              id: item.product_variants.products.id,
              name: item.product_variants.products.name,
              slug: item.product_variants.products.slug,
              base_price: item.product_variants.products.base_price,
              brand: item.product_variants.products.brands || undefined,
              images: item.product_variants.products.product_images,
            },
          },
        })
      ),
    };
  },

  updateOrderStatus: async (
    orderId: string,
    status: string
  ): Promise<Order> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  cancelOrder: async (orderId: string, reason?: string): Promise<Order> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        notes: reason || "Cancelled by user",
      })
      .eq("id", orderId)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  getAllOrders: async (filters?: AdminOrderFilters): Promise<Order[]> => {
    const supabase = createClient();
    let query = supabase
      .from("orders")
      .select("*")
      .order(filters?.sort_by || "created_at", {
        ascending: filters?.sort_order === "asc",
      });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.search) {
      query = query.or(
        `id.ilike.%${filters.search}%,user_id.ilike.%${filters.search}%`
      );
    }

    if (filters?.user_id) {
      query = query.eq("user_id", filters.user_id);
    }

    if (filters?.date_from) {
      query = query.gte("created_at", filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte("created_at", filters.date_to);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  getOrderStats: async (dateRange?: { from: string; to: string }) => {
    const supabase = createClient();

    let query = supabase
      .from("orders")
      .select("total_amount, status, created_at");

    if (dateRange) {
      query = query
        .gte("created_at", dateRange.from)
        .lte("created_at", dateRange.to);
    }

    const { data: orders, error } = await query;

    if (error) throw error;

    const totalOrders = orders?.length || 0;
    const totalRevenue =
      orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const pendingOrders =
      orders?.filter((order) => order.status === "pending")?.length || 0;

    return {
      total_orders: totalOrders,
      total_revenue: totalRevenue,
      average_order_value: averageOrderValue,
      pending_orders: pendingOrders,
    };
  },
};
