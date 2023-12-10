import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./productCard.module.css";

const ProductCard = ({ products }) => {
  // Function to generate stars based on the average rating
  const renderStars = (rating) => {
    const stars = [];
    const totalStars = 5; // Total number of stars

    const fullStars = Math.floor(rating); // Get the number of full stars
    const hasHalfStar = rating % 1 !== 0; // Check if there's a half star

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i}>&#9733;</span>); // Full star symbol
    }

    if (hasHalfStar) {
      stars.push(
        <span key='half' style={{ width: "0.5em", overflow: "hidden" }}>
          &#9733;
        </span>
      ); // Half star symbol
    }

    const remainingStars = totalStars - Math.ceil(rating); // Calculate remaining empty stars

    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`}>&#9734;</span>); // Empty star symbol
    }

    return stars;
  };

  const calculateDiscountedPrice = (price, discountPercentage) => {
    return price - (price * discountPercentage) / 100;
  };

  return (
    <>
      {products?.products?.map((product) => (
        <Link
          key={product._id}
          to={`/products/${product._id}`}
          className={styles.link}
        >
          <div className={styles.product}>
            <img src={product.images[0]} alt={product.name} />
            <h3>{product.name}</h3>
            {product.reviewsCount !== 0 && (
              <div className={styles.rating}>
                {renderStars(product.averageRating)}
                <span className={styles.count}>({product.reviewsCount})</span>
              </div>
            )}
            <p className={styles.shortDescription}>
              {product.shortDescription}
            </p>
            {product.discount && product.discount.isActive ? (
              <>
                <p className={styles.price}>
                  <span className={styles.discountedPrice}>
                    $
                    {calculateDiscountedPrice(
                      product.price,
                      product.discount.discountPercentage
                    ).toFixed(2)}
                  </span>{" "}
                  <span className={styles.originalPrice}>
                    ${product.price.toFixed(2)}
                  </span>
                </p>
              </>
            ) : (
              <p className={styles.price}>${product.price.toFixed(2)}</p>
            )}{" "}
          </div>
        </Link>
      ))}
    </>
  );
};

ProductCard.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProductCard;
