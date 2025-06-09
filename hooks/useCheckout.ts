"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCartItems, useCartCount, useClearCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { useCreatePaymentIntent } from "@/hooks/useStripe";
import { useSupabase } from "@/providers/supabase-provider";
import { useCartStore } from "@/stores/cart-store";
import { CheckoutFormData } from "@/types/checkout.types";
import { OrderCreate } from "@/types/order.types";
import { toast } from "sonner";

export const useCheckout = () => {
  const router = useRouter();
  const { user } = useSupabase();

  const { data: userCartItems = [] } = useCartItems();
  const { data: userCartCount = 0 } = useCartCount();
  const guestItems = useCartStore((state) => state.getGuestItems());
  const guestItemCount = useCartStore((state) => state.getGuestItemCount());

  const clearCart = useClearCart();
  const createOrder = useCreateOrder();
  const createPaymentIntent = useCreatePaymentIntent();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems = user ? userCartItems : guestItems;
  const totalItems = user ? userCartCount : guestItemCount;

  const orderSummary = useMemo(() => {
    let subtotal = 0;

    if (user && userCartItems.length > 0) {
      subtotal = userCartItems.reduce((sum, item) => {
        const cartItem = item as {
          variant_id: number;
          quantity: number;
          product_variants?: {
            price_offset: number | null;
            products?: {
              base_price: number;
              name: string;
            };
            size: string;
            sku: string;
            color_name: string | null;
          };
        };

        const variant = cartItem.product_variants;
        if (variant && variant.products) {
          const basePrice = variant.products.base_price;
          const priceOffset = variant.price_offset || 0;
          const finalPrice = basePrice + priceOffset;
          return sum + finalPrice * cartItem.quantity;
        }
        return sum;
      }, 0);
    } else if (!user && guestItems.length > 0) {
      subtotal = guestItems.reduce((sum, item) => {
        return sum + 100 * item.quantity;
      }, 0);
    }

    const shipping = subtotal > 0 ? 9.99 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total,
      itemCount: totalItems,
    };
  }, [user, userCartItems, guestItems, totalItems]);

  const steps = [
    {
      id: 1,
      title: "Shipping",
      description: "Delivery address and method",
      completed: currentStep > 1,
    },
    {
      id: 2,
      title: "Payment",
      description: "Payment method and billing",
      completed: currentStep > 2,
    },
    {
      id: 3,
      title: "Review",
      description: "Confirm your order",
      completed: false,
    },
  ];

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const processOrder = async (formData: CheckoutFormData) => {
    if (!user) {
      toast.error("You must be logged in to place an order");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData: OrderCreate = {
        shipping_address: {
          first_name: formData.shippingAddress.firstName,
          last_name: formData.shippingAddress.lastName,
          phone: formData.shippingAddress.phone,
          address_line_1: formData.shippingAddress.address,
          city: formData.shippingAddress.city,
          state: formData.shippingAddress.state,
          postal_code: formData.shippingAddress.zipCode,
          country: formData.shippingAddress.country,
        },
        billing_address: formData.sameAsBilling
          ? {
              first_name: formData.shippingAddress.firstName,
              last_name: formData.shippingAddress.lastName,
              phone: formData.shippingAddress.phone,
              address_line_1: formData.shippingAddress.address,
              city: formData.shippingAddress.city,
              state: formData.shippingAddress.state,
              postal_code: formData.shippingAddress.zipCode,
              country: formData.shippingAddress.country,
            }
          : formData.billingAddress
          ? {
              first_name: formData.billingAddress.firstName,
              last_name: formData.billingAddress.lastName,
              phone: formData.billingAddress.phone,
              address_line_1: formData.billingAddress.address,
              city: formData.billingAddress.city,
              state: formData.billingAddress.state,
              postal_code: formData.billingAddress.zipCode,
              country: formData.billingAddress.country,
            }
          : {
              first_name: formData.shippingAddress.firstName,
              last_name: formData.shippingAddress.lastName,
              phone: formData.shippingAddress.phone,
              address_line_1: formData.shippingAddress.address,
              city: formData.shippingAddress.city,
              state: formData.shippingAddress.state,
              postal_code: formData.shippingAddress.zipCode,
              country: formData.shippingAddress.country,
            },
        notes: `Shipping: ${formData.shippingMethod} | Contact: ${formData.shippingAddress.email}`,
        items: user
          ? userCartItems.map((item) => {
              const cartItem = item as {
                variant_id: number;
                quantity: number;
                product_variants?: {
                  price_offset: number | null;
                  products?: {
                    base_price: number;
                    name: string;
                  };
                  size: string;
                  sku: string;
                  color_name: string | null;
                };
              };

              const variant = cartItem.product_variants;
              const basePrice = variant?.products?.base_price || 0;
              const priceOffset = variant?.price_offset || 0;
              const finalPrice = basePrice + priceOffset;

              return {
                variant_id: cartItem.variant_id,
                quantity: cartItem.quantity,
                price_at_purchase: finalPrice,
                product_name_at_purchase:
                  variant?.products?.name || "Unknown Product",
                variant_details_at_purchase: {
                  size: variant?.size || "Unknown",
                  sku: variant?.sku || "Unknown",
                  color_name: variant?.color_name,
                  shipping_method: formData.shippingMethod,
                },
              };
            })
          : guestItems.map((item) => ({
              variant_id: item.variantId,
              quantity: item.quantity,
              price_at_purchase: 100,
              product_name_at_purchase: "Product Name",
              variant_details_at_purchase: {
                size: "M",
                sku: "SKU-001",
                shipping_method: formData.shippingMethod,
              },
            })),
      };

      const order = await createOrder.mutateAsync(orderData);

      await createPaymentIntent.mutateAsync({
        amount: orderSummary.total,
        orderId: order.id,
        currency: "usd",
      });

      await clearCart.mutateAsync();

      router.push(`/checkout/success?order=${order.id}`);
    } catch (error) {
      console.error("Order processing failed:", error);
      toast.error("Failed to process order");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    steps,
    nextStep,
    prevStep,
    cartItems,
    orderSummary,
    processOrder,
    isProcessing,
    canProceed: totalItems > 0,
  };
};
