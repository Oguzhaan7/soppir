"use client";

import { ProductListItem } from "@/types/product.types";
import { Button, Badge } from "@/components/ui";
import { Icons } from "@/components/common/icons";
import Image from "next/image";
import { useState } from "react";
import { useAddToCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: ProductListItem;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addToCart = useAddToCart();
  const router = useRouter();

  const mainImage = product.images?.[0];
  const finalPrice = selectedVariant
    ? product.base_price + (selectedVariant.price_offset || 0)
    : product.base_price;

  const availableSizes = [...new Set(product.variants?.map((v) => v.size))];

  const uniqueColors = new Map();
  product.variants?.forEach((v) => {
    if (v.color_name) {
      uniqueColors.set(v.color_name, {
        name: v.color_name,
        hex: v.color_hex,
      });
    }
  });
  const availableColors = Array.from(uniqueColors.values());

  const getVariantsForSelection = (size?: string, color?: string) => {
    return (
      product.variants?.filter((v) => {
        const sizeMatch = !size || v.size === size;
        const colorMatch = !color || v.color_name === color;
        return sizeMatch && colorMatch;
      }) || []
    );
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedVariant || selectedVariant.stock_quantity === 0) return;

    addToCart.mutate({
      variantId: selectedVariant.id,
      quantity: 1,
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`);
  };

  const getStockStatus = () => {
    if (!selectedVariant || selectedVariant.stock_quantity === 0) {
      return { status: "out", label: "Out of Stock", color: "bg-red-500" };
    }
    if (selectedVariant.stock_quantity <= 5) {
      return {
        status: "low",
        label: `Only ${selectedVariant.stock_quantity} left`,
        color: "bg-orange-500",
      };
    }
    return {
      status: "high",
      label: "In Stock",
      color: "bg-green-500",
    };
  };

  const stockStatus = getStockStatus();
  const originalPrice = product.base_price;

  return (
    <div
      className="group relative bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden bg-gray-50">
        <div className="aspect-[4/3] relative">
          {mainImage ? (
            <Image
              src={mainImage.image_url}
              alt={mainImage.alt_text || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icons.camera className="w-10 h-10 text-gray-300" />
            </div>
          )}
        </div>

        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
        >
          <Icons.heart
            className={`w-3.5 h-3.5 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        <div className="absolute top-2 left-2 z-10">
          <Badge
            className={`${stockStatus.color} text-white text-xs font-medium px-2 py-0.5`}
          >
            {stockStatus.status === "out" ? "Out of Stock" : stockStatus.label}
          </Badge>
        </div>

        {selectedVariant &&
          selectedVariant.price_offset != null &&
          selectedVariant.price_offset < 0 && (
            <div className="absolute bottom-2 left-2 z-10">
              <Badge className="bg-red-500 text-white text-xs font-medium px-2 py-0.5">
                {Math.abs(
                  (selectedVariant.price_offset / originalPrice) * 100
                ).toFixed(0)}
                % OFF
              </Badge>
            </div>
          )}
      </div>

      <div className="p-3 space-y-2.5">
        <div>
          <h3 className="font-semibold text-sm text-gray-900 hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500">{product.brand?.name}</p>
        </div>

        {availableSizes.length > 0 && (
          <div className="relative z-10">
            <p className="text-xs font-medium text-gray-700 mb-1.5">Size</p>
            <div className="flex flex-wrap gap-1">
              {availableSizes.slice(0, 4).map((size) => {
                const variantsForSize = getVariantsForSelection(
                  size as string,
                  undefined
                );
                const isAvailable = variantsForSize.some(
                  (v) => v.stock_quantity > 0
                );
                const isSelected = selectedVariant?.size === size;

                return (
                  <button
                    key={size as string}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      const variant =
                        variantsForSize.find((v) => v.stock_quantity > 0) ||
                        variantsForSize[0];

                      if (variant) {
                        setSelectedVariant(variant);
                      }
                    }}
                    disabled={!isAvailable}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                      isSelected
                        ? "bg-rose-100 text-rose-700 border border-rose-200"
                        : isAvailable
                        ? "bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600 border border-gray-200 hover:border-rose-200"
                        : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100"
                    }`}
                  >
                    {size as string}
                  </button>
                );
              })}
              {availableSizes.length > 4 && (
                <span className="px-2 py-0.5 text-xs text-gray-500">
                  +{availableSizes.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {availableColors.length > 0 && (
          <div className="relative z-10">
            <p className="text-xs font-medium text-gray-700 mb-1.5">Color</p>
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {availableColors.map((color) => {
                const variantsForColor = getVariantsForSelection(
                  undefined,
                  color.name as string
                );
                const isAvailable = variantsForColor.some(
                  (v) => v.stock_quantity > 0
                );
                const isSelected = selectedVariant?.color_name === color.name;

                return (
                  <button
                    key={color.name as string}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      const variant =
                        variantsForColor.find((v) => v.stock_quantity > 0) ||
                        variantsForColor[0];

                      if (variant) {
                        setSelectedVariant(variant);
                      }
                    }}
                    disabled={!isAvailable}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all flex-shrink-0 ${
                      isSelected
                        ? "bg-rose-100 text-rose-700 border border-rose-200"
                        : isAvailable
                        ? "bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600 border border-gray-200 hover:border-rose-200"
                        : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100"
                    }`}
                  >
                    {color.hex && (
                      <div
                        className="w-3 h-3 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                    )}
                    <span className="whitespace-nowrap">
                      {color.name as string}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between pt-2.5 border-t border-gray-100"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-base font-bold text-gray-900">
                ${finalPrice.toFixed(2)}
              </p>
              {selectedVariant &&
                selectedVariant.price_offset != null &&
                selectedVariant.price_offset < 0 && (
                  <p className="text-xs text-gray-500 line-through">
                    ${originalPrice.toFixed(2)}
                  </p>
                )}
            </div>
            {stockStatus.status === "low" && (
              <p className="text-xs text-orange-600 font-medium mt-0.5">
                {stockStatus.label}
              </p>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={
              !selectedVariant ||
              selectedVariant.stock_quantity === 0 ||
              addToCart.isPending
            }
            size="sm"
            className="flex items-center gap-1 px-3 py-1.5 rounded-md font-medium text-xs"
          >
            {addToCart.isPending ? (
              <Icons.loader className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Icons.shoppingBag className="w-3.5 h-3.5" />
            )}
            {addToCart.isPending ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
