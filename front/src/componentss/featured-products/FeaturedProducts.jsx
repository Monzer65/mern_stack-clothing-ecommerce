import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styles from "./featuredProducts.module.css";
import { Link } from "react-router-dom";
import { MdOutlineDiscount } from "react-icons/md";

const FeaturedProducts = ({ products }) => {
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    if (products) {
      const filteredProducts = products
        .map((product) => ({
          ...product,
          finalPrice: (
            (product.price * (100 - product.discount.discountPercentage)) /
            100
          ).toFixed(2),
        }))
        .filter((product) => product.discount.discountPercentage);

      setProductsData(filteredProducts);
    }
  }, [products]);

  return (
    <div className={styles.featuredProductsContainer}>
      <h1 className={styles.featuredProductsTitle}>
        <span>Discounted Deals </span>
        <span>
          <MdOutlineDiscount />
        </span>
      </h1>
      <div className={styles.productsGrid}>
        {productsData?.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className={styles.link}
          >
            <div key={product._id} className={styles.featuredProductCard}>
              <img
                src={product.images[0]}
                alt={product.name}
                className={styles.productImage}
              />
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDiscount}>
                  {product.discount.discountPercentage}% off
                </p>
                <p
                  className={styles.originalPrice}
                  style={{ textDecoration: "line-through" }}
                >
                  ${product.price}
                </p>
                <p className={styles.finalPrice}>${product.finalPrice}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

FeaturedProducts.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
};

export default FeaturedProducts;
