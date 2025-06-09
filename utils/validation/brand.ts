import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().optional(),
  logo_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  slug: z.string().optional(),
});

export type BrandFormData = z.infer<typeof brandSchema>;
