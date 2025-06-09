"use client";

import { Button } from "@/components/ui";
import { Icons } from "@/components/common/icons";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Step Into Excellence",
      subtitle: "Premium Collection",
      description:
        "Discover our curated selection of premium footwear crafted for comfort, style, and durability.",
      image: "/images/hero-1.jpg",
      cta: "Shop Now",
      href: "/shop",
    },
    {
      title: "New Season Arrivals",
      subtitle: "Fresh Styles",
      description:
        "Embrace the latest trends with our new collection of contemporary and classic designs.",
      image: "/images/hero-2.jpg",
      cta: "Explore New",
      href: "/collections/new",
    },
    {
      title: "Comfort Meets Style",
      subtitle: "All Day Comfort",
      description:
        "Experience unmatched comfort with our innovative designs perfect for every occasion.",
      image: "/images/hero-3.jpg",
      cta: "Find Your Fit",
      href: "/shop",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full text-sm font-medium text-primary-foreground border border-primary/30">
              {slides[currentSlide].subtitle}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {slides[currentSlide].title.split(" ").map((word, index) => (
              <span
                key={index}
                className={
                  index === slides[currentSlide].title.split(" ").length - 1
                    ? "text-primary block"
                    : ""
                }
              >
                {word}{" "}
              </span>
            ))}
          </h1>

          <p className="text-xl mb-8 text-gray-200 max-w-lg leading-relaxed">
            {slides[currentSlide].description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href={slides[currentSlide].href}>
              <Button
                size="lg"
                className="text-lg px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              >
                <Icons.shoppingBag className="w-5 h-5 mr-2" />
                {slides[currentSlide].cta}
              </Button>
            </Link>

            <Link href="/collections">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 rounded-xl bg-transparent backdrop-blur-md border border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                <Icons.star className="w-5 h-5 mr-2" />
                View Collections
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Icons.truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-gray-300 text-xs">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Icons.return className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">30-Day Returns</p>
                <p className="text-gray-300 text-xs">Hassle-free returns</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Icons.shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Quality Guarantee</p>
                <p className="text-gray-300 text-xs">Premium materials</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
