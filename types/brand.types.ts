import { Database } from "./database.types";

export type Brand = Database["public"]["Tables"]["brands"]["Row"];
export type BrandInsert = Database["public"]["Tables"]["brands"]["Insert"];
export type BrandUpdate = Database["public"]["Tables"]["brands"]["Update"];
