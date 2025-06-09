import { ProductListItem } from "@/types/product.types";
import ProductCard from "@/components/shop/root/product-card";

interface ProductGridProps {
  products?: ProductListItem[];
  loading?: boolean;
  title?: string;
  description?: string;
  limit?: number;
  showAll?: boolean;
  className?: string;
}

const ProductGrid = ({
  products = [],
  loading = false,
  title,
  description,
  limit = 8,
  showAll = false,
  className = "",
}: ProductGridProps) => {
  const displayProducts = showAll ? products : products.slice(0, limit);

  if (loading) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          {title && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
              {description && (
                <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!displayProducts.length) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          {title && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
              {description && (
                <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
              )}
            </div>
          )}

          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            {description && (
              <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {!showAll && products.length > limit && (
          <div className="text-center mt-12">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              View All Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
