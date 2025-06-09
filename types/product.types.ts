import { Database } from "./database.types";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductVariant =
  Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductImage =
  Database["public"]["Tables"]["product_images"]["Row"];
export type Brand = Database["public"]["Tables"]["brands"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];

export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export type ProductVariantInsert =
  Database["public"]["Tables"]["product_variants"]["Insert"];
export type ProductVariantUpdate =
  Database["public"]["Tables"]["product_variants"]["Update"];

export type ProductImageInsert =
  Database["public"]["Tables"]["product_images"]["Insert"];
export type ProductImageUpdate =
  Database["public"]["Tables"]["product_images"]["Update"];

export interface SimpleProductVariant {
  id: number;
  product_id: number;
  size: string;
  color_name: string | null;
  color_hex: string | null;
  price_offset: number | null;
  stock_quantity: number;
  sku: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProductWithDetails extends Product {
  brand?: Brand;
  category?: Category;
  brands?: Brand | null;
  categories?: Category | null;
  product_variants?: SimpleProductVariant[];
  product_images?: ProductImage[];
  variants?: ProductVariantWithDetails[];
  images?: ProductImage[];
}

export interface ProductVariantWithDetails extends SimpleProductVariant {
  product?: ProductWithDetails;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  is_featured?: boolean;
  brand?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
  variants?: SimpleProductVariant[];
  images?: ProductImage[];
}

export interface ProductFilterOptions {
  priceRange: {
    min: number;
    max: number;
  };
  brands: Array<{
    id: number;
    name: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
  }>;
}

export interface RawProductResponse extends Product {
  brands: Brand | null;
  categories: Category | null;
  product_variants: SimpleProductVariant[];
  product_images: ProductImage[];
}

export interface RawRelatedProductResponse {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  brands: Brand | null;
  product_variants: SimpleProductVariant[];
  product_images: ProductImage[];
}

export interface RawSearchProductResponse {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  brands: Brand | null;
  product_images: ProductImage[];
}

export interface ProductWithAdminData extends ProductWithDetails {
  stock_quantity: number;
  is_active: boolean;
}
