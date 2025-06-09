"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { CategoryList } from "@/components/admin/categories/category-list";
import { CategoryFilters } from "@/components/admin/categories/category-filters";
import { CategoryForm } from "@/components/admin/categories/category-form";
import { CategoryFilters as CategoryFiltersType } from "@/types/filter.types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";

const CategoriesPage = () => {
  const [filters, setFilters] = useState<CategoryFiltersType>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: categories, isLoading } = useCategories(filters);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icons.plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <CategoryFilters onFiltersChange={setFilters} />
      <CategoryList categories={categories} loading={isLoading} />
    </div>
  );
};

export default CategoriesPage;
