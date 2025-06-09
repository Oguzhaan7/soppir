"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripeCardElementChangeEvent } from "@stripe/stripe-js";
import { CheckoutFormData } from "@/types/checkout.types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";

interface PaymentStepProps {
  formData: Partial<CheckoutFormData>;
  updateFormData: (data: Partial<CheckoutFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PaymentStep = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}: PaymentStepProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [sameAsBilling, setSameAsBilling] = useState(
    formData.sameAsBilling ?? true
  );

  const handleCardChange = (event: StripeCardElementChangeEvent) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setCardError(error.message || "An error occurred");
      setIsProcessing(false);
    } else {
      updateFormData({
        sameAsBilling,
        paymentMethod: "stripe",
      });
      onNext();
    }

    setIsProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Payment Information
        </h2>
        <p className="text-gray-600">
          Enter your payment details to complete the order
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icons.shield className="w-5 h-5 text-green-600" />
            <span>Secure Payment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-gray-300 rounded-lg">
            <CardElement
              options={cardElementOptions}
              onChange={handleCardChange}
            />
          </div>

          {cardError && (
            <div className="flex items-center space-x-2 text-red-600">
              <Icons.alertTriangle className="w-4 h-4" />
              <span className="text-sm">{cardError}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAsBilling"
              checked={sameAsBilling}
              onCheckedChange={(checked) =>
                setSameAsBilling(checked as boolean)
              }
            />
            <label htmlFor="sameAsBilling" className="text-sm text-gray-700">
              Billing address is the same as shipping address
            </label>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icons.shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">
                  Your payment is secure
                </h4>
                <p className="text-sm text-gray-600">
                  We use industry-standard encryption to protect your payment
                  information.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <Icons.arrowLeft className="w-4 h-4 mr-2" />
          Back to Shipping
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!stripe || isProcessing}
          className="px-8"
        >
          {isProcessing ? (
            <>
              <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Review Order
              <Icons.arrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
