"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/query/keys";
import { brandsApi } from "@/utils/api/brands";
import type { Database } from "@/types/database.types";
import { BrandFilters } from "@/types/filter.types";

type BrandUpdate = Database["public"]["Tables"]["brands"]["Update"];
type BrandInsert = Database["public"]["Tables"]["brands"]["Insert"];

export const useBrands = (filters?: BrandFilters) => {
  return useQuery({
    queryKey: queryKeys.brands.list(filters),
    queryFn: () => brandsApi.getAll(filters),
  });
};

export const useBrand = (id: number) => {
  return useQuery({
    queryKey: queryKeys.brands.detail(id),
    queryFn: () => brandsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BrandInsert) => brandsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.brands.all,
      });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BrandUpdate }) =>
      brandsApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.brands.all,
      });
      queryClient.setQueryData(queryKeys.brands.detail(data.id), data);
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => brandsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.brands.all,
      });
    },
  });
};
