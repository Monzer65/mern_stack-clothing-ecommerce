import { useEffect, useState } from "react";
import { useFetchProductsQuery } from "../../reducers/productsApiSlice";
import ProductCard from "../product-card/ProductCard";
import styles from "./latestProducts.module.css";

const LatestProducts = () => {
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useFetchProductsQuery();

  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    if (products) {
      setProductsData(products);
    }
  }, [products]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className={styles.latestProducts}>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error</p>}
      <h2>Latest Products</h2>
      <div className={styles.productCards}>
        <ProductCard products={productsData.products} />
      </div>
    </div>
  );
};

export default LatestProducts;
