"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  productSchema,
  type ProductFormData,
} from "@/utils/validation/product";
import { generateSlug } from "@/utils/helper/slug";
import {
  useCreateProduct,
  useUpdateProduct,
  useAddImage,
  useCreateVariant,
  useUpdateVariant,
  useDeleteVariant,
} from "@/hooks/useProducts";
import { useBrands } from "@/hooks/useBrands";
import { useCategories } from "@/hooks/useCategories";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Alert,
  AlertDescription,
  Badge,
  Separator,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";
import { useRouter } from "next/navigation";
import {
  ProductWithDetails,
  ProductImage,
  SimpleProductVariant,
} from "@/types/product.types";

interface ProductFormProps {
  mode: "create" | "edit";
  product?: ProductWithDetails;
}

type VariantFormData = {
  id?: number;
  size: string;
  color_name: string;
  color_hex: string;
  price_offset: number;
  stock_quantity: number;
};

export const ProductForm = ({ mode, product }: ProductFormProps) => {
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [variants, setVariants] = useState<VariantFormData[]>([]);
  const router = useRouter();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const addImage = useAddImage();
  const createVariant = useCreateVariant();
  const updateVariantMutation = useUpdateVariant();
  const deleteVariantMutation = useDeleteVariant();
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const isLoading = createProduct.isPending || updateProduct.isPending;

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      base_price: product?.base_price || 0,
      brand_id: product?.brand_id || null,
      category_id: product?.category_id || null,
      is_featured: product?.is_featured || false,
      is_published: product?.is_published !== false ? true : false,
      tags: product?.tags || [],
    },
  });

  useEffect(() => {
    if (mode === "edit" && product) {
      if (product.product_images && product.product_images.length > 0) {
        const imageUrls = product.product_images
          .sort(
            (a: ProductImage, b: ProductImage) =>
              (a.display_order || 0) - (b.display_order || 0)
          )
          .map((img: ProductImage) => img.image_url);
        setImages(imageUrls);
      }

      if (product.product_variants && product.product_variants.length > 0) {
        const existingVariants: VariantFormData[] =
          product.product_variants.map((variant: SimpleProductVariant) => ({
            id: variant.id,
            size: variant.size,
            color_name: variant.color_name || "",
            color_hex: variant.color_hex || "#000000",
            price_offset: variant.price_offset || 0,
            stock_quantity: variant.stock_quantity,
          }));
        setVariants(existingVariants);
      }
    }
  }, [mode, product]);

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    if (mode === "create") {
      const slug = generateSlug(value);
      form.setValue("slug", slug);
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages((prev) => [...prev, e.target?.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      const [removed] = newImages.splice(from, 1);
      newImages.splice(to, 0, removed);
      return newImages;
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        size: "",
        color_name: "",
        color_hex: "#000000",
        price_offset: 0,
        stock_quantity: 0,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = <K extends keyof VariantFormData>(
    index: number,
    field: K,
    value: VariantFormData[K]
  ) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const onSubmit = async (values: ProductFormData) => {
    setError("");

    try {
      if (mode === "create") {
        const createdProduct = await createProduct.mutateAsync(values);

        if (variants.length > 0) {
          for (const variant of variants) {
            await createVariant.mutateAsync({
              product_id: createdProduct.id,
              size: variant.size,
              color_name: variant.color_name,
              color_hex: variant.color_hex,
              price_offset: variant.price_offset,
              stock_quantity: variant.stock_quantity,
              sku: `${createdProduct.slug}-${variant.size}-${variant.color_name}`.toUpperCase(),
            });
          }
        }

        if (images.length > 0) {
          for (let i = 0; i < images.length; i++) {
            await addImage.mutateAsync({
              product_id: createdProduct.id,
              image_url: images[i],
              alt_text: `${createdProduct.name} Image ${i + 1}`,
              display_order: i,
              is_thumbnail: i === 0,
              variant_id: null,
            });
          }
        }

        router.push("/admin/products");
      } else if (mode === "edit" && product) {
        await updateProduct.mutateAsync({
          id: product.id,
          data: values,
        });

        if (variants.length > 0) {
          for (const variant of variants) {
            if (variant.id) {
              await updateVariantMutation.mutateAsync({
                id: variant.id,
                data: {
                  size: variant.size,
                  color_name: variant.color_name,
                  color_hex: variant.color_hex,
                  price_offset: variant.price_offset,
                  stock_quantity: variant.stock_quantity,
                  sku: `${values.slug}-${variant.size}-${variant.color_name}`.toUpperCase(),
                },
              });
            } else {
              await createVariant.mutateAsync({
                product_id: product.id,
                size: variant.size,
                color_name: variant.color_name,
                color_hex: variant.color_hex,
                price_offset: variant.price_offset,
                stock_quantity: variant.stock_quantity,
                sku: `${values.slug}-${variant.size}-${variant.color_name}`.toUpperCase(),
              });
            }
          }
        }

        const originalVariantIds =
          product.product_variants?.map((v: SimpleProductVariant) => v.id) ||
          [];
        const currentVariantIds = variants
          .filter((v) => v.id)
          .map((v) => v.id!);
        const deletedVariantIds = originalVariantIds.filter(
          (id: number) => !currentVariantIds.includes(id)
        );

        for (const deletedId of deletedVariantIds) {
          await deleteVariantMutation.mutateAsync(deletedId);
        }

        router.push("/admin/products");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icons.plus className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {mode === "create" ? "Create New Product" : "Edit Product"}
              </h1>
              <p className="text-gray-600 mt-1">
                {mode === "create"
                  ? "Add a new product to your inventory"
                  : "Update product information"}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="mb-6 border-red-200 bg-red-50"
          >
            <Icons.x className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            id="product-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-sm border bg-white">
                  <CardHeader className="pb-6 border-b border-gray-100">
                    <CardTitle className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icons.edit className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-xl font-semibold">
                        Basic Information
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Product Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nike Air Max 270"
                                className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                                {...field}
                                onChange={(e) =>
                                  handleNameChange(e.target.value)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="base_price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Base Price ($) *
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                  $
                                </span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="299.99"
                                  className="h-12 pl-8 border-gray-200 focus:border-primary focus:ring-primary/20"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            URL Slug *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="nike-air-max-270"
                              className="h-12 font-mono text-sm border-gray-200 focus:border-primary focus:ring-primary/20"
                              {...field}
                            />
                          </FormControl>
                          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
                            <Icons.eye className="h-3 w-3" />
                            <span>
                              Preview URL: /products/
                              {field.value || "product-slug"}
                            </span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write a detailed product description that highlights key features, benefits, and specifications..."
                              className="min-h-[140px] resize-none border-gray-200 focus:border-primary focus:ring-primary/20"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500">
                            {field.value?.length || 0}/1000 characters
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-sm border bg-white">
                  <CardHeader className="pb-6 border-b border-gray-100">
                    <CardTitle className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icons.camera className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-xl font-semibold">
                        Product Images
                      </span>
                      <Badge variant="secondary" className="ml-auto">
                        {images.length} / 10
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                        dragActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Icons.plus className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-900 mb-2">
                            Drop images here or click to upload
                          </p>
                          <p className="text-sm text-gray-500">
                            Support: PNG, JPG, WEBP • Max size: 10MB each • Up
                            to 10 images
                          </p>
                        </div>
                      </div>
                    </div>

                    {images.length > 0 && (
                      <div className="space-y-4">
                        <Separator />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {images.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square overflow-hidden rounded-lg border bg-gray-50">
                                <Image
                                  src={image}
                                  alt={`Product ${index + 1}`}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                                {index > 0 && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => moveImage(index, index - 1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Icons.arrowLeft className="h-4 w-4" />
                                  </Button>
                                )}
                                {index < images.length - 1 && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => moveImage(index, index + 1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Icons.arrowRight className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeImage(index)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Icons.x className="h-4 w-4" />
                                </Button>
                              </div>

                              {index === 0 && (
                                <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs">
                                  Main
                                </Badge>
                              )}

                              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-sm border bg-white">
                  <CardHeader className="pb-6 border-b border-gray-100">
                    <CardTitle className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Icons.tag className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-xl font-semibold">
                        Product Variants
                      </span>
                      <Badge variant="secondary" className="ml-auto">
                        {variants.length} variants
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Create different size and color combinations for this
                        product
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addVariant}
                        className="h-9"
                      >
                        <Icons.plus className="h-4 w-4 mr-2" />
                        Add Variant
                      </Button>
                    </div>

                    {variants.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                          <Icons.tag className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          No variants yet
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Add size and color variants to give customers more
                          options
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addVariant}
                        >
                          <Icons.plus className="h-4 w-4 mr-2" />
                          Add First Variant
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {variants.map((variant, index) => (
                          <div
                            key={index}
                            className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">
                                Variant {index + 1}{" "}
                                {variant.id ? "(Existing)" : "(New)"}
                              </h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeVariant(index)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Icons.trash className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                  Size *
                                </label>
                                <Input
                                  placeholder="XS, S, M, L, XL"
                                  value={variant.size}
                                  onChange={(e) =>
                                    updateVariant(index, "size", e.target.value)
                                  }
                                  className="h-10"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                  Color Name
                                </label>
                                <Input
                                  placeholder="Red, Blue, Black"
                                  value={variant.color_name}
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "color_name",
                                      e.target.value
                                    )
                                  }
                                  className="h-10"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                  Color
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="color"
                                    value={variant.color_hex}
                                    onChange={(e) =>
                                      updateVariant(
                                        index,
                                        "color_hex",
                                        e.target.value
                                      )
                                    }
                                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                                  />
                                  <Input
                                    placeholder="#000000"
                                    value={variant.color_hex}
                                    onChange={(e) =>
                                      updateVariant(
                                        index,
                                        "color_hex",
                                        e.target.value
                                      )
                                    }
                                    className="h-10 font-mono text-sm"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                  Stock Quantity
                                </label>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={variant.stock_quantity}
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "stock_quantity",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="h-10"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                  Price Offset ($)
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                    $
                                  </span>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={variant.price_offset}
                                    onChange={(e) =>
                                      updateVariant(
                                        index,
                                        "price_offset",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="h-10 pl-8"
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Additional cost for this variant (can be
                                  negative for discounts)
                                </p>
                              </div>

                              <div className="flex items-end">
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 w-full">
                                  <p className="text-sm font-medium text-blue-900">
                                    Final Price: $
                                    {(
                                      (form.watch("base_price") || 0) +
                                      variant.price_offset
                                    ).toFixed(2)}
                                  </p>
                                  <p className="text-xs text-blue-600">
                                    Base: $
                                    {(form.watch("base_price") || 0).toFixed(2)}{" "}
                                    + Offset: ${variant.price_offset.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="shadow-sm border bg-white">
                  <CardHeader className="pb-6 border-b border-gray-100">
                    <CardTitle className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Icons.tag className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-xl font-semibold">
                        Organization
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <FormField
                      control={form.control}
                      name="brand_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Brand
                          </FormLabel>
                          <Select
                            value={field.value?.toString() || "none"}
                            onValueChange={(value) =>
                              field.onChange(
                                value === "none" ? null : parseInt(value)
                              )
                            }
                            disabled={brandsLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20">
                                <SelectValue placeholder="Select a brand" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">
                                <div className="flex items-center gap-2">
                                  <Icons.x className="h-4 w-4 text-gray-400" />
                                  No Brand
                                </div>
                              </SelectItem>
                              {brands?.map((brand) => (
                                <SelectItem
                                  key={brand.id}
                                  value={brand.id.toString()}
                                >
                                  <div className="flex items-center gap-2">
                                    <Icons.tag className="h-4 w-4 text-blue-500" />
                                    {brand.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Category
                          </FormLabel>
                          <Select
                            value={field.value?.toString() || "none"}
                            onValueChange={(value) =>
                              field.onChange(
                                value === "none" ? null : parseInt(value)
                              )
                            }
                            disabled={categoriesLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">
                                <div className="flex items-center gap-2">
                                  <Icons.x className="h-4 w-4 text-gray-400" />
                                  No Category
                                </div>
                              </SelectItem>
                              {categories?.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  <div className="flex items-center gap-2">
                                    <Icons.folder className="h-4 w-4 text-green-500" />
                                    {category.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-sm border bg-white">
                  <CardHeader className="pb-6 border-b border-gray-100">
                    <CardTitle className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Icons.settings className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="text-xl font-semibold">Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <FormField
                      control={form.control}
                      name="is_featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium text-gray-900">
                              Featured Product
                            </FormLabel>
                            <p className="text-sm text-gray-600">
                              Highlight this product on homepage and promotions
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_published"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-4 bg-gradient-to-r from-green-50 to-green-100/50">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium text-gray-900">
                              Published
                            </FormLabel>
                            <p className="text-sm text-gray-600">
                              Make this product visible to customers in store
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-green-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="border-t border-gray-200 bg-white p-6 mt-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Icons.eye className="h-4 w-4" />
                  <span>Changes will be saved automatically</span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/products")}
                    className="h-10 px-4"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-10 px-6"
                  >
                    {isLoading ? (
                      <>
                        <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                        {mode === "create" ? "Creating..." : "Updating..."}
                      </>
                    ) : (
                      <>
                        {mode === "create" ? "Create Product" : "Save Changes"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
