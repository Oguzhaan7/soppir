"use client";

import { useCheckout } from "@/hooks/useCheckout";
import { useSupabase } from "@/providers/supabase-provider";
import { useCartItems } from "@/hooks/useCart";
import { useCartStore } from "@/stores/cart-store";
import { useProductVariant } from "@/hooks/useProducts";
import { CheckoutFormData } from "@/types/checkout.types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";
import Image from "next/image";
import { useMemo } from "react";

interface ReviewStepProps {
  formData: CheckoutFormData;
  orderSummary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    itemCount: number;
  };
  onBack: () => void;
  isProcessing: boolean;
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
        <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="w-20 h-4 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!variant) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
          <Icons.shoe className="w-8 h-8 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">Product (ID: {variantId})</p>
          <p className="text-sm text-gray-500">
            Size: Unknown • Qty: {quantity}
          </p>
        </div>
        <span className="font-medium">$0.00</span>
      </div>
    );
  }

  const productName = variant.product?.name || "Product";
  const imageUrl = variant.product?.product_images?.[0]?.image_url;
  const size = variant.size;
  const color = variant.color_name;

  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            width={64}
            height={64}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icons.shoe className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate" title={productName}>
          {productName}
        </p>
        <p className="text-sm text-gray-500">
          {size && `Size: ${size}`}
          {color && size && " • "}
          {color && `Color: ${color}`}
          {(size || color) && " • "}
          Qty: {quantity}
        </p>
      </div>
      <span className="font-medium">${itemPrice.toFixed(2)}</span>
    </div>
  );
};

export const ReviewStep = ({
  formData,
  orderSummary,
  onBack,
  isProcessing,
}: ReviewStepProps) => {
  const { processOrder } = useCheckout();
  const { user } = useSupabase();
  const { data: userCartItems = [] } = useCartItems();
  const guestItems = useCartStore((state) => state.getGuestItems());

  const displayItems = user ? userCartItems : guestItems;

  const handlePlaceOrder = async () => {
    await processOrder(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Review Your Order
        </h2>
        <p className="text-gray-600">
          Please review your order details before completing your purchase
        </p>
      </div>

      {/* Cart Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icons.shoppingBag className="w-5 h-5" />
            <span>Order Items ({orderSummary.itemCount})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
              <p className="text-gray-500 text-center py-4">No items in cart</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icons.truck className="w-5 h-5" />
              <span>Shipping Address</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium">
              {formData.shippingAddress.firstName}{" "}
              {formData.shippingAddress.lastName}
            </p>
            <p className="text-gray-600">{formData.shippingAddress.address}</p>
            <p className="text-gray-600">
              {formData.shippingAddress.city}, {formData.shippingAddress.state}{" "}
              {formData.shippingAddress.zipCode}
            </p>
            <p className="text-gray-600">{formData.shippingAddress.country}</p>
            <Separator className="my-3" />
            <p className="text-sm text-gray-600">
              <span className="font-medium">Email:</span>{" "}
              {formData.shippingAddress.email}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Phone:</span>{" "}
              {formData.shippingAddress.phone}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icons.package className="w-5 h-5" />
              <span>Shipping Method</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium capitalize">
                  {formData.shippingMethod.replace("_", " ")} Shipping
                </p>
                <p className="text-sm text-gray-600">
                  {formData.shippingMethod === "standard" &&
                    "5-7 business days"}
                  {formData.shippingMethod === "express" && "2-3 business days"}
                  {formData.shippingMethod === "overnight" &&
                    "Next business day"}
                </p>
              </div>
              <span className="font-medium">
                ${orderSummary.shipping.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          <Icons.arrowLeft className="w-4 h-4 mr-2" />
          Back to Payment
        </Button>

        <Button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="px-8 bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <>
              <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Place Order
              <Icons.check className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
