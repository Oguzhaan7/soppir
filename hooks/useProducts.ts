"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/query/keys";
import { productsApi } from "@/utils/api/products";
import { ProductFilters, PaginationParams } from "@/types/filter.types";
import {
  ProductImageInsert,
  ProductImageUpdate,
  ProductInsert,
  ProductUpdate,
  ProductVariantInsert,
  ProductVariantUpdate,
} from "@/types/product.types";
import { toast } from "sonner";

export const useProducts = (
  filters?: ProductFilters,
  pagination?: PaginationParams
) => {
  return useQuery({
    queryKey: queryKeys.products.list(filters, pagination),
    queryFn: () => productsApi.getAll(filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: [...queryKeys.products.all, "slug", slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
};

export const useProductVariants = (productId: number) => {
  return useQuery({
    queryKey: queryKeys.products.variants(productId),
    queryFn: () => productsApi.getVariants(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useProductVariant = (variantId: number) => {
  return useQuery({
    queryKey: [...queryKeys.products.all, "variant", variantId],
    queryFn: () => productsApi.getVariantById(variantId),
    enabled: !!variantId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useRelatedProducts = (productId: number, limit = 6) => {
  return useQuery({
    queryKey: [...queryKeys.products.detail(productId), "related", limit],
    queryFn: () => productsApi.getRelated(productId, limit),
    enabled: !!productId,
    staleTime: 1000 * 60 * 15,
  });
};

export const useFeaturedProducts = (limit = 8) => {
  return useQuery({
    queryKey: [...queryKeys.products.all, "featured", limit],
    queryFn: () => productsApi.getFeatured(limit),
    staleTime: 1000 * 60 * 10,
  });
};

export const useSearchProducts = (
  query: string,
  limit = 10,
  pagination?: PaginationParams
) => {
  return useQuery({
    queryKey: queryKeys.products.search(query, pagination),
    queryFn: () => productsApi.searchProducts(query, limit),
    enabled: !!query && query.length >= 2,
    staleTime: 1000 * 60 * 2,
  });
};

export const useProductFilterOptions = () => {
  return useQuery({
    queryKey: [...queryKeys.products.all, "filter-options"],
    queryFn: () => productsApi.getFilterOptions(),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductInsert) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
      toast.success("Product created successfully!");
    },
    onError: (error) => {
      console.error("Create product error:", error);
      toast.error("Failed to create product!");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductUpdate }) =>
      productsApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
      queryClient.setQueryData(queryKeys.products.detail(variables.id), data);
      toast.success("Product updated successfully!");
    },
    onError: (error) => {
      console.error("Update product error:", error);
      toast.error("Failed to update product!");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
      toast.success("Product deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete product error:", error);
      toast.error("Failed to delete product!");
    },
  });
};

export const useCreateVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductVariantInsert) => productsApi.createVariant(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.variants(variables.product_id),
      });
      toast.success("Variant created successfully!");
    },
    onError: (error) => {
      console.error("Create variant error:", error);
      toast.error("Failed to create variant!");
    },
  });
};

export const useUpdateVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductVariantUpdate }) =>
      productsApi.updateVariant(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.variants(data.product_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(data.product_id),
      });
      toast.success("Variant updated successfully!");
    },
    onError: (error) => {
      console.error("Update variant error:", error);
      toast.error("Failed to update variant!");
    },
  });
};

export const useDeleteVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.deleteVariant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
      toast.success("Variant deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete variant error:", error);
      toast.error("Failed to delete variant!");
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variantId,
      quantity,
    }: {
      variantId: number;
      quantity: number;
    }) => productsApi.updateStock(variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
      toast.success("Stock updated successfully!");
    },
    onError: (error) => {
      console.error("Update stock error:", error);
      toast.error("Failed to update stock!");
    },
  });
};

export const useAdminProducts = (
  filters?: ProductFilters,
  pagination?: PaginationParams
) => {
  return useQuery({
    queryKey: [...queryKeys.products.all, "admin", filters, pagination],
    queryFn: () => productsApi.getAllForAdmin(filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useAddImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductImageInsert) => productsApi.addImage(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(data.product_id),
      });
      toast.success("Image added successfully!");
    },
    onError: (error) => {
      console.error("Add image error:", error);
      toast.error("Failed to add image!");
    },
  });
};

export const useUpdateImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductImageUpdate }) =>
      productsApi.updateImage(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(data.product_id),
      });
      toast.success("Image updated successfully!");
    },
    onError: (error) => {
      console.error("Update image error:", error);
      toast.error("Failed to update image!");
    },
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
      toast.success("Image deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete image error:", error);
      toast.error("Failed to delete image!");
    },
  });
};
