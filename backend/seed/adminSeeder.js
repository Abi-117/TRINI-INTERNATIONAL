import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const exists = await Admin.findOne({
      email: "triniinternational@gmail.com",
    });

    if (exists) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("TriniInternational78", 10);

    await Admin.create({
      name: "Super Admin",
      email: "triniinternational@gmail.com",
      password: hashedPassword,
    });

    console.log("✅ Admin Created Successfully");

    mongoose.connection.close();
  } catch (error) {
    console.log(error);
  }
};

seedAdmin();