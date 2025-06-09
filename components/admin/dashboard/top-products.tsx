"use client";

import { ProductWithDetails } from "@/types/product.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Skeleton,
} from "@/components/ui";
import { formatPrice } from "@/utils/formatter/format-price";
import Link from "next/link";

interface TopProductsProps {
  products?: ProductWithDetails[];
  loading: boolean;
}

export const TopProducts = ({ products, loading }: TopProductsProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
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
        <CardTitle>Top Products</CardTitle>
        <Link
          href="/admin/products"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {!products || products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No products found
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const totalStock =
                product.product_variants?.reduce(
                  (sum, variant) => sum + variant.stock_quantity,
                  0
                ) || 0;

              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium truncate max-w-40">
                        {product.name}
                      </p>
                      <Badge
                        variant={product.is_published ? "default" : "secondary"}
                      >
                        {product.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Stock: {totalStock} • {product.brand?.name || "No Brand"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(product.base_price)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
