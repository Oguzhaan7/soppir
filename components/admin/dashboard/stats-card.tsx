"use client";

import { Card, CardContent, Skeleton } from "@/components/ui";
import { Icons } from "@/components/common/icons";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  loading?: boolean;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "warning" | "success";
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  loading,
  subtitle,
  trend,
  variant = "default",
}: StatsCardProps) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        variant === "warning" && "border-orange-200 bg-orange-50",
        variant === "success" && "border-green-200 bg-green-50"
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center space-x-1">
                {trend.isPositive ? (
                  <Icons.arrowUp className="h-3 w-3 text-green-500" />
                ) : (
                  <Icons.arrowDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.value}%
                </span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "p-3 rounded-full",
              variant === "default" && "bg-blue-100",
              variant === "warning" && "bg-orange-100",
              variant === "success" && "bg-green-100"
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6",
                variant === "default" && "text-blue-600",
                variant === "warning" && "text-orange-600",
                variant === "success" && "text-green-600"
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
