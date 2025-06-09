"use client";

import { useState } from "react";
import { useBrands } from "@/hooks/useBrands";
import { BrandList } from "@/components/admin/brands/brand-list";
import { BrandFilters } from "@/components/admin/brands/brand-filters";
import { BrandForm } from "@/components/admin/brands/brand-form";
import { BrandFilters as BrandFiltersType } from "@/types/filter.types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";

const BrandsPage = () => {
  const [filters, setFilters] = useState<BrandFiltersType>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: brands, isLoading } = useBrands(filters);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Brands</h1>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icons.plus className="w-4 h-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Brand</DialogTitle>
            </DialogHeader>
            <BrandForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <BrandFilters onFiltersChange={setFilters} />
      <BrandList brands={brands} loading={isLoading} />
    </div>
  );
};

export default BrandsPage;
