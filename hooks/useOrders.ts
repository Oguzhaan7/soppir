"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/query/keys";
import { ordersApi } from "@/utils/api/orders";
import { OrderFilters, AdminOrderFilters } from "@/types/filter.types";
import { OrderCreate } from "@/types/order.types";
import { useSupabase } from "@/providers/supabase-provider";
import { toast } from "sonner";

export const useOrders = (filters?: AdminOrderFilters) => {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => ordersApi.getAllOrders(filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useMyOrders = (filters?: OrderFilters) => {
  const { user } = useSupabase();

  return useQuery({
    queryKey: queryKeys.orders.myOrders(user?.id, filters),
    queryFn: () => ordersApi.getMyOrders(user!.id, filters),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => ordersApi.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 10,
  });
};

export const useOrderStats = (dateRange?: { from: string; to: string }) => {
  return useQuery({
    queryKey: [...queryKeys.orders.all, "stats", dateRange],
    queryFn: () => ordersApi.getOrderStats(dateRange),
    staleTime: 1000 * 60 * 15,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useSupabase();

  return useMutation({
    mutationFn: (orderData: OrderCreate) =>
      ordersApi.create(orderData, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all,
      });
      toast.success("Order created successfully!");
    },
    onError: (error) => {
      console.error("Create order error:", error);
      toast.error("Failed to create order!");
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      ordersApi.updateOrderStatus(orderId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all,
      });
      queryClient.setQueryData(queryKeys.orders.detail(data.id), data);
      toast.success("Order status updated successfully!");
    },
    onError: (error) => {
      console.error("Update order status error:", error);
      toast.error("Failed to update order status!");
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      ordersApi.cancelOrder(orderId, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all,
      });
      queryClient.setQueryData(queryKeys.orders.detail(data.id), data);
      toast.success("Order cancelled successfully!");
    },
    onError: (error) => {
      console.error("Cancel order error:", error);
      toast.error("Failed to cancel order!");
    },
  });
};
