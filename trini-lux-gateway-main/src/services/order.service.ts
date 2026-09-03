import api from "./api";

export interface OrderItemPayload {
  productId: string;
  quantity: number;
  variant?: string;
}

export interface ShippingAddressPayload {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CustomerOrderResponse {
  success: boolean;
  orders: any[];
  message?: string;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  shippingAddress: ShippingAddressPayload;
  paymentMethod: "whatsapp";
  paymentStatus: "Pending";
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  couponCode?: string;
  discount?: number;
  shippingCharge: number;
}

// --------------------------------------------------
// CUSTOMER AUTH CONFIG
// --------------------------------------------------

const getCustomerAuth = () => {
  const token = localStorage.getItem("customerToken");

  if (!token) {
    throw new Error("Customer login required");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// --------------------------------------------------
// ORDER SERVICE
// --------------------------------------------------

export const orderService = {
  // -----------------------------------------------
  // PLACE ORDER
  // -----------------------------------------------

  placeOrder: async (
    data: CreateOrderPayload,
  ) => {
    const config = getCustomerAuth();

    const response = await api.post(
      "/customer/orders",
      data,
      config,
    );

    return response.data;
  },

  // -----------------------------------------------
  // GET MY ORDERS
  // -----------------------------------------------

  getMyOrders: async () => {
    const config = getCustomerAuth();

    const response = await api.get(
      "/customer/orders",
      config,
    );

    return response.data;
  },

  // -----------------------------------------------
  // GET SINGLE MY ORDER
  // -----------------------------------------------

  getOrder: async (id: string) => {
    const config = getCustomerAuth();

    const response = await api.get(
      `/customer/orders/${id}`,
      config,
    );

    return response.data;
  },

  // -----------------------------------------------
  // GET MY ORDER
  // -----------------------------------------------

  getMyOrder: async (id: string) => {
    const config = getCustomerAuth();

    const response = await api.get(
      `/customer/orders/${id}`,
      config,
    );

    return response.data;
  },

  // -----------------------------------------------
  // REQUEST CANCEL
  // -----------------------------------------------

  requestCancel: async (
    id: string,
    reason: string,
  ) => {
    const config = getCustomerAuth();

    const response = await api.put(
      `/customer/orders/${id}/cancel`,
      {
        reason,
      },
      config,
    );

    return response.data;
  },

  // -----------------------------------------------
  // REQUEST RETURN
  // -----------------------------------------------

  requestReturn: async (
    id: string,
    reason: string,
  ) => {
    const config = getCustomerAuth();

    const response = await api.put(
      `/customer/orders/${id}/return`,
      {
        reason,
      },
      config,
    );

    return response.data;
  },
};




























































// import api from "./api";

// export interface OrderItemPayload {
//   productId: string;
//   quantity: number;
//   variant?: string;
// }
// export interface CreateOrderPayload {
//   items: OrderItemPayload[];

//   shippingAddress: ShippingAddressPayload;

//   paymentMethod: "razorpay";
//   paymentStatus: "Paid";

//   razorpayPaymentId: string;
//   razorpayOrderId: string;
//   razorpaySignature: string;

//   couponCode?: string;
//   discount?: number;

//   shippingCharge: number;
// }
// export interface ShippingAddressPayload {
//   fullName: string;
//   phone: string;
//   line1: string;
//   line2?: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// export interface CustomerOrderResponse {
//   success: boolean;
//   orders: any[];
//   message?: string;
// }

// export interface CreateOrderPayload {
//   items: OrderItemPayload[];
//   shippingAddress: ShippingAddressPayload;

//   paymentMethod: "razorpay";
//   paymentStatus: "Paid";

//   razorpayPaymentId: string;
//   razorpayOrderId: string;
//   razorpaySignature: string;

//   couponCode?: string;
//   discount?: number;
// }

// // --------------------------------------------------
// // CUSTOMER AUTH CONFIG
// // --------------------------------------------------

// const getCustomerAuth = () => {
//   const token = localStorage.getItem("customerToken");

//   if (!token) {
//     throw new Error("Customer login required");
//   }

//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

// // --------------------------------------------------
// // ORDER SERVICE
// // --------------------------------------------------

// export const orderService = {
//   // -----------------------------------------------
//   // PLACE ORDER
//   // -----------------------------------------------

//   placeOrder: async (
//     data: CreateOrderPayload,
//   ) => {
//     const config = getCustomerAuth();

//     const response = await api.post(
//       "/customer/orders",
//       data,
//       config,
//     );

//     return response.data;
//   },

//   // -----------------------------------------------
//   // GET MY ORDERS
//   // -----------------------------------------------

//   getMyOrders: async () => {
//     const config = getCustomerAuth();

//     const response = await api.get(
//       "/customer/orders",
//       config,
//     );

//     return response.data;
//   },

//   // -----------------------------------------------
//   // GET SINGLE MY ORDER
//   // -----------------------------------------------

//   getOrder: async (id: string) => {
//     const config = getCustomerAuth();

//     const response = await api.get(
//       `/customer/orders/${id}`,
//       config,
//     );

//     return response.data;
//   },

//   // -----------------------------------------------
//   // GET MY ORDER
//   // -----------------------------------------------

//   getMyOrder: async (id: string) => {
//     const config = getCustomerAuth();

//     const response = await api.get(
//       `/customer/orders/${id}`,
//       config,
//     );

//     return response.data;
//   },

//   // -----------------------------------------------
//   // REQUEST CANCEL
//   // -----------------------------------------------

//   requestCancel: async (
//     id: string,
//     reason: string,
//   ) => {
//     const config = getCustomerAuth();

//     const response = await api.put(
//       `/customer/orders/${id}/cancel`,
//       {
//         reason,
//       },
//       config,
//     );

//     return response.data;
//   },

//   // -----------------------------------------------
//   // REQUEST RETURN
//   // -----------------------------------------------

//   requestReturn: async (
//     id: string,
//     reason: string,
//   ) => {
//     const config = getCustomerAuth();

//     const response = await api.put(
//       `/customer/orders/${id}/return`,
//       {
//         reason,
//       },
//       config,
//     );

//     return response.data;
//   },
// };