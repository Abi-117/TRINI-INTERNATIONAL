import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { useStore } from "@/store/store-provider";

const title = "Wishlist — TRINI INTERNATIONAL";
const description = "Everything you saved for later at Trini International.";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/wishlist" }],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, hydrated } = useStore();

const { data, isLoading } = useQuery({
  queryKey: ["wishlist-products"],
  queryFn: () => productService.listProducts(),
});

const products = data?.items || [];

const items = products.filter((p: any) =>
  wishlist.includes(p._id)
);
if (isLoading) {
  return (
    <section className="container-x py-16">
      Loading...
    </section>
  );
}

  return (
    <>
      <PageHeader eyebrow="Saved" title="Your Wishlist" breadcrumb={[{ label: "Wishlist" }]} />
      <section className="container-x py-14">
        {!hydrated ? null : items.length === 0 ? (
          <div className="rounded-3xl glass p-16 text-center">
            <Heart className="mx-auto size-10 text-accent" />
            <p className="mt-4 text-lg font-semibold">Nothing saved yet</p>
            <Button variant="hero" className="mt-6" asChild>
              <Link to="/shop">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p: any, i: number) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
