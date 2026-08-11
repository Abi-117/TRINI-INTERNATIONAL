
import { apiClient, request } from "./api/client";
import { endpoints } from "./api/endpoints";

import type {
  Address,
  CartItem,
  Coupon,
  Order,
} from "@/types";

/**
 * Shipping charges
 *
 * Tamil Nadu -> ₹99
 * Other States -> ₹130
 *
 * No free shipping.
 * No GST.
 */

export const TAMIL_NADU_SHIPPING = 99;
export const OTHER_STATE_SHIPPING = 130;

export const TAX_RATE = 0;

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

/**
 * Calculate cart totals
 *
 * GST is disabled.
 * Free shipping is disabled.
 */
export const calculateTotals = (
  items: CartItem[],
  coupon?: Coupon | null,
  shippingFee: number = TAMIL_NADU_SHIPPING
): Totals => {
  const subtotal = items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  let discount = 0;

  // ----------------------------------------------
  // COUPON DISCOUNT
  // ----------------------------------------------

  if (
    coupon &&
    subtotal >= coupon.minOrderAmount
  ) {
    if (
      coupon.discountType === "percentage"
    ) {
      discount = Math.round(
        (subtotal *
          coupon.discountValue) /
          100
      );

      // Maximum discount
      if (
        coupon.maxDiscountAmount !==
          null &&
        coupon.maxDiscountAmount !==
          undefined
      ) {
        discount = Math.min(
          discount,
          coupon.maxDiscountAmount
        );
      }
    } else {
      // Fixed discount
      discount = coupon.discountValue;
    }

    // Discount cannot exceed subtotal
    discount = Math.min(
      discount,
      subtotal
    );
  }

  // ----------------------------------------------
  // TAXABLE AMOUNT
  // ----------------------------------------------

  const taxable = Math.max(
    0,
    subtotal - discount
  );

  // ----------------------------------------------
  // SHIPPING
  // ----------------------------------------------

  const shipping =
    subtotal === 0
      ? 0
      : shippingFee;

  // ----------------------------------------------
  // GST DISABLED
  // ----------------------------------------------

  const tax = 0;

  // ----------------------------------------------
  // FINAL TOTAL
  // ----------------------------------------------

  const total =
    taxable + shipping;

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total,
  };
};

export const commerceService = {
  /**
   * Get all coupons
   *
   * Admin-created coupons come
   * from MongoDB through backend.
   */
  listCoupons: () =>
    request<Coupon[]>(
      async () =>
        (
          await apiClient.get(
            endpoints.coupons.list
          )
        ).data
    ),

  /**
   * Validate coupon
   *
   * Customer enters coupon code
   * in cart.
   */
  validateCoupon: (
    code: string,
    subtotal: number
  ) =>
    request<{
      valid: boolean;
      coupon?: Coupon;
      message: string;
      discount?: number;
      subtotal?: number;
      finalAmount?: number;
    }>(
      async () =>
        (
          await apiClient.post(
            endpoints.coupons.validate,
            {
              code:
                code.trim().toUpperCase(),

              subtotal,
            }
          )
        ).data
    ),

  /**
   * Create order
   */
  createOrder: (payload: {
    items: CartItem[];
    address: Address;
    paymentMethod: string;
    giftNote?: string;
    totals: Totals;
  }) =>
    request(
      async () =>
        (
          await apiClient.post(
            endpoints.orders.create,
            payload
          )
        ).data,

      () => {
        const order: Order = {
          id: `o_${Date.now()}`,

          orderNumber: `TRN${Math.floor(
            100000 +
              Math.random() *
                899999
          )}`,

          createdAt:
            new Date().toISOString(),

          status: "confirmed",

          items: payload.items,

          address: payload.address,

          subtotal:
            payload.totals.subtotal,

          discount:
            payload.totals.discount,

          shipping:
            payload.totals.shipping,

          tax: 0,

          total:
            payload.totals.total,

          paymentMethod:
            payload.paymentMethod,

          paymentStatus:
            payload.paymentMethod ===
            "cod"
              ? "pending"
              : "paid",
        };

        if (
          typeof window !==
          "undefined"
        ) {
          const stored =
            JSON.parse(
              window.localStorage.getItem(
                "trini.orders"
              ) ?? "[]"
            ) as Order[];

          window.localStorage.setItem(
            "trini.orders",
            JSON.stringify([
              order,
              ...stored,
            ])
          );
        }

        return order;
      }
    ),

  /**
   * List orders
   */
  listOrders: () =>
    request<Order[]>(
      async () =>
        (
          await apiClient.get(
            endpoints.orders.list
          )
        ).data,

      () =>
        typeof window ===
        "undefined"
          ? []
          : (JSON.parse(
              window.localStorage.getItem(
                "trini.orders"
              ) ?? "[]"
            ) as Order[])
    ),

  /**
   * Get single order
   */
  getOrder: (id: string) =>
    request<Order | null>(
      async () =>
        (
          await apiClient.get(
            endpoints.orders.detail(id)
          )
        ).data,

      () => {
        if (
          typeof window ===
          "undefined"
        ) {
          return null;
        }

        const stored =
          JSON.parse(
            window.localStorage.getItem(
              "trini.orders"
            ) ?? "[]"
          ) as Order[];

        return (
          stored.find(
            (order) =>
              order.id === id ||
              order.orderNumber === id
          ) ?? null
        );
      }
    ),

  /**
   * Newsletter
   */
  subscribeNewsletter: (
    email: string
  ) =>
    request<{ message: string }>(
      async () =>
        (
          await apiClient.post(
            endpoints.newsletter.subscribe,
            { email }
          )
        ).data,

      () => ({
        message: `${email} subscribed to Trini Insider`,
      })
    ),

  /**
   * Contact
   */
  sendContact: (payload: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) =>
    request<{ message: string }>(
      async () =>
        (
          await apiClient.post(
            endpoints.contact.send,
            payload
          )
        ).data,

      () => ({
        message: `Thanks ${payload.name}, our team will call you shortly.`,
      })
    ),
};

