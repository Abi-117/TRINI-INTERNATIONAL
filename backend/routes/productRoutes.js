import express from "express";

import upload from "../middleware/upload.js";

import {
  createProduct,
  getProducts,
  getSingleProduct,
  getSingleProductById,
  updateProduct,
  deleteProduct,
  getBrands,
  deleteProductImage,
} from "../controllers/productController.js";

const router = express.Router();

// ==================================================
// CREATE PRODUCT
// POST /api/products
// ==================================================

router.post(
  "/",
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  createProduct
);

// ==================================================
// GET ALL PRODUCTS
// GET /api/products
// ==================================================

router.get("/", getProducts);

// ==================================================
// GET BRANDS
// GET /api/products/brands
// ==================================================

router.get("/brands", getBrands);

// ==================================================
// GET PRODUCT BY ID
// GET /api/products/id/:id
// ==================================================

router.get("/id/:id", getSingleProductById);

// ==================================================
// GET PRODUCT BY SLUG
// GET /api/products/:slug
// ==================================================

router.get("/:slug", getSingleProduct);

// ==================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ==================================================

router.put(
  "/:id",
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  updateProduct
);

// ==================================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ==================================================

router.delete("/:id", deleteProduct);

// ==================================================
// DELETE PRODUCT IMAGE
// DELETE /api/products/:id/image
// ==================================================

router.delete("/:id/image", deleteProductImage);

export default router;