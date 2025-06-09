"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/query/keys";
import { cartApi } from "@/utils/api/cart";
import { useSupabase } from "@/providers/supabase-provider";
import { useCartStore } from "@/stores/cart-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { STORAGE_KEYS } from "@/lib/constants";

const generateGuestCartId = (): string => {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getGuestCartId = (): string => {
  if (typeof window === "undefined") return "";

  let guestCartId = localStorage.getItem(STORAGE_KEYS.GUEST_CART_ID);
  if (!guestCartId) {
    guestCartId = generateGuestCartId();
    localStorage.setItem(STORAGE_KEYS.GUEST_CART_ID, guestCartId);
  }
  return guestCartId;
};

export const useCartId = () => {
  const { user } = useSupabase();
  const [guestCartId, setGuestCartId] = useState<string>("");

  useEffect(() => {
    if (!user) {
      setGuestCartId(getGuestCartId());
    }
  }, [user]);

  return user ? user.id : guestCartId;
};

export const useCart = () => {
  const cartId = useCartId();
  const { user, loading: authLoading } = useSupabase();
  const guestItemCount = useCartStore((state) => state.getGuestItemCount());

  return useQuery({
    queryKey: queryKeys.cart.summary(cartId),
    queryFn: async () => {
      if (!cartId) return null;

      if (user) {
        return await cartApi.getCartSummary(cartId);
      } else {
        return {
          items: [],
          totalItems: guestItemCount,
          subtotal: 0,
          total: 0,
        };
      }
    },
    enabled: !authLoading && !!cartId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    initialData: user
      ? undefined
      : {
          items: [],
          totalItems: guestItemCount,
          subtotal: 0,
          total: 0,
        },
  });
};

export const useCartItems = () => {
  const cartId = useCartId();
  const { user, loading: authLoading } = useSupabase();

  return useQuery({
    queryKey: queryKeys.cart.items(cartId),
    queryFn: () => (cartId && user ? cartApi.getItems(cartId) : []),
    enabled: !authLoading && !!cartId && !!user,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCartCount = () => {
  const cartId = useCartId();
  const { user, loading: authLoading } = useSupabase();
  const guestItemCount = useCartStore((state) => state.getGuestItemCount());

  return useQuery({
    queryKey: queryKeys.cart.count(cartId),
    queryFn: async () => {
      if (!cartId) return 0;

      if (user) {
        return await cartApi.getItemCount(cartId);
      } else {
        return guestItemCount;
      }
    },
    enabled: !authLoading && !!cartId,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    initialData: user ? undefined : guestItemCount,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const cartId = useCartId();
  const { user } = useSupabase();
  const addGuestItem = useCartStore((state) => state.addGuestItem);

  return useMutation({
    mutationFn: async ({
      variantId,
      quantity = 1,
    }: {
      variantId: number;
      quantity?: number;
    }) => {
      if (!cartId) throw new Error("Cart ID not available");

      if (user) {
        return await cartApi.addItem(cartId, variantId, quantity);
      } else {
        addGuestItem(variantId, quantity);
        return { success: true };
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.cart.all(cartId),
        });
      }
    },
    onError: (error) => {
      console.error("Add to cart error:", error);
      toast.error("Failed to add product to cart!");
    },
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  const cartId = useCartId();
  const { user } = useSupabase();
  const updateGuestQuantity = useCartStore(
    (state) => state.updateGuestQuantity
  );

  return useMutation({
    mutationFn: async ({
      itemId,
      variantId,
      quantity,
    }: {
      itemId?: number;
      variantId?: number;
      quantity: number;
    }) => {
      if (user && itemId) {
        return await cartApi.updateQuantity(itemId, quantity);
      } else if (!user && variantId) {
        updateGuestQuantity(variantId, quantity);
        return { success: true };
      }
      throw new Error("Invalid parameters for cart update");
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.cart.all(cartId),
        });
      }
    },
    onError: (error) => {
      console.error("Update cart error:", error);
      toast.error("Failed to update cart!");
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const cartId = useCartId();
  const { user } = useSupabase();
  const removeGuestItem = useCartStore((state) => state.removeGuestItem);

  return useMutation({
    mutationFn: async ({
      itemId,
      variantId,
    }: {
      itemId?: number;
      variantId?: number;
    }) => {
      if (user && itemId) {
        await cartApi.removeItem(itemId);
      } else if (!user && variantId) {
        removeGuestItem(variantId);
      } else {
        throw new Error("Invalid parameters for cart removal");
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.cart.all(cartId),
        });
      }

      toast.success("Product removed from cart!");
    },
    onError: (error) => {
      console.error("Remove from cart error:", error);
      toast.error("Failed to remove product from cart!");
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const cartId = useCartId();
  const { user } = useSupabase();
  const clearGuestCart = useCartStore((state) => state.clearGuestCart);

  return useMutation({
    mutationFn: async () => {
      if (!cartId) throw new Error("Cart ID not available");

      if (user) {
        await cartApi.clearCart(cartId);
      } else {
        clearGuestCart();
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.cart.all(cartId),
        });
      }

      toast.success("Cart cleared!");
    },
    onError: (error) => {
      console.error("Clear cart error:", error);
      toast.error("Failed to clear cart!");
    },
  });
};

export const useTransferGuestCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const guestItemCount = useCartStore.getState().getGuestItemCount();

      if (guestItemCount > 0) {
        await cartApi.transferGuestToUser(userId);
        localStorage.removeItem(STORAGE_KEYS.GUEST_CART_ID);
        return guestItemCount;
      }

      return 0;
    },
    onSuccess: (transferredCount, userId) => {
      if (transferredCount > 0) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.cart.all(userId),
        });

        toast.success(`${transferredCount} items transferred to your cart!`);
      }
    },
    onError: (error) => {
      console.error("Transfer cart error:", error);
      toast.error("Failed to transfer cart!");
    },
  });
};

export const useAutoTransferCart = () => {
  const { user } = useSupabase();
  const transferCart = useTransferGuestCart();

  useEffect(() => {
    if (user && useCartStore.getState().getGuestItemCount() > 0) {
      transferCart.mutate(user.id);
    }
  }, [user, transferCart]);
};
