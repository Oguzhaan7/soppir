"use client";

import { useState, useEffect, useCallback } from "react";
import { CategoryFilters as FilterType } from "@/types/filter.types";
import {
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";

interface CategoryFiltersProps {
  onFiltersChange: (filters: FilterType) => void;
}

export const CategoryFilters = ({ onFiltersChange }: CategoryFiltersProps) => {
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");

  const buildFilters = useCallback((): FilterType => {
    const filters: FilterType = {};

    if (search) filters.search = search;
    if (isActive !== "") filters.is_active = isActive === "true";

    return filters;
  }, [search, isActive]);

  useEffect(() => {
    const filters = buildFilters();
    onFiltersChange(filters);
  }, [buildFilters, onFiltersChange]);

  const clearFilters = () => {
    setSearch("");
    setIsActive("");
  };

  const activeFiltersCount = [search, isActive].filter(Boolean).length;

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={isActive} onValueChange={setIsActive}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={clearFilters}>
            <Icons.trash className="w-4 h-4 mr-2" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>
    </div>
  );
};
