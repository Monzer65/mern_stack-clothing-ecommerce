import PropTypes from "prop-types";
import styles from "../../pages/product-detail/productDetail.module.css";
import StarsRating from "../starsRating/StarsRating";
import formatTimeAgo from "../../utils/formatTime";

const borderColorClass = (review) => {
  return review.rating < 2
    ? styles.redBorder
    : review.rating >= 2 && review.rating < 4
    ? styles.orangeBorder
    : review.rating >= 4 && review.rating <= 5
    ? styles.greenBorder
    : "";
};

const ProductReviews = ({ reviews }) => {
  return (
    <>
      {reviews?.map((review, index) => (
        <div
          key={index}
          className={`${styles.reviewContainer} ${borderColorClass(review)}`}
        >
          <div className={styles.reviewHeader}>
            <p className={styles.reviewAuthor}>User: {review.author}</p>
            <p className={styles.reviewDate}>
              {formatTimeAgo(review.createdAt)}
            </p>
          </div>
          <div className={styles.reviewRating}>
            Rating:
            <StarsRating rating={review.rating} />
          </div>

          <p className={styles.reviewComment}>{review.comment}</p>
        </div>
      ))}
    </>
  );
};

ProductReviews.propTypes = {
  reviews: PropTypes.array,
};

export default ProductReviews;
