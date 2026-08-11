
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import streamifier from "streamifier";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";

// ==================================================
// HELPER
// ==================================================

const parseJSON = (value, fallback = []) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  if (
    Array.isArray(value) ||
    typeof value === "object"
  ) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// ==================================================
// CLOUDINARY UPLOAD
// ==================================================

const uploadToCloudinary = (
  buffer,
  mimetype
) => {
  return new Promise((resolve, reject) => {
    const resourceType =
      mimetype?.startsWith("video/")
        ? "video"
        : "image";

    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder: "trini-products",
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

    streamifier
      .createReadStream(buffer)
      .pipe(stream);
  });
};

// ==================================================
// DELETE CLOUDINARY FILE
// ==================================================

const deleteFromCloudinary = async (
  url,
  resourceType = "image"
) => {
  if (!url) return;

  try {
    const urlParts = url.split("/");

    const uploadIndex =
      urlParts.indexOf("upload");

    if (uploadIndex === -1) {
      return;
    }

    let publicIdParts =
      urlParts.slice(uploadIndex + 1);

    // Remove transformations
    while (
      publicIdParts[0] &&
      !publicIdParts[0].match(
        /^v\d+$/
      ) &&
      publicIdParts[0].includes("_")
    ) {
      break;
    }

    // Remove version
    if (
      publicIdParts[0] &&
      /^v\d+$/.test(
        publicIdParts[0]
      )
    ) {
      publicIdParts.shift();
    }

    let publicId =
      publicIdParts.join("/");

    // Remove extension
    publicId = publicId.replace(
      /\.[^/.]+$/,
      ""
    );

    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: resourceType,
      }
    );
  } catch (error) {
    console.error(
      "CLOUDINARY DELETE ERROR:",
      error.message
    );
  }
};

// ==================================================
// CREATE PRODUCT
// POST /api/products
// ==================================================

export const createProduct = async (
  req,
  res
) => {
  try {
    const {
      name,
      slug,
      category,
      brand,
      description,
      highlights,
      specifications,
      price,
      mrp,
      stock,
      featured,
      bestSeller,
      newArrival,
      trending,
      sameDayDispatch,
      easyReturn,
      status,
      colors,
      tags,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Product name is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message:
          "Category is required",
      });
    }

    if (!brand?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Brand is required",
      });
    }

    if (
      price === undefined ||
      price === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Price is required",
      });
    }

    if (
      mrp === undefined ||
      mrp === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "MRP is required",
      });
    }

    // ==================================================
    // CATEGORY
    // ==================================================

    const categoryExists =
      await Category.findById(
        category
      );

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });
    }

    // ==================================================
    // SLUG
    // ==================================================

    const finalSlug =
      slug?.trim() ||
      slugify(name, {
        lower: true,
        strict: true,
      });

    const slugExists =
      await Product.findOne({
        slug: finalSlug,
      });

    if (slugExists) {
      return res.status(400).json({
        success: false,
        message:
          "Slug already exists",
      });
    }

    // ==================================================
    // FILES
    //
    // upload.fields() gives:
    //
    // req.files = {
    //   images: [],
    //   video: []
    // }
    // ==================================================

    const imageFiles =
      req.files?.images || [];

    const videoFiles =
      req.files?.video || [];

    const imageUrls = [];
    let videoUrl = "";

    // ==================================================
    // UPLOAD IMAGES
    // ==================================================

    for (
      const file of imageFiles
    ) {
      if (
        !file.mimetype?.startsWith(
          "image/"
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only image files are allowed in images field",
        });
      }

      const result =
        await uploadToCloudinary(
          file.buffer,
          file.mimetype
        );

      imageUrls.push(
        result.secure_url
      );
    }

    // ==================================================
    // UPLOAD VIDEO
    // ==================================================

    if (videoFiles.length > 0) {
      const videoFile =
        videoFiles[0];

      if (
        !videoFile.mimetype?.startsWith(
          "video/"
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only video files are allowed in video field",
        });
      }

      const result =
        await uploadToCloudinary(
          videoFile.buffer,
          videoFile.mimetype
        );

      videoUrl =
        result.secure_url;
    }

    // ==================================================
    // CREATE PRODUCT
    // ==================================================

    const product =
      await Product.create({
        name: name.trim(),

        slug: finalSlug,

        category,

        brand: brand.trim(),

        description:
          description || "",

        highlights:
          parseJSON(
            highlights,
            []
          ),

        specifications:
          parseJSON(
            specifications,
            []
          ),

        images: imageUrls,

        video: videoUrl,

        price: Number(price),

        mrp: Number(mrp),

        stock:
          stock !== undefined &&
          stock !== ""
            ? Number(stock)
            : 0,

        featured:
          featured === true ||
          featured === "true",

        bestSeller:
          bestSeller === true ||
          bestSeller === "true",

        newArrival:
          newArrival === true ||
          newArrival === "true",

        trending:
          trending === true ||
          trending === "true",

        sameDayDispatch:
          sameDayDispatch ===
            undefined
            ? true
            : sameDayDispatch ===
                true ||
              sameDayDispatch ===
                "true",

        easyReturn:
          easyReturn ===
            undefined
            ? true
            : easyReturn ===
                true ||
              easyReturn ===
                "true",

        status:
          status || "active",

        colors:
          parseJSON(
            colors,
            []
          ),

        tags:
          parseJSON(
            tags,
            []
          ),
      });

    return res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(
      "CREATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create product",
    });
  }
};

// ==================================================
// GET ALL PRODUCTS
// GET /api/products
// ==================================================

export const getProducts = async (
  req,
  res
) => {
  try {
    const {
      search,
      categories,
      brands,
      ageGroups,
      minPrice,
      maxPrice,
      minRating,
      inStockOnly,
      sort = "relevance",
      page = 1,
      pageSize = 9,
    } = req.query;

    const filter = {};

    // ==================================================
    // SEARCH
    // ==================================================

    if (search?.trim()) {
      filter.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // ==================================================
    // CATEGORY
    // ==================================================

    if (categories) {
      const categoryList =
        categories
          .split(",")
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean);

      const categoryDocs =
        await Category.find({
          slug: {
            $in: categoryList,
          },
        });

      filter.category = {
        $in: categoryDocs.map(
          (item) => item._id
        ),
      };
    }

    // ==================================================
    // BRAND
    // ==================================================

    if (brands) {
      filter.brand = {
        $in: brands
          .split(",")
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean),
      };
    }

    // ==================================================
    // AGE GROUP
    // ==================================================

    if (ageGroups) {
      filter.ageGroup = {
        $in: ageGroups
          .split(",")
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean),
      };
    }

    // ==================================================
    // PRICE
    // ==================================================

    if (
      minPrice ||
      maxPrice
    ) {
      filter.price = {};

      if (
        minPrice !==
          undefined &&
        minPrice !== ""
      ) {
        filter.price.$gte =
          Number(minPrice);
      }

      if (
        maxPrice !==
          undefined &&
        maxPrice !== ""
      ) {
        filter.price.$lte =
          Number(maxPrice);
      }
    }

    // ==================================================
    // RATING
    // ==================================================

    if (minRating) {
      filter.rating = {
        $gte:
          Number(minRating),
      };
    }

    // ==================================================
    // STOCK
    // ==================================================

    if (
      inStockOnly === "true"
    ) {
      filter.stock = {
        $gt: 0,
      };
    }

    // ==================================================
    // SORT
    // ==================================================

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "price-asc":
        sortOption = {
          price: 1,
        };
        break;

      case "price-desc":
        sortOption = {
          price: -1,
        };
        break;

      case "rating":
        sortOption = {
          rating: -1,
        };
        break;

      case "newest":
        sortOption = {
          createdAt: -1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
    }

    // ==================================================
    // PAGINATION
    // ==================================================

    const currentPage =
      Math.max(
        Number(page) || 1,
        1
      );

    const limit =
      Math.max(
        Number(pageSize) || 9,
        1
      );

    const skip =
      (currentPage - 1) *
      limit;

    // ==================================================
    // COUNT
    // ==================================================

    const total =
      await Product.countDocuments(
        filter
      );

    // ==================================================
    // PRODUCTS
    // ==================================================

    const products =
      await Product.find(
        filter
      )
        .populate("category")
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

    return res.json({
      success: true,
      total,
      page: currentPage,
      totalPages:
        Math.ceil(
          total / limit
        ),
      products,
    });
  } catch (error) {
    console.error(
      "GET PRODUCTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get products",
    });
  }
};

// ==================================================
// GET SINGLE PRODUCT BY SLUG
// GET /api/products/:slug
// ==================================================

export const getSingleProduct =
  async (req, res) => {
    try {
      const product =
        await Product.findOne({
          slug: req.params.slug,
        }).populate(
          "category"
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product Not Found",
        });
      }

      return res.json({
        success: true,
        product,
      });
    } catch (error) {
      console.error(
        "GET PRODUCT BY SLUG ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to get product",
      });
    }
  };

// ==================================================
// GET SINGLE PRODUCT BY ID
// GET /api/products/id/:id
// ==================================================

export const getSingleProductById =
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        ).populate(
          "category"
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product Not Found",
        });
      }

      return res.json({
        success: true,
        product,
      });
    } catch (error) {
      console.error(
        "GET PRODUCT BY ID ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to get product",
      });
    }
  };

// ==================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ==================================================
// ==================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ==================================================

export const updateProduct = async (req, res) => {
  try {
    // ----------------------------------------------
    // FIND PRODUCT
    // ----------------------------------------------

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    // ----------------------------------------------
    // CATEGORY VALIDATION
    // ----------------------------------------------

    if (req.body.category) {
      const categoryExists = await Category.findById(
        req.body.category
      );

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // ----------------------------------------------
    // UPDATE DATA
    // ----------------------------------------------

    const data = {};

    // ----------------------------------------------
    // NAME
    // ----------------------------------------------

    if (req.body.name !== undefined) {
      const name = String(req.body.name).trim();

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Product name is required",
        });
      }

      data.name = name;

      data.slug = slugify(name, {
        lower: true,
        strict: true,
      });
    }

    // ----------------------------------------------
    // CATEGORY
    // ----------------------------------------------

    if (req.body.category !== undefined) {
      data.category = req.body.category;
    }

    // ----------------------------------------------
    // BRAND
    // ----------------------------------------------

    if (req.body.brand !== undefined) {
      const brand = String(req.body.brand).trim();

      if (!brand) {
        return res.status(400).json({
          success: false,
          message: "Brand is required",
        });
      }

      data.brand = brand;
    }

    // ----------------------------------------------
    // DESCRIPTION
    // ----------------------------------------------

    if (req.body.description !== undefined) {
      data.description = req.body.description;
    }

    // ----------------------------------------------
    // PRICE
    // ----------------------------------------------

    if (
      req.body.price !== undefined &&
      req.body.price !== ""
    ) {
      const price = Number(req.body.price);

      if (Number.isNaN(price)) {
        return res.status(400).json({
          success: false,
          message: "Invalid price",
        });
      }

      data.price = price;
    }

    // ----------------------------------------------
    // MRP
    // ----------------------------------------------

    if (
      req.body.mrp !== undefined &&
      req.body.mrp !== ""
    ) {
      const mrp = Number(req.body.mrp);

      if (Number.isNaN(mrp)) {
        return res.status(400).json({
          success: false,
          message: "Invalid MRP",
        });
      }

      data.mrp = mrp;
    }

    // ----------------------------------------------
    // STOCK
    // ----------------------------------------------

    if (
      req.body.stock !== undefined &&
      req.body.stock !== ""
    ) {
      const stock = Number(req.body.stock);

      if (Number.isNaN(stock)) {
        return res.status(400).json({
          success: false,
          message: "Invalid stock",
        });
      }

      data.stock = stock;
    }

    // ----------------------------------------------
    // COLORS
    // ----------------------------------------------

    if (req.body.colors !== undefined) {
      data.colors = parseJSON(
        req.body.colors,
        []
      );
    }

    // ----------------------------------------------
    // HIGHLIGHTS
    // ----------------------------------------------

    if (req.body.highlights !== undefined) {
      data.highlights = parseJSON(
        req.body.highlights,
        []
      );
    }

    // ----------------------------------------------
    // SPECIFICATIONS
    // ----------------------------------------------

    if (req.body.specifications !== undefined) {
      data.specifications = parseJSON(
        req.body.specifications,
        []
      );
    }

    // ----------------------------------------------
    // STATUS
    // ----------------------------------------------

    if (req.body.status !== undefined) {
      data.status = req.body.status;
    }

    // ----------------------------------------------
    // FEATURED
    // ----------------------------------------------

    if (req.body.featured !== undefined) {
      data.featured =
        req.body.featured === true ||
        req.body.featured === "true";
    }

    // ----------------------------------------------
    // BEST SELLER
    // ----------------------------------------------

    if (req.body.bestSeller !== undefined) {
      data.bestSeller =
        req.body.bestSeller === true ||
        req.body.bestSeller === "true";
    }

    // ----------------------------------------------
    // NEW ARRIVAL
    // ----------------------------------------------

    if (req.body.newArrival !== undefined) {
      data.newArrival =
        req.body.newArrival === true ||
        req.body.newArrival === "true";
    }

    // ----------------------------------------------
    // TRENDING
    // ----------------------------------------------

    if (req.body.trending !== undefined) {
      data.trending =
        req.body.trending === true ||
        req.body.trending === "true";
    }

    // ----------------------------------------------
    // SAME DAY DISPATCH
    // ----------------------------------------------

    if (req.body.sameDayDispatch !== undefined) {
      data.sameDayDispatch =
        req.body.sameDayDispatch === true ||
        req.body.sameDayDispatch === "true";
    }

    // ----------------------------------------------
    // EASY RETURN
    // ----------------------------------------------

    if (req.body.easyReturn !== undefined) {
      data.easyReturn =
        req.body.easyReturn === true ||
        req.body.easyReturn === "true";
    }

    // ==================================================
    // FILES
    //
    // multer upload.fields() gives:
    //
    // req.files = {
    //   images: [...],
    //   video: [...]
    // }
    // ==================================================

    const imageFiles = Array.isArray(req.files?.images)
      ? req.files.images
      : [];

    const videoFiles = Array.isArray(req.files?.video)
      ? req.files.video
      : [];

    console.log("=================================");
    console.log("UPDATE PRODUCT FILES");
    console.log("Images:", imageFiles.length);
    console.log("Videos:", videoFiles.length);
    console.log(
      "Image names:",
      imageFiles.map((file) => file.originalname)
    );
    console.log(
      "Video names:",
      videoFiles.map((file) => file.originalname)
    );
    console.log("=================================");

    // ==================================================
    // UPLOAD NEW IMAGES
    // ==================================================

    const newImageUrls = [];

    for (const file of imageFiles) {
      if (!file.mimetype?.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message:
            "Only image files are allowed in images field",
        });
      }

      const result = await uploadToCloudinary(
        file.buffer,
        file.mimetype
      );

      newImageUrls.push(result.secure_url);
    }

    // ==================================================
    // ADD NEW IMAGES TO EXISTING IMAGES
    // ==================================================

    if (newImageUrls.length > 0) {
      data.images = [
        ...(product.images || []),
        ...newImageUrls,
      ];
    }

    // ==================================================
    // UPLOAD NEW VIDEO
    // ==================================================

    let newVideoUrl = "";

    if (videoFiles.length > 0) {
      const videoFile = videoFiles[0];

      if (!videoFile.mimetype?.startsWith("video/")) {
        return res.status(400).json({
          success: false,
          message:
            "Only video files are allowed in video field",
        });
      }

      console.log(
        "Uploading video:",
        videoFile.originalname
      );

      const result = await uploadToCloudinary(
        videoFile.buffer,
        videoFile.mimetype
      );

      newVideoUrl = result.secure_url;

      console.log(
        "Video uploaded:",
        newVideoUrl
      );
    }

    // ==================================================
    // REPLACE OLD VIDEO
    // ==================================================

    if (newVideoUrl) {
      if (product.video) {
        await deleteFromCloudinary(
          product.video,
          "video"
        );
      }

      data.video = newVideoUrl;
    }

    // ==================================================
    // REMOVE VIDEO
    // ==================================================

    if (req.body.removeVideo === "true") {
      if (product.video) {
        await deleteFromCloudinary(
          product.video,
          "video"
        );
      }

      data.video = "";
    }

    // ==================================================
    // UPDATE DATABASE
    // ==================================================

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: data,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate("category");

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product: updatedProduct,
    });

  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update product",
    });
  }
};
// ==================================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ==================================================

export const deleteProduct =
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product Not Found",
        });
      }

      // ==================================================
      // DELETE ALL IMAGES
      // ==================================================

      if (
        product.images?.length >
        0
      ) {
        for (
          const imageUrl of
            product.images
        ) {
          await deleteFromCloudinary(
            imageUrl,
            "image"
          );
        }
      }

      // ==================================================
      // DELETE VIDEO
      // ==================================================

      if (product.video) {
        await deleteFromCloudinary(
          product.video,
          "video"
        );
      }

      // ==================================================
      // DELETE PRODUCT
      // ==================================================

      await Product.findByIdAndDelete(
        req.params.id
      );

      return res.json({
        success: true,
        message:
          "Product Deleted",
      });
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to delete product",
      });
    }
  };

// ==================================================
// GET BRANDS
// GET /api/products/brands
// ==================================================

export const getBrands =
  async (req, res) => {
    try {
      const brands =
        await Product.aggregate([
          {
            $match: {
              status: "active",
            },
          },
          {
            $group: {
              _id: "$brand",
              count: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ]);

      return res.json({
        success: true,
        brands,
      });
    } catch (error) {
      console.error(
        "GET BRANDS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to get brands",
      });
    }
  };

// ==================================================
// DELETE PRODUCT IMAGE
// DELETE /api/products/:id/image
// ==================================================

export const deleteProductImage =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const { imageUrl } =
        req.body;

      if (!imageUrl) {
        return res.status(400).json({
          success: false,
          message:
            "Image URL is required",
        });
      }

      const product =
        await Product.findById(
          id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      // ==================================================
      // CHECK IMAGE EXISTS
      // ==================================================

      const imageExists =
        (
          product.images ||
          []
        ).includes(imageUrl);

      if (!imageExists) {
        return res.status(404).json({
          success: false,
          message:
            "Image not found in product",
        });
      }

      // ==================================================
      // REMOVE FROM MONGODB
      // ==================================================

      product.images =
        (
          product.images ||
          []
        ).filter(
          (image) =>
            image !==
            imageUrl
        );

      await product.save();

      // ==================================================
      // REMOVE FROM CLOUDINARY
      // ==================================================

      await deleteFromCloudinary(
        imageUrl,
        "image"
      );

      return res.status(200).json({
        success: true,
        message:
          "Image deleted successfully",
        images:
          product.images,
      });
    } catch (error) {
      console.error(
        "DELETE PRODUCT IMAGE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete image",
      });
    }
  };

// ==================================================
// DELETE PRODUCT VIDEO
// DELETE /api/products/:id/video
// ==================================================

export const deleteProductVideo =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const product =
        await Product.findById(
          id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      if (!product.video) {
        return res.status(400).json({
          success: false,
          message:
            "No product video found",
        });
      }

      const oldVideoUrl =
        product.video;

      // ==================================================
      // REMOVE FROM MONGODB
      // ==================================================

      product.video = "";

      await product.save();

      // ==================================================
      // REMOVE FROM CLOUDINARY
      // ==================================================

      await deleteFromCloudinary(
        oldVideoUrl,
        "video"
      );

      return res.status(200).json({
        success: true,
        message:
          "Video deleted successfully",
        video: "",
      });
    } catch (error) {
      console.error(
        "DELETE PRODUCT VIDEO ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete video",
      });
    }
  };
