"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/common/icons";
import { usePathname } from "next/navigation";
import { AdminSidebarContent } from "./sidebar";
import { UserMenu } from "./user-menu";
import { NotificationsMenu } from "./notifications-menu";
import { QuickActionsMenu } from "./quick-actions-menu";

const adminNavItems = [
  { title: "Dashboard", href: "/admin" },
  { title: "Products", href: "/admin/products" },
  { title: "Orders", href: "/admin/orders" },
  { title: "Customers", href: "/admin/customers" },
  { title: "Categories", href: "/admin/categories" },
  { title: "Brands", href: "/admin/brands" },
  { title: "Analytics", href: "/admin/analytics" },
  { title: "Settings", href: "/admin/settings" },
];

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const AdminHeader = ({
  sidebarOpen,
  setSidebarOpen,
}: AdminHeaderProps) => {
  const pathname = usePathname();
  const currentPage = adminNavItems.find((item) => item.href === pathname);

  return (
    <header className="w-full border-b bg-background">
      <div className="flex h-20 w-full items-center gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Icons.menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full p-0 sm:w-80">
              <AdminSidebarContent />
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex"
          >
            <Icons.menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold lg:text-xl truncate">
            {currentPage?.title || "Dashboard"}
          </h1>
          <p className="hidden text-sm text-muted-foreground lg:block">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <NotificationsMenu />
          <QuickActionsMenu />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
