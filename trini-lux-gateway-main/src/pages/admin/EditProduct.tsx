
import { useEffect, useState } from "react";
import axios from "axios";
import {
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { toast } from "sonner";

// ============================================================
// TYPES
// ============================================================

interface Category {
  _id: string;
  name: string;
}

interface Specification {
  key: string;
  value: string;
  _id?: string;
}

interface Product {
  _id: string;
  name: string;

  category:
    | {
        _id: string;
        name?: string;
        slug?: string;
      }
    | string;

  brand: string;

  price: number;
  mrp?: number;
  stock: number;

  description?: string;

  colors?: string[];
  highlights?: string[];
  specifications?: Specification[];

  images?: string[];

  video?: string;
}

// ============================================================
// API
// ============================================================

const API =
  "https://trini-international.onrender.com/api/products";

const CATEGORY_API =
  "https://trini-international.onrender.com/api/categories";

// ============================================================
// MEDIA DETECTION
// ============================================================

const isVideo = (url: string): boolean => {
  if (!url) return false;

  const lowerUrl = url.toLowerCase();

  // ----------------------------------------------------------
  // Cloudinary video URLs
  // Example:
  // /video/upload/...
  // ----------------------------------------------------------

  if (
    lowerUrl.includes("/video/upload/") ||
    lowerUrl.includes("resource_type=video") ||
    lowerUrl.includes("/video/")
  ) {
    return true;
  }

  // ----------------------------------------------------------
  // Common video extensions
  // ----------------------------------------------------------

  const videoExtensions = [
    ".mp4",
    ".webm",
    ".mov",
    ".avi",
    ".m4v",
    ".mpeg",
    ".mpg",
    ".ogv",
    ".3gp",
  ];

  return videoExtensions.some((extension) =>
    lowerUrl.includes(extension)
  );
};

// ============================================================
// COMPONENT
// ============================================================

const EditProduct = () => {
  const navigate = useNavigate();

  const { id } = useParams({
    from: "/admin/products/edit/$id",
  });

  // ==========================================================
  // TOKEN
  // ==========================================================

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  // ==========================================================
  // STATES
  // ==========================================================

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // ----------------------------------------------------------
  // BASIC DETAILS
  // ----------------------------------------------------------

  const [name, setName] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [brand, setBrand] =
    useState("");

  // ----------------------------------------------------------
  // PRICE
  // ----------------------------------------------------------

  const [price, setPrice] =
    useState("");

  const [originalPrice, setOriginalPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  // ----------------------------------------------------------
  // DESCRIPTION
  // ----------------------------------------------------------

  const [description, setDescription] =
    useState("");

  // ----------------------------------------------------------
  // COLORS
  // ----------------------------------------------------------

  const [colors, setColors] =
    useState<string[]>([""]);

  // ----------------------------------------------------------
  // HIGHLIGHTS
  // ----------------------------------------------------------

  const [highlights, setHighlights] =
    useState<string[]>([""]);

  // ----------------------------------------------------------
  // SPECIFICATIONS
  // ----------------------------------------------------------

  const [specifications, setSpecifications] =
    useState<Specification[]>([
      {
        key: "",
        value: "",
      },
    ]);

  // ----------------------------------------------------------
  // EXISTING MEDIA
  // ----------------------------------------------------------

  const [existingImages, setExistingImages] =
    useState<string[]>([]);

  // ----------------------------------------------------------
  // NEW MEDIA
  // ----------------------------------------------------------

  const [newImages, setNewImages] =
    useState<File[]>([]);

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    fetchCategories();
    fetchProduct();
  }, [id]);

  // ==========================================================
  // FETCH CATEGORIES
  // ==========================================================

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        CATEGORY_API
      );

      setCategories(
        response.data?.categories || []
      );
    } catch (error: any) {
      console.error(
        "FETCH CATEGORIES ERROR:",
        error?.response?.data || error
      );

      toast.error(
        "Failed to load categories"
      );
    }
  };

  // ==========================================================
  // FETCH PRODUCT
  // ==========================================================

  const fetchProduct = async () => {
    if (!id) {
      toast.error(
        "Product ID is missing"
      );

      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${API}/id/${id}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        }
      );

      const product: Product =
        response.data?.product;

      if (!product) {
        toast.error(
          "Product not found"
        );

        return;
      }

      // ======================================================
      // BASIC DETAILS
      // ======================================================

      setName(product.name || "");

      if (
        typeof product.category ===
          "object" &&
        product.category !== null
      ) {
        setCategory(
          product.category._id || ""
        );
      } else {
        setCategory(
          product.category || ""
        );
      }

      setBrand(product.brand || "");

      // ======================================================
      // PRICE
      // ======================================================

      setPrice(
        product.price !== undefined
          ? String(product.price)
          : ""
      );

      setOriginalPrice(
        product.mrp !== undefined
          ? String(product.mrp)
          : ""
      );

      setStock(
        product.stock !== undefined
          ? String(product.stock)
          : ""
      );

      // ======================================================
      // DESCRIPTION
      // ======================================================

      setDescription(
        product.description || ""
      );

      // ======================================================
      // COLORS
      // ======================================================

      setColors(
        product.colors &&
          product.colors.length > 0
          ? product.colors.map((color) =>
              typeof color === "string"
                ? color
                : String(color)
            )
          : [""]
      );

      // ======================================================
      // HIGHLIGHTS
      // ======================================================

      setHighlights(
        product.highlights &&
          product.highlights.length > 0
          ? product.highlights.map(
              (highlight) =>
                typeof highlight === "string"
                  ? highlight
                  : String(highlight)
            )
          : [""]
      );

      // ======================================================
      // SPECIFICATIONS
      // ======================================================

      if (
        product.specifications &&
        product.specifications.length > 0
      ) {
        setSpecifications(
          product.specifications.map(
            (spec) => ({
              key:
                typeof spec.key === "string"
                  ? spec.key
                  : String(spec.key || ""),

              value:
                typeof spec.value === "string"
                  ? spec.value
                  : String(
                      spec.value || ""
                    ),

              _id: spec._id,
            })
          )
        );
      } else {
        setSpecifications([
          {
            key: "",
            value: "",
          },
        ]);
      }

      // ======================================================
      // EXISTING MEDIA
      // ======================================================

      const media =
        Array.isArray(product.images)
          ? product.images.filter(
              (item): item is string =>
                typeof item === "string" &&
                item.trim() !== ""
            )
          : [];

      console.log(
        "EXISTING PRODUCT MEDIA:",
        media
      );

      media.forEach((url) => {
        console.log({
          url,
          isVideo: isVideo(url),
        });
      });

      setExistingImages(media);
    } catch (error: any) {
      console.error(
        "FETCH PRODUCT ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // COLORS
  // ==========================================================

  const addColor = () => {
    setColors((prev) => [
      ...prev,
      "",
    ]);
  };

  const updateColor = (
    index: number,
    value: string
  ) => {
    setColors((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });
  };

  const removeColor = (
    index: number
  ) => {
    setColors((prev) => {
      const updated =
        prev.filter(
          (_, i) => i !== index
        );

      return updated.length
        ? updated
        : [""];
    });
  };

  // ==========================================================
  // HIGHLIGHTS
  // ==========================================================

  const addHighlight = () => {
    setHighlights((prev) => [
      ...prev,
      "",
    ]);
  };

  const updateHighlight = (
    index: number,
    value: string
  ) => {
    setHighlights((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });
  };

  const removeHighlight = (
    index: number
  ) => {
    setHighlights((prev) => {
      const updated =
        prev.filter(
          (_, i) => i !== index
        );

      return updated.length
        ? updated
        : [""];
    });
  };

  // ==========================================================
  // SPECIFICATIONS
  // ==========================================================

  const addSpecification = () => {
    setSpecifications((prev) => [
      ...prev,
      {
        key: "",
        value: "",
      },
    ]);
  };

  const updateSpecification = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    setSpecifications((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  const removeSpecification = (
    index: number
  ) => {
    setSpecifications((prev) => {
      const updated =
        prev.filter(
          (_, i) => i !== index
        );

      return updated.length
        ? updated
        : [
            {
              key: "",
              value: "",
            },
          ];
    });
  };

  // ==========================================================
  // NEW MEDIA SELECT
  // ==========================================================

  const handleNewMediaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files) {
      setNewImages([]);
      return;
    }

    setNewImages(
      Array.from(files)
    );
  };

  // ==========================================================
  // DELETE EXISTING MEDIA
  // ==========================================================

  const deleteExistingImage = async (
    imageUrl: string,
    index: number
  ) => {
    if (!id) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this media?"
      );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API}/${id}/image`,
        {
          data: {
            imageUrl,
          },

          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        }
      );

      setExistingImages(
        (prev) =>
          prev.filter(
            (_, i) => i !== index
          )
      );

      toast.success(
        isVideo(imageUrl)
          ? "Video deleted successfully"
          : "Image deleted successfully"
      );
    } catch (error: any) {
      console.error(
        "DELETE MEDIA ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete media"
      );
    }
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!id) {
      toast.error(
        "Product ID is missing"
      );

      return;
    }

    // ======================================================
    // VALIDATION
    // ======================================================

    if (!name.trim()) {
      toast.error(
        "Product name is required"
      );

      return;
    }

    if (!category) {
      toast.error(
        "Please select a category"
      );

      return;
    }

    if (!brand.trim()) {
      toast.error(
        "Brand is required"
      );

      return;
    }

    if (
      price === "" ||
      Number(price) < 0
    ) {
      toast.error(
        "Valid price is required"
      );

      return;
    }

    if (
      originalPrice === "" ||
      Number(originalPrice) < 0
    ) {
      toast.error(
        "Valid original price is required"
      );

      return;
    }

    if (
      Number(price) >
      Number(originalPrice)
    ) {
      toast.error(
        "Selling price cannot be greater than original price"
      );

      return;
    }

    if (
      stock === "" ||
      Number(stock) < 0
    ) {
      toast.error(
        "Valid stock is required"
      );

      return;
    }

    try {
      setSaving(true);

      const formData =
        new FormData();

      // ======================================================
      // BASIC DETAILS
      // ======================================================

      formData.append(
        "name",
        name.trim()
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "brand",
        brand.trim()
      );

      // ======================================================
      // PRICE
      // ======================================================

      formData.append(
        "price",
        price
      );

      formData.append(
        "mrp",
        originalPrice
      );

      formData.append(
        "stock",
        stock
      );

      // ======================================================
      // DESCRIPTION
      // ======================================================

      formData.append(
        "description",
        description.trim()
      );

      // ======================================================
      // COLORS
      // ======================================================

      const cleanColors =
        colors
          .map((color) =>
            color.trim()
          )
          .filter(Boolean);

      formData.append(
        "colors",
        JSON.stringify(
          cleanColors
        )
      );

      // ======================================================
      // HIGHLIGHTS
      // ======================================================

      const cleanHighlights =
        highlights
          .map((highlight) =>
            highlight.trim()
          )
          .filter(Boolean);

      formData.append(
        "highlights",
        JSON.stringify(
          cleanHighlights
        )
      );

      // ======================================================
      // SPECIFICATIONS
      // ======================================================

      const cleanSpecifications =
        specifications
          .map((spec) => ({
            key:
              typeof spec.key ===
              "string"
                ? spec.key.trim()
                : "",

            value:
              typeof spec.value ===
              "string"
                ? spec.value.trim()
                : "",
          }))
          .filter(
            (spec) =>
              spec.key !== "" ||
              spec.value !== ""
          );

      formData.append(
        "specifications",
        JSON.stringify(
          cleanSpecifications
        )
      );

      // ======================================================
      // NEW IMAGES + VIDEOS
      // ======================================================


newImages.forEach((file) => {
  if (file.type.startsWith("video/")) {
    formData.append("video", file);
  } else {
    formData.append("images", file);
  }
});


      // ======================================================
      // DEBUG
      // ======================================================

      console.log(
        "UPDATING PRODUCT:",
        {
          id,
          name,
          category,
          brand,
          price,
          mrp: originalPrice,
          stock,
          colors: cleanColors,
          highlights:
            cleanHighlights,
          specifications:
            cleanSpecifications,
          newMedia: newImages.map(
            (file) => ({
              name: file.name,
              type: file.type,
              size: file.size,
            })
          ),
        }
      );

      // ======================================================
      // API
      // ======================================================

      const response =
        await axios.put(
          `${API}/${id}`,
          formData,
          {
            headers: {
              ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {}),
            },
          }
        );

      console.log(
        "PRODUCT UPDATED:",
        response.data
      );

      toast.success(
        "Product updated successfully"
      );

      navigate({
        to: "/admin/products",
      });
    } catch (error: any) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        error?.response?.data ||
          error
      );

      if (
        error?.response?.status ===
        401
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        toast.error(
          "Session expired. Please login again."
        );

        navigate({
          to: "/admin/login",
        });

        return;
      }

      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-lg font-medium text-gray-600">
          Loading Product...
        </p>
      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Edit Product
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Update your product details
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/admin/products",
              })
            }
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
          >
            Back
          </button>
        </div>

        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ==================================================
              BASIC INFORMATION
          ================================================== */}

          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h2>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Product Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-black"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-black"
                  required
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map(
                    (cat) => (
                      <option
                        key={cat._id}
                        value={cat._id}
                      >
                        {cat.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* BRAND */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Brand
                </label>

                <input
                  type="text"
                  value={brand}
                  onChange={(e) =>
                    setBrand(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                  placeholder="Enter brand"
                  required
                />
              </div>
            </div>
          </div>

          {/* ==================================================
              PRICE & STOCK
          ================================================== */}

          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Price & Stock
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Selling Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Original Price / MRP
                </label>

                <input
                  type="number"
                  min="0"
                  value={originalPrice}
                  onChange={(e) =>
                    setOriginalPrice(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) =>
                    setStock(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows={6}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
              placeholder="Enter product description"
            />
          </div>

          {/* ==================================================
              COLOURS
          ================================================== */}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Colours
              </h2>

              <button
                type="button"
                onClick={addColor}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add Colour
              </button>
            </div>

            {colors.map(
              (color, index) => (
                <div
                  key={index}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={color}
                    onChange={(e) =>
                      updateColor(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="Colour name"
                    className="flex-1 rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeColor(
                        index
                      )
                    }
                    className="rounded-lg bg-red-500 px-4 text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>

          {/* ==================================================
              HIGHLIGHTS
          ================================================== */}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Highlights
              </h2>

              <button
                type="button"
                onClick={addHighlight}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add Highlight
              </button>
            </div>

            {highlights.map(
              (highlight, index) => (
                <div
                  key={index}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) =>
                      updateHighlight(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="Enter highlight"
                    className="flex-1 rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeHighlight(
                        index
                      )
                    }
                    className="rounded-lg bg-red-500 px-4 text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>

          {/* ==================================================
              SPECIFICATIONS
          ================================================== */}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Specifications
              </h2>

              <button
                type="button"
                onClick={addSpecification}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add Specification
              </button>
            </div>

            {specifications.map(
              (spec, index) => (
                <div
                  key={
                    spec._id ||
                    `spec-${index}`
                  }
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                    <input
                      type="text"
                      value={
                        typeof spec.key ===
                        "string"
                          ? spec.key
                          : ""
                      }
                      onChange={(e) =>
                        updateSpecification(
                          index,
                          "key",
                          e.target.value
                        )
                      }
                      placeholder="Key"
                      className="rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                    />

                    <input
                      type="text"
                      value={
                        typeof spec.value ===
                        "string"
                          ? spec.value
                          : ""
                      }
                      onChange={(e) =>
                        updateSpecification(
                          index,
                          "value",
                          e.target.value
                        )
                      }
                      placeholder="Value"
                      className="rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeSpecification(
                        index
                      )
                    }
                    className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>

          {/* ==================================================
              EXISTING MEDIA
          ================================================== */}

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Existing Media
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Existing product images and videos
              </p>
            </div>

            {existingImages.length >
            0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                {existingImages.map(
                  (
                    media,
                    index
                  ) => {
                    const video =
                      isVideo(
                        media
                      );

                    return (
                      <div
                        key={`${media}-${index}`}
                        className="group relative overflow-hidden rounded-xl border bg-gray-50 shadow-sm"
                      >

                        {/* ====================================
                            MEDIA
                        ==================================== */}

                        {video ? (
                          <video
                            src={media}
                            controls
                            playsInline
                            preload="metadata"
                            className="h-44 w-full bg-black object-contain"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={media}
                            alt={`Product media ${
                              index + 1
                            }`}
                            className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(e) => {
                              console.error(
                                "IMAGE LOAD ERROR:",
                                media
                              );

                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        )}

                        {/* ====================================
                            MEDIA TYPE
                        ==================================== */}

                        <div className="absolute left-2 top-2">
                          <span
                            className={`rounded-md px-2 py-1 text-xs font-semibold text-white ${
                              video
                                ? "bg-purple-600"
                                : "bg-black/70"
                            }`}
                          >
                            {video
                              ? "VIDEO"
                              : "IMAGE"}
                          </span>
                        </div>

                        {/* ====================================
                            DELETE
                        ==================================== */}

                        <button
                          type="button"
                          onClick={() =>
                            deleteExistingImage(
                              media,
                              index
                            )
                          }
                          className="absolute right-2 top-2 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-red-600"
                        >
                          Delete
                        </button>

                        {/* ====================================
                            URL DEBUG / TYPE
                        ==================================== */}

                        <div className="border-t bg-white p-2">
                          <p className="text-xs font-medium text-gray-700">
                            {video
                              ? "Product Video"
                              : "Product Image"}
                          </p>

                          <p
                            className="mt-1 truncate text-[10px] text-gray-400"
                            title={media}
                          >
                            {media}
                          </p>
                        </div>
                      </div>
                    );
                  }
                )}

              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
                No existing media
              </div>
            )}
          </div>

          {/* ==================================================
              ADD NEW MEDIA
          ================================================== */}

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Add New Media
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Upload additional product images and videos
              </p>
            </div>

            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">

              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={
                  handleNewMediaChange
                }
                className="block w-full cursor-pointer text-sm"
              />

              <div className="mt-3 text-sm text-gray-500">
                <p>
                  You can select multiple
                  images and videos.
                </p>

                <p className="mt-1">
                  Supported: JPG, PNG, WEBP,
                  GIF, MP4, WEBM, MOV, AVI
                </p>
              </div>
            </div>

            {/* ================================================
                NEW MEDIA PREVIEW
            ================================================= */}

            {newImages.length >
              0 && (
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">
                  New Media (
                  {newImages.length})
                </p>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                  {newImages.map(
                    (
                      file,
                      index
                    ) => {
                      const video =
                        file.type.startsWith(
                          "video/"
                        );

                      const previewUrl =
                        URL.createObjectURL(
                          file
                        );

                      return (
                        <div
                          key={`${file.name}-${index}`}
                          className="overflow-hidden rounded-xl border bg-gray-50"
                        >

                          {video ? (
                            <video
                              src={
                                previewUrl
                              }
                              controls
                              playsInline
                              className="h-40 w-full bg-black object-contain"
                            />
                          ) : (
                            <img
                              src={
                                previewUrl
                              }
                              alt={
                                file.name
                              }
                              className="h-40 w-full object-cover"
                            />
                          )}

                          <div className="p-3">
                            <p className="truncate text-xs font-medium text-gray-800">
                              {
                                file.name
                              }
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {video
                                ? "Video"
                                : "Image"}
                            </p>

                            <p className="mt-1 text-[11px] text-gray-400">
                              {(
                                file.size /
                                1024 /
                                1024
                              ).toFixed(
                                2
                              )}{" "}
                              MB
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}

                </div>
              </div>
            )}
          </div>

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate({
                  to: "/admin/products",
                })
              }
              disabled={saving}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-8 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Updating..."
                : "Update Product"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;