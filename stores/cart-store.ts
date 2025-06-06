import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { GuestCartItem } from "@/types/cart.types";
import { STORAGE_KEYS } from "@/lib/constants";

interface CartState {
  guestItems: GuestCartItem[];

  addGuestItem: (variantId: number, quantity?: number) => void;
  updateGuestQuantity: (variantId: number, quantity: number) => void;
  removeGuestItem: (variantId: number) => void;
  clearGuestCart: () => void;

  getGuestItemCount: () => number;
  getGuestItems: () => GuestCartItem[];
  getGuestItemByVariant: (variantId: number) => GuestCartItem | undefined;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        guestItems: [],

        addGuestItem: (variantId: number, quantity = 1) => {
          set((state) => {
            const existingIndex = state.guestItems.findIndex(
              (item) => item.variantId === variantId
            );

            if (existingIndex >= 0) {
              const newItems = [...state.guestItems];
              newItems[existingIndex].quantity += quantity;
              return { guestItems: newItems };
            } else {
              return {
                guestItems: [
                  ...state.guestItems,
                  {
                    variantId,
                    quantity,
                    addedAt: new Date().toISOString(),
                  },
                ],
              };
            }
          });
        },

        updateGuestQuantity: (variantId: number, quantity: number) => {
          set((state) => {
            if (quantity <= 0) {
              return {
                guestItems: state.guestItems.filter(
                  (item) => item.variantId !== variantId
                ),
              };
            } else {
              const newItems = state.guestItems.map((item) =>
                item.variantId === variantId ? { ...item, quantity } : item
              );
              return { guestItems: newItems };
            }
          });
        },

        removeGuestItem: (variantId: number) => {
          set((state) => ({
            guestItems: state.guestItems.filter(
              (item) => item.variantId !== variantId
            ),
          }));
        },

        clearGuestCart: () => set({ guestItems: [] }),

        getGuestItemCount: () => {
          return get().guestItems.reduce((sum, item) => sum + item.quantity, 0);
        },

        getGuestItems: () => get().guestItems,

        getGuestItemByVariant: (variantId: number) => {
          return get().guestItems.find((item) => item.variantId === variantId);
        },
      }),
      {
        name: STORAGE_KEYS.GUEST_CART_ITEMS,
      }
    ),
    {
      name: "cart-store",
    }
  )
);
