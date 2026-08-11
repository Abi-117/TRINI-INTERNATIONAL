import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getAllReviews,
  approveReview,
  rejectReview,
} from "@/services/review.service";

const Reviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") || ""
      : "";

  const loadReviews = async () => {
    try {
      const res = await getAllReviews(token);
      setReviews(res.reviews);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const approve = async (id: string) => {
  try {
    await approveReview(id, token);

    toast.success("Review Approved");

    setReviews((prev) =>
      prev.map((review) =>
        review._id === id
          ? { ...review, status: "approved" }
          : review
      )
    );
  } catch (err) {
    toast.error("Approval failed");
  }
};

  const reject = async (id: string) => {
  try {
    await rejectReview(id, token);

    toast.success("Review Rejected");

    setReviews((prev) =>
      prev.map((review) =>
        review._id === id
          ? { ...review, status: "rejected" }
          : review
      )
    );
  } catch (err) {
    toast.error("Reject failed");
  }
};

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">

      <h1 className="mb-8 text-3xl font-bold">
        Customer Reviews
      </h1>

      <div className="overflow-auto rounded-xl border">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4">Product</th>

              <th className="p-4">Customer</th>

              <th className="p-4">Rating</th>

              <th className="p-4">Comment</th>

              <th className="p-4">Status</th>

              <th className="p-4">Action</th>

            </tr>

          </thead>

          <tbody>

            {reviews.map((review) => (

              <tr key={review._id} className="border-t">

                <td className="p-4">
                  {review.product?.name}
                </td>

                <td className="p-4">
                  <div>{review.userName}</div>
                  <div className="text-sm text-gray-500">
                    {review.email}
                  </div>
                </td>

                <td className="p-4">
                  ⭐ {review.rating}
                </td>

                <td className="p-4">
                  {review.comment}
                </td>

                <td className="p-4 capitalize">
                  {review.status}
                </td>
<td className="p-4 capitalize">
  <span
    className={`rounded px-3 py-1 text-white ${
      review.status === "approved"
        ? "bg-green-600"
        : review.status === "rejected"
        ? "bg-red-600"
        : "bg-yellow-500"
    }`}
  >
    {review.status}
  </span>
</td>

<td className="space-x-2 p-4">
  <button
    disabled={review.status === "approved"}
    onClick={() => approve(review._id)}
    className="rounded bg-green-600 px-3 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
  >
    Approve
  </button>

  <button
    disabled={review.status === "rejected"}
    onClick={() => reject(review._id)}
    className="rounded bg-red-600 px-3 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
  >
    Reject
  </button>
</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Reviews;