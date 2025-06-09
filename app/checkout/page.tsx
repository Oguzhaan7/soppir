"use client";

import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { useCheckout } from "@/hooks/useCheckout";
import { useSupabase } from "@/providers/supabase-provider";
import { CheckoutStepper } from "@/components/checkout/checkout-stepper";
import { ShippingStep } from "@/components/checkout/shipping-step";
import { PaymentStep } from "@/components/checkout/payment-step";
import { ReviewStep } from "@/components/checkout/review-step";
import { CartSummary } from "@/components/checkout/cart-summary";
import { CheckoutFormData } from "@/types/checkout.types";
import { Button } from "@/components/ui";
import { Icons } from "@/components/common/icons";
import Link from "next/link";

const CheckoutPage = () => {
  const { user, loading } = useSupabase();
  const {
    currentStep,
    steps,
    nextStep,
    prevStep,
    orderSummary,
    canProceed,
    isProcessing,
  } = useCheckout();

  const [formData, setFormData] = useState<Partial<CheckoutFormData>>({
    sameAsBilling: true,
    shippingMethod: "standard",
    paymentMethod: "stripe",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Icons.loader className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <Icons.user className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Sign In Required
              </h1>
              <p className="text-gray-600 mb-6">
                You need to sign in to proceed with checkout.
              </p>
              <div className="space-y-3">
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full">Sign In</Button>
                </Link>
                <Link href="/auth/register" className="w-full">
                  <Button variant="outline" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!canProceed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <Icons.shoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 mb-6">
                Add some items to your cart before proceeding to checkout.
              </p>
              <Link href="/">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const updateFormData = (data: Partial<CheckoutFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icons.alertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-amber-800">
                    Demo Application Notice
                  </h3>
                  <p className="text-sm text-amber-700 mt-1">
                    This is a demonstration application. Please do not enter
                    real personal information, payment details, or actual
                    addresses. Use test data only.
                  </p>
                  <div className="mt-2 text-xs text-amber-600">
                    💳 Use test card:{" "}
                    <code className="bg-amber-100 px-1 rounded">
                      4242 4242 4242 4242
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Checkout
              </h1>
              <p className="text-gray-600">Complete your order</p>
            </div>

            <CheckoutStepper steps={steps} currentStep={currentStep} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  {currentStep === 1 && (
                    <ShippingStep
                      formData={formData}
                      updateFormData={updateFormData}
                      onNext={nextStep}
                    />
                  )}

                  {currentStep === 2 && (
                    <PaymentStep
                      formData={formData}
                      updateFormData={updateFormData}
                      onNext={nextStep}
                      onBack={prevStep}
                    />
                  )}

                  {currentStep === 3 && (
                    <ReviewStep
                      formData={formData as CheckoutFormData}
                      orderSummary={orderSummary}
                      onBack={prevStep}
                      isProcessing={isProcessing}
                    />
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <CartSummary orderSummary={orderSummary} />
              </div>
            </div>

            <div className="mt-8 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <Icons.shield className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-700 text-center">
                  <strong>Demo Mode:</strong> No real charges will be made. This
                  is for testing purposes only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default CheckoutPage;
