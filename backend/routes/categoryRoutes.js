import express from "express";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import protectAdmin from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getCategories);

router.post(
  "/",
  protectAdmin,
  upload.single("image"),
  createCategory
);

router.put(
  "/:id",
  protectAdmin,
  upload.single("image"),
  updateCategory
);

router.delete(
  "/:id",
  protectAdmin,
  deleteCategory
);

export default router;