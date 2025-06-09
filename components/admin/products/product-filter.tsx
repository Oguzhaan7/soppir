"use client";

import { useState } from "react";
import { ProductFilters as FilterType } from "@/types/filter.types";
import {
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";

interface ProductFiltersProps {
  onFiltersChange: (filters: FilterType) => void;
}

export const ProductFilters = ({ onFiltersChange }: ProductFiltersProps) => {
  const [search, setSearch] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");
  const [isFeatured, setIsFeatured] = useState<"" | "true" | "false">("");

  const buildFilters = (): FilterType => {
    const filters: FilterType = {};

    if (search) filters.search = search;

    if (categoryName === "sneakers") filters.category_id = 1;
    else if (categoryName === "boots") filters.category_id = 2;
    else if (categoryName === "sandals") filters.category_id = 3;

    if (isFeatured === "true") filters.is_featured = true;
    else if (isFeatured === "false") filters.is_featured = false;

    if (isActive === "true") filters.in_stock = true;

    return filters;
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFiltersChange(buildFilters());
  };

  const handleCategoryChange = (value: string) => {
    setCategoryName(value);
    onFiltersChange(buildFilters());
  };

  const handleStatusChange = (value: "true" | "false") => {
    setIsActive(value);
    onFiltersChange(buildFilters());
  };

  const handleFeaturedChange = (value: "true" | "false") => {
    setIsFeatured(value);
    onFiltersChange(buildFilters());
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryName("");
    setIsActive("");
    setIsFeatured("");
    onFiltersChange({});
  };

  const clearSingleFilter = (
    filterType: "category" | "status" | "featured"
  ) => {
    if (filterType === "category") {
      setCategoryName("");
    } else if (filterType === "status") {
      setIsActive("");
    } else if (filterType === "featured") {
      setIsFeatured("");
    }
    onFiltersChange(buildFilters());
  };

  const activeFiltersCount = [categoryName, isActive, isFeatured].filter(
    Boolean
  ).length;

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={categoryName} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sneakers">Sneakers</SelectItem>
            <SelectItem value="boots">Boots</SelectItem>
            <SelectItem value="sandals">Sandals</SelectItem>
          </SelectContent>
        </Select>

        <Select value={isActive} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Stock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">In Stock</SelectItem>
            <SelectItem value="false">All Products</SelectItem>
          </SelectContent>
        </Select>

        <Select value={isFeatured} onValueChange={handleFeaturedChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Featured</SelectItem>
            <SelectItem value="false">Not Featured</SelectItem>
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={clearFilters}>
            <Icons.trash className="w-4 h-4 mr-2" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex gap-2 flex-wrap">
          {categoryName && (
            <Badge variant="secondary">
              Category: {categoryName}
              <Icons.trash
                className="w-3 h-3 ml-1 cursor-pointer"
                onClick={() => clearSingleFilter("category")}
              />
            </Badge>
          )}
          {isActive && (
            <Badge variant="secondary">
              Stock: {isActive === "true" ? "In Stock" : "All"}
              <Icons.trash
                className="w-3 h-3 ml-1 cursor-pointer"
                onClick={() => clearSingleFilter("status")}
              />
            </Badge>
          )}
          {isFeatured && (
            <Badge variant="secondary">
              Featured: {isFeatured === "true" ? "Yes" : "No"}
              <Icons.trash
                className="w-3 h-3 ml-1 cursor-pointer"
                onClick={() => clearSingleFilter("featured")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
