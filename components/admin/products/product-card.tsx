"use client";

import { ProductWithDetails } from "@/types/product.types";
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  TableCell,
  TableRow,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/formatter/format-price";
import { format } from "date-fns";

interface ProductWithAdminData extends ProductWithDetails {
  stock_quantity: number;
  is_active: boolean;
}

interface ProductCardProps {
  product: ProductWithAdminData;
  viewMode: "grid" | "table";
  selected: boolean;
  onSelect: (checked: boolean) => void;
}

export const ProductCard = ({
  product,
  viewMode,
  selected,
  onSelect,
}: ProductCardProps) => {
  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { label: "Out of Stock", variant: "destructive" as const };
    if (stock < 10)
      return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const stockStatus = getStockStatus(product.stock_quantity || 0);

  const safeDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  if (viewMode === "grid") {
    return (
      <div className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="absolute top-2 left-2 z-10">
          <Checkbox checked={selected} onCheckedChange={onSelect} />
        </div>

        {product.is_featured && (
          <div className="absolute top-2 right-2 z-10">
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800"
            >
              <Icons.star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}

        <div className="aspect-square relative bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0].image_url}
              alt={product.images[0].alt_text || product.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold truncate">{product.name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {product.description}
          </p>

          <div className="flex justify-between items-center mt-2">
            <span className="font-bold text-lg">
              {formatPrice(product.base_price)}
            </span>
            <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
          </div>

          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-muted-foreground">
              {safeDate(product.created_at)}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Icons.moreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/products/${product.id}`}>
                    <Icons.eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Icons.edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Icons.trash className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TableRow className="group">
      <TableCell>
        <Checkbox checked={selected} onCheckedChange={onSelect} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0].image_url}
                alt={product.images[0].alt_text || product.name}
                width={48}
                height={48}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gray-100" />
            )}
          </div>
          <div>
            <div className="font-medium flex items-center gap-2">
              {product.name}
              {product.is_featured && (
                <Icons.star className="w-3 h-3 text-yellow-500" />
              )}
            </div>
            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
              {product.description}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="font-medium">
        {formatPrice(product.base_price)}
      </TableCell>
      <TableCell>
        <Badge variant={stockStatus.variant}>
          {product.stock_quantity || 0}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={product.is_active ? "default" : "secondary"}>
          {product.is_active ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {safeDate(product.created_at)}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Icons.moreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}`}>
                <Icons.eye className="w-4 h-4 mr-2" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}/edit`}>
                <Icons.edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Icons.trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
