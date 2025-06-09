"use client";

import { usePathname } from "next/navigation";
import { ShopHeader } from "./shop-header";
import { ShopFooter } from "./shop-footer";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

interface ShopLayoutProps {
  children: React.ReactNode;
}

export const ShopLayout = ({ children }: ShopLayoutProps) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    );
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/auth");

  if (isAdminRoute || isAuthRoute) {
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ShopHeader />
      <main className="pt-16">{children}</main>
      <ShopFooter />
      <Toaster position="top-right" />
    </div>
  );
};
