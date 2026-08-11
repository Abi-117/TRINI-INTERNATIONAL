import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StarRating } from "@/components/shared/star-rating";
import { useStore } from "@/store/store-provider";
import { discountPercent, inr } from "@/lib/format";
import type { Product } from "@/types";

export function QuickViewDialog({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { addToCart, toggleWishlist } = useStore();
  const off = discountPercent(product.price, product.mrp);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden rounded-3xl border-border bg-surface p-0">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="relative aspect-square bg-surface-2/50">
            <img
  src={product.images?.[0] || "/placeholder.png"}
  alt={product.name}
  loading="lazy"
  className="h-full w-full object-cover"
/>
            {off > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-gradient-gold px-3 py-1 text-xs font-bold text-primary-foreground">
                {off}% OFF
              </span>
            )}
          </div>
          <div className="flex flex-col gap-4 p-6">
            <DialogHeader className="space-y-2 text-left">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                {product.brand}
              </span>
              <DialogTitle className="text-xl leading-snug">{product.name}</DialogTitle>
            </DialogHeader>
            <StarRating
  rating={product.rating || 0}
  count={product.reviewCount || 0}
  size="md"
/>
            <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <div className="flex items-end gap-3">
              <span className="text-2xl font-bold text-gold">{inr(product.price)}</span>
              <span className="pb-1 text-sm text-muted-foreground line-through">{inr(product.mrp)}</span>
            </div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {product.highlights?.slice(0, 3).map((h) => (
  <li key={h}>• {h}</li>
))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-2">
              <Button variant="hero" className="flex-1" onClick={() => addToCart(product)}>
                <ShoppingBag className="size-4" /> Add to bag
              </Button>
              <Button variant="glass" size="icon" onClick={() => toggleWishlist(product)} aria-label="Wishlist">
                <Heart className="size-4" />
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/product/$slug" params={{ slug: product.slug }} onClick={() => onOpenChange(false)}>
                  View full details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
