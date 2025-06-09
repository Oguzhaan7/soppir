"use client";

import { useState } from "react";
import { ProductFilters } from "@/components/admin/products/product-filter";
import { ProductList } from "@/components/admin/products/product-list";
import { useAdminProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui";
import { Icons } from "@/components/common/icons";
import Link from "next/link";
import { ProductFilters as ProductFiltersType } from "@/types/filter.types";

const ProductsPage = () => {
  const [filters, setFilters] = useState<ProductFiltersType>({});
  const { data: products, isLoading } = useAdminProducts(filters);

  return (
    <div className="space-y-6 ">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>
            <Icons.plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <ProductFilters onFiltersChange={setFilters} />
      <ProductList products={products} loading={isLoading} />
    </div>
  );
};

export default ProductsPage;
