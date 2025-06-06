"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/query/keys";
import { categoriesApi } from "@/utils/api/categories";
import type { Database } from "@/types/database.types";
import { CategoryFilters } from "@/types/filter.types";

type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];

export const useCategories = (filters?: CategoryFilters) => {
  return useQuery({
    queryKey: queryKeys.categories.list(filters),
    queryFn: () => categoriesApi.getAll(filters),
  });
};

export const useCategoryHierarchy = () => {
  return useQuery({
    queryKey: [...queryKeys.categories.all, "hierarchy"],
    queryFn: categoriesApi.getHierarchy,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
  });
};

export const useCategoryChildren = (parentId: number) => {
  return useQuery({
    queryKey: [...queryKeys.categories.detail(parentId), "children"],
    queryFn: () => categoriesApi.getChildren(parentId),
    enabled: !!parentId,
  });
};

export const useRootCategories = () => {
  return useQuery({
    queryKey: [...queryKeys.categories.all, "roots"],
    queryFn: categoriesApi.getRoots,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategoryBreadcrumb = (categoryId: number) => {
  return useQuery({
    queryKey: [...queryKeys.categories.all, "breadcrumb", categoryId],
    queryFn: () => categoriesApi.getBreadcrumb(categoryId),
    enabled: !!categoryId,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryInsert) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.all,
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryUpdate }) =>
      categoriesApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.all,
      });
      queryClient.setQueryData(queryKeys.categories.detail(data.id), data);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.all,
      });
    },
  });
};

export const useReorderCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, order }: { id: number; order: number }) =>
      categoriesApi.reorder(id, order),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.all,
      });
    },
  });
};
