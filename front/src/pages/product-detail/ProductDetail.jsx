import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchProductDetailQuery } from "../../reducers/productsApiSlice";

import styles from "./productDetail.module.css";
import ProductCarousel from "../../componentss/product-carousel/ProductCarousel";

const ProductDetail = () => {
  const { productId } = useParams();

  const { data, isLoading, isError, refetch } =
    useFetchProductDetailQuery(productId);

  const [productData, setProductData] = useState([]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstImage = currentImageIndex === 0;
    const newIndex = isFirstImage
      ? productData.images.length - 1
      : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentImageIndex === productData.images.length - 1;
    const newIndex = isLastImage ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setProductData(data[0]);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className={styles.productDetailContainer}>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error</p>}
      {productData && (
        <>
          <h2>{productData.name}</h2>
          <p>{productData.longDescription}</p>
          <p>Price: ${productData.price}</p>

          <ProductCarousel productData={productData} />

          <div className={styles.productVariations}>
            {productData?.variations?.map((variation, index) => (
              <div key={index} className={styles.variation}>
                <p>Color: {variation?.color}</p>
                <p>Size: {variation?.size}</p>
                <p>Quantity: {variation?.quantity}</p>
              </div>
            ))}
          </div>
          {/* You can include more details or elements here */}
        </>
      )}
    </div>
  );
};

export default ProductDetail;
