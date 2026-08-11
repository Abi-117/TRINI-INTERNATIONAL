import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

interface Product {
  _id: string;
  name: string;

  category: {
    _id: string;
    name: string;
    slug: string;
  };

  brand: string;
  price: number;
  stock: number;
  images: string[];
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(res.data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Products
        </h1>

        <button
          onClick={() =>
            navigate({
              to: "/admin/add-product",
            })
          }
          className="rounded-lg bg-black px-5 py-3 text-white"
        >
          Add Product
        </button>
      </div>

      {/* Table */}

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full">
          <thead className="border-b bg-gray-100">
            <tr>
              <th className="p-4 text-left">
                Image
              </th>

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Category
              </th>

              <th className="p-4 text-left">
                Brand
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Stock
              </th>

              <th className="p-4 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b"
              >
                {/* Image */}

                <td className="p-4">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="h-16 w-16 rounded object-cover"
                  />
                </td>

                {/* Product */}

                <td className="p-4">
                  {product.name}
                </td>

                {/* Category */}

                <td className="p-4">
                  {product.category?.name || "N/A"}
                </td>

                {/* Brand */}

                <td className="p-4">
                  {product.brand}
                </td>

                {/* Price */}

                <td className="p-4">
                  ₹{product.price}
                </td>

                {/* Stock */}

                <td className="p-4">
                  {product.stock}
                </td>

                {/* Actions */}

                <td className="space-x-2 p-4 text-center">

                  {/* EDIT */}

                 <button
  onClick={() =>
    navigate({
      to: "/admin/products/edit/$id",
      params: {
        id: product._id,
      },
    })
  }
  className="rounded bg-blue-500 px-3 py-2 text-white"
>
  Edit
</button>
                  {/* DELETE */}

                  <button
                    onClick={() =>
                      deleteProduct(product._id)
                    }
                    className="rounded bg-red-500 px-3 py-2 text-white"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-gray-500"
                >
                  No Products Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;