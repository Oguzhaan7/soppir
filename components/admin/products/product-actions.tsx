"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/common/icons";

interface ProductActionsProps {
  selectedProducts: number[];
  onActionComplete: () => void;
}

export const ProductActions = ({
  selectedProducts,
  onActionComplete,
}: ProductActionsProps) => {
  const handleBulkDelete = () => {
    // TODO: Implement bulk delete
    console.log("Bulk delete:", selectedProducts);
    onActionComplete();
  };

  const handleBulkFeature = () => {
    // TODO: Implement bulk feature
    console.log("Bulk feature:", selectedProducts);
    onActionComplete();
  };

  const handleBulkActivate = () => {
    // TODO: Implement bulk activate
    console.log("Bulk activate:", selectedProducts);
    onActionComplete();
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedProducts.length} selected
      </span>

      <Button variant="outline" size="sm" onClick={handleBulkFeature}>
        <Icons.star className="w-4 h-4 mr-2" />
        Feature
      </Button>

      <Button variant="outline" size="sm" onClick={handleBulkActivate}>
        <Icons.eye className="w-4 h-4 mr-2" />
        Activate
      </Button>

      <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
        <Icons.trash className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};
