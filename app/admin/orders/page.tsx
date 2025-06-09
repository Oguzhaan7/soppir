"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { OrderList } from "@/components/admin/orders/order-list";
import { OrderFilters } from "@/components/admin/orders/order-filter";
import { OrderFilters as OrderFiltersType } from "@/types/filter.types";

const OrdersPage = () => {
  const [filters, setFilters] = useState<OrderFiltersType>({});
  const { data: orders, isLoading } = useOrders(filters);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>

      <OrderFilters onFiltersChange={setFilters} />
      <OrderList orders={orders} loading={isLoading} />
    </div>
  );
};

export default OrdersPage;
