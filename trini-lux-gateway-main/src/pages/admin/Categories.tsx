import { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState("");
const [editName, setEditName] = useState("");
const [image, setImage] = useState<File | null>(null);
const [editImage, setEditImage] = useState<File | null>(null);
  const token =
  typeof window !== "undefined"
    ? localStorage.getItem("adminToken")
    : null;

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://trini-international.onrender.com/api/categories"
      );

      setCategories(res.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (image) {
  formData.append("image", image);
}

    if (!name) return;

    try {
      await axios.post(
  "https://trini-international.onrender.com/api/categories",
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }
);
setImage(null);

      setName("");

      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  };
const updateCategory = async () => {
  if (!editName) return;

  const formData = new FormData();

  formData.append("name", editName);

  if (editImage) {
    formData.append("image", editImage);
  }

  try {
    await axios.put(
      `https://trini-international.onrender.com/api/categories/${editingId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setEditingId("");
    setEditName("");
    setEditImage(null);

    fetchCategories();
  } catch (error) {
    console.log(error);
  }
};
  const deleteCategory = async (id: string) => {
    try {
      await axios.delete(
        `https://trini-international.onrender.com/api/categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Categories
        </h1>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          className="w-80 rounded-lg border p-3"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setImage(e.target.files?.[0] || null)
  }
  className="rounded-lg border p-2"
/>
        <button
          onClick={createCategory}
          className="rounded-lg bg-black px-6 text-white"
        >
          Add Category
        </button>
      </div>

      <table className="w-full rounded-lg bg-white shadow">
        <thead>
          <tr className="border-b">
  <th className="p-4 text-left">Image</th>
  <th className="p-4 text-left">Name</th>
  <th className="p-4 text-left">Slug</th>
  <th className="p-4 text-center">Action</th>
</tr>
        </thead>

        <tbody>
          {categories.map((item) => (
            <tr key={item._id} className="border-b">

  <td className="p-4">
    {item.image ? (
      <img
        src={item.image}
        alt={item.name}
        className="h-16 w-16 rounded-lg border object-cover"
      />
    ) : (
      <span className="text-gray-400">No Image</span>
    )}
  </td>

  <td className="p-4">
    {editingId === item._id ? (
      <div className="space-y-2">
        <input
          className="w-full rounded border p-2"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setEditImage(e.target.files?.[0] || null)
          }
          className="rounded border p-2"
        />
      </div>
    ) : (
      item.name
    )}
  </td>

  <td className="p-4">{item.slug}</td>

  <td className="space-x-2 p-4 text-center">

    {editingId === item._id ? (
      <>
        <button
          onClick={updateCategory}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Save
        </button>

        <button
          onClick={() => {
            setEditingId("");
            setEditName("");
            setEditImage(null);
          }}
          className="rounded bg-gray-500 px-4 py-2 text-white"
        >
          Cancel
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => {
            setEditingId(item._id);
            setEditName(item.name);
          }}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Edit
        </button>

        <button
          onClick={() => deleteCategory(item._id)}
          className="rounded bg-red-500 px-4 py-2 text-white"
        >
          Delete
        </button>
      </>
    )}

  </td>

</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;