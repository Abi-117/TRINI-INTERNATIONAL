import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BadgeCheck,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Reveal,
  SectionHeading,
} from "@/components/shared/section";
import { StarRating } from "@/components/shared/star-rating";
import {
  instagramGallery,
  testimonials,
} from "@/data/catalog";
import { cn } from "@/lib/utils";

/* =========================================================
   API
========================================================= */

const API = "http://localhost:5000/api";

/* =========================================================
   TYPES
========================================================= */

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}

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

  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  trending?: boolean;

  description?: string;

  colors?: string[];
  highlights?: string[];
}

/* =========================================================
   SHOP BY CATEGORY
========================================================= */

export function CategoriesSection() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${API}/categories`
      );

      console.log(
        "HOME CATEGORIES:",
        res.data
      );

      setCategories(
        res.data.categories || []
      );
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-y">
      <div className="container-x">

        <SectionHeading
          eyebrow="Shop by category"
          title={
            <>
              Curated aisles,{" "}
              <span className="text-gold">
                premium picks
              </span>
            </>
          }
          subtitle="Explore our premium imported product categories."
        />

        {/* Loading */}

        {loading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map(
              (item) => (
                <div
                  key={item}
                  className="aspect-3/4 animate-pulse rounded-3xl bg-muted"
                />
              )
            )}
          </div>
        )}

        {/* Categories */}

        {!loading &&
          categories.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">

              {categories.map(
                (cat, i) => (
                  <motion.div
                    key={cat._id}
                    initial={{
                      opacity: 0,
                      y: 26,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      margin: "-60px",
                    }}
                    transition={{
                      duration: 0.55,
                      delay:
                        (i % 5) * 0.07,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                  >
                    <Link
                      to="/shop"
                      search={{
                        category:
                          cat.slug,
                      }}
                      className="group relative block aspect-3/4 overflow-hidden rounded-3xl hairline"
                    >

                      {/* Image */}

                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <span className="text-sm text-muted-foreground">
                            {cat.name}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/30" />

                      <div className="absolute inset-x-0 bottom-0 p-4">

                        <p className="font-display text-sm font-semibold leading-tight md:text-base">
                          {cat.name}
                        </p>

                        <p className="mt-1 text-[11px] text-white/70">
                          {cat.productCount ??
                            0}{" "}
                          products
                        </p>

                        <span className="mt-3 inline-flex translate-y-2 items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-primary opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                          Explore
                          <ArrowUpRight className="size-3" />
                        </span>

                      </div>

                    </Link>
                  </motion.div>
                )
              )}

            </div>
          )}

        {/* No categories */}

        {!loading &&
          categories.length === 0 && (
            <div className="rounded-2xl border p-10 text-center">
              <p className="text-muted-foreground">
                No categories available.
              </p>
            </div>
          )}

      </div>
    </section>
  );
}

/* =========================================================
   OFFERS & HIGHLIGHTS
========================================================= */

/* =========================================================
   PRODUCTS / OFFERS & HIGHLIGHTS
   ACTUAL PRODUCT DATA
========================================================= */

export function OffersHighlightsSection() {
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

        <SectionHeading
          eyebrow="Our Products"
          title={
            <>
              Explore our{" "}
              <span className="text-gradient-brand">
                premium products
              </span>
            </>
          }
          subtitle="Discover products available at Trini International."
        />

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-3xl bg-muted"
              />
            ))}
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {products.slice(0, 8).map((product) => {
              const mrp =
                product.mrp ??
                product.originalPrice ??
                product.price;

              const discount =
                mrp > product.price
                  ? Math.round(
                      ((mrp - product.price) / mrp) * 100
                    )
                  : 0;

              return (
                <Link
                  key={product._id}
                  to="/product/$id"
                  params={{
                    id: product._id,
                  }}
                  className="
                    group overflow-hidden rounded-3xl
                    border bg-card
                    transition-all duration-500
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">

                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        className="
                          h-full w-full object-cover
                          transition-transform duration-700
                          group-hover:scale-110
                        "
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No Image
                      </div>
                    )}

                    {/* Only show actual discount */}
                    {discount > 0 && (
                      <span className="
                        absolute left-3 top-3
                        rounded-full
                        bg-red-500
                        px-3 py-1
                        text-xs font-bold text-white
                      ">
                        {discount}% OFF
                      </span>
                    )}

                  </div>

                  {/* Product Details */}
                  <div className="p-5">

                    {/* Category */}
                    {product.category &&
                      typeof product.category === "object" && (
                        <p className="
                          text-xs uppercase
                          tracking-wider
                          text-muted-foreground
                        ">
                          {product.category.name}
                        </p>
                      )}

                    {/* Product Name */}
                    <h3 className="
                      mt-2
                      line-clamp-2
                      font-semibold
                    ">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    {product.rating !== undefined && (
                      <div className="mt-2 flex items-center gap-2">

                        <StarRating
                          rating={product.rating}
                          size="sm"
                        />

                        <span className="text-xs text-muted-foreground">
                          ({product.reviewCount ?? 0})
                        </span>

                      </div>
                    )}

                    {/* Price */}
                    <div className="mt-3 flex items-center gap-2">

                      <span className="text-lg font-bold">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>

                      {mrp > product.price && (
                        <span className="
                          text-sm
                          text-muted-foreground
                          line-through
                        ">
                          ₹{mrp.toLocaleString("en-IN")}
                        </span>
                      )}

                    </div>

                  </div>
                </Link>
              );
            })}

          </div>
        )}

        {/* No Products */}
        {!loading && products.length === 0 && (
          <div className="rounded-2xl border p-10 text-center">
            <p className="text-muted-foreground">
              No products available.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

/* =========================================================
   WHY CHOOSE US
========================================================= */

const perks = [
  {
    icon: Truck,
    title: "Delivery Across India",
    text: "Trusted courier partners to every pincode.",
  },
  {
    icon: BadgeCheck,
    title: "Premium Imported",
    text: "Hand-picked global product lines.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    text: "Razorpay UPI, cards and netbanking.",
  },
  {
    icon: Headphones,
    title: "Fast Support",
    text: "Call and WhatsApp support, 7 days a week.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-y relative overflow-hidden">

      <div className="absolute left-1/2 top-0 size-[40rem] -translate-x-1/2 rounded-full bg-cyan/8 blur-[160px]" />

      <div className="container-x relative">

        <SectionHeading
          eyebrow="Why Trini"
          title={
            <>
              Built on trust,{" "}
              <span className="text-gradient-brand">
                shipped with care
              </span>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {perks.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i}
            >
              <div
                className="
                  group relative h-full rounded-3xl
                  bg-gradient-brand p-[1px]
                  transition-all duration-500
                  hover:-translate-y-2 hover:shadow-gold
                "
              >
                <div className="glass h-full rounded-[calc(theme(borderRadius.3xl)-1px)] p-7">

                  <span className="grid size-14 place-items-center rounded-2xl bg-gradient-brand/15 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <p.icon className="size-6" />
                  </span>

                  <h3 className="mt-5 text-lg font-semibold">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.text}
                  </p>

                </div>
              </div>
            </Reveal>
          ))}

        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FEATURED COLLECTIONS
   ACTUAL CATEGORY DATA
========================================================= */

export function CollectionsSection() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${API}/categories`
      );

      setCategories(
        res.data.categories || []
      );
    } catch (error) {
      console.error(
        "Failed to load collections:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Instead of dummy `collections`,
   * we use actual categories.
   */

  return (
    <section className="section-y">

      <div className="container-x">

        <SectionHeading
          eyebrow="Featured collections"
          title={
            <>
              Explore our{" "}
              <span className="text-gradient-gold">
                premium collections
              </span>
            </>
          }
          align="left"
          action={
            <Button
              variant="glass"
              asChild
            >
              <Link to="/shop">
                View all
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          }
        />

        {loading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="aspect-4/3 animate-pulse rounded-3xl bg-muted"
                />
              )
            )}
          </div>
        )}

        {!loading &&
          categories.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {categories
                .slice(0, 6)
                .map((category, i) => (

                  <motion.div
                    key={category._id}
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      margin: "-60px",
                    }}
                    transition={{
                      duration: 0.6,
                      delay:
                        (i % 3) * 0.08,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                  >

                    <Link
                      to="/shop"
                      search={{
                        category:
                          category.slug,
                      }}
                      className="group relative block aspect-4/3 overflow-hidden rounded-3xl hairline"
                    >

                      {/* Category image */}

                      {category.image ? (
                        <img
                          src={
                            category.image
                          }
                          alt={
                            category.name
                          }
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                          <span>
                            {
                              category.name
                            }
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-6">

                        <h3 className="font-display text-xl font-bold text-white">
                          {
                            category.name
                          }
                        </h3>

                        <p className="mt-1 text-sm text-white/70">
                          Explore premium{" "}
                          {
                            category.name
                          }{" "}
                          products
                        </p>

                        <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                          Shop collection
                          <ArrowUpRight className="size-3.5" />
                        </span>

                      </div>

                    </Link>

                  </motion.div>

                ))}

            </div>
          )}

        {!loading &&
          categories.length === 0 && (
            <div className="rounded-2xl border p-10 text-center">
              <p className="text-muted-foreground">
                No collections available.
              </p>
            </div>
          )}

      </div>

    </section>
  );
}

/* =========================================================
   TESTIMONIALS
========================================================= */

export function TestimonialsSection() {
  return (
    <section className="section-y">

      <div className="container-x">

        <SectionHeading
          eyebrow="Customer stories"
          title={
            <>
              Loved across{" "}
              <span className="text-gradient-brand">
                India
              </span>
            </>
          }
          subtitle="Customer experiences from Trini International."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {testimonials.map(
            (t, i) => (
              <Reveal
                key={t.name}
                delay={i}
              >
                <figure
                  className="
                    relative h-full rounded-3xl p-[1px]
                    bg-gradient-to-r from-cyan via-pink-500 to-yellow-400
                    transition-all duration-500
                    hover:-translate-y-1.5 hover:shadow-soft
                  "
                >

                  <div className="glass h-full rounded-[calc(theme(borderRadius.3xl)-1px)] p-7">

                    <StarRating
                      rating={t.rating}
                      size="md"
                    />

                    <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      “{t.text}”
                    </blockquote>

                    <figcaption className="mt-6 flex items-center gap-3">

                      <span className="grid size-11 place-items-center rounded-full bg-gradient-gold font-display text-sm font-bold text-primary-foreground">
                        {t.name.charAt(0)}
                      </span>

                      <span>
                        <span className="block text-sm font-semibold">
                          {t.name}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {t.city}
                        </span>
                      </span>

                    </figcaption>

                  </div>

                </figure>
              </Reveal>
            )
          )}

        </div>

      </div>

    </section>
  );
}

/* =========================================================
   INSTAGRAM
========================================================= */

export function InstagramSection() {
  return (
    <section className="section-y">

      <div className="container-x">

        <SectionHeading
          eyebrow="@triniinternational"
          title={
            <>
              Straight from the{" "}
              <span className="text-gold">
                shop floor
              </span>
            </>
          }
        />

        <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">

          {instagramGallery.map(
            (src, i) => (
              <motion.a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                initial={{
                  opacity: 0,
                  scale: 0.94,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  margin: "-50px",
                }}
                transition={{
                  duration: 0.5,
                  delay:
                    (i % 4) * 0.07,
                }}
                className="group relative block break-inside-avoid overflow-hidden rounded-3xl hairline"
              >

                <img
                  src={src}
                  alt="Trini International product post"
                  loading="lazy"
                  className={cn(
                    "w-full object-cover transition-transform duration-700 group-hover:scale-110",
                    i % 3 === 0
                      ? "aspect-3/4"
                      : i % 3 === 1
                        ? "aspect-square"
                        : "aspect-4/5"
                  )}
                />

                <div className="absolute inset-0 grid place-items-center bg-background/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">

                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    View post
                  </span>

                </div>

              </motion.a>
            )
          )}

        </div>

      </div>

    </section>
  );
}