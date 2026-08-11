import Review from "../models/Review.js";
import Product from "../models/Product.js";

const updateProductRating = async (productId) => {
  const reviews = await Review.find({
    product: productId,
    status: "approved",
  });

  const reviewCount = reviews.length;

  const rating =
    reviewCount === 0
      ? 0
      : reviews.reduce(
          (sum, r) => sum + r.rating,
          0
        ) / reviewCount;

  await Product.findByIdAndUpdate(productId, {
    rating: Number(rating.toFixed(1)),
    reviewCount,
  });
};

export const createReview = async (req, res) => {
  try {
    const {
      productId,
      userName,
      email,
      rating,
      title,
      comment,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = await Review.create({
      product: productId,
      userName,
      email,
      rating,
      title,
      comment,
      status: "pending", // or "approved" if you don't want admin approval
    });

    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: "Review Added",
      review,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getReviews = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = await Review.find({
      product: product._id,
      status: "approved",
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      total: reviews.length,
      reviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const likeReview = async (req, res) => {
  try {
    const review =
      await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.helpful += 1;

    await review.save();

    res.json({
      success: true,
      helpful: review.helpful,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Admin - Get All Reviews

// Get All Reviews (Admin)

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("product", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



// Approve Review

export const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.status = "approved";

    await review.save();

    await updateProductRating(review.product);

    res.json({
      success: true,
      message: "Review Approved",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};




// Reject Review

export const rejectReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.status = "rejected";

    await review.save();

    await updateProductRating(review.product);

    res.json({
      success: true,
      message: "Review Rejected",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// export const deleteReview = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id);

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         message: "Review not found",
//       });
//     }

//     const productId = review.product;

//     await review.deleteOne();

//     await updateProductRating(productId);

//     res.json({
//       success: true,
//       message: "Review Deleted",
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };