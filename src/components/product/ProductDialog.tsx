// ============= Product Dialog Component =============
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { ProductCustomizer } from "./ProductCustomizer";
import { useState } from "react";

interface ProductDialogProps {
  product: Product;
  trigger: React.ReactNode;
}

export function ProductDialog({ product, trigger }: ProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <ProductCustomizer 
          product={product} 
          onClose={() => setIsOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}