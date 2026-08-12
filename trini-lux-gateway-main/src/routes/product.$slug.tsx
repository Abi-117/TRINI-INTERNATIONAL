import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Heart,
  Minus,
  Plus,
  RefreshCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import {
    User,
    BadgeCheck,
    Star
} from "lucide-react";


import { PageHeader } from "@/components/shared/page-header";
import { ProductCard } from "@/components/product/product-card";
import { StarRating } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { catalogService } from "@/services/catalog.service";
import { reviewService } from "@/services/review.service";
import {
  deliveryEstimate,
  discountPercent,
  formatDate,
  inr,
} from "@/lib/format";

import { useStore } from "@/store/store-provider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: () => ({
    title: "Product",
    description: "",
  }),

  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData.title} | TRINI INTERNATIONAL`,
      },
      {
        name: "description",
        content: loaderData.description,
      },
    ],
  }),

  notFoundComponent: () => (
    <div className="container-x py-24 text-center">
      <h1 className="text-3xl font-bold">
        Product Not Found
      </h1>

      <Button
        className="mt-6"
        variant="hero"
        asChild
      >
        <Link to="/shop">
          Back to Shop
        </Link>
      </Button>
    </div>
  ),

  component: ProductPage,
});



function ProductPage() {
  const { slug } = Route.useParams();

 const {
  addToCart,
  toggleWishlist,
  isWishlisted,
  pushRecentlyViewed,
  recentlyViewed,
  user,
} = useStore();
const navigate = useNavigate();

  const {
  data: reviewData,
  isLoading: reviewLoading,
  refetch: refetchReviews,
} = useQuery({
  queryKey: ["reviews", slug],
  queryFn: () => reviewService.getReviews(slug),
});


const reviews = reviewData?.reviews || [];
  const averageRating =
  reviews.length > 0
    ? (
        reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / reviews.length
      ).toFixed(1)
    : "0.0";

  const ratingSummary = {
  5: 0,
  4: 0,
  3: 0,
  2: 0,
  1: 0,
};



reviews.forEach((review) => {
  const rate = Math.round(review.rating);

  if (ratingSummary[rate] !== undefined) {
    ratingSummary[rate]++;
  }
});


  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);

  const [color, setColor] = useState("");
  const [size, setSize] = useState("");

  const [reviewName, setReviewName] = useState("");

const [reviewTitle, setReviewTitle] = useState("");

const [reviewMessage, setReviewMessage] = useState("");

const [reviewRating, setReviewRating] = useState(5);

const [submitting, setSubmitting] = useState(false);

  //------------------------------------------------
  // PRODUCT
  //------------------------------------------------


  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () =>
      catalogService.getProduct(slug),
  });

  const submitReview = async () => {
  if (!user) {
    toast.error("Please login");
    return;
  }

  try {
    setSubmitting(true);

    await reviewService.addReview({
      productId: product._id,
      userName: reviewName,
      email: user.email,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewMessage,
    });

    toast.success("Review submitted");

    setReviewName("");
    setReviewTitle("");
    setReviewMessage("");
    setReviewRating(5);

    refetchReviews();
  } catch (err: any) {
    toast.error(
      err?.response?.data?.message ||
      "Failed to submit review"
    );
  } finally {
    setSubmitting(false);
  }
};

  //------------------------------------------------
  // RELATED PRODUCTS
  //------------------------------------------------

  const { data: related = [] } = useQuery({
    queryKey: ["related", slug],
    enabled: !!product,
    queryFn: () =>
      catalogService.getRelated(slug, 4),
  });

  //------------------------------------------------
  // RECENTLY VIEWED
  //------------------------------------------------

  useEffect(() => {
    if (product) {
      pushRecentlyViewed(product.slug);
    }
  }, [product, pushRecentlyViewed]);

  //------------------------------------------------
  // LOADING
  //------------------------------------------------

  if (isLoading) {
    return (
      <div className="container-x py-24 text-center">
        Loading Product...
      </div>
    );
  }

  //------------------------------------------------
  // ERROR
  //------------------------------------------------

  if (isError || !product) {
    return <Route.options.notFoundComponent />;
  }

  const mediaItems = [
  ...(product.video
    ? [
        {
          type: "video" as const,
          src: product.video,
        },
      ]
    : []),

  ...(product.images || []).map((src: string) => ({
    type: "image" as const,
    src,
  })),
];

  //------------------------------------------------
  // PRICE
  //------------------------------------------------

  const off = discountPercent(
    product.price,
    product.mrp
  );

  //------------------------------------------------
  // RECENT PRODUCTS
  //------------------------------------------------

 const recentSlugs = recentlyViewed
  .filter((item) => item !== slug)
  .slice(0, 4);

const { data: recentProducts = [] } = useQuery({
  queryKey: ["recently-viewed", recentSlugs],
  enabled: recentSlugs.length > 0,
  queryFn: async () => {
    const products = await Promise.all(
      recentSlugs.map(async (recentSlug) => {
        try {
          return await catalogService.getProduct(recentSlug);
        } catch {
          return null;
        }
      })
    );

    return products.filter(Boolean);
  },
});
  //------------------------------------------------
  // SHARE
  //------------------------------------------------

  const share = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Product link copied");
    }
  };

  //------------------------------------------------
  // SELECTED VARIANT
  //------------------------------------------------

  const variantLabel =
    [color, size]
      .filter(Boolean)
      .join(" / ") || undefined;
        return (
    <>
      <PageHeader
        eyebrow={product.category?.name || "Category"}
        title={product.name}
        breadcrumb={[
          {
            label: "Shop",
            to: "/shop",
          },
          {
            label: product.name,
          },
        ]}
      />

      <section className="container-x grid gap-12 py-14 lg:grid-cols-2">

{/* ---------------- Product Media ---------------- */}

<div>

  {/* MAIN MEDIA */}
  <div className="group relative aspect-square overflow-hidden rounded-[2rem] border bg-white">

    {mediaItems.length > 0 ? (
      mediaItems[active]?.type === "video" ? (
        <video
          key={mediaItems[active].src}
          src={mediaItems[active].src}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
        />
      ) : (
        <img
          src={mediaItems[active].src}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )
    ) : (
      <img
        src="/placeholder.png"
        alt={product.name}
        className="h-full w-full object-cover"
      />
    )}

    {/* DISCOUNT */}
    {off > 0 && (
      <span className="absolute left-5 top-5 z-10 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">
        {off}% OFF
      </span>
    )}

  </div>


  {/* THUMBNAILS */}
  <div className="mt-4 flex flex-wrap gap-3">

    {mediaItems.map((media, index) => (
      <button
        key={`${media.type}-${index}`}
        type="button"
        onClick={() => setActive(index)}
        className={cn(
          "relative h-20 w-20 overflow-hidden rounded-xl border-2 bg-white",
          active === index
            ? "border-primary"
            : "border-gray-300"
        )}
      >

        {media.type === "video" ? (
          <>
            <video
              src={media.src}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />

            {/* VIDEO LABEL */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black">
                ▶
              </div>
            </div>
          </>
        ) : (
          <img
            src={media.src}
            alt=""
            className="h-full w-full object-cover"
          />
        )}

      </button>
    ))}

  </div>

</div>
        {/* ---------------- Details ---------------- */}

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {product.brand}
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            {product.name}
          </h1>

          <div className="mt-4">
            <StarRating
  rating={Number(averageRating)}
  count={reviews.length}
/>
<div className="mt-2 flex items-center gap-2 text-sm">
  <span className="font-semibold">
    {averageRating} ★
  </span>
  

  <span className="text-muted-foreground">
    ({reviews.length} Reviews)
  </span>
</div>
<div className="mt-3">

{product.stock > 0 ? (

<span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">

In Stock ({product.stock})

</span>

) : (

<span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-600">

Out of Stock

</span>

)}

</div>
          </div>

          <div className="mt-6 flex items-end gap-3">

            <span className="text-4xl font-bold text-primary">
              {inr(product.price)}
            </span>

            <span className="text-lg text-gray-400 line-through">
              {inr(product.mrp)}
            </span>

            {off > 0 && (
              <span className="text-sm font-semibold text-green-600">
                Save {off}%
              </span>
            )}

          </div>
          

          <p className="mt-2 text-sm text-gray-500">
            Inclusive of all taxes
          </p>

          <p className="mt-6 leading-7 text-muted-foreground">
            {product.description}
          </p>

          {/* ---------------- Colors ---------------- */}

          {product.colors?.length > 0 && (

            <div className="mt-8">

              <h4 className="mb-3 text-sm font-semibold">
                Colours
              </h4>

              <div className="flex flex-wrap gap-2">

                {product.colors.map(
                  (item: string) => (

                    <button
                      key={item}
                      onClick={() =>
                        setColor(item)
                      }
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition",
                        color === item
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300"
                      )}
                    >
                      {item}
                    </button>

                  )
                )}

              </div>

            </div>

          )}

          {/* ---------------- Sizes ---------------- */}

          {product.sizes?.length > 0 && (

            <div className="mt-8">

              <h4 className="mb-3 text-sm font-semibold">
                Sizes
              </h4>

              <div className="flex flex-wrap gap-2">

                {product.sizes.map(
                  (
                    item: {
                      value: string;
                      priceDelta?: number;
                    }
                  ) => (

                    <button
                      key={item.value}
                      onClick={() =>
                        setSize(item.value)
                      }
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition",
                        size === item.value
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300"
                      )}
                    >
                      {item.value}
                    </button>

                  )
                )}

              </div>

            </div>

          )}

          {/* ---------------- Quantity ---------------- */}

          <div className="mt-8 flex flex-wrap items-center gap-4">

            <div className="flex items-center rounded-full border">

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  setQty((q) =>
                    Math.max(1, q - 1)
                  )
                }
              >
                <Minus className="h-4 w-4" />
              </Button>

              <span className="w-10 text-center font-semibold">
                {qty}
              </span>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  setQty((q) =>
                    Math.min(
product.stock || 1,
q + 1
)
                  )
                }
              >
                <Plus className="h-4 w-4" />
              </Button>

            </div>

            <Button
variant="glass"
disabled={product.stock <= 0}
              size="lg"
              onClick={() =>
                addToCart(
                  product,
                  qty,
                  variantLabel
                )
              }
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Bag
            </Button>

            {product.stock > 0 ? (
  <Button
  variant="hero"
  onClick={() => {
    if (!user) {
      toast.error("Please login to continue");
      navigate({
        to: "/auth/login",
        search: {
          redirect: "/checkout",
        },
      });
      return;
    }

    addToCart(product, qty, variantLabel);

    navigate({
      to: "/checkout",
    });
  }}
>
  Buy Now
</Button>
) : (
  <Button variant="hero" disabled>
    Out of Stock
  </Button>
)}

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                toggleWishlist(product)
              }
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isWishlisted(product.slug) &&
                    "fill-red-500 text-red-500"
                )}
              />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={share}
            >
              <Share2 className="h-4 w-4" />
            </Button>

          </div>

          {/* ---------------- Features ---------------- */}

          {/* <div className="mt-10 grid gap-3 sm:grid-cols-3">

            {[
              {
                icon: Truck,
                label: `Delivery by ${deliveryEstimate(
                  4
                )}`,
              },
              {
                icon: ShieldCheck,
                label: "100% Genuine",
              },
              {
                icon: RefreshCcw,
                label: "Easy Return",
              },
            ].map((item) => (

              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border p-4"
              >
                <item.icon className="h-5 w-5 text-primary" />

                <span className="text-sm">
                  {item.label}
                </span>
              </div>

            ))}

          </div> */}

        </div>

      </section>
            {/* ====================== TABS ====================== */}

      <section className="container-x pb-16">

        <Tabs defaultValue="specs">

          <TabsList className="rounded-full bg-surface/70 p-1">

            <TabsTrigger value="specs">
              Specifications
            </TabsTrigger>

            <TabsTrigger value="highlights">
              Highlights
            </TabsTrigger>

            <TabsTrigger value="reviews">
              Reviews
            </TabsTrigger>

          </TabsList>

          {/* ================= Specifications ================= */}

          <TabsContent
            value="specs"
            className="mt-6 rounded-3xl glass p-7"
          >

            <dl className="grid gap-4 sm:grid-cols-2">

              {product.specifications?.length ? (

                product.specifications.map(
                  (
                    item: {
                      key: string;
                      value: string;
                    },
                    index: number
                  ) => (

                    <div
                      key={index}
                      className="flex justify-between border-b pb-3"
                    >
                      <dt className="text-muted-foreground">
                        {item.key}
                      </dt>

                      <dd className="font-medium">
                        {item.value}
                      </dd>

                    </div>

                  )
                )

              ) : (

                <p>No specifications available.</p>

              )}

            </dl>

          </TabsContent>

          {/* ================= Highlights ================= */}

          <TabsContent
            value="highlights"
            className="mt-6 rounded-3xl glass p-7"
          >

            {product.highlights?.length ? (

              <ul className="space-y-3">

                {product.highlights.map(
                  (
                    item: string,
                    index: number
                  ) => (

                    <li
                      key={index}
                      className="flex gap-3"
                    >

                      <ShieldCheck className="h-4 w-4 text-primary mt-1" />

                      <span>{item}</span>

                    </li>

                  )
                )}

              </ul>

            ) : (

              <p>No highlights available.</p>

            )}

          </TabsContent>

          {/* ================= Reviews ================= */}
            
          <TabsContent
            value="reviews"
            className="mt-6"
          >
              {user ? (

<div className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">

  <h3 className="mb-5 text-xl font-bold">
    Write a Review
  </h3>

  <div className="grid gap-4">

    <input
      value={reviewName}
      onChange={(e)=>setReviewName(e.target.value)}
      placeholder="Your Name"
      className="rounded-xl border p-3 outline-none focus:border-primary"
    />

    <input
      value={reviewTitle}
      onChange={(e)=>setReviewTitle(e.target.value)}
      placeholder="Review Title"
      className="rounded-xl border p-3 outline-none focus:border-primary"
    />

    <textarea
      rows={5}
      value={reviewMessage}
      onChange={(e)=>setReviewMessage(e.target.value)}
      placeholder="Write your review..."
      className="rounded-xl border p-3 outline-none focus:border-primary"
    />
    <div>

  <p className="mb-6 font-medium">

    Your Rating

  </p>

  <div className="flex gap-2">

    {[1,2,3,4,5].map((star)=>(

      <button
        key={star}
        type="button"
        onClick={()=>setReviewRating(star)}
        className={`rounded-full border px-4 py-2 transition ${
          reviewRating===star
            ? "bg-yellow-500 text-white"
            : "bg-white"
        }`}
      >
        {star} ★
      </button>

    ))}

  </div>
  

</div>
<Button
disabled={submitting || !user}
className="mt-5"
onClick={submitReview}
>

  {submitting
    ? "Submitting..."
    : "Submit Review"}

</Button>

  </div>
  

</div>


           ) : (

<div className="rounded-3xl border p-8 text-center">

<h3 className="text-lg font-semibold">
Please Login
</h3>

<p className="mt-2 text-muted-foreground">
You must login to write a review.
</p>

<Button className="mt-5" asChild>

<Link to="/auth/login">
Login
</Link>

</Button>

</div>

)}

          </TabsContent>

        </Tabs>

      </section>
      <div className="mt-10 p-6">
 <div className="mb-10 rounded-3xl border bg-white p-8 shadow-sm">

  <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

    <div>

      <h2 className="text-4xl font-bold">
        {averageRating}
      </h2>

      <StarRating
        rating={Number(averageRating)}
        count={reviews.length}
      />

      <p className="mt-2 text-gray-500">
        Based on {reviews.length} customer reviews
      </p>

    </div>

    <div className="w-full max-w-md space-y-3">

      {[5,4,3,2,1].map((star)=>{

        const count = ratingSummary[star];

        const percent =
          reviews.length === 0
            ? 0
            : (count/reviews.length)*100;

        return(

          <div
            key={star}
            className="flex items-center gap-3"
          >

            <span className="w-8 text-sm">
              {star}★
            </span>

            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">

              <div
                className="h-full rounded-full bg-yellow-400"
                style={{
                  width:`${percent}%`
                }}
              />

            </div>

            <span className="w-6 text-right text-sm">
              {count}
            </span>

          </div>

        )

      })}

    </div>

  </div>

</div>

  {reviewLoading ? (
    <p>Loading...</p>
  ) : reviews.length === 0 ? (
    <p>No reviews yet.</p>
  ) : (
    <div className="space-y-6">
      {reviews.map((review: any) => (
        <div
key={review._id}
className="rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-lg"
>

<div className="flex items-start justify-between">

<div className="flex gap-4">

<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">

{review.userName.charAt(0).toUpperCase()}

</div>

<div>

<h3 className="font-semibold">

{review.userName}

</h3>

<div className="flex items-center gap-3">

<StarRating
rating={review.rating}
count={0}
/>

<span className="text-sm text-gray-500">

{formatDate(review.createdAt)}

</span>

</div>

</div>

</div>

{review.verifiedPurchase && (

<span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">

✓ Verified Purchase

</span>

)}

</div>

{review.title && (

<h4 className="mt-5 text-lg font-semibold">

{review.title}

</h4>

)}

<p className="mt-3 leading-7 text-gray-600">

{review.comment}

</p>

{/* <div className="mt-6 flex items-center gap-4">

<Button
variant="outline"
size="sm"
onClick={async()=>{

await reviewService.likeReview(review._id);

refetchReviews();

}}
>

👍 Helpful ({review.helpful})

</Button>

</div> */}

</div>
      ))}
    </div>
  )}
</div>

      {/* ================= Related Products ================= */}

      {related.length > 0 && (

        <section className="container-x pb-20">

          <h2 className="mb-8 text-2xl font-bold">
            Related Products
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {related.map(
              (
                item: any,
                index: number
              ) => (

                <ProductCard
key={item._id || item.id || item.slug}
                  product={item}
                  index={index}
                />

              )
            )}

          </div>

        </section>

      )}

      {/* ================= Recently Viewed ================= */}

     {recentProducts.length > 0 && (
  <section className="container-x pb-24">
    <h2 className="mb-8 text-2xl font-bold">
      Recently Viewed
    </h2>

    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {recentProducts.map(
        (item: any, index: number) => (
          <ProductCard
            key={item._id || item.slug || index}
            product={item}
            index={index}
          />
        )
      )}
    </div>
  </section>
)}

    </>
  );
}