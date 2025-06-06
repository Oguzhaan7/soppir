import { createClient } from "@/utils/supabase/client";
import {
  CartItem,
  CartItemWithDetails,
  CartSummary,
  GuestCartItem,
  RawCartItemResponse,
  RawProductImage,
} from "@/types/cart.types";
import { useCartStore } from "@/stores/cart-store";

export const cartApi = {
  getItems: async (cartId: string): Promise<CartItemWithDetails[]> => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
      id,
      cart_id,
      variant_id,
      quantity,
      added_at,
      product_variants:variant_id (
        id,
        size,
        color_name,
        price_offset,
        stock_quantity,
        sku,
        products:product_id (
          id,
          name,
          slug,
          base_price,
          brands:brand_id (
            name
          ),
          product_images (
            image_url,
            alt_text
          )
        )
      )
    `
      )
      .eq("cart_id", cartId)
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Cart items fetch error:", error);
      throw error;
    }

    return ((data as RawCartItemResponse[]) || []).map(
      (item: RawCartItemResponse) => ({
        id: item.id,
        cart_id: item.cart_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        added_at: item.added_at,
        variant: {
          id: item.product_variants?.id || 0,
          size: item.product_variants?.size || "",
          color: item.product_variants?.color_name || "",
          price:
            (item.product_variants?.products?.base_price || 0) +
            (item.product_variants?.price_offset || 0),
          stock_quantity: item.product_variants?.stock_quantity || 0,
          product: {
            id: item.product_variants?.products?.id || 0,
            name: item.product_variants?.products?.name || "",
            slug: item.product_variants?.products?.slug || "",
            brand: {
              name: item.product_variants?.products?.brands?.name || "",
            },
            images: (item.product_variants?.products?.product_images || []).map(
              (img: RawProductImage) => ({
                url: img.image_url,
                alt_text: img.alt_text,
              })
            ),
          },
        },
      })
    ) as CartItemWithDetails[];
  },

  addItem: async (
    cartId: string,
    variantId: number,
    quantity: number = 1
  ): Promise<CartItem> => {
    const supabase = createClient();

    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cartId)
      .eq("variant_id", variantId)
      .single();

    if (existingItem) {
      const updatedItem = await cartApi.updateQuantity(
        existingItem.id,
        existingItem.quantity + quantity
      );
      if (!updatedItem) {
        throw new Error("Failed to update cart item");
      }
      return updatedItem;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        cart_id: cartId,
        variant_id: variantId,
        quantity,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateQuantity: async (
    itemId: number,
    quantity: number
  ): Promise<CartItem | null> => {
    const supabase = createClient();

    if (quantity <= 0) {
      await cartApi.removeItem(itemId);
      return null;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  removeItem: async (itemId: number): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (error) throw error;
  },

  clearCart: async (cartId: string): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId);

    if (error) throw error;
  },

  getGuestItems: (): GuestCartItem[] => {
    return useCartStore.getState().getGuestItems();
  },

  addGuestItem: (variantId: number, quantity: number = 1): void => {
    useCartStore.getState().addGuestItem(variantId, quantity);
  },

  updateGuestQuantity: (variantId: number, quantity: number): void => {
    useCartStore.getState().updateGuestQuantity(variantId, quantity);
  },

  removeGuestItem: (variantId: number): void => {
    useCartStore.getState().removeGuestItem(variantId);
  },

  clearGuestCart: (): void => {
    useCartStore.getState().clearGuestCart();
  },

  getGuestItemCount: (): number => {
    return useCartStore.getState().getGuestItemCount();
  },

  transferGuestToUser: async (userId: string): Promise<void> => {
    const guestItems = useCartStore.getState().getGuestItems();
    if (guestItems.length === 0) return;

    const userCartId = `user_${userId}`;

    for (const item of guestItems) {
      await cartApi.addItem(userCartId, item.variantId, item.quantity);
    }

    useCartStore.getState().clearGuestCart();
  },

  getCartSummary: async (cartId: string): Promise<CartSummary> => {
    const items = await cartApi.getItems(cartId);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    );

    return {
      items,
      totalItems,
      subtotal,
      total: subtotal,
    };
  },

  getItemCount: async (cartId: string): Promise<number> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("cart_id", cartId);

    if (error) throw error;
    return data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  },
};
