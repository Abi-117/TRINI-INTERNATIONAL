import mongoose from "mongoose";

const specificationSchema = new mongoose.Schema({
  key: String,
  value: String,
});

const productSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    // ==========================================
    // PRODUCT CONTENT
    // ==========================================

    highlights: [
      {
        type: String,
      },
    ],

    specifications: [
      {
        key: String,
        value: String,
      },
    ],

    // ==========================================
    // PRODUCT MEDIA
    // ==========================================

    images: [
      {
        type: String,
      },
    ],

    video: {
      type: String,
      default: "",
    },

    // ==========================================
    // RATING
    // ==========================================

    rating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // PRICE & STOCK
    // ==========================================

    price: {
      type: Number,
      required: true,
    },

    mrp: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // FLAGS
    // ==========================================

    featured: {
      type: Boolean,
      default: false,
    },

    bestSeller: {
      type: Boolean,
      default: false,
    },

    newArrival: {
      type: Boolean,
      default: false,
    },

    trending: {
      type: Boolean,
      default: false,
    },

    sameDayDispatch: {
      type: Boolean,
      default: true,
    },

    easyReturn: {
      type: Boolean,
      default: true,
    },

    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["active", "hidden", "outofstock"],
      default: "active",
    },

    // ==========================================
    // COLORS
    // ==========================================

    colors: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);

