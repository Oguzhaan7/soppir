"use client";

import { useProduct } from "@/hooks/useProducts";
import { ProductForm } from "@/components/admin/products/product-form";
import { Icons } from "@/components/common/icons";
import { notFound } from "next/navigation";
import { use } from "react";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditProductPage = ({ params }: EditProductPageProps) => {
  const resolvedParams = use(params);
  const productId = parseInt(resolvedParams.id);
  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Icons.loader className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  return <ProductForm mode="edit" product={product} />;
};

export default EditProductPage;
