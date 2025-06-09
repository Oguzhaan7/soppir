"use client";

import { useParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useCategories, useCategoryBreadcrumb } from "@/hooks/useCategories";
import ProductGrid from "@/components/shop/root/product-grid";
import { Breadcrumb } from "@/components/shop/product/breadcrumb";
import { Icons } from "@/components/common/icons";
import { Button } from "@/components/ui";
import Link from "next/link";

const CategoryPage = () => {
  const params = useParams();
  const categorySlug = params.slug as string;

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const category = categories?.find((cat) => cat.slug === categorySlug);

  const { data: categoryBreadcrumb } = useCategoryBreadcrumb(category?.id || 0);

  const { data: products, isLoading: productsLoading } = useProducts({
    category_id: category?.id,
  });

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-4">
              <Icons.spinner className="w-8 h-8 animate-spin mx-auto text-gray-600" />
              <p className="text-gray-600">Loading category...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!categoriesLoading && !category) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-24">
            <Icons.search className="w-16 h-16 mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              The category you&apos;re looking for doesn&apos;t exist or may
              have been removed.
            </p>
            <div className="space-x-4">
              <Link href="/">
                <Button>
                  <Icons.home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline">
                  <Icons.grid className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", slug: "", type: "other" as const },
    ...(categoryBreadcrumb?.map((cat) => ({
      label: cat.name,
      slug: cat.slug,
      type: "category" as const,
    })) || []),
    { label: category?.name || "" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {category?.name}
            </h1>
            {category?.description && (
              <p className="text-gray-600 max-w-2xl">{category.description}</p>
            )}
          </div>

          <ProductGrid
            products={products}
            loading={productsLoading}
            showAll={true}
            className="bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
