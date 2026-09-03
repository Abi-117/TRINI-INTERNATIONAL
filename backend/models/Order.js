import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    variant: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
       ref: "User",
        required: true,
    },
//     shippingAddress: {
//   fullName: String,
//   phone: String,
//   line1: String,
//   city: String,
//   state: String,
//   pincode: String,
// },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      line1: {
        type: String,
        required: true,
      },

      line2: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    paymentMethod: {
      type: String,
      enum: ["razorpay", "whatsapp"],
      default: "razorpay",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },
    razorpaySignature: {
  type: String,
  default: "",
},

    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    shippingCharge: {
      type: Number,
      required: true,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
      default: 0,
    },

    couponCode: {
      type: String,
      default: "",
    },

    deliveryDays: {
      type: String,
      default: "",
    },

    trackingNumber: {
      type: String,
      default: "",
    },

    courier: {
      type: String,
      default: "",
    },

    dispatchDate: {
      type: Date,
    },

    expectedDelivery: {
      type: Date,
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    giftNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);


































































// import mongoose from "mongoose";

// const orderItemSchema = new mongoose.Schema(
//   {
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },

//     name: {
//       type: String,
//       required: true,
//     },

//     image: {
//       type: String,
//       default: "",
//     },

//     quantity: {
//       type: Number,
//       required: true,
//       min: 1,
//     },

//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     variant: {
//       type: String,
//       default: "",
//     },
//   },
//   { _id: false }
// );

// const orderSchema = new mongoose.Schema(
//   {
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//        ref: "User",
//         required: true,
//     },
// //     shippingAddress: {
// //   fullName: String,
// //   phone: String,
// //   line1: String,
// //   city: String,
// //   state: String,
// //   pincode: String,
// // },

//     items: {
//       type: [orderItemSchema],
//       required: true,
//     },

//     shippingAddress: {
//       fullName: {
//         type: String,
//         required: true,
//       },

//       phone: {
//         type: String,
//         required: true,
//       },

//       line1: {
//         type: String,
//         required: true,
//       },

//       line2: {
//         type: String,
//         default: "",
//       },

//       city: {
//         type: String,
//         required: true,
//       },

//       state: {
//         type: String,
//         required: true,
//       },

//       pincode: {
//         type: String,
//         required: true,
//       },
//     },

//     paymentMethod: {
//       type: String,
//       enum: ["razorpay"],
//       default: "razorpay",
//     },

//     paymentStatus: {
//       type: String,
//       enum: ["Pending", "Paid", "Failed"],
//       default: "Pending",
//     },

//     razorpayOrderId: {
//       type: String,
//       default: "",
//     },

//     razorpayPaymentId: {
//       type: String,
//       default: "",
//     },
//     razorpaySignature: {
//   type: String,
//   default: "",
// },

//     subtotal: {
//       type: Number,
//       required: true,
//       default: 0,
//     },

//     discount: {
//       type: Number,
//       default: 0,
//     },

//     shippingCharge: {
//       type: Number,
//       required: true,
//       default: 0,
//     },

//     total: {
//       type: Number,
//       required: true,
//       default: 0,
//     },

//     couponCode: {
//       type: String,
//       default: "",
//     },

//     deliveryDays: {
//       type: String,
//       default: "",
//     },

//     trackingNumber: {
//       type: String,
//       default: "",
//     },

//     courier: {
//       type: String,
//       default: "",
//     },

//     dispatchDate: {
//       type: Date,
//     },

//     expectedDelivery: {
//       type: Date,
//     },

//     orderStatus: {
//       type: String,
//       enum: [
//         "Pending",
//         "Confirmed",
//         "Packed",
//         "Shipped",
//         "Delivered",
//         "Cancelled",
//       ],
//       default: "Pending",
//     },

//     giftNote: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model("Order", orderSchema);