import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Plus, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/admin/coupons")({
  component: Coupons,
});

interface Coupon {
  _id: string;
  code: string;
  description?: string;

  discountType: "percentage" | "fixed";
  discountValue: number;

  minOrderAmount: number;
  maxDiscountAmount?: number | null;

  startDate?: string;
  expiryDate?: string;

  usageLimit?: number | null;
  usedCount: number;

  isActive: boolean;
}

function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minOrderAmount: "0",
    maxDiscountAmount: "",
    expiryDate: "",
    usageLimit: "",
    isActive: true,
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  // --------------------------------------------------
  // FETCH COUPONS
  // --------------------------------------------------

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/coupons"
      );

      setCoupons(res.data.coupons || []);
    } catch (error) {
      console.error("FETCH COUPONS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // --------------------------------------------------
  // RESET FORM
  // --------------------------------------------------

  const resetForm = () => {
    setForm({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "0",
      maxDiscountAmount: "",
      expiryDate: "",
      usageLimit: "",
      isActive: true,
    });

    setEditingId(null);
    setShowForm(false);
  };

  // --------------------------------------------------
  // CREATE / UPDATE COUPON
  // --------------------------------------------------

  const handleSubmit = async () => {
    if (!form.code.trim()) {
      alert("Coupon code is required");
      return;
    }

    if (!form.discountValue) {
      alert("Discount value is required");
      return;
    }

    if (Number(form.discountValue) <= 0) {
      alert("Discount value must be greater than 0");
      return;
    }

    if (!form.expiryDate) {
      alert("Expiry date is required");
      return;
    }

    // Percentage validation
    if (
      form.discountType === "percentage" &&
      Number(form.discountValue) > 100
    ) {
      alert("Percentage discount cannot exceed 100%");
      return;
    }

    try {
      const payload = {
        code: form.code.trim().toUpperCase(),

        description: form.description.trim(),

        discountType: form.discountType,

        discountValue: Number(form.discountValue),

        minOrderAmount: Number(
          form.minOrderAmount || 0
        ),

        maxDiscountAmount:
          form.maxDiscountAmount
            ? Number(form.maxDiscountAmount)
            : null,

        expiryDate: form.expiryDate,

        usageLimit:
          form.usageLimit
            ? Number(form.usageLimit)
            : null,

        isActive: form.isActive,
      };

      console.log("COUPON PAYLOAD:", payload);

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/coupons/${editingId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/coupons",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      alert(
        editingId
          ? "Coupon updated successfully"
          : "Coupon created successfully"
      );

      resetForm();

      await fetchCoupons();
    } catch (error: any) {
      console.error("SAVE COUPON ERROR:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to save coupon"
      );
    }
  };

  // --------------------------------------------------
  // EDIT COUPON
  // --------------------------------------------------

  const editCoupon = (coupon: Coupon) => {
    setEditingId(coupon._id);

    setForm({
      code: coupon.code,

      description: coupon.description || "",

      discountType: coupon.discountType,

      discountValue: String(
        coupon.discountValue
      ),

      minOrderAmount: String(
        coupon.minOrderAmount || 0
      ),

      maxDiscountAmount:
        coupon.maxDiscountAmount != null
          ? String(coupon.maxDiscountAmount)
          : "",

      expiryDate: coupon.expiryDate
        ? coupon.expiryDate.substring(0, 10)
        : "",

      usageLimit:
        coupon.usageLimit != null
          ? String(coupon.usageLimit)
          : "",

      isActive: coupon.isActive,
    });

    setShowForm(true);
  };

  // --------------------------------------------------
  // DELETE COUPON
  // --------------------------------------------------

  const deleteCoupon = async (id: string) => {
    if (!window.confirm("Delete this coupon?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/coupons/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCoupons();

      alert("Coupon deleted successfully");
    } catch (error: any) {
      console.error(
        "DELETE COUPON ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to delete coupon"
      );
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Coupons
          </h1>

          <p className="mt-1 text-gray-500">
            Create and manage discount coupons
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
        >
          <Plus size={18} />
          Create Coupon
        </button>

      </div>

      {/* CREATE / EDIT FORM */}

      {showForm && (
        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-xl font-bold">
              {editingId
                ? "Edit Coupon"
                : "Create Coupon"}
            </h2>

            <button
              onClick={resetForm}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <X size={20} />
            </button>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* CODE */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Coupon Code
              </label>

              <input
                value={form.code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="WELCOME10"
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <input
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="10% off on your order"
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* DISCOUNT TYPE */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Discount Type
              </label>

              <select
                value={form.discountType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discountType:
                      e.target.value as
                        | "percentage"
                        | "fixed",
                  })
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="percentage">
                  Percentage
                </option>

                <option value="fixed">
                  Fixed Amount
                </option>
              </select>
            </div>

            {/* DISCOUNT VALUE */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Discount Value
              </label>

              <input
                type="number"
                min="0"
                value={form.discountValue}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discountValue:
                      e.target.value,
                  })
                }
                placeholder={
                  form.discountType ===
                  "percentage"
                    ? "10"
                    : "500"
                }
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* MINIMUM ORDER */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Minimum Order Amount
              </label>

              <input
                type="number"
                min="0"
                value={form.minOrderAmount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    minOrderAmount:
                      e.target.value,
                  })
                }
                placeholder="1000"
                className="w-full rounded-lg border p-3"
              />

              <p className="mt-1 text-xs text-gray-500">
                Minimum cart value required to use coupon
              </p>
            </div>

            {/* MAX DISCOUNT */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Maximum Discount
              </label>

              <input
                type="number"
                min="0"
                value={form.maxDiscountAmount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxDiscountAmount:
                      e.target.value,
                  })
                }
                placeholder={
                  form.discountType ===
                  "percentage"
                    ? "500"
                    : "Optional"
                }
                className="w-full rounded-lg border p-3"
              />

              <p className="mt-1 text-xs text-gray-500">
                Mainly used for percentage coupons
              </p>
            </div>

            {/* EXPIRY */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Expiry Date
              </label>

              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    expiryDate:
                      e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* USAGE LIMIT */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Usage Limit
              </label>

              <input
                type="number"
                min="0"
                value={form.usageLimit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    usageLimit:
                      e.target.value,
                  })
                }
                placeholder="100"
                className="w-full rounded-lg border p-3"
              />

              <p className="mt-1 text-xs text-gray-500">
                Leave empty for unlimited usage
              </p>
            </div>

          </div>

          {/* ACTIVE */}

          <label className="mt-5 flex items-center gap-2">

            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({
                  ...form,
                  isActive:
                    e.target.checked,
                })
              }
            />

            <span className="text-sm">
              Coupon Active
            </span>

          </label>

          {/* BUTTONS */}

          <div className="mt-6 flex gap-3">

            <button
              onClick={handleSubmit}
              className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
            >
              {editingId
                ? "Update Coupon"
                : "Create Coupon"}
            </button>

            <button
              onClick={resetForm}
              className="rounded-lg bg-gray-200 px-6 py-3 hover:bg-gray-300"
            >
              Cancel
            </button>

          </div>

        </div>
      )}

      {/* COUPON TABLE */}

      <div className="overflow-x-auto rounded-xl bg-white shadow">

        <table className="w-full">

          <thead className="border-b bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Code
              </th>

              <th className="p-4 text-left">
                Discount
              </th>

              <th className="p-4 text-left">
                Min. Order
              </th>

              <th className="p-4 text-left">
                Max Discount
              </th>

              <th className="p-4 text-left">
                Expiry
              </th>

              <th className="p-4 text-left">
                Usage
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {coupons.map((coupon) => (

              <tr
                key={coupon._id}
                className="border-b"
              >

                {/* CODE */}

                <td className="p-4">

                  <div className="font-bold">
                    {coupon.code}
                  </div>

                  <div className="text-xs text-gray-500">
                    {coupon.description}
                  </div>

                </td>

                {/* DISCOUNT */}

                <td className="p-4 font-semibold">

                  {coupon.discountType ===
                  "percentage"
                    ? `${coupon.discountValue}%`
                    : `₹${coupon.discountValue}`}

                </td>

                {/* MIN ORDER */}

                <td className="p-4">
                  ₹{coupon.minOrderAmount}
                </td>

                {/* MAX DISCOUNT */}

                <td className="p-4">

                  {coupon.maxDiscountAmount !=
                  null
                    ? `₹${coupon.maxDiscountAmount}`
                    : "—"}

                </td>

                {/* EXPIRY */}

                <td className="p-4">

                  {coupon.expiryDate
                    ? new Date(
                        coupon.expiryDate
                      ).toLocaleDateString()
                    : "No expiry"}

                </td>

                {/* USAGE */}

                <td className="p-4">

                  {coupon.usedCount}

                  {coupon.usageLimit !=
                  null
                    ? ` / ${coupon.usageLimit}`
                    : " / Unlimited"}

                </td>

                {/* STATUS */}

                <td className="p-4">

                  <span
                    className={
                      coupon.isActive
                        ? "rounded-full bg-green-100 px-3 py-1 text-xs text-green-700"
                        : "rounded-full bg-red-100 px-3 py-1 text-xs text-red-700"
                    }
                  >
                    {coupon.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>

                </td>

                {/* ACTIONS */}

                <td className="space-x-2 p-4 text-center">

                  <button
                    onClick={() =>
                      editCoupon(coupon)
                    }
                    className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() =>
                      deleteCoupon(
                        coupon._id
                      )
                    }
                    className="rounded bg-red-500 p-2 text-white hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>

                </td>

              </tr>

            ))}

            {coupons.length === 0 && (

              <tr>

                <td
                  colSpan={8}
                  className="p-10 text-center text-gray-500"
                >
                  No coupons created yet.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Coupons;