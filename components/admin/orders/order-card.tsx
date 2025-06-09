"use client";

import { Order } from "@/types/order.types";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  TableCell,
  TableRow,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";
import { formatPrice } from "@/utils/formatter/format-price";
import { format } from "date-fns";
import Link from "next/link";

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "processing":
        return "default";
      case "shipped":
        return "outline";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const safeDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch {
      return "Invalid date";
    }
  };

  const getBillingName = (billingAddress: unknown): string => {
    if (
      typeof billingAddress === "object" &&
      billingAddress !== null &&
      "name" in billingAddress &&
      typeof (billingAddress as Record<string, unknown>).name === "string"
    ) {
      return (billingAddress as Record<string, unknown>).name as string;
    }
    return "Customer";
  };

  return (
    <TableRow>
      <TableCell className="font-medium">#{order.id}</TableCell>
      <TableCell>
        <div>
          <div className="font-medium">User ID: {order.user_id}</div>
          <div className="text-sm text-muted-foreground">
            {getBillingName(order.billing_address)}
          </div>
        </div>
      </TableCell>
      <TableCell>{formatPrice(order.total_amount)}</TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
      </TableCell>
      <TableCell>{safeDate(order.created_at)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Icons.moreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/orders/${order.id}`}>
                <Icons.eye className="w-4 h-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icons.edit className="w-4 h-4 mr-2" />
              Update Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
