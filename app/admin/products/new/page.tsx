import { ProductForm } from "@/components/admin/products/product-form";

const NewProductPage = () => {
  return (
    <div className="space-y-6">
      <ProductForm mode="create" />
    </div>
  );
};

export default NewProductPage;
