
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  CreditCard,
  Tag,
  Truck,
} from "lucide-react";

import {
  getAdminOrder,
  updateOrderStatus,
} from "@/services/admin.service";

interface Order {
  _id: string;
  createdAt: string;

  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };

  shippingAddress?: {
    fullName?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  items?: any[];

  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;

  subtotal?: number;
  discount?: number;
  couponCode?: string | null;
  shippingCharge?: number;
  total?: number;
}

export default function OrderDetails() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const id = window.location.pathname.split("/").pop();

  // ==================================================
  // LOAD ORDER
  // ==================================================

  const loadOrder = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token || !id) {
        toast.error("Unable to load order");
        return;
      }

      const res = await getAdminOrder(id, token);

      setOrder(res.order);
    } catch (error: any) {
      console.error(
        "Order details error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  // ==================================================
  // CHANGE ORDER STATUS
  // ==================================================

  const changeStatus = async (status: string) => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token || !order) return;

      await updateOrderStatus(
        order._id,
        status,
        token
      );

      toast.success("Order status updated");

      setOrder({
        ...order,
        orderStatus: status,
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500">
          Loading Order...
        </p>
      </div>
    );
  }

  // ==================================================
  // ORDER NOT FOUND
  // ==================================================

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg font-semibold">
          Order not found
        </p>

        <Link
          to="/admin/orders"
          className="mt-4 inline-block text-blue-600"
        >
          ← Back to Orders
        </Link>
      </div>
    );
  }

  // ==================================================
  // ADDRESS
  // ==================================================

  const address = order.shippingAddress || {};

  // ==================================================
  // ORDER AMOUNTS
  // ==================================================

  const subtotal = Number(order.subtotal ?? 0);

  const discount = Number(order.discount ?? 0);

  /*
   * IMPORTANT
   *
   * The final paid amount is the most reliable value
   * for an already-created order.
   *
   * Business calculation:
   *
   * Subtotal - Discount + Shipping = Total
   *
   * Therefore:
   *
   * Shipping = Total - Subtotal + Discount
   */

  const storedTotal =
    order.total !== undefined &&
    order.total !== null
      ? Number(order.total)
      : null;

  const calculatedShipping =
    storedTotal !== null
      ? Math.max(
          0,
          storedTotal -
            subtotal +
            discount
        )
      : Number(
          order.shippingCharge ?? 0
        );

  const shippingCharge =
    calculatedShipping;

  const total =
    storedTotal !== null
      ? storedTotal
      : Math.max(
          0,
          subtotal -
            discount +
            shippingCharge
        );

  return (
    <div className="space-y-6 p-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center gap-4">
        <Link
          to="/admin/order"
          className="rounded-lg border p-2 transition hover:bg-gray-100"
        >
          <ArrowLeft className="size-5" />
        </Link>

        <div>
          <h1 className="text-3xl font-bold">
            Order #{order._id.slice(-8)}
          </h1>

          <p className="text-sm text-gray-500">
            {new Date(
              order.createdAt
            ).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* ==================================================
          STATUS
      ================================================== */}

      <div className="rounded-xl border bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>
            <p className="text-sm text-gray-500">
              Order Status
            </p>

            <select
              value={
                order.orderStatus ||
                "Pending"
              }
              onChange={(e) =>
                changeStatus(
                  e.target.value
                )
              }
              className="mt-2 rounded-lg border p-3"
            >
              <option value="Pending">
                Pending
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Packed">
                Packed
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Payment
            </p>

            <p className="mt-1 font-semibold">
              {order.paymentMethod || "N/A"}
            </p>

            <p
              className={
                order.paymentStatus === "Paid"
                  ? "text-green-600"
                  : "text-orange-500"
              }
            >
              {order.paymentStatus || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          CUSTOMER / ADDRESS / PAYMENT
      ================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* CUSTOMER */}

        <div className="rounded-xl border bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="size-5" />

            <h2 className="font-bold">
              Customer
            </h2>
          </div>

          <p className="font-semibold">
            {order.customer?.name ||
              address.fullName ||
              "N/A"}
          </p>

          <p className="text-sm text-gray-500">
            {order.customer?.email ||
              "N/A"}
          </p>

          <p className="text-sm text-gray-500">
            {order.customer?.phone ||
              address.phone ||
              "N/A"}
          </p>
        </div>

        {/* ADDRESS */}

        <div className="rounded-xl border bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="size-5" />

            <h2 className="font-bold">
              Delivery Address
            </h2>
          </div>

          <p className="font-semibold">
            {address.fullName || "N/A"}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {address.line1 || ""}
          </p>

          {address.line2 && (
            <p className="text-sm text-gray-600">
              {address.line2}
            </p>
          )}

          <p className="text-sm text-gray-600">
            {address.city || ""}
            {address.city &&
            address.state
              ? ", "
              : ""}
            {address.state || ""}
          </p>

          <p className="text-sm font-medium">
            PIN: {address.pincode || "N/A"}
          </p>

          <p className="mt-2 text-sm">
            Phone:{" "}
            {address.phone || "N/A"}
          </p>
        </div>

        {/* PAYMENT */}

        <div className="rounded-xl border bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="size-5" />

            <h2 className="font-bold">
              Payment Details
            </h2>
          </div>

          <p className="text-sm">
            Method:{" "}
            <strong>
              {order.paymentMethod ||
                "N/A"}
            </strong>
          </p>

          <p className="text-sm">
            Status:{" "}
            <strong>
              {order.paymentStatus ||
                "N/A"}
            </strong>
          </p>

          <div className="mt-4 border-t pt-4">
            <p className="text-sm text-gray-500">
              Amount Paid
            </p>

            <p className="text-2xl font-bold">
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          ORDERED PRODUCTS
      ================================================== */}

      <div className="rounded-xl border bg-white p-6">

        <div className="mb-5 flex items-center gap-2">
          <Package className="size-5" />

          <h2 className="text-lg font-bold">
            Ordered Products
          </h2>
        </div>

        <div className="space-y-4">

          {order.items?.map(
            (
              item: any,
              index: number
            ) => {
              const itemPrice = Number(
                item.price ?? 0
              );

              const quantity = Number(
                item.quantity ?? 0
              );

              const itemTotal =
                itemPrice * quantity;

              return (
                <div
                  key={
                    item._id || index
                  }
                  className="flex items-center gap-4 border-b pb-4 last:border-0"
                >

                  <img
  src={
    item.image ||
    item.product?.image ||
    item.product?.images?.[0] ||
    item.images?.[0] ||
    "/placeholder.png"
  }
  alt={
    item.name ||
    item.product?.name ||
    "Product"
  }
  className="size-20 rounded-lg object-cover"
/>

                  <div className="flex-1">

                    <p className="font-semibold">
                      {item.name ||
                        item.product?.name ||
                        "Product"}
                    </p>

                    {item.variant && (
                      <p className="text-sm text-gray-500">
                        Variant:{" "}
                        {item.variant}
                      </p>
                    )}

                    <p className="text-sm text-gray-500">
                      Quantity:{" "}
                      {quantity}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="font-semibold">
                      ₹
                      {itemPrice.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p className="text-sm text-gray-500">
                      ₹
                      {itemTotal.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                </div>
              );
            }
          )}

        </div>
      </div>

      {/* ==================================================
          PRICE SUMMARY
      ================================================== */}

      <div className="ml-auto max-w-md rounded-xl border bg-white p-6">

        <h2 className="mb-5 text-lg font-bold">
          Order Summary
        </h2>

        <div className="space-y-4 text-sm">

          {/* SUBTOTAL */}

          <div className="flex justify-between">
            <span className="text-gray-600">
              Subtotal
            </span>

            <span className="font-medium">
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          {/* COUPON */}

          {order.couponCode &&
            discount > 0 && (
              <div className="rounded-lg bg-green-50 p-3">

                <div className="flex items-center gap-2 text-green-700">
                  <Tag className="size-4" />

                  <span className="font-semibold">
                    Coupon Applied
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">

                  <span className="font-medium text-green-700">
                    {order.couponCode}
                  </span>

                  <span className="font-semibold text-green-700">
                    -₹
                    {discount.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>
              </div>
            )}

          {/* DISCOUNT FALLBACK */}

          {!order.couponCode &&
            discount > 0 && (
              <div className="flex justify-between text-green-600">

                <span>
                  Discount
                </span>

                <span>
                  -₹
                  {discount.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>
            )}

          {/* DELIVERY */}

          <div className="flex justify-between">

            <span className="flex items-center gap-2 text-gray-600">
              <Truck className="size-4" />

              Delivery Charge
            </span>

            <span
              className={
                shippingCharge === 0
                  ? "font-medium text-green-600"
                  : "font-medium"
              }
            >
              {shippingCharge === 0
                ? "Free"
                : `₹${shippingCharge.toLocaleString(
                    "en-IN"
                  )}`}
            </span>

          </div>

          {/* TOTAL */}

          <div className="border-t pt-4">

            <div className="flex justify-between text-base font-bold">

              <span>
                Total
              </span>

              <span className="text-lg">
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            {/* CALCULATION */}

            <p className="mt-2 text-xs text-gray-500">
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}

              {" − "}

              ₹
              {discount.toLocaleString(
                "en-IN"
              )}

              {" + "}

              ₹
              {shippingCharge.toLocaleString(
                "en-IN"
              )}

              {" = "}

              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}
