"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/common/icons";
import Link from "next/link";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<string | null>();

  const orderId = searchParams.get("order_id");
  const paymentIntentId = searchParams.get("payment_intent") || null;

  useEffect(() => {
    if (orderId) {
      setOrderDetails(paymentIntentId);
    }
  }, [orderId, paymentIntentId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Icons.check className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Payment Successful!
            </CardTitle>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderDetails && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Order ID:</span>
                  <span className="text-gray-600">#{orderId}</span>
                </div>
                {paymentIntentId && (
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Payment ID:</span>
                    <span className="text-gray-600 font-mono text-xs">
                      {paymentIntentId.substring(0, 20)}...
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                📧 A confirmation email has been sent to your email address.
              </p>
              <p className="text-sm text-gray-600">
                📦 You can track your order status in your account dashboard.
              </p>
            </div>

            <div className="flex flex-col space-y-3 pt-4">
              <Button asChild className="w-full">
                <Link href="/orders">
                  <Icons.package className="w-4 h-4 mr-2" />
                  View My Orders
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href="/products">
                  <Icons.shoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help?{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
