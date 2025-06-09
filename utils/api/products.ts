import { createClient } from "@/utils/supabase/client";
import {
  ProductWithDetails,
  ProductVariantWithDetails,
  ProductListItem,
  ProductFilterOptions,
  ProductInsert,
  ProductUpdate,
  ProductVariantInsert,
  ProductVariantUpdate,
  ProductImage,
  ProductImageInsert,
  ProductImageUpdate,
  RawProductResponse,
  RawRelatedProductResponse,
  RawSearchProductResponse,
} from "@/types/product.types";
import { ProductFilters } from "@/types/filter.types";
import { Database } from "@/types/database.types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ProductVariantRow =
  Database["public"]["Tables"]["product_variants"]["Row"];
type ProductImageRow = Database["public"]["Tables"]["product_images"]["Row"];
type BrandRow = Database["public"]["Tables"]["brands"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

interface RawAdminProductResponse extends ProductRow {
  brands: BrandRow | null;
  categories: CategoryRow | null;
  product_variants: ProductVariantRow[];
  product_images: ProductImageRow[];
}

export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<ProductListItem[]> => {
    const supabase = createClient();

    let query = supabase.from("products").select(
      `
      id,
      name,
      slug,
      base_price,
      is_featured,
      brands:brand_id (
        id,
        name
      ),
      categories:category_id (
        id,
        name
      ),
      product_variants (
        id,
        size,
        color_name,
        price_offset,
        stock_quantity
      ),
      product_images (
        image_url,
        alt_text
      )
    `
    );

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%, description.ilike.%${filters.search}%`
      );
    }

    if (filters?.category_id) {
      query = query.eq("category_id", filters.category_id);
    }

    if (filters?.brand_id) {
      query = query.eq("brand_id", filters.brand_id);
    }

    if (filters?.price_min !== undefined) {
      query = query.gte("base_price", filters.price_min);
    }

    if (filters?.price_max !== undefined) {
      query = query.lte("base_price", filters.price_max);
    }

    if (filters?.is_featured !== undefined) {
      query = query.eq("is_featured", filters.is_featured);
    }

    if (filters?.in_stock) {
      query = query.gt("product_variants.stock_quantity", 0);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    return ((data as RawProductResponse[]) || []).map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      base_price: item.base_price,
      is_featured: item.is_featured ?? false,
      brand: item.brands || undefined,
      category: item.categories || undefined,
      variants: item.product_variants,
      images: item.product_images,
    }));
  },

  getAllForAdmin: async (
    filters?: ProductFilters
  ): Promise<ProductWithDetails[]> => {
    const supabase = createClient();
    let query = supabase
      .from("products")
      .select(
        `
        *,
        brands:brand_id (id, name),
        categories:category_id (id, name),
        product_variants (
          id, product_id, size, color_name, color_hex, price_offset, stock_quantity, sku, created_at, updated_at
        ),
        product_images (
          id, product_id, image_url, alt_text, display_order, created_at
        )
      `
      )
      .order("created_at", { ascending: false });

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%, description.ilike.%${filters.search}%`
      );
    }
    if (filters?.category_id) {
      query = query.eq("category_id", filters.category_id);
    }
    if (filters?.brand_id) {
      query = query.eq("brand_id", filters.brand_id);
    }
    if (filters?.is_featured !== undefined) {
      query = query.eq("is_featured", filters.is_featured);
    }

    const { data, error } = await query;
    if (error) throw error;

    return ((data as RawAdminProductResponse[]) || []).map((item) => ({
      ...item,
      brand: item.brands || undefined,
      category: item.categories || undefined,
      brands: item.brands,
      categories: item.categories,
      product_variants: item.product_variants.map((variant) => ({
        id: variant.id,
        product_id: variant.product_id,
        size: variant.size,
        color_name: variant.color_name,
        color_hex: variant.color_hex,
        price_offset: variant.price_offset,
        stock_quantity: variant.stock_quantity,
        sku: variant.sku,
        created_at: variant.created_at,
        updated_at: variant.updated_at,
      })),
      product_images: item.product_images.map((image) => ({
        id: image.id,
        product_id: image.product_id,
        image_url: image.image_url,
        alt_text: image.alt_text,
        display_order: image.display_order,
        created_at: image.created_at,
      })),
    })) as ProductWithDetails[];
  },

  getBySlug: async (slug: string): Promise<ProductWithDetails> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        brands:brand_id (*),
        categories:category_id (*),
        product_variants (
          id,
          product_id,
          size,
          color_name,
          color_hex,
          price_offset,
          stock_quantity,
          sku,
          created_at,
          updated_at
        ),
        product_images (*)
      `
      )
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data as ProductWithDetails;
  },

  getById: async (id: number): Promise<ProductWithDetails> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        brands:brand_id (*),
        categories:category_id (*),
        product_variants (
          id,
          product_id,
          size,
          color_name,
          color_hex,
          price_offset,
          stock_quantity,
          sku,
          created_at,
          updated_at
        ),
        product_images (*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as ProductWithDetails;
  },

  getVariants: async (
    productId: number
  ): Promise<ProductVariantWithDetails[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("product_variants")
      .select(
        `
      id,
      product_id,
      size,
      color_name,
      color_hex,
      price_offset,
      stock_quantity,
      sku,
      created_at,
      updated_at,
      products:product_id (*)
    `
      )
      .eq("product_id", productId)
      .order("size")
      .order("color_name");

    if (error) throw error;

    return (data || []).map((item) => ({
      id: item.id,
      product_id: item.product_id,
      size: item.size,
      color_name: item.color_name,
      color_hex: item.color_hex,
      price_offset: item.price_offset,
      stock_quantity: item.stock_quantity,
      sku: item.sku,
      created_at: item.created_at,
      updated_at: item.updated_at,
      product: item.products as ProductRow,
    }));
  },

  getVariantById: async (
    variantId: number
  ): Promise<ProductVariantWithDetails> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("product_variants")
      .select(
        `
    id,
    product_id,
    size,
    color_name,
    color_hex,
    price_offset,
    stock_quantity,
    sku,
    created_at,
    updated_at,
    products:product_id (
      id,
      name,
      slug,
      base_price,
      description,
      brand_id,
      category_id,
      is_featured,
      is_published,
      tags,
      created_at,
      updated_at,
      product_images (
        id,
        image_url,
        alt_text,
        display_order
      ),
      brands:brand_id (
        id,
        name,
        slug,
        logo_url,
        created_at,
        updated_at
      )
    )
  `
      )
      .eq("id", variantId)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      product_id: data.product_id,
      size: data.size,
      color_name: data.color_name,
      color_hex: data.color_hex,
      price_offset: data.price_offset,
      stock_quantity: data.stock_quantity,
      sku: data.sku,
      created_at: data.created_at,
      updated_at: data.updated_at,
      product: data.products as ProductWithDetails,
    };
  },

  getRelated: async (
    productId: number,
    limit = 6
  ): Promise<ProductListItem[]> => {
    const supabase = createClient();

    const { data: product } = await supabase
      .from("products")
      .select("category_id, brand_id")
      .eq("id", productId)
      .single();

    if (!product) return [];

    const { data, error } = await supabase
      .from("products")
      .select(
        `
      id,
      name,
      slug,
      base_price,
      brands:brand_id (
        id,
        name
      ),
      product_variants (
        id,
        size,
        color_name,
        price_offset,
        stock_quantity
      ),
      product_images (
        image_url,
        alt_text
      )
    `
      )
      .neq("id", productId)
      .or(
        `category_id.eq.${product.category_id}, brand_id.eq.${product.brand_id}`
      )
      .limit(limit);

    if (error) throw error;

    return ((data as RawRelatedProductResponse[]) || []).map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      base_price: item.base_price,
      brand: item.brands || undefined,
      variants: item.product_variants,
      images: item.product_images,
    }));
  },

  getFeatured: async (limit = 8): Promise<ProductListItem[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        base_price,
        brands:brand_id (
          id,
          name
        ),
        product_variants (
          id,
          price_offset,
          stock_quantity
        ),
        product_images (
          image_url,
          alt_text
        )
      `
      )
      .eq("is_featured", true)
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return ((data as RawProductResponse[]) || []).map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      base_price: item.base_price,
      brand: item.brands || undefined,
      variants: item.product_variants,
      images: item.product_images,
    }));
  },

  searchProducts: async (
    query: string,
    limit = 10
  ): Promise<ProductListItem[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        `
      id,
      name,
      slug,
      base_price,
      brands:brand_id (
        id,
        name
      ),
      product_images (
        image_url,
        alt_text
      )
    `
      )
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
      .limit(limit);

    if (error) throw error;

    return ((data as RawSearchProductResponse[]) || []).map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      base_price: item.base_price,
      brand: item.brands || undefined,
      images: item.product_images,
    }));
  },

  getFilterOptions: async (): Promise<ProductFilterOptions> => {
    const supabase = createClient();

    const [priceRange, brands, categories] = await Promise.all([
      supabase.from("products").select("base_price").order("base_price"),

      supabase.from("brands").select("id, name").order("name"),

      supabase
        .from("categories")
        .select("id, name")
        .is("parent_id", null)
        .order("name"),
    ]);

    const prices = priceRange.data || [];
    const minPrice = prices.length > 0 ? prices[0].base_price : 0;
    const maxPrice =
      prices.length > 0 ? prices[prices.length - 1].base_price : 1000;

    return {
      priceRange: { min: minPrice, max: maxPrice },
      brands: brands.data || [],
      categories: categories.data || [],
    };
  },

  create: async (product: ProductInsert): Promise<ProductWithDetails> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select(
        `
        *,
        brands:brand_id (*),
        categories:category_id (*),
        product_variants (*),
        product_images (*)
      `
      )
      .single();

    if (error) throw error;
    return data as ProductWithDetails;
  },

  update: async (
    id: number,
    product: ProductUpdate
  ): Promise<ProductWithDetails> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .update(product)
      .eq("id", id)
      .select(
        `
        *,
        brands:brand_id (*),
        categories:category_id (*),
        product_variants (*),
        product_images (*)
      `
      )
      .single();

    if (error) throw error;
    return data as ProductWithDetails;
  },

  delete: async (id: number): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
  },

  createVariant: async (
    variant: ProductVariantInsert
  ): Promise<ProductVariantWithDetails> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("product_variants")
      .insert(variant)
      .select(
        `
        id,
        product_id,
        size,
        color_name,
        color_hex,
        price_offset,
        stock_quantity,
        sku,
        created_at,
        updated_at,
        products:product_id (*)
      `
      )
      .single();

    if (error) throw error;

    return {
      id: data.id,
      product_id: data.product_id,
      size: data.size,
      color_name: data.color_name,
      color_hex: data.color_hex,
      price_offset: data.price_offset,
      stock_quantity: data.stock_quantity,
      sku: data.sku,
      created_at: data.created_at,
      updated_at: data.updated_at,
      product: data.products as ProductRow,
    };
  },

  updateVariant: async (
    id: number,
    variant: ProductVariantUpdate
  ): Promise<ProductVariantWithDetails> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("product_variants")
      .update(variant)
      .eq("id", id)
      .select(
        `
        id,
        product_id,
        size,
        color_name,
        color_hex,
        price_offset,
        stock_quantity,
        sku,
        created_at,
        updated_at,
        products:product_id (*)
      `
      )
      .single();

    if (error) throw error;

    return {
      id: data.id,
      product_id: data.product_id,
      size: data.size,
      color_name: data.color_name,
      color_hex: data.color_hex,
      price_offset: data.price_offset,
      stock_quantity: data.stock_quantity,
      sku: data.sku,
      created_at: data.created_at,
      updated_at: data.updated_at,
      product: data.products as ProductRow,
    };
  },

  deleteVariant: async (id: number): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase
      .from("product_variants")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  addImage: async (image: ProductImageInsert): Promise<ProductImage> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("product_images")
      .insert(image)
      .select("*")
      .single();

    if (error) throw error;
    return data as ProductImage;
  },

  updateImage: async (
    id: number,
    image: ProductImageUpdate
  ): Promise<ProductImage> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("product_images")
      .update(image)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data as ProductImage;
  },

  deleteImage: async (id: number): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  updateStock: async (variantId: number, quantity: number): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase
      .from("product_variants")
      .update({ stock_quantity: quantity })
      .eq("id", variantId);

    if (error) throw error;
  },

  bulkUpdatePrices: async (
    updates: Array<{ id: number; base_price: number }>
  ): Promise<void> => {
    const supabase = createClient();

    for (const update of updates) {
      const { error } = await supabase
        .from("products")
        .update({ base_price: update.base_price })
        .eq("id", update.id);

      if (error) throw error;
    }
  },
};
