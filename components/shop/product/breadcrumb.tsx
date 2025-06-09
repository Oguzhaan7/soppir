import Link from "next/link";
import { Icons } from "@/components/common/icons";

interface BreadcrumbItem {
  label: string;
  slug?: string;
  id?: number;
  type?: "category" | "product" | "other";
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const getHref = (item: BreadcrumbItem) => {
    if (item.slug === "") {
      return "/";
    }

    if (item.type === "category" && item.slug) {
      return `/category/${item.slug}`;
    }

    if (item.type === "product" && item.slug) {
      return `/${item.slug}`;
    }

    return "#";
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <Icons.chevronDown className="h-4 w-4 rotate-[-90deg] mx-2" />
          )}
          {item.slug !== undefined ? (
            <Link
              href={getHref(item)}
              className="hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
