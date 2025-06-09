"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/types/product.types";
import { Icons } from "@/components/common/icons";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductGallery = ({
  images,
  productName,
}: ProductGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const sortedImages = images.sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );
  const currentImage = sortedImages[selectedImageIndex];

  const handlePrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) =>
      prev === sortedImages.length - 1 ? 0 : prev + 1
    );
  };

  if (!sortedImages.length) {
    return (
      <div className="space-y-4">
        <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
          <Icons.camera className="h-12 w-12 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
        <Image
          src={currentImage.image_url}
          alt={currentImage.alt_text || productName}
          fill
          className="object-cover"
          priority
        />

        {sortedImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icons.arrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icons.arrowRight className="h-5 w-5" />
            </button>
          </>
        )}

        {sortedImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {selectedImageIndex + 1} / {sortedImages.length}
          </div>
        )}
      </div>

      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={cn(
                "aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                index === selectedImageIndex
                  ? "border-primary"
                  : "border-transparent hover:border-gray-300"
              )}
            >
              <Image
                src={image.image_url}
                alt={image.alt_text || `${productName} ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
