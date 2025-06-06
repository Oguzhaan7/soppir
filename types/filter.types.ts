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
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  in_stock?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
