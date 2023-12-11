import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./brands.module.css";

const Brands = ({ products }) => {
  const [brandsData, setBrandsData] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const uniqueBrands = Array.from(
        new Set(products.map((product) => product.brand.name))
      );
      const uniqueBrandsData = uniqueBrands.map((brandName) => {
        const productWithBrand = products.find(
          (product) => product.brand.name === brandName
        );
        return productWithBrand.brand;
      });
      setBrandsData(uniqueBrandsData);
    }
  }, [products]);

  return (
    <div className={styles.brandsContainer}>
      <h2>Top-notch Brands</h2>
      <div className={styles.carousel}>
        <div className={styles.brandCards}>
          {brandsData?.map((brand) => (
            <Link
              key={brand._id}
              to={`/products/${brand._id}`}
              className={styles.link}
            >
              <img src={brand.image} alt={brand.name} />
              <h3>{brand.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

Brands.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
};

export default Brands;
