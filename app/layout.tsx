import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from "@/providers/supabase-provider";
import { QueryClientProvider } from "@/providers/query-client-provider";
import { ShopLayout } from "@/components/shop/layout/shop-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soppir - Shoe Store",
  description: "The trendiest shoes are here!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>
          <SupabaseProvider>
            <ShopLayout>{children}</ShopLayout>
          </SupabaseProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
