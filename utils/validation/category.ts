import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().optional(),
  parent_id: z.number().nullable().optional(),
  is_active: z.boolean().default(true),
  display_order: z.number().default(0),
  slug: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
