import express from "express";
import {
  createReview,
  getReviews,
  likeReview,
  getAllReviews,
  approveReview,
  rejectReview,
} from "../controllers/reviewController.js";

import protectAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createReview);

router.get("/:slug", getReviews);

router.put("/like/:id", likeReview);

router.get(
  "/admin/all",
  protectAdmin,
  getAllReviews
);

router.put(
  "/admin/approve/:id",
  protectAdmin,
  approveReview
);

router.put(
  "/admin/reject/:id",
  protectAdmin,
  rejectReview
);

export default router;