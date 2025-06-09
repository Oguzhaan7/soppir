"use client";

import { useCartItems } from "@/hooks/useCart";
import { useCartStore } from "@/stores/cart-store";
import { useSupabase } from "@/providers/supabase-provider";
import { useProductVariant } from "@/hooks/useProducts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";
import Image from "next/image";
import { useMemo } from "react";

interface CartSummaryProps {
  orderSummary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    itemCount: number;
  };
}

interface CartItemDisplayProps {
  variantId: number;
  quantity: number;
}

const CartItemDisplay = ({ variantId, quantity }: CartItemDisplayProps) => {
  const { data: variant, isLoading } = useProductVariant(variantId);

  const itemPrice = useMemo(() => {
    if (!variant) return 0;

    const basePrice = variant.product?.base_price || 0;
    const priceOffset = variant.price_offset || 0;
    const price = basePrice + priceOffset;
    return price * quantity;
  }, [variant, quantity]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="h-3 bg-gray-200 rounded mb-1" />
          <div className="h-2 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="w-16 h-3 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!variant) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
          <Icons.shoe className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            Product (ID: {variantId})
          </p>
          <p className="text-xs text-gray-500">Qty: {quantity}</p>
        </div>
        <span className="text-sm font-medium">$0.00</span>
      </div>
    );
  }

  const productName = variant.product?.name || "Product";
  const imageUrl = variant.product?.product_images?.[0]?.image_url;
  const size = variant.size;
  const color = variant.color_name;

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            width={48}
            height={48}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icons.shoe className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" title={productName}>
          {productName}
        </p>
        <p className="text-xs text-gray-500">
          {size && `Size: ${size}`}
          {color && size && " • "}
          {color && `${color}`}
          {(size || color) && " • "}
          Qty: {quantity}
        </p>
      </div>
      <span className="text-sm font-medium">${itemPrice.toFixed(2)}</span>
    </div>
  );
};

export const CartSummary = ({ orderSummary }: CartSummaryProps) => {
  const { user } = useSupabase();
  const { data: userCartItems = [] } = useCartItems();
  const guestItems = useCartStore((state) => state.getGuestItems());

  const displayItems = user ? userCartItems : guestItems;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icons.shoppingBag className="w-5 h-5" />
          <span>Order Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {displayItems && displayItems.length > 0 ? (
            displayItems.map((item) => {
              if (user) {
                const userItem = item as {
                  id: number;
                  variant_id: number;
                  quantity: number;
                };
                return (
                  <CartItemDisplay
                    key={userItem.id}
                    variantId={userItem.variant_id}
                    quantity={userItem.quantity}
                  />
                );
              } else {
                const guestItem = item as {
                  variantId: number;
                  quantity: number;
                  addedAt: string;
                };
                const itemKey = `${guestItem.variantId}-${guestItem.addedAt}`;
                return (
                  <CartItemDisplay
                    key={itemKey}
                    variantId={guestItem.variantId}
                    quantity={guestItem.quantity}
                  />
                );
              }
            })
          ) : (
            <p className="text-gray-500 text-center py-4 text-sm">
              No items in cart
            </p>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({orderSummary.itemCount} items)</span>
            <span>${orderSummary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>${orderSummary.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${orderSummary.tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>${orderSummary.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Icons.shield className="w-3 h-3" />
            <span>Secure checkout powered by Stripe</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
