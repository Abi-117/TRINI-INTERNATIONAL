import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section";
import { ProductCard } from "@/components/product/product-card";

const API = "http://localhost:5000/api";

interface Product {
  _id: string;
  name: string;
  category:
    | string
    | {
        _id: string;
        name: string;
        slug: string;
      };

  brand?: string;

  price: number;
  mrp?: number;
  originalPrice?: number;

  stock: number;

  images?: string[];

  rating?: number;
  reviewCount?: number;

  description?: string;

  colors?: string[];
  highlights?: string[];
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);

      console.log("HOME PRODUCTS:", res.data);

      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-y">
      <div className="container-x">

        {/* Heading */}
        <SectionHeading
          eyebrow="Our Products"
          title={
            <>
              Explore our{" "}
              <span className="text-gold">
                premium products
              </span>
            </>
          }
          subtitle="Discover our latest products available at Trini International."
          align="left"
          action={
            <Button variant="glass" asChild>
              <Link to="/shop">
                Shop all products
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          }
        />

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[420px] animate-pulse rounded-3xl bg-muted"
              />
            ))}
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {products.slice(0, 8).map((product, i) => (
              <ProductCard
                key={product._id}
                product={product as any}
                index={i}
              />
            ))}

          </div>
        )}

        {/* No Products */}
        {!loading && products.length === 0 && (
          <div className="rounded-3xl border p-10 text-center">
            <p className="text-muted-foreground">
              No products available.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}