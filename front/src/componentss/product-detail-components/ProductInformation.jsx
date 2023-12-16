import styles from "../../pages/product-detail/productDetail.module.css";
import PropTypes from "prop-types";
import StarsRating from "../starsRating/StarsRating";

const calculateDiscountedPrice = (price, discountPercentage) => {
  return price - (price * discountPercentage) / 100;
};

const ProductInformation = ({
  name,
  averageRating,
  reviewsCount,
  brand,
  discount,
  price,
}) => {
  const endDate = new Date(discount?.endDate);
  const formattedDate = endDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <h2>{name}</h2>
      <div className={styles.productRating}>
        <StarsRating rating={averageRating} />{" "}
        <div>
          ({reviewsCount || null}{" "}
          {reviewsCount > 0 ? (reviewsCount > 1 ? "Reviews" : "Review") : ""})
        </div>
      </div>

      <div className={styles.productInfo}>
        <p className={styles.brand}>Brand: {brand?.name}</p>
        {discount && discount.isActive ? (
          <div className={styles.price}>
            <p>
              <span className={styles.discountedPrice}>
                $
                {calculateDiscountedPrice(
                  price,
                  discount.discountPercentage
                ).toFixed(2)}
              </span>{" "}
              <span className={styles.originalPrice}>${price.toFixed(2)}</span>
            </p>
            <p>
              <span className={styles.saveAmount}>
                Save $
                {(
                  price -
                  calculateDiscountedPrice(price, discount.discountPercentage)
                ).toFixed(2)}{" "}
                ({discount?.discountPercentage}% off)
              </span>
              <span className={styles.discountText}>Until {formattedDate}</span>
            </p>
          </div>
        ) : (
          <p className={styles.price}>${price?.toFixed(2)}</p>
        )}{" "}
      </div>
    </>
  );
};

ProductInformation.propTypes = {
  name: PropTypes.string,
  averageRating: PropTypes.number,
  reviewsCount: PropTypes.number,
  brand: PropTypes.object,
  discount: PropTypes.object,
  price: PropTypes.number,
};

export default ProductInformation;
