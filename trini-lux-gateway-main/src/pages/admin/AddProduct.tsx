
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";

interface Category {
  _id: string;
  name: string;
}

interface Specification {
  key: string;
  value: string;
}

const API_URL = "https://trini-international.onrender.com";

const AddProduct = () => {
  const navigate = useNavigate();

  // =========================================================
  // TOKEN
  // =========================================================

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  // =========================================================
  // CATEGORIES
  // =========================================================

  const [categories, setCategories] = useState<Category[]>([]);

  // =========================================================
  // BASIC PRODUCT DETAILS
  // =========================================================

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  // =========================================================
  // MEDIA
  // =========================================================

  const [media, setMedia] = useState<File[]>([]);

  // =========================================================
  // EXTRA DETAILS
  // =========================================================

  const [colors, setColors] = useState<string[]>([""]);

  const [highlights, setHighlights] = useState<string[]>([""]);

  const [specifications, setSpecifications] = useState<
    Specification[]
  >([
    {
      key: "",
      value: "",
    },
  ]);

  // =========================================================
  // LOADING
  // =========================================================

  const [loading, setLoading] = useState(false);

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/categories`
      );

      setCategories(res.data.categories || []);
    } catch (error) {
      console.error(
        "Failed to fetch categories:",
        error
      );
    }
  };

  // =========================================================
  // COLORS
  // =========================================================

  const addColor = () => {
    setColors((prev) => [...prev, ""]);
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

  const removeColor = (index: number) => {
    setColors((prev) => {
      const updated = prev.filter(
        (_, i) => i !== index
      );

      return updated.length ? updated : [""];
    });
  };

  // =========================================================
  // HIGHLIGHTS
  // =========================================================

  const addHighlight = () => {
    setHighlights((prev) => [...prev, ""]);
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

  const removeHighlight = (index: number) => {
    setHighlights((prev) => {
      const updated = prev.filter(
        (_, i) => i !== index
      );

      return updated.length ? updated : [""];
    });
  };

  // =========================================================
  // SPECIFICATIONS
  // =========================================================

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
      const updated = prev.filter(
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

  // =========================================================
  // MEDIA SELECT
  // =========================================================

  const handleMediaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files) {
      setMedia([]);
      return;
    }

    const selectedFiles = Array.from(files);

    // -------------------------------------------------------
    // Separate images and videos
    // -------------------------------------------------------

    const imageFiles = selectedFiles.filter(
      (file) =>
        file.type.startsWith("image/")
    );

    const videoFiles = selectedFiles.filter(
      (file) =>
        file.type.startsWith("video/")
    );

    // -------------------------------------------------------
    // Only one video allowed
    // -------------------------------------------------------

    if (videoFiles.length > 1) {
      alert(
        "Only one product video can be uploaded."
      );

      return;
    }

    // -------------------------------------------------------
    // Maximum 10 images
    // -------------------------------------------------------

    if (imageFiles.length > 10) {
      alert(
        "You can upload maximum 10 product images."
      );

      return;
    }

    // -------------------------------------------------------
    // Final media
    // -------------------------------------------------------

    setMedia([
      ...imageFiles,
      ...videoFiles,
    ]);
  };

  // =========================================================
  // REMOVE MEDIA
  // =========================================================

  const removeMedia = (index: number) => {
    setMedia((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // -------------------------------------------------------
    // TOKEN VALIDATION
    // -------------------------------------------------------

    if (!token) {
      alert(
        "Admin session expired. Please login again."
      );

      navigate({
        to: "/admin/login",
      });

      return;
    }

    // -------------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------------

    if (!name.trim()) {
      alert("Please enter product name");
      return;
    }

    if (!category) {
      alert("Please select category");
      return;
    }

    if (!brand.trim()) {
      alert("Please enter brand");
      return;
    }

    if (!price || Number(price) < 0) {
      alert("Please enter valid price");
      return;
    }

    if (
      !originalPrice ||
      Number(originalPrice) < 0
    ) {
      alert(
        "Please enter valid original price"
      );

      return;
    }

    if (
      Number(price) >
      Number(originalPrice)
    ) {
      alert(
        "Selling price cannot be greater than original price"
      );

      return;
    }

    if (!stock || Number(stock) < 0) {
      alert("Please enter valid stock");
      return;
    }

    if (media.length === 0) {
      alert(
        "Please select at least one image or video"
      );

      return;
    }

    // -------------------------------------------------------
    // CHECK IMAGE
    // -------------------------------------------------------

    const imageFiles = media.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      alert(
        "Please select at least one product image."
      );

      return;
    }

    // -------------------------------------------------------
    // CHECK VIDEO COUNT
    // -------------------------------------------------------

    const videoFiles = media.filter((file) =>
      file.type.startsWith("video/")
    );

    if (videoFiles.length > 1) {
      alert(
        "Only one product video is allowed."
      );

      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // =====================================================
      // BASIC DETAILS
      // =====================================================

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

      formData.append(
        "description",
        description.trim()
      );

      // =====================================================
      // COLORS
      // =====================================================

      const cleanColors = colors
        .map((color) => color.trim())
        .filter(Boolean);

      formData.append(
        "colors",
        JSON.stringify(cleanColors)
      );

      // =====================================================
      // HIGHLIGHTS
      // =====================================================

      const cleanHighlights =
        highlights
          .map((highlight) =>
            highlight.trim()
          )
          .filter(Boolean);

      formData.append(
        "highlights",
        JSON.stringify(cleanHighlights)
      );

      // =====================================================
      // SPECIFICATIONS
      // =====================================================

      const cleanSpecifications =
        specifications
          .map((spec) => ({
            key: spec.key.trim(),
            value: spec.value.trim(),
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

      // =====================================================
      // IMAGES + VIDEO
      //
      // IMPORTANT:
      // Both are sent using "images".
      //
      // Backend controller will detect:
      // image/* -> images[]
      // video/* -> video
      // =====================================================

      media.forEach((file) => {
        formData.append(
          "images",
          file
        );
      });

      // =====================================================
      // DEBUG
      // =====================================================

      console.log(
        "========== PRODUCT SUBMIT =========="
      );

      console.log({
        name,
        category,
        brand,
        price,
        mrp: originalPrice,
        stock,
        description,
        colors: cleanColors,
        highlights: cleanHighlights,
        specifications:
          cleanSpecifications,
      });

      console.log(
        "Images:",
        imageFiles
      );

      console.log(
        "Video:",
        videoFiles[0] || null
      );

      // =====================================================
      // SHOW FORMDATA
      // =====================================================

      for (const [
        key,
        value,
      ] of formData.entries()) {
        console.log(
          key,
          value
        );
      }

      // =====================================================
      // API
      // =====================================================

      const response =
        await axios.post(
          `${API_URL}/api/products`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      // =====================================================
      // SUCCESS
      // =====================================================

      console.log(
        "PRODUCT CREATED:",
        response.data
      );

      alert(
        "Product Added Successfully"
      );

      navigate({
        to: "/admin/products",
      });
    } catch (error: any) {
      console.error(
        "ADD PRODUCT ERROR:",
        error?.response?.data ||
          error
      );

      // -----------------------------------------------------
      // AUTH ERROR
      // -----------------------------------------------------

      if (
        error?.response?.status === 401
      ) {
        alert(
          "Session expired. Please login again."
        );

        localStorage.removeItem(
          "adminToken"
        );

        navigate({
          to: "/admin/login",
        });

        return;
      }

      // -----------------------------------------------------
      // SERVER ERROR
      // -----------------------------------------------------

      alert(
        error?.response?.data?.message ||
          "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">
      <h1 className="mb-8 text-3xl font-bold">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6"
      >
        {/* =================================================
            PRODUCT NAME
        ================================================= */}

        <div>
          <label className="mb-2 block font-medium">
            Product Name
          </label>

          <input
            type="text"
            className="w-full rounded-lg border p-3"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Enter product name"
            required
          />
        </div>

        {/* =================================================
            CATEGORY
        ================================================= */}

        <div>
          <label className="mb-2 block font-medium">
            Category
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            required
          >
            <option value="">
              Select Category
            </option>

            {categories.map((cat) => (
              <option
                key={cat._id}
                value={cat._id}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* =================================================
            BRAND
        ================================================= */}

        <div>
          <label className="mb-2 block font-medium">
            Brand
          </label>

          <input
            type="text"
            className="w-full rounded-lg border p-3"
            value={brand}
            onChange={(e) =>
              setBrand(e.target.value)
            }
            placeholder="Enter brand"
            required
          />
        </div>

        {/* =================================================
            PRICE
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">
              Selling Price
            </label>

            <input
              type="number"
              min="0"
              className="w-full rounded-lg border p-3"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Original Price / MRP
            </label>

            <input
              type="number"
              min="0"
              className="w-full rounded-lg border p-3"
              value={originalPrice}
              onChange={(e) =>
                setOriginalPrice(
                  e.target.value
                )
              }
              required
            />
          </div>
        </div>

        {/* =================================================
            STOCK
        ================================================= */}

        <div>
          <label className="mb-2 block font-medium">
            Stock
          </label>

          <input
            type="number"
            min="0"
            className="w-full rounded-lg border p-3"
            value={stock}
            onChange={(e) =>
              setStock(e.target.value)
            }
            required
          />
        </div>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div>
          <label className="mb-2 block font-medium">
            Description
          </label>

          <textarea
            rows={5}
            className="w-full rounded-lg border p-3"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Enter product description"
          />
        </div>

        {/* =================================================
            COLOURS
        ================================================= */}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="block font-medium">
              Colours
            </label>

            <button
              type="button"
              onClick={addColor}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              + Add Colour
            </button>
          </div>

          {colors.map(
            (color, index) => (
              <div
                key={index}
                className="mb-2 flex gap-2"
              >
                <input
                  className="flex-1 rounded-lg border p-3"
                  value={color}
                  placeholder="Colour Name"
                  onChange={(e) =>
                    updateColor(
                      index,
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    removeColor(index)
                  }
                  className="rounded-lg bg-red-500 px-4 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            )
          )}
        </div>

        {/* =================================================
            HIGHLIGHTS
        ================================================= */}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="block font-medium">
              Highlights
            </label>

            <button
              type="button"
              onClick={
                addHighlight
              }
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              + Add Highlight
            </button>
          </div>

          {highlights.map(
            (item, index) => (
              <div
                key={index}
                className="mb-2 flex gap-2"
              >
                <input
                  className="flex-1 rounded-lg border p-3"
                  value={item}
                  placeholder="Enter highlight"
                  onChange={(e) =>
                    updateHighlight(
                      index,
                      e.target.value
                    )
                  }
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

        {/* =================================================
            SPECIFICATIONS
        ================================================= */}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="block font-medium">
              Specifications
            </label>

            <button
              type="button"
              onClick={
                addSpecification
              }
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              + Add Specification
            </button>
          </div>

          {specifications.map(
            (spec, index) => (
              <div
                key={index}
                className="mb-4 rounded-lg border p-4"
              >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input
                    className="rounded-lg border p-3"
                    placeholder="Key"
                    value={spec.key}
                    onChange={(e) =>
                      updateSpecification(
                        index,
                        "key",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="rounded-lg border p-3"
                    placeholder="Value"
                    value={
                      spec.value
                    }
                    onChange={(e) =>
                      updateSpecification(
                        index,
                        "value",
                        e.target.value
                      )
                    }
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

        {/* =================================================
            PRODUCT MEDIA
        ================================================= */}

        <div className="rounded-xl border p-5">
          <h2 className="mb-2 text-lg font-semibold">
            Product Images & Videos
          </h2>

          <p className="mb-4 text-sm text-gray-500">
            Upload multiple product
            images and one product video.
          </p>

          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={
              handleMediaChange
            }
            className="w-full rounded-lg border p-3"
          />

          {/* =================================================
              SELECTED MEDIA
          ================================================= */}

          {media.length > 0 && (
            <div className="mt-5">
              <p className="mb-3 text-sm font-medium">
                Selected Media (
                {media.length})
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {media.map(
                  (file, index) => {
                    const preview =
                      URL.createObjectURL(
                        file
                      );

                    const isVideo =
                      file.type.startsWith(
                        "video/"
                      );

                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="relative overflow-hidden rounded-xl border bg-gray-50"
                      >
                        {/* REMOVE BUTTON */}

                        <button
                          type="button"
                          onClick={() =>
                            removeMedia(
                              index
                            )
                          }
                          className="absolute right-2 top-2 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow hover:bg-red-600"
                        >
                          ×
                        </button>

                        {/* PREVIEW */}

                        {isVideo ? (
                          <video
                            src={
                              preview
                            }
                            controls
                            preload="metadata"
                            className="h-36 w-full object-cover"
                          />
                        ) : (
                          <img
                            src={
                              preview
                            }
                            alt={
                              file.name
                            }
                            className="h-36 w-full object-cover"
                          />
                        )}

                        <div className="p-2">
                          <p className="truncate text-xs font-medium">
                            {
                              file.name
                            }
                          </p>

                          <p className="text-[11px] text-gray-500">
                            {isVideo
                              ? "Video"
                              : "Image"}
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

        {/* =================================================
            SUBMIT
        ================================================= */}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Uploading..."
            : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
