"use client";

import { Order } from "@/types/order.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Skeleton,
} from "@/components/ui";
import { formatPrice } from "@/utils/formatter/format-price";
import { format } from "date-fns";
import Link from "next/link";

interface RecentOrdersProps {
  orders?: Order[];
  loading: boolean;
}

export const RecentOrders = ({ orders, loading }: RecentOrdersProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <Link
          href="/admin/orders"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {!orders || orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent orders
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">#{order.id}</p>
                    <Badge
                      variant={
                        order.status === "delivered"
                          ? "default"
                          : order.status === "pending"
                          ? "secondary"
                          : order.status === "cancelled"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.created_at
                      ? format(new Date(order.created_at), "MMM dd, HH:mm")
                      : "Unknown"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatPrice(order.total_amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
