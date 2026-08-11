import Category from "../models/Category.js";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    const result = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
          status: "active",
        });

        return {
          ...category.toObject(),
          productCount,
        };
      })
    );

    res.json({
      success: true,
      categories: result,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    let image = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "categories",
          },
          (err, result) => {
            if (err) return reject(err);

            resolve(result);
          }
        );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      });

      image = result.secure_url;
    }

    const category = await Category.create({
      name,
      slug,
      image,
    });

    res.json({
      success: true,
      category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.name = name;
    category.slug = slug;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "categories",
          },
          (err, result) => {
            if (err) return reject(err);

            resolve(result);
          }
        );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      });

      category.image = result.secure_url;
    }

    await category.save();

    res.json({
      success: true,
      category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};