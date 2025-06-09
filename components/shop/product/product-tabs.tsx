"use client";

import { ProductWithDetails } from "@/types/product.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

interface ProductTabsProps {
  product: ProductWithDetails;
}

export const ProductTabs = ({ product }: ProductTabsProps) => {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="prose max-w-none">
          <p className="text-gray-600 leading-relaxed">
            {product.description ||
              "No description available for this product."}
          </p>
        </div>
      </TabsContent>

      <TabsContent value="specifications" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Product Details
            </h3>
            <dl className="space-y-2">
              {product.brand && (
                <div className="flex">
                  <dt className="w-1/3 text-sm text-gray-500">Brand:</dt>
                  <dd className="text-sm text-gray-900">
                    {product.brand.name}
                  </dd>
                </div>
              )}
              {product.category && (
                <div className="flex">
                  <dt className="w-1/3 text-sm text-gray-500">Category:</dt>
                  <dd className="text-sm text-gray-900">
                    {product.category.name}
                  </dd>
                </div>
              )}
              <div className="flex">
                <dt className="w-1/3 text-sm text-gray-500">SKU:</dt>
                <dd className="text-sm text-gray-900">
                  {product.product_variants?.[0]?.sku || "N/A"}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Available Variants
            </h3>
            <div className="space-y-2">
              {product.product_variants?.map((variant) => (
                <div key={variant.id} className="text-sm">
                  <span className="text-gray-900">
                    Size {variant.size}
                    {variant.color_name && ` - ${variant.color_name}`}
                  </span>
                  <span className="text-gray-500 ml-2">
                    ({variant.stock_quantity} in stock)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <div className="text-center py-12">
          <p className="text-gray-500">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
