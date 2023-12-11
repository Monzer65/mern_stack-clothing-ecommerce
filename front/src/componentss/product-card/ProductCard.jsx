import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./productCard.module.css";
import StarsRating from "../starsRating/StarsRating";

const ProductCard = ({ products }) => {
  const calculateDiscountedPrice = (price, discountPercentage) => {
    return price - (price * discountPercentage) / 100;
  };

  return (
    <>
      {products?.map((product) => (
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
                <StarsRating rating={product.averageRating} />
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
  products: PropTypes.arrayOf(PropTypes.object),
};

export default ProductCard;
