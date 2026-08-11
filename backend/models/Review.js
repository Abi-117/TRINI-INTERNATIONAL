import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    title: {
      type: String,
      default: "",
    },

    comment: {
      type: String,
      required: true,
    },

    verifiedPurchase: {
      type: Boolean,
      default: false,
    },

    helpful: {
      type: Number,
      default: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
},
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Review",
  reviewSchema
);