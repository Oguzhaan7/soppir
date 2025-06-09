"use client";

import { useParams } from "next/navigation";
import { useProductBySlug, useRelatedProducts } from "@/hooks/useProducts";
import { useCategoryBreadcrumb } from "@/hooks/useCategories";
import { ProductGallery } from "@/components/shop/product/product-gallery";
import { ProductInfo } from "@/components/shop/product/product-info";
import { ProductTabs } from "@/components/shop/product/product-tabs";
import { RelatedProducts } from "@/components/shop/product/related-products";
import { Breadcrumb } from "@/components/shop/product/breadcrumb";
import { Icons } from "@/components/common/icons";

const ProductDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data: product, isLoading, error } = useProductBySlug(slug);
  const { data: breadcrumb } = useCategoryBreadcrumb(product?.category_id || 0);
  const { data: relatedProducts } = useRelatedProducts(product?.id || 0);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Icons.alertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Product Not Found
            </h1>
            <p className="text-gray-600">
              The product you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home" },
    ...(breadcrumb?.map((cat) => ({
      label: cat.name,
      slug: cat.slug,
      type: "category" as const,
    })) || []),
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery
            images={product.product_images || []}
            productName={product.name}
          />
          <ProductInfo product={product} />
        </div>

        <div className="mt-16">
          <ProductTabs product={product} />
        </div>

        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
