import PropTypes from "prop-types";
import { useState } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./productCarousel.module.css";

const ProductCarousel = ({ productData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // const goToPrevious = () => {
  //   setCurrentImageIndex((prevIndex) =>
  //     prevIndex === 0 ? productData.images.length - 1 : prevIndex - 1
  //   );
  // };

  // const goToNext = () => {
  //   setCurrentImageIndex((prevIndex) =>
  //     prevIndex === productData.images.length - 1 ? 0 : prevIndex + 1
  //   );
  // };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={styles.carouselContainer}>
      {/* <button onClick={goToPrevious} className={styles.carouselButton}>
        <FaChevronLeft />
      </button> */}
      <div className={styles.productImagesContainer}>
        <div className={styles.productImagesCarousel}>
          {productData &&
            productData.images &&
            productData.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product ${index + 1}`}
                className={
                  index === currentImageIndex
                    ? styles.productImageActive
                    : styles.productImage
                }
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
        </div>
        {/* <img
          src={productData.images[currentImageIndex]}
          alt={`Product ${currentImageIndex + 1}`}
          className={styles.mainProductImage}
        /> */}
      </div>
      {/* <button onClick={goToNext} className={styles.carouselButton}>
        <FaChevronRight />
      </button> */}
    </div>
  );
};

ProductCarousel.propTypes = {
  productData: PropTypes.object.isRequired,
};

export default ProductCarousel;
