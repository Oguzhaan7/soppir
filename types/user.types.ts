import { Database } from "@/types/database.types";

export type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];
export type UserRoleInsert =
  Database["public"]["Tables"]["user_roles"]["Insert"];
export type UserRoleUpdate =
  Database["public"]["Tables"]["user_roles"]["Update"];

export type Role = "admin" | "manager" | "customer";

export interface UserWithRole {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: Role;
  created_at: string;
}
