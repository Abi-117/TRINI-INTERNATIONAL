import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CreditCard, Loader2, Tag, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SummaryRows } from "@/routes/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStore } from "@/store/store-provider";
import { calculateTotals, commerceService } from "@/services/commerce.service";
import { inr } from "@/lib/format";
import { orderService } from "@/services/order.service";
import type { Address, Coupon } from "@/types";

const title = "Secure Checkout — TRINI INTERNATIONAL";
const description = "Enter your delivery address and send your order securely via WhatsApp.";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const emptyAddress: Address = {
  id: "addr_1",
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "Tamil Nadu",
  pincode: "",
  isDefault: true,
};

function CheckoutPage() {
  const { cart, clearCart, user, addresses, saveAddress } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
  if (!user) {
    toast.error("Please login first");

    navigate({
      to: "/auth/login",
      search: {
        redirect: "/checkout",
      },
    });
  }
}, [user]);

  if (!user) {
  return (
    <div className="container py-20 text-center">

      <h2 className="text-2xl font-bold">
        Login Required
      </h2>

      <p className="mt-3">
        Please login before checkout.
      </p>

      <Button className="mt-5" asChild>
        <Link to="/auth/login">
          Login
        </Link>
      </Button>

    </div>
  );
}
  const [address, setAddress] = useState<Address>(addresses.find((a) => a.isDefault) ?? emptyAddress);
  const [delivery, setDelivery] = useState("standard");
  const [giftNote, setGiftNote] = useState("");
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  // const [loading, setLoading] = useState(false);
  const getShippingCharge = (
  state: string,
): number => {
  const normalizedState =
    state.trim().toLowerCase();

  if (
    normalizedState === "tamil nadu" ||
    normalizedState === "tamilnadu"
  ) {
    return 99;
  }

  return 130;
};

 const base = calculateTotals(cart, coupon);

const shippingCharge = getShippingCharge(address.state);

const totals = {
  ...base,
  shipping: shippingCharge,
  total: Math.max(
    0,
    base.subtotal - base.discount + shippingCharge
  ),
};

  const applyCoupon = async () => {
    const res = await commerceService.validateCoupon(code, totals.subtotal);
    if (res.valid && res.coupon) {
      setCoupon(res.coupon);
      toast.success(res.message);
    } else toast.error(res.message);
  };

 const placeOrder = async () => {
  if (
    !address.fullName ||
    !address.phone ||
    !address.line1 ||
    !address.city ||
    !address.state ||
    !address.pincode
  ) {
    toast.error("Please complete your delivery address");
    return;
  }

  if (cart.length === 0) {
    toast.error("Your bag is empty");
    return;
  }

  setLoading(true);

  try {
    saveAddress(address);

    const response = await orderService.placeOrder({
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        variant: item.variant,
      })),

      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },

      paymentMethod: "whatsapp",
      paymentStatus: "Pending",

      razorpayPaymentId: "",
      razorpayOrderId: "",
      razorpaySignature: "",

      couponCode: coupon?.code,
      discount: base.discount,
      shippingCharge,
    });

    const order = response?.order;

    const itemsText = cart
      .map(
        (item) =>
          `• ${item.title}${item.variant ? ` (${item.variant})` : ""} × ${item.quantity} — ${inr(item.price * item.quantity)}`,
      )
      .join("\n");

    const whatsappMessage = [
      "🛍️ *NEW ORDER — TRINI INTERNATIONAL*",
      "",
      `Order ID: ${order?._id ?? "Pending"}`,
      "",
      "*Products:*",
      itemsText,
      "",
      `Subtotal: ${inr(totals.subtotal)}`,
      `Discount: ${inr(totals.discount)}`,
      `Shipping: ${inr(totals.shipping)}`,
      `*Total: ${inr(totals.total)}*`,
      "",
      "*Delivery Details:*",
      `Name: ${address.fullName}`,
      `Phone: ${address.phone}`,
      `Address: ${address.line1}${address.line2 ? `, ${address.line2}` : ""}`,
      `City: ${address.city}`,
      `State: ${address.state}`,
      `Pincode: ${address.pincode}`,
      "",
      "Payment: WhatsApp / Manual Payment",
      "Payment Status: Pending",
    ].join("\n");

    const whatsappNumber = "919363328178";
    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    clearCart();

    toast.success("Order created. Opening WhatsApp...");

    window.open(whatsappUrl, "_blank");

    if (order?._id) {
      navigate({
        to: "/order-confirmation/$orderId",
        params: {
          orderId: order._id,
        },
      });
    }
  } catch (error) {
    console.error(error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to place order",
    );
  } finally {
    setLoading(false);
  }
};


const getDeliveryTime = (
  state: string,
): string => {
  const normalizedState =
    state.trim().toLowerCase();

  if (
    normalizedState === "tamil nadu" ||
    normalizedState === "tamilnadu"
  ) {
    return "0–5 days";
  }

  return "5–9 days";
};



const deliveryTime =
  getDeliveryTime(address.state);



  const field = (k: keyof Address, label: string, placeholder = "") => (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</Label>
      <Input
        value={(address[k] as string) ?? ""}
        placeholder={placeholder}
        onChange={(e) => setAddress({ ...address, [k]: e.target.value })}
        className="h-11 rounded-2xl border-border bg-surface/60"
      />
    </div>
  );
  const [loading, setLoading] =
  useState(false);

  return (
    <>
      <PageHeader eyebrow="Checkout" title="Secure Checkout" breadcrumb={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <section className="container-x grid gap-8 py-14 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl glass p-7">
            <h2 className="mb-5 text-lg font-bold">Delivery address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("fullName", "Full name", "Your name")}
              {field("phone", "Phone", "+91")}
              <div className="sm:col-span-2">{field("line1", "Address line 1", "House / street")}</div>
              <div className="sm:col-span-2">{field("line2", "Address line 2", "Landmark (optional)")}</div>
              {field("city", "City")}
              {field("state", "State")}
              {field("pincode", "Pincode")}
              {field("label", "Save as", "Home / Work")}
            </div>
          </div>

          <div className="rounded-3xl glass p-7">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
              <Truck className="size-4 text-primary" /> Delivery options
            </h2>
            <RadioGroup value={delivery} onValueChange={setDelivery} className="space-y-3">
              <div className="rounded-2xl border border-border p-4">
  <div className="flex items-center gap-3">
    <Truck className="size-5 text-primary" />

    <div>
      <p className="text-sm font-semibold">
        Standard Delivery
      </p>

      <p className="text-xs text-muted-foreground">
        {deliveryTime}
      </p>
    </div>

    <span className="ml-auto text-sm font-semibold">
      {inr(shippingCharge)}
    </span>
  </div>
</div>
            </RadioGroup>
          </div>

          <div className="rounded-3xl glass p-7">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
              <CreditCard className="size-4 text-primary" /> Order & Payment
            </h2>
            <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">
                    Order via WhatsApp
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your order details will be sent to our WhatsApp team for payment confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="rounded-3xl glass p-7">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Gift className="size-4 text-primary" /> Gift note
            </h2>
            <Textarea
              value={giftNote}
              onChange={(e) => setGiftNote(e.target.value)}
              placeholder="Add a personal message — we'll print it on a premium card."
              className="min-h-24 rounded-2xl border-border bg-surface/60"
            />
          </div> */}
        </div>

        <aside className="h-fit space-y-4 rounded-3xl glass p-7 lg:sticky lg:top-28">
          <h2 className="text-lg font-bold">Payment summary</h2>
          <ul className="space-y-3 text-sm">
            {cart.map((i) => (
              <li key={i.productId + (i.variant ?? "")} className="flex justify-between gap-3">
                <span className="line-clamp-1 text-muted-foreground">
                  {i.title} × {i.quantity}
                </span>
                <span className="font-medium">{inr(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Coupon code"
              className="h-11 rounded-full border-border bg-surface/60"
            />
            <Button variant="glass" onClick={applyCoupon}>
              <Tag className="size-4" />
            </Button>
          </div>
          <SummaryRows totals={totals} />
          <Button variant="hero" size="lg" className="w-full" onClick={placeOrder} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Place Order on WhatsApp
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            By placing this order you agree to our <Link to="/contact" className="text-primary">policies</Link>.
          </p>
        </aside>
      </section>
    </>
  );
}

function OptionRow({ value, title, note }: { value: string; title: string; note: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-4 transition-colors hover:border-primary/50">
      <RadioGroupItem value={value} id={value} />
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="text-xs text-muted-foreground">{note}</span>
      </span>
    </label>
  );
}



















































// import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
// import { CreditCard, Gift, Loader2, Tag, Truck } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";
// import { useEffect } from "react";
// import { PageHeader } from "@/components/shared/page-header";
// import { SummaryRows } from "@/routes/cart";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { useStore } from "@/store/store-provider";
// import { calculateTotals, commerceService } from "@/services/commerce.service";
// import { paymentService } from "@/services/payment.service";
// import { inr } from "@/lib/format";
// import { orderService } from "@/services/order.service";
// import type { Address, Coupon } from "@/types";

// const title = "Secure Checkout — TRINI INTERNATIONAL";
// const description = "Enter your delivery address, choose a delivery option and pay securely with Razorpay.";

// export const Route = createFileRoute("/checkout")({
//   head: () => ({
//     meta: [
//       { title },
//       { name: "description", content: description },
//       { property: "og:title", content: title },
//       { property: "og:description", content: description },
//       { name: "robots", content: "noindex" },
//     ],
//   }),
//   component: CheckoutPage,
// });

// const emptyAddress: Address = {
//   id: "addr_1",
//   label: "Home",
//   fullName: "",
//   phone: "",
//   line1: "",
//   line2: "",
//   city: "",
//   state: "Tamil Nadu",
//   pincode: "",
//   isDefault: true,
// };

// function CheckoutPage() {
//   const { cart, clearCart, user, addresses, saveAddress } = useStore();

//   const navigate = useNavigate();

//   useEffect(() => {
//   if (!user) {
//     toast.error("Please login first");

//     navigate({
//       to: "/auth/login",
//       search: {
//         redirect: "/checkout",
//       },
//     });
//   }
// }, [user]);

//   if (!user) {
//   return (
//     <div className="container py-20 text-center">

//       <h2 className="text-2xl font-bold">
//         Login Required
//       </h2>

//       <p className="mt-3">
//         Please login before checkout.
//       </p>

//       <Button className="mt-5" asChild>
//         <Link to="/auth/login">
//           Login
//         </Link>
//       </Button>

//     </div>
//   );
// }
//   const [address, setAddress] = useState<Address>(addresses.find((a) => a.isDefault) ?? emptyAddress);
//   const [delivery, setDelivery] = useState("standard");
//   const [payment, setPayment] = useState("razorpay");
//   const [giftNote, setGiftNote] = useState("");
//   const [code, setCode] = useState("");
//   const [coupon, setCoupon] = useState<Coupon | null>(null);
//   // const [loading, setLoading] = useState(false);
//   const getShippingCharge = (
//   state: string,
// ): number => {
//   const normalizedState =
//     state.trim().toLowerCase();

//   if (
//     normalizedState === "tamil nadu" ||
//     normalizedState === "tamilnadu"
//   ) {
//     return 99;
//   }

//   return 130;
// };

//  const base = calculateTotals(cart, coupon);

// const shippingCharge = getShippingCharge(address.state);

// const totals = {
//   ...base,
//   shipping: shippingCharge,
//   total: Math.max(
//     0,
//     base.subtotal - base.discount + shippingCharge
//   ),
// };

//   const applyCoupon = async () => {
//     const res = await commerceService.validateCoupon(code, totals.subtotal);
//     if (res.valid && res.coupon) {
//       setCoupon(res.coupon);
//       toast.success(res.message);
//     } else toast.error(res.message);
//   };

//  const placeOrder = async () => {
//   if (
//     !address.fullName ||
//     !address.phone ||
//     !address.line1 ||
//     !address.city ||
//     !address.state ||
//     !address.pincode
//   ) {
//     toast.error(
//       "Please complete your delivery address",
//     );
//     return;
//   }

//   if (cart.length === 0) {
//     toast.error("Your bag is empty");
//     return;
//   }

//   setLoading(true);

//   try {
//     saveAddress(address);

//     await paymentService.checkout({
//       amount: totals.total,

//       name: address.fullName,

//       email:
//         user?.email ??
//         "customer@triniinternational.com",

//       contact: address.phone,

//       description:
//         "TRINI INTERNATIONAL Order",

//       onSuccess: async (
//         razorpayResponse,
//       ) => {
//         try {
//           const verification =
//             await paymentService.verifyPayment(
//               razorpayResponse,
//             );

//           if (!verification.verified) {
//             toast.error(
//               "Payment verification failed",
//             );

//             setLoading(false);

//             navigate({
//               to: "/payment/failed",
//             });

//             return;
//           }

//           await orderService.placeOrder({
//             items: cart.map((item) => ({
//               productId:
//                 item.productId,

//               quantity:
//                 item.quantity,

//               variant:
//                 item.variant,
//             })),

//             shippingAddress: {
//               fullName:
//                 address.fullName,

//               phone:
//                 address.phone,

//               line1:
//                 address.line1,

//               line2:
//                 address.line2,

//               city:
//                 address.city,

//               state:
//                 address.state,

//               pincode:
//                 address.pincode,
//             },

//             paymentMethod:
//               "razorpay",

//             paymentStatus:
//               "Paid",

//             razorpayPaymentId:
//               razorpayResponse
//                 .razorpay_payment_id,

//             razorpayOrderId:
//               razorpayResponse
//                 .razorpay_order_id,

//             razorpaySignature:
//               razorpayResponse
//                 .razorpay_signature,

//             couponCode:
//               coupon?.code,

//             discount:
//               base.discount,
//           });

//           clearCart();

//           toast.success(
//             "Payment successful!",
//           );

//           navigate({
//             to: "/payment/success",
//           });
//         } catch (error) {
//           console.error(error);

//           toast.error(
//             error instanceof Error
//               ? error.message
//               : "Order creation failed",
//           );

//           setLoading(false);
//         }
//       },

//       onFailure: (reason) => {
//         setLoading(false);

//         toast.error(reason);

//         navigate({
//           to: "/payment/failed",
//         });
//       },
//     });
//   } catch (error) {
//     setLoading(false);

//     toast.error(
//       error instanceof Error
//         ? error.message
//         : "Payment failed",
//     );
//   }
// };


// const getDeliveryTime = (
//   state: string,
// ): string => {
//   const normalizedState =
//     state.trim().toLowerCase();

//   if (
//     normalizedState === "tamil nadu" ||
//     normalizedState === "tamilnadu"
//   ) {
//     return "0–5 days";
//   }

//   return "5–9 days";
// };



// const deliveryTime =
//   getDeliveryTime(address.state);



//   const field = (k: keyof Address, label: string, placeholder = "") => (
//     <div className="space-y-2">
//       <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</Label>
//       <Input
//         value={(address[k] as string) ?? ""}
//         placeholder={placeholder}
//         onChange={(e) => setAddress({ ...address, [k]: e.target.value })}
//         className="h-11 rounded-2xl border-border bg-surface/60"
//       />
//     </div>
//   );
//   const [loading, setLoading] =
//   useState(false);

//   return (
//     <>
//       <PageHeader eyebrow="Checkout" title="Secure Checkout" breadcrumb={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
//       <section className="container-x grid gap-8 py-14 lg:grid-cols-[1.6fr_1fr]">
//         <div className="space-y-6">
//           <div className="rounded-3xl glass p-7">
//             <h2 className="mb-5 text-lg font-bold">Delivery address</h2>
//             <div className="grid gap-4 sm:grid-cols-2">
//               {field("fullName", "Full name", "Your name")}
//               {field("phone", "Phone", "+91")}
//               <div className="sm:col-span-2">{field("line1", "Address line 1", "House / street")}</div>
//               <div className="sm:col-span-2">{field("line2", "Address line 2", "Landmark (optional)")}</div>
//               {field("city", "City")}
//               {field("state", "State")}
//               {field("pincode", "Pincode")}
//               {field("label", "Save as", "Home / Work")}
//             </div>
//           </div>

//           <div className="rounded-3xl glass p-7">
//             <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
//               <Truck className="size-4 text-primary" /> Delivery options
//             </h2>
//             <RadioGroup value={delivery} onValueChange={setDelivery} className="space-y-3">
//               <div className="rounded-2xl border border-border p-4">
//   <div className="flex items-center gap-3">
//     <Truck className="size-5 text-primary" />

//     <div>
//       <p className="text-sm font-semibold">
//         Standard Delivery
//       </p>

//       <p className="text-xs text-muted-foreground">
//         {deliveryTime}
//       </p>
//     </div>

//     <span className="ml-auto text-sm font-semibold">
//       {inr(shippingCharge)}
//     </span>
//   </div>
// </div>
//             </RadioGroup>
//           </div>

//           <div className="rounded-3xl glass p-7">
//             <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
//               <CreditCard className="size-4 text-primary" /> Payment method
//             </h2>
//             <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4">
//   <div className="flex items-center gap-3">
//     <CreditCard className="size-5 text-primary" />

//     <div>
//       <p className="text-sm font-semibold">
//         Razorpay
//       </p>

//       <p className="text-xs text-muted-foreground">
//         UPI · Cards · Netbanking · Wallets
//       </p>
//     </div>
//   </div>
// </div>
//           </div>

//           {/* <div className="rounded-3xl glass p-7">
//             <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
//               <Gift className="size-4 text-primary" /> Gift note
//             </h2>
//             <Textarea
//               value={giftNote}
//               onChange={(e) => setGiftNote(e.target.value)}
//               placeholder="Add a personal message — we'll print it on a premium card."
//               className="min-h-24 rounded-2xl border-border bg-surface/60"
//             />
//           </div> */}
//         </div>

//         <aside className="h-fit space-y-4 rounded-3xl glass p-7 lg:sticky lg:top-28">
//           <h2 className="text-lg font-bold">Payment summary</h2>
//           <ul className="space-y-3 text-sm">
//             {cart.map((i) => (
//               <li key={i.productId + (i.variant ?? "")} className="flex justify-between gap-3">
//                 <span className="line-clamp-1 text-muted-foreground">
//                   {i.title} × {i.quantity}
//                 </span>
//                 <span className="font-medium">{inr(i.price * i.quantity)}</span>
//               </li>
//             ))}
//           </ul>
//           <div className="flex gap-2">
//             <Input
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//               placeholder="Coupon code"
//               className="h-11 rounded-full border-border bg-surface/60"
//             />
//             <Button variant="glass" onClick={applyCoupon}>
//               <Tag className="size-4" />
//             </Button>
//           </div>
//           <SummaryRows totals={totals} />
//           <Button variant="hero" size="lg" className="w-full" onClick={placeOrder} disabled={loading}>
//             {loading ? <Loader2 className="size-4 animate-spin" /> : null}
//             {payment === "cod" ? "Place order" : `Pay ${inr(totals.total)}`}
//           </Button>
//           <p className="text-center text-xs text-muted-foreground">
//             By placing this order you agree to our <Link to="/contact" className="text-primary">policies</Link>.
//           </p>
//         </aside>
//       </section>
//     </>
//   );
// }

// function OptionRow({ value, title, note }: { value: string; title: string; note: string }) {
//   return (
//     <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-4 transition-colors hover:border-primary/50">
//       <RadioGroupItem value={value} id={value} />
//       <span>
//         <span className="block text-sm font-semibold">{title}</span>
//         <span className="text-xs text-muted-foreground">{note}</span>
//       </span>
//     </label>
//   );
// }
