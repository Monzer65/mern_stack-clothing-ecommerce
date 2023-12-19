import PropTypes from "prop-types";
import styles from "../../pages/product-detail/productDetail.module.css";
import StarsRating from "../starsRating/StarsRating";
import formatTimeAgo from "../../utils/formatTime";
import {
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} from "../../reducers/reviewsApiSlice";
import { useSelector } from "react-redux";
import { FaPencil, FaTrash } from "react-icons/fa6";
import { useState } from "react";

const borderColorClass = (review) => {
  return review.rating < 2
    ? styles.redBorder
    : review.rating >= 2 && review.rating < 4
    ? styles.orangeBorder
    : review.rating >= 4 && review.rating <= 5
    ? styles.greenBorder
    : "";
};

const ProductReviews = ({ reviews, refetchReviews }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [reviewCount, setReviewCount] = useState(0);
  const token = useSelector((state) => state.auth.token);
  const username = useSelector((state) => state.auth.username);
  const [editReview] = useUpdateReviewMutation();
  const [removeReview] = useDeleteReviewMutation();

  const openEditModal = (review) => {
    console.log(review._id);
    setSelectedReview(review?._id);
    setShowModal(true);
    setComment(review.comment);
    setRating(review.rating);
  };

  const closeEditModal = () => {
    setSelectedReview(null);
    setShowModal(false);
  };

  const handleEditReview = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!comment.trim() || rating === 0) {
      console.error("Rating and comment are required!!!!");
      return;
    }

    try {
      await editReview({ id: selectedReview, comment, rating }).unwrap();
      setSuccessMessage("Review submitted successfully!");
      setReviewCount(reviewCount + 1);
      refetchReviews();
      closeEditModal();
    } catch (err) {
      setErrorMessage(err.data.message || "Failed to submit review");
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    closeEditModal();
  };

  return (
    <>
      <h3 className={styles.reviewsTitle}>Reviews:</h3>
      {reviews?.map((review, index) => (
        <div
          key={index}
          className={`${styles.reviewContainer} ${borderColorClass(review)}`}
        >
          <div className={styles.reviewHeader}>
            <p className={styles.reviewAuthor}>
              User: {review.author?.username}
            </p>
            <p className={styles.reviewDate}>
              {formatTimeAgo(review.createdAt)}
            </p>
            {token && review?.author?.username === username && (
              <div className={styles.actionButtons}>
                <button
                  onClick={() => {
                    openEditModal(review);
                  }}
                >
                  <FaPencil />
                </button>
                <button
                  onClick={async () => {
                    await removeReview(review._id);
                    refetchReviews();
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
          <div className={styles.reviewRating}>
            Rating:
            <StarsRating rating={review.rating} />
          </div>

          <p className={styles.reviewComment}>{review.comment}</p>
        </div>
      ))}

      {showModal && selectedReview && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Review</h2>
              <button onClick={handleCancelEdit}>Cancel</button>
            </div>
            <form onSubmit={handleEditReview}>
              <textarea
                type='text'
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <input
                type='number'
                value={rating}
                min={1}
                max={5}
                onChange={(e) => {
                  setRating(parseInt(e.target.value));
                }}
              />
              <button type='submit'>Save Changes</button>
              {errorMessage && <p>{errorMessage}</p>}
              {successMessage && <p>{successMessage}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

ProductReviews.propTypes = {
  reviews: PropTypes.array,
  refetchReviews: PropTypes.func,
};

export default ProductReviews;
