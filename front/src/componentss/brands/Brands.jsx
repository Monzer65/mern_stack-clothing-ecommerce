import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./brands.module.css";
import { useFetchBrandsQuery } from "../../reducers/productsApiSlice";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const { data } = useFetchBrandsQuery();
  // , isLoading, isError, refetch
  useEffect(() => {
    if (data) {
      setBrands(data);
    }
  }, [data]);

  return (
    <div className={styles.brandsContainer}>
      <h2>Top-notch Brands</h2>
      <div className={styles.carousel}>
        <div className={styles.brandCards}>
          {brands.map((brand, index) => (
            <Link key={index} to={`/products`} className={styles.link}>
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
