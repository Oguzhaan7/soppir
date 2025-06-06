import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/types/database.types";
import { CategoryFilters } from "@/types/filter.types";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];

interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
  parent?: Category | null;
}

export const categoriesApi = {
  getAll: async (filters?: CategoryFilters): Promise<Category[]> => {
    const supabase = createClient();
    let query = supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true })
      .order("name");

    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    if (filters?.parent_id !== undefined) {
      if (filters.parent_id === null) {
        query = query.is("parent_id", null);
      } else {
        query = query.eq("parent_id", filters.parent_id);
      }
    }

    if (filters?.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  getHierarchy: async (): Promise<CategoryWithChildren[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("name");

    if (error) throw error;

    const categories = data || [];
    const rootCategories: CategoryWithChildren[] = [];
    const categoryMap = new Map<number, CategoryWithChildren>();

    categories.forEach((cat) => {
      categoryMap.set(cat.id, {
        ...cat,
        children: [],
        parent: null,
      });
    });

    categories.forEach((cat) => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.children!.push(category);
          category.parent = parent;
        }
      } else {
        rootCategories.push(category);
      }
    });

    return rootCategories;
  },

  getById: async (id: number): Promise<Category> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  getChildren: async (parentId: number): Promise<Category[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("parent_id", parentId)
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("name");

    if (error) throw error;
    return data || [];
  },

  getRoots: async (): Promise<Category[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .is("parent_id", null)
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("name");

    if (error) throw error;
    return data || [];
  },

  getBreadcrumb: async (categoryId: number): Promise<Category[]> => {
    const breadcrumb: Category[] = [];
    let currentId: number | null = categoryId;

    while (currentId) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", currentId)
        .single();

      if (error) throw error;

      const category: Category = data;
      breadcrumb.unshift(category);
      currentId = category.parent_id;
    }

    return breadcrumb;
  },
  create: async (category: CategoryInsert): Promise<Category> => {
    const supabase = createClient();

    if (category.parent_id) {
      const { data: parent, error: parentError } = await supabase
        .from("categories")
        .select("id")
        .eq("id", category.parent_id)
        .single();

      if (parentError || !parent) {
        throw new Error(
          `Parent category with ID ${category.parent_id} does not exist`
        );
      }
    }

    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id: number, category: CategoryUpdate): Promise<Category> => {
    const supabase = createClient();

    if (category.parent_id !== undefined && category.parent_id !== null) {
      const { data: parent, error: parentError } = await supabase
        .from("categories")
        .select("id")
        .eq("id", category.parent_id)
        .single();

      if (parentError || !parent) {
        throw new Error(
          `Parent category with ID ${category.parent_id} does not exist`
        );
      }

      if (category.parent_id === id) {
        throw new Error("Category cannot be its own parent");
      }

      const { data: descendants } = await supabase
        .from("categories")
        .select("id")
        .eq("parent_id", id);

      if (descendants?.some((child) => child.id === category.parent_id)) {
        throw new Error(
          "Cannot set child category as parent (circular reference)"
        );
      }
    }

    const { data, error } = await supabase
      .from("categories")
      .update(category)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: number): Promise<void> => {
    const supabase = createClient();

    const { data: children } = await supabase
      .from("categories")
      .select("id")
      .eq("parent_id", id);

    if (children && children.length > 0) {
      throw new Error(
        "Cannot delete category with children. Delete children first or reassign them to another parent."
      );
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;
  },

  reorder: async (categoryId: number, newOrder: number): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase
      .from("categories")
      .update({ display_order: newOrder })
      .eq("id", categoryId);

    if (error) throw error;
  },
};
