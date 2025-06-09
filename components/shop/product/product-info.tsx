"use client";

import { useState, useEffect, useMemo } from "react";
import { ProductWithDetails } from "@/types/product.types";
import { useAddToCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatter/format-price";
import { Icons } from "@/components/common/icons";
import {
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { toast } from "sonner";

interface ProductInfoProps {
  product: ProductWithDetails;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();

  const variants = useMemo(
    () => product.product_variants || [],
    [product.product_variants]
  );
  const selectedVariantData = variants.find((v) => v.id === selectedVariant);

  const availableColors = useMemo(
    () => [...new Set(variants.map((v) => v.color_name).filter(Boolean))],
    [variants]
  );
  const availableSizes = useMemo(
    () => [...new Set(variants.map((v) => v.size))].sort(),
    [variants]
  );

  const selectedColor = selectedVariantData?.color_name;
  const selectedSize = selectedVariantData?.size;

  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0].id);
    }
  }, [variants, selectedVariant]);

  const getVariantByColorAndSize = (color: string | null, size: string) => {
    return variants.find((v) => v.color_name === color && v.size === size);
  };

  const handleColorChange = (color: string) => {
    const newVariant = getVariantByColorAndSize(
      color,
      selectedSize || availableSizes[0]
    );
    if (newVariant) {
      setSelectedVariant(newVariant.id);
    }
  };

  const handleSizeChange = (size: string) => {
    const newVariant = getVariantByColorAndSize(selectedColor || null, size);
    if (newVariant) {
      setSelectedVariant(newVariant.id);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    addToCart.mutate({
      variantId: selectedVariant,
      quantity,
    });
  };

  const currentPrice =
    product.base_price + (selectedVariantData?.price_offset || 0);
  const inStock = selectedVariantData
    ? selectedVariantData.stock_quantity > 0
    : false;

  const getColorByName = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      black: "#000000",
      white: "#FFFFFF",
      red: "#EF4444",
      blue: "#3B82F6",
      green: "#10B981",
      yellow: "#F59E0B",
      purple: "#8B5CF6",
      pink: "#EC4899",
      gray: "#6B7280",
      grey: "#6B7280",
      brown: "#A16207",
      orange: "#F97316",
      navy: "#1E3A8A",
      beige: "#F5F5DC",
      maroon: "#7F1D1D",
      olive: "#65A30D",
    };

    return colorMap[colorName.toLowerCase()] || "#6B7280";
  };

  return (
    <div className="space-y-6">
      <div>
        {product.brand && (
          <p className="text-sm font-medium text-primary mb-2">
            {product.brand.name}
          </p>
        )}
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-gray-900">
          {formatPrice(currentPrice)}
        </span>
        {product.is_featured && <Badge variant="secondary">Featured</Badge>}
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            inStock ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            inStock ? "text-green-700" : "text-red-700"
          }`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
        {selectedVariantData && (
          <span className="text-sm text-gray-500">
            ({selectedVariantData.stock_quantity} available)
          </span>
        )}
      </div>

      {availableColors.length > 1 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-900">
            Color:{" "}
            {selectedColor && (
              <span className="font-normal">{selectedColor}</span>
            )}
          </label>
          <div className="flex gap-2">
            {availableColors.map((color) => {
              const colorVariant = variants.find((v) => v.color_name === color);
              const isSelected = selectedColor === color;

              return (
                <button
                  key={color}
                  onClick={() => handleColorChange(color!)}
                  className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                    isSelected
                      ? "border-gray-900 ring-2 ring-gray-300 ring-offset-2"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={{
                    backgroundColor:
                      colorVariant?.color_hex || getColorByName(color || ""),
                  }}
                  title={color || "Color"}
                />
              );
            })}
          </div>
        </div>
      )}

      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-900">Size</label>
          <Select value={selectedSize || ""} onValueChange={handleSizeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {availableSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-900">Quantity</label>
        <div className="flex items-center border rounded-md w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-gray-50"
          >
            <Icons.arrowDown className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 hover:bg-gray-50"
          >
            <Icons.arrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleAddToCart}
          disabled={!selectedVariant || !inStock || addToCart.isPending}
          className="w-full"
          size="lg"
        >
          {addToCart.isPending ? (
            <>
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              Adding to Cart...
            </>
          ) : (
            <>
              <Icons.shoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>

        <Button variant="outline" className="w-full" size="lg">
          <Icons.heart className="mr-2 h-4 w-4" />
          Add to Wishlist
        </Button>
      </div>

      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Icons.truck className="h-5 w-5" />
          <span>Free shipping on orders over $75</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Icons.return className="h-5 w-5" />
          <span>30-day return policy</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Icons.shield className="h-5 w-5" />
          <span>2-year warranty</span>
        </div>
      </div>
    </div>
  );
};
