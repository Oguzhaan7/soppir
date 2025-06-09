"use client";

import { useState } from "react";
import { ProductWithDetails } from "@/types/product.types";
import { ProductCard } from "./product-card";
import { ProductActions } from "./product-actions";
import {
  Button,
  Checkbox,
  Skeleton,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";

interface ProductListProps {
  products?: ProductWithDetails[];
  loading: boolean;
}

export const ProductList = ({ products, loading }: ProductListProps) => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const transformToAdminData = (product: ProductWithDetails) => {
    const transformed = {
      ...product,
      stock_quantity:
        product.product_variants?.reduce(
          (total, variant) => total + (variant.stock_quantity || 0),
          0
        ) || 0,
      images: product.product_images || [],
      is_active: product.is_published || false,
    };

    console.log("Product:", product.name);
    console.log("Original product_images:", product.product_images);
    console.log("Transformed images:", transformed.images);

    return transformed;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products?.map((p) => p.id) || []);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 ">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-muted-foreground">
          No products found
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Get started by adding your first product.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {selectedProducts.length > 0 && (
            <ProductActions
              selectedProducts={selectedProducts}
              onActionComplete={() => setSelectedProducts([])}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <Icons.list className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Icons.grid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedProducts.length === products.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={transformToAdminData(product)}
                  viewMode="table"
                  selected={selectedProducts.includes(product.id)}
                  onSelect={(checked) =>
                    handleSelectProduct(product.id, checked)
                  }
                />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={transformToAdminData(product)}
              viewMode="grid"
              selected={selectedProducts.includes(product.id)}
              onSelect={(checked) => handleSelectProduct(product.id, checked)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
