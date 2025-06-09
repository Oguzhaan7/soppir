"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandSchema, BrandFormData } from "@/utils/validation/brand";
import { Brand } from "@/types/brand.types";
import { useCreateBrand, useUpdateBrand } from "@/hooks/useBrands";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";
import { toast } from "sonner";

interface BrandFormProps {
  brand?: Brand;
  onSuccess?: () => void;
}

export const BrandForm = ({ brand, onSuccess }: BrandFormProps) => {
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();

  const form = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name || "",
      logo_url: brand?.logo_url || "",
    },
  });

  const isEditing = !!brand;
  const isLoading = createBrand.isPending || updateBrand.isPending;

  const onSubmit = async (data: BrandFormData) => {
    try {
      const slug = data.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      const brandData = { ...data, slug };

      if (isEditing) {
        await updateBrand.mutateAsync({
          id: brand.id,
          data: brandData,
        });
        toast.success("Brand updated successfully!");
      } else {
        await createBrand.mutateAsync(brandData);
        toast.success("Brand created successfully!");
      }
      onSuccess?.();
    } catch {
      toast.error(
        isEditing ? "Failed to update brand!" : "Failed to create brand!"
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Brand name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? "Update" : "Create"} Brand
          </Button>
        </div>
      </form>
    </Form>
  );
};
