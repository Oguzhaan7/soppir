"use client";

import { Brand } from "@/types/brand.types";
import { BrandForm } from "./brand-form";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  TableCell,
  TableRow,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";
import { format } from "date-fns";
import { useState } from "react";
import { useDeleteBrand } from "@/hooks/useBrands";
import { toast } from "sonner";
import Image from "next/image";

interface BrandCardProps {
  brand: Brand;
}

export const BrandCard = ({ brand }: BrandCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const deleteBrand = useDeleteBrand();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this brand?")) {
      try {
        await deleteBrand.mutateAsync(brand.id);
        toast.success("Brand deleted successfully!");
      } catch {
        toast.error("Failed to delete brand!");
      }
    }
  };

  const safeDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
          {brand.logo_url ? (
            <Image
              src={brand.logo_url}
              alt={brand.name}
              width={48}
              height={48}
              className="object-contain w-full h-full"
              unoptimized
            />
          ) : (
            <Icons.camera className="w-6 h-6 text-gray-400" />
          )}
        </div>
      </TableCell>
      <TableCell className="font-medium">{brand.name}</TableCell>
      <TableCell className="max-w-xs truncate">-</TableCell>
      <TableCell>
        <Badge variant="default">Active</Badge>
      </TableCell>
      <TableCell>{safeDate(brand.created_at)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Icons.moreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Icons.edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Brand</DialogTitle>
                </DialogHeader>
                <BrandForm
                  brand={brand}
                  onSuccess={() => setIsEditOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Icons.trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
