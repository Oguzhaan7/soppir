import {
  AdminOrderFilters,
  BrandFilters,
  CategoryFilters,
  OrderFilters,
  PaginationParams,
  ProductFilters,
} from "@/types/filter.types";

export const queryKeys = {
  brands: {
    all: ["brands"] as const,
    lists: () => [...queryKeys.brands.all, "list"] as const,
    list: (filters?: BrandFilters) =>
      [...queryKeys.brands.lists(), { filters }] as const,
    details: () => [...queryKeys.brands.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.brands.details(), id] as const,
  },
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (filters?: CategoryFilters) =>
      [...queryKeys.categories.lists(), { filters }] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.categories.details(), id] as const,
  },
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters?: ProductFilters, pagination?: PaginationParams) =>
      [...queryKeys.products.lists(), { filters, pagination }] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
    variants: (id: number) =>
      [...queryKeys.products.detail(id), "variants"] as const,
    images: (id: number) =>
      [...queryKeys.products.detail(id), "images"] as const,
    search: (query: string, pagination?: PaginationParams) =>
      [...queryKeys.products.all, "search", { query, pagination }] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (filters?: AdminOrderFilters) =>
      [...queryKeys.orders.all, "list", filters] as const,
    myOrders: (userId?: string, filters?: OrderFilters) =>
      [...queryKeys.orders.all, "my", userId, filters] as const,
    detail: (id: string) => [...queryKeys.orders.all, "detail", id] as const,
  },
  cart: {
    all: (cartId: string | null) => ["cart", cartId] as const,
    summary: (cartId: string | null) =>
      [...queryKeys.cart.all(cartId), "summary"] as const,
    items: (cartId: string | null) =>
      [...queryKeys.cart.all(cartId), "items"] as const,
    count: (cartId: string | null) =>
      [...queryKeys.cart.all(cartId), "count"] as const,
  },
} as const;
