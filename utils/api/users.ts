import { createClient } from "@/utils/supabase/client";
import { Role } from "@/types/user.types";

export const usersApi = {
  getCurrentUserRole: async (): Promise<Role> => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return "customer";

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (error || !data) return "customer";
    return data.role as Role;
  },
};
