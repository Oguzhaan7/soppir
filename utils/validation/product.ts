import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Product slug is required"),
  description: z.string().optional(),
  base_price: z.number().min(0, "Price must be positive"),
  brand_id: z.number().nullable().optional(),
  category_id: z.number().nullable().optional(),
  is_featured: z.boolean().nullable().optional().default(false),
  is_published: z.boolean().nullable().optional().default(true),
  tags: z.array(z.string()).optional(),
});

export const productVariantSchema = z.object({
  product_id: z.number(),
  size: z.string().min(1, "Size is required"),
  color_name: z.string().optional(),
  color_hex: z.string().optional(),
  price_offset: z.number().nullable().optional(),
  stock_quantity: z.number().min(0, "Stock must be positive"),
  sku: z.string().min(1, "SKU is required"),
});

export const productImageSchema = z.object({
  product_id: z.number(),
  variant_id: z.number().nullable().optional(),
  image_url: z.string().url("Must be a valid URL"),
  alt_text: z.string().optional(),
  display_order: z.number().nullable().optional(),
  is_thumbnail: z.boolean().nullable().optional().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type ProductVariantFormData = z.infer<typeof productVariantSchema>;
export type ProductImageFormData = z.infer<typeof productImageSchema>;
