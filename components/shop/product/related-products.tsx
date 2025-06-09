import Link from "next/link";
import Image from "next/image";
import { ProductListItem } from "@/types/product.types";
import { formatPrice } from "@/utils/formatter/format-price";
import { Card, CardContent } from "@/components/ui";

interface RelatedProductsProps {
  products: ProductListItem[];
}

export const RelatedProducts = ({ products }: RelatedProductsProps) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        You might also like
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0].image_url}
                      alt={product.images[0].alt_text || product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  {product.brand && (
                    <p className="text-sm text-gray-500 mt-1">
                      {product.brand.name}
                    </p>
                  )}
                  <p className="font-bold text-gray-900 mt-2">
                    {formatPrice(product.base_price)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};
