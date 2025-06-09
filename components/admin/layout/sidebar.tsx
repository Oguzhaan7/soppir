"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/common/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Icons.dashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Icons.shoe,
    badge: "8",
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: Icons.bag,
    badge: "4",
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Icons.user,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Icons.folder,
  },
  {
    title: "Brands",
    href: "/admin/brands",
    icon: Icons.tag,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: Icons.chart,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Icons.settings,
  },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const AdminSidebarContent = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="p-6 h-20">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Icons.shoe className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Soppir</span>
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
            Admin
          </span>
        </Link>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-4">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "text-muted-foreground hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "ml-auto rounded-full px-2 py-1 text-xs",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <Separator />
    </div>
  );
};

const CollapsedSidebar = ({
  setSidebarOpen,
}: {
  setSidebarOpen: (open: boolean) => void;
}) => {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-center border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="h-8 w-8"
        >
          <Icons.shoe className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 space-y-2 p-2">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-accent relative",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-accent-foreground"
              )}
              title={item.title}
            >
              <item.icon className="h-5 w-5" />
              {item.badge && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="h-10 w-10"
        >
          <Icons.menu className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const AdminSidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden border-r bg-background transition-all duration-300 lg:block",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {sidebarOpen ? (
          <AdminSidebarContent />
        ) : (
          <CollapsedSidebar setSidebarOpen={setSidebarOpen} />
        )}
      </aside>
    </>
  );
};
