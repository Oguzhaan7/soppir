export interface BrandFilters {
  search?: string;
  active?: boolean;
}

export interface CategoryFilters {
  search?: string;
  parent_id?: number | null;
  is_active?: boolean;
}

export interface ProductFilters {
  search?: string;
  brand_id?: number;
  category_id?: number;
  price_min?: number;
  price_max?: number;
  is_featured?: boolean;
  in_stock?: boolean;
}

export interface OrderFilters {
  status?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface AdminOrderFilters extends OrderFilters {
  limit?: number;
  offset?: number;
  sort_by?: "created_at" | "total_amount" | "status";
  sort_order?: "asc" | "desc";
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
