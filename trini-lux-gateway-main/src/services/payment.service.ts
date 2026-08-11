import { apiClient, request } from "./api/client";
import { endpoints } from "./api/endpoints";

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayFailure {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  };
}

declare global {
  interface Window {
    Razorpay?: new (
      options: Record<string, unknown>,
    ) => {
      open: () => void;
      on: (
        event: string,
        callback: (response: unknown) => void,
      ) => void;
    };
  }
}

const RAZORPAY_SDK =
  "https://checkout.razorpay.com/v1/checkout.js";

export const loadRazorpaySdk = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src = RAZORPAY_SDK;
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });

export const paymentService = {
  createRazorpayOrder: (
    payload: {
      amount: number;
      currency?: string;
      receipt?: string;
    },
  ) =>
    request<RazorpayOrder>(
      async () => {
        const response = await apiClient.post(
          endpoints.payments.createOrder,
          payload,
        );

        return response.data;
      },
      () => ({
        orderId: `order_demo_${Date.now()}`,
        amount: Math.round(payload.amount * 100),
        currency: payload.currency ?? "INR",
        keyId:
          import.meta.env.VITE_RAZORPAY_KEY_ID ?? "",
      }),
    ),

  verifyPayment: (
    payload: RazorpaySuccess,
  ) =>
    request<{
      verified: boolean;
      paymentId?: string;
      orderId?: string;
    }>(
      async () => {
        const response = await apiClient.post(
          endpoints.payments.verify,
          payload,
        );

        return response.data;
      },
      () => ({
        verified: true,
        paymentId: payload.razorpay_payment_id,
        orderId: payload.razorpay_order_id,
      }),
    ),

  getStatus: (id: string) =>
    request<{
      status:
        | "paid"
        | "pending"
        | "failed";
    }>(
      async () => {
        const response = await apiClient.get(
          endpoints.payments.status(id),
        );

        return response.data;
      },
      () => ({
        status: "pending",
      }),
    ),

  checkout: async (options: {
    amount: number;
    name: string;
    email: string;
    contact: string;
    description?: string;

    onSuccess: (
      response: RazorpaySuccess,
    ) => void;

    onFailure: (
      reason: string,
    ) => void;
  }): Promise<void> => {
    try {
      const order =
        await paymentService.createRazorpayOrder({
          amount: options.amount,
          currency: "INR",
        });

      const sdkLoaded =
        await loadRazorpaySdk();

      if (
        !sdkLoaded ||
        !window.Razorpay ||
        !order.keyId
      ) {
        options.onFailure(
          "Razorpay could not be loaded.",
        );
        return;
      }

      const razorpay =
        new window.Razorpay({
          key: order.keyId,

          amount: order.amount,

          currency: order.currency,

          order_id: order.orderId,

          name: "TRINI INTERNATIONAL",

          description:
            options.description ??
            "Premium Lifestyle Store",

          image: undefined,

          prefill: {
            name: options.name,
            email: options.email,
            contact: options.contact,
          },

          notes: {
            store: "TRINI INTERNATIONAL",
          },

          theme: {
            color: "#F5C542",
          },

          handler: (
            response: RazorpaySuccess,
          ) => {
            options.onSuccess(response);
          },

          modal: {
            ondismiss: () => {
              options.onFailure(
                "Payment cancelled",
              );
            },
          },
        });

      razorpay.on(
        "payment.failed",
        (response: unknown) => {
          const failure =
            response as RazorpayFailure;

          const message =
            failure.error
              ?.description ??
            "Payment failed";

          options.onFailure(message);
        },
      );

      razorpay.open();
    } catch (error) {
      options.onFailure(
        error instanceof Error
          ? error.message
          : "Unable to start payment",
      );
    }
  },
};