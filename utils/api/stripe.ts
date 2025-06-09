import { ApiResponse } from "@/types/api.types";

export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  orderId?: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export const stripeApi = {
  createPaymentIntent: async (
    data: CreatePaymentIntentRequest
  ): Promise<ApiResponse<CreatePaymentIntentResponse>> => {
    try {
      const response = await fetch("/api/stripe/payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          data: null,
          error: result.error || "Payment intent creation failed",
          success: false,
        };
      }

      return {
        data: result,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Network error",
        success: false,
      };
    }
  },
};
