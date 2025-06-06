import { createClient } from "@/utils/supabase/client";
import { BrandFilters } from "@/types/filter.types";
import { Brand, BrandInsert, BrandUpdate } from "@/types/brand.types";

export const brandsApi = {
  getAll: async (filters?: BrandFilters): Promise<Brand[]> => {
    const supabase = createClient();
    let query = supabase.from("brands").select("*").order("name");

    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    if (filters?.active !== undefined) {
      query = query.eq("is_active", filters.active);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  getById: async (id: number): Promise<Brand> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  create: async (brand: BrandInsert) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("brands")
      .insert(brand)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id: number, brand: BrandUpdate): Promise<Brand> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("brands")
      .update(brand)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: number): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase.from("brands").delete().eq("id", id);

    if (error) throw error;
  },
};
