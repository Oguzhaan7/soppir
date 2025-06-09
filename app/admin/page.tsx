"use client";

import { useState } from "react";
import { useAdminProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";
import { useOrders, useOrderStats } from "@/hooks/useOrders";
import { StatsCard } from "@/components/admin/dashboard/stats-card";
import { RecentOrders } from "@/components/admin/dashboard/recent-orders";
import { TopProducts } from "@/components/admin/dashboard/top-products";
import { Icons } from "@/components/common/icons";

const AdminPage = () => {
  const [dateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    to: new Date().toISOString(),
  });

  const { data: products, isLoading: productsLoading } = useAdminProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: recentOrders, isLoading: ordersLoading } = useOrders({
    limit: 5,
  });
  const { data: orderStats, isLoading: statsLoading } =
    useOrderStats(dateRange);

  const totalProducts = products?.length || 0;
  const publishedProducts =
    products?.filter((p) => p.is_published)?.length || 0;
  const totalCategories = categories?.length || 0;
  const activeCategories = categories?.filter((c) => c.is_active)?.length || 0;
  const totalBrands = brands?.length || 0;

  const lowStockProducts =
    products?.filter((p) => {
      const totalStock =
        p.product_variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0;
      return totalStock < 10;
    })?.length || 0;

  const outOfStockProducts =
    products?.filter((p) => {
      const totalStock =
        p.product_variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0;
      return totalStock === 0;
    })?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last 30 days overview
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Orders"
          value={orderStats?.total_orders || 0}
          icon={Icons.shoppingBag}
          loading={statsLoading}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${(orderStats?.total_revenue || 0).toLocaleString()}`}
          icon={Icons.dollarSign}
          loading={statsLoading}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Avg. Order Value"
          value={`$${(orderStats?.average_order_value || 0).toFixed(2)}`}
          icon={Icons.tag}
          loading={statsLoading}
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard
          title="Pending Orders"
          value={orderStats?.pending_orders || 0}
          icon={Icons.clock}
          loading={statsLoading}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={Icons.package}
          loading={productsLoading}
          subtitle={`${publishedProducts} published`}
        />
        <StatsCard
          title="Categories"
          value={totalCategories}
          icon={Icons.tag}
          loading={categoriesLoading}
          subtitle={`${activeCategories} active`}
        />
        <StatsCard
          title="Brands"
          value={totalBrands}
          icon={Icons.star}
          loading={brandsLoading}
        />
        <StatsCard
          title="Low Stock Items"
          value={lowStockProducts}
          icon={Icons.alertTriangle}
          loading={productsLoading}
          variant="warning"
          subtitle={`${outOfStockProducts} out of stock`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={recentOrders} loading={ordersLoading} />
        <TopProducts
          products={products?.slice(0, 5)}
          loading={productsLoading}
        />
      </div>
    </div>
  );
};

export default AdminPage;
