"use client";

import { useProducts } from "@/hooks/useProducts";
import HeroSection from "@/components/shop/root/hero-section";
import ProductGrid from "@/components/shop/root/product-grid";

const Home = () => {
  const { data: allProducts, isLoading } = useProducts();

  const featuredProducts = allProducts
    ?.filter((product) => product.is_featured)
    ?.slice(0, 4);

  return (
    <div className="min-h-screen">
      <HeroSection />

      <ProductGrid
        products={featuredProducts}
        loading={isLoading}
        title="Featured Products"
        description="Handpicked favorites that define style and comfort"
        limit={8}
        className="bg-white"
      />

      <ProductGrid
        products={allProducts}
        loading={isLoading}
        title="New Arrivals"
        description="Fresh styles just landed - be the first to step into the latest trends"
        limit={8}
        className="bg-gray-50"
      />
    </div>
  );
};

export default Home;
