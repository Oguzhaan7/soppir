import { useMutation } from "@tanstack/react-query";
import { stripeApi, CreatePaymentIntentRequest } from "@/utils/api/stripe";
import { toast } from "sonner";

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: (data: CreatePaymentIntentRequest) =>
      stripeApi.createPaymentIntent(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Payment intent created successfully");
      } else {
        toast.error(response.error || "Failed to create payment intent");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create payment intent");
    },
  });
};
