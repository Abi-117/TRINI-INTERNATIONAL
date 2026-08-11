
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/store-provider";

import {
  calculateTotals,
  commerceService,
} from "@/services/commerce.service";

import { inr } from "@/lib/format";
import type { Coupon } from "@/types";

const title = "Your Bag — TRINI INTERNATIONAL";

const description =
  "Review your premium picks, apply coupons and checkout securely.";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title },
      {
        name: "description",
        content: description,
      },
      {
        property: "og:title",
        content: title,
      },
      {
        property: "og:description",
        content: description,
      },
    ],

    links: [
      {
        rel: "canonical",
        href: "/cart",
      },
    ],
  }),

  component: CartPage,
});

function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    hydrated,
  } = useStore();

  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [applying, setApplying] = useState(false);

  // ==================================================
  // CALCULATE TOTALS
  // ==================================================

  const totals = calculateTotals(cart, coupon);

  // ==================================================
  // APPLY COUPON
  // ==================================================

  const apply = async () => {
    const couponCode = code.trim().toUpperCase();

    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your bag is empty");
      return;
    }

    try {
      setApplying(true);

      const res =
        await commerceService.validateCoupon(
          couponCode,
          totals.subtotal
        );

      if (res.valid && res.coupon) {
        setCoupon(res.coupon);

        setCode(res.coupon.code);

        toast.success(
          res.message ||
            `${res.coupon.code} applied successfully`
        );
      } else {
        setCoupon(null);

        toast.error(
          res.message || "Invalid coupon code"
        );
      }
    } catch (error) {
      console.error(
        "APPLY COUPON ERROR:",
        error
      );

      toast.error(
        "Unable to apply coupon. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  // ==================================================
  // REMOVE COUPON
  // ==================================================

  const removeCoupon = () => {
    setCoupon(null);
    setCode("");

    toast.success("Coupon removed");
  };

  // ==================================================
  // EMPTY CART
  // ==================================================

  const isEmpty =
    hydrated && cart.length === 0;

  return (
    <>
      <PageHeader
        eyebrow="Cart"
        title="Your Bag"
        breadcrumb={[
          {
            label: "Cart",
          },
        ]}
      />

      <section className="container-x grid gap-8 py-14 lg:grid-cols-[1.6fr_1fr]">

        {/* ==================================================
            CART ITEMS
        ================================================== */}

        <div className="space-y-4">
          {!hydrated ? (
            <div className="rounded-3xl glass p-16 text-center">
              <p className="text-sm text-muted-foreground">
                Loading your bag...
              </p>
            </div>
          ) : isEmpty ? (
            <div className="rounded-3xl glass p-16 text-center">

              <ShoppingBag className="mx-auto size-10 text-primary" />

              <p className="mt-4 text-lg font-semibold">
                Your bag is empty
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Explore our premium imported range.
              </p>

              <Button
                variant="hero"
                className="mt-6"
                asChild
              >
                <Link to="/shop">
                  Start shopping
                </Link>
              </Button>

            </div>
          ) : (
            cart.map((item) => (
              <div
                key={
                  item.productId +
                  (item.variant ?? "")
                }
                className="flex gap-4 rounded-3xl glass p-4"
              >

                {/* PRODUCT IMAGE */}

                <Link
                  to="/product/$slug"
                  params={{
                    slug: item.slug,
                  }}
                  className="shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="size-28 rounded-2xl object-cover"
                  />
                </Link>

                {/* PRODUCT DETAILS */}

                <div className="flex flex-1 flex-col">

                  <Link
                    to="/product/$slug"
                    params={{
                      slug: item.slug,
                    }}
                    className="text-sm font-semibold hover:text-primary"
                  >
                    {item.title}
                  </Link>

                  {item.variant && (
                    <p className="text-xs text-muted-foreground">
                      {item.variant}
                    </p>
                  )}

                  <p className="mt-1 text-lg font-bold text-gold">
                    {inr(item.price)}
                  </p>

                  {/* QUANTITY */}

                  <div className="mt-auto flex items-center justify-between">

                    <div className="flex items-center gap-1 rounded-full border border-border p-1">

                      {/* DECREASE */}

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        disabled={
                          item.quantity <= 1
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3.5" />
                      </Button>

                      {/* QUANTITY */}

                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>

                      {/* INCREASE */}

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3.5" />
                      </Button>

                    </div>

                    {/* REMOVE */}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeFromCart(
                          item.productId
                        )
                      }
                      aria-label="Remove product"
                    >
                      <Trash2 className="size-4" />
                    </Button>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ==================================================
            ORDER SUMMARY
        ================================================== */}

        <aside className="h-fit space-y-4 rounded-3xl glass p-7 lg:sticky lg:top-28">

          <h2 className="text-lg font-bold">
            Order summary
          </h2>

          {/* ==================================================
              COUPON
          ================================================== */}

          {!coupon ? (
            <div className="space-y-2">

              <div className="flex gap-2">

                <Input
                  value={code}
                  onChange={(e) =>
                    setCode(
                      e.target.value.toUpperCase()
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !applying
                    ) {
                      apply();
                    }
                  }}
                  placeholder="Coupon code"
                  className="h-11 rounded-full border-border bg-surface/60 uppercase"
                  disabled={
                    cart.length === 0 ||
                    applying
                  }
                />

                <Button
                  variant="glass"
                  onClick={apply}
                  disabled={
                    cart.length === 0 ||
                    applying
                  }
                >
                  <Tag className="size-4" />

                  {applying
                    ? "Applying..."
                    : "Apply"}
                </Button>

              </div>

              <p className="text-xs text-muted-foreground">
                Enter a valid coupon code to
                receive your discount.
              </p>

            </div>
          ) : (
            /* ==================================================
               APPLIED COUPON
            ================================================== */

            <div className="rounded-2xl border border-success/30 bg-success/5 p-4">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div className="flex size-9 items-center justify-center rounded-full bg-success/10">
                    <Tag className="size-4 text-success" />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-success">
                      {coupon.code}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Coupon applied
                    </p>

                  </div>

                </div>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={removeCoupon}
                  aria-label="Remove coupon"
                >
                  <X className="size-4" />
                </Button>

              </div>

              {/* COUPON DESCRIPTION */}

              {coupon.description && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {coupon.description}
                </p>
              )}

              {/* DISCOUNT INFO */}

              <p className="mt-2 text-xs font-medium text-success">
                {coupon.discountType ===
                "percentage"
                  ? `${coupon.discountValue}% discount`
                  : `${inr(
                      coupon.discountValue
                    )} discount`}
              </p>

            </div>
          )}

          {/* ==================================================
              ORDER SUMMARY
          ================================================== */}

          <SummaryRows
            totals={totals}
          />

          {/* ==================================================
              CHECKOUT
          ================================================== */}

          <Button
            variant="hero"
            size="lg"
            className="w-full"
            disabled={cart.length === 0}
            asChild
          >
            <Link to="/checkout">
              Proceed to checkout
            </Link>
          </Button>

        </aside>
      </section>
    </>
  );
}

/**
 * ==================================================
 * ORDER SUMMARY
 * ==================================================
 *
 * GST is NOT displayed.
 *
 * Customer pays:
 *
 * Subtotal
 * - Discount
 * + Shipping
 * = Total
 */

export function SummaryRows({
  totals,
}: {
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };
}) {
  const totalWithoutGST =
    totals.subtotal -
    totals.discount +
    totals.shipping;

  return (
    <dl className="space-y-3 border-t border-border pt-4 text-sm">

      {/* SUBTOTAL */}

      <Row
        label="Subtotal"
        value={inr(totals.subtotal)}
      />

      {/* DISCOUNT */}

      {totals.discount > 0 && (
        <Row
          label="Discount"
          value={`− ${inr(
            totals.discount
          )}`}
          accent
        />
      )}

      {/* SHIPPING */}

      <Row
        label="Shipping"
        value={
          totals.shipping === 0
            ? "Free"
            : inr(totals.shipping)
        }
      />

      {/* TOTAL */}

      <div className="flex justify-between border-t border-border pt-4 text-base font-bold">

        <dt>Total</dt>

        <dd className="text-gold">
          {inr(totalWithoutGST)}
        </dd>

      </div>

    </dl>
  );
}

/**
 * ==================================================
 * SUMMARY ROW
 * ==================================================
 */

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between">

      <dt className="text-muted-foreground">
        {label}
      </dt>

      <dd
        className={
          accent
            ? "font-medium text-success"
            : "font-medium"
        }
      >
        {value}
      </dd>

    </div>
  );
}
