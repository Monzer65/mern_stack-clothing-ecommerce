import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./productCard.module.css";

const ProductCard = ({ products }) => {
  const renderStars = (rating) => {
    const stars = [];
    const totalStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i}>&#9733;</span>);
    }

    if (hasHalfStar) {
      stars.push(
        <span key='half' style={{ width: "0.5em", overflow: "hidden" }}>
          &#9733;
        </span>
      );
    }

    const remainingStars = totalStars - Math.ceil(rating);

    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`}>&#9734;</span>);
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
