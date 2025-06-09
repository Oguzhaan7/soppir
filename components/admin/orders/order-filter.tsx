"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminOrderFilters } from "@/types/filter.types";
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

interface OrderFiltersProps {
  onFiltersChange: (filters: AdminOrderFilters) => void;
}

export const OrderFilters = ({ onFiltersChange }: OrderFiltersProps) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const buildFilters = useCallback((): AdminOrderFilters => {
    const filters: AdminOrderFilters = {};

    if (search) filters.search = search;
    if (status) filters.status = status;

    return filters;
  }, [search, status]);

  useEffect(() => {
    const filters = buildFilters();
    onFiltersChange(filters);
  }, [buildFilters, onFiltersChange]);

  const clearFilters = () => {
    setSearch("");
    setStatus("");
  };

  const activeFiltersCount = [search, status].filter(Boolean).length;

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
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
