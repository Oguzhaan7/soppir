"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "@/components/admin/layout/sidebar";
import { AdminHeader } from "@/components/admin/layout/header";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/common/icons";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAdmin, roleLoading, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !roleLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login?redirectTo=/admin");
        return;
      }

      if (!isAdmin) {
        router.push("/");
        return;
      }
    }
  }, [isAdmin, roleLoading, loading, isAuthenticated, router]);

  if (loading || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Icons.loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className={cn(
          "flex-1 flex flex-col",
          "lg:ml-0",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        )}
      >
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
