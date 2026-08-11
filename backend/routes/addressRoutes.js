import express from "express";

import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";

import { protectCustomer } from "../middleware/customerMiddleware.js";

const router = express.Router();

router.use(protectCustomer);

router.post("/", addAddress);

router.get("/", getAddresses);

router.put("/:id", updateAddress);

router.delete("/:id", deleteAddress);

router.put("/default/:id", setDefaultAddress);

export default router;