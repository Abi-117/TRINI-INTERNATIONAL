import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Eye, Heart, ShoppingBag, Zap } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
import { QuickViewDialog } from "@/components/product/quick-view-dialog";
import { useStore } from "@/store/store-provider";
import { discountPercent, inr } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({
  product,
  index = 0,
  view = "grid",
}: {
  product: Product;
  index?: number;
  view?: "grid" | "list";
}) {
const { addToCart, toggleWishlist, isWishlisted } = useStore();

const [quickView, setQuickView] = useState(false);

const off = discountPercent(product.price, product.mrp);

const wished = isWishlisted(product._id);

const stock = Number(product.stock ?? 0);

const inStock = stock > 0;
  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
       className={cn(
  "group relative overflow-hidden rounded-3xl glass border border-transparent transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft [background:linear-gradient(var(--card),var(--card))_padding-box,var(--gradient-brand)_border-box]",
  view === "list" && "sm:flex sm:items-stretch",
)}
      >
<Link
  to="/product/$slug"
  params={{ slug: product.slug }}
  className={cn(
    "relative block overflow-hidden bg-surface-2/40",
    view === "list"
      ? "sm:w-64 sm:shrink-0"
      : "aspect-4/5",
  )}
>
  {/* PRODUCT IMAGE ONLY */}
  <img
    src={product.images?.[0] || "/placeholder.png"}
    alt={product.name}
    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
  />

  {/* BADGES */}
  <div className="absolute left-4 top-4 z-10">
    {product.featured && (
      <span className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-accent-foreground">
        <Zap className="size-3" />
        FLASH
      </span>
    )}
  </div>

  {/* STOCK */}
  {stock <= 0 && (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
      <Badge variant="secondary">
        Out of Stock
      </Badge>
    </div>
  )}
</Link>
        <div className="pointer-events-none absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition-all duration-500 group-hover:pointer-events-auto group-hover:opacity-100">
          <Button
            variant="glass"
            size="icon"
            aria-label="Add to wishlist"
            onClick={() => toggleWishlist(product)}
          >
            <Heart className={cn("size-4", wished && "fill-accent text-accent")} />
          </Button>
          <Button variant="glass" size="icon" aria-label="Quick view" onClick={() => setQuickView(true)}>
            <Eye className="size-4" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {product.brand}
            </span>
            <StarRating
  rating={Number(product.rating ?? 0)}
  count={Number(product.reviewCount ?? 0)}
/>
          </div>

          <Link to="/product/$slug" params={{ slug: product.slug }}>
            <h3 className="line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary">
              {product.name || "Unnamed Product"}
            </h3>
          </Link>

          {view === "list" && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
          )}

          <div className="mt-auto flex items-end gap-2">
            <span className="text-xl font-bold text-gold">{inr(Number(product.price))}</span>
            <span className="pb-0.5 text-sm text-muted-foreground line-through">{inr(Number(product.mrp))}</span>
          </div>

          <div className="flex gap-2">
          <Button
  variant="glass"
  className="flex-1"
  disabled={Number(product.stock) <= 0}
  onClick={() => addToCart(product)}
>
  <ShoppingBag className="size-4" />
  Add
</Button>
            <Button
  variant="hero"
  className="flex-1"
  disabled={Number(product.stock) <= 0}
  asChild={inStock}
>
              {inStock ? (
  <Link
    to="/checkout"
    onClick={() => addToCart(product)}
  >
    Buy Now
  </Link>
) : (
  <span>Out of Stock</span>
)}
            </Button>
          </div>
        </div>
      </motion.article>

      <QuickViewDialog product={product} open={quickView} onOpenChange={setQuickView} />
    </>
  );
}
