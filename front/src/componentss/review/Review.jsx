import { useEffect, useState } from "react";
import ProductReviews from "../product-detail-components/ProductReviews";
import {
  useFetchReviewsQuery,
  usePostReviewMutation,
} from "../../reducers/reviewsApiSlice";
import PropTypes from "prop-types";
import styles from "./review.module.css";

export default function ReviewForm({ id }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [reviewCount, setReviewCount] = useState(0);
  const { data, refetch } = useFetchReviewsQuery(id);
  const [postReview] = usePostReviewMutation();

  useEffect(() => {
    refetch();
  }, [reviewCount, refetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!comment.trim() || rating === 0) {
      console.error("Rating and comment are required!!!!");
      return;
    }

    try {
      await postReview({ id, comment, rating }).unwrap();
      setSuccessMessage("Review submitted successfully!");
      setReviewCount(reviewCount + 1);
    } catch (err) {
      setErrorMessage(err.data.message || "Failed to submit review");
      console.error(err);
    } finally {
      setComment("");
      setRating(0);
    }
  };

  return (
    <div className={styles.container}>
      <ProductReviews reviews={data} refetchReviews={refetch} />
      <form onSubmit={handleSubmit} className={styles.reviewForm}>
        <label htmlFor='comment' aria-label='comment'>
          {" "}
          Comment:{" "}
        </label>
        <textarea
          type='text'
          rows={5}
          cols={50}
          required
          placeholder='Enter your comment'
          name='comment'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <label htmlFor='rating' aria-label='rating'>
          {" "}
          Rating:{" "}
        </label>
        <input
          type='number'
          value={rating}
          min={1}
          max={5}
          onChange={(e) => setRating(parseInt(e.target.value))}
        />
        <button type='submit'>Submit</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

ReviewForm.propTypes = {
  id: PropTypes.string.isRequired,
};
